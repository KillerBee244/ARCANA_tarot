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
        className={`w-full flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-10 py-2 ${
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
              <div className="mb-3.5 text-center px-2">
                <span className="font-body text-xs font-semibold tracking-wide px-3.5 py-1 rounded-full bg-[#284450]/90 border border-[#DAB48A]/40 text-[#C7E9AD] shadow-sm inline-block">
                  {item.position.nameVi}
                </span>
                <p className="font-body text-[11px] text-[#C1CFD0] mt-1.5 max-w-[220px] leading-tight mx-auto">
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
