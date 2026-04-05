"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, ChevronRight, Building, Mail, User } from "lucide-react";
import { toast } from "sonner";

export function ManagedProjectForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      companyName: formData.get("companyName"),
      contactName: formData.get("contactName"),
      email: formData.get("email"),
      description: formData.get("description"),
      budgetRange: formData.get("budgetRange"),
      timeline: formData.get("timeline"),
    };

    try {
      const res = await fetch("/api/managed-request", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Implementation request received.");
      } else {
        toast.error("Submission failed. Please check your data.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-20 text-center animate-in fade-in scale-in duration-700">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mb-8 border border-emerald-500/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h3 className="font-syne text-3xl font-black text-white mb-4">Request Transmitted</h3>
        <p className="text-zinc-500 font-medium">A Standex Solution Architect will contact you within 48 hours to discuss your squad allocation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <div className="space-y-6">
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Company Name</label>
           <Input 
             name="companyName" 
             required 
             placeholder="ENTERPRISE CORP"
             className="bg-white/5 border-zinc-800 h-14 rounded-2xl border transition-all focus:border-[#7C5CFC]/50 hover:border-zinc-700 text-white font-medium text-sm"
           />
        </div>
        
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Full Name</label>
           <Input 
             name="contactName" 
             required 
             placeholder="LEAD ARCHITECT"
             className="bg-white/5 border-zinc-800 h-14 rounded-2xl border transition-all focus:border-[#7C5CFC]/50 hover:border-zinc-700 text-white font-medium text-sm"
           />
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Email Address</label>
           <Input 
             name="email" 
             type="email"
             required 
             placeholder="name@company.com"
             className="bg-white/5 border-zinc-800 h-14 rounded-2xl border transition-all focus:border-[#7C5CFC]/50 hover:border-zinc-700 text-white font-medium text-sm"
           />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Implementation Details</label>
           <Textarea 
             name="description" 
             required 
             placeholder="Briefly describe your AI implementations goals (e.g. Production RAG, Multi-Agent workflow, Scale)..."
             className="bg-white/5 border-zinc-800 rounded-2xl border transition-all focus:border-[#7C5CFC]/50 hover:border-zinc-700 text-white font-medium text-sm min-h-[140px]"
           />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Estimated Budget</label>
             <select name="budgetRange" className="w-full h-14 bg-white/5 border border-zinc-800 rounded-2xl px-4 text-sm font-bold uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-[#7C5CFC]/50 transition-all cursor-pointer">
                <option value="$10k - $50k">$10k - $50k</option>
                <option value="$50k - $200k">$50k - $200k</option>
                <option value="$200k+">$200k+</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Timeline</label>
             <select name="timeline" className="w-full h-14 bg-white/5 border border-zinc-800 rounded-2xl px-4 text-sm font-bold uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-[#7C5CFC]/50 transition-all cursor-pointer">
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
                <option value="Ongoing Support">Ongoing Support</option>
             </select>
           </div>
        </div>
      </div>

      <div className="md:col-span-2 pt-8">
         <button 
           disabled={loading}
           type="submit" 
           className="w-full bg-[#7C5CFC] text-white rounded-2xl h-16 font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#7C5CFC]/20 hover:bg-[#6042db] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
         >
           {loading ? "Processing..." : "Submit Project Intake"} <ChevronRight className="h-4 w-4" />
         </button>
         <p className="mt-4 text-[9px] font-bold text-zinc-600 text-center uppercase tracking-widest">A Standex Prime lead will respond via secure channel.</p>
      </div>
    </form>
  );
}
