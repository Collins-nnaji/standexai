import Link from "next/link";
import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
import {
  ArrowRight,
  BarChart3,
  Binary,
  Blocks,
  Database,
  FileSpreadsheet,
  FolderSearch2,
  LineChart,
  Lock,
  Radar,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react";

const capabilityAreas = [
  {
    title: "Data Engineering",
    description:
      "Pipelines, transformation layers, and warehouse-ready data models that turn fragmented source systems into usable operational intelligence.",
    icon: Database,
  },
  {
    title: "Analytics Architecture",
    description:
      "Reporting foundations, semantic layers, KPI frameworks, and dashboard-ready structures built for reliable decision-making.",
    icon: LineChart,
  },
  {
    title: "Data Platform Integration",
    description:
      "Connected systems across SQL, cloud storage, ERP, CRM, SharePoint, APIs, exports, and business tools that need to work together cleanly.",
    icon: Waypoints,
  },
  {
    title: "Data Quality Operations",
    description:
      "Validation rules, anomaly detection, missingness tracking, and operational controls that keep analytics outputs trustworthy over time.",
    icon: Radar,
  },
  {
    title: "AI-Ready Data Layers",
    description:
      "Structured and unstructured pipelines prepared for retrieval, search, document intelligence, and future AI workflows.",
    icon: Sparkles,
  },
  {
    title: "Governance & Security",
    description:
      "Permission-aware design, access boundaries, lineage visibility, and secure handling of sensitive business and customer data.",
    icon: ShieldCheck,
  },
];

const deliveryStages = [
  {
    step: "01",
    title: "Map The Data Landscape",
    description:
      "We identify where your data lives, how it moves, which reports matter, and where breakdowns or manual handoffs are currently slowing the business down.",
  },
  {
    step: "02",
    title: "Design The Pipeline Layer",
    description:
      "We define ingestion patterns, transformations, storage strategy, model structure, and the operational flow needed to support reporting and AI use cases.",
  },
  {
    step: "03",
    title: "Implement Quality & Control",
    description:
      "We build checks for schema consistency, missing fields, duplicates, outliers, access control, and the other failure points that undermine trust in data.",
  },
  {
    step: "04",
    title: "Deliver Analytics That Last",
    description:
      "We ship the reporting and decision-support layer with a strong foundation underneath it, so the business can rely on outputs as usage scales.",
  },
];

const outcomes = [
  "Faster reporting cycles with less manual wrangling",
  "Cleaner data models for dashboards, automation, and AI systems",
  "More reliable visibility across operations, finance, sales, and delivery",
  "Stronger control over data quality, permissions, and platform complexity",
];

const useCases = [
  "Executive dashboards built on stable data models instead of spreadsheet stitching",
  "Operational reporting across multiple systems with shared definitions and trusted KPIs",
  "Data pipelines for Power BI, internal analytics apps, and AI-enabled search or assistants",
  "Document, file, and export processing turned into structured insight for teams",
  "Customer, product, service, and transaction data prepared for downstream automation",
  "Modern analytics foundations for businesses moving from reactive reporting to proactive intelligence",
];

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white selection:bg-[#F2C811]/20">
      <TopNav />

      <main className="relative z-10 flex flex-1 flex-col overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,200,17,0.14),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />

        <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F2C811]/20 bg-[#F2C811]/10 px-4 py-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-[#F2C811]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F2C811]">
                Data Engineering & Analytics
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[0.92] tracking-tight text-white md:text-7xl lg:text-8xl">
              Data Foundations
              <br />
              Built To Scale.
            </h1>

            <p className="mt-8 max-w-3xl text-lg font-medium leading-relaxed text-zinc-300 md:text-2xl">
              We design the data pipelines, models, integrations, and reporting layers that turn
              disconnected information into usable business intelligence. The goal is not more data.
              It is cleaner systems, clearer decisions, and infrastructure your organisation can grow on.
            </p>

          </div>

          <div className="relative">
            <div className="rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-35px_rgba(0,0,0,0.75)] backdrop-blur-sm md:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Delivery Stack</p>
                  <p className="mt-2 text-lg font-bold tracking-tight text-white">Operational data architecture</p>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Active
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { label: "Source Layer", value: "ERP, CRM, SQL, files, forms, exports, APIs, SharePoint", icon: FolderSearch2, color: "text-[#F2C811]" },
                  { label: "Pipeline Layer", value: "Ingestion, cleaning, transformations, matching, enrichment", icon: ServerCog, color: "text-emerald-400" },
                  { label: "Model Layer", value: "Analytics models, semantic structure, warehouse-ready outputs", icon: Blocks, color: "text-sky-400" },
                  { label: "Decision Layer", value: "Dashboards, reports, alerting, automation, AI-ready retrieval", icon: Binary, color: "text-violet-400" },
                ].map((item, index) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-zinc-950/80 p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                            0{index + 1}
                          </span>
                          <span className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                            {item.label}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 w-full max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {outcomes.map((item) => (
              <div key={item} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold leading-relaxed text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-7xl px-6 lg:px-12">
          <div className="mb-12 max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#F2C811]">Capabilities</span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
              What We Build In The Data Layer.
            </h2>
            <p className="mt-5 text-lg font-medium leading-relaxed text-zinc-400">
              We help organisations move from scattered information and fragile reporting to connected,
              dependable data operations. That includes the engineering underneath analytics, automation,
              and future AI adoption.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {capabilityAreas.map((item) => (
              <div
                key={item.title}
                className="rounded-[32px] border border-white/10 bg-white/5 p-8 transition-all hover:border-[#F2C811]/30 hover:bg-white/[0.08]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80">
                  <item.icon className="h-6 w-6 text-[#F2C811]" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">{item.title}</h3>
                <p className="mt-4 text-sm font-medium leading-7 text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-emerald-400">Delivery Model</span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                From Source Systems To Decision Systems.
              </h2>
              <p className="mt-5 text-lg font-medium leading-relaxed text-zinc-400">
                Better analytics is usually not a dashboard problem. It is a systems problem. We focus
                on the movement, structure, and quality of data so the reporting layer becomes dependable,
                scalable, and useful across the business.
              </p>

              <div className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <Lock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Designed for trust and control</h3>
                    <p className="mt-3 text-sm font-medium leading-7 text-zinc-400">
                      We build with permissions, consistency, lineage, and operational visibility in mind
                      so business teams can depend on the outputs instead of second-guessing them.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {deliveryStages.map((item) => (
                <div key={item.step} className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6">
                  <div className="flex items-start gap-5">
                    <div className="min-w-12 text-2xl font-bold tracking-tight text-[#F2C811]">{item.step}</div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">{item.title}</h3>
                      <p className="mt-3 text-sm font-medium leading-7 text-zinc-400">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-7xl px-6 lg:px-12">
          <div className="rounded-[40px] border border-white/10 bg-white/5 p-8 md:p-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-sky-400">Use Cases</span>
                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                  Where Better Data Infrastructure Pays Off.
                </h2>
                <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-zinc-400">
                  The biggest gains usually come from removing reporting friction, reconnecting systems,
                  and giving teams a dependable data layer for planning, action, and automation.
                </p>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-zinc-950/70 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10">
                    <FileSpreadsheet className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Best Fit</p>
                    <p className="text-lg font-bold text-white">Teams relying on manual reporting and disconnected data</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium leading-7 text-zinc-400">
                  If reporting depends on exports, spreadsheet logic, duplicate records, or slow reconciliation
                  across systems, the business usually needs engineering at the data layer before it needs more dashboards.
                </p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {useCases.map((item) => (
                <div key={item} className="flex items-start gap-4 rounded-[28px] border border-white/10 bg-zinc-950/60 p-5">
                  <Database className="mt-0.5 h-5 w-5 shrink-0 text-[#F2C811]" />
                  <p className="text-sm font-semibold leading-7 text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                title: "Analytics That Hold Up",
                description: "Reliable reporting starts with stable structures, not one-off dashboard fixes.",
                icon: LineChart,
              },
              {
                title: "Cleaner Operational Data",
                description: "We reduce duplication, inconsistencies, and fragile joins that create downstream confusion.",
                icon: Radar,
              },
              {
                title: "Ready For Automation & AI",
                description: "A strong data layer unlocks better workflows, better analytics, and better AI outcomes later.",
                icon: Sparkles,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-7">
                <item.icon className="h-6 w-6 text-emerald-400" />
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-5xl px-6 text-center lg:px-12">
          <div className="relative overflow-hidden rounded-[48px] border border-white/10 bg-white/5 px-8 py-14 md:px-14 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,200,17,0.12),transparent_55%)]" />
            <div className="relative">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#F2C811]">Next Step</span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
                Build A Data Layer Your Business Can Trust.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-400">
                If you need cleaner reporting, better pipeline design, or a more reliable analytics foundation,
                we can help map the right architecture and deliver it.
              </p>

              <div className="mt-10 flex justify-center">
                <Link
                  href="/Contact"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#F2C811] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-zinc-950 transition-all hover:bg-[#ddb60f] active:scale-[0.98]"
                >
                  Speak With Standex
                  <ArrowRight className="h-4 w-4" />
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
