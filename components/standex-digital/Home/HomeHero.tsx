"use client";

import React, { useEffect } from 'react';

const HomeHero = () => {
    const powerPlatformIcons = [
        { name: 'Power BI', src: '/PowerBi.svg' },
        { name: 'Power Apps', src: '/PowerApps.svg' },
        { name: 'Power Automate', src: '/PowerAutomate.svg' },
        { name: 'Power Pages', src: '/PowerPages.svg' },
        { name: 'Power Platform', src: 'PowerPlatform.svg' },
        { name: 'Copilot', src: '/CopilotStudio.svg' }
    ];

    // This will trigger animations after component mounts
    useEffect(() => {
        const animateElements = () => {
            // Animate subtitle with fade in
            const subtitle = document.querySelector('.hero-subtitle');
            if (subtitle) {
                subtitle.classList.add('animate-subtitle');
            }
            
            // Animate heading lines with staggered fade-in
            const headingLines = document.querySelectorAll('.heading-line');
            headingLines.forEach((line, index) => {
                setTimeout(() => {
                    line.classList.add('animate-heading');
                }, 300 + (index * 200));
            });
            
            // Animate button
            const button = document.querySelector('.hero-button');
            if (button) {
                setTimeout(() => {
                    button.classList.add('animate-button');
                }, 800);
            }
            
            // Animate icons with staggered fade-in and floating effect
            const icons = document.querySelectorAll('.platform-icon');
            icons.forEach((icon, index) => {
                setTimeout(() => {
                    icon.classList.add('animate-icon');
                }, 1000 + (index * 150));
            });
        };
        
        // Small delay to ensure DOM is ready
        setTimeout(animateElements, 100);
    }, []);

    return (
        <div 
            className="relative min-h-fit bg-cover bg-center bg-no-repeat pt-32 pb-8 sm:pb-12 md:pb-16 lg:pb-20"
            style={{ backgroundImage: 'url("/TechBng.svg")' }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-[#7C5CFC]/20" />

            {/* Custom animation styles */}
            <style jsx>{`
                .animate-subtitle {
                    animation: fadeIn 0.8s ease forwards;
                }
                
                .heading-line {
                    opacity: 0;
                    transform: translateY(20px);
                }
                
                .animate-heading {
                    animation: slideUp 0.8s ease forwards;
                }
                
                .hero-button {
                    opacity: 0;
                    transform: translateY(20px);
                }
                
                .animate-button {
                    animation: slideUp 0.6s ease forwards;
                }
                
                .platform-icon {
                    opacity: 0;
                    transform: translateY(15px);
                }
                
                .animate-icon {
                    animation-name: fadeInUp, float;
                    animation-duration: 0.5s, 3s;
                    animation-timing-function: ease, ease-in-out;
                    animation-fill-mode: forwards, none;
                    animation-iteration-count: 1, infinite;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInUp {
                    from { 
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>

            {/* Content */}
            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <p className="hero-subtitle opacity-0 mb-5 sm:mb-6 max-w-md mx-auto text-base text-zinc-400 sm:text-lg md:text-xl md:max-w-3xl">
                            Standex | Microsoft Power Platform & Data Specialists 
                        </p>
                        
                        <h1 className="text-4xl font-semibold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                            <span className="heading-line block mb-2 sm:mb-3">Unleash The Power of The</span>
                            <span className="heading-line block">Microsoft Power Platform</span>
                        </h1>
                        
                        {/* Added new subtitle line for "Low Code, High Impact..." */}
                        <p className="mt-6 sm:mt-8 mb-8 sm:mb-10 max-w-lg mx-auto text-base text-zinc-400 sm:text-lg md:text-xl">
                            Low Code, High Impact: Revolutionising Business Solutions for your Industry
                        </p>
                        
                        <div className="mt-6 sm:mt-8 flex justify-center">
                            <div className="rounded-md shadow">
                                <a
                                    href="#"
                                    className="hero-button inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-black rounded-md text-white bg-[#7C5CFC] hover:bg-[#6B4FE0] transition-colors duration-200 md:py-3 md:text-lg md:px-10"
                                >
                                    See How We Can Help →
                                </a>
                            </div>
                        </div>

                        {/* Power Platform Icons */}
                        <div className="mt-12 sm:mt-14 md:mt-16">
                            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10">
                                {powerPlatformIcons.map((icon, index) => (
                                    <div key={icon.name}>
                                        <img
                                            src={icon.src}
                                            alt={icon.name}
                                            className={`platform-icon w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform duration-200 hover:scale-110`}
                                            style={{ animationDelay: `${index * 0.15}s` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeHero;