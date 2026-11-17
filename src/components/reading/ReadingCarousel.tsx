"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Compass,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Copy,
  Bookmark,
  RotateCcw,
  Check,
  Share2,
} from "lucide-react";
import { PopulatedCard, QuestionCategory, RulebaseInterpretation, SpreadType } from "@/types/tarot";
import { AIInterpretationResult, AIStatus } from "@/types/reading";
import { getCategoryLabelVi } from "@/data/tarot/categories";
import { TarotCard } from "@/components/tarot/TarotCard";

interface ReadingCarouselProps {
  readingId: string;
  userName?: string;
  question: string;
  category: QuestionCategory;
  spreadType: SpreadType;
  populatedCards: PopulatedCard[];
  rulebaseResult: RulebaseInterpretation;
  aiStatus: AIStatus;
  aiResult: AIInterpretationResult | null;
  onRetryAI: () => void;
  onSave: () => void;
  onCopy: () => void;
  onRestart: () => void;
  isSaved?: boolean;
}

export const ReadingCarousel: React.FC<ReadingCarouselProps> = ({
  readingId,
  userName,
  question,
  category,
  spreadType,
  populatedCards,
  rulebaseResult,
  aiStatus,
  aiResult,
  onRetryAI,
  onSave,
  onCopy,
  onRestart,
  isSaved = false,
}) => {
  // Active reading mode: "ai" if AI succeeded, otherwise "rulebase"
  const hasAi = aiStatus === "success" && aiResult !== null;
  const [readingMode, setReadingMode] = useState<"ai" | "rulebase">(hasAi ? "ai" : "rulebase");

  // Sync mode if AI finishes later
  useEffect(() => {
    if (hasAi) {
      setReadingMode("ai");
    }
  }, [hasAi]);

  // Current Card index: 0, 1, 2, 3
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  const CARD_TABS = [
    { id: 0, label: "Tổng quan", icon: Compass },
    { id: 1, label: "Từng lá bài", icon: Sparkles },
    { id: 2, label: "Luận giải", icon: BookOpen },
    { id: 3, label: "Tự vấn & Đúc kết", icon: HelpCircle },
  ];

  const goToCard = (index: number) => {
    if (index === currentCardIndex) return;
    setSlideDirection(index > currentCardIndex ? 1 : -1);
    setCurrentCardIndex(index);
  };

  const handleNext = useCallback(() => {
    if (currentCardIndex < 3) {
      setSlideDirection(1);
      setCurrentCardIndex((prev) => prev + 1);
    }
  }, [currentCardIndex]);

  const handlePrev = useCallback(() => {
    if (currentCardIndex > 0) {
      setSlideDirection(-1);
      setCurrentCardIndex((prev) => prev - 1);
    }
  }, [currentCardIndex]);

  // Keyboard navigation (ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch Swipe Handler with Framer Motion drag
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -500) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 500) {
      handlePrev();
    }
  };

  const displayName = userName?.trim() || "Lữ khách";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none py-2 px-2 sm:px-4">
      {/* 1. Top Source Switcher & Visitor Indicator */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
        {/* Source Mode Toggle */}
        <div className="inline-flex items-center p-1 rounded-full bg-[#111E2C] border border-[#DAB48A]/30 shadow-inner">
          <button
            onClick={() => setReadingMode("ai")}
            disabled={!hasAi}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all cursor-pointer ${
              readingMode === "ai"
                ? "bg-gradient-to-r from-[#284450] to-[#1E3B34] text-[#C7E9AD] border border-[#C7E9AD]/50 shadow-sm"
                : hasAi
                ? "text-[#A7BBC0] hover:text-[#F4EADA]"
                : "text-[#A7BBC0]/40 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C7E9AD]" />
            <span>Góc nhìn AI {hasAi ? "(Gemini)" : "(Đang tải...)"}</span>
          </button>

          <button
            onClick={() => setReadingMode("rulebase")}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all cursor-pointer ${
              readingMode === "rulebase"
                ? "bg-[#DAB48A] text-[#111E2C] font-semibold shadow-sm"
                : "text-[#A7BBC0] hover:text-[#F4EADA]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cổ thư truyền thống (RWS)</span>
          </button>
        </div>

        {/* Lữ khách badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#223846] border border-[#DAB48A]/25 text-xs font-body text-[#F4EADA]">
          <span className="text-[#C7E9AD]">✦ Lữ khách:</span>
          <span className="font-semibold">{displayName}</span>
        </div>
      </div>

      {/* 2. Visual Pagination Tabs Bar */}
      <div className="w-full flex items-center justify-between gap-1 sm:gap-2 mb-4 bg-[#111E2C]/60 p-1.5 rounded-2xl border border-[#DAB48A]/20">
        {CARD_TABS.map((tab) => {
          const isActive = tab.id === currentCardIndex;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => goToCard(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-1 sm:px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-[#284450] border border-[#DAB48A]/50 text-[#F4EADA] shadow-md"
                  : "text-[#A7BBC0]/70 hover:text-[#F4EADA] hover:bg-[#192B38]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C7E9AD]" : "text-[#A7BBC0]/60"}`} />
              <span className={`text-[11px] sm:text-xs font-body ${isActive ? "font-semibold text-[#F4EADA]" : "font-normal"}`}>
                <span className="hidden sm:inline">Thẻ {tab.id + 1}: </span>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. The Main Swipeable Card Stage (Single card view, no huge scroll) */}
      <div className="relative w-full min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
        {/* Floating Left Navigation Button */}
        {currentCardIndex > 0 && (
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute -left-5 z-30 w-10 h-10 rounded-full bg-[#284450]/90 border border-[#DAB48A]/40 items-center justify-center text-[#F4EADA] hover:bg-[#385968] hover:scale-110 transition-all shadow-lg cursor-pointer"
            aria-label="Thẻ trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Floating Right Navigation Button */}
        {currentCardIndex < 3 && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute -right-5 z-30 w-10 h-10 rounded-full bg-[#284450]/90 border border-[#DAB48A]/40 items-center justify-center text-[#F4EADA] hover:bg-[#385968] hover:scale-110 transition-all shadow-lg cursor-pointer"
            aria-label="Thẻ kế tiếp"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Animated Carousel Card Container */}
        <div className="w-full h-full relative overflow-hidden">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={`${readingMode}-${currentCardIndex}`}
              custom={slideDirection}
              initial={{ opacity: 0, x: slideDirection > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection > 0 ? -80 : 80 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="w-full bg-[#192B38] border border-[#DAB48A]/40 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between"
            >
              {/* ========================================================= */}
              {/* CARD 1: KHỞI DUYÊN & TỔNG QUAN NĂNG LƯỢNG */}
              {/* ========================================================= */}
              {currentCardIndex === 0 && (
                <div className="space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-[#DAB48A]/20 pb-3">
                    <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#DAB48A]">
                      <Compass className="w-4 h-4 text-[#C7E9AD]" />
                      <span>THẺ 1/4 • KHỞI DUYÊN & TỔNG QUAN</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#A7BBC0]/70">
                      CHỦ ĐỀ: {getCategoryLabelVi(category).toUpperCase()}
                    </span>
                  </div>

                  {/* Question Banner */}
                  <div className="p-3.5 rounded-xl bg-[#223846]/80 border border-[#DAB48A]/25">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#DAB48A] block">
                      Ý nguyện thỉnh bài:
                    </span>
                    <p className="font-display text-base sm:text-lg text-[#F4EADA] font-light italic mt-0.5">
                      &ldquo;{question || "Khám phá thông điệp vũ trụ cho hiện tại"}&rdquo;
                    </p>
                  </div>

                  {/* Compact 3-Cards Visual Row */}
                  <div className="flex items-center justify-center gap-2 sm:gap-4 py-2">
                    {populatedCards.map((c, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center bg-[#111E2C]/70 border border-[#DAB48A]/30 rounded-xl p-2 sm:p-2.5 text-center flex-1 max-w-[140px]"
                      >
                        <span className="text-[10px] font-mono text-[#A7BBC0] block mb-1">
                          {c.position.nameVi.split("(")[0]}
                        </span>
                        <div className="w-[45px] h-[75px] sm:w-[55px] sm:h-[90px] mb-1.5 shadow-md">
                          <TarotCard
                            card={c.card}
                            isFlipped={true}
                            orientation={c.orientation}
                            size="sm"
                            className="w-full h-full pointer-events-none"
                          />
                        </div>
                        <span className="font-display text-[11px] sm:text-xs text-[#F4EADA] font-medium truncate w-full">
                          {c.card.nameVi}
                        </span>
                        <span
                          className={`text-[9px] font-mono mt-0.5 px-1.5 py-0.2 rounded-full ${
                            c.orientation === "upright"
                              ? "bg-[#C7E9AD]/20 text-[#C7E9AD]"
                              : "bg-[#E8A598]/20 text-[#E8A598]"
                          }`}
                        >
                          {c.orientation === "upright" ? "Thuận" : "Ngược"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Core Overview Synthesis */}
                  <div className="p-4 rounded-2xl bg-[#223846]/90 border border-[#80BDB2]/40 shadow-inner">
                    <h4 className="font-display text-base sm:text-lg text-[#C7E9AD] font-medium mb-1.5 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#C7E9AD]" />
                      <span>
                        {readingMode === "ai" && aiResult ? aiResult.title : "Dòng Chảy Năng Lượng Vũ Trụ"}
                      </span>
                    </h4>
                    <p className="font-body text-xs sm:text-sm text-[#F4EADA]/90 leading-relaxed">
                      {readingMode === "ai" && aiResult
                        ? aiResult.overview
                        : rulebaseResult.overviewSynthesis}
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CARD 2: CHIÊM NGHIỆM TỪNG LÁ BÀI */}
              {/* ========================================================= */}
              {currentCardIndex === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#DAB48A]/20 pb-3">
                    <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#DAB48A]">
                      <Sparkles className="w-4 h-4 text-[#C7E9AD]" />
                      <span>THẺ 2/4 • CHIÊM NGHIỆM TỪNG LÁ BÀI</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#A7BBC0]/70">
                      {populatedCards.length} LÁ BÀI ĐÃ KHAI MỞ
                    </span>
                  </div>

                  {/* Cards Interpretation Stack */}
                  <div className="space-y-3">
                    {populatedCards.map((pc, i) => {
                      // Find connection text from AI if available
                      const aiConn =
                        readingMode === "ai" && aiResult
                          ? aiResult.cardConnections.find((conn) => conn.cardId === pc.card.id)
                          : null;

                      const meaningText = aiConn
                        ? aiConn.connectionText
                        : `${pc.position.descriptionVi} ${pc.orientation === "upright" ? pc.card.uprightMeaning : pc.card.reversedMeaning}`;

                      return (
                        <div
                          key={i}
                          className="p-3.5 sm:p-4 rounded-xl bg-[#223846]/80 border border-[#DAB48A]/30 flex items-start space-x-3.5 hover:border-[#C7E9AD]/50 transition-colors"
                        >
                          {/* Mini Card Badge */}
                          <div className="flex-shrink-0 w-11 h-16 sm:w-12 sm:h-18 rounded-lg overflow-hidden border border-[#DAB48A]/40 shadow-sm">
                            <TarotCard
                              card={pc.card}
                              isFlipped={true}
                              orientation={pc.orientation}
                              size="sm"
                              className="w-full h-full pointer-events-none"
                            />
                          </div>

                          {/* Card Meaning Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                              <span className="font-display text-sm sm:text-base text-[#F4EADA] font-medium">
                                {pc.card.nameVi}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                  pc.orientation === "upright"
                                    ? "bg-[#C7E9AD]/20 text-[#C7E9AD] border border-[#C7E9AD]/30"
                                    : "bg-[#E8A598]/20 text-[#E8A598] border border-[#E8A598]/30"
                                }`}
                              >
                                {pc.position.nameVi} • {pc.orientation === "upright" ? "Thuận" : "Ngược"}
                              </span>
                            </div>
                            <p className="font-body text-xs sm:text-sm text-[#C1CFD0] leading-relaxed">
                              {meaningText}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CARD 3: LỜI LUẬN GIẢI CÁ NHÂN HÓA */}
              {/* ========================================================= */}
              {currentCardIndex === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#DAB48A]/20 pb-3">
                    <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#DAB48A]">
                      <BookOpen className="w-4 h-4 text-[#C7E9AD]" />
                      <span>THẺ 3/4 • LỜI LUẬN GIẢI CÁ NHÂN HÓA</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#C7E9AD]">
                      DÀNH RIÊNG CHO {displayName.toUpperCase()}
                    </span>
                  </div>

                  {/* Personalized AI or Rulebase Deep Advice */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#223846]/90 border border-[#80BDB2]/40 shadow-inner space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-mono text-[#DAB48A] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-[#C7E9AD]" />
                      <span>Thông Điệp Trực Diện:</span>
                    </div>

                    <p className="font-body text-sm sm:text-base text-[#F4EADA] leading-relaxed font-normal">
                      {readingMode === "ai" && aiResult
                        ? aiResult.personalizedInterpretation
                        : rulebaseResult.coreAdvice}
                    </p>
                  </div>

                  {/* Combination Rule Insight (if any) */}
                  {rulebaseResult.combinationRules.length > 0 && (
                    <div className="p-4 rounded-xl bg-[#111E2C]/70 border border-[#DAB48A]/25 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#DAB48A] block">
                        ✦ Quy Luật Tương Hỗ Giữa Các Lá Bài:
                      </span>
                      <p className="font-body text-xs text-[#C1CFD0] leading-relaxed">
                        {rulebaseResult.combinationRules[0].descriptionVi}
                      </p>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <p className="text-xs font-body text-[#A7BBC0] italic">
                      &ldquo;Mỗi lựa chọn có ý thức của bạn đều đang tái định hình tương lai.&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CARD 4: TỰ VẤN NỘI TÂM & ĐÚC KẾT */}
              {/* ========================================================= */}
              {currentCardIndex === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#DAB48A]/20 pb-3">
                    <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#DAB48A]">
                      <HelpCircle className="w-4 h-4 text-[#C7E9AD]" />
                      <span>THẺ 4/4 • TỰ VẤN & ĐÚC KẾT HÀNH TRÌNH</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#C7E9AD]">
                      KẾT THÚC PHIÊN THỈNH BÀI
                    </span>
                  </div>

                  {/* Reflection Prompts */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#DAB48A] block mb-1">
                      ✦ Những câu hỏi tự vấn cho tâm thức của bạn:
                    </span>
                    {(readingMode === "ai" && aiResult
                      ? aiResult.reflectionQuestions
                      : rulebaseResult.reflectionQuestions
                    ).map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#223846]/70 border border-[#DAB48A]/25 flex items-start space-x-2.5 text-xs sm:text-sm text-[#F4EADA]"
                      >
                        <span className="text-[#C7E9AD] font-mono font-bold">{idx + 1}.</span>
                        <p className="leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>

                  {/* Closing Message */}
                  <div className="p-3.5 rounded-xl bg-[#111E2C] border border-[#80BDB2]/40 text-center">
                    <p className="font-display text-sm sm:text-base text-[#C7E9AD] italic leading-relaxed">
                      &ldquo;
                      {readingMode === "ai" && aiResult
                        ? aiResult.closingMessage
                        : "Tương lai không phải là định mệnh bất biến, mà là bức tranh do chính những lựa chọn của bạn kiến tạo mỗi ngày."}
                      &rdquo;
                    </p>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={onSave}
                      className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-body font-semibold transition-all cursor-pointer ${
                        isSaved
                          ? "bg-[#1E3B34] border border-[#80BDB2] text-[#C7E9AD]"
                          : "bg-[#284450] border border-[#DAB48A]/40 text-[#F4EADA] hover:bg-[#385968]"
                      }`}
                    >
                      {isSaved ? <Check className="w-4 h-4 text-[#C7E9AD]" /> : <Bookmark className="w-4 h-4 text-[#DAB48A]" />}
                      <span>{isSaved ? "Đã lưu vào kho" : "Lưu quẻ bài"}</span>
                    </button>

                    <button
                      onClick={onCopy}
                      className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#284450] border border-[#DAB48A]/40 text-xs font-body font-semibold text-[#F4EADA] hover:bg-[#385968] transition-all cursor-pointer"
                    >
                      <Copy className="w-4 h-4 text-[#C7E9AD]" />
                      <span>Sao chép kết quả</span>
                    </button>

                    <button
                      onClick={onRestart}
                      className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#DAB48A] via-[#ECD2B3] to-[#DAB48A] text-[#111E2C] text-xs font-body font-semibold shadow-copper-glow hover:scale-105 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Thỉnh quẻ mới</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Card Navigation Indicator & Mobile Buttons */}
              <div className="pt-5 mt-4 border-t border-[#DAB48A]/15 flex items-center justify-between text-xs font-body">
                {/* Back button */}
                <button
                  onClick={handlePrev}
                  disabled={currentCardIndex === 0}
                  className="inline-flex items-center space-x-1 text-[#A7BBC0] hover:text-[#F4EADA] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trang trước</span>
                </button>

                {/* Dots indicator */}
                <div className="flex items-center space-x-1.5">
                  {[0, 1, 2, 3].map((dot) => (
                    <button
                      key={dot}
                      onClick={() => goToCard(dot)}
                      className={`transition-all rounded-full cursor-pointer ${
                        dot === currentCardIndex
                          ? "w-6 h-2 bg-[#C7E9AD]"
                          : "w-2 h-2 bg-[#DAB48A]/30 hover:bg-[#DAB48A]/60"
                      }`}
                      aria-label={`Đi tới thẻ ${dot + 1}`}
                    />
                  ))}
                </div>

                {/* Next button */}
                {currentCardIndex < 3 ? (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center space-x-1 text-[#C7E9AD] hover:text-[#F4EADA] font-semibold cursor-pointer"
                  >
                    <span>Tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-[#A7BBC0]/50 font-mono text-[10px]">
                    ✦ HẾT ✦
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
