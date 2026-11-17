/**
 * ARCANA — AI Fallback, Rate Limiter & Mock Generator
 */

import { AIStructuredOutput } from "./schema";
import { PopulatedCard, QuestionCategory, SpreadType } from "@/types/tarot";

// Simple in-memory rate limiter for server runtime (per IP or session)
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // max 10 requests per minute per IP

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const timestamps = requestTimestamps.get(identifier) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = validTimestamps[0];
    const retryAfter = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  validTimestamps.push(now);
  requestTimestamps.set(identifier, validTimestamps);
  return { allowed: true };
}

/**
 * Generate labeled mock AI response for offline local development testing
 */
export function generateMockAiResponse(
  populatedCards: PopulatedCard[],
  spreadType: SpreadType,
  category: QuestionCategory,
  userQuestion?: string
): AIStructuredOutput {
  const cardNames = populatedCards.map(
    (c) => `${c.card.nameVi} (${c.orientation === "upright" ? "Thuận" : "Ngược"})`
  );

  return {
    title: `[MOCK AI] Khai Mở Vũ Trụ Tâm Hồn: ${category.toUpperCase()}`,
    overview: `Trải bài ${spreadType === "single" ? "đơn" : "3 lá"} với sự xuất hiện của ${cardNames.join(
      ", "
    )} tạo nên một bức tranh sâu sắc về hành trình bạn đang trải qua. Dù câu hỏi là gì, vũ trụ luôn phản chiếu chân thực tâm thức hiện tại của bạn.`,
    cardConnections: populatedCards.map((c) => ({
      cardId: c.card.id,
      connectionText: `${c.card.nameVi} ở vị trí ${c.position.nameVi} nhấn mạnh: ${
        c.orientation === "upright" ? c.card.uprightKeywords.join(", ") : c.card.reversedKeywords.join(", ")
      }. Đây là thông điệp trực tiếp nhắc nhở bạn duy trì sự tỉnh thức.`,
    })),
    personalizedInterpretation: `Đối với băn khoăn "${userQuestion || "định hướng cuộc sống"}", sự kết hợp giữa các lá bài cho thấy bạn đang đứng trước thời khắc chuyển hóa quan trọng. Hãy tin vào tiếng nói trực giác và các bước đi thực tế đã được vạch ra.`,
    reflectionQuestions: [
      "Bước ngoặt lớn nhất bạn đang thực sự khao khát lúc này là gì?",
      "Điều gì đang níu giữ bạn lại và bạn sẵn sàng buông bỏ điều gì?",
      "Làm thế nào để bạn hành động với sự tự tin và lòng can đảm cao nhất?",
    ],
    closingMessage:
      "Tương lai không phải là định mệnh bất biến, mà là bức tranh do chính những lựa chọn có ý thức của bạn kiến tạo mỗi ngày.",
  };
}
