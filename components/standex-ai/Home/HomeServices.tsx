"use client";

import React, { useState, useEffect, useRef } from 'react';

const HomeServices = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const sectionRef = useRef(null);
  
  // Use intersection observer to detect when the section is in view
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
      threshold: 0.25,
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
    <div className="w-full bg-white relative">
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes glow {
          0% {
            box-shadow: 0 0 0px rgba(124, 92, 252, 0);
          }
          50% {
            box-shadow: 0 0 15px rgba(124, 92, 252, 0.3);
          }
          100% {
            box-shadow: 0 0 0px rgba(124, 92, 252, 0);
          }
        }
        
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
      
      <section ref={sectionRef} className="relative py-16 px-4 max-w-7xl mx-auto z-10">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50 px-3 py-1 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFC]">Microsoft Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-zinc-900 leading-[1.1]">
            Our Services
          </h2>
        </div>
        
        <div 
          className={`text-center max-w-4xl mx-auto mb-16 transform transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <p className="text-sm sm:text-base font-semibold text-zinc-500 leading-relaxed">
            We are experts in Microsoft Power Platform services and also specialize in Intelligent Cloud Solutions, 
            Web & App Development, and Digital Marketing. Our comprehensive expertise ensures that 
            we can deliver optimal solutions tailored to your specific needs, regardless of your current technology stack.
          </p>
        </div>
        
        <div 
          className={`bg-white rounded-[32px] overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-zinc-200 transform transition-all duration-1000 delay-200 ${
            animationStarted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
          } hover:shadow-[0_48px_100px_-20px_rgba(0,0,0,0.12)] hover:border-zinc-300 transition-shadow`}
        >
          <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left side - Diagram */}
            <div 
              className={`w-full md:w-1/2 flex items-center justify-center transform transition-all duration-1000 delay-400 ${
                animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <div className="relative w-full max-w-md aspect-square">
                {/* Center circle with glow animation instead of pulse */}
                <div 
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#7C5CFC] rounded-full w-2/5 h-2/5 flex items-center justify-center z-10 transition-all duration-1000 delay-800 ${
                    animationStarted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                  style={{ 
                    animationName: animationStarted ? 'glow' : 'none',
                    animationDuration: '4s',
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite'
                  }}
                >
                  <div className="text-center text-white font-black text-[10px] uppercase tracking-widest">
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
                    animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
                
                {/* Background icons with rotation */}
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
                    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
                    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
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
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div 
              className={`w-full lg:w-1/2 flex flex-col justify-center transform transition-all duration-1000 delay-400 ${
                animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[#7C5CFC]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="6" height="6" fill="currentColor" />
                    <rect x="14" y="4" width="6" height="6" fill="currentColor" />
                    <rect x="4" y="14" width="6" height="6" fill="currentColor" />
                    <rect x="14" y="14" width="6" height="6" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-zinc-950">Power Platform Solutions</h3>
              </div>
              
              <p className="mb-8 text-sm sm:text-base font-semibold text-zinc-500 leading-relaxed">
                The Microsoft Power Platform is our primary area of expertise, with its four key products 
                designed to boost your company&apos;s efficiency and drive productivity. Our specialized implementation 
                enables you to analyze data through Power BI, automate processes with Power Automate, build 
                custom apps with Power Apps, and create engaging websites with Power Pages.
                <br /><br />
                In addition to our Power Platform solutions, we provide Intelligent Cloud Solutions for optimizing your infrastructure, 
                Web & App Development services creating seamless digital experiences across all devices, and 
                Digital Marketing strategies to increase visibility and generate qualified leads.
              </p>
              
              <div 
                className={`transform transition-all duration-700 delay-500 ${
                  animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <a 
                  href="/solutions/power-platform" 
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#7C5CFC] to-[#A892FF] px-8 py-4 text-[12px] font-black uppercase tracking-widest text-white shadow-[0_0_30px_-10px_rgba(124,92,252,0.8)] hover:shadow-[0_0_50px_-15px_rgba(124,92,252,1)] transition-all active:scale-95"
                >
                  Explore Power Platform
                  <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeServices;