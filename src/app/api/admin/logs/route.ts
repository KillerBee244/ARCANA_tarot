import { NextRequest, NextResponse } from "next/server";
import { computeAdminStats, getVisitorLogs } from "@/lib/storage/visitorStore";

export async function GET(req: NextRequest) {
  try {
    const headerPin = req.headers.get("x-admin-pin")?.trim();
    const queryPin = req.nextUrl.searchParams.get("pin")?.trim();
    const providedPin = headerPin || queryPin;
    const serverPin = (process.env.ADMIN_PIN || "arcana2026").trim();

    if (!providedPin || providedPin !== serverPin) {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập. Mã PIN không hợp lệ." },
        { status: 401 }
      );
    }

    const { logs, storageMode } = await getVisitorLogs();
    const stats = computeAdminStats(logs);

    return NextResponse.json({
      success: true,
      stats,
      logs,
      storageMode,
    });
  } catch (err: any) {
    console.error("[Admin Logs API Error]", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Lỗi máy chủ khi lấy nhật ký." },
      { status: 500 }
    );
  }
}
