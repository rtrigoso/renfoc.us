import './reset.css';
import "./globals.css";
import type { Metadata } from "next";
import { Overlock } from 'next/font/google';
import Header from '@/composites/Header';

export const metadata: Metadata = {
  title: "renfoc.us",
  description: "Metaphysics, tunes, and code.",
};

const victorMono = Overlock({
  subsets: ['latin-ext'],
  weight: '400'
});

type RootLayoutArgs = Readonly<{
  children: React.ReactNode;
}>

export default function RootLayout({ children }: RootLayoutArgs) {
  return (
    <html lang="en" className={victorMono.className}>
      <body>
        <div className="skip_link">
          <a href="#main_content" tabIndex={0}>
            Skip to main content
          </a>
        </div>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}