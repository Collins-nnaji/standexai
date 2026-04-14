import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence Lab — StandexAI",
  description: "Experience the architecture and benchmarks of modern Large Language Models through immersive technical simulations.",
};

export default function EvalLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
