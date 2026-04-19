"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Cpu, Search, Shield, ArrowRight, Activity, Terminal, Database } from 'lucide-react';

const AIImplementation = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleIntersection = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setAnimationStarted(true);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const implementationSteps = [
    {
      title: "Model Orchestration",
      description: "Unified synchronization of GPT-4o, Claude 3.5, and Gemini signals for consistent enterprise intelligence.",
      icon: <Cpu className="h-5 w-5 text-[#7C5CFC]" />,
      stats: "0.1ms Latency",
      tag: "CORE"
    },
    {
      title: "GEO Optimization",
      description: "Proprietary engine tuned for citation probability, hallucination risk, and semantic brand alignment.",
      icon: <Search className="h-5 w-5 text-[#7C5CFC]" />,
      stats: "94% Citation Rate",
      tag: "ENGINE"
    },
    {
      title: "Compliance Guardrails",
      description: "Automated verification layer that flags inconsistent brand facts before they propagate across AI models.",
      icon: <Shield className="h-5 w-5 text-[#7C5CFC]" />,
      stats: "Zero-Trust",
      tag: "GOVERNANCE"
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-24 px-4 bg-white overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
          
          {/* Left Side: Content */}
          <div className="lg:w-1/2">
            <div className={`transition-all duration-700 ${animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50 px-3 py-1 mb-6">
                <Activity className="h-3.5 w-3.5 text-[#7C5CFC]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFC]">System Implementation</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-black tracking-[-0.03em] text-zinc-900 leading-[1.1] mb-6">
                AI Implementation <br />
                <span className="text-zinc-400">Solution</span>
              </h2>
              
              <p className="text-lg font-medium text-zinc-500 leading-relaxed max-w-xl mb-10">
                We deliver production-grade engineering for leading organizations, specializing in the deployment 
                of proprietary AI engines tuned for citation, hallucination risk, and semantic alignment.
              </p>

              <div className="space-y-6 mb-10">
                {implementationSteps.map((step, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-start gap-4 p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 transition-all duration-500 hover:border-[#7C5CFC]/20 hover:bg-white hover:shadow-sm ${
                      animationStarted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${200 + idx * 100}ms` }}
                  >
                    <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black tracking-tight text-zinc-900">{step.title}</h3>
                        <span className="text-[9px] font-black bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded leading-none">
                          {step.tag}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 font-medium">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Engineering Visualization */}
          <div className="lg:w-1/2">
            <div className={`relative transition-all duration-1000 delay-300 ${animationStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              
              {/* Main Terminal Frame */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-2 shadow-[0_32px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="bg-zinc-950 rounded-2xl p-6 h-[480px] font-mono text-[11px] relative overflow-hidden">
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-zinc-500" />
                      <span className="text-zinc-500 font-black tracking-tight uppercase tracking-widest">standex-core v4.1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-500 font-black tracking-tight">ALIGNED</span>
                    </div>
                  </div>

                  {/* Diagnostic Logs */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <span className="text-zinc-700 shrink-0">16:50:36</span>
                      <span className="text-[#7C5CFC]">[INIT]</span>
                      <span className="text-zinc-400">Initializing Multi-Model Analysis Hub...</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-zinc-700 shrink-0">16:50:37</span>
                      <span className="text-purple-400">[SYNC]</span>
                      <span className="text-zinc-400">Claude 3.5 // GPT-4o // Gemini 1.5 Pro</span>
                    </div>
                    
                    <div className="py-4 border-y border-zinc-800 my-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-500">Citation Probability (CP)</span>
                        <span className="text-[#7C5CFC] font-black tracking-tight">94.2%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#7C5CFC] transition-all duration-2000 delay-1000"
                          style={{ width: animationStarted ? '94.2%' : '0%' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50">
                        <div className="text-zinc-600 mb-1 font-black tracking-tight tracking-tighter uppercase text-[9px]">Model Consensus</div>
                        <div className="text-white text-lg font-black tracking-tight">POSITIVE</div>
                      </div>
                      <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50">
                        <div className="text-zinc-600 mb-1 font-black tracking-tight tracking-tighter uppercase text-[9px]">Authority Distance</div>
                        <div className="text-white text-lg font-black tracking-tight">0.12km</div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <span className="text-emerald-500 shrink-0">$</span>
                      <span className="text-zinc-300 animate-pulse">Running semantic gap analysis on primary brand assets...</span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
                  <Database className="absolute bottom-8 right-8 h-12 w-12 text-zinc-900" />
                </div>
              </div>

              {/* Float Tags */}
              <div 
                className="absolute -top-6 -right-6 h-28 w-28 rounded-3xl bg-white border border-zinc-200 shadow-xl flex flex-col items-center justify-center p-4 transform rotate-12 transition-all duration-700 delay-700"
                style={{ opacity: animationStarted ? 1 : 0, transform: animationStarted ? 'rotate(12deg)' : 'rotate(0deg)' }}
              >
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Impact</span>
                <span className="text-2xl font-black text-[#7C5CFC] tracking-tighter">61%</span>
                <span className="text-[8px] font-black tracking-tight text-zinc-500 text-center leading-tight">Brand Visibility Gain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIImplementation;
