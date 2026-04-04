"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, X, Loader2, Linkedin, Twitter, Github, Globe, MapPin, Building2 } from "lucide-react";

interface EditProfileModalProps {
  user: {
    handle?: string | null;
    name?: string | null;
    bio?: string | null;
    openToWork?: boolean;
    institution?: string | null;
    location?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    githubUrl?: string | null;
    websiteUrl?: string | null;
  };
}

export function EditProfileModal({ user }: EditProfileModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    handle: user.handle || "",
    name: user.name || "",
    bio: user.bio || "",
    openToWork: !!user.openToWork,
    institution: user.institution || "",
    location: user.location || "",
    linkedinUrl: user.linkedinUrl || "",
    twitterUrl: user.twitterUrl || "",
    githubUrl: user.githubUrl || "",
    websiteUrl: user.websiteUrl || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: form.handle.trim() || undefined,
          name: form.name.trim(),
          bio: form.bio.trim(),
          openToWork: form.openToWork,
          institution: form.institution.trim() || null,
          location: form.location.trim() || null,
          linkedinUrl: form.linkedinUrl.trim() || null,
          twitterUrl: form.twitterUrl.trim() || null,
          githubUrl: form.githubUrl.trim() || null,
          websiteUrl: form.websiteUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setIsOpen(false);
      
      // If handle changed, redirect to the new handle URL
      if (data.user.handle && data.user.handle !== user.handle) {
        router.push(`/r/${data.user.handle}`);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(false)}
        className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-200"
        onMouseDown={() => setIsOpen(true)}
      >
        <Settings className="h-4 w-4" /> Edit Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl relative my-8">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-syne text-2xl font-black text-zinc-900 mb-8">Edit Researcher Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Identification</label>
                    <div className="flex items-center rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden focus-within:border-[#7C5CFC] focus-within:ring-4 focus-within:ring-[#7C5CFC]/5 transition-all">
                      <span className="px-3 text-[10px] font-bold text-zinc-400 border-r border-zinc-200 bg-zinc-100">r/</span>
                      <input
                        name="handle"
                        value={form.handle}
                        onChange={handleChange}
                        className="w-full bg-transparent px-3 py-3 text-sm text-zinc-900 outline-none font-medium"
                        placeholder="handle"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Display Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all font-medium"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                   <div>
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Primary Institution</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        name="institution"
                        value={form.institution}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all font-medium"
                        placeholder="e.g. Stanford AI Lab"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all font-medium"
                        placeholder="e.g. Palo Alto, CA"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Research Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all font-medium"
                  placeholder="Tell the network about your focus areas..."
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Social Presence</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      name="linkedinUrl"
                      value={form.linkedinUrl}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all font-medium"
                      placeholder="linkedin.com/in/..."
                    />
                  </div>
                  <div className="relative">
                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      name="twitterUrl"
                      value={form.twitterUrl}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all font-medium"
                      placeholder="x.com/..."
                    />
                  </div>
                  <div className="relative">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      name="githubUrl"
                      value={form.githubUrl}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all font-medium"
                      placeholder="github.com/..."
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      name="websiteUrl"
                      value={form.websiteUrl}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all font-medium"
                      placeholder="personal-site.ai"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="openToWork"
                  name="openToWork"
                  checked={form.openToWork}
                  onChange={handleChange}
                  className="h-4 w-4 rounded-lg border-zinc-300 text-[#7C5CFC] focus:ring-[#7C5CFC] transition-all"
                />
                <label htmlFor="openToWork" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Open to new research opportunities</label>
              </div>

              {error && <p className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

              <div className="pt-8 flex justify-end gap-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-[#6042db] disabled:opacity-50 shadow-xl shadow-[#7C5CFC]/20 transition-all active:scale-95"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
