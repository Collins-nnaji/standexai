import Image from "next/image";
import Link from "next/link";
import { Check, Lock } from "lucide-react";

export const metadata = {
  title: "Trust Center | StandexAI",
  description: "Security, compliance, and resources for StandexAI customers.",
};

const LINE = "border-white/[0.12]";

const compliance = [
  { id: "SOC 2", label: "SOC 2" },
  { id: "HIPAA", label: "HIPAA" },
  { id: "GDPR", label: "GDPR" },
  { id: "CCPA", label: "CCPA" },
];

const securityResources = [
  "Incident Response Plan",
  "Business Continuity and Disaster Recovery (BC/DR)",
  "Information Security Policy",
  "Data Management Policy",
];

const otherResources: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Data Processing Addendum", href: "/dpa" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Services Agreement (Pro & Enterprise)", href: "/terms#services" },
];

type ControlCard = {
  title: string;
  items: string[];
  muted?: string;
  moreLabel: string;
};

const controls: ControlCard[] = [
  {
    title: "Infrastructure security",
    items: ["Unique account authentication enforced", "Firewall access restricted"],
    muted: "Production application access restricted",
    moreLabel: "View more infrastructure security controls",
  },
  {
    title: "Organizational security",
    items: ["Confidentiality agreements acknowledged", "Performance evaluations conducted"],
    muted: "MDM system utilized",
    moreLabel: "View more organizational security controls",
  },
  {
    title: "Product security",
    items: [
      "Control self-assessments conducted",
      "Data transmission encrypted",
      "Vulnerability and system monitoring procedures",
    ],
    moreLabel: "View more product security controls",
  },
  {
    title: "Internal security procedures",
    items: ["Configuration management system established", "SOC 2 — System Description available on request"],
    muted: "Board expertise and oversight documented",
    moreLabel: "View more internal security procedures",
  },
];

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white antialiased [font-family:var(--font-landing-sans),ui-sans-serif,sans-serif]">
      <header
        className={`sticky top-0 z-20 border-b ${LINE} bg-[#0A0A0A]/95 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-12`}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center transition-opacity hover:opacity-90">
            <Image
              src="/standexailogo.png"
              alt="StandexAI"
              width={132}
              height={36}
              className="h-8 w-auto object-contain brightness-0 invert opacity-[0.95]"
            />
          </Link>
          <Link
            href="/"
            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#C4C0B6] transition hover:text-white"
          >
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:flex lg:gap-12 lg:px-12 lg:py-16">
        <aside className="mb-12 shrink-0 lg:mb-0 lg:w-[280px]">
          <h2 className="mb-6 text-[13px] font-semibold uppercase tracking-[0.15em] text-white">Compliance</h2>
          <ul className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {compliance.map((c) => (
              <li key={c.id}>
                <div
                  className={`flex aspect-square flex-col items-center justify-center rounded-full border ${LINE} bg-white/[0.04] p-3 text-center`}
                >
                  <span className="text-[11px] font-semibold leading-tight text-white">{c.label}</span>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.15em] text-white">Resources</h2>
          <p className="mb-3 text-[12px] font-medium text-[#C4C0B6]">Data security &amp; continuity</p>
          <ul className="mb-8 space-y-2">
            {securityResources.map((label) => (
              <li key={label}>
                <span
                  className={`flex items-center justify-between gap-2 rounded-lg border ${LINE} bg-white/[0.03] px-3 py-2.5 text-[13px] text-white`}
                >
                  <span className="leading-snug">{label}</span>
                  <Lock className="h-4 w-4 shrink-0 text-[#C4C0B6]" aria-hidden />
                </span>
              </li>
            ))}
          </ul>

          <p className="mb-3 text-[12px] font-medium text-[#C4C0B6]">Other resources</p>
          <ul className="space-y-2">
            {otherResources.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-[14px] font-medium text-[#7CB8FF] transition hover:text-[#9ec9ff]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-normal text-white [font-family:var(--font-landing-serif),serif]">
              Trust Center
            </h1>
            <button
              type="button"
              className="text-[13px] font-medium text-[#7CB8FF] transition hover:text-[#9ec9ff]"
            >
              View all
            </button>
          </div>
          <p className="mb-8 text-[12px] text-emerald-400/90">Updated regularly — contact us for the latest attestations.</p>

          <div className="grid gap-4 sm:grid-cols-2">
            {controls.map((card) => (
              <div
                key={card.title}
                className={`rounded-xl border ${LINE} bg-[#080807] p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)]`}
              >
                <h3 className="mb-4 text-[15px] font-semibold text-white">{card.title}</h3>
                <ul className={`space-y-2.5 ${card.muted ? "mb-2" : "mb-4"}`}>
                  {card.items.map((line) => (
                    <li key={line} className="flex gap-2 text-[13px] leading-snug text-white">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.5} aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                {card.muted ? (
                  <p className="mb-4 pl-6 text-[12px] leading-snug text-[#9CA3AF]">{card.muted}</p>
                ) : null}
                <button
                  type="button"
                  className="text-left text-[13px] font-medium text-[#7CB8FF] transition hover:text-[#9ec9ff]"
                >
                  {card.moreLabel}
                </button>
              </div>
            ))}
          </div>

          <p className={`mt-10 border-t ${LINE} pt-8 text-[13px] leading-relaxed text-[#C4C0B6]`}>
            This page summarizes how StandexAI approaches security and compliance. Formal policies, DPAs, and audit
            artifacts are available under NDA for customers and prospects. Nothing here is legal advice; align with your
            counsel for your regulatory context.
          </p>
        </section>
      </div>
    </div>
  );
}
