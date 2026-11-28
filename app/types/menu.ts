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

/**
 * Icons an admin can assign to a dish. "auto" keeps the existing
 * name/category-based suggestion; the rest are explicit Tabler icon choices.
 */
export const MENU_ICON_KEYS = [
    "auto",
    "bowl",
    "bowl-chopsticks",
    "bread",
    "soup",
    "meat",
    "fish",
    "salad",
    "leaf",
    "apple",
    "cherry",
    "grape",
    "ice-cream",
    "cake",
    "chocolate",
    "egg",
    "cup",
    "bottle",
    "droplets",
    "bubble-tea",
    "coffee",
    "grill-fork",
] as const;

export type MenuIconKey = (typeof MENU_ICON_KEYS)[number];
export type ExplicitMenuIconKey = Exclude<MenuIconKey, "auto">;

export const MENU_ICON_LABELS: Record<MenuIconKey, string> = {
    auto: "Auto (suggest from dish)",
    bowl: "Rice / bowl",
    "bowl-chopsticks": "Stir-fried rice / noodles",
    bread: "Bread / chapati",
    soup: "Stew / soup",
    meat: "Meat / chicken",
    fish: "Fish",
    salad: "Salad / vegetables",
    leaf: "Leafy greens",
    apple: "Apple / fruit",
    cherry: "Fruit cuts",
    grape: "Fruit platter",
    "ice-cream": "Ice cream",
    cake: "Cake",
    chocolate: "Chocolate",
    egg: "Egg",
    cup: "Soda / cup",
    bottle: "Water bottle",
    droplets: "Mineral water",
    "bubble-tea": "Juice / cold drink",
    coffee: "Tea / coffee",
    "grill-fork": "Mixed grill",
};

export function isMenuIconKey(value: unknown): value is MenuIconKey {
    return (
        typeof value === "string" &&
        (MENU_ICON_KEYS as readonly string[]).includes(value)
    );
}

export function normalizeMenuIconKey(value: unknown): MenuIconKey {
    return isMenuIconKey(value) ? value : "auto";
}

export interface MenuItem {
    id: string;
    name: string;
    category: MenuCategory;
    /** Per-person price in whole KES. 0 means not yet priced. */
    pricePerPerson: number;
    active: boolean;
    needsCosting: boolean;
    notes: string;
    /** Tabler icon chosen by an admin, or "auto" to suggest from the dish. */
    iconKey: MenuIconKey;
}

export type MenuItemInput = {
    name: string;
    category: MenuCategory;
    pricePerPerson?: number;
    active?: boolean;
    needsCosting?: boolean;
    notes?: string;
    iconKey?: MenuIconKey;
};

export type MenuItemPatch = Partial<MenuItemInput>;
