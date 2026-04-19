"use client";

import React, { useState, useEffect, useRef } from 'react';

const PPservices = () => {
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

  const serviceCards = [
    {
      icon: "/PowerApps.svg",
      title: "Power Apps",
      description: "Transform your business with cost-effective, custom applications that are fully responsive across all your platforms and devices.",
      link: "/PowerApps",
      linkText: "Explore Power Apps Services",
      colorAccent: "#D25BB1"
    },
    {
      icon: "/PowerAutomate.svg",
      title: "Power Automate",
      description: "Save time, reduce costs, and increase your business efficiency by automating repetitive and manual processes.",
      link: "/PowerAutomate",
      linkText: "Explore Power Automate Services",
      colorAccent: "#2F8DD8"
    },
    {
      icon: "/PowerBi.svg",
      title: "Power BI",
      description: "Visualise your raw data in custom dashboards and insightful reports and make decisions based on real-time data.",
      link: "/PowerBi",
      linkText: "Explore Power BI Services",
      colorAccent: "#EEA32C"
    },
    {
      icon: "/PowerPages.svg",
      title: "Power Pages",
      description: "Enhance engagement, streamline operations, and provide easy access to your services with interactive web portals and websites.",
      link: "/PowerPages",
      linkText: "Explore Power Pages Services",
      colorAccent: "#9B7AC7"
    }
  ];

  return (
    <div className="w-full bg-zinc-950 py-16">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p 
            className={`text-[#7C5CFC] font-medium mb-2 transform transition-all duration-700 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Our Services
          </p>
          <h2 
            className={`text-4xl md:text-5xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight transform transition-all duration-700 delay-100 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Comprehensive Business Solutions with the Power Platform
          </h2>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((card, index) => (
            <div 
              key={index}
              className={`bg-zinc-900 rounded-lg border border-zinc-800 p-8 flex flex-col h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-[${card.colorAccent}] ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${200 + index * 100}ms`, 
                transitionDuration: '700ms' 
              }}
            >
              <div 
                className="mb-4 relative"
                style={{ 
                  animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                  animationDelay: `${index * 0.5}s`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-800 opacity-0 hover:opacity-10 rounded-full transition-opacity duration-300"></div>
                <img src={card.icon} alt={card.title} className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-4">{card.title}</h3>
              <p className="text-zinc-400 mb-6 flex-grow">
                {card.description}
              </p>
              <a 
                href={card.link} 
                className="text-[#7C5CFC] font-medium hover:text-[#7C5CFC] transition-colors flex items-center"
              >
                {card.linkText}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
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
    </div>
  );
};

export default PPservices;