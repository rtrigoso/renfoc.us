import './reset.css';
import "./globals.css";
import type { Metadata } from "next";
import { Victor_Mono } from 'next/font/google'
import SocialLinks from "@/composites/SocialLinks";
import Image from "next/image";

export const metadata: Metadata = {
  title: "renfoc.us",
  description: "Metaphysics, tunes, and code.",
};

const font = Victor_Mono({ subsets: ['latin'] })
type RootLayoutArgs = Readonly<{
  children: React.ReactNode;
}>

export default function RootLayout({ children }: RootLayoutArgs) {
  return (
    <html lang="en">
      <body className={font.className}>
        <header>
          <a href="/">
            <Image
              src="/header.webp"
              alt="cropped picture of the blog owner made by ai"
              width={250}
              height={140}
              placeholder="blur"
              blurDataURL="/header_loading.webp"
            />
          </a>
          <a href="/">
            <h1>ren focus</h1>
          </a>
          <h2>Metaphysics, tunes, and code</h2>
          <nav>
            <a href="/tools">Tools</a>
            <a href="/posts">All Posts</a>
            <a href='https://www.buymeacoffee.com/renrocks' target='_BLANK'>Buy me coffee</a>
            <SocialLinks />
          </nav>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
