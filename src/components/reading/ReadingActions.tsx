"use client";

import React, { useState } from "react";
import { Bookmark, Copy, RotateCcw, Check, Archive } from "lucide-react";

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
    <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#DAB48A]/30 select-none">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Save button */}
        <button
          onClick={onSave}
          disabled={isSaved}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-full font-body text-xs font-semibold transition-all cursor-pointer ${
            isSaved
              ? "bg-[#284450] text-[#C7E9AD] border border-[#C7E9AD]/50"
              : "bg-[#284450] text-[#F4EADA] border border-[#DAB48A]/40 hover:border-[#DAB48A] hover:bg-[#385968]"
          }`}
        >
          {isSaved ? <Check className="w-3.5 h-3.5 text-[#C7E9AD]" /> : <Bookmark className="w-3.5 h-3.5 text-[#DAB48A]" />}
          <span>{isSaved ? "Đã lưu" : "Lưu trải bài"}</span>
        </button>

        {/* Copy button */}
        <button
          onClick={handleCopyClick}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full font-body text-xs font-semibold bg-[#284450] text-[#F4EADA] border border-[#DAB48A]/40 hover:border-[#DAB48A] hover:bg-[#385968] transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#C7E9AD]" /> : <Copy className="w-3.5 h-3.5 text-[#DAB48A]" />}
          <span>{copied ? "Đã chép" : "Sao chép kết quả"}</span>
        </button>

        {/* History drawer button */}
        <button
          onClick={onOpenHistory}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full font-body text-xs font-semibold bg-[#284450] text-[#C1CFD0] border border-[#DAB48A]/30 hover:text-[#F4EADA] hover:border-[#DAB48A] transition-all cursor-pointer"
        >
          <Archive className="w-3.5 h-3.5 text-[#DAB48A]" />
          <span>Lịch sử</span>
        </button>
      </div>

      {/* Restart reading */}
      <button
        onClick={onRestart}
        className="flex items-center space-x-2 px-6 py-2.5 rounded-full font-body text-xs font-semibold tracking-wide bg-[#C7E9AD] text-[#111E2C] hover:bg-[#A4D283] hover:shadow-celestial-glow transition-all cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Trải bài mới</span>
      </button>
    </div>
  );
};
