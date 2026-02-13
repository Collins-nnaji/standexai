"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrainCircuit, Home, LayoutDashboard, Signal, Telescope, ArrowRight } from "lucide-react";

type AppHeaderProps = {
  title: string;
  subtitle: string;
  rightSlot?: ReactNode;
};

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Decision Tool", icon: LayoutDashboard },
  { href: "/editor/new", label: "Plan Builder", icon: BrainCircuit },
  { href: "/briefs", label: "Tool Comparison", icon: Telescope },
  { href: "/trends", label: "AI News", icon: Signal },
];

export function AppHeader({ title, subtitle, rightSlot }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center">
              <Image
                src="/standexailogo.png"
                alt="StandexAI"
                width={130}
                height={34}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
                <p className="text-xs text-gray-400">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {rightSlot}
            <Button asChild size="sm" className="rounded-full px-4">
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-transparent bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
