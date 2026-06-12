"use client";

import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { collections, allImages } from "./gallery-data";
import { HeroCollage } from "@/components/gallery/hero-collage";
import { MasonryGrid } from "@/components/gallery/masonry-grid";
import { Reveal } from "@/components/gallery/reveal";

export default function GalleryPage() {
    const [selected, setSelected] = React.useState<number | null>(null);
    // Drives the lightbox transition: direction, a re-trigger counter, and a
    // random tilt so each flip feels a little different.
    const [anim, setAnim] = React.useState<{
        dir: "next" | "prev" | "in";
        tick: number;
        rand: number;
    }>({ dir: "in", tick: 0, rand: 0 });

    const open = React.useCallback((index: number) => {
        setAnim({ dir: "in", tick: 0, rand: 0 });
        setSelected(index);
    }, []);

    const showPrev = React.useCallback(() => {
        setAnim((a) => ({
            dir: "prev",
            tick: a.tick + 1,
            rand: Math.round((Math.random() * 16 - 8) * 10) / 10,
        }));
        setSelected((s) => (s === null ? s : (s - 1 + allImages.length) % allImages.length));
    }, []);
    const showNext = React.useCallback(() => {
        setAnim((a) => ({
            dir: "next",
            tick: a.tick + 1,
            rand: Math.round((Math.random() * 16 - 8) * 10) / 10,
        }));
        setSelected((s) => (s === null ? s : (s + 1) % allImages.length));
    }, []);

    // Keyboard navigation while the lightbox is open.
    React.useEffect(() => {
        if (selected === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                showPrev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                showNext();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selected, showPrev, showNext]);

    // running offset so each collection maps into the flat allImages index
    let offset = 0;

    return (
        <div className="flex flex-col">
            <HeroCollage />

            <div className="px-4 pb-32 pt-16 md:px-8">
                <div className="container mx-auto space-y-28">
                    {collections.map((collection) => {
                        const startIndex = offset;
                        offset += collection.images.length;
                        return (
                            <section key={collection.title}>
                                <Reveal className="mb-8 max-w-3xl">
                                    <div className="flex items-baseline gap-4">
                                        <span className="font-serif text-sm font-bold text-amber-500">
                                            {String(
                                                collections.indexOf(collection) + 1,
                                            ).padStart(2, "0")}
                                        </span>
                                        <h2 className="font-serif text-3xl font-bold tracking-tight md:text-5xl">
                                            {collection.title}
                                        </h2>
                                    </div>
                                    <div className="mt-3 flex items-center gap-4">
                                        <span className="h-px w-16 bg-amber-500" />
                                        <p className="text-muted-foreground">
                                            {collection.description}
                                        </p>
                                    </div>
                                </Reveal>

                                <MasonryGrid
                                    images={collection.images}
                                    startIndex={startIndex}
                                    onSelect={open}
                                />
                            </section>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox */}
            <Dialog
                open={selected !== null}
                onOpenChange={(open) => !open && setSelected(null)}
            >
                <DialogContent className="w-screen max-w-none border-none bg-transparent p-0 shadow-none sm:max-w-none">
                    <DialogTitle className="sr-only">
                        {selected !== null ? allImages[selected].alt : "Gallery image"}
                    </DialogTitle>
                    {selected !== null && (
                        <div className="flex items-center justify-center gap-2 sm:gap-4">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showPrev();
                                }}
                                aria-label="Previous photo"
                                className="z-10 shrink-0 rounded-full bg-black/50 p-3 text-3xl leading-none text-white transition hover:bg-black/70"
                            >
                                ‹
                            </button>

                            {/* Consistent large frame: every image scales to fill the same box */}
                            <div
                                key={`${selected}-${anim.tick}`}
                                style={{ ["--lb-rand" as string]: `${anim.rand}deg` }}
                                className={`relative h-[82vh] w-[78vw] max-w-5xl overflow-hidden rounded-[2.5rem] bg-neutral-900/50 shadow-2xl ring-1 ring-white/10 backdrop-blur-md ${
                                    anim.dir === "next"
                                        ? "lb-anim-next"
                                        : anim.dir === "prev"
                                          ? "lb-anim-prev"
                                          : "lb-anim-in"
                                }`}
                            >
                                <Image
                                    src={allImages[selected].src}
                                    alt={allImages[selected].alt}
                                    fill
                                    sizes="80vw"
                                    priority
                                    className="object-contain"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showNext();
                                }}
                                aria-label="Next photo"
                                className="z-10 shrink-0 rounded-full bg-black/50 p-3 text-3xl leading-none text-white transition hover:bg-black/70"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
