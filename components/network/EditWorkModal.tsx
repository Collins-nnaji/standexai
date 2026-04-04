"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Edit3, Save } from "lucide-react";
import { Button, Input } from "@heroui/react";

interface WorkItem {
  id: string;
  title: string;
  type: string;
  abstract?: string;
  tags?: string[];
  externalUrl?: string | null;
}

interface EditWorkModalProps {
  work: WorkItem;
  onUpdate?: (updatedWork: WorkItem) => void;
}

export function EditWorkModal({ work, onUpdate }: EditWorkModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: work.title || "",
    type: work.type || "",
    abstract: work.abstract || "",
    tags: work.tags?.join(", ") || "",
    externalUrl: work.externalUrl || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/work/${work.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          type: form.type.trim(),
          abstract: form.abstract.trim(),
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
          externalUrl: form.externalUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update work");

      setIsOpen(false);
      if (onUpdate) onUpdate(data);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="rounded-xl border-zinc-100 text-zinc-400 hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/5"
      >
        <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit Signal
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div 
            className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl relative border border-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-syne text-2xl font-black text-zinc-900 mb-8">Edit Signal Artifact</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Artifact Title</label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="The Rise of Distributed Reasoning"
                  className="rounded-2xl border-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Type</label>
                  <Input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="model"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">External URL</label>
                  <Input
                    name="externalUrl"
                    value={form.externalUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Abstract / Summary</label>
                <textarea
                  name="abstract"
                  value={form.abstract}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC] transition-all outline-none"
                  placeholder="Detailed analysis of MoE scaling laws..."
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Tags (comma separated)</label>
                <Input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="LLM, PyTorch, Research"
                />
              </div>

              {error && <p className="text-sm text-red-500 font-bold">{error}</p>}

              <div className="pt-6 flex justify-end gap-3">
                <Button
                  onPress={() => setIsOpen(false)}
                  variant="ghost"
                  className="rounded-2xl font-bold"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  isDisabled={loading}
                  className="bg-[#7C5CFC] text-white rounded-2xl font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-[#7C5CFC]/20"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} 
                  Store Signal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
