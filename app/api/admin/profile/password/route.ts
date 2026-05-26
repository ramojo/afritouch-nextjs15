import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { changeOwnPassword } from "@/lib/users";

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json().catch(() => ({}));
    const currentPassword =
        typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword =
        typeof body?.newPassword === "string" ? body.newPassword : "";
    try {
        await changeOwnPassword(session.userId, currentPassword, newPassword);
        return NextResponse.json({ ok: true });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
