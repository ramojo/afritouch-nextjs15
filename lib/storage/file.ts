import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { Package, PackageInput } from "@/app/types/package";
import { User, UserPublic } from "@/lib/users-types";
import { MenuItem, MenuItemInput, MenuItemPatch, MENU_CATEGORIES } from "@/app/types/menu";
import { Quote, QuoteInput, QuotePatch, QuoteLineItem } from "@/app/types/quote";
import { itemIdFromName } from "@/lib/menu-catalog";
import { estimatedQuoteTotal } from "@/lib/menu-catalog";
import { PackageStore, MenuItemStore, QuoteStore, Storage, UserStore } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const PACKAGES_FILE = path.join(DATA_DIR, "packages.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const MENU_ITEMS_FILE = path.join(DATA_DIR, "menu-items.json");
const QUOTES_FILE = path.join(DATA_DIR, "quotes.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
    try {
        const raw = await fs.readFile(file, "utf8");
        return JSON.parse(raw) as T;
    } catch (err: unknown) {
        if (
            typeof err === "object" &&
            err !== null &&
            "code" in err &&
            (err as { code?: string }).code === "ENOENT"
        ) {
            return fallback;
        }
        throw err;
    }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 4), "utf8");
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

const filePackageStore: PackageStore = {
    async list() {
        return readJson<Package[]>(PACKAGES_FILE, []);
    },
    async get(id) {
        const all = await readJson<Package[]>(PACKAGES_FILE, []);
        return all.find((p) => p.id === id) ?? null;
    },
    async create(input) {
        const all = await readJson<Package[]>(PACKAGES_FILE, []);
        const normalized = normalizePkg(input);
        if (!normalized.name) throw new Error("Name is required");
        const base = slugify(normalized.name) || "package";
        let id = base;
        let n = 2;
        while (all.some((p) => p.id === id)) id = `${base}-${n++}`;
        const pkg: Package = { id, ...normalized };
        all.push(pkg);
        await writeJson(PACKAGES_FILE, all);
        return pkg;
    },
    async update(id, input) {
        const all = await readJson<Package[]>(PACKAGES_FILE, []);
        const idx = all.findIndex((p) => p.id === id);
        if (idx === -1) return null;
        const normalized = normalizePkg(input);
        if (!normalized.name) throw new Error("Name is required");
        all[idx] = { id, ...normalized };
        await writeJson(PACKAGES_FILE, all);
        return all[idx];
    },
    async delete(id) {
        const all = await readJson<Package[]>(PACKAGES_FILE, []);
        const next = all.filter((p) => p.id !== id);
        if (next.length === all.length) return false;
        await writeJson(PACKAGES_FILE, next);
        return true;
    },
};

function publicView(u: User): UserPublic {
    const { salt: _s, passwordHash: _p, ...rest } = u;
    void _s;
    void _p;
    return rest;
}

const fileUserStore: UserStore = {
    async list() {
        const all = await readJson<User[]>(USERS_FILE, []);
        return all.map(publicView);
    },
    async get(id) {
        const all = await readJson<User[]>(USERS_FILE, []);
        const u = all.find((x) => x.id === id);
        return u ? publicView(u) : null;
    },
    async getRaw(id) {
        const all = await readJson<User[]>(USERS_FILE, []);
        return all.find((x) => x.id === id) ?? null;
    },
    async getByUsername(username) {
        const all = await readJson<User[]>(USERS_FILE, []);
        return all.find((x) => x.username === username.toLowerCase()) ?? null;
    },
    async create(input) {
        const all = await readJson<User[]>(USERS_FILE, []);
        const username = input.username.toLowerCase();
        if (all.some((u) => u.username === username)) {
            throw new Error("Username already exists");
        }
        const now = new Date().toISOString();
        const user: User = {
            id: crypto.randomUUID(),
            username,
            salt: input.salt,
            passwordHash: input.passwordHash,
            role: input.role,
            createdAt: now,
            updatedAt: now,
        };
        all.push(user);
        await writeJson(USERS_FILE, all);
        return publicView(user);
    },
    async update(id, patch) {
        const all = await readJson<User[]>(USERS_FILE, []);
        const idx = all.findIndex((u) => u.id === id);
        if (idx === -1) return null;
        const target = all[idx];
        if (patch.role !== undefined) target.role = patch.role;
        if (patch.salt !== undefined) target.salt = patch.salt;
        if (patch.passwordHash !== undefined)
            target.passwordHash = patch.passwordHash;
        target.updatedAt = new Date().toISOString();
        all[idx] = target;
        await writeJson(USERS_FILE, all);
        return publicView(target);
    },
    async delete(id) {
        const all = await readJson<User[]>(USERS_FILE, []);
        const next = all.filter((u) => u.id !== id);
        if (next.length === all.length) return false;
        await writeJson(USERS_FILE, next);
        return true;
    },
    async countSuperadmins() {
        const all = await readJson<User[]>(USERS_FILE, []);
        return all.filter((u) => u.role === "superadmin").length;
    },
};

/* -------------------------------------------------------------------------- */
/*  Menu Items                                                                */
/* -------------------------------------------------------------------------- */

const fileMenuItemStore: MenuItemStore = {
    async list(opts) {
        const all = await readJson<MenuItem[]>(MENU_ITEMS_FILE, []);
        let filtered = all;
        if (opts?.category !== undefined) {
            filtered = filtered.filter((m) => m.category === opts.category);
        }
        if (opts?.active !== undefined) {
            filtered = filtered.filter((m) => m.active === opts.active);
        }
        if (opts?.needsCosting !== undefined) {
            filtered = filtered.filter((m) => m.needsCosting === opts.needsCosting);
        }
        return filtered.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    },
    async get(id) {
        const all = await readJson<MenuItem[]>(MENU_ITEMS_FILE, []);
        return all.find((m) => m.id === id) ?? null;
    },
    async create(input) {
        const all = await readJson<MenuItem[]>(MENU_ITEMS_FILE, []);
        const name = input.name?.trim() ?? "";
        if (!name) throw new Error("Name is required");
        const category = input.category;
        if (!MENU_CATEGORIES.includes(category as never)) throw new Error("Invalid category");
        const id = itemIdFromName(category, name);
        if (all.some((m) => m.id === id)) {
            throw new Error("Menu item already exists");
        }
        const item: MenuItem = {
            id,
            name,
            category,
            pricePerPerson: input.pricePerPerson ?? 0,
            active: input.active ?? true,
            needsCosting: input.needsCosting ?? false,
            notes: input.notes?.trim() ?? "",
        };
        all.push(item);
        await writeJson(MENU_ITEMS_FILE, all);
        return item;
    },
    async update(id, patch) {
        const all = await readJson<MenuItem[]>(MENU_ITEMS_FILE, []);
        const idx = all.findIndex((m) => m.id === id);
        if (idx === -1) return null;
        const target = all[idx];
        if (patch.name !== undefined) target.name = patch.name.trim();
        if (patch.category !== undefined) {
            if (!MENU_CATEGORIES.includes(patch.category as never)) throw new Error("Invalid category");
            target.category = patch.category;
        }
        if (patch.pricePerPerson !== undefined) target.pricePerPerson = patch.pricePerPerson;
        if (patch.active !== undefined) target.active = patch.active;
        if (patch.needsCosting !== undefined) target.needsCosting = patch.needsCosting;
        if (patch.notes !== undefined) target.notes = patch.notes.trim();
        all[idx] = target;
        await writeJson(MENU_ITEMS_FILE, all);
        return target;
    },
    async delete(id) {
        const all = await readJson<MenuItem[]>(MENU_ITEMS_FILE, []);
        const next = all.filter((m) => m.id !== id);
        if (next.length === all.length) return false;
        await writeJson(MENU_ITEMS_FILE, next);
        return true;
    },
    async bulkCreate(items) {
        if (items.length === 0) return 0;
        const all = await readJson<MenuItem[]>(MENU_ITEMS_FILE, []);
        let inserted = 0;
        for (const item of items) {
            const name = item.name?.trim() ?? "";
            if (!name) continue;
            const id = itemIdFromName(item.category, name);
            if (all.some((m) => m.id === id)) continue;
            const menuItem: MenuItem = {
                id,
                name,
                category: item.category,
                pricePerPerson: item.pricePerPerson ?? 0,
                active: item.active ?? true,
                needsCosting: item.needsCosting ?? false,
                notes: item.notes?.trim() ?? "",
            };
            all.push(menuItem);
            inserted++;
        }
        await writeJson(MENU_ITEMS_FILE, all);
        return inserted;
    },
    async clearAll() {
        const count = (await readJson<MenuItem[]>(MENU_ITEMS_FILE, [])).length;
        await writeJson(MENU_ITEMS_FILE, []);
        return count;
    },
};

/* -------------------------------------------------------------------------- */
/*  Quotes                                                                    */
/* -------------------------------------------------------------------------- */

const fileQuoteStore: QuoteStore = {
    async list(opts) {
        const all = await readJson<Quote[]>(QUOTES_FILE, []);
        let filtered = all;
        if (opts?.status !== undefined) {
            filtered = filtered.filter((q) => q.status === opts.status);
        }
        if (opts?.limit !== undefined) {
            const offset = opts.offset ?? 0;
            filtered = filtered.slice(offset, offset + opts.limit);
        } else if (opts?.offset !== undefined) {
            filtered = filtered.slice(opts.offset);
        }
        return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async get(id) {
        const all = await readJson<Quote[]>(QUOTES_FILE, []);
        return all.find((q) => q.id === id) ?? null;
    },
    async create(input) {
        const all = await readJson<Quote[]>(QUOTES_FILE, []);
        const lineItems: QuoteLineItem[] = (input.lineItems ?? []).map((li) => ({
            itemId: li.itemId ?? null,
            name: li.name,
            category: li.category,
            unitPrice: li.unitPrice ?? null,
            custom: li.custom ?? false,
            pendingCosting: li.pendingCosting ?? li.custom ?? false,
        }));
        const estimatedTotal = estimatedQuoteTotal(input.guestCount, lineItems);
        const now = new Date().toISOString();
        const quote: Quote = {
            id: crypto.randomUUID(),
            kind: input.kind ?? "package",
            packageId: input.packageId ?? null,
            packageName: input.packageName ?? null,
            name: input.name,
            email: input.email,
            phone: input.phone,
            whatsapp: input.whatsapp ?? null,
            guestCount: input.guestCount,
            eventDate: input.eventDate,
            location: input.location,
            notes: input.notes ?? null,
            lineItems,
            estimatedTotal,
            status: "new",
            createdAt: now,
            updatedAt: now,
        };
        all.push(quote);
        await writeJson(QUOTES_FILE, all);
        return quote;
    },
    async update(id, patch) {
        const all = await readJson<Quote[]>(QUOTES_FILE, []);
        const idx = all.findIndex((q) => q.id === id);
        if (idx === -1) return null;
        const target = all[idx];
        if (patch.status !== undefined) target.status = patch.status;
        if (patch.lineItemPrices && patch.lineItemPrices.length > 0) {
            const updated = target.lineItems.map((li) => {
                const priceUpdate = patch.lineItemPrices?.find(
                    (p) =>
                        (p.itemId != null && p.itemId === li.itemId) ||
                        (p.itemId == null && p.name === li.name),
                );
                if (priceUpdate) {
                    return {
                        ...li,
                        unitPrice: priceUpdate.unitPrice,
                        pendingCosting: priceUpdate.unitPrice <= 0,
                    };
                }
                return li;
            });
            target.lineItems = updated;
            target.estimatedTotal = estimatedQuoteTotal(target.guestCount, updated);
        }
        target.updatedAt = new Date().toISOString();
        all[idx] = target;
        await writeJson(QUOTES_FILE, all);
        return target;
    },
};

const fileStorage: Storage = {
    packages: filePackageStore,
    menuItems: fileMenuItemStore,
    quotes: fileQuoteStore,
    users: fileUserStore,
};

export default fileStorage;
