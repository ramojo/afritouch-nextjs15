// Create navigation that has home which will be a favicon, about us and a gallery
'use client';
// import Image from 'next/image';
import Link from 'next/link';
// import logo from '../../public/images/afritouch_logo_transparent.png';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from '@/components/ui/dark-mode-toggle';

export default function Nav() {
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
                <NavigationMenuItem>
                    <Link href="/">
                        {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                        }
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-amber-400 focus:text-amber-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/about">
                        {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                        }
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-amber-400 focus:text-amber-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                            About Us
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/packages">
                        {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                        }
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-amber-400 focus:text-amber-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                            Packages
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/gallery">
                        {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                        }
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-amber-400 focus:text-amber-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                            Gallery
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

