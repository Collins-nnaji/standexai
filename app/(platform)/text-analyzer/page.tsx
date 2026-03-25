import { redirect } from "next/navigation";

/** Legacy URL: use /console */
export default async function LegacyTextAnalyzerRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  q.set("tab", "lab");
  if (typeof sp.text === "string") q.set("text", sp.text);
  if (sp.voice === "1") {
    q.set("tab", "voice");
    q.set("voice", "1");
  }
  redirect(`/console?${q.toString()}`);
}
