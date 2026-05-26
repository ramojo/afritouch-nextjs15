import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// drizzle-kit runs outside Next.js, so .env.local isn't auto-loaded.
// Load it (and .env) manually without adding a dotenv dependency.
// for (const file of [".env", ".env.local"]) {
//     const p = resolve(process.cwd(), file);
//     if (!existsSync(p)) continue;
//     for (const raw of readFileSync(p, "utf8").split(/\r?\n/)) {
//         const line = raw.trim();
//         if (!line || line.startsWith("#")) continue;
//         const eq = line.indexOf("=");
//         if (eq === -1) continue;
//         const key = line.slice(0, eq).trim();
//         let val = line.slice(eq + 1).trim();
//         if (
//             (val.startsWith('"') && val.endsWith('"')) ||
//             (val.startsWith("'") && val.endsWith("'"))
//         ) {
//             val = val.slice(1, -1);
//         }
//         if (process.env[key] === undefined) process.env[key] = val;
//     }
// }

dotenv.config();

export default {
    schema: "./db/schema.ts",
    out: "./db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        ssl: process.env.DATABASE_SSL === "true",
    },
    strict: true,
    verbose: true,
} satisfies Config;
