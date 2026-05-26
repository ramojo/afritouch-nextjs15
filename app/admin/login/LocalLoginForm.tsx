"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
    const router = useRouter();
    const search = useSearchParams();
    const next = search.get("next") || "/admin";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Login failed");
            }
            router.push(next);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-sm bg-card rounded-lg shadow-lg p-8 space-y-6 border"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-serif font-bold text-primary">
                        Admin Login
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sign in to manage Afritouch packages.
                    </p>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="username"
                        className="text-sm font-medium block"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        autoFocus
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium block"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-md bg-primary text-primary-foreground py-2 font-semibold hover:bg-primary/90 disabled:opacity-60"
                >
                    {busy ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
}

export default function LocalLoginForm() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
