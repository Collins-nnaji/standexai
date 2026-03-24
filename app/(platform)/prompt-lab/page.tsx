"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PromptLabRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/writing-lab");
  }, [router]);
  return null;
}
