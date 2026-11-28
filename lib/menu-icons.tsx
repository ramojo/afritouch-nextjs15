"use client";

import {
    IconApple,
    IconBottle,
    IconBowl,
    IconBowlChopsticks,
    IconBread,
    IconBubbleTea,
    IconCake,
    IconCherry,
    IconChocolate,
    IconCoffee,
    IconCup,
    IconDroplets,
    IconEggFried,
    IconFish,
    IconGrape,
    IconGrillFork,
    IconIceCream,
    IconLeaf,
    IconMeat,
    IconSalad,
    IconSoup,
    type TablerIcon,
} from "@tabler/icons-react";
import {
    type ExplicitMenuIconKey,
    type MenuCategory,
    type MenuItem,
    normalizeMenuIconKey,
} from "@/app/types/menu";
import { normalizeItemName } from "@/lib/utils";

export type MenuIconComponent = TablerIcon;

/** Every selectable icon, keyed by the value stored on a menu item. */
export const MENU_ICON_COMPONENTS: Record<
    ExplicitMenuIconKey,
    MenuIconComponent
> = {
    bowl: IconBowl,
    "bowl-chopsticks": IconBowlChopsticks,
    bread: IconBread,
    soup: IconSoup,
    meat: IconMeat,
    fish: IconFish,
    salad: IconSalad,
    leaf: IconLeaf,
    apple: IconApple,
    cherry: IconCherry,
    grape: IconGrape,
    "ice-cream": IconIceCream,
    cake: IconCake,
    chocolate: IconChocolate,
    egg: IconEggFried,
    cup: IconCup,
    bottle: IconBottle,
    droplets: IconDroplets,
    "bubble-tea": IconBubbleTea,
    coffee: IconCoffee,
    "grill-fork": IconGrillFork,
};

export const CATEGORY_ICONS: Record<MenuCategory, MenuIconComponent> = {
    starch: MENU_ICON_COMPONENTS.bowl,
    protein: MENU_ICON_COMPONENTS.meat,
    vegetables: MENU_ICON_COMPONENTS.salad,
    dessert: MENU_ICON_COMPONENTS.cake,
    drinks: MENU_ICON_COMPONENTS.bottle,
};

// Exact dish names imported from packages.json. Keyword rules below are only a
// fallback for manually added dishes. Rice/Pilau always resolves to a bowl,
// never to a glass or wine-glass icon.
const MENU_ICON_BY_NAME: Record<string, ExplicitMenuIconKey> = {
    pilau: "bowl",
    "swahili pilau": "bowl",
    "vegetable rice": "bowl",
    "rice garnished with vegetables": "bowl",
    "swahili rice": "bowl",
    "vegetable stir-fried rice": "bowl-chopsticks",
    "chinese stir-fried rice": "bowl-chopsticks",
    chapati: "bread",
    "white and brown chapati": "bread",
    "soft layered chapati": "bread",
    "a choice of mukimo, mashed potatoes or parsley potatoes": "bowl",
    "mukimo or parsley potatoes": "bowl",
    "roast potatoes/wedges": "bowl",
    "extra starch option": "bowl",
    "extra starch options": "bowl",
    "beef stew": "soup",
    "beef wet fry/stew": "soup",
    chicken: "meat",
    "glazed chicken": "meat",
    "goat fry, pork or fish": "grill-fork",
    "mbuzi wet fry": "meat",
    "pan seared fish fillet": "fish",
    "vegetable salad or cooked vegetables": "salad",
    "stir fried vegetables": "salad",
    "vegetarian option": "salad",
    "assortment of stir fried vegetables": "salad",
    "creamed spinach": "leaf",
    "traditional vegetables": "leaf",
    "fruit in season": "apple",
    "fruit cuts": "cherry",
    "fruit cuts or ice cream": "ice-cream",
    "assorted fruit platter": "grape",
    "ice cream": "ice-cream",
    "cake slices": "cake",
    soda: "cup",
    water: "bottle",
    "mineral water": "droplets",
    "fresh juice": "bubble-tea",
    "tea/coffee": "coffee",
};

const MENU_ICON_RULES: Array<{
    test: RegExp;
    icon: ExplicitMenuIconKey;
}> = [
    { test: /ice\s*cream|gelato|milkshake/i, icon: "ice-cream" },
    { test: /cake|cookie|biscuit/i, icon: "cake" },
    { test: /chocolate/i, icon: "chocolate" },
    { test: /fruit platter|grape|berry/i, icon: "grape" },
    { test: /fruit cuts|citrus|orange|lemon/i, icon: "cherry" },
    { test: /fruit/i, icon: "apple" },
    { test: /tea|coffee/i, icon: "coffee" },
    { test: /juice|smoothie/i, icon: "bubble-tea" },
    { test: /soda|fizzy|carbonated/i, icon: "cup" },
    { test: /mineral water/i, icon: "droplets" },
    { test: /water/i, icon: "bottle" },
    { test: /fish|seafood/i, icon: "fish" },
    { test: /egg/i, icon: "egg" },
    { test: /soup|stew/i, icon: "soup" },
    { test: /beef|goat|pork|mbuzi|chicken|fry|roast|meat/i, icon: "meat" },
    { test: /chapati|flatbread|bread|naan/i, icon: "bread" },
    { test: /rice|pilau|starch|potato|mukimo|wedge/i, icon: "bowl" },
    { test: /spinach|greens|leaf|vegetarian/i, icon: "leaf" },
    { test: /salad|vegetable/i, icon: "salad" },
];

/** The icon Tabler would suggest when no explicit choice has been made. */
export function suggestedMenuIconKey(
    item: Pick<MenuItem, "name" | "category">,
): ExplicitMenuIconKey {
    return (
        MENU_ICON_BY_NAME[normalizeItemName(item.name)] ??
        MENU_ICON_RULES.find((rule) => rule.test.test(item.name))?.icon ??
        categoryIconKey(item.category)
    );
}

function categoryIconKey(category: MenuCategory): ExplicitMenuIconKey {
    switch (category) {
        case "starch":
            return "bowl";
        case "protein":
            return "meat";
        case "vegetables":
            return "salad";
        case "dessert":
            return "cake";
        case "drinks":
            return "bottle";
    }
}

/** Explicit admin choice wins; otherwise fall back to the dish suggestion. */
export function menuIconKeyFor(
    item: Pick<MenuItem, "name" | "category" | "iconKey">,
): ExplicitMenuIconKey {
    const chosen = normalizeMenuIconKey(item.iconKey);
    return chosen === "auto" ? suggestedMenuIconKey(item) : chosen;
}

export function MenuIcon({
    item,
    className,
}: {
    item: Pick<MenuItem, "name" | "category" | "iconKey">;
    className?: string;
}) {
    const Icon = MENU_ICON_COMPONENTS[menuIconKeyFor(item)];
    return (
        <Icon
            className={className}
            size="1em"
            stroke={1.6}
            aria-hidden="true"
        />
    );
}
