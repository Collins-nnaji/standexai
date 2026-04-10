"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Users, Sparkles, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export function ProjectsHero() {
  return (
    <div className="relative w-full mb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-[#7C5CFC] mb-4">
          <Rocket className="h-3 w-3" />
          Open Projects — Arm 02
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="font-syne text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight leading-[1.05] mb-2">
              Join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] to-blue-500">
                Build.
              </span>
            </h1>
            <p className="text-sm font-medium text-zinc-500 max-w-lg">
              Exceptional graduates from our 6-week cohort are invited to join
              active product teams — gaining real-world AI engineering
              experience on projects being built right now.
            </p>
          </div>

          <Link
            href="/learn"
            className="inline-flex items-center gap-2 shrink-0 rounded-2xl bg-zinc-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#7C5CFC] transition-colors"
          >
            Complete the 6-Week Program First
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* How it works — compact 3-step */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-3 gap-3 mb-8"
      >
        {[
          {
            step: "01",
            icon: Sparkles,
            title: "Learn & Build",
            desc: "Finish the 6-week applied AI engineering program",
          },
          {
            step: "02",
            icon: Star,
            title: "Perform Exceptionally",
            desc: "Top performers are identified through capstone projects",
          },
          {
            step: "03",
            icon: Users,
            title: "Join a Live Team",
            desc: "Get accepted onto a real project and become part of the build",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFC]/10 text-[#7C5CFC]">
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">
                Step {s.step}
              </p>
              <p className="text-xs font-black text-zinc-900 mb-0.5">
                {s.title}
              </p>
              <p className="text-[11px] font-medium text-zinc-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Divider with label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">
          Active Projects
        </span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>
    </div>
  );
}
