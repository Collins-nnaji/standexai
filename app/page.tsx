"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Shield, ShieldCheck, WandSparkles, Cpu, CheckCircle2, FileText, AlertTriangle } from "lucide-react";

export default function Home() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F]">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <Image
            src="/standexai-logo-final.png"
            alt="StandexAI"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium text-[#6E6E73] transition hover:text-[#1D1D1F]"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-full border border-[#1D1D1F] px-5 py-2.5 text-sm font-medium text-[#1D1D1F] transition hover:bg-[#1D1D1F] hover:text-white"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16">
        <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "0ms" }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E5EA] bg-[#F5F5F7] px-4 py-1.5 text-sm text-[#6E6E73]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Now available for regulated industries
          </div>
        </div>

        <h1
          data-reveal
          data-reveal-dir="up"
          style={{ ["--delay" as string]: "120ms" }}
          className="mt-8 max-w-4xl text-[4rem] font-semibold leading-[1.05] tracking-tight text-[#1D1D1F]"
        >
          Compliance-first content
          <br />
          <span className="text-[#AEAEB2]">operations, powered by AI</span>
        </h1>

        <p
          data-reveal
          data-reveal-dir="up"
          style={{ ["--delay" as string]: "180ms" }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-[#6E6E73]"
        >
          StandexAI takes content compliance to the next level, helping you
          create performant, regulation-ready content like never before.
        </p>

        <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "240ms" }} className="mt-10 flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-2 rounded-full bg-[#1D1D1F] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#333]"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-full border border-[#D1D1D6] px-7 py-3.5 text-sm font-medium text-[#1D1D1F] transition hover:border-[#1D1D1F]"
          >
            View demo
          </button>
        </div>

        {/* Hero Visual - Product Preview */}
        <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "320ms" }} className="mt-16">
          <div className="overflow-hidden rounded-2xl border border-[#D1D1D6] bg-white p-2 shadow-2xl shadow-black/10">
            <div className="overflow-hidden rounded-xl bg-[#0D1018]">
              {/* Mock Browser Chrome */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="mx-auto rounded-lg border border-white/10 bg-white/10 px-4 py-1 text-xs text-white/60">
                  app.standexai.com/dashboard
                </div>
              </div>

              {/* Mock Dashboard UI */}
              <div className="flex">
                <div className="flex-1 p-6">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Overview</p>
                        <p className="text-sm font-semibold text-white">Core Metrics</p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                        Live
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                        <p className="text-[9px] uppercase text-white/40">Projects</p>
                        <p className="text-lg font-semibold text-white">12</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                        <p className="text-[9px] uppercase text-white/40">Published</p>
                        <p className="text-lg font-semibold text-white">8</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                        <p className="text-[9px] uppercase text-white/40">SEO</p>
                        <p className="text-lg font-semibold text-white">78</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                        <p className="text-[9px] uppercase text-white/40">GEO</p>
                        <p className="text-lg font-semibold text-white">74</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Model Coverage</p>
                      <p className="text-[10px] text-white/60">4 engines</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 rounded-md border border-white/10 bg-white/5" />
                      <div className="h-6 rounded-md border border-white/10 bg-white/5" />
                      <div className="h-6 rounded-md border border-white/10 bg-white/5" />
                    </div>
                  </div>
                </div>
                <div className="w-64 border-l border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-semibold text-white">Scores</p>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/60">SEO</span>
                        <span className="text-xs font-semibold text-emerald-300">85</span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-white/10">
                        <div className="h-1 w-[85%] rounded-full bg-emerald-300" />
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/60">GEO</span>
                        <span className="text-xs font-semibold text-yellow-300">68</span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-white/10">
                        <div className="h-1 w-[68%] rounded-full bg-yellow-300" />
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/60">Compliance</span>
                        <span className="text-xs font-semibold text-red-300">42</span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-white/10">
                        <div className="h-1 w-[42%] rounded-full bg-red-300" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg border border-red-300/30 bg-red-500/10 p-2">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-red-300" />
                      <span className="text-[10px] font-medium text-red-200">2 critical issues</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Social Proof */}
      <section className="border-t border-[#E5E5EA] bg-[#FAFAFA]">
        <div data-reveal data-reveal-dir="up" className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-center text-sm font-medium text-[#AEAEB2]">
            Built for teams in healthcare, finance, insurance, and SaaS
          </p>
          <div className="mt-6 flex items-center justify-center gap-12">
            {["HIPAA", "FTC", "SEC", "GDPR", "SOC 2"].map((item) => (
              <span key={item} className="text-lg font-semibold tracking-wide text-[#D1D1D6]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div data-reveal data-reveal-dir="left" className="sticky top-8 h-fit space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#AEAEB2]">Why StandexAI</p>
            <h2 className="text-[2.4rem] font-semibold leading-[1.1] tracking-tight text-[#1D1D1F]">
              Why teams choose
              <br />
              StandexAI
            </h2>
            <p className="max-w-md text-base leading-relaxed text-[#6E6E73]">
              StandexAI takes content compliance to the next level, helping you
              build compliant, performant, and optimized content like never before.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 rounded-full border border-[#1D1D1F] px-5 py-2.5 text-sm font-medium text-[#1D1D1F] transition hover:bg-[#1D1D1F] hover:text-white"
            >
              Explore product
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                eyebrow: "Compliance checks as you type",
                badge: "HIPAA compliant",
                title: "Real-Time Compliance",
                desc: "Catch regulatory violations as you type with industry-specific rules for healthcare, finance, and more.",
                icon: ShieldCheck,
                accent: "emerald",
              },
              {
                eyebrow: "Intelligent content suggestions",
                badge: "AI-powered",
                title: "AI Co-Pilot",
                desc: "Get intelligent suggestions, automated improvements, and content generation powered by advanced AI.",
                icon: WandSparkles,
                accent: "blue",
              },
              {
                eyebrow: "SEO + GEO optimization",
                badge: "Dual engine",
                title: "Dual Optimization",
                desc: "Optimize for both traditional SEO and GEO, including AI answer engines like ChatGPT and Perplexity.",
                icon: Cpu,
                accent: "violet",
              },
            ].map((item, idx) => (
              <div
                data-reveal
                data-reveal-dir="right"
                key={item.title}
                className="group rounded-2xl border border-[#E5E5EA] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                style={{ ["--delay" as string]: `${100 + idx * 90}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="rounded-xl bg-emerald-50 p-3"
                  >
                    <item.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#AEAEB2]">{item.eyebrow}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#1D1D1F]">{item.title}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          item.accent === "emerald"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.accent === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-[#E5E5EA] bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div data-reveal data-reveal-dir="left" className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#AEAEB2]">Workflow</p>
              <h2 className="text-[2.4rem] font-semibold leading-[1.1] tracking-tight text-[#1D1D1F]">How it works</h2>
              <p className="max-w-md text-base leading-relaxed text-[#6E6E73]">
                From draft to publish, StandexAI keeps your content compliant and optimized at every step.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { num: "01", title: "Write or import", desc: "Start writing in the editor or import existing content. AI assists you from the first word.", icon: FileText },
                { num: "02", title: "Scan and optimize", desc: "Real-time compliance checks and SEO/GEO scoring ensure your content meets all standards.", icon: Shield },
                { num: "03", title: "Publish with confidence", desc: "Export compliant, optimized content ready for any platform or CMS.", icon: CheckCircle2 },
              ].map((step, i) => (
                <div
                  data-reveal
                  data-reveal-dir="right"
                  key={step.num}
                  className="group flex items-start gap-4 rounded-2xl border border-[#E5E5EA] bg-white p-4 transition-all duration-300 hover:border-[#D1D1D6] hover:shadow-lg hover:shadow-black/5"
                  style={{ ["--delay" as string]: `${120 + i * 90}ms` }}
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#F5F5F7] text-sm font-semibold text-[#1D1D1F]">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-[#6E6E73]" />
                      <h3 className="text-base font-semibold text-[#1D1D1F]">{step.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#6E6E73]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-[#E5E5EA] bg-[#F5F5F7]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { value: "94%", label: "Compliance pass rate" },
              { value: "3x", label: "Faster content creation" },
              { value: "50+", label: "Compliance rules built-in" },
              { value: "SEO + GEO", label: "Dual optimization engine" },
            ].map((stat, idx) => (
              <div
                data-reveal
                data-reveal-dir="up"
                key={stat.label}
                style={{ ["--delay" as string]: `${idx * 80}ms` }}
                className="group text-center"
              >
                <p className="text-4xl font-semibold tracking-tight text-[#1D1D1F] transition-transform duration-300 group-hover:scale-105">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#6E6E73]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[#E5E5EA] bg-white">
        <div data-reveal data-reveal-dir="up" className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-[2.5rem] font-semibold leading-[1.15] tracking-tight text-[#1D1D1F]">
            Ready to transform your
            <br />
            content operations?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#6E6E73]">
            Join teams creating compliant, high-performing content at scale.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="group flex items-center gap-2 rounded-full bg-[#1D1D1F] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#333]"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E5EA] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <Image
              src="/standexai-logo-final.png"
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
      `}</style>
    </div>
  );
}
