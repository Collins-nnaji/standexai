"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Wrench, BookOpen, Briefcase, Shield } from 'lucide-react';

const WhyChooseTraining = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);
  const slidesRef = useRef(null);
  const sectionRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const features = [
    {
      icon: <Wrench className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Access to Tools",
      description: "Get hands-on experience with Power BI, Azure, SQL, and more for one year."
    },
    {
      icon: <Briefcase className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Job References",
      description: "Stand out to employers with real job experience and professional references."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Free Resources",
      description: "Receive textbooks and materials to support your learning journey."
    },
    {
      icon: <Shield className="w-6 h-6 text-[#7C5CFC]" />,
      title: "Microsoft Partnership",
      description: "Learn with the latest tools and resources, ensuring you're prepared for the tech world."
    }
  ];

  // Intersection Observer for animation
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
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

  // Auto slide change with longer duration
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={sectionRef} className="bg-zinc-950 py-16 px-4 w-full">
      <div className="max-w-6xl mx-auto">
        <h2 
          className={`text-3xl font-black text-white tracking-tight text-center mb-2 transform transition-all duration-700 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Why Choose Standex Digital Academy
        </h2>
        <div 
          className={`w-16 h-1 bg-[#7C5CFC] mx-auto mb-12 transform transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        ></div>

        <div 
          className={`relative transform transition-all duration-700 delay-200 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Single card carousel for all devices */}
          <div 
            className="relative w-full overflow-hidden"
            ref={slidesRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {features.map((feature, index) => (
                <div key={index} className="min-w-full">
                  <FeatureCard feature={feature} />
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#7C5CFC]/30 p-2 rounded-full ml-2 hover:bg-[#7C5CFC]/50 transition-colors"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#7C5CFC]/30 p-2 rounded-full mr-2 hover:bg-[#7C5CFC]/50 transition-colors"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Indicator dots */}
          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? 'bg-[#7C5CFC]' : 'bg-[#7C5CFC]/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ feature }: { feature: any }) => {
  return (
    <div className="bg-zinc-900 rounded-lg p-6 shadow-lg flex flex-col items-center mx-auto max-w-sm md:max-w-md border border-zinc-800 hover:border-[#7C5CFC] transition-colors">
      <div className="bg-zinc-800 p-3 rounded-lg mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-black text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-zinc-400 text-center">
        {feature.description}
      </p>
    </div>
  );
};

export default WhyChooseTraining;