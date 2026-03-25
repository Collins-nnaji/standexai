import { redirect } from "next/navigation";

/** Legacy URL: opens professional Voice coach (speaking feedback, not writing analysis). */
export default function SpeechAnalyzerRedirectPage() {
  redirect("/console?tab=voice&voice=1");
}
