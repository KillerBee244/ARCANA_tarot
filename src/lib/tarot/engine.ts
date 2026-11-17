/**
 * ARCANA — Deterministic Tarot Rulebook Engine
 * Operates purely locally with no external API or Gemini dependency.
 */

import { getCardById, RULEBOOK_VERSION } from "@/data/tarot/cards";
import { getSpreadDef } from "@/data/tarot/spreads";
import {
  PopulatedCard,
  QuestionCategory,
  RulebaseInterpretation,
  SelectedCard,
  SpreadType,
  TarotSuit,
} from "@/types/tarot";
import { analyzeCombinations } from "./combinationRules";

export function interpretReadingRulebase(
  selectedCards: SelectedCard[],
  spreadType: SpreadType,
  category: QuestionCategory,
  userQuestion?: string
): RulebaseInterpretation {
  const spreadDef = getSpreadDef(spreadType);

  // 1. Populate Cards
  const populatedCards: PopulatedCard[] = selectedCards.map((sc) => {
    const cardData = getCardById(sc.cardId);
    if (!cardData) {
      throw new Error(`Invalid card ID: ${sc.cardId}`);
    }
    const position =
      spreadDef.positions.find((p) => p.id === sc.positionId) ||
      spreadDef.positions[sc.selectionOrder] || {
        id: sc.positionId,
        nameVi: "Vị Trí Trọng Tâm",
        nameEn: "Focus Position",
        descriptionVi: "Ảnh hưởng trung tâm của thông điệp.",
      };

    return {
      ...sc,
      card: cardData,
      position,
    };
  });

  // 2. Individual Card Interpretations with Category & Position Modifiers
  const interpretedCards = populatedCards.map((pc) => {
    const isUpright = pc.orientation === "upright";
    const baseMeaning = isUpright ? pc.card.uprightMeaning : pc.card.reversedMeaning;

    // Resolve Category Meaning
    let categoryText = "";
    if (pc.card.categoryMeanings) {
      const catGroup = isUpright
        ? pc.card.categoryMeanings.upright
        : pc.card.categoryMeanings.reversed;
      if (category === "love") categoryText = catGroup.love;
      else if (category === "career") categoryText = catGroup.career;
      else if (category === "finance") categoryText = catGroup.finance;
      else if (category === "self") categoryText = catGroup.self;
      else categoryText = `${catGroup.self} ${catGroup.career}`;
    } else {
      categoryText = baseMeaning;
    }

    // Position Contextualization
    let positionMeaning = "";
    if (spreadType === "single") {
      positionMeaning = `Tại vị trí trung tâm (${pc.position.nameVi}): ${baseMeaning}`;
    } else {
      if (pc.position.id === "past") {
        positionMeaning = `Ở vị trí Quá Khứ: Những sự kiện, gốc rễ đã định hình tình huống hiện tại xoay quanh ${
          isUpright ? pc.card.uprightKeywords.slice(0, 2).join(", ") : pc.card.reversedKeywords.slice(0, 2).join(", ")
        }. ${baseMeaning}`;
      } else if (pc.position.id === "present") {
        positionMeaning = `Ở vị trí Hiện Tại: Năng lượng chủ đạo đang vận hành lúc này là ${
          isUpright ? pc.card.uprightKeywords.slice(0, 2).join(", ") : pc.card.reversedKeywords.slice(0, 2).join(", ")
        }. Đây là thách thức hoặc điểm tựa trực tiếp của bạn.`;
      } else if (pc.position.id === "future") {
        positionMeaning = `Ở vị trí Tương Lai: Nếu giữ nguyên tiến trình này, xu hướng phát triển hướng về ${
          isUpright ? pc.card.uprightKeywords.slice(0, 2).join(", ") : pc.card.reversedKeywords.slice(0, 2).join(", ")
        }. ${baseMeaning}`;
      } else {
        positionMeaning = baseMeaning;
      }
    }

    return {
      card: pc.card,
      orientation: pc.orientation,
      position: pc.position,
      positionMeaning,
      categoryMeaning: categoryText,
      coreAdvice: pc.card.reflectionPrompt,
    };
  });

  // 3. Analyze Combinations & Themes
  const combinationRules = analyzeCombinations(populatedCards);

  const majorCount = populatedCards.filter((c) => c.card.arcana === "major").length;
  const reversedCount = populatedCards.filter((c) => c.orientation === "reversed").length;

  const suits = populatedCards
    .map((c) => c.card.suit)
    .filter((s): s is TarotSuit => Boolean(s));

  const suitTally: Record<TarotSuit, number> = {
    wands: suits.filter((s) => s === "wands").length,
    cups: suits.filter((s) => s === "cups").length,
    swords: suits.filter((s) => s === "swords").length,
    pentacles: suits.filter((s) => s === "pentacles").length,
  };

  let dominantSuit: TarotSuit | undefined;
  let maxSuitCount = 0;
  (Object.keys(suitTally) as TarotSuit[]).forEach((s) => {
    if (suitTally[s] > maxSuitCount && suitTally[s] >= 2) {
      maxSuitCount = suitTally[s];
      dominantSuit = s;
    }
  });

  // 4. Synthesize Overview
  let overviewSynthesis = "";
  if (spreadType === "single") {
    const single = interpretedCards[0];
    overviewSynthesis = `Trải bài đơn mở ra lá ${single.card.nameVi} (${
      single.orientation === "upright" ? "Vị trí Thuận" : "Vị trí Ngược"
    }). Thông điệp gửi gắm cho bạn: ${single.positionMeaning} Đối với khía cạnh bạn đang bận tâm, ${single.categoryMeaning}`;
  } else {
    const past = interpretedCards.find((c) => c.position.id === "past") || interpretedCards[0];
    const present = interpretedCards.find((c) => c.position.id === "present") || interpretedCards[1];
    const future = interpretedCards.find((c) => c.position.id === "future") || interpretedCards[2];

    overviewSynthesis = `Hành trình trải bài 3 lá cho thấy sự tiếp nối rõ rệt: Từ nền móng ${past.card.nameVi} (${
      past.orientation === "upright" ? "Thuận" : "Ngược"
    }) trong quá khứ, bạn bước vào thực tại được soi rọi bởi ${present.card.nameVi} (${
      present.orientation === "upright" ? "Thuận" : "Ngược"
    }), và xu hướng phát triển tự nhiên đang dịch chuyển về ${future.card.nameVi} (${
      future.orientation === "upright" ? "Thuận" : "Ngược"
    }). Dòng chảy năng lượng này phản ánh sâu sắc khía cạnh bạn đang tìm kiếm lời giải.`;
  }

  // 5. Build Advice & Reflection Prompts
  const reflectionQuestions = populatedCards.map((pc) => pc.card.reflectionPrompt);
  if (reflectionQuestions.length < 3) {
    reflectionQuestions.push(
      "Hành động nhỏ nhất bạn có thể làm trong 24 giờ tới để tiến gần hơn với sự hòa hợp nội tâm là gì?"
    );
  }

  const coreAdvice =
    interpretedCards.length === 1
      ? interpretedCards[0].coreAdvice
      : `Hãy tích hợp bài học từ quá khứ (${interpretedCards[0].card.nameVi}), giữ vững sự chủ động ở hiện tại (${interpretedCards[1].card.nameVi}), và mở lòng đón nhận tiềm năng phía trước (${interpretedCards[2].card.nameVi}).`;

  return {
    spreadType,
    category,
    cards: interpretedCards,
    overviewSynthesis,
    dominantThemes: {
      majorArcanaCount: majorCount,
      dominantSuit,
      reversedCount,
    },
    combinationRules,
    coreAdvice,
    reflectionQuestions: reflectionQuestions.slice(0, 3),
    rulebookVersion: RULEBOOK_VERSION,
  };
}

