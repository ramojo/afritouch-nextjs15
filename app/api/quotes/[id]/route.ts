import { NextRequest, NextResponse } from "next/server";
import { getQuote, updateQuote } from "@/lib/quotes";
import { QuotePatch, QUOTE_STATUSES } from "@/app/types/quote";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    const quote = await getQuote(id);
    if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(quote);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    let body: Partial<QuotePatch>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (body.status && !QUOTE_STATUSES.includes(body.status as never)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const updated = await updateQuote(id, body as QuotePatch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
}
