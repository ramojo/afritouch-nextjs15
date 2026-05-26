import { NextRequest, NextResponse } from "next/server";
import { createUser, listUsers, Role } from "@/lib/users";

export async function GET() {
    const users = await listUsers();
    return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const username = typeof body?.username === "string" ? body.username : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const role = body?.role as Role;
    try {
        const user = await createUser({ username, password, role });
        return NextResponse.json(user, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
