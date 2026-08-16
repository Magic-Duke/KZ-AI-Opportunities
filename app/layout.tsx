import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KZ AI Opportunities — Каталог соревнований и хакатонов Казахстана",
  description:
    "Реестр соревнований по машинному обучению, хакатонов, олимпиад и питч-конкурсов Казахстана и мировых платформ.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full antialiased scroll-smooth font-normal">
      <body className="min-h-full flex flex-col font-sans bg-[#FAFAFA] text-[#27272A]">
        {children}
      </body>
    </html>
  );
}
