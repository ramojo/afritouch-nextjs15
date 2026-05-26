import { Role } from "@/lib/users-types";

export interface SessionPayload {
    userId: string;
    role: Role;
    /** Optional human-readable handle (username for local, email/clerk id for clerk). */
    username?: string;
}

export interface AuthAdapter {
    /** Identifier of this provider, e.g. "local" or "clerk". */
    provider: "local" | "clerk";
    /** Return current session for a server-component / route-handler call. */
    getSession(): Promise<SessionPayload | null>;
    /** True if this provider manages its own users (so admin /users area is hidden). */
    managesUsersExternally: boolean;
}
