"use client";

import { useState } from "react";
import { AppHeader } from "@/components/navigation/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Database,
    Save,
    Lock,
    History,
    AlertTriangle,
    RotateCcw,
    CheckCircle2
} from "lucide-react";

export default function VaultPage() {
    const [data, setData] = useState({
        name: "StandexAI",
        mission: "StandexAI helps brands optimize their content for Generative AI engines.",
        pricing: "Free tier available. Pro plan starts at $49/mo.",
        products: "Visibility Dashboard, Content Standardizer, Citation Hunter",
        contact: "support@standex.ai"
    });

    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState("Just now");

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setLastSaved("Just now");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-app)] text-[var(--ink-900)] font-sans">
            <AppHeader
                title="Fact Vault"
                subtitle="The immutable source of truth for your brand's AI identity."
                rightSlot={
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                        <Lock className="h-3 w-3 text-[var(--accent-secondary)]" />
                        <span className="text-xs font-medium text-slate-300">Encrypted</span>
                    </div>
                }
            />

            <main className="mx-auto w-full max-w-5xl px-6 py-8 grid lg:grid-cols-3 gap-8">

                {/* MAIN EDIT AREA */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Database className="h-5 w-5 text-[var(--accent-secondary)]" /> Core Entities
                            </h2>
                            <span className="text-xs text-slate-500">Last synced: {lastSaved}</span>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Brand Name</label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className="bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-secondary)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Mission Statement</label>
                                <Textarea
                                    value={data.mission}
                                    onChange={(e) => setData({ ...data, mission: e.target.value })}
                                    className="bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-secondary)] min-h-[100px]"
                                />
                                <p className="text-xs text-slate-500">This description is injected into Schema and `llms.txt`.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Official Pricing</label>
                                    <Input
                                        value={data.pricing}
                                        onChange={(e) => setData({ ...data, pricing: e.target.value })}
                                        className="bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-secondary)]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Contact Email</label>
                                    <Input
                                        value={data.contact}
                                        onChange={(e) => setData({ ...data, contact: e.target.value })}
                                        className="bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-secondary)]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Key Products</label>
                                <Input
                                    value={data.products}
                                    onChange={(e) => setData({ ...data, products: e.target.value })}
                                    className="bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-secondary)]"
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[var(--line)] flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[var(--accent-secondary)] text-black hover:bg-[var(--accent-secondary)]/90 font-bold px-6"
                            >
                                {saving ? "Syncing..." : "Update Vault"}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* SIDEBAR: STATUS & LOGS */}
                <aside className="space-y-6">
                    <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <History className="h-4 w-4 text-[var(--accent-primary)]" /> Conflict Log
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                                    <AlertTriangle className="h-3 w-3" /> Pricing Mismatch
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Start date: <span className="text-white">Feb 14, 2026</span><br />
                                    Gemini quotes "$29/mo", Vault says "$49/mo".
                                </p>
                                <Button size="sm" variant="outline" className="h-6 text-[10px] w-full border-rose-500/30 text-rose-400 hover:bg-rose-500/10">
                                    Auto-Correct via Kill-Switch
                                </Button>
                            </div>

                            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                    <CheckCircle2 className="h-3 w-3" /> Mission Synced
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    ChatGPT (GPT-4o) successfully retrieved updated mission statement 2h ago.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--line)] rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-slate-200 mb-4">Vault API Access</h3>
                        <p className="text-xs text-slate-500 mb-4">
                            Use these endpoints to programmatically update your Ground Truths from your CMS.
                        </p>
                        <div className="bg-slate-950 p-3 rounded-lg border border-[var(--line)] font-mono text-[10px] text-slate-400 overflow-x-auto">
                            POST /api/vault/update<br />
                            Authorization: Bearer sk_live...
                        </div>
                    </div>
                </aside>

            </main>
        </div>
    );
}
