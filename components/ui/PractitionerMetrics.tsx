"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Activity, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
  {
    label: "Processing Speed",
    value: "10X",
    description: "How a Series B fintech rebuilt their compliance pipeline using a three-agent orchestration pattern.",
    category: "Agentic • Fintech",
    icon: Zap,
    color: "text-amber-500"
  },
  {
    label: "P99 Latency",
    value: "<500ms",
    description: "Hybrid dense-sparse retrieval architecture with re-ranking — deployed in a HIPAA-compliant AWS environment.",
    category: "RAG • Healthcare",
    icon: Activity,
    color: "text-emerald-500"
  },
  {
    label: "Hallucination Rate",
    value: "-63%",
    description: "DPO fine-tuning on proprietary datasets with automated eval harness catching regressions before production.",
    category: "Fine-Tuning • SAEs",
    icon: TrendingDown,
    color: "text-rose-500"
  }
];

type ParsedValue = {
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
};

function parseMetricValue(raw: string): ParsedValue | null {
  const match = raw.match(/-?\d+(\.\d+)?/);
  if (!match || match.index === undefined) return null;
  const value = Number(match[0]);
  const decimals = match[0].includes(".") ? match[0].split(".")[1].length : 0;
  return {
    value,
    prefix: raw.slice(0, match.index),
    suffix: raw.slice(match.index + match[0].length),
    decimals,
  };
}

function useCountUpValue(raw: string, active: boolean, delayMs: number) {
  const parsed = useMemo(() => parseMetricValue(raw), [raw]);
  const [display, setDisplay] = useState(raw);

  useEffect(() => {
    if (!active || !parsed) {
      setDisplay(raw);
      return;
    }

    let frame = 0;
    let timeout = 0;
    const duration = 1200;
    const startValue = 0;
    const { value, prefix, suffix, decimals } = parsed;

    const tick = (startTime: number) => (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const current = startValue + (value - startValue) * t;
      const formatted =
        decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (t < 1) frame = requestAnimationFrame(tick(startTime));
    };

    timeout = window.setTimeout(() => {
      frame = requestAnimationFrame(tick(performance.now()));
    }, delayMs);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [active, delayMs, parsed, raw]);

  return display;
}

function MetricCard({
  metric,
  index,
  active,
}: {
  metric: (typeof metrics)[0];
  index: number;
  active: boolean;
}) {
  const displayValue = useCountUpValue(metric.value, active, index * 140);

  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)", y: -6 }}
      className={cn(
        "group relative p-10 lg:p-14 transition-all duration-500 border-white/10",
        index < metrics.length - 1 && "md:border-r border-b md:border-b-0"
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="landing-gloss-sweep landing-gloss-sweep--dark" />
      </div>
      <div className="flex flex-col h-full uppercase tracking-[0.25em]">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-[9px] font-black text-zinc-500 group-hover:text-[#7C5CFC] transition-colors">
            {metric.category}
          </span>
          <metric.icon className="h-4 w-4 text-zinc-700 group-hover:text-white transition-colors" />
        </div>

        <h3 className="mb-4 text-xl font-black text-white tracking-tight normal-case leading-snug">
          {metric.label}
        </h3>

        <p className="mb-12 text-[10px] font-bold text-zinc-500 leading-relaxed normal-case line-clamp-3">
          {metric.description}
        </p>

        <div className="mt-auto pt-8 border-t border-white/5 flex items-end justify-between">
          <div className="flex flex-col">
            <span
              className={cn(
                "text-4xl lg:text-6xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-105 origin-left",
                metric.color
              )}
            >
              {displayValue}
            </span>
            <span className="mt-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              {metric.label.split(" ")[1] ?? "Metric"}
            </span>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:bg-[#7C5CFC] hover:border-[#7C5CFC] hover:text-white group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function PractitionerMetrics() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-20%" });

  return (
    <section ref={sectionRef} className="relative py-24 bg-zinc-900 overflow-hidden">
      {/* Background SOTA Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full bg-[radial-gradient(ellipse_at_center,#7C5CFC,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-zinc-400">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Open Projects
          </div>
          <h2 className="font-syne text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight mb-8">
            Built by <span className="text-[#7C5CFC]">practitioners.</span>
          </h2>
          <p className="max-w-xl text-lg font-medium text-zinc-400 leading-relaxed">
            Every case study is authored by an engineer who shipped it. No slides, no theory. Real technical implementation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 border border-white/10 rounded-[48px] overflow-hidden bg-white/[0.02] backdrop-blur-3xl md:-translate-x-4">
          {metrics.map((metric, i) => (
            <MetricCard key={metric.label} metric={metric} index={i} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
