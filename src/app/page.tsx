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
    <main className="relative min-h-screen bg-[#0B1020] text-[#E9DFC9] flex flex-col justify-between selection:bg-[#C6F68D] selection:text-[#0B1020]">
      {/* Top Universal Celestial Navigation Header */}
      <header className="sticky top-0 z-40 w-full px-4 md:px-8 py-3.5 bg-[#0B1020]/80 backdrop-blur-md border-b border-[#DAA87B]/15 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => navigateScene("PORTAL")}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-[#172B38] border border-[#DAA87B]/40 flex items-center justify-center group-hover:border-[#C6F68D] transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#C6F68D]" />
          </div>
          <div>
            <span className="font-display text-lg tracking-widest text-[#E9DFC9] font-medium leading-none">
              ARCANA
            </span>
            <span className="hidden sm:inline-block font-mono text-[9px] tracking-widest text-[#DAA87B] uppercase ml-2">
              THE ARCHIVE
            </span>
          </div>
        </div>

        {/* Scene Journey Step Indicator */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#0F162B] border border-[#DAA87B]/20">
          {SCENE_STEPS.map((step, idx) => {
            const isCurrent = state.scene === step.id;
            const isPassed =
              SCENE_STEPS.findIndex((s) => s.id === state.scene) > idx;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <span className="text-[#DAA87B]/30 font-mono text-[10px]">
                    /
                  </span>
                )}
                <span
                  className={`font-mono text-[10px] tracking-wider uppercase transition-colors ${
                    isCurrent
                      ? "text-[#C6F68D] font-bold"
                      : isPassed
                      ? "text-[#DAA87B]"
                      : "text-[#B5AA94]/40"
                  }`}
                >
                  {step.label}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        {/* Quick Utility Actions: Sound & History */}
        <div className="flex items-center space-x-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full text-[#B5AA94] hover:text-[#E9DFC9] hover:bg-[#172B38] transition-colors cursor-pointer"
            title={isMuted ? "Bật âm thanh hiệu ứng" : "Tắt âm thanh hiệu ứng"}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C6F68D]" />}
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-mono text-xs text-[#E9DFC9] bg-[#172B38] border border-[#DAA87B]/30 hover:border-[#DAA87B] transition-all cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5 text-[#DAA87B]" />
            <span className="hidden sm:inline">Lưu trữ</span>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <QuestionScene
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
              transition={{ duration: 0.5 }}
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
              transition={{ duration: 0.5 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ReadingScene
                readingId={state.readingId}
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

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-[#DAA87B]/15 flex flex-col sm:flex-row items-center justify-between text-[#B5AA94]/60 font-mono text-[10px] space-y-2 sm:space-y-0">
        <div>
          <span>ARCANA © CELESTIAL NEO-ARCHIVE • </span>
          <span className="text-[#DAA87B]/80">MỖI CÂU HỎI MỞ RA MỘT VŨ TRỤ</span>
        </div>
        <p className="max-w-md text-center sm:text-right">
          Thông điệp mang tính chiêm nghiệm và đối thoại nội tâm.
        </p>
      </footer>
    </main>
  );
}

