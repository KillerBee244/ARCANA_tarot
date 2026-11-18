"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CardBack } from "./CardVisuals";

interface CylindricalTarotCarouselProps {
  shuffledDeck: string[]; // 78 card IDs
  selectedCardIds: string[]; // Cards already committed
  reservedCardId: string | null; // Card currently in flight
  isInteractionLocked: boolean;
  onCardSelect: (cardId: string, cardElement: HTMLElement, rect: DOMRect) => void;
}

export const CylindricalTarotCarousel: React.FC<CylindricalTarotCarouselProps> = ({
  shuffledDeck,
  selectedCardIds,
  reservedCardId,
  isInteractionLocked,
  onCardSelect,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);
  rotationRef.current = rotation;

  // Pointer drag state
  const wasDraggingRef = useRef<boolean>(false);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    lastX: number;
    lastTime: number;
    isDragging: boolean;
    velocity: number;
  } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 16 physical slots around the 3D cylinder
  const slotCount = 16;
  const stepAngle = 360 / slotCount; // 22.5 deg per card

  // Radius tailored for mobile & desktop viewports
  const radius = isMobile ? 180 : 255;
  const cardWidth = isMobile ? 78 : 106;
  const cardHeight = isMobile ? 128 : 175;

  // Filter out committed cards and currently flying card
  const selectedSet = new Set(selectedCardIds);
  const availableDeck = shuffledDeck.filter(
    (id) => !selectedSet.has(id) && id !== reservedCardId
  );

  // Stop any momentum animation
  const stopMomentum = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Smooth snap to nearest card slot
  const snapToNearest = useCallback(() => {
    stopMomentum();
    const current = rotationRef.current;
    const target = Math.round(current / stepAngle) * stepAngle;
    const startTime = performance.now();
    const startVal = current;
    const diff = target - startVal;

    if (Math.abs(diff) < 0.1) {
      setRotation(target);
      return;
    }

    const duration = 280;
    const animateSnap = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      // easeOutCubic
      const u = 1 - Math.pow(1 - p, 3);
      const nextRot = startVal + diff * u;
      setRotation(nextRot);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animateSnap);
      } else {
        setRotation(target);
      }
    };
    animFrameRef.current = requestAnimationFrame(animateSnap);
  }, [stepAngle, stopMomentum]);

  // Inertia deceleration on swipe release
  const runInertia = useCallback(
    (initialVelocity: number) => {
      stopMomentum();
      let vel = Math.max(-1.8, Math.min(1.8, initialVelocity));
      let lastTime = performance.now();

      const step = (now: number) => {
        const dt = Math.min(32, now - lastTime);
        lastTime = now;

        vel *= 0.91; // Friction factor

        if (Math.abs(vel) > 0.02) {
          setRotation((prev) => prev + vel * dt);
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          snapToNearest();
        }
      };
      animFrameRef.current = requestAnimationFrame(step);
    },
    [snapToNearest, stopMomentum]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isInteractionLocked) return;
    stopMomentum();

    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastTime: performance.now(),
      isDragging: false,
      velocity: 0,
    };
    // Do NOT capture pointer here — only capture if user actually drags > 8px
    // This allows child cards to receive normal clean click/tap events!
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== e.pointerId)
      return;

    const dx = e.clientX - dragStateRef.current.startX;

    // Movement threshold (8px) to distinguish drag from tap
    if (!dragStateRef.current.isDragging) {
      if (Math.abs(dx) > 8) {
        dragStateRef.current.isDragging = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Ignore
        }
      }
    }

    if (dragStateRef.current.isDragging) {
      const deltaX = e.clientX - dragStateRef.current.lastX;
      const now = performance.now();
      const dt = Math.max(1, now - dragStateRef.current.lastTime);

      // Sensitivity factor (~0.35 deg per pixel)
      const dTheta = deltaX * 0.35;
      setRotation((prev) => prev + dTheta);

      dragStateRef.current.velocity = dTheta / dt;
      dragStateRef.current.lastX = e.clientX;
      dragStateRef.current.lastTime = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== e.pointerId)
      return;
    const isDrag = dragStateRef.current.isDragging;
    const vel = dragStateRef.current.velocity;
    dragStateRef.current = null;
    wasDraggingRef.current = isDrag;
    setTimeout(() => {
      wasDraggingRef.current = false;
    }, 150);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    if (isDrag) {
      runInertia(vel);
    }
  };

  const handleCardClick = (
    e: React.MouseEvent<HTMLDivElement>,
    cardId: string
  ) => {
    // If user was actively dragging or interaction is locked, do not select
    if (wasDraggingRef.current || isInteractionLocked) return;

    stopMomentum();
    const cardElement = e.currentTarget;
    const rect = cardElement.getBoundingClientRect();
    onCardSelect(cardId, cardElement, rect);
  };

  // Map 16 physical slots around the cylinder to available cards from the 78-card deck
  const slots = Array.from({ length: slotCount }).map((_, index) => {
    const slotAngle = index * stepAngle;
    // Calculate current angle relative to viewer camera (0deg = directly facing user)
    let relativeAngle = (slotAngle + rotation) % 360;
    if (relativeAngle > 180) relativeAngle -= 360;
    if (relativeAngle < -180) relativeAngle += 360;

    // Visibility: Front-facing half has cos(relativeAngle) > 0
    const rad = (relativeAngle * Math.PI) / 180;
    const cosVal = Math.cos(rad);
    const isFrontFacing = cosVal > 0.05;

    // Virtualized index in available 78-card deck
    const baseOffset = Math.floor(-rotation / 360) * slotCount;
    const deckLen = Math.max(1, availableDeck.length);
    const virtualDeckIndex =
      (((baseOffset + index) % deckLen) + deckLen) % deckLen;
    const cardId = availableDeck[virtualDeckIndex] || `card-${index}`;

    // Opacity & depth styling
    const opacity = isFrontFacing ? Math.max(0.25, Math.min(1, cosVal * 1.35)) : 0;
    const isCenterFocus = Math.abs(relativeAngle) < 12;

    return {
      index,
      slotAngle,
      relativeAngle,
      isFrontFacing,
      isCenterFocus,
      opacity,
      cardId,
    };
  });

  return (
    <div
      ref={containerRef}
      data-testid="tarot-carousel"
      className="relative w-full flex flex-col items-center justify-center select-none py-2"
      style={{
        touchAction: "pan-y",
        perspective: isMobile ? "850px" : "1100px",
        height: isMobile ? "245px" : "330px",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background celestial ambient spotlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] sm:w-[720px] h-[280px] sm:h-[350px] pointer-events-none opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(218, 180, 138, 0.25) 0%, rgba(40, 68, 80, 0.35) 50%, transparent 75%)",
        }}
      />

      {/* Interactive Drag & Rotate Indicator Hint */}
      <div className="absolute top-0 text-center pointer-events-none transition-opacity duration-300 z-30">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#DAB48A]/60 bg-[#111E2C]/80 px-2.5 py-0.5 rounded-full border border-[#DAB48A]/20">
          ↔ Vuốt xoay cổ thư 3D
        </span>
      </div>

      {/* 3D CYLINDRICAL CARD RING CONTAINER */}
      <div
        className="relative flex items-center justify-center w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {slots.map((slot) => {
          if (!slot.isFrontFacing) {
            return null; // Cull back-facing cards to prevent clutter
          }

          const isCardSelected = selectedSet.has(slot.cardId);
          const isCardReserved = reservedCardId === slot.cardId;

          return (
            <div
              key={slot.index}
              data-testid="tarot-card"
              data-card-id={slot.cardId}
              data-center-focus={slot.isCenterFocus}
              className={`absolute cursor-pointer transition-shadow rounded-xl ${
                slot.isCenterFocus ? "z-20" : "z-10"
              }`}
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                transformStyle: "preserve-3d",
                transform: `rotateY(${slot.slotAngle}deg) translateZ(${radius}px)`,
                opacity: slot.opacity,
                pointerEvents: isInteractionLocked ? "none" : "auto",
              }}
              onClick={(e) => handleCardClick(e, slot.cardId)}
            >
              {isCardSelected || isCardReserved ? (
                /* Ethereal phantom slot when card is chosen */
                <div className="w-full h-full rounded-xl border-2 border-dashed border-[#C7E9AD]/35 bg-[#284450]/20 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-[#C7E9AD]/50">
                    Đã rút
                  </span>
                </div>
              ) : (
                /* Interactive 3D Card Back */
                <div
                  className={`w-full h-full rounded-xl overflow-hidden border transition-all duration-200 ${
                    slot.isCenterFocus
                      ? "border-[#DAB48A] shadow-card-hover scale-[1.03]"
                      : "border-[#DAB48A]/40 shadow-card-3d"
                  }`}
                >
                  <CardBack className="w-full h-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
