"use client";

import React, { useState } from "react";
import { GuidedReadingView } from "@/components/reading/GuidedReadingView";
import { HistoryModal } from "@/components/reading/HistoryModal";
import { historyStorage } from "@/lib/storage/history";
import { PopulatedCard, QuestionCategory, RulebaseInterpretation, SelectedCard, SpreadType } from "@/types/tarot";
import { AIInterpretationResult, AIStatus, ReadingSessionRecord } from "@/types/reading";
import { getCardById } from "@/data/tarot/cards";
import { getSpreadDef } from "@/data/tarot/spreads";
import { Sparkles, Layers, ScrollText } from "lucide-react";
import { getCategoryLabelVi, getCleanViCardName } from "@/data/tarot/categories";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { RulebaseReading } from "@/components/reading/RulebaseReading";
import { AIReading } from "@/components/reading/AIReading";
import { CardSpread } from "@/components/tarot/CardSpread";
import { ReadingActions } from "@/components/reading/ReadingActions";

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

  // Default to ARCANA 2.4 Guided Reading Flow (Single, continuous, progressive narrative)
  const [viewMode, setViewMode] = useState<"guided" | "classic">("guided");

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
          `• ${c.position.nameVi}: ${c.card.nameEn} (${getCleanViCardName(c.card.nameVi)}) [${
            c.orientation === "upright" ? "Thuận" : "Ngược"
          }]`
      ),
      ``,
      `--- THÔNG ĐIỆP CHÍNH ---`,
      rulebaseResult.coreAdvice,
      ``,
      `--- TỔNG QUAN TỪ CỔ THƯ ---`,
      rulebaseResult.overviewSynthesis,
      ``,
    ];

    if (aiResult) {
      lines.push(
        `--- GÓC NHÌN AI (GEMINI) ---`,
        `Tiêu đề: ${aiResult.title}`,
        `Tổng quan: ${aiResult.overview}`,
        `Diễn giải cá nhân hóa: ${aiResult.personalizedInterpretation}`,
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

  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-4 py-3 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#284450] border border-[#C7E9AD] text-[#C7E9AD] font-body text-xs font-semibold shadow-celestial-glow animate-fade-in flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subtle Layout Switcher (Default: Guided Reading Flow) */}
      <div className="w-full flex justify-end mb-1 px-2">
        <button
          onClick={() => setViewMode(viewMode === "guided" ? "classic" : "guided")}
          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#111E2C] border border-[#DAB48A]/30 text-[11px] font-mono text-[#A7BBC0] hover:text-[#F4EADA] transition-colors cursor-pointer"
        >
          {viewMode === "guided" ? (
            <>
              <Layers className="w-3.5 h-3.5 text-[#DAB48A]" />
              <span>Xem dạng nghiên cứu chi tiết</span>
            </>
          ) : (
            <>
              <ScrollText className="w-3.5 h-3.5 text-[#C7E9AD]" />
              <span>Xem dạng Đọc có dẫn hướng (Chuẩn)</span>
            </>
          )}
        </button>
      </div>

      {/* PRIMARY VIEW: ARCANA 2.4 GUIDED READING EXPERIENCE */}
      {viewMode === "guided" ? (
        <GuidedReadingView
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
        /* CLASSIC VIEW: Detailed Multi-Column Research Layout */
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto py-4">
          <div className="w-full max-w-3xl mx-auto">
            <CardSpread
              spreadType={spreadType}
              cards={populatedCards}
              revealedIndices={[0, 1, 2]}
            />
          </div>

          <div className="space-y-6">
            <RulebaseReading interpretation={rulebaseResult} />
            <AIReading
              aiStatus={aiStatus}
              aiResult={aiResult}
              aiError={aiError}
              onRetry={onRetryAI}
            />
          </div>

          <ReadingActions
            onSave={handleSave}
            onCopy={handleCopy}
            onRestart={onRestart}
            onOpenHistory={() => setIsHistoryOpen(true)}
            isSaved={isSaved}
          />
        </div>
      )}

      {/* History Drawer Modal */}
      {isHistoryOpen && (
        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectReading={(record) => {
            onRestoreReading(record);
            setIsHistoryOpen(false);
          }}
        />
      )}
    </div>
  );
};
