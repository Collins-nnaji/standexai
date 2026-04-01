"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface CollabPublishPanelProps {
  collabId: string;
  briefTitle?: string | null;
}

export function CollabPublishPanel({ collabId, briefTitle }: CollabPublishPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: briefTitle ? `Results: ${briefTitle}` : "",
    abstract: "",
    impactSummary: "",
    problemSolved: briefTitle || "",
    improvesOn: "",
    tags: "",
    externalUrl: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePublish = async () => {
    if (!form.title.trim()) {
      setError("Work title is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/collabs/${collabId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to publish");
        return;
      }
      router.push(`/work/${data.workItem.id}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#7C5CFC]/20 bg-gradient-to-br from-[#7C5CFC]/5 to-transparent overflow-hidden">
      <button
        id="collab-publish-toggle"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#7C5CFC]/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-[#7C5CFC]" />
          <div>
            <p className="font-syne font-bold text-zinc-900">Publish Experiment to Profiles</p>
            <p className="text-xs text-zinc-500">Co-publish the results with all room members &amp; award reputation signals</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
      </button>

      {open && (
        <div className="border-t border-[#7C5CFC]/10 px-6 py-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-zinc-600 uppercase tracking-wide">Work Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all"
                placeholder="e.g. Sparse Autoencoder improvements on GPT-4 activations"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-zinc-600 uppercase tracking-wide">Abstract / Summary</label>
              <textarea name="abstract" value={form.abstract} onChange={handleChange} rows={3}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all resize-none"
                placeholder="Briefly describe what was explored and what you found..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-600 uppercase tracking-wide">Problem Solved</label>
              <input name="problemSolved" value={form.problemSolved} onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] transition-all"
                placeholder="What specific problem does this address?"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-600 uppercase tracking-wide">Improves On</label>
              <input name="improvesOn" value={form.improvesOn} onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] transition-all"
                placeholder="Prior work or baseline this improves upon"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-600 uppercase tracking-wide">Tags (comma-separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] transition-all"
                placeholder="PyTorch, SAE, LLMs..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-600 uppercase tracking-wide">External Link (optional)</label>
              <input name="externalUrl" value={form.externalUrl} onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] transition-all"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
          )}

          <button
            id="collab-publish-submit"
            onClick={handlePublish}
            disabled={loading}
            className="w-full rounded-xl bg-[#7C5CFC] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#6042db] hover:shadow-[0_0_20px_rgba(124,92,252,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</>
            ) : (
              <><CheckCircle className="h-4 w-4" /> Publish to All Profiles</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
