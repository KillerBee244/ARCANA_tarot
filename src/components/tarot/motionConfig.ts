/**
 * ARCANA 2.3 — Motion & Flight Timing Configuration
 * Centralized, non-negotiable timing for the cinematic Tarot card flight sequence.
 */

export const CARD_SELECTION_MOTION = {
  acknowledge: 150, // Phase A: Selection acknowledgement
  lift: 450,        // Phase B: Card rises upward from carousel (scale 1.00 -> 1.12)
  hover: 250,       // Phase C: Card suspended in mid-air (subtle levitation and glow)
  flight: 1350,     // Phase D: SLOW CINEMATIC FLIGHT (duration = 1350ms, quadratic Bézier)
  landing: 300,     // Phase E: Landing and settling into destination slot

  liftScale: 1.12,
  liftDistance: 95,

  // Total duration: 150 + 450 + 250 + 1350 + 300 = 2500ms
  totalDuration: 2500,
} as const;

export type SelectionAnimationPhase =
  | "idle"
  | "acknowledge"
  | "lifting"
  | "hovering"
  | "flying"
  | "landing"
  | "committed";

export interface PendingCardFlight {
  cardId: string;
  destinationIndex: number;
  sourceRect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  targetRect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  sourceRotationY?: number;
}

/**
 * Standard cubic-bezier solver for smooth custom easing curves
 */
export function solveCubicBezier(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number
): (t: number) => number {
  return function (t: number): number {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    // Newton-Raphson approximation for parameter x
    let u = t;
    for (let i = 0; i < 5; i++) {
      const currentX =
        3 * (1 - u) * (1 - u) * u * p1x +
        3 * (1 - u) * u * u * p2x +
        u * u * u;
      const dx =
        3 * (1 - u) * (1 - u) * p1x +
        6 * (1 - u) * u * (p2x - p1x) +
        3 * u * u * (1 - p2x);
      if (Math.abs(dx) < 1e-6) break;
      u = u - (currentX - t) / dx;
      u = Math.max(0, Math.min(1, u));
    }

    // Evaluate y at parameter u
    return (
      3 * (1 - u) * (1 - u) * u * p1y +
      3 * (1 - u) * u * u * p2y +
      u * u * u
    );
  };
}

export const easeOutCubic = solveCubicBezier(0.22, 1, 0.36, 1);
export const easeFlight = solveCubicBezier(0.45, 0.05, 0.25, 1);

/**
 * Quadratic Bézier interpolation for smooth curved flight trajectory
 */
export function quadraticBezier(
  p0: number,
  p1: number,
  p2: number,
  t: number
): number {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}
