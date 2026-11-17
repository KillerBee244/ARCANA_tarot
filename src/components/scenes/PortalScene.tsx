"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Archive } from "lucide-react";

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
    <div className="relative min-h-[92vh] w-full flex flex-col items-center justify-center px-4 overflow-hidden select-none bg-gradient-to-b from-[#111E2C] via-[#152332] to-[#192B38]">
      {/* Subtle Radial Illumination Behind Portal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-radial-glow opacity-40 blur-3xl pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(218, 180, 138, 0.15) 0%, rgba(128, 189, 178, 0.08) 45%, transparent 70%)" }} />
      </div>

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
        <div className="w-[660px] h-[660px] rounded-full border border-[#DAB48A]/25 animate-spin-slow" />
        {/* Middle Astrolabe Coordinate Ring */}
        <div className="absolute w-[490px] h-[490px] rounded-full border border-[#80BDB2]/30 border-dashed animate-spin-reverse-slow" />
        {/* Inner Ring */}
        <div className="absolute w-[330px] h-[330px] rounded-full border border-[#DAB48A]/40" />
        {/* Concentric Glow Core */}
        <div className="absolute w-[210px] h-[210px] rounded-full bg-gradient-to-tr from-[#284450] to-[#111E2C] border border-[#C7E9AD]/50 shadow-celestial-glow opacity-75" />
      </motion.div>

      {/* Floating Star Dust (Static subtle coords) */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { x: "16%", y: "22%", size: 2 },
          { x: "84%", y: "28%", size: 2.5 },
          { x: "24%", y: "78%", size: 2 },
          { x: "72%", y: "82%", size: 2.5 },
          { x: "50%", y: "12%", size: 3 },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#F4EADA] animate-pulse-subtle"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              boxShadow: "0 0 6px #C7E9AD",
            }}
          />
        ))}
      </div>

      {/* Center Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6 my-auto"
        animate={{
          scale: isExpanding ? 1.2 : 1,
          opacity: isExpanding ? 0 : 1,
        }}
        transition={{ duration: 0.6 }}
      >
        {/* Atmospheric Editorial Tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#284450]/80 border border-[#DAB48A]/35 mb-6 backdrop-blur-md shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C7E9AD]" />
          <span className="font-mono text-[11px] tracking-widest text-[#F4EADA] uppercase">
            CELESTIAL EDITORIAL ARCHIVE
          </span>
        </motion.div>

        {/* Hero Title (Fraunces Display Font) */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl sm:text-7xl md:text-8xl tracking-tight text-[#F4EADA] font-light leading-none mb-4"
        >
          ARCANA
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-mono text-xs md:text-sm tracking-[0.25em] text-[#DAB48A] uppercase mb-6 font-medium"
        >
          THE ARCHIVE OF POSSIBILITIES
        </motion.p>

        {/* Delicate ornamental divider */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#DAB48A] to-transparent mb-6" />

        {/* Vietnamese Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="font-body text-base md:text-lg text-[#F4EADA]/90 leading-relaxed font-normal mb-8 max-w-lg"
        >
          Mỗi lá bài là một cánh cửa. Mỗi câu hỏi mở ra một vũ trụ.
        </motion.p>

        {/* Primary CTA Button (Redesigned with Astral Dusk Copper Accent) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DAB48A] via-[#ECD2B3] to-[#DAB48A] text-[#111E2C] font-body text-sm font-semibold tracking-wide shadow-copper-glow hover:shadow-celestial-glow hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span>Bắt đầu hành trình</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full font-body text-sm text-[#C1CFD0] hover:text-[#F4EADA] hover:bg-[#284450]/60 border border-transparent hover:border-[#DAB48A]/40 transition-all cursor-pointer"
            >
              <Archive className="w-4 h-4 text-[#DAB48A]" />
              <span>Xem kho lưu trữ</span>
            </button>
          )}
        </motion.div>
      </motion.div>

      {/* Atmospheric Bottom Microcopy */}
      <div className="w-full max-w-5xl px-6 py-4 flex justify-between items-center text-[#A7BBC0]/80 font-mono text-[10px] z-10 border-t border-[#DAB48A]/15 mt-auto">
        <span className="hidden sm:inline">ARCHIVE-V2.0 • 78 RIDER-WAITE-SMITH CARDS</span>
        <span className="sm:hidden">ARCHIVE V2.0</span>
        <button
          onClick={onEnter}
          className="hover:text-[#F4EADA] transition-colors cursor-pointer text-right"
        >
          Bỏ qua giới thiệu →
        </button>
      </div>
    </div>
  );
};
