"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ReadingSessionRecord } from "@/types/reading";
import { historyStorage } from "@/lib/storage/history";
import { X, Clock, Trash2, ArrowUpRight, Archive } from "lucide-react";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReading: (record: ReadingSessionRecord) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectReading,
}) => {
  const [readings, setReadings] = useState<ReadingSessionRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setReadings(historyStorage.getReadings());
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    historyStorage.deleteReading(id);
    setReadings(historyStorage.getReadings());
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử trải bài đã lưu?")) {
      historyStorage.clearHistory();
      setReadings([]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-[#0F162B] border border-[#DAA87B]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-[#DAA87B]/20 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Archive className="w-5 h-5 text-[#DAA87B]" />
              <h3 className="font-display text-xl text-[#E9DFC9]">
                Kho Lưu Trữ Trải Bài Của Bạn
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#B5AA94] hover:text-[#E9DFC9] hover:bg-[#172B38] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body List */}
          <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-3">
            {readings.length === 0 ? (
              <div className="py-12 text-center text-[#B5AA94] space-y-2">
                <Clock className="w-8 h-8 mx-auto text-[#DAA87B]/40 mb-2" />
                <p className="font-body text-sm">Chưa có trải bài nào được lưu.</p>
                <p className="font-mono text-xs text-[#B5AA94]/70">
                  Sau mỗi lượt trải bài, bạn có thể nhấn "Lưu trải bài" để xem lại tại đây.
                </p>
              </div>
            ) : (
              readings.map((rec) => {
                const formattedDate = new Date(rec.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={rec.readingId}
                    onClick={() => {
                      onSelectReading(rec);
                      onClose();
                    }}
                    className="p-4 rounded-xl bg-[#172B38]/60 border border-[#DAA87B]/20 hover:border-[#C6F68D]/50 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#0B1020] text-[#C6F68D] border border-[#C6F68D]/30 uppercase">
                          {rec.category}
                        </span>
                        <span className="font-mono text-[11px] text-[#B5AA94]">
                          {formattedDate}
                        </span>
                      </div>
                      <h4 className="font-display text-base text-[#E9DFC9] font-medium group-hover:text-[#C6F68D] transition-colors">
                        "{rec.question || "Trải bài định hướng tổng quát"}"
                      </h4>
                      <p className="font-mono text-xs text-[#B5AA94]">
                        {rec.spreadType === "single" ? "Trải 1 lá" : "Trải 3 lá"}:{" "}
                        {rec.selectedCards.map((c) => c.cardId).join(", ")}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleDelete(rec.readingId, e)}
                        className="p-2 rounded-lg text-[#B5AA94] hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Xóa trải bài này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ArrowUpRight className="w-5 h-5 text-[#DAA87B] group-hover:text-[#C6F68D] transition-colors" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {readings.length > 0 && (
            <div className="p-4 border-t border-[#DAA87B]/20 flex justify-between items-center bg-[#0B1020]/50">
              <span className="font-mono text-xs text-[#B5AA94]">
                Tổng số: {readings.length} trải bài được lưu trong trình duyệt
              </span>
              <button
                onClick={handleClearAll}
                className="font-mono text-xs text-red-400 hover:text-red-300 underline"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
