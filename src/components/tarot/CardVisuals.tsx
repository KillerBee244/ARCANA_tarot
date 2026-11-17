"use client";

import React from "react";
import { TarotCardData } from "@/types/tarot";

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
      className={`relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-[#0B1020] via-[#172B38] to-[#0E1A23] border border-[#DAA87B]/40 shadow-card-3d select-none ${className}`}
    >
      <svg
        viewBox="0 0 300 480"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="celestialCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C6F68D" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#172B38" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0B1020" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="copperLine" x1="0" y1="0" x2="300" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F2CBA4" />
            <stop offset="50%" stopColor="#DAA87B" />
            <stop offset="100%" stopColor="#9E724C" />
          </linearGradient>
          <pattern id="starGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.6" fill="#E9DFC9" fillOpacity="0.25" />
          </pattern>
        </defs>

        {/* Subtle grid background */}
        <rect width="300" height="480" fill="url(#starGrid)" />

        {/* Outer border & filigree corners */}
        <rect x="10" y="10" width="280" height="460" rx="8" stroke="url(#copperLine)" strokeWidth="1.5" />
        <rect x="16" y="16" width="268" height="448" rx="6" stroke="#DAA87B" strokeOpacity="0.3" strokeDasharray="3 3" />

        {/* Corner Celestial Accents */}
        <path d="M 22 36 L 36 22 M 22 22 L 36 36" stroke="#DAA87B" strokeWidth="1" />
        <circle cx="29" cy="29" r="1.5" fill="#C6F68D" />
        <path d="M 278 36 L 264 22 M 278 22 L 264 36" stroke="#DAA87B" strokeWidth="1" />
        <circle cx="271" cy="29" r="1.5" fill="#C6F68D" />
        <path d="M 22 444 L 36 458 M 22 458 L 36 444" stroke="#DAA87B" strokeWidth="1" />
        <circle cx="29" cy="451" r="1.5" fill="#C6F68D" />
        <path d="M 278 444 L 264 458 M 278 458 L 264 444" stroke="#DAA87B" strokeWidth="1" />
        <circle cx="271" cy="451" r="1.5" fill="#C6F68D" />

        {/* Central Celestial Astrolabe Core */}
        <circle cx="150" cy="240" r="95" fill="url(#celestialCore)" />
        <circle cx="150" cy="240" r="95" stroke="url(#copperLine)" strokeWidth="1" strokeDasharray="4 2" />
        <circle cx="150" cy="240" r="75" stroke="#DAA87B" strokeWidth="0.8" strokeOpacity="0.6" />
        <circle cx="150" cy="240" r="55" stroke="url(#copperLine)" strokeWidth="1" strokeDasharray="1 3" />
        <circle cx="150" cy="240" r="35" stroke="#C6F68D" strokeWidth="0.8" strokeOpacity="0.7" />

        {/* Astrolabe Axis Cross */}
        <line x1="150" y1="40" x2="150" y2="440" stroke="#DAA87B" strokeWidth="0.6" strokeOpacity="0.4" />
        <line x1="30" y1="240" x2="270" y2="240" stroke="#DAA87B" strokeWidth="0.6" strokeOpacity="0.4" />
        <line x1="72" y1="110" x2="228" y2="370" stroke="#DAA87B" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 2" />
        <line x1="228" y1="110" x2="72" y2="370" stroke="#DAA87B" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 2" />

        {/* Center 8-pointed Radiant Star */}
        <g transform="translate(150, 240)">
          <path
            d="M 0 -22 L 4 -7 L 22 0 L 4 7 L 0 22 L -4 7 L -22 0 L -4 -7 Z"
            fill="#C6F68D"
            fillOpacity="0.8"
          />
          <path
            d="M 0 -15 L 2.5 -4.5 L 15 0 L 2.5 4.5 L 0 15 L -2.5 4.5 L -15 0 L -2.5 -4.5 Z"
            fill="#E9DFC9"
          />
          <circle cx="0" cy="0" r="2.5" fill="#DAA87B" />
        </g>

        {/* Top & Bottom Celestial Crescent Moons */}
        <path
          d="M 150 90 A 18 18 0 0 0 150 126 A 14 14 0 0 1 150 90"
          fill="#DAA87B"
          fillOpacity="0.7"
        />
        <circle cx="150" cy="108" r="2" fill="#C6F68D" />

        <path
          d="M 150 390 A 18 18 0 0 1 150 354 A 14 14 0 0 0 150 390"
          fill="#DAA87B"
          fillOpacity="0.7"
        />
        <circle cx="150" cy="372" r="2" fill="#C6F68D" />
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
 * Ornate Card Face with Custom Vector Symbolic Artwork
 */
export const CardFace: React.FC<CardFaceProps> = ({ card, isReversed = false, className = "" }) => {
  const isMajor = card.arcana === "major";
  const accentColor = card.accentColor || "#DAA87B";

  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-[#0F162B] via-[#172B38] to-[#0B1020] border border-[#DAA87B]/50 shadow-card-3d flex flex-col justify-between p-3 select-none ${className}`}
    >
      {/* Top Card Title & Identifier */}
      <div className="flex items-center justify-between border-b border-[#DAA87B]/20 pb-1.5 z-10">
        <div className="flex items-center space-x-1.5">
          <span className="font-mono text-[10px] tracking-widest text-[#C6F68D] uppercase font-semibold">
            {isMajor ? `ARCANUM ${toRoman(card.number)}` : `${card.suit?.toUpperCase()}`}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {isReversed && (
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-300">
              Ngược
            </span>
          )}
          <span className="font-mono text-[11px] text-[#DAA87B] font-bold">
            {isMajor ? card.number : card.number}
          </span>
        </div>
      </div>

      {/* Center Symbolic Artwork Frame */}
      <div className="relative flex-1 my-2 rounded-lg border border-[#DAA87B]/30 bg-[#0B1020]/70 overflow-hidden flex items-center justify-center p-2">
        {/* Subtle Background Glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* Vector Artwork tailored to Arcana / Suit */}
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-[220px]" fill="none">
          <defs>
            <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F2CBA4" />
              <stop offset="50%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#DAA87B" />
            </linearGradient>
          </defs>

          {/* Decorative Halo & Orbital Ring */}
          <circle cx="100" cy="120" r="70" stroke={accentColor} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.4" />
          <circle cx="100" cy="120" r="85" stroke="#DAA87B" strokeWidth="0.5" opacity="0.25" />

          {/* Render Suit or Major Specific Illustration */}
          {isMajor ? renderMajorIllustration(card.id, accentColor) : renderMinorIllustration(card, accentColor)}
        </svg>

        {/* Astrological / Elemental symbol tag */}
        {card.astrologicalSign && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#0B1020]/80 border border-[#DAA87B]/30 text-[9px] font-mono text-[#E9DFC9]/80">
            {card.astrologicalSign}
          </div>
        )}
      </div>

      {/* Bottom Information Box */}
      <div className="border-t border-[#DAA87B]/20 pt-1.5 flex flex-col z-10">
        <div className="text-center">
          <h4 className="font-display text-sm font-semibold tracking-wide text-[#E9DFC9] leading-tight">
            {card.nameVi}
          </h4>
          <p className="font-mono text-[9px] text-[#B5AA94] tracking-wider uppercase mt-0.5">
            {card.nameEn}
          </p>
        </div>
        {/* Keywords pills */}
        <div className="flex flex-wrap gap-1 justify-center mt-1.5">
          {(isReversed ? card.reversedKeywords : card.uprightKeywords).slice(0, 2).map((kw, i) => (
            <span
              key={i}
              className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#172B38]/80 text-[#C6F68D] border border-[#C6F68D]/25"
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

// Major Arcana Vector Symbolism
function renderMajorIllustration(cardId: string, accentColor: string) {
  switch (cardId) {
    case "major-00-fool":
      return (
        <g transform="translate(100, 120)">
          {/* Precipice and rising sun */}
          <path d="M -70 80 L -10 30 L 70 80 Z" fill="#172B38" stroke="#DAA87B" strokeWidth="1" />
          <circle cx="45" cy="-20" r="25" fill="#C6F68D" fillOpacity="0.2" stroke="#C6F68D" strokeWidth="1" />
          {/* Hand carrying white rose and staff with knapsack */}
          <line x1="-30" y1="20" x2="30" y2="-50" stroke="#DAA87B" strokeWidth="2" />
          <circle cx="28" cy="-48" r="8" fill="#DAA87B" fillOpacity="0.4" stroke="#DAA87B" strokeWidth="1" />
          <path d="M -15 -10 C -5 -25, 10 -25, 15 -10 C 20 5, -5 20, -15 -10 Z" fill="#E9DFC9" fillOpacity="0.8" stroke="#E9DFC9" />
          {/* White dog jumping */}
          <circle cx="-35" cy="40" r="5" fill="#E9DFC9" />
        </g>
      );
    case "major-01-magician":
      return (
        <g transform="translate(100, 120)">
          {/* Infinity Lemniscate on top */}
          <path
            d="M -30 -60 C -15 -80, -15 -40, 0 -60 C 15 -80, 15 -40, 30 -60 C 45 -80, 45 -40, 30 -60 C 15 -40, 15 -80, 0 -60 C -15 -40, -15 -80, -30 -60 Z"
            stroke="#C6F68D"
            strokeWidth="2"
            fill="none"
          />
          {/* Altar with 4 elemental symbols */}
          <rect x="-45" y="20" width="90" height="40" rx="3" fill="#172B38" stroke="#DAA87B" strokeWidth="1.2" />
          {/* Wand, Cup, Sword, Pentacle */}
          <line x1="-30" y1="35" x2="-30" y2="15" stroke="#E67E22" strokeWidth="2" />
          <path d="M -15 35 A 6 6 0 0 1 -3 35 Z" fill="#3498DB" />
          <line x1="10" y1="35" x2="10" y2="15" stroke="#5DADE2" strokeWidth="1.5" />
          <circle cx="28" cy="25" r="5" fill="#F1C40F" stroke="#DAA87B" strokeWidth="1" />
          {/* Upward hand and downward hand */}
          <line x1="0" y1="-20" x2="0" y2="-45" stroke="#DAA87B" strokeWidth="1.5" />
          <polygon points="0,-50 -4,-42 4,-42" fill="#DAA87B" />
        </g>
      );
    case "major-02-high-priestess":
      return (
        <g transform="translate(100, 120)">
          {/* Dual Pillars B and J */}
          <rect x="-65" y="-50" width="18" height="110" rx="2" fill="#0B1020" stroke="#DAA87B" strokeWidth="1.2" />
          <text x="-56" y="10" textAnchor="middle" fill="#E9DFC9" fontSize="12" fontFamily="monospace">B</text>
          <rect x="47" y="-50" width="18" height="110" rx="2" fill="#E9DFC9" fillOpacity="0.2" stroke="#DAA87B" strokeWidth="1.2" />
          <text x="56" y="10" textAnchor="middle" fill="#E9DFC9" fontSize="12" fontFamily="monospace">J</text>
          {/* Crescent Moon & Scroll */}
          <path d="M 0 -35 A 18 18 0 0 0 0 1 A 13 13 0 0 1 0 -35" fill="#C6F68D" stroke="#C6F68D" strokeWidth="1" />
          <rect x="-20" y="20" width="40" height="22" rx="2" fill="#172B38" stroke="#DAA87B" strokeWidth="1" />
          <text x="0" y="35" textAnchor="middle" fill="#DAA87B" fontSize="9" fontFamily="monospace">TORA</text>
        </g>
      );
    case "major-10-wheel-of-fortune":
      return (
        <g transform="translate(100, 120)">
          <circle cx="0" cy="0" r="55" stroke="#DAA87B" strokeWidth="2" strokeDasharray="6 3" />
          <circle cx="0" cy="0" r="35" stroke="#C6F68D" strokeWidth="1" />
          {/* 8 spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2={55 * Math.cos((deg * Math.PI) / 180)}
              y2={55 * Math.sin((deg * Math.PI) / 180)}
              stroke="#DAA87B"
              strokeWidth="0.8"
            />
          ))}
          <circle cx="0" cy="0" r="8" fill="#DAA87B" />
          <text x="0" y="-40" textAnchor="middle" fill="#E9DFC9" fontSize="8" fontFamily="monospace">T</text>
          <text x="40" y="3" textAnchor="middle" fill="#E9DFC9" fontSize="8" fontFamily="monospace">A</text>
          <text x="0" y="46" textAnchor="middle" fill="#E9DFC9" fontSize="8" fontFamily="monospace">R</text>
          <text x="-40" y="3" textAnchor="middle" fill="#E9DFC9" fontSize="8" fontFamily="monospace">O</text>
        </g>
      );
    case "major-13-death":
      return (
        <g transform="translate(100, 120)">
          {/* Black Banner with Mystic Rose */}
          <polygon points="-40,-50 40,-50 0,20" fill="#0B1020" stroke="#DAA87B" strokeWidth="1.2" />
          {/* Mystic white 5-petaled rose */}
          <circle cx="0" cy="-25" r="14" fill="#E9DFC9" fillOpacity="0.8" stroke="#DAA87B" strokeWidth="1" />
          <circle cx="0" cy="-25" r="5" fill="#C6F68D" />
          {/* Twin towers with rising golden sun in background */}
          <line x1="-60" y1="60" x2="-60" y2="20" stroke="#DAA87B" strokeWidth="3" />
          <line x1="60" y1="60" x2="60" y2="20" stroke="#DAA87B" strokeWidth="3" />
          <path d="M -30 60 A 30 30 0 0 1 30 60" fill="#F1C40F" fillOpacity="0.3" stroke="#F1C40F" strokeWidth="1" />
        </g>
      );
    case "major-16-tower":
      return (
        <g transform="translate(100, 120)">
          {/* Stone Tower */}
          <polygon points="-30,60 30,60 20,-30 -20,-30" fill="#172B38" stroke="#DAA87B" strokeWidth="1.5" />
          {/* Crown struck off */}
          <polygon points="-18,-35 18,-35 14,-45 0,-38 -14,-45" fill="#F1C40F" stroke="#DAA87B" strokeWidth="1" />
          {/* Lightning bolt */}
          <polygon points="25,-60 5,-20 18,-18 -15,25 0,0 -12,2" fill="#C6F68D" stroke="#E9DFC9" strokeWidth="1" />
        </g>
      );
    case "major-17-star":
      return (
        <g transform="translate(100, 120)">
          {/* Giant 8-pointed Star */}
          <path
            d="M 0 -45 L 8 -15 L 38 0 L 8 15 L 0 45 L -8 15 L -38 0 L -8 -15 Z"
            fill="#5DADE2"
            fillOpacity="0.6"
            stroke="#C6F68D"
            strokeWidth="1.5"
          />
          {/* Twin streams of life water */}
          <path d="M -20 20 Q -40 45 -30 70" stroke="#3498DB" strokeWidth="2" fill="none" />
          <path d="M 20 20 Q 40 45 30 70" stroke="#3498DB" strokeWidth="2" fill="none" />
          <circle cx="-50" cy="-30" r="3" fill="#C6F68D" />
          <circle cx="50" cy="-30" r="3" fill="#C6F68D" />
          <circle cx="45" cy="40" r="2.5" fill="#E9DFC9" />
          <circle cx="-45" cy="40" r="2.5" fill="#E9DFC9" />
        </g>
      );
    case "major-19-sun":
      return (
        <g transform="translate(100, 120)">
          <circle cx="0" cy="0" r="32" fill="#F39C12" fillOpacity="0.2" stroke="#F1C40F" strokeWidth="2" />
          {/* Radiant straight & wavy rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
            <line
              key={deg}
              x1={36 * Math.cos((deg * Math.PI) / 180)}
              y1={36 * Math.sin((deg * Math.PI) / 180)}
              x2={(i % 2 === 0 ? 55 : 46) * Math.cos((deg * Math.PI) / 180)}
              y2={(i % 2 === 0 ? 55 : 46) * Math.sin((deg * Math.PI) / 180)}
              stroke="#F1C40F"
              strokeWidth={i % 2 === 0 ? 2 : 1}
            />
          ))}
          <circle cx="0" cy="0" r="18" fill="#F1C40F" />
          <path d="M -8 -3 Q 0 -8 8 -3" stroke="#0B1020" strokeWidth="1.5" fill="none" />
          <circle cx="-6" cy="3" r="1.5" fill="#0B1020" />
          <circle cx="6" cy="3" r="1.5" fill="#0B1020" />
          <path d="M -8 8 Q 0 14 8 8" stroke="#0B1020" strokeWidth="1.5" fill="none" />
        </g>
      );
    case "major-21-world":
      return (
        <g transform="translate(100, 120)">
          {/* Laurel Wreath oval */}
          <ellipse cx="0" cy="0" rx="42" ry="58" stroke="#27AE60" strokeWidth="3" strokeDasharray="4 2" fill="none" />
          <ellipse cx="0" cy="0" rx="36" ry="52" stroke="#DAA87B" strokeWidth="1" fill="none" />
          {/* Cosmic dancer baton */}
          <line x1="-15" y1="-25" x2="-15" y2="25" stroke="#C6F68D" strokeWidth="2" />
          <line x1="15" y1="-25" x2="15" y2="25" stroke="#C6F68D" strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill="#DAA87B" />
          {/* Ribbons at top and bottom */}
          <path d="M -10 -58 Q 0 -50 10 -58" stroke="#E74C3C" strokeWidth="2" fill="none" />
          <path d="M -10 58 Q 0 50 10 58" stroke="#E74C3C" strokeWidth="2" fill="none" />
        </g>
      );
    default:
      // Generic ornate Major Arcana emblem
      return (
        <g transform="translate(100, 120)">
          <polygon points="0,-50 45,0 0,50 -45,0" stroke={accentColor} strokeWidth="1.5" fill="none" />
          <circle cx="0" cy="0" r="28" stroke="#DAA87B" strokeWidth="1" strokeDasharray="3 3" />
          <path
            d="M 0 -22 L 6 -6 L 22 0 L 6 6 L 0 22 L -6 6 L -22 0 L -6 -6 Z"
            fill={accentColor}
            fillOpacity="0.8"
          />
        </g>
      );
  }
}

// Minor Arcana Vector Symbolism
function renderMinorIllustration(card: TarotCardData, accentColor: string) {
  const suit = card.suit || "wands";
  const num = card.number;

  switch (suit) {
    case "wands":
      return (
        <g transform="translate(100, 120)">
          {/* Main blossoming staff */}
          <line x1="0" y1="-65" x2="0" y2="65" stroke="#E67E22" strokeWidth="4" strokeLinecap="round" />
          {/* Sprouts / leaves */}
          <path d="M 0 -35 Q 15 -42 12 -28 Q 0 -28 0 -35" fill="#2ECC71" />
          <path d="M 0 -10 Q -15 -17 -12 -3 Q 0 -3 0 -10" fill="#2ECC71" />
          <path d="M 0 15 Q 15 8 12 22 Q 0 22 0 15" fill="#2ECC71" />
          <path d="M 0 40 Q -15 33 -12 47 Q 0 47 0 40" fill="#2ECC71" />
          {/* Fire Aura */}
          <circle cx="0" cy="-65" r="10" fill="#E74C3C" fillOpacity="0.3" stroke="#F1C40F" strokeWidth="1.5" />
          {/* Repeat small wands if number > 1 */}
          {num > 1 && num <= 10 && (
            <g opacity="0.6">
              <line x1="-30" y1="-45" x2="-30" y2="45" stroke="#E67E22" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="30" y1="-45" x2="30" y2="45" stroke="#E67E22" strokeWidth="2" strokeDasharray="4 2" />
            </g>
          )}
        </g>
      );
    case "cups":
      return (
        <g transform="translate(100, 120)">
          {/* Golden / Chalice */}
          <path
            d="M -30 -35 L 30 -35 L 24 10 Q 0 35 -24 10 Z"
            fill="#3498DB"
            fillOpacity="0.25"
            stroke="#DAA87B"
            strokeWidth="1.8"
          />
          {/* Stem & Base */}
          <line x1="0" y1="18" x2="0" y2="50" stroke="#DAA87B" strokeWidth="3" />
          <ellipse cx="0" cy="52" rx="25" ry="6" fill="#DAA87B" fillOpacity="0.5" stroke="#DAA87B" strokeWidth="1.2" />
          {/* Sacred Waters bubbling */}
          <path d="M -22 -35 Q 0 -48 22 -35" stroke="#C6F68D" strokeWidth="2" fill="none" />
          <circle cx="-10" cy="-22" r="3" fill="#E9DFC9" />
          <circle cx="8" cy="-16" r="2" fill="#E9DFC9" />
          <circle cx="0" cy="-5" r="2.5" fill="#C6F68D" />
          {/* Secondary cups hint for cards 2-10 */}
          {num > 1 && (
            <g opacity="0.4">
              <circle cx="-42" cy="0" r="12" stroke="#3498DB" strokeWidth="1" />
              <circle cx="42" cy="0" r="12" stroke="#3498DB" strokeWidth="1" />
            </g>
          )}
        </g>
      );
    case "swords":
      return (
        <g transform="translate(100, 120)">
          {/* Central Silver Sword Blade */}
          <line x1="0" y1="-75" x2="0" y2="50" stroke="#E9DFC9" strokeWidth="3" strokeLinecap="round" />
          {/* Crossguard & Pommel */}
          <line x1="-32" y1="35" x2="32" y2="35" stroke="#DAA87B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="58" r="5" fill="#DAA87B" />
          {/* Crown of Olive / Victory around blade */}
          <ellipse cx="0" cy="-35" rx="24" ry="12" stroke="#C6F68D" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
          {/* Clouds / Wind gust lines */}
          <path d="M -45 -10 Q -15 -25 0 -10 Q 15 5 45 -10" stroke="#5DADE2" strokeWidth="1" fill="none" opacity="0.6" />
          {num > 1 && (
            <g opacity="0.4">
              <line x1="-25" y1="-50" x2="-25" y2="30" stroke="#5DADE2" strokeWidth="1.5" />
              <line x1="25" y1="-50" x2="25" y2="30" stroke="#5DADE2" strokeWidth="1.5" />
            </g>
          )}
        </g>
      );
    case "pentacles":
      return (
        <g transform="translate(100, 120)">
          {/* Large Golden Coin */}
          <circle cx="0" cy="0" r="48" fill="#F1C40F" fillOpacity="0.15" stroke="#DAA87B" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="40" stroke="#DAA87B" strokeWidth="1" strokeDasharray="4 2" />
          {/* Five Pointed Star (Pentagram) */}
          <path
            d="M 0 -35 L 21 28 L -33 -11 L 33 -11 L -21 28 Z"
            stroke="#C6F68D"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="0" cy="0" r="5" fill="#DAA87B" />
          {/* Surrounding Earth Vine */}
          <path d="M -48 30 Q -55 0 -40 -35" stroke="#27AE60" strokeWidth="1.2" fill="none" opacity="0.7" />
          <path d="M 48 30 Q 55 0 40 -35" stroke="#27AE60" strokeWidth="1.2" fill="none" opacity="0.7" />
        </g>
      );
  }
}
