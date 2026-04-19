"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView, Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, GraduationCap, Rocket, Building2 } from "lucide-react";

/** Minimal ticker — gate, onboarding, collaboration */
const openProjectPathTags = [
  "Exceptional capstone only",
  "Invite after review",
  "Squad match",
  "Contributor onboarding",
  "Real backlog & PRs",
  "Same bar as the team",
];

const arms = [
  {
    badge: "01",
    icon: GraduationCap,
    title: "Learn",
    tagline: "Any level → AI-ready in 6 weeks",
    description:
      "Outcome-focused. Every week ends with something deployed. Rolling cohorts, live sessions, verified certificate.",
    highlights: [
      "Week-by-week milestones",
      "From foundations to production",
      "Live cohort + async content",
      "Open Projects if capstone is exceptional",
    ],
    cta: { label: "View Curriculum", href: "/learn" },
    accent: "#A892FF",
    border: "border-[#7C5CFC]/30",
    chipBg: "bg-[#7C5CFC]/15",
    chipText: "text-[#A892FF]",
    featured: true,
  },
  {
    badge: "02",
    icon: Rocket,
    title: "Open Projects",
    tagline: "Not automatic — earned through the capstone",
    description:
      "You collaborate on live builds only after you finish the Academy with an exceptional capstone. We then run a short onboarding: fit review, squad assignment, access to rituals and backlog — then you ship like a contributor, not a student.",
    highlights: [
      "Gate: outstanding capstone + cohort performance",
      "Onboarding: review → squad match → repo & comms access",
      "Work: tickets, PRs, reviews — mentored, production-grade",
      "Limited seats; most graduates continue without this track",
    ],
    cta: { label: "See Projects", href: "/projects" },
    accent: "#34D399",
    border: "border-emerald-500/20",
    chipBg: "bg-emerald-500/10",
    chipText: "text-emerald-400",
    featured: false,
  },
  {
    badge: "03",
    icon: Building2,
    title: "Prime",
    tagline: "Enterprise AI implementation",
    description:
      "We embed AI engineering capability into your organisation — from architecture to full deployment.",
    highlights: [
      "Managed AI implementation",
      "AI talent network access",
    ],
    cta: { label: "Talk to Us", href: "/prime" },
    accent: "#FCD34D",
    border: "border-amber-400/20",
    chipBg: "bg-amber-400/10",
    chipText: "text-amber-400",
    featured: false,
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// Floating decoration: slowly drifting glowing orbs
function FloatingOrbs() {
  return (
    <>
      <motion.div
        className="absolute top-16 right-24 w-40 h-40 rounded-full bg-[#7C5CFC]/10 blur-[80px] pointer-events-none"
        animate={{ y: [-10, 10, -10], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-16 left-24 w-56 h-56 rounded-full bg-blue-500/8 blur-[100px] pointer-events-none"
        animate={{ y: [10, -10, 10], scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

export function ThreeArmSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative w-full bg-zinc-950 border-b border-white/5 px-4 sm:px-6 py-16 lg:py-24 overflow-hidden">
      <FloatingOrbs />

      {/* Subtle dark grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header — minimal: gate, onboarding, collaboration */}
        <div className="mb-10 max-w-2xl" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400/90">
              Open Projects
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] as const }}
            className="font-syne text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[0.95]"
          >
            Collaboration{" "}
            <span className="text-emerald-400">by invitation.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.14, duration: 0.45 }}
            className="mt-3 text-sm font-medium text-zinc-400 leading-relaxed"
          >
            Only for people who pass the{" "}
            <span className="text-zinc-200">capstone at an exceptional standard</span> — not every graduate.
            If you clear that bar, we onboard you into a squad on a live build.
          </motion.p>
          <motion.dl
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-x-8"
          >
            <div>
              <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5">What it takes</dt>
              <dd className="text-[13px] font-semibold text-zinc-400 leading-snug">
                Strong capstone delivery, consistent cohort work, and readiness to own tasks like a mid-level contributor.
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5">How you&apos;re onboarded</dt>
              <dd className="text-[13px] font-semibold text-zinc-400 leading-snug">
                Short review → squad match → access to backlog, repo, and ceremonies — then you ship with the same expectations as the rest of the team.
              </dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.22 }}
          className="overflow-hidden border-y border-emerald-500/10 py-3 -mx-4 sm:-mx-6 mb-10"
          style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
        >
          <div className="flex gap-2.5 w-max" style={{ 
            animationName: "marquee",
            animationDuration: "22s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite"
          }}>
            {[...openProjectPathTags, ...openProjectPathTags].map((tag, i) => (
              <span
                key={i}
                className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-200/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid lg:grid-cols-5 gap-6"
        >
          {/* Featured — Academy */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6 }}
            className={`lg:col-span-3 group relative rounded-[36px] border-2 ${arms[0].border} bg-white/[0.04] p-8 lg:p-10 overflow-hidden hover:bg-white/[0.07] transition-all duration-500 lg:-translate-y-3`}
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(124,92,252,0.12),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="landing-gloss-sweep landing-gloss-sweep--dark" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${arms[0].chipBg}`}>
                  <GraduationCap className="h-5 w-5" style={{ color: arms[0].accent }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Arm {arms[0].badge}
                </span>
              </div>

              <h3 className="font-syne text-2xl lg:text-3xl font-black text-white tracking-tight mb-1">
                {arms[0].title}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-wider mb-4" style={{ color: arms[0].accent }}>
                {arms[0].tagline}
              </p>
              <p className="text-sm font-medium text-zinc-400 mb-6 max-w-sm leading-relaxed">
                {arms[0].description}
              </p>

              <ul className="grid grid-cols-2 gap-2.5 mb-8">
                {arms[0].highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: `${arms[0].accent}80` }} />
                    <span className="text-[11px] font-semibold text-zinc-400">{h}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={arms[0].cta.href}
                className="inline-flex items-center gap-2 rounded-2xl border-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 hover:bg-[#7C5CFC]"
                style={{ borderColor: arms[0].accent, color: arms[0].accent }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "white";
                  (e.currentTarget as HTMLElement).style.borderColor = arms[0].accent;
                  (e.currentTarget as HTMLElement).style.backgroundColor = arms[0].accent.replace("A892FF", "7C5CFC");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = arms[0].accent;
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                {arms[0].cta.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Stacked — Open Projects + Prime */}
          <div className="lg:col-span-2 flex flex-col gap-4 lg:pt-6">
            {arms.slice(1).map((arm) => (
              <motion.div
                key={arm.badge}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`group relative flex-1 rounded-[28px] border ${arm.border} bg-white/[0.03] p-6 overflow-hidden hover:bg-white/[0.06] transition-all duration-400 ${arm.badge === "03" ? "lg:translate-x-6" : "lg:-translate-x-2"}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="landing-gloss-sweep landing-gloss-sweep--dark" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${arm.chipBg}`}>
                      <arm.icon className="h-4 w-4" style={{ color: arm.accent }} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                      Arm {arm.badge}
                    </span>
                  </div>
                  <h3 className="font-syne text-xl font-black text-white tracking-tight mb-0.5">
                    {arm.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: arm.accent }}>
                    {arm.tagline}
                  </p>
                  <p className="text-[12px] font-medium text-zinc-400 mb-4 leading-relaxed">
                    {arm.description}
                  </p>
                  <ul className="mb-5 space-y-1.5">
                    {arm.highlights.map((h, hi) => (
                      <li key={hi} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-70" style={{ color: arm.accent }} />
                        <span className="text-[11px] font-semibold text-zinc-500 leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={arm.cta.href}
                    className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                    style={{ borderColor: `${arm.accent}50`, color: arm.accent }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = `${arm.accent}20`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    }}
                  >
                    {arm.cta.label} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
