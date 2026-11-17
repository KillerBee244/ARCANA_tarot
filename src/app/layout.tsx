import type { Metadata } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro, Space_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-cormorant",
  display: "swap",
});

const vietnam = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-vietnam",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARCANA — The Archive of Possibilities | Trải Nghiệm Tarot Điện Ảnh",
  description:
    "Kho Lưu Trữ Khả Năng — Nơi mỗi lá bài là một cánh cửa và mỗi câu hỏi mở ra một vũ trụ. Kết hợp giữa hệ thống luật Tarot cổ điển và trí tuệ nhân tạo Gemini.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${vietnam.variable} ${spaceMono.variable}`}>
      <body className="bg-[#0B1020] text-[#E9DFC9] font-body antialiased min-h-screen overflow-x-hidden selection:bg-[#C6F68D] selection:text-[#0B1020]">
        {children}
      </body>
    </html>
  );
}
