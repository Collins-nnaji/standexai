import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StandexAI | Compliance-First Content Operations Platform",
  description:
    "AI-powered content platform built for regulated industries. Real-time compliance, dual SEO+GEO optimization, and team collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans" style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
