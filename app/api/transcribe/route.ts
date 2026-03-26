import { NextResponse } from "next/server";
import {
  getAzureAudioTranscriptionUrl,
  azureSpeechTranscriptionHeaders,
  transcriptionMissingConfigMessage,
} from "@/lib/llm-client";

export const runtime = "nodejs";

/**
 * Speech-to-text only (Whisper / Azure transcriptions): POST multipart/form-data with field `file` (audio).
 * Reserved for server-side or future integrations — not exposed as end-user upload in the product UI.
 */
export async function POST(req: Request) {
  const url = getAzureAudioTranscriptionUrl();
  if (!url) {
    return NextResponse.json({ error: transcriptionMissingConfigMessage() }, { status: 503 });
  }

  try {
    const incoming = await req.formData();
    const file = incoming.get("file");
    if (!(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "Audio file is required (field: file)" }, { status: 400 });
    }

    const outbound = new FormData();
    const name = file instanceof File && file.name ? file.name : "audio.webm";
    outbound.append("file", file, name);

    const response = await fetch(url, {
      method: "POST",
      headers: azureSpeechTranscriptionHeaders(),
      body: outbound,
    });

    const raw = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        { error: `Transcription failed: ${raw || response.statusText}` },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 },
      );
    }

    let text = "";
    const trimmed = raw.trim();
    if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed) as { text?: string };
        text = typeof parsed.text === "string" ? parsed.text : "";
      } catch {
        return NextResponse.json({ error: "Unexpected transcription response" }, { status: 502 });
      }
    } else {
      text = trimmed;
    }

    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transcription failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
