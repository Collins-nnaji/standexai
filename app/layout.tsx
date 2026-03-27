import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-standex-sans",
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
      className={`${fontSans.variable} ${fontSans.className} ${fontLandingSans.variable} ${fontLandingSerif.variable} ${fontConsoleMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
