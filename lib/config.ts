/**
 * Centralised environment-based configuration.
 *
 * Read values via this module instead of process.env directly so the
 * defaults / parsing live in one place.
 */

export type StorageDriver = "file" | "postgres";
export type AuthProvider = "local" | "clerk";

function pick<T extends string>(value: string | undefined, allowed: T[], fallback: T): T {
    if (value && (allowed as string[]).includes(value)) return value as T;
    return fallback;
}

/**
 * Local Postgres servers normally don't accept SSL, while hosted providers
 * (e.g. Neon) do. `.env` can set DATABASE_SSL=true for a hosted URL while
 * `.env.local` overrides DATABASE_URL with a local one, so resolve SSL from
 * the effective URL rather than blindly trusting the flag.
 */
function resolveDatabaseSsl(databaseUrl: string): boolean {
    let host = "";
    let sslMode: string | null = null;
    try {
        const url = new URL(databaseUrl);
        host = url.hostname;
        sslMode = url.searchParams.get("sslmode");
    } catch {
        // Fall through to the explicit flag below.
    }

    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
        return false;
    }
    if (sslMode === "require" || sslMode === "verify-ca" || sslMode === "verify-full") {
        return true;
    }
    return process.env.DATABASE_SSL === "true";
}

const databaseUrl = process.env.DATABASE_URL || "";

export const config = {
    storage: {
        driver: pick<StorageDriver>(
            process.env.STORAGE_DRIVER,
            ["file", "postgres"],
            "file",
        ),
        databaseUrl,
        databaseSsl: resolveDatabaseSsl(databaseUrl),
    },
    auth: {
        provider: pick<AuthProvider>(
            process.env.AUTH_PROVIDER,
            ["local", "clerk"],
            "local",
        ),
        // local
        secret: process.env.ADMIN_SECRET || "change-me-in-production-please",
        bootstrap: {
            username: (process.env.ADMIN_USERNAME || "admin").toLowerCase(),
            password: process.env.ADMIN_PASSWORD || "afritouch-admin",
        },
    },
    site: {
        url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
} as const;

export function isClerk(): boolean {
    return config.auth.provider === "clerk";
}

export function isLocalAuth(): boolean {
    return config.auth.provider === "local";
}

export function isPostgres(): boolean {
    return config.storage.driver === "postgres";
}
