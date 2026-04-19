"use client";

import React, { useState, useEffect, useRef } from 'react';

const CopilotSolutions = () => {
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

  const scrollToContactForm = (e) => {
    e.preventDefault();
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      id: 'consulting',
      icon: '📋',
      title: 'Consulting & Discovery',
      description: 'A comprehensive discovery phase that lays the foundation for a tailored AI copilot solution. We evaluate the effectiveness of your current processes, identify potential data gaps, and pinpoint inefficiencies.',
      linkText: 'Speak To A Consultant'
    },
    {
      id: 'development',
      icon: '🔧',
      title: 'Development & Build',
      description: 'Our development and build services bring your AI copilot to life. We work closely with you to design and develop a copilot that meets your specific requirements, integrating it seamlessly into your existing systems and workflows.',
      linkText: 'Start Your Project'
    },
    {
      id: 'training',
      icon: '🎓',
      title: 'Copilot Studio Training',
      description: 'Our training services are designed to equip your staff with the necessary skills and knowledge to leverage Microsoft Copilot Studio to its fullest potential. From basic usage to advanced features, we ensure your team is confident and competent.',
      linkText: 'Speak To Our Training Specialists'
    },
    {
      id: 'support',
      icon: '🛠️',
      title: 'Copilot Studio Support',
      description: 'We offer robust support services for troubleshooting, assistance in setting up tools, and further developing and implementing strategies. Whether it\'s a technical glitch or a strategic pivot, our team ensures everything runs smoothly.',
      linkText: 'Speak To Our Support Team'
    }
  ];

  return (
    <section className="py-20 bg-zinc-950 w-full">
      <div ref={sectionRef} className="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <div 
          className={`text-center mb-16 transform transition-all duration-1000 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-(-20) opacity-0'
          }`}
        >
          <h3 className="text-[#7C5CFC] font-medium mb-4">
            Copilot Studio Services
          </h3>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-6">
            Copilot Studio solutions for all your<br />chatbot requirements
          </h2>
          
          <p className="text-zinc-400 max-w-4xl mx-auto">
            Our team specialises in customising AI copilot solutions that cater to your unique business needs, 
            ensuring a smarter, faster, and more efficient way of working.
          </p>
        </div>
        
        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`bg-zinc-900 rounded-lg border border-zinc-800 p-6 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#7C5CFC] transform transition-all duration-700 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {/* Icon */}
              <div 
                className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ 
                  animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                  animationDelay: `${index * 0.3}s`
                }}
              >
                <span className="text-2xl text-[#7C5CFC]">{service.icon}</span>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-black text-white mb-3">
                {service.title}
              </h3>
              
              {/* Description */}
              <p className="text-zinc-400 mb-6 flex-grow">
                {service.description}
              </p>
              
              {/* Link */}
              <div className="mt-auto">
                <a 
                  href="#contact-form"
                  onClick={scrollToContactForm}
                  className="text-[#7C5CFC] hover:text-[#7C5CFC] font-medium transition-colors duration-300 flex items-center group"
                >
                  <span>{service.linkText}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
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
      
      {/* Background Elements */}
      <div 
        className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#7C5CFC] to-transparent rounded-full filter blur-3xl opacity-0 transform transition-all duration-2000 ${
          animationStarted ? 'opacity-5' : 'opacity-0'
        }`}
        style={{ zIndex: 0, transitionDelay: '300ms' }}
      ></div>
      
      <div 
        className={`absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#7C5CFC] to-transparent rounded-full filter blur-3xl opacity-0 transform transition-all duration-2000 ${
          animationStarted ? 'opacity-5' : 'opacity-0'
        }`}
        style={{ zIndex: 0, transitionDelay: '400ms' }}
      ></div>
    </section>
  );
};

export default CopilotSolutions;