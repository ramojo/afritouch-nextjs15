"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Crossfading hero background. All images are rendered (and therefore
 * preloaded) and we transition opacity between them — no flicker, unlike
 * animating `background-image`. Honors prefers-reduced-motion.
 */
export function HeroSlideshow({
    images,
    interval = 5000,
}: {
    images: string[];
    interval?: number;
}) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = setInterval(
            () => setActive((i) => (i + 1) % images.length),
            interval,
        );
        return () => clearInterval(id);
    }, [images.length, interval]);

    return (
        <div className="absolute inset-0 z-0">
            {images.map((src, i) => (
                <Image
                    key={src}
                    src={src}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className={`object-cover transition-opacity duration-1000 ease-in-out ${
                        i === active ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}
        </div>
    );
}
