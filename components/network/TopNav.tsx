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
}

export function TopNav({ user }: TopNavProps) {
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
        isScrolled || mobileMenuOpen
          ? "border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]" 
          : "bg-zinc-950/50 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="mx-auto flex h-20 min-h-[5rem] max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
        {/* Left: Logo */}
        <div className="flex min-w-0 flex-1 items-center">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="transition-all duration-300">
              <Logo />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {/* Unified Services Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition-all duration-300 border border-zinc-800/50 hover:border-[#7C5CFC]/30">
              Solutions
              <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="w-[340px] rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] flex flex-col gap-1">
                {/* Section 1: AI & Engineering */}
                <div className="px-2 mb-3 mt-1">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7C5CFC]/60">AI Engineering</p>
                </div>
                <Link href="/solutions/data-readiness" className="group/item flex flex-col rounded-2xl p-3 transition-all hover:bg-zinc-800/50">
                  <span className="text-sm font-bold text-white leading-tight tracking-tight">Data Readiness & Audit</span>
                  <span className="text-[11px] font-medium text-zinc-500 lowercase mt-1">Compliance & schema quality diagnotics</span>
                </Link>
                <Link href="/solutions/ai-agents" className="group/item flex flex-col rounded-2xl p-3 transition-all hover:bg-zinc-800/50">
                  <span className="text-sm font-bold text-white leading-tight tracking-tight">Autonomous AI Swarms</span>
                  <span className="text-[11px] font-medium text-zinc-500 lowercase mt-1">Multi-agent orchestration & reasoning</span>
                </Link>
                <Link href="/solutions/power-platform-ai" className="group/item flex flex-col rounded-2xl p-3 transition-all hover:bg-zinc-800/50 ring-1 ring-emerald-500/10 bg-emerald-500/5">
                  <span className="text-sm font-bold text-emerald-400 leading-tight tracking-tight">Power Platform + AI</span>
                  <span className="text-[11px] font-medium text-emerald-500/50 lowercase mt-1">Intelligent enterprise transformation</span>
                </Link>

                <div className="h-px bg-zinc-800 my-4 mx-2" />

                {/* Section 2: Core Solutions */}
                <div className="px-2 mb-3">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#049DCB]/60">Core Solutions</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <Link href="/solutions/power-apps" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-white/5">
                    <span className="text-sm font-bold text-white/90 tracking-tight">Power Apps</span>
                  </Link>
                  <Link href="/solutions/power-automate" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-white/5">
                    <span className="text-sm font-bold text-white/90 tracking-tight">Automate</span>
                  </Link>
                  <Link href="/solutions/power-bi" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-white/5">
                    <span className="text-sm font-bold text-white/90 tracking-tight">Power BI</span>
                  </Link>
                  <Link href="/solutions/power-platform" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-white/5">
                    <span className="text-sm font-bold text-white/90 tracking-tight">Governance</span>
                  </Link>
                </div>
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-20 z-[90] bg-zinc-900/40 backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 top-20 z-[100] w-[280px] border-l border-zinc-800 bg-zinc-950/98 backdrop-blur-xl p-6 shadow-2xl sm:hidden"
            >
              <nav className="flex flex-col gap-1.5">
                <div className="mb-4">
                  <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Navigation</p>
                </div>
                
                <div className="mb-2 px-3 mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7C5CFC]">Engineering Solutions</p>
                </div>
                <Link href="/solutions/data-readiness" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all tracking-tight">
                   Data Readiness <ChevronRight className="h-4 w-4 text-emerald-500" />
                </Link>
                <Link href="/solutions/ai-agents" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all tracking-tight">
                   AI Swarms <ChevronRight className="h-4 w-4 text-[#7C5CFC]" />
                </Link>
                <Link href="/solutions/power-platform-ai" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all tracking-tight">
                   Power + AI <ChevronRight className="h-4 w-4 text-[#049DCB]" />
                </Link>

                <div className="my-4 h-px w-full bg-zinc-800" />

                <div className="mb-2 px-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#049DCB]">Core Platforms</p>
                </div>
                <Link href="/solutions/power-platform" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all tracking-tight">
                   Governance <ChevronRight className="h-4 w-4 opacity-30" />
                </Link>
                <Link href="/solutions/power-apps" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all tracking-tight">
                   Power Apps <ChevronRight className="h-4 w-4 opacity-30" />
                </Link>
                <Link href="/solutions/power-automate" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all tracking-tight">
                   Power Automate <ChevronRight className="h-4 w-4 opacity-30" />
                </Link>
                
                <div className="my-4 h-px w-full bg-zinc-800" />
                
                <Link href="/Training" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all">
                   Training <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>


                <Link href="/Contact" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all">
                   Contact <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>

                <div className="my-4 h-px w-full bg-zinc-800" />
                
                <div className="mb-3 px-3">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Engineering Access</p>
                </div>
                <Link href="/console" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-950 bg-white border border-white hover:bg-zinc-100 transition-all shadow-lg active:scale-95">
                  <Zap className="h-5 w-5 text-emerald-600" /> AI Console
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
