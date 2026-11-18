"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TarotCard } from "./TarotCard";
import { SelectedCard } from "@/types/tarot";

interface CardDeckProps {
  shuffledDeck: string[]; // 78 card IDs
  selectedCards: SelectedCard[];
  maxSelectable: number;
  onCardSelect: (cardId: string) => void;
  onCardDeselect: (cardId: string) => void;
}

export const CardDeck: React.FC<CardDeckProps> = ({
  shuffledDeck,
  selectedCards,
  maxSelectable,
  onCardSelect,
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

  // Display count: 18 cards on mobile, 24 on desktop for ideal arc density
  const displayCount = isMobile ? 18 : 24;
  const displayDeck = shuffledDeck.slice(0, displayCount);

  const selectedIds = new Set(selectedCards.map((sc) => sc.cardId));

  const handleCardClick = (cardId: string) => {
    if (selectedIds.has(cardId)) {
      onCardDeselect(cardId);
    } else {
      if (selectedCards.length < maxSelectable) {
        onCardSelect(cardId);
      }
    }
  };

  const total = displayDeck.length;
  const mid = (total - 1) / 2;

  // Geometry multipliers
  const spreadX = isMobile ? 13.5 : 26;
  const maxRotation = isMobile ? 22 : 28;
  const curveDip = isMobile ? 24 : 36;

  return (
    <div className="relative w-full flex flex-col items-center select-none overflow-hidden py-2">
      {/* Soft Radial Spotlight Behind Deck */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[340px] pointer-events-none opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(218, 180, 138, 0.22) 0%, rgba(40, 68, 80, 0.35) 50%, transparent 75%)",
        }}
      />

      {/* Selection Status Counter */}
      <div className="text-center mb-3 sm:mb-5 z-20">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#284450]/90 border border-[#DAB48A]/40 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#C7E9AD] animate-ping" />
          <span className="font-body text-xs text-[#F4EADA] font-semibold tracking-wide">
            Đã chọn {selectedCards.length} / {maxSelectable} lá bài
          </span>
        </div>
        <p className="font-body text-xs text-[#C1CFD0] mt-1.5 px-4">
          {selectedCards.length < maxSelectable
            ? "Hãy lắng nghe trực giác và chạm vào lá bài đang thu hút bạn"
            : "Bạn đã chọn đủ bài. Nhấn 'Tiến hành Khai Mở' bên dưới để bắt đầu nghi thức"}
        </p>
      </div>

      {/* UNIFIED 3D CURVED FAN DECK (Responsive for BOTH Desktop & Mobile) */}
      <div
        className="relative flex justify-center items-end w-full max-w-5xl px-2 sm:px-8 perspective-1000 z-10"
        style={{ height: isMobile ? "240px" : "350px" }}
      >
        <div className="relative w-full h-full flex justify-center items-end">
          {displayDeck.map((cardId, index) => {
            const isSelected = selectedIds.has(cardId);
            const isHovered = hoveredIndex === index;

            // Arc geometry
            const normalizedOffset = (index - mid) / mid; // -1 to 1
            const rotationDeg = normalizedOffset * maxRotation;
            const translateX = (index - mid) * spreadX;
            const translateY = Math.abs(normalizedOffset) * curveDip;

            // When selected, the card has flown to the slot below!
            // In the fan, we show an ethereal dashed ghost placeholder showing where it was drawn from
            if (isSelected) {
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
                    className={`rounded-xl border border-dashed border-[#C7E9AD]/30 bg-[#284450]/15 ${
                      isMobile ? "w-[86px] h-[144px]" : "w-[125px] h-[208px]"
                    }`}
                  />
                </div>
              );
            }

            // Normal card in the fan (smoothly shares layoutId with destination slot when selected!)
            return (
              <motion.div
                key={cardId}
                layoutId={`deck-card-${cardId}`}
                className="absolute origin-bottom cursor-pointer touch-manipulation"
                style={{
                  zIndex: isHovered ? 30 : index,
                  transformOrigin: "bottom center",
                }}
                animate={{
                  x: translateX,
                  y: isHovered ? translateY - (isMobile ? 32 : 48) : translateY,
                  rotate: isHovered ? rotationDeg * 0.35 : rotationDeg,
                  scale: isHovered ? (isMobile ? 1.08 : 1.15) : 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 26,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleCardClick(cardId)}
                whileTap={{ scale: 0.94 }}
              >
                <div
                  className={`rounded-xl transition-all duration-300 ${
                    isMobile ? "w-[86px] h-[144px]" : "w-[125px] h-[208px]"
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
