import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, makeSessionToken } from "@/lib/auth";
import { verifyLogin } from "@/lib/users";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const username =
        typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password) {
        return NextResponse.json(
            { error: "Username and password are required" },
            { status: 400 },
        );
    }

    const user = await verifyLogin(username, password);
    if (!user) {
        return NextResponse.json(
            { error: "Invalid username or password" },
            { status: 401 },
        );
    }

    const res = NextResponse.json({
        ok: true,
        user: { id: user.id, username: user.username, role: user.role },
    });
    res.cookies.set({
        name: SESSION_COOKIE,
        value: makeSessionToken({
            userId: user.id,
            role: user.role,
            username: user.username,
        }),
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
    return res;
}
