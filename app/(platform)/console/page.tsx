"use client";

import { Suspense } from "react";
import { ConsoleWorkspace } from "@/components/console/ConsoleWorkspace";

export default function ConsolePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-[#0C0C0B] p-8 text-sm text-[#8C8A83]">
          Loading workspace…
        </div>
      }
    >
      <ConsoleWorkspace />
    </Suspense>
  );
}
