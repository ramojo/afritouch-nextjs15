import { NextRequest, NextResponse } from "next/server";
import { listQuotes } from "@/lib/quotes";
import { QUOTE_STATUSES } from "@/app/types/quote";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? undefined;
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    if (status && !QUOTE_STATUSES.includes(status as never)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const quotes = await listQuotes({
        status,
        limit: limitParam ? parseInt(limitParam, 10) : undefined,
        offset: offsetParam ? parseInt(offsetParam, 10) : undefined,
    });
    return NextResponse.json(quotes);
}
