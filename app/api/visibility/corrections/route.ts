import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

type CorrectionPayload = {
  auditId?: string;
  model: "GPT-4o" | "Claude 3.5" | "Gemini 1.5";
  hallucinatedClaim: string;
  correctFact: string;
  evidenceUrls?: string[];
  brandUrl?: string;
  keyword?: string;
};

type SubmissionTarget = {
  target: "Reddit" | "Wikipedia Talk" | "Docs/Changelog";
  priority: "high" | "medium" | "low";
  draft: string;
  action: string;
};

async function ensureCorrectionTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "DiscoveryCorrection" (
      id TEXT PRIMARY KEY,
      "userId" TEXT,
      "auditId" TEXT,
      model TEXT NOT NULL,
      "hallucinatedClaim" TEXT NOT NULL,
      "correctFact" TEXT NOT NULL,
      "evidenceUrls" JSONB NOT NULL,
      "submissionTargets" JSONB NOT NULL,
      status TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

function sanitizeList(value?: string[]) {
  return (value ?? []).map((item) => item.trim()).filter(Boolean).slice(0, 6);
}

function buildTargets(input: {
  model: string;
  hallucinatedClaim: string;
  correctFact: string;
  evidenceUrls: string[];
  brandUrl?: string;
  keyword?: string;
}): SubmissionTarget[] {
  const evidenceBlock = input.evidenceUrls.length
    ? input.evidenceUrls.map((url) => `- ${url}`).join("\n")
    : "- Add at least one canonical source URL";

  return [
    {
      target: "Docs/Changelog",
      priority: "high",
      action: "Publish a canonical correction page and add changelog note.",
      draft: `Title: Clarification for ${input.keyword ?? "AI discovery query"}\n\nIncorrect claim observed in ${input.model}:\n\"${input.hallucinatedClaim}\"\n\nCorrect fact:\n${input.correctFact}\n\nEvidence:\n${evidenceBlock}\n\nCanonical URL: ${input.brandUrl ?? "https://yourdomain.com"}`,
    },
    {
      target: "Wikipedia Talk",
      priority: "medium",
      action: "Post neutral correction request with verifiable sources.",
      draft: `Proposed factual correction:\n- Incorrect: ${input.hallucinatedClaim}\n- Correct: ${input.correctFact}\n\nIndependent sources:\n${evidenceBlock}\n\nNotes: Requesting update for factual consistency in public references.`,
    },
    {
      target: "Reddit",
      priority: "medium",
      action: "Publish transparent correction in relevant community thread.",
      draft: `Quick correction on ${input.keyword ?? "this topic"}:\nSome AI answers currently state \"${input.hallucinatedClaim}\".\nThe accurate detail is: ${input.correctFact}\n\nSources:\n${evidenceBlock}\n\nIf useful, we can share additional technical references.`,
    },
  ];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CorrectionPayload;
    const hallucinatedClaim = body.hallucinatedClaim?.trim() ?? "";
    const correctFact = body.correctFact?.trim() ?? "";
    if (!body.model || !hallucinatedClaim || !correctFact) {
      return NextResponse.json(
        { error: "model, hallucinatedClaim, and correctFact are required" },
        { status: 400 },
      );
    }

    const evidenceUrls = sanitizeList(body.evidenceUrls);
    const submissionTargets = buildTargets({
      model: body.model,
      hallucinatedClaim,
      correctFact,
      evidenceUrls,
      brandUrl: body.brandUrl,
      keyword: body.keyword,
    });

    const userId = await getOrCreateCurrentUserId({
      userIdHeader: req.headers.get("x-user-id") ?? undefined,
      userEmailHeader: req.headers.get("x-user-email") ?? undefined,
      userNameHeader: req.headers.get("x-user-name") ?? undefined,
    });

    const correctionId = crypto.randomUUID();
    try {
      await ensureCorrectionTable();
      await prisma.$executeRaw`
        INSERT INTO "DiscoveryCorrection" (
          id,
          "userId",
          "auditId",
          model,
          "hallucinatedClaim",
          "correctFact",
          "evidenceUrls",
          "submissionTargets",
          status
        ) VALUES (
          ${correctionId},
          ${userId},
          ${body.auditId ?? null},
          ${body.model},
          ${hallucinatedClaim},
          ${correctFact},
          ${JSON.stringify(evidenceUrls)}::jsonb,
          ${JSON.stringify(submissionTargets)}::jsonb,
          ${"drafted"}
        )
      `;
    } catch {
      // best effort persistence
    }

    return NextResponse.json({
      correctionId,
      status: "drafted",
      summary: "Correction package generated. Publish canonical source first, then distribute.",
      submissionTargets,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate correction package";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
