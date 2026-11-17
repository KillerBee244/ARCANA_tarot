/**
 * ARCANA — Tarot Spread Definitions
 */

import { SpreadType, TarotSpreadDef } from "@/types/tarot";

export const TAROT_SPREADS: Record<SpreadType, TarotSpreadDef> = {
  single: {
    type: "single",
    nameVi: "Trải Bài Đơn — Thông Điệp Trọng Tâm",
    nameEn: "Single Card Spread — The Focal Message",
    descriptionVi: "Một lá bài thấu suốt soi tỏ bản chất vấn đề và trao lời khuyên trực tiếp nhất cho thời khắc này.",
    cardCount: 1,
    positions: [
      {
        id: "center",
        nameVi: "Thông Điệp Vũ Trụ",
        nameEn: "Cosmic Message",
        descriptionVi: "Bản chất cốt lõi của tình huống và lời khuyên trung tâm từ bộ bài.",
      },
    ],
  },
  three_card: {
    type: "three_card",
    nameVi: "Trải Bài Ba Lá — Quá Khứ, Hiện Tại, Tương Lai",
    nameEn: "Three Card Spread — Past, Present, Future",
    descriptionVi: "Hành trình thời gian hé lộ nguồn cơn trong quá khứ, năng lượng hiện tại và xu hướng chuyển dịch tương lai.",
    cardCount: 3,
    positions: [
      {
        id: "past",
        nameVi: "Quá Khứ (Gốc Rễ)",
        nameEn: "The Past (Roots)",
        descriptionVi: "Nguồn cơn, bài học hoặc sự kiện nền tảng đã hình thành nên tình huống hiện thời.",
      },
      {
        id: "present",
        nameVi: "Hiện Tại (Thực Tại)",
        nameEn: "The Present (Reality)",
        descriptionVi: "Năng lượng đang vận hành, thách thức hoặc cơ hội đang diễn ra ở thời điểm này.",
      },
      {
        id: "future",
        nameVi: "Tương Lai (Tiềm Năng)",
        nameEn: "The Future (Potential)",
        descriptionVi: "Xu hướng phát triển và kết quả tiềm năng nếu bạn tiếp tục theo tiến trình hiện tại.",
      },
    ],
  },
};

export function getSpreadDef(type: SpreadType): TarotSpreadDef {
  return TAROT_SPREADS[type] || TAROT_SPREADS.three_card;
}

