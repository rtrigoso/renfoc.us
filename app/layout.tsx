import type { Metadata } from "next";
import { Victor_Mono } from 'next/font/google'
import "./globals.css";

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
        <header>
          <a href="/">
            <h1>renfoc.us</h1>
          </a>
          <h2>Metaphysics, tunes, and code</h2>
        </header>
        <main>
          {children}
        </main>
        <nav>
          <a href="/">Home</a> |
          <a href="/posts">All Posts</a>
        </nav>
      </body>
    </html>
  );
}
