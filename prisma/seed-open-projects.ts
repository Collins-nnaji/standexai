#!/usr/bin/env npx ts-node --skip-project
/**
 * Seed script: clears all ResearchBriefs and creates 4 Open Project briefs
 * under a system StandexAI LAB account.
 *
 * Run: npx ts-node --skip-project prisma/seed-open-projects.ts
 */
import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

const SYSTEM_EMAIL = "projects@standexai.com";

const openProjects = [
  {
    title: "StandexAI Voice",
    description:
      "We're building the voice and speech model infrastructure that most AI products are missing. Real-time transcription, speaker diarisation, voice-commanded agents, and audio-grounded reasoning. If you've ever wanted to work at the intersection of LLMs and audio — this is it.\n\nWhat we're solving: Most AI apps are text-in, text-out. Voice changes everything — lower friction, richer context, broader access. We're building the primitives that make voice-first AI products possible.",
    lookingFor:
      "Engineers interested in speech models (Whisper, ElevenLabs, Deepgram). Product thinkers who see the voice opportunity. Builders who want to ship, not just learn.",
    domain: ["Speech & Audio AI", "LLMs", "Real-time Systems"],
  },
  {
    title: "GlobalCoachAI",
    description:
      "GlobalCoachAI is an intelligent assessment and learning platform that maps user study patterns, identifies knowledge gaps in real time, and adapts content delivery to how each person actually learns. Not another quiz tool — a genuine AI tutor that gets smarter the more you use it.\n\nWhat we're solving: Generic learning platforms treat every user the same. GlobalCoachAI builds a live model of each learner — their pace, their blind spots, their optimal recall windows — and teaches to that.",
    lookingFor:
      "Engineers interested in learning science + AI. Anyone with experience in spaced repetition, knowledge graphs, or edtech. Builders who care about outcomes, not just engagement metrics.",
    domain: ["Assessments & Adaptive Learning", "EdTech", "Knowledge Graphs"],
  },
  {
    title: "Rekruuter",
    description:
      "Rekruuter puts AI inside the recruitment workflow — from JD analysis and candidate screening to live interview assistance and structured scoring. Built for recruiters who want leverage, not replacement. Fast, fair, and auditable at every step.\n\nWhat we're solving: Recruitment is slow, inconsistent, and bias-prone. Rekruuter gives recruiters an AI co-pilot that surfaces signal, reduces noise, and makes every interview more structured and every decision more defensible.",
    lookingFor:
      "Engineers interested in NLP, ranking, and structured data extraction. Anyone who's worked in HR tech or understands recruiter workflows. Builders who care about fairness and auditability in AI systems.",
    domain: ["Recruitment & Interview AI", "NLP", "Structured Data"],
  },
  {
    title: "AccurateCV",
    description:
      "AccurateCV is an AI CV agent that reads a job description, understands what the employer is actually looking for, and rewrites and repositions your CV to match — without fabricating anything. It also tracks application patterns, learns what works for your profile, and gets sharper with every role you apply for.\n\nWhat we're solving: Most people send the same CV everywhere and wonder why they don't hear back. AccurateCV treats your CV as a living document — one that adapts, improves, and advocates for you intelligently with every application.",
    lookingFor:
      "Engineers interested in document intelligence and personalisation. Anyone with experience in job market data or career platforms. Builders who want to work on something with immediate, personal impact.",
    domain: ["Career & CV Intelligence", "Document AI", "Personalisation"],
  },
];

async function main() {
  console.log("🌱 Seeding Open Projects...\n");

  // 1. Upsert system LAB user
  const passwordHash = crypto.randomBytes(32).toString("hex");
  const systemUser = await prisma.user.upsert({
    where: { email: SYSTEM_EMAIL },
    update: {},
    create: {
      email: SYSTEM_EMAIL,
      name: "StandexAI",
      passwordHash,
      role: "LAB",
      companyName: "StandexAI",
    },
  });
  console.log(`✅ System user: ${systemUser.email} (${systemUser.id})`);

  // 2. Upsert LabProfile
  await prisma.labProfile.upsert({
    where: { userId: systemUser.id },
    update: {},
    create: {
      userId: systemUser.id,
      companyName: "StandexAI",
      verified: true,
      subscriptionTier: "prime",
    },
  });
  console.log("✅ LabProfile upserted");

  // 3. Clear ALL existing research briefs
  const deleted = await prisma.researchBrief.deleteMany({});
  console.log(`🗑  Deleted ${deleted.count} existing briefs\n`);

  // 4. Seed the 4 projects
  for (const project of openProjects) {
    const brief = await prisma.researchBrief.create({
      data: {
        companyId: systemUser.id,
        title: project.title,
        description: project.description,
        lookingFor: project.lookingFor,
        domain: project.domain,
        active: true,
        isApproved: true,
      },
    });
    console.log(`✅ Seeded: ${brief.title} (${brief.id})`);
  }

  console.log("\n🎉 Done! 4 Open Projects seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
