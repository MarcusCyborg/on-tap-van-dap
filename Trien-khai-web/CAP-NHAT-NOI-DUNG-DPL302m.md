# Gói cập nhật nội dung DPL302m cho website đã hoàn thiện

Đây là bổ sung cho `PROMPT-ANTIGRAVITY.md`, dùng sau khi website ban đầu chạy được. Nhiệm vụ là nhập thêm nội dung môn Deep Learning theo nguồn học thực tế, tận dụng giao diện và dữ liệu tiến độ đang có.

## 1. Nguồn mới

Đọc trước:

```text
F:\dpl13.10\On-tap-van-dap\DPL302m\README.md
F:\dpl13.10\On-tap-van-dap\DPL302m\manifest.json
```

Nhập năm file Markdown được manifest liệt kê. Bộ mới có **72 câu bổ sung**, theo 5 chương:

| Chương | ID | Số câu | Bài học nguồn |
|---|---|---:|---|
| Nền tảng neural network | DPL1-01–DPL1-12 | 12 | 1.1–1.4 |
| Huấn luyện và tối ưu | DPL2-01–DPL2-14 | 14 | 2.1–2.3 |
| ML strategy/error analysis | DPL3-01–DPL3-10 | 10 | 3.1–3.2 |
| CNN/thị giác máy tính | DPL4-01–DPL4-18 | 18 | 4.1–4.4 |
| RNN/NLP/Transformer | DPL5-01–DPL5-18 | 18 | 5.1–5.4 |

Giữ nguyên 140 câu nền tảng cũ. Tổng số ID khi hiển thị cả hai bộ là 212; đây là số mục học, không phải 212 concept hoàn toàn độc lập. Có phần chồng lấn phục vụ ôn tập.

## 2. Điều chỉnh importer và schema

- Mã mới có dạng `DPL1-01`, khác dạng `DL01`. Đừng dùng regex cũ khiến câu mới bị bỏ hoặc nhập nhầm.
- Heading câu mới thường là `## DPL1-01 [Cốt lõi] ...` hoặc `[Đọc tiếp]`.
- Giữ mức A/B/C của bộ cũ; thêm `studyLevel: core | further` cho bộ môn học. Không ép “Cốt lõi” đồng nghĩa với xác suất ra đề hoặc ánh xạ ngầm sang A.
- Thêm `collectionId: foundations | dpl302m`, `chapterId`, `lessonIds`, `sourceReferences` nếu schema cũ chưa có.
- Mỗi reference có tên text nguồn, marker slide và loại thông tin: chủ đề được xác nhận / công thức được viết lại / giải thích bổ sung. Không giả vờ đã render slide gốc.
- Giữ raw Markdown và đầy đủ các tiểu mục; bài tự kiểm tra, glossary và phần hướng dẫn phải truy cập được.
- Dùng manifest để kiểm tra số lượng mỗi chương. Các test cũ vẫn kiểm tra 140 câu của collection foundations, không được đổi tất cả số140 thành212 bằng search/replace.
- Tính số lượng UI từ dữ liệu từng collection; không hardcode35 câu cho mọi chuyên đề.

## 3. Điều hướng học

- Thêm lối vào rõ ràng **“Deep Learning theo môn DPL302m”**, với 5 chương và 17 bài nguồn.
- Giữ bốn mảng nền tảng cũ để ôn Giải thuật/ML/Xác suất và tra lại DL cơ bản.
- Search tìm được cả `DPL4-12`, “IoU”, “gradient checking”, “LSTM”, truy vấn không dấu và các câu cũ.
- Hiển thị nguồn slide như thông tin học tập/tra cứu; không hiển thị đường dẫn máy tính dài chiếm diện tích bài đọc.
- Liên kết câu mới với các câu cũ được dẫn trong nội dung, thay vì đổi ID hoặc thay toàn bộ bài cũ.
- Cho lọc lượt vấn đáp theo collection/chương; với lượt DPL tổng hợp 5/7 câu, ưu tiên trải đều 5 chương khi bộ lọc và số câu cho phép. Đây là lựa chọn luyện tập, không dự báo cấu trúc đề thật.
- Bộ mới có “Cốt lõi/Đọc tiếp”, hãy giải thích đó là thứ tự học đề xuất. Trạng thái đã đọc/hiểu vẫn do người dùng thao tác.

## 4. Giữ tiến độ

- Không đổi IDs XS01/ML01/DL01/GT01 hoặc storage key cũ nếu không có migration.
- Thêm IDs DPL mới với trạng thái chưa đọc/chưa đánh giá, không reset ghi chú cũ.
- Xuất/nhập backup phải chấp nhận dữ liệu từ phiên bản140 câu và giữ ID chưa có trong phiên bản hiện tại theo cách có thể phục hồi.
- Session cũ giữ danh sách câu đã chọn; không tự thêm câu mới giữa lượt đang làm.

## 5. Mô phỏng và độ sâu

Giữ tám mô phỏng ban đầu. Cập nhật nội dung mới có thể hoàn tất mà chưa cần xây mọi mô phỏng nâng cao.

Sau khi nội dung nhập ổn định, các ứng viên trực quan hóa hữu ích nhất là:

1. Shape ma trận qua mạng3→4→1 và phép broadcast bias.
2. Convolution2D, stride/padding, kích thước đầu ra và số tham số.
3. Hai bounding box kéo được để tính IoU, rồi NMS trên vài box.
4. Ba embedding A/P/N và điều kiện triplet loss.
5. Cell state/các cổng LSTM theo một chuỗi ngắn.
6. Attention với Q/K/V nhỏ, softmax và tổng có trọng số.

Chỉ đánh dấu mô phỏng hoạt động khi đã triển khai và test; không tạo nút chết để lấp danh sách. Nhiệm vụ nhập nội dung này không tự bao gồm sáu mô phỏng bổ sung.

## 6. Nghiệm thu cập nhật

- Đủ140 IDs cũ và72 IDs mới; số câu mỗi chương khớp manifest.
- Đủ5file chương, các bài tập và phần giải thích nguồn.
- IDs cũ, bookmark, ghi chú và lượt luyện cũ vẫn hoạt động sau migration.
- Reader hiển thị đúng công thức, dấu tiếng Việt, bảng và code từ bộ mới.
- Không làm mất “Cốt lõi/Đọc tiếp” hoặc nhầm thành A/B/C.
- Tìm kiếm và lọc không trộn số lượng sai giữa bộ nền tảng và bộ môn học.
- Test parser và production build qua; kiểm tra browser desktop/mobile với một câu dài mỗi chương.

Hãy thực hiện theo hiện trạng website, giữ thiết kế đã hoạt động và báo cụ thể những phần nội dung/điều hướng đã bổ sung.
