import { NextResponse } from "next/server";
import { Industry, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

type UpdatePayload = {
  title?: string;
  body?: Prisma.JsonValue;
  industry?: string;
  targetKeyword?: string;
  metaDescription?: string;
};

function parseIndustry(value: string | undefined): Industry | null {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  return (Object.values(Industry) as string[]).includes(normalized)
    ? (normalized as Industry)
    : null;
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const userId = await getOrCreateCurrentUserId({
      userIdHeader: req.headers.get("x-user-id") ?? undefined,
      userEmailHeader: req.headers.get("x-user-email") ?? undefined,
      userNameHeader: req.headers.get("x-user-name") ?? undefined,
    });

    const content = await prisma.content.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        body: true,
        industry: true,
        targetKeyword: true,
        metaDescription: true,
        status: true,
        updatedAt: true,
      },
    });

    if (!content) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    return NextResponse.json({
      content: {
        ...content,
        updatedAt: content.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = (await req.json()) as UpdatePayload;

    const userId = await getOrCreateCurrentUserId({
      userIdHeader: req.headers.get("x-user-id") ?? undefined,
      userEmailHeader: req.headers.get("x-user-email") ?? undefined,
      userNameHeader: req.headers.get("x-user-name") ?? undefined,
    });

    const parsedIndustry = parseIndustry(body.industry);
    if (body.industry && !parsedIndustry) {
      return NextResponse.json({ error: "Invalid industry value" }, { status: 400 });
    }

    const existing = await prisma.content.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    const updated = await prisma.content.update({
      where: { id },
      data: {
        title: body.title?.trim() || undefined,
        body: body.body ?? undefined,
        industry: parsedIndustry ?? undefined,
        targetKeyword: body.targetKeyword?.trim() ?? undefined,
        metaDescription: body.metaDescription?.trim() ?? undefined,
      },
      select: {
        id: true,
        title: true,
        industry: true,
        targetKeyword: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      content: {
        ...updated,
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

