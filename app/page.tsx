"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlignLeft, ChevronDown, Clock, LogOut, MessageSquare, Wand2 } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";

/** Public asset — keep path static so next/image resolves reliably (cache-bust via filename change). */
const HERO_IMAGE_SRC = "/STANDEXAIHERO.jpeg";

const GOLD = "bg-[#E8C547] text-[#0B0B0B] hover:bg-[#f0d060]";
/** Primary copy / display — pure white per landing spec */
const INK = "text-white";
/** Body text on dark — high contrast on charcoal */
const MUTED = "text-[#E6E2DA]";
const LINE = "border-white/[0.12]";

const MODEL_PROVIDERS = [
  "OpenAI",
  "Anthropic",
  "Google Gemini",
  "Azure OpenAI",
  "Amazon Bedrock",
  "Mistral AI",
  "Meta Llama",
  "Cohere",
  "xAI",
  "Groq",
] as const;

function NavArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const session = neonAuthClient.useSession();
  const user = session.data?.user;
  const authPending = session.isPending;
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const openConsole = () => router.push("/console");

  const signOut = async () => {
    setUserMenuOpen(false);
    await neonAuthClient.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#0A0A0A] ${INK} antialiased [font-family:var(--font-standex-sans),ui-sans-serif,sans-serif] text-[16px] font-medium leading-relaxed sm:text-[17px]`}
    >
      {/* Nav — logo + Neon auth (same client as rest of app) */}
      <header
        className={`sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b ${LINE} bg-[#0A0A0A]/90 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-12`}
      >
        <Link href="/" className="flex shrink-0 items-center transition-opacity hover:opacity-90">
          <Image
            src="/standexailogo.png"
            alt="StandexAI"
            width={132}
            height={36}
            className="h-8 w-auto object-contain brightness-0 invert opacity-[0.95]"
            priority
          />
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 md:gap-5" aria-label="Account">
          {authPending ? (
            <span className={`text-[12px] ${MUTED}`}>…</span>
          ) : user ? (
            <>
              <Link
                href="/console"
                className={`inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition ${GOLD}`}
              >
                Console
                <NavArrow className="h-3.5 w-3.5" />
              </Link>
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className={`flex max-w-[220px] items-center gap-1.5 rounded-md border ${LINE} bg-white/[0.04] px-3 py-2 text-left text-[12px] font-medium text-white transition hover:bg-white/[0.08]`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="truncate">{user.name?.trim() || user.email}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 opacity-70 transition ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {userMenuOpen ? (
                  <div
                    role="menu"
                    className={`absolute right-0 top-full z-[60] mt-2 min-w-[180px] rounded-lg border ${LINE} bg-[#141412] py-1 shadow-xl ring-1 ring-black/40`}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => void signOut()}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-white transition hover:bg-white/[0.06]"
                    >
                      <LogOut className="h-4 w-4 shrink-0 opacity-80" strokeWidth={2} />
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${MUTED} transition-colors hover:text-white`}
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className={`text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:text-white/90`}
              >
                Sign up
              </Link>
              <button
                type="button"
                onClick={openConsole}
                className={`inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition ${GOLD}`}
              >
                Open console
                <NavArrow className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Hero — split layout, big serif, image preserved */}
      <section
        className="landing-section-reveal relative isolate border-b border-white/[0.06] [animation-delay:0ms]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(232,197,71,0.06),transparent_50%)]" aria-hidden />
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24 xl:px-16">
          <div>
            <p
              className={`mb-8 text-[11px] font-semibold uppercase tracking-[0.2em] ${MUTED} [font-family:var(--font-console-mono),monospace]`}
            >
              Communications intelligence
            </p>
            <h1
              className="mb-8 text-[clamp(2.75rem,6.5vw,4.75rem)] font-normal leading-[1.02] tracking-[-0.03em] text-white [font-family:var(--font-landing-serif),Georgia,serif]"
            >
              Govern every word your enterprise publishes
            </h1>
            <p className={`mb-10 max-w-xl text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.65] ${MUTED}`}>
              Not a writing toy — a full layer that{" "}
              <span className="font-semibold text-white">generates, analyzes, approves, and archives</span> internal
              and external comms with{" "}
              <span className="font-semibold text-white">regulatory-grade controls and audit trails</span>.
            </p>
            <div className="mb-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openConsole}
                className={`inline-flex items-center gap-2.5 rounded-sm px-8 py-4 text-[12px] font-bold uppercase tracking-[0.1em] transition ${GOLD}`}
              >
                Start in console
                <NavArrow className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Audit-ready history", "Multi-channel publishing", "Text + generation"].map((item) => (
                <span
                  key={item}
                  className={`rounded-full border ${LINE} bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${MUTED}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#E8C547]/[0.07] via-transparent to-[#3dd9c9]/[0.05] blur-xl"
              aria-hidden
            />
            <div
              className={`landing-hero-photo-frame relative overflow-hidden rounded-2xl border border-[#2A2824] bg-[#121110] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]`}
            >
              <div className="border-b border-white/[0.06] px-4 py-3">
                <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${MUTED} [font-family:var(--font-landing-serif),serif]`}>
                  Your communications workspace
                </p>
              </div>
              <div className="landing-hero-photo-float relative h-[min(52vh,480px)] w-full">
                <Image
                  src={HERO_IMAGE_SRC}
                  alt="StandexAI product visualization"
                  fill
                  priority
                  unoptimized
                  className="object-contain object-center p-4 pb-10"
                  sizes="(max-width: 1024px) 92vw, 560px"
                />
              </div>
              <div className="absolute bottom-4 right-4 z-10 flex max-w-[min(100%,18rem)] items-center gap-2.5 rounded-xl border border-white/15 bg-black/75 px-2 py-1.5 shadow-lg backdrop-blur-md">
                <div className="relative h-9 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                  <Image
                    src={HERO_IMAGE_SRC}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                    unoptimized
                  />
                </div>
                <p className="pr-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white [font-family:var(--font-console-mono),monospace]">
                  Powered by Standex models
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by — grid strip */}
        <div className={`border-t ${LINE} bg-[#080807]`}>
          <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 lg:px-12 xl:px-16">
            <p className={`mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] ${MUTED}`}>Trusted by teams like yours</p>
            <div className="landing-dark-grid grid-cols-2 sm:grid-cols-4">
              {["Financial services", "Healthcare & pharma", "Listed companies", "Public sector"].map((label) => (
                <div key={label} className="landing-grid-node px-4 py-5 text-center">
                  <span className={`text-[13px] font-medium ${MUTED}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Model providers — infinite scroll + model-agnostic positioning */}
      <section
        className={`landing-section-reveal border-b border-white/[0.06] bg-[#060606] py-14 sm:py-16 [animation-delay:90ms]`}
        aria-labelledby="model-layer-heading"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-10 max-w-2xl">
            <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${MUTED}`}>Model layer</p>
            <h2
              id="model-layer-heading"
              className="mb-4 text-[clamp(1.5rem,3vw,2rem)] font-normal leading-tight text-white [font-family:var(--font-landing-serif),serif]"
            >
              Works with the models you already trust
            </h2>
            <p className={`text-[1.05rem] leading-relaxed ${MUTED}`}>
              StandexAI is <span className="font-semibold text-white">provider-agnostic</span> — route generation and
              analysis through leading foundation APIs, swap engines as your policy evolves, and keep governance, audit,
              and approvals in one place.
            </p>
          </div>
        </div>
        <div className={`landing-provider-marquee border-y ${LINE} bg-[#080807] py-6`}>
          <div className="landing-provider-marquee-track" role="presentation">
            <ul className="landing-provider-marquee-segment landing-provider-marquee-segment--primary flex shrink-0 items-center gap-10 sm:gap-14 md:gap-16">
              {MODEL_PROVIDERS.map((name) => (
                <li
                  key={`a-${name}`}
                  className="whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.14em] text-white/90"
                >
                  {name}
                </li>
              ))}
            </ul>
            <ul
              className="landing-provider-marquee-segment landing-provider-marquee-segment--duplicate flex shrink-0 items-center gap-10 sm:gap-14 md:gap-16"
              aria-hidden="true"
            >
              {MODEL_PROVIDERS.map((name) => (
                <li
                  key={`b-${name}`}
                  className="whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.14em] text-white/90"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] px-5 pt-8 sm:px-8 lg:px-12 xl:px-16">
          <p className={`text-center text-[13px] leading-relaxed ${MUTED}`}>
            No lock-in to a single vendor — your workflows, your stack, our compliance layer on top.
          </p>
        </div>
      </section>

      {/* Features — split: copy + console mock */}
      <section className="landing-section-reveal border-b border-white/[0.06] px-5 py-20 sm:px-8 lg:px-12 xl:px-16 [animation-delay:160ms]">
        <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-sm bg-[#E8C547]" aria-hidden />
              <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${MUTED}`}>Platform</span>
            </div>
            <h2 className="mb-4 text-[clamp(1.85rem,3.2vw,2.75rem)] font-normal leading-[1.15] text-white [font-family:var(--font-landing-serif),serif]">
              Rigorously ship compliant communications
            </h2>
            <p className={`mb-10 text-[1.05rem] leading-relaxed ${MUTED}`}>
              Audit-ready messaging — from first draft to published output — with expert-style review built in.
            </p>
            <ul className="space-y-6 border-l-2 border-[#E8C547]/50 pl-6">
              {[
                {
                  t: "Eight analysis dimensions",
                  d: "Communication, compliance, intent, AI-style, readability, structure, inclusion, and claims — run individually or all at once.",
                },
                {
                  t: "Version clarity",
                  d: "Transform with built-in modes or saved personas; every pass writes to your history for accountability.",
                },
                {
                  t: "Voice that matches the page",
                  d: "Transform and analysis keep spoken briefs aligned with what legal and IR approved in writing.",
                },
              ].map((row) => (
                <li key={row.t}>
                  <p className="text-[15px] font-semibold text-white">{row.t}</p>
                  <p className={`mt-1 text-[14px] leading-relaxed ${MUTED}`}>{row.d}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={openConsole}
              className={`mt-10 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#E8C547] transition hover:text-[#f0d060]`}
            >
              Open console
              <NavArrow className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-xl border border-[#2A2824] bg-[#0E0E0C] p-1 shadow-2xl ring-1 ring-white/[0.04]">
            <div className="rounded-lg border border-white/[0.06] bg-[#121110] p-5 sm:p-7">
              <p className={`mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] ${MUTED}`}>Non-compliant → compliant</p>
              <div className="space-y-3 rounded-lg border border-white/[0.08] bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-[#C4BFB5]">
                <div>
                  <span className="text-[#f87171]">− </span>
                  &quot;Guaranteed best-in-class outcomes for all patients…&quot;
                </div>
                <div>
                  <span className="text-[#4ade80]">+ </span>
                  &quot;Results varied by cohort; see prescribing information for limitations.&quot;
                </div>
              </div>
              <p className={`mt-4 text-[12px] leading-relaxed ${MUTED}`}>
                Illustrative diff — Workspace highlights risky claims and suggests supportable wording for FDA/MHRA-sensitive contexts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases — arches */}
      <section className="landing-section-reveal relative overflow-hidden border-b border-white/[0.06] px-5 py-24 sm:px-8 lg:px-12 xl:px-16 [animation-delay:220ms]">
        <svg
          className="pointer-events-none absolute inset-x-0 top-0 h-64 w-full text-white/[0.04]"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            d="M0,120 Q400,20 800,120 T1600,120"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            d="M0,180 Q500,80 1000,180 T2000,180"
          />
        </svg>
        <div className="relative mx-auto max-w-[1400px]">
          <p className={`mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] ${MUTED}`}>Use cases</p>
          <h2 className="mb-16 text-center text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.12] text-white [font-family:var(--font-landing-serif),serif]">
            How teams use StandexAI
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                tag: "Regulatory & IR",
                title: "Disclosure-grade external comms",
                body: "Earnings, RNS, and investor updates pass the same bar as your legal review — before they leave the building.",
              },
              {
                tag: "Healthcare",
                title: "Promotional language guardrails",
                body: "Clinical and commercial teams align on FDA/MHRA-safe phrasing with claims analysis and inclusive language checks.",
              },
              {
                tag: "Enterprise",
                title: "Executive messaging at scale",
                body: "C-suite briefing notes become structured drafts with approval routing and a searchable history of what was approved.",
              },
            ].map((u) => (
              <div
                key={u.title}
                className="rounded-xl border border-white/[0.08] bg-[#0E0E0C] p-8 transition hover:border-[#E8C547]/25"
              >
                <p className={`mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#E8C547]/90`}>{u.tag}</p>
                <h3 className="mb-3 text-[1.35rem] font-normal leading-snug text-white [font-family:var(--font-landing-serif),serif]">
                  {u.title}
                </h3>
                <p className={`text-[15px] leading-relaxed ${MUTED}`}>{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview modules + governance — compact */}
      <section className="landing-section-reveal px-5 py-20 sm:px-8 lg:px-12 xl:px-16 [animation-delay:280ms]">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 text-center">
            <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E8C547]`}>What it does</p>
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-normal text-white [font-family:var(--font-landing-serif),serif]">
              Everything your company says, perfected
            </h2>
          </div>
          <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                Icon: AlignLeft,
                area: "Generation",
                strong: "Every format, every channel",
                span: "Press releases, board updates, investor comms, client reports — tone-matched to policy.",
              },
              {
                Icon: Wand2,
                area: "Analysis",
                strong: "Eight parallel passes",
                span: "From readability to claims risk — structured scores and actionable fixes.",
              },
              {
                Icon: MessageSquare,
                area: "Workflow",
                strong: "Brief → draft → approval",
                span: "Structure and route drafts without losing the audit trail.",
              },
              {
                Icon: Clock,
                area: "Publishing",
                strong: "Closed-loop analytics",
                span: "Ship to every channel and feed performance back into the next draft.",
              },
            ].map(({ Icon, area, strong, span }) => (
              <div key={strong} className="bg-[#0A0A0A] p-7">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.1] bg-[#141412] text-[#E8C547]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${MUTED}`}>{area}</span>
                </div>
                <h3 className="mb-2 text-[16px] font-semibold text-white">{strong}</h3>
                <p className={`text-[14px] leading-relaxed ${MUTED}`}>{span}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className={`rounded-xl border ${LINE} bg-[#080807] p-8`}>
              <p className={`mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] ${MUTED}`}>Compliance & governance</p>
              <ul className="space-y-5">
                {[
                  ["Regulatory checks", "Pre-publication checks against GDPR, FCA, SEC, and industry rules."],
                  ["Approval workflows", "Custom rule sets per org, department, and region."],
                  ["Audit trails", "Full history of drafts, edits, approvals, and publications — legal hold ready."],
                ].map(([t, d]) => (
                  <li key={t}>
                    <p className="font-semibold text-white">{t}</p>
                    <p className={`mt-1 text-[14px] leading-relaxed ${MUTED}`}>{d}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`rounded-xl border ${LINE} bg-[#080807] p-8`}>
              <p className={`mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] ${MUTED}`}>Who it&apos;s for</p>
              <p className={`mb-6 text-[15px] leading-relaxed ${MUTED}`}>
                Teams with regulatory exposure, global messaging risk, and high-stakes comms.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Financial services",
                  "Listed companies",
                  "Multinationals",
                  "Professional services",
                  "Public sector",
                  "Healthcare & pharma",
                ].map((label) => (
                  <span
                    key={label}
                    className={`rounded-full border ${LINE} bg-white/[0.04] px-3.5 py-1.5 text-[13px] ${MUTED}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="landing-section-reveal border-t border-white/[0.06] px-5 py-20 sm:px-8 lg:px-12 xl:px-16 [animation-delay:340ms]">
        <div className="mx-auto max-w-[1400px]">
          <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${MUTED}`}>Pricing</p>
          <h2 className="mb-10 text-[clamp(1.75rem,3vw,2.35rem)] font-normal text-white [font-family:var(--font-landing-serif),serif]">
            Seat-based enterprise SaaS
          </h2>
          <div className="landing-dark-grid grid-cols-1 md:grid-cols-3">
            {[
              { tier: "Starter", price: "~$2,000 / mo", seats: "Up to 10 users", desc: "Core generation + basic compliance" },
              { tier: "Professional", price: "~$8,000 / mo", seats: "Up to 50 users", desc: "Full analysis suite + governance" },
              { tier: "Enterprise", price: "Custom", seats: "Unlimited", desc: "Custom rules, workflows, dedicated support" },
            ].map((plan) => (
              <div key={plan.tier} className="p-8">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${MUTED}`}>{plan.tier}</p>
                <p className="mt-4 text-[22px] font-normal text-white [font-family:var(--font-landing-serif),serif]">{plan.price}</p>
                <p className={`mt-2 text-[14px] ${MUTED}`}>{plan.seats}</p>
                <p className={`mt-5 text-[15px] leading-relaxed ${MUTED}`}>{plan.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className={`text-[14px] ${MUTED}`}>Annual contracts, procurement-friendly.</p>
            <button
              type="button"
              onClick={openConsole}
              className={`inline-flex items-center gap-2 rounded-sm px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.1em] transition ${GOLD}`}
            >
              Open console
              <NavArrow className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <footer
        className={`landing-section-reveal flex flex-col items-center justify-between gap-6 border-t ${LINE} bg-[#080807] px-6 py-10 sm:flex-row sm:items-start lg:px-12 [animation-delay:400ms]`}
      >
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <span className={`text-[12px] font-bold uppercase tracking-[0.15em] ${MUTED}`}>StandexAI</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] sm:justify-start" aria-label="Legal">
            <Link href="/trust" className={`${MUTED} transition hover:text-white`}>
              Trust Center
            </Link>
            <Link href="/privacy" className={`${MUTED} transition hover:text-white`}>
              Privacy
            </Link>
            <Link href="/terms" className={`${MUTED} transition hover:text-white`}>
              Terms
            </Link>
            <Link href="/dpa" className={`${MUTED} transition hover:text-white`}>
              DPA
            </Link>
          </nav>
        </div>
        <span className={`text-[13px] ${MUTED}`}>&copy; {new Date().getFullYear()} StandexAI</span>
      </footer>
    </div>
  );
}
