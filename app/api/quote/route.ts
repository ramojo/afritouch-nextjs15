import { NextRequest, NextResponse } from "next/server";
import { getTransport, QUOTE_TO, QUOTE_FROM } from "@/lib/mailer";
import { createQuote } from "@/lib/quotes";
import { QuoteInput, QuoteLineItem } from "@/app/types/quote";
import { MenuCategory } from "@/app/types/menu";

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

    // --- Save to database (source of truth) ---
    let savedId: string | undefined;
    try {
        const lineItems: QuoteInput["lineItems"] = (body.lineItems ?? []).map((li) => ({
            itemId: li.itemId ?? null,
            name: li.name,
            category: li.category as MenuCategory,
            custom: li.custom ?? false,
        }));
        const saved = await createQuote({
            kind: body.kind ?? "package",
            packageId: body.packageId ?? null,
            packageName: body.packageName?.trim() ?? null,
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
    } catch (dbErr) {
        console.error("Quote DB save failed:", dbErr);
        // Non-fatal: proceed to email even if DB write fails
    }

    const pkg = body.packageName?.trim() || "Custom Menu";
    const transport = getTransport();

    // --- Email notification ---
    if (!transport) {
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

    const lineItemsForEmail: QuoteLineItem[] = (body.lineItems ?? []).map((li) => ({
        itemId: li.itemId ?? null,
        name: li.name,
        category: li.category as MenuCategory,
        unitPrice: li.unitPrice ?? null,
        custom: li.custom ?? false,
        pendingCosting: li.custom ?? false,
    }));

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
                  ? `KES ${li.unitPrice} × ${guestCount}`
                  : "—";
            rows.push([`  ${li.name}`, price]);
        });
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
        return NextResponse.json({ ok: true, savedId });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send";
        console.error("Quote email failed:", message);
        return NextResponse.json(
            {
                ok: !!savedId,
                savedId,
                warning: "Your inquiry was recorded but the confirmation email could not be sent.",
            },
            { status: savedId ? 200 : 502 },
        );
    }
}
