"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RulebaseInterpretation } from "@/types/tarot";
import { BookOpen, Compass, ChevronDown, ChevronUp, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";

interface RulebaseReadingProps {
  interpretation: RulebaseInterpretation;
}

export const RulebaseReading: React.FC<RulebaseReadingProps> = ({ interpretation }) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#DAA87B]/30 pb-3">
        <div className="flex items-center space-x-2.5">
          <BookOpen className="w-5 h-5 text-[#DAA87B]" />
          <div>
            <h3 className="font-display text-xl md:text-2xl text-[#E9DFC9] tracking-wide font-medium">
              Diễn Giải Truyền Thống
            </h3>
            <span className="font-mono text-[10px] tracking-widest text-[#B5AA94] uppercase">
              The Ancient Wisdom • Quy Tắc Rider–Waite–Smith v{interpretation.rulebookVersion}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded bg-[#172B38]/60 border border-[#DAA87B]/30 text-[10px] font-mono text-[#DAA87B]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C6F68D]" />
          <span>Xác thực cục bộ</span>
        </div>
      </div>

      {/* Synthesis Overview Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-[#172B38]/80 to-[#0F162B] border border-[#DAA87B]/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAA87B]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start space-x-3">
          <Compass className="w-5 h-5 text-[#C6F68D] flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-display text-lg text-[#E9DFC9] font-medium">
              Dòng Chảy Năng Lượng Tổng Thể
            </h4>
            <p className="font-body text-sm text-[#E9DFC9]/90 leading-relaxed">
              {interpretation.overviewSynthesis}
            </p>
          </div>
        </div>
      </div>

      {/* Combination Rules Badges (If any rule triggered) */}
      {interpretation.combinationRules.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-mono text-xs uppercase tracking-wider text-[#B5AA94]">
            Quy luật kết hợp đặc biệt ({interpretation.combinationRules.length})
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interpretation.combinationRules.map((rule) => (
              <div
                key={rule.ruleId}
                className="p-3.5 rounded-lg bg-[#0B1020]/90 border border-[#DAA87B]/30 flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C6F68D]" />
                  <span className="font-mono text-xs font-semibold text-[#E9DFC9]">
                    {rule.titleVi}
                  </span>
                </div>
                <p className="font-body text-xs text-[#B5AA94] leading-relaxed">
                  {rule.descriptionVi}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Cards Detailed Breakdown */}
      <div className="space-y-4">
        <h5 className="font-mono text-xs uppercase tracking-wider text-[#B5AA94]">
          Chi Tiết Từng Lá Bài
        </h5>

        <div className="space-y-3">
          {interpretation.cards.map((item, index) => {
            const isExpanded = expandedCardId === item.card.id;
            const isUpright = item.orientation === "upright";

            return (
              <div
                key={item.card.id}
                className="rounded-xl bg-[#172B38]/50 border border-[#DAA87B]/25 overflow-hidden transition-all duration-300 hover:border-[#DAA87B]/50"
              >
                {/* Collapsible Card Header */}
                <button
                  onClick={() => toggleExpand(item.card.id)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#172B38]/70 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs text-[#C6F68D] font-bold w-5">
                      0{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-display text-base md:text-lg text-[#E9DFC9] font-medium">
                          {item.card.nameVi}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                            isUpright
                              ? "bg-[#C6F68D]/15 text-[#C6F68D] border border-[#C6F68D]/30"
                              : "bg-red-950/60 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {isUpright ? "Thuận" : "Ngược"}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-[#B5AA94]">
                        Vị trí: {item.position.nameVi}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[#DAA87B]">
                    <span className="font-mono text-[11px] hidden sm:inline">
                      {isExpanded ? "Thu gọn" : "Chi tiết"}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 pt-1 border-t border-[#DAA87B]/15 space-y-3"
                    >
                      {/* Position Specific Interpretation */}
                      <div>
                        <span className="font-mono text-[10px] tracking-wider text-[#C6F68D] uppercase">
                          Ý nghĩa tại vị trí:
                        </span>
                        <p className="font-body text-xs md:text-sm text-[#E9DFC9]/90 mt-0.5 leading-relaxed">
                          {item.positionMeaning}
                        </p>
                      </div>

                      {/* Contextual Category Meaning */}
                      <div>
                        <span className="font-mono text-[10px] tracking-wider text-[#DAA87B] uppercase">
                          Góc nhìn lĩnh vực ({interpretation.category.toUpperCase()}):
                        </span>
                        <p className="font-body text-xs md:text-sm text-[#E9DFC9]/80 mt-0.5 leading-relaxed">
                          {item.categoryMeaning}
                        </p>
                      </div>

                      {/* Symbolism */}
                      <div className="p-3 rounded bg-[#0B1020]/60 border border-[#DAA87B]/20">
                        <span className="font-mono text-[10px] tracking-wider text-[#B5AA94] uppercase">
                          Biểu tượng Rider–Waite–Smith:
                        </span>
                        <p className="font-body text-xs text-[#B5AA94] mt-0.5 italic">
                          {item.card.symbolism}
                        </p>
                      </div>

                      {/* Reflection Prompt */}
                      <div className="p-3 rounded bg-[#172B38]/90 border border-[#C6F68D]/20">
                        <span className="font-mono text-[10px] tracking-wider text-[#C6F68D] uppercase">
                          Gợi ý suy ngẫm:
                        </span>
                        <p className="font-body text-xs md:text-sm text-[#E9DFC9] mt-0.5 font-medium">
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

      {/* Core Rulebase Advice */}
      <div className="p-4 rounded-xl bg-[#0B1020]/80 border border-[#DAA87B]/30 flex flex-col space-y-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#DAA87B] font-semibold">
          Lời Khuyên Từ Cổ Thư
        </span>
        <p className="font-body text-sm text-[#E9DFC9] leading-relaxed">
          {interpretation.coreAdvice}
        </p>
      </div>
    </div>
  );
};
