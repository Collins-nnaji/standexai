import { prismaDb as prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/network/TopNav";
import { neonAuth } from "@/lib/neon/auth-server";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, Sparkles, Newspaper } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.aIIndexPost.findUnique({
    where: { id },
    select: { title: true, summary: true }
  });

  if (!post) return { title: "Publication Not Found" };

  return {
    title: `${post.title} | StandexAI Intelligence`,
    description: post.summary,
  };
}

export default async function PublicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await neonAuth.getSession();

  const post = await prisma.aIIndexPost.findUnique({
    where: { id },
  }) as any;

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-[family-name:var(--font-inter)] selection:bg-[#7C5CFC]/20">
      <TopNav user={session?.user} />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Breadcrumbs / Back button */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/intelligence" 
            className="group flex items-center gap-2 text-sm font-bold text-zinc-500 transition-colors hover:text-[#7C5CFC]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Intelligence Hub
          </Link>
          <div className="flex items-center gap-4">
             <button className="rounded-full p-2 text-zinc-400 hover:bg-white hover:text-[#7C5CFC] transition-all">
                <Share2 className="h-4 w-4" />
             </button>
             <button className="rounded-full p-2 text-zinc-400 hover:bg-white hover:text-[#7C5CFC] transition-all">
                <Bookmark className="h-4 w-4" />
             </button>
          </div>
        </div>

        {/* Article Header */}
        <div className="mb-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#7C5CFC]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] ring-1 ring-[#7C5CFC]/20">
            <Newspaper className="h-3 w-3" /> {post.category}
          </div>
          <h1 className="font-syne mb-6 text-4xl font-black text-zinc-900 md:text-5xl lg:text-6xl leading-[1.1]">
            {post.title}
          </h1>
          <p className="mb-8 text-xl font-medium leading-relaxed text-zinc-500">
            {post.summary}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 border-t border-zinc-200 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C5CFC] font-bold text-white shadow-lg shadow-[#7C5CFC]/20">S</div>
              <div>
                <p className="text-sm font-bold text-zinc-900">StandexAI Editorial</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#7C5CFC]">Verified Signal</p>
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
               <span className="flex items-center gap-1.5 uppercase tracking-widest">
                  <Calendar className="h-3.5 w-3.5" /> {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
               </span>
               <span className="flex items-center gap-1.5 uppercase tracking-widest">
                  <Clock className="h-3.5 w-3.5" /> {post.readingTime} min read
               </span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {post.imageUrl && (
          <div className="relative mb-12 h-[300px] md:h-[500px] w-full overflow-hidden rounded-[40px] shadow-2xl">
            <Image 
              src={post.imageUrl} 
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Body */}
        <article className="prose prose-zinc prose-lg max-w-none">
          <div className="whitespace-pre-wrap font-medium leading-relaxed text-zinc-700">
            {post.content}
          </div>
        </article>

        {/* Bottom CTA */}
        <div className="mt-24 rounded-[40px] border border-[#7C5CFC]/20 bg-white p-8 md:p-12 text-center shadow-2xl shadow-[#7C5CFC]/5">
           <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7C5CFC]/10">
              <Sparkles className="h-8 w-8 text-[#7C5CFC]" />
           </div>
           <h3 className="font-syne mb-4 text-2xl font-black text-zinc-900">Stay ahead of the signal.</h3>
           <p className="mx-auto mb-8 max-w-md text-zinc-500">
              Join the elite AI researchers receiving daily intelligence on frontier model architecture and global policy breakthroughs.
           </p>
           <Link 
             href="/auth/sign-up" 
             className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 shadow-xl"
           >
             Join the Network
           </Link>
        </div>
      </main>
    </div>
  );
}
