"use client";

import React from "react";
import Image from "next/image";
import { WebGLBackground } from "./webgl-background";

type Tile = {
    src: string;
    className: string; // position + size
    rotate: number;
    depth: number; // parallax strength
};

// Overlapping, layered composition — deliberately maximalist.
const tiles: Tile[] = [
    { src: "/images/gallery/gallery_24.jpg", className: "left-[4%] top-[18%] w-[26vw] max-w-[300px]", rotate: -8, depth: 0.18 },
    { src: "/images/gallery/gallery_15.jpg", className: "left-[20%] bottom-[8%] w-[20vw] max-w-[230px]", rotate: 6, depth: 0.34 },
    { src: "/images/gallery/gallery_05.jpg", className: "right-[6%] top-[14%] w-[24vw] max-w-[280px]", rotate: 7, depth: 0.22 },
    { src: "/images/gallery/gallery_11.jpg", className: "right-[16%] bottom-[10%] w-[18vw] max-w-[210px]", rotate: -6, depth: 0.4 },
    { src: "/images/gallery/gallery_66.jpg", className: "left-[38%] top-[6%] w-[16vw] max-w-[180px]", rotate: -3, depth: 0.5 },
    { src: "/images/gallery/gallery_25.jpg", className: "right-[34%] bottom-[4%] w-[15vw] max-w-[170px]", rotate: 4, depth: 0.6 },
];

export function HeroCollage() {
    const sectionRef = React.useRef<HTMLDivElement>(null);
    const tileRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    React.useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let raf = 0;
        const update = () => {
            const sec = sectionRef.current;
            if (sec) {
                const rect = sec.getBoundingClientRect();
                const progress = -rect.top; // px scrolled past top
                tileRefs.current.forEach((el, i) => {
                    if (!el) return;
                    const d = tiles[i].depth;
                    el.style.transform = `translate3d(0, ${(progress * d).toFixed(1)}px, 0) rotate(${tiles[i].rotate}deg)`;
                });
            }
            raf = requestAnimationFrame(update);
        };
        raf = requestAnimationFrame(update);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-[92vh] items-center justify-center overflow-hidden text-center"
        >
            <WebGLBackground className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-background" />

            {/* Floating overlapping tiles */}
            {tiles.map((t, i) => (
                <div
                    key={t.src}
                    ref={(el) => {
                        tileRefs.current[i] = el;
                    }}
                    style={{ transform: `rotate(${t.rotate}deg)` }}
                    className={`absolute hidden aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-2xl ring-1 ring-black/20 md:block ${t.className}`}
                >
                    <Image
                        src={t.src}
                        alt=""
                        fill
                        sizes="300px"
                        className="object-cover"
                    />
                </div>
            ))}

            {/* Title */}
            <div className="relative z-10 px-4">
                <div className="mb-6 inline-block rounded-full border border-amber-400/40 bg-black/30 px-6 py-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-200 backdrop-blur-md">
                    Our Gallery
                </div>
                <h1 className="font-serif text-5xl font-bold tracking-tight text-white drop-shadow-2xl md:text-7xl lg:text-8xl">
                    A feast for <span className="text-amber-400">the eyes</span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-base text-white/80 md:text-lg">
                    Scroll through the moments we&apos;ve crafted — weddings, corporate
                    tables, marquee events and the food at the heart of it all.
                </p>
                <div className="mt-10 animate-bounce text-white/70">↓</div>
            </div>
        </section>
    );
}
