import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function normalizeItemName(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/^\*+/, "")
        .replace(/\s+/g, " ");
}

export function formatKes(amount: number): string {
    return `KES ${Math.round(amount).toLocaleString("en-KE")}`;
}
