import './reset.css';
import "./globals.css";
import type { Metadata } from "next";
import { Share_Tech_Mono, Noto_Sans_Display } from 'next/font/google';
import Header from '@/composites/Header';
import Game from '@/composites/Game';

export const metadata: Metadata = {
  title: "renfoc.us",
  description: "Metaphysics, tunes, and code.",
};

const synemono = Share_Tech_Mono({ weight: '400', subsets: ['latin'], variable: '--font-mono' });
const notoSans = Noto_Sans_Display({ weight: ['400', '700', '900'], subsets: ['latin'], variable: '--font-body' });

type RootLayoutArgs = Readonly<{
  children: React.ReactNode;
}>

export default function RootLayout({ children }: RootLayoutArgs) { 
  return (
    <html lang="en" className={`${synemono.variable} ${notoSans.variable}`}>
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
