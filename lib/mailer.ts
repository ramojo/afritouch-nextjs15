import nodemailer, { type Transporter } from "nodemailer";

/**
 * Returns a configured nodemailer transport, or null if SMTP env vars are
 * missing. Configure these in .env.local (see .env.example).
 */
let cached: Transporter | null | undefined;

export function getTransport(): Transporter | null {
    if (cached !== undefined) return cached;

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        cached = null;
        return cached;
    }

    const port = Number(process.env.SMTP_PORT ?? 587);
    // Implicit TLS on 465; STARTTLS otherwise. Override with SMTP_SECURE.
    const secure =
        process.env.SMTP_SECURE != null
            ? process.env.SMTP_SECURE === "true"
            : port === 465;

    cached = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });
    return cached;
}

export const QUOTE_TO =
    process.env.QUOTE_TO ?? "info@afritouchcaterers.co.ke";

// Many SMTP servers require the From address to match the authenticated user.
export const QUOTE_FROM =
    process.env.QUOTE_FROM ?? process.env.SMTP_USER ?? QUOTE_TO;
