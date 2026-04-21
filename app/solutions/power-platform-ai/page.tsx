import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
import { Cpu, Zap, Database, Layout, Workflow, Sparkles, Code2, LineChart, ChevronRight } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white selection:bg-[#049DCB]/30">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col z-10 pt-32 pb-24">
        {/* Microsoft Blue Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_0%_0%,rgba(4,157,203,0.1),transparent_70%)] pointer-events-none" />
        
        {/* hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#049DCB]/20 bg-[#049DCB]/10 px-4 py-1.5 mb-8">
              <Cpu className="h-3.5 w-3.5 text-[#049DCB]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#049DCB]">Microsoft Cloud AI</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-12">
              Power Platform <br /><span className="text-[#049DCB]">+</span> Azure AI.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-zinc-400 max-w-2xl leading-relaxed">
              Supercharge your existing Microsoft ecosystem. We inject enterprise-grade 
              Azure OpenAI intelligence directly into your Power Apps and Automate flows.
            </p>
          </div>
        </section>

        {/* Integration Pillars */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              title: "Intelligent Apps",
              desc: "Building custom Power Apps with embedded GPT-4 reasoning and real-time data processing.",
              icon: Layout,
              color: "text-[#D25BB1]",
              stat: "+42% Productivity"
            },
            {
              title: "Smart Automation",
              desc: "Power Automate flows that execute complex routing and analysis powered by LLM logic.",
              icon: Workflow,
              color: "text-[#2F8DD8]",
              stat: "90% Error Reduction"
            },
            {
              title: "AI Dataverse",
              desc: "Enabling semantic and vector search within your Dataverse structures for instant insight.",
              icon: Database,
              color: "text-[#9B7AC7]",
              stat: "Instant Discovery"
            }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[40px] border border-white/5 bg-white/5 hover:border-[#049DCB]/30 transition-all group relative overflow-hidden">
              <div className={`h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase italic mb-4">{item.title}</h3>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed mb-8">{item.desc}</p>
              <div className="pt-6 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-[#049DCB]">
                Impact: {item.stat}
              </div>
            </div>
          ))}
        </section>

        {/* Deployment Protocol (The Robust Polish) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { l: "Protocol 01", t: "Custom Connector Securing", d: "OAuth 2.0 / API Key rotation for Azure endpoints." },
                { l: "Protocol 02", t: "Schema Serialization", d: "Mapping Dataverse columns to LLM prompt-tokens." },
                { l: "Protocol 03", t: "Latency Buffering", d: "Redis-backed caching for frequent PowerBI queries." },
                { l: "Protocol 04", t: "Governance Guardrails", d: "DLP policy alignment for AI-generated outputs." }
              ].map((p, i) => (
                <div key={i} className="p-6 rounded-3xl bg-zinc-900 border border-white/10 hover:border-[#049DCB]/30 transition-all">
                   <div className="h-2 w-8 bg-[#049DCB] rounded-full mb-6" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-2 block">{p.l}</span>
                   <h4 className="text-md font-bold text-white uppercase italic mb-2 leading-tight">{p.t}</h4>
                   <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">{p.d}</p>
                </div>
              ))}
           </div>
        </section>

        {/* The Hybrid Layer Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
           <div className="rounded-[48px] border border-white/10 bg-zinc-900/50 p-12 md:p-20 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#049DCB] mb-4 block">Architecture</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-10">
                       Bridging Code <br /> & Low-Code.
                    </h2>
                    <p className="text-lg font-semibold text-zinc-400 leading-relaxed mb-8">
                       Most Power Platform teams stick to basics. We leverage **Azure OpenAI Service API** 
                       and **Custom Connectors** to bring custom fine-tuned models into the low-code environment.
                    </p>
                    <ul className="space-y-4">
                       {[
                         "Azure OpenAI API Integration",
                         "Custom Connectors & Power Plugins",
                         "Vector Retrieval inside Dataverse",
                         "Copilot Studio Extension"
                       ].map((l, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white italic">
                            <Sparkles className="h-4 w-4 text-[#049DCB]" /> {l}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="relative">
                    <div className="rounded-[32px] bg-zinc-950 p-8 border border-white/10 shadow-2xl relative z-10">
                       <div className="flex items-center gap-2 mb-8">
                          <Code2 className="h-5 w-5 text-[#049DCB]" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">Power Automate AI Node</span>
                       </div>
                       <div className="space-y-6">
                          <div className="flex items-center justify-between text-[11px] font-mono border-b border-white/5 pb-2">
                             <span className="text-zinc-500">Method:</span>
                             <span className="text-[#049DCB]">POST // request_stream</span>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 font-mono text-[10px] text-zinc-400">
                             <p className="text-[#049DCB]"># Payload Schema</p>
                             <p>{"{"}</p>
                             <p className="ml-4">"model": "azure-gpt-4o",</p>
                             <p className="ml-4">"context": "enterprise_data_v2",</p>
                             <p className="ml-4">"stream": true</p>
                             <p>{"}"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-emerald-500" />
                             <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Active Connector</span>
                          </div>
                       </div>
                    </div>
                    {/* Floating Info Cards */}
                    <div className="absolute -right-8 -bottom-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 shadow-2xl z-20 hidden md:block">
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 italic">Latency:</p>
                       <p className="text-lg font-bold text-white italic tracking-tighter">0.12ms</p>
                    </div>
                    {/* Shadow Accent */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#049DCB]/20 blur-[80px]" />
                 </div>
              </div>
           </div>
        </section>

        {/* CTA Case Study Focus */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
           <div className="bg-white/5 border border-white/10 rounded-[64px] p-16 md:p-24 text-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-10 leading-none">
                 Optimize Your <br /> Internal Engine.
              </h2>
              <p className="text-lg md:text-xl font-medium text-zinc-400 mb-14 max-w-2xl mx-auto leading-relaxed">
                 Don&apos;t just build apps—build intelligent systems that drive productivity. 
                 Talk to our Microsoft-Certified AI experts today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <a href="/Contact" className="group inline-flex items-center gap-3 rounded-2xl bg-[#049DCB] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#0388B0] transition-all active:scale-95 shadow-[0_20px_40px_-5px_rgba(4,157,203,0.4)]">
                    Start Transformation <Zap className="h-4 w-4" />
                 </a>
                 <a href="/solutions/power-bi" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                    Explore Analytics <ChevronRight className="h-4 w-4" />
                 </a>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
