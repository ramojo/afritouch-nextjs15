import Link from "next/link";
import { listQuotes } from "@/lib/quotes";
import { formatKes } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
    const quotes = await listQuotes();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Quotes</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Package inquiries and custom menu requests submitted by customers.
                </p>
            </div>

            {quotes.length === 0 ? (
                <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
                    No quotes yet.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border bg-card">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Customer</th>
                                <th className="px-4 py-3 font-medium">Menu</th>
                                <th className="px-4 py-3 font-medium">Guests</th>
                                <th className="px-4 py-3 font-medium">Event date</th>
                                <th className="px-4 py-3 font-medium">Estimate</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map((q) => (
                                <tr key={q.id} className="border-t hover:bg-muted/20">
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{q.name}</p>
                                        <p className="text-xs text-muted-foreground">{q.email}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p>{q.packageName || (q.kind === "custom" ? "Custom Menu" : "—")}</p>
                                        {q.kind === "custom" && (
                                            <span className="text-xs text-secondary">
                                                {q.lineItems.length} dishes
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{q.guestCount}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{q.eventDate}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {q.estimatedTotal != null
                                            ? formatKes(q.estimatedTotal)
                                            : "Awaiting costing"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-xs capitalize text-primary">
                                            {q.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/admin/quotes/${q.id}`}
                                            className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
