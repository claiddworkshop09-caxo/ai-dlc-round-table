import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "備品管理アプリ",
  description: "QR コードで備品の貸出・返却を管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-background">
          <nav className="mx-auto max-w-4xl flex items-center gap-6 px-4 py-3">
            <Link href="/" className="font-bold text-lg">
              備品管理
            </Link>
            <Link
              href="/items"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              備品一覧
            </Link>
            <Link
              href="/users"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              利用者管理
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
