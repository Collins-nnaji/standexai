import { Suspense } from "react";
import { ConsoleWorkspace } from "@/components/console/ConsoleWorkspace";
import { ConsoleAuth } from "@/components/console/ConsoleAuth";

export default function ConsolePage() {
  return (
    <ConsoleAuth>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center bg-white p-8 text-sm text-zinc-500">
            Loading console…
          </div>
        }
      >
        <ConsoleWorkspace />
      </Suspense>
    </ConsoleAuth>
  );
}
