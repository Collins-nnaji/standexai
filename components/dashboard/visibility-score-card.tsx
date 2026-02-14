"use client";

import { TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisibilityScoreCardProps {
    score: number;
    trend: number;
    className?: string;
}

export function VisibilityScoreCard({ score, trend, className }: VisibilityScoreCardProps) {
    return (
        <div className={cn("relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-panel)] p-6 shadow-sm transition-all hover:shadow-md", className)}>
            <div className="absolute right-0 top-0 p-6 opacity-5">
                <Activity className="h-24 w-24 text-[var(--accent-primary)]" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-sm font-medium text-[var(--ink-500)]">Visibility Score</h3>
                    <p className="text-xs text-[var(--ink-300)] mt-1">Weighted average across AI engines</p>
                </div>

                <div className="mt-6 flex items-baseline gap-3">
                    <span className="text-5xl font-bold tracking-tight text-[var(--ink-900)] font-mono">{score}</span>
                    <span className="text-sm text-[var(--ink-500)] font-medium">/100</span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <div className={cn(
                        "flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
                        trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    )}>
                        <TrendingUp className="h-3 w-3" />
                        {trend > 0 ? "+" : ""}{trend}%
                    </div>
                    <span className="text-xs text-slate-500">vs last week</span>
                </div>

                {/* Progress Bar Background */}
                <div className="mt-6 h-1.5 w-full bg-[var(--line)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
