"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTarotExperience } from "@/hooks/useTarotExperience";
import { PortalScene } from "@/components/scenes/PortalScene";
import { QuestionScene } from "@/components/scenes/QuestionScene";
import { DeckScene } from "@/components/scenes/DeckScene";
import { RevealScene } from "@/components/scenes/RevealScene";
import { ReadingScene } from "@/components/scenes/ReadingScene";
import { HistoryModal } from "@/components/reading/HistoryModal";
import { celestialAudio } from "@/lib/sound/celestialAudio";
import { Volume2, VolumeX, Archive, Sparkles } from "lucide-react";
import { SceneState } from "@/types/scene";

const SCENE_STEPS: { id: SceneState; label: string }[] = [
  { id: "PORTAL", label: "Cổng" },
  { id: "QUESTION", label: "Ý Nguyện" },
  { id: "DECK", label: "Rút Bài" },
  { id: "REVEAL", label: "Khai Mở" },
  { id: "READING", label: "Chiêm Nghiệm" },
];

export default function ArcanaPage() {
  const {
    state,
    startPortal,
    proceedToDeck,
    selectCard,
    deselectCard,
    proceedToReveal,
    completeReveal,
    retryAI,
    restartReading,
    restoreReading,
    navigateScene,
  } = useTarotExperience();

  const [isMuted, setIsMuted] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const toggleSound = () => {
    const muted = celestialAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleCardSelectWithSound = (cardId: string) => {
    celestialAudio.playCardSelect();
    selectCard(cardId);
  };

  const handleRevealCompleteWithSound = () => {
    celestialAudio.playCardReveal();
    completeReveal();
  };

  return (
    <main className="relative min-h-screen bg-[#192B38] text-[#F4EADA] flex flex-col justify-between selection:bg-[#C7E9AD] selection:text-[#111E2C]">
      {/* Top Universal Celestial Navigation Header */}
      <header className="sticky top-0 z-40 w-full px-4 md:px-8 py-3.5 bg-[#111E2C]/85 backdrop-blur-md border-b border-[#DAB48A]/20 flex items-center justify-between">
        {/* Brand Logo (Fraunces) */}
        <div
          onClick={() => navigateScene("PORTAL")}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#284450] border border-[#DAB48A]/50 flex items-center justify-center group-hover:border-[#C7E9AD] transition-colors shadow-sm">
            <Sparkles className="w-4 h-4 text-[#C7E9AD]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
            <span className="font-display text-xl tracking-wider text-[#F4EADA] font-medium leading-none">
              ARCANA
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#DAB48A] uppercase">
              <span className="hidden sm:inline">ARCHIVE 2.0 • </span>CRAFTED BY DIEN VU
            </span>
          </div>
        </div>

        {/* Scene Journey Step Indicator (Refined Typography) */}
        <div className="hidden md:flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#223846]/90 border border-[#DAB48A]/25 shadow-sm">
          {SCENE_STEPS.map((step, idx) => {
            const isCurrent = state.scene === step.id;
            const isPassed =
              SCENE_STEPS.findIndex((s) => s.id === state.scene) > idx;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <span className="text-[#DAB48A]/40 text-xs">
                    •
                  </span>
                )}
                <span
                  className={`font-body text-xs transition-colors ${
                    isCurrent
                      ? "text-[#C7E9AD] font-bold"
                      : isPassed
                      ? "text-[#DAB48A] font-medium"
                      : "text-[#A7BBC0]/60"
                  }`}
                >
                  {step.label}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        {/* Quick Utility Actions: Sound & History */}
        <div className="flex items-center space-x-2.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full text-[#C1CFD0] hover:text-[#F4EADA] hover:bg-[#284450] transition-colors cursor-pointer"
            title={isMuted ? "Bật âm thanh hiệu ứng" : "Tắt âm thanh hiệu ứng"}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C7E9AD]" />}
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-body text-xs font-semibold text-[#F4EADA] bg-[#284450] border border-[#DAB48A]/40 hover:border-[#DAB48A] hover:bg-[#385968] transition-all cursor-pointer shadow-sm"
          >
            <Archive className="w-3.5 h-3.5 text-[#DAB48A]" />
            <span className="hidden sm:inline">Lịch sử</span>
          </button>
        </div>
      </header>

      {/* Main Dynamic Scene Container */}
      <div className="flex-1 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          {state.scene === "PORTAL" && (
            <motion.div
              key="scene-portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              <PortalScene
                onEnter={startPortal}
                onOpenHistory={() => setIsHistoryModalOpen(true)}
              />
            </motion.div>
          )}

          {state.scene === "QUESTION" && (
            <motion.div
              key="scene-question"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <QuestionScene
                userName={state.userName}
                initialQuestion={state.question}
                initialCategory={state.category}
                initialSpreadType={state.spreadType}
                initialAllowReversed={state.allowReversed}
                onSubmit={({ question, category, spreadType, allowReversed }) => {
                  proceedToDeck(question, category, spreadType, allowReversed);
                }}
              />
            </motion.div>
          )}

          {state.scene === "DECK" && (
            <motion.div
              key="scene-deck"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <DeckScene
                shuffledDeck={state.shuffledDeck}
                selectedCards={state.selectedCards}
                spreadType={state.spreadType}
                category={state.category}
                question={state.question}
                onCardSelect={handleCardSelectWithSound}
                onCardDeselect={deselectCard}
                onProceedToReveal={proceedToReveal}
                onBackToQuestion={() => navigateScene("QUESTION")}
              />
            </motion.div>
          )}

          {state.scene === "REVEAL" && (
            <motion.div
              key="scene-reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <RevealScene
                spreadType={state.spreadType}
                selectedCards={state.selectedCards}
                onCompleteReveal={handleRevealCompleteWithSound}
              />
            </motion.div>
          )}

          {state.scene === "READING" && state.rulebaseResult && (
            <motion.div
              key="scene-reading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ReadingScene
                readingId={state.readingId}
                userName={state.userName}
                question={state.question}
                category={state.category}
                spreadType={state.spreadType}
                allowReversed={state.allowReversed}
                selectedCards={state.selectedCards}
                rulebaseResult={state.rulebaseResult}
                aiStatus={state.aiStatus}
                aiResult={state.aiResult}
                aiError={state.aiError}
                onRetryAI={retryAI}
                onRestart={restartReading}
                onRestoreReading={restoreReading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectReading={restoreReading}
      />

      {/* Footer (Editorial Fraunces & Be Vietnam Pro) */}
      <footer className="w-full px-6 py-4 border-t border-[#DAB48A]/20 flex flex-col md:flex-row items-center justify-between text-[#A7BBC0] font-body text-xs gap-3 bg-[#111E2C]/70">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2.5 text-center sm:text-left gap-1 sm:gap-0">
          <div>
            <span className="font-display font-medium text-[#F4EADA]">ARCANA 2.0</span>
            <span className="hidden sm:inline"> — Celestial Editorial Archive • </span>
            <span className="text-[#DAB48A] italic hidden md:inline">Mỗi câu hỏi mở ra một vũ trụ</span>
          </div>
          <span className="hidden sm:inline text-[#DAB48A]/40">•</span>
          <div className="font-mono text-[11px] text-[#C7E9AD] tracking-wider">
            Designed & Engineered by Dien Vu • Arcana Celestial Archive
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <p className="max-w-md text-center md:text-right text-[#C1CFD0]">
            Thông điệp mang tính chiêm nghiệm và đối thoại nội tâm.
          </p>
          <a
            href="/admin"
            className="text-[#DAB48A]/60 hover:text-[#C7E9AD] transition-colors whitespace-nowrap cursor-pointer font-mono"
            title="Trang quản trị truy cập"
          >
            ✦ Quản trị
          </a>
        </div>
      </footer>
    </main>
  );
}
