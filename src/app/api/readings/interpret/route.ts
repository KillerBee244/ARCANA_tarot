import { NextRequest, NextResponse } from "next/server";
import { InterpretApiRequestSchema } from "@/lib/ai/schema";
import { getCardById } from "@/data/tarot/cards";
import { getSpreadDef } from "@/data/tarot/spreads";
import { requestGeminiInterpretation } from "@/lib/ai/geminiClient";
import { checkRateLimit } from "@/lib/ai/fallback";
import { PopulatedCard } from "@/types/tarot";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting based on IP or fallback header
    const ip = req.headers.get("x-forwarded-for") || "local_client";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: `Bạn đang gửi yêu cầu quá nhanh. Vui lòng thử lại sau ${rateCheck.retryAfterSeconds} giây.`,
          },
        },
        { status: 429 }
      );
    }

    // 2. Validate Request Body
    const body = await req.json();
    const parseResult = InterpretApiRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: "Dữ liệu yêu cầu không hợp lệ.",
            details: parseResult.error.message,
          },
        },
        { status: 400 }
      );
    }

    const { readingId, question, category, spreadType, selectedCards } = parseResult.data;
    const spreadDef = getSpreadDef(spreadType);

    // 3. Resolve Authoritative Card Data Server-side
    const populatedCards: PopulatedCard[] = [];
    for (const sc of selectedCards) {
      const cardData = getCardById(sc.cardId);
      if (!cardData) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_FAILED",
              message: `Không tìm thấy mã lá bài: ${sc.cardId}`,
            },
          },
          { status: 400 }
        );
      }
      const position =
        spreadDef.positions.find((p) => p.id === sc.positionId) ||
        spreadDef.positions[sc.selectionOrder] || {
          id: sc.positionId,
          nameVi: "Trọng tâm",
          nameEn: "Focus",
          descriptionVi: "Vị trí trọng tâm.",
        };

      populatedCards.push({
        ...sc,
        card: cardData,
        position,
      });
    }

    // 4. Request Gemini Interpretation
    const aiResult = await requestGeminiInterpretation({
      populatedCards,
      spreadType,
      category,
      userQuestion: question,
    });

    if (!aiResult.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: aiResult.errorCode || "UPSTREAM_ERROR",
          message: aiResult.errorMessage || "Không thể khởi tạo diễn giải AI lúc này.",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...aiResult.data,
        generatedAt: new Date().toISOString(),
        isMock: aiResult.isMock,
      },
    });
  } catch (err: any) {
    console.error("[Interpret Route Exception]", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPSTREAM_ERROR",
          message: "Đã xảy ra lỗi nội bộ máy chủ khi xử lý yêu cầu.",
        },
      },
      { status: 500 }
    );
  }
}
