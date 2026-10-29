# 03 — Deep Learning

**Ưu tiên tối nay: DL1–DL4.** Đọc file ML trước để hiểu train, validation và overfitting.

## DL1. Deep Learning khác Machine Learning như thế nào?

**Deep Learning (DL, học sâu) là một nhánh của Machine Learning**, sử dụng mạng nơ-ron nhiều tầng để học biểu diễn dữ liệu. Biểu diễn là cách biến dữ liệu đầu vào thành những đặc trưng thuận tiện cho việc dự đoán.

Ví dụ nhận diện ảnh: các tầng có thể học những mẫu từ đơn giản đến phức tạp, như cạnh, họa tiết và bộ phận đối tượng. Đây là cách hình dung, không phải quy tắc mọi tầng luôn học đúng một loại mẫu như vậy.

Trong nhiều cách học máy truyền thống, con người thiết kế đặc trưng rồi đưa vào mô hình. Học sâu có thể học đặc trưng cùng với nhiệm vụ dự đoán. Nó mạnh với nhiều bài toán ảnh, âm thanh và ngôn ngữ, nhưng thường cần nhiều tính toán; không phải lúc nào cũng tốt hơn mô hình đơn giản, đặc biệt với dữ liệu bảng nhỏ.

**Mẫu trả lời:** “Deep Learning thuộc Machine Learning và dùng mạng nơ-ron nhiều tầng để học biểu diễn. Điểm mạnh là có thể học đặc trưng trực tiếp từ dữ liệu trong nhiều bài toán như ảnh và ngôn ngữ. Đổi lại thường tốn tài nguyên hơn và không bảo đảm tốt hơn trên mọi bộ dữ liệu.”

**Hỏi tiếp:** Mô hình có nhiều tầng có tự động tốt hơn không? → Không; còn dữ liệu, kiến trúc, cách huấn luyện và khả năng tổng quát hóa.

## DL2. Một nơ-ron làm gì? Vì sao cần activation?

Một nơ-ron nhân từng đầu vào với một **trọng số (weight)**, cộng lại, thêm **bias**, rồi đưa qua **hàm kích hoạt (activation)**:

`z = w₁x₁ + w₂x₂ + … + b`, sau đó `a = f(z)`.

- `x`: đầu vào.
- `w`: trọng số được học, ảnh hưởng mức đóng góp của từng đầu vào.
- `b`: bias được học, giúp dịch chuyển giá trị tính được.
- `f`: hàm kích hoạt, thường tạo tính phi tuyến.

**Ví dụ:** `x₁=2, x₂=1, w₁=3, w₂=−1, b=0` thì `z=5`. Nếu dùng **ReLU**, `f(z)=max(0,z)`, đầu ra là 5; nếu z = −2 thì đầu ra là 0.

Phi tuyến giúp mạng biểu diễn những quan hệ phức tạp. Nếu chỉ ghép các phép biến đổi tuyến tính có bias mà không có phi tuyến, toàn bộ chuỗi vẫn gộp được thành một phép biến đổi affine; thêm nhiều tầng như vậy không tạo được sức biểu diễn phi tuyến.

**Mẫu trả lời:** “Một nơ-ron tính tổng có trọng số cộng bias rồi áp dụng hàm kích hoạt. Trọng số và bias được điều chỉnh khi học. Activation phi tuyến như ReLU giúp mạng học quan hệ phi tuyến; nếu thiếu nó thì nhiều tầng tuyến tính vẫn rút gọn về một phép biến đổi affine.”

**Hỏi tiếp:** Sigmoid khác ReLU ở đâu? → Sigmoid đưa giá trị về (0, 1), thường dùng ở đầu ra phân loại nhị phân; ReLU trả về max(0, z), thường gặp ở tầng ẩn. Không phải mọi đầu ra mạng đều là xác suất.

## DL3. Mạng nơ-ron học như thế nào?

Một bước huấn luyện thường có bốn phần:

1. **Forward pass:** đưa dữ liệu qua mạng để có dự đoán.
2. **Tính loss:** dùng hàm mất mát so dự đoán với đáp án. Loss biểu thị mức sai theo mục tiêu đang tối ưu.
3. **Backpropagation:** tính gradient của loss theo các tham số bằng quy tắc dây chuyền của đạo hàm.
4. **Optimizer cập nhật tham số:** dùng gradient để thay đổi trọng số và bias.

**Gradient** cho biết loss thay đổi thế nào khi thay đổi từng tham số. Với gradient descent cơ bản:

`w_mới = w_cũ − learning_rate × gradient`.

**Learning rate (tốc độ học)** điều khiển độ lớn bước cập nhật. Quá lớn có thể vượt qua vùng tốt hoặc làm huấn luyện không ổn định; quá nhỏ có thể học rất chậm.

**Ví dụ số:** trọng số hiện tại 2, gradient 3, learning rate 0,1 thì trọng số mới là `2 − 0,1×3 = 1,7`. Không phải mọi bước cập nhật đều bảo đảm giảm loss trên toàn bộ dữ liệu.

**Mẫu trả lời:** “Mạng dự đoán bằng forward pass, tính loss, dùng backpropagation để lấy gradient, rồi optimizer cập nhật tham số. Với gradient descent, ta đi ngược chiều gradient bằng bước có độ lớn do learning rate điều khiển.”

**Dễ nhầm:** backpropagation tính gradient; optimizer dùng gradient để cập nhật. Hai việc liên quan nhưng không đồng nghĩa. Loss không nhất thiết là `1 − accuracy`.

**Tự nói:** Kể lại bốn bước mà không nhìn tên tiếng Anh. Chưa học đạo hàm thì nắm ý nghĩa gradient trước, không cần chứng minh backprop tối nay.

## DL4. Epoch, batch và chống overfitting là gì?

- **Batch:** một nhóm mẫu được xử lý cùng nhau trong một bước học.
- **Batch size:** số mẫu trong nhóm đó.
- **Epoch:** một lượt đi qua toàn bộ tập train, trong cách huấn luyện thông thường.

**Ví dụ:** 1.000 mẫu, batch size 100 → thường có 10 bước cập nhật trong một epoch. Học 5 epoch → 50 bước. Nếu không chia hết, số bước còn tùy có giữ batch cuối nhỏ hơn hay bỏ đi.

Một số cách giảm overfitting trong học sâu:

- **Early stopping:** theo dõi validation và dừng khi chỉ số không cải thiện theo quy tắc đã chọn; thường lưu phiên bản tốt nhất.
- **Dropout:** ngẫu nhiên tắt một phần đơn vị trong lúc huấn luyện nhằm giảm phụ thuộc quá mức; khi suy luận, dropout thường được tắt.
- **Data augmentation:** tạo biến thể dữ liệu vẫn giữ ý nghĩa nhãn, ví dụ thay đổi sáng ảnh vừa phải. Không phải phép biến đổi nào cũng giữ nhãn: xoay số 6 có thể thành 9.
- **Regularization như phạt L2:** thêm hình phạt theo độ lớn trọng số vào mục tiêu học.

**Mẫu trả lời:** “Epoch là một lượt qua tập train, batch là nhóm mẫu dùng trong một bước học. Huấn luyện thêm epoch không bảo đảm tốt hơn vì có thể overfit. Em theo dõi validation và có thể dùng early stopping, dropout hoặc augmentation phù hợp để giảm overfitting.”

**Hỏi tiếp:** Train loss tiếp tục giảm nhưng validation loss tăng thì sao? → Có thể đang overfit; xem xu hướng qua nhiều lần đánh giá và cân nhắc dừng ở checkpoint validation tốt hơn.

## Chỉ đọc nếu còn thời gian

- **CNN:** mạng dùng phép tích chập để phát hiện mẫu cục bộ và chia sẻ trọng số; phổ biến trong xử lý ảnh.
- **RNN:** xử lý chuỗi qua trạng thái được truyền giữa các bước, như chuỗi thời gian hoặc văn bản; có hạn chế khi học phụ thuộc xa.
- **Transformer:** dùng attention để kết hợp thông tin giữa các vị trí trong chuỗi; phổ biến trong mô hình ngôn ngữ, cũng dùng cho ảnh.
- **Cross-entropy:** hàm loss phổ biến cho phân loại, khuyến khích mô hình gán xác suất cao cho nhãn đúng. MSE thường gặp trong hồi quy.
- **Inference:** sử dụng mô hình đã học để tạo dự đoán; thông thường không cập nhật trọng số trong quá trình này.
