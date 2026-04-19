"use client";

import React, { useState, useEffect, useRef } from 'react';

const WhatIsCopilot = () => {
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
      <div ref={sectionRef} className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Text content */}
          <div 
            className={`pr-0 lg:pr-8 transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-20) opacity-0'
            }`}
          >
            <h3 className="text-[#7C5CFC] font-medium mb-4">
              Revolutionise Your Customer And Employee Experiences
            </h3>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-6">
              What Is Microsoft Copilot Studio?
            </h2>
            
            <p className="text-zinc-400 mb-4">
              Microsoft Copilot Studio (formerly Power Virtual Agents) is a cutting-edge platform that 
              enables businesses to create and deploy intelligent chatbots with ease. These AI-powered 
              virtual agents can engage with customers and employees across various platforms, enhancing 
              support, streamlining communication, and freeing up valuable human resources for strategic tasks.
            </p>
          </div>
          
          {/* Right column - Image */}
          <div 
            className={`mt-6 lg:mt-0 transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="relative">
              {/* Subtle glow effect behind the image */}
              <div 
                className={`absolute inset-0 bg-[#7C5CFC] opacity-0 blur-2xl rounded-lg transition-all duration-1500 ${
                  animationStarted ? 'opacity-5' : 'opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              ></div>
              
              <img 
                src="/Copilot.webp" 
                alt="Person using laptop with AI chatbot interface" 
                className="rounded-lg shadow-lg w-full border border-zinc-800 relative z-10"
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

export default WhatIsCopilot;