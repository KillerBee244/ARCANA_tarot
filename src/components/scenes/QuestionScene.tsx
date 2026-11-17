"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
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
    }, 350);
  };

  const handleUseExample = (exampleText: string) => {
    setQuestion(exampleText);
  };

  return (
    <div className="relative min-h-[88vh] w-full flex items-center justify-center px-4 py-8 select-none bg-[#192B38]">
      <motion.div
        animate={{
          scale: isSubmitting ? 0.96 : 1,
          opacity: isSubmitting ? 0 : 1,
          y: isSubmitting ? -16 : 0,
        }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-2xl bg-[#223846]/95 border border-[#DAB48A]/40 rounded-2xl p-5 sm:p-7 md:p-9 shadow-2xl backdrop-blur-md"
      >
        {/* Subtle Top Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#284450] border border-[#DAB48A]/35 text-[#C7E9AD] font-body text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bước 01 • Khởi tạo ý nguyện</span>
          </div>
        </div>

        {/* Editorial Heading (Fraunces) */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl sm:text-4xl text-[#F4EADA] font-light tracking-wide leading-tight">
            Điều gì đang khiến bạn băn khoăn?
          </h2>
          <p className="font-body text-sm text-[#C1CFD0] mt-2 max-w-md mx-auto leading-relaxed">
            Hãy tĩnh lặng trong giây lát và nghĩ về điều bạn thực sự muốn thấu suốt.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selector Pills */}
          <div>
            <label className="block font-body text-xs font-semibold uppercase tracking-wider text-[#C1CFD0] mb-2.5">
              Lĩnh vực câu hỏi:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                const isLastOdd = idx === 4;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-body transition-all cursor-pointer ${
                      isLastOdd ? "col-span-2 sm:col-span-1" : ""
                    } ${
                      isSelected
                        ? "bg-[#284450] border-[#C7E9AD] text-[#C7E9AD] shadow-celestial-glow font-semibold"
                        : "bg-[#192B38]/80 border-[#45616B]/60 text-[#C1CFD0] hover:border-[#DAB48A]/70 hover:text-[#F4EADA]"
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Textarea (Refined size: 16px/18px with comfortable line-height) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-body text-xs font-semibold uppercase tracking-wider text-[#C1CFD0]">
                Câu hỏi của bạn (hoặc để trống để trải bài tổng quát):
              </label>
              <span className="font-mono text-xs text-[#A7BBC0]">
                {question.length}/300
              </span>
            </div>

            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value.slice(0, 300))}
                rows={3}
                placeholder="Nhập băn khoăn của bạn hoặc chọn câu hỏi gợi ý bên dưới..."
                className="w-full rounded-xl bg-[#192B38] border border-[#45616B] focus:border-[#C7E9AD] focus:ring-1 focus:ring-[#C7E9AD] p-4 text-base md:text-lg font-body text-[#F4EADA] placeholder-[#A7BBC0]/50 outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Inspiration Suggestion Pill */}
            <div className="mt-2.5 flex items-start space-x-2">
              <span className="font-body text-xs text-[#DAB48A] font-semibold flex-shrink-0 mt-0.5">
                Gợi ý:
              </span>
              <button
                type="button"
                onClick={() => handleUseExample(activeCategoryObj.example)}
                className="text-left font-body text-xs text-[#C1CFD0] hover:text-[#C7E9AD] italic underline transition-colors cursor-pointer line-clamp-1"
              >
                "{activeCategoryObj.example}"
              </button>
            </div>
          </div>

          {/* Spread Type & Options Configuration */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#284450]/80 border border-[#DAB48A]/25 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Spread mode */}
            <div>
              <label className="block font-body text-xs font-semibold uppercase tracking-wider text-[#C1CFD0] mb-2 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-[#DAB48A]" />
                <span>Kiểu trải bài:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSpreadType("three_card")}
                  className={`px-3 py-2 rounded-lg font-body text-xs transition-all cursor-pointer ${
                    spreadType === "three_card"
                      ? "bg-[#C7E9AD] text-[#111E2C] font-semibold shadow-sm"
                      : "bg-[#192B38] text-[#C1CFD0] border border-[#45616B]"
                  }`}
                >
                  Trải 3 lá (Chính)
                </button>
                <button
                  type="button"
                  onClick={() => setSpreadType("single")}
                  className={`px-3 py-2 rounded-lg font-body text-xs transition-all cursor-pointer ${
                    spreadType === "single"
                      ? "bg-[#C7E9AD] text-[#111E2C] font-semibold shadow-sm"
                      : "bg-[#192B38] text-[#C1CFD0] border border-[#45616B]"
                  }`}
                >
                  Trải 1 lá (Đơn)
                </button>
              </div>
            </div>

            {/* Allow reversed cards toggle */}
            <div>
              <label className="block font-body text-xs font-semibold uppercase tracking-wider text-[#C1CFD0] mb-2 flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#DAB48A]" />
                <span>Quy ước trải bài:</span>
              </label>
              <label className="flex items-center space-x-3 p-2 rounded-lg bg-[#192B38] border border-[#45616B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowReversed}
                  onChange={(e) => setAllowReversed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C7E9AD] focus:ring-0 accent-[#C7E9AD] cursor-pointer"
                />
                <span className="font-body text-xs text-[#F4EADA]">
                  Cho phép lá bài ngược (Reversed)
                </span>
              </label>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#C7E9AD] text-[#111E2C] font-body text-sm font-semibold tracking-wide shadow-celestial-glow hover:bg-[#A4D283] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Tiến vào kho lưu trữ bài</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
