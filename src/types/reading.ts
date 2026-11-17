/**
 * ARCANA — AI & Reading Request/Response Types
 */

import { QuestionCategory, SpreadType, SelectedCard, RulebaseInterpretation } from "./tarot";
export type { QuestionCategory, SpreadType, SelectedCard, RulebaseInterpretation };

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
  userName?: string;
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
  userName?: string;
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

export interface VisitorDrawnCard {
  cardId: string;
  nameVi: string;
  nameEn: string;
  orientation: "upright" | "reversed";
  positionName: string;
}

export interface VisitorLogRecord {
  id: string;
  sessionId: string;
  visitorName: string;
  enteredAt: string;
  completedAt?: string;
  status: "entered" | "completed";
  question?: string;
  category?: QuestionCategory;
  spreadType?: SpreadType;
  cards?: VisitorDrawnCard[];
  aiTitle?: string;
  aiOverview?: string;
  ip?: string;
  userAgent?: string;
}

export interface AdminDashboardStats {
  totalVisitors: number;
  todayVisitors: number;
  completedReadings: number;
  completionRate: number;
  categoryCounts: Record<string, number>;
  topCards: { cardId: string; nameVi: string; count: number }[];
}

