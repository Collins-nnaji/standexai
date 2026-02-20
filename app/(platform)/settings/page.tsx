"use client";

import { useEffect, useState } from "react";
import { User, Building2, Shield, Bell, Key, Save, Loader2 } from "lucide-react";

type ProfileData = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "WRITER" | "REVIEWER" | "VIEWER";
  industry: "FINTECH" | "INSURANCE" | "HEALTHCARE" | "LENDING" | "SAAS" | "INVESTMENT" | "CRYPTO" | null;
  companyName: string;
  avatar: string;
};

const emptyProfile: ProfileData = {
  id: "",
  email: "",
  name: "",
  role: "WRITER",
  industry: null,
  companyName: "",
  avatar: "",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "company", label: "Company", icon: Building2 },
    { id: "compliance", label: "Policy & Compliance", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
  ];

  const complianceRules = [
    {
      id: "hipaa",
      name: "HIPAA Healthcare Rules",
      summary: "Medical claims, patient privacy, PHI handling",
      updatedAt: "Updated 2 days ago",
      include: ["Patient testimonials", "Treatment benefits", "Clinical outcomes"],
      exclude: ["PHI identifiers", "Guaranteed outcomes", "Unapproved cures"],
      contentChecks: [
        "Block absolute guarantees like “cure” or “guaranteed results”.",
        "Require disclaimers for medical advice.",
        "Mask or flag patient-identifying data (PHI).",
      ],
    },
    {
      id: "ftc",
      name: "FTC Advertising Guidelines",
      summary: "Truthful claims, substantiation, endorsements",
      updatedAt: "Updated 1 week ago",
      include: ["Comparative claims", "Testimonials", "Pricing promotions"],
      exclude: ["Unsubstantiated superlatives", "Hidden endorsements"],
      contentChecks: [
        "Enforce evidence for comparative claims (best/fastest/only).",
        "Require disclosure for endorsements and incentives.",
        "Flag misleading pricing or savings language.",
      ],
    },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await fetch("/api/settings/profile", { cache: "no-store" });
        const data = (await response.json()) as { profile?: ProfileData; error?: string };
        if (!response.ok) throw new Error(data.error || "Failed to load profile");
        if (data.profile) setProfile(data.profile);
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };
    void loadProfile();
  }, []);

  const persistProfile = async (successMessage: string) => {
    try {
      setSavingProfile(true);
      setSaveError(null);
      setSaveMessage(null);
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          role: profile.role,
          companyName: profile.companyName,
          industry: profile.industry,
          avatar: profile.avatar,
        }),
      });
      const data = (await response.json()) as { profile?: ProfileData; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to save profile");
      if (data.profile) setProfile(data.profile);
      setSaveMessage(successMessage);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-zinc-100 bg-white px-8 py-6">
        <h1 className="text-2xl font-black text-zinc-950 uppercase tracking-tight">System Settings</h1>
        <p className="mt-1 text-sm font-medium text-zinc-500 uppercase tracking-tight">Technical preferences and account control</p>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Tabs Sidebar */}
        <aside className="w-full border-b border-zinc-100 bg-[#F9FAFB] p-6 md:w-72 md:border-b-0 md:border-r">
          <nav className="flex gap-2 overflow-x-auto pb-1 md:block md:space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-shrink-0 items-center justify-between rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all md:w-full ${activeTab === tab.id
                  ? "bg-white text-zinc-950 shadow-md border border-zinc-100"
                  : "text-zinc-400 hover:bg-white hover:text-zinc-950"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </div>
                {activeTab === tab.id && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8 lg:p-12 custom-scrollbar">
          <div className="mx-auto max-w-4xl">
            {(saveError || saveMessage) && (
              <div
                className={`mb-8 rounded-2xl border px-6 py-4 text-xs font-black uppercase tracking-widest ${saveError ? "border-red-100 bg-red-50 text-red-600" : "border-emerald-100 bg-emerald-50 text-emerald-600"
                  }`}
              >
                {saveError ?? saveMessage}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-8">
                <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-10 shadow-xl">
                  <h2 className="mb-10 text-xl font-black text-zinc-950 uppercase">Profile Core</h2>

                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={loadingProfile}
                        className="w-full rounded-2xl border border-zinc-100 bg-[#F9FAFB] px-5 py-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-indigo-100 transition shadow-inner"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">System ID / Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="w-full rounded-2xl border border-zinc-50 bg-zinc-50 px-5 py-4 text-sm font-bold text-zinc-400 outline-none cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Role</label>
                      <select
                        value={profile.role}
                        onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value as ProfileData["role"] }))}
                        disabled={loadingProfile}
                        className="w-full rounded-2xl border border-zinc-100 bg-[#F9FAFB] px-5 py-4 text-sm font-bold text-zinc-900 outline-none cursor-pointer hover:bg-white"
                      >
                        <option value="WRITER">Writer</option>
                        <option value="REVIEWER">Reviewer</option>
                        <option value="ADMIN">Admin</option>
                        <option value="VIEWER">Viewer</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Avatar URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={profile.avatar}
                        onChange={(e) => setProfile((prev) => ({ ...prev, avatar: e.target.value }))}
                        disabled={loadingProfile}
                        className="w-full rounded-2xl border border-zinc-100 bg-[#F9FAFB] px-5 py-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white transition shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="mt-12 flex items-center justify-end gap-4 border-t border-zinc-50 pt-10">
                    <button
                      onClick={() => void persistProfile("Profile updated.")}
                      disabled={savingProfile || loadingProfile}
                      className="flex items-center gap-3 rounded-2xl bg-zinc-950 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-lg disabled:opacity-50"
                    >
                      {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Persist Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "company" && (
              <div className="space-y-8">
                <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-10 shadow-xl">
                  <h2 className="mb-10 text-xl font-black text-zinc-950 uppercase">Organization Core</h2>

                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Company Name</label>
                      <input
                        type="text"
                        value={profile.companyName}
                        onChange={(e) => setProfile((prev) => ({ ...prev, companyName: e.target.value }))}
                        disabled={loadingProfile}
                        className="w-full rounded-2xl border border-zinc-100 bg-[#F9FAFB] px-5 py-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white transition shadow-inner"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Vertical Sector</label>
                      <select
                        value={profile.industry ?? ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            industry: (e.target.value || null) as ProfileData["industry"],
                          }))
                        }
                        disabled={loadingProfile}
                        className="w-full rounded-2xl border border-zinc-100 bg-[#F9FAFB] px-5 py-4 text-sm font-bold text-zinc-900 outline-none cursor-pointer hover:bg-white"
                      >
                        <option value="">Select industry</option>
                        <option value="SAAS">SaaS</option>
                        <option value="HEALTHCARE">Healthcare</option>
                        <option value="FINTECH">FinTech</option>
                        <option value="INSURANCE">Insurance</option>
                        <option value="LENDING">Lending</option>
                        <option value="INVESTMENT">Investment</option>
                        <option value="CRYPTO">Crypto</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-end pt-10 border-t border-zinc-50">
                    <button
                      onClick={() => void persistProfile("Organization updated.")}
                      disabled={savingProfile || loadingProfile}
                      className="rounded-2xl bg-zinc-950 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-lg"
                    >
                      Update Organization
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "compliance" && (
              <div className="space-y-8">
                <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-10 shadow-xl">
                  <h2 className="mb-4 text-xl font-black text-zinc-950 uppercase">Guardrail Protocol</h2>
                  <p className="mb-10 text-sm font-medium text-zinc-500 uppercase tracking-tight">
                    Active filtering logic for Prompt Lab and Safety Audit simulations.
                  </p>

                  <div className="space-y-6">
                    {complianceRules.map((rule, index) => (
                      <div
                        key={rule.id}
                        className="rounded-3xl border border-zinc-100 bg-[#F9FAFB] p-8 transition hover:bg-white hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-lg font-black text-zinc-950 uppercase">{rule.name}</h3>
                            <p className="text-sm font-medium text-zinc-400">{rule.summary}</p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input type="checkbox" defaultChecked className="peer sr-only" />
                            <div className="peer h-7 w-12 rounded-full bg-zinc-200 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                          </label>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                          <div className="rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 block mb-3">Include</span>
                            <ul className="space-y-2 text-[10px] font-bold text-zinc-600">
                              {rule.include.map(i => <li key={i}>• {i}</li>)}
                            </ul>
                          </div>
                          <div className="rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 block mb-3">Exclude</span>
                            <ul className="space-y-2 text-[10px] font-bold text-red-500">
                              {rule.exclude.map(i => <li key={i}>• {i}</li>)}
                            </ul>
                          </div>
                          <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-xl text-white">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 block mb-3">Logic Checks</span>
                            <ul className="space-y-2 text-[10px] font-bold text-zinc-300">
                              {rule.contentChecks.map(i => <li key={i}>• {i}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-8">
                <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-10 shadow-xl">
                  <div className="mb-10 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-zinc-950 uppercase">Gateway Keys</h2>
                      <p className="mt-1 text-sm font-medium text-zinc-500 uppercase tracking-tight">Active API endpoints for model routing</p>
                    </div>
                    <button className="rounded-2xl bg-zinc-950 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl hover:bg-black transition">
                      Generate Key
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="group rounded-3xl border border-zinc-100 bg-[#F9FAFB] p-8 transition hover:bg-white hover:shadow-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xs font-black text-zinc-950 uppercase mb-2">Production Protocol</h3>
                          <p className="font-mono text-sm font-bold text-zinc-400">sk_live_••••••••••••3x8k</p>
                          <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-zinc-300">Last Ping: 2 Hours Ago</p>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600">Revoke</button>
                      </div>
                    </div>

                    <div className="group rounded-3xl border border-zinc-100 bg-[#F9FAFB] p-8 transition hover:bg-white hover:shadow-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xs font-black text-zinc-950 uppercase mb-2">Sandbox Protocol</h3>
                          <p className="font-mono text-sm font-bold text-zinc-400">sk_test_••••••••••••7m2p</p>
                          <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-zinc-300">Last Ping: Inactive</p>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600">Revoke</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
      `}} />
    </div>
  );
}
