import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning network tables...");
  await prisma.reputationSignal.deleteMany({});
  await prisma.collabMember.deleteMany({});
  await prisma.collaboration.deleteMany({});
  await prisma.briefInterest.deleteMany({});
  await prisma.researchBrief.deleteMany({});
  await prisma.workItem.deleteMany({});
  await prisma.standexRank.deleteMany({});
  await prisma.labProfile.deleteMany({});
  await prisma.follows.deleteMany({});

  // Clean old mock users (we target a specific email domain to avoid wiping real NextAuth users)
  await prisma.user.deleteMany({
    where: { email: { endsWith: "@mock.standex.ai" } }
  });

  console.log("Seeding Mock AI Network...");

  const mockPassword = await bcrypt.hash("password123", 10);

  // 1. Create Labs
  const lab1 = await prisma.user.upsert({
    where: { email: "recruiting@deepmind.mock.standex.ai" },
    update: {},
    create: {
      email: "recruiting@deepmind.mock.standex.ai",
      name: "Google DeepMind",
      passwordHash: mockPassword,
      role: "LAB",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Google_DeepMind_logo.svg/1200px-Google_DeepMind_logo.svg.png",
      verified: true,
      labProfile: {
        create: {
          companyName: "Google DeepMind",
          verified: true,
          subscriptionTier: "enterprise"
        }
      }
    }
  });

  const lab2 = await prisma.user.upsert({
    where: { email: "talent@openai.mock.standex.ai" },
    update: {},
    create: {
      email: "talent@openai.mock.standex.ai",
      name: "OpenAI Research",
      passwordHash: mockPassword,
      role: "LAB",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
      verified: true,
      labProfile: {
        create: {
          companyName: "OpenAI",
          verified: true,
          subscriptionTier: "enterprise"
        }
      }
    }
  });

  // 2. Create Researchers
  const rs1 = await prisma.user.upsert({
    where: { email: "yann.lecun@mock.standex.ai" },
    update: {},
    create: {
      email: "yann.lecun@mock.standex.ai",
      name: "Yann LeCun",
      passwordHash: mockPassword,
      role: "PRO",
      bio: "Chief AI Scientist at Meta. Professor at NYU. Turing Award Laureate.",
      institution: "Meta AI / NYU",
      location: "New York, USA",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/5/52/Yann_LeCun_-_2018_%28cropped%29.jpg",
      verified: true,
      ranks: {
        create: { domain: "Computer Vision", score: 9950, rankPosition: 1 }
      }
    }
  });

  const rs2 = await prisma.user.upsert({
    where: { email: "karpathy@mock.standex.ai" },
    update: {},
    create: {
      email: "karpathy@mock.standex.ai",
      name: "Andrej Karpathy",
      passwordHash: mockPassword,
      role: "PRO",
      bio: "Building smart systems. Previously Director of AI @ Tesla, Research @ OpenAI.",
      institution: "Independent",
      location: "San Francisco, CA",
      openToWork: true,
      avatar: "https://pbs.twimg.com/profile_images/1625146599187062784/Fxy8sI4__400x400.jpg",
      verified: true,
      ranks: {
        create: { domain: "Large Language Models", score: 9800, rankPosition: 2 }
      }
    }
  });

  const rs3 = await prisma.user.upsert({
    where: { email: "ilias@mock.standex.ai" },
    update: {},
    create: {
      email: "ilias@mock.standex.ai",
      name: "Ilias Sutskever",
      passwordHash: mockPassword,
      role: "RESEARCHER",
      bio: "Safe Superintelligence Inc. Neural Networks & Deep Learning.",
      institution: "SSI",
      location: "Palo Alto, CA",
      avatar: null,
      verified: true,
      ranks: {
        create: { domain: "Alignment", score: 9200, rankPosition: 5 }
      }
    }
  });

  // 3. Create Work Items (Papers, Models, Datasets)
  const work1 = await prisma.workItem.create({
    data: {
      userId: rs2.id,
      type: "model",
      title: "nanoGPT: The simplest, fastest repository for training/finetuning medium-sized GPTs",
      abstract: "A complete rewrite of minGPT. Designed specifically to be simple, hackable, and fast for academic and educational environments. Capable of reproducing GPT-2 (124M) in a few hours on a modern GPU node.",
      impactSummary: "Standardized educational foundation model training pipelines for the entire open-source network.",
      problemSolved: "Removed boilerplate and complexity from huge LLM frameworks like Megatron-LM for experimental researchers.",
      improvesOn: "HuggingFace Accelerate / minGPT",
      tags: ["LLM", "PyTorch", "GPT", "Education"],
      externalUrl: "https://github.com/karpathy/nanoGPT",
      fileUrl: "https://standexai.blob.core.windows.net/assets/nanogpt-weights-mock.zip",
      views: 14520,
    }
  });

  const work2 = await prisma.workItem.create({
    data: {
      userId: rs1.id,
      type: "paper",
      title: "V-JEPA: Video Joint Embedding Predictive Architecture",
      abstract: "We introduce V-JEPA, a method for self-supervised learning of visual representations from video by predicting the latent representation of missing regions in a video from the unmasked context.",
      impactSummary: "Proves that predictive masking architectures operate incredibly well in the temporal dimension, avoiding raw pixel reconstruction.",
      problemSolved: "Compute-intensive video generation limits representation learning. Joint embeddings solve this safely.",
      improvesOn: "I-JEPA / Masked Autoencoders",
      tags: ["Computer Vision", "Self-Supervised Learning", "JEPA"],
      externalUrl: "https://ai.meta.com/research/publications/v-jepa/",
      views: 8400,
    }
  });

  // 4. Create Reputation Signals
  await prisma.reputationSignal.createMany({
    data: [
      { userId: rs2.id, fromUserId: rs1.id, workItemId: work1.id, signalType: "reproduction", value: 100 },
      { userId: rs2.id, fromUserId: lab2.id, workItemId: work1.id, signalType: "citation", value: 50 },
      { userId: rs1.id, fromUserId: rs3.id, workItemId: work2.id, signalType: "review", value: 20 },
      { userId: rs1.id, fromUserId: lab1.id, signalType: "lab_view", value: 5 }, // Private signal
      { userId: rs2.id, fromUserId: lab1.id, signalType: "lab_view", value: 5 },
    ]
  });

  const lab3 = await prisma.user.upsert({
    where: { email: "recruiting@anthropic.mock.standex.ai" },
    update: {},
    create: {
      email: "recruiting@anthropic.mock.standex.ai",
      name: "Anthropic",
      passwordHash: mockPassword,
      role: "LAB",
      avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Anthropic_logo.svg/1000px-Anthropic_logo.svg.png",
      verified: true,
      labProfile: {
        create: {
          companyName: "Anthropic",
          verified: true,
          subscriptionTier: "pro"
        }
      }
    }
  });

  const lab4 = await prisma.user.upsert({
    where: { email: "hiring@huggingface.mock.standex.ai" },
    update: {},
    create: {
      email: "hiring@huggingface.mock.standex.ai",
      name: "Hugging Face",
      passwordHash: mockPassword,
      role: "LAB",
      avatar: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
      verified: true,
      labProfile: {
        create: {
          companyName: "Hugging Face",
          verified: true,
          subscriptionTier: "pro"
        }
      }
    }
  });

  const lab5 = await prisma.user.upsert({
    where: { email: "talent@scale.mock.standex.ai" },
    update: {},
    create: {
      email: "talent@scale.mock.standex.ai",
      name: "Scale AI",
      passwordHash: mockPassword,
      role: "LAB",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Scale_AI_logo.svg",
      verified: true,
      labProfile: {
        create: {
          companyName: "Scale AI",
          verified: true,
          subscriptionTier: "pro"
        }
      }
    }
  });

  // 5. Create Research Briefs from Labs (Professional Case Studies)
  await prisma.researchBrief.createMany({
    data: [
      {
        companyId: lab2.id,
        title: "Large-Scale Sparse Autoencoder Implementation",
        description: "A technical breakdown of interpretability scaling on frontier LLMs. We successfully isolated over 100k concept primitives, enabling surgical-level steerability of safety protocols without degradating core reasoning benchmarks.",
        lookingFor: "Researchers with experience in high-dimensional activation mapping and PyTorch systems optimization.",
        domain: ["Interpretability", "AI Safety", "LLMs"],
        active: true,
        isApproved: true
      },
      {
        companyId: lab3.id,
        title: "V-JEPA Temporal Reasoning in Autonomous Agents",
        description: "Exploring joint embedding predictive architectures for video-level reasoning. This case study details the optimization of predictive masking for non-generative temporal understanding in edge environments.",
        lookingFor: "Vision-Transformer specialists with a focus on self-supervised learning for temporal data.",
        domain: ["Computer Vision", "Self-Supervised Learning"],
        active: true,
        isApproved: true
      },
      {
        companyId: lab4.id,
        title: "Matryoshka Embedding Optimization for RAG",
        description: "Implementation of nested embedding structures to reduce latency by 10x in high-scale vector search environments. Details on balancing dimensionality vs retrieval precision for enterprise search.",
        lookingFor: "Systems engineers specializing in vector database optimization and NLP retrieval pipelines.",
        domain: ["NLP", "Vector Databases", "RAG"],
        active: true,
        isApproved: true
      },
      {
        companyId: lab5.id,
        title: "DPO Scaling for Multi-Agent Deliberation",
        description: "Applying Direct Preference Optimization to complex, multi-turn agentic trajectories. This architecture allows for stable alignment across asynchronous synthetic reasoning chains.",
        lookingFor: "Reinforcement Learning experts with experience in massive synthetic data pipelines.",
        domain: ["RLHF", "Synthetic Data", "Agents"],
        active: true,
        isApproved: true
      }
    ]
  });

  // 0. Create Admin
  await prisma.user.upsert({
    where: { email: "admin@standex.ai" },
    update: {},
    create: {
      email: "admin@standex.ai",
      name: "Standex Admin",
      passwordHash: mockPassword,
      role: "ADMIN",
      verified: true,
    }
  });

  console.log("Successfully seeded database with test AI talent, Labs, and Admin!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
