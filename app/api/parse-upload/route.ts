import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;

/**
 * PDF text extraction for console uploads (plain text only).
 */
export async function POST(req: Request) {
  try {
    const incoming = await req.formData();
    const file = incoming.get("file");
    if (!(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "File required" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB)` }, { status: 400 });
    }
    const name = file instanceof File && file.name ? file.name.toLowerCase() : "";
    if (!name.endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported on this endpoint" }, { status: 400 });
    }

    const ab = await file.arrayBuffer();
    const parser = new PDFParse({ data: new Uint8Array(ab) });
    try {
      const textResult = await parser.getText();
      const text = (textResult.text ?? "").trim();
      await parser.destroy();
      return NextResponse.json({ text });
    } catch (inner) {
      await parser.destroy().catch(() => {});
      throw inner;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF parse failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
