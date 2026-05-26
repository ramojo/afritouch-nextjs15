"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

const buttonClass =
    "inline-flex items-center gap-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm font-semibold shadow-sm disabled:opacity-50 transition-colors";

function LocalLogoutButton() {
    const router = useRouter();
    const [busy, setBusy] = useState(false);

    async function logout() {
        setBusy(true);
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={logout}
            disabled={busy}
            className={buttonClass}
        >
            <LogOut className="w-4 h-4" />
            {busy ? "..." : "Logout"}
        </button>
    );
}

export default function LogoutButton({ clerk }: { clerk: boolean }) {
    if (clerk) {
        return (
            <SignOutButton redirectUrl="/admin/login">
                <button type="button" className={buttonClass}>
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </SignOutButton>
        );
    }
    return <LocalLogoutButton />;
}
