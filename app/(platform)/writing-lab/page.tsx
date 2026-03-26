import { redirect } from "next/navigation";

/** Legacy route — all analysis lives on `/console`. */
export default async function WritingLabLegacyRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  q.set("tab", "lab");
  if (sp.workspace === "rewrite") q.set("workspace", "rewrite");
  const text = sp.text;
  if (typeof text === "string") q.set("text", text);
  const rm = sp.rewriteMode;
  if (typeof rm === "string") q.set("rewriteMode", rm);
  redirect(`/console?${q.toString()}`);
}
