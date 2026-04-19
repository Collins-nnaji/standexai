import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-digital/Footer";
import { Cpu, Database, Network, Shield, Link, Blocks, Layers, Globe } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col z-10 pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-24">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 mb-8">
              <Network className="h-3.5 w-3.5 text-[#7C5CFC]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C5CFC]">Enterprise Systems</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.85] mb-10">
              AI <br /> Integration.
            </h1>
            <p className="text-xl font-medium text-zinc-400 max-w-2xl">
              Architecting the bridge between your enterprise data and the next generation of artificial intelligence. 
              Secure, scalable, and built for production.
            </p>
          </div>
        </section>

        {/* Integration Pillars */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="space-y-12">
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-6 w-6 text-[#7C5CFC]" />
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Data Ingestion</h3>
              </div>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed">
                We design high-throughput pipelines to ingest structured and unstructured enterprise data 
                into vector databases and AI-ready stores, ensuring your models are always grounded in fact.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-[#7C5CFC]" />
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Security & Privacy</h3>
              </div>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed">
                Implementing enterprise-grade PII filtering, data masking, and private cloud deployments 
                (Azure OpenAI, AWS Bedrock) to keep your intellectual property secure.
              </p>
            </div>
          </div>
          <div className="space-y-12">
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Blocks className="h-6 w-6 text-[#7C5CFC]" />
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">API & Middleware</h3>
              </div>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed">
                Developing custom LLM middleware to manage rate limits, context windows, and model routing 
                transparently across your entire application ecosystem.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-[#7C5CFC]" />
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Legacy Connectivity</h3>
              </div>
              <p className="text-base font-semibold text-zinc-400 leading-relaxed">
                Connecting modern AI agentic workflows to your legacy ERP, CRM, and SQL systems 
                through secure custom connectors and orchestration layers.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture Visual */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-24">
           <div className="relative rounded-[40px] border border-white/10 bg-white/5 p-12 overflow-hidden flex flex-col items-center text-center">
             <div className="bg-zinc-900 rounded-[32px] p-8 md:p-12 shadow-sm border border-white/10 max-w-2xl w-full">
               <Layers className="h-10 w-10 text-zinc-500 mb-6 mx-auto" strokeWidth={1.5} />
               <h3 className="text-xl font-black text-white uppercase italic mb-4">Unified AI Architecture</h3>
               <p className="text-sm font-semibold text-zinc-400">
                 Our integration methodology ensures that your AI investment is not a silo, 
                 but a core component of your digital engineering stack.
               </p>
             </div>
             
             {/* Decorative Background Icon */}
             <Network className="absolute -bottom-20 -right-20 h-80 w-80 text-white opacity-[0.03] pointer-events-none" />
           </div>
        </section>

        {/* Deployment Journey */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-32">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C5CFC] mb-4">Architecture Workflow</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-[0.9]">
              The Data-to-Intelligence <br /> Journey.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", label: "Ingest", desc: "Pipeline from SQL, ERP, & Document stores." },
              { step: "02", label: "Mask", desc: "PII scrubbing & automated anonymization." },
              { step: "03", label: "Embed", desc: "Dataverse to HBM Vector transformations." },
              { step: "04", label: "Deploy", desc: "Secure model exposure via managed API." }
            ].map((s, i) => (
              <div key={i} className="relative p-6 rounded-3xl border border-white/5 bg-white/5 group hover:border-[#7C5CFC] transition-all duration-500">
                <div className="text-[10px] font-black text-zinc-600 mb-4 group-hover:text-[#7C5CFC] transition-colors">{s.step}</div>
                <h4 className="text-lg font-black uppercase italic text-white mb-2">{s.label}</h4>
                <p className="text-xs font-semibold text-zinc-500 leading-relaxed">{s.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-4 bg-zinc-950 border-t border-r border-white/5 rotate-45 z-10 translate-y-[-50%]" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto px-6 w-full text-center">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight mb-6 leading-none">
                Ready to integrate <br /> enterprise AI?
              </h2>
              <p className="text-zinc-400 mb-10 font-medium">Build your secure bridge to the intelligence era.</p>
              <a href="/Contact" className="inline-flex items-center gap-2 rounded-2xl bg-[#049DCB] px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:opacity-90 transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(4,157,203,0.3)]">
                Request Architecture Review
              </a>
            </div>
            <Cpu className="absolute -bottom-20 -left-20 h-80 w-80 text-white opacity-[0.05] pointer-events-none" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
