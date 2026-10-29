# Biên Bản Kiểm Thử & Nghiệm Thu (VERIFICATION.md)

Biên bản này tổng hợp chi tiết kết quả chạy kiểm thử tự động, kiểm tra build và kiểm thử hành trình người dùng thực tế trên trình duyệt thực tế (Microsoft Edge) đối với ứng dụng **Ôn Vấn Đáp**.

## 1. Kết quả Kiểm Thử Tự Động (Unit & Integration Tests)

Hệ thống test suite sử dụng **Vitest 5.0** kiểm tra toàn bộ parser, storage logic, search normalization, sampling và 8 mô phỏng toán học:

```bash
npm run test
```

**Kết quả:**
- `tests/parser.test.ts`: 8/8 tests passed
  - Kiểm tra đủ 140 concept không trùng lặp ID.
  - Kiểm tra phân bố chính xác 18 A / 12 B / 5 C cho từng chuyên đề.
  - Kiểm tra không nuốt phụ lục vào GT35, XS35, ML35, DL35.
  - Kiểm tra tính hợp lệ của toàn bộ liên kết (relatedIds, prerequisiteIds, simulationIds).
- `tests/lib.test.ts`: 10/10 tests passed
  - Chuẩn hóa tiếng Việt có dấu/không dấu, chuyển đổi `đ -> d`.
  - Tìm kiếm chính xác ID ưu tiên cao nhất, tìm kiếm nội dung, tìm kiếm glossary.
  - Lưu trữ localStorage, đánh dấu đã đọc độc lập với mức hiểu.
  - Xác thực file JSON sao lưu, hợp nhất dữ liệu an toàn không xóa ghi chú cũ.
  - Lấy mẫu đề thi 5/7 câu đảm bảo phân bổ đủ 4 mảng khi điều kiện lọc cho phép.
- `tests/simulations.test.ts`: 10/10 tests passed
  - Mô phỏng 1 (XS05): preset [1, 2, 3, 4, 10] -> Mean = 4, Median = 3, Var tổng thể = 10, Var mẫu = 12.5.
  - Mô phỏng 2 (XS11): preset p=1%, Sens=90%, FPR=10% -> Posterior ≈ 8.33%; xử lý mẫu số 0 an toàn.
  - Mô phỏng 3 (ML29): tính toán động Confusion Matrix, Precision, Recall, F1 không hardcode.
  - Mô phỏng 4 (ML16): khớp đa thức Ridge regression ổn định số học, không phát sinh NaN/Infinities.
  - Mô phỏng 5 (DL03): preset x1=2, x2=1, w1=3, w2=-1, b=0 -> z=5, ReLU=5, Sigmoid≈0.9933; trường hợp z < 0.
  - Mô phỏng 6 (DL09): preset w=1, lr=0.1 -> w mới = 1.4; kiểm tra dao động lr=1 và dừng an toàn khi phân kỳ.
  - Mô phỏng 7 (GT12): preset [1, 3, 5, 7, 9], target=8 -> chuỗi mid 2 -> 3 -> 4 rồi kết thúc không tìm thấy.
  - Mô phỏng 8 (GT26): kiểm tra BFS tìm đường ngắn nhất theo cạnh và DFS không lặp vô tận trên đồ thị có chu trình.

**Tổng kết Vitest:** **28/28 tests passed (100%)** trong 886ms.

## 2. Kết quả Production Build & Bundle

```bash
npm run build
```

- Lệnh `prebuild` tự động chạy `scripts/import-content.ts` để đồng bộ dữ liệu generated mới nhất.
- Kiểm tra typecheck TypeScript (`tsc`) đạt 100% không có lỗi.
- Vite build đóng gói thành công:
  - `dist/index.html` (0.79 kB)
  - `dist/assets/index-*.css` (28.24 kB)
  - `dist/assets/index-*.js` (1,053.57 kB)
- Không có bất kỳ đường dẫn tuyệt đối nào của máy tính cá nhân bị nhúng vào bundle.

## 3. Kiểm Thử Trình Duyệt Thực Tế (Microsoft Edge Headless)

Script kiểm thử trình duyệt tự động `scripts/verify-ui.ts` thông qua Playwright điều khiển trình duyệt Microsoft Edge cục bộ trên môi trường Windows, mở bản preview sản phẩm tại `http://localhost:4173/`:

| STT | Tên ảnh chụp thực tế | Độ phân giải | Nội dung xác minh | Kết quả |
|:---:|---|:---:|---|:---:|
| 1 | `01-home-desktop.png` | 1440×900 | Trang chủ Desktop: Banner bắt đầu, tiến độ thật, 4 mảng, 8 mô phỏng | ĐẠT |
| 2 | `02-home-mobile.png` | 390×844 | Trang chủ Mobile: bố cục 1 cột, không tràn ngang, nút bấm to rõ | ĐẠT |
| 3 | `03-subject-ml-toc.png` | 1440×900 | Mục lục Machine Learning: Nhóm bài, nhãn mức A/B/C, bộ lọc | ĐẠT |
| 4 | `04-reader-xs05-sim-mean-median.png` | 1440×900 | Reader XS05: Chế độ đọc, mô phỏng Outlier slider = 50, Mean vọt lên | ĐẠT |
| 5 | `05-reader-ml29-confusion-matrix.png` | 1440×900 | Reader ML29: Mô phỏng Confusion Matrix, tính động Precision/Recall | ĐẠT |
| 6 | `06-reader-dl09-gradient-descent.png` | 1440×900 | Reader DL09: Bấm nút "Một bước", w cập nhật từ 1.0 lên 1.4 | ĐẠT |
| 7 | `07-reader-gt12-binary-search.png` | 1440×900 | Reader GT12: Bấm nút "Bước tiếp", mid dịch chuyển và loại bỏ nửa mảng | ĐẠT |
| 8 | `08-search-modal.png` | 1440×900 | Modal tìm kiếm: Gõ "do lech chuan" ra đúng XS06 kèm trích đoạn | ĐẠT |
| 9 | `09-practice-session-q1.png` | 1440×900 | Lượt thi thử Đề 1: Đồng hồ bấm giờ, câu hỏi, vùng nháp trả lời miệng | ĐẠT |
| 10 | `10-practice-session-scored.png` | 1440×900 | Đối chiếu đáp án và tự chấm điểm 2 theo rubric | ĐẠT |
| 11 | `11-mobile-drawer.png` | 390×844 | Drawer điều hướng trên mobile: mở mượt mà, đầy đủ 4 mảng | ĐẠT |

Tất cả các ảnh chụp màn hình được lưu song song tại:
- Thư mục dự án: `F:\dpl13.10\On-tap-van-dap\web\screenshots/`
- Thư mục artifact: `C:\Users\Admin\.gemini\antigravity\brain\318f27a3-27e4-4b66-9765-16806254986a\screenshots/`

## 4. Kiểm Tra Các Trường Hợp Biên (Edge Cases)

1. **Xác suất mẫu số bằng 0 (Bayes):** Khi đặt tỷ lệ mắc = 0 và FPR = 0, ứng dụng hiển thị `—` và ghi rõ "Không xác định vì mẫu số bằng 0", không gây crash hay chia cho 0.
2. **Gradient Descent phân kỳ:** Khi đặt `lr = 1.05`, sau vài bước cập nhật trị số `|w| > 50`, hệ thống tự động dừng chạy an toàn và hiển thị cảnh báo giải thích phân kỳ cho người học.
3. **Mảng chưa sắp xếp trong Binary Search:** Nếu người dùng nhập mảng chưa có thứ tự (ví dụ `5, 2, 8`), hệ thống lập tức hiển thị cảnh báo đỏ và cung cấp nút "Sắp xếp mảng ngay".
4. **Đồ thị có đỉnh cô lập trong BFS/DFS:** Đỉnh G không có cạnh nối được hiển thị rõ trạng thái cô lập, khi chọn duyệt từ G thuật toán dừng ngay sau 1 bước và nêu rõ đồ thị chỉ duyệt được một phần.
5. **Dữ liệu JSON hỏng khi nhập:** Khi tải lên file text không phải JSON hoặc thiếu schema, chức năng Nhập sao lưu hiển thị thông báo lỗi cụ thể, hoàn toàn không làm mất dữ liệu hiện có trong trình duyệt.
6. **Không làm tràn ngang ở màn hình 360px:** Toàn bộ công thức, bảng Markdown và khối mã Python có vùng cuộn ngang riêng biệt (`overflow-x-auto`), trang web không bị layout shift hay vỡ chiều ngang.
