"use client";

import { useEffect, useState } from "react";
import {
    FileBarChart, Download, ShieldCheck, AlertOctagon, TrendingUp, CheckCircle2, XCircle, Search,
    Award, BarChart3, Fingerprint, Microscope, Activity, ShieldAlert, Zap, Terminal, RefreshCw,
    Clock, Globe, Lock, Cpu
} from "lucide-react";

type SafetyAudit = {
    id: string;
    scenarioName: string;
    scenarioId: string;
    goal: string;
    status: string;
    score: number;
    createdAt: string;
};

type DiscoveryAudit = {
    id: string;
    url: string;
    keyword: string;
    geoScore: number;
    modelShare: number;
    sentiment: string;
    createdAt: string;
};

export default function AuditLedgerPage() {
    const [safetyAudits, setSafetyAudits] = useState<SafetyAudit[]>([]);
    const [discoveryAudits, setDiscoveryAudits] = useState<DiscoveryAudit[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAudits = async () => {
        setLoading(true);
        try {
            const [safetyRes, discoveryRes] = await Promise.all([
                fetch("/api/audit/safety"),
                fetch("/api/visibility/audits")
            ]);
            const safetyData = await safetyRes.json();
            const discoveryData = await discoveryRes.json();

            setSafetyAudits(safetyData.audits || []);
            setDiscoveryAudits(discoveryData.audits || []);
        } catch (error) {
            console.error("Failed to fetch audits:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAudits();
    }, []);

    const exportPdfReport = () => {
        window.print();
    };

    const totalAudits = safetyAudits.length + discoveryAudits.length;
    const avgScore = safetyAudits.length > 0
        ? Math.round(safetyAudits.reduce((acc, a) => acc + a.score, 0) / safetyAudits.length)
        : 100;

    return (
        <div className="flex min-h-screen w-full flex-col bg-white">

            {/* Header */}
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-zinc-100 bg-white px-8 print:hidden">
                <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl shadow-zinc-950/20">
                        <FileBarChart className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-zinc-950 uppercase tracking-tighter">Audit Ledger</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Reliability Stream</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAudits}
                        className="p-3.5 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition text-zinc-400 hover:text-zinc-950"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={exportPdfReport}
                        className="flex items-center gap-3 rounded-[1.5rem] bg-indigo-600 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-indigo-700 shadow-xl shadow-indigo-600/20"
                    >
                        <Download className="h-4 w-4" />
                        Certificate
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-8 lg:p-12 custom-scrollbar max-w-[1500px] mx-auto w-full print:p-0">

                {/* Audit Performance Pulse */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Trust Index", val: `${avgScore}%`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Active Nodes", val: safetyAudits.length, icon: Cpu, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Visibility Scans", val: discoveryAudits.length, icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "System Uptime", val: "99.98%", icon: Activity, color: "text-zinc-400", bg: "bg-zinc-50" }
                    ].map(m => (
                        <div key={m.label} className="rounded-[2.5rem] bg-[#F9FAFB] p-8 shadow-sm border border-zinc-100 transition hover:bg-white hover:shadow-xl group">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 group-hover:text-zinc-950 transition-colors">{m.label}</span>
                                <div className={`p-3 rounded-2xl ${m.bg} ${m.color} group-hover:scale-110 transition-transform`}>
                                    <m.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <span className="text-4xl font-black text-zinc-950 tracking-tighter block">{m.val}</span>
                        </div>
                    ))}
                </div>

                {/* Safety Audit Ledger (Adversarial) */}
                <div className="mb-12">
                    <div className="mb-6 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldAlert className="h-5 w-5 text-red-600" />
                                <h2 className="text-2xl font-black text-zinc-950 uppercase tracking-tighter">Safety Simulations</h2>
                            </div>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.4em]">Adversarial Attack Vectors & Logic Breaks</p>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-white border border-zinc-100 shadow-xl overflow-hidden relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                                <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#F9FAFB] border-b border-zinc-100">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Scenario Vector</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Security Score</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {safetyAudits.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center">
                                                <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest italic">No safety audits registered.</p>
                                            </td>
                                        </tr>
                                    ) : safetyAudits.map((audit) => (
                                        <tr key={audit.id} className="hover:bg-zinc-50/50 transition-colors group">
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100 group-hover:scale-110 transition-transform">
                                                        <Zap className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <span className="text-base font-black text-zinc-950 block tracking-tight uppercase">{audit.scenarioName}</span>
                                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{audit.scenarioId}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex flex-col gap-2">
                                                    <span className={`text-xl font-black ${audit.score >= 90 ? 'text-emerald-600' : 'text-zinc-950'}`}>{audit.score}%</span>
                                                    <div className="w-20 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                                        <div className={`h-full transition-all duration-1000 ${audit.score >= 90 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${audit.score}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${audit.status === 'Certified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                    {audit.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <span className="text-xs font-bold text-zinc-950 font-mono italic">{new Date(audit.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-[9px] font-black text-zinc-300 uppercase">{new Date(audit.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Discovery Audit Ledger (Visibility) */}
                <div>
                    <div className="mb-6 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Globe className="h-5 w-5 text-blue-600" />
                                <h2 className="text-2xl font-black text-zinc-950 uppercase tracking-tighter">Discovery Pulse</h2>
                            </div>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.4em]">External Model Presence & Citation Integrity</p>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-white border border-zinc-100 shadow-xl overflow-hidden relative">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#F9FAFB] border-b border-zinc-100">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Target Keyword / URL</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">GEO Score</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">Sentiment</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Audit Ref</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {discoveryAudits.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center">
                                                <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest italic">No discovery scans synchronized.</p>
                                            </td>
                                        </tr>
                                    ) : discoveryAudits.map((row) => (
                                        <tr key={row.id} className="hover:bg-zinc-50/50 transition-colors group">
                                            <td className="px-8 py-8">
                                                <span className="text-base font-black text-zinc-950 block tracking-tight uppercase">{row.keyword}</span>
                                                <span className="text-[9px] font-bold text-zinc-400 lowercase italic truncate max-w-sm block">{row.url}</span>
                                            </td>
                                            <td className="px-8 py-8 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-xl font-black text-zinc-950">{row.geoScore}%</span>
                                                    <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${row.geoScore}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${row.sentiment === 'positive' ? 'text-emerald-600 bg-emerald-50' :
                                                    row.sentiment === 'negative' ? 'text-red-600 bg-red-50' : 'text-zinc-400 bg-zinc-50'
                                                    }`}>
                                                    {row.sentiment}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                <span className="text-[9px] font-black text-zinc-300 font-mono">STX-DISC-{row.id.slice(0, 8).toUpperCase()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center pb-20">
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-200">
                        Standex Trust Protocol v4.2 // Ledger Matrix
                    </p>
                </div>

            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4D4D8; }
      `}} />
        </div>
    );
}
