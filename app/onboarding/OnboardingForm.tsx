"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveOnboarding } from "./actions";
import { Loader2 } from "lucide-react";

export function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [role, setRole] = useState<"RESEARCHER" | "LAB">("RESEARCHER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    fd.append("userId", userId);
    fd.append("role", role);

    try {
      const res = await saveOnboarding(fd);
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.refresh();
        router.push("/talent");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setRole("RESEARCHER")}
          className={`flex-1 rounded-xl border p-4 text-left transition-all ${
            role === "RESEARCHER"
              ? "border-[#7C5CFC] bg-[#7C5CFC]/10 shadow-[0_0_15px_rgba(124,92,252,0.15)]"
              : "border-zinc-800 bg-zinc-100 opacity-60 hover:opacity-100"
          }`}
        >
          <div className="text-sm font-bold text-zinc-900">I'm a Researcher</div>
          <div className="text-xs text-zinc-500 mt-1">Publish work & discover talent</div>
        </button>

        <button
          type="button"
          onClick={() => setRole("LAB")}
          className={`flex-1 rounded-xl border p-4 text-left transition-all ${
            role === "LAB"
              ? "border-[#7C5CFC] bg-[#7C5CFC]/10 shadow-[0_0_15px_rgba(124,92,252,0.15)]"
              : "border-zinc-800 bg-zinc-100 opacity-60 hover:opacity-100"
          }`}
        >
          <div className="text-sm font-bold text-zinc-900">We're an AI Lab</div>
          <div className="text-xs text-zinc-500 mt-1">Post briefs & recruit talent</div>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">Name or Display Name</label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-zinc-800 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC]"
            placeholder="John von Neumann"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            {role === "RESEARCHER" ? "Current Institution / Lab" : "Company Name"}
          </label>
          <input
            name="institution"
            className="w-full rounded-lg border border-zinc-800 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC]"
            placeholder={role === "RESEARCHER" ? "Stanford / DeepMind" : "Anthropic"}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">Location</label>
          <input
            name="location"
            className="w-full rounded-lg border border-zinc-800 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC]"
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="pt-2">
          <label className="mb-1 block text-sm font-medium text-zinc-600">Short Bio</label>
          <textarea
            name="bio"
            rows={3}
            className="w-full rounded-lg border border-zinc-800 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-[#7C5CFC] focus:outline-none focus:ring-1 focus:ring-[#7C5CFC] resize-none"
            placeholder="Researching efficient LLM architectures and alignment..."
          />
        </div>

        {role === "RESEARCHER" && (
          <label className="flex items-center gap-3 py-2 cursor-pointer">
            <input type="checkbox" name="openToWork" className="h-4 w-4 rounded border-zinc-700 bg-white text-[#7C5CFC] focus:ring-[#7C5CFC]" />
            <span className="text-sm font-medium text-zinc-600">I am open to new research opportunities</span>
          </label>
        )}
      </div>

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] font-semibold text-white transition-all hover:bg-[#6042db] active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Profile"}
      </button>
    </form>
  );
}
