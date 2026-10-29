# 02: Machine Learning

**Ưu tiên tối nay: ML1–ML4.** Hãy giữ một ví dụ xuyên suốt: dự đoán giá nhà hoặc nhận diện email spam.

## ML1. Machine Learning là gì? Các loại học cơ bản?

Machine Learning (ML, học máy) xây dựng mô hình từ dữ liệu để dự đoán hoặc tìm cấu trúc trong dữ liệu. Thay vì viết từng quy tắc nhận diện spam, ta cho mô hình học từ nhiều email.

- **Feature (đặc trưng):** thông tin đầu vào, ví dụ diện tích và số phòng của nhà.
- **Label/target (nhãn/giá trị mục tiêu):** thứ muốn dự đoán, ví dụ giá bán nhà.
- **Model (mô hình):** quy tắc có các tham số được học để biến đầu vào thành dự đoán.

Ba kiểu học thường gặp:

| Kiểu học | Dữ liệu/tín hiệu học | Ví dụ |
|---|---|---|
| Có giám sát - supervised | Có đầu vào và đáp án mục tiêu | Email kèm nhãn spam/không spam |
| Không giám sát - unsupervised | Không có nhãn mục tiêu cho bài toán | Gom khách hàng thành nhóm theo hành vi |
| Tăng cường - reinforcement | Tác nhân tương tác môi trường, nhận thưởng | Học chọn nước đi để tăng tổng phần thưởng |

Trong học có giám sát, **classification (phân loại)** dự đoán lớp, như spam/không spam; **regression (hồi quy)** dự đoán số, như giá nhà.

**Mẫu trả lời:** “Học máy là cách xây dựng mô hình học từ dữ liệu để dự đoán hoặc tìm cấu trúc. Học có giám sát dùng nhãn; phân loại dự đoán lớp còn hồi quy dự đoán giá trị số. Học không giám sát tìm cấu trúc khi không có nhãn mục tiêu, như phân cụm khách hàng.”

**Hỏi tiếp:** Dự đoán số tiền mua hàng là hồi quy; dự đoán có mua hay không là phân loại.

## ML2. Vì sao chia train, validation và test?

Ta muốn biết mô hình có làm tốt trên **dữ liệu chưa dùng để huấn luyện** hay chỉ nhớ bài cũ.

- **Train:** dùng để học tham số, ví dụ trọng số của mô hình.
- **Validation:** dùng để chọn mô hình và chỉnh siêu tham số, ví dụ độ sâu cây hoặc learning rate.
- **Test:** dùng để đánh giá cuối cùng sau khi đã chốt lựa chọn.

Siêu tham số là cấu hình điều khiển mô hình hoặc quá trình học; tham số là các giá trị được học từ dữ liệu.

**Ví dụ:** train giống bài đã luyện, validation giống đề thử dùng để điều chỉnh cách học, test giống đề kiểm tra cuối. Dùng đề cuối để sửa bài nhiều lần thì điểm không còn phản ánh khách quan khả năng làm đề mới.

**Data leakage (rò rỉ dữ liệu)** là đưa thông tin không được phép có vào quá trình học hoặc lựa chọn mô hình. Ví dụ chuẩn hóa bằng trung bình của toàn bộ dữ liệu trước khi chia khiến thông tin từ test đi vào xử lý train. Cách thông thường: chia trước, học các giá trị chuẩn hóa trên train, rồi áp dụng cho validation/test.

**Mẫu trả lời:** “Train để học tham số, validation để chọn cấu hình, test để đánh giá cuối cùng. Nếu dùng test để điều chỉnh mô hình, kết quả test sẽ thiên lệch và không còn là đánh giá độc lập. Em cũng cần tránh rò rỉ thông tin từ tập đánh giá vào huấn luyện.”

**Hỏi tiếp:** Có tỷ lệ chia bắt buộc không? → Không. Với dự báo theo thời gian thường phải giữ thứ tự thời gian; không chia ngẫu nhiên làm dữ liệu tương lai lọt vào quá khứ.

## ML3. Overfitting và underfitting là gì?

**Overfitting (quá khớp):** mô hình học quá sát dữ liệu train, kể cả nhiễu, nên làm tốt trên train nhưng kém trên dữ liệu mới tương tự. Giống nhớ đáp án bài luyện mà không hiểu cách giải.

**Underfitting (thiếu khớp):** mô hình chưa học được quy luật đủ tốt; thường kém cả trên train và validation. Có thể do mô hình quá đơn giản, đặc trưng chưa phù hợp hoặc học chưa đủ.

Ví dụ dùng một đường thẳng để mô tả quan hệ cong phức tạp có thể thiếu khớp. Một đường quá ngoằn ngoèo đi qua mọi điểm train có thể quá khớp.

Cách giảm overfitting: thêm dữ liệu phù hợp, giảm độ phức tạp, dùng **regularization** để hạn chế độ phức tạp của mô hình, hoặc **early stopping** để dừng khi kết quả validation không cải thiện. Thêm dữ liệu không phù hợp không bảo đảm giải quyết được vấn đề.

**Mẫu trả lời:** “Overfitting là học quá sát train nên tổng quát hóa kém, thường thể hiện qua kết quả train tốt nhưng validation kém. Underfitting là chưa học đủ quy luật nên cả hai đều kém. Em sẽ so kết quả hai tập rồi cân nhắc dữ liệu, độ phức tạp và regularization.”

**Hỏi tiếp:** Accuracy train 99%, validation 65% có gợi ý gì? → Gợi ý overfitting, nhưng cũng cần kiểm tra khác biệt phân phối dữ liệu hoặc cách chia; không thể kết luận chỉ từ hai số.

## ML4. Accuracy, precision, recall và MSE khác nhau thế nào?

Với phân loại nhị phân, chọn spam là lớp **dương tính**:

- **TP:** dự đoán spam, thực tế spam.
- **FP:** dự đoán spam, thực tế không spam - báo nhầm.
- **FN:** dự đoán không spam, thực tế spam - bỏ sót.
- **TN:** dự đoán không spam, thực tế không spam.

| Chỉ số | Công thức | Câu hỏi nó trả lời |
|---|---|---|
| Accuracy | `(TP + TN) / tổng số` | Bao nhiêu dự đoán đúng trên tất cả? |
| Precision | `TP / (TP + FP)` | Trong những cái báo dương tính, bao nhiêu cái đúng? |
| Recall | `TP / (TP + FN)` | Trong những cái thực sự dương tính, tìm được bao nhiêu? |

Các công thức tỷ lệ cần mẫu số khác 0; khi không có dự đoán hoặc mẫu dương tính, phải xem quy ước xử lý của công cụ.

**Ví dụ:** có 20 email spam. Mô hình báo 10 email là spam, trong đó 8 email đúng. Precision = 8/10 = 80%; recall = 8/20 = 40%. Mô hình báo khá chính xác nhưng bỏ sót nhiều spam.

**Bẫy accuracy:** 100 giao dịch gồm 99 bình thường và 1 gian lận. Luôn đoán bình thường vẫn đạt accuracy 99%, nhưng không phát hiện được giao dịch gian lận nào.

Với **hồi quy**, một thước đo phổ biến là **MSE**: trung bình bình phương sai số giữa dự đoán và giá trị thật. Ví dụ dự đoán [2, 5], thực tế [3, 3], MSE = `(1 + 4)/2 = 2,5`. Cùng bài toán và thang đo, MSE thấp hơn nghĩa là sai số bình phương trung bình thấp hơn.

**Mẫu trả lời:** “Chỉ số phải phù hợp bài toán. Accuracy là tỷ lệ đúng chung nhưng dễ gây hiểu nhầm khi lớp mất cân bằng. Precision chú ý độ đúng của các cảnh báo, recall chú ý mức độ tìm đủ trường hợp dương tính. Với hồi quy, em có thể dùng MSE để đo sai số số học.”

## Chỉ đọc nếu còn thời gian

- **Linear regression:** dự đoán số bằng tổ hợp tuyến tính các đặc trưng, ví dụ `giá = w × diện_tích + b`.
- **Logistic regression:** thường dùng cho phân loại, dù tên có chữ regression; bản nhị phân đưa tổ hợp tuyến tính qua sigmoid để tạo giá trị trong (0, 1).
- **Decision tree:** lần lượt đặt câu hỏi về đặc trưng để chia dữ liệu, ví dụ “diện tích > 50 m²?”. Cây quá sâu dễ overfit.
- **K-means:** chia dữ liệu thành K cụm bằng cách luân phiên gán điểm cho tâm gần nhất và cập nhật tâm. Cần chọn K; nhạy với thang đo và khởi tạo.
- **F1:** trung bình điều hòa của precision và recall, `2PR/(P+R)` khi mẫu số khác 0. Không phải trung bình cộng.
