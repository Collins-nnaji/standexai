"use client";

import { useState } from "react";
import { Building, Zap, X, Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResearchBriefCardProps {
  id: string;
  companyName: string;
  logo: string | null;
  title: string;
  description: string;
  lookingFor: string;
  domain: string[];
  matchScore?: number | null; // 0-100, domain-overlap match
}

export function ResearchBriefCard({
  id,
  companyName,
  logo,
  title,
  description,
  lookingFor,
  domain,
  matchScore,
}: ResearchBriefCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomTitle, setRoomTitle] = useState(`Collab: ${title}`);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/collabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: roomTitle, briefId: id })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }
      const { collab } = await res.json();
      router.push(`/collab/${collab.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C5CFC]/30 hover:shadow-[0_8px_30px_rgba(124,92,252,0.12)]">
        {/* Top glow on hover */}
        <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-[#7C5CFC]/0 to-transparent transition-all duration-500 group-hover:via-[#7C5CFC]/60" />

        {/* Match Score Badge */}
        {matchScore != null && matchScore > 0 && (
          <div className={`absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border ${
            matchScore >= 80
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
              : "bg-amber-500/10 border-amber-500/20 text-amber-600"
          }`}>
            <CheckCircle className="h-3 w-3" />
            {matchScore}% match
          </div>
        )}

        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-sm">
            {logo ? (
              <img src={logo} alt={companyName} className="h-full w-full object-cover" />
            ) : (
              <Building className="h-6 w-6 text-zinc-400" />
            )}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">{companyName}</p>
            <h3 className="font-syne truncate text-xl font-bold text-zinc-900 group-hover:text-[#7C5CFC] transition-colors pr-16">{title}</h3>
          </div>
        </div>

        <div className="mb-8 space-y-6">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">The Problem</p>
            <p className="line-clamp-3 text-[15px] leading-relaxed text-zinc-600">{description}</p>
          </div>

          <div className="rounded-xl bg-[#7C5CFC]/5 border border-[#7C5CFC]/10 p-4 transition-colors group-hover:bg-[#7C5CFC]/10">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7C5CFC]">
              <Zap className="h-3.5 w-3.5 fill-[#7C5CFC]" /> Who we need
            </p>
            <p className="text-sm font-semibold leading-relaxed text-zinc-700">&ldquo;{lookingFor}&rdquo;</p>
          </div>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-zinc-200/60 pt-5">
          <div className="flex flex-wrap gap-2">
            {domain.map(tag => (
              <span key={tag} className="rounded-md bg-zinc-100/80 px-2.5 py-1 text-[11px] font-bold text-zinc-500 border border-zinc-200/60">
                {tag}
              </span>
            ))}
          </div>
          <button
            id={`brief-submit-${id}`}
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto whitespace-nowrap rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#7C5CFC] hover:shadow-[0_0_15px_rgba(124,92,252,0.4)] active:scale-95 flex items-center gap-2"
          >
            Submit Proposal <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#7C5CFC]">Responding to Brief</p>
              <h2 className="font-syne text-2xl font-bold text-zinc-900">{title}</h2>
              <p className="mt-1 text-sm text-zinc-500">by {companyName}</p>
            </div>

            <div className="mb-6 rounded-xl bg-zinc-50 border border-zinc-200/60 p-4">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">This will create</p>
              <p className="text-sm font-semibold text-zinc-700">A private Collab Room linked to this Brief. Invite peers, do the research, then publish your experiment to your profile — the Lab will see it via Scout Mode.</p>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-zinc-700">Room Name</label>
              <input
                type="text"
                value={roomTitle}
                onChange={e => setRoomTitle(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all"
                placeholder="Give this room a working title..."
              />
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !roomTitle.trim()}
              className="w-full rounded-xl bg-[#7C5CFC] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#6042db] hover:shadow-[0_0_20px_rgba(124,92,252,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating Room...</>
              ) : (
                <><ArrowRight className="h-4 w-4" /> Submit Research Proposal</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
