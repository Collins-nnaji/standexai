import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
import { ShieldCheck, Database, BarChart3, Search, AlertCircle, FileText, Zap, ChevronRight } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white selection:bg-[#7C5CFC]/30">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col z-10 pt-32 pb-24">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,252,0.1),transparent_70%)] pointer-events-none" />
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 mb-8">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">Governance & Compliance</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-12">
              Data Readiness <br /><span className="text-zinc-600">&</span> Audit.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-zinc-400 max-w-2xl leading-relaxed">
              Don&apos;t build on toxic data. We provide the industry&apos;s most rigorous 
              AI-readiness diagnostics for regulated healthcare and finance sectors.
            </p>
          </div>
        </section>

        {/* The Diagnostic Engine (Multi-Score) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-8">
                The Triple <br /> Score System.
              </h2>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed mb-8">
                Our proprietary engine evaluates your data across three critical axes 
                before a single line of model code is written.
              </p>
              
              <div className="space-y-6">
                {[
                  { name: "Readiness Score", val: 84, color: "text-[#7C5CFC]", desc: "Schema integrity & missingness thresholds." },
                  { name: "Quality Score", val: 92, color: "text-emerald-500", desc: "Outlier detection & distribution drift." },
                  { name: "Governance Score", val: 78, color: "text-amber-500", desc: "Regulatory adherence (HIPAA/SEC)." }
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
                        <Database className="h-5 w-5 text-[#7C5CFC]" />
                        <span className="text-sm font-bold uppercase tracking-widest italic">Live Schema Profiler</span>
                     </div>
                     <span className="px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#7C5CFC] text-[10px] font-bold uppercase tracking-widest">Active Scan</span>
                  </div>
                  <div className="p-8 space-y-4 font-mono text-[12px]">
                     <div className="flex items-center gap-4 text-emerald-500/80 bg-emerald-500/5 p-3 rounded-lg">
                        <span className="shrink-0">PROFILER:</span>
                        <span className="truncate">SUCCESS - Schema 'claims_v2' matches HIPAA PII patterns.</span>
                     </div>
                     <div className="flex items-center gap-4 text-amber-500/80 bg-amber-500/5 p-3 rounded-lg">
                        <span className="shrink-0">QUALITY:</span>
                        <span className="truncate">WARNING - Distribution drift detected in 'transaction_amt'.</span>
                     </div>
                     <div className="flex items-center gap-4 text-red-500/80 bg-red-500/5 p-3 rounded-lg">
                        <span className="shrink-0">GOVERNANCE:</span>
                        <span className="truncate">CRITICAL - Missing explicit disclosure field in 'sub_form_c'.</span>
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
            { title: "Dark Data Discovery", desc: "Deciphering unstructured silos via automated vector mapping.", icon: Search, spec: "p99 Vector match" },
            { title: "Schema Profiling", desc: "Automated intent definition for complex enterprise datasets.", icon: FileText, spec: "JSON-LD / Turtle" },
            { title: "Compliance Mapping", desc: "Audit-ready cross-referencing for SEC and HIPAA rule-sets.", icon: ShieldCheck, spec: "Zero-Trust" },
            { title: "Gap Analysis", desc: "Diagnostic reporting on missingness and feature drift.", icon: AlertCircle, spec: "Drift Δ < 0.01" }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-[#7C5CFC]/30 transition-all group relative overflow-hidden">
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-[#7C5CFC]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase italic tracking-widest mb-3">{f.title}</h3>
                <p className="text-[13px] font-semibold text-zinc-400 leading-relaxed mb-6">{f.desc}</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Metric:</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-[#7C5CFC]">{f.spec}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Compliance Protocol Grid (New Robust Polish) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { r: "HIPAA", s: "ALIGNED", d: "Automatic PII sanitization across cloud Parquet buffers." },
                { r: "SEC 17a-4", s: "ALIGNED", d: "Immutable audit-log trails for all agentic data interactions." },
                { r: "GDPR", s: "ALIGNED", d: "Zero-knowledge residency protocols for European endpoints." },
                { r: "SOC2 Typ II", s: "PENDING", d: "Continuous monitoring of internal data access vectors." },
                { r: "ISO 27001", s: "ALIGNED", d: "Encrypted-at-rest requirements for vector-store embeddings." },
                { r: "FTC Safeguard", s: "ALIGNED", d: "Brute-force resistant model-exposure guardrails." }
              ].map((p, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col justify-between hover:bg-zinc-800 transition-colors">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-white italic tracking-tighter">{p.r}</span>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${p.s === 'ALIGNED' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-amber-500/30 text-amber-500 bg-amber-500/10'}`}>
                         {p.s}
                      </span>
                   </div>
                   <p className="text-[11px] font-semibold text-zinc-500 leading-relaxed uppercase tracking-tight">{p.d}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Technical Architecture (The Robust Polish) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
           <div className="rounded-[48px] border border-white/10 bg-zinc-900/30 p-10 md:p-16 relative overflow-hidden group">
              <div className="flex flex-col lg:flex-row gap-16">
                 <div className="lg:w-1/3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7857FF] mb-4 block">Process Architecture</span>
                    <h2 className="text-3xl md:text-5xl font-bold uppercase italic tracking-tighter text-white leading-none mb-8">
                       Audit-Native <br /> Engineering.
                    </h2>
                    <p className="text-base font-semibold text-zinc-500 leading-relaxed">
                       We don&apos;t just scan data; we build the infrastructure required to 
                       keep it model-ready 24/7.
                    </p>
                 </div>
                 <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { l: "Phase 01", t: "Ingestion & Sanitization", d: "Normalization of heterogeneous sources into unified Parquet buffers." },
                      { l: "Phase 02", t: "Entity Linkage & Graphing", d: "Resolving identity across disparate tables with high probabilistic match." },
                      { l: "Phase 03", t: "Compliance Guardrails", d: "Real-time sanitization of PII/PHI via local-inference masking." },
                      { l: "Phase 04", t: "Readiness Indexing", d: "Final scoring and vector-indexing for RAG-augmented workflows." }
                    ].map((step, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-[#7C5CFC] block mb-2">{step.l}</span>
                         <h4 className="text-md font-bold text-white uppercase italic mb-2">{step.t}</h4>
                         <p className="text-[12px] font-medium text-zinc-500 leading-snug">{step.d}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
           <div className="rounded-[48px] bg-gradient-to-br from-[#7C5CFC] to-[#4F46E5] p-12 md:p-20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[grid-white/10%] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none" />
              <div className="relative z-10">
                 <h2 className="text-4xl md:text-7xl font-bold uppercase italic tracking-tighter text-white mb-8 leading-none">
                    Start Your <br /> Readiness Audit.
                 </h2>
                 <p className="text-white/80 font-medium mb-12 max-w-xl mx-auto text-lg">
                    Speak with our Data Engineering desk to schedule a comprehensive 
                    scan of your enterprise data infrastructure.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/Contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-10 py-5 text-sm font-bold uppercase tracking-widest text-[#7C5CFC] hover:bg-zinc-100 transition-all active:scale-95">
                       Schedule Audit <Zap className="h-4 w-4" />
                    </a>
                    <a href="/Contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-10 py-5 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-all backdrop-blur-md">
                       View Pricing
                    </a>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
