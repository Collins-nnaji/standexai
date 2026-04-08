"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Send, Bot, Workflow, Layout } from "lucide-react";

const features = [
  {
    title: "Prompt testing",
    description: "Write, refine, and compare prompts live — see outputs instantly",
    icon: Send,
  },
  {
    title: "Agent builder",
    description: "Configure and run AI agents step by step with guided templates",
    icon: Bot,
  },
  {
    title: "Workflow simulator",
    description: "Connect tools and APIs, simulate automation runs before deploying",
    icon: Workflow,
  },
  {
    title: "Web builder",
    description: "Use AI to generate and edit websites — see it happen in real time",
    icon: Layout,
  },
];

export function SandboxPreview() {
  return (
    <section className="py-24 bg-zinc-900 border-y border-zinc-800 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[#7C5CFC]/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] mb-4 text-left">The sandbox</h2>
            <h3 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl mb-8">
              Your AI lab — inside every lesson
            </h3>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed mb-12 max-w-xl">
              Don't just watch videos. Practice what you learn in our integrated Sandbox Console. It's pre-configured with the latest models and tools so you can start building immediately.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#7C5CFC]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-tight">{feature.title}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Mockup of the Sandbox Console */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-black shadow-2xl overflow-hidden aspect-[4/3] flex flex-col"
            >
              <div className="h-10 border-b border-white/10 bg-zinc-900 px-4 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                </div>
                <div className="ml-4 h-6 px-3 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                  <Terminal className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] font-mono text-zinc-400">sandbox_console v1.0.4</span>
                </div>
              </div>

              <div className="flex-1 p-6 font-mono text-sm">
                <div className="flex gap-3 mb-4">
                  <span className="text-[#7C5CFC]">➜</span>
                  <span className="text-zinc-500">Initialize AI Agent...</span>
                </div>
                <div className="flex gap-3 mb-6">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-300">Agent "Standex-01" ready. Model: GPT-4o</span>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
                  <p className="text-zinc-400 mb-2">Defining system prompt:</p>
                  <p className="text-[#7C5CFC]">"You are an expert AI automation architect. Help me design a workflow that connects my CRM to Slack using n8n..."</p>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="h-2 w-2 rounded-full bg-[#7C5CFC] animate-pulse" />
                  <span className="text-zinc-500 italic">Thinking...</span>
                </div>
                
                {/* Visualizing a workflow step */}
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#7C5CFC] flex items-center justify-center text-white">
                    <Send className="h-6 w-6" />
                  </div>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-[#7C5CFC] to-blue-500" />
                  <div className="h-12 w-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400">
                    <Bot className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
