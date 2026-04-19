"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const TrainingCourses = () => {
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

  const courses = [
    {
      id: 'ai-practitioner',
      title: 'Standex Certified Artificial Intelligence Practitioner',
      description: 'Design, deploy, and govern AI systems end-to-end: strategy, architecture, ML, generative AI, security, ethics, and applied capstone delivery.',
      image: '/ArtificialIntelligence.png',
      enrollLink: 'https://buy.stripe.com/bIYaGJeDe0X47gQ5kn',
      duration: '12 weeks (part-time)',
      format: 'Online'
    },
    {
      id: 'power-platform-bi',
      title: 'Standex Certified Power Platform & Business Intelligence Practitioner',
      description: 'Build enterprise-ready apps, automate workflows, model data, and deliver Power BI analytics with SQL, Dataverse, and Copilot Studio.',
      image: '/PowerPlatform.png',
      enrollLink: 'https://buy.stripe.com/bIY1693YAcFMbx66os',
      duration: '12 weeks (part-time)',
      format: 'Online'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <h2 
          className={`text-3xl font-black tracking-tight text-center text-white mb-12 transform transition-all duration-700 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Our Courses
        </h2>

        <div className="space-y-12">
          {courses.map((course, index) => (
            <div 
              key={course.id}
              className={`transform transition-all duration-700 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${100 + index * 150}ms` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CourseCard = ({ course }: { course: any }) => {
  return (
    <div className="flex flex-col md:flex-row bg-zinc-900 rounded-lg overflow-hidden shadow-md border border-zinc-800 hover:border-[#7C5CFC] transition-colors duration-300">
      {/* Course Image/Flyer (Left Side) */}
      <div className="md:w-1/2 relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Course Description and Call to Action (Right Side) */}
      <div className="md:w-1/2 p-6 flex flex-col">
        <h3 className="text-xl font-black text-white mb-4">
          {course.title}
        </h3>
        
        <p className="text-zinc-400 mb-8">
          {course.description}
        </p>
        
        <div className="mt-auto space-y-3">
          <a 
            href={course.enrollLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#7C5CFC] hover:bg-[#6B4FE0] text-white px-4 py-3 rounded transition duration-150 text-center"
          >
            Enroll Now →
          </a>
          <Link 
            href={`/courses/${course.id}`}
            className="block w-full bg-[#7C5CFC] hover:bg-[#25a936] text-white px-4 py-3 rounded transition duration-150 text-center"
          >
            View Course Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainingCourses;