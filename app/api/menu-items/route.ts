import { NextRequest, NextResponse } from "next/server";
import {
    listMenuItems,
    createMenuItem,
    bulkCreateMenuItems,
    clearAllMenuItems,
} from "@/lib/menu-items";
import { listPackages } from "@/lib/packages";
import { catalogFromPackages } from "@/lib/menu-catalog";
import { MenuItemInput, MENU_CATEGORIES } from "@/app/types/menu";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? undefined;
    const activeParam = searchParams.get("active");
    const needsCostingParam = searchParams.get("needsCosting");

    const active =
        activeParam === "true" ? true : activeParam === "false" ? false : undefined;
    const needsCosting =
        needsCostingParam === "true"
            ? true
            : needsCostingParam === "false"
              ? false
              : undefined;

    const items = await listMenuItems({ category, active, needsCosting });
    return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // Special actions: seed from packages or clear all
    if (action === "seed") {
        const packages = await listPackages();
        const catalog = catalogFromPackages(packages);
        const count = await bulkCreateMenuItems(catalog);
        return NextResponse.json({ seeded: count });
    }
    if (action === "clear") {
        const count = await clearAllMenuItems();
        return NextResponse.json({ cleared: count });
    }

    // Regular create
    let body: Partial<MenuItemInput>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!body.name?.trim()) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!body.category || !MENU_CATEGORIES.includes(body.category as never)) {
        return NextResponse.json({ error: "Valid category is required" }, { status: 400 });
    }
    try {
        const item = await createMenuItem(body as MenuItemInput);
        return NextResponse.json(item, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
