"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BarChart, Brain, Cog, Building, Cloud, Code, Database, BarChart2, Shield, Terminal } from 'lucide-react';

const TrainingCareer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Intersection Observer for animation
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

  const careerData = [
    {
      icon: <Brain className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Artificial Intelligence Practitioner",
      description: "Design and deploy AI solutions with governance, security, and measurable business outcomes.",
      salary: "£55,000 - £100,000"
    },
    {
      icon: <Database className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Machine Learning / MLOps Engineer",
      description: "Operationalise ML and GenAI systems with monitoring, risk controls, and reliability practices.",
      salary: "£60,000 - £105,000"
    },
    {
      icon: <BarChart className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Business Intelligence Analyst",
      description: "Deliver Power BI insights, dashboards, and data models that inform executive decisions.",
      salary: "£40,000 - £75,000"
    },
    {
      icon: <Cog className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Power Platform Developer",
      description: "Build enterprise Power Apps and automate workflows end to end across Dataverse and SQL.",
      salary: "£45,000 - £85,000"
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Power BI Specialist",
      description: "Model data, craft DAX, and publish secure analytics for stakeholders at scale.",
      salary: "£45,000 - £80,000"
    },
    {
      icon: <Terminal className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Low-Code/No-Code Solutions Consultant",
      description: "Lead low-code adoption, build copilots, and integrate apps, flows, and data for business users.",
      salary: "£50,000 - £90,000"
    }
  ];

  const totalSlides = careerData.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      nextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      prevSlide();
    }
  };

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <h2 
          className={`text-3xl font-black tracking-tight text-center text-white mb-8 transform transition-all duration-700 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Career Prospects & Salary Ranges
        </h2>

        {/* Desktop View - 3 cards at a time, centered on current card */}
        <div 
          className={`hidden md:block relative transform transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          ref={sliderRef}
        >
          <div className="relative overflow-hidden px-16">
            <div className="flex justify-center gap-6">
              {(() => {
                // Find indices for the 3 visible cards
                const prevIndex = currentSlide === 0 ? careerData.length - 1 : currentSlide - 1;
                const nextIndex = currentSlide === careerData.length - 1 ? 0 : currentSlide + 1;
                
                return [
                  <div key="prev" className="w-full max-w-sm opacity-60 transition-all">
                    <CareerCard career={careerData[prevIndex]} />
                  </div>,
                  <div key="current" className="w-full max-w-sm z-10 transform scale-105 shadow-lg transition-all">
                    <CareerCard career={careerData[currentSlide]} />
                  </div>,
                  <div key="next" className="w-full max-w-sm opacity-60 transition-all">
                    <CareerCard career={careerData[nextIndex]} />
                  </div>,
                ];
              })()}
            </div>
            
            {/* Navigation arrows */}
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-900 p-2 rounded-full shadow-md hover:bg-zinc-800 z-20 transition-colors"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-[#7C5CFC]" />
            </button>
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-900 p-2 rounded-full shadow-md hover:bg-zinc-800 z-20 transition-colors"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-[#7C5CFC]" />
            </button>
          </div>
        </div>

        {/* Mobile View - 1 card at a time with touch swipe */}
        <div 
          className={`md:hidden relative transform transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative overflow-hidden px-12">
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <CareerCard career={careerData[currentSlide]} />
              </div>
            </div>
            
            {/* Navigation arrows */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-zinc-900 p-2 rounded-full shadow-md hover:bg-zinc-800 transition-colors"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-[#7C5CFC]" />
            </button>
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-900 p-2 rounded-full shadow-md hover:bg-zinc-800 transition-colors"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-[#7C5CFC]" />
            </button>
          </div>
        </div>

        {/* Indicator dots */}
        <div 
          className={`flex justify-center gap-2 mt-8 transform transition-all duration-700 delay-200 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? 'bg-[#7C5CFC]' : 'bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const CareerCard = ({ career }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-[#7C5CFC] rounded-lg p-6 w-full max-w-sm transition-all duration-300">
      <div className="mb-4 text-[#7C5CFC]">
        {career.icon}
      </div>
      <h3 className="text-xl font-black text-white mb-2">
        {career.title}
      </h3>
      <p className="text-zinc-400 mb-4">
        {career.description}
      </p>
      <div className="pt-4 border-t border-zinc-800">
        <h4 className="font-medium text-zinc-400 mb-1">Annual Salary</h4>
        <p className="text-[#7C5CFC] font-medium">{career.salary}</p>
      </div>
    </div>
  );
};

export default TrainingCareer;