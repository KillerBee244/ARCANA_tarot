"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CardBack } from "./CardVisuals";
import {
  CARD_SELECTION_MOTION,
  PendingCardFlight,
  SelectionAnimationPhase,
  easeOutCubic,
  easeFlight,
  quadraticBezier,
} from "./motionConfig";

interface CardFlightPortalProps {
  flight: PendingCardFlight | null;
  onComplete: (cardId: string, destinationIndex: number) => void;
  onPhaseChange?: (phase: SelectionAnimationPhase) => void;
}

export const CardFlightPortal: React.FC<CardFlightPortalProps> = ({
  flight,
  onComplete,
  onPhaseChange,
}) => {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<SelectionAnimationPhase>("idle");
  const cardElRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!flight || !mounted) {
      setPhase("idle");
      return;
    }

    const { sourceRect, targetRect, cardId, destinationIndex } = flight;
    const startTime = performance.now();

    const tAck = CARD_SELECTION_MOTION.acknowledge; // 150ms
    const tLift = tAck + CARD_SELECTION_MOTION.lift; // 600ms
    const tHover = tLift + CARD_SELECTION_MOTION.hover; // 850ms
    const tFlight = tHover + CARD_SELECTION_MOTION.flight; // 2200ms
    const tLand = tFlight + CARD_SELECTION_MOTION.landing; // 2500ms

    // Initial position
    let currentPhase: SelectionAnimationPhase = "acknowledge";
    setPhase(currentPhase);
    onPhaseChange?.(currentPhase);

    // Target scale relative to source card dimensions
    const targetScale = targetRect.width / sourceRect.width;

    // Curved flight waypoints
    const P0 = {
      x: sourceRect.left,
      y: sourceRect.top - CARD_SELECTION_MOTION.liftDistance,
    };
    const P2 = {
      x: targetRect.left,
      y: targetRect.top,
    };
    // Arc control point: elevated halfway between start and target
    const P1 = {
      x: (P0.x + P2.x) / 2 + (P0.x < P2.x ? -25 : 25),
      y: Math.min(P0.y, P2.y) - 50,
    };

    const animate = (now: number) => {
      const elapsed = now - startTime;

      let x = sourceRect.left;
      let y = sourceRect.top;
      let scale = 1.0;
      let rotate = 0;
      let nextPhase = currentPhase;

      if (elapsed < tAck) {
        // PHASE A: Acknowledge (0 - 150ms)
        nextPhase = "acknowledge";
        const p = elapsed / tAck;
        scale = 1.0 + p * 0.04;
        x = sourceRect.left;
        y = sourceRect.top;
        rotate = 0;
      } else if (elapsed < tLift) {
        // PHASE B: Lift (150 - 600ms, 450ms duration)
        nextPhase = "lifting";
        const p = (elapsed - tAck) / CARD_SELECTION_MOTION.lift;
        const u = easeOutCubic(p);
        x = sourceRect.left;
        y = sourceRect.top - CARD_SELECTION_MOTION.liftDistance * u;
        scale = 1.04 + (CARD_SELECTION_MOTION.liftScale - 1.04) * u;
        rotate = 0;
      } else if (elapsed < tHover) {
        // PHASE C: Hover (600 - 850ms, 250ms duration)
        nextPhase = "hovering";
        const p = (elapsed - tLift) / CARD_SELECTION_MOTION.hover;
        // Subtle levitation breath
        const levitation = Math.sin(p * Math.PI) * 4;
        x = sourceRect.left;
        y = sourceRect.top - CARD_SELECTION_MOTION.liftDistance - levitation;
        scale = CARD_SELECTION_MOTION.liftScale;
        rotate = 0;
      } else if (elapsed < tFlight) {
        // PHASE D: Slow Cinematic Flight (850 - 2200ms, 1350ms duration)
        nextPhase = "flying";
        const p = (elapsed - tHover) / CARD_SELECTION_MOTION.flight;
        const u = easeFlight(p);

        // Quadratic Bézier curve for graceful arc
        x = quadraticBezier(P0.x, P1.x, P2.x, u);
        y = quadraticBezier(P0.y, P1.y, P2.y, u);

        // Smoothly interpolate scale to match destination slot size
        scale =
          CARD_SELECTION_MOTION.liftScale +
          (targetScale - CARD_SELECTION_MOTION.liftScale) * u;

        // Subtle natural flight banking tilt
        rotate = (targetRect.left > sourceRect.left ? 5 : -5) * Math.sin(p * Math.PI);
      } else if (elapsed < tLand) {
        // PHASE E: Landing & Settle (2200 - 2500ms, 300ms duration)
        nextPhase = "landing";
        const p = (elapsed - tFlight) / CARD_SELECTION_MOTION.landing;
        const u = easeOutCubic(p);

        x = targetRect.left;
        y = targetRect.top;

        // Soft settling cushion
        scale = targetScale * (1.0 + 0.04 * (1 - u));
        rotate = 0;
      } else {
        // FINISHED: Commit Selection
        nextPhase = "committed";
        if (currentPhase !== "committed") {
          currentPhase = "committed";
          setPhase("committed");
          onPhaseChange?.("committed");
          onComplete(cardId, destinationIndex);
        }
        return;
      }

      if (nextPhase !== currentPhase) {
        currentPhase = nextPhase;
        setPhase(nextPhase);
        onPhaseChange?.(nextPhase);
      }

      // High-performance GPU-accelerated transform update
      if (cardElRef.current) {
        cardElRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotate(${rotate}deg)`;
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [flight, mounted, onComplete, onPhaseChange]);

  if (!mounted || !flight) return null;

  const { sourceRect } = flight;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-visible select-none"
      style={{ perspective: 1200 }}
      data-testid="flight-overlay"
      data-animation-phase={phase}
    >
      <div
        ref={cardElRef}
        data-testid="flying-card"
        className="absolute rounded-xl overflow-hidden shadow-2xl transition-shadow"
        style={{
          left: 0,
          top: 0,
          width: `${sourceRect.width}px`,
          height: `${sourceRect.height}px`,
          transformOrigin: "top left",
          boxShadow:
            phase === "lifting" || phase === "hovering"
              ? "0 25px 50px -12px rgba(199, 233, 173, 0.45), 0 0 30px rgba(218, 180, 138, 0.35)"
              : phase === "flying"
              ? "0 20px 40px -10px rgba(199, 233, 173, 0.35)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div className="w-full h-full rounded-xl overflow-hidden border border-[#DAB48A]/60 bg-[#111E2C] relative">
          <CardBack className="w-full h-full" />
          {/* Subtle celestial shimmer highlight during flight */}
          <div
            className={`absolute inset-0 bg-gradient-to-tr from-transparent via-[#C7E9AD]/20 to-transparent pointer-events-none transition-opacity duration-300 ${
              phase === "hovering" || phase === "flying" ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
