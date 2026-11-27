import storage from "./storage";
import { Quote, QuoteInput, QuotePatch } from "@/app/types/quote";

export async function listQuotes(opts?: {
    status?: string;
    limit?: number;
    offset?: number;
}): Promise<Quote[]> {
    return storage.quotes.list(opts);
}

export async function getQuote(id: string): Promise<Quote | null> {
    return storage.quotes.get(id);
}

export async function createQuote(input: QuoteInput): Promise<Quote> {
    return storage.quotes.create(input);
}

export async function updateQuote(
    id: string,
    patch: QuotePatch,
): Promise<Quote | null> {
    return storage.quotes.update(id, patch);
}
