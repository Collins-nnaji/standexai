
"use client";

import { useState } from "react";
import { VisibilityScoreCard } from "@/components/dashboard/visibility-score-card";
import { ShareOfVoiceChart } from "@/components/dashboard/share-of-voice-chart";
import { ActionList } from "@/components/dashboard/action-list";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, AlertCircle, ArrowRight, ShieldCheck, Download, Filter, Loader2, PlayCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";

interface ScanResult {
    engine: string;
    status: "found" | "not_found" | "partial";
    snippet: string;
}

export default function DashboardPage() {
    const { showToast } = useToast();
    const [scanLoading, setScanLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState<'scanner' | 'competitor' | 'results' | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [scanResults, setScanResults] = useState<ScanResult[] | null>(null);

    // Mock Data
    const platforms = [
        { name: "ChatGPT", value: 65, color: "bg-emerald-500" },
        { name: "Perplexity", value: 45, color: "bg-cyan-500" },
        { name: "Claude", value: 30, color: "bg-amber-500" },
        { name: "Google SGE", value: 20, color: "bg-blue-500" },
    ];

    const actions = [
        { id: "1", title: "Missing 'Pricing' schema", description: "competitor A ranks for 'enterprise pricing'", priority: "high" as const, type: "gap" as const },
        { id: "2", title: "Update 'About' page", description: "Perplexity cites outdated employee count", priority: "medium" as const, type: "citation" as const },
        { id: "3", title: "Claim 'Wikipedia' mention", description: "New unlinked mention found", priority: "low" as const, type: "optimization" as const },
    ];

    const mentions = [
        {
            source: "Perplexity AI",
            context: "...when comparing enterprise security solutions, **StandexAI** is frequently cited for its robust compliance standards...",
            sentiment: "positive",
            time: "2h ago",
            topic: "Security"
        },
        {
            source: "ChatGPT (GPT-4o)",
            context: "I found 3 tools for GEO: 1. Ahrefs, 2. Semrush, 3. **StandexAI**.",
            sentiment: "neutral",
            time: "5h ago",
            topic: "GEO Tools"
        }
    ];

    const handleDeepScan = async () => {
        if (!searchQuery) {
            showToast("Please enter a query to scan.", "error");
            return;
        }

        setScanLoading(true);
        setModalOpen(null); // Close input modal
        showToast("Starting Deep Visibility Scan...", "info");

        // Simulate 3 second scan
        setTimeout(() => {
            setScanLoading(false);
            setScanResults([
                { engine: "ChatGPT (GPT-4o)", status: "found", snippet: "StandexAI is listed as a top solution for..." },
                { engine: "Perplexity", status: "found", snippet: "According to recent reviews, StandexAI offers..." },
                { engine: "Claude 3.5", status: "partial", snippet: "I don't have specific pricing for StandexAI..." },
                { engine: "Google SGE", status: "not_found", snippet: "The search results did not explicitly mention..." },
            ]);
            setModalOpen('results'); // Open results modal
            showToast("Scan Complete! View detailed results.", "success");
        }, 3000);
    };

    const runQuickScan = () => {
        setScanLoading(true);
        setTimeout(() => {
            setScanLoading(false);
            showToast("Quick Scan Completed. Visibility score updated.", "success");
        }, 2000);
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ink-900)] tracking-tight">Command Center</h1>
                    <p className="text-[var(--ink-500)] text-sm mt-1">Overview of your AI search performance.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--ink-500)]" />
                        <input
                            type="text"
                            placeholder="Quick Visibility Scan..."
                            className="w-full h-9 pl-9 pr-4 rounded-md border border-[var(--line)] bg-[var(--bg-card)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] placeholder:text-[var(--ink-300)]"
                        />
                    </div>
                    <Button
                        onClick={runQuickScan}
                        disabled={scanLoading}
                        className="h-9 bg-[var(--accent-primary)] text-black hover:bg-[var(--accent-primary)]/90 font-medium"
                    >
                        {scanLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Run Scan"}
                        {scanLoading ? "Scanning..." : null}
                    </Button>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                <VisibilityScoreCard score={72} trend={12} />
                <ShareOfVoiceChart data={platforms} className="lg:col-span-1" />
                <ActionList actions={actions} className="lg:col-span-1" />
            </div>

            {/* Consolidated Mentions Feed */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border border-[var(--line)] bg-[var(--bg-panel)] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-[var(--ink-900)] flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-[var(--ink-500)]" /> Recent AI Mentions
                        </h2>
                        <Button variant="ghost" size="sm" className="h-8 text-[var(--ink-500)] hover:text-[var(--ink-900)]">View All</Button>
                    </div>

                    <div className="space-y-4">
                        {mentions.map((mention, i) => (
                            <div key={i} className="bg-[var(--bg-card)] border border-[var(--line)] rounded-xl p-4 hover:border-[var(--accent-primary)]/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold",
                                            mention.source.includes("Perplexity") ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        )}>
                                            {mention.source}
                                        </span>
                                        <span className="text-xs text-[var(--ink-500)]">• {mention.time}</span>
                                    </div>
                                    {mention.sentiment === 'positive' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded dark:bg-emerald-900/20 dark:text-emerald-400">Positive</span>}
                                    {mention.sentiment === 'neutral' && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded dark:bg-amber-900/20 dark:text-amber-400">Neutral</span>}
                                </div>
                                <p className="text-sm text-[var(--ink-900)] leading-relaxed">
                                    &quot;{mention.context}&quot;
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links / Tools */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-panel)] p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-[var(--ink-900)] mb-4">Quick Tools</h3>
                        <div className="space-y-3">
                            <Button
                                onClick={() => setModalOpen('scanner')}
                                variant="outline"
                                className="w-full justify-start h-10 border-[var(--line)] hover:bg-[var(--bg-card)] text-[var(--ink-500)] hover:text-[var(--ink-900)]"
                            >
                                <Search className="mr-2 h-4 w-4" /> Deep Visibility Scan
                            </Button>
                            <Button
                                onClick={() => setModalOpen('competitor')}
                                variant="outline"
                                className="w-full justify-start h-10 border-[var(--line)] hover:bg-[var(--bg-card)] text-[var(--ink-500)] hover:text-[var(--ink-900)]"
                            >
                                <ShieldCheck className="mr-2 h-4 w-4" /> Competitor Analysis
                            </Button>
                            <Button asChild className="w-full justify-start h-10 bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)]/20 border-0">
                                <Link href="/studio">
                                    <ArrowRight className="mr-2 h-4 w-4" /> Go to Content Studio
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:bg-rose-900/10 dark:border-rose-900/30">
                        <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2 mb-2 dark:text-rose-400">
                            <AlertCircle className="h-4 w-4" /> Negative Drift
                        </h3>
                        <p className="text-xs text-rose-600 mb-3 dark:text-rose-300">
                            Competitor A is gaining traction in &quot;Enterprise Security&quot;.
                        </p>
                        <Button size="sm" variant="ghost" className="w-full text-rose-700 hover:text-rose-800 hover:bg-rose-100 h-8 text-xs p-0 justify-start px-2 dark:text-rose-400 dark:hover:bg-rose-900/30">
                            View Analysis
                        </Button>
                    </div>
                </div>
            </div>

            {/* SCANNER INPUT MODAL */}
            <Modal
                isOpen={modalOpen === 'scanner'}
                onClose={() => setModalOpen(null)}
                title="Deep Visibility Scanner"
                className="max-w-2xl"
            >
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-lg">
                        <div className="flex gap-3">
                            <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Run a Simulation</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                    Enter a prompt (e.g., "Best CRM for small business") to see how AI engines construct their answers and wether your brand is cited.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-500)]">Search Query / Prompt</label>
                        <textarea
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-32 p-3 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 placeholder:text-[var(--ink-300)] font-mono"
                            placeholder="e.g. Compare the best enterprise SEO platforms for 2024..."
                        />
                    </div>

                    {scanLoading && (
                        <div className="flex items-center gap-3 justify-center py-4 text-[var(--ink-500)]">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Analyzing AI SERPs across 4 engines...</span>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)] mt-4">
                        <Button variant="outline" onClick={() => setModalOpen(null)}>Cancel</Button>
                        <Button
                            onClick={handleDeepScan}
                            disabled={scanLoading || !searchQuery}
                            className="bg-[var(--accent-primary)] text-black hover:bg-[var(--accent-primary)]/90"
                        >
                            {scanLoading ? "Scanning..." : "Start Deep Scan"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* SCAN RESULTS MODAL */}
            <Modal
                isOpen={modalOpen === 'results'}
                onClose={() => setModalOpen(null)}
                title="Scan Results"
                className="max-w-3xl"
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--line)]">
                        <div>
                            <div className="text-xs text-[var(--ink-500)] uppercase tracking-wider">Query</div>
                            <div className="text-sm font-bold text-[var(--ink-900)] mt-1">{searchQuery}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-[var(--ink-500)] uppercase tracking-wider">Visibility Score</div>
                            <div className="text-xl font-mono font-bold text-[var(--accent-primary)]">68/100</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[var(--ink-900)]">Engine Breakdown</h4>
                        {scanResults?.map((result, i) => (
                            <div key={i} className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-card)]">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-bold text-sm text-[var(--ink-900)]">{result.engine}</div>
                                    <span className={cn(
                                        "px-2 py-0.5 text-xs font-bold rounded uppercase",
                                        result.status === 'found' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                            result.status === 'partial' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                                "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                    )}>
                                        {result.status === 'not_found' ? 'Not Found' : result.status}
                                    </span>
                                </div>
                                <div className="text-sm text-[var(--ink-500)] italic border-l-2 border-[var(--line)] pl-3">
                                    "{result.snippet}"
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-[var(--line)]">
                        <Button variant="outline" onClick={() => setModalOpen(null)}>Close</Button>
                        <Button className="bg-[var(--accent-secondary)] text-white hover:bg-[var(--accent-secondary)]/90">
                            <Download className="mr-2 h-4 w-4" /> Export Report
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* COMPETITOR ANALYIS MODAL (Placeholder for now) */}
            <Modal
                isOpen={modalOpen === 'competitor'}
                onClose={() => setModalOpen(null)}
                title="Competitor Analysis"
                className="max-w-2xl"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-500)]">Competitor URL</label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 h-10 px-3 rounded-md border border-[var(--line)] bg-[var(--bg-card)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                placeholder="https://competitor.com"
                            />
                            <Button variant="secondary">Analyze</Button>
                        </div>
                    </div>

                    <div className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--line)] mt-4">
                        <h4 className="font-bold text-[var(--ink-900)] mb-2">Competitor A (Cached)</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-[var(--ink-500)]">Share of Voice</span>
                                <div className="font-mono font-bold text-[var(--ink-900)]">45%</div>
                            </div>
                            <div>
                                <span className="text-[var(--ink-500)]">Sentiment</span>
                                <div className="font-mono font-bold text-emerald-500">Positive (88%)</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button variant="outline" onClick={() => setModalOpen(null)}>Close</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

