"use client";

import { Suspense } from "react";
import { ConsoleWorkspace } from "@/components/console/ConsoleWorkspace";

export default function SandboxPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-white p-8 text-sm text-zinc-500">
          Loading sandbox…
        </div>
      }
    >
      <ConsoleWorkspace />
    </Suspense>
  );
}
