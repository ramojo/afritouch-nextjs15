import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { config as appConfig } from "@/lib/config";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Local-auth proxy
// ---------------------------------------------------------------------------
async function localProxy(req: NextRequest): Promise<NextResponse | undefined> {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = verifySessionToken(token);

    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        if (!session) {
            const url = req.nextUrl.clone();
            url.pathname = "/admin/login";
            url.searchParams.set("next", pathname);
            return NextResponse.redirect(url);
        }
        if (
            pathname.startsWith("/admin/users") &&
            session.role !== "superadmin"
        ) {
            const url = req.nextUrl.clone();
            url.pathname = "/admin";
            url.search = "";
            return NextResponse.redirect(url);
        }
    }

    if (pathname === "/admin/login" && session) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        url.search = "";
        return NextResponse.redirect(url);
    }

    const isPackageWrite =
        pathname.startsWith("/api/packages") && req.method !== "GET";
    const isUpload = pathname.startsWith("/api/upload");
    if ((isPackageWrite || isUpload) && !session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (pathname.startsWith("/api/admin/profile") && !session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (pathname.startsWith("/api/users")) {
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.role !== "superadmin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    }

    return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Clerk-auth proxy
// ---------------------------------------------------------------------------
const isProtectedRoute = createRouteMatcher([
    "/admin(.*)",
    "/api/packages/:path*",
    "/api/upload/:path*",
    "/api/admin/profile/:path*",
    "/api/users/:path*",
]);

const clerkProxy = clerkMiddleware(async (auth, req) => {
    if (!isProtectedRoute(req)) return;
    const { userId } = await auth();
    if (!userId) {
        const url = req.nextUrl.clone();
        if (url.pathname.startsWith("/api/")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }
        url.pathname = "/admin/login";
        url.searchParams.set("next", req.nextUrl.pathname);
        return NextResponse.redirect(url);
    }
});

// ---------------------------------------------------------------------------
// Selector
// ---------------------------------------------------------------------------
export const proxy =
    appConfig.auth.provider === "clerk" ? clerkProxy : localProxy;

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/packages/:path*",
        "/api/upload/:path*",
        "/api/users/:path*",
        "/api/admin/:path*",
    ],
};
