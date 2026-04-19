"use client";

import React, { useState, useEffect } from 'react';

const PowerBiHeader = () => {
  // Stats data
  const stats = [
    {
      end: 300,
      suffix: '+',
      title: 'Connectors',
      description: 'To connect data from all your systems into one centralised dashboard'
    },
    {
      end: 97,
      suffix: '%',
      title: 'of the Fortune 500',
      description: 'Use Power BI to turn their data into compelling visual narratives'
    },
    {
      value: '#1',
      title: 'BI Solution',
      description: 'A leader for Analytics and Business Intelligence Platforms for 14 consecutive years.'
    }
  ];

  // Count animation component
  const CountUp = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let startTime;
      let animationFrame;
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        setCount(Math.floor(percentage * end));
        
        if (percentage < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }, [end, duration]);
    
    return <span>{count}{suffix}</span>;
  };

  return (
    <header className="w-full bg-gradient-to-b from-zinc-950 to-zinc-900 text-white py-16 relative overflow-hidden pt-32">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-40 h-40 bg-zinc-800 rounded-full opacity-10"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 bg-zinc-800 rounded-full opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Top Navigation Text */}
        <div className="text-center mb-6">
          <p className="text-[#7C5CFC] text-lg">Microsoft Power BI Consulting Services</p>
        </div>
        
        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6">
            Bring Your Data To Life With Power BI
          </h1>
          <p className="max-w-3xl mx-auto text-lg">
            Expert Power BI solutions to unlock hidden insights in your data and empower your 
            business to make data-driven decisions.
          </p>
        </div>
        
        {/* CTA Button */}
        <div className="text-center mb-16">
          <a 
            href="/Contact"
            className="inline-flex items-center px-6 py-3 bg-[#7C5CFC] text-zinc-900 rounded-md font-medium transition-all hover:bg-[#7C5CFC]"
          >
            Book A Free Consultation Call
            <svg 
              className="ml-2 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-black tracking-tighter text-purple-600">
                {stat.value ? (
                  <span>{stat.value}</span>
                ) : (
                  <CountUp end={stat.end} suffix={stat.suffix} />
                )}
              </div>
              <h3 className="text-xl font-medium mt-2 mb-3">{stat.title}</h3>
              <p className="text-zinc-300 mx-auto max-w-xs">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default PowerBiHeader;