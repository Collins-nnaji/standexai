"use client";

import React, { useState, useEffect } from 'react';

const AutomateHeader = () => {
  // Stats data
  const stats = [
    {
      end: 300,
      suffix: '+',
      title: 'Connectors',
      description: 'Power Automate connects and automates tasks across hundreds of apps and systems.'
    },
    {
      end: 25,
      suffix: '%',
      title: 'Error Reduction',
      description: 'According to Forrester, organisations reduced errors by 24.7% when increasing automated workflows.'
    },
    {
      end: 30,
      suffix: '+',
      title: 'Years of Experience',
      description: 'Our consultants in the UK have over 30 years of automation experience.'
    }
  ];

  // Count animation
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
    <div className="w-full bg-gradient-to-r from-zinc-950 to-zinc-900 text-white py-16 px-4 pt-32">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-2">
          <h3 className="text-lg font-medium">Microsoft Power Automate Consulting Services</h3>
        </div>
        
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Optimise your business processes with Power Automate
          </h1>
        </div>
        
        <div className="mb-10 max-w-3xl mx-auto">
          <p className="text-lg">
            Our team of automation specialists will streamline your processes and workflows to 
            eliminate repetitive manual tasks, saving you time and money.
          </p>
        </div>
        
        <div>
          <a 
            href="/Contact"
            className="bg-[#7C5CFC] text-zinc-900 font-medium py-3 px-6 rounded-md hover:bg-[#7C5CFC] transition-colors duration-300 inline-flex items-center"
          >
            Book A Free Consultation Call
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </a>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="max-w-6xl mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-black tracking-tighter text-purple-600">
                <CountUp end={stat.end} suffix={stat.suffix} />
              </div>
              <h3 className="text-xl font-medium mt-2 mb-3">{stat.title}</h3>
              <p className="text-zinc-300 mx-auto max-w-xs">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomateHeader;