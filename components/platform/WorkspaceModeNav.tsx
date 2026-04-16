"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConsoleTheme, ConsoleThemeMode } from "@/components/console/console-theme";

type Active = "skills" | "console" | "eval-lab";

type Props = {
  active: Active;
  /** Console header: use theme tokens for segmented control + logo. */
  consoleTheme?: ConsoleTheme;
  consoleThemeMode?: ConsoleThemeMode;
  className?: string;
};

export function WorkspaceModeNav({ active, consoleTheme, consoleThemeMode = "light", className }: Props) {
  const t = consoleTheme;
  const themed = Boolean(t);

  const pill = (href: string, label: ReactNode, isActive: boolean) => (
    <Link
      href={href}
      className={cn(
        "whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] font-semibold tracking-tight transition-colors sm:px-3 sm:text-[12px]",
        isActive
          ? themed
            ? consoleThemeMode === "dark"
              ? "bg-white/[0.12] text-[#ececec]"
              : "bg-black/[0.07] text-[#111110]"
            : "bg-white text-indigo-950 shadow-sm ring-1 ring-zinc-200/90"
          : themed
            ? cn(t!.muted, t!.navHover)
            : "text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900",
      )}
    >
      {label}
    </Link>
  );

  return (
    <div className={cn("flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3", className)}>
      <Link href="/" className="flex shrink-0 items-center transition-opacity hover:opacity-90">
        <Image
          src="/standexailogo.png"
          alt="StandexAI"
          width={130}
          height={36}
          className={cn(
            "h-7 w-auto max-w-[96px] object-contain transition-all duration-300 sm:h-8 sm:max-w-[130px]",
            themed && consoleThemeMode === "dark" ? "brightness-0 invert opacity-90" : "",
          )}
          priority
          unoptimized
        />
      </Link>
      <div
        role="navigation"
        aria-label="Workspace"
        className={cn(
          "flex min-w-0 max-w-full flex-1 items-center gap-0.5 overflow-x-auto rounded-lg p-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-none sm:overflow-visible [&::-webkit-scrollbar]:hidden",
          themed
            ? cn(consoleThemeMode === "dark" ? "bg-black/25 ring-1 ring-white/[0.1]" : "bg-black/[0.04] ring-1 ring-black/[0.08]")
            : "bg-zinc-200/80 ring-1 ring-zinc-300/80",
        )}
      >
        {pill(
          "/cognitive-audit",
          <>
            <span className="sm:hidden">Skills</span>
            <span className="hidden sm:inline">Skills lab</span>
          </>,
          active === "skills",
        )}
        {pill(
          "/console",
          <>
            <span className="sm:hidden">Speech</span>
            <span className="hidden sm:inline">Speech & Text Console</span>
          </>,
          active === "console",
        )}
        {pill(
          "/eval-lab",
          <>
            <span className="sm:hidden">Vision</span>
            <span className="hidden sm:inline">Image & Video Console</span>
          </>,
          active === "eval-lab",
        )}
      </div>
    </div>
  );
}
