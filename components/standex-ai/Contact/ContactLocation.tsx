"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Mail, Linkedin, Twitter, Globe, Send, MessageSquare } from 'lucide-react';

const ContactLocation = () => {
  return (
    <section className="bg-white py-24 px-6 lg:px-12 relative overflow-hidden" id="strategy-intake">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Side: Contact Info */}
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-950 leading-[0.9] mb-8">
              Let's Engineer <br /> Your Future.
            </h2>
            <p className="text-base font-semibold text-zinc-500 leading-relaxed mb-12 max-w-md">
              Secure a consultation with our strategy and engineering team to audit your current 
              architecture and define your AI transition roadmap.
            </p>

            <div className="grid grid-cols-1 gap-4 mb-12">
              <a href="mailto:support@standexdigital.com" className="flex items-center gap-4 group p-4 rounded-2xl border border-zinc-100 hover:border-[#7C5CFC] transition-all">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 group-hover:bg-[#7C5CFC]/10 transition-colors">
                  <Mail className="h-5 w-5 text-zinc-400 group-hover:text-[#7C5CFC]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Direct Protocol</span>
                  <span className="text-sm font-bold text-zinc-900 group-hover:text-[#7C5CFC]">support@standexdigital.com</span>
                </div>
              </a>
              <a href="https://linkedin.com/company/standex-ai" className="flex items-center gap-4 group p-4 rounded-2xl border border-zinc-100 hover:border-[#7C5CFC] transition-all">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 group-hover:bg-[#7C5CFC]/10 transition-colors">
                  <Linkedin className="h-5 w-5 text-zinc-400 group-hover:text-[#7C5CFC]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Professional Network</span>
                  <span className="text-sm font-bold text-zinc-900 group-hover:text-[#7C5CFC]">Standex Digital</span>
                </div>
              </a>
            </div>

            <div className="p-8 rounded-[32px] bg-zinc-950 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <Globe className="h-5 w-5 text-[#7C5CFC]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFC]">Global Operations</span>
                 </div>
                 <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">London, UK</h3>
                 <p className="text-sm font-medium text-zinc-400">Serving global enterprise clients from the heart of tech innovation.</p>
               </div>
               <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-[#7C5CFC]/20 blur-[50px] pointer-events-none" />
            </div>
          </div>

          {/* Right Side: Intake Form */}
          <div className="bg-zinc-50 rounded-[40px] border border-zinc-200 p-8 md:p-12 shadow-sm">
             <div className="flex items-center gap-3 mb-10">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#7C5CFC]/10 text-[#7C5CFC]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black uppercase italic text-zinc-950 tracking-tight">Diagnostic Intake</h3>
             </div>

             <form className="space-y-6" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Full Name</label>
                     <input type="text" placeholder="John Doe" className="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20 focus:border-[#7C5CFC] transition-all" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Corporate Email</label>
                     <input type="email" placeholder="john@enterprise.com" className="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20 focus:border-[#7C5CFC] transition-all" />
                   </div>
                </div>

                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Solution Focus</label>
                   <select className="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20 focus:border-[#7C5CFC] transition-all appearance-none cursor-pointer">
                      <option>AI Agents & Swarms</option>
                      <option>Enterprise AI Integration</option>
                      <option>Power Platform Strategy</option>
                      <option>Digital Engineering Consult</option>
                   </select>
                </div>

                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Project Brief</label>
                   <textarea rows={4} placeholder="Briefly describe your engineering challenges..." className="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20 focus:border-[#7C5CFC] transition-all resize-none"></textarea>
                </div>

                <button className="w-full flex items-center justify-center gap-3 bg-zinc-950 text-white p-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl">
                   Transmit Request <Send className="h-4 w-4" />
                </button>
             </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactLocation;