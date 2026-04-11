import { neonAuth } from "@/lib/neon/auth-server";
import { TopNav } from "@/components/network/TopNav";
import { Metadata } from "next";
import { Target } from "lucide-react";
import { JobsBoardClient, JobItem } from "@/components/ui/JobsBoardClient";

export const metadata: Metadata = {
  title: "AI Jobs Network | StandexAI",
  description: "Exclusive AI roles and opportunities for the StandexAI engineering ecosystem.",
};

export const dynamic = "force-dynamic";

const JOBS: JobItem[] = [
  {
    id: "job-1",
    title: "Senior AI Engineer (LLM Integration)",
    company: "Standex Prime Ecosystem",
    location: "Remote / Global",
    salary: "$140k - $190k",
    type: "Full-Time",
    tags: ["RAG", "Next.js", "Python", "Vector DBs"],
    isHot: true,
    description: "We are seeking a Senior AI Engineer to lead the integration of advanced Large Language Models into enterprise applications. You will orchestrate agentic workflows, design semantic search systems, and optimize latency for real-time AI tools.",
    requirements: [
      "5+ years of software engineering experience.",
      "Deep understanding of modern LLM architectures and prompting paradigms.",
      "Experience with Vector Databases (Pinecone, Weaviate, or Qdrant).",
      "Proficient in Python, TypeScript, and robust API design."
    ]
  },
  {
    id: "job-2",
    title: "Machine Learning Researcher",
    company: "Cognitive Forge AI",
    location: "San Francisco, CA / Hybrid",
    salary: "$160k - $220k",
    type: "Full-Time",
    tags: ["PyTorch", "Model Fine-tuning", "Transformers"],
    isHot: false,
    description: "Join our frontier research team to push the boundaries of multimodal learning. You will work on pre-training methodologies, evaluate model performance at scale, and publish applied research that directly impacts product pipelines.",
    requirements: [
      "Ph.D. or equivalent research experience in Computer Science or AI.",
      "Track record of pushing state-of-the-art results in NLP or Vision.",
      "Extensive experience scaling workloads on GPU clusters.",
      "Strong background in PyTorch and distributed training."
    ]
  },
  {
    id: "job-3",
    title: "Applied AI Developer",
    company: "StandexAI Internal",
    location: "Remote",
    salary: "Contract / Equity",
    type: "Contract",
    tags: ["React", "AI UI", "Agentic Systems"],
    isHot: true,
    description: "Help build the interface between humans and autonomous tech. You will construct highly interactive, responsive web applications that visualize complex AI decisions and allow users to steer agent behavior visually.",
    requirements: [
      "Expertise in React, Next.js, and modern CSS (Tailwind).",
      "A deep appreciation for UI/UX micro-interactions.",
      "Prior experience building interfaces for chatbots or copilot tools.",
      "Ability to ship rapidly and independently."
    ]
  },
];

export default async function JobsPage() {
  const { data: session } = await neonAuth.getSession();

  return (
    <div className="min-h-[100dvh] bg-[#FAFAF9] flex flex-col selection:bg-[#7C5CFC]/20 overflow-hidden">
      <TopNav user={session?.user} />
      
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-8 pb-12 flex-1 flex flex-col h-full">
        <div className="mb-2 shrink-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-[#7C5CFC]">
            <Target className="h-3 w-3" />
            StandexAI Intelligence Network
          </div>
          <h1 className="font-syne text-4xl font-black text-zinc-900 tracking-tighter uppercase italic">
            Applied AI <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#7C5CFC,#A892FF)]">Jobs.</span>
          </h1>
        </div>

        <JobsBoardClient jobs={JOBS} />
      </main>
    </div>
  );
}
