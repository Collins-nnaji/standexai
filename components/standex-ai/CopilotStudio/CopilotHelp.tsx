"use client";

import React, { useState, useEffect, useRef } from 'react';

const CopilotHelp = () => {
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

  // Benefits data
  const benefits = [
    {
      title: "Save Resources",
      description: "Reduce the need for extensive human intervention, cutting down operational costs and freeing staff for higher value work.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#7C5CFC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Respond Instantly",
      description: "Provide immediate responses to common queries, eliminating the need to wait for human assistance, enhancing user satisfaction.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#7C5CFC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      )
    },
    {
      title: "Continuous Improvement",
      description: "Built in analytics and feedback tools allow ongoing optimisation, ensuring chatbots evolve with your business needs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#7C5CFC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      title: "Accessibility",
      description: "Quickly retrieve and present relevant information from various systems, saving users the time and effort required to search for data themselves.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#7C5CFC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-zinc-950 w-full">
      <div ref={sectionRef} className="container mx-auto px-4 max-w-6xl">
        {/* Main section with image and text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left column */}
          <div 
            className={`transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-20) opacity-0'
            }`}
          >
            <h3 className="text-[#7C5CFC] font-medium mb-4">
              Simplify and Streamline
            </h3>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-6">
              How Can Copilot Studio Transform Your Business?
            </h2>
            
            <div className="mt-6">
              <div className="relative">
                {/* Subtle glow effect behind the image */}
                <div 
                  className={`absolute inset-0 bg-[#7C5CFC] opacity-0 blur-2xl rounded-lg transition-all duration-1500 ${
                    animationStarted ? 'opacity-5' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: '500ms' }}
                ></div>
                
                <img 
                  src="/Copilot-Help.webp" 
                  alt="Data center with blue digital visualization" 
                  className="rounded-lg shadow-lg w-full border border-zinc-800 relative z-10"
                />
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div 
            className={`transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="text-[#7C5CFC] font-medium mb-4">
              Engaging Experiences for Customers, Clients, and Staff
            </h3>
            
            <p className="text-zinc-400 mb-6">
              Copilot Studio offers a robust, low-code solution to create and deploy interactive 
              chatbots (AI Copilots) effortlessly. Leveraging its extensive set of connectors, you can 
              easily connect with various data sources and applications to deliver engaging and 
              efficient experiences.
            </p>
            
            <ul className="space-y-6">
              <li 
                className={`flex transform transition-all duration-700 ${
                  animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <span className="text-[#7C5CFC] font-black tracking-tight mr-2">•</span>
                <div>
                  <span className="font-black tracking-tight text-white">Customisable Conversations:</span>
                  <span className="text-zinc-400"> Design tailored conversation flows that reflect your 
                  business processes and customer interactions.</span>
                </div>
              </li>
              
              <li 
                className={`flex transform transition-all duration-700 ${
                  animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <span className="text-[#7C5CFC] font-black tracking-tight mr-2">•</span>
                <div>
                  <span className="font-black tracking-tight text-white">Multi-Channel Deployment:</span>
                  <span className="text-zinc-400"> Deploy copilots across multiple channels to ensure 
                  they are accessible where your users are.</span>
                </div>
              </li>
              
              <li 
                className={`flex transform transition-all duration-700 ${
                  animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <span className="text-[#7C5CFC] font-black tracking-tight mr-2">•</span>
                <div>
                  <span className="font-black tracking-tight text-white">Advanced Analytics:</span>
                  <span className="text-zinc-400"> Leverage insights and recommendations to continuously 
                  improve the performance and relevance of your AI copilots.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Benefits icons section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`p-6 bg-zinc-900 rounded-lg border border-zinc-800 transform transition-all duration-700 hover:-translate-y-1 hover:shadow-lg hover:border-[#7C5CFC] text-center md:text-left ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${700 + index * 100}ms` }}
            >
              <div 
                className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4"
                style={{ 
                  animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                  animationDelay: `${index * 0.3}s`
                }}
              >
                {benefit.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-3">{benefit.title}</h3>
              <p className="text-zinc-400">
                {benefit.description}
              </p>
            </div>
          ))}
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
    </section>
  );
};

export default CopilotHelp;