# 05 — Tập vấn đáp trước khi ngủ

## Cách tập

Mỗi đề có 7 câu để mô phỏng số lượng câu thầy nêu; thời lượng dưới đây chỉ là gợi ý tự luyện, không phải quy định của buổi kiểm tra.

1. Che phần gợi ý. Đọc câu hỏi và trả lời thành tiếng trong khoảng 30–60 giây; câu tính toán có thể lâu hơn.
2. Sau câu trả lời, tự hỏi thêm “Vì sao?” hoặc “Cho một ví dụ khác?”.
3. Chấm: **0** = không trả lời được/sai bản chất; **1** = đúng ý chính nhưng chưa giải thích được; **2** = đúng ý chính, có ví dụ hoặc lý do và đáp được một câu tiếp nối.
4. Mở file kiến thức ở đúng câu yếu, sửa rồi trả lời lại mà không nhìn. Điểm tự chấm giúp chọn nội dung ôn, không dự đoán điểm thi.

## Đề A

1. Trung bình khác trung vị thế nào? Với [1, 2, 3, 4, 100], bạn chọn chỉ số nào để mô tả giá trị điển hình, và vì sao?
2. Học có giám sát khác học không giám sát thế nào? Dự đoán giá nhà là phân loại hay hồi quy?
3. Vì sao cần train, validation và test? Bạn được dùng test để chọn mô hình nhiều lần không?
4. Deep Learning liên quan thế nào với Machine Learning? Mạng sâu hơn có luôn tốt hơn không?
5. Hãy mô tả một vòng huấn luyện mạng nơ-ron. Backpropagation và optimizer làm hai việc gì?
6. Binary search hoạt động thế nào? Điều kiện áp dụng và độ phức tạp là gì?
7. Stack khác queue thế nào? Cho mỗi loại một ví dụ.

### Gợi ý kiểm tra sau khi đã trả lời

1. **XS1:** mean = 22, median = 3; median ít bị điểm 100 kéo lệch. Việc chọn còn tùy mục tiêu mô tả; không phải mean luôn sai.
2. **ML1:** có/không có nhãn mục tiêu; giá nhà là số nên hồi quy.
3. **ML2:** học tham số / chọn cấu hình / đánh giá cuối; dùng test điều chỉnh nhiều lần làm thiên lệch đánh giá.
4. **DL1:** DL là nhánh của ML; dùng mạng nhiều tầng; tốt hay không còn phụ thuộc dữ liệu và huấn luyện.
5. **DL3:** forward → loss → gradient bằng backprop → cập nhật bằng optimizer.
6. **GT2:** mảng đã sắp xếp, xét giữa và loại nửa; xấu nhất O(log n) với truy cập chỉ số O(1).
7. **GT3:** LIFO như chồng đĩa; FIFO như hàng chờ.

## Đề B

1. Xác suất có điều kiện là gì? Biết xúc xắc công bằng ra số lớn hơn 3, xác suất ra số chẵn là bao nhiêu?
2. Bayes dùng làm gì? Vì sao xác suất xét nghiệm dương tính khi có bệnh không bằng xác suất có bệnh khi dương tính?
3. Mẫu khác tổng thể thế nào? Nếu hai biến có tương quan, có thể kết luận biến này gây ra biến kia không?
4. Mô hình có train accuracy 99%, validation accuracy 65%: bạn nghĩ đến vấn đề gì và xử lý thế nào? Trong học sâu, epoch, batch và early stopping có nghĩa gì?
5. Có 20 email spam, mô hình báo 10 email là spam và đúng 8 email. Precision, recall là bao nhiêu? Vì sao accuracy cao vẫn có thể là mô hình kém hữu ích?
6. Nơ-ron tính đầu ra như thế nào? Vì sao cần activation phi tuyến?
7. Hai vòng n lần nối tiếp khác hai vòng n lần lồng nhau thế nào? Merge sort làm gì, và nếu viết bằng đệ quy thì cần chú ý điều gì?

### Gợi ý kiểm tra sau khi đã trả lời

1. **XS2:** thu hẹp theo thông tin B; còn {4, 5, 6}, kết quả 2/3.
2. **XS3:** cập nhật xác suất từ bằng chứng; hai chiều điều kiện khác nhau, còn phụ thuộc tỷ lệ mắc và dương tính giả.
3. **XS4:** mẫu là một phần tổng thể; cần tính đại diện; tương quan chưa đủ chứng minh nhân quả.
4. **ML3, DL4:** gợi ý overfit, kiểm tra cả cách chia/phân phối; cân nhắc dữ liệu, độ phức tạp, regularization. Epoch là lượt qua train, batch là nhóm mẫu; early stopping theo dõi validation để chọn thời điểm dừng.
5. **ML4:** precision 80%, recall 40%; mất cân bằng lớp có thể làm accuracy gây hiểu nhầm. Hỏi thêm: hồi quy có thể dùng MSE.
6. **DL2:** tổng có trọng số cộng bias rồi activation; phi tuyến giúp biểu diễn quan hệ phi tuyến.
7. **GT1, GT4:** O(n) so với O(n²); merge sort chia và trộn, O(n log n); đệ quy cần điểm dừng và tiến tới điểm dừng, có chi phí ngăn xếp.

## Khi bị hỏi sâu hơn khả năng

- Nếu quên thuật ngữ nhưng hiểu ý, diễn tả bằng lời và ví dụ trước.
- Nếu thiếu dữ kiện, nói rõ giả định: “Nếu đây là mảng đã sắp xếp thì…”.
- Nếu nhận ra mình sai, sửa trực tiếp: “Em xin sửa lại, precision lấy mẫu số là số dự đoán dương tính.”
- Nếu chưa biết, nói đúng giới hạn hiểu biết. Đừng khẳng định một thuật toán luôn tốt nhất hoặc một chỉ số cao là đủ.

## Tờ từ khóa cho sáng mai

Chỉ xem danh sách này **sau khi** đã học; nó không thay thế giải thích.

| Mảng | Từ khóa cần tự giải thích |
|---|---|
| Xác suất thống kê | Mean/median; độ phân tán; điều kiện ≠ đảo điều kiện; Bayes; mẫu/tổng thể; tương quan ≠ nhân quả |
| Machine Learning | Feature/label; classification/regression; train/validation/test; overfit/underfit; precision/recall |
| Deep Learning | DL thuộc ML; weight/bias/activation; forward/loss/backprop/update; learning rate; epoch/batch |
| Giải thuật | O(1), O(log n), O(n), O(n log n), O(n²); binary search cần thứ tự; stack/queue/hash; đệ quy |

Nếu nhờ AI tập hỏi, có thể dùng: “Hãy đóng vai giảng viên vấn đáp tôi từ mức cơ bản về Giải thuật, ML, DL và Xác suất thống kê. Hỏi từng câu một, chờ tôi trả lời rồi mới nhận xét. Mỗi lượt chỉ chọn một câu hỏi tiếp nối. Chấm đúng/sai bản chất, sửa bằng ví dụ dễ hiểu. Hết 7 câu, chỉ ra 3 chỗ tôi cần ôn nhất.”
