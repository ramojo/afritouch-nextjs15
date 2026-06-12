'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/images/afritouch_logo_transparent.png';
import Nav from '@/app/components/nav';

export default function Header() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // On homepage: transparent when at top, solid when scrolled
    // On other pages: always solid
    const headerBg = isHomePage
        ? (isScrolled ? 'bg-primary/95 backdrop-blur-sm shadow-md' : 'bg-transparent')
        : 'bg-primary/95 backdrop-blur-sm shadow-md';

    return (
        <header
            className={`fixed top-0 z-50 w-full transition-colors duration-300 ${headerBg}`}
        >
            <div className="container flex h-20 items-center justify-between px-4 md:h-24 md:px-6">
                <Link href="/" className="flex items-center gap-3 md:gap-4">
                    <span className="flex items-center justify-center rounded-full bg-white p-1.5 shadow-lg ring-1 ring-black/5">
                        <Image
                            src={logo}
                            alt="Afritouch Logo"
                            width={120}
                            height={120}
                            priority
                            className="h-14 w-14 object-contain md:h-20 md:w-20"
                        />
                    </span>
                    <span className="text-xl font-bold font-serif tracking-tight text-white drop-shadow-lg sm:text-2xl md:text-3xl">
                        Afritouch Caterers
                    </span>
                </Link>
                <Nav />
            </div>
        </header>
    );
}
