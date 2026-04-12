"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Building2, ChevronRight, BrainCircuit, Terminal } from "lucide-react";

export function LandingFeatures() {
  const features = [
    {
      id: "assessment",
      label: "AI Assessment",
      icon: BrainCircuit,
      title: "Test your knowledge.",
      description: "Proven technical validation via continuous, production-grade assessment toolsets.",
      color: "from-sky-400 to-blue-500",
      link: "/assessment",
      cta: "Take Assessment",
    },
    {
      id: "projects",
      label: "Open Projects",
      icon: Building2,
      title: "Work on real deals.",
      description: "Unlock exclusive access to live industry briefs shipping for Google and Anthropic.",
      color: "from-emerald-400 to-teal-500",
      link: "/projects",
      cta: "Browse Projects",
    },
    {
      id: "console",
      label: "Engineering Console",
      icon: Terminal,
      title: "Your private lab.",
      description: "Access a dedicated cloud environment to build, test, and host your agents.",
      color: "from-amber-400 to-orange-500",
      link: "/learn",
      cta: "Launch Console",
    },
  ];

  return (
    <section className="relative w-full antialiased py-16 lg:py-24 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">The Core Pillars</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-zinc-900 leading-[1.1]">
            Everything you need <br className="hidden sm:block" /> to build the future.
          </h2>
        </div>

        {/* Unified Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative rounded-[32px] border border-zinc-200 bg-white shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-700 hover:shadow-[0_48px_100px_-20px_rgba(0,0,0,0.12)] hover:border-zinc-300"
        >
          {/* Internal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
            {features.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="relative flex flex-col p-8 lg:p-10 group/item hover:bg-zinc-50/50 transition-colors"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${f.color} opacity-0 group-hover/item:opacity-100 transition-opacity`} />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                    <f.icon className="h-5 w-5 text-zinc-900" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                    {f.label}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-black tracking-tight text-zinc-950 leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-sm font-semibold text-zinc-500 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <Link
                  href={f.link}
                  className="mt-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-900 group-hover/item:text-[#7C5CFC] transition-colors"
                >
                  {f.cta}
                  <ChevronRight className="h-3.5 w-3.5 group-hover/item:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Interactive Sheen */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
            <div className="landing-gloss-sweep" />
          </div>
        </motion.div>

        {/* Unified Bottom Glow */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-32 bg-violet-100/30 blur-[100px] -z-10" />
      </div>
    </section>
  );
}
