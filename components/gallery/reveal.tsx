"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered reveal. Children fade/translate/scale into view the first
 * time they intersect the viewport. Honors prefers-reduced-motion.
 */
export function Reveal({
    children,
    className,
    delay = 0,
    as: Tag = "div",
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    as?: React.ElementType;
}) {
    const ref = React.useRef<HTMLElement>(null);
    const [shown, setShown] = React.useState(false);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setShown(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShown(true);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={cn(
                "transition-all duration-700 ease-out will-change-transform",
                shown
                    ? "opacity-100 translate-y-0 blur-0 scale-100"
                    : "opacity-0 translate-y-10 blur-[6px] scale-[0.97]",
                className,
            )}
        >
            {children}
        </Tag>
    );
}
