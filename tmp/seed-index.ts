import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const posts = [
    {
      title: "The Rise of Distributed Reasoning: Frontiers in MoE Architectures",
      summary: "How Mixture-of-Experts is moving from a 'scaling trick' to a fundamental shift in how we build sparse, efficient intelligence.",
      content: "Detailed analysis of MoE scaling laws and the transition toward decentralized inference networks...",
      category: "Model Releases",
      readingTime: 8,
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
    },
    {
      title: "EU AI Act: The Compliance Horizon for Research Labs",
      summary: "A deep dive into the regulatory frameworks hitting European AI startups this quarter and what it means for open-source weights.",
      content: "The new regulatory landscape requires more than just performance benchmarks; it requires verifiable governance...",
      category: "Policy",
      readingTime: 6,
      imageUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1470&auto=format&fit=crop",
    },
    {
      title: "OpenAI 'Strawberry' and the Quest for Verifiable Reasoning",
      summary: "Breaking down the latest rumors and technical leaks surrounding OpenAI's next-gen reasoning models.",
      content: "Chain-of-thought is the baseline. What comes next is the orchestration of thought through verifiable search...",
      category: "Frontier",
      readingTime: 4,
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4628c6820?q=80&w=1530&auto=format&fit=crop",
    }
  ];

  console.log("Seeding AI Index posts...");
  
  for (const post of posts) {
    await prisma.aIIndexPost.create({
      data: post
    });
  }

  console.log("Success: AI Index populated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
