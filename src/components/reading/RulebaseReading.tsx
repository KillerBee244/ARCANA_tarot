"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RulebaseInterpretation } from "@/types/tarot";
import { BookOpen, Compass, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from "lucide-react";
import { getCategoryLabelVi, getCleanViCardName } from "@/data/tarot/categories";

interface RulebaseReadingProps {
  interpretation: RulebaseInterpretation;
}

export const RulebaseReading: React.FC<RulebaseReadingProps> = ({ interpretation }) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full flex flex-col space-y-6 text-[#253C44]">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#D8C8B3] pb-3">
        <div className="flex items-center space-x-2.5">
          <BookOpen className="w-5 h-5 text-[#B58C60]" />
          <div>
            <h3 className="font-display text-2xl text-[#253C44] tracking-wide font-medium">
              Diễn Giải Truyền Thống
            </h3>
            <span className="font-mono text-[11px] tracking-wider text-[#52636A] uppercase font-medium">
              The Ancient Wisdom • Quy Tắc Rider–Waite–Smith v{interpretation.rulebookVersion}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-1 px-3 py-1 rounded-full bg-[#E8DCC9] border border-[#D8C8B3] text-xs font-body text-[#52636A] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#B58C60]" />
          <span>Xác thực cổ điển</span>
        </div>
      </div>

      {/* 1. Tổng Quan Dòng Chảy Năng Lượng */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#E8DCC9]/70 border border-[#D8C8B3] shadow-sm relative overflow-hidden">
        <div className="flex items-start space-x-3.5">
          <Compass className="w-5 h-5 text-[#B58C60] flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-display text-lg text-[#253C44] font-semibold">
              Thông Điệp Tổng Quan
            </h4>
            <p className="font-body text-sm sm:text-base text-[#253C44] leading-relaxed">
              {interpretation.overviewSynthesis}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Quy Luật Kết Hợp Đặc Biệt (Nếu có) */}
      {interpretation.combinationRules.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-body text-xs uppercase tracking-wider font-bold text-[#52636A]">
            Mối liên hệ giữa các lá bài ({interpretation.combinationRules.length})
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interpretation.combinationRules.map((rule) => (
              <div
                key={rule.ruleId}
                className="p-3.5 rounded-lg bg-[#E8DCC9]/90 border border-[#D8C8B3] flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#B58C60]" />
                  <span className="font-display text-sm font-semibold text-[#253C44]">
                    {rule.titleVi}
                  </span>
                </div>
                <p className="font-body text-xs text-[#52636A] leading-relaxed">
                  {rule.descriptionVi}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Chi Tiết Từng Lá Bài (Accordion) */}
      <div className="space-y-3.5">
        <h5 className="font-body text-xs uppercase tracking-wider font-bold text-[#52636A]">
          Ý nghĩa từng lá bài trong trải
        </h5>

        <div className="space-y-2.5">
          {interpretation.cards.map((item, index) => {
            const isExpanded = expandedCardId === item.card.id;
            const isUpright = item.orientation === "upright";

            return (
              <div
                key={item.card.id}
                className="rounded-xl bg-[#FDFBF7] border border-[#D8C8B3] overflow-hidden transition-all duration-200 shadow-sm"
              >
                {/* Collapsible Card Header */}
                <button
                  onClick={() => toggleExpand(item.card.id)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#F4ECDD]/50 transition-colors gap-3"
                >
                  {/* Left: Index & Card Info */}
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#B58C60] w-6 flex-shrink-0">
                      0{index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="font-display text-base sm:text-lg text-[#253C44] font-semibold leading-snug">
                          {getCleanViCardName(item.card.nameVi)}
                        </span>
                        <span className="font-body text-xs text-[#52636A] font-normal italic">
                          ({item.card.nameEn})
                        </span>
                      </div>
                      <span className="font-body text-xs text-[#52636A] font-medium block mt-0.5">
                        Vị trí: {item.position.nameVi}
                      </span>
                    </div>
                  </div>

                  {/* Right: Badge & Expand Button (Guaranteed never to wrap or distort) */}
                  <div className="flex items-center space-x-2.5 sm:space-x-3.5 flex-shrink-0 ml-2">
                    <span
                      className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 shadow-sm border ${
                        isUpright
                          ? "bg-[#E8DCC9] text-[#253C44] border-[#D8C8B3]"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      {isUpright ? "Vị trí Thuận" : "Vị trí Ngược"}
                    </span>

                    <div className="flex items-center space-x-1 text-[#B58C60] whitespace-nowrap flex-shrink-0">
                      <span className="font-body text-xs hidden sm:inline font-medium">
                        {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 pt-2 border-t border-[#D8C8B3]/60 space-y-3.5 bg-[#FDFBF7]"
                    >
                      {/* Position Specific Interpretation */}
                      <div>
                        <span className="font-body text-xs font-bold text-[#253C44] uppercase tracking-wider block mb-1">
                          Tại vị trí {item.position.nameVi}:
                        </span>
                        <p className="font-body text-sm text-[#253C44] leading-relaxed">
                          {item.positionMeaning}
                        </p>
                      </div>

                      {/* Contextual Category Meaning */}
                      <div>
                        <span className="font-body text-xs font-bold text-[#B58C60] uppercase tracking-wider block mb-1">
                          Góc nhìn lĩnh vực ({getCategoryLabelVi(interpretation.category)}):
                        </span>
                        <p className="font-body text-sm text-[#52636A] leading-relaxed">
                          {item.categoryMeaning}
                        </p>
                      </div>

                      {/* Symbolism */}
                      <div className="p-3.5 rounded-lg bg-[#E8DCC9]/50 border border-[#D8C8B3]">
                        <span className="font-body text-xs font-bold text-[#52636A] uppercase tracking-wider block mb-0.5">
                          Biểu tượng cổ điển Rider–Waite–Smith:
                        </span>
                        <p className="font-body text-xs sm:text-sm text-[#52636A] italic leading-relaxed">
                          {item.card.symbolism}
                        </p>
                      </div>

                      {/* Reflection Prompt */}
                      <div className="p-3.5 rounded-lg bg-[#E8DCC9]/90 border border-[#B58C60]/40">
                        <span className="font-body text-xs font-bold text-[#253C44] uppercase tracking-wider block mb-0.5">
                          Gợi ý suy ngẫm nội tâm:
                        </span>
                        <p className="font-body text-sm text-[#253C44] font-medium leading-relaxed">
                          "{item.card.reflectionPrompt}"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Lời Khuyên Chiêm Nghiệm Từ Cổ Thư */}
      <div className="p-5 rounded-xl bg-[#E8DCC9]/80 border border-[#D8C8B3] flex flex-col space-y-2">
        <span className="font-display text-base font-semibold text-[#253C44]">
          Lời Khuyên Chiêm Nghiệm
        </span>
        <p className="font-body text-sm sm:text-base text-[#253C44] leading-relaxed">
          {interpretation.coreAdvice}
        </p>
      </div>
    </div>
  );
};
