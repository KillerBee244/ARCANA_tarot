import { NextRequest, NextResponse } from "next/server";
import { recordReadingComplete, recordVisitorEntry } from "@/lib/storage/visitorStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Web Client";

    if (body.action === "enter") {
      const { sessionId, visitorName } = body;
      if (!sessionId || !visitorName) {
        return NextResponse.json(
          { success: false, error: "Missing sessionId or visitorName" },
          { status: 400 }
        );
      }
      const record = await recordVisitorEntry(sessionId, visitorName, { ip, userAgent });
      return NextResponse.json({ success: true, data: record });
    }

    if (body.action === "complete") {
      const { sessionId, visitorName, question, category, spreadType, cards, aiTitle, aiOverview } = body;
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: "Missing sessionId" },
          { status: 400 }
        );
      }
      await recordReadingComplete(sessionId, {
        visitorName,
        question: question || "",
        category: category || "general",
        spreadType: spreadType || "three_card",
        cards: cards || [],
        aiTitle,
        aiOverview,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Expected 'enter' or 'complete'." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[Visitor Log API Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
