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
 * Handles both Major Arcana ("Cỗ Chiến Xa (The Chariot)") and Minor Arcana ("Two of Swords (Hai Kiếm)").
 */
export function getCleanViCardName(nameVi: string, nameEn?: string): string {
  if (!nameVi) return "";
  const match = nameVi.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    const part1 = match[1].trim(); // outside parentheses
    const part2 = match[2].trim(); // inside parentheses

    if (nameEn) {
      if (part1.toLowerCase() === nameEn.toLowerCase()) {
        return part2;
      }
      if (part2.toLowerCase() === nameEn.toLowerCase()) {
        return part1;
      }
    }

    const hasDiacritics = (str: string) =>
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
        str
      );
    if (hasDiacritics(part2)) return part2;
    if (hasDiacritics(part1)) return part1;
    return part1;
  }
  return nameVi.trim();
}

