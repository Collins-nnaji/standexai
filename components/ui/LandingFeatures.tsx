"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Building2, ChevronRight, BrainCircuit } from "lucide-react";

const toolLogos = [
  { name: "Next.js", src: "/images/nextjslogo.png" },
  { name: "OpenAI", src: "/images/openai logo.svg" },
  { name: "Claude", src: "/images/claude logo.svg" },
  { name: "Google", src: "/images/google logo.png" },
  { name: "Vercel", src: "/images/vercel logo.svg" },
  { name: "React", src: "/images/react logo.png" },
  { name: "GitHub", src: "/images/github logo.png" },
  { name: "Azure", src: "/images/azure logo.png" },
  { name: "Stripe", src: "/images/stripe logo.png" },
  { name: "Neon", src: "/images/neon logo.webp" },
  { name: "Cursor", src: "/images/cursor logo.png" },
];

export function LandingFeatures() {
  return (
    <section className="relative w-full bg-white antialiased">

      {/* ── Thick partial purple divider ── */}
      <div className="flex justify-center -mt-0.5" aria-hidden>
        <div className="h-1.5 w-40 rounded-full bg-[#7C5CFC] shadow-[0_0_24px_6px_rgba(124,92,252,0.45)]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 flex flex-col gap-20">

        {/* ── Tool logos marquee ── */}
        <div className="flex flex-col items-center gap-6">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
            Tools you&apos;ll master
          </p>

          <div className="relative w-full overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes lf-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              .lf-marquee-track { animation: lf-marquee 28s linear infinite; }
              .lf-marquee-track:hover { animation-play-state: paused; }
            ` }} />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="lf-marquee-track flex items-center gap-12 w-max">
              {[...toolLogos, ...toolLogos].map((logo, i) => (
                <div key={`${logo.name}-${i}`} className="flex flex-col items-center gap-2.5 shrink-0 group">
                  <div className="h-12 w-12 relative transition-transform duration-300 group-hover:scale-110 drop-shadow-sm">
                    <Image src={logo.src} alt={logo.name} fill className="object-contain" unoptimized />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500 group-hover:text-zinc-800 transition-colors tracking-wide">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Three feature cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Card 1 — Earning Potential */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-violet-300 transition-all"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-400" />
            <div className="flex flex-col gap-4 p-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-violet-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-500">
                  Earning Potential
                </span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-900 leading-snug">
                Command top-tier pay.<br />Or go it alone.
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                AI engineering is the fastest-growing and highest-paid discipline in tech. Graduate with the skills to land a senior role <em>or</em> launch your own AI product company — the leverage is yours.
              </p>
              <Link
                href="/learn"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors pt-4 border-t border-zinc-100"
              >
                See what you&apos;ll earn <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2 — Continuous Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-sky-300 transition-all"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 to-blue-500" />
            <div className="flex flex-col gap-4 p-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                  <BrainCircuit className="h-4 w-4 text-sky-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-500">
                  AI Assessment
                </span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-900 leading-snug">
                Test your knowledge.<br />Track your growth.
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                Don&apos;t just learn — prove it. Our continuous AI Assessment tool gives you structured tests that track your progression, expose gaps in real time, and show you exactly where to level up next.
              </p>
              <Link
                href="/assessment"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors pt-4 border-t border-zinc-100"
              >
                Take a free assessment <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3 — Open Projects */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />
            <div className="flex flex-col gap-4 p-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                  Open Projects
                </span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-900 leading-snug">
                Work on real deals.<br />With real partners.
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                Graduates unlock exclusive access to live industry briefs. Build alongside engineers shipping for{" "}
                <span className="font-semibold text-zinc-700">Microsoft</span>,{" "}
                <span className="font-semibold text-zinc-700">Google</span>, and{" "}
                <span className="font-semibold text-zinc-700">Anthropic</span> — not in a sandbox, in production.
              </p>
              <Link
                href="/projects"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors pt-4 border-t border-zinc-100"
              >
                Browse open projects <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
