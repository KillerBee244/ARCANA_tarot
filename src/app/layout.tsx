import type { Metadata } from "next";
import { Fraunces, Be_Vietnam_Pro, Space_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-fraunces",
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
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${fraunces.variable} ${vietnam.variable} ${spaceMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#192B38] text-[#F4EADA] font-body antialiased min-h-screen overflow-x-hidden selection:bg-[#C7E9AD] selection:text-[#111E2C]"
      >
        {children}
      </body>
    </html>
  );
}
