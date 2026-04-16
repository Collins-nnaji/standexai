"use client";

import { Suspense } from "react";
import { ImageVideoWorkspace } from "@/components/eval-lab/ImageVideoWorkspace";

export default function ImageVideoConsolePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-white p-8 text-sm text-zinc-500">
          Loading console…
        </div>
      }
    >
      <ImageVideoWorkspace />
    </Suspense>
  );
}
