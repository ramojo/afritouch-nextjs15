import { NextRequest, NextResponse } from "next/server";
import { getMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/menu-items";
import { MenuItemPatch } from "@/app/types/menu";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    const item = await getMenuItem(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    let body: Partial<MenuItemPatch>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const updated = await updateMenuItem(id, body as MenuItemPatch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
    const { id } = await params;
    const ok = await deleteMenuItem(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
}
