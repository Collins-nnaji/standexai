"use client";

import React from 'react';

const PowerPagesProcess = () => {
  return (
    <div className="py-16 px-4 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background grid lines - decorative */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px, 50px 50px, 50px 50px',
          backgroundPosition: '0 0, 0 0, 0 0'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading Section */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-6">Our Process</h2>
          <p className="max-w-xl">
            We work closely with you to analyse your processes and come up with a bespoke solution to meet your business's needs.
          </p>
        </div>
        
        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {/* Step 1: Consultation */}
          <div className="relative">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black tracking-tight text-xl mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#7C5CFC] mb-3">Consultation</h3>
                <p>
                  Our Power Pages Specialists will complete an in-depth consultation to understand the user requirements.
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 2: Proposal */}
          <div className="relative">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black tracking-tight text-xl mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#7C5CFC] mb-3">Proposal</h3>
                <p>
                  We work closely with you to develop a user interface that best suits your business needs. Our user-centered design approach incorporates best practice for interface design.
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 3: Implementation */}
          <div className="relative">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black tracking-tight text-xl mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#7C5CFC] mb-3">Implementation</h3>
                <p>
                  We will build the webpage as per the signed-off design, ensuring training and documentation is provided if required. Our quality assurers then undertake extensive testing to ensure the webpage works as expected.
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 4: Delivery */}
          <div className="relative">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black tracking-tight text-xl mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#7C5CFC] mb-3">Delivery</h3>
                <p className="mb-4">
                  The completed solution will be presented to your team, and we'll walk you through how to maximise the potential of your tools.
                </p>
                <p>
                  We'll be on hand to maintain and support your team as well as advise you on how to implement new processes if you need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerPagesProcess;