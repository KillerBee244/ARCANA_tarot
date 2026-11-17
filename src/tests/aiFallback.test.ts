import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { requestGeminiInterpretation } from "@/lib/ai/geminiClient";
import { checkRateLimit, generateMockAiResponse } from "@/lib/ai/fallback";
import { InterpretApiRequestSchema, AIStructuredOutputSchema } from "@/lib/ai/schema";
import { getCardById } from "@/data/tarot/cards";
import { getSpreadDef } from "@/data/tarot/spreads";

describe("AI Fallback & Rate Limiting", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return 'disabled' status with 'MISSING_KEY' when GEMINI_API_KEY is not set", async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.MOCK_AI;
    process.env.GEMINI_ENABLED = "true";

    const card = getCardById("major-00-fool")!;
    const pos = getSpreadDef("single").positions[0];

    const result = await requestGeminiInterpretation({
      populatedCards: [{ cardId: card.id, orientation: "upright", positionId: pos.id, selectionOrder: 0, card, position: pos }],
      spreadType: "single",
      category: "general",
      userQuestion: "Test Question",
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe("disabled");
    expect(result.errorCode).toBe("MISSING_KEY");
  });

  it("should return 'disabled' when GEMINI_ENABLED=false", async () => {
    process.env.GEMINI_ENABLED = "false";
    process.env.GEMINI_API_KEY = "test-key";

    const card = getCardById("major-00-fool")!;
    const pos = getSpreadDef("single").positions[0];

    const result = await requestGeminiInterpretation({
      populatedCards: [{ cardId: card.id, orientation: "upright", positionId: pos.id, selectionOrder: 0, card, position: pos }],
      spreadType: "single",
      category: "general",
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe("disabled");
    expect(result.errorCode).toBe("DISABLED");
  });

  it("should produce valid structured output in MOCK_AI development mode", async () => {
    process.env.MOCK_AI = "true";

    const card = getCardById("major-00-fool")!;
    const pos = getSpreadDef("single").positions[0];

    const result = await requestGeminiInterpretation({
      populatedCards: [{ cardId: card.id, orientation: "upright", positionId: pos.id, selectionOrder: 0, card, position: pos }],
      spreadType: "single",
      category: "general",
      userQuestion: "Tôi nên làm gì?",
    });

    expect(result.success).toBe(true);
    expect(result.isMock).toBe(true);
    expect(result.data).toBeDefined();

    // Verify mock output strictly satisfies Zod schema
    const validated = AIStructuredOutputSchema.safeParse(result.data);
    expect(validated.success).toBe(true);
  });

  it("should enforce rate limiting after repeated requests", () => {
    const testIp = `test-ip-${Date.now()}`;
    for (let i = 0; i < 10; i++) {
      const check = checkRateLimit(testIp);
      expect(check.allowed).toBe(true);
    }
    // 11th request in the same minute should be rejected
    const blockedCheck = checkRateLimit(testIp);
    expect(blockedCheck.allowed).toBe(false);
    expect(blockedCheck.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("should reject invalid request payload in Zod schema", () => {
    const invalidPayload = {
      readingId: "123",
      category: "invalid_category",
      spreadType: "single",
      selectedCards: [],
    };
    const check = InterpretApiRequestSchema.safeParse(invalidPayload);
    expect(check.success).toBe(false);
  });
});
