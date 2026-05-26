import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackage } from "@/lib/packages";
import PackageForm from "../../PackageForm";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const pkg = await getPackage(id);
    if (!pkg) notFound();

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
                    Edit: {pkg.name}
                </h1>
                <p className="text-xs text-muted-foreground">id: {pkg.id}</p>
            </div>
            <PackageForm mode="edit" initial={pkg} />
        </div>
    );
}
