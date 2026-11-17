# ARCANA — The Archive of Possibilities
### *Mỗi câu hỏi mở ra một vũ trụ.*

Một ứng dụng web Tarot điện ảnh, huyền bí và giàu cảm xúc, kết hợp giữa tri thức Tarot Rider–Waite–Smith truyền thống và lớp trí tuệ nhân tạo Gemini hiện đại.

---

## 1. TỔNG QUAN DỰ ÁN & BẢN SẮC THIẾT KẾ

ARCANA được thiết kế theo phong cách **Celestial Neo-Archive** — kết hợp giữa sự xa hoa biên tập (editorial luxury), bản đồ học thiên văn (celestial cartography), đường nét hoa văn Art Nouveau và giao diện khoa học viễn tưởng tối giản.

### Bảng màu thiết kế (Design Tokens)
- **Midnight Ink (`#0B1020`)**: Nền tảng sâu thẳm của vũ trụ đêm.
- **Deep Teal (`#172B38`)**: Bề mặt cấu trúc nổi và thẻ bài.
- **Ivory Paper (`#E9DFC9`)**: Màu giấy cổ da cừu cho kiểu chữ chính.
- **Astral Lime (`#C6F68D`)**: Điểm nhấn tương tác rực rỡ và phát sáng thần bí.
- **Antique Copper (`#DAA87B`)**: Đường viền đồng cổ điển, astrolabe và chi tiết hoa văn.

### Kiểu chữ (Typography)
- **Display**: Cormorant Garamond (chữ tiêu đề điện ảnh mang đậm chất cổ điển).
- **Body tiếng Việt**: Be Vietnam Pro (tối ưu hóa độ đọc tiếng Việt, thanh thoát).
- **Technical & Labels**: Space Mono (nhãn tọa độ và thông số thiên văn).

---

## 2. KIẾN TRÚC & HÀNH TRÌNH TƯƠNG TÁC (SCENE FSM)

Trải nghiệm được tổ chức theo máy trạng thái hữu hạn (Finite-State Machine) chặt chẽ, không tải lại trang:

$$\text{PORTAL} \longrightarrow \text{QUESTION} \longrightarrow \text{DECK} \longrightarrow \text{REVEAL} \longrightarrow \text{READING}$$

1. **Scene 01 — The Portal**: Cổng vòm astrolabe chuyển động xoay thiên thể, đường nét viền đồng mảnh mai, tiêu đề editorial và lời dẫn nhập tiếng Việt.
2. **Scene 02 — The Question**: Chọn lĩnh vực (Tình yêu, Sự nghiệp, Tài chính, Bản thân, Câu hỏi tự do), nhập băn khoăn với bộ đếm ký tự, gợi ý câu hỏi truyền cảm hứng và cấu hình kiểu trải bài (3 lá hoặc 1 lá, cho phép lá bài ngược).
3. **Scene 03 — Interactive Tarot Deck**: Bộ bài 78 lá được xòe theo đường cong hình quạt trên desktop phản hồi với chuyển động chuột (hover lift, tản nhẹ các lá lân cận), và carousel vuốt chạm mượt mà trên thiết bị di động.
4. **Scene 04 — Card Reveal**: Nghi thức 3D flip card xoay chuyển trong không gian 3 chiều với hiệu ứng phát sáng huyền ảo, hỗ trợ lật tuần tự hoặc lật nhanh tất cả.
5. **Scene 05 — The Revelation (Dual Reading)**:
   - **Phần I — Diễn giải truyền thống (The Ancient Wisdom)**: Vận hành bởi Rulebase 100% độc lập, không phụ thuộc internet hay API key. Phân tích chi tiết từng lá bài theo vị trí, lĩnh vực, biểu tượng Rider–Waite–Smith, quy luật kết hợp đặc biệt (Major dominance, suit dominance, all-reversed) và lời khuyên cổ thư.
   - **Phần II — Góc nhìn AI (The Living Interpretation)**: Kết nối với Google Gemini để xâu chuỗi thông điệp thành câu chuyện cá nhân hóa giải đáp trực tiếp câu hỏi của người dùng.

---

## 3. CÔNG NGHỆ SỬ DỤNG (TECH STACK)

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript (Strict Mode), Tailwind CSS.
- **Chuyển động (Motion)**: Motion for React (`motion/react`), CSS 3D transforms (`perspective`, `preserve-3d`, `rotateY`, `rotateZ`).
- **Âm thanh**: Bộ tổng hợp âm thanh thiên thể Web Audio API (không tải tệp âm thanh bên ngoài, hoạt động offline).
- **Hệ thống diễn giải Tarot (Rulebase)**: Bộ dữ liệu 78 lá bài đầy đủ với nghĩa xuôi/ngược viết tay bằng tiếng Việt, giải thuật xáo bài Fisher–Yates với `crypto.getRandomValues`.
- **Lớp AI**: SDK chính thức `@google/genai`, mô hình `gemini-2.5-flash` / `gemini-1.5-flash`, xác thực dữ liệu đầu ra với Zod.
- **Lưu trữ**: Trừu tượng hóa `LocalStorage` phiên bản hóa, sẵn sàng mở rộng PostgreSQL trong tương lai.
- **Kiểm thử**: Vitest cho unit test và regression test.

---

## 4. HỆ THỐNG DỰ PHÒNG TIN CẬY (AI FALLBACK SYSTEM)

Ứng dụng tuân thủ nghiêm ngặt nguyên tắc **Rulebase First**:
- **Giai đoạn A**: Tạo diễn giải truyền thống ngay lập tức và hiển thị cho người dùng không cần chờ đợi.
- **Giai đoạn B**: Bất đồng bộ tham vấn Gemini trong nền.
- Nếu không có API Key, mạng lỗi, chạm hạn ngạch (HTTP 429), hoặc quá thời gian chờ (timeout), ứng dụng tự động hiển thị trạng thái dự phòng lịch sự mà không bao giờ làm gián đoạn hay che mất kết quả Tarot truyền thống:
  > *"Phần diễn giải AI hiện chưa khả dụng. Bạn vẫn có thể khám phá đầy đủ thông điệp từ bộ bài Tarot truyền thống."*

---

## 5. HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG CỤC BỘ

### Yêu cầu môi trường
- Node.js >= 18.0.0 (khuyên dùng Node 20+)
- npm hoặc yarn/pnpm

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình biến môi trường
Tạo tệp `.env.local` từ `.env.example`:
```bash
cp .env.example .env.local
```

Nội dung cấu hình mẫu trong `.env.local`:
```env
# Google Gemini API Key (Không bắt buộc - ứng dụng vẫn chạy 100% rulebase nếu để trống)
GEMINI_API_KEY=your_gemini_api_key_here

# Mô hình Gemini tương thích Free-tier
GEMINI_MODEL=gemini-2.5-flash

# Bật/tắt tầng AI (true/false)
GEMINI_ENABLED=true

# Giới hạn thời gian chờ yêu cầu AI (ms)
GEMINI_TIMEOUT_MS=15000

# Chế độ Mock AI phục vụ kiểm thử cục bộ offline (true/false)
MOCK_AI=false
```

### Chạy kiểm thử tự động
```bash
npm test
```

### Khởi động môi trường phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

### Build và chạy môi trường sản xuất (Production)
```bash
npm run build
npm start
```

---

## 6. CẤU TRÚC THƯ MỤC DỰ ÁN

```
src/
├── app/
│   ├── api/readings/interpret/route.ts  # Route Handler cho Gemini & Fallback
│   ├── globals.css                     # Tailwind directives, custom scrollbar & 3D
│   ├── layout.tsx                      # Root Layout, font Google (Cormorant, Be Vietnam Pro, Space Mono)
│   └── page.tsx                        # Master Page điều phối các Scene FSM
├── components/
│   ├── reading/
│   │   ├── AIReading.tsx               # Section II: Góc nhìn Gemini & Fallback UI
│   │   ├── HistoryModal.tsx            # Modal danh sách lịch sử trải bài
│   │   ├── ReadingActions.tsx          # Lưu, sao chép, trải bài mới
│   │   └── RulebaseReading.tsx         # Section I: Diễn giải truyền thống & kết hợp
│   ├── scenes/
│   │   ├── DeckScene.tsx               # Scene 03: Rút bài từ bộ xòe quạt
│   │   ├── PortalScene.tsx             # Scene 01: Cổng thiên văn mở đầu
│   │   ├── QuestionScene.tsx           # Scene 02: Nhập băn khoăn & thể loại
│   │   ├── ReadingScene.tsx            # Scene 05: The Revelation (Dual Reading)
│   │   └── RevealScene.tsx             # Scene 04: Nghi thức khai mở 3D
│   └── tarot/
│       ├── CardDeck.tsx                # Bộ bài xòe quạt desktop & carousel mobile
│       ├── CardReveal.tsx              # Khai mở 3D với hiệu ứng phát sáng
│       ├── CardSpread.tsx              # Bố cục trải bài 1 lá & 3 lá
│       ├── CardVisuals.tsx             # Bộ artwork vector SVG độc bản cho 78 lá
│       └── TarotCard.tsx               # Component thẻ bài 3D tương tác
├── data/tarot/
│   ├── cards.ts                        # Tập hợp 78 lá bài & map tra cứu
│   ├── cups.ts                         # 14 lá Bộ Cốc (Nước & Cảm xúc)
│   ├── majorArcana.ts                  # 22 lá Bộ Ẩn Chính (Chuyển hóa & Định mệnh)
│   ├── pentacles.ts                    # 14 lá Bộ Xu (Đất & Vật chất)
│   ├── spreads.ts                      # Định nghĩa trải bài Đơn và 3 Lá
│   ├── swords.ts                       # 14 lá Bộ Kiếm (Khí & Trí tuệ)
│   └── wands.ts                        # 14 lá Bộ Gậy (Lửa & Đam mê)
├── hooks/
│   └── useTarotExperience.ts           # Master Reducer điều phối chuyển cảnh & trạng thái
├── lib/
│   ├── ai/
│   │   ├── fallback.ts                 # Bộ kiểm soát tốc độ (Rate Limiter) & Mock generator
│   │   ├── geminiClient.ts             # Client gọi SDK @google/genai với timeout
│   │   └── schema.ts                   # Schema xác thực Zod
│   ├── sound/
│   │   └── celestialAudio.ts           # Web Audio API tạo âm hưởng chuông ngân
│   ├── storage/
│   │   └── history.ts                  # Lưu trữ lịch sử LocalStorage
│   └── tarot/
│       ├── combinationRules.ts         # Quy tắc kết hợp các lá bài
│       ├── deck.ts                     # Thuật toán Fisher–Yates crypto.getRandomValues
│       └── engine.ts                   # Engine diễn giải luật nội bộ độc lập
├── tests/
│   ├── aiFallback.test.ts              # Unit test cơ chế dự phòng và rate limit
│   └── rulebook.test.ts                # Unit test 78 lá bài, độ duy nhất, engine
└── types/
    ├── reading.ts                      # Contracts cho phiên đọc và API
    ├── scene.ts                        # Máy trạng thái Scene FSM
    └── tarot.ts                        # Mô hình dữ liệu Tarot & giải bài
```

---

## 7. TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM

Tarot trong ARCANA là một công cụ biểu tượng dành cho sự suy ngẫm nội tâm, đối thoại triết học và khám phá bản thân. ARCANA không đưa ra các tuyên bố dự đoán tương lai mang tính áp đặt hoặc thay thế cho các quyết định y tế, pháp lý và tài chính chuyên nghiệp.
