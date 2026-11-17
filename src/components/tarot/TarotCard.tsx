"use client";

import React from "react";
import { motion } from "motion/react";
import { TarotCardData, CardOrientation } from "@/types/tarot";
import { CardBack, CardFace } from "./CardVisuals";

export interface TarotCardProps {
  card?: TarotCardData;
  isFlipped?: boolean; // false = back visible, true = face visible
  orientation?: CardOrientation;
  isHoverable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  layoutId?: string;
}

const SIZE_CLASSES = {
  sm: "w-[120px] h-[192px]", // 5:8 ratio
  md: "w-[160px] h-[256px]",
  lg: "w-[200px] h-[320px]",
  xl: "w-[240px] h-[384px]",
};

export const TarotCard: React.FC<TarotCardProps> = ({
  card,
  isFlipped = false,
  orientation = "upright",
  isHoverable = false,
  isSelected = false,
  onClick,
  className = "",
  size = "md",
  layoutId,
}) => {
  const isReversed = orientation === "reversed";
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <motion.div
      layoutId={layoutId}
      className={`relative cursor-pointer select-none ${sizeClass} ${className}`}
      style={{ perspective: 1200 }}
      whileHover={
        isHoverable
          ? {
              y: -18,
              scale: 1.05,
              transition: { type: "spring", stiffness: 350, damping: 25 },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={card ? `${card.nameVi} (${isReversed ? "Ngược" : "Thuận"})` : "Lá bài Tarot úp"}
    >
      {/* 3D Flipper Container */}
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.75,
          ease: [0.23, 1, 0.32, 1], // Smooth cubic-bezier
        }}
      >
        {/* CARD BACK (0deg) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-xl transition-shadow duration-300 ${
            isSelected ? "ring-2 ring-[#C6F68D] shadow-celestial-glow" : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <CardBack />
        </div>

        {/* CARD FACE (180deg) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-xl transition-shadow duration-300 ${
            isSelected ? "ring-2 ring-[#C6F68D] shadow-celestial-glow" : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: `rotateY(180deg) ${isReversed ? "rotateZ(180deg)" : ""}`,
          }}
        >
          {card ? (
            <CardFace card={card} isReversed={isReversed} />
          ) : (
            <CardBack />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
