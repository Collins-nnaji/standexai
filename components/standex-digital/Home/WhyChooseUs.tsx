"use client";

import React, { useState, useEffect, useRef } from 'react';

const WhyChooseUs = () => {
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

  return (
    <div ref={sectionRef} className="flex flex-col lg:flex-row w-full bg-white border-y border-zinc-100 overflow-hidden">
      {/* Left Section - Clean Zinc/White Background with Text */}
      <div className="w-full lg:w-1/2 py-20 px-6 md:px-12 lg:px-16 flex flex-col justify-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 mb-6 self-start">
          <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">Why Standex Digital</span>
        </div>
        
        <h2 
          className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-zinc-900 leading-[1.1] mb-8 transform transition-all duration-700 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Experts in Global <br /> Digital Transformation
        </h2>
        
        <p 
          className={`text-sm sm:text-base font-semibold text-zinc-500 leading-relaxed max-w-xl mb-12 transform transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Our proven track record of transforming businesses speaks volumes. As a certified Microsoft 
          Solutions Partner, we bring production-grade engineering and strategic consulting to every 
          engagement. We focus on high-frequency iteration and crafting tailored digital ecosystems that 
          drive measurable efficiency.
        </p>
        
        {/* Microsoft Partner Logo and Stats side by side */}
        <div 
          className={`grid sm:grid-cols-2 gap-4 transform transition-all duration-700 delay-200 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Microsoft Partner Logo Card */}
          <div className="bg-zinc-50 rounded-[24px] border border-zinc-200 p-6 flex flex-col justify-center items-center transition-all hover:bg-white hover:shadow-lg group">
            <img 
              src="/Microsoft-Solution-Partner-300x183.webp" 
              alt="Microsoft Solutions Partner" 
              className="h-12 mb-4 grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Certified Solutions Partner</p>
          </div>
          
          {/* Stats Card */}
          <div className="bg-zinc-50 rounded-[24px] border border-zinc-200 p-6 transition-all hover:bg-white hover:shadow-lg">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Network Health</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-tight text-zinc-800">250+ Deployments</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-tight text-zinc-800">100% Reliability</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section - Image with overlay */}
      <div className="w-full lg:w-1/2 h-[400px] lg:h-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10 lg:block hidden" />
        <img 
          src="/Woman-consulting.webp" 
          alt="Digital presentation with team" 
          className={`w-full h-full object-cover grayscale-[0.5] contrast-[1.1] transition-all duration-1500 ${
            animationStarted ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
        />
      </div>
    </div>
  );
};

export default WhyChooseUs;