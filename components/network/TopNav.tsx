"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User, TerminalSquare, UploadCloud, LogOut, Menu, X, ChevronRight, LayoutDashboard, Settings } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  
  const navItems = [
    { name: "Learn", href: "/learn" },
    { name: "Assessment", href: "/assessment" },
    { name: "Open Projects", href: "/projects" },
  ];

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
        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-black transition-all duration-300 ${
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

        {/* Right: User Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {/* User Desktop Actions */}
          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <>
                <Link
                  href="/console"
                  className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
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
                {navItems.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                        active
                          ? "bg-[#7C5CFC]/10 text-[#7C5CFC]"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      {item.name}
                      <ChevronRight className={`h-4 w-4 opacity-50 ${active ? "text-[#7C5CFC]" : ""}`} />
                    </Link>
                  );
                })}

                <div className="my-6 h-px w-full bg-zinc-100" />

                <div className="mb-4">
                  <p className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Account</p>
                </div>

                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/console"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                    >
                      <TerminalSquare className="h-5 w-5" /> Console
                    </Link>
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
