/**
 * ARCANA — Cryptographically Secure Deck Shuffling & Drawing
 */

import { ALL_TAROT_CARDS } from "@/data/tarot/cards";
import { CardOrientation, SelectedCard, SpreadType } from "@/types/tarot";
import { getSpreadDef } from "@/data/tarot/spreads";

/**
 * Unbiased random integer generation in range [0, max) using crypto.getRandomValues
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 1) return 0;

  // Use rejection sampling to avoid modulo bias
  const bitsNeeded = Math.ceil(Math.log2(max));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const mask = (1 << bitsNeeded) - 1;
  const byteArray = new Uint8Array(bytesNeeded);

  while (true) {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(byteArray);
    } else {
      // Fallback for non-browser/non-web-crypto environments
      return Math.floor(Math.random() * max);
    }

    let value = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      value = (value << 8) | byteArray[i];
    }
    value = value & mask;

    if (value < max) {
      return value;
    }
  }
}

/**
 * Fisher-Yates shuffle with unbiased crypto random values
 */
export function shuffleDeck(cardIds: string[] = ALL_TAROT_CARDS.map((c) => c.id)): string[] {
  const deck = [...cardIds];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * Draw a random orientation: upright or reversed
 */
export function getRandomOrientation(allowReversed: boolean = true): CardOrientation {
  if (!allowReversed) return "upright";
  return getSecureRandomInt(2) === 0 ? "upright" : "reversed";
}

/**
 * Auto-select cards for a spread (e.g. for instant draw or tests)
 */
export function drawCardsForSpread(
  spreadType: SpreadType,
  allowReversed: boolean = true,
  shuffledDeck?: string[]
): SelectedCard[] {
  const spreadDef = getSpreadDef(spreadType);
  const deck = shuffledDeck || shuffleDeck();
  const drawn: SelectedCard[] = [];

  for (let i = 0; i < spreadDef.cardCount; i++) {
    const cardId = deck[i];
    const position = spreadDef.positions[i];
    drawn.push({
      cardId,
      orientation: getRandomOrientation(allowReversed),
      positionId: position.id,
      selectionOrder: i,
    });
  }

  return drawn;
}

