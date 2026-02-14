"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Sparkles, Wand2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BriefsPage() {
    const [topic, setTopic] = useState("");
    const [generating, setGenerating] = useState(false);
    const [brief, setBrief] = useState<any>(null);

    const handleGenerate = () => {
        if (!topic) return;
        setGenerating(true);

        // Simulate generation
        setTimeout(() => {
            setGenerating(false);
            setBrief({
                title: topic,
                intent: "Informational / Commercial",
                target_audience: "CTOs & IT Managers",
                entities: ["Data Privacy", "GDPR", "SOC2", "Encryption"],
                suggested_structure: [
                    "H1: The Ultimate Guide to [Topic]",
                    "H2: What is [Topic]?",
                    "Answer Block: concise definition (40-60 words)",
                    "H2: Key Benefits for Enterprise",
                    "H3: Security Compliance",
                    "H2: Comparison Table"
                ]
            });
        }, 2500);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/studio"><ArrowLeft className="h-5 w-5" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create Content Brief</h1>
                    <p className="text-slate-400 text-sm">Define your target keyword and let AI structure the perfect outline.</p>
                </div>
            </div>

            {!brief ? (
                <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Target Topic / Keyword</label>
                        <input
                            type="text"
                            placeholder="e.g. specialized ai hardware"
                            className="w-full h-12 px-4 bg-[var(--bg-app)] border border-[var(--line)] rounded-xl text-white focus:outline-none focus:border-[var(--accent-secondary)] transition-all"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full h-12 bg-[var(--accent-secondary)] text-white hover:bg-[var(--accent-secondary)]/90 font-bold"
                        onClick={handleGenerate}
                        disabled={generating || !topic}
                    >
                        {generating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Wand2 className="h-5 w-5 mr-2" />}
                        {generating ? "Analyzing SERPs & Generating..." : "Generate Smart Brief"}
                    </Button>
                </div>
            ) : (
                <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-start border-b border-[var(--line)] pb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white capitalize">{brief.title}</h2>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400 font-mono">Intent: {brief.intent}</span>
                                <span className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400 font-mono">Target: {brief.target_audience}</span>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => setBrief(null)}>New Brief</Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-[var(--accent-secondary)] uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> Must-Include Entities
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {brief.entities.map((e: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] rounded-full text-sm font-medium">
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Suggested Structure</h3>
                            <div className="space-y-2 bg-[var(--bg-app)] p-4 rounded-xl border border-[var(--line)]">
                                {brief.suggested_structure.map((item: string, i: number) => (
                                    <div key={i} className="flex gap-3 text-sm text-slate-300">
                                        <span className="text-slate-600 font-mono text-xs">{i + 1}.</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button asChild className="bg-emerald-500 text-white hover:bg-emerald-600">
                            <Link href="/studio/editor">Open in Editor <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
