"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User, TerminalSquare, UploadCloud, LogOut, Menu, X, ChevronRight, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
        unoptimized
      />
    </div>
  );
}


export interface TopNavProps {
  user?: {
    id: string;
    email: string;
    name?: string | null;
    role?: string | null;
  } | null;
}

export function TopNav({ user }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
        {/* Left: Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden items-center gap-2 sm:flex">
          <Link
            href="/learn"
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-black transition-all duration-300",
              pathname.startsWith("/learn") ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            )}
          >
            Learn
          </Link>

          {/* Opportunities Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-black text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-300">
              Opportunities
              <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex flex-col gap-1">
                <Link href="/projects" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
                  Open Projects
                </Link>
                <Link href="/jobs" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
                  Jobs
                </Link>
              </div>
            </div>
          </div>

          {/* Workspace Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-black text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-300">
              Workspace
              <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex flex-col gap-1">
                <Link href="/cognitive-audit" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
                  Skills Benchmark
                </Link>
                <Link href="/console" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
                  <TerminalSquare className="h-4 w-4 text-zinc-400" /> Console
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Right: User Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {/* User Desktop Actions */}
          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <>
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

                        {user?.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm font-black text-[#7C5CFC] hover:bg-[#7C5CFC]/5 transition-colors"
                          >
                          <div className="flex items-center gap-2">
                            <UploadCloud className="h-4 w-4" /> Admin Console
                          </div>
                          </Link>
                        )}
                        
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 shadow-sm transition-all hover:bg-zinc-200 active:scale-95 sm:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={2.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-16 z-[90] bg-zinc-900/40 backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 top-16 z-[100] w-[280px] border-l border-zinc-200 bg-white p-6 shadow-2xl sm:hidden"
            >
              <nav className="flex flex-col gap-2">
                <div className="mb-4">
                  <p className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Navigation</p>
                </div>
                <Link
                  href="/learn"
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all",
                    pathname.startsWith("/learn") ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  Learn
                  <ChevronRight className={cn("h-4 w-4 opacity-50", pathname.startsWith("/learn") && "text-[#7C5CFC]")} />
                </Link>

                <div className="my-4 h-px w-full bg-zinc-100" />

                <div className="mb-3">
                  <p className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Opportunities</p>
                </div>
                <Link href="/projects" className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all">
                  Open Projects
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
                <Link href="/jobs" className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all">
                  Jobs
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>

                <div className="my-4 h-px w-full bg-zinc-100" />

                <div className="mb-3">
                  <p className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Workspace</p>
                </div>
                <Link href="/cognitive-audit" className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all">
                  Skills Benchmark
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
                <Link href="/console" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all">
                  <TerminalSquare className="h-5 w-5 text-zinc-400" /> Console
                </Link>

                <div className="my-4 h-px w-full bg-zinc-100" />

                <div className="mb-4">
                  <p className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Account</p>
                </div>

                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/r/me"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                    >
                      <User className="h-5 w-5" /> My Profile
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black text-[#7C5CFC] hover:bg-[#7C5CFC]/5 transition-all"
                      >
                        <UploadCloud className="h-5 w-5" /> Admin Console
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="mt-4 flex items-center gap-3 rounded-xl border border-red-100 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      <LogOut className="h-5 w-5" /> {isLoggingOut ? "Signing Out..." : "Sign Out"}
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/sign-in"
                    className="flex items-center justify-center rounded-xl bg-zinc-900 py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-95"
                  >
                    Sign In to StandexAI
                  </Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
