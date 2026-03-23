import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
