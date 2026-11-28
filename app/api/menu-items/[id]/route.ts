import { NextRequest, NextResponse } from "next/server";
import { getMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/menu-items";
import {
    MenuItemPatch,
    MENU_CATEGORIES,
    MenuCategory,
    isMenuIconKey,
} from "@/app/types/menu";
import { getSession } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    const item = await getMenuItem(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
    if (!(await getSession())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    let body: Partial<MenuItemPatch>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (
        body.category !== undefined &&
        !MENU_CATEGORIES.includes(body.category as MenuCategory)
    ) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (body.iconKey !== undefined && !isMenuIconKey(body.iconKey)) {
        return NextResponse.json({ error: "Invalid icon choice" }, { status: 400 });
    }
    if (
        body.pricePerPerson !== undefined &&
        (!Number.isInteger(body.pricePerPerson) || body.pricePerPerson < 0)
    ) {
        return NextResponse.json(
            { error: "Price per person must be a whole positive number" },
            { status: 400 },
        );
    }
    const updated = await updateMenuItem(id, body as MenuItemPatch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
    if (!(await getSession())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const ok = await deleteMenuItem(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
}
