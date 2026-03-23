"use client";

import { useState } from "react";
import {
  ShieldAlert, Sparkles, Loader2, AlertTriangle, CheckCircle2,
  Shield, ArrowRight, Copy, AlertCircle
} from "lucide-react";

type RiskResult = {
  riskLevel: string;
  overallScore: number;
  issues: Array<{
    category: string;
    text: string;
    severity: string;
    explanation: string;
    saferVersion: string;
  }>;
  summary: string;
  recommendations: string[];
};

const RISK_COLORS: Record<string, { bg: string; border: string; text: string; icon: string; label: string }> = {
  low: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "text-emerald-500", label: "Low Risk" },
  medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-500", label: "Medium Risk" },
  high: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "text-orange-500", label: "High Risk" },
  critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-500", label: "Critical Risk" },
};

const CATEGORY_LABELS: Record<string, string> = {
  harassment: "Harassment",
  discrimination: "Discrimination",
  threat: "Threat",
  legal: "Legal Risk",
  policy: "Policy Violation",
  privacy: "Privacy Concern",
};

export default function RiskCompliancePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: "risk" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Risk check failed");
      setResult(data.result as RiskResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Risk check failed");
    } finally {
      setLoading(false);
    }
  };

  const copySafer = (saferText: string, idx: number) => {
    navigator.clipboard.writeText(saferText);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const riskConfig = result ? (RISK_COLORS[result.riskLevel] || RISK_COLORS.low) : RISK_COLORS.low;

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-8 lg:py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-100">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Risk & Compliance Checker</h1>
              <p className="text-xs text-zinc-400">Detect harassment, threats, discrimination, and legal risks</p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); }}
            placeholder="Paste text to check for compliance risks...&#10;&#10;The checker will scan for harassment, threats, discrimination, legal risk, policy violations, and privacy concerns — then suggest safer alternatives."
            className="w-full min-h-[160px] px-5 py-4 text-[15px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none resize-none"
          />
          <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 bg-zinc-50/50">
            <span className="text-xs text-zinc-400">{text.trim() ? `${text.trim().split(/\s+/).length} words` : "No text entered"}</span>
            <button
              onClick={handleCheck}
              disabled={!text.trim() || loading}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-700 transition shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldAlert className="h-3.5 w-3.5" />}
              {loading ? "Checking..." : "Check Compliance"}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-4">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-red-400" />
            <p className="text-sm font-semibold text-zinc-600 animate-pulse">Scanning for compliance risks...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Risk Level Banner */}
            <div className={`rounded-2xl ${riskConfig.bg} border ${riskConfig.border} p-6 flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${result.riskLevel === "low" ? "bg-emerald-100" : result.riskLevel === "medium" ? "bg-amber-100" : "bg-red-100"}`}>
                  {result.riskLevel === "low" ? (
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  ) : result.riskLevel === "critical" ? (
                    <AlertTriangle className="h-7 w-7 text-red-600" />
                  ) : (
                    <AlertCircle className="h-7 w-7 text-amber-600" />
                  )}
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${riskConfig.text}`}>{riskConfig.label}</h2>
                  <p className="text-sm text-zinc-600 mt-0.5">{result.summary}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${riskConfig.text}`}>{result.overallScore}</div>
                <div className="text-[10px] font-semibold text-zinc-400 uppercase">Safety Score</div>
              </div>
            </div>

            {/* Issues */}
            {result.issues?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Issues Found ({result.issues.length})
                </h3>
                {result.issues.map((issue, i) => (
                  <div key={i} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-100">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${
                          issue.severity === "critical" ? "bg-red-100 text-red-700" :
                          issue.severity === "warning" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-xs font-semibold text-zinc-500">
                          {CATEGORY_LABELS[issue.category] || issue.category}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-800">&ldquo;{issue.text}&rdquo;</p>
                      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{issue.explanation}</p>
                    </div>
                    <div className="px-5 py-4 bg-emerald-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-emerald-600 uppercase flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Safer Alternative
                        </span>
                        <button
                          onClick={() => copySafer(issue.saferVersion, i)}
                          className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 hover:text-zinc-600"
                        >
                          {copied === i ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          {copied === i ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <p className="text-sm text-emerald-800 leading-relaxed">{issue.saferVersion}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.issues?.length === 0 && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                <p className="text-lg font-bold text-emerald-700">All Clear</p>
                <p className="text-sm text-emerald-600 mt-1">No compliance risks detected in this text.</p>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div className="rounded-2xl border border-zinc-100 bg-white p-6">
                <h3 className="text-sm font-semibold text-zinc-700 mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Recommendations
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-600 leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
