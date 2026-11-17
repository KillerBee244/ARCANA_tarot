"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ReadingSessionRecord } from "@/types/reading";
import { historyStorage } from "@/lib/storage/history";
import { getCardById } from "@/data/tarot/cards";
import { getCategoryLabelVi, getCleanViCardName } from "@/data/tarot/categories";
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-[#223846] border border-[#DAB48A]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F4EADA]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#DAB48A]/25 flex items-center justify-between bg-[#192B38]">
            <div className="flex items-center space-x-3">
              <Archive className="w-5 h-5 text-[#DAB48A]" />
              <h3 className="font-display text-xl sm:text-2xl text-[#F4EADA]">
                Kho Lưu Trữ Trải Bài
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#C1CFD0] hover:text-[#F4EADA] hover:bg-[#284450] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body List */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
            {readings.length === 0 ? (
              <div className="py-12 text-center text-[#C1CFD0] space-y-2">
                <Clock className="w-8 h-8 mx-auto text-[#DAB48A]/40 mb-2" />
                <p className="font-body text-sm">Chưa có trải bài nào được lưu.</p>
                <p className="font-body text-xs text-[#A7BBC0]">
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
                    className="p-4 rounded-xl bg-[#192B38] border border-[#DAB48A]/20 hover:border-[#C7E9AD]/50 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-[#284450] text-[#C7E9AD] border border-[#C7E9AD]/30 uppercase font-semibold">
                          {getCategoryLabelVi(rec.category)}
                        </span>
                        <span className="font-mono text-xs text-[#A7BBC0]">
                          {formattedDate}
                        </span>
                      </div>
                      <h4 className="font-display text-base sm:text-lg text-[#F4EADA] font-medium group-hover:text-[#C7E9AD] transition-colors">
                        "{rec.question || "Trải bài định hướng tổng quát"}"
                      </h4>
                      <p className="font-body text-xs text-[#C1CFD0]">
                        {rec.spreadType === "single" ? "Trải 1 lá" : "Trải 3 lá"}:{" "}
                        {rec.selectedCards
                          .map((c) => {
                            const card = getCardById(c.cardId);
                            const name = card ? getCleanViCardName(card.nameVi) : c.cardId;
                            return `${name} (${c.orientation === "upright" ? "Thuận" : "Ngược"})`;
                          })
                          .join(" • ")}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleDelete(rec.readingId, e)}
                        className="p-2 rounded-lg text-[#A7BBC0] hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Xóa trải bài này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ArrowUpRight className="w-5 h-5 text-[#DAB48A] group-hover:text-[#C7E9AD] transition-colors" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {readings.length > 0 && (
            <div className="p-4 border-t border-[#DAB48A]/20 flex justify-between items-center bg-[#192B38]">
              <span className="font-body text-xs text-[#A7BBC0]">
                Tổng số: {readings.length} trải bài được lưu trong trình duyệt
              </span>
              <button
                onClick={handleClearAll}
                className="font-body text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
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
