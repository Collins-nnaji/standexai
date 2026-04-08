"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Microscope, Target } from "lucide-react";

const features = [
  {
    title: "Applied from day one",
    description: "No fluff, no theory overload. Every lesson teaches you something you can use immediately — prompting, automations, agents, websites.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Live sandbox console",
    description: "Test prompts, run agents, and experiment in real-time — directly inside the platform. Learn by doing, not watching.",
    icon: Microscope,
    color: "text-[#7C5CFC]",
    bg: "bg-[#7C5CFC]/10",
  },
  {
    title: "Expert-led implementation",
    description: "Need help beyond the course? We implement AI for your business directly — strategy, tools, training, and deployment.",
    icon: Target,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function WhatMakesItDifferent() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] mb-4">What makes it different</h2>
          <h3 className="text-4xl font-black tracking-tight text-zinc-900 md:text-5xl lg:text-6xl max-w-2xl">
            Three things no other platform does together
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="p-8 rounded-3xl border border-zinc-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                <feature.icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <h4 className="text-xl font-black text-zinc-900 mb-3">{feature.title}</h4>
              <p className="text-zinc-500 leading-relaxed font-medium text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
