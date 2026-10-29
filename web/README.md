# Ôn Vấn Đáp: Ứng Dụng Học Tập & Luyện Vấn Đáp Thực Chiến

Website tiếng Việt hỗ trợ học từ gần như số 0, chuẩn bị vấn đáp 5–7 câu cho môn **Deep Learning (DPL302m)** và bốn mảng **Nền tảng chung** (Xác suất thống kê, Machine Learning, Deep Learning cơ bản, và Giải thuật).

Ứng dụng chạy hoàn toàn phía client (Static Web App), không đòi hỏi backend server, cơ sở dữ liệu ngoài, tài khoản hay API key. Toàn bộ tiến độ và ghi chú được lưu an toàn trong trình duyệt của bạn.

---

## 1. Hai Bộ Nội Dung Học Tập

Website tổ chức nội dung thành 2 collection rõ ràng, độc lập nhưng liên kết chặt chẽ:

1. **Deep Learning: DPL302m (Môn học chính - 72 câu hỏi bám sát 17 slide):**
   - **Chương 1:** Từ logistic regression đến mạng nhiều tầng (12 câu, 4 bài tập)
   - **Chương 2:** Huấn luyện và tối ưu hóa (14 câu, 4 bài tập)
   - **Chương 3:** ML strategy và phân tích lỗi (10 câu, 3 bài tập)
   - **Chương 4:** CNN và thị giác máy tính từ nền tảng (18 câu, 4 bài tập)
   - **Chương 5:** RNN, NLP, Attention và Transformer (18 câu, 4 bài tập)
   - Phân tầng học tập: **57 câu Cốt lõi** và **15 câu Đọc tiếp**, kèm **19 bài tự kiểm tra có lời giải**.
   - Bảng tra cứu trực tiếp từ 17 bài giảng slide (1.1 → 5.4) sang câu hỏi tương ứng.

2. **Nền tảng chung (140 câu - 4 chuyên đề cốt lõi):**
   - **Xác suất thống kê:** 35 câu (18A • 12B • 5C)
   - **Machine Learning:** 35 câu (18A • 12B • 5C)
   - **Deep Learning (Cơ sở):** 35 câu (18A • 12B • 5C, mã `DL01–DL35`)
   - **Giải thuật & Cấu trúc dữ liệu:** 35 câu (18A • 12B • 5C)
   - Kèm 20 bài tự kiểm tra có lời giải và 4 đề tổng hợp thực chiến (mỗi đề 7 câu).

Tổng toàn thư viện: **212 câu hỏi duy nhất**, **39 bài tự kiểm tra có lời giải**, **4 đề thi tổng hợp**, và **8 mô phỏng trực quan tương tác**.

---

## 2. Cài đặt và Khởi chạy

Yêu cầu môi trường: **Node.js 18+** (đã kiểm thử trên Node v22.17.0 và npm 10.9.2).

### Cài đặt dependencies
Mở terminal tại thư mục `F:\dpl13.10\On-tap-van-dap\web`:
```bash
npm install
```

### Chạy môi trường phát triển (Dev)
```bash
npm run dev
```
Trình duyệt sẽ mở tại `http://localhost:5173`. Lệnh này sẽ tự động chạy `predev` để đồng bộ dữ liệu generated từ các file chuyên đề Markdown.

### Đồng bộ & kiểm thực nội dung từ Markdown (Import)
```bash
npm run import
```
Script sẽ đọc toàn bộ Markdown từ `Chuyen-de/` và `DPL302m/`, kiểm tra tính toàn vẹn (đủ 212 câu, đúng tỷ lệ, liên kết hợp lệ) và cập nhật `src/content/generated/`.

### Đóng gói sản phẩm tĩnh (Build)
```bash
npm run build
```
Lệnh sẽ chạy parser kiểm tra toàn vẹn nội dung (`prebuild`), typecheck TypeScript (`tsc`), và đóng gói ra thư mục `dist/`.

### Xem trước bản build sản phẩm (Preview)
```bash
npm run preview
```
Khởi chạy web server tĩnh phục vụ thư mục `dist/` tại `http://localhost:4173`.

### Chạy bộ kiểm thử tự động
```bash
npm run test
```
Chạy toàn bộ 38 bài kiểm tra tự động về Parser, 212 Concept Integrity, 39 Exercises, Lưu trữ, Tìm kiếm từ khóa mới (`DPL4-13`, `IoU`, `NMS`, `gradient checking`, `LSTM`), và 8 Mô phỏng toán học.

### Chạy kiểm thử trình duyệt thực tế & chụp ảnh màn hình
```bash
npx tsx scripts/verify-ui.ts
```
Tự động khởi động Microsoft Edge headless, duyệt qua 13 kịch bản trên Desktop (1440px), Mobile (390px) và Compact Mobile (360px), chụp ảnh màn hình và lưu vào thư mục `screenshots/` và artifact.

---

## 3. Cấu trúc Dự án

```text
web/
  scripts/
    import-content.ts     # Script AST parser trích xuất dữ liệu từ Chuyen-de/*.md và DPL302m/*.md
    verify-ui.ts          # Script Playwright kiểm thử giao diện thực tế & chụp 13 ảnh màn hình
  src/
    app/                  # App.tsx cấu hình HashRouter và Layout chính
    components/
      layout/             # Header, Sidebar (ưu tiên DPL302m), Footer
    content/
      types.ts            # Schema TypeScript cho Concept, DplChapter, Subject, Exam, UserProgress
      metadata.ts         # Metadata liên kết mô phỏng, concept liên quan, mã màu
      generated/          # Dữ liệu JSON tự động sinh ra từ nguồn (concepts.json, dpl-chapters.json, ...)
    features/
      home/               # Trang chủ Dashboard, tiếp tục học câu dở, tiến độ tách biệt
      dpl/                # Khóa học DPL302m (DplCourseView, DplChapterView, 17 bài học, 19 bài tập)
      guide/              # Chuyên đề 00: Bản đồ kiến thức, lộ trình 4h, mẫu prompt
      subjects/           # Mục lục 4 chuyên đề nền tảng, lọc theo mức A/B/C và cần ôn
      reader/             # Concept Reader: Đọc hiểu vs Tự trả lời (ẩn Mẫu đáp), ghi chú, bookmark
      search/             # Modal tìm kiếm tiếng Việt không dấu (Ctrl+K), tra cứu ID cũ & DPL mới
      practice/           # 4 đề thi tổng hợp & Trình tạo lượt 5/7 câu DPL (trải đều 5 chương) / Nền tảng
      review/             # Danh sách ưu tiên các câu cần ôn lại với bộ lọc theo Collection
      reference/          # Bảng công thức, sơ đồ, 20 bài tự kiểm tra nền tảng, code Python, glossary
      settings/           # Tùy chỉnh cỡ chữ, sao lưu & khôi phục dữ liệu
      simulations/        # 8 Mô phỏng tương tác toán học & giải thuật
    lib/
      storage.ts          # Xử lý localStorage, export/import JSON, tính toán thống kê động theo collection
      search.ts           # Chuẩn hóa tiếng Việt, tách dấu đ -> d, thuật toán tính điểm tìm kiếm
      sampling.ts         # Thuật toán lấy mẫu đề thi 5/7 câu (phân bổ đều 5 chương DPL hoặc 4 mảng)
    styles/
      index.css           # Tokens CSS variables, typography, font size switches
  tests/
    parser.test.ts        # Test kiểm tra tính toàn vẹn 212 câu, 39 bài tập, 4 đề, spot-checks DPL
    lib.test.ts           # Test tìm kiếm tiếng Việt, keyword DPL, storage 2 bộ, sampling phân bổ 5 chương
    simulations.test.ts   # Test logic toán học và trường hợp biên của 8 mô phỏng
  screenshots/            # 13 ảnh chụp màn hình kiểm thử thực tế
  CONTENT-REPORT.md       # Báo cáo kiểm kê chi tiết nội dung nguồn (140 / 72 / 212)
  DESIGN.md               # Đặc tả Design System, tokens, typography và components
  VERIFICATION.md         # Biên bản nghiệm thu kiểm thử trình duyệt và trường hợp biên
```

---

## 4. Quản lý Tiến độ Học & Sao lưu Dữ liệu

- **Bảo toàn dữ liệu cũ:** Ứng dụng giữ nguyên storage key `on_van_dap_user_data_v1`. Toàn bộ dữ liệu ID cũ (`XS01–XS35`, `ML01–ML35`, `DL01–DL35`, `GT01–GT35`), ghi chú, bookmark, mức hiểu và lượt thi cũ vẫn hoạt động 100% nguyên vẹn.
- **Dữ liệu DPL mới:** Các ID `DPL1-01` đến `DPL5-18` được nạp vào dưới trạng thái chưa đọc / chưa đánh giá, không tự điền tiến độ giả.
- **Tiếp tục học dở:** Nếu người học đang đọc dở một câu (dù là câu cũ như `ML15` hay câu DPL mới như `DPL4-13`), nút **Tiếp tục học** trên trang chủ sẽ trỏ chính xác vào câu đó.
- **Xuất/Nhập sao lưu tương thích ngược:**
  - File sao lưu cũ từ bản 140 câu vẫn nhập được mượt mà trên bản cập nhật này.
  - Các ID lạ không nhận diện được vẫn được bảo lưu nguyên vẹn trong bản sao lưu để phục hồi, không bị xóa âm thầm và không làm sai lệch mẫu số thống kê.
