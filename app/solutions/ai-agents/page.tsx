import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
import { Bot, Sparkles, Zap, Shield, ZapIcon, CpuIcon, Binary, Share2, Workflow, Terminal, Boxes } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white selection:bg-[#7C5CFC]/30">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col z-10 pt-32 pb-24">
        {/* Abstract Animation Background */}
        <div className="absolute top-0 right-0 w-full h-[1000px] bg-[radial-gradient(circle_at_100%_0%,rgba(124,92,252,0.08),transparent_70%)] pointer-events-none" />
        
        {/* hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 mb-8">
              <Boxes className="h-3.5 w-3.5 text-[#7C5CFC]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C5CFC]">Agentic Infrastructure</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-12">
              Autonomous <br /> AI Swarms.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-zinc-400 max-w-3xl leading-relaxed">
              Moving beyond chat. We build goal-oriented, multi-agent systems that autonomously 
              orchestrate complex business processes with verifiable precision.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {[
            {
              title: "Hierarchical Swarms",
              desc: "Deploy decentralized agent networks that self-organize to solve complex, multi-step objectives.",
              icon: Share2
            },
            {
              title: "Autonomous Reasoning",
              desc: "Agents capable of multi-step planning, iterative tool-use, and real-time error correction.",
              icon: Binary
            },
            {
              title: "API-Orchestrated Logic",
              desc: "Securely connecting agents to your legacy ERPs, databases, and enterprise cloud infrastructure.",
              icon: ZapIcon
            },
            {
              title: "Hardened Governance",
              desc: "Human-in-the-loop validation and production-grade agentic guardrails for high-stakes actions.",
              icon: Shield
            },
            {
              title: "Adaptive RAG Layers",
              desc: "Retrieval-Augmented Generation that grounds agentic reasoning in your specific enterprise data.",
              icon: Sparkles
            },
            {
              title: "Agent Observability",
              desc: "Full transparency into agentic thought-trails with LangSmith and custom diagnostic evaluators.",
              icon: CpuIcon
            }
          ].map((f, i) => (
            <div key={i} className="p-10 rounded-[40px] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFC]/5 blur-[40px] group-hover:bg-[#7C5CFC]/10 transition-all" />
               <div className="relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <f.icon className="h-6 w-6 text-[#7C5CFC]" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase italic mb-4">{f.title}</h3>
                  <p className="text-base font-semibold text-zinc-400 leading-relaxed">{f.desc}</p>
               </div>
            </div>
          ))}
        </section>

        {/* Technical Architecture (The Logic Deck) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7C5CFC] mb-4 block italic">Technical Architecture</span>
                 <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-10">
                    Engineered <br /> for Production.
                 </h2>
                 <p className="text-lg font-semibold text-zinc-400 leading-relaxed mb-12">
                    Generic agents fail in production. We use hardened state-control frameworks 
                    and vector-native architectures to ensure 99.9% task reliability.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-4 mb-12">
                    {[
                      { l: "Throughput", v: "4.2k t/sec", d: "Parallel agent invocation" },
                      { l: "Accuracy", v: "98.4%", d: "Consensus-verified reasoning" },
                      { l: "Latency", v: "120ms", d: "End-to-end swarm routing" },
                      { l: "Security", v: "ALIGNED", d: "Zero-Knowledge orchestration" }
                    ].map((m, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">{m.l}</span>
                         <span className="text-xl font-bold text-white italic tracking-tighter block mb-1">{m.v}</span>
                         <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-tight">{m.d}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-zinc-900 border border-white/10 rounded-[48px] p-1 relative overflow-hidden group">
                 <div className="rounded-[44px] bg-zinc-950 p-8 md:p-12 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-10">
                       <Terminal className="h-5 w-5 text-emerald-500" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-0.5">Orchestration Graph v4.0</span>
                    </div>
                    <div className="space-y-6 font-mono text-[10px] md:text-[12px] text-zinc-400">
                       <div className="flex items-start gap-4 animate-pulse">
                          <span className="text-zinc-600">01</span>
                          <p><span className="text-[#7C5CFC]">SYSTEM:</span> Spawning [Research_Swarms] on cluster_0x4...</p>
                       </div>
                       <div className="flex items-start gap-4 ml-4">
                          <span className="text-zinc-600">02</span>
                          <p><span className="text-emerald-500">AGENT_A:</span> Scanning source 'SEC_EDGAR' for compliance drift...</p>
                       </div>
                       <div className="flex items-start gap-4 ml-8">
                          <span className="text-zinc-600">03</span>
                          <p><span className="text-amber-500">HANDOFF:</span> Transferring context to [Validator_Agent]...</p>
                       </div>
                       <div className="flex items-start gap-4 ml-12 border-l border-white/10 pl-4 py-2">
                          <span className="text-zinc-600">04</span>
                          <p><span className="text-[#34D399]">SUCCESS:</span> Consensus reached (98.4%) - Proceeding to next node.</p>
                       </div>
                    </div>
                    {/* Visual Flow Indicator */}
                    <div className="mt-12 flex items-center gap-2">
                       {[1,2,3,4,5].map(i => (
                         <div key={i} className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7C5CFC] animate-[shimmer_2s_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
                         </div>
                       ))}
                    </div>
                 </div>
                 {/* Glow Background */}
                 <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#7C5CFC]/10 blur-[100px] pointer-events-none" />
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full text-center">
           <div className="bg-white/5 border border-white/10 rounded-[64px] p-16 md:p-24 relative overflow-hidden group">
              <div className="relative z-10">
                 <h2 className="text-4xl md:text-7xl font-bold uppercase italic tracking-tighter text-white mb-10 leading-none">
                    Build Your <br /> Agentic Workforce.
                 </h2>
                 <p className="text-lg md:text-xl font-medium text-zinc-400 mb-14 max-w-2xl mx-auto leading-relaxed">
                    Transition from managing software to directing intelligence. 
                    Consult with our engineering team to map your autonomous future.
                 </p>
                 <a href="/Contact" className="inline-flex items-center gap-3 rounded-2xl bg-[#7C5CFC] px-12 py-6 text-sm font-bold uppercase tracking-widest text-white shadow-[0_20px_50px_-10px_rgba(124,92,252,0.5)] hover:shadow-[0_30px_60px_-10px_rgba(124,92,252,0.6)] transition-all active:scale-95">
                    Contact Engineering <Zap className="h-4 w-4" />
                 </a>
              </div>
              {/* Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(124,92,252,0.1),transparent_70%)] pointer-events-none" />
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
