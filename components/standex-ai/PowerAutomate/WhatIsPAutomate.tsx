"use client";

import React, { useState, useEffect, useRef } from 'react';

const WhatIsPAutomate = () => {
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
    <div className="w-full bg-zinc-950 py-24 px-6 lg:px-12">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div
            className={`transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-20) opacity-0'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0078D4] mb-4">The Future Of Business Efficiency</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-8">What is Power Automate?</h2>

            <p className="text-zinc-300 mb-8 text-lg leading-relaxed">
              Microsoft Power Automate transforms how your business operates by automating
              tedious, repetitive tasks across hundreds of apps and services. This versatile and
              powerful tool enables businesses to reduce the potential for human error and allows your
              employees to focus on higher-value work.
            </p>

            <ul className="space-y-5 mb-8">
              <li
                className={`flex items-start transform transition-all duration-700 ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="text-[#0078D4] mr-3 mt-1 text-xl">•</div>
                <p className="text-zinc-300 text-base leading-relaxed">
                  <span className="font-semibold text-[#0078D4]">Seamless connections:</span> Integrate all of your essential software and data systems with ease.
                </p>
              </li>
              <li
                className={`flex items-start transform transition-all duration-700 ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <div className="text-[#0078D4] mr-3 mt-1 text-xl">•</div>
                <p className="text-zinc-300 text-base leading-relaxed">
                  <span className="font-semibold text-[#0078D4]">Work from anywhere:</span> Manage workflows on the go with the Power Automate mobile app.
                </p>
              </li>
            </ul>
            
          </div>
          
          {/* Right Column - Image */}
          <div 
            className={`rounded-lg overflow-hidden border border-zinc-800 shadow-lg transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <img 
              src="/Power-Automate.webp" 
              alt="Person looking at Power Automate workflow diagram" 
              className="w-full h-auto rounded-lg" 
            />
          </div>
        </div>
      </div>

      {/* Additional animated background element */}
      <div 
        className={`absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-[#7C5CFC10] to-transparent transform transition-all duration-1500 ${
          animationStarted ? 'opacity-20 translate-x-0' : 'opacity-0 translate-x-20'
        }`}
        style={{ transitionDelay: '300ms', zIndex: 0 }}
      ></div>
      
      {/* Additional animated background element */}
      <div 
        className={`absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-t from-[#7C5CFC10] to-transparent transform transition-all duration-1500 ${
          animationStarted ? 'opacity-20 translate-x-0' : 'opacity-0 translate-x-(-20)'
        }`}
        style={{ transitionDelay: '300ms', zIndex: 0 }}
      ></div>
    </div>
  );
};

export default WhatIsPAutomate;