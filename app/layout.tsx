import type { Metadata } from "next";
import { Victor_Mono } from 'next/font/google'
import "./globals.css";
import SocialLinks from "@/composites/SocialLinks";
import Image from "next/image";

export const metadata: Metadata = {
  title: "renfoc.us",
  description: "Metaphysics, tunes, and code.",
};

const font = Victor_Mono({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <main>
          <header>
            <a href="/">
              <Image
                className="header_image"
                src="/header.webp"
                alt="cropped picture of the blog owner made by ai"
                width={1019}
                height={620}
                placeholder="blur"
                blurDataURL="/header_loading.webp"
              />
            </a>
            <div>
              <a href="/">
                <h1>ren focus</h1>
              </a>
              <h2>Metaphysics, tunes, and code</h2>
            </div>
          </header>
          {children}
        </main>
        <nav>
          <a href="/">Home</a> |
          <a href="/tools">Tools</a> |
          <a href="/posts">All Posts</a> |
          <SocialLinks />
        </nav>
      </body>
    </html>
  );
}
