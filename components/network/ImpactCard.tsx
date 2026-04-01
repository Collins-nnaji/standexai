import { Target, TrendingUp, Zap } from "lucide-react";

export interface ImpactCardProps {
  problemSolved: string;
  improvesOn: string;
}

export function ImpactCard({ problemSolved, improvesOn }: ImpactCardProps) {
  return (
    <div className="rounded-2xl border border-[#7C5CFC]/20 bg-gradient-to-b from-[#7C5CFC]/10 to-transparent p-6 shadow-2xl">
      <h3 className="font-syne mb-6 text-xl font-bold flex items-center gap-2 text-zinc-900">
        <Target className="h-5 w-5 text-[#7C5CFC]" /> Impact Summary
      </h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-zinc-100 p-5 border border-black/5">
          <h4 className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-zinc-500 mb-3">
            <Zap className="h-4 w-4 text-emerald-400" /> Problem Solved
          </h4>
          <p className="text-sm leading-relaxed text-zinc-600">
            {problemSolved || "No structured problem definition provided."}
          </p>
        </div>
        
        <div className="rounded-xl bg-zinc-100 p-5 border border-black/5">
          <h4 className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-zinc-500 mb-3">
            <TrendingUp className="h-4 w-4 text-[#7C5CFC]" /> Improves On
          </h4>
          <p className="text-sm leading-relaxed text-zinc-600">
            {improvesOn || "No structured improvement data provided."}
          </p>
        </div>
      </div>
    </div>
  );
}
