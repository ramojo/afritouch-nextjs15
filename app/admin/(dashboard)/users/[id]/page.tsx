import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/users";
import UserForm from "../UserForm";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await getUser(id);
    if (!user) notFound();

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin/users"
                    className="text-sm text-muted-foreground hover:underline"
                >
                    ← Back to users
                </Link>
                <h1 className="text-3xl font-serif font-bold text-primary mt-2">
                    Edit: {user.username}
                </h1>
                <p className="text-xs text-muted-foreground">id: {user.id}</p>
            </div>
            <UserForm mode="edit" initial={user} />
        </div>
    );
}
