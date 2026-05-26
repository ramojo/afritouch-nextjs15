import crypto from "crypto";
import storage from "./storage";
import { config } from "./config";
import { Role, User, UserPublic } from "./users-types";

export type { Role, User, UserPublic };

function hashPassword(password: string, salt: string): string {
    return crypto.scryptSync(password, salt, 64).toString("hex");
}

function makeSalt(): string {
    return crypto.randomBytes(16).toString("hex");
}

let bootstrapped = false;
async function bootstrap(): Promise<void> {
    if (bootstrapped) return;
    bootstrapped = true;
    if (config.auth.provider !== "local") return;
    const existing = await storage.users.list();
    if (existing.length > 0) return;

    const { username, password } = config.auth.bootstrap;
    const salt = makeSalt();
    await storage.users.create({
        username,
        salt,
        passwordHash: hashPassword(password, salt),
        role: "superadmin",
    });
    // eslint-disable-next-line no-console
    console.log(
        `[users] seeded initial superadmin "${username}" (set ADMIN_USERNAME / ADMIN_PASSWORD env to override).`,
    );
}

export async function listUsers(): Promise<UserPublic[]> {
    await bootstrap();
    return storage.users.list();
}

export async function getUser(id: string): Promise<UserPublic | null> {
    await bootstrap();
    return storage.users.get(id);
}

export async function getUserByUsername(
    username: string,
): Promise<User | null> {
    await bootstrap();
    return storage.users.getByUsername(username);
}

export async function verifyLogin(
    username: string,
    password: string,
): Promise<User | null> {
    const u = await getUserByUsername(username);
    if (!u) return null;
    const expected = hashPassword(password, u.salt);
    try {
        const ok = crypto.timingSafeEqual(
            Buffer.from(expected, "hex"),
            Buffer.from(u.passwordHash, "hex"),
        );
        return ok ? u : null;
    } catch {
        return null;
    }
}

export async function createUser(input: {
    username: string;
    password: string;
    role: Role;
}): Promise<UserPublic> {
    await bootstrap();
    const username = input.username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
        throw new Error(
            "Username must be 3-32 characters: letters, digits, '.', '_' or '-'",
        );
    }
    if (!input.password || input.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }
    if (input.role !== "admin" && input.role !== "superadmin") {
        throw new Error("Invalid role");
    }
    const salt = makeSalt();
    return storage.users.create({
        username,
        salt,
        passwordHash: hashPassword(input.password, salt),
        role: input.role,
    });
}

export async function updateUser(
    id: string,
    input: { role?: Role; password?: string },
): Promise<UserPublic | null> {
    await bootstrap();
    const target = await storage.users.get(id);
    if (!target) return null;

    const patch: { role?: Role; salt?: string; passwordHash?: string } = {};

    if (input.role !== undefined) {
        if (input.role !== "admin" && input.role !== "superadmin") {
            throw new Error("Invalid role");
        }
        if (target.role === "superadmin" && input.role !== "superadmin") {
            const supers = await storage.users.countSuperadmins();
            if (supers <= 1) {
                throw new Error("Cannot demote the last superadmin");
            }
        }
        patch.role = input.role;
    }

    if (input.password !== undefined) {
        if (input.password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
        const salt = makeSalt();
        patch.salt = salt;
        patch.passwordHash = hashPassword(input.password, salt);
    }

    return storage.users.update(id, patch);
}

export async function changeOwnPassword(
    id: string,
    currentPassword: string,
    newPassword: string,
): Promise<boolean> {
    const u = await storage.users.getRaw(id);
    if (!u) return false;
    const currentHash = hashPassword(currentPassword, u.salt);
    let ok = false;
    try {
        ok = crypto.timingSafeEqual(
            Buffer.from(currentHash, "hex"),
            Buffer.from(u.passwordHash, "hex"),
        );
    } catch {
        ok = false;
    }
    if (!ok) throw new Error("Current password is incorrect");
    if (!newPassword || newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
    }
    const salt = makeSalt();
    await storage.users.update(id, {
        salt,
        passwordHash: hashPassword(newPassword, salt),
    });
    return true;
}

export async function deleteUser(id: string): Promise<boolean> {
    await bootstrap();
    const target = await storage.users.get(id);
    if (!target) return false;
    if (target.role === "superadmin") {
        const supers = await storage.users.countSuperadmins();
        if (supers <= 1) {
            throw new Error("Cannot delete the last superadmin");
        }
    }
    return storage.users.delete(id);
}
