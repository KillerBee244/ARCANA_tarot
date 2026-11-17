"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AIStatus, AIInterpretationResult } from "@/types/reading";
import { Sparkles, RefreshCw, AlertTriangle, HelpCircle, MessageSquareQuote, CheckCircle2 } from "lucide-react";

interface AIReadingProps {
  aiStatus: AIStatus;
  aiResult: AIInterpretationResult | null;
  aiError: string | null;
  onRetry: () => void;
  userQuestion?: string;
}

export const AIReading: React.FC<AIReadingProps> = ({
  aiStatus,
  aiResult,
  aiError,
  onRetry,
  userQuestion,
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
    <div className="w-full flex flex-col space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#C6F68D]/30 pb-3">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-5 h-5 text-[#C6F68D]" />
          <div>
            <h3 className="font-display text-xl md:text-2xl text-[#E9DFC9] tracking-wide font-medium">
              Góc Nhìn AI
            </h3>
            <span className="font-mono text-[10px] tracking-widest text-[#B5AA94] uppercase">
              The Living Interpretation • Google Gemini Intelligence Layer
            </span>
          </div>
        </div>

        {/* AI Status Badge */}
        <div>
          {aiStatus === "loading" && (
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#172B38] border border-[#C6F68D]/40 text-[10px] font-mono text-[#C6F68D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6F68D] animate-ping" />
              <span>Đang kết nối...</span>
            </div>
          )}
          {aiStatus === "success" && (
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#C6F68D]/15 border border-[#C6F68D]/40 text-[10px] font-mono text-[#C6F68D]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã hoàn tất</span>
            </div>
          )}
        </div>
      </div>

      {/* RENDER BASED ON AI STATUS */}
      {/* 1. LOADING SKELETON */}
      {aiStatus === "loading" && (
        <div className="p-6 rounded-xl bg-[#172B38]/40 border border-[#DAA87B]/20 flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-[#C6F68D]">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="font-mono text-xs">
              Đang tham vấn trí tuệ Gemini... Trải nghiệm truyền thống bên cạnh vẫn đang hiển thị trọn vẹn.
            </span>
          </div>

          <div className="space-y-3 animate-pulse pt-2">
            <div className="h-5 bg-[#172B38] rounded-md w-3/4" />
            <div className="h-4 bg-[#172B38] rounded-md w-full" />
            <div className="h-4 bg-[#172B38] rounded-md w-5/6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="h-24 bg-[#172B38] rounded-lg" />
              <div className="h-24 bg-[#172B38] rounded-lg" />
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
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#172B38] via-[#0F162B] to-[#0B1020] border border-[#C6F68D]/40 shadow-sm relative overflow-hidden">
            <div className="space-y-2">
              <span className="font-mono text-[10px] tracking-widest text-[#C6F68D] uppercase">
                Thông điệp tiếp nối
              </span>
              <h4 className="font-display text-xl md:text-2xl text-[#E9DFC9] font-medium leading-tight">
                {aiResult.title}
              </h4>
              <p className="font-body text-sm text-[#E9DFC9]/90 leading-relaxed pt-1">
                {aiResult.overview}
              </p>
            </div>
          </div>

          {/* Personalized Interpretation for User Question */}
          <div className="p-5 rounded-xl bg-[#0B1020]/90 border border-[#DAA87B]/30 space-y-2">
            <div className="flex items-center space-x-2">
              <MessageSquareQuote className="w-4 h-4 text-[#DAA87B]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#DAA87B]">
                Soi rọi câu hỏi cá nhân: "{userQuestion || "Định hướng cuộc sống"}"
              </span>
            </div>
            <p className="font-body text-sm text-[#E9DFC9] leading-relaxed">
              {aiResult.personalizedInterpretation}
            </p>
          </div>

          {/* Card Connections */}
          {aiResult.cardConnections && aiResult.cardConnections.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#B5AA94]">
                Sợi Dây Liên Kết Giữa Các Lá Bài
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {aiResult.cardConnections.map((conn, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-[#172B38]/60 border border-[#DAA87B]/20 text-xs text-[#E9DFC9]/90 leading-relaxed font-body"
                  >
                    <span className="font-mono text-[10px] text-[#C6F68D] mr-2">
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
            <div className="p-4 rounded-xl bg-[#172B38]/50 border border-[#C6F68D]/25 space-y-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-[#C6F68D]" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#C6F68D]">
                  Câu Hỏi Tự Vấn Từ Gemini
                </span>
              </div>
              <ul className="space-y-2">
                {aiResult.reflectionQuestions.map((q, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs md:text-sm text-[#E9DFC9]">
                    <span className="font-mono text-[#DAA87B] mt-0.5">•</span>
                    <span className="font-body italic">"{q}"</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Closing Blessing */}
          <div className="p-4 rounded-xl bg-[#0B1020]/90 border border-[#DAA87B]/30 text-center">
            <p className="font-display text-base text-[#DAA87B] italic">
              "{aiResult.closingMessage}"
            </p>
          </div>
        </motion.div>
      )}

      {/* 3. FALLBACK / ERROR / DISABLED VIEW */}
      {(aiStatus === "disabled" ||
        aiStatus === "error" ||
        aiStatus === "rate_limited" ||
        aiStatus === "timeout") && (
        <div className="p-5 rounded-xl bg-[#172B38]/40 border border-[#DAA87B]/30 flex flex-col space-y-3">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-[#DAA87B] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-mono text-xs uppercase tracking-wider text-[#E9DFC9]">
                {aiStatus === "disabled"
                  ? "Chế Độ Truyền Thống Đang Kích Hoạt"
                  : aiStatus === "rate_limited"
                  ? "Hạn Ngạch AI Tạm Thời Đã Đầy"
                  : aiStatus === "timeout"
                  ? "Hết Thời Gian Phản Hồi AI"
                  : "Dịch Vụ AI Tạm Gián Đoạn"}
              </h5>
              <p className="font-body text-xs md:text-sm text-[#B5AA94] leading-relaxed">
                Phần diễn giải AI hiện chưa khả dụng. Bạn vẫn có thể khám phá đầy đủ thông điệp từ bộ bài Tarot truyền thống.
              </p>
              {aiError && (
                <p className="font-mono text-[11px] text-[#B5AA94]/80 pt-1">
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
                className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full font-mono text-xs transition-all ${
                  cooldown > 0
                    ? "bg-[#172B38] text-[#B5AA94]/50 border border-[#DAA87B]/20 cursor-not-allowed"
                    : "bg-[#172B38] text-[#C6F68D] border border-[#C6F68D]/40 hover:bg-[#172B38]/90 hover:border-[#C6F68D] cursor-pointer"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cooldown > 0 ? "animate-spin" : ""}`} />
                <span>{cooldown > 0 ? `Thử lại sau (${cooldown}s)` : "Thử lại kết nối AI"}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

