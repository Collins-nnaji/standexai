"use client";

import { useState } from "react";
import { UserPlus, Loader2, Check, X } from "lucide-react";

interface CollabInvitePanelProps {
  collabId: string;
}

export function CollabInvitePanel({ collabId }: CollabInvitePanelProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/collabs/${collabId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to invite");
        return;
      }
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-md p-5">
      <h3 className="font-syne mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-[#7C5CFC]" />
        Invite Researcher
      </h3>
      <p className="mb-3 text-xs text-zinc-500">Add a collaborator by their StandexAI email address.</p>
      <div className="flex gap-2">
        <input
          id="collab-invite-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleInvite()}
          placeholder="researcher@email.com"
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all"
        />
        <button
          id="collab-invite-submit"
          onClick={handleInvite}
          disabled={loading || !email.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFC] text-white transition-all hover:bg-[#6042db] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        </button>
      </div>

      {success && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-600">
          <Check className="h-4 w-4" /> Invitee added to room!
        </div>
      )}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm font-medium text-red-600">
          <X className="h-4 w-4" /> {error}
        </div>
      )}
    </div>
  );
}
