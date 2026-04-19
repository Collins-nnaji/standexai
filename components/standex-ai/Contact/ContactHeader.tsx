"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const ContactHeader = () => {
  return (
    <section className="w-full bg-zinc-950 text-white pt-28 pb-20 mt-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#7C5CFC]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C5CFC]">Strategic Engagement</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black tracking-tight leading-tight mb-10"
        >
          Engineering <br /> Intake.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl font-medium text-zinc-400 max-w-3xl mb-12"
        >
          Begin your transition to an AI-first operating model. 
          Our diagnostic approach identifies high-leverage automation opportunities 
          across your enterprise stack.
        </motion.p>
      </div>
    </section>
  );
};

export default ContactHeader;