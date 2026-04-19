"use client";

import React, { useState, useEffect, useRef } from 'react';

const TechSolutions = () => {
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

  const solutions = [
    {
      title: "Intelligent Cloud Solutions",
      description: "Comprehensive cloud architecture and migration services designed to optimize your infrastructure, enhance security, and enable scalable growth for your business.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-[#7C5CFC]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      link: "#"
    },
    {
      title: "Web & App Development",
      description: "Custom website and mobile application development with responsive design, creating seamless digital experiences across all devices and platforms to engage users and drive your business forward.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-[#7C5CFC]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      link: "#"
    },
    {
      title: "Digital Marketing",
      description: "Results-driven digital marketing strategies including SEO, content marketing, and social media campaigns to increase visibility and generate qualified leads.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-[#7C5CFC]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      link: "#"
    },
    {
      title: "AI Architecture & Development",
      description: "Cutting-edge AI solutions that automate processes, extract valuable insights from data, and create intelligent applications to transform your business operations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-[#7C5CFC]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z" />
        </svg>
      ),
      link: "#"
    },
    {
      title: "E-commerce Solutions",
      description: "End-to-end e-commerce solutions with secure payment processing, inventory management, and personalized shopping experiences that increase conversions and customer loyalty.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-[#7C5CFC]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      link: "#"
    },
    {
      title: "Tech Elevate – Industry-Leading Training & Certification",
      description: "Comprehensive training programs and certification paths designed to upskill your workforce with cutting-edge technology knowledge and practical expertise to drive innovation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-[#7C5CFC]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: "/Training"
    }
  ];

  return (
    <div className="w-full py-16 px-6 bg-zinc-950">
      <div ref={sectionRef} className="max-w-7xl mx-auto text-center">
        
        <h2 
          className={`text-4xl font-black tracking-tight text-white mb-4 transform transition-all duration-700 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Technology Solutions
        </h2>
        
        <p 
          className={`text-xl text-zinc-400 max-w-3xl mx-auto mb-16 transform transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          We provide comprehensive technology services to help businesses thrive in the 
          digital era, leveraging innovative and disruptive tools of today.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <div 
              key={index}
              className={`bg-zinc-900 rounded-lg p-8 border border-gray-700 hover:border-[#7C5CFC] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#7C5CFC20] ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${200 + index * 100}ms`,
                transitionDuration: '700ms'
              }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-700 rounded-lg mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#7C5CFC] opacity-5"></div>
                {solution.icon}
              </div>
              
              <h3 className="text-2xl font-black tracking-tight text-white mb-4">
                {solution.title}
              </h3>
              
              <p className="text-zinc-400 mb-6">
                {solution.description}
              </p>
              
              <a href={solution.link} className="text-[#7C5CFC] font-medium hover:text-[#7C5CFC] transition-colors inline-flex items-center">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          ))}
        </div>
        

      </div>
    </div>
  );
};

export default TechSolutions;