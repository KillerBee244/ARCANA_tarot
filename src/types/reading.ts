/**
 * ARCANA — AI & Reading Request/Response Types
 */

import { QuestionCategory, SpreadType, SelectedCard, RulebaseInterpretation } from "./tarot";

export type AIStatus =
  | "idle"
  | "loading"
  | "success"
  | "rate_limited"
  | "timeout"
  | "error"
  | "disabled";

export interface AIInterpretationResult {
  title: string;
  overview: string;
  cardConnections: {
    cardId: string;
    connectionText: string;
  }[];
  personalizedInterpretation: string;
  reflectionQuestions: string[];
  closingMessage: string;
  generatedAt: string;
  modelUsed?: string;
}

export interface ReadingSessionRecord {
  readingId: string;
  createdAt: string;
  question: string;
  category: QuestionCategory;
  spreadType: SpreadType;
  allowReversed: boolean;
  selectedCards: SelectedCard[];
  rulebookVersion: string;
  rulebaseResult: RulebaseInterpretation;
  aiStatus: AIStatus;
  aiResult?: AIInterpretationResult | null;
  aiErrorMessage?: string;
}

export interface InterpretApiRequest {
  readingId: string;
  question: string;
  category: QuestionCategory;
  spreadType: SpreadType;
  selectedCards: SelectedCard[];
}

export interface InterpretApiResponse {
  success: boolean;
  data?: AIInterpretationResult;
  error?: {
    code: "MISSING_KEY" | "DISABLED" | "RATE_LIMITED" | "TIMEOUT" | "VALIDATION_FAILED" | "UPSTREAM_ERROR";
    message: string;
    details?: string;
  };
}

