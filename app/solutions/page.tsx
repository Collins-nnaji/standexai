import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-digital/Footer";
import Link from "next/link";
import { Bot, Zap, Cpu, GraduationCap, ArrowRight, Sparkles, Building2, Code2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col z-10 pt-32 pb-24">
        {/* Hub Hero */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-24">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-[#7C5CFC]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C5CFC]">Enterprise Solutions</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.85] mb-10">
              Future-Proof <br /> Engineering.
            </h1>
            <p className="text-xl font-medium text-zinc-400 max-w-2xl">
              From Multi-Agent Orchestration to Microsoft Power Platform architecture. 
              We build the systems that drive modern enterprise performance.
            </p>
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Pillar 1: Artificial Intelligence */}
          <div className="group relative rounded-[40px] border border-white/5 bg-white/5 p-1 overflow-hidden transition-all duration-700 hover:shadow-[0_48px_100px_-20px_rgba(124,92,252,0.15)] hover:border-white/10">
            <div className="bg-zinc-900 rounded-[39px] p-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-12">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-[#7C5CFC]/10 text-[#7C5CFC]">
                  <Bot className="h-7 w-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Pillar 01</span>
              </div>
              
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tight mb-6">
                Artificial <br /> Intelligence.
              </h2>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed mb-10 flex-1">
                Autonomous agentic workflows, multi-agent swarms, and enterprise LLM integration 
                designed for verifiable accuracy and production performance.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <Link href="/solutions/ai-agents" className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-[#7C5CFC] hover:bg-white/10 transition-all group/item">
                  <span className="text-sm font-black uppercase tracking-widest text-white group-hover/item:text-[#7C5CFC]">AI Agents & Swarms</span>
                  <ArrowRight className="h-4 w-4 text-zinc-500 group-hover/item:translate-x-1 group-hover/item:text-[#7C5CFC] transition-all" />
                </Link>
                <Link href="/solutions/ai-integration" className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-[#7C5CFC] hover:bg-white/10 transition-all group/item">
                  <span className="text-sm font-black uppercase tracking-widest text-white group-hover/item:text-[#7C5CFC]">Enterprise Integration</span>
                  <ArrowRight className="h-4 w-4 text-zinc-500 group-hover/item:translate-x-1 group-hover/item:text-[#7C5CFC] transition-all" />
                </Link>
              </div>
            </div>
          </div>

          {/* Pillar 2: Power Platform */}
          <div className="group relative rounded-[40px] border border-white/5 bg-white/5 p-1 overflow-hidden transition-all duration-700 hover:shadow-[0_48px_100px_-20px_rgba(4,157,203,0.15)] hover:border-white/10">
            <div className="bg-zinc-900 rounded-[39px] p-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-12">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-[#049DCB]/10 text-[#049DCB]">
                  <Cpu className="h-7 w-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Pillar 02</span>
              </div>
              
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tight mb-6">
                Power <br /> Platform.
              </h2>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed mb-10 flex-1">
                High-fidelity Microsoft Power Platform engineering. From governance strategy to 
                custom Power Apps and high-throughput process automation.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/solutions/power-apps" className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-[#049DCB] hover:bg-white/10 transition-all group/item">
                  <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-[#049DCB]">Power Apps</span>
                </Link>
                <Link href="/solutions/power-automate" className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-[#049DCB] hover:bg-white/10 transition-all group/item">
                  <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-[#049DCB]">Automate</span>
                </Link>
                <Link href="/solutions/power-bi" className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-[#049DCB] hover:bg-white/10 transition-all group/item">
                  <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-[#049DCB]">Power BI</span>
                </Link>
                <Link href="/solutions/copilot-studio" className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-[#049DCB] hover:bg-white/10 transition-all group/item">
                  <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-[#049DCB]">Copilot</span>
                </Link>
              </div>
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
