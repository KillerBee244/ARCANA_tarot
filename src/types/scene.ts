/**
 * ARCANA — Scene Finite-State Machine Types
 * PORTAL → QUESTION → DECK → REVEAL → READING
 */

import { QuestionCategory, SpreadType, SelectedCard, RulebaseInterpretation } from "./tarot";
import { AIStatus, AIInterpretationResult } from "./reading";

export type SceneState =
  | "PORTAL"
  | "QUESTION"
  | "DECK"
  | "REVEAL"
  | "READING";

export interface ExperienceState {
  scene: SceneState;
  readingId: string;
  question: string;
  category: QuestionCategory;
  spreadType: SpreadType;
  allowReversed: boolean;
  shuffledDeck: string[]; // Card IDs in shuffled order
  selectedCards: SelectedCard[];
  revealIndex: number;
  rulebaseResult: RulebaseInterpretation | null;
  aiStatus: AIStatus;
  aiResult: AIInterpretationResult | null;
  aiError: string | null;
  isSoundEnabled: boolean;
  isReducedMotion: boolean;
}

export type ExperienceAction =
  | { type: "ENTER_QUESTION" }
  | { type: "SET_QUESTION"; question: string; category: QuestionCategory }
  | { type: "SET_SPREAD_TYPE"; spreadType: SpreadType }
  | { type: "SET_ALLOW_REVERSED"; allowReversed: boolean }
  | { type: "PROCEED_TO_DECK"; shuffledDeck: string[] }
  | { type: "SELECT_CARD"; cardId: string; orientation: "upright" | "reversed" }
  | { type: "DESELECT_CARD"; cardId: string }
  | { type: "START_REVEAL" }
  | { type: "ADVANCE_REVEAL" }
  | { type: "SKIP_REVEAL" }
  | { type: "COMPLETE_REVEAL"; rulebaseResult: RulebaseInterpretation }
  | { type: "START_AI_REQUEST" }
  | { type: "SET_AI_SUCCESS"; result: AIInterpretationResult }
  | { type: "SET_AI_ERROR"; status: AIStatus; message: string }
  | { type: "RESTART_READING" }
  | { type: "RESTORE_READING"; savedSession: any }
  | { type: "TOGGLE_SOUND" }
  | { type: "TOGGLE_REDUCED_MOTION" }
  | { type: "NAVIGATE_SCENE"; scene: SceneState };

