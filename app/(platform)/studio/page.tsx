"use client";

import { Button } from "@/components/ui/button";
import { FileText, Sparkles, ArrowRight, PenTool } from "lucide-react";
import Link from "next/link";

export default function StudioPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">GEO Content Studio</h1>
                <p className="text-slate-400 text-sm mt-1">Create content that AI answer engines love to cite.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Brief Generator */}
                <div className="relative group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-panel)] p-8 transition-all hover:border-[var(--accent-secondary)]">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileText className="h-32 w-32 text-[var(--accent-secondary)]" />
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="h-12 w-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center text-[var(--accent-secondary)]">
                            <Sparkles className="h-6 w-6" />
                        </div>

                        <h2 className="text-xl font-bold text-white">Smart Briefs</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Generate intent-based content briefs. We analyze top-ranking AI answers and tell you exactly which entities and facts to include.
                        </p>

                        <div className="pt-4">
                            <Button asChild className="bg-[var(--accent-secondary)] text-white hover:bg-[var(--accent-secondary)]/90">
                                <Link href="/studio/briefs">
                                    Create Brief <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* AI Editor */}
                <div className="relative group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-panel)] p-8 transition-all hover:border-emerald-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <PenTool className="h-32 w-32 text-emerald-500" />
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <PenTool className="h-6 w-6" />
                        </div>

                        <h2 className="text-xl font-bold text-white">AI-Native Editor</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Write with real-time feedback. Our editor suggests &quot;Answer Blocks&quot;, FAQ schema, and entity density improvements as you type.
                        </p>

                        <div className="pt-4">
                            <Button asChild variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10">
                                <Link href="/studio/editor">
                                    Open Editor <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
