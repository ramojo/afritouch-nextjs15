"use client";

import { IconSparkles, type TablerIcon } from "@tabler/icons-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MENU_ICON_KEYS,
    MENU_ICON_LABELS,
    type MenuIconKey,
    type MenuItem,
    normalizeMenuIconKey,
} from "@/app/types/menu";
import { MENU_ICON_COMPONENTS, MenuIcon } from "@/lib/menu-icons";
import { cn } from "@/lib/utils";

type MenuIconPickerProps = {
    item: Pick<MenuItem, "name" | "category" | "iconKey">;
    value?: MenuIconKey;
    onChange: (key: MenuIconKey) => void;
    ariaLabel: string;
    compact?: boolean;
};

/** A single clickable icon that opens the full list of choices. */
export default function MenuIconPicker({
    item,
    value,
    onChange,
    ariaLabel,
    compact = false,
}: MenuIconPickerProps) {
    const selected = normalizeMenuIconKey(value ?? item.iconKey);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label={ariaLabel}
                    title={MENU_ICON_LABELS[selected]}
                    className={cn(
                        "inline-flex shrink-0 items-center justify-center rounded-md border bg-background text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        compact ? "h-8 w-8" : "h-10 w-10",
                    )}
                >
                    <MenuIcon
                        item={{ ...item, iconKey: selected }}
                        className={compact ? "h-4 w-4" : "h-5 w-5"}
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="grid w-[280px] grid-cols-4 gap-1 overflow-y-auto p-2"
            >
                {MENU_ICON_KEYS.map((key) => {
                    const Icon: TablerIcon =
                        key === "auto" ? IconSparkles : MENU_ICON_COMPONENTS[key];
                    const label =
                        key === "auto"
                            ? "Auto"
                            : MENU_ICON_LABELS[key].split(" / ")[0];

                    return (
                        <DropdownMenuItem
                            key={key}
                            onSelect={() => onChange(key)}
                            title={MENU_ICON_LABELS[key]}
                            className={cn(
                                "flex h-14 w-full flex-col items-center justify-center gap-1 p-1 text-center text-[10px] leading-tight",
                                key === selected &&
                                    "bg-accent text-accent-foreground",
                            )}
                        >
                            <Icon className="h-4 w-4" stroke={1.6} aria-hidden="true" />
                            <span className="w-full truncate">{label}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
