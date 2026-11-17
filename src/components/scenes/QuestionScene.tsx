"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QuestionCategory, SpreadType } from "@/types/tarot";
import { Heart, Briefcase, DollarSign, User, HelpCircle, ArrowRight, Sparkles, Layers, Sliders } from "lucide-react";

interface QuestionSceneProps {
  initialQuestion?: string;
  initialCategory?: QuestionCategory;
  initialSpreadType?: SpreadType;
  initialAllowReversed?: boolean;
  onSubmit: (data: {
    question: string;
    category: QuestionCategory;
    spreadType: SpreadType;
    allowReversed: boolean;
  }) => void;
}

const CATEGORIES: { id: QuestionCategory; label: string; icon: React.ElementType; example: string }[] = [
  { id: "love", label: "Tình yêu", icon: Heart, example: "Mối quan hệ hiện tại đang hướng về đâu và tôi cần lưu ý điều gì?" },
  { id: "career", label: "Sự nghiệp", icon: Briefcase, example: "Dự án mới này có tiềm năng ra sao và tôi cần phát huy thế mạnh nào?" },
  { id: "finance", label: "Tài chính", icon: DollarSign, example: "Làm thế nào để tôi đạt được sự ổn định và độc lập tài chính?" },
  { id: "self", label: "Bản thân", icon: User, example: "Nút thắt tâm lý nào đang kìm hãm tôi và bài học linh hồn là gì?" },
  { id: "general", label: "Câu hỏi tự do", icon: HelpCircle, example: "Vũ trụ đang gửi gắm thông điệp quan trọng nhất nào cho tôi lúc này?" },
];

export const QuestionScene: React.FC<QuestionSceneProps> = ({
  initialQuestion = "",
  initialCategory = "general",
  initialSpreadType = "three_card",
  initialAllowReversed = true,
  onSubmit,
}) => {
  const [category, setCategory] = useState<QuestionCategory>(initialCategory);
  const [question, setQuestion] = useState<string>(initialQuestion);
  const [spreadType, setSpreadType] = useState<SpreadType>(initialSpreadType);
  const [allowReversed, setAllowReversed] = useState<boolean>(initialAllowReversed);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[4];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        question: question.trim(),
        category,
        spreadType,
        allowReversed,
      });
    }, 400);
  };

  const handleUseExample = (exampleText: string) => {
    setQuestion(exampleText);
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center px-4 py-8 select-none">
      <motion.div
        animate={{
          scale: isSubmitting ? 0.95 : 1,
          opacity: isSubmitting ? 0 : 1,
          y: isSubmitting ? -20 : 0,
        }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-2xl bg-[#0F162B]/90 border border-[#DAA87B]/40 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Subtle Ornamental Top Node */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#172B38] border border-[#DAA87B]/40 text-[#C6F68D] font-mono text-[10px] tracking-widest uppercase flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>BƯỚC 01 • KHỞI Ý NGUYỆN</span>
        </div>

        {/* Heading */}
        <div className="text-center mt-2 mb-6">
          <h2 className="font-display text-3xl md:text-4xl text-[#E9DFC9] font-light tracking-wide">
            Điều gì đang khiến bạn băn khoăn?
          </h2>
          <p className="font-body text-xs md:text-sm text-[#B5AA94] mt-1.5">
            Hãy tĩnh lặng trong vài giây và nghĩ về điều bạn thực sự muốn thấu suốt.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Picker */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#B5AA94] mb-2.5">
              Lĩnh vực câu hỏi:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#172B38] border-[#C6F68D] text-[#C6F68D] shadow-celestial-glow"
                        : "bg-[#0B1020]/60 border-[#DAA87B]/20 text-[#B5AA94] hover:border-[#DAA87B]/60 hover:text-[#E9DFC9]"
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-[#B5AA94]">
                Câu hỏi của bạn (Có thể để trống để trải bài tổng quát):
              </label>
              <span className="font-mono text-[11px] text-[#B5AA94]/70">
                {question.length}/300
              </span>
            </div>

            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value.slice(0, 300))}
                rows={3}
                placeholder="Nhập băn khoăn của bạn hoặc chọn câu hỏi gợi ý bên dưới..."
                className="w-full rounded-xl bg-[#0B1020]/80 border border-[#DAA87B]/30 focus:border-[#C6F68D] focus:ring-1 focus:ring-[#C6F68D] p-3.5 text-sm font-body text-[#E9DFC9] placeholder-[#B5AA94]/40 outline-none transition-all resize-none"
              />
            </div>

            {/* Inspiration Suggestion Pill */}
            <div className="mt-2 flex items-start space-x-2">
              <span className="font-mono text-[10px] text-[#DAA87B] uppercase flex-shrink-0 mt-0.5">
                Gợi ý:
              </span>
              <button
                type="button"
                onClick={() => handleUseExample(activeCategoryObj.example)}
                className="text-left font-body text-xs text-[#B5AA94] hover:text-[#C6F68D] italic underline transition-colors cursor-pointer line-clamp-1"
              >
                "{activeCategoryObj.example}"
              </button>
            </div>
          </div>

          {/* Spread Type & Options Configuration */}
          <div className="p-4 rounded-xl bg-[#172B38]/50 border border-[#DAA87B]/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Spread mode */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#B5AA94] mb-2 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-[#DAA87B]" />
                <span>Kiểu trải bài:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSpreadType("three_card")}
                  className={`px-3 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                    spreadType === "three_card"
                      ? "bg-[#C6F68D] text-[#0B1020] font-bold"
                      : "bg-[#0B1020]/70 text-[#B5AA94] border border-[#DAA87B]/20"
                  }`}
                >
                  Trải 3 lá (Chính)
                </button>
                <button
                  type="button"
                  onClick={() => setSpreadType("single")}
                  className={`px-3 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                    spreadType === "single"
                      ? "bg-[#C6F68D] text-[#0B1020] font-bold"
                      : "bg-[#0B1020]/70 text-[#B5AA94] border border-[#DAA87B]/20"
                  }`}
                >
                  Trải 1 lá (Đơn)
                </button>
              </div>
            </div>

            {/* Allow reversed cards toggle */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#B5AA94] mb-2 flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#DAA87B]" />
                <span>Quy ước trải bài:</span>
              </label>
              <label className="flex items-center space-x-3 p-2 rounded-lg bg-[#0B1020]/70 border border-[#DAA87B]/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowReversed}
                  onChange={(e) => setAllowReversed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C6F68D] focus:ring-0 accent-[#C6F68D] cursor-pointer"
                />
                <span className="font-body text-xs text-[#E9DFC9]">
                  Cho phép lá bài ngược (Reversed)
                </span>
              </label>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#C6F68D] text-[#0B1020] font-mono text-xs uppercase tracking-widest font-bold shadow-celestial-glow hover:bg-[#A0D462] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Tiến vào Kho Lưu Trữ Bài</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
