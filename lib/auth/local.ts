import crypto from "crypto";
import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { Role } from "@/lib/users-types";
import { AuthAdapter, SessionPayload } from "./types";

export const SESSION_COOKIE = "admin_session";

const SECRET = config.auth.secret;

function sign(value: string): string {
    return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

function b64url(s: string): string {
    return Buffer.from(s).toString("base64url");
}

function fromB64url(s: string): string {
    return Buffer.from(s, "base64url").toString();
}

export function makeSessionToken(payload: SessionPayload): string {
    const encoded = b64url(JSON.stringify(payload));
    return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(
    token: string | undefined,
): SessionPayload | null {
    if (!token) return null;
    const i = token.lastIndexOf(".");
    if (i === -1) return null;
    const payload = token.slice(0, i);
    const sig = token.slice(i + 1);
    if (!payload || !sig) return null;
    const expected = sign(payload);
    if (sig.length !== expected.length) return null;
    try {
        if (
            !crypto.timingSafeEqual(
                Buffer.from(sig, "hex"),
                Buffer.from(expected, "hex"),
            )
        ) {
            return null;
        }
    } catch {
        return null;
    }
    try {
        const parsed = JSON.parse(fromB64url(payload)) as Partial<SessionPayload>;
        if (
            typeof parsed?.userId === "string" &&
            (parsed.role === "admin" || parsed.role === "superadmin")
        ) {
            return {
                userId: parsed.userId,
                role: parsed.role as Role,
                username:
                    typeof parsed.username === "string"
                        ? parsed.username
                        : undefined,
            };
        }
    } catch {
        /* fall through */
    }
    return null;
}

const localAdapter: AuthAdapter = {
    provider: "local",
    managesUsersExternally: false,
    async getSession() {
        const c = await cookies();
        const token = c.get(SESSION_COOKIE)?.value;
        return verifySessionToken(token);
    },
};

export default localAdapter;
