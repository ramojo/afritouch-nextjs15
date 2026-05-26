import { auth, currentUser } from "@clerk/nextjs/server";
import { Role } from "@/lib/users-types";
import { AuthAdapter, SessionPayload } from "./types";

function readRole(metadata: unknown): Role {
    if (
        typeof metadata === "object" &&
        metadata !== null &&
        "role" in metadata
    ) {
        const r = (metadata as { role?: unknown }).role;
        if (r === "admin" || r === "superadmin") return r;
    }
    // Default Clerk users to plain admin so they can manage packages.
    return "admin";
}

const clerkAdapter: AuthAdapter = {
    provider: "clerk",
    managesUsersExternally: true,
    async getSession(): Promise<SessionPayload | null> {
        const { userId } = await auth();
        if (!userId) return null;
        const user = await currentUser();
        const role = readRole(user?.publicMetadata);
        return {
            userId,
            role,
            username:
                user?.username ??
                user?.primaryEmailAddress?.emailAddress ??
                undefined,
        };
    },
};

export default clerkAdapter;
