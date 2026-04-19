"use client";

import React from 'react';

const WhatIsMpp = () => {
  return (
    <div className="bg-[#00253D] text-white py-16 px-4 pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header Text */}
        <div className="text-center mb-8">
          <p className="text-lg mb-2">Power Platform</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">What is Microsoft Power Platform?</h1>
          <p className="max-w-3xl mx-auto text-center mb-8">
            Microsoft Power Platform is a suite of business solutions developed by Microsoft to
            help businesses automate processes, analyse data, and develop custom
            applications. It's particularly useful for businesses where there are multiple
            operations and teams involved.
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <p className="text-zinc-500">Written by</p>
              <p className="font-medium">Matt Davies</p>
            </div>
            <div>
              <p className="text-zinc-500">Published on</p>
              <p className="font-medium">December 1, 2023</p>
            </div>
          </div>
        </div>

        {/* Power Platform Diagram */}
        <div className="flex justify-center my-12">
          <div className="relative w-full max-w-xl aspect-square">
            {/* Center circle - dark blue */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#00253D] border-4 border-[#023D63] rounded-full w-2/5 h-2/5 flex items-center justify-center z-10">
              <div className="text-center text-white font-medium">
                <div>Power</div>
                <div>Platform</div>
                <div>Solutions</div>
              </div>
            </div>
            
            {/* Top circle and path (PowerApps) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4">
              <div className="absolute inset-0 border-4 border-[#D25BB1] rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/PowerApps.svg" alt="Power Apps" className="w-1/2 h-1/2" />
              </div>
            </div>
            <div className="absolute top-[12%] left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 border-4 border-[#D25BB1] rounded-full border-b-0 border-x-0"></div>
            
            {/* Right circle and path (Power BI) */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1/4 h-1/4">
              <div className="absolute inset-0 border-4 border-[#EEA32C] rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/PowerBi.svg" alt="Power BI" className="w-3/4 h-1/2" />
              </div>
            </div>
            <div className="absolute top-1/2 right-[12%] transform -translate-y-1/2 w-1/3 h-1/3 border-4 border-[#EEA32C] rounded-full border-l-0 border-y-0"></div>
            
            {/* Bottom circle and path (Power Pages) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4">
              <div className="absolute inset-0 border-4 border-[#9B7AC7] rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/PowerPages.svg" alt="Power Pages" className="w-1/2 h-1/2" />
              </div>
            </div>
            <div className="absolute bottom-[12%] left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 border-4 border-[#9B7AC7] rounded-full border-t-0 border-x-0"></div>
            
            {/* Left circle and path (Power Automate) */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1/4 h-1/4">
              <div className="absolute inset-0 border-4 border-[#2F8DD8] rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/PowerAutomate.svg" alt="Power Automate" className="w-1/2 h-1/2" />
              </div>
            </div>
            <div className="absolute top-1/2 left-[12%] transform -translate-y-1/2 w-1/3 h-1/3 border-4 border-[#2F8DD8] rounded-full border-r-0 border-y-0"></div>
            
            {/* Additional icons around the diagram - directly from your original code */}
            <div className="absolute top-[10%] left-[10%] text-zinc-400 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div className="absolute bottom-[10%] left-[10%] text-zinc-400 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </div>
            <div className="absolute top-[10%] right-[10%] text-zinc-400 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <div className="absolute bottom-[10%] right-[10%] text-zinc-400 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIsMpp;