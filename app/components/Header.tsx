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
            <div className="container flex h-16 items-center justify-between px-4 md:h-20 md:px-6">
                <Link href="/" className="flex items-center gap-2 md:gap-3">
                    <span className="flex items-center justify-center rounded-full bg-white p-1 shadow-md ring-1 ring-black/5">
                        <Image
                            src={logo}
                            alt="Afritouch Logo"
                            width={80}
                            height={80}
                            className="h-10 w-10 object-contain md:h-14 md:w-14"
                        />
                    </span>
                    <span className="text-lg font-bold font-serif tracking-tight text-white drop-shadow-lg sm:text-xl md:text-2xl">
                        Afritouch Caterers
                    </span>
                </Link>
                <Nav />
            </div>
        </header>
    );
}
