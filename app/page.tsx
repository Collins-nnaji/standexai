import Link from "next/link";
import { neonAuth } from "@/lib/neon/auth-server";
import { TopNav } from "@/components/network/TopNav";
import { LandingHero } from "@/components/ui/LandingHero";
import { LandingFeatures } from "@/components/ui/LandingFeatures";
export default async function HomePage() {
  let session = null;
  try {
    const result = await neonAuth.getSession();
    session = result?.data;
  } catch {}

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden selection:bg-[#7C5CFC]/20 bg-white">
      <TopNav user={session?.user} />

      <main className="relative flex-1 flex flex-col items-center z-10">

        {/* ── 1. HERO — white bg, animated lines, orbital ── */}
        <div className="w-full">
          <LandingHero />
        </div>

        {/* ── 2. NEW FEATURES SECTION ── */}
        <div className="w-full">
          <LandingFeatures />
        </div>

      </main>

      {/* Footer — light/transparent with black text */}
      <footer className="w-full py-12 border-t border-zinc-200 z-10 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-900 font-black text-[11px] uppercase tracking-widest text-center md:text-left">
            StandexAI Applied AI Engineering © {new Date().getFullYear()}
            <span className="mx-2 text-zinc-400">•</span>
            A Standex Digital company
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-black uppercase tracking-widest text-zinc-800">
            <a href="mailto:standexaiofficial@gmail.com" className="hover:text-[#7C5CFC] transition-colors">
              standexaiofficial@gmail.com
            </a>
            <a href="https://www.linkedin.com/company/standexai" className="hover:text-[#7C5CFC] transition-colors" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <Link href="/learn" className="hover:text-[#7C5CFC] transition-colors">Learn</Link>
            <Link href="/cognitive-audit" className="hover:text-[#7C5CFC] transition-colors">Skills Bechmark</Link>
            <Link href="/projects" className="hover:text-[#7C5CFC] transition-colors">Open Projects</Link>
            <Link href="/prime" className="hover:text-[#7C5CFC] transition-colors">Prime</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
