import Image from "next/image";
import {
  Activity,
  BarChart3,
  Bot,
  Box,
  Brain,
  Code2,
  CreditCard,
  Database,
  FileText,
  Globe2,
  Layers,
  LayoutDashboard,
  Lock,
  Rocket,
  Search,
  Terminal,
} from "lucide-react";
import { deckImages } from "./presentation-assets";

/** Stylized UI chrome — for deck visuals only */

export function MockCursorEditor() {
  return (
    <div className="w-full max-w-3xl rounded-xl border border-zinc-700/80 bg-[#1e1e1e] shadow-2xl shadow-black/40 overflow-hidden text-left">
      <div className="flex h-9 items-center gap-2 border-b border-zinc-700/80 bg-[#252526] px-3">
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="relative ml-1 h-5 w-5 shrink-0 opacity-90">
          <Image src={deckImages.cursor} alt="" width={20} height={20} className="object-contain" unoptimized />
        </div>
        <span className="ml-1 text-[10px] font-mono text-zinc-500">app/page.tsx — my-ai-app</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="relative h-4 w-4 opacity-80">
            <Image src={deckImages.react} alt="" width={16} height={16} className="object-contain" unoptimized />
          </div>
          <div className="relative h-4 w-4 opacity-80">
            <Image src={deckImages.nextjs} alt="" width={16} height={16} className="object-contain" unoptimized />
          </div>
        </div>
      </div>
      <div className="flex min-h-[220px]">
        <div className="w-14 border-r border-zinc-700/60 bg-[#252526] py-2 flex flex-col items-center gap-2">
          <Code2 className="h-4 w-4 text-zinc-500" />
          <Search className="h-4 w-4 text-zinc-600" />
          <Terminal className="h-4 w-4 text-zinc-600" />
        </div>
        <div className="flex-1 p-3 font-mono text-[10px] leading-relaxed text-zinc-300">
          <p>
            <span className="text-purple-400">export default</span>{" "}
            <span className="text-sky-400">function</span> Page() {"{"}
          </p>
          <p className="pl-3">
            <span className="text-sky-400">return</span> (
          </p>
          <p className="pl-6 text-orange-300">&lt;main className=&quot;...&quot;&gt;</p>
          <p className="pl-9 text-zinc-500">{"/* Next.js App Router + React */"}</p>
          <p className="pl-6 text-orange-300">&lt;/main&gt;</p>
          <p className="pl-3">);</p>
          <p>{"}"}</p>
        </div>
        <div className="w-[38%] border-l border-zinc-700/60 bg-[#181818] p-2">
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
            <span className="text-violet-400" aria-hidden>
              ✦
            </span>
            AI assistant
          </div>
          <div className="rounded-lg border border-zinc-700/80 bg-zinc-900/80 p-2 text-[9px] text-zinc-400">
            Suggest a production-ready Next.js layout with server components, loading.tsx, and error boundaries…
          </div>
          <div className="mt-2 rounded border border-zinc-800 bg-zinc-950/80 p-1.5 text-[8px] text-zinc-500">
            + Generate tests · + Refactor to hooks
          </div>
        </div>
      </div>
    </div>
  );
}

export function MockGitHub() {
  return (
    <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-xl overflow-hidden text-left">
      <div className="flex items-center gap-3 border-b border-zinc-100 bg-zinc-50 px-4 py-3">
        <div className="relative h-8 w-8 shrink-0">
          <Image src={deckImages.github} alt="GitHub" width={32} height={32} className="object-contain" unoptimized />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold text-zinc-800">standexai / build-production-ai</span>
          <p className="text-[9px] text-zinc-500">Issues · Pull requests · Actions · Security</p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
          Public
        </span>
      </div>
      <div className="grid grid-cols-[1fr_128px] gap-0 text-[10px]">
        <div className="p-3 space-y-1">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-zinc-400">Repository</p>
          {["src/app/page.tsx", "components/Agent.tsx", "lib/rag.ts", ".github/workflows/ci.yml"].map((f) => (
            <div key={f} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-zinc-50">
              <FileText className="h-3.5 w-3.5 shrink-0 text-blue-600" />
              <span className="font-mono text-zinc-700">{f}</span>
            </div>
          ))}
        </div>
        <div className="border-l border-zinc-100 bg-zinc-50/80 p-3">
          <div className="text-[9px] font-bold uppercase text-zinc-500 mb-2">Contributors</div>
          <div className="flex h-16 items-end gap-0.5">
            {[4, 7, 3, 8, 5, 9, 6, 10, 7, 12, 8, 14].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-emerald-400/70" style={{ height: `${h * 6}%` }} />
            ))}
          </div>
          <p className="mt-2 text-[9px] text-zinc-500">12 commits · 4 PRs this week</p>
        </div>
      </div>
    </div>
  );
}

export function MockVercel() {
  return (
    <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-5 shadow-xl text-left">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-900">
            <Image src={deckImages.vercel} alt="Vercel" width={22} height={22} className="object-contain invert" unoptimized />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900">build-production-ai</p>
            <p className="text-[10px] text-zinc-500">Production · main · Edge</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          Ready
        </span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
          <div className="flex items-center gap-2 text-[10px] text-zinc-600">
            <Globe2 className="h-3.5 w-3.5 shrink-0" />
            <span className="font-mono truncate">my-ai-app.vercel.app</span>
          </div>
          <p className="mt-2 text-[9px] text-zinc-400">Deployed · Global CDN · TLS</p>
        </div>
        <div className="rounded-lg border border-dashed border-zinc-200 bg-white p-3">
          <p className="text-[9px] font-bold uppercase text-zinc-400">Preview</p>
          <p className="mt-1 font-mono text-[10px] text-violet-600">feat-rag-7a3.vercel.app</p>
        </div>
      </div>
    </div>
  );
}

export function MockNeon() {
  return (
    <div className="w-full max-w-lg rounded-xl border border-cyan-900/30 bg-gradient-to-br from-[#0a1628] to-[#0d2137] p-4 shadow-2xl text-left text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative h-10 w-28 shrink-0">
          <Image src={deckImages.neon} alt="Neon" width={112} height={40} className="object-contain object-left" unoptimized />
        </div>
        <span className="ml-auto text-[9px] text-cyan-200/70">Serverless Postgres</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-cyan-500/20 bg-black/20 p-3">
          <p className="text-[9px] uppercase tracking-wider text-cyan-300/80 mb-2">Branches</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              main (primary)
            </div>
            <div className="flex items-center gap-2 text-[10px] text-cyan-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
              preview/dev (copy-on-write)
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-cyan-500/20 bg-black/30 p-3 font-mono text-[9px] text-cyan-100/90">
          <p className="text-cyan-500/60 mb-1">-- pgvector</p>
          <p>SELECT * FROM embeddings</p>
          <p className="text-cyan-300/50">ORDER BY embedding &lt;=&gt; $1</p>
          <p className="text-cyan-300/40 mt-2">LIMIT 8;</p>
        </div>
      </div>
    </div>
  );
}

export function MockModelProviders() {
  const cards = [
    {
      name: "OpenAI",
      sub: "GPT · embeddings · realtime",
      color: "from-emerald-600/25 to-teal-950/50",
      src: deckImages.openai,
    },
    {
      name: "Claude",
      sub: "Reasoning · long context",
      color: "from-orange-600/25 to-amber-950/50",
      src: deckImages.claude,
    },
    {
      name: "Google",
      sub: "Gemini · scale · multimodal",
      color: "from-blue-600/25 to-indigo-950/50",
      src: deckImages.google,
    },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
      {cards.map((c) => (
        <div
          key={c.name}
          className={`flex w-[156px] flex-col rounded-xl border border-white/10 bg-gradient-to-br ${c.color} p-4 shadow-lg backdrop-blur-sm sm:w-[170px]`}
        >
          <div className="relative mb-3 h-8 w-full">
            <Image src={c.src} alt={c.name} width={120} height={32} className="object-contain object-left max-h-8 w-auto" unoptimized />
          </div>
          <p className="text-sm font-bold text-white">{c.name}</p>
          <p className="text-[9px] text-white/65 leading-snug mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

export function MockAgentBuilder() {
  return (
    <div className="w-full max-w-xl rounded-xl border border-violet-500/30 bg-zinc-950 p-4 shadow-2xl text-left">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-violet-300">
          <Bot className="h-5 w-5 shrink-0" />
          <span className="text-sm font-bold">Agent system</span>
        </div>
        <div className="relative h-8 w-24 shrink-0 opacity-95">
          <Image src={deckImages.openclaw} alt="Agent tooling" width={96} height={32} className="object-contain object-right" unoptimized />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch justify-between gap-2 text-[10px]">
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 flex-1">
          <p className="font-bold text-zinc-300 mb-1">User message</p>
          <p className="text-zinc-500">“Deploy the fix to staging and open a PR…”</p>
        </div>
        <div className="hidden sm:flex items-center text-violet-500">→</div>
        <div className="rounded-lg border border-violet-500/40 bg-violet-950/50 p-3 flex-1">
          <p className="font-bold text-violet-200 mb-1">Agent loop</p>
          <p className="text-violet-300/70">Plan · tool calls · verify · retry</p>
        </div>
        <div className="hidden sm:flex items-center text-violet-500">→</div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 flex-1">
          <p className="font-bold text-zinc-300 mb-1">Actions</p>
          <p className="text-zinc-500">GitHub · Vercel hook · Slack</p>
        </div>
      </div>
    </div>
  );
}

export function MockRAGWeek() {
  return (
    <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-zinc-950 p-5 shadow-xl ring-1 ring-zinc-200/60">
      <div className="mb-4">
        <div className="inline-flex rounded-full bg-[#7C5CFC]/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#c4b5fd]">
          Week 3 — Memory & RAG
        </div>
      </div>
      <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 text-[9px] text-zinc-400">
        <span className="font-bold text-zinc-300">Pipeline: </span>
        Documents → chunk → embed → store in pgvector → retrieve top-k → inject into prompt
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-300">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 p-4 w-full sm:w-[28%]">
          <Layers className="h-6 w-6 text-sky-400" />
          <span className="font-bold">Embeddings</span>
          <span className="text-zinc-500 text-center">Chunk & vectorize</span>
        </div>
        <span className="text-[#7C5CFC] font-bold">→</span>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 p-4 w-full sm:w-[28%]">
          <Database className="h-6 w-6 text-fuchsia-400" />
          <span className="font-bold">Vector search</span>
          <span className="text-zinc-500 text-center">Similarity + metadata filters</span>
        </div>
        <span className="text-[#7C5CFC] font-bold">→</span>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 p-4 w-full sm:w-[28%]">
          <Brain className="h-6 w-6 text-emerald-400" />
          <span className="font-bold">Grounded AI</span>
          <span className="text-zinc-500 text-center">Citations & context</span>
        </div>
      </div>
    </div>
  );
}

export function MockGoogleOAuth() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-zinc-100 shadow-sm">
        <div className="relative h-9 w-9">
          <Image src={deckImages.google} alt="Google" width={36} height={36} className="object-contain" unoptimized />
        </div>
      </div>
      <p className="text-sm font-bold text-zinc-900">Sign in with Google</p>
      <p className="mt-1 text-[10px] text-zinc-500">OAuth 2.0 · PKCE · refresh tokens</p>
      <button
        type="button"
        className="mt-5 w-full rounded-lg border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-zinc-700 shadow-sm"
      >
        Continue with Google
      </button>
      <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-emerald-600">
        <Lock className="h-3 w-3" />
        HttpOnly session cookies · CSRF protection
      </div>
    </div>
  );
}

export function MockShadcn() {
  return (
    <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-xl text-left space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">shadcn/ui + Radix</p>
        <span className="rounded-md bg-zinc-900 px-2 py-1 text-[9px] font-bold tracking-wide text-white">copy-paste components</span>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900">Dashboard</h3>
        <p className="text-[10px] text-zinc-500 mt-1">Card · Button · Dialog · Sheet · Form</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-zinc-900 px-3 py-1.5 text-[10px] font-semibold text-white">Primary</span>
          <span className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-700">
            Outline
          </span>
          <span className="rounded-md bg-zinc-100 px-3 py-1.5 text-[10px] font-semibold text-zinc-600">Secondary</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-20 rounded-md border border-dashed border-zinc-300 bg-white/60 flex flex-col items-center justify-center text-[9px] text-zinc-500 p-2 text-center">
          Data table
          <span className="text-zinc-400 mt-1">Sort · filter</span>
        </div>
        <div className="h-20 rounded-md border border-dashed border-zinc-300 bg-white/60 flex flex-col items-center justify-center text-[9px] text-zinc-500 p-2 text-center">
          Command palette
          <span className="text-zinc-400 mt-1">⌘K navigation</span>
        </div>
      </div>
    </div>
  );
}

export function MockGoogleAnalytics() {
  return (
    <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-4 shadow-xl text-left">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative h-7 w-7 shrink-0">
          <Image src={deckImages.google} alt="" width={28} height={28} className="object-contain" unoptimized />
        </div>
        <LayoutDashboard className="h-4 w-4 text-orange-600 shrink-0" />
        <span className="text-sm font-bold text-zinc-900">Google Analytics</span>
        <span className="ml-auto text-[9px] text-zinc-400">Last 28 days</span>
      </div>
      <div className="flex h-28 items-end gap-1">
        {[40, 55, 48, 70, 62, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-orange-500/30 to-orange-500/80" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          { k: "Users", v: "12.4k" },
          { k: "Sessions", v: "38.1k" },
          { k: "Engagement", v: "3m 12s" },
        ].map((x) => (
          <div key={x.k} className="rounded-lg bg-zinc-50 py-2">
            <p className="text-[9px] text-zinc-500">{x.k}</p>
            <p className="text-xs font-bold text-zinc-900">{x.v}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[9px] text-zinc-400">Events: signup_complete · ai_message_sent · subscription_started</p>
    </div>
  );
}

export function MockGoogleAds() {
  return (
    <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-4 shadow-xl text-left">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative h-7 w-7 shrink-0">
          <Image src={deckImages.google} alt="" width={28} height={28} className="object-contain" unoptimized />
        </div>
        <BarChart3 className="h-4 w-4 text-blue-600 shrink-0" />
        <span className="text-sm font-bold text-zinc-900">Google Ads</span>
      </div>
      <table className="w-full text-[10px]">
        <thead>
          <tr className="text-zinc-500 border-b border-zinc-100">
            <th className="text-left py-2 font-medium">Campaign</th>
            <th className="text-right py-2 font-medium">Impr.</th>
            <th className="text-right py-2 font-medium">Clicks</th>
            <th className="text-right py-2 font-medium">ROAS</th>
          </tr>
        </thead>
        <tbody className="text-zinc-800">
          {[
            ["Search — AI course", "84k", "1.2k", "4.1x"],
            ["PMax — prospecting", "120k", "2.1k", "3.4x"],
            ["Display — retarget", "40k", "840", "2.8x"],
          ].map(([a, b, c, d]) => (
            <tr key={a} className="border-b border-zinc-50">
              <td className="py-2 font-medium">{a}</td>
              <td className="py-2 text-right text-zinc-600">{b}</td>
              <td className="py-2 text-right">{c}</td>
              <td className="py-2 text-right text-emerald-600 font-semibold">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MockAzureFoundry() {
  return (
    <div className="w-full max-w-xl rounded-xl border border-sky-800/40 bg-gradient-to-br from-[#0f172a] to-[#172554] p-4 shadow-2xl text-left text-white">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-10 w-24 shrink-0">
          <Image src={deckImages.azure} alt="Microsoft Azure" width={96} height={40} className="object-contain object-left" unoptimized />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold">Azure cloud</p>
          <p className="text-[10px] text-sky-200/70">Storage, identity, and AI platform services</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-sky-500/25 bg-black/25 p-3">
          <Box className="h-5 w-5 text-sky-300 mb-2" />
          <p className="text-xs font-bold">Blob storage</p>
          <p className="text-[9px] text-sky-200/60 mt-1">Datasets, uploads, static assets</p>
        </div>
        <div className="rounded-lg border border-violet-500/25 bg-black/25 p-3">
          <Activity className="h-5 w-5 text-violet-300 mb-2" />
          <p className="text-xs font-bold">Azure AI Foundry</p>
          <p className="text-[9px] text-violet-200/60 mt-1">Models, evals, governance at scale</p>
        </div>
      </div>
    </div>
  );
}

export function MockStripe() {
  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl text-left">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-20 shrink-0">
            <Image src={deckImages.stripe} alt="Stripe" width={80} height={32} className="object-contain object-left" unoptimized />
          </div>
          <span className="text-sm font-bold text-zinc-900">Checkout</span>
        </div>
        <CreditCard className="h-5 w-5 text-indigo-500 shrink-0" />
      </div>
      <div className="space-y-2">
        <div className="h-9 rounded-md border border-zinc-200 bg-zinc-50 px-3 flex items-center text-[10px] text-zinc-400">
          Card number
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 rounded-md border border-zinc-200 bg-zinc-50 px-3 flex items-center text-[10px] text-zinc-400">
            MM / YY
          </div>
          <div className="h-9 rounded-md border border-zinc-200 bg-zinc-50 px-3 flex items-center text-[10px] text-zinc-400">
            CVC
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-[#635BFF] py-2.5 text-center text-xs font-bold text-white">
        Pay · Start subscription
      </div>
      <p className="mt-2 text-[9px] text-center text-zinc-400">Webhooks · Customer Portal · invoices</p>
    </div>
  );
}

const STACK_LOGOS: { src: string; alt: string }[] = [
  { src: deckImages.github, alt: "GitHub" },
  { src: deckImages.vercel, alt: "Vercel" },
  { src: deckImages.neon, alt: "Neon" },
  { src: deckImages.openai, alt: "OpenAI" },
  { src: deckImages.azure, alt: "Azure" },
  { src: deckImages.stripe, alt: "Stripe" },
];

export function MockStackMontage() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
      {STACK_LOGOS.map((item) => (
        <div
          key={item.alt}
          className="flex min-h-[112px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-5 shadow-sm shadow-zinc-200/80"
        >
          <div className="relative flex h-11 w-full max-w-[130px] items-center justify-center">
            <Image
              src={item.src}
              alt={item.alt}
              width={140}
              height={48}
              className="max-h-11 w-auto object-contain"
              unoptimized={item.src.endsWith(".svg") || item.src.endsWith(".webp")}
            />
          </div>
          <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{item.alt}</span>
        </div>
      ))}
    </div>
  );
}

export function MockCohort() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-stretch md:gap-6">
      <div className="relative aspect-[4/3] min-h-[200px] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-md md:aspect-auto md:min-h-[260px]">
        <Image
          src={deckImages.standexHero}
          alt="StandexAI — applied AI engineering"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 360px"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute bottom-3 left-3 right-3 text-[10px] font-bold uppercase tracking-widest text-white/90">
          Cohort experience
        </p>
      </div>
      <div className="rounded-2xl border border-[#7C5CFC]/25 bg-white p-6 shadow-xl text-left">
        <Rocket className="h-8 w-8 text-[#7C5CFC] mb-3" />
        <ul className="space-y-3 text-sm font-semibold text-zinc-800">
          <li className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7C5CFC]/15 text-[10px] text-[#7C5CFC]">6</span>
            Weeks intensive
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7C5CFC]/15 text-[10px] text-[#7C5CFC]">2</span>
            Live sessions per week
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7C5CFC]/15 text-[10px] text-[#7C5CFC]">1</span>
            Shippable milestone every week
          </li>
        </ul>
        <p className="mt-4 text-[10px] leading-relaxed text-zinc-500">
          Same stack you’ll use on the job: PRs, previews, observability, and demos—not slide-only homework.
        </p>
      </div>
    </div>
  );
}

export function MockMentorship() {
  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white shadow-xl text-left">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,160px)_1fr] md:gap-0">
        <div className="relative hidden aspect-[4/3] min-h-0 w-full md:block md:aspect-auto md:min-h-[220px]">
          <Image
            src={deckImages.standexHero}
            alt=""
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-[#7C5CFC] to-violet-600 flex items-center justify-center text-white text-xl font-bold md:hidden">
              M
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900">Live mentorship</p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                Code reviews, architecture feedback, and production checklists—so your weekly ship matches real engineering bar.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-[9px] font-bold text-emerald-800">PR feedback</span>
            <span className="rounded-md bg-[#7C5CFC]/10 px-2 py-1 text-[9px] font-bold text-[#5b21b6]">System design</span>
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-[9px] font-bold text-zinc-600">Observability & errors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
