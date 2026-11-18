"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CylindricalTarotCarousel } from "@/components/tarot/CylindricalTarotCarousel";
import { CardFlightPortal } from "@/components/tarot/CardFlightPortal";
import { CardBack } from "@/components/tarot/CardVisuals";
import {
  PendingCardFlight,
  SelectionAnimationPhase,
} from "@/components/tarot/motionConfig";
import { getSpreadDef } from "@/data/tarot/spreads";
import { QuestionCategory, SelectedCard, SpreadType } from "@/types/tarot";
import { ArrowLeft, Wand2, Sparkles, RefreshCw } from "lucide-react";
import { getCategoryLabelVi } from "@/data/tarot/categories";
import { celestialAudio } from "@/lib/sound/celestialAudio";

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

  // Dedicated refs for destination spread slots
  const slotRef0 = useRef<HTMLDivElement>(null);
  const slotRef1 = useRef<HTMLDivElement>(null);
  const slotRef2 = useRef<HTMLDivElement>(null);
  const slotRefs = [slotRef0, slotRef1, slotRef2];

  // Animation & Flight State Coordinator
  const [reservedCardId, setReservedCardId] = useState<string | null>(null);
  const [pendingFlight, setPendingFlight] = useState<PendingCardFlight | null>(null);
  const [isInteractionLocked, setIsInteractionLocked] = useState<boolean>(false);
  const [landingSlotIndex, setLandingSlotIndex] = useState<number | null>(null);
  const [currentPhase, setCurrentPhase] = useState<SelectionAnimationPhase>("idle");

  // User taps a card in the 3D cylindrical carousel
  const handleCarouselCardSelect = useCallback(
    (cardId: string, _cardEl: HTMLElement, cardRect: DOMRect) => {
      if (isInteractionLocked || selectedCards.length >= targetCount) return;

      const targetIndex = selectedCards.length;
      const slotEl = slotRefs[targetIndex]?.current;

      if (!slotEl) {
        celestialAudio.playCardSelect();
        onCardSelect(cardId);
        return;
      }

      const slotRect = slotEl.getBoundingClientRect();

      // Lock interaction and immediately reserve card in carousel
      setIsInteractionLocked(true);
      setReservedCardId(cardId);
      setCurrentPhase("acknowledge");

      setPendingFlight({
        cardId,
        destinationIndex: targetIndex,
        sourceRect: {
          left: cardRect.left,
          top: cardRect.top,
          width: cardRect.width,
          height: cardRect.height,
        },
        targetRect: {
          left: slotRect.left,
          top: slotRect.top,
          width: slotRect.width,
          height: slotRect.height,
        },
      });

      celestialAudio.playCardSelect();
    },
    [isInteractionLocked, selectedCards.length, targetCount, onCardSelect]
  );

  // Flight sequence complete handoff
  const handleFlightComplete = useCallback(
    (cardId: string, destinationIndex: number) => {
      // Landing confirmation chime & pulse
      celestialAudio.playCardLand();
      setLandingSlotIndex(destinationIndex);

      // Formally commit card to persistent Tarot state
      onCardSelect(cardId);

      // Clean up flight overlay & release interaction lock
      setPendingFlight(null);
      setReservedCardId(null);
      setIsInteractionLocked(false);
      setCurrentPhase("committed");

      setTimeout(() => {
        setLandingSlotIndex(null);
        setCurrentPhase("idle");
      }, 450);
    },
    [onCardSelect]
  );

  // Deselect card with soft return chime
  const handleSlotDeselect = (cardId: string) => {
    if (isInteractionLocked) return;
    celestialAudio.playCardDeselect();
    onCardDeselect(cardId);
  };

  // Dynamic instructional guidance text
  const getGuidanceText = () => {
    if (isComplete) {
      return "Đã chọn đủ bài định mệnh. Chạm 'Tiến hành Khai Mở' bên dưới để bắt đầu nghi thức";
    }
    if (spreadType === "single") {
      return "Lắng nghe trực giác và chạm vào lá bài mang Thông Điệp Vũ Trụ cho bạn";
    }
    const currentIdx = selectedCards.length;
    if (currentIdx === 0) {
      return "Chạm vào lá bài bạn cảm nhận rõ nhất để chọn cho Quá Khứ (Gốc rễ)";
    }
    if (currentIdx === 1) {
      return "Tiếp tục lắng nghe trực giác để chọn lá bài cho Hiện Tại (Thực tại)";
    }
    return "Chọn lá bài cuối cùng soi tỏ hướng đi trong Tương Lai (Tiềm năng)";
  };

  return (
    <div
      data-testid="tarot-selection-scene"
      data-animation-phase={currentPhase}
      className="relative min-h-[88vh] w-full flex flex-col justify-between px-3 sm:px-6 py-3 select-none bg-gradient-to-b from-[#192B38] via-[#152332] to-[#111E2C] overflow-hidden"
    >
      {/* Top Header: Breadcrumb & Active Reading Info */}
      <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 border-b border-[#DAB48A]/20 pb-2.5 z-20">
        <button
          onClick={onBackToQuestion}
          disabled={isInteractionLocked}
          className="flex items-center space-x-1.5 font-body text-xs text-[#C1CFD0] hover:text-[#F4EADA] transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Đổi câu hỏi</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-body text-[11px] sm:text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#284450] border border-[#DAB48A]/40 text-[#DAB48A] font-medium">
            {getCategoryLabelVi(category)}
          </span>
          <span className="font-body text-[11px] sm:text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#284450] border border-[#C7E9AD]/40 text-[#C7E9AD] font-medium">
            {spreadDef.nameVi.split("—")[0]}
          </span>
        </div>
      </div>

      {/* User Question Banner (Fraunces Editorial Title) */}
      <div className="w-full max-w-2xl mx-auto text-center my-1 z-20">
        <p className="font-display text-base sm:text-xl text-[#F4EADA] font-light italic leading-relaxed px-2">
          &ldquo;{question || "Khám phá thông điệp vũ trụ cho hiện tại"}&rdquo;
        </p>
      </div>

      {/* Selection Progress Chip & Intuitive Guidance */}
      <div className="flex flex-col items-center text-center my-1 z-20">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#284450]/90 border border-[#DAB48A]/40 backdrop-blur-md shadow-sm">
          <span
            className={`w-2 h-2 rounded-full ${
              isComplete ? "bg-[#C7E9AD]" : "bg-[#DAB48A] animate-pulse"
            }`}
          />
          <span className="font-body text-xs text-[#F4EADA] font-semibold tracking-wide">
            Đã chọn {selectedCards.length} / {targetCount} lá bài
          </span>
        </div>
        <p className="font-body text-[11px] sm:text-xs text-[#C1CFD0] mt-1.5 px-4 max-w-md transition-all">
          {getGuidanceText()}
        </p>
      </div>

      {/* 3D CYLINDRICAL TAROT CAROUSEL STAGE */}
      <div className="my-auto w-full z-10">
        <CylindricalTarotCarousel
          shuffledDeck={shuffledDeck}
          selectedCardIds={selectedCards.map((sc) => sc.cardId)}
          reservedCardId={reservedCardId}
          isInteractionLocked={isInteractionLocked}
          onCardSelect={handleCarouselCardSelect}
        />
      </div>

      {/* DESTINATION SPREAD SLOTS */}
      <div className="w-full max-w-3xl mx-auto pt-1 pb-2 flex flex-col items-center z-20">
        {spreadType === "three_card" ? (
          /* Three-Card Mode: Quá Khứ, Hiện Tại, Tương Lai */
          <div className="grid grid-cols-3 gap-2.5 sm:gap-6 w-full max-w-sm sm:max-w-md mx-auto justify-items-center mb-3">
            {spreadDef.positions.map((pos, idx) => {
              const card = selectedCards[idx];
              const isTargetSlot = selectedCards.length === idx && !isComplete;
              const isLanded = landingSlotIndex === idx;
              const slotTestId =
                idx === 0
                  ? "slot-past"
                  : idx === 1
                  ? "slot-present"
                  : "slot-future";

              return (
                <div key={pos.id} className="flex flex-col items-center w-full">
                  <div className="flex flex-col items-center mb-1 text-center">
                    <span
                      className={`font-body text-[11px] sm:text-xs font-semibold transition-colors ${
                        card
                          ? "text-[#C7E9AD]"
                          : isTargetSlot
                          ? "text-[#DAB48A]"
                          : "text-[#A7BBC0]/70"
                      }`}
                    >
                      {pos.nameVi.split("(")[0].trim()}
                    </span>
                    <span className="font-mono text-[9px] text-[#A7BBC0]/50 hidden sm:inline">
                      {idx === 0
                        ? "Gốc rễ"
                        : idx === 1
                        ? "Thực tại"
                        : "Tiềm năng"}
                    </span>
                  </div>

                  <div
                    ref={slotRefs[idx]}
                    data-testid={slotTestId}
                    className={`w-[78px] h-[126px] sm:w-[94px] sm:h-[152px] rounded-xl border-2 transition-all duration-300 relative flex items-center justify-center ${
                      card
                        ? "border-[#C7E9AD]/80 bg-[#284450]/80 shadow-celestial-glow"
                        : isTargetSlot
                        ? "border-[#DAB48A]/70 bg-[#192B38]/80 shadow-[0_0_15px_rgba(218,180,138,0.25)] animate-pulse"
                        : "border-[#DAB48A]/30 border-dashed bg-[#192B38]/50"
                    } ${isLanded ? "ring-4 ring-[#C7E9AD] scale-105" : ""}`}
                  >
                    {card ? (
                      <div
                        onClick={() => handleSlotDeselect(card.cardId)}
                        className="w-full h-full cursor-pointer group relative rounded-lg overflow-hidden p-0.5"
                        title="Chạm để đổi lá bài này"
                      >
                        <div className="w-full h-full rounded-lg overflow-hidden shadow-card-3d">
                          <CardBack className="w-full h-full" />
                        </div>
                        {/* Hover & Tap overlay to change card */}
                        <div className="absolute inset-0 rounded-lg bg-[#111E2C]/75 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                          <RefreshCw className="w-3.5 h-3.5 text-[#C7E9AD] mb-0.5" />
                          <span className="text-[10px] font-body text-[#C7E9AD] font-bold">
                            Đổi lá
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-1 pointer-events-none">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            isTargetSlot
                              ? "text-[#DAB48A]"
                              : "text-[#A7BBC0]/40"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        {isTargetSlot && (
                          <span className="text-[9px] font-body text-[#DAB48A]/90 mt-1 uppercase tracking-wider font-medium">
                            Chờ rút
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* One-Card Mode: Thông Điệp Vũ Trụ (Ceremonial Focal Slot) */
          <div className="flex flex-col items-center w-full max-w-xs mx-auto mb-3">
            <div className="flex flex-col items-center mb-1.5 text-center">
              <span className="font-display text-xs sm:text-sm text-[#DAB48A] font-semibold tracking-wide">
                Thông Điệp Vũ Trụ
              </span>
              <span className="font-body text-[10px] text-[#A7BBC0]/70">
                Tâm điểm soi tỏ mọi chiều không gian
              </span>
            </div>

            <div
              ref={slotRefs[0]}
              data-testid="slot-universe"
              className={`w-[110px] h-[176px] sm:w-[136px] sm:h-[220px] rounded-xl border-2 transition-all duration-300 relative flex items-center justify-center ${
                selectedCards[0]
                  ? "border-[#C7E9AD] bg-[#284450]/90 shadow-celestial-glow"
                  : "border-[#DAB48A]/60 border-dashed bg-[#192B38]/70 shadow-[0_0_20px_rgba(218,180,138,0.25)] animate-pulse"
              } ${landingSlotIndex === 0 ? "ring-4 ring-[#C7E9AD] scale-105" : ""}`}
            >
              {selectedCards[0] ? (
                <div
                  onClick={() => handleSlotDeselect(selectedCards[0].cardId)}
                  className="w-full h-full cursor-pointer group relative rounded-lg overflow-hidden p-0.5"
                  title="Chạm để đổi lá bài"
                >
                  <div className="w-full h-full rounded-lg overflow-hidden shadow-card-3d">
                    <CardBack className="w-full h-full" />
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-[#111E2C]/75 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                    <RefreshCw className="w-4 h-4 text-[#C7E9AD] mb-1" />
                    <span className="text-xs font-body text-[#C7E9AD] font-bold">
                      Đổi lá bài
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2 pointer-events-none">
                  <Sparkles className="w-6 h-6 text-[#DAB48A] animate-pulse mb-1" />
                  <span className="text-xs font-display text-[#DAB48A]/90 font-medium">
                    Tâm Điểm
                  </span>
                  <span className="text-[10px] font-body text-[#A7BBC0]/70 mt-0.5">
                    Chạm bài bên trên
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proceed CTA Button */}
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence>
            {isComplete && !isInteractionLocked && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <button
                  onClick={onProceedToReveal}
                  className="inline-flex items-center space-x-2.5 px-7 py-3 rounded-full bg-[#C7E9AD] text-[#111E2C] font-body text-sm font-semibold tracking-wide shadow-celestial-glow hover:bg-[#A4D283] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Tiến hành Khai Mở</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DEDICATED FIXED FLIGHT PORTAL OVERLAY */}
      <CardFlightPortal
        flight={pendingFlight}
        onComplete={handleFlightComplete}
        onPhaseChange={setCurrentPhase}
      />
    </div>
  );
};
