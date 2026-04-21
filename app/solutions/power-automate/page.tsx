import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
import { Zap, Activity, Cpu, Shield, ArrowRight, Sparkles, Layers, Box, Terminal, GitBranch, Share2, Workflow } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white selection:bg-[#0078D4]/30">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col z-10 pt-32 pb-24">
        {/* Microsoft Automate Blue Gradient Background */}
        <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(circle_at_100%_0%,rgba(0,120,212,0.1),transparent_70%)] pointer-events-none" />
        
        {/* hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0078D4]/20 bg-[#0078D4]/10 px-4 py-1.5 mb-8">
              <Workflow className="h-3.5 w-3.5 text-[#0078D4]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0078D4]">Autonomous Orchestration</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-12">
              Power Automate <br />Architecture <span className="text-zinc-600">&</span> Logic.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-zinc-400 max-w-2xl leading-relaxed">
              Eliminating manual friction with high-throughput workflow orchestration. 
              We engineer complex process logic that bridges legacy APIs and modern cloud ecosystems.
            </p>
          </div>
        </section>

        {/* Throughput & Reliability Analysis */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-8">
                Execution <br /> Integrity.
              </h2>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed mb-8">
                Automate with confidence. We measure and optimize every node in your workflow for maximum reliability and minimum latency.
              </p>
              
              <div className="space-y-6">
                {[
                  { name: "Cloud Flows", val: 99.9, color: "text-[#0078D4]", desc: "API-first orchestration with guaranteed uptime." },
                  { name: "Desktop RPA", val: 94.0, color: "text-emerald-500", desc: "Automating legacy UI interactions with vision-AI." },
                  { name: "Error Handling", val: 100, color: "text-[#7C5CFC]", desc: "Zero-loss data persistence via robust retry policies." }
                ].map((s, i) => (
                  <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{s.name}</span>
                       <span className={`text-xl font-bold ${s.color}`}>{s.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-current transition-all duration-1000" style={{ width: `${s.val}%`, color: s.color.replace('text-', '') }} />
                    </div>
                    <p className="mt-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
               <div className="rounded-[40px] border border-white/10 bg-zinc-900 overflow-hidden relative group">
                  <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-[#0078D4]" />
                        <span className="text-sm font-bold uppercase tracking-widest italic">Flow Diagnostic Terminal</span>
                     </div>
                     <span className="px-3 py-1 rounded-full bg-[#0078D4]/20 text-[#0078D4] text-[10px] font-bold uppercase tracking-widest">v2.1 Monitor</span>
                  </div>
                  <div className="p-8 space-y-4 font-mono text-[12px]">
                     <div className="flex items-center gap-4 text-emerald-500/80 bg-emerald-500/5 p-3 rounded-lg">
                        <span className="shrink-0">TRIGGER:</span>
                        <span className="truncate">SUCCESS - Webhook received from CRM_302 (14ms).</span>
                     </div>
                     <div className="flex items-center gap-4 text-emerald-500/80 bg-emerald-500/5 p-3 rounded-lg">
                        <span className="shrink-0">CONDITION:</span>
                        <span className="truncate">TRUE - Executing 'High_Priority_Path' routing.</span>
                     </div>
                     <div className="flex items-center gap-4 text-zinc-500 bg-white/5 p-3 rounded-lg">
                        <span className="shrink-0">ACTION:</span>
                        <span className="truncate">UPDATING - Patching Entra ID user status...</span>
                     </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60 pointer-events-none" />
               </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { title: "RPA Swarms", desc: "Coordinating multiple UI robots for massive data entry tasks.", icon: Box, spec: "Unattended RPA" },
            { title: "Custom Connectors", desc: "Bespoke API bridges for proprietary on-premise systems.", icon: Share2, spec: "OAuth 2.0" },
            { title: "Logic Branches", desc: "Complex conditional routing with fallback state management.", icon: GitBranch, spec: "p99 Execution" },
            { title: "Governance", desc: "Strict DLP policy enforcement for cross-platform data flow.", icon: Shield, spec: "Tenant Scoped" }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-[#0078D4]/30 transition-all group relative overflow-hidden">
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-[#0078D4]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-[#0078D4]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase italic tracking-widest mb-3">{f.title}</h3>
                <p className="text-[13px] font-semibold text-zinc-400 leading-relaxed mb-6">{f.desc}</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Metric:</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-[#0078D4]">{f.spec}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Workflow Payload Visualization */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
           <div className="rounded-[48px] border border-white/10 bg-zinc-900/50 p-12 md:p-20 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0078D4] mb-4 block">Process Engineering</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-10">
                       Logic Execution <br /> Schema.
                    </h2>
                    <p className="text-lg font-semibold text-zinc-400 leading-relaxed mb-8">
                       Every automation we build is treated as production code. We implement 
                       error-handling try/catch blocks and telemetry logging at every node.
                    </p>
                    <ul className="space-y-4">
                       {[
                         "Sequential & Parallel Branches",
                         "Adaptive Error Fallbacks",
                         "JSON Payload Transformation",
                         "Entra ID Security Integration"
                       ].map((l, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white italic">
                            <Sparkles className="h-4 w-4 text-[#0078D4]" /> {l}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="relative">
                    <div className="rounded-[32px] bg-zinc-950 p-8 border border-white/10 shadow-2xl relative z-10">
                       <div className="flex items-center gap-2 mb-8">
                          <Terminal className="h-5 w-5 text-[#0078D4]" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">Flow Definition JSON</span>
                       </div>
                       <div className="space-y-6">
                          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 font-mono text-[10px] text-zinc-400 overflow-x-auto">
                             <p className="text-[#0078D4]">"actions": {"{"}</p>
                             <p className="ml-4">"Condition_Check": {"{"}</p>
                             <p className="ml-8">"type": "If",</p>
                             <p className="ml-8">"expression": "@greater(trigger().outputs.total, 1000)"</p>
                             <p className="ml-8">"actions": {"{ ... }"}</p>
                             <p className="ml-4">{"}"}</p>
                             <p className="text-[#0078D4]">{"}"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-[#0078D4] animate-pulse" />
                             <span className="text-[9px] font-bold uppercase tracking-widest text-[#0078D4]">Optimized Execution Path Found</span>
                          </div>
                       </div>
                    </div>
                    {/* Shadow Accent */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0078D4]/20 blur-[80px]" />
                 </div>
              </div>
           </div>
        </section>

        {/* CTA Workflow Study */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
           <div className="bg-white/5 border border-white/10 rounded-[64px] p-16 md:p-24 text-center overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0078D4]/5 blur-[100px] -z-10" />
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-10 leading-none">
                 Orchestrate Your <br /> Invisible Workforce.
              </h2>
              <p className="text-lg md:text-xl font-medium text-zinc-400 mb-14 max-w-2xl mx-auto leading-relaxed">
                 Turn manual data moves into silent, high-performance background operations. 
                 Automate correctly, scale infinitely.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <a href="/Contact" className="group inline-flex items-center gap-3 rounded-2xl bg-[#0078D4] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#005a9e] transition-all active:scale-95 shadow-[0_20px_40px_-5px_rgba(0,120,212,0.4)]">
                    Start Automating <Zap className="h-4 w-4" />
                 </a>
                 <a href="/Contact" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                    View Process Library <ArrowRight className="h-4 w-4" />
                 </a>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
