import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPageShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white antialiased [font-family:var(--font-inter),ui-sans-serif,sans-serif]">
      <header className="border-b border-white/[0.12] bg-[#0A0A0A]/95 px-5 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Image
              src="/standexailogo.png"
              alt="StandexAI"
              width={120}
              height={32}
              className="h-7 w-auto object-contain brightness-0 invert opacity-95"
            />
          </Link>
          <Link
            href="/"
            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#C4C0B6] transition hover:text-white"
          >
            Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        {eyebrow ? (
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C4C0B6]">{eyebrow}</p>
        ) : null}
        <h1 className="mb-10 text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight tracking-tight text-white [font-family:var(--font-inter),ui-sans-serif,sans-serif]">
          {title}
        </h1>
        <div className="space-y-4 text-[15px] leading-relaxed text-[#C4C0B6] [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_strong]:text-white [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </main>
    </div>
  );
}
