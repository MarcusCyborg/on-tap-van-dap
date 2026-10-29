# Báo cáo Kiểm kê Nội dung (Content Inventory Report)

Dữ liệu được trích xuất tự động từ các file markdown gốc trong `F:\dpl13.10\On-tap-van-dap\Chuyen-de/` bởi script `scripts/import-content.ts`.

## 1. Nguồn nội dung gốc

| File nguồn | Vai trò | Số câu | Bài tập | Mục đặc biệt |
|---|---|:---:|:---:|---|
| `00-Cach-hoc-va-ban-do-kien-thuc.md` | Dẫn nhập & Bản đồ | 0 | 0 | 8 khái niệm cốt lõi, Lộ trình 4h, Phương pháp trả lời, Mẫu prompt AI |
| `01-Xac-suat-thong-ke.md` | Chuyên đề Xác suất thống kê | 35 | 5 | Bảng công thức tối thiểu, Từ điển thuật ngữ Anh-Việt (14 từ) |
| `02-Machine-Learning.md` | Chuyên đề Machine Learning | 35 | 5 | Bảng lựa chọn thước đo/thuật toán, Từ điển thuật ngữ Anh-Việt (15 từ) |
| `03-Deep-Learning.md` | Chuyên đề Deep Learning | 35 | 5 | Sơ đồ quy trình huấn luyện, Từ điển thuật ngữ Anh-Việt (21 từ) |
| `04-Giai-thuat.md` | Chuyên đề Giải thuật & CTDL | 35 | 5 | 2 code Python mẫu (Binary Search & BFS), Bảng Big-O, Từ điển (22 từ) |
| `05-Bon-de-van-dap-tong-hop.md` | Bốn đề vấn đáp thực chiến | 28 | 0 | 4 đề tổng hợp (mỗi đề 7 câu có gợi ý chi tiết), Phiếu sửa lỗi |

> **Lưu ý về nguồn bản ngắn cũ (16 câu):** Nằm tại thư mục ngoài `On-tap-van-dap/` (`00-Lo-trinh-cap-toc.md`, `01-Xac-suat-thong-ke.md`, v.v.), được giữ nguyên vai trò tài liệu tham khảo nhanh cũ, **hoàn toàn không nhập lẫn vào bộ 140 câu chuẩn**.

## 2. Thống kê Concept và Phân bố mức ưu tiên

Tổng số concept: **140 câu hỏi hoàn chỉnh** (ID ổn định `XS01–XS35`, `ML01–ML35`, `DL01–DL35`, `GT01–GT35`).

| Chuyên đề | Mã | Mức A (Nền tảng) | Mức B (Mở rộng) | Mức C (Nhận diện) | Tổng cộng | Số cụm chủ đề |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Xác suất thống kê | `XS` | 18 | 12 | 5 | **35** | 5 cụm |
| Machine Learning | `ML` | 18 | 12 | 5 | **35** | 5 cụm |
| Deep Learning | `DL` | 18 | 12 | 5 | **35** | 4 cụm |
| Giải thuật & CTDL | `GT` | 18 | 12 | 5 | **35** | 6 cụm |
| **Tổng toàn bộ** | | **72 A** | **48 B** | **20 C** | **140** | **20 cụm** |

## 3. Nội dung ngoài câu hỏi

- **20 bài tự kiểm tra có lời giải:** Mỗi chuyên đề đúng 5 bài/tình huống, ẩn lời giải mặc định cho người học tự suy nghĩ.
- **4 đề thi tổng hợp:** Đề 1, Đề 2, Đề 3, Đề 4; mỗi đề đúng 7 câu (tổng 28 câu hỏi vấn đáp) kèm hướng dẫn gợi ý và rubric tự chấm 0/1/2.
- **Bảng tra cứu & Phụ lục:**
  - Bảng công thức và điều kiện áp dụng (Xác suất).
  - Bảng hướng dẫn chọn thước đo và thuật toán (ML).
  - Sơ đồ quy trình huấn luyện mạng nơ-ron (DL).
  - Bảng độ phức tạp thời gian/bộ nhớ Big-O và 2 đoạn mã nguồn Python hoàn chỉnh (GT).
- **Thuật ngữ Anh - Việt:** 72 cặp thuật ngữ chuyên ngành có giải thích ngắn gọn.
- **8 mô phỏng tương tác:** Kết nối trực tiếp với 22 câu hỏi liên quan trong cả 4 chuyên đề.

## 4. Xử lý ngoại lệ Parser

1. **Heading cấp độ khác nhau giữa các file:** XS/ML/DL dùng `###` cho câu hỏi, trong khi GT dùng `##`. Parser nhận diện theo biểu thức Regex kết hợp ID và nhãn mức `^(?:#{2,3})\s+(XS|ML|DL|GT)\d{2}\s+\[([ABC])\]`.
2. **Không nuốt phần phụ lục sau câu 35:** Tại câu 35 của mỗi chuyên đề, parser dừng thu thập nội dung ngay khi gặp heading chuyển tiếp sang phần bài tập hoặc phụ lục (`## Năm bài tự kiểm tra...`, `## Hai ví dụ Python...`, `## Bảng công thức...`).
3. **Đa dạng tiểu mục trong câu:** Một số câu bắt đầu trực tiếp bằng định nghĩa mà không có tag `**Hiểu:**` (ví dụ `GT35`). Parser giữ trọn vẹn văn bản gốc và tách semantic blocks dựa trên các tiền tố `**Hiểu:**`, `**Ví dụ:**`, `**Trả lời miệng:**`, `**Nối tiếp:**`, `**Bẫy:**`, `**Hỏi tiếp:**` mà không làm mất bất kỳ ký tự nào.
4. **Không chứa đường dẫn tuyệt đối của máy tính cá nhân:** Toàn bộ liên kết và metadata sử dụng đường dẫn tương đối và ID ổn định.
