"use client";

import React, { useState, useEffect, useRef } from 'react';

const PowerBiServices = () => {
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
      id: 'consulting',
      title: 'Power BI Consulting',
      description: "After understanding your business's unique challenges and goals, we identify areas of strength, uncover inefficiencies, and pinpoint opportunities for improvement.",
      linkText: 'Speak To A Consultant'
    },
    {
      id: 'development',
      title: 'Power BI Development',
      description: 'Leveraging our deep expertise in Power BI, we design and implement dashboards that turn your data into actionable insights, driving growth and efficiency.',
      linkText: 'Schedule A Call'
    },
    {
      id: 'training',
      title: 'Power BI Training',
      description: 'Equip your team with the skills to fully utilise Power BI. We cover everything from basic data visualisation techniques to advanced analytics, helping you harness the full potential of your data.',
      linkText: 'Speak To Our Training Specialists'
    },
    {
      id: 'support',
      title: 'Power BI Support',
      description: "Whether it's troubleshooting an existing setup, refining data models, or updating your reports, we offer ongoing Power BI support, ensuring your analytics solutions continue to meet your needs.",
      linkText: 'Speak To Our Support Team'
    }
  ];

  // Icons for each service type
  const getServiceIcon = (serviceId: string) => {
    switch(serviceId) {
      case 'consulting':
        return (
          <div className="bg-[#7C5CFC] rounded-full p-4 flex items-center justify-center w-16 h-16">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
      case 'development':
        return (
          <div className="bg-[#7C5CFC] rounded-full p-4 flex items-center justify-center w-16 h-16">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
        );
      case 'training':
        return (
          <div className="bg-[#7C5CFC] rounded-full p-4 flex items-center justify-center w-16 h-16">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
        );
      case 'support':
        return (
          <div className="bg-[#7C5CFC] rounded-full p-4 flex items-center justify-center w-16 h-16">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
              <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
              <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
              <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-[#7C5CFC] rounded-full p-4 flex items-center justify-center w-16 h-16">
            <span className="text-white text-xl font-black">{serviceId.charAt(0).toUpperCase()}</span>
          </div>
        );
    }
  };

  return (
    <section className="py-20 bg-zinc-950 w-full">
      <div ref={sectionRef} className="container mx-auto px-4 max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <p 
            className={`text-[#7C5CFC] font-medium mb-3 transform transition-all duration-700 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Power BI Services
          </p>
          <h2 
            className={`text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight transform transition-all duration-700 delay-100 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Power BI solutions to transform your data into your most valuable asset
          </h2>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {serviceCards.map((card, index) => (
            <div 
              key={card.id} 
              className={`bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col h-full transform transition-all duration-700 hover:-translate-y-1 hover:shadow-lg hover:border-[#7C5CFC] ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div 
                className="mb-4"
                style={{ 
                  animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                  animationDelay: `${index * 0.5}s`
                }}
              >
                {getServiceIcon(card.id)}
              </div>
              <h3 className="text-xl font-black text-white tracking-tight mt-5 mb-3">{card.title}</h3>
              <p className="text-zinc-400 flex-grow mb-5">{card.description}</p>
              <a 
                href="#contact-form" 
                onClick={scrollToContactForm}
                className="text-[#7C5CFC] hover:text-[#7C5CFC] font-medium inline-flex items-center transition-colors"
              >
                {card.linkText}
                <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </section>
  );
};

export default PowerBiServices;