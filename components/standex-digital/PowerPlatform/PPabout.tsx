"use client";

import React, { useState, useEffect, useRef } from 'react';

const PPabout = () => {
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
    <div className="bg-zinc-950 py-16 px-4 pt-32 w-full">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* About label */}
        <div 
          className={`mb-1 transform transition-all duration-700 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <span className="text-[#7C5CFC] font-medium">About</span>
        </div>
        
        {/* Header Section - full width, above both columns */}
        <div 
          className={`mb-4 transform transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            What Is The Microsoft Power Platform?
          </h1>
        </div>

        {/* Main Content - with smaller gap */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left side - Text content */}
          <div 
            className={`w-full lg:w-1/2 transform transition-all duration-700 delay-200 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
            }`}
          >
            <p className="text-lg text-zinc-400 mb-6">
              The Microsoft Power Platform is a suite of tools designed to enhance business
              operations. It comprises Power BI, Power Apps, Power Automate, and Power Pages, each
              powerful on its own and even more so when combined.
            </p>
            
            <p className="text-lg text-zinc-400 mb-8">
              At the heart of the Power Platform is its ability to unify analytics, automation, application
              development, and artificial intelligence. It streamlines operations, reducing dependency
              on third-party tools, and manual migrations.
            </p>
            
            <a 
              href="/MicrosoftPowerPlatform"
              className={`inline-block transform transition-all duration-700 delay-300 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <button className="bg-[#7C5CFC] text-white py-3 px-6 rounded-md font-medium flex items-center transition-all hover:bg-[#6B4FE0] hover:scale-105 duration-200">
                Find Out More
                <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </a>
          </div>
          
          {/* Right side - Power Platform Diagram with dark blue center */}
          <div 
            className={`w-full lg:w-1/2 flex justify-center transform transition-all duration-1000 delay-400 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Center circle */}
              <div 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#7C5CFC] rounded-full w-2/5 h-2/5 flex items-center justify-center z-10 transition-all duration-1000 delay-800 ${
                  animationStarted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
                style={{ 
                  boxShadow: animationStarted ? '0 0 15px rgba(4, 157, 203, 0.5)' : 'none',
                  transition: 'transform 1s, opacity 1s, box-shadow 1s'
                }}
              >
                <div className="text-center text-white font-medium text-sm">
                  <div>Power</div>
                  <div>Platform</div>
                  <div>Solutions</div>
                </div>
              </div>
              
              {/* Top circle and path (PowerApps) */}
              <div 
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4 transition-all duration-700 delay-900 ${
                  animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="absolute inset-0 border-4 border-[#D25BB1] rounded-full"></div>
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ 
                    animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                    animationDelay: '0.1s'
                  }}
                >
                  <img src="/PowerApps.svg" alt="Power Apps" className="w-1/2 h-1/2" />
                </div>
              </div>
              <div 
                className={`absolute top-[12%] left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 border-4 border-[#D25BB1] rounded-full border-b-0 border-x-0 transition-all duration-700 delay-1000 ${
                  animationStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
              ></div>
              
              {/* Right circle and path (Power BI) */}
              <div 
                className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-1/4 h-1/4 transition-all duration-700 delay-1100 ${
                  animationStarted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
              >
                <div className="absolute inset-0 border-4 border-[#EEA32C] rounded-full"></div>
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ 
                    animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                    animationDelay: '0.7s'
                  }}
                >
                  <img src="/PowerBi.svg" alt="Power BI" className="w-3/4 h-1/2" />
                </div>
              </div>
              <div 
                className={`absolute top-1/2 right-[12%] transform -translate-y-1/2 w-1/3 h-1/3 border-4 border-[#EEA32C] rounded-full border-l-0 border-y-0 transition-all duration-700 delay-1200 ${
                  animationStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
              ></div>
              
              {/* Bottom circle and path (DataVerse) */}
              <div 
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4 transition-all duration-700 delay-1300 ${
                  animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-(-10)'
                }`}
              >
                <div className="absolute inset-0 border-4 border-[#9B7AC7] rounded-full"></div>
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ 
                    animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                    animationDelay: '1.3s'
                  }}
                >
                  <img src="/PowerPages.svg" alt="Dataverse" className="w-1/2 h-1/2" />
                </div>
              </div>
              <div 
                className={`absolute bottom-[12%] left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 border-4 border-[#9B7AC7] rounded-full border-t-0 border-x-0 transition-all duration-700 delay-1400 ${
                  animationStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
              ></div>
              
              {/* Left circle and path (Power Automate) */}
              <div 
                className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-1/4 h-1/4 transition-all duration-700 delay-1500 ${
                  animationStarted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-(-10)'
                }`}
              >
                <div className="absolute inset-0 border-4 border-[#2F8DD8] rounded-full"></div>
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ 
                    animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                    animationDelay: '1.9s'
                  }}
                >
                  <img src="/PowerAutomate.svg" alt="Power Automate" className="w-1/2 h-1/2" />
                </div>
              </div>
              <div 
                className={`absolute top-1/2 left-[12%] transform -translate-y-1/2 w-1/3 h-1/3 border-4 border-[#2F8DD8] rounded-full border-r-0 border-y-0 transition-all duration-700 delay-1600 ${
                  animationStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
              ></div>
              
              {/* Additional icons around the diagram with rotation */}
              <div 
                className={`absolute top-[10%] left-[10%] text-zinc-500 opacity-20 transition-all duration-1000 delay-1700 ${
                  animationStarted ? 'opacity-20' : 'opacity-0'
                }`}
                style={{ 
                  animationName: animationStarted ? 'rotate' : 'none',
                  animationDuration: '20s',
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div 
                className={`absolute bottom-[10%] left-[10%] text-zinc-500 opacity-20 transition-all duration-1000 delay-1800 ${
                  animationStarted ? 'opacity-20' : 'opacity-0'
                }`}
                style={{ 
                  animationName: animationStarted ? 'rotate' : 'none',
                  animationDuration: '25s',
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="12" cy="19" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </div>
              <div 
                className={`absolute top-[10%] right-[10%] text-zinc-500 opacity-20 transition-all duration-1000 delay-1900 ${
                  animationStarted ? 'opacity-20' : 'opacity-0'
                }`}
                style={{ 
                  animationName: animationStarted ? 'rotate' : 'none',
                  animationDuration: '30s',
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <div 
                className={`absolute bottom-[10%] right-[10%] text-zinc-500 opacity-20 transition-all duration-1000 delay-2000 ${
                  animationStarted ? 'opacity-20' : 'opacity-0'
                }`}
                style={{ 
                  animationName: animationStarted ? 'rotate' : 'none',
                  animationDuration: '35s',
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                </svg>
              </div>
            </div>
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
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PPabout;