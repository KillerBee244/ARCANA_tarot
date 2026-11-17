"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CardDeck } from "@/components/tarot/CardDeck";
import { TarotCard } from "@/components/tarot/TarotCard";
import { getCardById } from "@/data/tarot/cards";
import { getSpreadDef } from "@/data/tarot/spreads";
import { QuestionCategory, SelectedCard, SpreadType } from "@/types/tarot";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";

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
    <div className="relative min-h-[88vh] w-full flex flex-col justify-between px-4 py-4 select-none bg-gradient-to-b from-[#192B38] via-[#152332] to-[#111E2C]">
      {/* Top Breadcrumb & Active Reading Info */}
      <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 border-b border-[#DAB48A]/20 pb-3">
        <button
          onClick={onBackToQuestion}
          className="flex items-center space-x-1.5 font-body text-xs text-[#C1CFD0] hover:text-[#F4EADA] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Đổi câu hỏi</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-body text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#284450] border border-[#DAB48A]/40 text-[#DAB48A] font-medium">
            {category}
          </span>
          <span className="font-body text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#284450] border border-[#C7E9AD]/40 text-[#C7E9AD] font-medium">
            {spreadDef.nameVi.split("—")[0]}
          </span>
        </div>
      </div>

      {/* User Question Banner (Fraunces Editorial Title) */}
      <div className="w-full max-w-2xl mx-auto text-center my-1.5">
        <p className="font-display text-xl sm:text-2xl text-[#F4EADA] font-light italic leading-relaxed">
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

      {/* Selected Cards Staging Slots & Continue CTA (Closer to Deck) */}
      <div className="w-full max-w-3xl mx-auto pt-2 pb-4 flex flex-col items-center z-20">
        {/* Visual Spread Slots */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
          {spreadDef.positions.map((pos, idx) => {
            const currentSelected = selectedCards[idx];
            const cardData = currentSelected ? getCardById(currentSelected.cardId) : undefined;

            return (
              <div key={pos.id} className="flex flex-col items-center">
                <span className="font-body text-[11px] text-[#C1CFD0] font-medium mb-1">
                  {pos.nameVi.split("(")[0]}
                </span>
                <div
                  className={`w-[72px] h-[116px] rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
                    currentSelected
                      ? "border-[#C7E9AD] bg-[#284450]/90 shadow-celestial-glow"
                      : "border-[#DAB48A]/35 bg-[#192B38]/60"
                  }`}
                >
                  {currentSelected ? (
                    <TarotCard
                      card={cardData}
                      size="sm"
                      className="w-full h-full scale-[0.55] origin-center pointer-events-none"
                    />
                  ) : (
                    <span className="font-mono text-xs text-[#A7BBC0]/60">
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
                className="inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#C7E9AD] text-[#111E2C] font-body text-sm font-semibold tracking-wide shadow-celestial-glow hover:bg-[#A4D283] hover:scale-105 transition-all cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>Tiến hành Khai Mở</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
