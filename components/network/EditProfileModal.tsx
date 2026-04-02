"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, X, Loader2 } from "lucide-react";

interface EditProfileModalProps {
  user: {
    handle?: string | null;
    name?: string | null;
    bio?: string | null;
    openToWork?: boolean;
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
          openToWork: form.openToWork
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
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-200"
      >
        <Settings className="h-4 w-4" /> Edit Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-syne text-xl font-bold text-zinc-900 mb-6">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-zinc-700">Username / Handle</label>
                <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden focus-within:border-[#7C5CFC] focus-within:ring-1 focus-within:ring-[#7C5CFC]">
                  <span className="px-3 text-sm text-zinc-500 border-r border-zinc-200 bg-zinc-100">standex.ai/r/</span>
                  <input
                    name="handle"
                    value={form.handle}
                    onChange={handleChange}
                    className="w-full bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-zinc-700">Display Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-zinc-700">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="openToWork"
                  name="openToWork"
                  checked={form.openToWork}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-zinc-300 text-[#7C5CFC] focus:ring-[#7C5CFC]"
                />
                <label htmlFor="openToWork" className="text-sm font-medium text-zinc-700">Open to opportunities</label>
              </div>

              {error && <p className="text-sm text-red-500 pt-2">{error}</p>}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-4 py-2 text-sm font-bold text-white hover:bg-[#6042db] disabled:opacity-50"
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
