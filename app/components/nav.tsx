// Create navigation that has home which will be a favicon, about us and a gallery
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/packages", label: "Packages" },
    { href: "/gallery", label: "Gallery" },
];

const linkClass =
    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-amber-400 focus:text-amber-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";

export default function Nav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close the mobile menu whenever the route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Desktop navigation */}
            <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="flex space-x-6">
                    {links.map((link) => (
                        <NavigationMenuItem key={link.href}>
                            <NavigationMenuLink asChild className={linkClass}>
                                <Link href={link.href}>{link.label}</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile hamburger button */}
            <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center justify-center rounded-md p-2 text-white transition-colors hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 md:hidden"
            >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile menu panel */}
            <div
                className={`absolute left-0 right-0 top-full origin-top overflow-hidden bg-primary/95 backdrop-blur-sm shadow-md transition-all duration-300 md:hidden ${
                    open ? "max-h-80 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
                <nav className="flex flex-col px-4 py-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="rounded-md px-4 py-3 text-base font-medium text-white transition-colors hover:text-amber-400"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}
