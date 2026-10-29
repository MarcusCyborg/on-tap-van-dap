# Biên Bản Kiểm Thử & Nghiệm Thu (VERIFICATION.md)

Biên bản này tổng hợp chi tiết kết quả chạy kiểm thử tự động, kiểm tra build và kiểm thử hành trình người dùng thực tế trên trình duyệt thực tế (Microsoft Edge) đối với ứng dụng **Ôn Vấn Đáp: Cập nhật DPL302m**.

---

## 1. Kết quả Kiểm Thử Tự Động (Unit & Integration Tests)

Hệ thống test suite sử dụng **Vitest 5.0** kiểm tra toàn bộ parser, 212 concept, 39 bài tập, storage logic, search normalization, sampling phân bổ và 8 mô phỏng toán học:

```bash
npm run test
```

### Kết quả chi tiết:
- `tests/parser.test.ts`: **14/14 tests passed**
  - Kiểm tra đủ 140 câu nền tảng, 72 câu DPL302m, và 212 câu duy nhất toàn hệ thống.
  - Kiểm tra phân bố chính xác 18 A / 12 B / 5 C cho từng chuyên đề nền tảng.
  - Kiểm tra đủ 5 chương DPL302m (57 Cốt lõi, 15 Đọc tiếp) khớp chính xác `manifest.json`:
    - Chương 1: 12 câu (11 cốt lõi, 1 đọc tiếp)
    - Chương 2: 14 câu (11 cốt lõi, 3 đọc tiếp)
    - Chương 3: 10 câu (8 cốt lõi, 2 đọc tiếp)
    - Chương 4: 18 câu (14 cốt lõi, 4 đọc tiếp)
    - Chương 5: 18 câu (13 cốt lõi, 5 đọc tiếp)
  - Kiểm tra đủ 39 bài tự kiểm tra (20 foundations + 19 DPL302m) và 4 đề tổng hợp.
  - Kiểm tra độc lập 4 bài tập dạng danh sách số ở Chương 1, không nuốt vào `DPL1-12`.
  - Kiểm tra 3 bài tập của Chương 3 ("Ba bài tự kiểm tra có lời giải").
  - Kiểm tra nhãn "Mẫu đáp" được phân loại `type: 'answer'` và không bị rò rỉ trong chế độ tự trả lời.
  - Spot-check đầu và cuối mỗi chương DPL (`DPL1-01`, `DPL1-12`, `DPL2-01`, `DPL2-14`, `DPL3-01`, `DPL3-10`, `DPL4-01`, `DPL4-18`, `DPL5-01`, `DPL5-18`).
  - Spot-check các câu trọng điểm: `DPL1-10` (công thức backprop 2 tầng), `DPL2-11` (Adam optimizer), `DPL4-13` (IoU & NMS), `DPL5-15` (Attention QKV).
  - Kiểm tra liên kết không có dead links.
- `tests/lib.test.ts`: **14/14 tests passed**
  - Chuẩn hóa tiếng Việt có dấu/không dấu, chuyển đổi `đ -> d`.
  - Tìm kiếm chính xác các từ khóa: `DPL4-13`, `DL07`, `IoU`, `NMS`, `gradient checking`, `LSTM`, `broadcasting`, `xac suat`.
  - Lưu trữ localStorage và tính toán thống kê tách biệt `foundationsRead` (trên 140) và `dpl302mRead` (trên 72).
  - Xác thực import/export dữ liệu, bảo toàn ghi chú và trạng thái cũ.
  - Lấy mẫu đề thi DPL 5 câu: phân bổ đồng đều đúng 1 câu mỗi chương cho cả 5 chương.
  - Lấy mẫu đề thi DPL 7 câu: 5 câu đầu trải đều 5 chương, các câu sau không trùng lặp.
  - Xử lý an toàn khi pool ít hơn số lượng yêu cầu mà không bị lặp câu.
- `tests/simulations.test.ts`: **10/10 tests passed**
  - 8 mô phỏng toán học & giải thuật (Mean/Median, Bayes, Confusion Matrix, Overfitting, Neuron, Gradient Descent, Binary Search, BFS/DFS).

**Tổng kết Vitest:** **38/38 tests passed (100%)** trong 1.24s.

---

## 2. Kết quả Production Build & Bundle

```bash
npm run build
```

- Lệnh `prebuild` tự động chạy `scripts/import-content.ts` để đồng bộ dữ liệu generated mới nhất.
- Kiểm tra typecheck TypeScript (`tsc`) đạt 100% không có lỗi.
- Vite build đóng gói thành công:
  - `dist/index.html` (0.79 kB)
  - `dist/assets/index-*.css` (32.20 kB)
  - `dist/assets/index-*.js` (1,437.44 kB)
- Không có bất kỳ đường dẫn tuyệt đối nào của máy tính cá nhân bị nhúng vào bundle tại runtime.

---

## 3. Kiểm Thử Trình Duyệt Thực Tế (Microsoft Edge Headless)

Script kiểm thử trình duyệt tự động `scripts/verify-ui.ts` thông qua Playwright điều khiển trình duyệt Microsoft Edge cục bộ trên Windows, mở bản preview sản phẩm tại `http://localhost:4173/`:

| STT | Tên ảnh chụp thực tế | Độ phân giải | Nội dung xác minh | Kết quả |
|:---:|---|:---:|---|:---:|
| 1 | `01-home-desktop.png` | 1440×900 | Trang chủ Desktop: Banner 212 câu, Card ưu tiên DPL302m (72 câu theo 5 chương), tiến độ DPL và Nền tảng tách biệt | ĐẠT |
| 2 | `02-home-mobile.png` | 390×844 | Trang chủ Mobile: bố cục 1 cột, không tràn ngang, các nút to rõ | ĐẠT |
| 3 | `03-home-compact-360.png` | 360×740 | Mobile 360px: kiểm tra không tràn ngang, thanh điều hướng và thẻ bài vừa vặn | ĐẠT |
| 4 | `04-dpl302m-course-overview.png` | 1440×900 | Trang khóa học DPL302m: 5 thẻ chương, tiến độ Cốt lõi / Đọc tiếp, bảng nối 17 bài học | ĐẠT |
| 5 | `05-dpl302m-chapter-1.png` | 1440×900 | Chương 1 DPL302m: Mục lục câu, bộ lọc Cốt lõi/Đọc tiếp, 4 bài tập tự kiểm tra có lời giải | ĐẠT |
| 6 | `06-dpl302m-chapter-4.png` | 1440×900 | Chương 4 DPL302m: CNN, Object Detection, YOLO, IoU/NMS, Face recognition | ĐẠT |
| 7 | `07-reader-dpl4-13.png` | 1440×900 | Reader DPL4-13: IoU và NMS, hiển thị đúng nguồn slide bài 4.3, mẫu đáp, câu hỏi đào sâu | ĐẠT |
| 8 | `08-reader-dpl1-10.png` | 1440×900 | Reader DPL1-10: Công thức backprop 2 tầng và shape ma trận | ĐẠT |
| 9 | `09-reader-dl01-preserved.png` | 1440×900 | Reader DL01: Câu DL nền tảng cũ vẫn hiển thị nguyên vẹn với ID `DL01` | ĐẠT |
| 10 | `10-search-dpl4-13.png` | 1440×900 | Modal tìm kiếm: Gõ "DPL4-13" tìm ra ngay câu hỏi kèm badge `DPL302m • DPL4` và `Cốt lõi` | ĐẠT |
| 11 | `11-search-iou.png` | 1440×900 | Modal tìm kiếm: Gõ "IoU" tìm ra câu hỏi DPL4-13 và các trích đoạn liên quan | ĐẠT |
| 12 | `12-practice-hub.png` | 1440×900 | Practice Hub: Trình tạo lượt 5/7 câu DPL302m, 4 đề thi tổng hợp cũ và luyện nền tảng | ĐẠT |
| 13 | `13-review-page.png` | 1440×900 | Review Page: Danh sách cần ôn với bộ lọc Collection (Toàn bộ / DPL302m / Nền tảng) | ĐẠT |

Tất cả các ảnh chụp màn hình được lưu song song tại:
- Thư mục dự án: `F:\dpl13.10\On-tap-van-dap\web\screenshots/`
- Thư mục artifact: `C:\Users\Admin\.gemini\antigravity\brain\707130bc-c415-4616-8215-9a8bea36aff0\screenshots/`

---

## 4. Kiểm Tra Tính Toàn Vẹn và Trường Hợp Biên

1. **Bảo toàn dữ liệu tiến độ cũ:**
   - Dữ liệu người học lưu trong `localStorage` với key `on_van_dap_user_data_v1` được bảo tồn hoàn toàn. Các trường `schemaVersion`, `conceptProgress`, `examSessions`, `fontSize`, `lastStudiedConceptId` giữ nguyên.
   - Các ID câu hỏi cũ (`XS01–XS35`, `ML01–ML35`, `DL01–DL35`, `GT01–GT35`) giữ nguyên vẹn 100%.
2. **Thứ tự điều hướng Previous / Next trong Reader:**
   - Khi đang đọc câu DPL (ví dụ `DPL1-12`), nút Tiếp theo chuyển sang `DPL2-01` theo đúng trình tự chương DPL, không bị nhảy lung tung sang `DL01` do sắp xếp chuỗi toàn cục.
   - Khi đang đọc câu nền tảng (`DL35`), nút Tiếp theo di chuyển trong tập nền tảng (`GT01`).
3. **Chế độ tự trả lời và ẩn đáp án:**
   - Chế độ tự trả lời ẩn hoàn toàn các block `type: 'answer'` (bao gồm cả nhãn "Mẫu đáp" và "Trả lời miệng").
   - Khi người học bấm chuyển câu, trạng thái mở đáp án tự động reset về ẩn (`isAnswerRevealed = false`), tránh để lộ đáp án của câu tiếp theo.
4. **Trình tạo lượt vấn đáp DPL:**
   - Khi chọn 5 câu với 5 chương được chọn, thuật toán bảo đảm chọn đúng 1 câu từ mỗi chương (`dpl1`, `dpl2`, `dpl3`, `dpl4`, `dpl5`).
   - Danh sách câu hỏi được cố định và lưu vào session ngay khi tạo; việc refresh trang hoặc chuyển bước không làm xáo trộn lại câu hỏi.
