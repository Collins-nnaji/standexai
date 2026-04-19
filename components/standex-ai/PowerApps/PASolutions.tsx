"use client";

import React from 'react';

const PASolutions = () => {
  return (
    <div className="w-full relative">
      <div className="flex flex-col md:flex-row">
        {/* Left side with background and text */}
        <div className="md:w-1/2 bg-zinc-950 flex items-center justify-end">
          <div className="py-16 px-8 md:pl-0 md:pr-16 max-w-xl">
            <p className="text-[#7C5CFC] mb-3">Custom App Solutions</p>
            <h2 className="text-4xl font-black text-white tracking-tight mb-8">
              How Can Power Apps<br />
              Help?
            </h2>
            
            <p className="text-white mb-6">
              Microsoft Power Apps offers an innovative, cost-effective alternative to 
              organisations that wish to digitise their business processes. There is no need to 
              compromise on customisability with off-the-shelf solutions which fail to meet 
              bespoke requirements or pay for custom development which is expensive and 
              difficult to maintain.
            </p>
            
            <p className="text-white">
              Power App applications give organisations the ability to quickly launch and roll 
              out an application, and then maximise its potential as needed. Multiple 
              functionalities can be added, application capabilities can be extended, and they 
              can be further customised to suit your requirements as you progress in your 
              journey. This means that your applications never become outdated or obsolete as 
              they evolve with your organisation and connect to new data sources.
            </p>
          </div>
        </div>
        
        {/* Right side with image only */}
        <div className="md:w-1/2">
          <img 
            src="/PA-Solutions.webp" 
            alt="Power Apps solutions for business"
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/800/500?text=Power+Apps+Solutions";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PASolutions;