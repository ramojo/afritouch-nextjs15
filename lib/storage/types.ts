import { Package, PackageInput } from "@/app/types/package";
import { MenuItem, MenuItemInput, MenuItemPatch } from "@/app/types/menu";
import { Quote, QuoteInput, QuotePatch } from "@/app/types/quote";
import { Role, User, UserPublic } from "@/lib/users-types";

export interface PackageStore {
    list(): Promise<Package[]>;
    get(id: string): Promise<Package | null>;
    create(input: PackageInput): Promise<Package>;
    update(id: string, input: PackageInput): Promise<Package | null>;
    delete(id: string): Promise<boolean>;
}

export interface MenuItemStore {
    list(opts?: {
        category?: string;
        active?: boolean;
        needsCosting?: boolean;
    }): Promise<MenuItem[]>;
    get(id: string): Promise<MenuItem | null>;
    create(input: MenuItemInput): Promise<MenuItem>;
    update(id: string, patch: MenuItemPatch): Promise<MenuItem | null>;
    delete(id: string): Promise<boolean>;
    /** Bulk-insert items; skips duplicates (same category+name). Returns count inserted. */
    bulkCreate(items: MenuItemInput[]): Promise<number>;
    /** Delete all items. Returns count deleted. */
    clearAll(): Promise<number>;
}

export interface QuoteStore {
    list(opts?: { status?: string; limit?: number; offset?: number }): Promise<Quote[]>;
    get(id: string): Promise<Quote | null>;
    create(input: QuoteInput): Promise<Quote>;
    update(id: string, patch: QuotePatch): Promise<Quote | null>;
}

export interface UserStore {
    list(): Promise<UserPublic[]>;
    get(id: string): Promise<UserPublic | null>;
    getRaw(id: string): Promise<User | null>;
    getByUsername(username: string): Promise<User | null>;
    create(input: {
        username: string;
        salt: string;
        passwordHash: string;
        role: Role;
    }): Promise<UserPublic>;
    update(
        id: string,
        patch: { role?: Role; salt?: string; passwordHash?: string },
    ): Promise<UserPublic | null>;
    delete(id: string): Promise<boolean>;
    countSuperadmins(): Promise<number>;
}

export interface Storage {
    packages: PackageStore;
    menuItems: MenuItemStore;
    quotes: QuoteStore;
    users: UserStore;
}
