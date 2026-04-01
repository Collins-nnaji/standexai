"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/network/TopNav";
import { UploadCloud, Link as LinkIcon, Loader2, File, CheckCircle2 } from "lucide-react";

export default function NewWorkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [type, setType] = useState("paper");
  const [abstract, setAbstract] = useState("");
  const [impactSummary, setImpactSummary] = useState("");
  const [problemSolved, setProblemSolved] = useState("");
  const [improvesOn, setImprovesOn] = useState("");
  const [tags, setTags] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadingFile(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to upload file");
        }
        
        setFileUrl(data.url);
      } catch (err: any) {
        setError(err.message);
        setFile(null);
      } finally {
        setUploadingFile(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
      
      const payload = {
        title, type, abstract, impactSummary, problemSolved, improvesOn, tags: tagArray, externalUrl, fileUrl
      };

      const res = await fetch("/api/work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to publish work");
      }

      const { id } = await res.json();
      router.push(`/work/${id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-zinc-900 pb-20">
      <TopNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-syne text-3xl font-extrabold mb-2">Publish New Work</h1>
        <p className="text-zinc-500 mb-8 border-b border-black/5 pb-8">
          Share your latest research, model, or dataset with the network. You can upload the artifact directly or link to an external repository.
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload / Link Section */}
          <div className="rounded-xl border border-black/5 bg-white shadow-sm p-6 space-y-6">
            <h2 className="font-syne text-xl font-bold">Artifact Source</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Direct Upload (Azure Blob)</label>
                <div className="relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-[#7C5CFC]/50 hover:bg-[#7C5CFC]/5">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.zip,.csv,.json,.txt"
                  />
                  {uploadingFile ? (
                    <div className="flex flex-col items-center text-zinc-500">
                      <Loader2 className="mb-2 h-6 w-6 animate-spin" />
                      <span className="text-sm font-medium">Uploading to Azure...</span>
                    </div>
                  ) : fileUrl ? (
                    <div className="flex flex-col items-center text-emerald-600">
                      <CheckCircle2 className="mb-2 h-6 w-6" />
                      <span className="text-sm font-bold truncate max-w-[200px]">{file?.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-zinc-500">
                      <UploadCloud className="mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">Click to browse or drag & drop</span>
                      <span className="text-xs mt-1">PDF, ZIP, JSON, CSV (Max 50MB)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 flex flex-col justify-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase px-2 mb-2">
                    <span className="bg-white text-zinc-500 font-bold px-2">OR</span>
                  </div>
                </div>

                <label className="text-sm font-bold text-zinc-700">External URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://github.com/... or https://arxiv.org/..."
                    className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 text-sm focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC] bg-zinc-50 placeholder:text-zinc-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-black/5 bg-white shadow-sm p-6 space-y-6">
            <h2 className="font-syne text-xl font-bold">Details</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Item Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 py-3 px-4 text-sm focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC] bg-zinc-50"
                  required
                >
                  <option value="paper">Paper / Publication</option>
                  <option value="model">AI Model / Weights</option>
                  <option value="dataset">Dataset</option>
                  <option value="experiment">Experiment Log</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 py-3 px-4 text-sm focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC] bg-zinc-50 placeholder:text-zinc-400"
                  placeholder="e.g. Attention Is All You Need"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Abstract / Summary</label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-zinc-300 py-3 px-4 text-sm focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC] bg-zinc-50 placeholder:text-zinc-400"
                placeholder="Briefly describe the artifact, methodology, and outcome."
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Problem Solved</label>
                <textarea
                  value={problemSolved}
                  onChange={(e) => setProblemSolved(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-zinc-300 py-3 px-4 text-sm focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC] bg-zinc-50 placeholder:text-zinc-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Improves On (SOTA)</label>
                <textarea
                  value={improvesOn}
                  onChange={(e) => setImprovesOn(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-zinc-300 py-3 px-4 text-sm focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC] bg-zinc-50 placeholder:text-zinc-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Impact Summary</label>
              <textarea
                value={impactSummary}
                onChange={(e) => setImpactSummary(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-zinc-300 py-3 px-4 text-sm focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC] bg-zinc-50 placeholder:text-zinc-400"
                placeholder="What exactly makes this special for the network?"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 py-3 px-4 text-sm focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC] bg-zinc-50 placeholder:text-zinc-400"
                placeholder="NLP, Transformer, RAG, Open Source"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 font-semibold text-zinc-500 transition-colors hover:text-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingFile}
              className="inline-flex min-w-[140px] items-center justify-center rounded-xl bg-[#7C5CFC] px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#6042db] hover:shadow-md disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publish Work"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
