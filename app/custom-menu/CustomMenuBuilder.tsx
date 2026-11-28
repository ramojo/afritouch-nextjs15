"use client";

import React, { useState } from "react";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MeasuringStrategy,
    PointerSensor,
    TouchSensor,
    closestCenter,
    pointerWithin,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
    type CollisionDetection,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { Check, GripVertical, Info, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import {
    CATEGORY_LABELS,
    MENU_CATEGORIES,
    MenuCategory,
    MenuItem,
} from "@/app/types/menu";
import { QuoteLineItem } from "@/app/types/quote";
import QuoteDialog from "@/components/QuoteDialog";
import {
    customMenuCost,
    displayCost,
    isPriced,
} from "@/lib/custom-menu";
import { formatKes, normalizeItemName } from "@/lib/utils";

type MenuIconComponent = TablerIcon;

// Tabler has dedicated food icons. Rice/Pilau dishes use bowls, never the
// glass or wine-glass icons, so the icon matches the actual dish.
const CATEGORY_ICONS: Record<MenuCategory, MenuIconComponent> = {
    starch: IconBowl,
    protein: IconMeat,
    vegetables: IconSalad,
    dessert: IconCake,
    drinks: IconBottle,
};

// Exact dish names imported from packages.json. Keyword rules below are only a
// fallback for dishes added manually by an admin.
const MENU_ICON_BY_NAME: Record<string, MenuIconComponent> = {
    pilau: IconBowl,
    "swahili pilau": IconBowl,
    "vegetable rice": IconBowl,
    "rice garnished with vegetables": IconBowl,
    "swahili rice": IconBowl,
    "vegetable stir-fried rice": IconBowlChopsticks,
    "chinese stir-fried rice": IconBowlChopsticks,
    chapati: IconBread,
    "white and brown chapati": IconBread,
    "soft layered chapati": IconBread,
    "a choice of mukimo, mashed potatoes or parsley potatoes": IconBowl,
    "mukimo or parsley potatoes": IconBowl,
    "roast potatoes/wedges": IconBowl,
    "extra starch option": IconBowl,
    "extra starch options": IconBowl,
    "beef stew": IconSoup,
    "beef wet fry/stew": IconSoup,
    chicken: IconMeat,
    "glazed chicken": IconMeat,
    "goat fry, pork or fish": IconGrillFork,
    "mbuzi wet fry": IconMeat,
    "pan seared fish fillet": IconFish,
    "vegetable salad or cooked vegetables": IconSalad,
    "stir fried vegetables": IconSalad,
    "vegetarian option": IconSalad,
    "assortment of stir fried vegetables": IconSalad,
    "creamed spinach": IconLeaf,
    "traditional vegetables": IconLeaf,
    "fruit in season": IconApple,
    "fruit cuts": IconCherry,
    "fruit cuts or ice cream": IconIceCream,
    "assorted fruit platter": IconGrape,
    "ice cream": IconIceCream,
    "cake slices": IconCake,
    soda: IconCup,
    water: IconBottle,
    "mineral water": IconDroplets,
    "fresh juice": IconBubbleTea,
    "tea/coffee": IconCoffee,
};

const MENU_ICON_RULES: Array<{ test: RegExp; icon: MenuIconComponent }> = [
    { test: /ice\s*cream|gelato|milkshake/i, icon: IconIceCream },
    { test: /cake|cookie|biscuit/i, icon: IconCake },
    { test: /chocolate/i, icon: IconChocolate },
    { test: /fruit platter|grape|berry/i, icon: IconGrape },
    { test: /fruit cuts|citrus|orange|lemon/i, icon: IconCherry },
    { test: /fruit/i, icon: IconApple },
    { test: /tea|coffee/i, icon: IconCoffee },
    { test: /juice|smoothie/i, icon: IconBubbleTea },
    { test: /soda|fizzy|carbonated/i, icon: IconCup },
    { test: /mineral water/i, icon: IconDroplets },
    { test: /water/i, icon: IconBottle },
    { test: /fish|seafood/i, icon: IconFish },
    { test: /egg/i, icon: IconEggFried },
    { test: /soup|stew/i, icon: IconSoup },
    { test: /beef|goat|pork|mbuzi|chicken|fry|roast|meat/i, icon: IconMeat },
    { test: /chapati|flatbread|bread|naan/i, icon: IconBread },
    { test: /rice|pilau|starch|potato|mukimo|wedge/i, icon: IconBowl },
    { test: /spinach|greens|leaf|vegetarian/i, icon: IconLeaf },
    { test: /salad|vegetable/i, icon: IconSalad },
];

function menuIconFor(item: MenuItem): MenuIconComponent {
    return (
        MENU_ICON_BY_NAME[normalizeItemName(item.name)] ??
        MENU_ICON_RULES.find((rule) => rule.test.test(item.name))?.icon ??
        CATEGORY_ICONS[item.category]
    );
}

function MenuIcon({ item, className }: { item: MenuItem; className?: string }) {
    const Icon = menuIconFor(item);
    return (
        <Icon
            className={className}
            size="1em"
            stroke={1.6}
            aria-hidden="true"
        />
    );
}

// Only the "Your menu" sidebar is a droppable. Using pointerWithin prevents a
// large surrounding catalogue from winning collision detection, while
// closestCenter keeps keyboard dragging usable.
const collisionDetection: CollisionDetection = (args) =>
    args.pointerCoordinates ? pointerWithin(args) : closestCenter(args);

function CatalogCard({
    item,
    selected,
    onAdd,
}: {
    item: MenuItem;
    selected: boolean;
    onAdd: () => void;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `catalog-${item.id}`,
        data: { source: "catalog", item },
        disabled: selected,
    });

    return (
        <div
            ref={setNodeRef}
            className={`group flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-sm shadow-sm transition-colors ${
                selected
                    ? "border-secondary/60 bg-secondary/10 opacity-70"
                    : "cursor-grab border-border hover:border-primary/50 active:cursor-grabbing"
            } ${isDragging ? "opacity-40" : ""}`}
            {...(selected ? {} : listeners)}
            {...(selected ? {} : attributes)}
        >
            <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <MenuIcon item={item} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {isPriced(item)
                            ? `${formatKes(item.pricePerPerson)} / person`
                            : "Awaiting costing"}
                    </p>
                </div>
            </div>
            {selected ? (
                <Check className="h-4 w-4 shrink-0 text-secondary" aria-label="Already added" />
            ) : (
                <button
                    type="button"
                    onClick={onAdd}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    aria-label={`Add ${item.name}`}
                    title="Add to my menu"
                >
                    <Plus className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

function SelectedCard({
    item,
    onRemove,
}: {
    item: MenuItem;
    onRemove: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `selected-${item.id}`,
        data: { source: "selection", item },
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                // The DragOverlay handles the active item's movement; only
                // shuffle the other cards while reordering.
                transform: isDragging
                    ? undefined
                    : CSS.Transform.toString(transform),
                transition,
            }}
            className={`flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 shadow-sm ${
                isDragging ? "z-10 opacity-50" : ""
            }`}
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="cursor-grab rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
                aria-label={`Reorder ${item.name}`}
            >
                <GripVertical className="h-4 w-4" />
            </button>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <MenuIcon item={item} className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[item.category]} ·{" "}
                    {isPriced(item)
                        ? `${formatKes(item.pricePerPerson)} / person`
                        : "Awaiting costing"}
                </p>
            </div>
            <button
                type="button"
                onClick={onRemove}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={`Remove ${item.name}`}
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

function SelectionDropZone({ children }: { children: React.ReactNode }) {
    // This hook must live inside DndContext. Calling it in CustomMenuBuilder
    // (which only renders DndContext) leaves the droppable unregistered.
    const { setNodeRef, isOver } = useDroppable({ id: "selection" });

    return (
        <div
            ref={setNodeRef}
            className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
                isOver
                    ? "border-secondary bg-secondary/10"
                    : "border-border bg-card/60"
            }`}
        >
            {children}
        </div>
    );
}

export default function CustomMenuBuilder({ items }: { items: MenuItem[] }) {
    const [selected, setSelected] = useState<MenuItem[]>([]);
    const [guestCount, setGuestCount] = useState(50);
    const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
    const [quoteOpen, setQuoteOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 180, tolerance: 6 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const cost = customMenuCost(guestCount, selected);
    const lineItems: QuoteLineItem[] = selected.map((item) => ({
        itemId: item.id,
        name: item.name,
        category: item.category,
        custom: false,
        unitPrice: isPriced(item) ? item.pricePerPerson : null,
        pendingCosting: !isPriced(item),
    }));

    function addItem(item: MenuItem, index = selected.length) {
        setSelected((prev) => {
            if (prev.some((s) => s.id === item.id)) return prev;
            const next = [...prev];
            next.splice(index, 0, item);
            return next;
        });
    }

    function handleDragStart(event: DragStartEvent) {
        const activeId = String(event.active.id);
        setActiveItem(
            (event.active.data.current?.item as MenuItem | undefined) ??
                items.find((item) => `catalog-${item.id}` === activeId) ??
                selected.find((item) => `selected-${item.id}` === activeId) ??
                null,
        );
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveItem(null);
        const { active, over } = event;

        const activeId = String(active.id);
        // Infer from the id as a fallback in case custom data is unavailable.
        const source =
            active.data.current?.source ??
            (activeId.startsWith("selected-") ? "selection" : "catalog");
        const itemId = activeId.replace(/^(catalog|selected)-/, "");
        const overId = over ? String(over.id) : null;

        if (source === "catalog") {
            // Only the sidebar can accept catalogue drags. Dropping back on the
            // catalogue (or nowhere) is a no-op.
            if (
                !overId ||
                (overId !== "selection" && !overId.startsWith("selected-"))
            ) {
                return;
            }
            const item = items.find((i) => i.id === itemId);
            if (!item) return;
            const overIndex = overId.startsWith("selected-")
                ? selected.findIndex((s) => s.id === overId.slice("selected-".length))
                : -1;
            addItem(item, overIndex >= 0 ? overIndex : selected.length);
            return;
        }

        if (source === "selection") {
            // Dragging a selected dish outside the sidebar removes it.
            if (!overId) {
                setSelected((prev) => prev.filter((s) => s.id !== itemId));
                return;
            }
            if (overId === "selection" || overId === active.id) return;
            if (overId.startsWith("selected-")) {
                const targetId = overId.slice("selected-".length);
                setSelected((prev) => {
                    const from = prev.findIndex((s) => s.id === itemId);
                    const to = prev.findIndex((s) => s.id === targetId);
                    return from < 0 || to < 0 ? prev : arrayMove(prev, from, to);
                });
            }
        }
    }

    const grouped = MENU_CATEGORIES.map((category) => ({
        category,
        items: items.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);

    return (
        <DndContext
            id="custom-menu-dnd"
            sensors={sensors}
            collisionDetection={collisionDetection}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
            onDragStart={handleDragStart}
            onDragCancel={() => setActiveItem(null)}
            onDragEnd={handleDragEnd}
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
                {/* Catalogue */}
                <section className="space-y-5">
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="font-serif text-xl font-semibold text-primary">
                            Available dishes
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Drag a dish into your menu, or tap the plus button to add it.
                        </p>
                    </div>

                    {grouped.length === 0 ? (
                        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
                            No dishes are available yet. Please check back soon.
                        </div>
                    ) : (
                        <div className="space-y-5 rounded-xl p-1">
                            {grouped.map(({ category, items: groupItems }) => {
                                const CategoryIcon = CATEGORY_ICONS[category];
                                return (
                                    <div key={category} className="space-y-2">
                                        <h3 className="flex items-center gap-2 font-serif text-base font-semibold text-primary">
                                            <CategoryIcon className="h-4 w-4" />
                                            {CATEGORY_LABELS[category]}
                                        </h3>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {groupItems.map((item) => (
                                                <CatalogCard
                                                    key={item.id}
                                                    item={item}
                                                    selected={selected.some(
                                                        (s) => s.id === item.id,
                                                    )}
                                                    onAdd={() => addItem(item)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Selected menu + summary */}
                <aside className="space-y-4 lg:sticky lg:top-24">
                    <SelectionDropZone>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-serif text-xl font-semibold text-primary">
                                Your menu
                            </h2>
                            {selected.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSelected([])}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600"
                                >
                                    <Trash2 className="h-3.5 w-3.5" /> Clear all
                                </button>
                            )}
                        </div>
                        {selected.length === 0 ? (
                            <p className="py-10 text-center text-sm text-muted-foreground">
                                Drop dishes here to build your menu.
                            </p>
                        ) : (
                            <SortableContext
                                items={selected.map((item) => `selected-${item.id}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {selected.map((item) => (
                                        <SelectedCard
                                            key={item.id}
                                            item={item}
                                            onRemove={() =>
                                                setSelected((prev) =>
                                                    prev.filter((s) => s.id !== item.id),
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        )}
                    </SelectionDropZone>

                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="grid gap-2">
                            <label
                                htmlFor="guestCount"
                                className="text-sm font-medium text-foreground"
                            >
                                Number of guests
                            </label>
                            <input
                                id="guestCount"
                                type="number"
                                min={1}
                                max={10000}
                                value={guestCount}
                                onChange={(e) =>
                                    setGuestCount(Math.max(1, Number(e.target.value) || 1))
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                        <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <dt>Per person</dt>
                                <dd>
                                    {cost.perPerson != null
                                        ? formatKes(cost.perPerson)
                                        : "—"}
                                </dd>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <dt>Dishes</dt>
                                <dd>{selected.length}</dd>
                            </div>
                            <div className="flex justify-between border-t pt-2 text-base font-semibold text-primary">
                                <dt>Estimated total</dt>
                                <dd>{displayCost(cost.total)}</dd>
                            </div>
                        </dl>
                        {cost.awaitingCosting.length > 0 && (
                            <p className="mt-3 flex gap-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800">
                                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span>
                                    {cost.awaitingCosting.length} dish
                                    {cost.awaitingCosting.length === 1 ? "" : "es"} still
                                    need costing:{" "}
                                    {cost.awaitingCosting
                                        .map((item) => item.name)
                                        .join(", ")}
                                    . We&apos;ll confirm the final price with you.
                                </span>
                            </p>
                        )}
                        <QuoteDialog
                            kind="custom"
                            packageName="Custom Menu"
                            guestCount={guestCount}
                            lineItems={lineItems}
                            title="Request your custom menu"
                            description="Send us your menu and contact details. We'll confirm availability and the final cost."
                            isOpen={quoteOpen}
                            onOpenChange={setQuoteOpen}
                            trigger={
                                <button
                                    type="button"
                                    disabled={selected.length === 0}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Send my menu request
                                </button>
                            }
                        />
                        <p className="mt-3 text-center text-xs text-muted-foreground">
                            Not ready? Browse our{" "}
                            <Link href="/packages" className="underline hover:text-primary">
                                curated packages
                            </Link>
                            .
                        </p>
                    </div>
                </aside>
            </div>

            <DragOverlay dropAnimation={null}>
                {activeItem ? (
                    <div className="flex items-center gap-2 rounded-lg border border-primary bg-card px-3 py-2 text-sm font-medium shadow-xl">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <MenuIcon item={activeItem} className="h-4 w-4" />
                        </span>
                        {activeItem.name}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
