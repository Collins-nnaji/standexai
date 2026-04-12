import { NextResponse } from "next/server";
import {
  getAzureAudioSpeechUrl,
  azureSpeechTranscriptionHeaders,
  ttsMissingConfigMessage,
} from "@/lib/llm-client";

export const runtime = "nodejs";

/**
 * Text-to-speech (TTS): POST JSON with `text` and optional `voice`.
 * Returns audio binary (MP3).
 */
export async function POST(req: Request) {
  const url = getAzureAudioSpeechUrl();
  if (!url) {
    return NextResponse.json({ error: ttsMissingConfigMessage() }, { status: 503 });
  }

  try {
    const { text, voice = "alloy" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Azure OpenAI TTS request body
    const body = {
      model: "tts-1",
      voice,
      input: text,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...azureSpeechTranscriptionHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `TTS failed: ${errorText || response.statusText}` },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 },
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="speech.mp3"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "TTS failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
