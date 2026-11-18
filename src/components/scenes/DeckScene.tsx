"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CardDeck } from "@/components/tarot/CardDeck";
import { CardBack } from "@/components/tarot/CardVisuals";
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

interface FlyingCardState {
  cardId: string;
  targetSlotIndex: number;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startRotate: number;
  liftY: number;
  targetX: number;
  targetY: number;
  targetWidth: number;
  targetHeight: number;
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

  const containerRef = useRef<HTMLDivElement>(null);

  // Dedicated refs for up to 3 destination spread slots
  const slotRef0 = useRef<HTMLDivElement>(null);
  const slotRef1 = useRef<HTMLDivElement>(null);
  const slotRef2 = useRef<HTMLDivElement>(null);
  const slotRefs = [slotRef0, slotRef1, slotRef2];

  // Active flight orchestration states
  const [flyingCard, setFlyingCard] = useState<FlyingCardState | null>(null);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
  const [isInteractionLocked, setIsInteractionLocked] = useState<boolean>(false);
  const [landingSlotIndex, setLandingSlotIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Card Selection with 5-Stage Cinematic Flight
  const handleCardSelectStart = (cardId: string, cardRect: DOMRect, fanRotation: number) => {
    if (isInteractionLocked || selectedCards.length >= targetCount) return;

    const targetIndex = selectedCards.length;
    const containerEl = containerRef.current;
    const slotEl = slotRefs[targetIndex]?.current;

    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!containerEl || !slotEl || prefersReducedMotion) {
      celestialAudio.playCardSelect();
      onCardSelect(cardId);
      return;
    }

    const containerRect = containerEl.getBoundingClientRect();
    const slotRect = slotEl.getBoundingClientRect();

    const startX = cardRect.left - containerRect.left;
    const startY = cardRect.top - containerRect.top;
    const startWidth = cardRect.width;
    const startHeight = cardRect.height;

    const targetX = slotRect.left - containerRect.left;
    const targetY = slotRect.top - containerRect.top;
    const targetWidth = slotRect.width;
    const targetHeight = slotRect.height;

    // Dynamic vertical headroom for the dramatic card lift (Stage 2)
    const liftY = startY - (isMobile ? 55 : 85);

    setIsInteractionLocked(true);
    setAnimatingCardId(cardId);
    setFlyingCard({
      cardId,
      targetSlotIndex: targetIndex,
      startX,
      startY,
      startWidth,
      startHeight,
      startRotate: fanRotation,
      liftY,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
    });

    celestialAudio.playCardSelect();
  };

  // Called when Stage 5 (Landing settle) completes
  const handleFlightComplete = () => {
    if (!flyingCard) return;

    const landedCardId = flyingCard.cardId;
    const landedIndex = flyingCard.targetSlotIndex;

    // Play tactile celestial affirmation chime on landing
    celestialAudio.playCardLand();

    // Trigger visual pulse affirmation on destination slot
    setLandingSlotIndex(landedIndex);

    // Formally commit card into tarot session state
    onCardSelect(landedCardId);

    // Clean up animation overlay
    setFlyingCard(null);
    setAnimatingCardId(null);
    setIsInteractionLocked(false);

    // Reset landing pulse after brief affirmation
    setTimeout(() => {
      setLandingSlotIndex(null);
    }, 450);
  };

  // Deselect card with soft return chime
  const handleSlotCardDeselect = (cardId: string) => {
    if (isInteractionLocked) return;
    celestialAudio.playCardDeselect();
    onCardDeselect(cardId);
  };

  // Dynamic context guidance subtitle
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
      ref={containerRef}
      className="relative min-h-[88vh] w-full flex flex-col justify-between px-3 sm:px-6 py-3 select-none bg-gradient-to-b from-[#192B38] via-[#152332] to-[#111E2C] overflow-hidden"
    >
      {/* Top Header: Breadcrumb & Active Reading Tags */}
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

      {/* Interactive Curved Fan Deck Stage */}
      <div className="my-auto w-full z-10">
        <CardDeck
          shuffledDeck={shuffledDeck}
          selectedCards={selectedCards}
          maxSelectable={targetCount}
          animatingCardId={animatingCardId}
          isInteractionLocked={isInteractionLocked}
          onCardSelectStart={handleCardSelectStart}
          onCardDeselect={handleSlotCardDeselect}
        />
      </div>

      {/* Destination Slots Section (3-Card Mode & 1-Card Mode) */}
      <div className="w-full max-w-3xl mx-auto pt-1 pb-2 flex flex-col items-center z-20">
        {spreadType === "three_card" ? (
          /* Three-Card Mode: Quá Khứ, Hiện Tại, Tương Lai */
          <div className="grid grid-cols-3 gap-2.5 sm:gap-6 w-full max-w-sm sm:max-w-md mx-auto justify-items-center mb-3">
            {spreadDef.positions.map((pos, idx) => {
              const card = selectedCards[idx];
              const isTargetSlot = selectedCards.length === idx && !isComplete;
              const isLanded = landingSlotIndex === idx;

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
                      {idx === 0 ? "Gốc rễ" : idx === 1 ? "Thực tại" : "Tiềm năng"}
                    </span>
                  </div>

                  <div
                    ref={slotRefs[idx]}
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
                        onClick={() => handleSlotCardDeselect(card.cardId)}
                        className="w-full h-full cursor-pointer group relative rounded-lg overflow-hidden p-0.5"
                        title="Chạm để đổi lá bài này"
                      >
                        <div className="w-full h-full rounded-lg overflow-hidden shadow-card-3d">
                          <CardBack />
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
                            isTargetSlot ? "text-[#DAB48A]" : "text-[#A7BBC0]/40"
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
          /* One-Card Mode: Thông Điệp Vũ Trụ (Ceremonial Focal Point) */
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
              className={`w-[110px] h-[176px] sm:w-[136px] sm:h-[220px] rounded-xl border-2 transition-all duration-300 relative flex items-center justify-center ${
                selectedCards[0]
                  ? "border-[#C7E9AD] bg-[#284450]/90 shadow-celestial-glow"
                  : "border-[#DAB48A]/60 border-dashed bg-[#192B38]/70 shadow-[0_0_20px_rgba(218,180,138,0.25)] animate-pulse"
              } ${landingSlotIndex === 0 ? "ring-4 ring-[#C7E9AD] scale-105" : ""}`}
            >
              {selectedCards[0] ? (
                <div
                  onClick={() => handleSlotCardDeselect(selectedCards[0].cardId)}
                  className="w-full h-full cursor-pointer group relative rounded-lg overflow-hidden p-0.5"
                  title="Chạm để đổi lá bài"
                >
                  <div className="w-full h-full rounded-lg overflow-hidden shadow-card-3d">
                    <CardBack />
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

        {/* Proceed Button (Visible when all cards are gathered) */}
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

      {/* Cinematic Flying Card Overlay: 5 Stages (Focus -> Lift -> Pause -> Guided Flight -> Settle) */}
      {flyingCard && (
        <motion.div
          className="absolute pointer-events-none z-50 rounded-xl"
          style={{
            left: 0,
            top: 0,
            width: flyingCard.startWidth,
            height: flyingCard.startHeight,
            transformOrigin: "center center",
          }}
          initial={{
            x: flyingCard.startX,
            y: flyingCard.startY,
            rotate: flyingCard.startRotate,
            scale: 1,
            width: flyingCard.startWidth,
            height: flyingCard.startHeight,
            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
          }}
          animate={{
            x: [
              flyingCard.startX, // Stage 1 Focus
              flyingCard.startX, // Stage 2 Lift Upward
              flyingCard.startX, // Stage 3 Pause Acknowledgment
              // Stage 4 Guided Arc Flight (mid-flight trajectory)
              (flyingCard.startX + flyingCard.targetX) / 2 +
                (flyingCard.startX < flyingCard.targetX ? -14 : 14),
              flyingCard.targetX, // Stage 4 Slot arrival
              flyingCard.targetX, // Stage 5 Landing settle
            ],
            y: [
              flyingCard.startY, // Stage 1
              flyingCard.liftY,  // Stage 2 Lift Upward
              flyingCard.liftY,  // Stage 3 Pause
              // Stage 4 Guided Arc Flight (smooth parabolic crest)
              Math.min(flyingCard.liftY, flyingCard.targetY) - (isMobile ? 18 : 30),
              flyingCard.targetY, // Stage 4 Slot arrival
              flyingCard.targetY, // Stage 5 Landing settle
            ],
            rotate: [
              flyingCard.startRotate,
              0,
              0,
              flyingCard.startX < flyingCard.targetX ? 4 : -4,
              0,
              0,
            ],
            scale: [
              1,
              1.15, // Stage 2: Elevated toward viewer
              1.16, // Stage 3: Ceremonial recognition hover
              1.08, // Stage 4: Dynamic flight scale
              1.03, // Stage 5: Arrival cushion
              1.0,  // Final settle
            ],
            width: [
              flyingCard.startWidth,
              flyingCard.startWidth,
              flyingCard.startWidth,
              (flyingCard.startWidth + flyingCard.targetWidth) / 2,
              flyingCard.targetWidth,
              flyingCard.targetWidth,
            ],
            height: [
              flyingCard.startHeight,
              flyingCard.startHeight,
              flyingCard.startHeight,
              (flyingCard.startHeight + flyingCard.targetHeight) / 2,
              flyingCard.targetHeight,
              flyingCard.targetHeight,
            ],
            filter: [
              "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
              "drop-shadow(0 15px 30px rgba(199,233,173,0.45)) drop-shadow(0 0 20px rgba(218,180,138,0.35))",
              "drop-shadow(0 18px 35px rgba(199,233,173,0.5)) drop-shadow(0 0 25px rgba(218,180,138,0.4))",
              "drop-shadow(0 12px 25px rgba(199,233,173,0.4))",
              "drop-shadow(0 6px 15px rgba(199,233,173,0.3))",
              "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
            ],
          }}
          transition={{
            duration: 1.45,
            times: [0, 0.25, 0.38, 0.65, 0.88, 1.0],
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={handleFlightComplete}
        >
          <div className="w-full h-full rounded-xl overflow-hidden shadow-card-3d border border-[#DAB48A]/60">
            <CardBack />
            {/* Celestial shimmer sweep across card face during pause & flight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C7E9AD]/20 to-transparent pointer-events-none animate-pulse" />
          </div>
        </motion.div>
      )}
    </div>
  );
};
