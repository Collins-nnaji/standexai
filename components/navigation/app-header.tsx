"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrainCircuit, LayoutDashboard, Signal, Lock, ArrowRight } from "lucide-react";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Platform", icon: LayoutDashboard },
];

export function AppHeader({ title, subtitle, rightSlot }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
      <div className="relative bg-[var(--bg-app)]/80 backdrop-blur-2xl px-6 py-3 flex items-center justify-between rounded-full transition-all duration-300 group">

        {/* Border Gradient */}
        <div className="absolute inset-0 rounded-full p-[1px] -z-10 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-50 group-hover:opacity-100 transition-opacity" />

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-white/5 blur-xl -z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Logo Area */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center group opacity-90 hover:opacity-100 transition-opacity">
            <div className="relative h-5 w-auto">
              <Image
                src="/standexai-logo-final.png"
                alt="StandexAI"
                width={100}
                height={24}
                priority
                className="h-5 w-auto object-contain brightness-0 invert"
              />
            </div>
          </Link>

          {/* Desktop Navigation - Clean Pills */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300",
                    active
                      ? "bg-white text-black shadow-lg shadow-white/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {rightSlot && (
            <div className="hidden sm:block border-r border-white/10 pr-4 mr-1">
              {rightSlot}
            </div>
          )}
          <Button asChild size="sm" className="rounded-full px-5 bg-[var(--accent-primary)] text-black hover:bg-[var(--accent-primary)]/90 font-bold border-0 h-9 text-xs tracking-wide shadow-[0_0_20px_rgba(0,255,148,0.3)] transition-transform hover:scale-105 active:scale-95">
            <Link href="/onboarding">
              NEW AUDIT
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
