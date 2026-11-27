import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuote } from "@/lib/quotes";
import QuoteCostEditor from "./QuoteCostEditor";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const quote = await getQuote(id);
    if (!quote) notFound();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <Link href="/admin/quotes" className="text-sm text-muted-foreground hover:underline">
                        ← All quotes
                    </Link>
                    <h1 className="mt-2 text-3xl font-serif font-bold text-primary">
                        {quote.packageName || (quote.kind === "custom" ? "Custom Menu" : "Quote")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Submitted {new Date(quote.createdAt).toLocaleString("en-KE")}
                    </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize text-primary">
                    {quote.kind} menu
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4 rounded-lg border bg-card p-5 text-sm">
                    <h2 className="font-serif text-xl font-semibold text-primary">Customer</h2>
                    <dl className="space-y-2">
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Name</dt>
                            <dd className="font-medium">{quote.name}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd><a href={`mailto:${quote.email}`} className="underline">{quote.email}</a></dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd>{quote.phone}</dd>
                        </div>
                        {quote.whatsapp && (
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">WhatsApp</dt>
                                <dd>{quote.whatsapp}</dd>
                            </div>
                        )}
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Guests</dt>
                            <dd>{quote.guestCount}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Event date</dt>
                            <dd>{quote.eventDate}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Location</dt>
                            <dd className="text-right">{quote.location}</dd>
                        </div>
                    </dl>
                    {quote.notes && (
                        <div>
                            <dt className="text-muted-foreground">Notes</dt>
                            <dd className="mt-1 rounded-md bg-muted/40 p-3">{quote.notes}</dd>
                        </div>
                    )}
                </section>

                <section className="space-y-4 rounded-lg border bg-card p-5">
                    <h2 className="font-serif text-xl font-semibold text-primary">
                        Menu & costing
                    </h2>
                    <QuoteCostEditor quote={quote} />
                </section>
            </div>
        </div>
    );
}
