'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/images/afritouch_logo_transparent.png';
import Nav from '@/app/components/nav';

export default function Header() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    return (
        <header
            className={`fixed top-0 z-50 w-full transition-colors ${isHomePage ? 'bg-transparent' : 'bg-primary/95 backdrop-blur-sm shadow-md'
                }`}
        >
            <div className="container flex h-20 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <Image
                        src={logo}
                        alt="Afritouch Logo"
                        width={80}
                        height={80}
                        className="object-contain drop-shadow-lg"
                    />
                    <span className="text-2xl font-bold font-serif tracking-tight text-white drop-shadow-lg">
                        Afritouch Caterers
                    </span>
                </div>
                <Nav />
            </div>
        </header>
    );
}
