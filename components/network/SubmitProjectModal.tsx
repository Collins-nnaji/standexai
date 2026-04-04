"use client";

import React, { useState } from "react";
import { Plus, Send, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubmitProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DOMAINS = [
  "NLP & LLMs",
  "Computer Vision",
  "Robotics",
  "Reinforcement Learning",
  "Audio & Speech",
  "AI Safety",
  "Biology & Healthcare",
  "Finance"
];

export function SubmitProjectModal({ isOpen, onOpenChange }: SubmitProjectModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lookingFor: "",
    domain: [] as string[],
    budget: "",
    contactEmail: ""
  });

  const toggleDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      domain: prev.domain.includes(domain)
        ? prev.domain.filter(d => d !== domain)
        : [...prev.domain, domain]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => onOpenChange(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 cursor-default">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[48px] border border-white bg-[#FAFAF9] shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 sm:p-12">
          {!submitted ? (
            <>
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/10 bg-white px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#7C5CFC] shadow-sm">
                  Managed Project
                </div>
                <h2 className="font-syne text-3xl font-black text-zinc-900 leading-tight">Initialize Research Brief</h2>
                <p className="mt-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Step {step} of 2 — {step === 1 ? "Objectives" : "Requirements"}
                </p>
              </div>

              <div className="min-h-[380px]">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Project Title</label>
                          <input 
                            placeholder="e.g. Fine-tuning Llama-3 for Medical Reasoning"
                            className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all shadow-sm"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Abstract & Technical Goal</label>
                          <textarea 
                            placeholder="Describe the problem you are solving..."
                            rows={4}
                            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all shadow-sm"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Target Domains</label>
                          <div className="flex flex-wrap gap-2">
                            {DOMAINS.map((domain) => (
                              <button
                                key={domain}
                                onClick={() => toggleDomain(domain)}
                                className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border ${
                                  formData.domain.includes(domain)
                                    ? "bg-[#7C5CFC] border-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/20"
                                    : "bg-white border-zinc-200 text-zinc-400 hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC]"
                                }`}
                              >
                                {domain}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Specific Requirements (Looking for...)</label>
                          <textarea 
                            placeholder="e.g. PhD in NLP, experience with JAX, 10+ publications..."
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all shadow-sm"
                            value={formData.lookingFor}
                            onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Est. Budget / Terms</label>
                            <input 
                              placeholder="$5k - $15k / Retainer"
                              className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all shadow-sm"
                              value={formData.budget}
                              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Contact Email</label>
                            <input 
                              placeholder="you@lab.com"
                              type="email"
                              className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all shadow-sm"
                              value={formData.contactEmail}
                              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-12 flex items-center justify-between border-t border-zinc-100 pt-8">
                <button 
                  onClick={step === 1 ? onClose : () => setStep(1)}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {step === 1 ? "Cancel" : "Back to Start"}
                </button>
                
                <div className="flex items-center gap-4">
                  {step === 1 ? (
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!formData.title || !formData.description}
                      className="group flex items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-zinc-900/10 transition-all hover:bg-[#7C5CFC] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Define Requirements <Plus className="h-4 w-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      disabled={loading || !formData.contactEmail}
                      className="flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-[#7C5CFC]/20 transition-all hover:bg-[#6042db] active:scale-95 disabled:opacity-50"
                    >
                      {loading ? "Initializing..." : "Launch Submission"} <Send className="h-4 w-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center"
            >
              <div className="mb-8 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
              </div>
              <h2 className="font-syne text-4xl font-black text-zinc-900 mb-4">Brief Initialized.</h2>
              <p className="mx-auto max-w-sm text-sm font-medium text-zinc-400 leading-relaxed mb-10">
                Your managed project is now in our verification queue. Our team will review the requirements and contact you at <span className="text-zinc-900 font-bold">{formData.contactEmail}</span> to begin the matching process.
              </p>
              <button 
                onClick={onClose}
                className="rounded-2xl bg-zinc-900 px-12 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-zinc-900/10 transition-all hover:bg-[#7C5CFC] active:scale-95"
              >
                Back to Projects
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
