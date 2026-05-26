import crypto from "crypto";
import { Pool } from "pg";
import { config } from "@/lib/config";
import { Package, PackageInput } from "@/app/types/package";
import { Role, User, UserPublic } from "@/lib/users-types";
import { PackageStore, Storage, UserStore } from "./types";

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;

function getPool(): Pool {
    if (!pool) {
        if (!config.storage.databaseUrl) {
            throw new Error(
                "STORAGE_DRIVER=postgres but DATABASE_URL is not set",
            );
        }
        pool = new Pool({
            connectionString: config.storage.databaseUrl,
            ssl: config.storage.databaseSsl
                ? { rejectUnauthorized: false }
                : undefined,
        });
    }
    return pool;
}

async function ensureSchema(): Promise<void> {
    // Schema is owned by drizzle migrations (see db/migrations).
    // Kept as a no-op so call sites don't need to change.
    if (initPromise) return initPromise;
    initPromise = Promise.resolve();
    return initPromise;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizePkg(input: PackageInput): PackageInput {
    return {
        name: input.name?.trim() ?? "",
        price: input.price?.trim() ?? "",
        description: input.description?.trim() ?? "",
        starch: (input.starch ?? []).map((s) => s.trim()).filter(Boolean),
        protein: (input.protein ?? []).map((s) => s.trim()).filter(Boolean),
        vegetables: (input.vegetables ?? []).map((s) => s.trim()).filter(Boolean),
        dessert: (input.dessert ?? []).map((s) => s.trim()).filter(Boolean),
        drinks: (input.drinks ?? []).map((s) => s.trim()).filter(Boolean),
        color: input.color?.trim() || "border-slate-400",
        popular: Boolean(input.popular),
        images: (input.images ?? []).map((s) => s.trim()).filter(Boolean),
    };
}

interface PackageRow {
    id: string;
    name: string;
    price: string;
    description: string;
    starch: string[];
    protein: string[];
    vegetables: string[];
    dessert: string[];
    drinks: string[];
    color: string;
    popular: boolean;
    images: string[];
}

const PACKAGE_COLS =
    "id, name, price, description, starch, protein, vegetables, dessert, drinks, color, popular, images";

function rowToPackage(r: PackageRow): Package {
    return {
        id: r.id,
        name: r.name,
        price: r.price,
        description: r.description,
        starch: r.starch ?? [],
        protein: r.protein ?? [],
        vegetables: r.vegetables ?? [],
        dessert: r.dessert ?? [],
        drinks: r.drinks ?? [],
        color: r.color,
        popular: r.popular,
        images: r.images ?? [],
    };
}

const pgPackageStore: PackageStore = {
    async list() {
        await ensureSchema();
        const { rows } = await getPool().query<PackageRow>(
            `SELECT ${PACKAGE_COLS} FROM packages ORDER BY position ASC, created_at ASC`,
        );
        return rows.map(rowToPackage);
    },
    async get(id) {
        await ensureSchema();
        const { rows } = await getPool().query<PackageRow>(
            `SELECT ${PACKAGE_COLS} FROM packages WHERE id = $1`,
            [id],
        );
        return rows.length ? rowToPackage(rows[0]) : null;
    },
    async create(input) {
        await ensureSchema();
        const n = normalizePkg(input);
        if (!n.name) throw new Error("Name is required");
        const base = slugify(n.name) || "package";
        const p = getPool();
        let id = base;
        let suffix = 2;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { rows } = await p.query("SELECT 1 FROM packages WHERE id = $1", [id]);
            if (rows.length === 0) break;
            id = `${base}-${suffix++}`;
        }
        const posRes = await p.query<{ max: number | null }>(
            "SELECT COALESCE(MAX(position), -1) AS max FROM packages",
        );
        const position = (posRes.rows[0].max ?? -1) + 1;
        await p.query(
            `INSERT INTO packages
                (id, name, price, description, starch, protein, vegetables, dessert, drinks, color, popular, images, position)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
            [
                id,
                n.name,
                n.price,
                n.description ?? "",
                n.starch,
                n.protein,
                n.vegetables,
                n.dessert,
                n.drinks,
                n.color,
                n.popular ?? false,
                n.images,
                position,
            ],
        );
        return { id, ...n };
    },
    async update(id, input) {
        await ensureSchema();
        const n = normalizePkg(input);
        if (!n.name) throw new Error("Name is required");
        const { rowCount } = await getPool().query(
            `UPDATE packages SET
                name = $2,
                price = $3,
                description = $4,
                starch = $5,
                protein = $6,
                vegetables = $7,
                dessert = $8,
                drinks = $9,
                color = $10,
                popular = $11,
                images = $12,
                updated_at = now()
             WHERE id = $1`,
            [
                id,
                n.name,
                n.price,
                n.description ?? "",
                n.starch,
                n.protein,
                n.vegetables,
                n.dessert,
                n.drinks,
                n.color,
                n.popular ?? false,
                n.images,
            ],
        );
        if (rowCount === 0) return null;
        return { id, ...n };
    },
    async delete(id) {
        await ensureSchema();
        const { rowCount } = await getPool().query(
            "DELETE FROM packages WHERE id = $1",
            [id],
        );
        return (rowCount ?? 0) > 0;
    },
};

interface UserRow {
    id: string;
    username: string;
    salt: string;
    password_hash: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
}

function rowToUser(r: UserRow): User {
    return {
        id: r.id,
        username: r.username,
        salt: r.salt,
        passwordHash: r.password_hash,
        role: r.role,
        createdAt: r.created_at.toISOString(),
        updatedAt: r.updated_at.toISOString(),
    };
}

function rowToPublic(r: UserRow): UserPublic {
    return {
        id: r.id,
        username: r.username,
        role: r.role,
        createdAt: r.created_at.toISOString(),
        updatedAt: r.updated_at.toISOString(),
    };
}

const pgUserStore: UserStore = {
    async list() {
        await ensureSchema();
        const { rows } = await getPool().query<UserRow>(
            "SELECT id, username, salt, password_hash, role, created_at, updated_at FROM users ORDER BY created_at ASC",
        );
        return rows.map(rowToPublic);
    },
    async get(id) {
        await ensureSchema();
        const { rows } = await getPool().query<UserRow>(
            "SELECT id, username, salt, password_hash, role, created_at, updated_at FROM users WHERE id = $1",
            [id],
        );
        return rows.length ? rowToPublic(rows[0]) : null;
    },
    async getRaw(id) {
        await ensureSchema();
        const { rows } = await getPool().query<UserRow>(
            "SELECT id, username, salt, password_hash, role, created_at, updated_at FROM users WHERE id = $1",
            [id],
        );
        return rows.length ? rowToUser(rows[0]) : null;
    },
    async getByUsername(username) {
        await ensureSchema();
        const { rows } = await getPool().query<UserRow>(
            "SELECT id, username, salt, password_hash, role, created_at, updated_at FROM users WHERE username = $1",
            [username.toLowerCase()],
        );
        return rows.length ? rowToUser(rows[0]) : null;
    },
    async create(input) {
        await ensureSchema();
        try {
            const id = crypto.randomUUID();
            const { rows } = await getPool().query<UserRow>(
                `INSERT INTO users (id, username, salt, password_hash, role)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id, username, salt, password_hash, role, created_at, updated_at`,
                [
                    id,
                    input.username.toLowerCase(),
                    input.salt,
                    input.passwordHash,
                    input.role,
                ],
            );
            return rowToPublic(rows[0]);
        } catch (err: unknown) {
            if (
                typeof err === "object" &&
                err !== null &&
                "code" in err &&
                (err as { code?: string }).code === "23505"
            ) {
                throw new Error("Username already exists");
            }
            throw err;
        }
    },
    async update(id, patch) {
        await ensureSchema();
        const sets: string[] = [];
        const params: unknown[] = [];
        let i = 1;
        if (patch.role !== undefined) {
            sets.push(`role = $${i++}`);
            params.push(patch.role);
        }
        if (patch.salt !== undefined) {
            sets.push(`salt = $${i++}`);
            params.push(patch.salt);
        }
        if (patch.passwordHash !== undefined) {
            sets.push(`password_hash = $${i++}`);
            params.push(patch.passwordHash);
        }
        sets.push(`updated_at = now()`);
        params.push(id);
        const { rows } = await getPool().query<UserRow>(
            `UPDATE users SET ${sets.join(", ")} WHERE id = $${i}
             RETURNING id, username, salt, password_hash, role, created_at, updated_at`,
            params,
        );
        return rows.length ? rowToPublic(rows[0]) : null;
    },
    async delete(id) {
        await ensureSchema();
        const { rowCount } = await getPool().query(
            "DELETE FROM users WHERE id = $1",
            [id],
        );
        return (rowCount ?? 0) > 0;
    },
    async countSuperadmins() {
        await ensureSchema();
        const { rows } = await getPool().query<{ count: string }>(
            "SELECT COUNT(*)::text AS count FROM users WHERE role = 'superadmin'",
        );
        return parseInt(rows[0].count, 10) || 0;
    },
};

const pgStorage: Storage = {
    packages: pgPackageStore,
    users: pgUserStore,
};

export default pgStorage;
