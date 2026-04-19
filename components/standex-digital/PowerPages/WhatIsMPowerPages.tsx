"use client";

import React, { useState, useEffect, useRef } from 'react';

const WhatIsMPowerPages = () => {
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
    <div className="py-16 px-4 w-full bg-zinc-950">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Text Content */}
          <div 
            className={`transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-20) opacity-0'
            }`}
          >
            <p className="text-[#7C5CFC] font-medium mb-3">
              Transform Digital Experiences, One Page At A Time
            </p>
            
            <h2 className="text-4xl font-black text-white tracking-tight mb-6">
              What Is Microsoft Power Pages?
            </h2>
            
            <div className="space-y-4 text-zinc-400">
              <p>
                Microsoft Power Pages stands as a robust, low-code SaaS (Software as a Service)
                platform, catering to the development, hosting, and management of contemporary
                external-facing business websites. As a key component of the Microsoft Power Platform
                suite, it empowers developers to efficiently design, configure, and launch websites.
                These sites are tailored to provide a consistent and seamless user experience across a
                diverse range of web browsers and devices.
              </p>
              
              <p>
                This platform stands out for its ability to integrate seamlessly with other Power Platform
                components, such as Power Apps, Power Automate, and Power BI, providing a
                comprehensive suite for business solutions. Built with security at its core, the platform
                provides robust security features, including data encryption and compliance with
                industry standards.
              </p>
            </div>
          </div>
          
          {/* Right Column - Image */}
          <div 
            className={`flex justify-center transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="rounded-lg overflow-hidden shadow-xl border border-zinc-800 relative">
              {/* Subtle glow effect behind the image */}
              <div 
                className={`absolute inset-0 bg-[#7C5CFC] opacity-0 blur-2xl transition-all duration-1500 ${
                  animationStarted ? 'opacity-5' : 'opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              ></div>
              
              <img 
                src="/Power-Pages.webp" 
                alt="Person working on Microsoft Power Pages" 
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
    </div>
  );
};

export default WhatIsMPowerPages;