"use client";

import { AlertCircle, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionItem {
    id: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    type: "gap" | "optimization" | "citation";
}

interface ActionListProps {
    actions: ActionItem[];
    className?: string;
}

export function ActionList({ actions, className }: ActionListProps) {
    return (
        <div className={cn("rounded-2xl border border-[var(--line)] bg-[var(--bg-panel)] p-6 shadow-sm", className)}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-medium text-[var(--ink-500)]">Recommended Actions</h3>
                    <p className="text-xs text-[var(--ink-300)] mt-1">Prioritized optimization tasks</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-slate-500 h-8">View All</Button>
            </div>

            <div className="space-y-3">
                {actions.map((action) => (
                    <div
                        key={action.id}
                        className="group flex gap-3 p-3 rounded-xl border border-[var(--line)] bg-[var(--bg-card)] hover:border-[var(--accent-primary)]/30 hover:bg-[var(--line)]/50 transition-all cursor-pointer"
                    >
                        <div className={cn(
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                            action.priority === "high" ? "border-rose-500/20 bg-rose-500/10 text-rose-500" :
                                action.priority === "medium" ? "border-amber-500/20 bg-amber-500/10 text-amber-500" :
                                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                        )}>
                            {action.type === 'gap' ? <AlertCircle className="h-4 w-4" /> :
                                action.type === 'citation' ? <TrendingUp className="h-4 w-4" /> :
                                    <CheckCircle2 className="h-4 w-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-[var(--ink-900)] group-hover:text-[var(--accent-primary)] truncate pr-2">{action.title}</h4>
                                {action.priority === 'high' && (
                                    <span className="inline-flex items-center rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-medium text-rose-500">
                                        High Priority
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-1">{action.description}</p>
                        </div>

                        <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -mr-1">
                            <ArrowRight className="h-4 w-4 text-[var(--accent-primary)]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
