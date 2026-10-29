# Báo cáo Kiểm kê Nội dung (Content Inventory Report)

Dữ liệu được trích xuất tự động và kiểm thực toàn vẹn bởi script `scripts/import-content.ts` từ hai bộ nguồn chính:
- **Bộ Nền tảng chung (Foundations):** `F:\dpl13.10\On-tap-van-dap\Chuyen-de/`
- **Bộ Môn học Deep Learning (DPL302m):** `F:\dpl13.10\On-tap-van-dap\DPL302m/` (bám sát 17 slide bài giảng và manifest)

---

## 1. Tổng quan Toàn Thư viện

- **Tổng số mục hỏi / câu hỏi hoàn chỉnh:** **212 câu hỏi** duy nhất, không trùng lặp ID.
  - **Bộ Nền tảng chung:** **140 câu** (ID: `XS01–XS35`, `ML01–ML35`, `DL01–DL35`, `GT01–GT35`).
  - **Bộ Môn học DPL302m:** **72 câu** (ID: `DPL1-01–DPL1-12`, `DPL2-01–DPL2-14`, `DPL3-01–DPL3-10`, `DPL4-01–DPL4-18`, `DPL5-01–DPL5-18`).
- **Tổng số bài tự kiểm tra có lời giải:** **39 bài**
  - **Nền tảng chung:** **20 bài** (mỗi chuyên đề 5 bài).
  - **DPL302m:** **19 bài** (Chương 1: 4 bài dạng danh sách có thứ tự; Chương 2: 4 bài; Chương 3: 3 bài; Chương 4: 4 bài; Chương 5: 4 bài).
- **Bốn đề vấn đáp tổng hợp có sẵn:** 4 đề thực chiến, mỗi đề 7 câu (tổng 28 câu hỏi đối chiếu kèm gợi ý và rubric 0/1/2).
- **Tám mô phỏng trực quan tương tác:** 8 công cụ trực quan kết nối với các câu hỏi liên quan ở cả hai bộ.
- **Thuật ngữ Anh - Việt & Từ khóa tra cứu:** 114 mục (72 thuật ngữ nền tảng + 42 từ khóa DPL302m).

> **Ghi chú về tính độc lập:** 212 mục hỏi là tổng số mục học tập trên website, không phải 212 khái niệm toán học hoàn toàn độc lập. Giữa 35 câu DL nền tảng và 72 câu DPL302m có phần kiến thức giao thoa/ôn lại có chủ đích để củng cố cho người học từ số 0.

---

## 2. Thống kê Chi tiết Bộ Nền tảng chung (Foundations — 140 Câu)

Phân bổ chính xác theo 3 mức ưu tiên học: **72 A (Nền tảng)**, **48 B (Mở rộng)**, **20 C (Nhận diện)**.

| Chuyên đề | Tiền tố ID | File nguồn | Mức A | Mức B | Mức C | Tổng | Bài tự kiểm tra | Thuật ngữ |
|---|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Xác suất thống kê | `XS` | `01-Xac-suat-thong-ke.md` | 18 | 12 | 5 | **35** | 5 bài | 14 từ |
| Machine Learning | `ML` | `02-Machine-Learning.md` | 18 | 12 | 5 | **35** | 5 bài | 15 từ |
| Deep Learning | `DL` | `03-Deep-Learning.md` | 18 | 12 | 5 | **35** | 5 bài | 21 từ |
| Giải thuật & CTDL | `GT` | `04-Giai-thuat.md` | 18 | 12 | 5 | **35** | 5 bài | 22 từ |
| **Tổng Foundations** | | | **72 A** | **48 B** | **20 C** | **140** | **20 bài** | **72 từ** |

---

## 3. Thống kê Chi tiết Bộ Môn học DPL302m (72 Câu)

Phân bổ chính xác theo 2 mức học sư phạm: **57 Cốt lõi** và **15 Đọc tiếp**, bám sát theo 17 bài học slide trong `manifest.json`.

| Chương | Tiền tố | File nguồn | Bài nguồn | Cốt lõi | Đọc tiếp | Tổng câu | Bài tự kiểm tra | Trọng tâm nội dung |
|---|:---:|---|:---:|:---:|:---:|:---:|:---:|---|
| **Chương 1** | `DPL1-` | `01-Neural-network-foundations.md` | 1.1–1.4 | 11 | 1 | **12** | 4 bài | Logistic/BCE, computation graph, vectorization, broadcasting, shape, backprop 2 tầng |
| **Chương 2** | `DPL2-` | `02-Huan-luyen-va-toi-uu.md` | 2.1–2.3 | 11 | 3 | **14** | 4 bài | Bias/variance, L2/dropout, He/Xavier, gradient checking, Momentum/RMSprop/Adam, BN |
| **Chương 3** | `DPL3-` | `03-ML-strategy-va-error-analysis.md` | 3.1–3.2 | 8 | 2 | **10** | 3 bài | Metric tối ưu/ràng buộc, HLP, avoidable bias, training-dev, phân tích lỗi, transfer/multitask |
| **Chương 4** | `DPL4-` | `04-CNN-va-thi-giac-may-tinh.md` | 4.1–4.4 | 14 | 4 | **18** | 4 bài | Phép conv/shape, pooling, ResNet/Inception, YOLO, IoU, NMS, U-Net, Siamese, Triplet |
| **Chương 5** | `DPL5-` | `05-RNN-NLP-va-Transformer.md` | 5.1–5.4 | 13 | 5 | **18** | 4 bài | RNN/BPTT, LSTM/GRU, Word2Vec, Seq2Seq, Attention, QKV, Transformer, BERT/GPT |
| **Tổng DPL302m** | | | **17 bài** | **57** | **15** | **72** | **19 bài** | |

---

## 4. Xử lý Cấu trúc Dữ liệu và Ngoại lệ Parser

1. **Nhận diện Nhãn Mẫu đáp / Trả lời miệng:**
   - Bộ cũ sử dụng tag `**Trả lời miệng:**` hoặc `**Trả lời:**`.
   - Bộ DPL302m sử dụng tag `**Mẫu đáp:**` hoặc `**Trả lời miệng:**`.
   - Parser nhận diện cả hai dạng và phân loại chính xác thành block `type: 'answer'`. Khi người học bật "Chế độ tự trả lời", toàn bộ block này được ẩn hoàn toàn để tránh lộ đáp án.
2. **Bảo toàn Heading và Không nuốt Phụ lục:**
   - DPL Chapter 1 có 4 bài tập được viết dưới dạng danh sách số (`1. **Shape và tham số:** ...`). Parser xử lý độc lập, không nuốt vào nội dung của câu `DPL1-12`.
   - DPL Chapter 3 có tiêu đề `## Ba bài tự kiểm tra có lời giải`. Parser sử dụng regex linh hoạt nhận diện đúng số lượng 3 bài.
3. **Trích xuất Nguồn tham chiếu Slide gọn nhẹ:**
   - Thay vì lưu đường dẫn ổ đĩa tuyệt đối (`F:\...`), parser trích xuất tên file bài học và slide marker (ví dụ `1.2 Basic Neural Network.txt`, `slide 4–10`) thành `SourceReference[]` hiển thị tinh tế trên giao diện.
4. **Kiểm tra Tính ổn định (Idempotence):**
   - Chạy `npm run import` lặp lại nhiều lần cho kết quả byte-for-byte hoàn toàn ổn định, không sinh ID mới, không nhân đôi hay append trùng lặp dữ liệu.
