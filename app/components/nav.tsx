// Create navigation that has home which will be a favicon, about us and a gallery
'use client';
import Image from 'next/image';
import logo from '../../public/images/afritouch_logo_transparent.png';
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
        <NavigationMenu className="p-4 ml-4 mr-4 justify-between sticky">
            <nav className="flex items-center justify-center p-4 bg-transparent shadow-none sticky">
                <div className="flex items-center space-x-8">
                    <Image src={logo} alt="Afritouch Logo" className="h-10 w-auto" />
                    <NavigationMenuList className="flex space-x-8">
                        <NavigationMenuItem className="text-lg font-semibold hover:text-blue-500 transition duration-300">
                            <NavigationMenuLink href="/">
                                Home
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="text-lg font-semibold hover:text-blue-500 transition duration-300">
                            <NavigationMenuLink href="/about">
                                About Us
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="text-lg font-semibold hover:text-blue-500 transition duration-300">
                            <NavigationMenuLink href="/packages">
                                Packages
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="text-lg font-semibold hover:text-blue-500 transition duration-300">
                            <NavigationMenuLink href="/gallery">
                                Gallery
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        {/* <NavigationMenuItem className="text-lg font-semibold hover:text-blue-500 transition duration-300 margin-left-auto justify-right">
                            <ModeToggle />
                        </NavigationMenuItem> */}
                    </NavigationMenuList>
                </div>
            </nav>

        </NavigationMenu>
    )
}
