import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "KZ AI Opportunities — Хакатоны и ИИ-соревнования в Казахстане",
  description:
    "Каталог актуальных хакатонов, AI-баттлов, олимпиад по программированию и стартап-конкурсов в Казахстане. Astana Hub, alem.ai, CPFED.",
  keywords: [
    "Хакатоны Казахстан",
    "ИИ конкурсы Астана",
    "Astana Hub Battle",
    "CPFED",
    "AI олимпиады",
    "KBTU Open",
    "alem.ai",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
