import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans, Source_Serif_4, Syne, Inter } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-standex-sans",
  weight: ["400", "500", "600", "700", "800"],
});

/** New Main Fonts */
const fontSyne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const fontInter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

/** Landing & console chrome — DM Sans */
const fontLandingSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-sans",
  weight: ["400", "500", "600", "700"],
});

/** Headlines & large display — Source Serif 4 */
const fontLandingSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-serif",
  weight: ["400", "600", "700"],
});

const fontConsoleMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-console-mono",
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "StandexAI — Professional Network for AI Researchers",
  description:
    "Discover talent, publish work, and build your reputation in the AI research community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontInter.variable} ${fontInter.className} ${fontSans.variable} ${fontLandingSans.variable} ${fontLandingSerif.variable} ${fontConsoleMono.variable} ${fontSyne.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen text-zinc-900 bg-white">
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
