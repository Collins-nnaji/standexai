import { redirect } from "next/navigation";

/** Legacy URL — analysis lives on `/console`. */
export default function SpeechAnalyzerRedirectPage() {
  redirect("/console?tab=lab");
}
