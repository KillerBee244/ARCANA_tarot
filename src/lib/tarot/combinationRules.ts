/**
 * ARCANA — Tarot Combination Engine
 * Explicit rules for multi-card relationships, suit dominance, arcana density,
 * and temporal transitions across Past-Present-Future.
 */

import { CombinationRuleResult, PopulatedCard, TarotSuit } from "@/types/tarot";

export function analyzeCombinations(cards: PopulatedCard[]): CombinationRuleResult[] {
  const rules: CombinationRuleResult[] = [];
  if (cards.length === 0) return rules;

  const majorCount = cards.filter((c) => c.card.arcana === "major").length;
  const reversedCount = cards.filter((c) => c.orientation === "reversed").length;
  const suits = cards
    .map((c) => c.card.suit)
    .filter((s): s is TarotSuit => Boolean(s));

  const suitCounts: Record<TarotSuit, number> = {
    wands: suits.filter((s) => s === "wands").length,
    cups: suits.filter((s) => s === "cups").length,
    swords: suits.filter((s) => s === "swords").length,
    pentacles: suits.filter((s) => s === "pentacles").length,
  };

  // 1. Major Arcana Dominance
  if (majorCount >= 2 && cards.length >= 2) {
    rules.push({
      ruleId: "major_dominance",
      titleVi: "Âm Hưởng Định Mệnh (Major Dominance)",
      descriptionVi: `Có ${majorCount} lá Ẩn Chính trong trải bài. Đây không phải những biến cố vụn vặt thường nhật, mà là giai đoạn chuyển mình mang tính bước ngoặt và định hình số phận. Các bài học linh hồn đang vận hành mạnh mẽ.`,
      impact: "transformative",
    });
  } else if (majorCount === 0 && cards.length >= 3) {
    rules.push({
      ruleId: "minor_pragmatic",
      titleVi: "Năng Lượng Thực Tiễn (Grounded Reality)",
      descriptionVi: "Toàn bộ trải bài thuộc Bộ Ẩn Phụ. Tình huống hoàn toàn nằm trong tầm tay bạn thông qua những hành động cụ thể, quyết định thực tế và kỹ năng hàng ngày.",
      impact: "neutral",
    });
  }

  // 2. Suit Dominance / Elemental Focus
  if (suitCounts.wands >= 2) {
    rules.push({
      ruleId: "wands_dominance",
      titleVi: "Ngọn Lửa Khát Vọng (Fire Influence)",
      descriptionVi: "Năng lượng Lửa chiếm ưu thế (Wands): Bạn đang có động lực lớn, nhiệt huyết và tốc độ chuyển biến nhanh. Cần duy trì sự tập trung để tránh bị kiệt sức.",
      impact: "positive",
    });
  }

  if (suitCounts.cups >= 2) {
    rules.push({
      ruleId: "cups_dominance",
      titleVi: "Dòng Chảy Cảm Xúc (Water Influence)",
      descriptionVi: "Năng lượng Nước chiếm ưu thế (Cups): Trái tim, trực giác và các mối quan hệ tình cảm đang là trọng tâm lớn nhất. Hãy lắng nghe tiếng nói nội tâm hơn là các lý lẽ khô cứng.",
      impact: "positive",
    });
  }

  if (suitCounts.swords >= 2) {
    rules.push({
      ruleId: "swords_dominance",
      titleVi: "Thử Thách Trí Tuệ & Chân Lý (Air Influence)",
      descriptionVi: "Năng lượng Khí chiếm ưu thế (Swords): Giai đoạn đòi hỏi sự tỉnh táo, đối diện với sự thật dù gai góc. Cần làm chủ tâm trí, tránh suy nghĩ quá nhiều gây áp lực tinh thần.",
      impact: "caution",
    });
  }

  if (suitCounts.pentacles >= 2) {
    rules.push({
      ruleId: "pentacles_dominance",
      titleVi: "Nền Tảng Vững Chắc (Earth Influence)",
      descriptionVi: "Năng lượng Đất chiếm ưu thế (Pentacles): Trọng tâm nằm ở sự ổn định tài chính, công việc thực tế, sức khỏe thể chất và sự nghiệp dài hạn.",
      impact: "positive",
    });
  }

  // 3. Orientation Patterns
  if (reversedCount === cards.length && cards.length >= 2) {
    rules.push({
      ruleId: "all_reversed",
      titleVi: "Nút Thắt Năng Lượng Nội Tâm (Internal Bottleneck)",
      descriptionVi: "Tất cả các lá bài đều ở vị trí đảo ngược: Năng lượng đang bị kìm nén hoặc gặp sự kháng cự từ bên trong. Đây là tín hiệu cần thanh lọc nội tâm, giải phóng các niềm tin cũ kỹ trước khi hành động ra ngoài.",
      impact: "caution",
    });
  } else if (reversedCount === 0 && cards.length >= 3) {
    rules.push({
      ruleId: "all_upright",
      titleVi: "Dòng Chảy Thuận Thiên (Aligned Flow)",
      descriptionVi: "Toàn bộ các lá bài đều ở vị trí xuôi: Dòng năng lượng vũ trụ đang chảy thông suốt, các yếu tố ngoại cảnh hỗ trợ tích cực cho hành trình của bạn. Hãy tự tin tiến bước.",
      impact: "positive",
    });
  }

  // 4. Temporal Progression Rules (For 3-card spread: Past -> Present -> Future)
  if (cards.length === 3) {
    const pastCard = cards.find((c) => c.position.id === "past");
    const presentCard = cards.find((c) => c.position.id === "present");
    const futureCard = cards.find((c) => c.position.id === "future");

    if (pastCard && presentCard && futureCard) {
      // Past challenging (Swords/Tower/Death) to Future triumphant (Sun/Star/World/Four of Wands)
      const difficultIds = [
        "major-16-tower",
        "major-13-death",
        "major-15-devil",
        "swords-03-three",
        "swords-09-nine",
        "swords-10-ten",
        "pentacles-05-five",
      ];
      const luminousIds = [
        "major-17-star",
        "major-19-sun",
        "major-21-world",
        "wands-04-four",
        "wands-06-six",
        "cups-09-nine",
        "cups-10-ten",
        "pentacles-09-nine",
        "pentacles-10-ten",
      ];

      const pastIsDifficult = difficultIds.includes(pastCard.card.id);
      const futureIsLuminous = luminousIds.includes(futureCard.card.id) && futureCard.orientation === "upright";

      if (pastIsDifficult && futureIsLuminous) {
        rules.push({
          ruleId: "breakthrough_resilience",
          titleVi: "Chuyển Hóa Tái Sinh (From Shadow to Light)",
          descriptionVi: "Quá khứ mang vết thương thử thách sâu sắc, nhưng tương lai mở ra sự viên mãn rực rỡ. Bạn đang đi qua đường hầm tăm tối để tiến thẳng vào ánh bình minh rực sáng.",
          impact: "transformative",
        });
      }

      // Present crisis warning
      if (presentCard.card.id === "major-16-tower" || presentCard.card.id === "major-15-devil") {
        rules.push({
          ruleId: "present_catalyst",
          titleVi: "Cơn Chấn Động Đương Thời (Present Catalyst)",
          descriptionVi: "Thời điểm hiện tại đang diễn ra một cuộc va đập mạnh hoặc thức tỉnh sâu sắc. Hãy dũng cảm buông bỏ ảo tưởng để bảo vệ bản thể đích thực.",
          impact: "caution",
        });
      }
    }
  }

  return rules;
}
