import React from "react";
import Link from "next/link";
import LogoutButton from "../LogoutButton";
import {
    authProvider,
    getSession,
    managesUsersExternally,
} from "@/lib/auth";
import { getUser } from "@/lib/users";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const isSuperadmin = session?.role === "superadmin";

    // For local auth, look up the username from storage.
    // For Clerk, the username is already in the session payload.
    let displayName = session?.username;
    if (!displayName && session && !managesUsersExternally) {
        const me = await getUser(session.userId);
        displayName = me?.username;
    }

    return (
        <>
            <header className="bg-primary text-primary-foreground border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                    <Link
                        href="/admin"
                        className="text-xl font-serif font-bold whitespace-nowrap"
                    >
                        Afritouch Admin
                    </Link>
                    <nav className="flex items-center gap-4 text-sm">
                        <Link href="/admin" className="hover:underline">
                            Packages
                        </Link>
                        {isSuperadmin && !managesUsersExternally && (
                            <Link
                                href="/admin/users"
                                className="hover:underline"
                            >
                                Users
                            </Link>
                        )}
                        {!managesUsersExternally && (
                            <Link
                                href="/admin/profile"
                                className="hover:underline"
                            >
                                Profile
                            </Link>
                        )}
                        <Link href="/" className="hover:underline">
                            View site
                        </Link>
                        {session && (
                            <span className="text-xs opacity-90 hidden sm:inline-flex items-center gap-1">
                                {displayName ?? session.userId}
                                <span className="rounded-full bg-secondary text-primary px-2 py-0.5 ml-1">
                                    {session.role}
                                </span>
                            </span>
                        )}
                        <LogoutButton clerk={authProvider === "clerk"} />
                    </nav>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </>
    );
}
