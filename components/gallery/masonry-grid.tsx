"use client";

import React from "react";
import Image from "next/image";
import type { GalleryImage } from "@/app/gallery/gallery-data";
import { Reveal } from "./reveal";

const ROW = 8; // px — the grid row line spacing
const GAP = 16; // px — must match the gap-4 utility

/**
 * Masonry built on real CSS Grid row lines: a dense grid with small
 * `grid-auto-rows` lines where each tile spans the number of rows its content
 * occupies. Spans are recomputed on resize and after images load.
 */
export function MasonryGrid({
    images,
    startIndex,
    onSelect,
}: {
    images: GalleryImage[];
    startIndex: number;
    onSelect: (globalIndex: number) => void;
}) {
    const gridRef = React.useRef<HTMLDivElement>(null);

    const resize = React.useCallback(() => {
        const grid = gridRef.current;
        if (!grid) return;
        const items = grid.querySelectorAll<HTMLElement>("[data-masonry-item]");
        items.forEach((item) => {
            const content = item.firstElementChild as HTMLElement | null;
            if (!content) return;
            const h = content.getBoundingClientRect().height;
            const span = Math.ceil((h + GAP) / (ROW + GAP));
            item.style.gridRowEnd = `span ${span}`;
        });
    }, []);

    React.useLayoutEffect(() => {
        resize();
        const ro = new ResizeObserver(resize);
        if (gridRef.current) ro.observe(gridRef.current);
        window.addEventListener("resize", resize);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", resize);
        };
    }, [resize]);

    return (
        <div
            ref={gridRef}
            className="grid gap-4"
            style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gridAutoRows: `${ROW}px`,
            }}
        >
            {images.map((image, i) => (
                <div
                    key={image.src}
                    data-masonry-item
                    className="relative hover:z-30 focus-within:z-30"
                >
                    <Reveal delay={(i % 6) * 70}>
                        <TiltTile
                            image={image}
                            priority={i < 4}
                            onClick={() => onSelect(startIndex + i)}
                        />
                    </Reveal>
                </div>
            ))}
        </div>
    );
}

function TiltTile({
    image,
    priority,
    onClick,
}: {
    image: GalleryImage;
    priority: boolean;
    onClick: () => void;
}) {
    const ref = React.useRef<HTMLButtonElement>(null);

    // Map the pointer position onto a "sphere": strong rotation toward the
    // cursor plus a pop in depth, so the tile feels like it rolls on a ball.
    const onMove = (e: React.PointerEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(650px) rotateX(${(-py * 20).toFixed(2)}deg) rotateY(${(px * 24).toFixed(2)}deg) translateZ(26px) scale(1.06)`;
    };
    const onEnter = (e: React.PointerEvent) => {
        // little bounce on entry
        const el = ref.current;
        if (el) el.style.transform = "perspective(650px) translateZ(30px) scale(1.07)";
        onMove(e);
    };
    const reset = () => {
        const el = ref.current;
        if (el) el.style.transform = "";
    };

    return (
        <button
            ref={ref}
            type="button"
            onClick={onClick}
            onPointerEnter={onEnter}
            onPointerMove={onMove}
            onPointerLeave={reset}
            style={{ transition: "transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 280ms ease-out" }}
            className="group relative block w-full overflow-hidden rounded-2xl bg-muted shadow-sm [transform-style:preserve-3d] hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
            <Image
                src={image.src}
                alt={image.alt}
                width={image.w}
                height={image.h}
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-3 left-3 right-3 translate-y-2 text-left text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {image.alt}
            </span>
        </button>
    );
}
