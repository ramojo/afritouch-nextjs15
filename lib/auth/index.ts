import { config } from "@/lib/config";
import localAdapter, {
    SESSION_COOKIE,
    makeSessionToken,
    verifySessionToken,
} from "./local";
import clerkAdapter from "./clerk";
import { AuthAdapter, SessionPayload } from "./types";

const adapter: AuthAdapter =
    config.auth.provider === "clerk" ? clerkAdapter : localAdapter;

export const authProvider = adapter.provider;
export const managesUsersExternally = adapter.managesUsersExternally;

export async function getSession(): Promise<SessionPayload | null> {
    return adapter.getSession();
}

export async function requireSession(): Promise<SessionPayload> {
    const s = await adapter.getSession();
    if (!s) throw new Error("Unauthorized");
    return s;
}

export async function requireSuperadmin(): Promise<SessionPayload> {
    const s = await requireSession();
    if (s.role !== "superadmin") throw new Error("Forbidden");
    return s;
}

// Re-exports needed by local-auth code paths (login/logout/proxy).
export { SESSION_COOKIE, makeSessionToken, verifySessionToken };
export type { SessionPayload };
