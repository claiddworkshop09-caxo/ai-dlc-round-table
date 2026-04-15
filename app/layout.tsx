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
  title: "タスク管理",
  description: "Neon + Drizzle タスク管理ツール",
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
        {/* ヘッダーナビゲーション */}
        <header className="sticky top-0 z-40 border-b bg-card">
          <nav className="mx-auto flex h-12 max-w-4xl items-center gap-6 px-4">
            <span className="text-sm font-semibold text-foreground">
              タスク管理ツール
            </span>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                コメント
              </Link>
              <Link
                href="/tasks"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                タスク
              </Link>
              <Link
                href="/equipment"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                備品管理
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
