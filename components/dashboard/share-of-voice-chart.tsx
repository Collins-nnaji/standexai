"use client";

import { cn } from "@/lib/utils";

interface PlatformData {
    name: string;
    value: number;
    color: string;
    logo?: string; // Could be a path to an image or an icon component
}

interface ShareOfVoiceChartProps {
    data: PlatformData[];
    className?: string;
}

export function ShareOfVoiceChart({ data, className }: ShareOfVoiceChartProps) {
    // Sort data by value descending for reliable sizing
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const maxValue = sortedData[0]?.value || 100;

    return (
        <div className={cn("rounded-2xl border border-[var(--line)] bg-[var(--bg-panel)] p-6 shadow-sm", className)}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-medium text-[var(--ink-500)]">Share of Voice</h3>
                    <p className="text-xs text-[var(--ink-300)] mt-1">Relative visibility against competitors</p>
                </div>
            </div>

            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.name} className="group">
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium text-[var(--ink-300)] group-hover:text-[var(--ink-900)] transition-colors">{item.name}</span>
                            <span className="font-mono text-[var(--ink-500)] group-hover:text-[var(--ink-900)] transition-colors">{item.value}%</span>
                        </div>
                        <div className="relative h-2.5 w-full bg-[var(--line)] rounded-full overflow-hidden">
                            <div
                                className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-1000", item.color)}
                                style={{ width: `${item.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
