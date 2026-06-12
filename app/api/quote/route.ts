import { NextRequest, NextResponse } from "next/server";
import { getTransport, QUOTE_TO, QUOTE_FROM } from "@/lib/mailer";

type QuotePayload = {
    name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    packageName?: string;
    guestCount?: string | number;
    eventDate?: string;
    location?: string;
    notes?: string;
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

    const transport = getTransport();
    if (!transport) {
        return NextResponse.json(
            {
                error:
                    "Email service is not configured. Please set SMTP_HOST, SMTP_USER and SMTP_PASS.",
            },
            { status: 503 },
        );
    }

    const pkg = body.packageName?.trim() || "General Inquiry";
    const rows: [string, string][] = [
        ["Name", name],
        ["Email", email],
        ["Phone", phone],
        ["WhatsApp", body.whatsapp?.trim() || "—"],
        ["Package", pkg],
        ["Guest Count", String(body.guestCount ?? "—")],
        ["Event Date", body.eventDate?.trim() || "—"],
        ["Location", body.location?.trim() || "—"],
        ["Notes", body.notes?.trim() || "—"],
    ];

    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    const html = `
        <div style="font-family:system-ui,Arial,sans-serif;color:#1a1a1a">
          <h2 style="margin:0 0 12px">New Quote Request</h2>
          <p style="margin:0 0 16px;color:#555">Package: <strong>${escapeHtml(pkg)}</strong></p>
          <table style="border-collapse:collapse;width:100%;max-width:560px">
            ${rows
                .map(
                    ([k, v]) => `<tr>
              <td style="padding:8px 12px;border:1px solid #eee;background:#faf7f2;font-weight:600;white-space:nowrap">${escapeHtml(k)}</td>
              <td style="padding:8px 12px;border:1px solid #eee">${escapeHtml(v).replace(/\n/g, "<br>")}</td>
            </tr>`,
                )
                .join("")}
          </table>
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
        return NextResponse.json({ ok: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send";
        console.error("Quote email failed:", message);
        return NextResponse.json(
            { error: "Could not send your inquiry. Please try again later." },
            { status: 502 },
        );
    }
}
