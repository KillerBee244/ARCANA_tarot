"use client";

import React, { useState } from "react";
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

  // 24 interactive deck slots representing the full 78-card cosmos
  const DISPLAY_COUNT = 24;
  const displayDeck = shuffledDeck.slice(0, DISPLAY_COUNT);

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

  return (
    <div className="relative w-full flex flex-col items-center select-none overflow-hidden py-2">
      {/* Soft Radial Spotlight Behind Deck */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[340px] pointer-events-none opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(ellipse at center, rgba(218, 180, 138, 0.22) 0%, rgba(40, 68, 80, 0.35) 50%, transparent 75%)",
        }}
      />

      {/* Selection Status Counter */}
      <div className="text-center mb-5 z-20">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#284450]/90 border border-[#DAB48A]/40 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#C7E9AD] animate-ping" />
          <span className="font-body text-xs text-[#F4EADA] font-semibold tracking-wide">
            Đã chọn {selectedCards.length} / {maxSelectable} lá bài
          </span>
        </div>
        <p className="font-body text-xs text-[#C1CFD0] mt-1.5">
          {selectedCards.length < maxSelectable
            ? "Hãy lắng nghe trực giác và chạm vào lá bài đang thu hút bạn"
            : "Bạn đã chọn đủ bài. Nhấn 'Tiến hành Khai Mở' bên dưới để bắt đầu nghi thức"}
        </p>
      </div>

      {/* DESKTOP CURVED FAN DECK (Hidden on small mobile) */}
      <div className="hidden md:flex relative justify-center items-end h-[350px] w-full max-w-5xl px-8 perspective-1000 z-10">
        <div className="relative w-full h-full flex justify-center items-end">
          {displayDeck.map((cardId, index) => {
            const isSelected = selectedIds.has(cardId);
            const isHovered = hoveredIndex === index;

            // Calculate fan arc geometry
            const total = displayDeck.length;
            const mid = (total - 1) / 2;
            const normalizedOffset = (index - mid) / mid; // -1 to 1

            const rotationDeg = normalizedOffset * 28; // Arc rotation
            const translateX = (index - mid) * 26; // Horizontal spread
            const translateY = Math.abs(normalizedOffset) * 36; // Arc curve dip

            return (
              <motion.div
                key={cardId}
                className="absolute origin-bottom cursor-pointer"
                style={{
                  zIndex: isSelected ? 40 : isHovered ? 30 : index,
                  transformOrigin: "bottom center",
                }}
                animate={{
                  x: translateX,
                  y: isSelected ? -72 : isHovered ? translateY - 48 : translateY,
                  rotate: isSelected ? 0 : isHovered ? rotationDeg * 0.35 : rotationDeg,
                  scale: isSelected ? 1.08 : isHovered ? 1.15 : 1,
                  opacity: isSelected ? 0.95 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 24,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleCardClick(cardId)}
                whileTap={{ scale: 0.96 }}
              >
                <div
                  className={`w-[125px] h-[208px] rounded-xl transition-all duration-300 ${
                    isSelected
                      ? "ring-2 ring-[#C7E9AD] shadow-celestial-glow"
                      : isHovered
                      ? "ring-1 ring-[#DAB48A] shadow-card-hover"
                      : "shadow-card-3d"
                  }`}
                >
                  <TarotCard
                    size="sm"
                    className="w-full h-full pointer-events-none"
                    isSelected={isSelected}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MOBILE HORIZONTAL CAROUSEL / SWIPE DECK (Visible on mobile/tablet) */}
      <div className="md:hidden w-full overflow-x-auto no-scrollbar py-6 px-4 flex items-center space-x-3 snap-x snap-mandatory z-10">
        {displayDeck.map((cardId) => {
          const isSelected = selectedIds.has(cardId);
          return (
            <motion.div
              key={cardId}
              className="flex-shrink-0 snap-center cursor-pointer"
              whileTap={{ scale: 0.94 }}
              onClick={() => handleCardClick(cardId)}
            >
              <div
                className={`w-[115px] h-[190px] rounded-xl transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-[#C7E9AD] shadow-celestial-glow -translate-y-3"
                    : "shadow-card-3d"
                }`}
              >
                <TarotCard
                  size="sm"
                  className="w-full h-full pointer-events-none"
                  isSelected={isSelected}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
