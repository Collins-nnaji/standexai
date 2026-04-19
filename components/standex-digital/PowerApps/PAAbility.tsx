"use client";

import React, { useState, useEffect, useRef } from 'react';

const FeatureCard = ({ icon, title, description, delay, isVisible }) => (
  <div 
    className={`flex flex-col items-center text-center bg-zinc-900 rounded-lg p-6 border border-zinc-800 transition-all duration-700 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#7C5CFC25] ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="text-[#7C5CFC] text-4xl mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-black text-white tracking-tight mb-4">{title}</h3>
    <p className="text-sm text-zinc-400">{description}</p>
  </div>
);

const PAAbility = () => {
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

  const features = [
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14,10V4.5L19.5,10M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V9L15,3H5Z" />
      </svg>,
      title: "Leave Request Management",
      description: "Create a customised solution for tracking and managing staff leave requests. Streamline submissions, integrate tracking and approval, and reduce manual administration."
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20,9V15H4V9H20M20,3H4C2.89,3 2,3.89 2,5V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V5C22,3.89 21.1,3 20,3Z" />
      </svg>,
      title: "Workspace Reservation System",
      description: "Develop a bespoke workspace reservation system to allow employees and visitors to easily book meeting rooms and office spaces online. Integrate approval flows for advanced customisation."
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z" />
      </svg>,
      title: "Inventory Management",
      description: "Create a tailored inventory management system to track stock in real-time, automate reordering processes, and provide insightful inventory analytics to efficiently manage your inventory and reduce related risks."
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z" />
      </svg>,
      title: "Expenses Management",
      description: "Utilise Power Apps to build a personalised expenses management tool. Enable easy submission and tracking of expense claims, streamline the approval process and generate comprehensive insights into organisational spending."
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09 20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z" />
      </svg>,
      title: "Task & Project Management",
      description: "Use Power Apps to construct a custom project task management tool. This platform can be tailored to assist in organising, prioritising, and tracking project tasks, enhancing team collaboration and ensuring the successful completion of project goals."
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
      </svg>,
      title: "Bespoke CRM System",
      description: "Develop a Customer Relationship Management system to manage customer interactions, track sales leads, and analyse customer data, providing a comprehensive view of your customer lifecycle and enhancing customer engagement strategies."
    }
  ];

  return (
    <div className="w-full bg-zinc-950 py-16">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4">
        <h1 
          className={`text-4xl font-black tracking-tight text-center text-white mb-4 transform transition-all duration-700 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          What Can Power Apps Do?
        </h1>
        
        <p 
          className={`text-center text-zinc-400 mb-12 max-w-4xl mx-auto transform transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          The possibilities of Power apps are endless. Any need or requirement you have can be met with a custom application built by one of our Power Apps specialists. See some examples of specific use cases below:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={200 + (index * 100)}
              isVisible={animationStarted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PAAbility;