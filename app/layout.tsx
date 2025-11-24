import './reset.css';
import "./globals.css";
import type { Metadata } from "next";
import { Syne_Mono } from 'next/font/google';
import Header from '@/composites/Header';
import Game from '@/composites/Game';

export const metadata: Metadata = {
  title: "renfoc.us",
  description: "Metaphysics, tunes, and code.",
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
        <div id="main_content">
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
