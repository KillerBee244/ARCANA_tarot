"use client";

import React from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { CardDeck } from "@/components/tarot/CardDeck";
import { TarotCard } from "@/components/tarot/TarotCard";
import { getSpreadDef } from "@/data/tarot/spreads";
import { QuestionCategory, SelectedCard, SpreadType } from "@/types/tarot";
import { ArrowLeft, Wand2 } from "lucide-react";
import { getCategoryLabelVi } from "@/data/tarot/categories";

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
    <LayoutGroup id="tarot-card-selection-flow">
      <div className="relative min-h-[88vh] w-full flex flex-col justify-between px-3 sm:px-4 py-4 select-none bg-gradient-to-b from-[#192B38] via-[#152332] to-[#111E2C]">
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
              {getCategoryLabelVi(category)}
            </span>
            <span className="font-body text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#284450] border border-[#C7E9AD]/40 text-[#C7E9AD] font-medium">
              {spreadDef.nameVi.split("—")[0]}
            </span>
          </div>
        </div>

        {/* User Question Banner (Fraunces Editorial Title) */}
        <div className="w-full max-w-2xl mx-auto text-center my-1">
          <p className="font-display text-lg sm:text-2xl text-[#F4EADA] font-light italic leading-relaxed">
            &ldquo;{question || "Khám phá thông điệp vũ trụ cho hiện tại"}&rdquo;
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

        {/* Selected Cards Staging Slots: Cards Fly Here Directly From the Fan! */}
        <div className="w-full max-w-3xl mx-auto pt-2 pb-3 flex flex-col items-center z-20">
          {/* Visual Spread Slots */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            {spreadDef.positions.map((pos, idx) => {
              const currentSelected = selectedCards[idx];

              return (
                <div key={pos.id} className="flex flex-col items-center">
                  <span className="font-body text-[11px] sm:text-xs text-[#C1CFD0] font-medium mb-1.5">
                    {pos.nameVi.split("(")[0]}
                  </span>
                  <div
                    className={`w-[66px] h-[106px] sm:w-[78px] sm:h-[126px] rounded-xl border-2 border-dashed flex items-center justify-center transition-all relative ${
                      currentSelected
                        ? "border-[#C7E9AD] bg-[#284450]/80 shadow-celestial-glow"
                        : "border-[#DAB48A]/35 bg-[#192B38]/60"
                    }`}
                  >
                    {currentSelected ? (
                      <motion.div
                        layoutId={`deck-card-${currentSelected.cardId}`}
                        onClick={() => onCardDeselect(currentSelected.cardId)}
                        className="w-full h-full cursor-pointer group relative flex items-center justify-center p-0.5 rounded-xl"
                        title="Chạm để rút lại vào bộ bài"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 26,
                        }}
                      >
                        <TarotCard
                          size="xs"
                          className="w-full h-full pointer-events-none rounded-lg"
                          isFlipped={false}
                        />
                        {/* Hover / Tap overlay to change card */}
                        <div className="absolute inset-0 rounded-lg ring-2 ring-[#C7E9AD] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-[#111E2C]/60 backdrop-blur-[1px]">
                          <span className="text-[10px] font-mono text-[#C7E9AD] font-bold">Đổi</span>
                        </div>
                      </motion.div>
                    ) : (
                      <span className="font-mono text-xs text-[#A7BBC0]/50">
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
    </LayoutGroup>
  );
};
