import { MenuCategory } from "./menu";

export const QUOTE_STATUSES = [
    "new",
    "contacted",
    "quoted",
    "booked",
    "cancelled",
    "archived",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export type QuoteKind = "package" | "custom";

export interface QuoteLineItem {
    itemId: string | null;
    name: string;
    category: MenuCategory;
    unitPrice: number | null;
    custom: boolean;
    pendingCosting: boolean;
}

export interface Quote {
    id: string;
    kind: QuoteKind;
    packageId: string | null;
    packageName: string | null;
    name: string;
    email: string;
    phone: string;
    whatsapp: string | null;
    guestCount: number;
    eventDate: string;
    location: string;
    notes: string | null;
    lineItems: QuoteLineItem[];
    estimatedTotal: number | null;
    status: QuoteStatus;
    createdAt: string;
    updatedAt: string;
}

export interface QuoteInput {
    kind?: QuoteKind;
    packageId?: string | null;
    packageName?: string | null;
    name: string;
    email: string;
    phone: string;
    whatsapp?: string | null;
    guestCount: number;
    eventDate: string;
    location: string;
    notes?: string | null;
    lineItems?: Array<{
        itemId?: string | null;
        name: string;
        category: MenuCategory;
        custom?: boolean;
    }>;
}

export type QuotePatch = {
    status?: QuoteStatus;
    lineItemPrices?: Array<{ itemId: string; unitPrice: number }>;
};
