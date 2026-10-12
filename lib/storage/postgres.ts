import crypto from "crypto";
import { Pool } from "pg";
import { config } from "@/lib/config";
import { Package, PackageInput } from "@/app/types/package";
import { MenuItem, MenuItemInput, MenuItemPatch, MENU_CATEGORIES } from "@/app/types/menu";
import { Quote, QuoteInput, QuotePatch, QuoteLineItem } from "@/app/types/quote";
import { Role, User, UserPublic } from "@/lib/users-types";
import { itemIdFromName } from "@/lib/menu-catalog";
import { estimatedQuoteTotal } from "@/lib/menu-catalog";
import { PackageStore, MenuItemStore, QuoteStore, Storage, UserStore } from "./types";

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

/* -------------------------------------------------------------------------- */
/*  Menu Items                                                                */
/* -------------------------------------------------------------------------- */

interface MenuItemRow {
    id: string;
    name: string;
    category: string;
    price_per_person: number;
    active: boolean;
    needs_costing: boolean;
    notes: string;
    created_at: Date;
    updated_at: Date;
}

function rowToMenuItem(r: MenuItemRow): MenuItem {
    return {
        id: r.id,
        name: r.name,
        category: r.category as MenuItem["category"],
        pricePerPerson: r.price_per_person,
        active: r.active,
        needsCosting: r.needs_costing,
        notes: r.notes ?? "",
    };
}

const pgMenuItemStore: MenuItemStore = {
    async list(opts) {
        await ensureSchema();
        const conditions: string[] = [];
        const params: unknown[] = [];
        let i = 1;
        if (opts?.category !== undefined) { conditions.push(`category = $${i++}`); params.push(opts.category); }
        if (opts?.active !== undefined) { conditions.push(`active = $${i++}`); params.push(opts.active); }
        if (opts?.needsCosting !== undefined) { conditions.push(`needs_costing = $${i++}`); params.push(opts.needsCosting); }
        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const { rows } = await getPool().query<MenuItemRow>(
            `SELECT id, name, category, price_per_person, active, needs_costing, notes, created_at, updated_at
             FROM menu_items ${where}
             ORDER BY category ASC, name ASC`,
            params,
        );
        return rows.map(rowToMenuItem);
    },
    async get(id) {
        await ensureSchema();
        const { rows } = await getPool().query<MenuItemRow>(
            `SELECT id, name, category, price_per_person, active, needs_costing, notes, created_at, updated_at
             FROM menu_items WHERE id = $1`,
            [id],
        );
        return rows.length ? rowToMenuItem(rows[0]) : null;
    },
    async create(input) {
        await ensureSchema();
        const name = input.name?.trim() ?? "";
        if (!name) throw new Error("Name is required");
        const category = input.category;
        if (!MENU_CATEGORIES.includes(category as never)) throw new Error("Invalid category");
        const id = itemIdFromName(category, name);
        const { rows } = await getPool().query<MenuItemRow>(
            `INSERT INTO menu_items (id, name, category, price_per_person, active, needs_costing, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name, category, price_per_person, active, needs_costing, notes, created_at, updated_at`,
            [id, name, category, input.pricePerPerson ?? 0, input.active ?? true, input.needsCosting ?? false, input.notes?.trim() ?? ""],
        );
        return rowToMenuItem(rows[0]);
    },
    async update(id, patch) {
        await ensureSchema();
        const sets: string[] = [];
        const params: unknown[] = [];
        let i = 1;
        if (patch.name !== undefined) { sets.push(`name = $${i++}`); params.push(patch.name.trim()); }
        if (patch.category !== undefined) { sets.push(`category = $${i++}`); params.push(patch.category); }
        if (patch.pricePerPerson !== undefined) { sets.push(`price_per_person = $${i++}`); params.push(patch.pricePerPerson); }
        if (patch.active !== undefined) { sets.push(`active = $${i++}`); params.push(patch.active); }
        if (patch.needsCosting !== undefined) { sets.push(`needs_costing = $${i++}`); params.push(patch.needsCosting); }
        if (patch.notes !== undefined) { sets.push(`notes = $${i++}`); params.push(patch.notes.trim()); }
        if (sets.length === 0) return pgMenuItemStore.get(id);
        sets.push(`updated_at = now()`);
        params.push(id);
        const { rows } = await getPool().query<MenuItemRow>(
            `UPDATE menu_items SET ${sets.join(", ")} WHERE id = $${i}
             RETURNING id, name, category, price_per_person, active, needs_costing, notes, created_at, updated_at`,
            params,
        );
        return rows.length ? rowToMenuItem(rows[0]) : null;
    },
    async delete(id) {
        await ensureSchema();
        const { rowCount } = await getPool().query("DELETE FROM menu_items WHERE id = $1", [id]);
        return (rowCount ?? 0) > 0;
    },
    async bulkCreate(items) {
        if (items.length === 0) return 0;
        await ensureSchema();
        let inserted = 0;
        const p = getPool();
        for (const item of items) {
            const name = item.name?.trim() ?? "";
            if (!name) continue;
            const id = itemIdFromName(item.category, name);
            const { rowCount } = await p.query(
                `INSERT INTO menu_items (id, name, category, price_per_person, active, needs_costing, notes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (category, name) DO NOTHING`,
                [id, name, item.category, item.pricePerPerson ?? 0, item.active ?? true, item.needsCosting ?? false, item.notes?.trim() ?? ""],
            );
            inserted += rowCount ?? 0;
        }
        return inserted;
    },
    async clearAll() {
        await ensureSchema();
        const { rowCount } = await getPool().query("DELETE FROM menu_items");
        return rowCount ?? 0;
    },
};

/* -------------------------------------------------------------------------- */
/*  Quotes                                                                    */
/* -------------------------------------------------------------------------- */

interface QuoteRow {
    id: string;
    package_id: string | null;
    package_name: string | null;
    name: string;
    email: string;
    phone: string;
    whatsapp: string | null;
    guest_count: number;
    event_date: Date;
    location: string;
    notes: string | null;
    kind: string;
    line_items: unknown;
    estimated_total: number | null;
    status: string;
    created_at: Date;
    updated_at: Date;
}

function rowToQuote(r: QuoteRow): Quote {
    let lineItems: QuoteLineItem[] = [];
    if (Array.isArray(r.line_items)) lineItems = r.line_items as QuoteLineItem[];
    return {
        id: r.id,
        kind: r.kind as Quote["kind"],
        packageId: r.package_id,
        packageName: r.package_name,
        name: r.name,
        email: r.email,
        phone: r.phone,
        whatsapp: r.whatsapp,
        guestCount: r.guest_count,
        eventDate: r.event_date instanceof Date
            ? r.event_date.toISOString().slice(0, 10)
            : String(r.event_date),
        location: r.location,
        notes: r.notes,
        lineItems,
        estimatedTotal: r.estimated_total,
        status: r.status as Quote["status"],
        createdAt: r.created_at.toISOString(),
        updatedAt: r.updated_at.toISOString(),
    };
}

const QUOTE_COLS = `id, package_id, package_name, name, email, phone, whatsapp,
    guest_count, event_date, location, notes, kind, line_items, estimated_total,
    status, created_at, updated_at`;

const pgQuoteStore: QuoteStore = {
    async list(opts) {
        await ensureSchema();
        const conditions: string[] = [];
        const params: unknown[] = [];
        let i = 1;
        if (opts?.status) { conditions.push(`status = $${i++}`); params.push(opts.status); }
        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const limitClause = opts?.limit ? `LIMIT $${i++}` : "";
        const offsetClause = opts?.offset ? `OFFSET $${i++}` : "";
        if (opts?.limit) params.push(opts.limit);
        if (opts?.offset) params.push(opts.offset);
        const { rows } = await getPool().query<QuoteRow>(
            `SELECT ${QUOTE_COLS} FROM quotes ${where} ORDER BY created_at DESC ${limitClause} ${offsetClause}`,
            params,
        );
        return rows.map(rowToQuote);
    },
    async get(id) {
        await ensureSchema();
        const { rows } = await getPool().query<QuoteRow>(
            `SELECT ${QUOTE_COLS} FROM quotes WHERE id = $1`,
            [id],
        );
        return rows.length ? rowToQuote(rows[0]) : null;
    },
    async create(input) {
        await ensureSchema();
        const lineItems: QuoteLineItem[] = (input.lineItems ?? []).map((li) => ({
            itemId: li.itemId ?? null,
            name: li.name,
            category: li.category,
            unitPrice: null,
            custom: li.custom ?? false,
            pendingCosting: li.custom ?? false,
        }));
        const estimatedTotal = estimatedQuoteTotal(input.guestCount, lineItems);
        const { rows } = await getPool().query<QuoteRow>(
            `INSERT INTO quotes
                (package_id, package_name, name, email, phone, whatsapp,
                 guest_count, event_date, location, notes, kind, line_items, estimated_total)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
             RETURNING ${QUOTE_COLS}`,
            [
                input.packageId ?? null,
                input.packageName ?? null,
                input.name,
                input.email,
                input.phone,
                input.whatsapp ?? null,
                input.guestCount,
                input.eventDate,
                input.location,
                input.notes ?? null,
                input.kind ?? "package",
                JSON.stringify(lineItems),
                estimatedTotal,
            ],
        );
        return rowToQuote(rows[0]);
    },
    async update(id, patch) {
        await ensureSchema();
        const sets: string[] = [];
        const params: unknown[] = [];
        let i = 1;
        if (patch.status !== undefined) { sets.push(`status = $${i++}`); params.push(patch.status); }
        if (patch.lineItemPrices && patch.lineItemPrices.length > 0) {
            const existing = await pgQuoteStore.get(id);
            if (existing) {
                const updated = existing.lineItems.map((li) => {
                    const priceUpdate = patch.lineItemPrices?.find((p) => p.itemId === li.itemId);
                    if (priceUpdate) return { ...li, unitPrice: priceUpdate.unitPrice, pendingCosting: false };
                    return li;
                });
                const newTotal = estimatedQuoteTotal(existing.guestCount, updated);
                sets.push(`line_items = $${i++}`); params.push(JSON.stringify(updated));
                sets.push(`estimated_total = $${i++}`); params.push(newTotal);
            }
        }
        if (sets.length === 0) return pgQuoteStore.get(id);
        sets.push(`updated_at = now()`);
        params.push(id);
        const { rows } = await getPool().query<QuoteRow>(
            `UPDATE quotes SET ${sets.join(", ")} WHERE id = $${i} RETURNING ${QUOTE_COLS}`,
            params,
        );
        return rows.length ? rowToQuote(rows[0]) : null;
    },
};

const pgStorage: Storage = {
    packages: pgPackageStore,
    menuItems: pgMenuItemStore,
    quotes: pgQuoteStore,
    users: pgUserStore,
};

export default pgStorage;
