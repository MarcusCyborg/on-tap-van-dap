# Bốn đề vấn đáp tổng hợp

Mỗi đề gồm 7 câu, xen kẽ các mảng. Đây là đề tự luyện theo phạm vi yêu cầu, không phải dự đoán đề thầy. Trả lời trước khi xem gợi ý. Với người mới, câu trả lời có thể ngắn; điều quan trọng là đúng ý và giải thích được ví dụ.

**Tự chấm từng câu:** 0 = sai hoặc chưa nói được; 1 = đúng ý nhưng chưa giải thích được; 2 = đúng, có lý do hoặc ví dụ, đáp được câu nối tiếp. Điểm giúp tìm phần cần học lại, không dùng để suy ra điểm kiểm tra thật.

## Đề 1: Nền tảng và các điều kiện dễ quên

1. Giải thuật là gì? Hai chương trình cho cùng đáp án có thể khác nhau về những mặt nào?
2. Trung bình, trung vị và độ lệch chuẩn mô tả điều gì? Vì sao cùng trung bình chưa có nghĩa là dữ liệu giống nhau?
3. Phân biệt hồi quy, phân loại và phân cụm; mỗi loại cho một ví dụ.
4. Vì sao không chỉ đánh giá mô hình trên tập train? Validation và test có vai trò gì?
5. Deep Learning thuộc Machine Learning như thế nào? Vì sao nhiều tầng tuyến tính có thể chưa đủ để học một quan hệ phi tuyến?
6. Binary search có thể dùng trực tiếp cho một mảng chưa sắp xếp không? Khi chỉ tìm một lần, bạn chọn cách nào?
7. Stack và queue khác nhau thế nào? Vì sao BFS thường dùng queue?

### Gợi ý sau khi trả lời

1. Giải thuật là các bước giải bài toán; xét tính đúng, thời gian, bộ nhớ và giả định đầu vào. Chạy nhanh với vài mẫu nhỏ chưa chứng minh tốt hơn khi dữ liệu lớn.
2. Mean/median mô tả trung tâm; độ lệch chuẩn mô tả phân tán. [5, 5, 5] và [0, 5, 10] cùng mean nhưng độ phân tán khác nhau.
3. Hồi quy dự đoán số như giá; phân loại dự đoán nhãn như spam; phân cụm tìm nhóm không có nhãn mục tiêu, như nhóm hành vi khách hàng.
4. Train đã ảnh hưởng tham số nên kết quả tốt trên train chưa bảo đảm tổng quát hóa. Validation để lựa chọn, test để đánh giá cuối sau khi chốt; chỉnh theo test nhiều lần làm thiên lệch đánh giá.
5. DL là nhánh ML dùng mạng nhiều tầng; chuỗi phép biến đổi tuyến tính có bias vẫn gộp thành một phép affine nếu không có phi tuyến. Activation phi tuyến mở rộng khả năng biểu diễn.
6. Không bảo đảm đúng trên mảng chưa sắp xếp. Chỉ tìm một lần thường có thể duyệt O(n); nếu sắp xếp trước thì phải tính thêm chi phí sắp xếp, không chỉ O(log n) của tìm kiếm.
7. Stack LIFO, queue FIFO. Queue giữ thứ tự mở rộng theo lớp của BFS; với đồ thị không trọng số, điều này giúp tìm đường có số cạnh ít nhất.

## Đề 2: Đọc số và diễn giải đúng

1. Trong 100 giao dịch có một giao dịch gian lận. Mô hình luôn đoán không gian lận đạt accuracy bao nhiêu? Nó có hữu ích cho phát hiện gian lận không?
2. Mô hình báo 10 email spam, đúng 8; thực tế có 20 email spam. Tính precision, recall và giải thích hai mẫu số.
3. Biết xúc xắc công bằng ra số lớn hơn 3, xác suất ra số chẵn là bao nhiêu? Hai biến cố “ra 1” và “ra 2” trong cùng lần tung có độc lập không?
4. Một bệnh có 10 người mắc trong 1.000 người. Xét nghiệm tìm đúng 9 người mắc và báo nhầm 99 người khỏe. Trong nhóm dương tính, tỷ lệ mắc thực sự là bao nhiêu? Nó minh họa điều gì?
5. Có 1.000 mẫu, batch size 100, học 5 epoch. Thông thường có bao nhiêu bước cập nhật? Epoch khác step thế nào?
6. Trọng số w = 2, gradient = 3, learning rate = 0,1. Gradient descent cập nhật ra sao? Learning rate quá lớn có thể gây vấn đề gì?
7. Một vòng n lần nối tiếp một vòng n lần có bậc tăng trưởng nào? Nếu lồng hai vòng đó vào nhau thì sao?

### Gợi ý sau khi trả lời

1. Accuracy 99%; recall cho lớp gian lận bằng 0 nên mô hình không bắt được ca gian lận nào. Cần chỉ số và chi phí sai phù hợp mục tiêu.
2. Precision = 8/10 = 80%, mẫu số là số dự đoán spam. Recall = 8/20 = 40%, mẫu số là số thực tế spam. F1 trong ví dụ là khoảng 53,3%, không phải trung bình cộng 60%.
3. Còn {4, 5, 6}, nên 2/3. “Ra 1” và “ra 2” xung khắc nhưng không độc lập: biết đã ra 1 thì xác suất ra 2 bằng 0, khác 1/6 ban đầu.
4. 9/(9+99) ≈ 8,3%. Xác suất “dương tính khi có bệnh” khác “có bệnh khi dương tính”; cần xét tỷ lệ nền và báo nhầm. Đây là ví dụ toán giả định.
5. 10 bước/epoch, tổng 50 bước trong cách huấn luyện thông thường. Epoch là một lượt qua tập dữ liệu; step là một lần cập nhật. Bài có dữ liệu chia hết, không phát sinh batch cuối thiếu mẫu.
6. w mới = 2 − 0,1×3 = 1,7. Bước quá lớn có thể dao động, vượt vùng loss thấp hoặc phân kỳ; nhỏ quá có thể học chậm.
7. Nối tiếp: khoảng 2n thao tác nên O(n); lồng nhau: khoảng n² nên O(n²), với giả định phần thân có chi phí O(1).

## Đề 3: Các tình huống thực tế

1. Dự báo doanh thu tháng sau, bạn chia ngẫu nhiên tất cả bản ghi theo thời gian có rủi ro gì?
2. Bạn chuẩn hóa dữ liệu bằng trung bình toàn bộ tập rồi mới chia train/test. Có vấn đề gì và sửa thế nào?
3. Train loss giảm nhưng validation loss tăng kéo dài. Bạn kiểm tra và xử lý gì?
4. Một mạng nhận ảnh 28×28 và một mô hình dùng dữ liệu bảng 20 cột: có nhất thiết dùng cùng một kiến trúc không? Chọn hướng thử ban đầu thế nào?
5. Thầy hỏi “tại sao learning rate tốt nhất là 0,001?”. Bạn trả lời thế nào?
6. Muốn tìm xem một tên người có trong tập một triệu tên nhiều lần, bạn nghĩ tới cấu trúc nào? Chi phí tra cứu O(1) có bảo đảm mọi trường hợp không?
7. Bạn khảo sát thu nhập chỉ từ nhóm bạn cùng lớp rồi kết luận cho cả thành phố. Vấn đề nằm ở đâu? Tăng số câu trả lời trong đúng nhóm đó có tự giải quyết không?

### Gợi ý sau khi trả lời

1. Có thể đánh giá không đúng bối cảnh dự báo tương lai và tạo rò rỉ từ cách xây đặc trưng. Nên mô phỏng triển khai: train ở quá khứ, đánh giá ở giai đoạn sau; mọi đặc trưng phải chỉ dùng thông tin đã có lúc dự đoán.
2. Thông tin test đã ảnh hưởng phép xử lý. Chia trước; học trung bình/độ lệch chuẩn từ train; áp dụng các giá trị đã học cho validation/test. Trong cross-validation cũng phải học phép xử lý riêng trong từng fold train.
3. Gợi ý overfit; kiểm tra dữ liệu, cách chia và xu hướng. Có thể giảm độ phức tạp, tăng dữ liệu phù hợp, regularization, augmentation hợp lệ, early stopping; không có một biện pháp luôn đúng.
4. Không. CNN là một hướng cho cấu trúc ảnh; dữ liệu bảng có thể bắt đầu bằng mô hình tuyến tính hoặc cây/ensemble. Dùng baseline và kết quả validation để lựa chọn, không chỉ dựa vào việc mô hình nào mới hơn.
5. Không có learning rate tốt nhất cho mọi mô hình và dữ liệu. 0,001 chỉ có thể là một giá trị thử, lựa chọn phải dựa vào optimizer, thang gradient, quá trình học và validation.
6. Có thể dùng hash set để kiểm tra tồn tại; chi phí trung bình thường O(1) theo số phần tử trong các giả định chuẩn, còn có bộ nhớ và chi phí băm khóa. Trường hợp xấu có thể O(n); cần xử lý trùng tên hoặc định danh theo yêu cầu.
7. Thiên lệch chọn mẫu, mẫu có thể không đại diện cho thành phố. Nhiều mẫu hơn từ cùng nguồn thiên lệch không tự loại bỏ sai lệch đó.

## Đề 4: Mở rộng và khả năng giải thích

1. P-value = 0,03 có nghĩa là xác suất giả thuyết không đúng bằng 3% không? Giải thích ngắn.
2. Khoảng tin cậy 95% được hiểu thế nào theo cách tiếp cận thống kê tần suất? Vì sao mẫu lớn thường làm khoảng hẹp hơn nếu các yếu tố khác tương tự?
3. Logistic regression thường giải bài toán gì dù tên có chữ regression? Nó khác hồi quy tuyến tính ở đầu ra như thế nào?
4. Random forest dùng nhiều cây ra sao? Nhiều cây có bảo đảm luôn tốt hơn mọi mô hình khác không?
5. Backpropagation, gradient descent và Adam có vai trò gì? Chúng có phải ba tên cho cùng một việc không?
6. Greedy có luôn cho nghiệm tối ưu không? Với các đồng {1, 3, 4}, đổi 6 là một ví dụ thế nào?
7. Attention trong Transformer giúp gì? Dùng mô hình đã huấn luyện sẵn rồi fine-tune có nghĩa gì?

### Gợi ý sau khi trả lời

1. Không. Dưới H0 và các giả định của phép kiểm định, đó là xác suất thống kê kiểm định ít nhất cũng cực đoan như quan sát, theo cách xác định “cực đoan” của phép kiểm định. Không phải P(H0 đúng).
2. Nếu lặp quy trình lấy mẫu và dựng khoảng, khoảng 95% các khoảng sẽ chứa tham số thật dưới các giả định phù hợp. Sai số chuẩn thường giảm khi n tăng, ví dụ SE của mean bằng σ/√n với mẫu độc lập cùng phân phối và phương sai hữu hạn khi biết σ. Đây là tính chất của quy trình, không khẳng định tham số cố định ngẫu nhiên nằm trong khoảng đã quan sát với xác suất 95%.
3. Thường dùng phân loại. Bản nhị phân biến đổi điểm tuyến tính qua sigmoid để ước lượng xác suất lớp; hồi quy tuyến tính dự đoán giá trị số, không bị giới hạn vào (0, 1).
4. Kết hợp nhiều cây với tính ngẫu nhiên trong mẫu/đặc trưng, rồi bỏ phiếu hoặc lấy trung bình; giúp giảm phương sai trong nhiều bài toán. Không bảo đảm vượt mọi mô hình, vẫn cần kiểm tra validation và chi phí tính toán.
5. Backprop tính gradient qua mạng; gradient descent dùng gradient cập nhật tham số; Adam là optimizer dùng các ước lượng moment của gradient để điều chỉnh cập nhật. Chúng không đồng nghĩa.
6. Không. Chọn đồng lớn nhất trước cho 4+1+1, cần 3 đồng; lời giải 3+3 chỉ cần 2 đồng. Muốn dùng greedy cần lý do chứng minh lựa chọn cục bộ dẫn tới nghiệm tốt theo bài toán.
7. Attention kết hợp thông tin từ các vị trí dựa trên mức liên quan được tính từ biểu diễn của chúng. Fine-tune tiếp tục huấn luyện một phần hoặc toàn bộ tham số của mô hình đã học trước trên dữ liệu/mục tiêu mới; khác với chỉ đưa câu hỏi mới vào mô hình để suy luận.

## Phiếu sửa lỗi sau mỗi đề

Chỉ ghi những chỗ mình thực sự sai:

| Câu | Tôi đã nhầm điều gì? | Cách nói đúng bằng lời của tôi | Đã nói lại không nhìn? |
|---|---|---|---|
| … | … | … | Có / Chưa |

Nếu chỉ còn 20 phút, sửa ba lỗi bản chất quan trọng hơn đọc thêm nhiều tên thuật toán. Một định nghĩa đúng, một ví dụ đúng và một điều kiện đúng sẽ giúp bạn đối thoại tiếp khi thầy hỏi sâu hơn.
