"use client";

import React, { useState, useEffect, useRef } from 'react';

const AutomateSolutions = () => {
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
      title: "Reduce Human Errors",
      description: "Power Automate eliminates the risk of human error by automating tasks with precision. This leads to fewer mistakes, improved data quality and smoother operations."
    },
    {
      title: "Boost Productivity",
      description: "Streamline your mundane and repetitive tasks, freeing up employees from time-consuming manual work allowing them to focus on higher-value tasks."
    },
    {
      title: "Enhance Collaboration & Communication",
      description: "Power Automate workflows can connect departments and systems fostering seamless information flow."
    }
  ];

  return (
    <div className="w-full bg-zinc-900 py-16 px-4">
      <div ref={sectionRef} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 
            className={`text-[#7C5CFC] font-medium mb-3 transform transition-all duration-700 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            How Our Power Automate Solutions Can Help You
          </h3>
          <h2 
            className={`text-3xl md:text-4xl font-black text-white tracking-tight max-w-3xl mx-auto transform transition-all duration-700 delay-100 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            The Key To A Smoother, More Productive Workplace
          </h2>
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`bg-zinc-800 rounded-lg p-8 shadow-md border border-zinc-700 transform transition-all duration-700 hover:-translate-y-1 hover:shadow-lg hover:border-[#7C5CFC] ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <h3 className="text-xl font-black text-white tracking-tight mb-4">{benefit.title}</h3>
              <p className="text-zinc-400">
                {index === 1 ? (
                  <>
                    Streamline your mundane and repetitive tasks, freeing up employees from{' '}
                    <span className="text-[#7C5CFC]">time-consuming</span> manual work allowing them to focus on higher-value tasks.
                  </>
                ) : benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Example Image */}
        <div 
          className={`flex justify-center transform transition-all duration-1000 delay-500 ${
            animationStarted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
          }`}
        >
          <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg border border-zinc-800">
            <img 
              src="/Power-Automate-Solutions.webp" 
              alt="Power Automate Travel Approval Dashboard Example" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div 
        className={`absolute -top-20 right-0 w-64 h-64 bg-gradient-to-br from-[#7C5CFC] to-transparent rounded-full filter blur-3xl opacity-10 transform transition-all duration-2000 ${
          animationStarted ? 'translate-x-0 opacity-10' : 'translate-x-20 opacity-0'
        }`}
        style={{ zIndex: 0 }}
      ></div>
      
      <div 
        className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#7C5CFC] to-transparent rounded-full filter blur-3xl opacity-10 transform transition-all duration-2000 ${
          animationStarted ? 'translate-x-0 opacity-10' : '-translate-x-20 opacity-0'
        }`}
        style={{ zIndex: 0 }}
      ></div>
    </div>
  );
};

export default AutomateSolutions;