import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prismaDb as prisma } from "@/lib/prisma";
import { TopNav } from "@/components/network/TopNav";
import { neonAuth } from "@/lib/neon/auth-server";
import { Clock, ArrowRight, TrendingUp, Sparkles, Newspaper, Bookmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Intelligence Hub | StandexAI",
  description: "Curated publications and high-signal news from across the global AI research space.",
};

export const dynamic = "force-dynamic";

export default async function IntelligencePage() {
  const { data: session } = await neonAuth.getSession();

  const posts = await prisma.aIIndexPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: 24, // Show a larger number on the dedicated page
  }) as any;

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-600 font-[family-name:var(--font-inter)]">
      <TopNav user={session?.user} />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-8">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7C5CFC]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7C5CFC] ring-1 ring-[#7C5CFC]/20">
              <Newspaper className="h-3 w-3" /> StandexAI Editorial
            </div>
            <h1 className="font-syne text-5xl font-black text-zinc-900 md:text-7xl leading-[0.9]">
              AI <span className="text-[#7C5CFC]">Intelligence.</span>
            </h1>
            <p className="mt-6 text-lg font-medium text-zinc-500 leading-relaxed">
              Browse all publications on the frontiers of machine learning, policy, and model architecture.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-400">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span>Full Archive</span>
          </div>
        </div>

        {/* Featured Story (Hero) */}
        {featuredPost && (
          <section className="mb-16">
            <Link href={`/intelligence/${featuredPost.id}`} className="group relative block overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-2xl transition-all hover:border-[#7C5CFC]/30">
              <div className="grid lg:grid-cols-[1fr_450px]">
                <div className="relative h-[300px] lg:h-[500px] overflow-hidden">
                  <Image 
                    src={featuredPost.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1632"} 
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7C5CFC]">
                    <Sparkles className="h-3.5 w-3.5" /> Featured Publication
                  </div>
                  <h2 className="font-syne mb-6 text-3xl font-black text-zinc-900 md:text-4xl lg:text-5xl leading-[1.1] group-hover:text-[#7C5CFC] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="mb-8 text-lg text-zinc-500 leading-relaxed">
                    {featuredPost.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 font-bold text-[#7C5CFC]">S</div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">StandexAI Editorial</p>
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {featuredPost.readingTime} min read
                        </p>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 group-hover:bg-[#7C5CFC] group-hover:text-white group-hover:border-[#7C5CFC] transition-all">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Intelligence Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {remainingPosts.length > 0 ? remainingPosts.map((post: any) => (
            <Link key={post.id} href={`/intelligence/${post.id}`} className="group flex flex-col rounded-3xl border border-zinc-200 bg-white p-2 transition-all hover:border-[#7C5CFC]/20 hover:shadow-xl">
              <div className="relative h-[240px] w-full overflow-hidden rounded-2xl">
                <Image 
                  src={post.imageUrl || "https://images.unsplash.com/photo-1620712943543-bcc4628c6820?q=80&w=1530"} 
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] shadow-sm">
                  {post.category}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-syne mb-4 text-xl font-bold text-zinc-900 group-hover:text-[#7C5CFC] transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="mb-6 line-clamp-3 text-sm font-medium text-zinc-500 leading-relaxed">
                  {post.summary}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readingTime}m read
                  </span>
                  <button className="rounded-full p-2 text-zinc-300 hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/5 transition-all">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full rounded-3xl border border-dashed border-zinc-200 p-24 text-center">
              <p className="font-syne text-xl font-bold text-zinc-400">Loading full intelligence archive.</p>
              <p className="mt-2 text-zinc-500">Wait for the next high-signal publication.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
