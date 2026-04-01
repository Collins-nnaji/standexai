"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Briefcase, Zap } from "lucide-react";

export interface SearchFilters {
  query: string;
  domain: string;
  location: string;
  openToWork: boolean;
  scoutMode: boolean; // true sorts by rank
}

interface ScoutSearchProps {
  onFiltersChange?: (filters: SearchFilters) => void;
  isLab: boolean;
}

export function ScoutSearch({ onFiltersChange, isLab }: ScoutSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    domain: "",
    location: "",
    openToWork: false,
    scoutMode: false,
  });

  const [expanded, setExpanded] = useState(false);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const nextFilters = { ...filters, ...updates };
    setFilters(nextFilters);
    if (onFiltersChange) onFiltersChange(nextFilters);
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-4 shadow-xl transition-all hover:border-white/20">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            placeholder="Search researchers, papers, or tags..."
            className="h-12 w-full rounded-xl border border-zinc-800 bg-white/50 pl-11 pr-4 text-sm text-zinc-900 placeholder-zinc-500 transition-colors focus:border-[#7C5CFC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7C5CFC]"
          />
        </div>

        {isLab && (
          <button
            onClick={() => updateFilters({ scoutMode: !filters.scoutMode })}
            className={`flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition-all ${
              filters.scoutMode
                ? "border-[#7C5CFC] bg-[#7C5CFC]/20 text-[#7C5CFC] shadow-[0_0_15px_rgba(124,92,252,0.15)]"
                : "border-zinc-800 bg-white/50 text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Zap className={`h-4 w-4 ${filters.scoutMode ? "fill-[#7C5CFC]" : ""}`} />
            <span className="hidden sm:inline">Scout Mode</span>
          </button>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex h-12 items-center justify-center rounded-xl border px-4 transition-colors ${
            expanded
              ? "border-zinc-700 bg-zinc-100 text-zinc-900"
              : "border-zinc-800 bg-white/50 text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 flex flex-wrap items-center gap-4 animate-in slide-in-from-top-2 fade-in">
          <select
            value={filters.domain}
            onChange={(e) => updateFilters({ domain: e.target.value })}
            className="h-10 cursor-pointer rounded-lg border border-zinc-800 bg-white px-3 text-sm text-zinc-600 focus:border-[#7C5CFC] focus:outline-none"
          >
            <option value="">All Domains</option>
            <option value="NLP">NLP</option>
            <option value="Computer Vision">Computer Vision</option>
            <option value="Reinforcement Learning">Reinforcement Learning</option>
            <option value="Robotics">Robotics</option>
            <option value="Alignment">Alignment</option>
          </select>

          <div className="relative flex items-center">
            <MapPin className="absolute left-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => updateFilters({ location: e.target.value })}
              placeholder="Location"
              className="h-10 w-40 rounded-lg border border-zinc-800 bg-white pl-9 pr-3 text-sm text-zinc-600 focus:border-[#7C5CFC] focus:outline-none"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 bg-white px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100/80">
            <input
              type="checkbox"
              checked={filters.openToWork}
              onChange={(e) => updateFilters({ openToWork: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-100 text-[#7C5CFC] focus:ring-[#7C5CFC]"
            />
            <Briefcase className="h-4 w-4 text-zinc-500" />
            Open to Work
          </label>
        </div>
      )}
    </div>
  );
}
