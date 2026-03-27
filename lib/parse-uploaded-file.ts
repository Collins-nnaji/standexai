import { stripHtmlToText } from "@/lib/strip-html";

const MAX_BYTES = 12 * 1024 * 1024;

const TEXT_EXTENSIONS = new Set([
  ".txt",
  ".md",
  ".markdown",
  ".mdx",
  ".csv",
  ".tsv",
  ".json",
  ".log",
  ".xml",
  ".rst",
  ".text",
]);

function normalizeText(s: string): string {
  return s
    .replace(/\uFEFF/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      if (typeof r.result === "string") resolve(normalizeText(r.result));
      else reject(new Error("Could not read file as text"));
    };
    r.onerror = () => reject(new Error(r.error?.message || "Read failed"));
    r.readAsText(file, "UTF-8");
  });
}

async function parseDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const ab = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: ab });
  return normalizeText(result.value);
}

async function parsePdfViaApi(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file, file.name);
  const res = await fetch("/api/parse-upload", { method: "POST", body: fd });
  const data = (await res.json()) as { text?: string; error?: string };
  if (!res.ok) throw new Error(data.error || "PDF could not be read");
  return normalizeText(data.text ?? "");
}

export type ParseUploadResult = { ok: true; text: string } | { ok: false; error: string };

/**
 * Extract plain text from supported uploads (.txt, .md, .html, .docx client-side; .pdf via API).
 */
export async function parseUploadedFile(file: File): Promise<ParseUploadResult> {
  if (file.size > MAX_BYTES) {
    return { ok: false, error: `File is too large (max ${Math.round(MAX_BYTES / 1024 / 1024)} MB).` };
  }
  const name = file.name.toLowerCase();
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot) : "";

  try {
    if (TEXT_EXTENSIONS.has(ext)) {
      return { ok: true, text: await readAsText(file) };
    }
    if (ext === ".html" || ext === ".htm") {
      const raw = await readAsText(file);
      return { ok: true, text: normalizeText(stripHtmlToText(raw)) };
    }
    if (ext === ".docx") {
      return { ok: true, text: await parseDocx(file) };
    }
    if (ext === ".pdf") {
      return { ok: true, text: await parsePdfViaApi(file) };
    }
    if (ext === ".doc") {
      return {
        ok: false,
        error: "Legacy .doc is not supported. Save as .docx or PDF and upload again.",
      };
    }
    return {
      ok: false,
      error: "Unsupported file type. Use .txt, .md, .html, .docx, or .pdf.",
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not read this file.";
    return { ok: false, error: message };
  }
}
