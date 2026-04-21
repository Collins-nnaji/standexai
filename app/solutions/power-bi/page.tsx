import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
import { BarChart3, PieChart, TrendingUp, Cpu, Shield, ArrowRight, Sparkles, Database, Terminal, Search, Zap, LineChart } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white selection:bg-[#F2C811]/30">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col z-10 pt-32 pb-24">
        {/* Microsoft Power BI Yellow Gradient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(242,200,17,0.08),transparent_70%)] pointer-events-none" />
        
        {/* hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F2C811]/20 bg-[#F2C811]/10 px-4 py-1.5 mb-8">
              <BarChart3 className="h-3.5 w-3.5 text-[#F2C811]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F2C811]">Advanced Data Intelligence</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-12">
              Power BI <br />Engineering <span className="text-zinc-600">&</span> Analytics.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-zinc-400 max-w-2xl leading-relaxed">
              Transforming raw telemetry into executive-grade insight. We engineer high-performance 
              DAX schemas and real-time visualization layers for data-driven organizations.
            </p>
          </div>
        </section>

        {/* Data Serialization & Semantic Layer */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-8">
                The Semantic <br /> Advantage.
              </h2>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed mb-8">
                We build more than dashboards. We engineer scalable semantic models that act as the single source of truth for your entire enterprise.
              </p>
              
              <div className="space-y-6">
                {[
                  { name: "DAX Optimization", val: 96, color: "text-[#F2C811]", desc: "Complex measure logic tuned for sub-second query speeds." },
                  { name: "Dataverse Integration", val: 100, color: "text-emerald-500", desc: "Native, high-throughput mapping for Microsoft ecosystems." },
                  { name: "Real-time Refresh", val: 88, color: "text-[#7C5CFC]", desc: "DirectQuery orchestration for live telemetry streams." }
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
                        <TrendingUp className="h-5 w-5 text-[#F2C811]" />
                        <span className="text-sm font-bold uppercase tracking-widest italic">Analytics Diagnostic Terminal</span>
                     </div>
                     <span className="px-3 py-1 rounded-full bg-[#F2C811]/20 text-[#F2C811] text-[10px] font-bold uppercase tracking-widest">Active Sink</span>
                  </div>
                  <div className="p-8 space-y-4 font-mono text-[12px]">
                     <div className="flex items-center gap-4 text-emerald-500/80 bg-emerald-500/5 p-3 rounded-lg">
                        <span className="shrink-0">QUERY_PLAN:</span>
                        <span className="truncate">SUCCESS - Pushing filter to Dataverse backend (DirectQuery).</span>
                     </div>
                     <div className="flex items-center gap-4 text-emerald-500/80 bg-emerald-500/5 p-3 rounded-lg">
                        <span className="shrink-0">MEASURE:</span>
                        <span className="truncate">CALCULATED - 'p99_Return_ROI' resolved in 42ms.</span>
                     </div>
                     <div className="flex items-center gap-4 text-zinc-500 bg-white/5 p-3 rounded-lg">
                        <span className="shrink-0">MODEL:</span>
                        <span className="truncate">RE-INDEXING - Optimizing relationship cardinality...</span>
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
            { title: "Paginated Reports", desc: "Pixel-perfect, high-density reporting for regulatory compliance.", icon: Database, spec: "Audit Ready" },
            { title: "AI Visuals", desc: "Injecting custom Python and R scripts for advanced predictive forecasting.", icon: Cpu, spec: "ML-Integrated" },
            { title: "Governance", desc: "Row-level security (RLS) enforcement at the individual user level.", icon: Shield, spec: "Zero Trust" },
            { title: "Interactive Hub", desc: "Cross-platform accessibility from mobile to boardroom screens.", icon: PieChart, spec: "Fully Responsive" }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-[#F2C811]/30 transition-all group relative overflow-hidden">
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-[#F2C811]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-[#F2C811]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase italic tracking-widest mb-3">{f.title}</h3>
                <p className="text-[13px] font-semibold text-zinc-400 leading-relaxed mb-6">{f.desc}</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Metric:</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-[#F2C811]">{f.spec}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Technical Architecture Visualization */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
           <div className="rounded-[48px] border border-white/10 bg-zinc-900/50 p-12 md:p-20 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#F2C811] mb-4 block">Data Engineering</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-10">
                       Schema Serialization.
                    </h2>
                    <p className="text-lg font-semibold text-zinc-400 leading-relaxed mb-8">
                       Our analytics desk specializes in high-fidelity data modeling. We bridge the gap 
                       between raw transactional tables and actionable decision layers.
                    </p>
                    <ul className="space-y-4">
                       {[
                         "Star-Schema Optimization",
                         "Advanced DAX Measure Logic",
                         "Automated Data Cleansing Pipelines",
                         "Real-time Telemetry Processing"
                       ].map((l, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white italic">
                            <Sparkles className="h-4 w-4 text-[#F2C811]" /> {l}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="relative">
                    <div className="rounded-[32px] bg-zinc-950 p-8 border border-white/10 shadow-2xl relative z-10">
                       <div className="flex items-center gap-2 mb-8">
                          <Terminal className="h-5 w-5 text-[#F2C811]" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">DAX Engine Audit</span>
                       </div>
                       <div className="space-y-6">
                          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 font-mono text-[10px] text-zinc-400">
                             <p className="text-[#F2C811]">Total_ROI =</p>
                             <p className="ml-4">CALCULATE(</p>
                             <p className="ml-8">SUM('Telemetry'[Value_Gain]),</p>
                             <p className="ml-8">KEEPFILTERS('Telemetry'[Type] = "AI_Agent")</p>
                             <p className="ml-4">)</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-emerald-500" />
                             <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Query Plan: 1.2ms</span>
                          </div>
                       </div>
                    </div>
                    {/* Shadow Accent */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F2C811]/20 blur-[80px]" />
                 </div>
              </div>
           </div>
        </section>

        {/* CTA BI Focus */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
           <div className="bg-white/5 border border-white/10 rounded-[64px] p-16 md:p-24 text-center overflow-hidden relative">
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#F2C811]/5 blur-[100px] -z-10" />
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-10 leading-none">
                 Visualize The Future <br /> Of Your Data.
              </h2>
              <p className="text-lg md:text-xl font-medium text-zinc-400 mb-14 max-w-2xl mx-auto leading-relaxed">
                 Eliminate reporting lag. Deploy ultra-fast, diagnostic Power BI platforms 
                 designed for the high-density enterprise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <a href="/Contact" className="group inline-flex items-center gap-3 rounded-2xl bg-[#F2C811] px-10 py-5 text-sm font-bold uppercase tracking-widest text-zinc-900 hover:bg-[#D4AF0E] transition-all active:scale-95 shadow-[0_20px_40px_-5px_rgba(242,200,17,0.4)]">
                    Engage Analysts <Zap className="h-4 w-4" />
                 </a>
                 <a href="/Contact" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                    Review Dashboard Specs <ArrowRight className="h-4 w-4" />
                 </a>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
