import type { Metadata } from "next";
import { BuildProductionAIDeck } from "@/components/presentation/build-production-ai/BuildProductionAIDeck";

export const metadata: Metadata = {
  title: "Build Production AI — Presentation | StandexAI",
  description:
    "Slide deck for the Build Production AI program: stack, cohort, and call to action.",
};

export default function BuildProductionAIPresentationPage() {
  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-zinc-100">
      <BuildProductionAIDeck />
    </div>
  );
}
