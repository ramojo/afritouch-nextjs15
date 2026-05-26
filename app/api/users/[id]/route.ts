import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteUser, getUser, Role, updateUser } from "@/lib/users";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
    const { id } = await ctx.params;
    const u = await getUser(id);
    if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(u);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const update: { role?: Role; password?: string } = {};
    if (body?.role === "admin" || body?.role === "superadmin") {
        update.role = body.role;
    }
    if (typeof body?.password === "string" && body.password.length > 0) {
        update.password = body.password;
    }
    try {
        const updated = await updateUser(id, update);
        if (!updated) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
    const { id } = await ctx.params;
    const session = await getSession();
    if (session?.userId === id) {
        return NextResponse.json(
            { error: "You cannot delete your own account" },
            { status: 400 },
        );
    }
    try {
        const ok = await deleteUser(id);
        if (!ok) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
