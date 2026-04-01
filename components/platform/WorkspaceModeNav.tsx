"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConsoleTheme, ConsoleThemeMode } from "@/components/console/console-theme";

type Active = "skills" | "console";

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

  const pill = (href: string, label: string, isActive: boolean) => (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-[12px] font-semibold tracking-tight transition-colors",
        isActive
          ? themed
            ? consoleThemeMode === "dark"
              ? "bg-white/[0.12] text-[#F6F4EF]"
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
    <div className={cn("flex min-w-0 flex-1 items-center gap-3", className)}>
      <Link href="/" className="flex shrink-0 items-center transition-opacity hover:opacity-90">
        <Image
          src="/standexailogo.png"
          alt="StandexAI"
          width={120}
          height={32}
          className={cn("h-7 w-auto object-contain", themed ? t!.logoInvert : "")}
          priority
        />
      </Link>
      <div
        role="navigation"
        aria-label="Workspace"
        className={cn(
          "flex shrink-0 rounded-lg p-0.5",
          themed
            ? cn(consoleThemeMode === "dark" ? "bg-black/25 ring-1 ring-white/[0.1]" : "bg-black/[0.04] ring-1 ring-black/[0.08]")
            : "bg-zinc-200/80 ring-1 ring-zinc-300/80",
        )}
      >
        {pill("/console", "Pro console", active === "console")}
      </div>
    </div>
  );
}
