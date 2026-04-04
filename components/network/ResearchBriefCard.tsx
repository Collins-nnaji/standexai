"use client";

import { useState } from "react";
import { Building, Zap, X, Loader2, ArrowRight, CheckCircle, Settings, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResearchBriefCardProps {
  id: string;
  companyName: string;
  logo: string | null;
  title: string;
  description: string;
  lookingFor: string;
  domain: string[];
  matchScore?: number | null; 
  status?: "verified" | "managed";
  isOwner?: boolean;
  onEdit?: () => void;
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
  status = "verified",
  isOwner,
  onEdit,
}: ResearchBriefCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomTitle, setRoomTitle] = useState(`Collab: ${title}`);
  const [error, setError] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<"idle" | "success" | "error">("idle");
  const [createdCollabId, setCreatedCollabId] = useState<string | null>(null);

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
      setCreatedCollabId(collab.id);
      setStatusState("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setStatusState("idle");
    setCreatedCollabId(null);
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-[40px] border border-white bg-white/40 backdrop-blur-3xl shadow-xl shadow-zinc-200/20 p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#7C5CFC]/10">
        {/* Top Glow */}
        <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-[#7C5CFC]/0 to-transparent transition-all duration-700 group-hover:via-[#7C5CFC]/40" />

        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white shadow-xl shadow-zinc-100">
            {logo ? (
              <img src={logo} alt={companyName} className="h-full w-full object-cover" />
            ) : (
              <Building className="h-6 w-6 text-zinc-300" />
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {status === "managed" ? (
               <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-500/20 shadow-sm">Managed Match</span>
            ) : (
               <span className="rounded-full bg-[#7C5CFC]/5 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-[#7C5CFC] border border-[#7C5CFC]/10 shadow-sm">Verified Laboratory</span>
            )}
            
            {matchScore != null && matchScore > 0 && (
              <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                matchScore >= 80
                  ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                  : "bg-amber-50 text-amber-500 border-amber-100"
              }`}>
                {matchScore}% Score
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-1 mb-6">
           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{companyName}</p>
           <h3 className="font-syne text-2xl font-black text-zinc-900 group-hover:text-[#7C5CFC] transition-colors leading-tight">{title}</h3>
        </div>

        <div className="mb-8 space-y-6">
          <p className="line-clamp-3 text-sm font-medium leading-relaxed text-zinc-500">{description}</p>

          <div className="rounded-3xl bg-[#7C5CFC]/5 border border-[#7C5CFC]/5 p-5 transition-colors group-hover:bg-[#7C5CFC]/10">
            <p className="mb-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#7C5CFC]">
              <Zap className="h-3.5 w-3.5 fill-[#7C5CFC]" /> Requirements
            </p>
            <p className="text-xs font-bold leading-relaxed text-zinc-700 italic">&ldquo;{lookingFor}&rdquo;</p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-6 border-t border-zinc-100 pt-6">
          <div className="flex flex-wrap gap-2">
            {domain.map(tag => (
              <span key={tag} className="rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-100 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex-1 flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-zinc-900/10 transition-all hover:bg-[#7C5CFC] hover:shadow-[#7C5CFC]/20 active:scale-95"
            >
              Submit Proposal <ArrowRight className="h-4 w-4" />
            </button>
            
            {isOwner && (
              <button
                onClick={onEdit}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-[#7C5CFC] px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-[#7C5CFC]/20 transition-all hover:bg-[#6042db] active:scale-95"
              >
                Manage <Settings className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg rounded-[40px] border border-white/20 bg-white/90 p-10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <button
              onClick={closeModal}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {statusState === "success" ? (
              <div className="text-center py-4">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-emerald-500/10 text-emerald-500 shadow-xl shadow-emerald-500/5">
                   <CheckCircle className="h-12 w-12" />
                </div>
                <h2 className="font-syne text-3xl font-black text-zinc-900 mb-4 items-center gap-2">Proposal Dispatched.</h2>
                <p className="text-base font-medium text-zinc-500 mb-10 leading-relaxed max-w-sm mx-auto">
                   A private collaboration room has been created in your profile. The project team has been automatically invited to review your proposal.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => router.push(`/collab/${createdCollabId}`)}
                    className="w-full rounded-2xl bg-[#7C5CFC] px-8 py-5 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-[#7C5CFC]/30 hover:bg-[#6042db] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Open Collaboration Room <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full rounded-2xl bg-zinc-100 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-all"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/10 bg-[#7C5CFC]/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#7C5CFC] shadow-sm">
                    <Plus className="h-3 w-3" /> Initializing Response
                  </div>
                  <h2 className="font-syne text-3xl font-black text-zinc-900 leading-tight">{title}</h2>
                  <p className="mt-2 text-sm font-bold text-zinc-400">Project Owner: {companyName}</p>
                </div>

                <div className="mb-8 space-y-4">
                   <div className="rounded-3xl bg-zinc-50/50 border border-zinc-100 p-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Automated Next Step</p>
                      <p className="text-sm font-bold text-zinc-600 leading-relaxed">
                         Submitting this proposal will create a 1:1 private workspace with the Lab team to coordinate technical milestones and data access.
                      </p>
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Workspace Title</label>
                     <input
                       type="text"
                       value={roomTitle}
                       onChange={e => setRoomTitle(e.target.value)}
                       className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/80 px-6 py-4 text-sm font-bold text-zinc-900 outline-none focus:border-[#7C5CFC]/30 focus:bg-white focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all"
                       placeholder="Give this room a working title..."
                     />
                   </div>
                </div>

                {error && (
                  <p className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-6 py-4 text-xs font-bold text-red-600 flex items-center gap-2">
                    <X className="h-4 w-4" /> {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !roomTitle.trim()}
                  className="w-full rounded-[24px] bg-zinc-900 py-5 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-zinc-900/20 transition-all hover:bg-[#7C5CFC] hover:shadow-[#7C5CFC]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Committing Signal...</>
                  ) : (
                    <><ArrowRight className="h-5 w-5" /> Submit Research Proposal</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
