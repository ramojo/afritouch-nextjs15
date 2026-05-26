import Link from "next/link";
import PackageForm from "../../PackageForm";

export default function NewPackagePage() {
    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin"
                    className="text-sm text-muted-foreground hover:underline"
                >
                    ← Back to packages
                </Link>
                <h1 className="text-3xl font-serif font-bold text-primary mt-2">
                    New package
                </h1>
            </div>
            <PackageForm mode="new" />
        </div>
    );
}
