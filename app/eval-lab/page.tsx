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
    { id: "hero", name: "Welcome", icon: Sparkles },
    { id: "architecture", name: "Transformer", icon: Brain },
    { id: "benchmarks", name: "Benchmarks", icon: BarChart3 },
    { id: "vectors", name: "Vector Space", icon: Map },
    { id: "context", name: "Context Window", icon: BookOpen },
    { id: "simulators", name: "Inference", icon: Settings2 },
    { id: "live", name: "Live Lab", icon: Zap },
    { id: "ops", name: "Ops Workbench", icon: Cpu },
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
    <div className="flex min-h-screen flex-col bg-[var(--bg-app)] overflow-x-hidden selection:bg-[var(--accent-primary)]/20">
      <div className="grain-overlay" />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[var(--accent-primary)] z-[110] origin-left" style={{ scaleX }} />
      <TopNav user={session?.user} />
      
      {/* --- Side Navigation --- */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-[90] hidden xl:flex flex-col gap-4">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-[var(--line)] shadow-sm hover:border-[var(--accent-primary)]/50 transition-all overflow-hidden"
          >
            <div className={`absolute inset-0 transition-colors ${activeSection === s.id ? "bg-[var(--accent-primary)]/5" : "group-hover:bg-zinc-50"}`} />
            <s.icon className={`h-5 w-5 transition-colors relative z-10 ${activeSection === s.id ? "text-[var(--accent-primary)]" : "text-zinc-400 group-hover:text-zinc-600"}`} />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap translate-x-[-10px] group-hover:translate-x-0">
              {s.name}
            </div>
          </button>
        ))}
      </nav>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section id="hero" className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[80vh] flex items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--brand-purple)]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--brand-teal)]/5 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs font-bold uppercase tracking-[0.2em] shadow-sm">
                <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse" />
                Live Research Environment
              </div>
              <h1 className="text-6xl md:text-9xl font-bold tracking-[-0.03em] text-[var(--ink-900)] leading-[0.85]">
                Intelligence <span className="landing-text-brand-gradient">Lab</span>
              </h1>
              <p className="max-w-2xl text-[var(--ink-500)] text-xl font-medium leading-relaxed">
                A technical workbench to deconstruct Transformer architectures, 
                visualize attention mechanisms, and analyze model benchmarks.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <div className="flex items-center gap-3 px-6 py-3 bg-white border border-[var(--line)] rounded-3xl shadow-sm text-sm font-bold text-[var(--ink-500)]">
                  <Database className="h-5 w-5 text-[var(--brand-teal)]" />
                  SOTA MODELS
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white border border-[var(--line)] rounded-3xl shadow-sm text-sm font-bold text-[var(--ink-500)]">
                  <Binary className="h-5 w-5 text-blue-500" />
                  INFERENCE DATA
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- Tools Grid --- */}
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-32">
          
          {/* 1. Architecture Visualizer Section */}
          <section id="architecture" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--line)] pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--ink-900)] flex items-center gap-3">
                  <Brain className="h-10 w-10 text-[var(--accent-primary)]" />
                  Transformer Architecture
                </h2>
                <p className="text-[var(--ink-500)] font-medium max-w-xl text-lg">
                  Scroll and interact with the inner workings of a Transformer block. 
                </p>
              </div>
              <div className="px-4 py-2 bg-[var(--ink-900)] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                Module 01
              </div>
            </div>
            
            <div className="rounded-[40px] border border-[var(--line)] bg-white overflow-hidden shadow-sm">
              <ArchVisualizer />
            </div>
          </section>

          {/* 2. Benchmark Leaderboard Section */}
          <section id="benchmarks" className="space-y-12 scroll-mt-24">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--line)] pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--ink-900)] flex items-center gap-3">
                  <BarChart3 className="h-10 w-10 text-[var(--brand-teal)]" />
                  Model Intelligence Arena
                </h2>
                <p className="text-[var(--ink-500)] font-medium max-w-xl text-lg">
                  Comparison across MMLU, GSM8K, and HumanEval.
                </p>
              </div>
              <div className="px-4 py-2 bg-[var(--ink-900)] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                Module 02
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 rounded-[40px] border border-[var(--line)] bg-white p-8 md:p-12 shadow-sm">
                <BenchmarkLeaderboard />
              </div>
              <div className="rounded-[40px] border border-[var(--line)] bg-[var(--ink-900)] p-8 md:p-12 shadow-2xl text-white space-y-8 flex flex-col justify-center translate-y-6">
                <h3 className="text-2xl font-bold italic tracking-tight">Benchmark Context</h3>
                <div className="space-y-6">
                  <div className="group space-y-2">
                    <h4 className="font-bold text-[var(--brand-teal)] text-sm uppercase tracking-widest flex items-center gap-2">
                      <Zap className="h-4 w-4" /> MMLU
                    </h4>
                    <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">Massive Multitask Language Understanding. Covers 57 subjects across STEM, humanities, and social sciences.</p>
                  </div>
                  <div className="group space-y-2">
                    <h4 className="font-bold text-blue-400 text-sm uppercase tracking-widest flex items-center gap-2">
                      <Binary className="h-4 w-4" /> GSM8K
                    </h4>
                    <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">Grade School Math Word Problems. Tests multi-step mathematical reasoning capabilities.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Vector Space Explorer Section */}
          <section id="vectors" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--line)] pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--ink-900)] flex items-center gap-3">
                  <Map className="h-10 w-10 text-[var(--accent-primary)]" />
                  Semantic Vector Space
                </h2>
                <p className="text-[var(--ink-500)] font-medium max-w-xl text-lg">
                  Explore how models map words and concepts into high-dimensional space.
                </p>
              </div>
              <div className="px-4 py-2 bg-[var(--ink-900)] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                Module 03
              </div>
            </div>
            <VectorExplorer />
          </section>

          {/* 4. Context Window Visualizer Section */}
          <section id="context" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--line)] pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--ink-900)] flex items-center gap-3">
                  <BookOpen className="h-10 w-10 text-[var(--brand-teal)]" />
                  Context Memory Lab
                </h2>
                <p className="text-[var(--ink-500)] font-medium max-w-xl text-lg">
                  Visualize token concentration and memory overhead in long sequences.
                </p>
              </div>
              <div className="px-4 py-2 bg-[var(--ink-900)] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                Module 04
              </div>
            </div>
            <ContextVisualizer />
          </section>

          {/* 5. Simulators Section */}
          <section id="simulators" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--line)] pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--ink-900)] flex items-center gap-3">
                  <Settings2 className="h-10 w-10 text-[var(--accent-primary)]" />
                  Inference Simulator
                </h2>
                <p className="text-[var(--ink-500)] font-medium max-w-xl text-lg">
                  Test how tokenization and sampling parameters affect model outputs.
                </p>
              </div>
              <div className="px-4 py-2 bg-[var(--ink-900)] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                Module 05
              </div>
            </div>
            <ModelSimulator />
          </section>

          {/* 6. Live Inference Lab Section */}
          <section id="live" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--line)] pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--ink-900)] flex items-center gap-3">
                  <Zap className="h-10 w-10 text-amber-500 fill-amber-500" />
                  Live Intelligence Hub
                </h2>
                <p className="text-[var(--ink-500)] font-medium max-w-xl text-lg">
                  Execute live research prompts against the platform's production GPT model.
                </p>
              </div>
              <div className="px-4 py-2 bg-[var(--ink-900)] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                Module 06
              </div>
            </div>
            <LivePlayground />
          </section>

          {/* 7. Ops Workbench Section */}
          <section id="ops" className="space-y-12 scroll-mt-24 pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--line)] pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--ink-900)] flex items-center gap-3">
                  <Cpu className="h-10 w-10 text-[var(--brand-teal)]" />
                  Infrastructure & Ops
                </h2>
                <p className="text-[var(--ink-500)] font-medium max-w-xl text-lg">
                  Estimate financial, performant, and environmental impacts of deployments.
                </p>
              </div>
              <div className="px-4 py-2 bg-[var(--ink-900)] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                Module 07
              </div>
            </div>
            <OpsWorkbench />
          </section>

        </div>
      </main>

      <footer className="w-full py-16 border-t border-[var(--line)] bg-white">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-zinc-400 font-bold text-[11px] uppercase tracking-[0.2em]">
            StandexAI Intelligence Lab / Established 2026
          </div>
          <div className="flex gap-12 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ink-500)]">
             <a href="#" className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2">Docs <ChevronRight className="h-3 w-3" /></a>
             <a href="#" className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2">Papers <ChevronRight className="h-3 w-3" /></a>
             <a href="#" className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2">Github <ChevronRight className="h-3 w-3" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
