"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
    ChevronDown,
    FileText,
    LayoutDashboard,
    LogOut,
    PackagePlus,
    UserRound,
    Users,
    Utensils,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AdminSession = {
    displayName: string;
    role: "admin" | "superadmin";
    authProvider: "local" | "clerk";
    managesUsersExternally: boolean;
};

type AdminMenuProps = {
    variant?: "desktop" | "mobile";
    /** Called when a link is chosen so the parent mobile menu can close. */
    onNavigate?: () => void;
};

function initials(name: string): string {
    return name
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

function MenuLink({
    href,
    label,
    icon: Icon,
    onNavigate,
}: {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    onNavigate?: () => void;
}) {
    return (
        <DropdownMenuItem asChild>
            <Link
                href={href}
                onClick={onNavigate}
                className="cursor-pointer gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground focus:bg-accent"
            >
                <Icon className="text-secondary" />
                {label}
            </Link>
        </DropdownMenuItem>
    );
}

function ClerkLogout({ onClose }: { onClose: () => void }) {
    const { signOut } = useClerk();

    return (
        <DropdownMenuItem
            className="cursor-pointer gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700"
            onSelect={() => {
                onClose();
                void signOut({ redirectUrl: "/admin/login" });
            }}
        >
            <LogOut />
            Logout
        </DropdownMenuItem>
    );
}

export default function AdminMenu({
    variant = "desktop",
    onNavigate,
}: AdminMenuProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [session, setSession] = useState<AdminSession | null>(null);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadSession() {
            try {
                const res = await fetch("/api/admin/session", {
                    cache: "no-store",
                });
                const data = (await res.json().catch(() => null)) as
                    | (AdminSession & { authenticated?: boolean })
                    | null;
                if (!cancelled) {
                    setSession(data?.authenticated ? data : null);
                }
            } catch {
                if (!cancelled) setSession(null);
            }
        }

        void loadSession();
        window.addEventListener("focus", loadSession);
        return () => {
            cancelled = true;
            window.removeEventListener("focus", loadSession);
        };
    }, [pathname]);

    if (!session) return null;

    const name = session.displayName || "Admin";
    const isSuperadmin = session.role === "superadmin";
    const close = () => {
        setOpen(false);
        onNavigate?.();
    };

    async function logout() {
        setBusy(true);
        close();
        await fetch("/api/admin/logout", { method: "POST" });
        setSession(null);
        router.push("/admin/login");
        router.refresh();
        setBusy(false);
    }

    const triggerClass =
        variant === "mobile"
            ? "flex w-full items-center gap-3 rounded-md px-4 py-3 text-base font-medium text-white transition-colors hover:text-amber-400"
            : "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-2 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400";

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label={`Admin menu for ${name}`}
                    className={triggerClass}
                >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                        {initials(name) || "A"}
                    </span>
                    <span className={variant === "mobile" ? "" : "hidden lg:inline"}>
                        {name}
                    </span>
                    <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""} ${
                            variant === "mobile" ? "ml-auto" : ""
                        }`}
                        aria-hidden="true"
                    />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={variant === "mobile" ? 0 : 10}
                className="w-64 rounded-xl border-border/70 p-2 shadow-xl"
            >
                <DropdownMenuLabel className="px-2 py-2">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {initials(name) || "A"}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                                {name}
                            </p>
                            <p className="text-xs capitalize text-muted-foreground">
                                {session.role} · signed in
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <MenuLink
                        href="/admin"
                        label="Packages"
                        icon={LayoutDashboard}
                        onNavigate={close}
                    />
                    <MenuLink
                        href="/admin/quotes"
                        label="Quotes"
                        icon={FileText}
                        onNavigate={close}
                    />
                    <MenuLink
                        href="/admin/menu-items"
                        label="Menu Items"
                        icon={Utensils}
                        onNavigate={close}
                    />
                    <MenuLink
                        href="/admin/menu-items/import"
                        label="Import from Packages"
                        icon={PackagePlus}
                        onNavigate={close}
                    />
                    {isSuperadmin && !session.managesUsersExternally && (
                        <MenuLink
                            href="/admin/users"
                            label="Users"
                            icon={Users}
                            onNavigate={close}
                        />
                    )}
                    {!session.managesUsersExternally && (
                        <MenuLink
                            href="/admin/profile"
                            label="Profile"
                            icon={UserRound}
                            onNavigate={close}
                        />
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                {session.authProvider === "clerk" ? (
                    <ClerkLogout onClose={close} />
                ) : (
                    <DropdownMenuItem
                        className="cursor-pointer gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700"
                        onSelect={() => void logout()}
                        disabled={busy}
                    >
                        <LogOut />
                        {busy ? "Logging out..." : "Logout"}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
