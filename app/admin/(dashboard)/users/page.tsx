import Link from "next/link";
import { redirect } from "next/navigation";
import { listUsers } from "@/lib/users";
import { getSession, managesUsersExternally } from "@/lib/auth";
import DeleteUserButton from "./DeleteUserButton";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    if (managesUsersExternally) {
        redirect("/admin");
    }
    const [users, session] = await Promise.all([listUsers(), getSession()]);
    const meId = session?.userId;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">
                        Users
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage who can access the admin area.
                    </p>
                </div>
                <Link
                    href="/admin/users/new"
                    className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90"
                >
                    + New User
                </Link>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="px-4 py-3 font-medium">Username</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 font-medium text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr
                                key={u.id}
                                className="border-t hover:bg-muted/20"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {u.username}
                                    {u.id === meId && (
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            (you)
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="rounded-full bg-secondary text-primary px-2 py-0.5 text-xs">
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <Link
                                        href={`/admin/users/${u.id}`}
                                        className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted inline-block"
                                    >
                                        Edit
                                    </Link>
                                    {u.id !== meId && (
                                        <DeleteUserButton
                                            id={u.id}
                                            username={u.username}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
