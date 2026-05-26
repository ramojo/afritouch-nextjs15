"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteUserButton({
    id,
    username,
}: {
    id: string;
    username: string;
}) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);

    async function onDelete() {
        if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
        setBusy(true);
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                alert(data?.error || "Failed to delete");
                return;
            }
            router.refresh();
        } finally {
            setBusy(false);
        }
    }

    return (
        <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="rounded-md border border-red-300 text-red-700 px-3 py-1.5 text-sm hover:bg-red-50 disabled:opacity-50"
        >
            {busy ? "..." : "Delete"}
        </button>
    );
}
