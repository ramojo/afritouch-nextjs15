"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CATEGORY_LABELS,
    MENU_CATEGORIES,
    MenuCategory,
    MenuItem,
} from "@/app/types/menu";
import { formatKes } from "@/lib/utils";

type Notice = { kind: "ok" | "error"; text: string } | null;

export default function MenuItemsManager({ initialItems }: { initialItems: MenuItem[] }) {
    const router = useRouter();
    const [items, setItems] = useState(initialItems);
    const [edits, setEdits] = useState<Record<string, MenuItem>>({});
    const [busyId, setBusyId] = useState<string | null>(null);
    const [notice, setNotice] = useState<Notice>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [newItem, setNewItem] = useState({
        name: "",
        category: "starch" as MenuCategory,
        pricePerPerson: "0",
        notes: "",
    });

    function draft(id: string): MenuItem {
        return edits[id] ?? items.find((i) => i.id === id)!;
    }

    function change(id: string, patch: Partial<MenuItem>) {
        setEdits((prev) => ({ ...prev, [id]: { ...draft(id), ...patch } }));
    }

    function isDirty(id: string): boolean {
        const current = edits[id];
        const original = items.find((i) => i.id === id);
        return !!current && !!original && JSON.stringify(current) !== JSON.stringify(original);
    }

    async function save(id: string) {
        setBusyId(id);
        setNotice(null);
        try {
            const d = draft(id);
            const res = await fetch(`/api/menu-items/${encodeURIComponent(id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: d.name,
                    category: d.category,
                    pricePerPerson: Number(d.pricePerPerson),
                    active: d.active,
                    needsCosting: d.needsCosting,
                    notes: d.notes,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Could not save the dish");
            setItems((prev) => prev.map((i) => (i.id === id ? data as MenuItem : i)));
            setEdits((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            setNotice({ kind: "ok", text: `Saved ${data.name}.` });
            router.refresh();
        } catch (err) {
            setNotice({ kind: "error", text: err instanceof Error ? err.message : "Save failed" });
        } finally {
            setBusyId(null);
        }
    }

    async function remove(id: string) {
        const item = items.find((i) => i.id === id);
        if (!item || !confirm(`Remove "${item.name}" from the catalog?`)) return;
        setBusyId(id);
        setNotice(null);
        try {
            const res = await fetch(`/api/menu-items/${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Could not delete the dish");
            }
            setItems((prev) => prev.filter((i) => i.id !== id));
            setNotice({ kind: "ok", text: `Removed ${item.name}.` });
            router.refresh();
        } catch (err) {
            setNotice({ kind: "error", text: err instanceof Error ? err.message : "Delete failed" });
        } finally {
            setBusyId(null);
        }
    }

    async function createItem(e: React.FormEvent) {
        e.preventDefault();
        setBusyId("new");
        setNotice(null);
        try {
            const res = await fetch("/api/menu-items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newItem.name,
                    category: newItem.category,
                    pricePerPerson: Number(newItem.pricePerPerson) || 0,
                    notes: newItem.notes,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Could not add the dish");
            setItems((prev) =>
                [...prev, data as MenuItem].sort((a, b) =>
                    a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
                ),
            );
            setNewItem({ name: "", category: "starch", pricePerPerson: "0", notes: "" });
            setShowAdd(false);
            setNotice({ kind: "ok", text: `Added ${data.name}.` });
            router.refresh();
        } catch (err) {
            setNotice({ kind: "error", text: err instanceof Error ? err.message : "Add failed" });
        } finally {
            setBusyId(null);
        }
    }

    async function runAction(action: "seed" | "clear") {
        if (action === "clear" && !confirm("Delete every dish from the catalog?")) return;
        setBusyId("action");
        setNotice(null);
        try {
            const res = await fetch(`/api/menu-items?action=${action}`, {
                method: "POST",
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Action failed");
            const fresh = await fetch("/api/menu-items").then((r) => r.json());
            setItems(fresh as MenuItem[]);
            setEdits({});
            setNotice({
                kind: "ok",
                text:
                    action === "seed"
                        ? `Imported ${data.seeded ?? 0} dishes from your packages.`
                        : `Removed ${data.cleared ?? 0} dishes.`,
            });
            router.refresh();
        } catch (err) {
            setNotice({ kind: "error", text: err instanceof Error ? err.message : "Action failed" });
        } finally {
            setBusyId(null);
        }
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => setShowAdd((v) => !v)}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                    {showAdd ? "Cancel" : "+ New dish"}
                </button>
                <button
                    type="button"
                    onClick={() => runAction("seed")}
                    disabled={busyId === "action"}
                    className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                >
                    Import from packages
                </button>
                <button
                    type="button"
                    onClick={() => runAction("clear")}
                    disabled={busyId === "action" || items.length === 0}
                    className="rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                    Clear catalog
                </button>
            </div>

            {notice && (
                <p
                    className={`rounded-md px-3 py-2 text-sm ${
                        notice.kind === "ok"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                    }`}
                >
                    {notice.text}
                </p>
            )}

            {showAdd && (
                <form onSubmit={createItem} className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2">
                    <div className="grid gap-1">
                        <label className="text-sm font-medium" htmlFor="new-name">Name</label>
                        <input
                            id="new-name"
                            required
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="h-10 rounded-md border bg-background px-3 text-sm"
                            placeholder="e.g. Wali rice"
                        />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-sm font-medium" htmlFor="new-category">Category</label>
                        <select
                            id="new-category"
                            value={newItem.category}
                            onChange={(e) =>
                                setNewItem({ ...newItem, category: e.target.value as MenuCategory })
                            }
                            className="h-10 rounded-md border bg-background px-3 text-sm"
                        >
                            {MENU_CATEGORIES.map((c) => (
                                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-sm font-medium" htmlFor="new-price">
                            Cost per person (KES)
                        </label>
                        <input
                            id="new-price"
                            type="number"
                            min="0"
                            step="1"
                            value={newItem.pricePerPerson}
                            onChange={(e) =>
                                setNewItem({ ...newItem, pricePerPerson: e.target.value })
                            }
                            className="h-10 rounded-md border bg-background px-3 text-sm"
                        />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-sm font-medium" htmlFor="new-notes">Notes</label>
                        <input
                            id="new-notes"
                            value={newItem.notes}
                            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                            className="h-10 rounded-md border bg-background px-3 text-sm"
                            placeholder="Optional"
                        />
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={busyId === "new"}
                            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {busyId === "new" ? "Adding..." : "Add dish"}
                        </button>
                    </div>
                </form>
            )}

            {items.length === 0 ? (
                <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
                    No dishes yet. Import them from your packages or add one manually.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border bg-card">
                    <table className="w-full min-w-[760px] text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Dish</th>
                                <th className="px-4 py-3 font-medium">Category</th>
                                <th className="px-4 py-3 font-medium">Cost / person</th>
                                <th className="px-4 py-3 font-medium">Available</th>
                                <th className="px-4 py-3 font-medium">Needs costing</th>
                                <th className="px-4 py-3 font-medium">Notes</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const d = draft(item.id);
                                return (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-2">
                                            <input
                                                value={d.name}
                                                onChange={(e) => change(item.id, { name: e.target.value })}
                                                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
                                                aria-label={`Name for ${item.name}`}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={d.category}
                                                onChange={(e) =>
                                                    change(item.id, {
                                                        category: e.target.value as MenuCategory,
                                                    })
                                                }
                                                className="rounded-md border bg-background px-2 py-1.5 text-sm"
                                                aria-label={`Category for ${item.name}`}
                                            >
                                                {MENU_CATEGORIES.map((c) => (
                                                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={d.pricePerPerson}
                                                onChange={(e) =>
                                                    change(item.id, {
                                                        pricePerPerson: Number(e.target.value) || 0,
                                                    })
                                                }
                                                className="w-28 rounded-md border bg-background px-2 py-1.5 text-sm"
                                                aria-label={`Cost per person for ${item.name}`}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={d.active}
                                                onChange={(e) => change(item.id, { active: e.target.checked })}
                                                className="h-4 w-4 accent-primary"
                                                aria-label={`Available: ${item.name}`}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={d.needsCosting}
                                                onChange={(e) =>
                                                    change(item.id, { needsCosting: e.target.checked })
                                                }
                                                className="h-4 w-4"
                                                aria-label={`Needs costing: ${item.name}`}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                value={d.notes}
                                                onChange={(e) => change(item.id, { notes: e.target.value })}
                                                className="w-full min-w-[120px] rounded-md border bg-background px-2 py-1.5 text-sm"
                                                placeholder="—"
                                                aria-label={`Notes for ${item.name}`}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => save(item.id)}
                                                    disabled={!isDirty(item.id) || busyId === item.id}
                                                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEdits((prev) => {
                                                            const next = { ...prev };
                                                            delete next[item.id];
                                                            return next;
                                                        })
                                                    }
                                                    disabled={!isDirty(item.id)}
                                                    className="rounded-md border px-2 py-1.5 text-xs hover:bg-muted disabled:opacity-40"
                                                >
                                                    Undo
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(item.id)}
                                                    disabled={busyId === item.id}
                                                    className="rounded-md border px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                Costs are per person in KES. Dishes marked &ldquo;needs costing&rdquo; or
                with no cost appear as &ldquo;Awaiting costing&rdquo; on the custom menu
                builder and are excluded from the estimate. Currently {items.length} dish
                {items.length === 1 ? "" : "es"} in the catalog
                {items.some((i) => i.pricePerPerson > 0) &&
                    ` (e.g. ${formatKes(Math.max(...items.map((i) => i.pricePerPerson)))} highest)`}
                .
            </p>
        </div>
    );
}
