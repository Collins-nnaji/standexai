"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { 
  Brain, 
  Search, 
  Zap, 
  BarChart3, 
  Binary, 
  Settings2, 
  Sparkles, 
  Database, 
  Map, 
  BookOpen, 
  Cpu,
  ChevronRight
} from "lucide-react";
import { LivePlayground } from "@/components/lab/LivePlayground";
import { ArchVisualizer } from "@/components/lab/ArchVisualizer";
import { BenchmarkLeaderboard } from "@/components/lab/BenchmarkLeaderboard";
import { VectorExplorer } from "@/components/lab/VectorExplorer";
import { ContextVisualizer } from "@/components/lab/ContextVisualizer";
import { ModelSimulator } from "@/components/lab/ModelSimulator";
import { OpsWorkbench } from "@/components/lab/OpsWorkbench";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/network/TopNav";
import { neonAuthClient } from "@/lib/neon/auth-client";

export default function EvalLabPage() {
  const { data: session } = neonAuthClient.useSession();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = useState("hero");

  const sections = [
    { id: "hero", name: "System Log", icon: Sparkles },
    { id: "architecture", name: "Schematics", icon: Brain },
    { id: "benchmarks", name: "Analytics", icon: BarChart3 },
    { id: "vectors", name: "Vector Engine", icon: Map },
    { id: "context", name: "Buffer Lab", icon: BookOpen },
    { id: "simulators", name: "Inference Ops", icon: Settings2 },
    { id: "live", name: "Real-time Node", icon: Zap },
    { id: "ops", name: "Cost/Env Ops", icon: Cpu },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPos && element.offsetTop + element.offsetHeight > scrollPos) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-[#fafafa] overflow-x-hidden selection:bg-[var(--accent-primary)]/30 [font-family:var(--font-console-mono),ui-monospace,monospace]">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,92,252,0.03),transparent_100%)] pointer-events-none z-0" />
      
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] z-[110] origin-left shadow-[0_0_10px_var(--accent-primary)]" style={{ scaleX }} />
      <TopNav user={session?.user} />
      
      {/* --- Side Navigation (Diagnostic Rail) --- */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-[90] hidden xl:flex flex-col gap-3">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            className={`group relative flex items-center justify-center w-10 h-10 rounded border transition-all duration-300 ${
              activeSection === s.id 
              ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] shadow-[0_0_15px_rgba(124,92,252,0.3)] text-white" 
              : "bg-black/40 border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300"
            }`}
          >
            <s.icon className="h-4 w-4 relative z-10" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-1 bg-zinc-900 border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap translate-x-[-5px] group-hover:translate-x-0">
              {s.name}
            </div>
          </button>
        ))}
      </nav>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section id="hero" className="relative pt-32 pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-start text-left space-y-12"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="h-20 w-20 flex items-center justify-center border-2 border-[var(--accent-primary)] rounded shadow-[0_0_30px_rgba(124,92,252,0.2)]">
                   <Brain className="h-10 w-10 text-[var(--accent-primary)]" />
                </div>
                <div className="space-y-1">
                   <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-2">
                     <span className="text-white">INTEL</span>
                     <span className="text-[var(--accent-primary)] opacity-80">.LAB</span>
                   </h1>
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[9px] font-black uppercase tracking-[0.3em]">
                         Status: Operational
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">
                         Node: SXAI-V26
                      </div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full">
                <div className="space-y-6">
                  <p className="text-zinc-400 text-xl font-medium leading-relaxed max-w-xl">
                    High-fidelity diagnostics suite for Transformers, Semantic Cartography, 
                    and Large Language Model performance telemetry.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={() => scrollToSection("architecture")}
                      className="px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-[8px_8px_0_rgba(124,92,252,0.3)] hover:shadow-none translate-y-0 active:translate-y-1"
                    >
                      Initialize Diagnostic
                    </button>
                  </div>
                </div>
                
                <div className="hidden lg:grid grid-cols-2 gap-4 border border-white/5 p-6 bg-white/[0.02]">
                   {[
                     { label: "Architecture", val: "Transformer-V3" },
                     { label: "Weights", val: "FP16 / INT8" },
                     { label: "Telemetry", val: "Active" },
                     { label: "Registry", val: "Global-SOTA" }
                   ].map((item, i) => (
                     <div key={i} className="space-y-1 border-b border-white/[0.05] pb-3 last:border-0 md:border-b-0">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-black text-zinc-300 uppercase tracking-tighter italic">{item.val}</p>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- Tools Grid --- */}
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-32">
          
          <section id="architecture" className="space-y-12 scroll-mt-24 pt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--accent-primary)]">
                   <div className="h-1 w-1 bg-current" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">System Schematics</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white flex items-center gap-4 uppercase italic">
                  Module_01: Architecture
                </h2>
                <p className="text-zinc-500 font-medium max-w-xl text-sm uppercase tracking-widest">
                  Transformer block visualization and layer-wise attention mapping.
                </p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Load State</span>
                    <span className="text-xs font-black text-[var(--brand-teal)] uppercase tracking-tighter">Verified</span>
                 </div>
                 <div className="h-12 w-[1px] bg-white/10" />
                 <div className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest">
                   M01
                 </div>
              </div>
            </div>
            
            <div className="border border-white/5 bg-black/40 shadow-2xl relative">
              <div className="absolute top-4 left-4 flex gap-1 z-10">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
              </div>
              <ArchVisualizer />
            </div>
          </section>

          {/* 2. Benchmark Leaderboard Section */}
          <section id="benchmarks" className="space-y-12 scroll-mt-24">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--brand-teal)]">
                   <div className="h-1 w-1 bg-current" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Comparative Analytics</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white flex items-center gap-4 uppercase italic">
                  Module_02: Benchmarks
                </h2>
                <p className="text-zinc-500 font-medium max-w-xl text-sm uppercase tracking-widest">
                  Quantitative performance metrics across standard LLM evaluation frameworks.
                </p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest">
                M02
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 border border-white/5 bg-black/40 p-8 md:p-12 shadow-sm">
                <BenchmarkLeaderboard />
              </div>
              <div className="border border-white/5 bg-zinc-900/50 p-8 md:p-12 shadow-2xl text-white space-y-8 flex flex-col justify-center">
                <h3 className="text-xl font-black italic tracking-tighter uppercase border-l-2 border-[var(--brand-teal)] pl-4">Diagnostic Context</h3>
                <div className="space-y-6">
                  <div className="group space-y-1">
                    <h4 className="font-black text-[var(--brand-teal)] text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Zap className="h-3 w-3" /> MMLU_PROC
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">Massive Multitask Language Understanding. 57 subjects across STEM and Humanities.</p>
                  </div>
                  <div className="group space-y-1">
                    <h4 className="font-black text-blue-400 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Binary className="h-3 w-3" /> GSM8k_LOGIC
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">Multi-step mathematical reasoning and logic consistency tests.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Vector Space Explorer Section */}
          <section id="vectors" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--accent-primary)]">
                   <div className="h-1 w-1 bg-current" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">High-Dimensional Mapping</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white flex items-center gap-4 uppercase italic">
                  Module_03: Vectors
                </h2>
                <p className="text-zinc-500 font-medium max-w-xl text-sm uppercase tracking-widest">
                  Latent space projection and semantic proximity analysis.
                </p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest">
                M03
              </div>
            </div>
            <div className="border border-white/5 bg-black/40 overflow-hidden shadow-2xl">
              <VectorExplorer />
            </div>
          </section>

          {/* 4. Context Window Visualizer Section */}
          <section id="context" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--brand-teal)]">
                   <div className="h-1 w-1 bg-current" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Memory Buffer Specs</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white flex items-center gap-4 uppercase italic">
                  Module_04: Buffer
                </h2>
                <p className="text-zinc-500 font-medium max-w-xl text-sm uppercase tracking-widest">
                  Context window visualization and sliding-window attention decay.
                </p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest">
                M04
              </div>
            </div>
            <div className="border border-white/5 bg-black/40 shadow-2xl">
              <ContextVisualizer />
            </div>
          </section>

          {/* 5. Simulators Section */}
          <section id="simulators" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--accent-primary)]">
                   <div className="h-1 w-1 bg-current" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Inference Simulation</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white flex items-center gap-4 uppercase italic">
                  Module_05: Simulator
                </h2>
                <p className="text-zinc-500 font-medium max-w-xl text-sm uppercase tracking-widest">
                  Probabilistic token sampling and temperature gradient analysis.
                </p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest">
                M05
              </div>
            </div>
            <div className="border border-white/5 bg-black/40 shadow-2xl">
              <ModelSimulator />
            </div>
          </section>

          {/* 6. Live Inference Lab Section */}
          <section id="live" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                   <div className="h-1 w-1 bg-current" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Node Execution</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white flex items-center gap-4 uppercase italic">
                  Module_06: Live Node
                </h2>
                <p className="text-zinc-500 font-medium max-w-xl text-sm uppercase tracking-widest">
                  Direct production-environment inference with token-level telemetry.
                </p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest">
                M06
              </div>
            </div>
            <div className="border border-white/5 bg-black/40 shadow-2xl">
              <LivePlayground />
            </div>
          </section>

          {/* 7. Ops Workbench Section */}
          <section id="ops" className="space-y-12 scroll-mt-24 pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--brand-teal)]">
                   <div className="h-1 w-1 bg-current" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">FinOps & Sustainability</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white flex items-center gap-4 uppercase italic">
                  Module_07: Infrastructure
                </h2>
                <p className="text-zinc-500 font-medium max-w-xl text-sm uppercase tracking-widest">
                  Operational cost analysis, token budgeting, and carbon footprint telemetry.
                </p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest">
                M07
              </div>
            </div>
            <div className="border border-white/5 bg-black/40 shadow-2xl">
              <OpsWorkbench />
            </div>
          </section>

        </div>
      </main>

      <footer className="w-full py-24 border-t border-white/5 bg-black">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-3">
             <div className="flex items-center gap-4">
                <div className="h-8 w-8 border border-[var(--accent-primary)] rounded flex items-center justify-center">
                   <div className="h-2 w-2 bg-[var(--accent-primary)] animate-pulse" />
                </div>
                <div className="text-white font-black text-xs uppercase tracking-[0.4em]">StandexAI / INTEL-LAB</div>
             </div>
             <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Kernel Version 4.8.2-SXAI • 2026 Production Environment</p>
          </div>
          <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">
             <a href="#" className="hover:text-[var(--accent-primary)] transition-all">SOP_DOCS</a>
             <a href="#" className="hover:text-[var(--accent-primary)] transition-all">RESEARCH_PAPERS</a>
             <a href="#" className="hover:text-[var(--accent-primary)] transition-all">SOURCE_CODE</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
