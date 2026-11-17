import { describe, it, expect } from "vitest";
import {
  recordVisitorEntry,
  recordReadingComplete,
  updateVisitorQuestion,
  updateVisitorAi,
  getVisitorLogs,
  computeAdminStats,
} from "@/lib/storage/visitorStore";
import { interpretReadingRulebase } from "@/lib/tarot/engine";
import { generateMockAiResponse } from "@/lib/ai/fallback";
import { getCardById } from "@/data/tarot/cards";

describe("Visitor Store & Analytics Tests", () => {
  it("records a visitor entrance correctly", async () => {
    const sessionId = `test-sess-${Date.now()}`;
    const record = await recordVisitorEntry(sessionId, "Minh Châu", {
      ip: "192.168.1.1",
      userAgent: "Vitest Test Runner",
    });

    expect(record).toBeDefined();
    expect(record.sessionId).toBe(sessionId);
    expect(record.visitorName).toBe("Minh Châu");
    expect(record.status).toBe("entered");
    expect(record.ip).toBe("192.168.1.1");
  });

  it("records reading completion for existing visitor session", async () => {
    const sessionId = `test-complete-${Date.now()}`;
    await recordVisitorEntry(sessionId, "Hải Đăng");

    await recordReadingComplete(sessionId, {
      visitorName: "Hải Đăng",
      question: "Tương lai công việc sắp tới thế nào?",
      category: "career",
      spreadType: "three_card",
      cards: [
        {
          cardId: "major-00-fool",
          nameVi: "Kẻ Khờ (The Fool)",
          nameEn: "The Fool",
          orientation: "upright",
          positionName: "Quá Khứ",
        },
      ],
      aiTitle: "Hành trình khởi sắc",
      aiOverview: "Thông điệp cho sự nghiệp...",
    });

    const { logs } = await getVisitorLogs();
    const updated = logs.find((l) => l.sessionId === sessionId);
    expect(updated).toBeDefined();
    expect(updated?.status).toBe("completed");
    expect(updated?.question).toBe("Tương lai công việc sắp tới thế nào?");
    expect(updated?.category).toBe("career");
    expect(updated?.cards?.length).toBe(1);
  });

  it("updates visitor question and AI overview independently", async () => {
    const sessionId = `test-update-${Date.now()}`;
    await recordVisitorEntry(sessionId, "Thanh Hằng");

    await updateVisitorQuestion(sessionId, {
      question: "Chuyện tình cảm có tiến triển không?",
      category: "love",
    });

    let { logs } = await getVisitorLogs();
    let target = logs.find((l) => l.sessionId === sessionId);
    expect(target?.question).toBe("Chuyện tình cảm có tiến triển không?");
    expect(target?.category).toBe("love");

    await updateVisitorAi(sessionId, {
      aiTitle: "Tình Duyên Khai Hoa",
      aiOverview: "Trái tim bạn đã sẵn sàng mở lối.",
    });

    logs = (await getVisitorLogs()).logs;
    target = logs.find((l) => l.sessionId === sessionId);
    expect(target?.aiTitle).toBe("Tình Duyên Khai Hoa");
    expect(target?.aiOverview).toBe("Trái tim bạn đã sẵn sàng mở lối.");
  });

  it("correctly computes admin stats", () => {
    const mockLogs = [
      {
        id: "1",
        sessionId: "s1",
        visitorName: "User 1",
        enteredAt: new Date().toISOString(),
        status: "completed" as const,
        category: "love" as const,
        cards: [
          { cardId: "major-19-sun", nameVi: "Mặt Trời (The Sun)", nameEn: "The Sun", orientation: "upright" as const, positionName: "Trọng tâm" },
        ],
      },
      {
        id: "2",
        sessionId: "s2",
        visitorName: "User 2",
        enteredAt: new Date().toISOString(),
        status: "entered" as const,
      },
    ];

    const stats = computeAdminStats(mockLogs);
    expect(stats.totalVisitors).toBe(2);
    expect(stats.completedReadings).toBe(1);
    expect(stats.completionRate).toBe(50);
    expect(stats.categoryCounts.love).toBe(1);
    expect(stats.topCards[0].cardId).toBe("major-19-sun");
  });

  it("personalizes Rulebase interpretation with visitor name", () => {
    const rulebase = interpretReadingRulebase(
      [
        { cardId: "major-00-fool", orientation: "upright", positionId: "focus", selectionOrder: 0 },
      ],
      "single",
      "self",
      "Tôi nên làm gì?",
      "Dien Vu"
    );

    expect(rulebase.overviewSynthesis).toContain("Chào Dien Vu");
  });

  it("personalizes Mock AI response with visitor name", () => {
    const cardData = getCardById("major-00-fool")!;
    const mockAi = generateMockAiResponse(
      [
        {
          cardId: "major-00-fool",
          orientation: "upright",
          positionId: "focus",
          selectionOrder: 0,
          card: cardData,
          position: { id: "focus", nameVi: "Trọng tâm", nameEn: "Focus", descriptionVi: "" },
        },
      ],
      "single",
      "general",
      "Ý nguyện tự do",
      "Dien Vu"
    );

    expect(mockAi.overview).toContain("Chào Dien Vu");
    expect(mockAi.title).toContain("Dien Vu");
  });
});
