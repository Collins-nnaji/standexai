"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlignLeft, Clock, FileText, Mic, Sparkles, Wand2 } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";

const WHO_PILLS = [
  "Marketing & Comms",
  "Legal & Compliance",
  "Sales & CS",
  "HR & People",
  "Agencies",
];

/** Same filename = browser + Next cache the old bytes. Bump this (or set NEXT_PUBLIC_HERO_IMAGE_REVISION) when you replace the JPEG. */
const HERO_IMAGE_SRC = `/STANDEXAIHERO.jpeg?v=${
  typeof process.env.NEXT_PUBLIC_HERO_IMAGE_REVISION === "string" && process.env.NEXT_PUBLIC_HERO_IMAGE_REVISION.trim()
    ? process.env.NEXT_PUBLIC_HERO_IMAGE_REVISION.trim()
    : "2"
}`;

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
  const openConsole = () => router.push("/console");
  const howSectionRef = useRef<HTMLElement>(null);
  const [howRevealed, setHowRevealed] = useState(false);

  useEffect(() => {
    const el = howSectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setHowRevealed(true);
    }, { threshold: 0.12, rootMargin: "-40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#111110] antialiased [font-family:var(--font-landing-sans),sans-serif]">
      <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between border-b border-[#DDDBD5] bg-[#F5F3EF] px-6 py-5 lg:px-12 lg:py-6">
        <button type="button" onClick={() => router.push("/")} className="flex shrink-0 items-center">
          <Image
            src="/standexailogo.png"
            alt="StandexAI"
            width={168}
            height={44}
            className="h-8 w-auto object-contain sm:h-9"
            priority
          />
        </button>
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-9">
          <ul className="hidden list-none items-center gap-9 lg:flex">
            <li>
              <a
                href="#features"
                className="text-[13px] font-medium tracking-wide text-[#6B6860] transition-colors hover:text-[var(--brand-teal)]"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how"
                className="text-[13px] font-medium tracking-wide text-[#6B6860] transition-colors hover:text-[var(--brand-teal)]"
              >
                How it works
              </a>
            </li>
            {!user && (
              <li>
                <button
                  type="button"
                  onClick={() => router.push("/auth/sign-in")}
                  className="text-[13px] font-medium tracking-wide text-[#6B6860] transition-colors hover:text-[#111110]"
                >
                  Sign in
                </button>
              </li>
            )}
          </ul>
          {!user && (
            <button
              type="button"
              onClick={() => router.push("/auth/sign-in")}
              className="text-[13px] font-medium tracking-wide text-[#6B6860] transition-colors hover:text-[#111110] lg:hidden"
            >
              Sign in
            </button>
          )}
          <button
            type="button"
            onClick={openConsole}
            className="rounded bg-[#111110] px-4 py-2 text-[13px] font-semibold tracking-wide text-[#F5F3EF] transition-opacity hover:opacity-80 sm:px-5 sm:py-2.5"
          >
            {user ? "Console" : "Open Console"}
          </button>
        </div>
      </nav>

      {/* Hero — light canvas + copy left, framed image right */}
      <section className="relative isolate min-h-0 overflow-x-clip overflow-y-visible border-b border-[#DDDBD5] bg-[#F2EFE8] pt-[5.25rem] lg:pt-[4.75rem]">
        {/* Subtle grid + soft shapes */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #cfc8ba 1px, transparent 1px), linear-gradient(to bottom, #cfc8ba 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-[#dcd6cc]/60 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-[#e5dfd4]/70 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b8b0a2]/40 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_min(50vw,540px)] lg:items-center lg:gap-x-14 lg:gap-y-8 lg:px-8 lg:py-10 xl:gap-x-20 xl:px-12 2xl:px-16">
          <div className="flex min-w-0 flex-col items-start text-left max-lg:pr-1 lg:-ml-6 lg:pr-10 xl:-ml-10 xl:pr-14 2xl:-ml-14 2xl:pr-16">
            <span
              className="landing-fade-up mb-4 inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#111110] [font-family:var(--font-console-mono),Consolas,ui-monospace,monospace]"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="block h-px w-6 bg-[#111110]/35" aria-hidden />
              Writing analysis · Voice coach
            </span>

            <h1
              className="landing-fade-up mb-5 w-full max-w-none text-left text-[clamp(1.55rem,4.2vw,2.85rem)] font-normal leading-[1.15] tracking-[-0.03em] [font-family:var(--font-landing-display),system-ui,sans-serif]"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="block lg:whitespace-nowrap">
                <span className="text-[#111110]">Copy that </span>
                <span className="landing-text-brand-gradient [font-family:var(--font-landing-serif),Georgia,serif] italic">
                  &lsquo;clears the bar&rsquo;
                </span>
                <span className="text-[#111110]">.</span>
              </span>
              <span className="mt-2 block sm:mt-3 lg:whitespace-nowrap">
                <span className="text-[#111110]">Speech that </span>
                <span className="landing-text-brand-gradient [font-family:var(--font-landing-serif),Georgia,serif] italic">
                  &lsquo;holds up in the room&rsquo;
                </span>
                <span className="text-[#111110]">.</span>
              </span>
            </h1>

            <div className="landing-fade-up mb-6" style={{ animationDelay: "0.35s" }}>
              <button
                type="button"
                onClick={openConsole}
                className="group inline-flex items-center gap-2.5 rounded-md bg-[#111110] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#F5F3EF] transition-opacity hover:opacity-90"
              >
                Open Console
                <NavArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div
              className="landing-fade-up w-full border-t border-[#111110]/10 pt-5"
              style={{ animationDelay: "0.45s" }}
            >
              <p className="max-w-xl text-[13px] leading-[1.7] text-[#111110] [font-family:var(--font-console-mono),Consolas,ui-monospace,monospace]">
                One console: agents stress-test what you write — claims, risk, tone, rewrites — plus a coach for clearer,
                more professional speech.
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none lg:self-center lg:justify-self-end">
            <div
              className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-[#d4cec3] via-transparent to-[#c9c2b6]/50 opacity-80 blur-sm"
              aria-hidden
            />
            <div className="landing-hero-photo-frame relative h-[min(38vh,360px)] w-full overflow-hidden rounded-2xl border border-[#c9c2b6] bg-[#e8e4dd] shadow-[0_24px_48px_-20px_rgba(17,17,16,0.22),0_0_0_1px_rgba(17,17,16,0.04)] sm:h-[min(40vh,400px)] lg:h-[min(42vh,440px)]">
              <div className="landing-hero-photo-float absolute inset-0">
                <Image
                  src={HERO_IMAGE_SRC}
                  alt=""
                  fill
                  priority
                  unoptimized
                  className="object-contain object-center p-2 pb-10 sm:p-2.5 sm:pb-11 lg:p-3 lg:pb-12"
                  sizes="(max-width: 1024px) 90vw, 640px"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10">
                <div
                  className="h-px w-full opacity-90"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--brand-teal), var(--brand-magenta), var(--brand-purple), transparent)",
                  }}
                />
                <div className="flex items-center justify-center bg-[#0a0a0a]/88 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3">
                  <p className="text-center text-[9px] font-medium leading-snug text-[#ffffff] sm:text-[10px] [font-family:var(--font-console-mono),Consolas,ui-monospace,monospace]">
                    <span className="font-semibold uppercase tracking-[0.12em] text-white">Powered by </span>
                    <span className="landing-text-brand-gradient text-[10px] font-semibold uppercase tracking-[0.1em] sm:text-[11px]">
                      fine-tuned SOTA
                    </span>
                    <span className="font-semibold uppercase tracking-[0.12em] text-white"> Standex models</span>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="pointer-events-none absolute -bottom-2 -right-2 hidden h-16 w-16 rounded-br-3xl border-b-2 border-r-2 border-[#111110]/15 sm:block"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -left-2 -top-2 hidden h-10 w-10 rounded-tl-2xl border-l-2 border-t-2 border-[#111110]/12 sm:block"
              aria-hidden
            />
          </div>
        </div>
      </section>

      {/* Features — warm band, editorial grid + console preview */}
      <section
        id="features"
        className="relative overflow-hidden border-b border-[#DDDBD5] bg-[#EDE9E1] px-5 py-14 sm:px-6 lg:px-10 lg:py-[5.25rem] xl:py-[5.75rem]"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[2px] opacity-90"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--brand-teal) 22%, var(--brand-magenta) 50%, var(--brand-purple) 78%, transparent 100%)",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-[2px] z-0 h-px bg-[#DDDBD5]" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #c9c2b6 1px, transparent 1px), linear-gradient(to bottom, #c9c2b6 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-[#b8b0a2]/45 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-3 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-teal)] [font-family:var(--font-console-mono),Consolas,ui-monospace,monospace]">
            <span className="block h-px w-7 bg-[var(--brand-teal)]/50" aria-hidden />
            Features
          </div>
          <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(1.85rem,3.8vw,2.85rem)] font-normal leading-[1.12] tracking-tight text-[#111110] [font-family:var(--font-landing-serif),Georgia,serif]">
                Writing that ships.
                <br />
                Speaking that lands.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#3f3e3a]">
                One console ties it together: structured review on the page, then coaching on how you deliver it — without
                switching tools or losing context.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <span className="rounded-full border border-[#111110]/12 bg-[#111110] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#F5F3EF] shadow-sm">
                Workspace
              </span>
              <span className="rounded-full border border-[#111110]/12 bg-[#111110] px-3.5 py-1.5 shadow-sm">
                <span className="landing-text-brand-gradient text-[11px] font-semibold uppercase tracking-wide">
                  Voice coach
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {(
                [
                  {
                    Icon: AlignLeft,
                    accent: "var(--brand-teal)",
                    area: "Workspace",
                    strong: "Explainable writing review",
                    span: "Flags, risk, intent, and AI-style signals — each with reasons and suggestions, not opaque scores.",
                  },
                  {
                    Icon: Wand2,
                    accent: "var(--brand-magenta)",
                    area: "Workspace",
                    strong: "Transform modes",
                    span: "Professional, safe, persuasive, and more — full rewrites when the message needs to change shape.",
                  },
                  {
                    Icon: Mic,
                    accent: "var(--brand-purple)",
                    area: "Voice coach",
                    strong: "Delivery & presence",
                    span: "Transcript-based coaching on fillers, clarity, and executive tone, with a prompt for your next take.",
                  },
                  {
                    Icon: Clock,
                    accent: "var(--brand-teal)",
                    area: "Both",
                    strong: "One sign-in, two surfaces",
                    span: "Switch tabs in the console: polish the page, then polish how you say it out loud.",
                  },
                ] as const
              ).map(({ Icon, accent, area, strong, span }) => (
                <div
                  key={strong}
                  className="group relative overflow-hidden rounded-2xl border border-[#D0CCC3] bg-[#F7F4EE] p-5 shadow-[0_1px_0_rgba(17,17,16,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[#111110]/18 hover:shadow-[0_20px_50px_-24px_rgba(17,17,16,0.18)] sm:p-6"
                >
                  <div
                    className="pointer-events-none absolute left-0 top-0 h-full w-[3px] opacity-90 transition-opacity group-hover:opacity-100"
                    style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }}
                    aria-hidden
                  />
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#111110]/10 bg-[#111110] text-[var(--brand-teal)] shadow-inner">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.85} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#111110]/40">{area}</span>
                  </div>
                  <strong className="mb-2 block text-[15px] font-semibold leading-snug text-[#111110]">{strong}</strong>
                  <p className="text-[13px] leading-relaxed text-[#3f3e3a]">{span}</p>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-28">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111110]/40 [font-family:var(--font-console-mono),Consolas,ui-monospace,monospace]">
                Console preview
              </p>
              <div className="rounded-2xl border border-[#C8C3BA] bg-[#111110] shadow-[0_28px_90px_-20px_rgba(17,17,16,0.35)] ring-1 ring-[#111110]/5">
                <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30">
                    StandexAI Console
                  </span>
                </div>
                <div className="flex flex-col gap-4 p-5 sm:p-7">
                  <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-1">
                    <span className="flex-1 rounded-md bg-white/10 py-2 text-center text-[10px] font-bold uppercase tracking-wide text-white/90">
                      Workspace
                    </span>
                    <span className="flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wide text-white/35">
                      Voice coach
                    </span>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.05] px-[18px] py-4 text-[13px] leading-relaxed text-white/70 [font-family:var(--font-landing-sans),ui-monospace,monospace]">
                    Our revolutionary platform leverages cutting-edge AI to synergize your workflow…
                    <span
                      className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-px bg-white/60 align-middle"
                      style={{ animation: "landing-cursor-blink 1s step-end infinite" }}
                      aria-hidden
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white/[0.05] px-3 py-3">
                      <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/35">Claims</div>
                      <div className="text-lg leading-none text-[var(--brand-magenta)] [font-family:var(--font-landing-serif),Georgia,serif]">
                        High
                      </div>
                      <div className="mt-1 text-[10px] text-white/40">3 flags</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.05] px-3 py-3">
                      <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/35">AI style</div>
                      <div className="text-lg leading-none text-[var(--brand-purple)] [font-family:var(--font-landing-serif),Georgia,serif]">
                        74%
                      </div>
                      <div className="mt-1 text-[10px] text-white/40">Detected</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.05] px-3 py-3">
                      <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/35">Tone</div>
                      <div className="text-lg leading-none text-[var(--brand-teal)] [font-family:var(--font-landing-serif),Georgia,serif]">
                        OK
                      </div>
                      <div className="mt-1 text-[10px] text-white/40">Review</div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-[var(--brand-purple)]/15 to-[var(--brand-teal)]/10 px-4 py-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--brand-teal)]">Voice coach</span>
                      <span className="text-[10px] text-white/45">After you switch tab</span>
                    </div>
                    <div className="mb-2 text-[11px] leading-snug text-white/55">
                      “So, um, what we’re trying to do here is basically…”
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-wide text-white/40">Delivery score</span>
                      <span className="text-2xl font-semibold tabular-nums text-white [font-family:var(--font-landing-serif),Georgia,serif]">
                        78
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] leading-relaxed text-[var(--brand-magenta)]/80">
                      Filler words · Open stronger · Pause before numbers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — light band, brand + hairline borders */}
      <section
        ref={howSectionRef}
        id="how"
        className={`relative overflow-hidden border-b border-[#DDDBD5] bg-[#F5F3EF] px-5 py-12 sm:px-6 lg:px-10 lg:py-16 xl:py-[4.5rem] ${howRevealed ? "landing-how-revealed" : ""}`}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[2px] opacity-90"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--brand-teal) 22%, var(--brand-magenta) 50%, var(--brand-purple) 78%, transparent 100%)",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-[2px] z-0 h-px bg-[#DDDBD5]" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-[#b8b0a2]/45 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-teal)] [font-family:var(--font-console-mono),Consolas,ui-monospace,monospace]">
            How it works
          </div>
          <h2 className="how-works-title mb-3 max-w-2xl text-[clamp(1.85rem,3.6vw,2.65rem)] font-normal leading-tight tracking-tight text-[#111110] [font-family:var(--font-landing-serif),Georgia,serif]">
            From draft to delivery in the same console
          </h2>
          <p className="mb-8 max-w-xl text-[15px] leading-relaxed text-[#3f3e3a] lg:mb-10">
            <span className="font-semibold text-[#111110]">Workspace</span> stress-tests written copy.{" "}
            <span className="font-semibold text-[#111110]">Voice coach</span> improves how you sound — same bar for quality,
            two surfaces.
          </p>

          <div className="relative">
            <div
              className="landing-how-line pointer-events-none absolute left-[22px] top-6 hidden h-[calc(100%-3rem)] w-[2px] bg-gradient-to-b from-[var(--brand-teal)] via-[var(--brand-magenta)] to-[var(--brand-purple)] opacity-[0.72] lg:block"
              aria-hidden
            />
            <div className="flex flex-col gap-9 lg:gap-12">
              {(
                [
                  {
                    n: "01",
                    Icon: FileText,
                    tag: "Workspace · Voice coach",
                    t: "Bring in words or a take",
                    d: "Type, paste, or dictate into the editor for writing review. Or open Voice coach: record audio or drop in a transcript to work on speaking.",
                  },
                  {
                    n: "02",
                    Icon: Sparkles,
                    tag: "Workspace",
                    t: "Run the writing agents",
                    d: "Communication, compliance, intent, and AI-style signals — each with explanations you can act on. Transform rewrites when you need a new version, not just a score.",
                  },
                  {
                    n: "03",
                    Icon: Mic,
                    tag: "Voice coach",
                    t: "Coach the delivery",
                    d: "Structured feedback on fillers, clarity, and professional tone, plus a concrete prompt for your next recording — complementary to what you fixed on the page.",
                  },
                ] as const
              ).map((x, i) => {
                const tagColors = ["var(--brand-teal)", "var(--brand-magenta)", "var(--brand-purple)"] as const;
                const iconColors = ["var(--brand-teal)", "var(--brand-magenta)", "var(--brand-purple)"] as const;
                return (
                  <div
                    key={x.n}
                    className="landing-how-step relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-7 lg:gap-10"
                    style={{ animationDelay: `${0.08 + i * 0.14}s` }}
                  >
                    <div className="flex shrink-0 flex-row items-center gap-4 sm:w-[7rem] sm:flex-col sm:items-start sm:gap-2.5">
                      <span className="text-[clamp(2.75rem,6vw,4.25rem)] font-bold leading-none tracking-tight landing-text-brand-gradient [font-family:var(--font-landing-display),system-ui,sans-serif]">
                        {x.n}
                      </span>
                      <x.Icon
                        className="landing-how-icon h-8 w-8 shrink-0 sm:h-9 sm:w-9"
                        style={{ color: iconColors[i] }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="min-w-0 flex-1 pt-0 sm:pt-0.5">
                      <p
                        className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] [font-family:var(--font-console-mono),Consolas,ui-monospace,monospace]"
                        style={{ color: tagColors[i] }}
                      >
                        {x.tag}
                      </p>
                      <h3 className="how-step-title mb-2 text-xl font-semibold leading-snug sm:text-2xl">{x.t}</h3>
                      <p className="max-w-2xl text-[15px] leading-[1.8] text-[#3f3e3a]">{x.d}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Audience + CTA — single dark band */}
      <section className="border-t border-[#DDDBD5] px-6 pb-16 pt-12 lg:px-12 lg:pb-20 lg:pt-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111110] shadow-[0_32px_80px_rgba(0,0,0,0.2)]">
          <div className="bg-gradient-to-br from-[#1a1a18] via-[#111110] to-[#0a0a09] px-8 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-teal)]">
              Who it&apos;s for
            </p>
            <p className="mb-10 max-w-3xl text-[17px] leading-[1.65] text-[#EDE8DF] sm:text-lg">
              Teams where{" "}
              <span className="font-semibold text-[#F5F3EF]">what you ship in writing</span> and{" "}
              <span className="font-semibold text-[#F5F3EF]">how you sound when it matters</span> can either defend the
              brand or expose it — from regulated comms and legal review to revenue copy and the big meeting.
            </p>
            <div className="mb-12 flex flex-wrap gap-2.5 sm:gap-3">
              {WHO_PILLS.map((label) => (
                <span
                  key={label}
                  className="cursor-default rounded-full border border-white/[0.18] bg-white/[0.06] px-4 py-2.5 text-[13px] font-medium text-[#F5F3EF] backdrop-blur-sm transition-colors hover:border-white/[0.28] hover:bg-white/[0.11]"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden />

            <div className="mt-10 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <h2 className="max-w-xl text-[clamp(1.65rem,3.8vw,2.85rem)] font-normal leading-[1.15] [font-family:var(--font-landing-serif),Georgia,serif]">
                <span className="text-white">Ready to raise the bar on </span>
                <em className="italic text-[#E8DCC8]">your pages and your delivery?</em>
              </h2>
              <button
                type="button"
                onClick={openConsole}
                className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-lg bg-[#F5F3EF] px-9 py-4 text-[13px] font-semibold uppercase tracking-wider text-[#111110] shadow-lg shadow-black/30 transition-opacity hover:opacity-[0.9] lg:self-auto"
              >
                Open Console
                <NavArrow className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center justify-between gap-3 border-t border-[#DDDBD5] px-6 py-8 sm:flex-row sm:text-left lg:px-12">
        <span className="text-[13px] font-bold uppercase tracking-wider text-[#111110]">StandexAI</span>
        <span className="text-xs text-[#6B6860]">&copy; {new Date().getFullYear()} StandexAI</span>
      </footer>
    </div>
  );
}
