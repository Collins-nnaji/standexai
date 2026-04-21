"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Cpu, Search, Shield, ArrowRight, Activity, Terminal, Database } from 'lucide-react';

const AIImplementation = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const sectionRef = useRef(null);

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
      title: "Data Readiness Audit",
      description: "Proprietary schema diagnostics and readiness scoring to prepare legacy datasets for LLM integration.",
      icon: <Database className="h-5 w-5 text-[#7C5CFC]" />,
      stats: "SEC/HIPAA Ready",
      tag: "READINESS"
    },
    {
      title: "Autonomous AI Swarms",
      description: "Multi-agent orchestration using LangGraph and Swarm for complex, self-correcting business logic.",
      icon: <Terminal className="h-5 w-5 text-[#7C5CFC]" />,
      stats: "Goal-Oriented",
      tag: "AGENTIC"
    },
    {
      title: "Active Power + AI",
      description: "Injecting custom Azure OpenAI models into existing Power Platform ecosystems for immediate ROI.",
      icon: <Cpu className="h-5 w-5 text-[#7C5CFC]" />,
      stats: "Low-Code Hub",
      tag: "TRANSFORM"
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
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7C5CFC]">System Implementation</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-tight mb-6">
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
                        <h3 className="font-bold tracking-tight text-zinc-900">{step.title}</h3>
                        <span className="text-[9px] font-bold bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded leading-none">
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
                      <span className="text-zinc-500 font-bold tracking-tight uppercase tracking-widest">standex-core v4.1</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">p99: 2.4ms</span>
                      </div>
                      <span className="text-emerald-500 font-bold tracking-tight">ALIGNED</span>
                    </div>
                  </div>

                  {/* Diagnostic Logs */}
                  <div className="space-y-4 text-[10px]">
                    <div className="flex gap-4">
                      <span className="text-zinc-700 shrink-0">16:50:36</span>
                      <span className="text-[#34D399]">[READINESS]</span>
                      <span className="text-zinc-400">Scanning 'claims_v2' for HIPAA drift...</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-zinc-700 shrink-0">16:50:37</span>
                      <span className="text-[#7C5CFC]">[AGENTIC]</span>
                      <span className="text-zinc-400">Instantiating Researcher + Validator swarm...</span>
                    </div>
                    
                    <div className="py-4 border-y border-zinc-800 my-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-500 italic uppercase font-bold tracking-tighter">AI Readiness Score</span>
                        <span className="text-emerald-500 font-bold tracking-tight tracking-widest uppercase italic">84.2% Passed</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-2000 delay-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                          style={{ width: animationStarted ? '84.2%' : '0%' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50">
                        <div className="text-zinc-600 mb-1 font-bold tracking-tighter uppercase text-[8px]">Goverance Pass</div>
                        <div className="text-white text-md font-bold tracking-tighter uppercase italic">SUCCESS</div>
                      </div>
                      <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-900/50">
                        <div className="text-zinc-600 mb-1 font-bold tracking-tighter uppercase text-[8px]">Agentic Delta</div>
                        <div className="text-white text-md font-bold tracking-tighter uppercase italic">+12.4% ROI</div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <span className="text-[#7C5CFC] shrink-0">$</span>
                      <span className="text-zinc-300 animate-pulse">Running semantic audit for Power Platform integration...</span>
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
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Impact</span>
                <span className="text-2xl font-bold text-[#7C5CFC] tracking-tighter">61%</span>
                <span className="text-[8px] font-bold tracking-tight text-zinc-500 text-center leading-tight">Brand Visibility Gain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIImplementation;
