import type { Metadata } from "next";
import { Newsreader, Calistoga, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const calistoga = Calistoga({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "NewsHub — 全球新闻聚合",
  description: "每日精选，实时资讯",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${newsreader.variable} ${calistoga.variable} ${sourceSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
