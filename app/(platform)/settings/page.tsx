"use client";

import { useState } from "react";
import { User, Building2, Shield, Bell, Key } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "company", label: "Company", icon: Building2 },
    { id: "compliance", label: "Compliance Rules", icon: Shield },
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
    {
      id: "sec",
      name: "SEC Financial Regulations",
      summary: "Investment advice disclaimers, performance claims",
      updatedAt: "Updated 3 weeks ago",
      include: ["Performance data", "Risk disclosures", "Investment strategies"],
      exclude: ["Guaranteed returns", "Personalized advice without license"],
      contentChecks: [
        "Require risk warnings on performance statements.",
        "Disallow guaranteed returns or risk-free claims.",
        "Ensure past performance is not presented as future results.",
      ],
    },
  ];

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="border-b border-[#E5E5EA] bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-[#1D1D1F]">Settings</h1>
        <p className="mt-1 text-sm text-[#6E6E73]">Manage your account and preferences</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Tabs Sidebar */}
        <aside className="w-64 border-r border-[#E5E5EA] bg-[#F5F5F7] p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-white text-[#1D1D1F] shadow-sm"
                    : "text-[#6E6E73] hover:bg-white hover:text-[#1D1D1F]"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-3xl">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6">
                  <h2 className="mb-6 text-lg font-semibold text-[#1D1D1F]">Profile Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-[#6E6E73]">Full Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full rounded-xl border border-[#E5E5EA] bg-white px-4 py-2.5 text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-[#6E6E73]">Email</label>
                      <input
                        type="email"
                        defaultValue="john@company.com"
                        className="w-full rounded-xl border border-[#E5E5EA] bg-white px-4 py-2.5 text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-[#6E6E73]">Role</label>
                      <select className="w-full rounded-xl border border-[#E5E5EA] bg-white px-4 py-2.5 text-[#1D1D1F] outline-none focus:border-[#1D1D1F]">
                        <option>Writer</option>
                        <option>Reviewer</option>
                        <option>Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button className="rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333]">
                      Save Changes
                    </button>
                    <button className="rounded-full border border-[#D1D1D6] px-4 py-2 text-sm font-medium text-[#6E6E73] transition hover:border-[#1D1D1F] hover:text-[#1D1D1F]">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "company" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6">
                  <h2 className="mb-6 text-lg font-semibold text-[#1D1D1F]">Company Settings</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-[#6E6E73]">Company Name</label>
                      <input
                        type="text"
                        defaultValue="Acme Corporation"
                        className="w-full rounded-xl border border-[#E5E5EA] bg-white px-4 py-2.5 text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-[#6E6E73]">Industry</label>
                      <select className="w-full rounded-xl border border-[#E5E5EA] bg-white px-4 py-2.5 text-[#1D1D1F] outline-none focus:border-[#1D1D1F]">
                        <option>SaaS</option>
                        <option>Healthcare</option>
                        <option>FinTech</option>
                        <option>Insurance</option>
                        <option>Lending</option>
                        <option>Investment</option>
                        <option>Crypto</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-[#6E6E73]">Website</label>
                      <input
                        type="url"
                        placeholder="https://company.com"
                        className="w-full rounded-xl border border-[#E5E5EA] bg-white px-4 py-2.5 text-[#1D1D1F] placeholder-[#AEAEB2] outline-none focus:border-[#1D1D1F]"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333]">
                      Update Company Info
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "compliance" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6">
                  <h2 className="mb-4 text-lg font-semibold text-[#1D1D1F]">Active Compliance Rules</h2>
                  <p className="mb-6 text-sm text-[#6E6E73]">
                    Configure industry-specific compliance rules for automated content checking
                  </p>

                  <div className="space-y-4">
                    {complianceRules.map((rule, index) => (
                      <details
                        key={rule.id}
                        className="rounded-xl border border-[#E5E5EA] bg-[#F5F5F7] p-4 transition hover:border-[#D1D1D6]"
                        open={index === 0}
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-[#1D1D1F]">{rule.name}</h3>
                            <p className="text-sm text-[#6E6E73]">{rule.summary}</p>
                            <p className="mt-1 text-xs text-[#AEAEB2]">{rule.updatedAt}</p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input type="checkbox" defaultChecked className="peer sr-only" />
                            <div className="peer h-6 w-11 rounded-full bg-[#D1D1D6] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-[#1D1D1F] peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                          </label>
                        </summary>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <div className="rounded-lg border border-[#E5E5EA] bg-white p-3">
                            <p className="text-xs font-semibold text-[#1D1D1F]">Included Content</p>
                            <ul className="mt-2 text-xs text-[#6E6E73]">
                              {rule.include.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-lg border border-[#E5E5EA] bg-white p-3">
                            <p className="text-xs font-semibold text-[#1D1D1F]">Excluded Content</p>
                            <ul className="mt-2 text-xs text-[#6E6E73]">
                              {rule.exclude.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-lg border border-[#E5E5EA] bg-white p-3">
                            <p className="text-xs font-semibold text-[#1D1D1F]">Key Checks</p>
                            <ul className="mt-2 text-xs text-[#6E6E73]">
                              {rule.contentChecks.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[#1D1D1F]">API Keys</h2>
                      <p className="mt-1 text-sm text-[#6E6E73]">Manage API keys for programmatic access</p>
                    </div>
                    <button className="rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333]">
                      Generate New Key
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-[#E5E5EA] bg-[#F5F5F7] p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-[#1D1D1F]">Production API Key</h3>
                          <p className="mt-1 font-mono text-sm text-[#6E6E73]">sk_live_••••••••••••3x8k</p>
                          <p className="mt-2 text-xs text-[#AEAEB2]">Last used: 2 hours ago</p>
                        </div>
                        <button className="text-sm text-red-500 hover:text-red-600">Revoke</button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#E5E5EA] bg-[#F5F5F7] p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-[#1D1D1F]">Development API Key</h3>
                          <p className="mt-1 font-mono text-sm text-[#6E6E73]">sk_test_••••••••••••7m2p</p>
                          <p className="mt-2 text-xs text-[#AEAEB2]">Last used: Never</p>
                        </div>
                        <button className="text-sm text-red-500 hover:text-red-600">Revoke</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
