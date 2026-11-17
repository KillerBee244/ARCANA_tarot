import { describe, it, expect } from "vitest";
import { ALL_TAROT_CARDS, TAROT_CARDS_MAP } from "@/data/tarot/cards";
import { MAJOR_ARCANA } from "@/data/tarot/majorArcana";
import { WANDS_CARDS } from "@/data/tarot/wands";
import { CUPS_CARDS } from "@/data/tarot/cups";
import { SWORDS_CARDS } from "@/data/tarot/swords";
import { PENTACLES_CARDS } from "@/data/tarot/pentacles";
import { shuffleDeck, drawCardsForSpread, getSecureRandomInt } from "@/lib/tarot/deck";
import { interpretReadingRulebase } from "@/lib/tarot/engine";
import { analyzeCombinations } from "@/lib/tarot/combinationRules";

describe("Tarot Rulebook Integrity", () => {
  it("should contain exactly 78 cards in total", () => {
    expect(ALL_TAROT_CARDS.length).toBe(78);
  });

  it("should contain exactly 22 Major Arcana cards", () => {
    expect(MAJOR_ARCANA.length).toBe(22);
    MAJOR_ARCANA.forEach((c) => expect(c.arcana).toBe("major"));
  });

  it("should contain exactly 56 Minor Arcana cards across 4 suits of 14 each", () => {
    expect(WANDS_CARDS.length).toBe(14);
    expect(CUPS_CARDS.length).toBe(14);
    expect(SWORDS_CARDS.length).toBe(14);
    expect(PENTACLES_CARDS.length).toBe(14);
  });

  it("should ensure every card has a unique ID and non-empty meanings", () => {
    const idSet = new Set<string>();

    ALL_TAROT_CARDS.forEach((card) => {
      expect(idSet.has(card.id)).toBe(false);
      idSet.add(card.id);

      expect(card.nameEn.trim().length).toBeGreaterThan(0);
      expect(card.nameVi.trim().length).toBeGreaterThan(0);
      expect(card.uprightKeywords.length).toBeGreaterThan(0);
      expect(card.reversedKeywords.length).toBeGreaterThan(0);
      expect(card.uprightMeaning.trim().length).toBeGreaterThan(20);
      expect(card.reversedMeaning.trim().length).toBeGreaterThan(20);
      expect(card.symbolism.trim().length).toBeGreaterThan(10);
      expect(card.reflectionPrompt.trim().length).toBeGreaterThan(10);

      // Category meanings check
      if (card.categoryMeanings) {
        expect(card.categoryMeanings.upright.love.trim().length).toBeGreaterThan(5);
        expect(card.categoryMeanings.upright.career.trim().length).toBeGreaterThan(5);
        expect(card.categoryMeanings.upright.finance.trim().length).toBeGreaterThan(5);
        expect(card.categoryMeanings.upright.self.trim().length).toBeGreaterThan(5);
      }
    });

    expect(idSet.size).toBe(78);
  });
});

describe("Cryptographic Deck Shuffling & Drawing", () => {
  it("should generate secure random integers within bounds", () => {
    for (let i = 0; i < 50; i++) {
      const val = getSecureRandomInt(10);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(10);
    }
  });

  it("should preserve all 78 unique cards when shuffling", () => {
    const shuffled = shuffleDeck();
    expect(shuffled.length).toBe(78);
    const uniqueCards = new Set(shuffled);
    expect(uniqueCards.size).toBe(78);
  });

  it("should draw cards for a three-card spread without duplicates", () => {
    const drawn = drawCardsForSpread("three_card", true);
    expect(drawn.length).toBe(3);
    const ids = drawn.map((d) => d.cardId);
    expect(new Set(ids).size).toBe(3);
    expect(["upright", "reversed"]).toContain(drawn[0].orientation);
  });
});

describe("Deterministic Rulebase Engine", () => {
  it("should produce valid interpretation for a 3-card spread across all categories", () => {
    const drawn = drawCardsForSpread("three_card", true);
    const categories = ["love", "career", "finance", "self", "general"] as const;

    categories.forEach((cat) => {
      const result = interpretReadingRulebase(drawn, "three_card", cat, "Định hướng sắp tới?");
      expect(result.spreadType).toBe("three_card");
      expect(result.category).toBe(cat);
      expect(result.cards.length).toBe(3);
      expect(result.overviewSynthesis.length).toBeGreaterThan(50);
      expect(result.reflectionQuestions.length).toBe(3);
      expect(result.rulebookVersion).toBe("1.0.0");
    });
  });

  it("should trigger Major Dominance combination rule when 2+ Majors are drawn", () => {
    const mockSelected = [
      { cardId: "major-00-fool", orientation: "upright" as const, positionId: "past", selectionOrder: 0 },
      { cardId: "major-01-magician", orientation: "upright" as const, positionId: "present", selectionOrder: 1 },
      { cardId: "wands-01-ace", orientation: "upright" as const, positionId: "future", selectionOrder: 2 },
    ];
    const result = interpretReadingRulebase(mockSelected, "three_card", "general");
    const hasMajorDominance = result.combinationRules.some((r) => r.ruleId === "major_dominance");
    expect(hasMajorDominance).toBe(true);
  });

  it("should trigger All Reversed combination rule when all cards are reversed", () => {
    const mockSelected = [
      { cardId: "cups-01-ace", orientation: "reversed" as const, positionId: "past", selectionOrder: 0 },
      { cardId: "cups-02-two", orientation: "reversed" as const, positionId: "present", selectionOrder: 1 },
      { cardId: "cups-03-three", orientation: "reversed" as const, positionId: "future", selectionOrder: 2 },
    ];
    const result = interpretReadingRulebase(mockSelected, "three_card", "love");
    const hasAllReversed = result.combinationRules.some((r) => r.ruleId === "all_reversed");
    const hasCupsDominance = result.combinationRules.some((r) => r.ruleId === "cups_dominance");
    expect(hasAllReversed).toBe(true);
    expect(hasCupsDominance).toBe(true);
  });
});

