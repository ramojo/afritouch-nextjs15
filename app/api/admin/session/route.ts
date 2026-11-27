import { NextResponse } from "next/server";
import {
    authProvider,
    getSession,
    managesUsersExternally,
} from "@/lib/auth";
import { getUser } from "@/lib/users";

export const dynamic = "force-dynamic";

export async function GET() {
    const noStore = { "Cache-Control": "no-store" };
    const session = await getSession();

    if (!session) {
        return NextResponse.json(
            {
                authenticated: false,
                authProvider,
                managesUsersExternally,
            },
            { headers: noStore },
        );
    }

    let displayName = session.username;
    if (!displayName && !managesUsersExternally) {
        const me = await getUser(session.userId);
        displayName = me?.username;
    }

    return NextResponse.json(
        {
            authenticated: true,
            displayName: displayName || "Admin",
            role: session.role,
            authProvider,
            managesUsersExternally,
        },
        { headers: noStore },
    );
}
