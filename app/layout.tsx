import './reset.css';
import "./globals.css";
import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Jersey_25 } from 'next/font/google';
import Header from '@/composites/Header';
import Game from '@/composites/Game';

export const metadata: Metadata = {
  title: "renfoc.us",
  description: "Metaphysics, tunes, and code.",
  metadataBase: new URL("https://renfoc.us"),
  openGraph: {
    title: "renfoc.us",
    description: "Metaphysics, tunes, and code.",
    images: [{ url: "/header.jpg", width: 250, height: 250 }],
  },
  twitter: {
    card: "summary",
    title: "renfoc.us",
    description: "Metaphysics, tunes, and code.",
    images: ["/header.jpg"],
  },
};

const synemono = localFont({ src: '../public/fonts/unscii-16-full.woff2', variable: '--font-mono' });
const jersey = Jersey_25({ weight: '400', subsets: ['latin'], variable: '--font-header' });
const departure = localFont({ src: '../public/fonts/DepartureMono-Regular.woff2', variable: '--font-body' });

type RootLayoutArgs = Readonly<{
  children: React.ReactNode;
}>

export default function RootLayout({ children }: RootLayoutArgs) { 
  return (
    <html lang="en" className={`${synemono.variable} ${jersey.variable} ${departure.variable}`}>
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
