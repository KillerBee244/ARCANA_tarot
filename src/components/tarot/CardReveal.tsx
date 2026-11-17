"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TarotCard } from "./TarotCard";
import { PopulatedCard } from "@/types/tarot";
import { Sparkles, ArrowRight, Eye, FastForward } from "lucide-react";

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
    // Reveal all and complete immediately
    setRevealedSet(new Set(cards.map((_, i) => i)));
    setTimeout(() => {
      onComplete();
    }, 250);
  };

  return (
    <div className="relative w-full min-h-[75vh] flex flex-col items-center justify-center px-4 py-8 select-none">
      {/* Background Celestial Astrolabe Ring Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[500px] h-[500px] rounded-full border border-[#DAA87B]/40 animate-spin-slow" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-[#C6F68D]/30 border-dashed animate-spin-reverse-slow" />
      </div>

      {/* Top Header / Step indicator */}
      <div className="relative z-10 text-center mb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#172B38]/80 border border-[#DAA87B]/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C6F68D]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#E9DFC9]">
            Nghi thức Khai Mở: Lá {currentStep + 1} / {cards.length}
          </span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl text-[#E9DFC9] tracking-wide">
          {currentCard.position.nameVi}
        </h3>
        <p className="font-body text-xs md:text-sm text-[#B5AA94] max-w-md mx-auto mt-1">
          {currentCard.position.descriptionVi}
        </p>
      </div>

      {/* Center 3D Focus Card */}
      <div className="relative z-20 my-4 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.cardId}
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative"
          >
            {/* Luminous aura behind card */}
            <div
              className={`absolute -inset-4 rounded-2xl transition-opacity duration-700 pointer-events-none ${
                isCurrentRevealed ? "opacity-60 bg-gradient-to-t from-[#C6F68D]/20 via-[#DAA87B]/20 to-transparent blur-xl" : "opacity-0"
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

        {/* Card Name and Meaning Teaser after Reveal */}
        <AnimatePresence>
          {isCurrentRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-center mt-5 max-w-md px-4"
            >
              <div className="inline-block px-3 py-1 rounded bg-[#0B1020]/90 border border-[#C6F68D]/40 text-[#C6F68D] font-mono text-xs mb-1">
                {currentCard.orientation === "upright" ? "Vị trí Thuận (Upright)" : "Vị trí Ngược (Reversed)"}
              </div>
              <p className="font-body text-sm text-[#E9DFC9] leading-relaxed line-clamp-2">
                {currentCard.orientation === "upright"
                  ? currentCard.card.uprightMeaning
                  : currentCard.card.reversedMeaning}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Controls */}
      <div className="relative z-20 flex items-center space-x-4 mt-6">
        <button
          onClick={handleSkipAll}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-mono text-[#B5AA94] hover:text-[#E9DFC9] hover:bg-[#172B38]/60 transition-colors"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Lật tất cả</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentRevealed}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md ${
            isCurrentRevealed
              ? "bg-[#C6F68D] text-[#0B1020] hover:bg-[#A0D462] hover:shadow-celestial-glow cursor-pointer"
              : "bg-[#172B38] text-[#B5AA94]/50 border border-[#DAA87B]/20 cursor-not-allowed"
          }`}
        >
          <span>{isLastCard ? "Xem Diễn Giải Chi Tiết" : "Khai mở lá tiếp theo"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
