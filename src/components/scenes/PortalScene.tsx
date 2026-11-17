"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Archive, User, X } from "lucide-react";

interface PortalSceneProps {
  onEnter: (userName: string) => void;
  onOpenHistory?: () => void;
}

export const PortalScene: React.FC<PortalSceneProps> = ({ onEnter, onOpenHistory }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedName = localStorage.getItem("arcana_visitor_name");
      if (savedName) {
        setVisitorName(savedName);
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  useEffect(() => {
    if (isNameModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isNameModalOpen]);

  const handleOpenNameModal = () => {
    setNameError(null);
    setIsNameModalOpen(true);
  };

  const handleConfirmName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = visitorName.trim();
    if (!trimmed) {
      setNameError("Xin hãy để lại danh xưng trước khi cánh cổng mở ra.");
      inputRef.current?.focus();
      return;
    }

    try {
      localStorage.setItem("arcana_visitor_name", trimmed);
    } catch {
      // ignore
    }

    setIsNameModalOpen(false);
    setIsExpanding(true);
    setTimeout(() => {
      onEnter(trimmed);
    }, 700);
  };

  return (
    <div className="relative min-h-[92vh] w-full flex flex-col items-center justify-center px-4 overflow-hidden select-none bg-gradient-to-b from-[#111E2C] via-[#152332] to-[#192B38]">
      {/* Subtle Radial Illumination Behind Portal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full bg-radial-glow opacity-40 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(218, 180, 138, 0.15) 0%, rgba(128, 189, 178, 0.08) 45%, transparent 70%)",
          }}
        />
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

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={handleOpenNameModal}
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
        <span className="hidden sm:inline">ARCHIVE-V2.0 • CRAFTED BY DIEN VU • 78 RIDER-WAITE-SMITH CARDS</span>
        <span className="sm:hidden">BY DIEN VU • ARCHIVE V2.0</span>
        <button
          onClick={handleOpenNameModal}
          className="hover:text-[#F4EADA] transition-colors cursor-pointer text-right"
        >
          Bỏ qua giới thiệu →
        </button>
      </div>

      {/* Modal: "Khắc Tên Lữ Khách" (Ritual Entry Modal) */}
      <AnimatePresence>
        {isNameModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111E2C]/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md bg-[#192B38] border border-[#DAB48A]/50 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Astrolabe Background Glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-radial-glow opacity-30 blur-2xl pointer-events-none"
                   style={{ background: "radial-gradient(circle, rgba(218, 180, 138, 0.4) 0%, transparent 70%)" }} />

              {/* Close Button */}
              <button
                onClick={() => setIsNameModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#A7BBC0] hover:text-[#F4EADA] hover:bg-[#284450] transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleConfirmName} className="flex flex-col items-center text-center space-y-4">
                {/* Header Icon */}
                <div className="w-12 h-12 rounded-full bg-[#284450] border border-[#DAB48A]/50 flex items-center justify-center shadow-celestial-glow">
                  <User className="w-6 h-6 text-[#C7E9AD]" />
                </div>

                {/* Ritual Title */}
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-[#F4EADA] font-light tracking-wide">
                    Khắc Tên Lữ Khách
                  </h3>
                  <p className="font-body text-sm text-[#DAB48A] mt-1.5 leading-relaxed font-normal">
                    &ldquo;Để mở cổ thư định mệnh, xin hãy để lại danh xưng của bạn.&rdquo;
                  </p>
                </div>

                {/* Input Field */}
                <div className="w-full pt-2">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      maxLength={40}
                      value={visitorName}
                      onChange={(e) => {
                        setVisitorName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      placeholder="Ví dụ: Minh Châu, Hải Đăng..."
                      className="w-full px-4 py-3 rounded-xl bg-[#223846] border border-[#DAB48A]/40 text-[#F4EADA] placeholder-[#A7BBC0]/50 focus:outline-none focus:border-[#C7E9AD] focus:ring-1 focus:ring-[#C7E9AD] transition-all text-center font-display text-lg tracking-wide shadow-inner"
                    />
                  </div>
                  {nameError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-body text-[#E8A598] mt-2 text-center"
                    >
                      {nameError}
                    </motion.p>
                  )}
                </div>

                {/* Confirmation Button */}
                <div className="w-full pt-3 flex flex-col space-y-2">
                  <button
                    type="submit"
                    className="w-full group inline-flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-gradient-to-r from-[#DAB48A] via-[#ECD2B3] to-[#DAB48A] text-[#111E2C] font-body text-sm font-semibold tracking-wide shadow-copper-glow hover:shadow-celestial-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <span>Bắt đầu hành trình</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <span className="text-[11px] font-mono tracking-wider text-[#A7BBC0]/60">
                    ✦ DANH XƯNG SẼ ĐỒNG HÀNH TRONG SUỐT QUẺ BÀI ✦
                  </span>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
