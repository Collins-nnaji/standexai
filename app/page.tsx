"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Shield, CheckCircle2, FileText, AlertTriangle, Terminal } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";

const CORE_SCROLL_LINES = [
  "Standex-Core checks how likely AI models are to cite your brand.",
  "It analyzes model share, sentiment, and competitor mentions.",
  "It tracks where AI gets information: Reddit, Wikipedia, and niche sources.",
  "It calculates a GEO Predictor Score before you publish.",
  "It flags Hallucination Risk when your brand facts are inconsistent.",
  "It compares your content against high-authority topic pages.",
  "It measures your semantic gap from what AI sees as the authority.",
  "It recommends fixes: structure, claims, citations, and llms.txt updates.",
  "It combines GPT, Gemini, and Claude signals into one decision layer.",
  "Output: clearer actions to improve AI visibility and citation chance.",
  "Processing: indexing source signals...",
  "Processing: mapping semantic alignment...",
  "Processing: scoring citation probability...",
  "Processing complete: Standex-Core report ready.",
];

export default function Home() {
  const router = useRouter();
  const session = neonAuthClient.useSession();
  const user = session.data?.user;
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        }
      },
      { threshold: 0.18, rootMargin: "-8% 0px -8% 0px" },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const signOut = async () => {
    await neonAuthClient.signOut();
    router.refresh();
  };

  const handleSignOutClick = async () => {
    if (!confirmSignOut) {
      setConfirmSignOut(true);
      return;
    }
    await signOut();
  };

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F]">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2">
          <Image
            src="/standexailogo.png"
            alt="StandexAI"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <div className="relative ml-auto flex flex-wrap items-center justify-end gap-2 rounded-full border border-[#E5E5EA] bg-white/85 px-2 py-1.5 sm:gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-full px-3 py-1.5 text-[13px] font-semibold tracking-[0.01em] text-[#5A5A61] transition hover:bg-[#F5F5F7] hover:text-[#141418]"
          >
            SEO/GEO Audit
          </button>
          <button
            onClick={() => router.push("/studio/editor")}
            className="rounded-full px-3 py-1.5 text-[13px] font-semibold tracking-[0.01em] text-[#5A5A61] transition hover:bg-[#F5F5F7] hover:text-[#141418]"
          >
            Content Studio
          </button>
          {user ? (
            <>
              <button
                onClick={() => {
                  setProfileMenuOpen((prev) => !prev);
                  setConfirmSignOut(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D1D1F] text-sm font-semibold text-white"
                aria-label="Open profile"
                title={user.name ?? user.email ?? "Profile"}
              >
                {(user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-12 z-20 min-w-48 rounded-2xl border border-[#E5E5EA] bg-white p-2">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/settings");
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[#1D1D1F] transition hover:bg-[#F5F5F7]"
                  >
                    Profile settings
                  </button>
                  <button
                    onClick={() => void handleSignOutClick()}
                    className={`mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                      confirmSignOut ? "bg-red-50 text-red-700 hover:bg-red-100" : "text-[#6E6E73] hover:bg-[#F5F5F7]"
                    }`}
                  >
                    {confirmSignOut ? "Click again to sign out" : "Sign out"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/auth/sign-up")}
                className="rounded-full border border-[#1D1D1F] px-5 py-2.5 text-sm font-medium text-[#1D1D1F] transition hover:bg-[#1D1D1F] hover:text-white"
              >
                Get started
              </button>
              <button
                onClick={() => router.push("/auth/sign-in")}
                className="rounded-full px-3 py-1.5 text-[13px] font-semibold tracking-[0.01em] text-[#5A5A61] transition hover:bg-[#F5F5F7] hover:text-[#141418]"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "0ms" }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E5EA] bg-[#F5F5F7] px-4 py-1.5 text-sm text-[#6E6E73]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                GEO visibility + compliance workflows
              </div>
            </div>

            <h1
              data-reveal
              data-reveal-dir="up"
              style={{ ["--delay" as string]: "120ms" }}
              className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#1D1D1F] sm:mt-8 sm:text-5xl lg:text-[3.6rem] lg:leading-[1.05]"
            >
              Get cited by AI,
              <br />
              <span className="text-[#AEAEB2]">without compliance risk</span>
            </h1>

            <p
              data-reveal
              data-reveal-dir="up"
              style={{ ["--delay" as string]: "180ms" }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-[#6E6E73]"
            >
              Run SEO/GEO audits to see how AI models position your brand, then
              fix gaps in one workflow with ownership verification and a built-in
              content studio.
            </p>

            <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "240ms" }} className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="group flex items-center gap-2 rounded-full bg-[#1D1D1F] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#333]"
              >
                Start SEO/GEO Audit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => router.push("/studio/editor")}
                className="rounded-full border border-[#D1D1D6] px-7 py-3.5 text-sm font-medium text-[#1D1D1F] transition hover:border-[#1D1D1F]"
              >
                Open Content Studio
              </button>
            </div>

          </div>

          <div
            data-reveal
            data-reveal-dir="left"
            style={{ ["--delay" as string]: "220ms" }}
            className="p-1"
          >
            <div data-reveal data-reveal-dir="left" style={{ ["--delay" as string]: "290ms" }} className="max-w-xl rounded-2xl border border-[#1F2430] bg-[#0D111A] p-4 text-white">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">System Access: Standex-Core v4.1</p>
                <Terminal className="h-4 w-4 text-white/75" />
              </div>
              <p className="text-sm leading-relaxed text-white/85">
                Most tools are generic wrappers. Standex-Core is our proprietary GEO engine tuned for citation probability, hallucination risk, and vector alignment signals.
              </p>
              <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300/75">Core Stream</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/55">Live analysis</p>
                </div>
                <div className="relative h-64 overflow-hidden rounded-lg border border-white/10 bg-[#0A0D14] px-2 py-1.5 font-mono text-[11px] text-emerald-200/85 sm:h-80">
                  <div className="core-scroll-track space-y-1.5">
                    {[...CORE_SCROLL_LINES, ...CORE_SCROLL_LINES].map((line, idx) => (
                      <p key={`${line}-${idx}`}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-white/55">Optimized for 2026 model weights</p>
            </div>
          </div>
        </div>

        {/* Hero Visual - Scan Result Demo */}
        <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "320ms" }} className="mt-10 sm:mt-14">
          <div className="overflow-hidden rounded-2xl border border-[#D1D1D6] bg-white p-2 shadow-2xl shadow-black/10">
            <div className="overflow-x-auto rounded-xl border border-[#D8DCE6] bg-[linear-gradient(170deg,#f8f9fc_0%,#eef2f9_65%,#eaedf5_100%)]">
              <div className="flex items-center gap-2 border-b border-[#D8DCE6] bg-[#121722] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="mx-auto rounded-lg border border-white/10 bg-white/10 px-4 py-1 text-xs text-white/70">
                  app.standexai.com/dashboard
                </div>
              </div>

              <div className="min-w-[900px] p-5">
                <div className="rounded-xl border border-[#D7DCE7] bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E8E93]">SEO/GEO Audit Workspace</p>
                    <span className="rounded-full border border-[#D1D1D6] bg-[#F7F8FC] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#545762]">
                      Report Sample (Demo)
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-[1.2fr_1fr_auto]">
                    <div className="rounded-lg border border-[#D8DCE6] bg-[#FAFBFF] px-3 py-2 text-sm text-[#1D1D1F]">
                      acmehealth.com
                    </div>
                    <div className="rounded-lg border border-[#D8DCE6] bg-[#FAFBFF] px-3 py-2 text-sm text-[#1D1D1F]">
                      best ai healthcare platform
                    </div>
                    <button className="rounded-lg bg-[#111827] px-3 py-2 text-xs font-semibold text-white">Generate Report</button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-[1.35fr_0.65fr]">
                  <div className="rounded-xl border border-[#D7DCE7] bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#1D1D1F]">GEO Health Report Sample</p>
                      <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">Live</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2">
                        <p className="text-[10px] text-emerald-700">GEO Score</p>
                        <p className="text-lg font-semibold text-emerald-700">72</p>
                      </div>
                      <div className="rounded-lg border border-[#D8DCE6] bg-[#F8F9FD] p-2">
                        <p className="text-[10px] text-[#6E6E73]">Share of Model</p>
                        <p className="text-lg font-semibold text-[#1D1D1F]">61%</p>
                      </div>
                      <div className="rounded-lg border border-[#F2D88B] bg-[#FFF8E5] p-2">
                        <p className="text-[10px] text-[#8A6A00]">Sentiment</p>
                        <p className="text-lg font-semibold text-[#8A6A00]">Neutral</p>
                      </div>
                      <div className="rounded-lg border border-[#D8DCE6] bg-[#F8F9FD] p-2">
                        <p className="text-[10px] text-[#6E6E73]">Citation Sources</p>
                        <p className="text-lg font-semibold text-[#1D1D1F]">3</p>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <div className="rounded-lg border border-[#D8DCE6] bg-[#FAFBFF] p-2.5">
                        <p className="mb-1 text-[11px] font-semibold text-[#1D1D1F]">Model Results</p>
                        <p className="text-[11px] text-[#6E6E73]">GPT-4o: mentioned, neutral</p>
                        <p className="text-[11px] text-[#6E6E73]">Claude 3.5: mentioned, positive</p>
                        <p className="text-[11px] text-[#6E6E73]">Gemini: not mentioned</p>
                      </div>
                      <div className="rounded-lg border border-[#D8DCE6] bg-[#FAFBFF] p-2.5">
                        <p className="mb-1 text-[11px] font-semibold text-[#1D1D1F]">Citation Audit</p>
                        <p className="text-[11px] text-[#6E6E73]">Reddit: high signal</p>
                        <p className="text-[11px] text-[#6E6E73]">Wikipedia: weak signal</p>
                        <p className="text-[11px] text-[#6E6E73]">Hacker News: not found</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8E8E93]">Red Areas (Fix First)</p>
                      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">No llms.txt found on root domain.</div>
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-700">Model mentions are mostly competitor-biased.</div>
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">Quick win: add FAQ schema to core landing page.</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-[#D7DCE7] bg-white p-4">
                      <p className="text-xs font-semibold text-[#1D1D1F]">Fix-It Output Sample</p>
                      <div className="mt-2 rounded-lg border border-[#D8DCE6] bg-[#FAFBFF] p-2">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-[#8E8E93]">AI-Optimized Blurb</p>
                        <p className="mt-1 text-xs text-[#555560]">AcmeHealth helps care teams automate operations with compliant AI workflows...</p>
                      </div>
                      <button className="mt-3 w-full rounded-lg bg-[#1D1D1F] px-3 py-2 text-xs font-semibold text-white">
                        Send To Editor
                      </button>
                    </div>

                    <div className="rounded-xl border border-[#D7DCE7] bg-[#111827] p-4">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">Technical Fix</p>
                      <div className="mt-2 rounded-lg border border-white/15 bg-black/20 p-2 font-mono text-[10px] text-white/80">
                        llms.txt ready<br />
                        site: https://acmehealth.com<br />
                        keyword_focus: best ai healthcare platform
                      </div>
                      <button className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#111827]">
                        Download llms.txt
                      </button>
                      <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-red-300/30 bg-red-500/15 px-2 py-1.5 text-[10px] text-red-100">
                        <AlertTriangle className="h-3 w-3" />
                        1 hallucinated claim detected.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Merged Into Hero */}
        <div className="mt-12 border-t border-[#E5E5EA] pt-12 sm:mt-14 sm:pt-14">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div data-reveal data-reveal-dir="left" className="space-y-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8E8E93]">How It Works</p>
              <h2 className="text-4xl font-semibold leading-[1.03] tracking-tight text-[#141418] sm:text-[2.8rem]">
                From scan to publish
              </h2>
              <p className="max-w-md text-[17px] leading-relaxed text-[#57575f]">
                One continuous workflow: generate a report sample, unlock fixes with verification, then ship from Content Studio.
              </p>
              <div className="max-w-md rounded-2xl border border-[#D6DBE7] bg-[linear-gradient(160deg,#f8f9fc_0%,#f1f4fa_55%,#eef1f8_100%)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#6A6F7A]">System Rail</p>
                <div className="mt-3 space-y-2">
                  {[
                    { label: "Scan", icon: Shield },
                    { label: "Verify", icon: CheckCircle2 },
                    { label: "Publish", icon: FileText },
                  ].map((step) => (
                    <div key={step.label} className="flex items-center gap-2 rounded-lg border border-white/70 bg-white/80 px-3 py-2">
                      <step.icon className="h-4 w-4 text-[#1D1D1F]" />
                      <p className="text-sm font-semibold text-[#1D1D1F]">{step.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div data-reveal data-reveal-dir="right" className="rounded-2xl border border-[#D6DBE7] bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-4 shadow-[0_18px_46px_rgba(17,17,26,0.1)] sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8E8E93]">Execution Sequence</p>
                <span className="rounded-full border border-[#D1D1D6] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#61656F]">
                  Operator View
                </span>
              </div>
              <div className="space-y-3.5">
                {[
                  {
                    num: "01",
                    title: "Run visibility report",
                    desc: "Enter URL + keyword. StandexAI returns GEO score, model share, sentiment, and citation source findings.",
                    icon: Shield,
                  },
                  {
                    num: "02",
                    title: "Unlock fix mode",
                    desc: "Verify ownership through llms.txt, meta tag, or DNS to activate strategy actions and correction workflows.",
                    icon: CheckCircle2,
                  },
                  {
                    num: "03",
                    title: "Ship in Content Studio",
                    desc: "Send recommendations to Content Studio, rewrite with guardrails, and publish with confidence.",
                    icon: FileText,
                  },
                ].map((step, idx) => (
                  <div key={step.num} className="group relative rounded-xl border border-[#E2E6F0] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#C9D0DF]">
                    {idx < 2 ? <div className="absolute left-8 top-full h-4 w-px bg-[#D9DEE8]" /> : null}
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#13141A] text-[11px] font-semibold text-white">
                        {step.num}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <step.icon className="h-4 w-4 text-[#5F6470]" />
                          <h3 className="text-[15px] font-semibold text-[#16181D]">{step.title}</h3>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-[#555B66]">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#141418] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
              >
                Open SEO/GEO Audit
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Social Proof */}
      <section className="border-t border-[#E5E5EA] bg-[#FAFAFA]">
        <div data-reveal data-reveal-dir="up" className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-center text-sm font-medium text-[#AEAEB2]">
            Built for growth teams and regulated industries
          </p>
          <div className="mt-6 flex items-center justify-center gap-12">
            {["GEO", "SEO", "HIPAA", "FTC", "SEC"].map((item) => (
              <span key={item} className="text-lg font-semibold tracking-wide text-[#D1D1D6]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E5EA] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <Image
              src="/standexailogo.png"
              alt="StandexAI"
              width={120}
              height={36}
              className="h-8 w-auto object-contain opacity-50"
            />
            <p className="text-sm text-[#AEAEB2]">
              &copy; 2026 StandexAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        [data-reveal] {
          --x: 0px;
          --y: 24px;
          --delay: 0ms;
          opacity: 0.01;
          transform: translate3d(var(--x), var(--y), 0) scale(0.985);
          filter: blur(4px);
          transition:
            opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 700ms cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: var(--delay);
          will-change: transform, opacity, filter;
        }

        [data-reveal][data-reveal-dir="left"] {
          --x: -32px;
          --y: 0px;
        }

        [data-reveal][data-reveal-dir="right"] {
          --x: 32px;
          --y: 0px;
        }

        [data-reveal][data-reveal-dir="up"] {
          --x: 0px;
          --y: 28px;
        }

        [data-reveal][data-reveal-dir="down"] {
          --x: 0px;
          --y: -28px;
        }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          filter: blur(0);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
        }

        .scroll-strip {
          scrollbar-width: thin;
        }

        .scroll-strip::-webkit-scrollbar {
          height: 8px;
        }

        .scroll-strip::-webkit-scrollbar-thumb {
          background: #d1d1d6;
          border-radius: 9999px;
        }

        .core-scroll-track {
          animation: coreVerticalScroll 26s linear infinite;
        }

        @keyframes coreVerticalScroll {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }
      `}</style>
    </div>
  );
}
