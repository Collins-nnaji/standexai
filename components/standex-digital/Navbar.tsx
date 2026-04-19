"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    const menuItems = [
        { title: 'Home', href: '/' },
        { title: 'About', href: '/About' },
        {
            title: 'Power Platform',
            href: '/PowerPlatform',
            items: [
                { name: 'Microsoft Power Platform', href: '/PowerPlatform' },
                { name: 'Power Apps', href: '/PowerApps' },
                { name: 'Power Automate', href: '/PowerAutomate' },
                { name: 'Power BI', href: '/PowerBi' },
                { name: 'Power Pages', href: '/PowerPages' },
                { name: 'Copilot Studio', href: '/CopilotStudio' },
            ]
        },
        { title: 'Training', href: '/Training' },
    ];

    return (
        <nav className={`bg-zinc-950 fixed w-full z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <a href="/" className="flex items-center">
                            <img
                                src="/StandexLogo.webp"
                                alt="Standex Logo"
                                className="h-11 w-auto"
                            />
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <div key={item.title} className="relative group">
                                {item.items ? (
                                    <div className="h-full">
                                        <a
                                            href={item.href}
                                            className="flex items-center text-zinc-300 group-hover:text-[#7C5CFC] px-3 py-2 rounded-md text-base font-medium"
                                        >
                                            {item.title}
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        </a>
                                        {/* Added padding-top for gap and increased specificity of hover */}
                                        <div className="absolute w-60 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                            <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg">
                                                {item.items.map((subItem) => (
                                                    <a
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className="block px-6 py-3 text-base text-zinc-300 hover:text-[#7C5CFC] hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg"
                                                    >
                                                        {subItem.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        href={item.href}
                                        className="text-zinc-300 hover:text-[#7C5CFC] px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        {item.title}
                                    </a>
                                )}
                            </div>
                        ))}
                        {/* Contact Us Button */}
                        <a
                            href="/Contact"
                            className="bg-[#7C5CFC] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#6B4FE0] transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-zinc-900">
                    {menuItems.map((item) => (
                        <div key={item.title}>
                            {item.items ? (
                                <div>
                                    <button
                                        onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                                        className="flex w-full items-center px-4 py-2 text-base font-medium text-zinc-300 hover:text-[#7C5CFC]"
                                    >
                                        {item.title}
                                        <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isMobileServicesOpen && (
                                        <div className="bg-zinc-800">
                                            {item.items.map((subItem) => (
                                                <a
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    className="block px-6 py-2 text-sm text-zinc-300 hover:text-[#7C5CFC]"
                                                >
                                                    {subItem.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <a
                                    href={item.href}
                                    className="text-zinc-300 hover:text-[#7C5CFC] px-4 py-2 text-base font-medium"
                                >
                                    {item.title}
                                </a>
                            )}
                        </div>
                    ))}
                    {/* Mobile Contact Us Button */}
                    <div className="px-4 py-3">
                        <a
                            href="/Contact"
                            className="block w-full text-center bg-[#7C5CFC] text-white px-4 py-2 rounded-md text-base font-medium hover:bg-[#6B4FE0] transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;