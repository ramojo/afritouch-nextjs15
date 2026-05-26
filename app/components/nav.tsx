// Create navigation that has home which will be a favicon, about us and a gallery
'use client';
// import Image from 'next/image';
import Link from 'next/link';
// import logo from '../../public/images/afritouch_logo_transparent.png';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

const linkClass =
    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-amber-400 focus:text-amber-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";

export default function Nav() {
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={linkClass}>
                        <Link href="/">Home</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={linkClass}>
                        <Link href="/about">About Us</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={linkClass}>
                        <Link href="/packages">Packages</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={linkClass}>
                        <Link href="/gallery">Gallery</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
