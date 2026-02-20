"use client";

import { useRouter } from "next/navigation";
import {
  FileEdit, ShieldAlert, MonitorPlay, FileBarChart,
  ArrowRight, Activity, Zap, Play
} from "lucide-react";

export default function MissionControlDashboard() {
  const router = useRouter();

  const pipelineSteps = [
    {
      name: "Prompt Lab",
      label: "Phase 01",
      desc: "Architect technical prompts and inject robust logic scripts.",
      icon: FileEdit,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/foundry",
      status: "Ready"
    },
    {
      name: "Safety Audit",
      label: "Phase 02",
      desc: "Run adversarial simulations to sniff out bias and logic traps.",
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
      href: "/gauntlet",
      status: "Active Audit"
    },
    {
      name: "Audit Ledger",
      label: "Phase 03",
      desc: "Generate certified audit reports for enterprise compliance.",
      icon: FileBarChart,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/scorecard",
      status: "Certified"
    }
  ];

  return (
    <div className="flex flex-1 flex-col bg-white p-6 lg:p-12">

      {/* Dashboard Header */}
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 lg:text-4xl">System Overview</h1>
          <p className="mt-2 text-zinc-500 font-medium text-lg">Manage your generative content lifecycle and compliance pipeline.</p>
        </div>
        <button
          onClick={() => router.push("/foundry")}
          className="flex items-center gap-3 rounded-2xl bg-zinc-950 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-black shadow-xl"
        >
          <Play className="h-4 w-4 fill-white" />
          Initialize Simulation
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

        {/* Main Feed: Workflow Journey */}
        <div className="space-y-12">
          <div className="grid gap-6 sm:grid-cols-2">
            {pipelineSteps.map((step) => (
              <button
                key={step.name}
                onClick={() => router.push(step.href)}
                className="group relative flex flex-col items-start gap-6 rounded-[2.5rem] bg-[#F9FAFB] p-8 transition-all hover:bg-white hover:shadow-2xl hover:scale-[1.02] text-left border border-zinc-100"
              >
                <div className="flex w-full items-start justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.bg} ${step.color}`}>
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{step.label}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-950 mb-2">{step.name}</h3>
                  <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-4">{step.desc}</p>
                </div>
                <div className="mt-auto flex w-full items-center justify-between border-t border-zinc-100 pt-6">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${step.color} flex items-center gap-2`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${step.color.replace('text-', 'bg-')} animate-pulse`}></div>
                    {step.status}
                  </span>
                  <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-950 transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">Execute</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar: System Analytics */}
        <div className="space-y-8">
          <div className="rounded-[2.5rem] bg-[#F9FAFB] border border-zinc-100 p-8">
            <h3 className="text-sm font-black text-zinc-950 uppercase tracking-tight mb-8 flex items-center gap-3">
              <Activity className="h-5 w-5 text-indigo-600" />
              Live Pulse
            </h3>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Logic Retention</span>
                  <span className="text-sm font-black text-zinc-950">99.4%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-indigo-600"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Compliance Rate</span>
                  <span className="text-sm font-black text-zinc-950">88.1%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full w-[88%] bg-red-500"></div>
                </div>
              </div>

              <div className="pt-4">
                <div className="rounded-2xl bg-white border border-zinc-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reliability Avg.</span>
                    <Zap className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-4xl font-black text-zinc-950">94.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-indigo-600 p-8 text-white relative overflow-hidden group shadow-lg">
            <h3 className="text-xl font-black mb-3 relative z-10">Scale Your Audit</h3>
            <p className="text-sm text-indigo-100 font-medium mb-8 relative z-10 leading-relaxed">
              Connect your production API keys to run real-time stress tests on live deployments.
            </p>
            <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 text-xs font-black uppercase tracking-widest text-indigo-600 shadow-xl transition hover:scale-[1.02]">
              <ArrowRight className="h-4 w-4" />
              View Scale Plans
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
