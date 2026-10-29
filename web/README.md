# Ôn Vấn Đáp — Ứng Dụng Học Tập & Luyện Vấn Đáp Thực Chiến

Website tiếng Việt hỗ trợ học từ gần như số 0, chuẩn bị vấn đáp 5–7 câu cho bốn chuyên đề: **Xác suất thống kê**, **Machine Learning**, **Deep Learning**, và **Giải thuật & Cấu trúc dữ liệu**.

Ứng dụng chạy hoàn toàn phía client (Static Web App), không đòi hỏi backend server, cơ sở dữ liệu ngoài, tài khoản hay API key. Toàn bộ tiến độ và ghi chú được lưu an toàn trong trình duyệt của bạn.

---

## 1. Cài đặt và Khởi chạy

Yêu cầu môi trường: **Node.js 18+** (đã kiểm thử hoàn hảo trên Node v22.17.0 và npm 10.9.2).

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

### Đóng gói sản phẩm tĩnh (Build)
```bash
npm run build
```
Lệnh sẽ chạy parser kiểm tra toàn vẹn nội dung (`npm run import`), typecheck TypeScript (`tsc`), và đóng gói ra thư mục `dist/`.

### Xem trước bản build sản phẩm (Preview)
```bash
npm run preview
```
Khởi chạy web server tĩnh phục vụ thư mục `dist/` tại `http://localhost:4173`.

### Chạy bộ kiểm thử tự động
```bash
npm run test
```
Chạy toàn bộ 28 bài kiểm tra tự động về Parser, Lưu trữ, Tìm kiếm và 8 Mô phỏng toán học.

### Chạy kiểm thử trình duyệt thực tế & chụp ảnh màn hình
```bash
npx tsx scripts/verify-ui.ts
```

---

## 2. Cấu trúc Dự án

```text
web/
  scripts/
    import-content.ts     # Script AST parser trích xuất dữ liệu từ Chuyen-de/*.md
    verify-ui.ts          # Script Playwright kiểm thử giao diện & chụp màn hình
  src/
    app/                  # App.tsx cấu hình HashRouter và Layout chính
    components/
      layout/             # Header, Sidebar, Footer
    content/
      types.ts            # Schema TypeScript cho Concept, Subject, Exam, UserProgress
      metadata.ts         # Metadata liên kết mô phỏng, concept liên quan, mã màu
      generated/          # Dữ liệu JSON tự động sinh ra từ nguồn (concepts.json, subjects.json, ...)
    features/
      home/               # Trang chủ Dashboard, tiếp tục học, tiến độ thật
      guide/              # Chuyên đề 00: Bản đồ kiến thức, lộ trình 4h, mẫu prompt
      subjects/           # Mục lục chuyên đề, lọc theo mức A/B/C và cần ôn
      reader/             # Concept Reader: Đọc hiểu vs Tự trả lời, tự đánh giá, ghi chú
      search/             # Modal tìm kiếm tiếng Việt không dấu (Ctrl+K)
      practice/           # 4 đề thi tổng hợp & Trình tạo lượt 5/7 câu ngẫu nhiên
      review/             # Danh sách ưu tiên các câu cần ôn lại
      reference/          # Bảng công thức, sơ đồ, 20 bài tự kiểm tra, code Python, glossary
      settings/           # Tùy chỉnh cỡ chữ (17px/19px/21px), sao lưu & khôi phục dữ liệu
      simulations/        # 8 Mô phỏng tương tác toán học & giải thuật
    lib/
      storage.ts          # Xử lý localStorage, export/import JSON, tính toán thống kê
      search.ts           # Chuẩn hóa tiếng Việt, tách dấu đ -> d, thuật toán tính điểm tìm kiếm
      sampling.ts         # Thuật toán lấy mẫu đề thi 5/7 câu cân đối 4 mảng
    styles/
      index.css           # Tokens CSS variables, typography, font size switches
  tests/
    parser.test.ts        # Test kiểm tra tính toàn vẹn 140 câu, 20 bài tập, 4 đề
    lib.test.ts           # Test tìm kiếm tiếng Việt, storage, export/import
    simulations.test.ts   # Test logic toán học và trường hợp biên của 8 mô phỏng
  screenshots/            # 11 ảnh chụp màn hình kiểm thử thực tế
  CONTENT-REPORT.md       # Báo cáo kiểm kê chi tiết nội dung nguồn
  DESIGN.md               # Đặc tả Design System, tokens, typography và components
  VERIFICATION.md         # Biên bản nghiệm thu kiểm thử trình duyệt và trường hợp biên
```

---

## 3. Quy trình Cập nhật Nội dung Nguồn

Nếu bạn chỉnh sửa hoặc bổ sung nội dung trong các file Markdown tại `F:\dpl13.10\On-tap-van-dap\Chuyen-de/`, chỉ cần chạy lại lệnh:
```bash
npm run import
```
Script sẽ đọc lại toàn bộ tài liệu nguồn, kiểm tra tính toàn vẹn (đủ 140 câu, đúng tỷ lệ 18A / 12B / 5C, các liên kết không bị gãy), và cập nhật các file JSON trong `src/content/generated/`. Lệnh build sẽ tự động dừng nếu dữ liệu nguồn vi phạm cấu trúc chuẩn.

---

## 4. Quản lý Tiến độ Học & Sao lưu Dữ liệu

- **Lưu trữ cục bộ:** Mọi thao tác đánh dấu đã đọc, tự đánh giá ("Chưa hiểu" / "Hiểu một phần" / "Tự giải thích được"), bookmark, ghi chú cá nhân và điểm số thi thử được lưu trong `localStorage` dưới khóa `on_van_dap_user_data_v1`.
- **Xuất sao lưu (Export):** Vào mục **Cài đặt** (`#/settings`), bấm **Tải file sao lưu (.json)** để lưu một bản sao tiến độ về máy tính.
- **Khôi phục (Import):** Chọn file JSON sao lưu. Ứng dụng sẽ hiển thị bảng xem trước (preview) số lượng concept hợp lệ, số ghi chú, số bookmark và cho phép bạn chọn **Hợp nhất (Merge)** hoặc **Ghi đè (Overwrite)**.
- **Đặt lại (Reset):** Cung cấp nút xóa sạch tiến độ có hộp thoại xác nhận 2 bước an toàn.

---

## 5. Tám Mô Phỏng Tương Tác Cốt Lõi

1. **Mean, Median và Ngoại lệ (XS05, XS06):** Thay đổi giá trị điểm ngoại lệ từ 4 đến 100 trên trục số để chứng minh Median có tính bền vững (robust) còn Mean bị kéo lệch mạnh.
2. **Bayes và Tỷ lệ nền (XS11, XS12, XS13):** Khám phá nghịch lý tỷ lệ nền khi xét nghiệm có độ nhạy 90% nhưng xác suất mắc bệnh khi dương tính chỉ đạt ~8.33%.
3. **Confusion Matrix và Ngưỡng phân loại (ML29, ML30, ML31):** Điều chỉnh ngưỡng phân loại (threshold) trên 24 mẫu dữ liệu thực tế để quan sát sự đánh đổi giữa Precision và Recall.
4. **Độ phức tạp & Overfitting (ML16, ML17, ML18):** Thử nghiệm bậc đa thức từ 1 đến 7 để so sánh MSE trên tập Train và tập Validation (nhận biết Underfitting và Overfitting).
5. **Một Nơ-ron Nhân tạo Tính gì (DL03, DL05, DL06):** Điều chỉnh đầu vào, trọng số, bias và hàm kích hoạt (ReLU, Sigmoid, Linear) để hiểu rõ sự khác biệt giữa tổ hợp affine `z` và đầu ra kích hoạt `a`.
6. **Gradient Descent (DL09, DL10, DL11, DL13):** Tối ưu hóa hàm mất mát $L(w) = (w - 3)^2$ với các mức Learning Rate (hội tụ mượt mà, học chậm, dao động nhảy cóc, và dừng an toàn khi phân kỳ).
7. **Binary Search Từng bước (GT02, GT12, GT13):** Quan sát trực quan quá trình chia đôi không gian tìm kiếm, các chỉ số left, right, mid và tự động phát hiện mảng chưa sắp xếp.
8. **Duyệt Đồ thị BFS và DFS (GT08, GT09, GT24, GT26, GT27):** So sánh Hàng đợi (Queue) tìm đường ngắn nhất theo số cạnh của BFS với Ngăn xếp (Stack) đi sâu của DFS trên đồ thị có chu trình và đỉnh cô lập.

---

## 6. Phạm vi và Giới hạn Hiện tại

- **Luyện nói:** Được thiết kế để người học tự trả lời thành tiếng rồi bấm mở đáp án đối chiếu và tự chấm 0/1/2 điểm theo rubric. Phiên bản này **không sử dụng microphone, không ghi âm hay chấm bài bằng AI giả mạo**.
- **Không có backend server:** Dữ liệu hoàn toàn nằm trong trình duyệt cá nhân; nếu bạn xóa bộ nhớ trình duyệt hoặc dùng chế độ ẩn danh (Incognito), dữ liệu sẽ mất trừ khi bạn đã tải file sao lưu `.json`.
