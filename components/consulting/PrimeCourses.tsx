"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Cpu, 
  Layout, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Globe,
  Plus,
  Minus
} from "lucide-react";
import { useCurrency, Currency } from "@/hooks/useCurrency";

const primeCourses = [
  {
    id: "agentic-architecture",
    title: "Multi-Agent System Implementation",
    description: "Master the deployment of autonomous agent teams for complex enterprise workflows using LangGraph and AutoGen.",
    icon: Bot,
    color: "text-[#7C5CFC]",
    bg: "bg-[#7C5CFC]/5",
    prices: {
      USD: 2500,
      GBP: 2000,
      NGN: 3750000
    },
    modules: [
      "Agentic Logic Foundations",
      "LangGraph State Machines",
      "Advanced RAG with Agents",
      "Production Error Handling",
      "Scalable Agent Communication"
    ]
  },
  {
    id: "product-engineering",
    title: "Full-Stack AI Product Engineering",
    description: "Architect and build production-grade AI platforms from the ground up. Focus on scaling, latency, and observability.",
    icon: Cpu,
    color: "text-blue-500",
    bg: "bg-blue-500/5",
    prices: {
      USD: 1800,
      GBP: 1450,
      NGN: 2700000
    },
    modules: [
      "AI Pipeline Architecture",
      "Next.js & Supabase AI Auth",
      "Streaming Response Orchestration",
      "Vector Storage Optimization",
      "Monitoring & Drift Detection"
    ]
  },
  {
    id: "app-builders",
    title: "Bespoke AI App Mastery",
    description: "Leverage v0, Cursor, and automated workflows to build and deploy complex software in days, not months.",
    icon: Layout,
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
    prices: {
      USD: 1200,
      GBP: 950,
      NGN: 1800000
    },
    modules: [
      "Prompt Engineering for Code",
      "Cursor Custom Instructions",
      "v0 Component Orchestration",
      "Rapid Deployment Pipelines",
      "AI-Driven Feature Iteration"
    ]
  }
];

export function PrimeCourses() {
  const { currency, setCurrency, formatPrice } = useCurrency();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="mt-20 lg:mt-32">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-1.5 w-8 rounded-full bg-[#7C5CFC]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Bespoke Implementation Courses</span>
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl font-black text-zinc-900 leading-tight">
             Elite Learning for <br/><span className="text-[#7C5CFC]">Implementation Partners.</span>
          </h2>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-2xl border border-zinc-200 shadow-sm">
           {(["USD", "GBP", "NGN"] as Currency[]).map((c) => (
             <button
               key={c}
               onClick={() => setCurrency(c)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                 currency === c 
                   ? "bg-white text-zinc-900 shadow-md" 
                   : "text-zinc-500 hover:text-zinc-900"
               }`}
             >
               {c === "NGN" ? "₦ NGN" : c === "GBP" ? "£ GBP" : "$ USD"}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {primeCourses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col rounded-[40px] border border-zinc-100 bg-white p-8 shadow-sm hover:shadow-2xl hover:shadow-[#7C5CFC]/10 transition-all duration-500 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none rounded-bl-[100px] ${course.bg}`} />
            
            <div className="mb-8">
               <div className={`h-14 w-14 rounded-2xl ${course.bg} ${course.color} flex items-center justify-center mb-6 ring-1 ring-zinc-950/5 group-hover:scale-110 transition-transform duration-500`}>
                  <course.icon className="h-7 w-7" strokeWidth={2.5} />
               </div>
               <h3 className="font-syne text-2xl font-black text-zinc-900 mb-3 tracking-tight group-hover:text-[#7C5CFC] transition-colors">{course.title}</h3>
               <p className="text-sm font-medium text-zinc-500 leading-relaxed mb-8">
                 {course.description}
               </p>
            </div>

            <div className="flex items-center gap-2 mb-8 bg-zinc-50 border border-zinc-100 p-4 rounded-3xl">
               <span className="text-3xl font-black text-zinc-900">{formatPrice(course.prices)}</span>
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">/ Bespoke Track</span>
            </div>

            {/* Modules List (Expandable) */}
            <div className="flex-1">
               <button 
                 onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
                 className="flex items-center justify-between w-full text-left mb-4 px-2 hover:opacity-70 transition-opacity"
               >
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] flex items-center gap-2">
                   <Zap className="h-3 w-3 fill-current" /> {course.modules.length} Implementation Modules
                 </span>
                 {expandedId === course.id ? <Minus className="h-4 w-4 text-zinc-400" /> : <Plus className="h-4 w-4 text-zinc-400" />}
               </button>

               <AnimatePresence>
                 {expandedId === course.id && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden space-y-3 mb-8"
                   >
                     {course.modules.map((m, idx) => (
                       <div key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs font-semibold text-zinc-700">{m}</span>
                       </div>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <button className="mt-auto w-full flex h-14 items-center justify-center gap-3 rounded-2xl bg-zinc-900 text-white hover:bg-[#7C5CFC] transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7C5CFC]/10">
              Enrol in Bespoke Track
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Feature Footer */}
      <div className="mt-16 p-8 rounded-[40px] bg-zinc-950 border border-zinc-900 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7C5CFC]/10 to-transparent pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#7C5CFC]">
                  <Globe className="h-8 w-8" />
               </div>
               <div>
                  <h4 className="text-xl font-black text-white mb-1">Global Implementation Standards</h4>
                  <p className="text-sm font-medium text-zinc-500">Curriculums vetted by Standex Prime engineering core for international scale.</p>
               </div>
            </div>
            <div className="flex items-center gap-4 text-[#7C5CFC]">
               <Clock className="h-5 w-5" />
               <span className="text-[10px] font-black uppercase tracking-widest">Self-Paced + Live Sync Support</span>
            </div>
         </div>
      </div>
    </section>
  );
}
