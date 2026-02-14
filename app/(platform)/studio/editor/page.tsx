"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Check, RefreshCw, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EditorPage() {
    const [content, setContent] = useState("");

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/studio"><ArrowLeft className="h-5 w-5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-white">Untitled Draft</h1>
                        <p className="text-xs text-slate-500">Last saved: Just now</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-3.5 w-3.5" /> AI Rewrite
                    </Button>
                    <Button className="bg-[var(--accent-primary)] text-black font-bold h-9">
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                </div>
            </div>

            {/* Editor Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Main Editor Area */}
                <div className="lg:col-span-2 bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl overflow-hidden flex flex-col">
                    <div className="border-b border-[var(--line)] p-2 bg-slate-900/50 flex gap-1">
                        <div className="h-3 w-3 rounded-full bg-red-500/20 ml-2"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
                    </div>
                    <textarea
                        className="flex-1 w-full bg-transparent p-6 text-slate-200 resize-none focus:outline-none font-mono leading-relaxed"
                        placeholder="Start writing or paste content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* AI Sidebar */}
                <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-1">
                    {/* Optimization Score */}
                    <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-300">GEO Score</h3>
                            <span className="text-2xl font-bold text-emerald-400">64</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full w-[64%] bg-emerald-500"></div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Brain className="h-4 w-4" /> Optimizations
                        </h3>

                        <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                                <div className="mt-0.5 h-4 w-4 rounded-full border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <Check className="h-2.5 w-2.5" />
                                </div>
                                <p className="text-sm text-slate-300">Answer Block detected</p>
                            </div>

                            <div className="flex gap-3 items-start opacity-50">
                                <div className="mt-0.5 h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center"></div>
                                <p className="text-sm text-slate-500">High Fact Density (&gt;2.5)</p>
                            </div>

                            <div className="flex gap-3 items-start opacity-50">
                                <div className="mt-0.5 h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center"></div>
                                <p className="text-sm text-slate-500">Schema Markup added</p>
                            </div>
                        </div>

                        <Button className="w-full mt-6 bg-[var(--bg-app)] border border-[var(--line)] hover:bg-white/5 text-slate-300 text-xs">
                            Fix All Issues
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
