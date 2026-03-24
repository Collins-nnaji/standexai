import { redirect } from "next/navigation";

/** Legacy URL: use /writing-lab */
export default async function LegacyTextAnalyzerRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  if (typeof sp.text === "string") q.set("text", sp.text);
  if (sp.voice === "1") q.set("voice", "1");
  const suffix = q.toString() ? `?${q.toString()}` : "";
  redirect(`/writing-lab${suffix}`);
}
