import './reset.css';
import "./globals.css";
import type { Metadata } from "next";
import { Syne_Mono } from 'next/font/google';
import Header from '@/composites/Header';
import Game from '@/composites/Game';
import { SITE_NAME, SITE_TAGLINE } from '@/utils/config';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `${SITE_TAGLINE}.`,
};

const googlefont = Syne_Mono({ weight: '400', subsets: ['latin']});

type RootLayoutArgs = Readonly<{
  children: React.ReactNode;
}>

export default function RootLayout({ children }: RootLayoutArgs) { 
  return (
    <html lang="en" className={googlefont.className}>
      <body>
        <div className="skip_link">
          <a href="#main_content" tabIndex={0}>
            Skip to main content
          </a>
        </div>
        <Header />
        <Game />
        <noscript>
          <style>{`.game_wrapper_toggle, .game_wrapper { display: none; }`}</style>
          <p className="noscript_game_message">Enable JavaScript to play a game!</p>
        </noscript>
        <main id="main_content">
          {children}
        </main>
      </body>
    </html>
  );
}
