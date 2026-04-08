"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Individuals",
    price: "£29",
    period: "/ month",
    description: "Learn AI on your own terms",
    features: [
      "Access to all 12+ courses",
      "Full Sandbox Console access",
      "Prompt testing & Agent builder",
      "Community support",
      "Certification of completion",
    ],
    cta: "Join the waitlist",
    href: "/auth/sign-up",
    featured: true,
  },
  {
    name: "Companies",
    price: "Custom",
    period: "",
    description: "Upskill your entire team",
    features: [
      "Custom curriculum design",
      "Live team training sessions",
      "Private Sandbox instances",
      "Enterprise AI implementation",
      "Dedicated account manager",
    ],
    cta: "Contact for pricing",
    href: "/consulting",
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] mb-4"
          >
            Who it's for
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
          >
            Built for individuals and teams
          </motion.h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 rounded-[40px] border ${plan.featured ? "border-[#7C5CFC] bg-[#7C5CFC]/5 shadow-xl shadow-[#7C5CFC]/5" : "border-zinc-100 bg-zinc-50/50"} flex flex-col h-full hover:border-[#7C5CFC]/30 transition-all duration-300`}
            >
              <div className="mb-8">
                <h4 className="text-xl font-black text-zinc-900 mb-2">{plan.name}</h4>
                <p className="text-zinc-500 font-medium text-sm">{plan.description}</p>
              </div>

              <div className="mb-10 flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight text-zinc-900">{plan.price}</span>
                <span className="text-zinc-500 font-bold uppercase text-xs tracking-widest">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-zinc-600 font-medium text-sm">
                    <div className="h-5 w-5 rounded-full bg-white border border-zinc-100 flex items-center justify-center text-[#7C5CFC] flex-shrink-0">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`flex h-16 items-center justify-center gap-3 rounded-2xl transition-all active:scale-95 text-xs font-black uppercase tracking-widest ${
                  plan.featured 
                    ? "bg-zinc-900 text-white hover:bg-[#7C5CFC] shadow-xl shadow-[#7C5CFC]/10" 
                    : "bg-white border-2 border-zinc-200 text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
