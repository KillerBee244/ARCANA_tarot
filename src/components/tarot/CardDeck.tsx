"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TarotCard } from "./TarotCard";
import { SelectedCard } from "@/types/tarot";

interface CardDeckProps {
  shuffledDeck: string[]; // 78 card IDs
  selectedCards: SelectedCard[];
  maxSelectable: number;
  animatingCardId?: string | null;
  isInteractionLocked?: boolean;
  onCardSelectStart: (cardId: string, cardRect: DOMRect, fanRotation: number) => void;
  onCardDeselect: (cardId: string) => void;
}

export const CardDeck: React.FC<CardDeckProps> = ({
  shuffledDeck,
  selectedCards,
  maxSelectable,
  animatingCardId = null,
  isInteractionLocked = false,
  onCardSelectStart,
  onCardDeselect,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Display count: 18 cards on mobile, 24 on desktop for ideal arc density & elegance
  const displayCount = isMobile ? 18 : 24;
  const displayDeck = shuffledDeck.slice(0, displayCount);

  const selectedIds = new Set(selectedCards.map((sc) => sc.cardId));

  const total = displayDeck.length;
  const mid = (total - 1) / 2;

  // Fan geometry multipliers tailored for mobile & desktop
  const spreadX = isMobile ? 13.5 : 26;
  const maxRotation = isMobile ? 22 : 28;
  const curveDip = isMobile ? 24 : 36;

  return (
    <div className="relative w-full flex flex-col items-center select-none overflow-visible py-1 sm:py-2">
      {/* Soft Radial Celestial Spotlight Behind Deck */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[760px] h-[300px] sm:h-[360px] pointer-events-none opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(218, 180, 138, 0.22) 0%, rgba(40, 68, 80, 0.35) 50%, transparent 75%)",
        }}
      />

      {/* UNIFIED 3D CURVED FAN DECK */}
      <div
        className="relative flex justify-center items-end w-full max-w-5xl px-2 sm:px-8 perspective-1000 z-10"
        style={{ height: isMobile ? "220px" : "320px" }}
      >
        <div className="relative w-full h-full flex justify-center items-end">
          {displayDeck.map((cardId, index) => {
            const isSelected = selectedIds.has(cardId);
            const isFlying = animatingCardId === cardId;
            const isHovered = !isMobile && hoveredIndex === index && !isInteractionLocked;

            // Arc geometry calculations
            const normalizedOffset = (index - mid) / mid; // -1 to 1
            const rotationDeg = normalizedOffset * maxRotation;
            const translateX = (index - mid) * spreadX;
            const translateY = Math.abs(normalizedOffset) * curveDip;

            // When a card is selected or currently flying to destination slot,
            // render a subtle celestial dashed phantom slot in the fan.
            // This leaves the remaining deck 100% visible and unblocked!
            if (isSelected || isFlying) {
              return (
                <div
                  key={cardId}
                  className="absolute origin-bottom pointer-events-none"
                  style={{
                    zIndex: 2,
                    transformOrigin: "bottom center",
                    transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationDeg}deg)`,
                  }}
                >
                  <div
                    className={`rounded-xl border border-dashed border-[#C7E9AD]/35 bg-[#284450]/15 transition-all ${
                      isMobile ? "w-[84px] h-[138px]" : "w-[125px] h-[208px]"
                    }`}
                  />
                </div>
              );
            }

            // Normal interactive card resting in the ceremonial fan
            return (
              <motion.div
                key={cardId}
                className="absolute origin-bottom cursor-pointer touch-manipulation"
                style={{
                  zIndex: isHovered ? 30 : index + 5,
                  transformOrigin: "bottom center",
                }}
                animate={{
                  x: translateX,
                  y: isHovered ? translateY - (isMobile ? 26 : 42) : translateY,
                  rotate: isHovered ? rotationDeg * 0.35 : rotationDeg,
                  scale: isHovered ? (isMobile ? 1.08 : 1.15) : 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 26,
                }}
                onMouseEnter={() => !isInteractionLocked && setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={(e) => {
                  if (isInteractionLocked) return;
                  if (selectedCards.length >= maxSelectable) return;
                  setHoveredIndex(null);
                  const rect = e.currentTarget.getBoundingClientRect();
                  onCardSelectStart(cardId, rect, rotationDeg);
                }}
                whileTap={!isInteractionLocked ? { scale: 0.94 } : undefined}
              >
                <div
                  className={`rounded-xl transition-all duration-300 ${
                    isMobile ? "w-[84px] h-[138px]" : "w-[125px] h-[208px]"
                  } ${
                    isHovered
                      ? "ring-1 ring-[#DAB48A] shadow-card-hover"
                      : "shadow-card-3d"
                  }`}
                >
                  <TarotCard
                    size={isMobile ? "xs" : "sm"}
                    className="w-full h-full pointer-events-none"
                    isSelected={false}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
