import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
import PPservices from "@/components/standex-ai/PowerPlatform/PPservices";
import PPdiscovery from "@/components/standex-ai/PowerPlatform/PPdiscovery";
import { ShieldCheck, Database, Lock, Settings, BarChart3, Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white selection:bg-emerald-500/20">
      <TopNav />

      <main className="relative flex-1 flex flex-col z-10">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-40 pb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-[#7C5CFC]/10 px-4 py-1.5 mb-8">
            <ShieldCheck className="h-3.5 w-3.5 text-[#7C5CFC]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C5CFC]">Governance, Compliance & AI Readiness</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-12">
            Power Platform<br />Governance.
          </h1>
          <p className="text-xl md:text-2xl font-medium text-zinc-300 max-w-3xl leading-relaxed">
            End-to-end governance for the Microsoft Power Platform — from tenant security and DLP policy to AI-readiness audits, data compliance, and enterprise-grade data engineering.
          </p>
        </section>

        {/* Services Grid */}
        <PPservices />

        {/* Merged Overview: Power Platform + AI Capabilities */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Orbital diagram from PPabout */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Center circle */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#7C5CFC] rounded-full w-2/5 h-2/5 flex items-center justify-center z-10"
                  style={{ boxShadow: '0 0 40px rgba(124,92,252,0.4)' }}
                >
                  <div className="text-center text-white font-medium text-sm">
                    <div>Power</div>
                    <div>Platform</div>
                    <div>Solutions</div>
                  </div>
                </div>

                {/* Top: Power Apps */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4">
                  <div className="absolute inset-0 border-4 border-[#D25BB1] rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/PowerApps.svg" alt="Power Apps" className="w-1/2 h-1/2" />
                  </div>
                </div>
                <div className="absolute top-[12%] left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 border-4 border-[#D25BB1] rounded-full border-b-0 border-x-0" />

                {/* Right: Power BI */}
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1/4 h-1/4">
                  <div className="absolute inset-0 border-4 border-[#EEA32C] rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/PowerBi.svg" alt="Power BI" className="w-3/4 h-1/2" />
                  </div>
                </div>
                <div className="absolute top-1/2 right-[12%] transform -translate-y-1/2 w-1/3 h-1/3 border-4 border-[#EEA32C] rounded-full border-l-0 border-y-0" />

                {/* Bottom: Power Pages */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4">
                  <div className="absolute inset-0 border-4 border-[#9B7AC7] rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/PowerPages.svg" alt="Power Pages" className="w-1/2 h-1/2" />
                  </div>
                </div>
                <div className="absolute bottom-[12%] left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 border-4 border-[#9B7AC7] rounded-full border-t-0 border-x-0" />

                {/* Left: Power Automate */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1/4 h-1/4">
                  <div className="absolute inset-0 border-4 border-[#2F8DD8] rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/PowerAutomate.svg" alt="Power Automate" className="w-1/2 h-1/2" />
                  </div>
                </div>
                <div className="absolute top-1/2 left-[12%] transform -translate-y-1/2 w-1/3 h-1/3 border-4 border-[#2F8DD8] rounded-full border-r-0 border-y-0" />
              </div>
            </div>

            {/* Right: Overview text */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C5CFC] mb-4 block">Platform Overview</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-8">
                What Is The Microsoft Power Platform?
              </h2>
              <p className="text-lg font-semibold text-zinc-300 leading-relaxed mb-6">
                The Microsoft Power Platform is a suite of tools — Power Apps, Power Automate, Power BI, and Power Pages — each powerful independently and transformative when unified.
              </p>
              <p className="text-lg font-semibold text-zinc-400 leading-relaxed mb-10">
                At its heart is the ability to unify analytics, automation, application development, and AI. It streamlines operations, reduces dependency on third-party tools, and eliminates manual migrations across your enterprise.
              </p>
              <ul className="space-y-3">
                {[
                  "Unified analytics, automation & application development",
                  "AI-powered workflows and intelligent agents",
                  "Tenant architecture & environment strategy",
                  "Data Loss Prevention (DLP) policy design",
                  "Centre of Excellence (CoE) toolkit deployment",
                  "Connector governance & licensing compliance",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white">
                    <Sparkles className="h-4 w-4 text-[#7C5CFC] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Governance Services */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-24">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C5CFC] mb-4 block">Platform Governance</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Govern With Confidence.
            </h2>
          </div>

          {/* Tenant Health Monitor */}
          <div className="rounded-[40px] border border-white/10 bg-zinc-900 overflow-hidden mb-12">
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-bold uppercase tracking-widest italic text-white">Tenant Health Monitor</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Live</span>
            </div>
            <div className="p-8 space-y-4 font-mono text-[12px]">
              <div className="flex items-center gap-4 text-emerald-500/80 bg-emerald-500/5 p-3 rounded-lg">
                <span className="shrink-0">DLP:</span>
                <span className="truncate">SUCCESS — 42 connectors classified across 3 environments.</span>
              </div>
              <div className="flex items-center gap-4 text-amber-500/80 bg-amber-500/5 p-3 rounded-lg">
                <span className="shrink-0">COE:</span>
                <span className="truncate">WARNING — 7 unmanaged apps detected in Production env.</span>
              </div>
              <div className="flex items-center gap-4 text-emerald-500/80 bg-emerald-500/5 p-3 rounded-lg">
                <span className="shrink-0">LICENSE:</span>
                <span className="truncate">ALIGNED — Premium connector usage within allocation.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "DLP Policy Design", desc: "Classify every connector. Prevent data leakage between business and non-business groups.", icon: Lock, spec: "Tenant Scoped" },
              { title: "CoE Toolkit", desc: "Deploy Microsoft's Centre of Excellence starter kit with custom dashboards and automation.", icon: Settings, spec: "Fully Managed" },
              { title: "Environment Strategy", desc: "Architect Dev, Test, and Production environments with proper isolation and ALM pipelines.", icon: Database, spec: "Azure DevOps" },
              { title: "Licence Optimisation", desc: "Right-size your Power Platform licences and avoid costly overprovision.", icon: BarChart3, spec: "Cost Reduction" },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase italic tracking-widest mb-3">{f.title}</h3>
                <p className="text-[13px] font-semibold text-zinc-300 leading-relaxed mb-6">{f.desc}</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Spec:</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">{f.spec}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI & Data Readiness */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-24">
          <div className="rounded-[48px] border border-white/10 bg-zinc-900/50 p-12 md:p-20 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C5CFC] mb-4 block">AI & Data Readiness</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-8">
                  Don&apos;t Build On<br />Toxic Data.
                </h2>
                <p className="text-lg font-semibold text-zinc-300 leading-relaxed mb-8">
                  Before any AI or automation can be trusted, your data must be audited. We run rigorous AI-readiness diagnostics — schema profiling, compliance mapping, and quality scoring — across your entire data estate.
                </p>
                <ul className="space-y-4">
                  {[
                    "Dark data discovery & vector mapping",
                    "Schema profiling & entity linkage",
                    "HIPAA / GDPR / SEC compliance guardrails",
                    "Gap analysis & missingness reporting",
                  ].map((l, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white italic">
                      <Sparkles className="h-4 w-4 text-[#7C5CFC] shrink-0" /> {l}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Readiness Score", val: 84, hex: "#7C5CFC", desc: "Schema integrity & missingness thresholds." },
                  { name: "Quality Score", val: 92, hex: "#10b981", desc: "Outlier detection & distribution drift." },
                  { name: "Governance Score", val: 78, hex: "#f59e0b", desc: "Regulatory adherence (HIPAA / SEC / GDPR)." },
                ].map((s, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{s.name}</span>
                      <span className="text-xl font-bold" style={{ color: s.hex }}>{s.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.val}%`, backgroundColor: s.hex }} />
                    </div>
                    <p className="mt-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-24">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C5CFC] mb-4 block">Regulatory Alignment</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Built For Regulated Industries.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { r: "HIPAA", s: "ALIGNED", d: "Automatic PII sanitisation across cloud Parquet buffers." },
              { r: "SEC 17a-4", s: "ALIGNED", d: "Immutable audit-log trails for all agentic data interactions." },
              { r: "GDPR", s: "ALIGNED", d: "Zero-knowledge residency protocols for European endpoints." },
              { r: "SOC2 Typ II", s: "PENDING", d: "Continuous monitoring of internal data access vectors." },
              { r: "ISO 27001", s: "ALIGNED", d: "Encrypted-at-rest requirements for vector-store embeddings." },
              { r: "FTC Safeguard", s: "ALIGNED", d: "Brute-force resistant model-exposure guardrails." },
            ].map((p, i) => (
              <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col justify-between hover:bg-zinc-800 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-white italic tracking-tighter">{p.r}</span>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${p.s === "ALIGNED" ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-amber-500/30 text-amber-500 bg-amber-500/10"}`}>
                    {p.s}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-zinc-400 leading-relaxed uppercase tracking-tight">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Audit Process */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-24">
          <div className="rounded-[48px] border border-white/10 bg-zinc-900/30 p-10 md:p-16">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/3">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7C5CFC] mb-4 block">Audit Architecture</span>
                <h2 className="text-3xl md:text-5xl font-bold uppercase italic tracking-tighter text-white leading-none mb-8">
                  Audit-Native<br />Engineering.
                </h2>
                <p className="text-base font-semibold text-zinc-400 leading-relaxed">
                  We don&apos;t just scan data. We build the infrastructure to keep your platform and data model-ready, compliant, and governed continuously.
                </p>
              </div>
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { l: "Phase 01", t: "Discovery & Profiling", d: "Mapping your entire data estate — structured, unstructured, and shadow IT sources." },
                  { l: "Phase 02", t: "Governance Baseline", d: "Setting DLP policies, environment rules, and connector classifications across your tenant." },
                  { l: "Phase 03", t: "Compliance Guardrails", d: "Real-time PII/PHI sanitisation and regulatory alignment across all data flows." },
                  { l: "Phase 04", t: "Readiness Certification", d: "Final scoring, gap report, and readiness certification for AI and automation deployment." },
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

        <PPdiscovery />
      </main>

      <Footer />
    </div>
  );
}
