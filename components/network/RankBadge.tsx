import { Trophy } from "lucide-react";

interface RankBadgeProps {
  domain: string;
  position: number;
  compact?: boolean;
}

export function RankBadge({ domain, position, compact = false }: RankBadgeProps) {
  // Add some simple logic to colorize top ranks
  const isTop10 = position <= 10;
  const isTop100 = position <= 100 && position > 10;

  let colorClass = "border-black/10 bg-zinc-100 text-zinc-600"; // default
  
  if (isTop10) {
    colorClass = "border-amber-500/30 bg-amber-500/10 text-amber-300";
  } else if (isTop100) {
    colorClass = "border-[#7C5CFC]/30 bg-[#7C5CFC]/10 text-[#7C5CFC]";
  }

  if (compact) {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold leading-none backdrop-blur-sm ${colorClass}`}
        title={`#${position} in ${domain}`}
      >
        <Trophy className="h-3 w-3" />
        <span>#{position}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold shadow-sm backdrop-blur-sm ${colorClass}`}>
      <Trophy className="h-4 w-4" />
      <span>#{position} in {domain}</span>
    </div>
  );
}
