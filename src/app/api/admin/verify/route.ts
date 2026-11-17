import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const providedPin = body?.pin?.trim();
    const serverPin = (process.env.ADMIN_PIN || "arcana2026").trim();

    if (!providedPin) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập mã PIN quản trị." },
        { status: 400 }
      );
    }

    if (providedPin === serverPin) {
      return NextResponse.json({ success: true, message: "Xác thực thành công." });
    }

    return NextResponse.json(
      { success: false, message: "Mã PIN không chính xác. Vui lòng thử lại." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Lỗi máy chủ." },
      { status: 500 }
    );
  }
}
