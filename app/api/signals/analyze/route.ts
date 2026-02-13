import { NextResponse } from "next/server";
import { analyzeSignals } from "@/lib/sentiment-noise";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: string };
    const text = body.text?.trim() ?? "";

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const result = analyzeSignals(text);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signal analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
