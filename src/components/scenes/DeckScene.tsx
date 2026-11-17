"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CardDeck } from "@/components/tarot/CardDeck";
import { TarotCard } from "@/components/tarot/TarotCard";
import { getCardById } from "@/data/tarot/cards";
import { getSpreadDef } from "@/data/tarot/spreads";
import { QuestionCategory, SelectedCard, SpreadType } from "@/types/tarot";
import { ArrowLeft, Sparkles, Wand2, ShieldAlert } from "lucide-react";

interface DeckSceneProps {
  shuffledDeck: string[];
  selectedCards: SelectedCard[];
  spreadType: SpreadType;
  category: QuestionCategory;
  question: string;
  onCardSelect: (cardId: string) => void;
  onCardDeselect: (cardId: string) => void;
  onProceedToReveal: () => void;
  onBackToQuestion: () => void;
}

export const DeckScene: React.FC<DeckSceneProps> = ({
  shuffledDeck,
  selectedCards,
  spreadType,
  category,
  question,
  onCardSelect,
  onCardDeselect,
  onProceedToReveal,
  onBackToQuestion,
}) => {
  const spreadDef = getSpreadDef(spreadType);
  const targetCount = spreadDef.cardCount;
  const isComplete = selectedCards.length === targetCount;

  return (
    <div className="relative min-h-[85vh] w-full flex flex-col justify-between px-4 py-4 select-none">
      {/* Top Breadcrumb & Active Reading Info */}
      <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 border-b border-[#DAA87B]/20 pb-4">
        <button
          onClick={onBackToQuestion}
          className="flex items-center space-x-1.5 font-mono text-xs text-[#B5AA94] hover:text-[#E9DFC9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Đổi câu hỏi</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#172B38] border border-[#DAA87B]/30 text-[#DAA87B]">
            {category}
          </span>
          <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#172B38] border border-[#C6F68D]/30 text-[#C6F68D]">
            {spreadDef.nameVi.split("—")[0]}
          </span>
        </div>
      </div>

      {/* User Question Banner */}
      <div className="w-full max-w-2xl mx-auto text-center my-2">
        <p className="font-display text-xl md:text-2xl text-[#E9DFC9] font-light italic">
          "{question || "Khám phá thông điệp vũ trụ cho hiện tại"}"
        </p>
      </div>

      {/* Main Interactive Curved Fan Deck */}
      <div className="my-auto w-full">
        <CardDeck
          shuffledDeck={shuffledDeck}
          selectedCards={selectedCards}
          maxSelectable={targetCount}
          onCardSelect={onCardSelect}
          onCardDeselect={onCardDeselect}
        />
      </div>

      {/* Selected Cards Staging Slots & Continue CTA */}
      <div className="w-full max-w-3xl mx-auto pt-4 flex flex-col items-center">
        {/* Visual Spread Slots */}
        <div className="flex items-center justify-center gap-4 mb-5">
          {spreadDef.positions.map((pos, idx) => {
            const currentSelected = selectedCards[idx];
            const cardData = currentSelected ? getCardById(currentSelected.cardId) : undefined;

            return (
              <div key={pos.id} className="flex flex-col items-center">
                <span className="font-mono text-[10px] text-[#B5AA94] uppercase mb-1">
                  {pos.nameVi.split("(")[0]}
                </span>
                <div
                  className={`w-[75px] h-[120px] rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
                    currentSelected
                      ? "border-[#C6F68D] bg-[#172B38]/80 shadow-celestial-glow"
                      : "border-[#DAA87B]/30 bg-[#0B1020]/50"
                  }`}
                >
                  {currentSelected ? (
                    <TarotCard
                      card={cardData}
                      size="sm"
                      className="w-full h-full scale-[0.58] origin-center pointer-events-none"
                    />
                  ) : (
                    <span className="font-mono text-xs text-[#B5AA94]/50">
                      0{idx + 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Proceed Button */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <button
                onClick={onProceedToReveal}
                className="inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#C6F68D] text-[#0B1020] font-mono text-xs uppercase tracking-widest font-bold shadow-celestial-glow hover:bg-[#A0D462] hover:scale-105 transition-all cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>Tiến Hành Khai Mở (Reveal)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
