import { NextResponse } from "next/server";
import { Industry, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

type CreateContentPayload = {
  title: string;
  body: Prisma.JsonValue; // Tiptap JSON
  industry: string;
  targetKeyword?: string;
  metaDescription?: string;
};

function parseIndustry(value: string): Industry | null {
  const normalized = value.trim().toUpperCase();
  return (Object.values(Industry) as string[]).includes(normalized)
    ? (normalized as Industry)
    : null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateContentPayload;

    const { title, body: contentBody, industry, targetKeyword, metaDescription } = body;

    if (!title || !contentBody || !industry) {
      return NextResponse.json({ error: "title, body, and industry are required" }, { status: 400 });
    }

    const industryValue = parseIndustry(industry);
    if (!industryValue) {
      return NextResponse.json({ error: "Invalid industry value" }, { status: 400 });
    }

    const userId = await getOrCreateCurrentUserId({
      userIdHeader: req.headers.get("x-user-id") ?? undefined,
      userEmailHeader: req.headers.get("x-user-email") ?? undefined,
      userNameHeader: req.headers.get("x-user-name") ?? undefined,
    });

    const content = await prisma.content.create({
      data: {
        userId,
        title,
        body: contentBody,
        industry: industryValue,
        targetKeyword,
        metaDescription,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
