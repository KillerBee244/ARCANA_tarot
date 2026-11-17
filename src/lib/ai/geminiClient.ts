/**
 * ARCANA — Gemini AI Integration Layer
 * Uses official @google/genai SDK with resilient timeout, structured outputs & fallbacks.
 */

import { GoogleGenAI } from "@google/genai";
import { AIStructuredOutput, AIStructuredOutputSchema } from "./schema";
import { generateMockAiResponse } from "./fallback";
import { PopulatedCard, QuestionCategory, SpreadType } from "@/types/tarot";

export interface GenerateAIInterpretationOptions {
  populatedCards: PopulatedCard[];
  spreadType: SpreadType;
  category: QuestionCategory;
  userQuestion?: string;
}

export interface AIServiceResult {
  success: boolean;
  data?: AIStructuredOutput;
  status: "success" | "disabled" | "rate_limited" | "timeout" | "error";
  errorCode?: "MISSING_KEY" | "DISABLED" | "RATE_LIMITED" | "TIMEOUT" | "VALIDATION_FAILED" | "UPSTREAM_ERROR";
  errorMessage?: string;
  isMock?: boolean;
}

export async function requestGeminiInterpretation(
  options: GenerateAIInterpretationOptions
): Promise<AIServiceResult> {
  const isEnabled = process.env.GEMINI_ENABLED !== "false";
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const isMock = process.env.MOCK_AI === "true";
  const timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || "15000", 10);
  const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  // Check Mock AI mode
  if (isMock) {
    const mockData = generateMockAiResponse(
      options.populatedCards,
      options.spreadType,
      options.category,
      options.userQuestion
    );
    return {
      success: true,
      data: mockData,
      status: "success",
      isMock: true,
    };
  }

  // Check Disabled or Missing Key
  if (!isEnabled) {
    return {
      success: false,
      status: "disabled",
      errorCode: "DISABLED",
      errorMessage: "Tính năng Diễn giải AI đang tạm tắt trong cài đặt hệ thống.",
    };
  }

  if (!apiKey) {
    return {
      success: false,
      status: "disabled",
      errorCode: "MISSING_KEY",
      errorMessage: "Chưa cấu hình Gemini API Key. Trải nghiệm đang chạy ở chế độ Diễn giải truyền thống.",
    };
  }

  // Build compact context prompt (only relevant cards, not all 78)
  const cardsSummary = options.populatedCards
    .map(
      (c, idx) =>
        `Lá ${idx + 1}: ${c.card.nameVi} (${c.card.nameEn})
- Vị trí: ${c.position.nameVi} (${c.position.descriptionVi})
- Chiều: ${c.orientation === "upright" ? "Thuận (Upright)" : "Ngược (Reversed)"}
- Từ khóa: ${
          c.orientation === "upright" ? c.card.uprightKeywords.join(", ") : c.card.reversedKeywords.join(", ")
        }
- Ý nghĩa cốt lõi: ${c.orientation === "upright" ? c.card.uprightMeaning : c.card.reversedMeaning}
- Biểu tượng: ${c.card.symbolism}`
    )
    .join("\n\n");

  const promptContent = `
Bạn là ARCANA — Giọng nói triết học và thấu cảm của Kho Lưu Trữ Khả Năng (The Archive of Possibilities).
Nhiệm vụ của bạn: Tạo nên một bản diễn giải Tarot sâu sắc, văn phong giàu chất thơ, tinh tế, đậm tính phản chiếu nội tâm.

THÔNG TIN TRẢI BÀI:
- Thể loại câu hỏi: ${options.category.toUpperCase()}
- Câu hỏi người xem: "${options.userQuestion || "Khám phá thông điệp vũ trụ cho giai đoạn hiện tại"}"
- Kiểu trải bài: ${options.spreadType === "single" ? "Trải bài 1 lá (Trọng tâm)" : "Trải bài 3 lá (Quá khứ - Hiện tại - Tương lai)"}

CÁC LÁ BÀI ĐÃ RÚT (CỐ ĐỊNH, KHÔNG ĐƯỢC THAY ĐỔI):
${cardsSummary}

YÊU CẦU BẮT BUỘC:
1. Giữ nguyên danh tính, vị trí và chiều (thuận/ngược) của các lá bài đã rút.
2. Không khẳng định tương lai là định mệnh chắc chắn. Không đưa ra lời khuyên y tế, tài chính hay pháp lý mang tính tuyệt đối.
3. Liên kết mạch lạc các lá bài thành một câu chuyện tiếp nối có ý nghĩa với băn khoăn của người xem.
4. Trả về đúng định dạng JSON theo cấu trúc sau (không kèm markdown ngoài khối JSON):
{
  "title": "Tiêu đề ngắn gọn mang tính thi vị và gợi mở (tối đa 100 ký tự)",
  "overview": "Tổng quan thông điệp và dòng chảy năng lượng chung giữa các lá bài (khoảng 3-4 câu)",
  "cardConnections": [
    {
      "cardId": "ID lá bài chính xác (ví dụ: ${options.populatedCards[0].card.id})",
      "connectionText": "Diễn giải ý nghĩa lá bài trong mối liên hệ với các lá khác và câu hỏi"
    }
  ],
  "personalizedInterpretation": "Phân tích cá nhân hóa trả lời trực tiếp cho câu hỏi của người xem",
  "reflectionQuestions": [
    "Câu hỏi tự vấn 1",
    "Câu hỏi tự vấn 2",
    "Câu hỏi tự vấn 3"
  ],
  "closingMessage": "Thông điệp đúc kết truyền cảm hứng và bình an (1-2 câu)"
}
`.trim();

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Enforce strict timeout using AbortController / Promise.race
    const apiCallPromise = ai.models.generateContent({
      model: modelName,
      contents: promptContent,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("REQUEST_TIMEOUT")), timeoutMs);
    });

    const result = await Promise.race([apiCallPromise, timeoutPromise]);
    const responseText = result.text?.trim() || "";

    if (!responseText) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    // Parse JSON
    let parsedJson: any;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (parseErr) {
      // Strip markdown code block ticks if present
      const cleaned = responseText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      parsedJson = JSON.parse(cleaned);
    }

    // Validate with Zod
    const validated = AIStructuredOutputSchema.safeParse(parsedJson);
    if (!validated.success) {
      console.error("[AI Validation Error]", validated.error);
      return {
        success: false,
        status: "error",
        errorCode: "VALIDATION_FAILED",
        errorMessage: "Phản hồi từ AI không đúng cấu trúc tiêu chuẩn.",
      };
    }

    return {
      success: true,
      data: validated.data,
      status: "success",
    };
  } catch (err: any) {
    const errorMsg = String(err?.message || err);
    console.error("[Gemini AI Error]", errorMsg);

    if (errorMsg.includes("REQUEST_TIMEOUT")) {
      return {
        success: false,
        status: "timeout",
        errorCode: "TIMEOUT",
        errorMessage: "Thời gian kết nối tới AI vượt quá giới hạn. Hệ thống đang bảo lưu kết quả truyền thống.",
      };
    }

    if (
      errorMsg.includes("429") ||
      errorMsg.includes("quota") ||
      errorMsg.includes("ResourceExhausted") ||
      errorMsg.includes("503") ||
      errorMsg.includes("high demand") ||
      errorMsg.includes("UNAVAILABLE")
    ) {
      return {
        success: false,
        status: "rate_limited",
        errorCode: "RATE_LIMITED",
        errorMessage: "Dịch vụ AI tạm thời nhận lượng yêu cầu lớn (503/429). Hệ thống tự động chuyển sang chế độ giải mã truyền thống.",
      };
    }

    return {
      success: false,
      status: "error",
      errorCode: "UPSTREAM_ERROR",
      errorMessage: "Có gián đoạn kết nối tới dịch vụ AI. Bạn vẫn có thể xem trọn vẹn kết quả truyền thống.",
    };
  }
}

