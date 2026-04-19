"use client";

import React, { useState, useEffect, useRef } from 'react';

const CopilotAbility = () => {
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

  // Define the capabilities data
  const capabilities = [
    {
      id: 'first-line',
      icon: '❓',
      title: 'First Line Support',
      description: 'Deploy AI copilots to handle customer inquiries, provide support, and streamline service delivery. These copilots can automate ticket creation in platforms like ServiceNow and autolog unresolved queries for further review.'
    },
    {
      id: 'employee-onboarding',
      icon: '👤',
      title: 'Employee Onboarding & HR Support',
      description: 'Use AI copilots to guide new employees through the onboarding process, answer HR-related questions, and provide instant support, reducing the strain on human resources.'
    },
    {
      id: 'it-support',
      icon: '💼',
      title: 'IT Support',
      description: 'Enhance IT helpdesk services with AI copilots capable of troubleshooting common technical issues and escalating complex problems. These copilots can handle repetitive tasks, freeing up IT staff for more critical issues.'
    },
    {
      id: 'data-retrieval',
      icon: '📊',
      title: 'Data Retrieval',
      description: 'Configure AI copilots to retrieve and present data efficiently, facilitating faster decision-making and reporting. This can be particularly useful for sales teams needing quick access to internal processes and data sources.'
    },
    {
      id: 'faq-knowledge',
      icon: '🎓',
      title: 'FAQ and Knowledge Base Access',
      description: 'Offer instant access to FAQs and knowledge bases through virtual agents. These bots can answer common queries, provide information from your knowledge base, and improve customer service efficiency.'
    },
    {
      id: 'policy-compliance',
      icon: '🔗',
      title: 'Policy Compliance',
      description: 'Ensure compliance with company policies by using AI copilots to guide employees through complex regulatory requirements and company procedures, particularly useful in highly regulated industries such as insurance and finance.'
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
            Copilot Studio Features
          </h3>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-6">
            What Can Copilot Chatbots Do?
          </h2>
          
          <p className="text-zinc-400 max-w-4xl mx-auto mb-12">
            Microsoft Copilot Studio offers a versatile platform that can transform how businesses interact with customers and streamline internal processes. 
            From handling customer inquiries to automating data retrieval, Copilot Studio's AI capabilities provide a wide range of applications tailored to meet diverse business needs.
          </p>
        </div>
        
        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <div 
              key={capability.id} 
              className={`bg-zinc-900 rounded-lg border border-zinc-800 p-6 transform transition-all duration-700 hover:-translate-y-1 hover:shadow-lg hover:border-[#7C5CFC] ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {/* Icon */}
              <div 
                className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ 
                  animationName: animationStarted ? 'float' : 'none',
                      animationDuration: '3s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                  animationDelay: `${index * 0.3}s`
                }}
              >
                <span className="text-2xl text-[#7C5CFC]">{capability.icon}</span>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-black text-white mb-3 text-center">
                {capability.title}
              </h3>
              
              {/* Description */}
              <p className="text-zinc-400 text-center">
                {capability.description}
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

export default CopilotAbility;