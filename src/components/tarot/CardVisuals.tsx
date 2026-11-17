"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TarotCardData } from "@/types/tarot";
import { getCardArtworkUrl } from "@/data/tarot/assets";
import { getCleanViCardName } from "@/data/tarot/categories";

interface CardBackProps {
  className?: string;
}

/**
 * Ornate Celestial Card Back (Fully Symmetrical)
 * Crafted with celestial cartography, astrolabe rings, and antique copper filigree.
 */
export const CardBack: React.FC<CardBackProps> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-[#111E2C] via-[#284450] to-[#192B38] border border-[#DAB48A]/50 shadow-card-3d select-none ${className}`}
    >
      <svg
        viewBox="0 0 300 480"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="celestialCore2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C7E9AD" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#284450" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#111E2C" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="copperLine2" x1="0" y1="0" x2="300" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ECD2B3" />
            <stop offset="50%" stopColor="#DAB48A" />
            <stop offset="100%" stopColor="#B58C60" />
          </linearGradient>
          <pattern id="starGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.6" fill="#F4EADA" fillOpacity="0.25" />
          </pattern>
        </defs>

        {/* Subtle grid background */}
        <rect width="300" height="480" fill="url(#starGrid2)" />

        {/* Outer border & filigree corners */}
        <rect x="10" y="10" width="280" height="460" rx="8" stroke="url(#copperLine2)" strokeWidth="1.5" />
        <rect x="16" y="16" width="268" height="448" rx="6" stroke="#DAB48A" strokeOpacity="0.35" strokeDasharray="3 3" />

        {/* Corner Celestial Accents */}
        <path d="M 22 36 L 36 22 M 22 22 L 36 36" stroke="#DAB48A" strokeWidth="1" />
        <circle cx="29" cy="29" r="1.5" fill="#C7E9AD" />
        <path d="M 278 36 L 264 22 M 278 22 L 264 36" stroke="#DAB48A" strokeWidth="1" />
        <circle cx="271" cy="29" r="1.5" fill="#C7E9AD" />
        <path d="M 22 444 L 36 458 M 22 458 L 36 444" stroke="#DAB48A" strokeWidth="1" />
        <circle cx="29" cy="451" r="1.5" fill="#C7E9AD" />
        <path d="M 278 444 L 264 458 M 278 458 L 264 444" stroke="#DAB48A" strokeWidth="1" />
        <circle cx="271" cy="451" r="1.5" fill="#C7E9AD" />

        {/* Central Celestial Astrolabe Core */}
        <circle cx="150" cy="240" r="95" fill="url(#celestialCore2)" />
        <circle cx="150" cy="240" r="95" stroke="url(#copperLine2)" strokeWidth="1" strokeDasharray="4 2" />
        <circle cx="150" cy="240" r="75" stroke="#DAB48A" strokeWidth="0.8" strokeOpacity="0.6" />
        <circle cx="150" cy="240" r="55" stroke="url(#copperLine2)" strokeWidth="1" strokeDasharray="1 3" />
        <circle cx="150" cy="240" r="35" stroke="#C7E9AD" strokeWidth="0.8" strokeOpacity="0.75" />

        {/* Astrolabe Axis Cross */}
        <line x1="150" y1="40" x2="150" y2="440" stroke="#DAB48A" strokeWidth="0.6" strokeOpacity="0.4" />
        <line x1="30" y1="240" x2="270" y2="240" stroke="#DAB48A" strokeWidth="0.6" strokeOpacity="0.4" />
        <line x1="72" y1="110" x2="228" y2="370" stroke="#DAB48A" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 2" />
        <line x1="228" y1="110" x2="72" y2="370" stroke="#DAB48A" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 2" />

        {/* Center 8-pointed Radiant Star */}
        <g transform="translate(150, 240)">
          <path
            d="M 0 -22 L 4 -7 L 22 0 L 4 7 L 0 22 L -4 7 L -22 0 L -4 -7 Z"
            fill="#C7E9AD"
            fillOpacity="0.85"
          />
          <path
            d="M 0 -15 L 2.5 -4.5 L 15 0 L 2.5 4.5 L 0 15 L -2.5 4.5 L -15 0 L -2.5 -4.5 Z"
            fill="#F4EADA"
          />
          <circle cx="0" cy="0" r="2.5" fill="#DAB48A" />
        </g>

        {/* Top & Bottom Celestial Crescent Moons */}
        <path
          d="M 150 90 A 18 18 0 0 0 150 126 A 14 14 0 0 1 150 90"
          fill="#DAB48A"
          fillOpacity="0.75"
        />
        <circle cx="150" cy="108" r="2" fill="#C7E9AD" />

        <path
          d="M 150 390 A 18 18 0 0 1 150 354 A 14 14 0 0 0 150 390"
          fill="#DAB48A"
          fillOpacity="0.75"
        />
        <circle cx="150" cy="372" r="2" fill="#C7E9AD" />
      </svg>
    </div>
  );
};

interface CardFaceProps {
  card: TarotCardData;
  isReversed?: boolean;
  className?: string;
}

/**
 * Authentic Rider-Waite-Smith Card Face Component
 * Displays the original 1909 Pamela Colman Smith artwork within an elegant copper-bordered frame.
 * If reversed, inverts ONLY the illustration while keeping typography and metadata upright and readable!
 */
export const CardFace: React.FC<CardFaceProps> = ({ card, isReversed = false, className = "" }) => {
  const isMajor = card.arcana === "major";
  const artworkUrl = getCardArtworkUrl(card.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-[#223846] via-[#192B38] to-[#111E2C] border-2 border-[#DAB48A]/60 shadow-card-3d flex flex-col justify-between p-2 select-none ${className}`}
    >
      {/* Top Header: Identification, Arcana & Orientation Badge */}
      <div className="flex items-center justify-between border-b border-[#DAB48A]/25 pb-1 px-1 z-10">
        <div className="flex items-center space-x-1.5">
          <span className="font-mono text-[10px] tracking-widest text-[#C7E9AD] font-semibold uppercase">
            {isMajor ? `ARCANUM ${toRoman(card.number)}` : `${card.suit?.toUpperCase()}`}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {isReversed && (
            <span className="font-body text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/50 text-[#ECD2B3] font-medium">
              Ngược
            </span>
          )}
          <span className="font-mono text-[11px] text-[#DAB48A] font-bold">
            {isMajor ? card.number : card.number}
          </span>
        </div>
      </div>

      {/* Center Authentic Artwork Frame */}
      <div className="relative flex-1 my-1.5 rounded-lg border border-[#DAB48A]/35 bg-[#111E2C] overflow-hidden flex items-center justify-center shadow-inner">
        {/* Skeleton while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#284450]/60 animate-pulse flex items-center justify-center">
            <span className="font-mono text-[9px] text-[#A7BBC0]">Tải tranh...</span>
          </div>
        )}

        {/* Authentic Rider-Waite-Smith Artwork */}
        <div
          className={`relative w-full h-full transition-transform duration-500 ${
            isReversed ? "rotate-180" : ""
          }`}
        >
          <Image
            src={artworkUrl}
            alt={card.nameVi}
            fill
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 240px, 320px"
            className={`object-cover object-center transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            priority={card.number === 0 || card.number === 1}
          />
        </div>

        {/* Subtle decorative inner corner brackets */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#DAB48A]/60 pointer-events-none" />
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#DAB48A]/60 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#DAB48A]/60 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#DAB48A]/60 pointer-events-none" />
      </div>

      {/* Bottom Information Box: Card Name, English Title & Keywords */}
      <div className="border-t border-[#DAB48A]/25 pt-1 px-0.5 flex flex-col z-10 bg-[#111E2C]/70 rounded-b-lg">
        <div className="text-center">
          <h4 className="font-display text-sm font-semibold tracking-wide text-[#F4EADA] leading-snug line-clamp-1">
            {getCleanViCardName(card.nameVi)}
          </h4>
          <p className="font-body text-[10px] text-[#C1CFD0] leading-none mt-0.5">
            {card.nameEn}
          </p>
        </div>

        {/* Keywords pills */}
        <div className="flex flex-wrap gap-1 justify-center mt-1">
          {(isReversed ? card.reversedKeywords : card.uprightKeywords).slice(0, 2).map((kw, i) => (
            <span
              key={i}
              className="text-[9px] font-body px-1.5 py-0.2 rounded-full bg-[#284450]/80 text-[#C7E9AD] border border-[#C7E9AD]/30"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper: Convert number to Roman numerals
function toRoman(num: number): string {
  if (num === 0) return "0";
  const romanMap: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let res = "";
  let n = num;
  for (const [v, r] of romanMap) {
    while (n >= v) {
      res += r;
      n -= v;
    }
  }
  return res || String(num);
}
