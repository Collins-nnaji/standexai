import { Layers } from "lucide-react";

interface SignalBreakdown {
  reproductions: number;
  citations: number;
  collabs: number;
  reviews: number;
}

export function ReputationBar({ breakdown }: { breakdown: SignalBreakdown }) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  // Fallback to show structure even if there are no signals initially
  const isZero = total === 0;
  
  const getWidth = (val: number) => {
    if (isZero) return "25%";
    return `${(val / total) * 100}%`;
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6 shadow-xl">
      <div className="mb-4 flex items-center gap-2">
        <Layers className="h-5 w-5 text-[#7C5CFC]" />
        <h3 className="font-syne text-lg font-bold text-zinc-900">Reputation Signals</h3>
      </div>

      {isZero && (
        <p className="mb-4 text-xs text-zinc-500">No signals registered yet. Distribution below is illustrative.</p>
      )}

      {/* The Bar */}
      <div className="mb-6 flex h-3 w-full overflow-hidden rounded-full font-sans text-xs">
        <div style={{ width: getWidth(isZero ? 1 : breakdown.reproductions) }} className="bg-emerald-500 hover:opacity-80 transition-opacity" title={`Reproductions: ${breakdown.reproductions}`} />
        <div style={{ width: getWidth(isZero ? 1 : breakdown.citations) }} className="bg-blue-500 hover:opacity-80 transition-opacity" title={`Citations: ${breakdown.citations}`} />
        <div style={{ width: getWidth(isZero ? 1 : breakdown.collabs) }} className="bg-[#7C5CFC] hover:opacity-80 transition-opacity" title={`Collabs: ${breakdown.collabs}`} />
        <div style={{ width: getWidth(isZero ? 1 : breakdown.reviews) }} className="bg-amber-500 hover:opacity-80 transition-opacity" title={`Peer Reviews: ${breakdown.reviews}`} />
      </div>

      {/* The Legend */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-zinc-500">Reproductions</span>
          </div>
          <span className="text-xl font-bold text-zinc-900">{breakdown.reproductions}</span>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-zinc-500">Citations</span>
          </div>
          <span className="text-xl font-bold text-zinc-900">{breakdown.citations}</span>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7C5CFC]" />
            <span className="text-xs font-bold text-zinc-500">Collabs</span>
          </div>
          <span className="text-xl font-bold text-zinc-900">{breakdown.collabs}</span>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-zinc-500">Peer Reviews</span>
          </div>
          <span className="text-xl font-bold text-zinc-900">{breakdown.reviews}</span>
        </div>
      </div>
    </div>
  );
}
