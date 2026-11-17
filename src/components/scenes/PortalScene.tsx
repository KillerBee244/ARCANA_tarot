"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Compass, Sparkles, ChevronRight, FastForward } from "lucide-react";

interface PortalSceneProps {
  onEnter: () => void;
  onOpenHistory?: () => void;
}

export const PortalScene: React.FC<PortalSceneProps> = ({ onEnter, onOpenHistory }) => {
  const [isExpanding, setIsExpanding] = useState(false);

  const handleStart = () => {
    setIsExpanding(true);
    setTimeout(() => {
      onEnter();
    }, 700);
  };

  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Background Celestial Astrolabe & Orbital Rings */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          scale: isExpanding ? 2.5 : 1,
          opacity: isExpanding ? 0 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Outermost Celestial Ring */}
        <div className="w-[680px] h-[680px] rounded-full border border-[#DAA87B]/20 animate-spin-slow" />
        {/* Middle Astrolabe Coordinate Ring */}
        <div className="absolute w-[500px] h-[500px] rounded-full border border-[#C6F68D]/25 border-dashed animate-spin-reverse-slow" />
        {/* Inner Ring */}
        <div className="absolute w-[340px] h-[340px] rounded-full border border-[#DAA87B]/35" />
        {/* Concentric Glow Core */}
        <div className="absolute w-[220px] h-[220px] rounded-full bg-gradient-to-tr from-[#172B38] to-[#0B1020] border border-[#C6F68D]/40 shadow-celestial-glow opacity-80" />
      </motion.div>

      {/* Floating Star Dust */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { x: "15%", y: "25%", size: 2 },
          { x: "82%", y: "30%", size: 3 },
          { x: "28%", y: "75%", size: 2.5 },
          { x: "70%", y: "80%", size: 2 },
          { x: "50%", y: "15%", size: 3.5 },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#E9DFC9] animate-pulse-subtle"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              boxShadow: "0 0 8px #C6F68D",
            }}
          />
        ))}
      </div>

      {/* Center Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6"
        animate={{
          scale: isExpanding ? 1.2 : 1,
          opacity: isExpanding ? 0 : 1,
        }}
        transition={{ duration: 0.6 }}
      >
        {/* Atmospheric Small Monospace Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#172B38]/80 border border-[#DAA87B]/30 mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C6F68D]" />
          <span className="font-mono text-[11px] tracking-widest text-[#E9DFC9] uppercase">
            CELESTIAL NEO-ARCHIVE
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl md:text-8xl tracking-tight text-[#E9DFC9] font-light leading-none mb-3"
        >
          ARCANA
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-mono text-xs md:text-sm tracking-[0.25em] text-[#DAA87B] uppercase mb-6"
        >
          THE ARCHIVE OF POSSIBILITIES
        </motion.p>

        {/* Fine ornamental divider */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#DAA87B] to-transparent mb-6" />

        {/* Vietnamese Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="font-body text-base md:text-lg text-[#E9DFC9]/90 leading-relaxed font-normal mb-8 max-w-lg"
        >
          Mỗi lá bài là một cánh cửa. Mỗi câu hỏi mở ra một vũ trụ.
        </motion.p>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DAA87B] via-[#F2CBA4] to-[#DAA87B] text-[#0B1020] font-mono text-xs uppercase tracking-widest font-bold shadow-copper-glow hover:shadow-celestial-glow hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span>Bắt đầu hành trình</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="px-5 py-3 rounded-full font-mono text-xs text-[#B5AA94] hover:text-[#E9DFC9] hover:bg-[#172B38]/60 border border-transparent hover:border-[#DAA87B]/30 transition-all cursor-pointer"
            >
              Xem kho lưu trữ
            </button>
          )}
        </motion.div>
      </motion.div>

      {/* Skip Intro & Technical Bottom Microcopy */}
      <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-between items-center text-[#B5AA94]/60 font-mono text-[10px]">
        <span>ARCHIVE-V1.0 • 78 CARDS READY</span>
        <button
          onClick={onEnter}
          className="hover:text-[#E9DFC9] flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <span>Bỏ qua phần giới thiệu</span>
          <FastForward className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
