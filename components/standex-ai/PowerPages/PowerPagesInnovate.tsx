"use client";

import React, { useState, useEffect, useRef } from 'react';

const PowerPagesInnovate = () => {
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

  // Features data
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-[#7C5CFC]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
        </svg>
      ),
      title: "Engage Audiences",
      description: "Organisations can harness the power of data-driven decision-making, automate workflows across platforms, and deliver personalised, responsive user experiences."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#7C5CFC]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
        </svg>
      ),
      title: "Integrated",
      description: "Admins spend more time on analysis and less time on data management, report development, content management etc."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#7C5CFC]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path>
        </svg>
      ),
      title: "Customisable",
      description: "Power Pages has the ability to be further customised and styled using standard programming languages such as HTML, CSS, JavaScript."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#7C5CFC]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      ),
      title: "Accessible",
      description: "Power Pages is designed to be accessible across devices and locations ensuring a consistent, user-friendly experience."
    }
  ];

  return (
    <div className="py-16 px-4 w-full bg-zinc-950">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Side - Heading and Image */}
          <div 
            className={`transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-20) opacity-0'
            }`}
          >
            <p className="text-[#7C5CFC] font-medium mb-3">
              Build, Innovate, and Thrive
            </p>
            
            <h2 className="text-4xl font-black text-white tracking-tight mb-6">
              Empower Your Web Presence with Power Pages
            </h2>
            
            <div className="rounded-lg overflow-hidden shadow-lg border border-zinc-800">
              <img 
                src="/Power-Pages-Innovate.webp" 
                alt="Person analyzing data on computer" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Right Side - Content */}
          <div 
            className={`space-y-6 transform transition-all duration-1000 ${
              animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="text-2xl font-semibold text-[#7C5CFC] mb-4">
              Transforming Data into Dynamic Websites
            </h3>
            
            <div className="space-y-4 text-zinc-400">
              <p>
                Power Pages is a versatile and powerful tool that can significantly benefit businesses
                looking to establish or enhance their online presence. Its ease of use, combined
                with powerful data integration and customization capabilities, makes it an ideal
                solution for businesses aiming to create professional, data-driven websites efficiently
                and securely.
              </p>
              
              <p>
                If your business heavily relies on Microsoft's suite of tools like Dynamics 365, Power
                BI, or other Power Platform services, Power Pages offers seamless integration. This
                integration facilitates data sharing and process automation across your business
                applications, which might be more complex to achieve with a WordPress site.
              </p>
              
              <p>
                One of the standout features of Power Pages is its integration capabilities with
                Microsoft's Dataverse, allowing businesses to easily manage and display data on
                their websites. This integration facilitates real-time data updates and ensures that
                website content is consistently aligned with the business's internal data.
              </p>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center bg-zinc-900 rounded-lg p-6 border border-zinc-800 transform transition-all duration-700 hover:-translate-y-1 hover:shadow-lg hover:border-[#7C5CFC] ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div 
                className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4"
                style={{ 
                  animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                  animationDelay: `${index * 0.3}s`
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-white tracking-tight mb-3">{feature.title}</h3>
              <p className="text-zinc-400">
                {feature.description}
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
    </div>
  );
};

export default PowerPagesInnovate;