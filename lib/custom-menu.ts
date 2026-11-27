import { MenuItem } from "@/app/types/menu";
import { estimatedQuoteTotal } from "@/lib/menu-catalog";
import { formatKes } from "@/lib/utils";

/** True when an item has an admin-set price and doesn't need manual costing. */
export function isPriced(item: MenuItem): boolean {
    return !item.needsCosting && item.pricePerPerson > 0;
}

/**
 * Cost summary for the selected dishes. Items awaiting costing are excluded
 * from the estimate but returned so the UI can flag them to the customer.
 */
export function customMenuCost(guestCount: number, items: MenuItem[]) {
    const priced = items.filter(isPriced);
    const awaitingCosting = items.filter((item) => !isPriced(item));
    const perPerson = priced.length
        ? priced.reduce((sum, item) => sum + item.pricePerPerson, 0)
        : null;

    return {
        perPerson,
        total: estimatedQuoteTotal(
            guestCount,
            items.map((item) => ({
                unitPrice: item.pricePerPerson,
                pendingCosting: !isPriced(item),
            })),
        ),
        awaitingCosting,
    };
}

export function displayCost(amount: number | null): string {
    return amount == null ? "Awaiting costing" : formatKes(amount);
}
