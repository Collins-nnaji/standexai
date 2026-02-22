"use client";

import { useEffect, useState } from "react";
import {
  FileBarChart, Download, ShieldCheck, AlertOctagon, RefreshCw,
  TrendingUp, Activity, Globe, Clock, Award, Search, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StandexScoreScan = {
  scanId: string;
  brand: string;
  standexScore: number;
  tier: "excellent" | "moderate" | "high" | "critical";
  flagCount: number;
  cachedAt: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIER_STYLE = {
  excellent: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    icon: "✅",
    score: "text-emerald-600",
  },
  moderate: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    bar: "bg-amber-400",
    icon: "⚠️",
    score: "text-amber-500",
  },
  high: {
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    bar: "bg-orange-400",
    icon: "🟠",
    score: "text-orange-500",
  },
  critical: {
    badge: "bg-red-100 text-red-700 border-red-200",
    bar: "bg-red-500",
    icon: "🔴",
    score: "text-red-600",
  },
};

// Placeholder data shown until real scans exist
const PLACEHOLDER_SCANS: StandexScoreScan[] = [
  { scanId: "demo-001", brand: "Monzo", standexScore: 47, tier: "critical", flagCount: 5, cachedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { scanId: "demo-002", brand: "Revolut", standexScore: 87, tier: "moderate", flagCount: 1, cachedAt: new Date(Date.now() - 1000 * 60 * 34).toISOString() },
  { scanId: "demo-003", brand: "Stripe", standexScore: 94, tier: "excellent", flagCount: 0, cachedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
  { scanId: "demo-004", brand: "HSBC", standexScore: 61, tier: "high", flagCount: 3, cachedAt: new Date(Date.now() - 1000 * 60 * 82).toISOString() },
  { scanId: "demo-005", brand: "Wise", standexScore: 78, tier: "moderate", flagCount: 2, cachedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StandexScoreLedgerPage() {
  const router = useRouter();
  const [scans, setScans] = useState<StandexScoreScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  const fetchScans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/standex-score");
      const data = await res.json() as { scans?: StandexScoreScan[]; error?: string };
      if (res.ok && data.scans && data.scans.length > 0) {
        setScans(data.scans);
        setIsPlaceholder(false);
      } else {
        setScans(PLACEHOLDER_SCANS);
        setIsPlaceholder(true);
      }
    } catch {
      setScans(PLACEHOLDER_SCANS);
      setIsPlaceholder(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchScans(); }, []);

  const avgScore = scans.length > 0
    ? Math.round(scans.reduce((acc, s) => acc + s.standexScore, 0) / scans.length)
    : 0;

  const criticalCount = scans.filter((s) => s.tier === "critical" || s.tier === "high").length;
  const totalFlags = scans.reduce((acc, s) => acc + s.flagCount, 0);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">

      {/* Header */}
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-zinc-100 bg-white px-8 print:hidden">
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl shadow-zinc-950/20">
            <FileBarChart className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-zinc-950 uppercase tracking-tighter">Standex Score Ledger</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Brand Accuracy Certificate Registry</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchScans}
            className="p-3.5 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition text-zinc-400 hover:text-zinc-950"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => router.push("/brand-pulse")}
            className="flex items-center gap-2 rounded-[1.5rem] border border-zinc-200 bg-[#F9FAFB] px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-zinc-700 transition hover:bg-white hover:shadow-md"
          >
            <Search className="h-3.5 w-3.5" />
            New Scan
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-[1.5rem] bg-indigo-600 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-indigo-700 shadow-xl shadow-indigo-600/20"
          >
            <Download className="h-4 w-4" />
            Standex Score Certificate
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 lg:p-12 max-w-[1500px] mx-auto w-full print:p-0">

        {/* Stats pulse */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[
            { label: "Portfolio Standex Score", val: `${avgScore}`, icon: Award, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Brands Monitored", val: scans.length, icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Risk Alerts", val: criticalCount, icon: AlertOctagon, color: "text-red-600", bg: "bg-red-50" },
            { label: "Total Flags Detected", val: totalFlags, icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((m) => (
            <div key={m.label} className="rounded-[2.5rem] bg-[#F9FAFB] border border-zinc-100 p-7 shadow-sm hover:bg-white hover:shadow-xl transition group">
              <div className="flex items-center justify-between mb-7">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 group-hover:text-zinc-500 transition-colors">{m.label}</span>
                <div className={`p-2.5 rounded-2xl ${m.bg} ${m.color} group-hover:scale-110 transition-transform`}>
                  <m.icon className="h-4 w-4" />
                </div>
              </div>
              <span className="text-4xl font-black text-zinc-950 tracking-tighter block">{m.val}</span>
            </div>
          ))}
        </div>

        {/* Placeholder notice */}
        {isPlaceholder && !loading && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-indigo-50 border border-indigo-100 px-6 py-4 max-w-2xl">
            <TrendingUp className="h-4 w-4 text-indigo-500 shrink-0" />
            <p className="text-xs font-bold text-indigo-700">
              Showing demo data. Run your first brand scan to populate the ledger.{" "}
              <button onClick={() => router.push("/brand-pulse")} className="underline font-black">
                Scan a brand →
              </button>
            </p>
          </div>
        )}

        {/* Standex Score Registry */}
        <div className="mb-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <h2 className="text-2xl font-black text-zinc-950 uppercase tracking-tighter">Standex Score Registry</h2>
              </div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.4em]">Brand AI representation accuracy — live scores</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white border border-zinc-100 shadow-xl overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-zinc-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Brand</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Standex Score</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Risk Tier</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">Flags</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Last Scanned</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {scans.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center">
                        <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest italic">
                          No Standex Score scans in ledger. Run your first brand scan.
                        </p>
                      </td>
                    </tr>
                  ) : scans.map((scan) => {
                    const style = TIER_STYLE[scan.tier];
                    return (
                      <tr key={scan.scanId} className="hover:bg-zinc-50/50 transition-colors group">
                        {/* Brand */}
                        <td className="px-8 py-7">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm group-hover:scale-110 transition-transform">
                              {scan.brand[0].toUpperCase()}
                            </div>
                            <span className="text-base font-black text-zinc-950 uppercase tracking-tight">{scan.brand}</span>
                          </div>
                        </td>

                        {/* Standex Score */}
                        <td className="px-8 py-7">
                          <div className="flex flex-col gap-1.5">
                            <span className={`text-2xl font-black ${style.score}`}>{scan.standexScore}</span>
                            <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                              <div className={`h-full ${style.bar} transition-all duration-700`} style={{ width: `${scan.standexScore}%` }} />
                            </div>
                          </div>
                        </td>

                        {/* Tier */}
                        <td className="px-8 py-7">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${style.badge}`}>
                            {style.icon} {scan.tier.charAt(0).toUpperCase() + scan.tier.slice(1)} Risk
                          </span>
                        </td>

                        {/* Flag count */}
                        <td className="px-8 py-7 text-center">
                          {scan.flagCount > 0 ? (
                            <span className="text-sm font-black text-red-600">{scan.flagCount}</span>
                          ) : (
                            <ShieldCheck className="h-4 w-4 text-emerald-500 mx-auto" />
                          )}
                        </td>

                        {/* Timestamp */}
                        <td className="px-8 py-7 text-right">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-xs font-bold text-zinc-950 font-mono">{new Date(scan.cachedAt).toLocaleDateString()}</span>
                            <span className="text-[9px] font-black text-zinc-300 uppercase flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              {new Date(scan.cachedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-8 py-7 text-right">
                          <button
                            onClick={() => router.push(`/brand-pulse?brand=${encodeURIComponent(scan.brand)}`)}
                            className="flex items-center gap-1.5 ml-auto rounded-xl border border-zinc-100 bg-[#F9FAFB] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                          >
                            Rescan
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Standex Score Certificate info panel */}
        <div className="rounded-[2.5rem] bg-[#18181B] p-10 md:p-14 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-start gap-10 justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Standex Score Certification</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-4">Issue Standex Score Certificates</h3>
              <p className="text-base text-zinc-400 font-medium leading-relaxed max-w-lg">
                Standex Score Certificates are verifiable credentials — third-party proof that a brand&apos;s AI representation meets an accuracy standard. Usable in compliance filings, investor materials, and regulatory submissions.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                {["EU AI Act 2026", "FTC Compliance", "SEC Disclosure", "Brand IP"].map((tag) => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-700 transition shadow-2xl shadow-indigo-600/40"
              >
                <Download className="h-4 w-4" />
                Download Certificate
              </button>
              <button
                onClick={() => router.push("/brand-pulse")}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/10 px-8 py-5 text-sm font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:bg-white/15 transition"
              >
                <Search className="h-4 w-4" />
                Scan New Brand
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-200">
            StandexAI Standex Score Protocol v1.0 // AI Representation Management Infrastructure
          </p>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #D4D4D8; }
        `
      }} />
    </div>
  );
}
