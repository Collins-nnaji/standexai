import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-standex-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "StandexAI | AI Communication Coach & Safety Layer",
  description:
    "AI-powered communication assistant that helps you analyze, improve, and de-risk text and speech in real time. Say the right thing, the right way — every time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSans.className}`} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
