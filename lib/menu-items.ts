import storage from "./storage";
import { MenuItem, MenuItemInput, MenuItemPatch } from "@/app/types/menu";

export async function listMenuItems(opts?: {
    category?: string;
    active?: boolean;
    needsCosting?: boolean;
}): Promise<MenuItem[]> {
    return storage.menuItems.list(opts);
}

export async function getMenuItem(id: string): Promise<MenuItem | null> {
    return storage.menuItems.get(id);
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
    return storage.menuItems.create(input);
}

export async function updateMenuItem(
    id: string,
    patch: MenuItemPatch,
): Promise<MenuItem | null> {
    return storage.menuItems.update(id, patch);
}

export async function deleteMenuItem(id: string): Promise<boolean> {
    return storage.menuItems.delete(id);
}

export async function bulkCreateMenuItems(
    items: MenuItemInput[],
): Promise<number> {
    return storage.menuItems.bulkCreate(items);
}

export async function clearAllMenuItems(): Promise<number> {
    return storage.menuItems.clearAll();
}
