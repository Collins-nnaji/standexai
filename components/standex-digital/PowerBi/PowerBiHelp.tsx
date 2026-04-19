"use client";

import React, { useState, useEffect, useRef } from 'react';

const PowerBiHelp = () => {
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

  // Benefits data
  const benefits = [
    {
      title: "Connect Your Data",
      description: "We can help you embrace the power of automation to streamline information collation across your organisation, making your report generation quicker and more efficient."
    },
    {
      title: "Interactive Dashboards",
      description: "We'll improve team collaboration to help your organisation easily make decisions by transforming complex data into clear, visually engaging dashboards."
    },
    {
      title: "Real-time Insights",
      description: "Implement centralised reporting systems that offer a single, live version of each report, ensuring that everyone in your organisation always has access to the most current and accurate data."
    }
  ];

  return (
    <section className="py-16 bg-zinc-900 w-full">
      <div ref={sectionRef} className="container mx-auto px-4 max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <p 
            className={`text-[#7C5CFC] font-medium mb-3 transform transition-all duration-700 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            How Our Power BI Services Can Help You
          </p>
          <h2 
            className={`text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight transform transition-all duration-700 delay-100 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Empower Your Team with Data
          </h2>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`bg-zinc-800 rounded-lg shadow-md p-8 border border-zinc-700 transform transition-all duration-700 hover:-translate-y-1 hover:shadow-lg hover:border-[#7C5CFC] ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <h3 className="text-xl font-black text-white tracking-tight mb-4">{benefit.title}</h3>
              <p className="text-zinc-400">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Example */}
        <div 
          className={`bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-700 transform transition-all duration-1000 delay-500 ${
            animationStarted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
          }`}
        >
          <div className="rounded overflow-hidden relative">
            {/* Subtle glow effect behind the image */}
            <div 
              className={`absolute inset-0 bg-[#7C5CFC] opacity-0 blur-2xl transition-all duration-1500 ${
                animationStarted ? 'opacity-5' : 'opacity-0'
              }`}
              style={{ transitionDelay: '800ms' }}
            ></div>
            
            <img 
              src="/Power-BI-Help.webp" 
              alt="Power BI Dashboard Example" 
              className="w-full h-auto object-cover relative z-10"
            />
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div 
        className={`absolute -top-20 right-0 w-64 h-64 bg-gradient-to-br from-[#7C5CFC] to-transparent rounded-full filter blur-3xl opacity-0 transform transition-all duration-2000 ${
          animationStarted ? 'opacity-10' : 'opacity-0'
        }`}
        style={{ zIndex: 0 }}
      ></div>
      
      <div 
        className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#7C5CFC] to-transparent rounded-full filter blur-3xl opacity-0 transform transition-all duration-2000 ${
          animationStarted ? 'opacity-10' : 'opacity-0'
        }`}
        style={{ zIndex: 0 }}
      ></div>
    </section>
  );
};

export default PowerBiHelp;