import { Package, PackageInput } from "@/app/types/package";
import { Role, User, UserPublic } from "@/lib/users-types";

export interface PackageStore {
    list(): Promise<Package[]>;
    get(id: string): Promise<Package | null>;
    create(input: PackageInput): Promise<Package>;
    update(id: string, input: PackageInput): Promise<Package | null>;
    delete(id: string): Promise<boolean>;
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
    users: UserStore;
}
