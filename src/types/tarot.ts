/**
 * ARCANA — Tarot Core Type Definitions
 */

export type ArcanaType = "major" | "minor";

export type TarotSuit = "wands" | "cups" | "swords" | "pentacles";

export type CardOrientation = "upright" | "reversed";

export type QuestionCategory =
  | "love"       // Tình yêu
  | "career"     // Sự nghiệp
  | "finance"    // Tài chính
  | "self"       // Bản thân
  | "general";   // Tự do

export interface CardCategoryMeaning {
  love: string;
  career: string;
  finance: string;
  self: string;
}

export interface TarotCardData {
  id: string; // e.g. "major-00-fool", "wands-01-ace"
  number: number; // 0-21 for major, 1-14 for minor (11=Page, 12=Knight, 13=Queen, 14=King)
  arcana: ArcanaType;
  suit?: TarotSuit;
  nameEn: string;
  nameVi: string;
  uprightKeywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  symbolism: string;
  reflectionPrompt: string;
  categoryMeanings?: {
    upright: CardCategoryMeaning;
    reversed: CardCategoryMeaning;
  };
  element?: "fire" | "water" | "air" | "earth" | "spirit";
  astrologicalSign?: string;
  accentColor?: string;
}

export type SpreadType = "single" | "three_card";

export interface SpreadPositionDef {
  id: string;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
}

export interface TarotSpreadDef {
  type: SpreadType;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  cardCount: number;
  positions: SpreadPositionDef[];
}

export interface SelectedCard {
  cardId: string;
  orientation: CardOrientation;
  positionId: string;
  selectionOrder: number;
}

export interface PopulatedCard extends SelectedCard {
  card: TarotCardData;
  position: SpreadPositionDef;
}

export interface CombinationRuleResult {
  ruleId: string;
  titleVi: string;
  descriptionVi: string;
  impact: "positive" | "caution" | "transformative" | "neutral";
}

export interface RulebaseInterpretation {
  spreadType: SpreadType;
  category: QuestionCategory;
  cards: {
    card: TarotCardData;
    orientation: CardOrientation;
    position: SpreadPositionDef;
    positionMeaning: string;
    categoryMeaning: string;
    coreAdvice: string;
  }[];
  overviewSynthesis: string;
  dominantThemes: {
    majorArcanaCount: number;
    dominantSuit?: TarotSuit;
    reversedCount: number;
    dominantElement?: string;
  };
  combinationRules: CombinationRuleResult[];
  coreAdvice: string;
  reflectionQuestions: string[];
  rulebookVersion: string;
}
