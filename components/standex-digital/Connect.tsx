"use client";

import React, { useState, useEffect, useRef } from 'react';

const Connect = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [animationStarted, setAnimationStarted] = useState(false);
  const sectionRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      fullName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  // Detect when section is in view for animations
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
    <div id="contact-form" className="w-full py-16 px-4 bg-zinc-950">
      <div ref={sectionRef} className="max-w-3xl mx-auto">
        <h1 
          className={`text-4xl font-black tracking-tight text-center mb-4 text-white transform transition-all duration-700 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Connect With Our Team
        </h1>
        <p 
          className={`text-center text-zinc-400 mb-12 transform transition-all duration-700 delay-100 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Have questions about our services, facilities, or training programs? Reach out to us 
          and our team will be happy to assist you.
        </p>

        <div 
          className={`bg-zinc-900 p-8 rounded-lg border border-gray-700 shadow-lg transform transition-all duration-700 delay-200 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-2xl font-black tracking-tight mb-6 text-white">Send Us a Message</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div 
                className={`transform transition-all duration-500 ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-(-10) opacity-0'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                <label htmlFor="fullName" className="block text-gray-200 mb-2">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C5CFC] text-white placeholder-gray-400"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div 
                className={`transform transition-all duration-500 ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <label htmlFor="email" className="block text-gray-200 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C5CFC] text-white placeholder-gray-400"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div 
              className={`mb-6 transform transition-all duration-500 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <label htmlFor="subject" className="block text-gray-200 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter subject"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C5CFC] text-white placeholder-gray-400"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div 
              className={`mb-8 transform transition-all duration-500 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <label htmlFor="message" className="block text-gray-200 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                rows="6"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C5CFC] text-white placeholder-gray-400"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div
              className={`transform transition-all duration-500 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#7C5CFC] text-white font-medium rounded-md hover:bg-[#6B4FE0] transition-all hover:scale-[1.02] transform duration-200"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Connect;