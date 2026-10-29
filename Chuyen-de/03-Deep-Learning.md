# Deep Learning từ số 0: 35 câu hỏi có giải thích

Tài liệu này giúp bạn hiểu bức tranh chung và tập trả lời vấn đáp. Đây không phải dự đoán đề của thầy, cũng không thay thế một khóa học đầy đủ. Hãy học theo thứ tự vì các khái niệm sau dựa vào khái niệm trước.

## Bản đồ khái niệm

**Dữ liệu → biểu diễn bằng tensor → mạng tính dự đoán → loss đo mức sai → backpropagation tính gradient → optimizer cập nhật tham số → kiểm tra trên validation → sử dụng mô hình.**

- **[A] DL01–DL18:** nền tảng nên đọc trước. Mục tiêu là kể được một vòng học và giải thích vì sao mô hình có thể học tốt hoặc học hỏng.
- **[B] DL19–DL30:** hiểu thêm cách huấn luyện, các họ mạng và cách xử lý tình huống thực tế.
- **[C] DL31–DL35:** nhận diện khái niệm mở rộng. Chưa hiểu chắc A thì chưa cần đi sâu C.

Sau mỗi câu: đọc giải thích, đóng tài liệu, nói lại phần “Trả lời miệng” bằng lời của bạn. Ví dụ và câu hỏi tiếp giúp kiểm tra bạn có hiểu hay chỉ nhớ câu chữ. “Tham số” là giá trị mô hình học được; “siêu tham số” là cấu hình điều khiển mô hình hoặc quá trình học.

## I. Dữ liệu đi qua mạng như thế nào?

### DL01 [A] Deep Learning là gì, liên quan gì đến Machine Learning?

**Trả lời miệng:** “Deep Learning thuộc Machine Learning và dùng mạng nơ-ron nhiều tầng để học biểu diễn. Mạng có thể học đặc trưng cùng nhiệm vụ dự đoán, thay vì con người thiết kế toàn bộ đặc trưng. Hiệu quả vẫn phụ thuộc dữ liệu, kiến trúc và cách huấn luyện.”

Deep Learning (DL, học sâu) là một nhánh của Machine Learning (ML), dùng mạng nơ-ron nhiều tầng để học biểu diễn dữ liệu. “Biểu diễn” là cách biến dữ liệu thành những đặc trưng thuận tiện cho dự đoán. Ví dụ mạng ảnh có thể học các mẫu từ cạnh và họa tiết đến bộ phận đối tượng.

DL thường mạnh với ảnh, âm thanh, ngôn ngữ, nhưng không luôn thắng mô hình đơn giản trên dữ liệu bảng ít mẫu.

**Hỏi tiếp:** Nhiều tầng hơn luôn tốt hơn? → Không; có thể khó tối ưu, tốn tài nguyên hoặc overfit.

### DL02 [A] Scalar, vector, matrix và tensor là gì?

**Trả lời miệng:** “Tensor là cách biểu diễn dữ liệu bằng mảng nhiều chiều. Em cần biết shape để hiểu chiều nào là số mẫu, chiều nào là đặc trưng hoặc kênh ảnh. Sai thứ tự chiều có thể khiến phép tính lỗi hoặc mang ý nghĩa sai.”

Đây là cách tổ chức số. **Scalar** là một số; **vector** là dãy số; **matrix** là bảng hai chiều. Trong lập trình DL, **tensor** là mảng số có thể có nhiều chiều. **Shape** mô tả kích thước mỗi chiều, không phải giá trị bên trong.

Ví dụ ảnh RGB 32×32 có shape `(32, 32, 3)`: chiều cao, chiều rộng, ba kênh màu. Một batch 10 ảnh có thể là `(10, 32, 32, 3)` hoặc `(10, 3, 32, 32)` tùy quy ước thư viện.

**Hỏi tiếp:** Tensor 4 chiều có phải ảnh 4D? → Không; một chiều có thể chỉ là số ảnh trong batch.

### DL03 [A] Một nơ-ron nhân tạo tính gì?

**Trả lời miệng:** “Một nơ-ron tính tổng đầu vào nhân trọng số, cộng bias, rồi qua activation. Trọng số điều chỉnh đóng góp của từng đầu vào; bias dịch chuyển kết quả. Khi học, mạng điều chỉnh các tham số này để giảm loss.”

Nơ-ron lấy tổng có trọng số của đầu vào, thêm bias rồi áp dụng hàm kích hoạt:

`z = w₁x₁ + … + wₙxₙ + b`, sau đó `a = f(z)`.

Trọng số `w` và bias `b` là tham số được học. Bias giúp dịch chuyển phép biến đổi, không bắt quan hệ phải đi qua gốc tọa độ.

Ví dụ `x=[2,1]`, `w=[3,−1]`, `b=1` thì `z=6`. Nếu `f` là ReLU thì đầu ra là 6.

**Hỏi tiếp:** Trọng số lớn có luôn nghĩa là đặc trưng quan trọng? → Không; còn phụ thuộc thang đo đầu vào và tương tác trong mạng.

### DL04 [A] Tầng ẩn, tầng đầu ra và forward pass là gì?

**Trả lời miệng:** “Forward pass là đưa dữ liệu lần lượt qua các tầng để tính dự đoán. Tầng ẩn tạo những biểu diễn trung gian; tầng đầu ra phải phù hợp mục tiêu, như một giá trị cho dự đoán giá nhà.”

Một tầng nhận đầu ra của tầng trước, thực hiện phép biến đổi rồi truyền tiếp. Tầng ẩn nằm giữa đầu vào và đầu ra. **Forward pass** là quá trình tính từ dữ liệu đầu vào đến dự đoán cuối cùng.

Ví dụ mạng `3 → 4 → 1` nhận 3 đặc trưng, có một tầng ẩn 4 đơn vị, rồi tạo một đầu ra. Với tầng fully connected, mỗi đơn vị nối với mọi đầu vào của tầng đó.

**Hỏi tiếp:** “Ẩn” có nghĩa không quan sát được? → Không; ta có thể lấy giá trị của tầng. Tên này chỉ vị trí bên trong mạng.

### DL05 [A] Vì sao cần activation phi tuyến?

**Trả lời miệng:** “Activation phi tuyến giúp mạng biểu diễn quan hệ phi tuyến. Nếu các tầng chỉ làm phép nhân ma trận và cộng bias, nhiều tầng vẫn tương đương một phép biến đổi affine. Vì vậy độ sâu chỉ có ý nghĩa biểu diễn lớn hơn khi kết hợp các phép biến đổi thích hợp.”

Nếu chỉ ghép các phép biến đổi tuyến tính có bias, cả chuỗi vẫn gộp thành một phép biến đổi affine: `Ax+b`. Khi đó thêm tầng không tạo khả năng biểu diễn phi tuyến. Activation phi tuyến giúp mạng học quan hệ phức tạp hơn, như ranh giới phân loại cong.

Ví dụ ReLU giữ phần dương và đặt phần âm về 0. Sự thay đổi cách xử lý giữa hai miền tạo tính phi tuyến.

**Hỏi tiếp:** Tầng đầu ra luôn cần activation phi tuyến? → Không; hồi quy giá trị không bị chặn thường dùng đầu ra tuyến tính.

### DL06 [A] ReLU, sigmoid và tanh khác nhau thế nào?

**Trả lời miệng:** “ReLU thường dùng ở tầng ẩn vì đơn giản và giữ gradient ở phía dương. Sigmoid thường dùng ở đầu ra phân loại nhị phân. Tanh có đầu ra quanh 0. Lựa chọn phụ thuộc vị trí và bài toán.”

| Hàm | Đầu ra | Cách hiểu |
|---|---|---|
| ReLU: `max(0,z)` | `[0,+∞)` | Giữ phần dương, bỏ phần âm |
| Sigmoid: `1/(1+exp(−z))` | `(0,1)` | Nén về khoảng phù hợp cho xác suất nhị phân |
| Tanh | `(−1,1)` | Nén đối xứng quanh 0 |

Ví dụ `ReLU(−2)=0`, `sigmoid(0)=0,5`, `tanh(0)=0`. Sigmoid và tanh dễ có gradient rất nhỏ ở vùng bão hòa. ReLU có thể gặp đơn vị luôn nằm phía âm và khó được cập nhật.

**Bẫy:** Không phải cứ đầu ra trong (0,1) thì xác suất dự đoán đã được hiệu chỉnh chính xác.

### DL07 [A] Chọn đầu ra cho binary, multiclass và multilabel thế nào?

**Trả lời miệng:** “Đầu ra phụ thuộc quan hệ giữa các nhãn. Các lớp loại trừ nhau thường dùng softmax; nhiều nhãn có thể cùng xuất hiện thì dùng sigmoid từng nhãn. Hồi quy có thể dùng đầu ra tuyến tính.”

**Binary** chọn giữa hai lớp: thường dùng một logit và sigmoid. **Multiclass** chọn đúng một trong K lớp: thường dùng K logits và softmax. **Multilabel** cho phép nhiều nhãn cùng đúng: thường dùng K sigmoid riêng.

Logit là điểm số chưa chuẩn hóa. Softmax biến các điểm số thành K giá trị dương có tổng 1. Ví dụ ảnh chỉ là mèo hoặc chó là binary; chọn một chữ số 0–9 là multiclass; một ảnh vừa có người vừa có xe là multilabel.

**Hỏi tiếp:** Vì sao không softmax cho multilabel? → Tổng bằng 1 ép các nhãn cạnh tranh, trong khi nhiều nhãn có thể cùng đúng.

### DL08 [A] Loss khác metric thế nào? MSE và cross-entropy là gì?

**Trả lời miệng:** “Loss cung cấp mục tiêu để optimizer giảm trong huấn luyện; metric cho biết mô hình hữu ích đến đâu theo cách đánh giá. Accuracy không trực tiếp cho gradient thuận tiện nên phân loại thường tối ưu cross-entropy rồi theo dõi accuracy hoặc F1.”

**Loss** là đại lượng được tối ưu khi học. **Metric** là chỉ số dùng đánh giá, như accuracy, F1 hoặc MAE. Chúng có thể giống nhau nhưng không bắt buộc.

MSE là trung bình bình phương sai số, thường dùng cho hồi quy. Với phân loại một nhãn đúng, cross-entropy của một mẫu là `−log(p_nhãn_đúng)`. Gán xác suất 0,9 cho nhãn đúng bị phạt ít hơn 0,1.

**Bẫy:** Một số thư viện nhận logits và tự tính sigmoid/softmax bên trong loss để ổn định số học; không áp dụng thêm lần nữa theo thói quen.

## II. Mạng học bằng cách nào?

### DL09 [A] Đạo hàm và gradient có ý nghĩa trực giác gì?

**Trả lời miệng:** “Gradient cho biết loss nhạy thế nào với từng tham số. Trong gradient descent, ta cập nhật ngược chiều gradient để tìm giá trị có loss thấp hơn. Đây là thông tin cục bộ, không bảo đảm tìm được nghiệm tốt nhất toàn cục.”

Đạo hàm cho biết đầu ra thay đổi cục bộ ra sao khi thay đổi một biến. Gradient là tập các đạo hàm riêng theo nhiều tham số. Với bước đủ nhỏ, gradient chỉ hướng tăng nhanh nhất theo chuẩn Euclid; hướng âm gradient là hướng giảm cục bộ.

Ví dụ `L(w)=w²` thì `dL/dw=2w`. Tại `w=3`, gradient là 6: giảm w một chút sẽ làm loss giảm.

**Hỏi tiếp:** Gradient bằng 0 có chắc tối ưu tốt nhất? → Không; có thể là cực tiểu cục bộ, cực đại hoặc điểm yên ngựa.

### DL10 [A] Backpropagation là gì? Khác optimizer ở đâu?

**Trả lời miệng:** “Backpropagation là thuật toán tính gradient qua mạng bằng quy tắc dây chuyền. Nó không tự quyết định cách cập nhật trọng số. Optimizer như SGD hay Adam nhận gradient đó và thực hiện cập nhật theo quy tắc riêng.”

Backpropagation tính gradient của loss theo tham số bằng **quy tắc dây chuyền**: tác động qua nhiều phép biến đổi được ghép từ đạo hàm của từng bước. Tính từ cuối về đầu giúp tái sử dụng kết quả trung gian hiệu quả.

Ví dụ nếu `u=2w`, `L=u²` thì `dL/dw=(dL/du)(du/dw)=2u×2`. Backprop làm ý tưởng tương tự trên mạng lớn.

**Hỏi tiếp:** Forward có cần lưu gì không? → Thường cần các giá trị trung gian phục vụ tính gradient; đây là một phần lý do huấn luyện tốn bộ nhớ.

### DL11 [A] Gradient descent cập nhật trọng số thế nào?

**Trả lời miệng:** “Gradient descent điều chỉnh tham số ngược chiều gradient. Learning rate quyết định độ lớn bước đi. Em lặp quá trình dự đoán, tính loss, lấy gradient rồi cập nhật; một bước quá lớn hoặc gradient từ batch nhiễu không bảo đảm giảm loss toàn bộ dữ liệu.”

Công thức cơ bản: `w_mới = w_cũ − η × gradient`, với `η` là learning rate. Bias cũng được cập nhật tương tự.

Ví dụ trọng số 2, gradient 3 và learning rate 0,1 thì trọng số mới là 1,7. Nếu gradient âm, việc trừ gradient làm trọng số tăng. Mục tiêu là giảm loss, không phải làm mọi trọng số nhỏ đi.

**Hỏi tiếp:** Tăng trọng số có phải học sai? → Không; hướng cập nhật phụ thuộc tác động của trọng số lên loss.

### DL12 [A] Batch, step và epoch khác nhau thế nào?

**Trả lời miệng:** “Batch là nhóm mẫu, step là lần cập nhật, epoch là lượt đi qua tập train. Batch size lớn hơn thường làm số step trong một epoch ít đi, nhưng không có nghĩa việc học tự động tốt hơn.”

**Batch** là nhóm mẫu được xử lý cùng nhau. **Step** thường là một lần cập nhật tham số. **Epoch** là một lượt qua toàn bộ tập train. Trong cách học thông thường, một batch dẫn tới một step; gradient accumulation có thể làm quan hệ này khác đi.

Ví dụ 1.000 mẫu, batch size 100: 10 step mỗi epoch, 5 epoch có 50 step. Nếu có 1.050 mẫu và giữ batch cuối thì có 11 step mỗi epoch.

**Hỏi tiếp:** Batch cuối có luôn đủ kích thước? → Không; có thể nhỏ hơn hoặc bị bỏ, tùy cấu hình.

### DL13 [A] Learning rate là gì, quá lớn hoặc quá nhỏ thì sao?

**Trả lời miệng:** “Learning rate quyết định độ mạnh của mỗi lần cập nhật, là siêu tham số quan trọng. Em theo dõi diễn biến train và validation để điều chỉnh; không có một giá trị tốt nhất cho mọi mô hình.”

Learning rate là hệ số điều khiển bước cập nhật. Quá lớn có thể khiến tham số dao động, loss tăng hoặc xuất hiện giá trị không hợp lệ. Quá nhỏ có thể khiến học rất chậm, trông như mạng không học.

Hình dung đi xuống đồi: bước quá dài có thể vượt qua vùng thấp; bước quá ngắn mất nhiều thời gian. Đây chỉ là trực giác vì bề mặt loss thực tế có rất nhiều chiều.

**Hỏi tiếp:** Loss tăng thì chắc learning rate quá lớn? → Không; còn có lỗi dữ liệu, loss, gradient hoặc cách ghi nhận số liệu.

### DL14 [A] Overfitting và underfitting xuất hiện thế nào trong DL?

**Trả lời miệng:** “Em so train và validation để phân biệt vấn đề. Train tốt nhưng validation kém gợi ý overfitting; cả hai kém có thể do thiếu năng lực hoặc tối ưu chưa tốt. Cách xử lý phụ thuộc nguyên nhân, không phải cứ tăng số tầng.”

**Overfitting** là học quá sát train, kể cả nhiễu, nên tổng quát hóa kém. **Underfitting** là chưa học đủ quy luật, thường kém cả train lẫn validation. Mạng rất lớn vẫn có thể underfit nếu huấn luyện chưa tốt.

Ví dụ train loss tiếp tục giảm nhưng validation loss tăng kéo dài là dấu hiệu cần kiểm tra overfitting. Cũng phải xét khác biệt phân phối dữ liệu giữa hai tập.

**Hỏi tiếp:** Thêm epoch luôn giảm underfitting? → Không; nếu đặc trưng, nhãn, kiến trúc hoặc tối ưu sai thì cần sửa nguyên nhân.

### DL15 [A] Early stopping và checkpoint dùng để làm gì?

**Trả lời miệng:** “Early stopping giúp tránh học tiếp khi khả năng tổng quát hóa không cải thiện. Em theo dõi validation, lưu checkpoint tốt nhất và chỉ dùng test để đánh giá cuối.”

**Early stopping** dừng huấn luyện khi chỉ số validation không cải thiện theo quy tắc đã chọn. **Patience** thường là số lần đánh giá liên tiếp cho phép không cải thiện. **Checkpoint** là bản lưu trạng thái mô hình; nên giữ bản tốt nhất theo chỉ số phù hợp.

Ví dụ validation loss tốt nhất ở epoch 8, sau đó xấu dần. Huấn luyện dừng ở epoch 11 không có nghĩa phải dùng mô hình epoch 11; có thể khôi phục epoch 8.

**Hỏi tiếp:** Một epoch xấu hơn có cần dừng ngay? → Không nhất thiết; chỉ số có nhiễu, nên dùng patience hoặc tiêu chí phù hợp.

### DL16 [A] Data augmentation là gì? Có biến đổi nào cũng dùng được?

**Trả lời miệng:** “Augmentation tạo các biến thể hợp lệ của dữ liệu huấn luyện để tăng tính đa dạng và giảm overfitting. Em chọn biến đổi giữ đúng nhãn, chứ không tăng dữ liệu bằng mọi cách.”

Augmentation tạo biến thể dữ liệu train mà vẫn giữ ý nghĩa nhãn, nhằm tăng sự đa dạng mà mô hình thấy. Ví dụ thay đổi độ sáng vừa phải khi nhận diện đồ vật có thể giúp mô hình ít phụ thuộc ánh sáng.

Phép biến đổi phải phù hợp bài toán: xoay số 6 có thể thành số 9; lật ảnh chứa chữ có thể tạo dữ liệu vô nghĩa. Với detection, thay đổi ảnh còn phải cập nhật hộp giới hạn tương ứng.

**Hỏi tiếp:** Có tạo thông tin hoàn toàn mới như thu thập dữ liệu thật không? → Không; augmentation khai thác các bất biến giả định của dữ liệu hiện có.

### DL17 [A] Vì sao vẫn phải chia train, validation và test?

**Trả lời miệng:** “Em chia dữ liệu trước các thao tác có thể gây rò rỉ, và giữ test độc lập với việc lựa chọn mô hình. Dữ liệu thời gian hoặc theo nhóm cần cách chia phản ánh tình huống sử dụng thật.”

DL không bỏ qua nguyên tắc đánh giá của ML. Train học tham số; validation chọn cấu hình, epoch hoặc ngưỡng; test đánh giá cuối. Các mẫu gần như trùng nhau hoặc cùng một người cần được chia cẩn thận theo nhóm.

Ví dụ ảnh của cùng bệnh nhân xuất hiện cả train và test có thể khiến mô hình ghi nhớ đặc điểm người đó, làm điểm cao hơn khả năng áp dụng lên bệnh nhân mới. Tạo bản augmentation rồi chia ngẫu nhiên cũng có thể rò rỉ bản gần trùng.

**Hỏi tiếp:** Test cao chứng minh dùng thực tế luôn tốt? → Không; môi trường mới có thể khác phân phối.

### DL18 [A] Hãy kể toàn bộ một vòng huấn luyện mạng

**Trả lời miệng:** “Em chuẩn bị batch, tính dự đoán và loss, lấy gradient bằng backprop rồi cập nhật bằng optimizer. Em lặp qua các batch và epoch, định kỳ đánh giá validation để theo dõi tổng quát hóa. Cuối cùng chọn checkpoint rồi đánh giá test.”

Trong mỗi batch: bật chế độ train, xóa gradient cũ khi cần, forward, tính loss, backprop rồi optimizer step. Sau một khoảng học, chuyển sang chế độ eval để đo validation và lưu checkpoint phù hợp.

Xóa gradient cũ cần thiết trong các thư viện mặc định cộng dồn gradient. Khi cố ý gradient accumulation thì phải xử lý theo kế hoạch, không xóa sau mọi microbatch.

**Hỏi tiếp:** Validation có cập nhật trọng số không? → Trong quy trình thông thường, không; đồng thời cần đúng chế độ eval và tắt theo dõi gradient để tiết kiệm tài nguyên.

## III. Huấn luyện tốt hơn và chọn kiến trúc

### DL19 [B] Vì sao không khởi tạo mọi trọng số bằng 0?

**Trả lời miệng:** “Khởi tạo ảnh hưởng việc tín hiệu và gradient đi qua mạng. Em cần phá đối xứng giữa các nơ-ron và tránh giá trị quá lớn hoặc quá nhỏ. Không nên đặt mọi trọng số ở tầng ẩn về cùng một giá trị.”

Các nơ-ron cùng tầng có cùng trọng số và bias sẽ nhận cùng tín hiệu và có thể được cập nhật giống nhau, không học những đặc trưng khác nhau. Khởi tạo ngẫu nhiên thích hợp giúp phá đối xứng và giữ độ lớn tín hiệu hợp lý qua các tầng.

Ví dụ hai nơ-ron ẩn giống hệt nhau có thể mãi làm cùng một công việc. Các cách như Xavier hoặc He chọn độ lớn khởi tạo dựa trên kích thước tầng và activation.

**Bẫy:** Bias bằng 0 thường vẫn dùng được; vấn đề không phải mọi tham số đều tuyệt đối cấm khởi tạo 0.

### DL20 [B] Vanishing và exploding gradient là gì?

**Trả lời miệng:** “Vanishing và exploding gradient là gradient suy giảm hoặc tăng quá mức khi truyền qua mạng. Có thể xử lý bằng khởi tạo, activation và kiến trúc phù hợp; gradient clipping hữu ích khi gradient quá lớn.”

Khi backprop qua nhiều phép biến đổi, gradient có thể trở nên rất nhỏ (**vanishing**) hoặc rất lớn (**exploding**). Gradient quá nhỏ làm các tầng khó học; quá lớn gây cập nhật không ổn định.

Trực giác: nhân 0,1 mười lần được số rất nhỏ; nhân 10 mười lần được số rất lớn. Gradient thực tế là phép tính ma trận phức tạp hơn ví dụ này.

**Hỏi tiếp:** Gradient clipping làm gì? → Giới hạn độ lớn gradient theo một quy tắc, thường theo norm. Nó không sửa mọi nguyên nhân huấn luyện hỏng.

### DL21 [B] Batch gradient descent, SGD, mini-batch và Adam khác nhau?

**Trả lời miệng:** “Mini-batch cân bằng giữa tài nguyên và độ nhiễu của gradient. SGD cập nhật theo gradient, có thể kèm momentum. Adam thích nghi bước cập nhật theo thống kê gradient, nhưng vẫn cần chọn learning rate.”

Full-batch dùng toàn bộ train cho một gradient; SGD theo nghĩa chặt dùng một mẫu; mini-batch dùng một nhóm mẫu. Thực tế tên “SGD” trong thư viện thường chỉ optimizer được chạy với mini-batch.

Adam dùng các trung bình trượt của gradient và bình phương gradient để điều chỉnh cập nhật theo từng tham số. Nó thường tiện dùng nhưng không bảo đảm tốt nhất mọi bài toán.

**Ví dụ:** 10.000 ảnh có thể được chia thành batch 32 thay vì giữ toàn bộ ảnh trong GPU cho một bước.

**Hỏi tiếp:** Dùng Adam là khỏi chỉnh learning rate? → Không.

### DL22 [B] L2 và dropout giảm overfitting thế nào?

**Trả lời miệng:** “Regularization hạn chế cách mô hình khớp dữ liệu. L2 phạt độ lớn trọng số; dropout tạo nhiễu có kiểm soát khi train. Chúng có thể giảm overfitting nhưng dùng quá mạnh cũng làm mô hình thiếu khớp.”

Phạt L2 thêm một lượng tỷ lệ với tổng bình phương trọng số vào mục tiêu, khuyến khích trọng số không quá lớn. Dropout ngẫu nhiên bỏ một phần đầu ra đơn vị trong lúc train để giảm phụ thuộc quá mức giữa các đơn vị.

Ví dụ dropout rate 0,2 nghĩa là mỗi đơn vị được xét có xác suất bị bỏ 20% trong mỗi lần áp dụng, không phải xóa vĩnh viễn 20% mạng.

**Bẫy:** Khi suy luận thông thường, dropout tắt. Với Adam, L2 trong loss và weight decay tách rời như AdamW không hoàn toàn tương đương.

### DL23 [B] Batch normalization làm gì? Train và eval khác nhau ra sao?

**Trả lời miệng:** “Batch normalization chuẩn hóa activation trong mạng và có tham số học được. Hành vi train và eval khác nhau nên phải đặt đúng chế độ. Nó khác chuẩn hóa dữ liệu đầu vào và không thay thế việc xử lý dữ liệu đúng.”

Batch normalization chuẩn hóa các activation theo thống kê được tính trên những chiều thích hợp của mini-batch, rồi dùng hệ số co giãn và dịch chuyển được học. Nó thường giúp tối ưu ổn định hơn.

Trong cấu hình thông thường, lúc train nó dùng thống kê batch và cập nhật thống kê chạy; lúc eval dùng thống kê chạy đã lưu. Ví dụ quên chuyển eval có thể khiến dự đoán một ảnh phụ thuộc các ảnh khác cùng batch.

**Hỏi tiếp:** Gọi eval có tự tắt tính gradient? → Trong PyTorch, không; chế độ module và theo dõi gradient là hai cơ chế riêng.

### DL24 [B] CNN và phép tích chập là gì?

**Trả lời miệng:** “CNN khai thác cấu trúc cục bộ bằng tích chập và chia sẻ trọng số. Nhờ vậy mạng có thể phát hiện cùng một kiểu mẫu ở các vị trí khác nhau mà không cần một bộ trọng số riêng cho từng vị trí.”

CNN dùng các bộ lọc nhỏ (**kernel/filter**) trượt trên dữ liệu để phát hiện mẫu cục bộ. Cùng trọng số bộ lọc được dùng ở nhiều vị trí, gọi là chia sẻ trọng số. Đầu ra ghi phản ứng tại các vị trí thành **feature map**.

Ví dụ một bộ lọc có thể phản ứng mạnh với cạnh dọc trong ảnh. Trong lớp tích chập tiêu chuẩn, bộ lọc trải qua các kênh đầu vào; nhiều bộ lọc tạo nhiều kênh đầu ra.

**Bẫy:** Tích chập không bảo đảm mạng hoàn toàn bất biến với mọi phép dịch hoặc xoay ảnh.

### DL25 [B] Kernel size, stride, padding và pooling là gì?

**Trả lời miệng:** “Các tham số này điều khiển vùng mạng nhìn và kích thước feature map. Stride lớn hoặc pooling thường giảm độ phân giải; padding có thể giữ thêm thông tin ở biên. Giảm kích thước cũng có thể mất chi tiết.”

**Kernel size** là kích thước cửa sổ; **stride** là bước di chuyển; **padding** thêm phần biên; **pooling** tóm tắt một vùng, thường bằng max hoặc trung bình.

Ví dụ max pooling 2×2 biến vùng `[[1,3],[2,4]]` thành 4. Với tích chập một chiều không dilation, kích thước đầu ra là `floor((N+2P−K)/S)+1`. Ảnh rộng 5, kernel 3, padding 0, stride 1 cho đầu ra rộng 3.

**Hỏi tiếp:** Pooling có trọng số cần học không? → Max/average pooling thông thường không có.

### DL26 [B] RNN và LSTM dùng cho điều gì?

**Trả lời miệng:** “RNN phù hợp dữ liệu chuỗi vì có trạng thái truyền theo thời gian. LSTM là biến thể dùng cơ chế cổng để hỗ trợ giữ thông tin dài hơn và giảm một số khó khăn của RNN cơ bản.”

RNN xử lý chuỗi bằng cách mang một **trạng thái ẩn** từ bước trước sang bước sau. Trạng thái giống một bản tóm tắt những gì đã đọc. Mạng dùng chung tham số qua các bước thời gian.

Ví dụ dự đoán từ tiếp theo cần thông tin từ các từ trước. RNN cơ bản khó học phụ thuộc xa; LSTM dùng các cổng để điều khiển giữ, cập nhật và đọc thông tin trong bộ nhớ.

**Bẫy:** LSTM không bảo đảm nhớ hoàn hảo mọi thông tin xa, và không phải lựa chọn tốt nhất cho mọi chuỗi.

### DL27 [B] Embedding là gì?

**Trả lời miệng:** “Embedding là biểu diễn vector được học cho đối tượng. Nó giúp mạng xử lý những đối tượng như từ hoặc sản phẩm bằng các đặc trưng liên tục. Ta có thể học embedding từ đầu hoặc dùng biểu diễn đã được huấn luyện.”

Embedding biểu diễn một đối tượng rời rạc như từ hoặc mã sản phẩm bằng vector số được học. Khác one-hot rất dài và thưa, embedding thường ngắn hơn và có các giá trị liên tục.

Ví dụ mỗi từ được ánh xạ thành vector 128 số để mạng xử lý. Các vector có thể phản ánh quan hệ hữu ích cho nhiệm vụ, nhưng “gần nhau” nghĩa gì còn phụ thuộc cách học và phép đo.

**Hỏi tiếp:** Mỗi từ luôn có một vector cố định? → Không; embedding theo ngữ cảnh có thể thay đổi theo câu chứa từ đó.

### DL28 [B] Pretraining, transfer learning, fine-tuning và freezing là gì?

**Trả lời miệng:** “Transfer learning tận dụng mô hình đã học để giảm nhu cầu dữ liệu hoặc tính toán. Em có thể đóng băng phần nền và học tầng mới, hoặc fine-tune với learning rate phù hợp. Hiệu quả phụ thuộc mức liên quan giữa dữ liệu cũ và mới.”

**Pretraining** là huấn luyện trước trên một nhiệm vụ hoặc bộ dữ liệu. **Transfer learning** dùng kiến thức đã học cho nhiệm vụ khác. **Fine-tuning** tiếp tục cập nhật một phần hoặc toàn bộ tham số trên dữ liệu nhiệm vụ mới. **Freezing** giữ nguyên tham số được chọn.

Ví dụ dùng mạng đã học ảnh, thay tầng phân loại cho các loài hoa rồi học tầng mới; sau đó có thể mở thêm tầng để fine-tune.

**Bẫy:** Đóng băng gradient tham số không tự bảo đảm thống kê chạy của BatchNorm ngừng thay đổi; cần cấu hình chế độ phù hợp.

### DL29 [B] Vì sao DL thường dùng GPU và dễ hết bộ nhớ?

**Trả lời miệng:** “GPU giúp tăng tốc các phép toán song song. Huấn luyện thường tốn bộ nhớ hơn suy luận vì cần giữ thông tin cho backprop và optimizer. Em có thể giảm batch, kích thước đầu vào hoặc dùng kỹ thuật phù hợp để giảm bộ nhớ.”

Mạng thực hiện nhiều phép nhân ma trận có thể tính song song, phù hợp GPU. Bộ nhớ lúc train không chỉ chứa trọng số mà còn activation, gradient, dữ liệu batch và trạng thái optimizer.

Ví dụ tăng batch size hoặc độ phân giải ảnh có thể làm bộ nhớ tăng mạnh dù số tham số không đổi. Giảm batch size thường là cách xử lý đầu tiên khi hết bộ nhớ.

**Hỏi tiếp:** GPU luôn nhanh hơn CPU? → Không; bài toán nhỏ, truyền dữ liệu hoặc triển khai chưa tốt có thể làm lợi ích thấp.

### DL30 [B] Nếu mạng không học, bạn kiểm tra gì trước?

**Trả lời miệng:** “Em kiểm tra dữ liệu và quy trình trước khi tăng độ phức tạp. Em xem loss, gradient, dự đoán thật và thử overfit một tập nhỏ. Sau đó mới điều chỉnh learning rate, kiến trúc hoặc regularization theo bằng chứng.”

Kiểm tra dữ liệu và nhãn, shape đầu ra, activation/loss phù hợp, thang đo, learning rate, gradient có được tính và optimizer có thực sự cập nhật không. So với một baseline đơn giản để có mốc đánh giá.

Một phép thử hữu ích là cho mạng khớp một tập rất nhỏ. Nếu ngay vài mẫu cũng không học được, có thể có lỗi pipeline hoặc tối ưu; đây không phải chứng minh chắc chắn nguyên nhân.

**Hỏi tiếp:** Chỉ nhìn accuracy có đủ? → Không; cần xem loss, phân bố nhãn, confusion matrix và các ví dụ sai.

## IV. Khái niệm mở rộng để nhận diện

### DL31 [C] Attention và self-attention là gì?

**Trả lời miệng:** “Self-attention cho phép mỗi vị trí kết hợp thông tin từ các vị trí khác trong cùng chuỗi theo mức liên quan được học. Query và key tạo trọng số, rồi các trọng số dùng tổng hợp value.”

Attention kết hợp thông tin bằng cách cho mỗi phần một trọng số liên quan đến câu hỏi đang xét. **Query** thể hiện điều đang tìm, **key** dùng so mức liên quan, **value** là thông tin được tổng hợp. Trong self-attention, các vai trò này được tạo từ cùng chuỗi đầu vào.

Ví dụ khi biểu diễn một từ, mạng có thể dùng nhiều thông tin từ những từ liên quan trong câu, thay vì chỉ giữ một trạng thái tuần tự.

**Bẫy:** Trọng số attention không tự động là lời giải thích đáng tin cậy về nguyên nhân mô hình dự đoán.

### DL32 [C] Transformer khác RNN thế nào? Vì sao cần thông tin vị trí?

**Trả lời miệng:** “Transformer dùng attention để trao đổi thông tin giữa vị trí. Nó cần thông tin vị trí để biểu diễn thứ tự. Mô hình sinh tự hồi quy vẫn tạo token lần lượt khi sử dụng, dù huấn luyện có thể xử lý nhiều vị trí song song.”

Transformer kết hợp attention, các mạng feed-forward, residual connection và normalization. Nó không cần cập nhật trạng thái tuần tự kiểu RNN trong mỗi lớp. Khi huấn luyện, nhiều vị trí có thể được xử lý song song, tùy kiến trúc và mask.

Attention thuần không tự thể hiện thứ tự như RNN, nên cần cơ chế vị trí, ví dụ positional encoding. “Chó cắn người” và “người cắn chó” có cùng các từ nhưng khác nghĩa.

**Hỏi tiếp:** Causal mask làm gì? → Ngăn vị trí dùng thông tin từ token tương lai trong nhiệm vụ tự hồi quy.

### DL33 [C] Learning-rate schedule và warmup là gì?

**Trả lời miệng:** “Learning-rate schedule cho phép thay đổi độ lớn bước cập nhật trong quá trình học. Warmup tăng dần từ bước nhỏ ở đầu; về sau có thể giảm learning rate để tinh chỉnh. Đây là cấu hình cần kiểm tra trên validation.”

**Schedule** thay learning rate theo thời gian hoặc tín hiệu huấn luyện. Có thể giảm từng bậc, giảm trơn hoặc giảm khi validation không cải thiện. **Warmup** bắt đầu nhỏ rồi tăng dần trong giai đoạn đầu để hỗ trợ ổn định.

Ví dụ học với bước tương đối lớn ban đầu, rồi giảm để tinh chỉnh. Tuy nhiên lịch phù hợp phụ thuộc optimizer, số bước và mô hình; không phải công thức chung đảm bảo hội tụ.

**Hỏi tiếp:** Schedule có thay optimizer không? → Không; nó điều chỉnh learning rate mà optimizer sử dụng.

### DL34 [C] Residual connection giúp gì cho mạng sâu?

**Trả lời miệng:** “Residual connection cộng đầu vào với đầu ra của một khối. Nó hỗ trợ truyền thông tin và gradient, giúp huấn luyện mạng sâu. Nếu shape khác nhau thì cần phép chiếu hoặc cách điều chỉnh phù hợp trước khi cộng.”

Residual connection đưa đầu vào qua một nhánh tắt và cộng với kết quả một khối: `y=x+F(x)`. Khối chỉ cần học phần điều chỉnh `F(x)` thay vì toàn bộ ánh xạ từ đầu.

Ví dụ nếu khối hiện tại chưa tạo cải thiện, `F(x)` gần 0 vẫn giữ được đường truyền x. Kết nối này tạo thêm đường cho tín hiệu và gradient, giúp tối ưu mạng sâu dễ hơn trong nhiều trường hợp.

**Bẫy:** Residual không loại bỏ mọi vấn đề vanishing gradient và không bảo đảm mô hình càng sâu càng tốt.

### DL35 [C] Inference là gì? Dự đoán xác suất cao có chắc đúng?

**Trả lời miệng:** “Inference dùng mô hình đã học để dự đoán. Em không coi điểm softmax cao là chắc đúng; cần đánh giá trên dữ liệu phù hợp, xem calibration và theo dõi thay đổi dữ liệu thực tế.”

**Inference** là dùng mô hình đã học để tạo đầu ra, thông thường không cập nhật trọng số. Cần giữ tiền xử lý nhất quán với lúc học và đặt đúng chế độ mạng.

Giá trị softmax cao thể hiện mức tự tin theo mô hình, không phải bảo chứng đúng. Mô hình có thể tự tin sai, đặc biệt với dữ liệu khác phân phối. **Calibration** xét sự phù hợp giữa xác suất dự đoán và tần suất đúng quan sát được.

**Hỏi tiếp:** Accuracy 90% có nghĩa mọi dự đoán đều có xác suất đúng 90%? → Không; đó là tỷ lệ đúng tổng thể trên một tập cụ thể.

## V. Năm bài tự kiểm tra có lời giải

### Bài 1: Tự đi một bước học

Mô hình hồi quy `ŷ=wx+b`, không activation. Cho `x=2`, `y=5`, `w=1`, `b=0`, loss `L=(ŷ−y)²`, learning rate 0,1. Tính dự đoán, loss, gradient và tham số mới.

**Lời giải:** `ŷ=2`, `L=9`. Gradient theo w là `2(ŷ−y)x=−12`; theo b là `2(ŷ−y)=−6`. Cập nhật đồng thời từ tham số cũ: `w_mới=2,2`, `b_mới=0,6`. Dự đoán mới cho chính mẫu này là 5, loss bằng 0. Đây là trường hợp số được chọn đơn giản; không suy ra một bước luôn khớp hoàn hảo. Nếu loss có hệ số 1/2 thì gradient sẽ khác.

### Bài 2: Chọn tầng đầu ra và loss

Chọn cấu hình thông thường cho: (a) spam/không spam; (b) một chữ số 0–9; (c) ảnh có thể đồng thời có người, xe, chó; (d) dự đoán nhiệt độ.

**Lời giải:** (a) Một logit, binary cross-entropy, sigmoid khi cần xác suất. (b) 10 logits, cross-entropy multiclass, softmax khi cần xác suất. (c) Ba logits, binary cross-entropy theo từng nhãn, sigmoid riêng. (d) Một đầu ra tuyến tính và loss hồi quy như MSE/MAE. Cần đọc API để biết loss nhận logits hay xác suất.

### Bài 3: Đếm step

Có 1.030 mẫu, batch size 128, train 3 epoch. Không gradient accumulation. Bao nhiêu step nếu giữ hoặc bỏ batch cuối?

**Lời giải:** `1.030 = 8×128 + 6`. Giữ batch cuối: 9 step/epoch, tổng 27; batch cuối có 6 mẫu. Bỏ batch cuối: 8 step/epoch, tổng 24; mỗi epoch bỏ 6 mẫu theo cách chia của epoch đó. Không phải cứ 3 epoch là 3 lần cập nhật.

### Bài 4: Đọc đường học

Qua 5 epoch, train loss là `[0,8; 0,5; 0,3; 0,2; 0,1]`, validation loss là `[0,9; 0,6; 0,45; 0,55; 0,7]`. Bạn nhận xét gì và chọn checkpoint nào nếu tiêu chí là validation loss thấp nhất?

**Lời giải:** Chọn epoch 3 trong số các checkpoint đã quan sát. Train tiếp tục tốt lên trong khi validation xấu đi gợi ý overfitting. Có thể cân nhắc early stopping, regularization hoặc dữ liệu; đồng thời kiểm tra tính phù hợp của cách chia. Không dùng test để quyết định epoch và không kết luận chỉ một dao động nhỏ đã là overfit.

### Bài 5: Chọn cách bắt đầu bài toán

Bạn có (a) 800 ảnh hoa có nhãn; (b) dữ liệu bảng 1.000 dòng; (c) văn bản cần phân loại. Có nên xây mạng rất sâu từ đầu cho cả ba?

**Lời giải:** (a) Cân nhắc mô hình ảnh pretrained và augmentation phù hợp. (b) Thử baseline đơn giản hoặc mô hình cây trước; DL chưa chắc có lợi. (c) Có thể thử biểu diễn văn bản đơn giản hoặc mô hình ngôn ngữ pretrained tùy tài nguyên. Đây là điểm xuất phát, không phải luật chọn tuyệt đối; quyết định bằng đánh giá đúng cách trên validation.

## VI. Sơ đồ quy trình để kể lại khi vấn đáp

```text
Xác định bài toán và metric
    → Kiểm tra dữ liệu, nhãn, chia train/validation/test
    → Tiền xử lý và chọn kiến trúc, loss, optimizer
    → Trong mỗi batch: forward → loss → backprop → update
    → Định kỳ: eval trên validation → chọn checkpoint/cấu hình
    → Chốt lựa chọn → đánh giá test
    → Inference với tiền xử lý và chế độ phù hợp
```

Train và validation có vai trò khác nhau: train loss cho thấy mức tối ưu trên bài đã học; validation giúp đánh giá khả năng tổng quát hóa và lựa chọn mô hình. Test chỉ phát huy vai trò đánh giá độc lập khi không được dùng để điều chỉnh các lựa chọn trước đó.

## VII. Từ điển Anh–Việt ngắn

| Thuật ngữ | Nghĩa cần nhớ |
|---|---|
| Tensor / shape | Mảng nhiều chiều / kích thước từng chiều |
| Weight / bias | Trọng số / hệ số dịch chuyển được học |
| Hidden layer | Tầng trung gian giữa đầu vào và đầu ra |
| Activation | Hàm kích hoạt, thường tạo tính phi tuyến |
| Logit | Điểm số trước chuẩn hóa thành xác suất |
| Forward pass | Tính từ đầu vào đến dự đoán |
| Loss / metric | Mục tiêu tối ưu / chỉ số đánh giá |
| Gradient | Các đạo hàm riêng theo tham số |
| Backpropagation | Tính gradient qua mạng bằng quy tắc dây chuyền |
| Optimizer | Quy tắc cập nhật tham số |
| Learning rate | Hệ số độ lớn bước cập nhật |
| Batch / step / epoch | Nhóm mẫu / bước cập nhật / lượt qua train |
| Checkpoint | Bản lưu trạng thái mô hình |
| Regularization | Cách hạn chế khớp quá mức |
| Augmentation | Tạo biến thể dữ liệu hợp lệ |
| Feature map / channel | Bản đồ đặc trưng / kênh |
| Embedding | Biểu diễn vector được học |
| Fine-tuning / freezing | Học tiếp / giữ nguyên tham số được chọn |
| Inference | Dùng mô hình để dự đoán |
| Calibration | Mức phù hợp giữa xác suất dự đoán và tần suất đúng |

**Tự chốt:** Nếu chưa nhìn tài liệu mà kể được dữ liệu đi qua mạng thế nào, loss dẫn tới cập nhật ra sao và vì sao phải dùng validation, bạn đã nắm trục chính để nối các khái niệm còn lại.
