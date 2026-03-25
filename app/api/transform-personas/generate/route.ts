import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import { isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import { runGeneratePersonaFromDescription } from "@/lib/communication-llm";

export const runtime = "nodejs";

type Body = { description?: string };

export async function POST(req: Request) {
  try {
    const { data: session } = await neonAuth.getSession();
    const email = session?.user?.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const description = body.description?.trim() ?? "";
    if (description.length < 8) {
      return NextResponse.json({ error: "Describe your persona in at least a few words" }, { status: 400 });
    }
    if (description.length > 4000) {
      return NextResponse.json({ error: "Description is too long" }, { status: 400 });
    }

    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    const draft = await runGeneratePersonaFromDescription(description);
    return NextResponse.json({ draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
