import Link from "next/link";
import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Boxes,
  Database,
  Eye,
  FileCheck,
  GitBranch,
  Lock,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";

const capabilityAreas = [
  {
    title: "AI Agents & Assistants",
    description:
      "Task-focused copilots, internal knowledge assistants, and workflow agents designed around real business operations instead of generic chat demos.",
    icon: Bot,
  },
  {
    title: "Retrieval & Knowledge Systems",
    description:
      "RAG pipelines, document intelligence, search layers, and grounded reasoning connected to the data your teams already trust.",
    icon: Database,
  },
  {
    title: "Workflow Orchestration",
    description:
      "AI systems that trigger actions, call tools, route approvals, generate outputs, and coordinate work across APIs, documents, and humans.",
    icon: Workflow,
  },
  {
    title: "Multi-Agent Architecture",
    description:
      "Planner, researcher, validator, and executor patterns for complex jobs that need separation of concerns, feedback loops, and reliability.",
    icon: Boxes,
  },
  {
    title: "Model & Tool Routing",
    description:
      "Practical orchestration across LLMs, search, custom tools, structured outputs, and business systems so performance stays cost-aware and fast.",
    icon: GitBranch,
  },
  {
    title: "Governance & Evaluation",
    description:
      "Guardrails, prompt controls, permission boundaries, observability, and eval workflows for production confidence rather than guesswork.",
    icon: ShieldCheck,
  },
];

const deliveryStages = [
  {
    step: "01",
    title: "Discovery & Use-Case Design",
    description:
      "We map where AI will actually create leverage: repetitive operations, document-heavy workflows, internal knowledge access, triage, reporting, and decision support.",
  },
  {
    step: "02",
    title: "Data & System Readiness",
    description:
      "We assess source systems, permissions, structured and unstructured data, quality issues, and the operational constraints that affect deployment.",
  },
  {
    step: "03",
    title: "Architecture & Guardrails",
    description:
      "We define the model strategy, retrieval design, tool calling, output schemas, escalation rules, human approval points, and monitoring strategy.",
  },
  {
    step: "04",
    title: "Build, Validate, Deploy",
    description:
      "We implement the system, test against realistic scenarios, evaluate quality and failure modes, and ship production-ready AI with a clear operating model.",
  },
];

const outcomeCards = [
  "Faster internal knowledge retrieval and response generation",
  "Reduced manual handling across repetitive back-office workflows",
  "Higher consistency in documents, summaries, recommendations, and triage",
  "Safer AI adoption through permissions, logs, review checkpoints, and evals",
];

const useCases = [
  "Internal support copilots for operations, HR, IT, finance, and delivery teams",
  "AI agents for intake, enrichment, classification, and document processing",
  "Decision-support assistants connected to CRM, ERP, SQL, and cloud platforms",
  "Sales and service assistants that summarize accounts, generate next actions, and draft communications",
  "Compliance-aware knowledge systems with source grounding and review workflows",
  "Power Platform and Azure AI solutions for Microsoft-first enterprise environments",
];

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-white selection:bg-[#049DCB]/25">
      <TopNav />

      <main className="relative z-10 flex flex-1 flex-col overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(4,157,203,0.16),transparent_35%),radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />

        <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#049DCB]/20 bg-[#049DCB]/10 px-4 py-1.5">
              <BrainCircuit className="h-3.5 w-3.5 text-[#049DCB]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#049DCB]">
                Enterprise Artificial Intelligence
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[0.92] tracking-tight text-white md:text-7xl lg:text-8xl">
              Artificial Intelligence
              <br />
              Built For Real Work.
            </h1>

            <p className="mt-8 max-w-3xl text-lg font-medium leading-relaxed text-zinc-300 md:text-2xl">
              We design and deploy practical AI systems for organisations that need more than a chatbot.
              From grounded assistants and autonomous workflows to multi-agent orchestration and secure
              enterprise integrations, we build intelligence that fits operational reality.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/Contact"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#049DCB] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_24px_60px_-18px_rgba(4,157,203,0.45)] transition-all hover:bg-[#0388B0] active:scale-[0.98]"
              >
                Start An AI Project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/Contact"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:border-emerald-500/40 hover:bg-white/10 active:scale-[0.98]"
              >
                Book A Consultation
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-35px_rgba(0,0,0,0.75)] backdrop-blur-sm md:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">AI Delivery Stack</p>
                  <p className="mt-2 text-lg font-bold tracking-tight text-white">Production-first deployment model</p>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Live
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { label: "Input Layer", value: "Docs, SQL, APIs, CRM, ERP, SharePoint, Dataverse", icon: FileCheck, color: "text-[#049DCB]" },
                  { label: "Reasoning Layer", value: "RAG, tool calling, routing, validation, structured outputs", icon: Sparkles, color: "text-emerald-400" },
                  { label: "Control Layer", value: "Permissions, approvals, tracing, evals, guardrails, logs", icon: Lock, color: "text-amber-400" },
                  { label: "Outcome Layer", value: "Assistants, automations, summaries, decisions, actions", icon: Wrench, color: "text-violet-400" },
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
            {outcomeCards.map((item) => (
              <div key={item} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="mb-4 h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold leading-relaxed text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-7xl px-6 lg:px-12">
          <div className="mb-12 max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#049DCB]">Capabilities</span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
              What We Actually Build.
            </h2>
            <p className="mt-5 text-lg font-medium leading-relaxed text-zinc-400">
              Our AI work is focused on business systems, operating workflows, and measurable outcomes.
              We build the surrounding infrastructure too: retrieval, permissions, integration, evaluation,
              observability, and rollout strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {capabilityAreas.map((item) => (
              <div
                key={item.title}
                className="group rounded-[32px] border border-white/10 bg-white/5 p-8 transition-all hover:border-[#049DCB]/30 hover:bg-white/[0.08]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80">
                  <item.icon className="h-6 w-6 text-[#049DCB]" />
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
                From Use Case To Operating System.
              </h2>
              <p className="mt-5 text-lg font-medium leading-relaxed text-zinc-400">
                Strong AI delivery is not only about models. It is about choosing the right process,
                data boundaries, evaluation criteria, escalation paths, and implementation approach for
                your organisation.
              </p>

              <div className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <Eye className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Built for accountable deployment</h3>
                    <p className="mt-3 text-sm font-medium leading-7 text-zinc-400">
                      We prioritise grounded outputs, clear permissions, human review where required,
                      structured logs, and measurable quality checks so AI can be used confidently in live operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {deliveryStages.map((item) => (
                <div key={item.step} className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6">
                  <div className="flex items-start gap-5">
                    <div className="min-w-12 text-2xl font-bold tracking-tight text-[#049DCB]">{item.step}</div>
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
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-violet-400">Use Cases</span>
                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                  Where Enterprise AI Creates Real Leverage.
                </h2>
                <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-zinc-400">
                  We focus on workflows where intelligence needs to be useful, traceable, and connected to
                  systems of record rather than isolated in a novelty interface.
                </p>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-zinc-950/70 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10">
                    <Users className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Best Fit</p>
                    <p className="text-lg font-bold text-white">Operations-heavy teams with fragmented workflows</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium leading-7 text-zinc-400">
                  AI works best when it reduces repetitive thinking, accelerates review, improves access to knowledge,
                  and helps teams act faster across existing systems without sacrificing governance.
                </p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {useCases.map((item) => (
                <div key={item} className="flex items-start gap-4 rounded-[28px] border border-white/10 bg-zinc-950/60 p-5">
                  <MessagesSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#049DCB]" />
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
                title: "Security First",
                description: "Permission-aware design, data boundaries, review checkpoints, and model access controls.",
                icon: Lock,
              },
              {
                title: "Evaluation Built In",
                description: "Scenario testing, trace inspection, output validation, and iterative improvement loops.",
                icon: FileCheck,
              },
              {
                title: "Enterprise Integration",
                description: "Connected systems across Microsoft, cloud APIs, databases, documents, and internal tools.",
                icon: Database,
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
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(4,157,203,0.12),transparent_55%)]" />
            <div className="relative">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#049DCB]">Next Step</span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
                Build AI That Improves How The Business Runs.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-400">
                If you need a serious AI partner for assistants, workflow automation, retrieval systems,
                or enterprise deployment strategy, we can help design the right architecture and deliver it.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/Contact"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#049DCB] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#0388B0] active:scale-[0.98]"
                >
                  Speak With Engineering
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/Contact"
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/60 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-900 active:scale-[0.98]"
                >
                  Discuss Your AI Use Case
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
