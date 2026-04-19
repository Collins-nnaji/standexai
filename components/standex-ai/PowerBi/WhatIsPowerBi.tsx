"use client";

import React, { useState, useEffect, useRef } from 'react';

const WhatIsPowerBi = () => {
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

  return (
    <section className="py-16 bg-zinc-950 w-full">
      <div ref={sectionRef} className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div 
            className={`lg:w-1/2 transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-20) opacity-0'
            }`}
          >
            <div className="text-[#7C5CFC] font-medium mb-2">About</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">What is Power BI?</h2>
            
            <div className="space-y-6 text-zinc-400">
              <p>
                Power BI is a reporting and dashboard design tool designed to transform your 
                complex data into visually stunning, interactive reports that inform & inspire smarter 
                business strategies.
              </p>
              
              <p>
                Every day your company generates large amounts of raw and structured data that contain 
                valuable insights. Power BI allows you to manage all of your data in one place at a 
                portfolio, project or programme view. This holistic view enables your organisation to make 
                cohesive decisions backed by a complete understanding of your data landscape.
              </p>
              
              <div className="mt-8">
                
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div 
            className={`lg:w-1/2 transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="rounded-lg overflow-hidden shadow-lg border border-zinc-800 relative">
              {/* Subtle glow effect behind the image */}
              <div 
                className={`absolute inset-0 bg-[#7C5CFC] opacity-0 blur-2xl transition-all duration-1500 ${
                  animationStarted ? 'opacity-5' : 'opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              ></div>
              
              <img 
                src="/Power-Bi.webp" 
                alt="Power BI Dashboard Example" 
                className="w-full h-auto object-cover relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div 
        className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#7C5CFC] to-transparent rounded-full filter blur-3xl opacity-0 transform transition-all duration-2000 ${
          animationStarted ? 'opacity-5' : 'opacity-0'
        }`}
        style={{ zIndex: 0, transitionDelay: '300ms' }}
      ></div>
      
      <div 
        className={`absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#7C5CFC] to-transparent rounded-full filter blur-3xl opacity-0 transform transition-all duration-2000 ${
          animationStarted ? 'opacity-5' : 'opacity-0'
        }`}
        style={{ zIndex: 0, transitionDelay: '400ms' }}
      ></div>
    </section>
  );
};

export default WhatIsPowerBi;