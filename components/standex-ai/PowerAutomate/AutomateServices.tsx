"use client";

import React, { useState, useEffect, useRef } from 'react';

const AutomateServices = () => {
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

  const scrollToContactForm = (e: any) => {
    e.preventDefault();
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Service cards data
  const serviceCards = [
    {
      title: "Automation Consulting",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      description: "We examine workflow efficiency, data management, and resource allocation to identify opportunities for ROI positive process automation.",
      linkText: "Speak To A Consultant"
    },
    {
      title: "Power Automate Development",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: "Our expert team designs and deploys custom power automate solutions that align with your specific business objectives, ensuring seamless integration.",
      linkText: "Schedule A Call"
    },
    {
      title: "Automation Training",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      description: "From basic workflow creation to advanced techniques, our training services provide your staff with the knowledge and skills necessary to utilise Power Automate effectively.",
      linkText: "Speak To Our Training Specialists"
    },
    {
      title: "Automation Support",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      description: "Our Power Automate support service ensures your automated process are functioning optimally. This includes troubleshooting, updates, and periodic reviews.",
      linkText: "Speak To Our Support Team"
    }
  ];

  return (
    <div className="w-full bg-zinc-950 py-16 px-4">
      <div ref={sectionRef} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 
            className={`text-[#7C5CFC] font-medium mb-3 transform transition-all duration-700 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Power Automate Services
          </h3>
          <h2 
            className={`text-3xl md:text-4xl font-black text-white tracking-tight max-w-3xl mx-auto transform transition-all duration-700 delay-100 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Our Automation Experts Will Transform The Way You Operate
          </h2>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((card, index) => (
            <div 
              key={index}
              className={`bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col h-full transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg hover:border-[#7C5CFC] ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${300 + index * 100}ms`,
                transitionDuration: '700ms'
              }}
            >
              <div 
                className="bg-[#7C5CFC] w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{ 
                  animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                  animationDelay: `${index * 0.5}s`
                }}
              >
                {card.icon}
              </div>
              <h3 className="text-xl font-black text-white tracking-tight mb-3">{card.title}</h3>
              <p className="text-zinc-400 mb-6 flex-grow">{card.description}</p>
              <a 
                href="#" 
                onClick={scrollToContactForm} 
                className="text-[#7C5CFC] font-medium hover:text-[#7C5CFC] transition-colors flex items-center"
              >
                {card.linkText}
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

export default AutomateServices;