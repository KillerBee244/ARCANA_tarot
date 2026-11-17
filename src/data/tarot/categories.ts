import { QuestionCategory } from "@/types/tarot";

export const CATEGORY_LABELS_VI: Record<QuestionCategory, string> = {
  love: "Tình yêu",
  career: "Sự nghiệp",
  finance: "Tài chính",
  self: "Bản thân",
  general: "Tổng quan",
};

export function getCategoryLabelVi(cat: QuestionCategory | string): string {
  if (cat in CATEGORY_LABELS_VI) {
    return CATEGORY_LABELS_VI[cat as QuestionCategory];
  }
  return "Tổng quan";
}

/**
 * Extracts a clean primary Vietnamese name for a Tarot card.
 * For Major Arcana: "Kẻ Khờ", "Nữ Hoàng"
 * For Minor Arcana where nameVi is "Two of Swords (Hai Kiếm)": returns "Hai Kiếm"
 */
export function getCleanViCardName(nameVi: string): string {
  const match = nameVi.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return nameVi.trim();
}

