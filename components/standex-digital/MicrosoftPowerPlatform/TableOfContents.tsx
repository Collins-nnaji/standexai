"use client";

import React, { useState, useEffect, useRef } from 'react';

const TableOfContents = () => {
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

  // Add smooth scroll function
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-zinc-950 py-20 px-4">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* Table of Contents Header */}
        <div 
          className={`mb-12 transform transition-all duration-1000 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-(-20) opacity-0'
          }`}
        >
          <h3 className="text-[#7C5CFC] font-medium text-center mb-4">
            Navigation Guide
          </h3>
          
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight text-center mb-8">Table of Contents</h2>
        </div>
        
        {/* TOC Links */}
        <div 
          className={`mb-12 transform transition-all duration-1000 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <ol className="list-decimal list-inside space-y-2 text-lg text-white">
            <li 
              className={`font-medium transform transition-all duration-700 ${
                animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <a 
                href="#components" 
                onClick={(e) => scrollToSection(e, 'components')} 
                className="hover:text-[#7C5CFC] transition-colors duration-300"
              >
                Components Of The Power Platform
              </a>
              <ol className="list-decimal list-inside ml-8 space-y-2 mt-2">
                <li 
                  className={`text-base transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '350ms' }}
                >
                  <a 
                    href="#power-bi" 
                    onClick={(e) => scrollToSection(e, 'power-bi')} 
                    className="text-zinc-400 hover:text-[#7C5CFC] transition-colors duration-300"
                  >
                    Power BI
                  </a>
                </li>
                <li 
                  className={`text-base transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  <a 
                    href="#power-apps" 
                    onClick={(e) => scrollToSection(e, 'power-apps')} 
                    className="text-zinc-400 hover:text-[#7C5CFC] transition-colors duration-300"
                  >
                    Power Apps
                  </a>
                </li>
                <li 
                  className={`text-base transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '450ms' }}
                >
                  <a 
                    href="#power-automate" 
                    onClick={(e) => scrollToSection(e, 'power-automate')} 
                    className="text-zinc-400 hover:text-[#7C5CFC] transition-colors duration-300"
                  >
                    Power Automate
                  </a>
                </li>
                <li 
                  className={`text-base transform transition-all duration-700 ${
                    animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                  }`}
                  style={{ transitionDelay: '500ms' }}
                >
                  <a 
                    href="#power-pages" 
                    onClick={(e) => scrollToSection(e, 'power-pages')} 
                    className="text-zinc-400 hover:text-[#7C5CFC] transition-colors duration-300"
                  >
                    Power Pages
                  </a>
                </li>
              </ol>
            </li>
            <li 
              className={`font-medium mt-4 transform transition-all duration-700 ${
                animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
              }`}
              style={{ transitionDelay: '550ms' }}
            >
              <a 
                href="#key-features" 
                onClick={(e) => scrollToSection(e, 'key-features')} 
                className="hover:text-[#7C5CFC] transition-colors duration-300"
              >
                Key Features Of The Power Platform
              </a>
            </li>
            <li 
              className={`font-medium transform transition-all duration-700 ${
                animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <a 
                href="#benefits" 
                onClick={(e) => scrollToSection(e, 'benefits')} 
                className="hover:text-[#7C5CFC] transition-colors duration-300"
              >
                Benefits Of The Power Platform
              </a>
            </li>
            <li 
              className={`font-medium transform transition-all duration-700 ${
                animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
              }`}
              style={{ transitionDelay: '650ms' }}
            >
              <a 
                href="#conclusion" 
                onClick={(e) => scrollToSection(e, 'conclusion')} 
                className="hover:text-[#7C5CFC] transition-colors duration-300"
              >
                Conclusion
              </a>
            </li>
          </ol>
        </div>
        
        {/* Description Text */}
        <div 
          className={`text-lg text-zinc-400 mb-12 transform transition-all duration-1000 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <p className="mb-4">
            Microsoft Power Platform is a suite of low-code business solutions/tools developed by Microsoft to help
            businesses <a href="#automate" onClick={(e) => scrollToSection(e, 'automate')} className="text-[#7C5CFC] font-medium hover:text-[#7C5CFC] transition-colors duration-300">automate processes</a>, <a href="#analyse" onClick={(e) => scrollToSection(e, 'analyse')} className="text-[#7C5CFC] font-medium hover:text-[#7C5CFC] transition-colors duration-300">analyse data</a>, and <a href="#develop" onClick={(e) => scrollToSection(e, 'develop')} className="text-[#7C5CFC] font-medium hover:text-[#7C5CFC] transition-colors duration-300">develop custom applications</a>. Businesses can streamline
            their operations using the Power Platform, to reduce manual labour, enhance data-driven decision-making, and
            accelerate business growth.
          </p>
        </div>
        
        {/* Power Platform Icons */}
        <div 
          className={`flex flex-wrap justify-center gap-12 mb-8 transform transition-all duration-1000 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <div 
            className={`flex flex-col items-center transform transition-all duration-500 hover:-translate-y-1 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '850ms' }}
          >
            <div className="bg-zinc-900 rounded-full p-4 mb-3">
              <img src="/PowerApps.svg" alt="Power Apps" className="w-24 h-24" />
            </div>
            <span className="mt-2 text-center text-white">Power Apps</span>
          </div>
          <div 
            className={`flex flex-col items-center transform transition-all duration-500 hover:-translate-y-1 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '900ms' }}
          >
            <div className="bg-zinc-900 rounded-full p-4 mb-3">
              <img src="/PowerPages.svg" alt="Power Pages" className="w-24 h-24" />
            </div>
            <span className="mt-2 text-center text-white">Power Pages</span>
          </div>
          <div 
            className={`flex flex-col items-center transform transition-all duration-500 hover:-translate-y-1 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '950ms' }}
          >
            <div className="bg-zinc-900 rounded-full p-4 mb-3">
              <img src="/PowerAutomate.svg" alt="Power Automate" className="w-24 h-24" />
            </div>
            <span className="mt-2 text-center text-white">Power Automate</span>
          </div>
          <div 
            className={`flex flex-col items-center transform transition-all duration-500 hover:-translate-y-1 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <div className="bg-zinc-900 rounded-full p-4 mb-3">
              <img src="/PowerBi.svg" alt="Power BI" className="w-24 h-24" />
            </div>
            <span className="mt-2 text-center text-white">Power BI</span>
          </div>
        </div>
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

export default TableOfContents;