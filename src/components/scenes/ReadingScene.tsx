"use client";

import React, { useState, useEffect } from "react";
import { CardSpread } from "@/components/tarot/CardSpread";
import { RulebaseReading } from "@/components/reading/RulebaseReading";
import { AIReading } from "@/components/reading/AIReading";
import { ReadingActions } from "@/components/reading/ReadingActions";
import { ReadingCarousel } from "@/components/reading/ReadingCarousel";
import { CelestialLoadingTransition } from "@/components/reading/CelestialLoadingTransition";
import { HistoryModal } from "@/components/reading/HistoryModal";
import { historyStorage } from "@/lib/storage/history";
import { PopulatedCard, QuestionCategory, RulebaseInterpretation, SelectedCard, SpreadType } from "@/types/tarot";
import { AIInterpretationResult, AIStatus, ReadingSessionRecord } from "@/types/reading";
import { getCardById } from "@/data/tarot/cards";
import { getSpreadDef } from "@/data/tarot/spreads";
import { Sparkles, Compass, Layers, LayoutGrid } from "lucide-react";
import { getCategoryLabelVi } from "@/data/tarot/categories";
import { copyTextToClipboard } from "@/lib/utils/clipboard";

interface ReadingSceneProps {
  readingId: string;
  userName?: string;
  question: string;
  category: QuestionCategory;
  spreadType: SpreadType;
  allowReversed: boolean;
  selectedCards: SelectedCard[];
  rulebaseResult: RulebaseInterpretation;
  aiStatus: AIStatus;
  aiResult: AIInterpretationResult | null;
  aiError: string | null;
  onRetryAI: () => void;
  onRestart: () => void;
  onRestoreReading: (savedRecord: ReadingSessionRecord) => void;
}

export const ReadingScene: React.FC<ReadingSceneProps> = ({
  readingId,
  userName,
  question,
  category,
  spreadType,
  allowReversed,
  selectedCards,
  rulebaseResult,
  aiStatus,
  aiResult,
  aiError,
  onRetryAI,
  onRestart,
  onRestoreReading,
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Loading wait state for AI first
  const [isWaitingForAi, setIsWaitingForAi] = useState<boolean>(aiStatus === "loading");
  // Default to compact Swipeable Carousel to prevent excessive scrolling
  const [viewMode, setViewMode] = useState<"carousel" | "classic">("carousel");

  useEffect(() => {
    if (aiStatus !== "loading") {
      setIsWaitingForAi(false);
    }
  }, [aiStatus]);

  const spreadDef = getSpreadDef(spreadType);

  const populatedCards: PopulatedCard[] = selectedCards.map((sc, i) => {
    const cardData = getCardById(sc.cardId)!;
    const position =
      spreadDef.positions.find((p) => p.id === sc.positionId) ||
      spreadDef.positions[i] || {
        id: sc.positionId,
        nameVi: "Trọng tâm",
        nameEn: "Focus",
        descriptionVi: "Vị trí trọng tâm.",
      };

    return {
      ...sc,
      card: cardData,
      position,
    };
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    const record: ReadingSessionRecord = {
      readingId,
      userName,
      createdAt: new Date().toISOString(),
      question,
      category,
      spreadType,
      allowReversed,
      selectedCards,
      rulebookVersion: rulebaseResult.rulebookVersion,
      rulebaseResult,
      aiStatus,
      aiResult,
      aiErrorMessage: aiError || undefined,
    };

    historyStorage.saveReading(record);
    setIsSaved(true);
    showToast("Đã lưu trải bài vào kho lưu trữ trình duyệt!");
  };

  const handleCopy = () => {
    const lines = [
      `=== ARCANA: THE ARCHIVE OF POSSIBILITIES ===`,
      `Lữ khách: ${userName || "Lữ khách"}`,
      `Câu hỏi: "${question || "Trải bài tổng quát"}"`,
      `Lĩnh vực: ${getCategoryLabelVi(category)} | Kiểu trải bài: ${spreadDef.nameVi}`,
      ``,
      `--- CÁC LÁ BÀI ĐÃ RÚT ---`,
      ...populatedCards.map(
        (c) =>
          `• ${c.position.nameVi}: ${c.card.nameVi} (${c.orientation === "upright" ? "Thuận" : "Ngược"})`
      ),
      ``,
      `--- DIỄN GIẢI TRUYỀN THỐNG ---`,
      `Tổng quan: ${rulebaseResult.overviewSynthesis}`,
      `Lời khuyên: ${rulebaseResult.coreAdvice}`,
      ``,
    ];

    if (aiResult) {
      lines.push(
        `--- GÓC NHÌN AI (GEMINI) ---`,
        `Tiêu đề: ${aiResult.title}`,
        `Tổng quan: ${aiResult.overview}`,
        `Diễn giải: ${aiResult.personalizedInterpretation}`,
        `Lời đúc kết: "${aiResult.closingMessage}"`
      );
    }

    copyTextToClipboard(lines.join("\n")).then((ok) => {
      if (ok) {
        showToast("Đã sao chép toàn bộ kết quả vào bộ nhớ tạm!");
      } else {
        showToast("Không thể sao chép tự động trên trình duyệt này.");
      }
    });
  };

  // 1. Celestial Loading State (AI First)
  if (isWaitingForAi && aiStatus === "loading") {
    return (
      <CelestialLoadingTransition
        userName={userName}
        question={question}
        onSkip={() => setIsWaitingForAi(false)}
      />
    );
  }

  // 2. Reading Stage
  return (
    <div className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#284450] border border-[#C7E9AD] text-[#C7E9AD] font-body text-xs font-semibold shadow-celestial-glow animate-fade-in flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View Mode Switcher Pill */}
      <div className="w-full flex justify-end mb-2 px-2">
        <button
          onClick={() => setViewMode(viewMode === "carousel" ? "classic" : "carousel")}
          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#111E2C] border border-[#DAB48A]/30 text-[11px] font-mono text-[#A7BBC0] hover:text-[#F4EADA] transition-colors cursor-pointer"
        >
          {viewMode === "carousel" ? (
            <>
              <Layers className="w-3.5 h-3.5 text-[#DAB48A]" />
              <span>Xem dạng cuộn cổ điển</span>
            </>
          ) : (
            <>
              <LayoutGrid className="w-3.5 h-3.5 text-[#C7E9AD]" />
              <span>Xem dạng Thẻ thiên thể (Carousel)</span>
            </>
          )}
        </button>
      </div>

      {/* VIEW 1: SWIPEABLE CAROUSEL (Default, Clean, No Long Scroll) */}
      {viewMode === "carousel" ? (
        <ReadingCarousel
          readingId={readingId}
          userName={userName}
          question={question}
          category={category}
          spreadType={spreadType}
          populatedCards={populatedCards}
          rulebaseResult={rulebaseResult}
          aiStatus={aiStatus}
          aiResult={aiResult}
          onRetryAI={onRetryAI}
          onSave={handleSave}
          onCopy={handleCopy}
          onRestart={onRestart}
          isSaved={isSaved}
        />
      ) : (
        /* VIEW 2: CLASSIC TWO-COLUMN SCROLL (For detailed research) */
        <div className="space-y-8 animate-fade-in">
          {/* Top Reading Header */}
          <div className="text-center mb-6 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#284450]/80 border border-[#DAB48A]/40 backdrop-blur-md shadow-sm">
              <Compass className="w-3.5 h-3.5 text-[#C7E9AD]" />
              <span className="font-body text-xs text-[#F4EADA] font-semibold tracking-wide">
                The Revelation • Kết quả Khai Mở
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#F4EADA] font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              &ldquo;{question || "Thông điệp vũ trụ cho hiện tại"}&rdquo;
            </h2>
            <div className="flex justify-center items-center space-x-3 text-xs font-body text-[#C1CFD0]">
              {userName && (
                <>
                  <span className="text-[#C7E9AD] font-medium">Lữ khách: {userName}</span>
                  <span>•</span>
                </>
              )}
              <span className="font-semibold uppercase tracking-wider text-[#DAB48A]">
                LĨNH VỰC: {getCategoryLabelVi(category).toUpperCase()}
              </span>
              <span>•</span>
              <span>{spreadDef.nameVi.split("—")[0]}</span>
            </div>
          </div>

          {/* Card Spread Anchor */}
          <div className="mb-8">
            <CardSpread
              spreadType={spreadType}
              cards={populatedCards}
              revealedIndices={[0, 1, 2]}
              size="md"
            />
          </div>

          {/* Dual Reading Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            {/* Section A: Ancient Wisdom */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F4ECDD] border border-[#D8C8B3] shadow-parchment">
              <RulebaseReading interpretation={rulebaseResult} userName={userName} />
            </div>

            {/* Section B: Living AI */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#284450] border border-[#80BDB2]/40 shadow-xl">
              <AIReading
                aiStatus={aiStatus}
                aiResult={aiResult}
                aiError={aiError}
                onRetry={onRetryAI}
                userQuestion={question}
                userName={userName}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8">
            <ReadingActions
              onSave={handleSave}
              onCopy={handleCopy}
              onRestart={onRestart}
              onOpenHistory={() => setIsHistoryOpen(true)}
              isSaved={isSaved}
            />
          </div>
        </div>
      )}

      {/* History Modal Drawer */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectReading={onRestoreReading}
      />
    </div>
  );
};
