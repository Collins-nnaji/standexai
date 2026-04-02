import Link from "next/link";
import { ArrowRight, Sparkles, Terminal, CheckCircle2, ShieldCheck, Zap, BarChart3, Users, Newspaper, Clock, TrendingUp } from "lucide-react";
import { TopNav } from "@/components/network/TopNav";
import { TalentCard } from "@/components/network/TalentCard";
import { AnimatedNetwork } from "@/components/ui/AnimatedNetwork";
import { cn } from "@/lib/utils";
import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: session } = await neonAuth.getSession();

  // Fetch the latest Intelligence from AI Index
  const currentUser = session?.user?.email ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, handle: true, ranks: { select: { domain: true } } }
  }) as any : null;

  const posts = (await prisma.aIIndexPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: 7,
  })) as any;

  const eliteTalent = (await prisma.user.findMany({
    where: { role: { in: ["RESEARCHER", "PRO"] } },
    take: 3,
    include: {
      workItems: { orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, type: true } },
      ranks: { orderBy: { rankPosition: "asc" }, take: 1, select: { domain: true, rankPosition: true, score: true } }
    }
  })) as any;

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1, 7);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAFAF9] overflow-hidden selection:bg-[#7C5CFC]/20 font-[family-name:var(--font-inter)]">
      <TopNav user={session?.user} />
      
      <main className="relative flex-1 flex flex-col items-center justify-center px-4">
        {/* Animated AI Technical Background */}
        <AnimatedNetwork />

        {/* Static Background Gradients for depth */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,92,252,0.12),transparent_55%)] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl w-full grid lg:grid-cols-2 gap-8 items-center pt-8 pb-16">
          
          {/* Left Text Column - Compressed */}
          <div className="flex flex-col items-start text-left max-w-2xl py-8 lg:py-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white/60 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#7C5CFC] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Sparkles className="h-4 w-4" />
              <span>Deep Signal for AI Research</span>
            </div>
            
            <h1 className="font-syne mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 md:text-6xl lg:text-7xl leading-[1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] to-[#4A26C8]">Breakthrough AI.</span><br/>Find Elite Teams.
            </h1>
            
            <p className="mb-8 text-lg leading-relaxed text-zinc-600 max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              The definitive network for frontier AI. Connect with verified researchers, launch projects, and prove impact through verifiable reputation signals.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link
                href="/talent"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#7C5CFC] px-8 text-sm font-extrabold text-white transition-all shadow-[0_8px_30px_rgba(124,92,252,0.3)] hover:bg-[#6042db] hover:shadow-[0_12px_40px_rgba(124,92,252,0.4)] active:scale-95"
              >
                Find Teams
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white/80 backdrop-blur-sm shadow-sm px-8 text-sm font-bold text-zinc-900 transition-all hover:bg-white hover:border-[#7C5CFC]/30 active:scale-95"
              >
                Launch Open Project
              </Link>
            </div>

            {/* Compact Extension Widget in Hero */}
            <div className="mt-12 w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
               <div className="rounded-3xl border border-zinc-200/50 bg-white/50 backdrop-blur-md p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">The High-Signal Extension</p>
                     <div className="flex h-1 w-12 rounded-full bg-zinc-100 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-[#7C5CFC] to-[#4A26C8]" />
                     </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <p className="mb-1 text-xs font-black text-zinc-900">1. Heritage</p>
                        <p className="text-[10px] leading-relaxed text-zinc-500">Import Identity<br/>via LinkedIn.</p>
                     </div>
                     <div className="border-l border-zinc-100 pl-4">
                        <p className="mb-1 text-xs font-black text-zinc-900">2. Implementation</p>
                        <p className="text-[10px] leading-relaxed text-zinc-500">Connect Code<br/>via GitHub.</p>
                     </div>
                     <div className="border-l border-zinc-100 pl-4">
                        <p className="mb-1 text-xs font-black text-zinc-900">3. Impact</p>
                        <p className="text-[10px] leading-relaxed font-bold text-[#7C5CFC]">Verified Signal<br/>on StandexAI.</p>
                     </div>
                  </div>
               </div>
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

            {/* Specialized Signal Badge */}
            <div className="absolute bottom-[2%] right-[5%] transition-all hover:scale-105">
               <div className="rounded-2xl border border-[#7C5CFC]/20 bg-white/90 p-4 shadow-xl backdrop-blur-xl group">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C5CFC]/10">
                       <Zap className="h-4 w-4 text-[#7C5CFC]" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">The Research Extension</p>
                 </div>
                 <p className="text-xs font-bold text-zinc-900 leading-tight">Bring your history from LinkedIn.<br/><span className="text-[#7C5CFC]">Build your future on StandexAI.</span></p>
               </div>
            </div>
          </div>
        </div>

        {/* Elite Talent Discovery Pulse (New) */}
        <section className="relative z-10 w-full bg-[#FAFAF9] py-24 border-t border-zinc-100">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
              <div className="max-w-2xl text-left">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7C5CFC]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7C5CFC] ring-1 ring-[#7C5CFC]/20">
                  <Sparkles className="h-3 w-3" /> Talent Signals
                </div>
                <h2 className="font-syne text-4xl font-black text-zinc-900 md:text-5xl leading-tight">
                  Elite AI <span className="text-[#7C5CFC]">Talent.</span>
                </h2>
                <p className="mt-4 text-lg font-medium text-zinc-500 leading-relaxed">
                  Connect with the world's highest-signal AI researchers, verified by peer reproduction.
                </p>
              </div>
              <Link href="/talent" className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-[#7C5CFC] hover:text-[#6042db] transition-colors">
                Discover All Talent <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {eliteTalent.map((user: any) => (
                <TalentCard key={user.id} {...user} domain={user.ranks[0]?.domain || "AI Research"} rankPosition={user.ranks[0]?.rankPosition || null} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Intelligence Section (Integrated AI Index) */}
        <section className="relative z-10 w-full bg-white py-24 border-t border-zinc-100">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-8">
              <div className="max-w-2xl text-left">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7C5CFC]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7C5CFC] ring-1 ring-[#7C5CFC]/20">
                  <Newspaper className="h-3 w-3" /> Live Intelligence
                </div>
                <h2 className="font-syne text-4xl font-black text-zinc-900 md:text-5xl leading-tight">
                  The <span className="text-[#7C5CFC]">Intelligence</span> Hub.
                </h2>
                <p className="mt-4 text-lg font-medium text-zinc-500 leading-relaxed">
                  Curated daily insights into model architecture, global AI policy, and frontier breakthroughs.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span>Verified Signal Feed</span>
              </div>
            </div>

            {/* Featured Story */}
            {featuredPost && (
              <div className="mb-12">
                <Link href={`/intelligence/${featuredPost.id}`} className="group relative block overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-2xl transition-all hover:border-[#7C5CFC]/30">
                  <div className="grid lg:grid-cols-[1fr_450px]">
                    <div className="relative h-[300px] lg:h-[450px] overflow-hidden">
                      <Image 
                        src={featuredPost.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1632"} 
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:p-10">
                      <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7C5CFC]">
                        <Sparkles className="h-3.5 w-3.5" /> Featured Publication
                      </div>
                      <h3 className="font-syne mb-4 text-2xl font-black text-zinc-900 md:text-3xl leading-tight group-hover:text-[#7C5CFC] transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="mb-6 text-base text-zinc-500 leading-relaxed line-clamp-3">
                        {featuredPost.summary}
                      </p>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {featuredPost.readingTime}m read
                         </span>
                         <ArrowRight className="h-5 w-5 text-zinc-300 group-hover:text-[#7C5CFC] transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Small Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {remainingPosts.map((post: any) => (
                <Link key={post.id} href={`/intelligence/${post.id}`} className="group flex flex-col rounded-3xl border border-zinc-100 bg-white p-2 transition-all hover:border-[#7C5CFC]/20 hover:shadow-xl">
                  <div className="relative h-[200px] w-full overflow-hidden rounded-2xl">
                    <Image 
                      src={post.imageUrl || "https://images.unsplash.com/photo-1620712943543-bcc4628c6820?q=80&w=1530"} 
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-lg bg-white/90 backdrop-blur-md px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[#7C5CFC] shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="font-syne mb-2 text-lg font-bold text-zinc-900 group-hover:text-[#7C5CFC] transition-colors leading-tight">
                      {post.title}
                    </h4>
                    <p className="mb-4 line-clamp-2 text-sm font-medium text-zinc-500 leading-relaxed">
                      {post.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-zinc-50">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.readingTime}m
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
               <Link href="/intelligence" className="rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-bold text-zinc-600 transition-all hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC]">
                 View All Publications
               </Link>
            </div>
          </div>
        </section>

        {/* New Graphic: Real-time Discovery Pulse */}
        <section className="relative z-10 w-full bg-[#FAFAF9] py-24 px-4 overflow-hidden border-t border-zinc-100">
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
