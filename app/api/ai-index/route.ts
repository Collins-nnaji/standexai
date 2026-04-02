import { NextRequest, NextResponse } from "next/server";
import { prismaDb as prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");

    const posts = await prisma.aIIndexPost.findMany({
      where: category ? { category } : {},
      orderBy: { publishedAt: "desc" },
      take: limit,
    }) as any;

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[GET /api/ai-index]", err);
    return NextResponse.json({ error: "Failed to fetch index posts" }, { status: 500 });
  }
}
