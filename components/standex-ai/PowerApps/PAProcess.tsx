"use client";

import React from 'react';

const ProcessStep = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="mb-12">
    <div className="flex items-center mb-4">
      <div className="text-2xl font-black tracking-tight text-teal-400 mr-3">{number}</div>
      <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
    </div>
    <p className="text-white text-sm leading-relaxed">{description}</p>
  </div>
);

const PAProcess = () => {
  return (
    <div className="bg-zinc-950 py-16 relative overflow-hidden">
      {/* Background wave pattern - simplified representation */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,128L48,154.7C96,181,192,235,288,250.7C384,267,480,245,576,234.7C672,224,768,224,864,213.3C960,203,1056,181,1152,197.3C1248,213,1344,267,1392,293.3L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" 
            fill="#ffffff" fillOpacity="0.2">
          </path>
          <path d="M0,96L48,112C96,128,192,160,288,181.3C384,203,480,213,576,213.3C672,213,768,203,864,197.3C960,192,1056,192,1152,186.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" 
            fill="#ffffff" fillOpacity="0.1">
          </path>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="col-span-1 md:pr-8">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-6">Our Process</h2>
            <p className="text-white mb-4">
              Our Power Apps team will work closely with you to come up with a bespoke application to meet your business's needs.
            </p>
          </div>
          
          <div className="col-span-1">
            <ProcessStep 
              number="1"
              title="Consultation"
              description="Our Power App Consultants will complete an in-depth consultation to understand the current business process and systems in place to complete a task or service. If you are unsure where productivity can be improved within your organisation, our experienced consultants can collaborate with your team to find out limitations and develop a solution to increase business efficiency."
            />
          </div>
          
          <div className="col-span-1">
            <ProcessStep 
              number="2"
              title="Proposal"
              description="A custom solution will be presented to your team taking into consideration efficiency, time scale, cost-effectiveness, and your project goals."
            />
          </div>
          
          <div className="col-span-1">
            <ProcessStep 
              number="3"
              title="Implementation"
              description="Our Power App developers will build a custom application to upgrade your current business process. We will develop a framework to empower users to identify opportunities for growth and develop solutions quickly and securely."
            />
          </div>
          
          <div className="col-span-1">
            <ProcessStep 
              number="4"
              title="Delivery"
              description="We will train your staff on how to use the new application to make the most out of the new app. Our specialists will provide hands-on practical experience to ensure a smooth handover process."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PAProcess;