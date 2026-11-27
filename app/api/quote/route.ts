import { NextRequest, NextResponse } from "next/server";
import { getTransport, QUOTE_TO, QUOTE_FROM } from "@/lib/mailer";
import { createQuote } from "@/lib/quotes";
import { getMenuItem } from "@/lib/menu-items";
import { estimatedQuoteTotal } from "@/lib/menu-catalog";
import { QuoteInput, QuoteLineItem } from "@/app/types/quote";
import { MENU_CATEGORIES, MenuCategory } from "@/app/types/menu";

type QuotePayload = {
    name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    packageName?: string;
    packageId?: string;
    guestCount?: string | number;
    eventDate?: string;
    location?: string;
    notes?: string;
    kind?: "package" | "custom";
    lineItems?: Array<{
        itemId?: string | null;
        name: string;
        category: string;
        unitPrice?: number | null;
        custom?: boolean;
    }>;
};

const escapeHtml = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

/** DB writes are critical, so retry once before declaring the save failed. */
async function persistQuoteWithRetry(input: QuoteInput) {
    let lastError: unknown;
    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            return await createQuote(input);
        } catch (err) {
            lastError = err;
            console.error(`Quote DB save failed (attempt ${attempt}/2):`, err);
            if (attempt < 2) {
                await new Promise((resolve) => setTimeout(resolve, 250));
            }
        }
    }
    throw lastError;
}

function quoteSaveFailedResponse() {
    return NextResponse.json(
        {
            ok: false,
            error: "QUOTE_SAVE_FAILED",
            warning:
                "Your request could not be recorded in the database. Please contact us directly so we can assist you.",
        },
        { status: 500 },
    );
}

export async function POST(req: NextRequest) {
    let body: QuotePayload;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();

    if (!name || !email || !phone) {
        return NextResponse.json(
            { error: "Name, email and phone are required." },
            { status: 400 },
        );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
            { error: "Please provide a valid email address." },
            { status: 400 },
        );
    }

    const guestCount = Number(body.guestCount ?? 0);
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10000) {
        return NextResponse.json(
            { error: "Guest count must be between 1 and 10,000." },
            { status: 400 },
        );
    }
    const kind = body.kind === "custom" ? "custom" : "package";
    const rawLineItems = body.lineItems ?? [];
    if (rawLineItems.length > 100) {
        return NextResponse.json(
            { error: "A menu can contain at most 100 items." },
            { status: 400 },
        );
    }

    // Prices always come from the admin-managed catalog, never from the client.
    // Unknown / ad-hoc dishes are saved with no price and flagged for costing.
    const lineItems: QuoteInput["lineItems"] = [];
    for (const li of rawLineItems) {
        const itemName = li.name?.trim();
        if (!itemName) continue;
        if (!MENU_CATEGORIES.includes(li.category as MenuCategory)) {
            return NextResponse.json(
                { error: `Invalid category for "${itemName}".` },
                { status: 400 },
            );
        }

        let catalogItem = null;
        if (li.itemId) {
            try {
                catalogItem = await getMenuItem(li.itemId);
            } catch (err) {
                console.error("Menu item lookup failed:", err);
            }
        }

        const priced = !!catalogItem && !catalogItem.needsCosting && catalogItem.pricePerPerson > 0;
        lineItems.push({
            itemId: catalogItem?.id ?? null,
            name: catalogItem?.name ?? itemName,
            category: (catalogItem?.category ?? li.category) as MenuCategory,
            custom: !catalogItem,
            unitPrice: priced ? catalogItem!.pricePerPerson : null,
            pendingCosting: !priced,
        });
    }

    // --- Save to database first: this is the durable source of truth. ---
    let savedId: string | undefined;
    let savedTotal: number | null = null;
    let dbFailed = false;
    try {
        const saved = await persistQuoteWithRetry({
            kind,
            packageId: body.packageId ?? null,
            packageName: body.packageName?.trim() || (kind === "custom" ? "Custom Menu" : null),
            name,
            email,
            phone,
            whatsapp: body.whatsapp?.trim() || null,
            guestCount,
            eventDate: body.eventDate?.trim() ?? new Date().toISOString().slice(0, 10),
            location: body.location?.trim() ?? "",
            notes: body.notes?.trim() || null,
            lineItems,
        });
        savedId = saved.id;
        savedTotal = saved.estimatedTotal;
    } catch (dbErr) {
        dbFailed = true;
        console.error("Quote could not be persisted after retry:", dbErr);
    }

    const pkg = body.packageName?.trim() || "Custom Menu";
    const transport = getTransport();

    // --- Email notification (second source of truth) ---
    if (!transport) {
        if (dbFailed) return quoteSaveFailedResponse();
        return NextResponse.json(
            {
                error: "EMAIL_NOT_CONFIGURED",
                message:
                    "Email service is not configured. Please set SMTP_HOST, SMTP_USER and SMTP_PASS.",
                savedId,
            },
            { status: 503 },
        );
    }

    const lineItemsForEmail: QuoteLineItem[] = lineItems.map((li) => ({
        itemId: li.itemId ?? null,
        name: li.name,
        category: li.category,
        unitPrice: li.unitPrice ?? null,
        custom: li.custom ?? false,
        pendingCosting: li.pendingCosting ?? false,
    }));
    const emailTotal =
        savedTotal ?? estimatedQuoteTotal(guestCount, lineItemsForEmail);

    const rows: [string, string][] = [
        ["Name", name],
        ["Email", email],
        ["Phone", phone],
        ["WhatsApp", body.whatsapp?.trim() || "—"],
        ["Package / Menu", pkg],
        ["Guest Count", String(guestCount || "—")],
        ["Event Date", body.eventDate?.trim() || "—"],
        ["Location", body.location?.trim() || "—"],
        ["Notes", body.notes?.trim() || "—"],
    ];

    if (lineItemsForEmail.length > 0) {
        rows.push(["—— Menu Items ——", ""]);
        lineItemsForEmail.forEach((li) => {
            const price = li.pendingCosting
                ? "Awaiting price"
                : li.unitPrice != null
                  ? `KES ${li.unitPrice.toLocaleString("en-KE")} × ${guestCount}`
                  : "—";
            rows.push([`  ${li.name}`, price]);
        });
        rows.push([
            "Estimated total",
            emailTotal != null
                ? `KES ${emailTotal.toLocaleString("en-KE")}`
                : "Awaiting costing",
        ]);
    }

    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    const html = `
        <div style="font-family:system-ui,Arial,sans-serif;color:#1a1a1a">
          <h2 style="margin:0 0 12px">New Quote Request${savedId ? ` <small style="color:#999">#${savedId.slice(0, 8)}</small>` : ""}</h2>
          <p style="margin:0 0 16px;color:#555">Package: <strong>${escapeHtml(pkg)}</strong></p>
          <table style="border-collapse:collapse;width:100%;max-width:560px">
            ${rows
                .map(
                    ([k, v]) =>
                        `<tr>
              <td style="padding:8px 12px;border:1px solid #eee;background:#faf7f2;font-weight:600;white-space:nowrap">${escapeHtml(k)}</td>
              <td style="padding:8px 12px;border:1px solid #eee">${escapeHtml(v).replace(/\n/g, "<br>")}</td>
            </tr>`,
                )
                .join("")}
          </table>
          ${savedId ? `<p style="margin-top:16px;color:#888;font-size:12px">Quote ID: ${savedId}</p>` : ""}
        </div>`;

    try {
        await transport.sendMail({
            from: `"Afritouch Website" <${QUOTE_FROM}>`,
            to: QUOTE_TO,
            replyTo: `"${name}" <${email}>`,
            subject: `Quote Request: ${pkg} — ${name}`,
            text,
            html,
        });

        // The email went out, but without a DB row we haven't met the
        // two-sources-of-truth requirement. Surface that instead of reporting
        // a false success to the customer.
        if (dbFailed) return quoteSaveFailedResponse();
        return NextResponse.json({ ok: true, savedId, emailSent: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send";
        console.error("Quote email failed:", message);
        if (dbFailed) return quoteSaveFailedResponse();
        return NextResponse.json(
            {
                ok: true,
                savedId,
                emailSent: false,
                warning:
                    "Your inquiry was saved, but the notification email could not be sent.",
            },
            { status: 200 },
        );
    }
}
