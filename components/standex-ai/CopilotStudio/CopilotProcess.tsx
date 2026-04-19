"use client";

import React from 'react';

const CopilotProcess = () => {
  // Define the process steps
  const processSteps = [
    {
      id: 1,
      title: 'Discovery',
      description: 'We start with a comprehensive discovery phase, where we work with you to understand your business, your target personas, and identify which departments will benefit most from AI copilots.'
    },
    {
      id: 2,
      title: 'Mapping',
      description: 'Next, we build out the knowledgebase and structure. This involves mapping out the necessary information, data sources, and processes that the copilot will need to access to provide accurate and relevant responses.'
    },
    {
      id: 3,
      title: 'Development & Build',
      description: 'We create a virtual agent that will effectively complete the task required. Our team designs and develops your AI copilot tailored to your specific requirements. We ensure it is equipped to handle the tasks identified in the discovery and mapping phases.'
    },
    {
      id: 4,
      title: 'Integration',
      description: 'Finally, we integrate the copilot with your existing systems and platforms, ensuring smooth and efficient operation within your business environment.'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-zinc-950 to-zinc-900 text-white relative overflow-hidden">
      {/* Background graphic lines - simplified representation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-full h-full border-t border-zinc-700"></div>
        <div className="absolute w-full h-full border-b border-zinc-700"></div>
        <div className="absolute w-full h-full border-l border-zinc-700 transform -rotate-45"></div>
        <div className="absolute w-full h-full border-r border-zinc-700 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main heading and intro */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-6">
              Our Process
            </h2>
            
            <p className="text-[#7C5CFC] mb-6">
              We work closely with you to analyse your processes and come up with a bespoke solution to meet your business's needs. With development times from 1-4 weeks, we can work with you to deploy your AI Copilots when you need them.
            </p>
          </div>
          
          {/* Right column - Process steps */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processSteps.map((step) => (
                <div key={step.id} className="mb-8">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mr-3">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7C5CFC] text-zinc-900 font-black tracking-tight text-xl">
                        {step.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#7C5CFC]">
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-white ml-13 pl-13">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CopilotProcess;