"use client";

import Image from "next/image";
import { GraduationCap } from "lucide-react";

export type DeckVisualDensity = "default" | "deck";

const fontSans = "[font-family:var(--font-standex-sans),ui-sans-serif,sans-serif]";

export function DeckBrandLogos({
  logos,
  wordmarks,
  density = "default",
}: {
  logos: { src: string; alt: string; caption?: string }[];
  wordmarks?: string[];
  density?: DeckVisualDensity;
}) {
  const total = logos.length + (wordmarks?.length ?? 0);
  if (!total) return null;

  const isDeck = density === "deck";

  const gridCols =
    total >= 6
      ? "grid-cols-3 sm:grid-cols-6"
      : total === 3
        ? "grid-cols-3"
        : total === 2
          ? "grid-cols-2"
          : total === 1
            ? "grid-cols-1 max-w-[240px] mx-auto"
            : "grid-cols-2 sm:grid-cols-3";

  const card = isDeck
    ? "rounded-lg border border-zinc-200/80 bg-white px-2 py-2 sm:px-2.5 sm:py-2.5 min-h-[3.5rem] flex flex-col items-center justify-center gap-0.5 shadow-sm"
    : "border border-zinc-200 bg-white shadow-sm rounded-2xl px-4 py-4 sm:py-5 min-h-[5.5rem] flex flex-col items-center justify-center gap-2";

  const imgH = isDeck ? "max-h-8 sm:max-h-10 max-w-[96px] sm:max-w-[112px]" : "max-h-10 sm:max-h-11 max-w-[110px] sm:max-w-[120px]";

  return (
    <div
      className={`grid w-full gap-1.5 sm:gap-2 ${isDeck ? "max-w-full" : "max-w-4xl"} ${gridCols} auto-rows-fr ${isDeck ? "" : "mt-8"}`}
    >
      {logos.map((logo) => (
        <div key={`${logo.src}-${logo.alt}-${logo.caption ?? ""}`} className={card}>
          <div className="relative flex h-9 w-full max-w-[120px] items-center justify-center sm:h-10">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={48}
              className={`w-auto object-contain ${imgH}`}
              unoptimized={logo.src.endsWith(".svg")}
            />
          </div>
          {logo.caption ? (
            <span
              className={`text-center font-bold uppercase tracking-wide text-zinc-500 ${isDeck ? "text-[9px] sm:text-[10px]" : "text-[9px]"}`}
            >
              {logo.caption}
            </span>
          ) : null}
        </div>
      ))}
      {(wordmarks ?? []).map((w) => (
        <div key={w} className={card}>
          <span
            className={`text-center font-semibold tracking-tight text-zinc-800 ${fontSans} ${isDeck ? "text-sm sm:text-base" : "text-sm sm:text-base"}`}
          >
            {w}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DeckLearningOutcomes({
  items,
  density = "default",
}: {
  items: string[];
  density?: DeckVisualDensity;
}) {
  if (!items.length) return null;

  const isDeck = density === "deck";

  return (
    <div
      className={`w-full border-l-4 border-[#7C5CFC] bg-white/80 pl-4 text-left shadow-sm ring-1 ring-zinc-200/60 ${fontSans} ${
        isDeck ? "rounded-r-xl py-3 pr-3 sm:py-3.5 sm:pr-4" : "mt-10 max-w-2xl rounded-xl p-5 sm:mt-12 sm:p-6"
      }`}
    >
      <div
        className={`mb-2 flex items-center gap-2 font-extrabold uppercase tracking-[0.18em] text-[#7C5CFC] sm:mb-2.5 ${
          isDeck ? "text-[11px] sm:text-xs" : "text-xs"
        }`}
      >
        <GraduationCap className={`shrink-0 ${isDeck ? "h-4 w-4" : "h-4 w-4"}`} />
        Learning outcomes
      </div>
      <ul
        className={`grid font-semibold text-zinc-800 ${isDeck ? "grid-cols-1 gap-2.5 text-sm leading-snug sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2.5 sm:text-[15px] sm:leading-snug" : "grid-cols-1 gap-3 text-base"}`}
      >
        {items.map((line) => (
          <li key={line} className="flex gap-2.5 sm:gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-sm bg-[#7C5CFC]" />
            <span className="font-medium">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
