"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { Package, PackageInput } from "@/app/types/package";

const COLOR_PRESETS: { value: string; label: string }[] = [
    { value: "border-amber-700/50", label: "Bronze" },
    { value: "border-slate-400", label: "Silver" },
    { value: "border-yellow-500", label: "Gold" },
    { value: "border-yellow-600", label: "Gold Plus" },
    { value: "border-slate-300", label: "Platinum" },
    { value: "border-emerald-500", label: "Emerald" },
    { value: "border-rose-500", label: "Rose" },
];

const SECTIONS: {
    key: "starch" | "protein" | "vegetables" | "dessert" | "drinks";
    label: string;
}[] = [
    { key: "starch", label: "Starch" },
    { key: "protein", label: "Proteins" },
    { key: "vegetables", label: "Vegetables" },
    { key: "dessert", label: "Dessert" },
    { key: "drinks", label: "Drinks" },
];

type FormState = PackageInput;

function emptyForm(): FormState {
    return {
        name: "",
        price: "",
        description: "",
        starch: [],
        protein: [],
        vegetables: [],
        dessert: [],
        drinks: [],
        color: "border-slate-400",
        popular: false,
        images: [],
    };
}

export default function PackageForm({
    initial,
    mode,
}: {
    initial?: Package;
    mode: "new" | "edit";
}) {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const itemDragRef = useRef<{
        section: (typeof SECTIONS)[number]["key"];
        index: number;
    } | null>(null);
    const imageDragRef = useRef<number | null>(null);
    const [dragOver, setDragOver] = useState<{
        kind: "item" | "image";
        section?: string;
        index: number;
    } | null>(null);

    const [form, setForm] = useState<FormState>(() =>
        initial
            ? {
                  name: initial.name,
                  price: initial.price,
                  description: initial.description ?? "",
                  starch: [...initial.starch],
                  protein: [...initial.protein],
                  vegetables: [...initial.vegetables],
                  dessert: [...initial.dessert],
                  drinks: [...initial.drinks],
                  color: initial.color,
                  popular: Boolean(initial.popular),
                  images: [...initial.images],
              }
            : emptyForm(),
    );
    const [busy, setBusy] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function updateItem(
        section: (typeof SECTIONS)[number]["key"],
        index: number,
        value: string,
    ) {
        setForm((prev) => {
            const next = [...prev[section]];
            next[index] = value;
            return { ...prev, [section]: next };
        });
    }

    function addItem(section: (typeof SECTIONS)[number]["key"]) {
        setForm((prev) => ({ ...prev, [section]: [...prev[section], ""] }));
    }

    function removeItem(section: (typeof SECTIONS)[number]["key"], index: number) {
        setForm((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
        }));
    }

    function removeImage(index: number) {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    }

    function moveItem(
        section: (typeof SECTIONS)[number]["key"],
        from: number,
        to: number,
    ) {
        if (from === to) return;
        setForm((prev) => {
            const next = [...prev[section]];
            if (from < 0 || from >= next.length) return prev;
            if (to < 0 || to >= next.length) return prev;
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return { ...prev, [section]: next };
        });
    }

    function moveImage(from: number, to: number) {
        if (from === to) return;
        setForm((prev) => {
            const next = [...prev.images];
            if (from < 0 || from >= next.length) return prev;
            if (to < 0 || to >= next.length) return prev;
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return { ...prev, images: next };
        });
    }

    async function onUpload(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        setError(null);
        try {
            const uploaded: string[] = [];
            for (const file of Array.from(files)) {
                const fd = new FormData();
                fd.append("file", file);
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: fd,
                });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data?.error || `Upload failed for ${file.name}`);
                }
                const data = (await res.json()) as { url: string };
                uploaded.push(data.url);
            }
            setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
            if (fileRef.current) fileRef.current.value = "";
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const url =
                mode === "new" ? "/api/packages" : `/api/packages/${initial!.id}`;
            const method = mode === "new" ? "POST" : "PUT";
            const res = await fetch(url, {
                method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Save failed");
            }
            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <section className="bg-card border rounded-lg p-6 space-y-4">
                <h2 className="font-serif text-xl font-semibold text-primary">
                    Basics
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium block">
                            Title
                        </label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Gold Menu"
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium block">
                            Price
                        </label>
                        <input
                            required
                            value={form.price}
                            onChange={(e) => update("price", e.target.value)}
                            placeholder="KES 1200"
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium block">
                        Description
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        rows={3}
                        placeholder="A short tagline shown beneath the title."
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium block">
                            Accent color
                        </label>
                        <select
                            value={form.color}
                            onChange={(e) => update("color", e.target.value)}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        >
                            {COLOR_PRESETS.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <label className="flex items-center gap-2 mt-7">
                        <input
                            type="checkbox"
                            checked={Boolean(form.popular)}
                            onChange={(e) => update("popular", e.target.checked)}
                        />
                        <span className="text-sm">Mark as &ldquo;Most Popular&rdquo;</span>
                    </label>
                </div>
            </section>

            <section className="bg-card border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl font-semibold text-primary">
                        Images
                    </h2>
                    <label className="cursor-pointer rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
                        {uploading ? "Uploading..." : "+ Upload"}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={onUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                </div>

                {form.images.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No images uploaded yet. Click &ldquo;Upload&rdquo; to add one or more.
                    </p>
                ) : (
                    <>
                        <p className="text-xs text-muted-foreground">
                            Drag images to reorder. The first image is used as
                            the primary thumbnail.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {form.images.map((src, idx) => {
                                const isOver =
                                    dragOver?.kind === "image" &&
                                    dragOver.index === idx;
                                return (
                                    <div
                                        key={`${src}-${idx}`}
                                        draggable
                                        onDragStart={(e) => {
                                            imageDragRef.current = idx;
                                            e.dataTransfer.effectAllowed =
                                                "move";
                                            e.dataTransfer.setData(
                                                "text/plain",
                                                String(idx),
                                            );
                                        }}
                                        onDragOver={(e) => {
                                            if (imageDragRef.current !== null) {
                                                e.preventDefault();
                                                e.dataTransfer.dropEffect =
                                                    "move";
                                                setDragOver({
                                                    kind: "image",
                                                    index: idx,
                                                });
                                            }
                                        }}
                                        onDragLeave={() => {
                                            if (
                                                dragOver?.kind === "image" &&
                                                dragOver.index === idx
                                            ) {
                                                setDragOver(null);
                                            }
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const from = imageDragRef.current;
                                            if (from !== null) {
                                                moveImage(from, idx);
                                            }
                                            imageDragRef.current = null;
                                            setDragOver(null);
                                        }}
                                        onDragEnd={() => {
                                            imageDragRef.current = null;
                                            setDragOver(null);
                                        }}
                                        className={`relative aspect-square rounded-md overflow-hidden border bg-muted group cursor-grab active:cursor-grabbing ${
                                            isOver
                                                ? "ring-2 ring-primary/70"
                                                : ""
                                        }`}
                                    >
                                        <Image
                                            src={src}
                                            alt={`Image ${idx + 1}`}
                                            fill
                                            sizes="200px"
                                            className="object-cover pointer-events-none"
                                        />
                                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                                            {idx + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>

            <section className="bg-card border rounded-lg p-6 space-y-6">
                <h2 className="font-serif text-xl font-semibold text-primary">
                    Menu items
                </h2>

                <p className="text-xs text-muted-foreground -mt-2">
                    Tip: drag the <span className="font-mono">⋮⋮</span> handle
                    to reorder items.
                </p>
                {SECTIONS.map((s) => (
                    <div key={s.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold">{s.label}</h3>
                            <button
                                type="button"
                                onClick={() => addItem(s.key)}
                                className="text-xs rounded border px-2 py-1 hover:bg-muted"
                            >
                                + Add item
                            </button>
                        </div>
                        {form[s.key].length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                                No items.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {form[s.key].map((item, idx) => {
                                    const isDragOver =
                                        dragOver?.kind === "item" &&
                                        dragOver.section === s.key &&
                                        dragOver.index === idx;
                                    return (
                                        <div
                                            key={idx}
                                            onDragOver={(e) => {
                                                if (
                                                    itemDragRef.current?.section ===
                                                    s.key
                                                ) {
                                                    e.preventDefault();
                                                    e.dataTransfer.dropEffect =
                                                        "move";
                                                    setDragOver({
                                                        kind: "item",
                                                        section: s.key,
                                                        index: idx,
                                                    });
                                                }
                                            }}
                                            onDragLeave={() => {
                                                if (
                                                    dragOver?.kind === "item" &&
                                                    dragOver.section === s.key &&
                                                    dragOver.index === idx
                                                ) {
                                                    setDragOver(null);
                                                }
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const d = itemDragRef.current;
                                                if (d && d.section === s.key) {
                                                    moveItem(s.key, d.index, idx);
                                                }
                                                itemDragRef.current = null;
                                                setDragOver(null);
                                            }}
                                            className={`flex gap-2 items-center rounded-md ${
                                                isDragOver
                                                    ? "ring-2 ring-primary/60"
                                                    : ""
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                draggable
                                                onDragStart={(e) => {
                                                    itemDragRef.current = {
                                                        section: s.key,
                                                        index: idx,
                                                    };
                                                    e.dataTransfer.effectAllowed =
                                                        "move";
                                                    e.dataTransfer.setData(
                                                        "text/plain",
                                                        String(idx),
                                                    );
                                                }}
                                                onDragEnd={() => {
                                                    itemDragRef.current = null;
                                                    setDragOver(null);
                                                }}
                                                aria-label="Drag to reorder"
                                                title="Drag to reorder"
                                                className="cursor-grab active:cursor-grabbing select-none px-2 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                ⋮⋮
                                            </button>
                                            <input
                                                value={item}
                                                onChange={(e) =>
                                                    updateItem(
                                                        s.key,
                                                        idx,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`${s.label} item ${idx + 1}`}
                                                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(s.key, idx)
                                                }
                                                className="rounded-md border border-red-300 text-red-700 px-3 py-1.5 text-sm hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </section>

            {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.push("/admin")}
                    className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={busy || uploading}
                    className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
                >
                    {busy
                        ? "Saving..."
                        : mode === "new"
                          ? "Create package"
                          : "Save changes"}
                </button>
            </div>
        </form>
    );
}
