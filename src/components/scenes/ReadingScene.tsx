"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { CardSpread } from "@/components/tarot/CardSpread";
import { RulebaseReading } from "@/components/reading/RulebaseReading";
import { AIReading } from "@/components/reading/AIReading";
import { ReadingActions } from "@/components/reading/ReadingActions";
import { HistoryModal } from "@/components/reading/HistoryModal";
import { historyStorage } from "@/lib/storage/history";
import { PopulatedCard, QuestionCategory, RulebaseInterpretation, SelectedCard, SpreadType } from "@/types/tarot";
import { AIInterpretationResult, AIStatus, ReadingSessionRecord } from "@/types/reading";
import { getCardById } from "@/data/tarot/cards";
import { getSpreadDef } from "@/data/tarot/spreads";
import { Sparkles, Compass } from "lucide-react";

interface ReadingSceneProps {
  readingId: string;
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
      `Câu hỏi: "${question || "Trải bài tổng quát"}"`,
      `Lĩnh vực: ${category.toUpperCase()} | Kiểu trải bài: ${spreadDef.nameVi}`,
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

    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Đã sao chép toàn bộ kết quả vào bộ nhớ tạm!");
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#172B38] border border-[#C6F68D] text-[#C6F68D] font-mono text-xs shadow-celestial-glow animate-fade-in flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Reading Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#172B38]/80 border border-[#DAA87B]/30">
          <Compass className="w-3.5 h-3.5 text-[#C6F68D]" />
          <span className="font-mono text-xs text-[#E9DFC9] uppercase tracking-widest">
            THE REVELATION • KẾT QUẢ KHAI MỞ
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl text-[#E9DFC9] font-light tracking-wide">
          "{question || "Thông điệp vũ trụ cho hiện tại"}"
        </h2>
        <div className="flex justify-center items-center space-x-3 text-xs font-mono text-[#B5AA94]">
          <span>LĨNH VỰC: {category.toUpperCase()}</span>
          <span>•</span>
          <span>{spreadDef.nameVi.split("—")[0]}</span>
        </div>
      </div>

      {/* Prominent Visual Anchor: The Selected Cards Spread */}
      <div className="mb-12">
        <CardSpread
          spreadType={spreadType}
          cards={populatedCards}
          revealedIndices={[0, 1, 2]}
          size="md"
        />
      </div>

      {/* Dual Reading Layout: Left = Rulebase, Right = AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        {/* Section I: Ancient Wisdom (Rulebase) */}
        <div className="p-6 rounded-2xl bg-[#0F162B]/85 border border-[#DAA87B]/30 backdrop-blur-md shadow-xl">
          <RulebaseReading interpretation={rulebaseResult} />
        </div>

        {/* Section II: Living Interpretation (Gemini) */}
        <div className="p-6 rounded-2xl bg-[#0F162B]/85 border border-[#C6F68D]/30 backdrop-blur-md shadow-xl">
          <AIReading
            aiStatus={aiStatus}
            aiResult={aiResult}
            aiError={aiError}
            onRetry={onRetryAI}
            userQuestion={question}
          />
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="mt-12">
        <ReadingActions
          onSave={handleSave}
          onCopy={handleCopy}
          onRestart={onRestart}
          onOpenHistory={() => setIsHistoryOpen(true)}
          isSaved={isSaved}
        />
      </div>

      {/* History Modal Drawer */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectReading={onRestoreReading}
      />
    </div>
  );
};
