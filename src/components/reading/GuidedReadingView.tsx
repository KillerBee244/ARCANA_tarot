"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Compass,
  BookOpen,
  ChevronDown,
  Bookmark,
  RotateCcw,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  Quote,
} from "lucide-react";
import { PopulatedCard, QuestionCategory, RulebaseInterpretation, SpreadType } from "@/types/tarot";
import { AIInterpretationResult, AIStatus } from "@/types/reading";
import { getCategoryLabelVi, getCleanViCardName } from "@/data/tarot/categories";
import { getCardArtworkUrl } from "@/data/tarot/assets";

interface GuidedReadingViewProps {
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

export const GuidedReadingView: React.FC<GuidedReadingViewProps> = ({
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
  // Accordion state: Set of open card IDs (first card open by default for immediate preview)
  const [openCardIds, setOpenCardIds] = useState<Set<string>>(
    new Set(populatedCards.length > 0 ? [populatedCards[0].cardId] : [])
  );

  // Question expansion state if question is long
  const [isQuestionExpanded, setIsQuestionExpanded] = useState<boolean>(false);
  const isQuestionLong = (question || "").length > 85;

  const toggleCard = (cardId: string) => {
    setOpenCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  // Editorial Title: From AI if available, or synthesized from Rulebase
  const readingTitle =
    aiResult?.title ||
    rulebaseResult.combinationRules[0]?.titleVi ||
    (category === "love"
      ? "Khơi mở dòng chảy cảm xúc & thấu suốt con tim"
      : category === "career"
      ? "Thời điểm định hình bước chuyển sự nghiệp"
      : category === "finance"
      ? "Cân bằng nguồn lực & kiến tạo sự bền vững"
      : category === "self"
      ? "Một hành trình chuyển mình & thấu hiểu nội tâm"
      : "Chuyển dịch thời khắc & thông điệp định mệnh");

  // Main Editorial Insight (40-70 words)
  const mainInsight =
    aiResult?.overview ||
    rulebaseResult.coreAdvice ||
    rulebaseResult.overviewSynthesis;

  // Reflection Question
  const reflectionQuestion =
    aiResult?.reflectionQuestions?.[0] ||
    rulebaseResult.reflectionQuestions?.[0] ||
    "Điều gì đang thực sự quan trọng và cần bạn dành trọn sự chú tâm lúc này?";

  // Concluding Message
  const closingMessage =
    aiResult?.closingMessage ||
    rulebaseResult.coreAdvice ||
    "Mọi câu trả lời bạn tìm kiếm vốn dĩ đã hiện diện bên trong trực giác của bạn.";

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 space-y-6 select-none animate-fade-in text-[#F4EADA]">
      {/* ========================================================
          SECTION 1 — READING HERO
          ======================================================== */}
      <section className="flex flex-col items-center text-center space-y-3 pt-1">
        {/* Subtle reading badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-[#284450]/80 border border-[#DAB48A]/35 backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C7E9AD]" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#DAB48A] uppercase font-medium">
            KẾT QUẢ TRẢI BÀI • {spreadType === "three_card" ? "3 LÁ" : "1 LÁ"}
          </span>
        </div>

        {/* Hero Title (Fraunces Editorial Display) */}
        <h1 className="font-display text-2xl sm:text-3xl text-[#F4EADA] font-light tracking-wide leading-snug px-2">
          {readingTitle}
        </h1>

        {/* User Question */}
        <div className="w-full max-w-lg px-2">
          <p
            className={`font-body text-xs sm:text-sm text-[#C1CFD0] italic leading-relaxed transition-all ${
              !isQuestionExpanded && isQuestionLong ? "line-clamp-2" : ""
            }`}
          >
            &ldquo;{question || "Khám phá thông điệp vũ trụ cho hiện tại"}&rdquo;
          </p>
          {isQuestionLong && (
            <button
              onClick={() => setIsQuestionExpanded(!isQuestionExpanded)}
              className="text-[11px] font-mono text-[#DAB48A] hover:underline mt-1 cursor-pointer"
            >
              {isQuestionExpanded ? "Thu gọn" : "Xem toàn bộ câu hỏi"}
            </button>
          )}
        </div>

        {/* Tarot Cards Presentation in Hero */}
        <div className="w-full pt-2 pb-1">
          {spreadType === "three_card" ? (
            /* Three-Card Spread: Side-by-side row */
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-sm sm:max-w-md mx-auto items-start">
              {populatedCards.map((c, idx) => {
                const artworkUrl = getCardArtworkUrl(c.card.id);
                const isReversed = c.orientation === "reversed";
                const cleanName = getCleanViCardName(c.card.nameVi, c.card.nameEn);

                return (
                  <div key={c.cardId} className="flex flex-col items-center group">
                    <div className="w-full aspect-[2/3.1] rounded-xl overflow-hidden border-2 border-[#DAB48A]/45 shadow-card-3d bg-[#111E2C] relative transition-transform duration-300 group-hover:scale-[1.03]">
                      <Image
                        src={artworkUrl}
                        alt={c.card.nameVi}
                        fill
                        sizes="(max-width: 640px) 110px, 140px"
                        className={`object-cover ${isReversed ? "rotate-180" : ""}`}
                        loading="eager"
                      />
                      {/* Subtle corner vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Position Label & Card Name */}
                    <span className="font-body text-[11px] sm:text-xs text-[#C1CFD0] font-semibold mt-1.5 text-center line-clamp-1">
                      {c.position.nameVi.split("(")[0].trim()}
                    </span>
                    <span className="font-body text-[10px] text-[#DAB48A] text-center line-clamp-1">
                      {c.card.nameEn}
                    </span>
                    {isReversed && (
                      <span className="font-mono text-[9px] text-[#E8A598]">
                        (Ngược)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Single-Card Spread: Prominent Centered Card */
            <div className="flex flex-col items-center max-w-[145px] sm:max-w-[175px] mx-auto">
              <div className="w-full aspect-[2/3.2] rounded-xl overflow-hidden border-2 border-[#DAB48A]/60 shadow-celestial-glow bg-[#111E2C] relative">
                <Image
                  src={getCardArtworkUrl(populatedCards[0]?.card.id || "major-00-fool")}
                  alt={populatedCards[0]?.card.nameVi || "Tarot"}
                  fill
                  sizes="175px"
                  className={`object-cover ${
                    populatedCards[0]?.orientation === "reversed" ? "rotate-180" : ""
                  }`}
                  loading="eager"
                />
              </div>
              <span className="font-display text-xs sm:text-sm text-[#DAB48A] font-semibold mt-2">
                Thông Điệp Vũ Trụ
              </span>
              <span className="font-body text-xs text-[#F4EADA]">
                {populatedCards[0]?.card.nameEn} (
                {getCleanViCardName(
                  populatedCards[0]?.card.nameVi || "",
                  populatedCards[0]?.card.nameEn
                )}
                )
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          SECTION 2 — MAIN MESSAGE ("Thông điệp chính")
          ======================================================== */}
      <section className="rounded-2xl p-4 sm:p-5 bg-[#284450]/60 border border-[#DAB48A]/25 backdrop-blur-sm shadow-sm relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#C7E9AD]" />
          <h2 className="font-display text-base sm:text-lg text-[#F4EADA] font-medium tracking-wide">
            Thông điệp chính
          </h2>
        </div>

        <p className="font-body text-sm sm:text-base text-[#F4EADA]/95 leading-relaxed font-normal">
          {mainInsight}
        </p>

        <div className="mt-3 pt-2.5 border-t border-[#DAB48A]/15 flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#A7BBC0]/70">
            {aiResult
              ? "Diễn giải cá nhân hóa từ AI Gemini"
              : "Diễn giải minh họa từ Rulebook chuẩn quốc tế"}
          </span>
          <span className="font-mono text-[10px] text-[#DAB48A]/80 uppercase">
            {getCategoryLabelVi(category)}
          </span>
        </div>
      </section>

      {/* ========================================================
          SECTION 3 — EXPLORE INDIVIDUAL CARDS (Progressive Accordions)
          ======================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-lg sm:text-xl text-[#F4EADA] font-medium tracking-wide">
            Khám phá từng lá bài
          </h2>
          <span className="font-mono text-xs text-[#C1CFD0]">
            {populatedCards.length} lá
          </span>
        </div>

        <div className="space-y-2">
          {populatedCards.map((item, idx) => {
            const isOpen = openCardIds.has(item.cardId);
            const artworkUrl = getCardArtworkUrl(item.card.id);
            const isReversed = item.orientation === "reversed";
            const posTitle = item.position.nameVi.split("(")[0].trim();
            const cleanViName = getCleanViCardName(item.card.nameVi, item.card.nameEn);

            const ruleItem =
              rulebaseResult.cards.find((rc) => rc.card.id === item.card.id) ||
              rulebaseResult.cards[idx];
            const positionMeaning =
              ruleItem?.positionMeaning || item.position.descriptionVi;
            const categoryMeaning =
              ruleItem?.categoryMeaning ||
              (category !== "general" && item.card.categoryMeanings
                ? item.card.categoryMeanings[item.orientation]?.[category]
                : "") ||
              "";

            // One-sentence takeaway
            const takeaway =
              (categoryMeaning ? categoryMeaning.split(".")[0] : "") ||
              item.card.uprightKeywords[0] ||
              item.card.nameVi;

            return (
              <div
                key={item.cardId}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#DAB48A]/50 bg-[#223846]/90 shadow-md"
                    : "border-[#DAB48A]/20 bg-[#223846]/60 hover:bg-[#284450]/70"
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleCard(item.cardId)}
                  aria-expanded={isOpen}
                  className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    {/* Index badge */}
                    <div className="w-6 h-6 rounded-lg bg-[#192B38] border border-[#DAB48A]/30 flex items-center justify-center font-mono text-xs text-[#DAB48A] flex-shrink-0">
                      {idx + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-mono text-[10px] text-[#A7BBC0] uppercase">
                          {posTitle}
                        </span>
                        {isReversed && (
                          <span className="font-mono text-[9px] px-1 rounded bg-[#E8A598]/20 text-[#E8A598]">
                            Ngược
                          </span>
                        )}
                      </div>
                      <h3 className="font-body text-sm sm:text-base font-semibold text-[#F4EADA] truncate">
                        {item.card.nameEn}{" "}
                        {cleanViName &&
                        cleanViName.toLowerCase() !== item.card.nameEn.toLowerCase()
                          ? `(${cleanViName})`
                          : ""}
                      </h3>
                      <p className="font-body text-xs text-[#C7E9AD] line-clamp-1 mt-0.5">
                        {takeaway}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-[#DAB48A] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expanded Detailed Interpretation */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                    >
                      <div className="px-3.5 pb-4 pt-1 border-t border-[#DAB48A]/15 space-y-3 text-left">
                        {/* Artwork & Keywords Row */}
                        <div className="flex items-start space-x-3 pt-2">
                          <div className="w-16 sm:w-20 aspect-[2/3.1] rounded-lg overflow-hidden border border-[#DAB48A]/40 flex-shrink-0 relative shadow-sm bg-[#111E2C]">
                            <Image
                              src={artworkUrl}
                              alt={item.card.nameVi}
                              fill
                              sizes="80px"
                              className={`object-cover ${isReversed ? "rotate-180" : ""}`}
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex flex-wrap gap-1">
                              {(isReversed
                                ? item.card.reversedKeywords
                                : item.card.uprightKeywords
                              )
                                .slice(0, 3)
                                .map((kw, i) => (
                                  <span
                                    key={i}
                                    className="font-body text-[10px] px-2 py-0.5 rounded-full bg-[#192B38] border border-[#DAB48A]/25 text-[#DAB48A]"
                                  >
                                    {kw}
                                  </span>
                                ))}
                            </div>
                            <p className="font-body text-xs text-[#C1CFD0] leading-relaxed">
                              <span className="text-[#DAB48A] font-medium">Ý nghĩa tại vị trí {posTitle}: </span>
                              {positionMeaning}
                            </p>
                          </div>
                        </div>

                        {/* Core Symbolic Meaning */}
                        <div className="pt-2">
                          <span className="font-body text-xs text-[#DAB48A] font-semibold block mb-1">
                            Bản chất lá bài ({isReversed ? "Chiều ngược" : "Chiều thuận"}):
                          </span>
                          <p className="font-body text-xs sm:text-sm text-[#F4EADA]/90 leading-relaxed font-normal">
                            {isReversed ? item.card.reversedMeaning : item.card.uprightMeaning}
                          </p>
                        </div>

                        {/* Category Context Meaning */}
                        {categoryMeaning && (
                          <div className="p-2.5 rounded-xl bg-[#192B38]/70 border border-[#DAB48A]/20">
                            <span className="font-body text-xs text-[#C7E9AD] font-semibold block mb-0.5">
                              Gợi ý cho {getCategoryLabelVi(category)}:
                            </span>
                            <p className="font-body text-xs sm:text-sm text-[#F4EADA]/90 leading-relaxed font-normal">
                              {categoryMeaning}
                            </p>
                          </div>
                        )}

                        {/* Symbolism */}
                        {item.card.symbolism && (
                          <p className="font-body text-[11px] text-[#A7BBC0]/80 italic">
                            <span className="font-mono text-[#DAB48A]/70 not-italic uppercase mr-1">Biểu tượng:</span>
                            {item.card.symbolism}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION 4 — CONNECTIONS BETWEEN CARDS ("Câu chuyện giữa các lá bài")
          ======================================================== */}
      {spreadType === "three_card" && (
        <section className="rounded-2xl p-4 sm:p-5 bg-[#223846]/60 border border-[#DAB48A]/20 space-y-3">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#DAB48A]" />
            <h2 className="font-display text-base sm:text-lg text-[#F4EADA] font-medium tracking-wide">
              Câu chuyện giữa các lá bài
            </h2>
          </div>

          {/* Narrative Synthesis */}
          <p className="font-body text-sm sm:text-base text-[#F4EADA]/90 leading-relaxed font-normal">
            {rulebaseResult.overviewSynthesis}
          </p>

          {/* Combination Rules if triggered */}
          {rulebaseResult.combinationRules.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#DAB48A]/15">
              <span className="font-mono text-[10px] text-[#DAB48A] uppercase tracking-wider block">
                Sự giao thoa định mệnh:
              </span>
              {rulebaseResult.combinationRules.map((rule) => (
                <div
                  key={rule.ruleId}
                  className="p-2.5 rounded-xl bg-[#192B38]/60 border border-[#C7E9AD]/20 flex items-start space-x-2.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C7E9AD] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-body text-xs font-semibold text-[#C7E9AD]">
                      {rule.titleVi}
                    </h4>
                    <p className="font-body text-xs text-[#F4EADA]/85 mt-0.5 leading-relaxed">
                      {rule.descriptionVi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dominant Themes Metadata Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#192B38] border border-[#DAB48A]/20 text-[#A7BBC0]">
              Ẩn chính: {rulebaseResult.dominantThemes.majorArcanaCount} / 3
            </span>
            {rulebaseResult.dominantThemes.dominantSuit && (
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#192B38] border border-[#DAB48A]/20 text-[#A7BBC0]">
                Chất chủ đạo: {rulebaseResult.dominantThemes.dominantSuit.toUpperCase()}
              </span>
            )}
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#192B38] border border-[#DAB48A]/20 text-[#A7BBC0]">
              Lá ngược: {rulebaseResult.dominantThemes.reversedCount}
            </span>
          </div>
        </section>
      )}

      {/* ========================================================
          SECTION 5 — AI PERSPECTIVE ("Góc nhìn AI" — Gemini)
          ======================================================== */}
      <section className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#192B38] via-[#223846] to-[#192B38] border border-[#C7E9AD]/30 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#C7E9AD]" />
            <h2 className="font-display text-base sm:text-lg text-[#F4EADA] font-medium tracking-wide">
              Góc nhìn AI
            </h2>
          </div>
          {aiStatus === "success" && (
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#C7E9AD]/15 border border-[#C7E9AD]/30 text-[#C7E9AD]">
              Gemini 3.8
            </span>
          )}
        </div>

        {/* State A: Loading (Non-blocking celestial shimmer) */}
        {aiStatus === "loading" && (
          <div className="py-4 flex flex-col items-center text-center space-y-2">
            <RefreshCw className="w-5 h-5 text-[#C7E9AD] animate-spin" />
            <p className="font-body text-xs text-[#F4EADA]">
              Trí tuệ Gemini đang chắp bút góc nhìn cá nhân hóa cho {userName || "bạn"}...
            </p>
            <p className="font-body text-[11px] text-[#A7BBC0]/70">
              Bạn có thể tiếp tục đọc các diễn giải chi tiết từ Cổ thư Rulebook bên trên.
            </p>
          </div>
        )}

        {/* State B: Success */}
        {aiStatus === "success" && aiResult && (
          <div className="space-y-3">
            <p className="font-body text-xs text-[#C7E9AD] font-semibold">
              Chào {userName || "Lữ khách"}, các vì tinh tú soi tỏ câu hỏi của bạn:
            </p>
            <p className="font-body text-sm sm:text-base text-[#F4EADA] leading-relaxed font-normal">
              {aiResult.personalizedInterpretation}
            </p>

            {/* AI Reflective questions */}
            {aiResult.reflectionQuestions.length > 0 && (
              <div className="pt-2 border-t border-[#DAB48A]/15 space-y-1.5">
                <span className="font-mono text-[10px] text-[#DAB48A] uppercase tracking-wider block">
                  Câu hỏi dành riêng cho bạn:
                </span>
                <ul className="space-y-1">
                  {aiResult.reflectionQuestions.map((q, i) => (
                    <li key={i} className="font-body text-xs text-[#F4EADA]/90 flex items-start space-x-1.5">
                      <span className="text-[#C7E9AD]">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* State C: Fallback / Rate-limited / Error / Disabled */}
        {aiStatus !== "loading" && aiStatus !== "success" && (
          <div className="py-2 text-left space-y-2">
            <p className="font-body text-xs sm:text-sm text-[#C1CFD0] leading-relaxed">
              Một cách diễn giải cá nhân hóa dựa trên câu hỏi và các lá bài của bạn.
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="font-body text-[11px] text-[#A7BBC0]/70">
                {aiStatus === "rate_limited"
                  ? "AI đang phục vụ nhiều lữ khách. Cổ thư Rulebook sẵn sàng phục vụ bạn."
                  : "Cổ thư Rulebook truyền thống đã cung cấp trọn vẹn thông điệp."}
              </span>
              <button
                type="button"
                onClick={onRetryAI}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#284450] border border-[#DAB48A]/40 text-xs text-[#DAB48A] hover:text-[#F4EADA] hover:border-[#C7E9AD] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Đọc góc nhìn cá nhân hóa</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          SECTION 6 — REFLECTION & CONCLUSION ("Điều bạn có thể mang theo")
          ======================================================== */}
      <section className="space-y-4 pt-2">
        <div className="text-left space-y-1">
          <h2 className="font-display text-lg sm:text-xl text-[#F4EADA] font-medium tracking-wide">
            Điều bạn có thể mang theo
          </h2>
          <p className="font-body text-xs text-[#A7BBC0]">
            Một câu hỏi chiêm nghiệm, một hành động nhỏ và một điều đáng nhớ từ trải bài.
          </p>
        </div>

        {/* Memorable Closing Message Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#284450]/70 border border-[#DAB48A]/30 space-y-3 relative overflow-hidden">
          <Quote className="w-8 h-8 text-[#DAB48A]/20 absolute top-3 right-3 pointer-events-none" />

          <div>
            <span className="font-mono text-[10px] text-[#DAB48A] uppercase tracking-wider block mb-1">
              Lời đúc kết định mệnh:
            </span>
            <p className="font-display text-base sm:text-lg text-[#F4EADA] italic leading-relaxed">
              &ldquo;{closingMessage}&rdquo;
            </p>
          </div>

          <div className="pt-2.5 border-t border-[#DAB48A]/15">
            <span className="font-mono text-[10px] text-[#C7E9AD] uppercase tracking-wider block mb-1">
              Câu hỏi để bạn suy ngẫm:
            </span>
            <p className="font-body text-xs sm:text-sm text-[#F4EADA]/90 leading-relaxed font-normal">
              {reflectionQuestion}
            </p>
          </div>
        </div>

        {/* Final Action Buttons Bar */}
        <div className="pt-2 space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            {/* Save Reading */}
            <button
              type="button"
              onClick={onSave}
              className={`w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-body text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                isSaved
                  ? "bg-[#284450] border border-[#C7E9AD] text-[#C7E9AD]"
                  : "bg-[#C7E9AD] text-[#111E2C] shadow-celestial-glow hover:bg-[#A4D283] hover:scale-[1.02] active:scale-98"
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? "Đã lưu kết quả" : "Lưu kết quả"}</span>
            </button>

            {/* Restart Reading */}
            <button
              type="button"
              onClick={onRestart}
              className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#223846] border border-[#DAB48A]/40 text-[#F4EADA] font-body text-xs sm:text-sm font-semibold tracking-wide hover:border-[#DAB48A] hover:bg-[#284450] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#DAB48A]" />
              <span>Trải bài mới</span>
            </button>
          </div>

          {/* Copy Results Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full font-body text-xs text-[#A7BBC0] hover:text-[#F4EADA] transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép toàn bộ kết quả để lưu trữ</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
