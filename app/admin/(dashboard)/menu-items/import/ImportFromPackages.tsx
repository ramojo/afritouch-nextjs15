"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "@/app/types/package";
import { MenuItem, MENU_CATEGORIES, CATEGORY_LABELS } from "@/app/types/menu";

export default function ImportFromPackages({
    packages,
    existingCount,
}: {
    packages: Package[];
    existingCount: number;
}) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

    const dishCount = (pkg: Package) =>
        MENU_CATEGORIES.reduce((sum, category) => sum + (pkg[category]?.length ?? 0), 0);
    const totalDishes = packages.reduce((sum, pkg) => sum + dishCount(pkg), 0);

    async function importAll() {
        setBusy(true);
        setNotice(null);
        try {
            const res = await fetch("/api/menu-items?action=seed", { method: "POST" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Import failed");
            setNotice({
                kind: "ok",
                text: `Imported ${data.seeded ?? 0} new dishes. Dishes already in the catalog were skipped.`,
            });
            router.refresh();
        } catch (err) {
            setNotice({
                kind: "error",
                text: err instanceof Error ? err.message : "Import failed",
            });
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border bg-card p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-serif text-xl font-semibold text-primary">
                            Import dishes from packages
                        </h2>
                        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                            Pull every dish from your existing packages into the custom-menu
                            catalog. Nothing needs to be typed. Dishes that are already
                            present are skipped, so you can run this again safely.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={importAll}
                        disabled={busy || packages.length === 0}
                        className="shrink-0 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {busy ? "Importing..." : "Import all dishes"}
                    </button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                    {packages.length} package{packages.length === 1 ? "" : "s"} ·{" "}
                    {totalDishes} dishes found · {existingCount} already in the catalog
                </p>
                {notice && (
                    <p
                        className={`mt-3 rounded-md px-3 py-2 text-sm ${
                            notice.kind === "ok"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                        }`}
                    >
                        {notice.text}
                    </p>
                )}
            </div>

            {packages.length === 0 ? (
                <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
                    No packages have been created yet. Add them on the Packages page first.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="rounded-lg border bg-card p-5">
                            <div className="flex items-baseline justify-between gap-3">
                                <h3 className="font-serif text-lg font-semibold text-primary">
                                    {pkg.name}
                                </h3>
                                <span className="text-sm font-medium text-secondary">{pkg.price}</span>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {dishCount(pkg)} dishes
                            </p>
                            <div className="mt-3 space-y-1.5">
                                {MENU_CATEGORIES.map((category) =>
                                    (pkg[category]?.length ?? 0) > 0 ? (
                                        <p key={category} className="text-sm">
                                            <span className="font-medium text-foreground">
                                                {CATEGORY_LABELS[category]}:
                                            </span>{" "}
                                            <span className="text-muted-foreground">
                                                {pkg[category].join(", ")}
                                            </span>
                                        </p>
                                    ) : null,
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
