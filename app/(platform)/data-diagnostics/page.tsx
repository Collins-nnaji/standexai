"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
 import Image from "next/image";
import { ArrowRight, AlertTriangle, Shield, LayoutGrid, TrendingUp, Eye, Lock, Database, CheckCircle2 } from "lucide-react";
 import { neonAuthClient } from "@/lib/neon/auth-client";
 
 const TICKER_EVENTS = [
   { model: "GPT-4o", dataset: "Payments", issue: "missing FX fee column", severity: "critical", ago: "2 mins ago" },
   { model: "Gemini", dataset: "CRM", issue: "stale churn labels detected", severity: "warning", ago: "8 mins ago" },
   { model: "Claude", dataset: "Finance", issue: "outdated revenue mapping", severity: "critical", ago: "14 mins ago" },
   { model: "GPT-4o", dataset: "Support", issue: "null category rate spiked", severity: "warning", ago: "21 mins ago" },
   { model: "Gemini", dataset: "Growth", issue: "ambiguous primary key", severity: "critical", ago: "33 mins ago" },
   { model: "GPT-4o", dataset: "Risk", issue: "inconsistent join keys", severity: "critical", ago: "47 mins ago" },
   { model: "Claude", dataset: "Ops", issue: "invalid timezone normalization", severity: "warning", ago: "1 hr ago" },
 ];
 
type DatasetProfile = {
  name: string;
  gptScore: number;
  claudeScore: number;
  geminiScore: number;
  readinessScore: number;
  tier: "critical" | "moderate" | "excellent";
};

const DEMO_DATASETS: DatasetProfile[] = [
   {
     name: "Payments",
     gptScore: 62,
     claudeScore: 78,
     geminiScore: 41,
     readinessScore: 47,
     tier: "critical",
   },
   {
     name: "CRM",
     gptScore: 85,
     claudeScore: 89,
     geminiScore: 82,
     readinessScore: 87,
     tier: "moderate",
   },
   {
     name: "Finance",
     gptScore: 94,
     claudeScore: 92,
     geminiScore: 96,
     readinessScore: 94,
     tier: "excellent",
   },
 ];
 
 const SCORE_TIER_COLORS: Record<string, string> = {
   excellent: "text-emerald-600",
   moderate: "text-amber-500",
   critical: "text-red-600",
 };
 
 const SCORE_TIER_BG: Record<string, string> = {
   excellent: "bg-emerald-50 border-emerald-100",
   moderate: "bg-amber-50 border-amber-100",
   critical: "bg-red-50 border-red-100",
 };
 
 const SCORE_TIER_LABEL: Record<string, string> = {
   excellent: "Excellent",
   moderate: "Moderate Risk",
   critical: "Critical",
 };

const SCHEMA_SNAPSHOTS: Record<string, { primaryKey: string; joinKeys: string[]; qualityChecks: string[] }> = {
  Payments: {
    primaryKey: "txn_id",
    joinKeys: ["customer_id", "account_id"],
    qualityChecks: ["missingness < 5%", "duplicate txn_id < 0.2%", "amount outliers (p99.5)"],
  },
  CRM: {
    primaryKey: "contact_id",
    joinKeys: ["account_id", "segment_id"],
    qualityChecks: ["null rate < 3%", "segment coverage > 98%", "churn label drift < 2%"],
  },
  Finance: {
    primaryKey: "invoice_id",
    joinKeys: ["customer_id", "fiscal_period"],
    qualityChecks: ["revenue duplicates = 0", "currency consistency", "period alignment"],
  },
};

const DEFAULT_SNAPSHOT = {
  primaryKey: "id",
  joinKeys: ["entity_id", "date_id"],
  qualityChecks: ["missingness < 5%", "duplicate rate < 1%", "schema drift alerts"],
};

const CONNECTORS = [
  { name: "Postgres", status: "Ready", detail: "Direct read-only sync" },
  { name: "Snowflake", status: "Beta", detail: "Warehouse profiling" },
  { name: "BigQuery", status: "Beta", detail: "Dataset sampling" },
  { name: "CSV Upload", status: "Ready", detail: "One-off profiling" },
];
 
function DataDiagnosticsContent() {
   const router = useRouter();
  const searchParams = useSearchParams();
   const session = neonAuthClient.useSession();
   const user = session.data?.user;
   const [tickerIdx, setTickerIdx] = useState(0);
   const [selectedDataset, setSelectedDataset] = useState(DEMO_DATASETS[0]);
  const [customDataset, setCustomDataset] = useState<DatasetProfile | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastScanId, setLastScanId] = useState<string | null>(null);
  const [lastScanAt, setLastScanAt] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const datasetParam = searchParams.get("dataset")?.trim();
  const datasetOptions = useMemo(
    () => (customDataset ? [...DEMO_DATASETS, customDataset] : DEMO_DATASETS),
    [customDataset]
  );
 
   useEffect(() => {
     const interval = setInterval(() => {
       setTickerIdx((i) => (i + 1) % TICKER_EVENTS.length);
     }, 3500);
     return () => clearInterval(interval);
   }, []);

  useEffect(() => {
    if (!datasetParam) return;
    const match = DEMO_DATASETS.find((d) => d.name.toLowerCase() === datasetParam.toLowerCase());
    if (match) {
      setCustomDataset(null);
      setSelectedDataset(match);
      return;
    }
    const synthesized: DatasetProfile = {
      name: datasetParam,
      gptScore: 72,
      claudeScore: 74,
      geminiScore: 70,
      readinessScore: 72,
      tier: "moderate",
    };
    setCustomDataset(synthesized);
    setSelectedDataset(synthesized);
  }, [datasetParam]);
 
   useEffect(() => {
     const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
     if (!elements.length) return;
     const observer = new IntersectionObserver(
       (entries) => {
         for (const entry of entries) {
           if (entry.isIntersecting) entry.target.classList.add("is-visible");
           else entry.target.classList.remove("is-visible");
         }
       },
       { threshold: 0.18, rootMargin: "-8% 0px -8% 0px" },
     );
     for (const el of elements) observer.observe(el);
     return () => observer.disconnect();
   }, []);
 
  const currentEvent = TICKER_EVENTS[tickerIdx];
  const snapshot = SCHEMA_SNAPSHOTS[selectedDataset.name] ?? DEFAULT_SNAPSHOT;

  const runDiagnostics = async () => {
    setIsRunning(true);
    setScanError(null);
    try {
      const res = await fetch("/api/readiness-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset: selectedDataset.name }),
      });
      const data = await res.json() as { scanId?: string; cachedAt?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Diagnostics run failed");
      }
      setLastScanId(data.scanId ?? "latest");
      setLastScanAt(data.cachedAt ?? new Date().toISOString());
    } catch (error) {
      setScanError(error instanceof Error ? error.message : "Diagnostics run failed");
    } finally {
      setIsRunning(false);
    }
  };
 
  return (
     <div className="min-h-screen bg-white text-[#18181B] font-sans selection:bg-indigo-500/30">
 
       {/* Navigation */}
       <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 border-b border-[#E4E4E8]">
         <div className="flex items-center gap-3">
           <Image
             src="/standexailogo.png"
             alt="StandexAI"
             width={160}
             height={48}
             className="h-9 w-auto object-contain"
             priority
           />
           <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 border border-zinc-200 rounded-full px-3 py-1">
             AI Data Modeling Studio
           </span>
         </div>
         <div className="relative ml-auto flex flex-wrap items-center justify-end gap-3 rounded-full border border-[#E4E4E8] bg-white/85 px-2 py-1.5 backdrop-blur-md">
           {user ? (
             <>
               <div className="flex items-center gap-3 px-2">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-black text-zinc-950 border border-zinc-200">
                   {(user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                 </div>
                 <button
                   onClick={() => router.push("/dashboard")}
                   className="flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-lg shadow-black/10"
                 >
                   <LayoutGrid className="h-3.5 w-3.5" />
                   Open Data Portal
                 </button>
               </div>
             </>
           ) : (
             <>
               <button
                 onClick={() => router.push("/auth/sign-in")}
                 className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest text-[#52525B] transition hover:text-zinc-950"
               >
                 Sign In
               </button>
               <button
                 onClick={() => router.push("/dashboard")}
                 className="flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-lg shadow-black/10"
               >
                 <LayoutGrid className="h-3.5 w-3.5" />
                 Open Portal
               </button>
             </>
           )}
         </div>
       </nav>
 
       {/* Live Data Diagnostics Ticker */}
       <div className="bg-[#18181B] border-b border-zinc-800 py-3 px-4 overflow-hidden">
         <div className="mx-auto max-w-7xl flex items-center gap-4">
           <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-800 rounded-full px-3 py-1">
             <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
             LIVE
           </span>
           <div className="flex-1 overflow-hidden">
             <p className="text-[11px] font-bold text-zinc-300 transition-all duration-500 truncate">
               <span className={`font-black mr-1 ${currentEvent.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>
                 {currentEvent.model}
               </span>
               {currentEvent.issue} in
               <span className="text-white font-black mx-1">{currentEvent.dataset}</span>
               — {currentEvent.ago}
               <span className="ml-2">{currentEvent.severity === "critical" ? "🔴" : "⚠️"}</span>
             </p>
           </div>
           <button
             onClick={() => router.push("/dashboard")}
             className="shrink-0 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition"
           >
             View All →
           </button>
         </div>
       </div>
 
       {/* Hero Section */}
       <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
         <div className="text-center max-w-4xl mx-auto">
           <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "0ms" }}>
             <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700 font-medium mb-6">
               <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
               AI Data Analysis Infrastructure
             </div>
           </div>
 
           <h1
             data-reveal
             data-reveal-dir="up"
             style={{ ["--delay" as string]: "80ms" }}
             className="text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-[#18181B] sm:text-6xl lg:text-[4.5rem] mb-6"
           >
             How Ready Is Your{" "}
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
               Data for AI?
             </span>
           </h1>
 
           <p
             data-reveal
             data-reveal-dir="up"
             style={{ ["--delay" as string]: "160ms" }}
             className="text-lg leading-relaxed text-[#52525B] max-w-2xl mx-auto mb-10"
           >
             StandexAI is the data analysis and modeling layer that profiles datasets, validates schemas,
             and certifies model readiness across your entire data estate.
           </p>
 
           <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "240ms" }} className="flex flex-wrap items-center justify-center gap-4">
             <button
               onClick={() => router.push("/dashboard")}
               className="group flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-[15px] font-bold text-white transition hover:bg-indigo-700 shadow-xl shadow-indigo-600/20"
             >
               Get Data Readiness Score
               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
             </button>
             <button
               onClick={() => router.push("/data-diagnostics")}
               className="flex items-center gap-2 rounded-full border border-[#E4E4E8] bg-white px-8 py-4 text-[15px] font-bold text-[#18181B] transition hover:bg-[#F4F4F5] shadow-lg"
             >
               Run Data Diagnostics
             </button>
           </div>
 
           {/* Stats row */}
           <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "320ms" }} className="mt-14 flex flex-wrap items-center justify-center gap-10 border-t border-[#E4E4E8] pt-10">
             {[
               { val: "3", label: "AI Models Evaluated" },
               { val: "0–100", label: "Readiness Scale" },
               { val: "6x", label: "Quality Signals Weighted" },
               { val: "Live", label: "Continuous Profiling" },
             ].map((s) => (
               <div key={s.label} className="flex flex-col items-center gap-1">
                 <span className="text-2xl font-black text-[#18181B]">{s.val}</span>
                 <span className="text-xs text-[#52525B] uppercase tracking-wider font-semibold">{s.label}</span>
               </div>
             ))}
           </div>
         </div>
       </section>

      {/* Diagnostic summary */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Tables scanned", value: "124", accent: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "PII fields tagged", value: "38", accent: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Schema drift alerts", value: "6", accent: "text-amber-600", bg: "bg-amber-50" },
            { label: "SLA coverage", value: "94%", accent: "text-blue-600", bg: "bg-blue-50" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${stat.accent}`}>{stat.label}</span>
                <div className={`h-8 w-8 rounded-2xl ${stat.bg} border border-zinc-100`} />
              </div>
              <div className="text-3xl font-black text-zinc-950 tracking-tight">{stat.value}</div>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Last 24 hours</div>
            </div>
          ))}
        </div>
      </section>
 
       {/* Live Data Diagnostics Demo */}
       <section className="bg-[#F4F4F5] py-20 sm:py-28 border-y border-[#E4E4E8]">
         <div className="mx-auto max-w-7xl px-4 sm:px-6">
           <div className="mb-12 text-center max-w-3xl mx-auto" data-reveal data-reveal-dir="up">
             <h2 className="text-base font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">Live Data Diagnostics</h2>
             <h3 className="text-3xl font-extrabold tracking-tight text-[#18181B] sm:text-4xl mb-4">
               See How Models Interpret Your Data — Right Now
             </h3>
             <p className="text-lg text-[#52525B]">
               Side-by-side profiling across GPT-4o, Claude, and Gemini. Schema drift flagged. Readiness Score calculated instantly.
             </p>
           </div>
 
           {/* Dataset selector tabs */}
           <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "100ms" }} className="flex flex-wrap justify-center gap-3 mb-8">
            {datasetOptions.map((d) => (
               <button
                 key={d.name}
                 onClick={() => setSelectedDataset(d)}
                 className={`rounded-full px-6 py-2.5 text-sm font-black uppercase tracking-wider transition-all ${
                   selectedDataset.name === d.name
                     ? "bg-zinc-950 text-white shadow-xl"
                     : "bg-white border border-zinc-200 text-zinc-600 hover:bg-white hover:text-zinc-950"
                 }`}
               >
                 {d.name}
               </button>
             ))}
           </div>
 
           {/* Model comparison grid */}
           <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "180ms" }} className="grid md:grid-cols-3 gap-6 mb-8">
             {[
               {
                 model: "GPT-4o",
                 score: selectedDataset.gptScore,
                 excerpt:
                   selectedDataset.name === "Payments"
                     ? "\"Transaction table lacks a stable customer_id; join paths may be lossy.\""
                     : selectedDataset.name === "CRM"
                     ? "\"Churn labels are present but missing segment definitions; recommend segmentation keys.\""
                     : "\"Revenue metrics use mixed fiscal calendars; normalize date_dim to avoid leakage.\"",
                 flag: selectedDataset.name === "Payments" ? { text: "Primary key ambiguity — join risk", type: "critical" } : null,
               },
               {
                 model: "Claude",
                 score: selectedDataset.claudeScore,
                 excerpt:
                   selectedDataset.name === "Payments"
                     ? "\"Latest schema shows txn_id, customer_id, and status are consistently populated.\""
                     : selectedDataset.name === "CRM"
                     ? "\"Segments map cleanly to lifecycle stages; update description table for clarity.\""
                     : "\"Finance tables align to FY2025; mapping table clean for GL rollups.\"",
                 flag: null,
               },
               {
                 model: "Gemini",
                 score: selectedDataset.geminiScore,
                 excerpt:
                   selectedDataset.name === "Payments"
                     ? "\"Customer identifiers missing on 18% of rows; consider backfilling.\""
                     : selectedDataset.name === "CRM"
                     ? "\"Lifecycle table uses deprecated column names from Q2.\""
                     : "\"Revenue table includes duplicate invoice_ids; dedupe before modeling.\"",
                 flag:
                   selectedDataset.name === "Payments"
                     ? { text: "High missingness in key column", type: "critical" }
                     : selectedDataset.name === "CRM"
                     ? { text: "Deprecated columns detected", type: "warning" }
                     : { text: "Duplicate invoice IDs detected", type: "warning" },
               },
             ].map((col) => (
               <div key={col.model} className="rounded-[2rem] bg-white border border-zinc-100 shadow-xl overflow-hidden flex flex-col">
                 <div className="px-6 py-4 border-b border-zinc-100 bg-[#F9FAFB] flex items-center justify-between">
                   <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{col.model}</span>
                   <div className="flex items-center gap-2">
                     <span className={`text-sm font-black ${col.score >= 85 ? "text-emerald-600" : col.score >= 65 ? "text-amber-500" : "text-red-600"}`}>
                       {col.score}
                     </span>
                     <div className="w-10 h-1 bg-zinc-100 rounded-full overflow-hidden">
                       <div
                         className={`h-full rounded-full ${col.score >= 85 ? "bg-emerald-500" : col.score >= 65 ? "bg-amber-400" : "bg-red-500"}`}
                         style={{ width: `${col.score}%` }}
                       />
                     </div>
                   </div>
                 </div>
                 <div className="p-6 flex-1 flex flex-col gap-4">
                   <p className="text-sm text-zinc-700 leading-relaxed italic">{col.excerpt}</p>
                   {col.flag ? (
                     <div className={`mt-auto flex items-start gap-2 rounded-xl px-4 py-3 border text-xs font-bold ${col.flag.type === "critical" ? "bg-red-50 border-red-100 text-red-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
                       <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                       {col.flag.text}
                     </div>
                   ) : (
                     <div className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-600">
                       <Shield className="h-3.5 w-3.5" />
                       No quality risks detected
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>

          {/* Schema snapshot */}
          <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "220ms" }} className="mb-8">
            <div className="rounded-[2rem] bg-white border border-zinc-100 shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600">Schema Snapshot</h3>
                  <p className="text-xs text-zinc-500 font-medium mt-1">{selectedDataset.name} schema signals</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Auto-profiled</span>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-[#F9FAFB] border border-zinc-100 p-5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Primary key</div>
                  <div className="text-sm font-black text-zinc-950">{snapshot.primaryKey}</div>
                </div>
                <div className="rounded-2xl bg-[#F9FAFB] border border-zinc-100 p-5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Join keys</div>
                  <div className="text-sm font-black text-zinc-950">{snapshot.joinKeys.join(", ")}</div>
                </div>
                <div className="rounded-2xl bg-[#F9FAFB] border border-zinc-100 p-5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Quality checks</div>
                  <div className="text-sm font-black text-zinc-950">{snapshot.qualityChecks.join(", ")}</div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  {lastScanAt ? `Last run: ${new Date(lastScanAt).toLocaleString()}` : "No diagnostics run yet"}
                </div>
                <button
                  onClick={runDiagnostics}
                  disabled={isRunning}
                  className="flex items-center gap-2 rounded-2xl bg-zinc-950 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-black disabled:opacity-60"
                >
                  {isRunning ? "Running..." : "Run diagnostics"}
                </button>
              </div>
              {lastScanId && (
                <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  Scan ID: {lastScanId}
                </div>
              )}
              {scanError && (
                <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-red-500">
                  {scanError}
                </div>
              )}
            </div>
          </div>
 
          {/* Data source connectors */}
          <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "250ms" }} className="mb-8">
            <div className="rounded-[2rem] bg-white border border-zinc-100 shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600">Data Sources</h3>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Connect and profile your data estate</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Connectors</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {CONNECTORS.map((connector) => (
                  <div key={connector.name} className="rounded-2xl border border-zinc-100 bg-[#F9FAFB] p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                        <Database className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-zinc-950">{connector.name}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{connector.detail}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${connector.status === "Ready" ? "text-emerald-600" : "text-amber-500"}`}>
                      {connector.status}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/settings")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-black transition"
              >
                Configure Data Sources
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Modeling checklist */}
          <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "270ms" }} className="mb-8">
            <div className="rounded-[2rem] bg-white border border-zinc-100 shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600">Modeling Checklist</h3>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Pre-flight steps before training</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Governance</span>
              </div>
              <div className="grid gap-3">
                {[
                  "Primary keys validated and stable",
                  "Join paths documented and tested",
                  "PII fields tagged and masked",
                  "Missingness thresholds approved",
                  "Outlier strategy defined",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#F9FAFB] border border-zinc-100 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold text-zinc-700 uppercase tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

           {/* Data Readiness Score Panel */}
           <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "280ms" }}>
             <div className={`rounded-[2rem] border p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl ${SCORE_TIER_BG[selectedDataset.tier]}`}>
               <div className="flex items-center gap-8">
                 <div className="text-center">
                   <div className={`text-7xl font-black leading-none ${SCORE_TIER_COLORS[selectedDataset.tier]}`}>
                     {selectedDataset.readinessScore}
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-2">Data Readiness Score</div>
                 </div>
                 <div>
                   <div className={`text-lg font-black uppercase tracking-tight ${SCORE_TIER_COLORS[selectedDataset.tier]} mb-2`}>
                     {selectedDataset.tier === "critical" && "🔴 "}
                     {selectedDataset.tier === "moderate" && "⚠️ "}
                     {selectedDataset.tier === "excellent" && "✅ "}
                     {SCORE_TIER_LABEL[selectedDataset.tier]}
                   </div>
                   <p className="text-sm text-zinc-600 font-medium max-w-sm leading-relaxed">
                     {selectedDataset.tier === "critical" && "Material data quality risks detected. Fix schema issues before modeling."}
                     {selectedDataset.tier === "moderate" && "Minor inconsistencies detected. Continuous profiling recommended."}
                     {selectedDataset.tier === "excellent" && "Strong schema consistency. Data is ready for modeling and AI analysis."}
                   </p>
                 </div>
               </div>
               <div className="flex flex-col gap-3 items-end">
                 <button
                   onClick={() => router.push("/dashboard")}
                   className="flex items-center gap-2 rounded-2xl bg-zinc-950 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-xl"
                 >
                   Get Full Readiness Report
                   <ArrowRight className="h-4 w-4" />
                 </button>
                 <p className="text-[10px] text-zinc-400 font-medium">Enter your email for the full breakdown →</p>
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* The Four Layers */}
       <section className="bg-[#18181B] py-24 sm:py-32 border-y border-[#27272A] relative overflow-hidden">
         <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
 
         <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
           <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-base font-bold text-white uppercase tracking-[0.2em] mb-3">Data Readiness Infrastructure</h2>
             <h3 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
               The Vanta for AI Data Readiness
             </h3>
             <p className="text-lg text-zinc-300 leading-relaxed">
               StandexAI delivers the trust layer for data-driven AI. Standardized diagnostics, schema governance,
               and readiness certification for every dataset.
             </p>
           </div>
 
           <div className="grid sm:grid-cols-2 gap-6">
             {[
               {
                 layer: "PROFILE",
                 title: "Continuous Data Profiling",
                 desc: "Continuously profiles schema health, missingness, and statistical drift across every data source.",
                 icon: Eye,
                 color: "text-blue-400",
                 bg: "bg-blue-500/10",
               },
               {
                 layer: "SCORE",
                 title: "Readiness Scoring",
                 desc: "Produces a single 0–100 readiness metric across data quality, consistency, lineage, and model fitness.",
                 icon: TrendingUp,
                 color: "text-indigo-400",
                 bg: "bg-indigo-500/10",
               },
               {
                 layer: "REPAIR",
                 title: "Automated Fix Signals",
                 desc: "Publishes remediation guidance and data contracts so upstream teams can resolve issues quickly.",
                 icon: Shield,
                 color: "text-emerald-400",
                 bg: "bg-emerald-500/10",
               },
               {
                 layer: "CERTIFY",
                 title: "Readiness Certificates",
                 desc: "Issues dataset readiness certificates as verifiable credentials for audits and model governance.",
                 icon: Lock,
                 color: "text-violet-400",
                 bg: "bg-violet-500/10",
               },
             ].map((item, idx) => (
               <div
                 key={item.layer}
                 data-reveal
                 data-reveal-dir="up"
                 style={{ ["--delay" as string]: `${idx * 100}ms` }}
                 className="rounded-[2rem] bg-white p-8 shadow-2xl border border-zinc-100 transition-all group hover:scale-[1.02]"
               >
                 <div className="flex items-center gap-3 mb-4">
                   <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                     <item.icon className="h-5 w-5" />
                   </span>
                   <span className={`text-xs font-black uppercase tracking-[0.2em] ${item.color.replace("text-", "text-").replace("400", "600")}`}>{item.layer}</span>
                 </div>
                 <h4 className="text-xl font-black text-zinc-950 mb-3">{item.title}</h4>
                 <p className="text-sm text-zinc-600 leading-relaxed font-medium">{item.desc}</p>
               </div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Governance Urgency */}
       <section className="bg-white py-20">
         <div className="mx-auto max-w-7xl px-4 sm:px-6">
           <div data-reveal data-reveal-dir="up" className="rounded-[2.5rem] bg-[#F9FAFB] border border-zinc-100 p-10 md:p-16 text-center">
             <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm text-red-700 font-medium mb-6">
               <AlertTriangle className="h-4 w-4" />
               Governance Urgency
             </div>
             <h3 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl mb-6 max-w-3xl mx-auto">
               AI Regulations Now Require Traceable Data Lineage and Model Readiness Proof
             </h3>
             <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-10">
               As AI oversight tightens, data quality and lineage are now compliance requirements. StandexAI
               provides the governance layer between raw data and responsible AI decisions.
             </p>
             <div className="flex flex-wrap items-center justify-center gap-4">
               {["EU AI Act 2026", "FTC Data Integrity", "SEC Reporting Quality", "PII & Privacy Controls"].map((item) => (
                 <span key={item} className="text-[13px] font-bold tracking-widest text-zinc-600 uppercase px-5 py-2.5 rounded-xl bg-white border border-zinc-200 shadow-sm">
                   {item}
                 </span>
               ))}
             </div>
           </div>
         </div>
       </section>
 
       {/* Footer */}
       <footer className="bg-[#FAFAFA] border-t border-[#E4E4E8]">
         <div className="mx-auto max-w-7xl px-6 py-10">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-3">
               <Image
                 src="/standexailogo.png"
                 alt="StandexAI"
                 width={120}
                 height={36}
                 className="h-8 w-auto object-contain opacity-50 grayscale"
               />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">AI Data Modeling Studio</span>
             </div>
             <p className="text-sm font-medium text-zinc-500">
               &copy; 2026 StandexAI. AI Data Analysis Infrastructure. All rights reserved.
             </p>
           </div>
         </div>
       </footer>
 
       <style jsx global>{`
         [data-reveal] {
           --x: 0px;
           --y: 24px;
           --delay: 0ms;
           opacity: 0.01;
           transform: translate3d(var(--x), var(--y), 0) scale(0.985);
           filter: blur(4px);
           transition:
             opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
             transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
             filter 700ms cubic-bezier(0.16, 1, 0.3, 1);
           transition-delay: var(--delay);
           will-change: transform, opacity, filter;
         }
         [data-reveal][data-reveal-dir="left"] { --x: -32px; --y: 0px; }
         [data-reveal][data-reveal-dir="right"] { --x: 32px; --y: 0px; }
         [data-reveal][data-reveal-dir="up"] { --x: 0px; --y: 28px; }
         [data-reveal].is-visible {
           opacity: 1;
           transform: translate3d(0, 0, 0) scale(1);
           filter: blur(0);
         }
         @media (prefers-reduced-motion: reduce) {
           [data-reveal] {
             opacity: 1 !important;
             transform: none !important;
             filter: none !important;
             transition: none !important;
           }
         }
       `}</style>
     </div>
   );
 }

export default function DataDiagnosticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-[#18181B] font-sans flex items-center justify-center">
          <div className="rounded-2xl border border-zinc-100 bg-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Loading diagnostics
          </div>
        </div>
      }
    >
      <DataDiagnosticsContent />
    </Suspense>
  );
}
