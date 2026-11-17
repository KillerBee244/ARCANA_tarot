"use client";

import React, { useState } from "react";
import { Bookmark, Copy, RotateCcw, Check, Archive, Share2 } from "lucide-react";

interface ReadingActionsProps {
  onSave: () => void;
  onCopy: () => void;
  onRestart: () => void;
  onOpenHistory: () => void;
  isSaved?: boolean;
}

export const ReadingActions: React.FC<ReadingActionsProps> = ({
  onSave,
  onCopy,
  onRestart,
  onOpenHistory,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyClick = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#DAA87B]/30 select-none">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Save button */}
        <button
          onClick={onSave}
          disabled={isSaved}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
            isSaved
              ? "bg-[#172B38] text-[#C6F68D] border border-[#C6F68D]/40"
              : "bg-[#172B38] text-[#E9DFC9] border border-[#DAA87B]/30 hover:border-[#DAA87B] hover:bg-[#172B38]/80"
          }`}
        >
          {isSaved ? <Check className="w-3.5 h-3.5 text-[#C6F68D]" /> : <Bookmark className="w-3.5 h-3.5 text-[#DAA87B]" />}
          <span>{isSaved ? "Đã lưu" : "Lưu trải bài"}</span>
        </button>

        {/* Copy button */}
        <button
          onClick={handleCopyClick}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider bg-[#172B38] text-[#E9DFC9] border border-[#DAA87B]/30 hover:border-[#DAA87B] hover:bg-[#172B38]/80 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#C6F68D]" /> : <Copy className="w-3.5 h-3.5 text-[#DAA87B]" />}
          <span>{copied ? "Đã chép" : "Sao chép kết quả"}</span>
        </button>

        {/* History drawer button */}
        <button
          onClick={onOpenHistory}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider bg-[#172B38] text-[#B5AA94] border border-[#DAA87B]/20 hover:text-[#E9DFC9] hover:border-[#DAA87B]/50 transition-all cursor-pointer"
        >
          <Archive className="w-3.5 h-3.5 text-[#DAA87B]" />
          <span>Lịch sử</span>
        </button>
      </div>

      {/* Restart reading */}
      <button
        onClick={onRestart}
        className="flex items-center space-x-1.5 px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider bg-[#C6F68D] text-[#0B1020] font-semibold hover:bg-[#A0D462] hover:shadow-celestial-glow transition-all cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Trải Bài Mới</span>
      </button>
    </div>
  );
};
