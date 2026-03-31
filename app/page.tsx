"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Building2, ChevronDown, ChevronRight, ClipboardList, History, Layers, LogOut, PenLine } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";

/** Public asset — keep path static so next/image resolves reliably (cache-bust via filename change). */
const HERO_IMAGE_SRC = "/STANDEXAIHERO.jpeg";

const GOLD = "bg-[#E8C547] text-[#0B0B0B] hover:bg-[#f0d060]";
/** Primary copy on light landing */
const INK = "text-zinc-900";
/** Secondary copy — darker gray for contrast on white */
const MUTED = "text-zinc-700";
const LINE = "border-zinc-200/90";

const HOW_FLOW_STEPS = [
  {
    Icon: ClipboardList,
    title: "Today's tasks",
    desc: "Writing prompt and speaking cue, refreshed each day.",
  },
  {
    Icon: PenLine,
    title: "You respond",
    desc: "Draft in the box, record audio, or use the timer.",
  },
  {
    Icon: Layers,
    title: "Feedback",
    desc: "Several scores with short reasons—not one opaque number.",
  },
  {
    Icon: History,
    title: "Saved runs",
    desc: "History shows what keeps coming up as you practice.",
  },
  {
    Icon: Building2,
    title: "Teams (optional)",
    desc: "Pro console for shared review and workflows.",
  },
] as const;

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
  const howSectionRef = useRef<HTMLElement>(null);
  const [howFlowRevealed, setHowFlowRevealed] = useState(false);

  const openSkillsLab = () => router.push("/skills");
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

  useEffect(() => {
    const el = howSectionRef.current;
    if (!el || howFlowRevealed) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setHowFlowRevealed(true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHowFlowRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [howFlowRevealed]);

  return (
    <div
      className={`min-h-screen bg-white ${INK} antialiased [font-family:var(--font-standex-sans),ui-sans-serif,sans-serif] text-[15px] font-medium leading-snug sm:text-[16px]`}
    >
      {/* Nav — logo + Neon auth (same client as rest of app) */}
      <header
        className={`sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b ${LINE} bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-10`}
      >
        <Link href="/" className="flex shrink-0 items-center transition-opacity hover:opacity-90">
          <Image
            src="/standexailogo.png"
            alt="StandexAI"
            width={132}
            height={36}
            className="h-8 w-auto object-contain opacity-[0.98]"
            priority
          />
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 md:gap-5" aria-label="Account">
          {authPending ? (
            <span className={`text-[14px] ${MUTED}`}>…</span>
          ) : user ? (
            <>
              <Link
                href="/skills"
                className={`inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.12em] transition ${GOLD}`}
              >
                Today&apos;s practice
                <NavArrow className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/console"
                className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-zinc-800"
              >
                Pro console
              </Link>
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className={`flex max-w-[240px] items-center gap-1.5 rounded-md border ${LINE} bg-zinc-50 px-3 py-2.5 text-left text-[14px] font-medium text-zinc-900 transition hover:bg-zinc-100`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="truncate">{user.name?.trim() || user.email}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 opacity-70 transition ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {userMenuOpen ? (
                  <div
                    role="menu"
                    className={`absolute right-0 top-full z-[60] mt-2 min-w-[180px] rounded-lg border ${LINE} bg-white py-1 shadow-lg ring-1 ring-zinc-900/5`}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => void signOut()}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[15px] text-zinc-900 transition hover:bg-zinc-50"
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
                className={`text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-700 transition-colors hover:text-zinc-900`}
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className={`text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-900 transition-colors hover:text-zinc-700`}
              >
                Sign up
              </Link>
              <button
                type="button"
                onClick={openSkillsLab}
                className={`inline-flex items-center gap-2 rounded-sm px-6 py-3 text-[13px] font-bold uppercase tracking-[0.12em] transition ${GOLD}`}
              >
                Start today&apos;s practice
                <NavArrow className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Hero — split layout, big serif, image preserved */}
      <section
        className="landing-section-reveal relative isolate border-b border-zinc-200/80 [animation-delay:0ms]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(232,197,71,0.12),transparent_50%)]" aria-hidden />
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-14 xl:px-12">
          <div>
            <p
              className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${MUTED} [font-family:var(--font-console-mono),monospace]`}
            >
              Writing &amp; speaking coach
            </p>
            <h1
              className="mb-4 text-[clamp(2.35rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-900 [font-family:var(--font-landing-serif),Georgia,serif]"
            >
              Build better writing and speaking habits
            </h1>
            <ul className={`mb-5 max-w-md list-disc space-y-1.5 pl-5 text-[14px] leading-snug sm:text-[15px] ${MUTED}`}>
              <li>Daily writing + speaking tasks with structured feedback.</li>
              <li>Saved runs surface what you tend to miss.</li>
              <li>
                <span className="font-semibold text-zinc-900">Pro console</span>—optional team review; skip for solo
                practice.
              </li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openSkillsLab}
                className={`inline-flex items-center gap-2 rounded-sm px-6 py-3 text-[12px] font-bold uppercase tracking-[0.1em] transition ${GOLD}`}
              >
                Today&apos;s practice
                <NavArrow className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={openConsole}
                className={`inline-flex items-center gap-2 rounded-sm border border-zinc-200 bg-zinc-50 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-600 transition hover:bg-zinc-100`}
              >
                Pro console
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#E8C547]/[0.07] via-transparent to-[#3dd9c9]/[0.05] blur-xl"
              aria-hidden
            />
            <div
              className={`landing-hero-photo-frame relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.12)]`}
            >
              <div className="border-b border-zinc-200/80 px-3 py-2">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${MUTED} [font-family:var(--font-landing-serif),serif]`}>
                  Practice · then review
                </p>
              </div>
              <div className="landing-hero-photo-float relative h-[min(48vh,440px)] w-full sm:h-[min(50vh,460px)]">
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
              <div className="absolute bottom-4 right-4 z-10 flex max-w-[min(100%,18rem)] items-center gap-2.5 rounded-xl border border-zinc-200 bg-white/95 px-2 py-1.5 shadow-md backdrop-blur-sm">
                <div className="relative h-9 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-zinc-200">
                  <Image
                    src={HERO_IMAGE_SRC}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                    unoptimized
                  />
                </div>
                <p className="pr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-700 [font-family:var(--font-console-mono),monospace]">
                  StandexAI
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by — grid strip */}
        <div className={`border-t ${LINE} bg-zinc-50`}>
          <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-10">
            <div className="landing-light-grid grid-cols-2 sm:grid-cols-4">
              {["Daily habit", "Exams & interviews", "Work emails & talks", "Team console"].map((label) => (
                <div key={label} className="landing-grid-node px-2 py-3 text-center">
                  <span className={`text-[13px] font-medium ${MUTED}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Model providers — infinite scroll marquee (dark band) */}
      <section
        className="landing-section-reveal border-b border-white/10 bg-zinc-950 py-6 text-zinc-100 sm:py-8 [animation-delay:90ms]"
        aria-labelledby="model-layer-heading"
      >
        <h2 id="model-layer-heading" className="sr-only">
          Model providers
        </h2>
        <div className="landing-provider-marquee border-y border-white/10 bg-zinc-900/50 py-4">
          <div className="landing-provider-marquee-track" role="presentation">
            <ul className="landing-provider-marquee-segment landing-provider-marquee-segment--primary flex shrink-0 items-center gap-10 sm:gap-14 md:gap-16">
              {MODEL_PROVIDERS.map((name) => (
                <li
                  key={`a-${name}`}
                  className="whitespace-nowrap text-[15px] font-semibold uppercase tracking-[0.14em] text-zinc-100"
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
                  className="whitespace-nowrap text-[15px] font-semibold uppercase tracking-[0.14em] text-zinc-100"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] px-4 pt-3 sm:px-6 lg:px-10">
          <p className="text-center text-[12px] text-zinc-500">Plugs into common model providers.</p>
        </div>
      </section>

      {/* How it works — scroll-triggered staggered flow */}
      <section
        ref={howSectionRef}
        id="how"
        aria-labelledby="how-it-works-heading"
        className={`landing-section-reveal border-b border-zinc-200/80 bg-zinc-50 px-4 py-10 sm:px-6 lg:px-10 [animation-delay:140ms] ${
          howFlowRevealed ? "landing-how-revealed" : ""
        }`}
      >
        <div className="mx-auto max-w-[1100px]">
          <p className={`mb-1 text-center text-[11px] font-semibold uppercase tracking-[0.18em] ${MUTED}`}>How it works</p>
          <h2
            id="how-it-works-heading"
            className="mb-8 text-center text-[clamp(1.35rem,3vw,1.85rem)] font-normal text-zinc-900 [font-family:var(--font-landing-serif),serif]"
          >
            From today&apos;s task to clearer habits
          </h2>

          <div className="flex flex-col items-center gap-1 md:flex-row md:flex-wrap md:justify-center md:gap-0">
            {HOW_FLOW_STEPS.map((step, i) => {
              const stepMs = i * 130;
              const connMs = stepMs + 95;
              const { Icon } = step;
              return (
                <div key={step.title} className="flex w-full flex-col items-center md:w-auto md:flex-row">
                  <div
                    className={`landing-how-step w-full max-w-[17.5rem] rounded-xl border ${LINE} bg-white px-4 py-4 text-center shadow-sm md:max-w-[11.25rem] md:py-3.5`}
                    style={{ "--how-step-delay": `${stepMs}ms` } as CSSProperties}
                  >
                    <div
                      className="landing-how-icon mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-amber-800"
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-[13px] font-semibold text-zinc-900">{step.title}</h3>
                    <p className={`mt-1 text-[11px] leading-snug ${MUTED}`}>{step.desc}</p>
                  </div>
                  {i < HOW_FLOW_STEPS.length - 1 ? (
                    <>
                      <div
                        className="landing-how-flow-connector flex py-1 text-zinc-400 md:hidden"
                        style={{ "--connector-delay": `${connMs}ms` } as CSSProperties}
                        aria-hidden
                      >
                        <ChevronDown className="h-5 w-5" strokeWidth={2} />
                      </div>
                      <div
                        className="landing-how-flow-connector hidden px-1.5 text-zinc-400 md:flex md:items-center md:self-start md:pt-9"
                        style={{ "--connector-delay": `${connMs}ms` } as CSSProperties}
                        aria-hidden
                      >
                        <ChevronRight className="h-5 w-5 shrink-0" strokeWidth={2} />
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>

          <p className={`mt-8 text-center text-[12px] leading-snug ${MUTED}`}>
            Solo habit · exam prep · work English · teams add console when they need it
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={openSkillsLab}
              className={`inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#b8941c] transition hover:text-[#9a7a12]`}
            >
              Today&apos;s practice
              <NavArrow className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={openConsole}
              className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-zinc-500 transition hover:text-zinc-800"
            >
              Pro console
              <NavArrow className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing — dark band */}
      <section className="landing-section-reveal border-t border-white/10 bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-10 [animation-delay:220ms]">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-1 text-[clamp(1.2rem,2.4vw,1.6rem)] font-normal text-white [font-family:var(--font-landing-serif),serif]">
            Usage-based pricing
          </h2>
          <p className="mb-6 max-w-xl text-[13px] leading-snug text-zinc-400">
            Pay for evaluations, speech processing, and console use. Start free; scale with volume.
          </p>
          <div className="landing-dark-grid grid-cols-1 md:grid-cols-3">
            {[
              { tier: "Try", price: "Free", line: "Limited daily use" },
              { tier: "Grow", price: "Per use", line: "No flat bundle" },
              { tier: "Org", price: "Custom", line: "Seats + volume" },
            ].map((plan) => (
              <div key={plan.tier} className="p-4 md:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{plan.tier}</p>
                <p className="mt-2 text-[clamp(1.1rem,2vw,1.35rem)] font-normal text-white [font-family:var(--font-landing-serif),serif]">{plan.price}</p>
                <p className="mt-1 text-[13px] text-zinc-400">{plan.line}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-zinc-500">Practice first · console when your team needs it</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openSkillsLab}
                className={`inline-flex items-center gap-2 rounded-sm px-5 py-3 text-[12px] font-bold uppercase tracking-[0.1em] transition ${GOLD}`}
              >
                Today&apos;s practice
                <NavArrow className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={openConsole}
                className="inline-flex items-center gap-2 rounded-sm border border-zinc-600 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.1em] text-zinc-100 transition hover:bg-zinc-800"
              >
                Pro console
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer
        className={`landing-section-reveal flex flex-col items-center justify-between gap-4 border-t ${LINE} bg-white px-5 py-6 sm:flex-row sm:items-start lg:px-10 [animation-delay:400ms]`}
      >
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <span className={`text-[14px] font-bold uppercase tracking-[0.15em] ${MUTED}`}>StandexAI</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px] sm:justify-start" aria-label="Legal">
            <Link href="/trust" className={`${MUTED} transition hover:text-zinc-900`}>
              Trust Center
            </Link>
            <Link href="/privacy" className={`${MUTED} transition hover:text-zinc-900`}>
              Privacy
            </Link>
            <Link href="/terms" className={`${MUTED} transition hover:text-zinc-900`}>
              Terms
            </Link>
            <Link href="/dpa" className={`${MUTED} transition hover:text-zinc-900`}>
              DPA
            </Link>
          </nav>
        </div>
        <span className={`text-[15px] ${MUTED}`}>&copy; {new Date().getFullYear()} StandexAI</span>
      </footer>
    </div>
  );
}
