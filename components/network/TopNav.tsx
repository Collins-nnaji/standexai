"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronRight, ChevronDown, Zap, Cpu, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <div className="flex min-w-0 items-center">
      <img
        src="/StandexLogo.webp"
        alt="Standex Digital Logo"
        className="h-11 w-auto max-h-11 object-contain"
        loading="eager"
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
  forceDark?: boolean;
}

export function TopNav({ user, forceDark }: TopNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up
      // DISABLE hiding if mobile menu is open
      if (currentScrollY > lastScrollY && currentScrollY > 100 && !mobileMenuOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  const isAiRoute = 
    pathname.startsWith("/learn") ||
    pathname.startsWith("/Training") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/console");

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header 
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300",
        isScrolled || mobileMenuOpen || forceDark
          ? "border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]"
          : "bg-zinc-950/50 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="mx-auto flex h-20 min-h-[5rem] max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
        {/* Left: Logo */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="transition-all duration-300">
              <Logo />
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">v.2026.4 [LIVE]</span>
          </div>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {/* Solutions Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition-all duration-300 border border-zinc-800/50 hover:border-[#7C5CFC]/30">
              Solutions
              <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="w-[280px] rounded-3xl border border-zinc-800 bg-zinc-900 p-3 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] flex flex-col gap-0.5">
                <Link href="/solutions/ai-agents" className="flex flex-col rounded-2xl px-4 py-3 transition-all hover:bg-zinc-800/60">
                  <span className="text-sm font-bold text-white tracking-tight">Artificial Intelligence</span>
                </Link>
                <Link href="/solutions/power-apps" className="flex flex-col rounded-2xl px-4 py-3 transition-all hover:bg-zinc-800/60">
                  <span className="text-sm font-bold text-white tracking-tight">Power Apps</span>
                </Link>
                <Link href="/solutions/power-automate" className="flex flex-col rounded-2xl px-4 py-3 transition-all hover:bg-zinc-800/60">
                  <span className="text-sm font-bold text-white tracking-tight">Power Automate</span>
                </Link>
                <Link href="/solutions/power-bi" className="flex flex-col rounded-2xl px-4 py-3 transition-all hover:bg-zinc-800/60">
                  <span className="text-sm font-bold text-white tracking-tight">Power BI</span>
                </Link>
                <Link href="/solutions/power-platform" className="flex flex-col rounded-2xl px-4 py-3 transition-all hover:bg-zinc-800/60">
                  <span className="text-sm font-bold text-white tracking-tight">Power Platform Governance</span>
                </Link>
                <Link href="/solutions/data-readiness" className="flex flex-col rounded-2xl px-4 py-3 transition-all hover:bg-zinc-800/60">
                  <span className="text-sm font-bold text-white tracking-tight">Data Engineering & Analytics</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Standalone Links */}
          <Link 
            href="/Training" 
            className="rounded-xl px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
            style={{ color: '#FFFFFF' }}
          >
            Training
          </Link>

          
          <Link
            href="/Contact"
            className="ml-2 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
          >
            Contact
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {/* AI Console Stylish Button */}
          <Link
            href="/console"
            className="hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-95"
          >
            AI Console
            <Zap className="h-4 w-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-all active:scale-95 sm:hidden",
              mobileMenuOpen 
                ? "bg-white text-zinc-950 hover:bg-zinc-100" 
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            )}
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

      {/* Mobile Menu — full screen from top */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 top-20 z-[100] bg-zinc-950 flex flex-col sm:hidden overflow-y-auto"
          >
            {/* Scrollable nav area */}
            <div className="flex-1 px-5 pt-6 pb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3 px-1">Solutions</p>
              <div className="flex flex-col gap-1">
                {[
                  { href: "/solutions/ai-agents", label: "Artificial Intelligence", accent: "#049DCB" },
                  { href: "/solutions/power-apps", label: "Power Apps", accent: "#D25BB1" },
                  { href: "/solutions/power-automate", label: "Power Automate", accent: "#0078D4" },
                  { href: "/solutions/power-bi", label: "Power BI", accent: "#F2C811" },
                  { href: "/solutions/power-platform", label: "Power Platform Governance", accent: "#7C5CFC" },
                  { href: "/solutions/data-readiness", label: "Data Engineering & Analytics", accent: "#10b981" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl px-5 py-4 bg-zinc-900 active:bg-zinc-800 transition-colors"
                  >
                    <span className="text-[15px] font-bold text-white tracking-tight">{item.label}</span>
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.accent }} />
                  </Link>
                ))}
              </div>

              <div className="my-5 h-px bg-zinc-800" />

              <div className="flex flex-col gap-1">
                <Link href="/Training" className="flex items-center justify-between rounded-2xl px-5 py-4 bg-zinc-900 active:bg-zinc-800 transition-colors">
                  <span className="text-[15px] font-bold text-white tracking-tight">Training</span>
                  <ChevronRight className="h-4 w-4 text-zinc-600" />
                </Link>
              </div>
            </div>

            {/* Action buttons pinned at bottom */}
            <div className="px-5 pb-8 pt-4 border-t border-zinc-800 flex flex-col gap-3">
              <Link
                href="/Contact"
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-[15px] font-bold text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Contact Us
              </Link>
              <Link
                href="/console"
                className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-800 px-6 py-4 text-[15px] font-bold text-white active:scale-95 transition-all"
              >
                <Zap className="h-5 w-5 text-emerald-400" />
                AI Console
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
