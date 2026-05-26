import { NextRequest, NextResponse } from "next/server";
import { deletePackage, getPackage, updatePackage } from "@/lib/packages";
import { PackageInput } from "@/app/types/package";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
    const { id } = await ctx.params;
    const pkg = await getPackage(id);
    if (!pkg) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(pkg);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
    const { id } = await ctx.params;
    let body: Partial<PackageInput>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    try {
        const updated = await updatePackage(id, body as PackageInput);
        if (!updated) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
    const { id } = await ctx.params;
    const ok = await deletePackage(id);
    if (!ok) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
}
