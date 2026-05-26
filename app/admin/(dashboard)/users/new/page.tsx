import Link from "next/link";
import UserForm from "../UserForm";

export default function NewUserPage() {
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
                    New user
                </h1>
            </div>
            <UserForm mode="new" />
        </div>
    );
}
