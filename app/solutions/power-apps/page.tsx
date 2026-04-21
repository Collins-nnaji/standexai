import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
import { Layout, Smartphone, Database, Zap, Cpu, Shield, ArrowRight, Sparkles, Layers, Search, Code2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white selection:bg-[#D25BB1]/30">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col z-10 pt-32 pb-24">
        {/* Microsoft Power Apps Pink Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_0%_0%,rgba(210,91,177,0.1),transparent_70%)] pointer-events-none" />
        
        {/* hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D25BB1]/20 bg-[#D25BB1]/10 px-4 py-1.5 mb-8">
              <Layout className="h-3.5 w-3.5 text-[#D25BB1]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D25BB1]">Rapid Application Engineering</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-12">
              Power Apps <br />Development <span className="text-zinc-600">&</span> Architecture.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-zinc-400 max-w-2xl leading-relaxed">
              Accelerating enterprise delivery with production-grade Power Apps. We bridge the gap 
              between low-code speed and pro-code complexity using custom PCF components and Azure integrations.
            </p>
          </div>
        </section>

        {/* Diagnostic Capability Matrix */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-8">
                The Architecture <br /> Choice.
              </h2>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed mb-8">
                We select the right implementation layer based on your specific performance and data complexity requirements.
              </p>
              
              <div className="space-y-6">
                {[
                  { name: "Canvas Apps", val: 98, color: "text-[#D25BB1]", desc: "Pixel-perfect mobile & tablet experiences." },
                  { name: "Model-Driven", val: 92, color: "text-[#2F8DD8]", desc: "Complex relational data & business processes." },
                  { name: "Custom PCF", val: 75, color: "text-emerald-500", desc: "Pro-code extensions for unique UI requirements." }
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
                        <Smartphone className="h-5 w-5 text-[#D25BB1]" />
                        <span className="text-sm font-bold uppercase tracking-widest italic">App Diagnostic Console</span>
                     </div>
                     <span className="px-3 py-1 rounded-full bg-[#D25BB1]/20 text-[#D25BB1] text-[10px] font-bold uppercase tracking-widest">Live Metadata</span>
                  </div>
                  <div className="p-8 space-y-4 font-mono text-[12px]">
                     <div className="flex items-center gap-4 text-emerald-500/80 bg-emerald-500/5 p-3 rounded-lg">
                        <span className="shrink-0">OPTIMIZER:</span>
                        <span className="truncate">SUCCESS - Delegate queries optimized for Dataverse (120ms).</span>
                     </div>
                     <div className="flex items-center gap-4 text-emerald-500/80 bg-emerald-500/5 p-3 rounded-lg">
                        <span className="shrink-0">OFFLINE:</span>
                        <span className="truncate">Active - Syncing delta buffers to local indexedDB.</span>
                     </div>
                     <div className="flex items-center gap-4 text-amber-500/80 bg-amber-500/5 p-3 rounded-lg">
                        <span className="shrink-0">UI/UX:</span>
                        <span className="truncate">Warning - Contrast ratio low on 'Header_Submit' element.</span>
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
            { title: "Custom PCF", desc: "Building React components to extend standard app capabilities.", icon: Code2, spec: "TypeScript/React" },
            { title: "Offline Sync", desc: "Robust data caching for field workers in low-connectivity areas.", icon: Database, spec: "SQLite Enabled" },
            { title: "ALM Pipeline", desc: "Automated deployment across Dev, Test, and Prod environments.", icon: Layers, spec: "Azure DevOps" },
            { title: "Governance", desc: "Environment sanitization & Data Loss Prevention (DLP) protocol.", icon: Shield, spec: "ISO Certified" }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-[#D25BB1]/30 transition-all group relative overflow-hidden">
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-[#D25BB1]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-[#D25BB1]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase italic tracking-widest mb-3">{f.title}</h3>
                <p className="text-[13px] font-semibold text-zinc-400 leading-relaxed mb-6">{f.desc}</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Metric:</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-[#D25BB1]">{f.spec}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* KPI Grid (The Robust Polish) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { r: "T-Load", s: "820ms", d: "Average initial app hydration for complex Canvas schemas." },
                { r: "Adoption", s: "92%", d: "User engagement rate during first 90 days post-deployment." },
                { r: "ROI Δ", s: "340%", d: "Cost reduction vs. traditional custom software development." }
              ].map((p, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col justify-between hover:bg-zinc-800 transition-colors">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-white italic tracking-tight">{p.r}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
                         {p.s}
                      </span>
                   </div>
                   <p className="text-[11px] font-semibold text-zinc-500 leading-relaxed uppercase tracking-tight">{p.d}</p>
                </div>
              ))}
           </div>
        </section>

        {/* PCF Payload Visualization */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
           <div className="rounded-[48px] border border-white/10 bg-zinc-900/50 p-12 md:p-20 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D25BB1] mb-4 block">Pro-Code Extensibility</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-10">
                       Custom PCF <br /> Components.
                    </h2>
                    <p className="text-lg font-semibold text-zinc-400 leading-relaxed mb-8">
                       When standard controls reach their limit, we deploy custom **Power Apps Control Framework (PCF)** 
                       elements to deliver bespoke data visualizations and advanced user interactions.
                    </p>
                    <ul className="space-y-4">
                       {[
                         "React-based UI controls",
                         "Advanced Charting & GIS mapping",
                         "Native API interaction (Camera/NFC)",
                         "Custom Drag-and-Drop interfaces"
                       ].map((l, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white italic">
                            <Sparkles className="h-4 w-4 text-[#D25BB1]" /> {l}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="relative">
                    <div className="rounded-[32px] bg-zinc-950 p-8 border border-white/10 shadow-2xl relative z-10">
                       <div className="flex items-center gap-2 mb-8">
                          <Code2 className="h-5 w-5 text-[#D25BB1]" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">Component Indexing</span>
                       </div>
                       <div className="space-y-6">
                          <div className="flex items-center justify-between text-[11px] font-mono border-b border-white/5 pb-2">
                             <span className="text-zinc-500">manifest.xml</span>
                             <span className="text-[#D25BB1]">/ControlImplementation</span>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 font-mono text-[10px] text-zinc-400">
                             <p className="text-[#D25BB1]"># Property Schema</p>
                             <p>&lt;property name="data_source" /&gt;</p>
                             <p>&lt;property name="theme" value="standex_dark" /&gt;</p>
                             <p>&lt;resources&gt;</p>
                             <p className="ml-4">&lt;code path="standex_core.js" order="1" /&gt;</p>
                             <p>&lt;/resources&gt;</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-emerald-500" />
                             <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Compiled v2.4.0</span>
                          </div>
                       </div>
                    </div>
                    {/* Shadow Accent */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D25BB1]/20 blur-[80px]" />
                 </div>
              </div>
           </div>
        </section>

        {/* CTA Case Study Focus */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
           <div className="bg-white/5 border border-white/10 rounded-[64px] p-16 md:p-24 text-center overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D25BB1]/5 blur-[100px] -z-10" />
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-10 leading-none">
                 Deliver Apps <br /> At The Speed Of Thought.
              </h2>
              <p className="text-lg md:text-xl font-medium text-zinc-400 mb-14 max-w-2xl mx-auto leading-relaxed">
                 Stop suffering from fragmented data silos. Deploy intelligent, responsive Power Apps 
                 engineered for business growth.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <a href="/Contact" className="group inline-flex items-center gap-3 rounded-2xl bg-[#D25BB1] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#B04B95] transition-all active:scale-95 shadow-[0_20px_40px_-5px_rgba(210,91,177,0.4)]">
                    Engage Developers <Zap className="h-4 w-4" />
                 </a>
                 <a href="/Contact" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                    View Portfolio <ArrowRight className="h-4 w-4" />
                 </a>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
