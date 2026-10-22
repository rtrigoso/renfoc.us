'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function SiteChrome() {
    const pathname = usePathname();
    if (pathname?.startsWith('/editor')) return null;

    return <Header />;
}
