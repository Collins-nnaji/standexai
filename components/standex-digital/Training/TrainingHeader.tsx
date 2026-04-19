"use client";

import React, { useState, useEffect, useRef } from 'react';

const TrainingHeader = () => {
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
    <div ref={sectionRef} className="bg-zinc-950 py-12 w-full pt-32">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12">
        {/* Text Content */}
        <div className="md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8">
          <h1 
            className={`text-4xl md:text-5xl font-black tracking-tight text-[#7C5CFC] mb-4 transform transition-all duration-700 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Standex Digital Academy
          </h1>
          <h2 
            className={`text-2xl md:text-3xl font-black tracking-tight text-white mb-4 transform transition-all duration-700 delay-100 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Your Gateway to Advanced Tech Skills
          </h2>
          <p 
            className={`text-zinc-400 text-lg transform transition-all duration-700 delay-200 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Welcome to Standex Digital Academy, where industry professionals teach practical 
            technology training programs to help you gain real-world skills for 
            immediate job placement.
          </p>
        </div>

        {/* Image Content */}
        <div 
          className={`md:w-1/2 relative transform transition-all duration-1000 ${
            animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}
        >
          <div className="relative p-4 w-64 h-64 md:w-80 md:h-80 mx-auto overflow-hidden">
            <img 
              src="/Tech-Elevate.png" 
              alt="Tech student working on laptop with headphones" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingHeader;