"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Quote, QUOTE_STATUSES, QuoteStatus } from "@/app/types/quote";
import { formatKes } from "@/lib/utils";

export default function QuoteCostEditor({ quote }: { quote: Quote }) {
    const router = useRouter();
    const [prices, setPrices] = useState<Record<string, string>>(
        Object.fromEntries(
            quote.lineItems.map((li, idx) => [
                String(li.itemId ?? `name:${li.name}:${idx}`),
                li.unitPrice == null ? "" : String(li.unitPrice),
            ]),
        ),
    );
    const [status, setStatus] = useState<QuoteStatus>(quote.status);
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

    const keyFor = (itemId: string | null, name: string, idx: number) =>
        String(itemId ?? `name:${name}:${idx}`);

    async function save() {
        setBusy(true);
        setNotice(null);
        try {
            const res = await fetch(`/api/quotes/${encodeURIComponent(quote.id)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status,
                    lineItemPrices: quote.lineItems.map((li, idx) => {
                        const raw = prices[keyFor(li.itemId, li.name, idx)];
                        const value = Number(raw);
                        return {
                            itemId: li.itemId,
                            name: li.name,
                            unitPrice: Number.isFinite(value) && value >= 0 ? Math.round(value) : 0,
                        };
                    }),
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Could not save");
            router.refresh();
            setNotice({ kind: "ok", text: "Quote updated. The estimate has been recalculated." });
        } catch (err) {
            setNotice({ kind: "error", text: err instanceof Error ? err.message : "Save failed" });
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-4">
            {quote.lineItems.length > 0 && (
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full min-w-[520px] text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-2 font-medium">Dish</th>
                                <th className="px-4 py-2 font-medium">Category</th>
                                <th className="px-4 py-2 font-medium">Cost / person (KES)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quote.lineItems.map((li, idx) => (
                                <tr key={keyFor(li.itemId, li.name, idx)} className="border-t">
                                    <td className="px-4 py-2">
                                        {li.name}
                                        {li.custom && (
                                            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                custom
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 capitalize text-muted-foreground">
                                        {li.category}
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={prices[keyFor(li.itemId, li.name, idx)] ?? ""}
                                            onChange={(e) =>
                                                setPrices((prev) => ({
                                                    ...prev,
                                                    [keyFor(li.itemId, li.name, idx)]: e.target.value,
                                                }))
                                            }
                                            className="h-9 w-32 rounded-md border bg-background px-2 text-sm"
                                            placeholder="Set price"
                                            aria-label={`Cost per person for ${li.name}`}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex flex-wrap items-end gap-4">
                <div className="grid gap-1">
                    <label htmlFor="quote-status" className="text-sm font-medium">Status</label>
                    <select
                        id="quote-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as QuoteStatus)}
                        className="h-10 rounded-md border bg-background px-3 text-sm capitalize"
                    >
                        {QUOTE_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    onClick={save}
                    disabled={busy}
                    className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    {busy ? "Saving..." : "Save quote"}
                </button>
                <p className="text-sm text-muted-foreground">
                    Current estimate:{" "}
                    <span className="font-semibold text-primary">
                        {quote.estimatedTotal != null
                            ? formatKes(quote.estimatedTotal)
                            : "Awaiting costing"}
                    </span>
                </p>
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
        </div>
    );
}
