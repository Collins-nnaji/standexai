"use client";

import React, { useState } from "react";
import { X, Loader2, Save, Trash2, Globe, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResearchBrief {
  id: string;
  title: string;
  description: string;
  lookingFor: string;
  domain: string[];
  active: boolean;
}

interface EditBriefModalProps {
  brief: ResearchBrief;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DOMAINS = [
  "NLP & LLMs",
  "Computer Vision",
  "Robotics",
  "Reinforcement Learning",
  "Audio & Speech",
  "AI Safety",
  "Biology & Healthcare",
  "Finance"
];

export function EditBriefModal({ brief, isOpen, onOpenChange }: EditBriefModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: brief.title,
    description: brief.description,
    lookingFor: brief.lookingFor,
    domain: brief.domain,
    active: brief.active
  });

  const toggleDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      domain: prev.domain.includes(domain)
        ? prev.domain.filter(d => d !== domain)
        : [...prev.domain, domain]
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${brief.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error("Failed to update project");
      
      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this project brief? This action cannot be undone.")) return;
    
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${brief.id}`, {
        method: "DELETE"
      });
      
      if (!res.ok) throw new Error("Failed to delete project");
      
      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40">
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-[48px] border border-white bg-[#FAFAF9] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-8 top-8 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <form onSubmit={handleUpdate} className="p-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-syne text-3xl font-black text-zinc-900 leading-tight">Manage Research Brief</h2>
              <p className="mt-1 text-xs font-bold text-zinc-400 uppercase tracking-widest">Update project details or toggle visibility</p>
            </div>
            
            <button
               type="button"
               onClick={() => setFormData({ ...formData, active: !formData.active })}
               className={`flex items-center gap-2 rounded-2xl px-4 py-2 border transition-all ${
                 formData.active 
                 ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm" 
                 : "bg-amber-50 border-amber-100 text-amber-600 shadow-sm"
               }`}
            >
               {formData.active ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
               <span className="text-[10px] font-black uppercase tracking-widest">
                 {formData.active ? "Published" : "Private Draft"}
               </span>
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Project Title</label>
                <input 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Abstract & Technical Goal</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Requirements</label>
                <textarea 
                  rows={2}
                  value={formData.lookingFor}
                  onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Target Domains</label>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => toggleDomain(domain)}
                      className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border ${
                        formData.domain.includes(domain)
                          ? "bg-[#7C5CFC] border-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/20"
                          : "bg-white border-zinc-200 text-zinc-400 hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC]"
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && <p className="mt-6 text-xs text-red-500 font-bold bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

          <div className="mt-12 flex items-center justify-between border-t border-zinc-100 pt-8">
            <button 
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Project
            </button>
            
            <div className="flex items-center gap-4">
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-[#7C5CFC]/20 transition-all hover:bg-[#6042db] active:scale-95 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Brief <Save className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
