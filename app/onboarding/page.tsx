"use client";

import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/navigation/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Globe,
    Database,
    Users,
    CheckCircle2,
    ArrowRight,
    Loader2,
    AlertTriangle,
    ShieldCheck,
    Search,
    X
} from "lucide-react";

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [domain, setDomain] = useState("");

    // Step 2 State
    const [facts, setFacts] = useState({
        mission: "StandexAI helps brands optimize their content for Generative AI engines.",
        pricing: "Free tier available. Pro plan starts at $49/mo.",
        products: "Visibility Dashboard, Content Standardizer, Citation Hunter"
    });

    // Step 3 State
    const [competitors, setCompetitors] = useState<string[]>([]);
    const [newCompetitor, setNewCompetitor] = useState("");

    const handleDomainScan = () => {
        if (!domain) return;
        setLoading(true);
        // Simulate scan
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 2000);
    };

    const handleFactSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1000);
    };

    const addCompetitor = () => {
        if (newCompetitor && !competitors.includes(newCompetitor)) {
            setCompetitors([...competitors, newCompetitor]);
            setNewCompetitor("");
        }
    };

    const removeCompetitor = (comp: string) => {
        setCompetitors(competitors.filter(c => c !== comp));
    };

    return (
        <div className="min-h-screen bg-[var(--bg-app)] text-[var(--ink-900)] font-sans">
            <div className="fixed top-0 left-0 w-full h-1 bg-[var(--bg-panel)] z-50">
                <div
                    className="h-full bg-[var(--accent-primary)] transition-all duration-500 ease-in-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            <nav className="p-6 flex justify-between items-center relative z-50">
                <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
                    <span className="text-[var(--accent-primary)] font-mono">&gt;</span>
                    STANDEX<span className="text-[var(--ink-500)]">AI</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-sm font-mono text-slate-500 hidden sm:block">
                        SETUP_PHASE: {step}/3
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-white hover:bg-white/10 gap-2">
                        <Link href="/">
                            <span className="text-xs uppercase tracking-wider font-semibold">Exit</span>
                            <X className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </nav>

            <main className="mx-auto w-full max-w-2xl px-6 py-12">

                {/* STEP 1: DOMAIN SYNC */}
                {step === 1 && (
                    <div className="space-y-8 fade-in">
                        <div className="text-center space-y-4">
                            <div className="h-16 w-16 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe className="h-8 w-8 text-[var(--accent-primary)]" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Connect Your Digital Footprint</h1>
                            <p className="text-slate-400 max-w-md mx-auto">
                                We'll scan your domain for <span className="text-slate-200 font-mono text-xs bg-slate-800 px-1 py-0.5 rounded">SEO</span> fundamentals and <span className="text-slate-200 font-mono text-xs bg-slate-800 px-1 py-0.5 rounded">llms.txt</span> readiness.
                            </p>
                        </div>

                        <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-8 space-y-6 shadow-xl">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Website URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                    <Input
                                        placeholder="example.com"
                                        className="pl-10 h-12 bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-primary)]"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleDomainScan}
                                disabled={loading || !domain}
                                className="w-full h-12 bg-white text-black hover:bg-slate-200 font-bold text-lg rounded-lg shadow-lg shadow-white/5"
                            >
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning Protocols...</> : "Sync Domain"}
                            </Button>
                        </div>

                        <div className="flex gap-4 p-4 border border-[var(--line)] rounded-xl bg-[var(--bg-card)] text-sm text-slate-400">
                            <ShieldCheck className="h-5 w-5 text-[var(--accent-secondary)] shrink-0" />
                            <p>StandexAI only reads public metadata. We do not access your private databases or analytics.</p>
                        </div>
                    </div>
                )}

                {/* STEP 2: FACT VAULT */}
                {step === 2 && (
                    <div className="space-y-8 fade-in">
                        <div className="text-center space-y-4">
                            <div className="h-16 w-16 bg-[var(--accent-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Database className="h-8 w-8 text-[var(--accent-secondary)]" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Establish Ground Truths</h1>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                This is your <strong>Fact Vault</strong>. StandexAI uses this as the "Golden Standard" to detect hallucinations when AI models quote you incorrectly.
                            </p>
                        </div>

                        <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-8 space-y-6 shadow-xl">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Core Mission / About</label>
                                <Textarea
                                    className="bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-secondary)] min-h-[80px]"
                                    value={facts.mission}
                                    onChange={(e) => setFacts({ ...facts, mission: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Official Pricing</label>
                                <Input
                                    className="bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-secondary)]"
                                    value={facts.pricing}
                                    onChange={(e) => setFacts({ ...facts, pricing: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Key Products</label>
                                <Input
                                    className="bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-secondary)] text-sm"
                                    value={facts.products}
                                    onChange={(e) => setFacts({ ...facts, products: e.target.value })}
                                />
                            </div>

                            <Button
                                onClick={handleFactSave}
                                disabled={loading}
                                className="w-full h-12 bg-[var(--accent-secondary)] text-black hover:bg-[var(--accent-secondary)]/90 font-bold text-lg rounded-lg shadow-lg shadow-[var(--accent-secondary)]/10"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Encrypt to Vault"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: COMPETITORS */}
                {step === 3 && (
                    <div className="space-y-8 fade-in">
                        <div className="text-center space-y-4">
                            <div className="h-16 w-16 bg-[var(--accent-warn)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="h-8 w-8 text-[var(--accent-warn)]" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Track Share of Voice</h1>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Who are search engines and AI models comparing you to? Add up to 3 competitors to monitor their visibility versus yours.
                            </p>
                        </div>

                        <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-8 space-y-6 shadow-xl">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Competitor Name (e.g. Acme Corp)"
                                    className="bg-[var(--bg-card)] border-[var(--line)] text-white focus:border-[var(--accent-warn)]"
                                    value={newCompetitor}
                                    onChange={(e) => setNewCompetitor(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
                                />
                                <Button onClick={addCompetitor} variant="outline" className="border-[var(--line)] text-slate-300 hover:text-white">Add</Button>
                            </div>

                            <div className="space-y-3">
                                {competitors.length === 0 && (
                                    <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-[var(--line)] rounded-xl">
                                        No competitors added yet.
                                    </div>
                                )}
                                {competitors.map((comp, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-[var(--bg-card)] border border-[var(--line)] rounded-lg">
                                        <span className="font-medium text-slate-200">{comp}</span>
                                        <Button
                                            onClick={() => removeCompetitor(comp)}
                                            size="sm"
                                            variant="ghost"
                                            className="text-slate-500 hover:text-rose-400 h-8 px-2"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                asChild
                                className="w-full h-12 bg-white text-black hover:bg-slate-200 font-bold text-lg rounded-lg shadow-lg shadow-white/5 mt-4"
                            >
                                <Link href="/dashboard">
                                    Launch Command Center <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
