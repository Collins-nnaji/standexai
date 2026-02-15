import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type CreateContentPayload = {
  title: string;
  body: any; // Tiptap JSON
  industry: string;
  targetKeyword?: string;
  metaDescription?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateContentPayload;

    const { title, body: contentBody, industry, targetKeyword, metaDescription } = body;

    if (!title || !contentBody || !industry) {
      return NextResponse.json({ error: "title, body, and industry are required" }, { status: 400 });
    }

    // Mock user ID - in production, get from session
    const userId = "mock-user-id";

    const content = await prisma.content.create({
      data: {
        userId,
        title,
        body: contentBody,
        industry: industry as any,
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
