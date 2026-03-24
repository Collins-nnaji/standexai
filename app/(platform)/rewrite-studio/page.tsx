import { redirect } from "next/navigation";

/** Legacy URL: use /writing-lab?workspace=rewrite */
export default async function LegacyRewriteStudioRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  q.set("workspace", "rewrite");
  if (typeof sp.text === "string") q.set("text", sp.text);
  if (typeof sp.mode === "string") q.set("rewriteMode", sp.mode);
  redirect(`/writing-lab?${q.toString()}`);
}
