export const MENU_CATEGORIES = [
    "starch",
    "protein",
    "vegetables",
    "dessert",
    "drinks",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
    starch: "Starch",
    protein: "Proteins",
    vegetables: "Vegetables",
    dessert: "Dessert",
    drinks: "Drinks",
};

export interface MenuItem {
    id: string;
    name: string;
    category: MenuCategory;
    /** Per-person price in whole KES. 0 means not yet priced. */
    pricePerPerson: number;
    active: boolean;
    needsCosting: boolean;
    notes: string;
}

export type MenuItemInput = {
    name: string;
    category: MenuCategory;
    pricePerPerson?: number;
    active?: boolean;
    needsCosting?: boolean;
    notes?: string;
};

export type MenuItemPatch = Partial<MenuItemInput>;
