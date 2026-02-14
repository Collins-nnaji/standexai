"use client";

import { useState } from "react";
import { AppHeader } from "@/components/navigation/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ScanSearch,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Eraser,
  Maximize2,
  FileJson,
  Sparkles,
  RefreshCw,
  FileText,
  Code2
} from "lucide-react";

export default function StandardizerPage() {
  const [activeTab, setActiveTab] = useState("nugget"); // nugget | llms | schema
  const [content, setContent] = useState(
    "Our company is a leading provider of innovative solutions in the data security space. We help customers achieve their goals through our cutting-edge technology foundation that leverages AI to protect assets."
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; nuggets: string[]; schema: string } | null>(null);

  const analyzeContent = () => {
    setAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setResult({
        score: 42,
        nuggets: [
          "StandexAI provides enterprise data security solutions.",
          "Our platform uses AI for asset protection.",
        ],
        schema: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "StandexAI",
  "description": "Enterprise data security platform using AI for asset protection."
}`
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--ink-900)] font-sans">
      <AppHeader
        title="Optimization Lab"
        subtitle="Configure your content for Machine Readability."
        rightSlot={
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span className="text-xs font-medium text-slate-300">Model: GPT-4o_SIM</span>
          </div>
        }
      />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 grid lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">

        {/* LEFT COLUMN: EDITOR */}
        <section className="flex flex-col gap-4">
          <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-t-2xl p-4 flex items-center justify-between border-b-0">
            <div className="flex items-center gap-2">
              <div className="bg-[var(--accent-primary)]/10 p-1.5 rounded-lg">
                <ScanSearch className="h-4 w-4 text-[var(--accent-primary)]" />
              </div>
              <h2 className="text-sm font-semibold text-slate-200">Input Source</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                <Eraser className="h-3.5 w-3.5 mr-1.5" /> Clear
              </Button>
            </div>
          </div>

          <div className="flex-1 relative group">
            <textarea
              className="w-full h-full bg-[var(--bg-card)] border border-[var(--line)] rounded-b-2xl p-6 text-slate-200 font-mono text-sm leading-relaxed focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all resize-none shadow-inner"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your 'About Us' page content or product description here..."
            />
            <div className="absolute bottom-6 right-6">
              <Button
                onClick={analyzeContent}
                disabled={analyzing}
                className="rounded-full bg-white text-black hover:bg-slate-200 font-bold shadow-lg shadow-white/10 px-6 h-12 text-sm transition-all hover:scale-105 active:scale-95"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    Run Nugget Scan <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: ANALYSIS OUTPUT */}
        <section className="flex flex-col gap-6">
          {/* TABS FOR TOOLS */}
          <div className="flex gap-1 p-1 bg-[var(--bg-panel)] rounded-xl border border-[var(--line)]">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveTab("nugget")}
              className={`flex-1 h-9 text-xs ${activeTab === 'nugget' ? 'bg-[var(--bg-card)] text-white shadow-sm border border-[var(--line)]' : 'text-slate-400 hover:text-white'}`}
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Nuggetizer
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveTab("llms")}
              className={`flex-1 h-9 text-xs ${activeTab === 'llms' ? 'bg-[var(--bg-card)] text-white shadow-sm border border-[var(--line)]' : 'text-slate-400 hover:text-white'}`}
            >
              <FileText className="mr-2 h-3.5 w-3.5" /> llms.txt Builder
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveTab("schema")}
              className={`flex-1 h-9 text-xs ${activeTab === 'schema' ? 'bg-[var(--bg-card)] text-white shadow-sm border border-[var(--line)]' : 'text-slate-400 hover:text-white'}`}
            >
              <Code2 className="mr-2 h-3.5 w-3.5" /> Schema Injector
            </Button>
          </div>

          {/* Initial State */}
          {!result && !analyzing && (
            <div className="flex-1 border-2 border-dashed border-[var(--line)] rounded-2xl bg-[var(--bg-panel)]/50 flex flex-col items-center justify-center text-slate-500 p-12 text-center">
              <div className="h-20 w-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                <ScanSearch className="h-10 w-10 opacity-40" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">Ready to Standardize</h3>
              <p className="max-w-xs text-sm leading-relaxed">Paste content to detect "fluff" and automatically generate Entity Schema.</p>
            </div>
          )}

          {/* Scanning State */}
          {analyzing && (
            <div className="flex-1 bg-[var(--bg-card)] border border-[var(--line)] rounded-2xl flex items-center justify-center shadow-lg">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="h-16 w-16 border-4 border-slate-700 rounded-full"></div>
                  <div className="absolute top-0 left-0 h-16 w-16 border-4 border-[var(--accent-primary)] border-r-transparent rounded-full animate-spin"></div>
                </div>
                <p className="font-medium text-sm text-[var(--accent-primary)] animate-pulse">Calculating Nugget Density...</p>
              </div>
            </div>
          )}

          {/* Results State */}
          {result && (
            <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* NUGGETIZER VIEW */}
              {activeTab === 'nugget' && (
                <>
                  {/* Score Card */}
                  <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 flex items-center justify-between shadow-lg">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fact Density Score</h3>
                      <div className="text-4xl font-bold text-amber-400">{result.score}<span className="text-xl text-slate-600">/100</span></div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full text-xs font-bold">
                        Low Density
                      </span>
                    </div>
                  </div>

                  {/* Nugget Suggestions */}
                  <div className="bg-[var(--bg-panel)] border border-[var(--accent-primary)]/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] flex-1 flex flex-col">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--accent-primary)] text-white text-[10px] font-bold rounded-bl-xl">
                      SUGGESTED REWRITE
                    </div>
                    <h3 className="text-sm font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Optimized Nuggets
                    </h3>
                    <ul className="space-y-3 mb-6 flex-1 overflow-y-auto custom-scrollbar">
                      {result.nuggets.map((nugget, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-200">
                          <CheckCircle2 className="h-5 w-5 text-[var(--accent-primary)] shrink-0" />
                          {nugget}
                        </li>
                      ))}
                    </ul>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <Button variant="outline" className="text-xs border-[var(--line)] hover:bg-[var(--bg-card)] text-slate-300">
                        Copy Nuggets
                      </Button>
                      <Button className="text-xs bg-[var(--accent-primary)] text-black font-bold hover:bg-[var(--accent-primary)]/90">
                        Inject to CMS
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* SCHEMA VIEW */}
              {activeTab === 'schema' && (
                <div className="flex-1 bg-[var(--bg-card)] border border-[var(--line)] rounded-2xl p-4 font-mono text-xs overflow-hidden flex flex-col shadow-sm">
                  <div className="flex justify-between items-center mb-3 px-2">
                    <span className="flex items-center gap-2 text-slate-400 font-sans font-medium"><FileJson className="h-3.5 w-3.5" /> JSON-LD Preview</span>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-6 text-[10px] bg-[var(--accent-secondary)] text-black hover:bg-[var(--accent-secondary)]/90">Inject to Head</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] hover:text-white hover:bg-white/10 rounded">Copy Code</Button>
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-xl p-4 overflow-auto custom-scrollbar border border-slate-800 flex-1">
                    <pre className="text-slate-300">
                      {result.schema}
                    </pre>
                  </div>
                </div>
              )}

              {/* LLMS.TXT VIEW */}
              {activeTab === 'llms' && (
                <div className="flex-1 bg-[var(--bg-card)] border border-[var(--line)] rounded-2xl p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-200">llms.txt Configuration</h3>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">Valid Syntax</Badge>
                  </div>
                  <div className="flex-1 bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 border border-slate-800 overflow-auto custom-scrollbar whitespace-pre-wrap">
                    {`# StandexAI - Generative Engine Optimization (GEO) Protocol

# Organization Entity
Organization: StandexAI
Description: The first Generative Engine Optimization (GEO) platform. StandexAI helps brands optimize their content for Large Language Models (LLMs) through Answer Nuggetization, Entity Clarity, and Citation Tracking.
URL: https://standex.ai

# Products
- Product: Visibility Dashboard
  Description: Real-time monitoring of brand citations across ChatGPT, Perplexity, and Gemini.
- Product: Content Standardizer
  Description: Editor tool that restructures content into high-density nuggets.

# Pricing 
- Free Tier: Limited to 1 domain scan.
- Pro Plan: $49/mo for full monitoring.`}
                  </div>
                  <Button className="mt-4 w-full bg-[var(--accent-primary)] text-black font-bold hover:bg-[var(--accent-primary)]/90">
                    Deploy to /public/llms.txt
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
