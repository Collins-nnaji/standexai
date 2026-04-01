import Link from "next/link";
import { ArrowRight, Sparkles, Terminal, CheckCircle2, ShieldCheck, Zap, BarChart3, Users } from "lucide-react";
import { TopNav } from "@/components/network/TopNav";
import { AnimatedNetwork } from "@/components/ui/AnimatedNetwork";
import { cn } from "@/lib/utils";
import { neonAuth } from "@/lib/neon/auth-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: session } = await neonAuth.getSession();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAFAF9] overflow-hidden selection:bg-[#7C5CFC]/20 font-[family-name:var(--font-inter)]">
      <TopNav user={session?.user} />
      
      <main className="relative flex-1 flex flex-col items-center justify-center px-4">
        {/* Animated AI Technical Background */}
        <AnimatedNetwork />

        {/* Static Background Gradients for depth */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,92,252,0.12),transparent_55%)] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center pt-8 pb-24">
          
          {/* Left Text Column */}
          <div className="flex flex-col items-start text-left max-w-2xl py-12 lg:py-24">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white/60 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#7C5CFC] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Sparkles className="h-4 w-4" />
              <span>The Reputation Layer for AI Research</span>
            </div>
            
            <h1 className="font-syne mb-6 text-5xl font-extrabold tracking-tight text-zinc-900 md:text-7xl lg:text-8xl leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] to-[#4A26C8]">Collaborators</span><br/>for AI Projects.
            </h1>
            
            <p className="mb-10 text-xl leading-relaxed text-zinc-600 max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              Connect with verified researchers, post project briefs, and receive high-signal proposals. The definitive platform for building breakthrough AI with the world's most elite talent.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link
                href="/discover"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#7C5CFC] px-8 text-base font-extrabold text-white transition-all shadow-[0_8px_30px_rgba(124,92,252,0.3)] hover:bg-[#6042db] hover:shadow-[0_12px_40px_rgba(124,92,252,0.4)] active:scale-95"
              >
                Find Collaborators
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/briefs"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white/80 backdrop-blur-sm shadow-sm px-8 text-base font-bold text-zinc-900 transition-all hover:bg-white hover:border-[#7C5CFC]/30 active:scale-95"
              >
                Submit Project Briefs
              </Link>
            </div>
            
            {/* Quick Stats/Trust info */}
            <div className="mt-12 flex items-center gap-8 border-t border-black/5 pt-8 animate-in fade-in delay-500">
               <div className="flex flex-col">
                 <span className="text-2xl font-black text-zinc-900 font-syne">1.2k+</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Researchers</span>
               </div>
               <div className="h-8 w-px bg-black/5" />
               <div className="flex flex-col">
                 <span className="text-2xl font-black text-zinc-900 font-syne">45</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Verified Labs</span>
               </div>
               <div className="h-8 w-px bg-black/5" />
               <div className="flex flex-col">
                 <span className="text-2xl font-black text-zinc-900 font-syne">89%</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Match Rate</span>
               </div>
            </div>
          </div>

          {/* Right Visual Column ("Graphics generated with code") */}
          <div className="relative w-full h-full min-h-[600px] hidden lg:block animate-in fade-in zoom-in-95 duration-1000 delay-300">
            
            {/* High-Fidelity Code Window */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[540px] rounded-3xl border border-white/20 bg-white/40 p-1 backdrop-blur-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.12)]">
              <div className="rounded-[22px] bg-zinc-950/90 p-6 overflow-hidden">
                <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    <Terminal className="h-3 w-3" /> reproductive_logic.rs
                  </div>
                </div>
                <div className="font-mono text-[13px] leading-relaxed text-zinc-400">
                  <div className="select-none">
                    <span className="text-[#7C5CFC] italic">// Verify impact signals</span><br/>
                    <span className="text-pink-500">fn</span> <span className="text-blue-400">validate_contribution</span>(author: Researcher) {"{"}<br/>
                    &nbsp;&nbsp;<span className="text-pink-500">let</span> reproduction_count = author.repro_signals();<br/>
                    &nbsp;&nbsp;<span className="text-pink-500">let</span> trust_score = reproduction_count.weights().sum();<br/><br/>
                    &nbsp;&nbsp;<span className="text-pink-500">if</span> trust_score &gt; <span className="text-amber-500">THRESHOLD</span> {"{"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;author.promote_to(<span className="text-emerald-400">"PRO_RANK"</span>);<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#7C5CFC]">StandexAI</span>::signal_scouts(author.id);<br/>
                    &nbsp;&nbsp;{"}"}<br/>
                    {"}"}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Reputation Metric 1 - Rank Badge */}
            <div className="absolute top-[10%] right-[10%] animate-bounce transition-transform hover:scale-110 cursor-default" style={{ animationDuration: '5s' }}>
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-200/50 bg-white/80 p-4 shadow-xl backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white font-syne text-xl font-black">#12</div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#7C5CFC]">Domain Rank</p>
                <p className="text-xs font-bold text-zinc-900">Sparse Autoencoders</p>
              </div>
            </div>

            {/* Floating Reputation Metric 2 - Match Score */}
            <div className="absolute bottom-[20%] left-[5%] animate-bounce transition-transform hover:scale-110 cursor-default" style={{ animationDuration: '7s', animationDelay: '1.5s' }}>
              <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-2xl backdrop-blur-md">
                <div className="relative flex h-14 w-14 items-center justify-center">
                   <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-100" />
                      <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="150" strokeDashoffset="45" className="text-[#7C5CFC]" />
                   </svg>
                   <span className="font-syne text-lg font-black text-zinc-900">95%</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#7C5CFC]">Scout Match</p>
                  <p className="max-w-[120px] text-sm font-black leading-tight text-zinc-900">Vision Transformer Edge Brief</p>
                </div>
              </div>
            </div>

            {/* Floating Reputation Metric 3 - Reproduction Signal */}
            <div className="absolute top-[25%] left-[-5%] animate-bounce transition-transform hover:scale-110 cursor-default" style={{ animationDuration: '6s', animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-50/80 px-5 py-3 shadow-lg backdrop-blur-md">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600/70">Verified Reproduction</span>
                  <span className="text-xs font-black text-zinc-900">Google DeepMind Lab</span>
                </div>
              </div>
            </div>

            {/* Differentiation Linkin Icon Table (Preview/Decorative) */}
            <div className="absolute bottom-[2%] right-[5%] animate-pulse opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0">
               <div className="rounded-xl border border-black/5 bg-white p-3 text-[10px] font-bold text-zinc-400">
                LinkedIn is for SWEs. <span className="text-[#7C5CFC]">StandexAI is for AI Proposals.</span>
               </div>
            </div>
          </div>
        </div>

        {/* Brand/Differentiation Section */}
        <section className="relative z-10 w-full bg-white py-24 border-t border-zinc-100">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-16 text-center text-zinc-950">
              <h2 className="font-syne mb-4 text-3xl font-black md:text-5xl">The Network Gap</h2>
              <p className="text-zinc-500">Why generic professional networks fail the research community.</p>
            </div>
            
            <div className="grid overflow-hidden rounded-3xl border border-zinc-200 shadow-2xl md:grid-cols-2">
               <div className="bg-zinc-50 p-8 md:p-12">
                  <h3 className="mb-8 font-syne text-xl font-bold text-zinc-400">LinkedIn / GitHub</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 font-bold text-[10px]">✕</div>
                      <p className="text-zinc-600 underline decoration-zinc-200 decoration-2 underline-offset-4">Self-reported skill endorsements (meaningless for hard science)</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 font-bold text-[10px]">✕</div>
                      <p className="text-zinc-600 underline decoration-zinc-200 decoration-2 underline-offset-4">Generic job titles ("Software Engineer") missing domain nuance</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 font-bold text-[10px]">✕</div>
                      <p className="text-zinc-600 underline decoration-zinc-200 decoration-2 underline-offset-4">Discoverability based on keyword keyword-stuffing</p>
                    </li>
                  </ul>
               </div>
               <div className="bg-white p-8 md:p-12 border-l border-zinc-200 relative">
                  <div className="absolute top-0 right-0 p-4">
                    <Sparkles className="h-6 w-6 text-[#7C5CFC] opacity-40 animate-pulse" />
                  </div>
                  <h3 className="mb-8 font-syne text-xl font-bold text-[#7C5CFC]">StandexAI</h3>
                   <ul className="space-y-6">
                     <li className="flex items-start gap-4">
                       <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-[10px]">✓</div>
                       <p className="font-bold text-zinc-900">Directly submit proposals to active AI project briefs</p>
                     </li>
                     <li className="flex items-start gap-4">
                       <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-[10px]">✓</div>
                       <p className="font-bold text-zinc-900">Find elite collaborators for frontier research projects</p>
                     </li>
                     <li className="flex items-start gap-4">
                       <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-[10px]">✓</div>
                       <p className="font-bold text-zinc-900">Verified reputation signals based on high-signal Proof of Work</p>
                     </li>
                   </ul>
               </div>
            </div>
          </div>
        </section>

        {/* New Graphic: Real-time Discovery Pulse */}
        <section className="relative z-10 w-full bg-[#FAFAF9] py-24 px-4 overflow-hidden">
           <div className="mx-auto max-w-7xl">
              <div className="mb-12 flex flex-col items-center justify-center text-center">
                 <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    <Zap className="h-3 w-3 fill-emerald-500" /> Live Discovery
                 </div>
                 <h2 className="font-syne text-3xl font-black md:text-4xl text-zinc-900">Connections happen here.</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: "Lab Match", text: "Google Research posted a Brief in 'LLM Safety'", color: "text-[#7C5CFC]", icon: Sparkles },
                   { label: "Collab Formed", text: "Dr. Aris & team started a Collab on 'SAE Interpretability'", color: "text-amber-600", icon: Users },
                   { label: "Reputation Signal", text: "Verified reproduction of 'MoE Bench' awarded 120 Impact Points", color: "text-emerald-600", icon: CheckCircle2 }
                 ].map((card, i) => (
                   <div key={i} className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-[#7C5CFC]/30 transition-all">
                      <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100", card.color)}>
                         <card.icon className="h-5 w-5" />
                      </div>
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", card.color)}>{card.label}</p>
                      <p className="text-sm font-semibold text-zinc-900 leading-relaxed">{card.text}</p>
                      
                      {/* Pulse effect */}
                      <div className="absolute top-4 right-4 flex h-2 w-2">
                         <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", i===0 ? "bg-[#7C5CFC]" : i===1 ? "bg-amber-500" : "bg-emerald-500")}></span>
                         <span className={cn("relative inline-flex rounded-full h-2 w-2", i===0 ? "bg-[#7C5CFC]" : i===1 ? "bg-amber-500" : "bg-emerald-500")}></span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
