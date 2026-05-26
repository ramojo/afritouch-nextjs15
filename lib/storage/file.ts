import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { Package, PackageInput } from "@/app/types/package";
import { User, UserPublic } from "@/lib/users-types";
import { PackageStore, Storage, UserStore } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const PACKAGES_FILE = path.join(DATA_DIR, "packages.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

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

const fileStorage: Storage = {
    packages: filePackageStore,
    users: fileUserStore,
};

export default fileStorage;
