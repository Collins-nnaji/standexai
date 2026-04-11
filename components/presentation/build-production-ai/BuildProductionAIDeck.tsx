"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Home,
} from "lucide-react";
import { deckImages } from "./presentation-assets";
import { DeckBrandLogos, DeckLearningOutcomes } from "./DeckSlidePanels";
import {
  MockAgentBuilder,
  MockAzureFoundry,
  MockCursorEditor,
  MockGitHub,
  MockGoogleAds,
  MockGoogleAnalytics,
  MockGoogleOAuth,
  MockModelProviders,
  MockNeon,
  MockRAGWeek,
  MockShadcn,
  MockStackMontage,
  MockStripe,
  MockVercel,
  MockCohort,
  MockMentorship,
} from "./mockups";

export type SlideDef = {
  id: string;
  sceneLabel: string;
  headline: string;
  voiceover: string[];
  pace?: "slow";
  mockup?: ReactNode;
  /** Brand row only when the mockup does not already repeat the same logos (avoids duplicates). */
  logos: { src: string; alt: string; caption?: string }[];
  wordmarks?: string[];
  learningOutcomes: string[];
};

const SLIDES: SlideDef[] = [
  {
    id: "s1",
    sceneLabel: "Scene 1",
    headline: "This is where you build production AI systems.",
    voiceover: [
      "This isn’t another AI course.",
      "This is where you build production AI systems.",
    ],
    logos: [
      { src: deckImages.cursor, alt: "Cursor" },
      { src: deckImages.react, alt: "React" },
      { src: deckImages.nextjs, alt: "Next.js" },
      { src: deckImages.github, alt: "GitHub" },
      { src: deckImages.vercel, alt: "Vercel" },
      { src: deckImages.neon, alt: "Neon" },
    ],
    learningOutcomes: [
      "Reframe “learning AI” as shipping runnable systems every week—not passive video consumption.",
      "Name the core layers of a production AI product: app surface, APIs, data, models, auth, and deploy.",
      "Commit to a portfolio of deployed artifacts you can show to teams and clients.",
    ],
  },
  {
    id: "s2",
    sceneLabel: "Scene 2",
    headline: "Cursor · React · Next.js",
    voiceover: [
      "You start inside Cursor — an AI-powered code editor…",
      "Building with React — for fast, interactive interfaces…",
      "And Next.js — a full-stack framework for production apps.",
    ],
    logos: [],
    learningOutcomes: [
      "Use an AI-native editor workflow to refactor, test, and scaffold Next.js features safely.",
      "Structure React components and client/server boundaries appropriate for App Router.",
      "Ship interactive UI that stays fast: loading states, streaming, and sensible data fetching patterns.",
    ],
    mockup: <MockCursorEditor />,
  },
  {
    id: "s3",
    sceneLabel: "Scene 3",
    headline: "GitHub",
    voiceover: [
      "Your code lives on GitHub…",
      "Where you manage, version, and collaborate like real engineers.",
    ],
    logos: [],
    learningOutcomes: [
      "Use branches, PRs, and reviews so every weekly ship has a clear trail.",
      "Organize repos for Next.js + AI services (apps, packages, CI configs).",
      "Collaborate asynchronously with issues, checklists, and actionable commit history.",
    ],
    mockup: <MockGitHub />,
  },
  {
    id: "s4",
    sceneLabel: "Scene 4",
    headline: "Vercel",
    voiceover: ["Then deploy with Vercel…", "Instantly live. Globally fast."],
    logos: [],
    learningOutcomes: [
      "Deploy production and preview environments tied to every branch and PR.",
      "Configure environment variables, regions, and edge behavior for AI workloads.",
      "Read deploy logs and roll forward or roll back with confidence.",
    ],
    mockup: <MockVercel />,
  },
  {
    id: "s5",
    sceneLabel: "Scene 5",
    headline: "Neon",
    voiceover: [
      "Your backend runs on Neon…",
      "A serverless database built to scale with your product.",
    ],
    logos: [],
    learningOutcomes: [
      "Provision serverless Postgres and connect it securely from Next.js.",
      "Use database branching for preview apps and safe schema experiments.",
      "Model relational data for AI apps: users, sessions, messages, and vector columns when needed.",
    ],
    mockup: <MockNeon />,
  },
  {
    id: "s6",
    sceneLabel: "Scene 6",
    headline: "Best-in-class models",
    voiceover: [
      "You build with the world’s best models…",
      "OpenAI — for powerful AI capabilities…",
      "Claude — for deep reasoning…",
      "And Google — for scalable intelligence.",
    ],
    logos: [],
    learningOutcomes: [
      "Choose models by capability, latency, cost, and safety needs—not hype.",
      "Integrate provider SDKs with retries, timeouts, streaming, and structured outputs.",
      "Design fallbacks and monitoring so users still get value when a vendor degrades.",
    ],
    mockup: <MockModelProviders />,
  },
  {
    id: "s7",
    sceneLabel: "Scene 7",
    headline: "Agent systems",
    voiceover: [
      "Using agent systems…",
      "You create AI that doesn’t just respond—",
      "But takes action.",
    ],
    logos: [],
    learningOutcomes: [
      "Design agent loops: plan → tool call → observe → verify before responding to users.",
      "Register tools with strict schemas and handle partial failures gracefully.",
      "Log traces of agent decisions for debugging and production audits.",
    ],
    mockup: <MockAgentBuilder />,
  },
  {
    id: "s8",
    sceneLabel: "Scene 8",
    headline: "Week 3 — memory & RAG",
    voiceover: [
      "By Week 3…",
      "You give your AI memory.",
      "With embeddings, vector search, and retrieval systems…",
      "Your AI becomes context-aware.",
    ],
    pace: "slow",
    logos: [],
    learningOutcomes: [
      "Chunk documents, generate embeddings, and store them alongside metadata in Postgres.",
      "Query vectors with similarity search and optional filters (tenant, doc type, date).",
      "Inject retrieved context into prompts with citations and guardrails against empty retrieval.",
    ],
    mockup: <MockRAGWeek />,
  },
  {
    id: "s9",
    sceneLabel: "Scene 9",
    headline: "Google OAuth",
    voiceover: ["You implement Google OAuth…", "So users can securely sign in."],
    logos: [],
    learningOutcomes: [
      "Implement OAuth with Google and map identities to users in your database.",
      "Issue secure sessions (cookies or tokens) and protect server actions / API routes.",
      "Handle sign-out, refresh, and basic abuse scenarios in a production-minded way.",
    ],
    mockup: <MockGoogleOAuth />,
  },
  {
    id: "s10",
    sceneLabel: "Scene 10",
    headline: "shadcn UI",
    voiceover: [
      "Design clean, modern interfaces…",
      "With shadcn — production-ready UI components.",
    ],
    logos: [],
    learningOutcomes: [
      "Compose accessible UI from copy-paste primitives (dialogs, sheets, forms, tables).",
      "Keep design consistent with tokens, typography, and spacing that scale across pages.",
      "Ship faster without sacrificing polish: states, empty views, and keyboard flows.",
    ],
    mockup: <MockShadcn />,
  },
  {
    id: "s11",
    sceneLabel: "Scene 11",
    headline: "Google Analytics",
    voiceover: [
      "Track user behavior with Google Analytics…",
      "Understand what’s working.",
    ],
    logos: [],
    learningOutcomes: [
      "Instrument key product events: activation, AI feature usage, and conversion.",
      "Build funnels that reflect real user journeys—not vanity pageviews.",
      "Turn dashboards into decisions: where to improve onboarding and model UX.",
    ],
    mockup: <MockGoogleAnalytics />,
  },
  {
    id: "s12",
    sceneLabel: "Scene 12",
    headline: "Google Ads",
    voiceover: ["Then scale with Google Ads…", "And bring real users to your product."],
    logos: [],
    learningOutcomes: [
      "Structure Search, Performance Max, and retargeting campaigns with clear goals.",
      "Track ad-driven signups and purchases back to landing experiences.",
      "Iterate creative and keywords using cost, CTR, and ROAS—not guesses.",
    ],
    mockup: <MockGoogleAds />,
  },
  {
    id: "s13",
    sceneLabel: "Scene 13",
    headline: "Azure · Foundry",
    voiceover: [
      "Power it all with Azure…",
      "Storage for your data…",
      "And Foundry — for building and managing AI at scale.",
    ],
    logos: [],
    learningOutcomes: [
      "Store assets and datasets in Azure Blob with sane permissions and lifecycle rules.",
      "Understand how Azure AI Foundry supports model catalog, evals, and governance patterns.",
      "Fit cloud AI services into a hybrid architecture with your app on Vercel and DB on Neon.",
    ],
    mockup: <MockAzureFoundry />,
  },
  {
    id: "s14",
    sceneLabel: "Scene 14",
    headline: "Stripe",
    voiceover: ["And monetize with Stripe…", "Payments. Subscriptions. Revenue."],
    logos: [],
    learningOutcomes: [
      "Launch Stripe Checkout and Customer Portal for cards and subscriptions.",
      "Verify webhooks idempotently and persist billing state in Postgres.",
      "Report MRR/churn basics and protect routes for paying vs free users.",
    ],
    mockup: <MockStripe />,
  },
  {
    id: "s15",
    sceneLabel: "Scene 15",
    headline: "The modern AI stack",
    voiceover: [
      "GitHub. Vercel. Neon. OpenAI. Azure. Stripe.",
      "This is the modern AI stack.",
    ],
    logos: [],
    learningOutcomes: [
      "Draw your own end-to-end diagram: editor → repo → deploy → DB → models → auth → payments.",
      "Explain how data flows from user input to model output—and where it persists.",
      "Prioritize reliability: backups, secrets, observability, and cost controls across services.",
    ],
    mockup: <MockStackMontage />,
  },
  {
    id: "s16",
    sceneLabel: "Scene 16",
    headline: "Cohort",
    voiceover: [
      "6 weeks.",
      "2 live sessions per week.",
      "1 product shipped every week.",
    ],
    logos: [],
    learningOutcomes: [
      "Scope weekly milestones so each deliverable is demoable in under ten minutes.",
      "Use live sessions for unblocking, design review, and accountability—not passive lectures.",
      "Build a public trail of shipped work suitable for interviews and clients.",
    ],
    mockup: <MockCohort />,
  },
  {
    id: "s17",
    sceneLabel: "Scene 17",
    headline: "Mentorship",
    voiceover: ["With live mentorship…", "And production-grade standards."],
    logos: [],
    learningOutcomes: [
      "Apply mentor feedback on PRs to raise code quality, naming, and structure.",
      "Adopt checklists for errors, logging, and UX edge cases before calling a feature “done”.",
      "Practice explaining tradeoffs aloud—the same skill you’ll use with real stakeholders.",
    ],
    mockup: <MockMentorship />,
  },
  {
    id: "s18",
    sceneLabel: "Scene 18",
    headline: "Don’t just learn AI. Build it.",
    voiceover: ["Don’t just learn AI.", "Build it."],
    logos: [
      { src: deckImages.nextjs, alt: "Next.js" },
      { src: deckImages.github, alt: "GitHub" },
      { src: deckImages.vercel, alt: "Vercel" },
    ],
    learningOutcomes: [
      "Ship a cohesive product story: problem → AI approach → live URL → metrics → monetization path.",
      "Own debugging across the full stack when something breaks in production.",
      "Leave the cohort with artifacts that prove you can build, not just talk about, AI systems.",
    ],
  },
  {
    id: "s19",
    sceneLabel: "CTA",
    headline: "Start now",
    voiceover: ["Start now."],
    logos: [],
    learningOutcomes: [
      "Complete the free assessment to benchmark your AI engineering baseline.",
      "Get a clear read on strengths and gaps before the cohort kicks off.",
      "Lock in your seat and prep your environment so week one is pure building.",
    ],
  },
];

export function BuildProductionAIDeck() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const total = SLIDES.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => Math.min(Math.max(0, i + dir), total - 1));
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
      if (e.key === "Home") setIndex(0);
      if (e.key === "End") setIndex(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total]);

  const isCta = slide.id === "s19";
  const hasMockup = Boolean(slide.mockup);
  const isSpotlight = !hasMockup;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("h-full", "overflow-hidden");
    body.classList.add("h-full", "overflow-hidden");
    return () => {
      html.classList.remove("h-full", "overflow-hidden");
      body.classList.remove("h-full", "overflow-hidden");
    };
  }, []);

  const fontSans = "[font-family:var(--font-standex-sans),ui-sans-serif,sans-serif]";

  const sceneEl = (
    <p
      className={`font-extrabold uppercase tracking-[0.2em] text-[#7C5CFC] text-xs sm:text-sm ${fontSans}`}
    >
      {slide.sceneLabel}
      {slide.pace === "slow" ? " · slower pacing" : ""}
    </p>
  );

  const headlineEl = (
    <h1
      className={`font-extrabold tracking-tight text-zinc-950 ${fontSans} ${
        isSpotlight
          ? "max-w-[min(100%,26ch)] text-[clamp(2.35rem,7.5vmin,5.85rem)] leading-[0.96] sm:max-w-[28ch]"
          : "max-w-[min(100%,40ch)] text-[clamp(1.9rem,5.2vmin,4.35rem)] leading-[1.05] lg:max-w-[36ch]"
      }`}
    >
      {isCta ? (
        <>
          <span className="block text-[#7C5CFC]">Build Production AI</span>
          <span
            className={`mt-1.5 block text-[clamp(1.15rem,3vmin,1.9rem)] font-bold text-zinc-600 ${fontSans}`}
          >
            Starts May 5th
          </span>
        </>
      ) : (
        slide.headline
      )}
    </h1>
  );

  const voiceoverEl = (
    <div
      className={`w-full max-w-5xl ${hasMockup ? "text-center lg:text-left" : "text-center"} ${slide.pace === "slow" ? "space-y-2" : "space-y-1.5"} ${fontSans}`}
    >
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">
        Voiceover
      </p>
      <div
        className={`font-semibold text-zinc-700 ${slide.pace === "slow" ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}
      >
        {slide.voiceover.map((line, i) => (
          <p key={i} className="leading-relaxed">
            <span className="mr-2 select-none font-bold text-[#7C5CFC]/50">·</span>
            {line}
          </p>
        ))}
      </div>
    </div>
  );

  const padX = "px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20";

  return (
    <div
      className={`flex h-full min-h-0 flex-col bg-zinc-100 text-zinc-900 antialiased ${fontSans}`}
    >
      <header
        className={`flex shrink-0 items-center justify-between gap-2 border-b border-zinc-200/90 bg-white py-1.5 sm:gap-3 sm:py-2 ${padX}`}
      >
        <div className="flex min-w-0 items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-zinc-600 sm:gap-2.5 sm:text-xs">
          <Clapperboard className="h-4 w-4 shrink-0 text-[#7C5CFC]" />
          <span className="truncate">Build Production AI — deck</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xs font-bold tabular-nums text-zinc-500 sm:inline">
            {index + 1} / {total}
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 transition-colors hover:bg-zinc-200 sm:text-xs"
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>
      </header>

      <main className={`flex min-h-0 flex-1 flex-col ${padX} pb-1.5 pt-2 sm:pb-2 sm:pt-2.5`}>
        <div className="mx-auto flex h-full min-h-0 w-full max-w-[1540px] flex-col">
          {hasMockup ? (
            <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-1.5 sm:gap-2 lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-x-5 lg:gap-y-1 xl:gap-x-7">
              <div className="flex flex-col items-center gap-1 text-center lg:col-span-12 lg:items-start lg:gap-1.5 lg:text-left">
                {sceneEl}
                {headlineEl}
              </div>

              <div className="flex min-h-0 flex-col justify-center gap-2 overflow-hidden rounded-xl bg-zinc-200/50 p-3 ring-1 ring-zinc-300/50 sm:p-3.5 lg:col-span-5 lg:row-start-2 lg:gap-2.5">
                <DeckBrandLogos logos={slide.logos} wordmarks={slide.wordmarks} density="deck" />
                <DeckLearningOutcomes items={slide.learningOutcomes} density="deck" />
              </div>

              <div className="relative flex min-h-0 items-stretch justify-center overflow-hidden rounded-xl bg-white p-2 ring-1 ring-zinc-200 shadow-sm sm:p-3 lg:col-span-7 lg:row-start-2">
                <div className="flex h-full max-h-[min(50vh,580px)] w-full max-w-full items-center justify-center sm:max-h-[min(54vh,640px)] lg:max-h-[min(70vh,780px)]">
                  <div className="max-h-full w-full min-w-0 overflow-hidden [&>*]:max-h-full">
                    {slide.mockup}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-zinc-200/80 lg:col-span-12 lg:row-start-3">
                {voiceoverEl}
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
              <div className="w-full max-w-3xl rounded-2xl bg-white px-5 py-6 shadow-md ring-1 ring-zinc-200/90 sm:max-w-4xl sm:px-8 sm:py-8">
                <div className="flex flex-col items-center gap-2.5 text-center sm:gap-3">
                  {sceneEl}
                  {slide.id === "s1" ? (
                    <p className="max-w-2xl text-lg font-semibold text-zinc-600 sm:text-xl">
                      This isn’t another AI course.
                    </p>
                  ) : null}
                  {headlineEl}
                </div>
                <div className="mt-4 sm:mt-5">
                  <DeckBrandLogos logos={slide.logos} wordmarks={slide.wordmarks} density="deck" />
                </div>
                <div className="mt-4 sm:mt-5">
                  <DeckLearningOutcomes items={slide.learningOutcomes} density="deck" />
                </div>
                <div className="mt-4 border-t border-zinc-100 pt-4 sm:mt-5">{voiceoverEl}</div>
                {isCta ? (
                  <Link
                    href="/assessment"
                    className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#7C5CFC] px-8 py-4 text-base font-extrabold uppercase tracking-widest text-white shadow-lg shadow-[#7C5CFC]/20 transition-colors hover:bg-[#6d4fe0] sm:py-5 sm:text-lg"
                  >
                    Take the free assessment
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={`shrink-0 border-t border-zinc-200 bg-white py-1.5 sm:py-2 ${padX}`}>
        <div className="mx-auto flex max-w-[1540px] flex-col items-center justify-between gap-2 sm:flex-row sm:gap-3">
          <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto sm:justify-start">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="rounded-lg bg-zinc-50 p-2 text-zinc-800 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-100 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(1)}
                disabled={index === total - 1}
                className="rounded-lg bg-zinc-50 p-2 text-zinc-800 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-100 disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <p className="hidden text-xs text-zinc-500 sm:block">← → Space · Home / End</p>
          </div>

          <div className="flex max-w-2xl flex-wrap justify-center gap-1">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-[#7C5CFC]" : "w-2 bg-zinc-300 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
