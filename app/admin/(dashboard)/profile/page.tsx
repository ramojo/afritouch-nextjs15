import { redirect } from "next/navigation";
import { getSession, managesUsersExternally } from "@/lib/auth";
import { getUser } from "@/lib/users";
import ChangePasswordForm from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    if (managesUsersExternally) {
        // Clerk owns the profile UI; send users to its dashboard.
        redirect("/admin");
    }

    const session = await getSession();
    const me = session ? await getUser(session.userId) : null;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">
                    My profile
                </h1>
                <p className="text-sm text-muted-foreground">
                    Update your account credentials.
                </p>
            </div>

            {me && (
                <div className="bg-card border rounded-lg p-6 space-y-2">
                    <h2 className="font-serif text-lg font-semibold text-primary">
                        Account
                    </h2>
                    <p className="text-sm">
                        <span className="text-muted-foreground">
                            Username:{" "}
                        </span>
                        {me.username}
                    </p>
                    <p className="text-sm">
                        <span className="text-muted-foreground">Role: </span>
                        <span className="rounded-full bg-secondary text-primary px-2 py-0.5 text-xs">
                            {me.role}
                        </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Member since{" "}
                        {new Date(me.createdAt).toLocaleDateString()}
                    </p>
                </div>
            )}

            <ChangePasswordForm />
        </div>
    );
}
