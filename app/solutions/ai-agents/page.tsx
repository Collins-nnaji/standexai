import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-digital/Footer";
import { Bot, Sparkles, Zap, Shield, ZapIcon, CpuIcon, Binary, Share2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col z-10 pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-24">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 mb-8">
              <Bot className="h-3.5 w-3.5 text-[#7C5CFC]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C5CFC]">Autonomous Systems</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.85] mb-10">
              AI Agents <br /> & Swarms.
            </h1>
            <p className="text-xl font-medium text-zinc-400 max-w-2xl">
              Moving beyond chat. We build goal-oriented, multi-agent systems that autonomously 
              orchestrate complex business processes with verifiable precision.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {[
            {
              title: "Multi-Agent Swarms",
              desc: "Hierarchical and decentralized agent routing using Swarm and LangGraph.",
              icon: Share2
            },
            {
              title: "Autonomous Reasoning",
              desc: "Agents capable of multi-step planning, tool-use, and error correction.",
              icon: Binary
            },
            {
              title: "Enterprise Tool-Use",
              desc: "Securely connecting agents to your legacy APIs, databases, and ERP systems.",
              icon: ZapIcon
            },
            {
              title: "Safety & Governance",
              desc: "Human-in-the-loop controls and production-grade agentic guardrails.",
              icon: Shield
            },
            {
              title: "Production RAG",
              desc: "Retrieval-Augmented Generation at scale for grounded agentic reasoning.",
              icon: Sparkles
            },
            {
              title: "Real-time Monitoring",
              desc: "Observability for agentic flows with LangSmith and custom evaluators.",
              icon: CpuIcon
            }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 group">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5 text-[#7C5CFC]" />
              </div>
              <h3 className="text-lg font-black text-white uppercase italic mb-3">{f.title}</h3>
              <p className="text-sm font-semibold text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Technical Stack */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C5CFC] mb-4 block">The Build Stack</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-[0.9] mb-8">
                Production-Grade <br /> AI Tooling.
              </h2>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed mb-8">
                We engineer our agentic workflows using the industry's most robust 
                orchestration frameworks and vector architectures.
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { name: "OpenAI Swarm", type: "Orchestration" },
                  { name: "LangGraph", type: "State Control" },
                  { name: "ChromaDB", type: "Vector Store" },
                  { name: "Azure AI", type: "Infrastructure" },
                  { name: "LangSmith", type: "Observability" },
                  { name: "Pytest-Evals", type: "Accuracy" }
                ].map((t, i) => (
                  <div key={i} className="border-l-2 border-white/10 pl-4 py-1">
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-0.5">{t.type}</p>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 bg-white/5 border border-white/10 rounded-[40px] p-10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="h-4 w-4 rounded-full bg-[#7C5CFC] animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Live Orchestration Logic</span>
                </div>
                <div className="space-y-4 font-mono text-[11px] text-zinc-500">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-[#7C5CFC]">agent_a</span> = Agent(name="Researcher", instructions="Analyze industry data...")
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 ml-6">
                    <span className="text-[#049DCB]">agent_b</span> = Agent(name="Validator", instructions="Verify citations...")
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 ml-12">
                    <span className="text-[#34D399]">transfer</span> = swarm.run(agent=agent_a, context=data)
                  </div>
                </div>
              </div>
              {/* Decorative Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#7C5CFC]/20 blur-[80px] group-hover:bg-[#7C5CFC]/30 transition-colors" />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto px-6 w-full text-center">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight mb-6 leading-none">
                Ready to deploy your <br /> agentic workforce?
              </h2>
              <p className="text-zinc-400 mb-10 font-medium">Join the next wave of autonomous enterprise engineering.</p>
              <a href="/Contact" className="inline-flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-[#6B4FE0] transition-all active:scale-95">
                Contact Strategy Team
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
