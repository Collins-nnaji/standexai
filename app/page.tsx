"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, FileText, Mic, PenTool, Sparkles } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";

const QUICK_LINKS = [
  { name: "Writing Lab", href: "/writing-lab", icon: FileText, iconClass: "text-indigo-600" },
  { name: "Voice", href: "/writing-lab?voice=1", icon: Mic, iconClass: "text-violet-600" },
  { name: "Coach", href: "/agent", icon: Bot, iconClass: "text-indigo-700" },
  { name: "Transform", href: "/writing-lab?workspace=rewrite", icon: PenTool, iconClass: "text-emerald-600" },
];

/** Small audience markers — not exclusive; helps visitors self-identify */
const AUDIENCE_FLAGS = [
  "Email & lifecycle marketers",
  "Comms & brand teams",
  "HR & people ops",
  "Sales & customer success",
  "Product & content",
  "Legal & compliance",
  "Agencies & consultants",
];

/** Full-bleed decorative layer — vector graphic spanning viewport width */
function HeroBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <svg
        className="h-full w-full min-h-[520px] text-indigo-500/15"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1600 900"
      >
        <defs>
          <linearGradient id="landingGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.35" />
            <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="landingGradB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(79, 70, 229)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <pattern id="landingGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-zinc-900/[0.06]"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#landingGrid)" />
        <ellipse cx="200" cy="120" rx="380" ry="280" fill="url(#landingGradA)" style={{ filter: "blur(64px)" }} />
        <ellipse cx="1300" cy="680" rx="420" ry="320" fill="url(#landingGradB)" style={{ filter: "blur(72px)" }} />
        <ellipse cx="900" cy="200" rx="200" ry="160" fill="rgb(99, 102, 241)" fillOpacity="0.08" style={{ filter: "blur(48px)" }} />
        <path
          d="M0 420 Q400 280 800 380 T1600 320"
          fill="none"
          stroke="rgb(79, 70, 229)"
          strokeOpacity="0.12"
          strokeWidth="2"
        />
        <path
          d="M0 520 Q500 640 1000 480 T1600 560"
          fill="none"
          stroke="rgb(139, 92, 246)"
          strokeOpacity="0.1"
          strokeWidth="1.5"
        />
        <path
          d="M100 750 Q600 600 1100 720 T1650 650"
          fill="none"
          stroke="rgb(79, 70, 229)"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
        <g stroke="rgb(79, 70, 229)" strokeOpacity="0.15" strokeWidth="1.25" fill="none">
          <circle cx="1280" cy="180" r="8" />
          <circle cx="1320" cy="220" r="5" />
          <line x1="1280" y1="180" x2="1320" y2="220" />
          <circle cx="320" cy="640" r="6" />
          <circle cx="280" cy="600" r="4" />
          <line x1="320" y1="640" x2="280" y2="600" />
        </g>
        <g fill="rgb(79, 70, 229)" fillOpacity="0.06">
          <rect x="1180" y="480" width="120" height="16" rx="4" transform="rotate(-8 1240 488)" />
          <rect x="1220" y="520" width="80" height="12" rx="3" transform="rotate(-8 1260 526)" />
          <rect x="240" y="220" width="100" height="14" rx="3" transform="rotate(6 290 227)" />
          <rect x="260" y="248" width="64" height="10" rx="2" transform="rotate(6 292 253)" />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const session = neonAuthClient.useSession();
  const user = session.data?.user;

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <header className="relative z-20 flex w-full flex-col gap-4 border-b border-zinc-200/80 bg-white/90 px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-8 sm:py-4 lg:px-12">
        <div className="flex items-center gap-3">
          <Image
            src="/standexailogo.png"
            alt="StandexAI"
            width={140}
            height={36}
            className="h-8 w-auto object-contain sm:h-9"
            priority
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto sm:gap-3">
          {user ? (
            <button
              type="button"
              onClick={() => router.push("/console")}
              className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800"
            >
              Console
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => router.push("/auth/sign-in")}
                className="rounded-full px-4 py-2.5 text-sm font-bold text-zinc-500 transition hover:text-zinc-950"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => router.push("/console")}
                className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800"
              >
                Open console
              </button>
            </>
          )}
        </div>
      </header>

      <main className="relative flex flex-1 flex-col">
        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <HeroBackdrop />

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border-2 border-indigo-200/80 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-800 shadow-sm backdrop-blur-sm sm:text-sm">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Standard for communication in the AI era
            </div>

            <h1 className="max-w-5xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl sm:leading-[1.02] lg:text-7xl lg:leading-[0.98]">
              Standardize what you publish
              <br />
              in the age of AI content.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                One workspace.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg font-semibold leading-relaxed text-zinc-600 sm:text-xl sm:leading-relaxed">
              StandexAI is a communication standardizer: when drafts blend AI-generated text, human edits, and strong claims, you set a consistent bar for tone, risk, compliance, and AI authorship — then rewrite with intent. Review, detect, and transform in one flow.
            </p>

            <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-zinc-500 sm:text-lg">
              AI-style detection uses multi-signal scoring (phrasing, structure, and confidence patterns) through structured LLM analysis — designed for explainable results, not a single black-box number.
            </p>

            <div className="mt-6 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Built for</p>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2" aria-label="Target audiences">
                {AUDIENCE_FLAGS.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-md border border-zinc-200/90 bg-white/90 px-2 py-1 text-[10px] font-semibold text-zinc-600 shadow-sm backdrop-blur-sm sm:text-[11px]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/console")}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-8 py-4 text-base font-bold text-white shadow-xl shadow-zinc-900/25 transition hover:bg-zinc-800 hover:shadow-2xl"
              >
                Go to console
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-16 w-full border-t-2 border-zinc-200/80 pt-10">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">Jump in</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {QUICK_LINKS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => router.push(item.href)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-800 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/80 hover:text-indigo-950"
                  >
                    <item.icon className={`h-4 w-4 ${item.iconClass}`} />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 w-full border-t border-zinc-200 bg-zinc-50/90 py-12 backdrop-blur-sm sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
            {[
              {
                t: "Claims & AI-era drafts",
                d: "Stress-test messaging for risky claims and AI-like phrasing before it ships — then rewrite in consistent, professional modes.",
              },
              {
                t: "Voice → text → same standard",
                d: "Transcribe with your speech deployment, then run the same analyses on the text so voice and written work meet one bar.",
              },
              {
                t: "Coach + lab",
                d: "Chain tools with the agentic coach, or stay in the lab for side‑by‑side drafting sharper than generic grammar checkers.",
              },
            ].map((x) => (
              <div key={x.t} className="border-l-4 border-indigo-500 pl-5">
                <h2 className="text-lg font-black text-zinc-950">{x.t}</h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">{x.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-zinc-200 bg-white px-5 py-8 sm:px-8 lg:px-12">
        <p className="text-center text-xs font-bold text-zinc-400">
          &copy; {new Date().getFullYear()} StandexAI
        </p>
      </footer>
    </div>
  );
}
