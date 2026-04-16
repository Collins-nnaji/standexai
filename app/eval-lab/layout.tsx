import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image & Video Console — StandexAI",
  description: "Advanced visual synthesis and vision analysis engine for modern engineering workflows.",
};

export default function EvalLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
