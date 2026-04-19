"use client";

import React, { useState, useEffect, useRef } from 'react';

const PowerPlatformSections = () => {
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

  return (
    <div className="bg-zinc-950 py-20 px-4">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* Components Section */}
        <section id="components" className="mb-16">
          <div 
            className={`mb-12 transform transition-all duration-1000 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-(-20) opacity-0'
            }`}
          >
            <h3 className="text-[#7C5CFC] font-medium mb-4">
              Microsoft Solutions
            </h3>
            
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">Components Of The Power Platform</h2>
            
            <p className="text-lg text-zinc-400 mb-8">
              There are 4 key components that make up the Power Platform that are powerful individually and even better
              when used together.
            </p>
          </div>

          {/* Power BI Section */}
          <div 
            id="power-bi" 
            className={`mb-16 transform transition-all duration-1000 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="text-2xl font-black tracking-tight text-[#7C5CFC] mb-4">Power BI</h3>
            <p className="text-lg text-zinc-400 mb-4">
              <span className="text-white font-medium">Power BI</span> is a business analytics tool that allows users to visualise and analyse data from various sources,
              enhancing decision-making processes across an organisation. The ability to integrate with over 300 built-in
              connectors enables Power BI to gather data from a wide range of systems and services, including sales,
              inventory, and customer interactions, among others. This facilitates the creation of interactive dashboards and
              reports that can visually communicate trends, insights, and patterns within the data, making it accessible and
              understandable for stakeholders at all levels of the organisation.
            </p>

            <div className="mb-6">
              <h4 className="text-xl font-black text-white tracking-tight mb-3">Usefulness and Benefits</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li 
                  className={`text-lg text-zinc-400 transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '300ms' }}
                >
                  Data Visualisation: Converts complex data into easy-to-understand visual formats.
                </li>
                <li 
                  className={`text-lg text-zinc-400 transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  Real-Time Analytics: Provides real-time insights into business performance.
                </li>
              </ul>
            </div>

            <div 
              className={`rounded-lg overflow-hidden mb-8 max-w-4xl mx-auto transform transition-all duration-1000 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="relative">
                {/* Subtle glow effect behind the image */}
                <div 
                  className={`absolute inset-0 bg-[#7C5CFC] opacity-0 blur-xl rounded-lg transition-all duration-1500 ${
                    animationStarted ? 'opacity-5' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: '600ms' }}
                ></div>
                
                <img 
                  src="/MPPPowerBi.webp" 
                  alt="Power BI dashboard on a laptop" 
                  className="w-full h-auto max-h-96 object-contain relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Power Apps Section */}
          <div 
            id="power-apps" 
            className={`mb-16 transform transition-all duration-1000 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '700ms' }}
          >
            <h3 className="text-2xl font-black tracking-tight text-[#7C5CFC] mb-4">Power Apps</h3>
            <p className="text-lg text-zinc-400 mb-4">
              <span className="text-white font-medium">Power Apps</span> allows you to build custom apps with little to no code. You can develop apps that meet specific
              business needs, like an app for inventory management in your convenience stores, or a customer feedback app
              for your business. These apps can be used on smartphones, tablets, and browsers, making them accessible to
              your teams on the go.
            </p>

            <div className="mb-6">
              <h4 className="text-xl font-black text-white tracking-tight mb-3">Usefulness and Benefits</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li 
                  className={`text-lg text-zinc-400 transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '800ms' }}
                >
                  Customisation: Tailor apps to specific business needs without extensive coding.
                </li>
                <li 
                  className={`text-lg text-zinc-400 transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '900ms' }}
                >
                  Agility: Rapid development and deployment of solutions.
                </li>
              </ul>
            </div>
          </div>

          {/* Power Automate Section */}
          <div 
            id="power-automate" 
            className={`mb-16 transform transition-all duration-1000 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <h3 className="text-2xl font-black tracking-tight text-[#7C5CFC] mb-4">Power Automate</h3>
            <p className="text-lg text-zinc-400 mb-4">
              <span className="text-white font-medium">Power Automate</span> helps automate workflows and tasks across various applications. For instance, you can set up
              a workflow that automatically reorders stock when it falls below a certain level, or one that sends a weekly sales
              report to your team. It helps reduce manual tasks and improves your organisation's overall efficiency with less
              scope for human error and more time to focus on high-value tasks.
            </p>

            <div className="mb-6">
              <h4 className="text-xl font-black text-white tracking-tight mb-3">Usefulness and Benefits</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li 
                  className={`text-lg text-zinc-400 transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '1100ms' }}
                >
                  Efficiency: Automates repetitive tasks, saving time and reducing errors.
                </li>
                <li 
                  className={`text-lg text-zinc-400 transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '1200ms' }}
                >
                  Workflow Optimisation: Streamlines business processes.
                </li>
              </ul>
            </div>

            <div 
              className={`rounded-lg overflow-hidden mb-8 max-w-4xl mx-auto transform transition-all duration-1000 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '1300ms' }}
            >
              <div className="relative">
                {/* Subtle glow effect behind the image */}
                <div 
                  className={`absolute inset-0 bg-[#7C5CFC] opacity-0 blur-xl rounded-lg transition-all duration-1500 ${
                    animationStarted ? 'opacity-5' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: '1400ms' }}
                ></div>
                
                <img 
                  src="/MPPPowerAutomate.webp" 
                  alt="Power Automate workflow on laptop and mobile" 
                  className="w-full h-auto max-h-96 object-contain relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Power Pages Section */}
          <div 
            id="power-pages" 
            className={`mb-16 transform transition-all duration-1000 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '1500ms' }}
          >
            <h3 className="text-2xl font-black tracking-tight text-[#7C5CFC] mb-4">Power Pages</h3>
            <p className="text-lg text-zinc-400 mb-4">
              <span className="text-white font-medium">Power Pages</span> is a component of the Power Platform focused on building and deploying low-code, secure, and
              scalable business websites. Power Pages can be used to create a professional web presence for your business.
              You can design websites for online services, customer engagement, or information sharing about your
              organisation. These websites can integrate seamlessly with your other Power Platform tools, enhancing your
              overall digital strategy.
            </p>

            <div className="mb-6">
              <h4 className="text-xl font-black text-white tracking-tight mb-3">Usefulness and Benefits</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li 
                  className={`text-lg text-zinc-400 transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '1600ms' }}
                >
                  Web Presence: Easily create professional-looking websites.
                </li>
                <li 
                  className={`text-lg text-zinc-400 transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '1700ms' }}
                >
                  Integration: Seamlessly integrate with other Power Platform tools and data sources.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Empty sections with IDs to maintain anchor functionality */}
        <div id="key-features" className="hidden"></div>
        <div id="benefits" className="hidden"></div>
        <div id="conclusion" className="hidden"></div>

        {/* Specific anchor points for the inline links */}
        <div id="automate" className="hidden"></div>
        <div id="analyse" className="hidden"></div>
        <div id="develop" className="hidden"></div>
      </div>

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
    </div>
  );
};

export default PowerPlatformSections;