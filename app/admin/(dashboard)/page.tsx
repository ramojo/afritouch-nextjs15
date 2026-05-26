import Link from "next/link";
import Image from "next/image";
import { listPackages } from "@/lib/packages";
import DeletePackageButton from "./DeletePackageButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const packages = await listPackages();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">
                        Packages
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage the catering packages shown on the public site.
                    </p>
                </div>
                <Link
                    href="/admin/packages/new"
                    className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90"
                >
                    + New Package
                </Link>
            </div>

            {packages.length === 0 ? (
                <div className="border rounded-lg p-8 text-center bg-card">
                    <p className="text-muted-foreground">
                        No packages yet. Create your first one.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-card border rounded-lg p-4 flex items-center gap-4 shadow-sm"
                        >
                            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                                {pkg.images[0] ? (
                                    <Image
                                        src={pkg.images[0]}
                                        alt={pkg.name}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                        No image
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-serif text-lg font-semibold text-primary">
                                        {pkg.name}
                                    </h2>
                                    {pkg.popular && (
                                        <span className="text-xs rounded-full bg-secondary text-primary px-2 py-0.5">
                                            Popular
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    {pkg.price}
                                    {pkg.description ? ` · ${pkg.description}` : ""}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {pkg.images.length} image
                                    {pkg.images.length === 1 ? "" : "s"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/packages/${pkg.id}`}
                                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                                >
                                    Edit
                                </Link>
                                <DeletePackageButton id={pkg.id} name={pkg.name} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
