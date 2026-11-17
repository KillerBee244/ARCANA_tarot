"use client";

import React from "react";
import { motion } from "motion/react";
import { TarotCard } from "./TarotCard";
import { PopulatedCard, SpreadType } from "@/types/tarot";

interface CardSpreadProps {
  spreadType: SpreadType;
  cards: PopulatedCard[];
  revealedIndices?: number[]; // Which cards are flipped to face
  onCardClick?: (index: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CardSpread: React.FC<CardSpreadProps> = ({
  spreadType,
  cards,
  revealedIndices = [0, 1, 2],
  onCardClick,
  className = "",
  size = "md",
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      {/* Spread Cards Grid */}
      <div
        className={`w-full flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12 py-4 ${
          spreadType === "single" ? "max-w-md" : "max-w-5xl"
        }`}
      >
        {cards.map((item, index) => {
          const isFlipped = revealedIndices.includes(index);

          return (
            <motion.div
              key={item.cardId}
              layoutId={`spread-card-${item.cardId}`}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Position Header Tag */}
              <div className="mb-3 text-center">
                <span className="font-mono text-[11px] tracking-wider uppercase px-3 py-1 rounded-full bg-[#172B38]/90 border border-[#DAA87B]/40 text-[#C6F68D] shadow-sm">
                  {item.position.nameVi}
                </span>
                <p className="font-body text-[11px] text-[#B5AA94] mt-1 max-w-[180px] line-clamp-1">
                  {item.position.descriptionVi}
                </p>
              </div>

              {/* The 3D Interactive Card */}
              <TarotCard
                card={item.card}
                isFlipped={isFlipped}
                orientation={item.orientation}
                isHoverable={true}
                size={size}
                onClick={() => onCardClick?.(index)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
