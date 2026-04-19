"use client";

import React, { useState, useEffect, useRef } from 'react';

const Testimonials = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [animationStarted, setAnimationStarted] = useState(false);
  const sectionRef = useRef(null);
  
  const testimonials = [
    {
      quote: '"Standex provided us with a design and implementation plan for our new external Power App with integrated Power BI reporting. We were very impressed with the knowledge and experience shown by the consultants. The end result was a high performing, well governed and aesthetically pleasing Power App which is being used by our clients today."',
      company: 'UK Insurance Company',
      person: 'Senior Project Manager',
      logo: '/The-Ocean-Logo.webp' // Replace with actual logo path
    },
    {
      quote: '"We work with Standex as our go-to and trusted partner for anything Power BI, or data in general, so much so we recommend them to all our clients! The team always work to first understand what our challenges are, what it is we want to achieve and with their expertise, are able to take us through, in simple terms, what the solution would be. For delivery of data projects or support with our existing data products, the team at Synapx work professionally and efficiently."',
      company: 'Lanware',
      person: 'Chief Technology Officer (CTO)',
      logo: '/The-Ocean-Logo.webp' // Replace with actual logo path
    },
    {
      quote: '"As part of a major business process transformation programme, we were looking to significantly enhance our MI and BI capabilities. Having decided upon the technologies within our technical architecture design, we needed the assistance and expertise from Standex to realise our objectives. Standex performed brilliantly for us, working closely with technical and business stakeholders, and played a pivotal role on the programme."',
      company: 'The Gap Partnership',
      person: 'Head of Technology',
      logo: '/The-Ocean-Logo.webp' // Replace with actual logo path
    }
  ];

  // Update visible count based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detect when section is in view for animations
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

  const handleDotClick = (index: number) => {
    // Ensure we don't go out of bounds with pagination
    const maxStartIndex = Math.max(0, testimonials.length - visibleCount);
    setActiveSlide(Math.min(index, maxStartIndex));
  };

  const handlePrevClick = () => {
    setActiveSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNextClick = () => {
    setActiveSlide((prev) => Math.min(testimonials.length - visibleCount, prev + 1));
  };

  // Calculate which testimonials to show
  const visibleTestimonials = testimonials.slice(activeSlide, activeSlide + visibleCount);

  return (
    <div className="w-full bg-white py-20 px-4 border-t border-zinc-100 relative overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">Client Success</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-zinc-900 leading-[1.1] mb-4">
            Testimonials
          </h2>
          <p className="text-sm sm:text-base font-semibold text-zinc-500 leading-relaxed max-w-2xl px-4">
            We deliver production-grade engineering for leading organizations globally.
          </p>
        </div>
        
        <div className="relative px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`flex flex-col h-full transform transition-all duration-1000 ${
                  animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                <div className="flex-grow bg-white border border-zinc-200 p-8 rounded-[32px] mb-8 relative shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-500 hover:-translate-y-2 group">
                  <div className="absolute top-6 left-6 text-[#7C5CFC]/10 group-hover:text-[#7C5CFC]/20 transition-colors">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="0.5">
                      <path d="M11.0975 1.5H8.50745C4.40745 1.5 2.55745 3.95 2.55745 7.45V16.5H10.0975V8.5H6.59745C6.59745 5.5 7.69745 4.9 9.99745 4.9H11.0975V1.5Z" fill="currentColor"/>
                      <path d="M21.4976 1.5H18.8976C14.7976 1.5 12.9976 3.95 12.9976 7.45V16.5H20.4976V8.5H17.0976C17.0976 5.5 18.1976 4.9 20.4976 4.9H21.4976V1.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="mt-8">
                    <p className="text-zinc-600 font-semibold leading-relaxed">&ldquo;{testimonial.quote.replace(/^"|"$/g, '')}&rdquo;</p>
                  </div>
                </div>
                
                <div className="flex items-center px-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mr-4 border border-zinc-200 p-2 shadow-sm shrink-0">
                    <img 
                      src={testimonial.logo} 
                      alt={`${testimonial.company} logo`} 
                      className="w-full h-full object-contain grayscale opacity-60"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-zinc-900 truncate uppercase tracking-widest">{testimonial.company}</h3>
                    <p className="text-[11px] font-black tracking-tight text-[#7C5CFC] uppercase tracking-[0.15em] mt-0.5">{testimonial.person}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unified Bottom Glow */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-32 bg-violet-100/20 blur-[100px] -z-10" />
      </div>
    </div>
  );
};

export default Testimonials;