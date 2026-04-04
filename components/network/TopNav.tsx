"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User, TerminalSquare, UploadCloud, LogOut } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await neonAuthClient.signOut();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const navItems = [
    { name: "AI Talent", href: "/talent" },
    { name: "Open Projects", href: "/projects" },
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
                href="/console"
                className="hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 sm:flex"
              >
                <TerminalSquare className="h-[18px] w-[18px]" strokeWidth={1.75} /> Console
              </Link>
              <div className="h-6 w-px bg-zinc-200" />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  title="Profile Menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 transition-all hover:scale-105 hover:border-zinc-300 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
                >
                  <User className="h-4 w-4 text-zinc-600" strokeWidth={2} />
                </button>

                {menuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg z-50 overflow-hidden">
                      <Link
                        href="/r/me"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                      >
                       <div className="flex items-center gap-2">
                         <User className="h-4 w-4" /> My Profile
                       </div>
                      </Link>
                      <div className="h-px w-full bg-zinc-100" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleSignOut();
                        }}
                        disabled={isLoggingOut}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                         <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" /> {isLoggingOut ? "Signing Out..." : "Sign Out"}
                         </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/auth/sign-in"
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
