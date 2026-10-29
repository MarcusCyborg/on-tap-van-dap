# Ôn vấn đáp: Giải thuật, ML, DL, Xác suất thống kê

Yêu cầu thầy: mỗi người trả lời 5–7 câu vấn đáp, rèn khả năng trả lời phỏng vấn trước khi đi thực tập. Phạm vi gồm bốn mảng. Nay đã có text slide và các bản tổng hợp DPL302m, nên ưu tiên nội dung môn Deep Learning ở bộ bổ sung bên dưới.

## Mới cập nhật: Deep Learning theo môn DPL302m

Mở [bộ DPL302m theo 5 chương](DPL302m/README.md): **72 câu mới**, gồm 57 Cốt lõi và 15 Đọc tiếp, cùng 19 bài tự kiểm tra có lời giải. Nội dung dựa trên 17 file text slide thực tế, bổ sung shape/broadcasting, tối ưu, ML strategy, CNN/detection/face recognition và RNN/NLP/Transformer.

Đây là lối học ưu tiên cho môn hiện tại; bộ 35 câu DL cũ làm nền và giữ nguyên ID. Có [bảng đối chiếu](DOI-CHIEU-DL-VOI-DPL302m.md) và [hướng dẫn cập nhật website sau](Trien-khai-web/CAP-NHAT-NOI-DUNG-DPL302m.md). Tổng số mục hỏi khi gộp hai bộ là 212, có một phần kiến thức ôn lại/chồng lấn.

## Bộ nền tảng chung: bốn mảng

Bộ mới dành cho người gần như bắt đầu từ số 0, viết theo dạng **bài giảng chia thành câu hỏi**. Mỗi mảng có 35 câu: giải thích khái niệm, ví dụ, mẫu trả lời miệng và câu hỏi tiếp nối hoặc lỗi thường nhầm. Tổng cộng **140 câu** (72 A, 48 B, 20 C), **20 bài tự kiểm tra có lời giải** và **4 đề tổng hợp, mỗi đề 7 câu**.

| Thứ tự | Tài liệu | Nội dung |
|---|---|---|
| 0 | [Cách học và bản đồ kiến thức](Chuyen-de/00-Cach-hoc-va-ban-do-kien-thuc.md) | Quan hệ giữa bốn mảng, các ký hiệu/thuật ngữ đầu vào, cách chọn phần học tối nay |
| 1 | [Xác suất thống kê: 35 câu](Chuyen-de/01-Xac-suat-thong-ke.md) | Mô tả dữ liệu, xác suất, Bayes, phân phối, lấy mẫu, ước lượng và kiểm định |
| 2 | [Machine Learning: 35 câu](Chuyen-de/02-Machine-Learning.md) | Bài toán, quy trình học, xử lý dữ liệu, thuật toán, đánh giá và tổng quát hóa |
| 3 | [Deep Learning: 35 câu](Chuyen-de/03-Deep-Learning.md) | Mạng nơ-ron, huấn luyện, activation/loss, tối ưu, CNN/RNN/Transformer |
| 4 | [Giải thuật: 35 câu](Chuyen-de/04-Giai-thuat.md) | Big-O, cấu trúc dữ liệu, tìm kiếm/sắp xếp, đệ quy, đồ thị, greedy và DP |
| 5 | [Bốn đề vấn đáp tổng hợp](Chuyen-de/05-Bon-de-van-dap-tong-hop.md) | Mỗi đề 7 câu, có gợi ý kiểm tra và tình huống liên kết nhiều mảng |

Bạn có thể học Giải thuật trước nếu đó là phần quen hơn; ML nên đọc trước DL. Với mỗi file, xem bản đồ đầu bài để chọn các câu theo mức ưu tiên.

## Ba mức đọc

- **A - Nền tảng:** hiểu cơ chế và ví dụ; đóng tài liệu rồi tập giải thích.
- **B - Mở rộng:** bổ sung thuật toán, kỹ thuật và so sánh sau khi có nền.
- **C - Nhận diện:** đọc ý chính trước; quay lại khi cần hoặc khi nội dung này có trong đề cương lớp.

Đây là mức ưu tiên học, không phải dự báo xác suất ra đề. Bộ tài liệu rộng hơn bản đầu nhưng không thể bao trọn mọi chủ đề trong bốn lĩnh vực. Nếu có slide hoặc câu hỏi thầy đã giao, dùng chúng để điều chỉnh thứ tự học.

## Cách dùng tối nay

1. Đọc bản đồ chung để biết mình đang học gì; lướt tiêu đề bốn chuyên đề.
2. Đọc phần A theo mạch trong mỗi file; sau 2–3 câu, đóng tài liệu và nói lại bằng lời của mình.
3. Chạy ví dụ số nhỏ hoặc thuật toán bằng giấy; không chỉ nhìn công thức và thấy quen.
4. Làm đề tổng hợp, sửa đúng phần mình sai, rồi mới mở rộng sang B/C phù hợp.

Một câu đã học nên có ba thứ: **nói được nó là gì, cho được ví dụ, nêu được một điều kiện hoặc lỗi dễ nhầm**. Lịch mẫu 4 giờ nằm trong [bài dẫn nhập](Chuyen-de/00-Cach-hoc-va-ban-do-kien-thuc.md); đó là lịch chọn lọc, không phải thời gian đủ để hiểu hết 140 câu.

## Bản ngắn ban đầu: dùng để nhắc nhanh

Các file cũ được giữ để tra nhanh sau khi đọc chuyên đề. Bộ này có 16 câu tối thiểu, không còn là tài liệu chính:

- [Lộ trình cấp tốc 2 giờ hoặc 4 giờ](00-Lo-trinh-cap-toc.md)
- [Xác suất thống kê: bản ngắn](01-Xac-suat-thong-ke.md)
- [Machine Learning: bản ngắn](02-Machine-Learning.md)
- [Deep Learning: bản ngắn](03-Deep-Learning.md)
- [Giải thuật: bản ngắn](04-Giai-thuat.md)
- [Hai đề tập nói: bản ngắn](05-Tap-van-dap.md)

## Tập vấn đáp cùng AI

> Hãy hỏi tôi từng câu dựa trên bộ chuyên đề này, bắt đầu từ mức A. Đợi tôi trả lời rồi mới nhận xét. Nếu tôi trả lời đúng, hỏi thêm một câu vì sao hoặc yêu cầu ví dụ. Nếu sai, sửa đúng chỗ sai bằng lời dễ hiểu và để tôi nói lại. Sau 7 câu, tổng hợp 3 phần tôi cần ôn nhất.
