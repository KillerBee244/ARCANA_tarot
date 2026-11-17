"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TarotCard } from "./TarotCard";
import { PopulatedCard } from "@/types/tarot";
import { Sparkles, ArrowRight, FastForward } from "lucide-react";
import { getCleanViCardName } from "@/data/tarot/categories";

interface CardRevealProps {
  cards: PopulatedCard[];
  onComplete: () => void;
}

export const CardReveal: React.FC<CardRevealProps> = ({ cards, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

  const currentCard = cards[currentStep];
  const isCurrentRevealed = revealedSet.has(currentStep);
  const isLastCard = currentStep === cards.length - 1;

  // Auto-flip current card after a brief suspense pause
  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealedSet((prev) => new Set([...prev, currentStep]));
    }, 700);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (!isLastCard) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkipAll = () => {
    setRevealedSet(new Set(cards.map((_, i) => i)));
    setTimeout(() => {
      onComplete();
    }, 250);
  };

  return (
    <div className="relative w-full min-h-[88vh] flex flex-col items-center justify-between px-4 py-6 select-none bg-gradient-to-b from-[#111E2C] via-[#152332] to-[#192B38]">
      {/* Background Soft Celestial Spotlight */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div
          className="w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(218, 180, 138, 0.25) 0%, rgba(128, 189, 178, 0.12) 40%, transparent 70%)",
          }}
        />
        <div className="absolute w-[460px] h-[460px] rounded-full border border-[#DAB48A]/20 animate-spin-slow" />
      </div>

      {/* 1. Top Header & Reveal Progress */}
      <div className="relative z-10 text-center mt-2 mb-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#284450]/80 border border-[#DAB48A]/40 mb-2.5 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C7E9AD]" />
          <span className="font-body text-xs font-semibold text-[#F4EADA]">
            Nghi thức Khai Mở: Lá {currentStep + 1} / {cards.length}
          </span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-[#F4EADA] tracking-wide font-light">
          {currentCard.position.nameVi}
        </h3>
        <p className="font-body text-xs sm:text-sm text-[#C1CFD0] max-w-md mx-auto mt-1 leading-relaxed">
          {currentCard.position.descriptionVi}
        </p>
      </div>

      {/* 2. Featured Tarot Card in 3D (Increased by 20-35% using size="lg") */}
      <div className="relative z-20 my-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.cardId}
            initial={{ scale: 0.88, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative"
          >
            {/* Luminous aura behind card */}
            <div
              className={`absolute -inset-6 rounded-3xl transition-opacity duration-700 pointer-events-none ${
                isCurrentRevealed
                  ? "opacity-60 bg-gradient-to-t from-[#C7E9AD]/20 via-[#DAB48A]/25 to-transparent blur-2xl"
                  : "opacity-0"
              }`}
            />

            <TarotCard
              card={currentCard.card}
              isFlipped={isCurrentRevealed}
              orientation={currentCard.orientation}
              size="lg"
              className="shadow-2xl"
              onClick={() => {
                if (!isCurrentRevealed) {
                  setRevealedSet((prev) => new Set([...prev, currentStep]));
                }
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* 3 & 4. Card Name, Orientation & Short Interpretation (High Contrast Card) */}
        <AnimatePresence>
          {isCurrentRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.35 }}
              className="text-center mt-5 max-w-lg px-4"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#192B38] border border-[#DAB48A]/50 text-[#F4EADA] font-body text-xs font-semibold mb-2.5 shadow-md">
                <span className="text-[#F4EADA]">
                  {getCleanViCardName(currentCard.card.nameVi)}
                </span>
                <span className="text-[#DAB48A]">•</span>
                <span className={currentCard.orientation === "upright" ? "text-[#C7E9AD]" : "text-amber-300 font-medium"}>
                  {currentCard.orientation === "upright" ? "Vị trí Thuận" : "Vị trí Ngược"}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#192B38]/85 border border-[#DAB48A]/25 backdrop-blur-md shadow-card-3d">
                <p className="font-body text-sm sm:text-base text-[#F4EADA] leading-relaxed drop-shadow-sm font-normal">
                  {currentCard.orientation === "upright"
                    ? currentCard.card.uprightMeaning
                    : currentCard.card.reversedMeaning}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Continue / Reveal All Controls */}
      <div className="relative z-20 flex items-center space-x-4 mt-6 mb-2">
        <button
          onClick={handleSkipAll}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-body text-[#C1CFD0] hover:text-[#F4EADA] hover:bg-[#284450]/70 transition-colors cursor-pointer"
        >
          <FastForward className="w-4 h-4 text-[#DAB48A]" />
          <span>Lật tất cả</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentRevealed}
          className={`flex items-center space-x-2 px-7 py-3 rounded-full font-body text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md ${
            isCurrentRevealed
              ? "bg-[#C7E9AD] text-[#111E2C] hover:bg-[#A4D283] hover:shadow-celestial-glow cursor-pointer"
              : "bg-[#284450] text-[#A7BBC0]/50 border border-[#45616B] cursor-not-allowed"
          }`}
        >
          <span>{isLastCard ? "Xem diễn giải chi tiết" : "Khai mở lá tiếp theo"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
