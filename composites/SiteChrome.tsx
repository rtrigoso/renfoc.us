'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Game from './Game';

export default function SiteChrome() {
    const pathname = usePathname();
    if (pathname?.startsWith('/editor')) return null;

    return (
        <>
            <Header />
            <Game />
            <noscript>
                <style>{`.game_wrapper { display: none; }`}</style>
                <p className="noscript_game_message">Enable JavaScript to play a game!</p>
            </noscript>
        </>
    );
}
