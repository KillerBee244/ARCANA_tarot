/**
 * ARCANA — Complete 78-Card Tarot Deck Aggregator
 * Version: 1.0.0
 */

import { TarotCardData } from "@/types/tarot";
import { MAJOR_ARCANA } from "./majorArcana";
import { WANDS_CARDS } from "./wands";
import { CUPS_CARDS } from "./cups";
import { SWORDS_CARDS } from "./swords";
import { PENTACLES_CARDS } from "./pentacles";

export const RULEBOOK_VERSION = "1.0.0";

export const ALL_TAROT_CARDS: TarotCardData[] = [
  ...MAJOR_ARCANA,
  ...WANDS_CARDS,
  ...CUPS_CARDS,
  ...SWORDS_CARDS,
  ...PENTACLES_CARDS,
];

// Verify cards count exactly 78
if (process.env.NODE_ENV !== "production") {
  if (ALL_TAROT_CARDS.length !== 78) {
    console.warn(`[Tarot Warning] Expected 78 cards, got ${ALL_TAROT_CARDS.length}`);
  }
}

export const TAROT_CARDS_MAP = new Map<string, TarotCardData>(
  ALL_TAROT_CARDS.map((card) => [card.id, card])
);

export function getCardById(id: string): TarotCardData | undefined {
  return TAROT_CARDS_MAP.get(id);
}

