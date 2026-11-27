import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// drizzle-kit may preload .env itself, so explicitly apply .env.local last to
// match Next.js precedence and target the database the app actually uses.
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

// Local Postgres usually has no SSL, even when .env sets DATABASE_SSL for a
// hosted database. Decide from the effective URL, not just the flag.
function resolveSsl(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
            return false;
        }
        const mode = parsed.searchParams.get("sslmode");
        if (mode === "require" || mode === "verify-ca" || mode === "verify-full") {
            return true;
        }
    } catch {
        // Fall through to the explicit flag.
    }
    return process.env.DATABASE_SSL === "true";
}

export default {
    schema: "./db/schema.ts",
    out: "./db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        ssl: resolveSsl(process.env.DATABASE_URL),
    },
    strict: true,
    verbose: true,
} satisfies Config;
