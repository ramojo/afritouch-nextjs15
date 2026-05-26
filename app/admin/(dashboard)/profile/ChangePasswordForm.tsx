"use client";

import { FormEvent, useState } from "react";

export default function ChangePasswordForm() {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (next !== confirm) {
            setError("New passwords do not match");
            return;
        }
        if (next.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        setBusy(true);
        try {
            const res = await fetch("/api/admin/profile/password", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    currentPassword: current,
                    newPassword: next,
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Failed to change password");
            }
            setSuccess("Password updated.");
            setCurrent("");
            setNext("");
            setConfirm("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className="bg-card border rounded-lg p-6 space-y-4"
        >
            <h2 className="font-serif text-lg font-semibold text-primary">
                Change password
            </h2>

            <div className="space-y-1">
                <label className="text-sm font-medium block">
                    Current password
                </label>
                <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium block">New password</label>
                <input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium block">
                    Confirm new password
                </label>
                <input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}

            <button
                type="submit"
                disabled={busy}
                className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
            >
                {busy ? "Saving..." : "Update password"}
            </button>
        </form>
    );
}
