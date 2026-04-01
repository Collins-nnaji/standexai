"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User, TerminalSquare, UploadCloud } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center">
      <Image 
        src="/standexailogo.png" 
        alt="StandexAI Logo" 
        width={140} 
        height={40} 
        className="h-8 w-auto object-contain"
        priority
      />
    </div>
  );
}


export interface TopNavProps {
  user?: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
}

export function TopNav({ user }: TopNavProps) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Discover", href: "/discover" },
    { name: "Briefs", href: "/briefs" },
    { name: "Collabs", href: "/collab/new" },
    { name: "AI Index", href: "/index" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 sm:flex">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-[#7C5CFC]/10 text-[#7C5CFC]"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/work/new"
                className="hidden items-center gap-1.5 rounded-full bg-[#7C5CFC] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#6042db] hover:shadow-md sm:flex"
              >
                <UploadCloud className="h-[18px] w-[18px]" strokeWidth={2} /> Publish
              </Link>
              <Link
                href="/console"
                className="hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 sm:flex"
              >
                <TerminalSquare className="h-[18px] w-[18px]" strokeWidth={1.75} /> Console
              </Link>
              <div className="h-6 w-px bg-zinc-200" />
              <Link
                href="/r/me"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 transition-all hover:scale-105 hover:border-zinc-300 hover:bg-zinc-200"
              >
                <User className="h-4 w-4 text-zinc-600" strokeWidth={2} />
              </Link>
            </>
          ) : (
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
