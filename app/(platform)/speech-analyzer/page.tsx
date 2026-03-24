import { redirect } from "next/navigation";

/** Legacy URL: speech is transcribed in Text Analyzer, then analyzed as text. */
export default function SpeechAnalyzerRedirectPage() {
  redirect("/writing-lab?voice=1");
}
