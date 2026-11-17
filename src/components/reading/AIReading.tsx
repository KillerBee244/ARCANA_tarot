"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AIStatus, AIInterpretationResult } from "@/types/reading";
import { Sparkles, RefreshCw, AlertCircle, HelpCircle, MessageSquareQuote, CheckCircle2 } from "lucide-react";

interface AIReadingProps {
  aiStatus: AIStatus;
  aiResult: AIInterpretationResult | null;
  aiError: string | null;
  onRetry: () => void;
  userQuestion?: string;
  userName?: string;
}

export const AIReading: React.FC<AIReadingProps> = ({
  aiStatus,
  aiResult,
  aiError,
  onRetry,
  userQuestion,
  userName,
}) => {
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleRetryClick = () => {
    if (cooldown === 0) {
      setCooldown(15);
      onRetry();
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 text-[#F4EADA]">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#80BDB2]/30 pb-3">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-5 h-5 text-[#C7E9AD]" />
          <div>
            <h3 className="font-display text-2xl text-[#F4EADA] tracking-wide font-medium">
              Góc Nhìn AI
            </h3>
            <span className="font-mono text-[11px] tracking-wider text-[#A7BBC0] uppercase font-medium">
              The Living Interpretation • Google Gemini Intelligence Layer
            </span>
          </div>
        </div>

        {/* AI Status Badge */}
        <div>
          {aiStatus === "loading" && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#192B38] border border-[#C7E9AD]/50 text-xs font-body text-[#C7E9AD]">
              <span className="w-2 h-2 rounded-full bg-[#C7E9AD] animate-ping" />
              <span>Đang kết nối...</span>
            </div>
          )}
          {aiStatus === "success" && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C7E9AD]/15 border border-[#C7E9AD]/40 text-xs font-body text-[#C7E9AD] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã hoàn tất</span>
            </div>
          )}
        </div>
      </div>

      {/* 1. LOADING SKELETON */}
      {aiStatus === "loading" && (
        <div className="p-6 rounded-xl bg-[#192B38]/60 border border-[#45616B]/40 flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-[#C7E9AD]">
            <RefreshCw className="w-4 h-4 animate-spin text-[#C7E9AD]" />
            <span className="font-body text-sm text-[#F4EADA]">
              Đang tham vấn trí tuệ Gemini... Trải nghiệm truyền thống bên cạnh vẫn đang hiển thị trọn vẹn.
            </span>
          </div>

          <div className="space-y-3 animate-pulse pt-2">
            <div className="h-5 bg-[#284450] rounded-md w-3/4" />
            <div className="h-4 bg-[#284450] rounded-md w-full" />
            <div className="h-4 bg-[#284450] rounded-md w-5/6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="h-24 bg-[#284450] rounded-lg" />
              <div className="h-24 bg-[#284450] rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* 2. SUCCESS VIEW */}
      {aiStatus === "success" && aiResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Main Title & Overview Banner */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#192B38] border border-[#80BDB2]/40 shadow-sm relative overflow-hidden space-y-2">
            <span className="font-body text-xs font-bold text-[#C7E9AD] uppercase tracking-wider block">
              Thông điệp tiếp nối
            </span>
            <h4 className="font-display text-xl sm:text-2xl text-[#F4EADA] font-semibold leading-snug">
              {aiResult.title}
            </h4>
            <p className="font-body text-sm sm:text-base text-[#F4EADA]/90 leading-relaxed pt-1">
              {aiResult.overview}
            </p>
          </div>

          {/* Personalized Interpretation for User Question */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#192B38]/80 border border-[#DAB48A]/35 space-y-2.5">
            <div className="flex items-center space-x-2">
              <MessageSquareQuote className="w-4 h-4 text-[#DAB48A]" />
              <span className="font-body text-xs font-bold uppercase tracking-wider text-[#DAB48A]">
                Soi rọi câu hỏi cá nhân: "{userQuestion || "Định hướng cuộc sống"}"
              </span>
            </div>
            <p className="font-body text-sm sm:text-base text-[#F4EADA]/90 leading-relaxed">
              {aiResult.personalizedInterpretation}
            </p>
          </div>

          {/* Card Connections */}
          {aiResult.cardConnections && aiResult.cardConnections.length > 0 && (
            <div className="space-y-3">
              <span className="font-body text-xs font-bold uppercase tracking-wider text-[#C1CFD0]">
                Sợi dây liên kết giữa các lá bài
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {aiResult.cardConnections.map((conn, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-[#192B38]/70 border border-[#45616B]/50 text-sm text-[#F4EADA]/90 leading-relaxed font-body"
                  >
                    <span className="font-mono text-xs text-[#C7E9AD] font-bold mr-2">
                      Lá 0{idx + 1}:
                    </span>
                    {conn.connectionText}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reflection Questions */}
          {aiResult.reflectionQuestions && aiResult.reflectionQuestions.length > 0 && (
            <div className="p-5 rounded-xl bg-[#192B38]/80 border border-[#C7E9AD]/30 space-y-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-[#C7E9AD]" />
                <span className="font-body text-xs font-bold uppercase tracking-wider text-[#C7E9AD]">
                  Câu hỏi tự vấn từ Gemini
                </span>
              </div>
              <ul className="space-y-2.5">
                {aiResult.reflectionQuestions.map((q, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-sm text-[#F4EADA]">
                    <span className="font-mono text-[#DAB48A] mt-0.5">•</span>
                    <span className="font-body italic leading-relaxed">"{q}"</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Closing Blessing */}
          <div className="p-4 rounded-xl bg-[#192B38]/90 border border-[#DAB48A]/30 text-center">
            <p className="font-display text-base text-[#DAB48A] italic leading-relaxed">
              "{aiResult.closingMessage}"
            </p>
          </div>
        </motion.div>
      )}

      {/* 3. FALLBACK / ERROR / DISABLED VIEW (Graceful Informational State) */}
      {(aiStatus === "disabled" ||
        aiStatus === "error" ||
        aiStatus === "rate_limited" ||
        aiStatus === "timeout") && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#192B38]/70 border border-[#DAB48A]/35 flex flex-col space-y-4">
          <div className="flex items-start space-x-3.5">
            <AlertCircle className="w-5 h-5 text-[#DAB48A] flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h5 className="font-body text-sm font-semibold text-[#F4EADA]">
                {aiStatus === "disabled"
                  ? "Chế độ truyền thống đang kích hoạt"
                  : aiStatus === "rate_limited"
                  ? "Hạn ngạch AI tạm thời đã đầy"
                  : aiStatus === "timeout"
                  ? "Hết thời gian phản hồi AI"
                  : "Dịch vụ AI tạm gián đoạn"}
              </h5>
              <p className="font-body text-sm text-[#C1CFD0] leading-relaxed">
                Phần diễn giải AI hiện chưa khả dụng. Bạn vẫn có thể khám phá đầy đủ thông điệp từ bộ bài Tarot truyền thống bên cạnh.
              </p>
              {aiError && (
                <p className="font-mono text-xs text-[#A7BBC0] pt-1">
                  Chi tiết: {aiError}
                </p>
              )}
            </div>
          </div>

          {/* Retry Action (Enabled for recoverable errors) */}
          {aiStatus !== "disabled" && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleRetryClick}
                disabled={cooldown > 0}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-body text-xs font-semibold transition-all ${
                  cooldown > 0
                    ? "bg-[#284450] text-[#A7BBC0] border border-[#45616B] cursor-not-allowed"
                    : "bg-[#284450] text-[#C7E9AD] border border-[#C7E9AD]/40 hover:bg-[#385968] hover:border-[#C7E9AD] cursor-pointer"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cooldown > 0 ? "animate-spin" : ""}`} />
                <span>{cooldown > 0 ? `Thử lại sau (${cooldown}s)` : "Thử lại kết nối AI"}</span>
              </button>
            </div>
          )}

          {/* Informative Guidance Card for Architectural Balance */}
          <div className="p-4 rounded-xl bg-[#111E2C]/60 border border-[#45616B]/40 space-y-2.5 mt-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C7E9AD]" />
              <span className="font-display text-sm text-[#F4EADA] font-medium">
                Về Tầng Trí Tuệ Nhân Tạo ARCANA
              </span>
            </div>
            <p className="font-body text-xs text-[#C1CFD0] leading-relaxed">
              Khi được kết nối qua <code className="text-[#C7E9AD] bg-[#284450] px-1 py-0.5 rounded">GEMINI_API_KEY</code>, mô hình Gemini sẽ phân tích tương quan giữa các lá bài đã rút, kiến tạo một bức tranh trực giác liền mạch và đưa ra các câu hỏi phản chiếu nội tâm sâu sắc.
            </p>
            <div className="pt-1.5 border-t border-[#45616B]/30 flex flex-wrap gap-2 text-[10px] font-mono text-[#DAB48A]">
              <span>• Tương thích Gemini 2.5 Flash</span>
              <span>• Fallback tự động 100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
