"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";

const tags = [
  "RAG Systems", "Agentic AI", "LLM APIs", "Vector DBs",
  "Production Deploy", "Multi-agent", "Evaluation", "Fine-tuning",
  "Function Calling", "Observability", "Embeddings", "Prompt Eng",
];

const stats = [
  { value: "6", unit: "wk", label: "Program" },
  { value: "3×", unit: "/wk", label: "Live Sessions" },
  { value: "100%", unit: "", label: "Applied" },
  { value: "∞", unit: "", label: "Rolling Cohorts" },
];

const innerOrbitItems = [
  { label: "RAG", angle: 0 },
  { label: "Agents", angle: 90 },
  { label: "LLMs", angle: 180 },
  { label: "Deploy", angle: 270 },
];

const outerOrbitItems = [
  { label: "Vector DB", angle: 45 },
  { label: "Evals", angle: 135 },
  { label: "Multi-agent", angle: 225 },
  { label: "Fine-tune", angle: 315 },
];

function OrbitalElement() {
  return (
    <div className="relative hidden lg:flex items-center justify-center w-[360px] h-[360px] shrink-0">
      <motion.div
        className="absolute rounded-full border border-[#7C5CFC]/30"
        style={{ width: 200, height: 200 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        {innerOrbitItems.map((item) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = 100 + 96 * Math.cos(rad) - 26;
          const y = 100 + 96 * Math.sin(rad) - 13;
          return (
            <motion.div
              key={item.label}
              className="absolute"
              style={{ left: x, top: y }}
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            >
              <span className="block rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-700 shadow-sm whitespace-nowrap">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="absolute rounded-full border border-zinc-200/80"
        style={{ width: 320, height: 320 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {outerOrbitItems.map((item) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = 160 + 152 * Math.cos(rad) - 30;
          const y = 160 + 152 * Math.sin(rad) - 13;
          return (
            <motion.div
              key={item.label}
              className="absolute"
              style={{ left: x, top: y }}
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              <span className="block rounded-full border border-[#7C5CFC]/20 bg-[#7C5CFC]/8 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#7C5CFC] whitespace-nowrap">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-[#7C5CFC] flex items-center justify-center shadow-2xl shadow-[#7C5CFC]/30"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <GraduationCap className="h-7 w-7 text-white" />
        </motion.div>
        <motion.div
          className="mt-2 text-[9px] font-black uppercase tracking-widest text-zinc-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Applied AI
        </motion.div>
      </div>
    </div>
  );
}

export function LandingHero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-white border-b border-zinc-100">

      {/* ── Animated bg overlays — all absolutely positioned, never affect flow ── */}
      {/* Drifting grid */}
      <div
        aria-hidden
        className="pointer-events-none animate-grid-drift"
        style={{
          position: "absolute",
          inset: -80,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(124,92,252,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,92,252,0.055) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Diagonal hatch */}
      <div
        aria-hidden
        className="pointer-events-none animate-hatch-slide"
        style={{
          position: "absolute",
          inset: -60,
          zIndex: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(124,92,252,0.022) 0px, rgba(124,92,252,0.022) 1px, transparent 1px, transparent 30px)",
        }}
      />
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none animate-radial-breathe"
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          width: 900,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(124,92,252,0.07) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-0 lg:pt-14">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 mb-10">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/25 bg-[#7C5CFC]/8 px-4 py-2"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7C5CFC]">
                Applied AI Engineering Platform
              </span>
            </motion.div>

            <div className="mb-3 space-y-1">
              {["From any level", "AI-ready."].map((line, li) => (
                <div key={li} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "100%", opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.1 + li * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`block font-syne tracking-tight leading-[0.88] font-black text-[clamp(3rem,7vw,6rem)] ${li === 1 ? "text-[#7C5CFC]" : "text-zinc-900"}`}
                  >
                    {line}
                  </motion.h1>
                </div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="text-base lg:text-lg font-medium text-zinc-500 mb-7 max-w-lg leading-relaxed"
            >
              A 6-week rolling program — outcome per week, milestone per week.
              Move from any starting point to building production AI systems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/masterclass"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#7C5CFC]/20 hover:bg-[#6042db] transition-all active:scale-95"
              >
                <GraduationCap className="h-4 w-4" />
                Join The Academy
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-zinc-200 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-zinc-900 hover:border-[#7C5CFC] hover:text-[#7C5CFC] transition-all active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                Free Assessment
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <OrbitalElement />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-zinc-100">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.07 }}
              className="border-r last:border-r-0 border-zinc-100 px-0 py-5 sm:px-6 first:pl-0"
            >
              <p className="font-syne text-2xl font-black text-zinc-900">
                {s.value}<span className="text-[#7C5CFC]">{s.unit}</span>
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tag ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.65 }}
          className="overflow-hidden border-t border-zinc-100 py-3.5 -mx-4 sm:-mx-6"
          style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
        >
          <div className="flex gap-3 w-max" style={{ animation: "marquee 28s linear infinite" }}>
            {[...tags, ...tags].map((tag, i) => (
              <span key={i} className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
