import { Package } from "@/app/types/package";
import {
    MENU_CATEGORIES,
    MenuCategory,
    MenuItemInput,
} from "@/app/types/menu";
import { normalizeItemName, slugify } from "@/lib/utils";

export function uniqueItemKey(category: MenuCategory, name: string): string {
    return `${category}:${normalizeItemName(name)}`;
}

export function catalogFromPackages(packages: Package[]): MenuItemInput[] {
    const seen = new Map<string, MenuItemInput>();
    for (const pkg of packages) {
        for (const category of MENU_CATEGORIES) {
            for (const raw of pkg[category] ?? []) {
                const name = raw.trim();
                if (!name) continue;
                const key = uniqueItemKey(category, name);
                if (!seen.has(key)) {
                    seen.set(key, {
                        name,
                        category,
                        pricePerPerson: 0,
                        active: true,
                        needsCosting: false,
                        notes: "",
                    });
                }
            }
        }
    }
    return [...seen.values()];
}

export function itemIdFromName(category: MenuCategory, name: string): string {
    return slugify(`${category}-${name}`) || `${category}-item`;
}

export function estimatedQuoteTotal(
    guestCount: number,
    lineItems: Array<{ unitPrice: number | null; pendingCosting: boolean }>,
): number | null {
    if (guestCount < 1) return null;
    const priced = lineItems.filter(
        (l) => !l.pendingCosting && l.unitPrice != null && l.unitPrice > 0,
    );
    if (priced.length === 0) return null;
    const perPerson = priced.reduce((sum, l) => sum + (l.unitPrice ?? 0), 0);
    return perPerson * guestCount;
}
