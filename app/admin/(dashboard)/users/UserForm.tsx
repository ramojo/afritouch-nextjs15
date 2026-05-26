"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Role, UserPublic } from "@/lib/users";

export default function UserForm({
    mode,
    initial,
}: {
    mode: "new" | "edit";
    initial?: UserPublic;
}) {
    const router = useRouter();
    const [username, setUsername] = useState(initial?.username ?? "");
    const [role, setRole] = useState<Role>(initial?.role ?? "admin");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
            if (mode === "new") {
                const res = await fetch("/api/users", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ username, password, role }),
                });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data?.error || "Failed");
                }
            } else {
                const body: { role: Role; password?: string } = { role };
                if (password) body.password = password;
                const res = await fetch(`/api/users/${initial!.id}`, {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data?.error || "Failed");
                }
            }
            router.push("/admin/users");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className="bg-card border rounded-lg p-6 space-y-4 max-w-xl"
        >
            <div className="space-y-1">
                <label className="text-sm font-medium block">Username</label>
                <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={32}
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={mode === "edit"}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-60"
                    placeholder="jane.doe"
                />
                {mode === "edit" && (
                    <p className="text-xs text-muted-foreground">
                        Username cannot be changed after creation.
                    </p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium block">Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                    <option value="admin">admin</option>
                    <option value="superadmin">superadmin</option>
                </select>
                <p className="text-xs text-muted-foreground">
                    Superadmins can manage users in addition to packages.
                </p>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium block">
                    {mode === "new" ? "Password" : "Reset password (optional)"}
                </label>
                <input
                    type="password"
                    autoComplete="new-password"
                    required={mode === "new"}
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                        mode === "edit"
                            ? "Leave blank to keep existing password"
                            : "At least 6 characters"
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => router.push("/admin/users")}
                    className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={busy}
                    className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
                >
                    {busy
                        ? "Saving..."
                        : mode === "new"
                          ? "Create user"
                          : "Save changes"}
                </button>
            </div>
        </form>
    );
}
