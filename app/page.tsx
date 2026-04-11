import Link from "next/link";
import { neonAuth } from "@/lib/neon/auth-server";
import { TopNav } from "@/components/network/TopNav";
import { LandingHero } from "@/components/ui/LandingHero";
import { LandingFeatures } from "@/components/ui/LandingFeatures";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let session = null;
  try {
    const result = await neonAuth.getSession();
    session = result?.data;
  } catch {}

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden selection:bg-[#7C5CFC]/20 bg-white">
      <TopNav user={session?.user} />

      <main className="relative flex-1 flex flex-col items-center">

        {/* ── 1. HERO — white bg, animated lines, orbital ── */}
        <div className="w-full">
          <LandingHero />
        </div>

        {/* ── 2. NEW FEATURES SECTION ── */}
        <div className="w-full">
          <LandingFeatures />
        </div>

      </main>

      {/* Footer — dark */}
      <footer className="w-full py-10 border-t border-white/5 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest text-center md:text-left">
            StandexAI Applied AI Engineering © {new Date().getFullYear()}
            <span className="mx-2 text-zinc-700">•</span>
            A Standex Digital company
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <a href="mailto:standexaiofficial@gmail.com" className="hover:text-[#7C5CFC] transition-colors">
              standexaiofficial@gmail.com
            </a>
            <a href="https://www.linkedin.com/company/standexai" className="hover:text-[#7C5CFC] transition-colors" target="_blank" rel="noreferrer">
              LinkedIn: standexai
            </a>
            <Link href="/learn" className="hover:text-[#7C5CFC] transition-colors">Learn</Link>
            <Link href="/cognitive-audit" className="hover:text-[#7C5CFC] transition-colors">Skills Benchmark</Link>
            <Link href="/presentation/ai" className="hover:text-[#7C5CFC] transition-colors">Course deck</Link>
            <Link href="/projects" className="hover:text-[#7C5CFC] transition-colors">Open Projects</Link>
            <Link href="/prime" className="hover:text-[#7C5CFC] transition-colors">Prime</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
