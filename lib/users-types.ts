export type Role = "admin" | "superadmin";

export interface User {
    id: string;
    username: string;
    salt: string;
    passwordHash: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export type UserPublic = Omit<User, "salt" | "passwordHash">;
