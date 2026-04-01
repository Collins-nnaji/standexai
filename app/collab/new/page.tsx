"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/network/TopNav";
import { Users, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCollabPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", visibility: "private" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    if (!form.title.trim()) { setError("Title is required"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/collabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      router.push(`/collab/${data.collab.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-zinc-700">
      <TopNav />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link href="/discover" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Discover
        </Link>

        <div className="rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-md p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/20">
              <Users className="h-6 w-6 text-[#7C5CFC]" />
            </div>
            <div>
              <h1 className="font-syne text-2xl font-bold text-zinc-900">Create Collab Room</h1>
              <p className="text-sm text-zinc-500">Invite peers to collaborate, then co-publish your work.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">Room Name *</label>
              <input
                id="new-collab-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all"
                placeholder="e.g. Sparse Autoencoders for GPT-4 Activations"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">Objective / Description</label>
              <textarea
                id="new-collab-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all resize-none"
                placeholder="What is the goal of this collaboration? What problem are you solving?"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">Visibility</label>
              <select
                id="new-collab-visibility"
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] transition-all"
              >
                <option value="private">Private — invite only</option>
                <option value="public">Public — anyone can view</option>
              </select>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              id="new-collab-submit"
              onClick={handleCreate}
              disabled={loading}
              className="w-full rounded-xl bg-[#7C5CFC] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#6042db] hover:shadow-[0_0_20px_rgba(124,92,252,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
              ) : (
                <><Users className="h-4 w-4" /> Create Room</>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
