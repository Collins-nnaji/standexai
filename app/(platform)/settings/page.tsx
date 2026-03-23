"use client";

import { useEffect, useState } from "react";
import {
  User, Shield, Bell, Sliders, Mic, Save, Loader2
} from "lucide-react";

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
  id: "", email: "", name: "", role: "WRITER",
  industry: null, companyName: "", avatar: "",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // StandexAI preferences
  const [sensitivity, setSensitivity] = useState("balanced");
  const [preferredTone, setPreferredTone] = useState("professional");
  const [speakerMode, setSpeakerMode] = useState(true);
  const [detections, setDetections] = useState({
    tone: true,
    risk: true,
    clarity: true,
    ai: true,
    intent: true,
    filler: true,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "analysis", label: "Analysis Preferences", icon: Sliders },
    { id: "speaker", label: "Speaker Mode", icon: Mic },
    { id: "notifications", label: "Notifications", icon: Bell },
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

  const persistProfile = async (msg: string) => {
    try {
      setSavingProfile(true);
      setSaveError(null);
      setSaveMessage(null);
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name, role: profile.role,
          companyName: profile.companyName, industry: profile.industry, avatar: profile.avatar,
        }),
      });
      const data = (await response.json()) as { profile?: ProfileData; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to save");
      if (data.profile) setProfile(data.profile);
      setSaveMessage(msg);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setSavingProfile(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-zinc-200"}`}
    >
      <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-zinc-100 bg-white px-8 py-5">
        <h1 className="text-xl font-bold text-zinc-900">Settings</h1>
        <p className="mt-1 text-xs text-zinc-400">Customize your StandexAI experience</p>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <aside className="w-full border-b border-zinc-100 bg-zinc-50/50 p-4 md:w-56 md:border-b-0 md:border-r">
          <nav className="flex gap-1 overflow-x-auto md:block md:space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition md:w-full ${
                  activeTab === tab.id
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-100"
                    : "text-zinc-400 hover:bg-white hover:text-zinc-700"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="mx-auto max-w-2xl">
            {(saveError || saveMessage) && (
              <div className={`mb-6 rounded-xl border px-4 py-3 text-xs font-semibold ${
                saveError ? "border-red-100 bg-red-50 text-red-600" : "border-emerald-100 bg-emerald-50 text-emerald-600"
              }`}>
                {saveError ?? saveMessage}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-zinc-900">Profile</h2>
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                        disabled={loadingProfile}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:bg-white focus:border-indigo-200 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Email</label>
                      <input type="email" value={profile.email} readOnly className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-400 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Company</label>
                      <input
                        type="text"
                        value={profile.companyName}
                        onChange={(e) => setProfile(p => ({ ...p, companyName: e.target.value }))}
                        disabled={loadingProfile}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:bg-white focus:border-indigo-200 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Industry</label>
                      <select
                        value={profile.industry ?? ""}
                        onChange={(e) => setProfile(p => ({ ...p, industry: (e.target.value || null) as ProfileData["industry"] }))}
                        disabled={loadingProfile}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none cursor-pointer"
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
                  <div className="flex justify-end pt-4 border-t border-zinc-50">
                    <button
                      onClick={() => void persistProfile("Profile saved.")}
                      disabled={savingProfile || loadingProfile}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-semibold text-white transition hover:bg-indigo-700 shadow-lg disabled:opacity-50"
                    >
                      {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analysis" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-zinc-900">Analysis Preferences</h2>

                <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 mb-3 block">Sensitivity Level</label>
                    <div className="flex gap-2">
                      {["strict", "balanced", "relaxed"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSensitivity(s)}
                          className={`flex-1 rounded-xl px-4 py-3 text-xs font-semibold capitalize transition ${
                            sensitivity === s
                              ? "bg-indigo-600 text-white shadow-md"
                              : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2">
                      {sensitivity === "strict" && "Flags even mildly concerning language. Best for regulated industries."}
                      {sensitivity === "balanced" && "Balanced detection for most communication contexts."}
                      {sensitivity === "relaxed" && "Only flags clearly problematic language. Best for casual communication."}
                    </p>
                  </div>

                  <div className="border-t border-zinc-50 pt-6">
                    <label className="text-xs font-semibold text-zinc-500 mb-3 block">Preferred Tone Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["professional", "friendly", "neutral", "persuasive", "formal", "casual"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setPreferredTone(t)}
                          className={`rounded-xl px-3 py-2.5 text-xs font-semibold capitalize transition ${
                            preferredTone === t
                              ? "bg-indigo-50 border border-indigo-200 text-indigo-700"
                              : "bg-zinc-50 border border-zinc-100 text-zinc-500 hover:bg-zinc-100"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-50 pt-6">
                    <label className="text-xs font-semibold text-zinc-500 mb-4 block">Detection Types</label>
                    <div className="space-y-3">
                      {[
                        { key: "tone", label: "Tone Analysis", desc: "Analyze emotional tone and appropriateness" },
                        { key: "risk", label: "Risk Detection", desc: "Flag legal, HR, and compliance risks" },
                        { key: "clarity", label: "Clarity Check", desc: "Assess readability and clarity" },
                        { key: "ai", label: "AI Detection", desc: "Check for AI-generated content" },
                        { key: "intent", label: "Intent Analysis", desc: "Detect manipulation and hidden tactics" },
                        { key: "filler", label: "Filler Word Detection", desc: "Identify filler words in speeches" },
                      ].map((d) => (
                        <div key={d.key} className="flex items-center justify-between rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3">
                          <div>
                            <p className="text-xs font-semibold text-zinc-700">{d.label}</p>
                            <p className="text-[10px] text-zinc-400">{d.desc}</p>
                          </div>
                          <ToggleSwitch
                            checked={detections[d.key as keyof typeof detections]}
                            onChange={(v) => setDetections(prev => ({ ...prev, [d.key]: v }))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "speaker" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-zinc-900">Speaker Mode</h2>

                <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Mic className="h-5 w-5 text-violet-600" />
                      <div>
                        <p className="text-sm font-bold text-zinc-900">Speaker Mode</p>
                        <p className="text-xs text-zinc-500">Optimize analysis for speech and presentation</p>
                      </div>
                    </div>
                    <ToggleSwitch checked={speakerMode} onChange={setSpeakerMode} />
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    When enabled, the analyzer focuses on verbal delivery qualities: clarity, engagement, emotional impact, pacing, and filler word detection. Perfect for speeches, presentations, podcasts, and interviews.
                  </p>
                </div>

                {speakerMode && (
                  <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-5">
                    <h3 className="text-sm font-semibold text-zinc-700">Speaker Preferences</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Pacing Suggestions", desc: "Get feedback on speech speed and rhythm", defaultOn: true },
                        { label: "Emphasis Coaching", desc: "Highlight words that should be stressed", defaultOn: true },
                        { label: "Audience Adaptation", desc: "Suggest audience-friendly rewrites", defaultOn: true },
                        { label: "Engagement Scoring", desc: "Rate how engaging the speech content is", defaultOn: true },
                        { label: "Body Language Cues", desc: "Suggest gesture and movement timing", defaultOn: false },
                      ].map((p) => (
                        <div key={p.label} className="flex items-center justify-between rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3">
                          <div>
                            <p className="text-xs font-semibold text-zinc-700">{p.label}</p>
                            <p className="text-[10px] text-zinc-400">{p.desc}</p>
                          </div>
                          <ToggleSwitch checked={p.defaultOn} onChange={() => {}} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-zinc-900">Notifications</h2>
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-4">
                  {[
                    { label: "Analysis Complete", desc: "Get notified when your analysis is ready", defaultOn: true },
                    { label: "Weekly Summary", desc: "Receive a weekly communication improvement report", defaultOn: true },
                    { label: "Risk Alerts", desc: "Immediate alerts for high-risk content", defaultOn: true },
                    { label: "Tips & Insights", desc: "Personalized improvement suggestions", defaultOn: false },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center justify-between rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-zinc-700">{n.label}</p>
                        <p className="text-[10px] text-zinc-400">{n.desc}</p>
                      </div>
                      <ToggleSwitch checked={n.defaultOn} onChange={() => {}} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
