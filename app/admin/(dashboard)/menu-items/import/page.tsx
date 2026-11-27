import Link from "next/link";
import { listPackages } from "@/lib/packages";
import { listMenuItems } from "@/lib/menu-items";
import ImportFromPackages from "./ImportFromPackages";

export const dynamic = "force-dynamic";

export default async function ImportFromPackagesPage() {
    const [packages, items] = await Promise.all([
        listPackages(),
        listMenuItems(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin/menu-items"
                    className="text-sm text-muted-foreground hover:underline"
                >
                    ← Menu Items
                </Link>
                <h1 className="mt-2 text-3xl font-serif font-bold text-primary">
                    Import from Packages
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Build the custom-menu catalog from the dishes already in your catering packages.
                </p>
            </div>
            <ImportFromPackages packages={packages} existingCount={items.length} />
        </div>
    );
}
