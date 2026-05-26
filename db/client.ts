import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "@/lib/config";
import * as schema from "./schema";

declare global {
    // eslint-disable-next-line no-var
    var __pgPool: Pool | undefined;
}

function makePool(): Pool {
    if (!config.storage.databaseUrl) {
        throw new Error("DATABASE_URL is not set");
    }
    return new Pool({
        connectionString: config.storage.databaseUrl,
        ssl: config.storage.databaseSsl ? { rejectUnauthorized: false } : undefined,
        max: 10,
    });
}

// Reuse the Pool across hot reloads / serverless invocations.
const pool = globalThis.__pgPool ?? makePool();
if (process.env.NODE_ENV !== "production") globalThis.__pgPool = pool;

export const db = drizzle(pool, { schema });
export { schema };
