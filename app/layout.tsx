import type { Metadata, Viewport } from "next";
import {
  Archivo_Black,
  Instrument_Serif,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Syne,
} from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-standex-sans",
  weight: ["400", "500", "600", "700", "800"],
});

/** Editorial landing (home) — Syne + Instrument Serif */
const fontLandingSans = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-sans",
  weight: ["400", "500", "600", "700"],
});

const fontLandingSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-serif",
  weight: ["400"],
});

/** Hero headline — heavy geometric / “blocked” display */
const fontLandingDisplay = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-display",
  weight: "400",
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
  title: "StandexAI — Copy that clears the bar",
  description:
    "Agentic copy review: agents flag weak claims and guide rewrites across voice, text, and AI-generated content — one standard before you ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSans.className} ${fontLandingSans.variable} ${fontLandingSerif.variable} ${fontLandingDisplay.variable} ${fontConsoleMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
