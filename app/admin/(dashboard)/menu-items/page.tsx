import { listMenuItems } from "@/lib/menu-items";
import MenuItemsManager from "./MenuItemsManager";

export const dynamic = "force-dynamic";

export default async function MenuItemsPage() {
    const items = await listMenuItems();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Menu Items</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage the dishes customers can drag into a custom menu and set
                    the cost of each one.
                </p>
            </div>
            <MenuItemsManager initialItems={items} />
        </div>
    );
}
