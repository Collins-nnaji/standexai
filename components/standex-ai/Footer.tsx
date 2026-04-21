"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const footerRef = useRef(null);
  
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setAnimationStarted(true);
      }
    };
    
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1, // Trigger when 10% of the footer is visible
    });
    
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    
    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);
  
  return (
    <footer ref={footerRef} className="bg-zinc-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and Social Icons */}
        <div className="flex justify-between items-center mb-12">
          <div 
            className={`transform transition-all duration-700 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <img src="/StandexLogo.webp" alt="Standex Logo" className="h-9 opacity-90 mx-auto md:mx-0" />
          </div>
          
          <div className="flex space-x-6">
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/company/standex-ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className={`transform transition-all duration-500 hover:scale-110 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <svg className="w-6 h-6 text-white hover:text-emerald-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/standexdigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className={`transform transition-all duration-500 hover:scale-110 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <svg className="w-6 h-6 text-white hover:text-emerald-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            
            {/* X (Twitter) */}
            <a 
              href="https://x.com/standexdigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="X (Twitter)"
              className={`transform transition-all duration-500 hover:scale-110 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <svg className="w-6 h-6 text-white hover:text-emerald-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
        
        <hr className={`border-zinc-800 mb-12 transition-all duration-1000 ${
          animationStarted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className={`space-y-4 transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Engineering Intake</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:support@standexdigital.com" className="text-[11px] font-bold text-zinc-400 hover:text-emerald-500 transition-colors">support@standexdigital.com</a>
                <a href="mailto:hr@standexdigital.com" className="text-[11px] font-bold text-emerald-500 hover:text-white transition-colors">hr@standexdigital.com</a>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-12 md:gap-20 transition-all duration-700 delay-200 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Company</p>
              <nav className="flex flex-col gap-2.5">
                <Link href="/#about" className="text-[11px] font-bold text-zinc-400 hover:text-emerald-500 transition-all duration-300">Mission</Link>
                <Link href="/Contact" className="text-[11px] font-bold text-zinc-400 hover:text-emerald-500 transition-all duration-300">Contact</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Resources</p>
              <nav className="flex flex-col gap-2.5">
                <Link href="/#academy" className="text-[11px] font-bold text-zinc-400 hover:text-emerald-500 transition-all duration-300">Academy</Link>
                <Link href="/console" className="text-[11px] font-bold text-zinc-400 hover:text-emerald-500 transition-all duration-300">Console</Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className={`mt-12 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-700 delay-500 border-t border-white/[0.03] pt-8 ${
          animationStarted ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">© 2026 Standex Ltd • Applied Engineering Hub</p>
          
          {/* System Diagnostics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-2 rounded-full bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Latency: 14ms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">AI Engine: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">DB Ops: Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;