"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Compass, ArrowRight } from "lucide-react";

interface CelestialLoadingTransitionProps {
  userName?: string;
  question?: string;
  onSkip?: () => void;
}

export const CelestialLoadingTransition: React.FC<CelestialLoadingTransitionProps> = ({
  userName,
  question,
  onSkip,
}) => {
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  const PHRASES = [
    "Các vì tinh tú đang hội tụ và kết nối năng lượng...",
    "Google Gemini AI đang đàm thoại cùng cổ thư Rider–Waite–Smith...",
    "Đang dệt nên lời luận giải cá nhân hóa sâu sắc nhất...",
    "Cánh cửa tâm thức sắp sửa mở ra...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [PHRASES.length]);

  const displayName = userName?.trim() || "Lữ khách";

  return (
    <div className="relative min-h-[75vh] w-full flex flex-col items-center justify-center px-4 py-8 select-none overflow-hidden">
      {/* Background Soft Celestial Halo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
        <div
          className="w-[500px] h-[500px] rounded-full blur-3xl animate-pulse-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(218, 180, 138, 0.25) 0%, rgba(128, 189, 178, 0.15) 45%, transparent 70%)",
          }}
        />
        {/* Spinning Orbital Coordinate Rings */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-[#DAB48A]/25 animate-spin-slow" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-[#80BDB2]/30 border-dashed animate-spin-reverse-slow" />
        <div className="absolute w-[180px] h-[180px] rounded-full border border-[#C7E9AD]/35" />
      </div>

      {/* Central Content Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg p-6 sm:p-8 rounded-3xl bg-[#192B38]/90 border border-[#DAB48A]/40 shadow-2xl backdrop-blur-md"
      >
        {/* Glowing Astrolabe Core */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#284450] to-[#111E2C] border border-[#C7E9AD]/60 shadow-celestial-glow flex items-center justify-center mb-5">
          <Sparkles className="w-8 h-8 text-[#C7E9AD] animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-[#DAB48A] animate-ping opacity-30" />
        </div>

        {/* Dynamic Title */}
        <span className="font-mono text-[11px] tracking-widest text-[#DAB48A] uppercase block mb-1">
          ✦ KHỞI TẠO GÓC NHÌN AI • THE LIVING REVELATION ✦
        </span>

        <h3 className="font-display text-2xl sm:text-3xl text-[#F4EADA] font-light tracking-wide mt-1 mb-2">
          Đang Luận Giải Cho {displayName}
        </h3>

        {question && (
          <p className="font-body text-xs text-[#C1CFD0] italic max-w-xs truncate mb-4">
            &ldquo;{question}&rdquo;
          </p>
        )}

        {/* Shifting Mystical Phrases */}
        <div className="h-10 flex items-center justify-center my-2">
          <motion.p
            key={loadingPhraseIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="font-body text-xs sm:text-sm text-[#C7E9AD] font-medium"
          >
            {PHRASES[loadingPhraseIndex]}
          </motion.p>
        </div>

        {/* Glowing Progress Pulse Bar */}
        <div className="w-48 h-1 bg-[#223846] rounded-full overflow-hidden mt-4 mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-[#DAB48A] via-[#C7E9AD] to-[#80BDB2]"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          />
        </div>

        {/* Skip waiting button */}
        {onSkip && (
          <button
            onClick={onSkip}
            className="inline-flex items-center space-x-1.5 text-xs font-body text-[#A7BBC0] hover:text-[#F4EADA] transition-colors cursor-pointer"
          >
            <span>Xem trước Diễn giải Cổ thư</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </div>
  );
};
