"use client";

import React, { useState, useEffect, useRef } from 'react';

const WhatIsMPA = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const sectionRef = useRef(null);
  const featuresRef = useRef(null);
  
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === sectionRef.current) {
            setAnimationStarted(true);
          } else if (entry.target === featuresRef.current) {
            setAnimationStarted(true);
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    });
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  // Features data
  const features = [
    {
      title: 'Bespoke',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12" y2="18" />
        </svg>
      ),
      description: 'Custom application development that is built specifically for your organisation\'s needs and optimised for your requirements.'
    },
    {
      title: 'Powerful',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      description: 'Limitless capabilities with over 300+ connectors to integrate data from hundreds of systems including SharePoint, Dataverse, and Dynamics 365.'
    },
    {
      title: 'Secure',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      ),
      description: 'Enterprise-ready security and governance driven by Microsoft Identity Access Management. No additional costly security set-up required.'
    },
    {
      title: 'Effective',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      description: 'Link your custom app to Power Automate to instantly trigger automations and workflows to speed up repetitive and time-consuming tasks.'
    }
  ];

  return (
    <div>
      {/* What Is Power Apps Section */}
      <div className="w-full bg-zinc-950 py-16 px-4">
        <div ref={sectionRef} className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          {/* Left content section */}
          <div 
            className={`lg:w-1/2 transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}
          >
            <p className="text-[#7C5CFC] font-medium mb-2">Easy To Use, Easy To Maintain</p>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">What Is Microsoft Power Apps?</h2>
            
            <p className="text-zinc-400 mb-6">
              Power Apps is an innovative low-code cloud service that empowers businesses to build 
              custom applications and integrate data from multiple systems, without the need for 
              custom development.
            </p>
            
            <p className="text-zinc-400 mb-8">
              The limitless implementation of Power Apps makes it an extremely powerful tool that can 
              excel any business. Whether you need a custom app to improve internal productivity by 
              automating manual and repetitive tasks, or connect to thousands of customers externally 
              with your data via a login portal, Power Apps can provide the solution.
            </p>
          </div>
          
          {/* Right image section */}
          <div 
            className={`lg:w-1/2 flex justify-center transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="w-full max-w-md h-auto overflow-hidden rounded-lg border border-zinc-800 shadow-lg">
              <img 
                src="/Power-apps.webp" 
                alt="Microsoft Power Apps interface on mobile and desktop" 
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500x400?text=Power+Apps+Image";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-zinc-900 py-16">
        <div ref={featuresRef} className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center text-center bg-zinc-800 p-6 rounded-lg border border-zinc-700 transform transition-all duration-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#7C5CFC20] hover:border-[#7C5CFC] ${
                  animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${300 + (index * 100)}ms` }}
              >
                <div 
                  className="bg-gray-600 p-4 rounded-full mb-4 text-[#7C5CFC]"
                  style={{ 
                    animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                    animationDelay: `${index * 0.5}s`
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-[#7C5CFC] mb-4">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default WhatIsMPA;