# Machine Learning: Từ số 0 đến trả lời vấn đáp

Tài liệu gồm **35 câu ML01–ML35**, đi theo một quy trình học máy thay vì yêu cầu học thuộc các định nghĩa rời rạc. Đây là kiến thức nền và câu hỏi luyện tập, không phải dự đoán đề của thầy.

**[A] - 18 câu nền tảng:** hiểu trước, nói lại được bằng lời của mình. **[B] - 12 câu mở rộng:** nối các ý và phân biệt thuật toán. **[C] - 5 câu nhận diện:** biết ý tưởng, chưa cần suy diễn toán học tối nay.

## Bản đồ khái niệm và đường đọc

**Bài toán → dữ liệu → chia tập → tiền xử lý → mô hình → hàm mất mát → huấn luyện → đánh giá → sử dụng và theo dõi.**

Ví dụ xuyên suốt: muốn dự đoán giá nhà, ta thu thập diện tích, vị trí và giá bán; chia dữ liệu; xử lý giá trị thiếu; học quan hệ giữa đặc trưng và giá; đánh giá sai số trên nhà chưa dùng để học. Với email spam, quy trình tương tự nhưng đầu ra là lớp spam/không spam, nên thước đo cũng khác.

- **Lượt A:** ML01, ML02, ML04, ML06, ML07, ML08, ML11, ML13, ML15, ML16, ML18, ML19, ML20, ML22, ML29, ML30, ML33, ML34.
- **Lượt B:** ML03, ML05, ML09, ML10, ML12, ML14, ML17, ML21, ML23, ML24, ML27, ML31.
- **Lượt C:** ML25, ML26, ML28, ML32, ML35.

Đọc giải thích và ví dụ, che phần trả lời rồi nói trong 20–45 giây. Mẫu trả lời là khung diễn đạt; không cần thuộc nguyên văn. Khi gặp thuật ngữ mới, đọc nghĩa ngay trong câu trước khi chuyển tiếp.

## I. Hiểu bài toán trước khi học thuật toán

### ML01 [A] Machine Learning là gì? Khác viết quy tắc thủ công thế nào?

Học máy xây dựng mô hình từ dữ liệu để dự đoán hoặc tìm cấu trúc. Với chương trình thông thường, người viết có thể đặt quy tắc “email chứa từ X thì chặn”. Với ML, thuật toán dùng nhiều email và đáp án để học các quan hệ hữu ích. Con người vẫn phải xác định mục tiêu, chuẩn bị dữ liệu và kiểm tra kết quả.

**Ví dụ:** thay vì tự đặt giá tăng bao nhiêu cho mỗi mét vuông, mô hình ước lượng quan hệ từ dữ liệu giao dịch nhà.

**Trả lời miệng:** “Machine Learning là cách cho mô hình học quy luật từ dữ liệu để dự đoán hoặc tìm cấu trúc. Điểm khác với viết toàn bộ quy tắc thủ công là các tham số của mô hình được điều chỉnh từ dữ liệu. Mục tiêu quan trọng là làm tốt cả trên dữ liệu mới.”

**Hỏi tiếp:** Máy có tự hiểu mọi thứ không? → Không; kết quả phụ thuộc dữ liệu, mục tiêu và các giả định của mô hình.

### ML02 [A] Feature, label, sample và model là gì?

Một **sample** là một trường hợp quan sát. **Feature** là thuộc tính đầu vào. **Label/target** là đáp án cần học trong bài toán có giám sát. **Model** là hàm nhận đặc trưng và tạo dự đoán.

**Ví dụ:** một căn nhà là một sample; diện tích, số phòng, quận là features; giá bán là target. Trong bảng dữ liệu, mỗi hàng thường là một sample, nhưng cách tổ chức này không bắt buộc với mọi loại dữ liệu.

**Trả lời miệng:** “Feature là thông tin dùng để dự đoán, label là đáp án mục tiêu, còn sample là một quan sát. Mô hình học cách ánh xạ từ feature sang dự đoán. Ví dụ dùng diện tích và vị trí của từng căn nhà để dự đoán giá bán.”

**Bẫy:** đưa giá bán thực tế vào đầu vào khi đang dự đoán chính giá đó sẽ làm bài toán trở nên giả tạo; khi sử dụng thật không có thông tin này.

### ML03 [B] Parameter khác hyperparameter thế nào?

**Parameter - tham số** được học trong huấn luyện, như trọng số trong hồi quy tuyến tính. **Hyperparameter - siêu tham số** là cấu hình điều khiển mô hình hoặc quá trình học, như số hàng xóm K, độ sâu tối đa của cây hoặc learning rate.

**Ví dụ:** với `giá = w × diện_tích + b`, thuật toán học w và b. Nếu giới hạn cây quyết định chỉ được sâu 5 tầng, số 5 là siêu tham số.

**Trả lời miệng:** “Tham số được học từ tập train; siêu tham số là lựa chọn cấu hình cho mô hình hoặc quá trình học. Em thường thử siêu tham số dựa trên validation hoặc cross-validation, rồi dùng test để đánh giá cuối cùng.”

**Hỏi tiếp:** Siêu tham số có phải luôn do người chọn bằng tay không? → Không; tìm kiếm tự động vẫn có thể chọn chúng, nhưng phải tránh dùng test làm tiêu chí lựa chọn.

### ML04 [A] Học có giám sát gồm phân loại và hồi quy như thế nào?

Học có giám sát dùng các cặp đầu vào–đáp án. **Classification - phân loại** dự đoán lớp; **regression - hồi quy** dự đoán đại lượng số.

**Ví dụ:** dự đoán một căn nhà thuộc nhóm “rẻ/vừa/đắt” là phân loại; dự đoán giá 2,7 tỷ là hồi quy. Số phòng ghi bằng số nhưng nếu mục tiêu là loại nhà mã hóa 0, 1, 2 thì chưa chắc là hồi quy: cần xét ý nghĩa của đầu ra.

**Trả lời miệng:** “Học có giám sát dùng dữ liệu có nhãn. Phân loại dự đoán một trong các lớp, như spam hoặc không spam; hồi quy dự đoán giá trị số, như giá nhà. Cách chọn thuật toán, hàm mất mát và chỉ số đánh giá phụ thuộc loại đầu ra.”

**Hỏi tiếp:** Phân loại có thể trả về số 0,8 không? → Có, đó có thể là xác suất ước lượng cho một lớp, sau đó mới chuyển thành quyết định.

### ML05 [B] Không giám sát và tăng cường khác có giám sát ra sao?

**Unsupervised learning - học không giám sát** tìm cấu trúc khi không có nhãn mục tiêu, như phân cụm khách hàng. **Reinforcement learning - học tăng cường** cho một tác nhân chọn hành động, nhận phản hồi thưởng và học cách tăng tổng phần thưởng kỳ vọng theo thời gian.

**Ví dụ:** chia khách hàng thành nhóm theo hành vi là phân cụm. Một tác nhân học chơi trò chơi bằng điểm thưởng là học tăng cường. Phần thưởng có thể đến muộn sau nhiều hành động.

**Trả lời miệng:** “Học không giám sát tìm cấu trúc trong dữ liệu không có nhãn mục tiêu. Học tăng cường học cách hành động qua tương tác và phần thưởng. Nó khác học có giám sát vì không nhất thiết có sẵn đáp án đúng cho từng hành động.”

**Bẫy:** cụm khách hàng không tự mang ý nghĩa “tốt/xấu”; con người cần kiểm tra và diễn giải cấu trúc tìm được.

## II. Dữ liệu và cách đánh giá đáng tin cậy

### ML06 [A] Một dự án ML cơ bản gồm những bước nào?

Bắt đầu bằng câu hỏi sử dụng: dự đoán gì, lúc nào, sai loại nào gây hậu quả lớn? Sau đó thu thập và kiểm tra dữ liệu, chia tập, xây dựng tiền xử lý, huấn luyện baseline, thử cải tiến, đánh giá cuối và theo dõi khi sử dụng.

**Ví dụ:** dự đoán giá nhà trước khi giao dịch thì chỉ được dùng thông tin có trước giao dịch. “Giá sau đàm phán” có thể không dùng được dù có trong bảng dữ liệu lịch sử.

**Trả lời miệng:** “Em xác định bài toán và metric trước, kiểm tra dữ liệu, chia tập phù hợp, rồi xây dựng tiền xử lý và mô hình cơ sở. Em chọn cấu hình bằng validation, đánh giá cuối trên test và theo dõi hiệu quả khi triển khai.”

**Hỏi tiếp:** Có cần chọn mô hình phức tạp ngay không? → Không; baseline đơn giản giúp biết cải tiến có thực sự hữu ích hay không.

### ML07 [A] Train, validation và test có vai trò gì?

**Train** để học tham số. **Validation** để lựa chọn mô hình, cấu hình hoặc ngưỡng quyết định. **Test** để đánh giá cuối sau khi chốt cách làm. Ta muốn đo khả năng **tổng quát hóa**, tức làm tốt trên dữ liệu chưa dùng để phát triển mô hình.

**Ví dụ:** train như bài luyện; validation như đề thử dùng để điều chỉnh; test như đề cuối. Làm đi làm lại đề cuối để sửa cách học sẽ làm điểm cuối thiếu khách quan.

**Trả lời miệng:** “Ba tập có ba vai trò khác nhau: học, lựa chọn và đánh giá cuối. Nếu liên tục xem test để chỉnh mô hình thì mô hình đã gián tiếp được chọn theo test, khiến kết quả không còn là một đánh giá độc lập.”

**Hỏi tiếp:** Có bắt buộc chia 70/15/15 không? → Không; tỷ lệ tùy lượng dữ liệu và bài toán. Cách chia đúng quan trọng hơn thuộc một tỷ lệ cố định.

### ML08 [A] Data leakage là gì? Có những kiểu rò rỉ nào?

Rò rỉ xảy ra khi huấn luyện hoặc lựa chọn sử dụng thông tin không được phép có trong tình huống dự đoán thật, hoặc thông tin từ tập đánh giá.

**Ví dụ:** chuẩn hóa bằng trung bình toàn bộ dữ liệu trước khi chia; đưa bản sao của một ảnh vào cả train và test; dùng thông tin được tạo sau thời điểm cần dự đoán. Điểm kiểm tra có thể cao nhưng không tái hiện khi sử dụng thật.

**Trả lời miệng:** “Data leakage là thông tin không hợp lệ lọt vào quá trình phát triển mô hình. Em chia dữ liệu phù hợp trước và chỉ học các bước tiền xử lý từ train; đồng thời kiểm tra trùng lặp, thời gian và các đặc trưng chứa đáp án.”

**Hỏi tiếp:** Dùng nhãn test để huấn luyện mới là leakage? → Không; dùng đặc trưng tương lai hoặc thống kê toàn bộ dữ liệu cũng có thể gây rò rỉ.

### ML09 [B] Cross-validation dùng để làm gì?

K-fold cross-validation chia dữ liệu phát triển thành K phần. Mỗi lượt dùng một phần đánh giá, các phần còn lại huấn luyện; tổng hợp kết quả qua K lượt để so sánh cấu hình bớt phụ thuộc vào một lần chia.

**Ví dụ:** 5-fold tạo 5 lượt học và đánh giá. Mỗi mẫu được dùng làm dữ liệu đánh giá một lượt trong cách chia thông thường. Sau khi chọn cấu hình, có thể huấn luyện lại trên toàn bộ tập phát triển rồi đánh giá test riêng.

**Trả lời miệng:** “Cross-validation đánh giá cấu hình qua nhiều cách chia train và validation. Nó giúp sử dụng dữ liệu hiệu quả hơn và thấy mức dao động kết quả. Các bước như chuẩn hóa phải được học riêng trong phần train của từng fold.”

**Bẫy:** K-fold ngẫu nhiên không phù hợp mọi trường hợp; chuỗi thời gian hoặc nhiều quan sát cùng một người cần cách chia chuyên biệt.

### ML10 [B] Khi nào phải chia theo thời gian hoặc theo nhóm?

Tập đánh giá cần mô phỏng tình huống sử dụng. Dự đoán tương lai thường phải học trên quá khứ rồi đánh giá ở giai đoạn sau. Nếu muốn dự đoán cho người mới, các bản ghi của cùng một người không nên nằm ở cả train và test.

**Ví dụ:** có 20 ảnh của mỗi bệnh nhân. Chia ngẫu nhiên từng ảnh có thể để mô hình nhận diện đặc điểm riêng của bệnh nhân đã gặp, làm đánh giá trên bệnh nhân mới quá lạc quan.

**Trả lời miệng:** “Cách chia phụ thuộc đối tượng cần tổng quát hóa. Với dự báo, em tôn trọng thứ tự thời gian. Với dữ liệu có nhiều mẫu cùng người hoặc cùng nhóm, em cân nhắc giữ nhóm nguyên vẹn giữa các tập để đo đúng khả năng áp dụng cho nhóm mới.”

**Hỏi tiếp:** Stratified split giải quyết được mọi vấn đề trên không? → Không; nó giữ gần tỷ lệ lớp, không tự xử lý phụ thuộc thời gian hoặc nhóm.

### ML11 [A] Xử lý dữ liệu thiếu, sai và ngoại lệ như thế nào?

Trước hết kiểm tra ý nghĩa và nguồn gốc. Giá trị thiếu có thể do không thu thập, không áp dụng hoặc người dùng không trả lời. Ngoại lệ có thể là lỗi nhập liệu hoặc trường hợp thật cần giữ.

**Ví dụ:** diện tích −50 m² có thể là lỗi; nhà 1.000 m² có thể là thật. Có thể điền giá trị thiếu bằng trung vị học từ train, thêm cờ “bị thiếu”, hoặc dùng mô hình hỗ trợ thiếu dữ liệu. Không có một cách đúng cho mọi bộ dữ liệu.

**Trả lời miệng:** “Em kiểm tra nguyên nhân trước khi xóa hoặc điền. Giá trị thay thế phải được học trên train, rồi áp dụng nhất quán sang validation và test. Xóa ngoại lệ tùy tiện có thể loại mất các trường hợp quan trọng.”

**Hỏi tiếp:** Có nên luôn điền bằng 0? → Không; 0 có thể là giá trị thật và làm sai ý nghĩa đặc trưng.

### ML12 [B] Vì sao phải mã hóa dữ liệu dạng chữ?

Nhiều mô hình nhận đầu vào số. **One-hot encoding** tạo cột chỉ báo cho từng nhóm; **ordinal encoding** gán mã có thứ tự khi thứ tự có ý nghĩa.

**Ví dụ:** màu đỏ/xanh/vàng không có thứ tự tự nhiên; gán 1/2/3 có thể khiến mô hình hiểu sai khoảng cách. Mức “thấp/vừa/cao” có thứ tự, nhưng khoảng cách số giữa các mức vẫn cần cân nhắc.

**Trả lời miệng:** “Mã hóa biến phân loại cần giữ đúng ý nghĩa của biến. One-hot phù hợp nhiều biến không có thứ tự; mã hóa thứ bậc phù hợp khi thứ tự thực sự tồn tại. Em cũng phải xử lý giá trị nhóm mới lúc dự đoán.”

**Bẫy:** target encoding dùng thống kê nhãn theo nhóm; làm trực tiếp trên toàn bộ dữ liệu dễ gây leakage. Nó cần cách tính trong fold hoặc phương án kiểm soát phù hợp.

### ML13 [A] Chuẩn hóa đặc trưng là gì? Mô hình nào cần?

**Standardization** thường tính `z = (x − μ_train) / σ_train`. **Min–max scaling** thường đưa khoảng giá trị của train về [0, 1]. Cả hai thay đổi thang đo, không tự biến dữ liệu thành phân phối chuẩn.

**Ví dụ:** thu nhập tính bằng triệu và tuổi có độ lớn khác nhau. Với KNN, đặc trưng có thang lớn có thể chi phối khoảng cách. Scaling thường quan trọng với KNN, SVM, PCA và nhiều phương pháp tối ưu theo gradient; cây quyết định thường không cần chỉ vì khác đơn vị.

**Trả lời miệng:** “Scaling đưa các đặc trưng về thang đo phù hợp để khoảng cách hoặc quá trình tối ưu không bị một biến lấn át. Em học thống kê scaling trên train rồi áp dụng lại, không tính riêng theo từng tập.”

**Hỏi tiếp:** Sau standardization dữ liệu có chắc hình chuông không? → Không; thay đổi vị trí và độ rộng không thay đổi bản chất hình dạng phân phối.

### ML14 [B] Mất cân bằng lớp gây vấn đề gì? Xử lý ra sao?

Mất cân bằng nghĩa là số mẫu giữa các lớp chênh lệch lớn. Mô hình có thể ưu tiên lớp phổ biến và accuracy che giấu việc bỏ sót lớp hiếm.

**Ví dụ:** 99% giao dịch bình thường; đoán tất cả bình thường có accuracy 99% nhưng không phát hiện gian lận. Có thể dùng class weights, lấy mẫu lại, thu thập thêm dữ liệu hoặc điều chỉnh ngưỡng, kết hợp metric phù hợp.

**Trả lời miệng:** “Em không chỉ nhìn accuracy khi lớp mất cân bằng. Em xem precision, recall và chi phí báo nhầm hoặc bỏ sót, rồi cân nhắc trọng số lớp, lấy mẫu lại hoặc ngưỡng quyết định. Việc xử lý phải được đánh giá trên phân phối phù hợp với sử dụng thật.”

**Bẫy:** oversampling trước khi chia dữ liệu có thể đưa các bản sao sang cả train và test. Thực hiện lấy mẫu lại trong phần train, kể cả bên trong từng fold.

## III. Mô hình học và vì sao có thể thất bại

### ML15 [A] Loss, objective và gradient descent là gì?

**Loss** đo mức sai của dự đoán theo một tiêu chí. **Objective** là mục tiêu tối ưu, có thể gồm loss trung bình cộng hình phạt regularization. **Gradient** mô tả độ thay đổi của mục tiêu theo từng tham số.

Gradient descent cập nhật theo hướng ngược gradient: `w_mới = w_cũ − η × gradient`, với η là learning rate. Đây là cách tối ưu, không phải tên một mô hình dự đoán.

**Ví dụ:** w = 2, gradient = 3, η = 0,1 thì w mới = 1,7. Bước quá lớn có thể khiến việc học dao động hoặc mất ổn định.

**Trả lời miệng:** “Loss đo sai số, còn objective là đại lượng muốn tối ưu. Gradient descent dùng gradient để điều chỉnh tham số theo hướng giảm objective. Learning rate quyết định độ lớn bước cập nhật.”

**Hỏi tiếp:** Loss có luôn bằng 1 − accuracy không? → Không; nhiều loss được chọn để tối ưu thuận tiện và phù hợp bài toán, như MSE hoặc cross-entropy.

### ML16 [A] Overfitting và underfitting khác nhau thế nào?

**Underfitting:** mô hình chưa nắm đủ quy luật, thường làm kém cả train lẫn validation. **Overfitting:** học quá sát các đặc điểm riêng hoặc nhiễu của train, khiến khả năng làm trên dữ liệu mới kém.

**Ví dụ:** một đường thẳng khó khớp quan hệ cong là thiếu khớp. Một đường uốn lượn qua từng điểm nhiễu có thể quá khớp. Train tốt, validation kém là dấu hiệu cần kiểm tra, chưa phải chứng minh duy nhất.

**Trả lời miệng:** “Underfitting là chưa học đủ cấu trúc; overfitting là học quá sát train và tổng quát hóa kém. Em so sánh train với validation, kiểm tra cách chia và dữ liệu, rồi điều chỉnh độ phức tạp, dữ liệu hoặc regularization.”

**Hỏi tiếp:** Train 99%, validation 65% luôn do overfit? → Không; khác biệt phân phối, nhãn lỗi hoặc chia tập không phù hợp cũng có thể gây khoảng cách đó.

### ML17 [B] Bias–variance tradeoff nên hiểu thế nào?

**Bias** là sai lệch có hệ thống do cách mô hình biểu diễn bài toán. **Variance** là mức mô hình thay đổi khi thay tập huấn luyện. Đây là khái niệm về hành vi qua các tập dữ liệu, không đơn giản là hai con số đọc trực tiếp từ một lần chạy.

**Ví dụ:** mô hình quá đơn giản có thể sai theo cùng một kiểu trên nhiều tập. Một cây rất sâu có thể thay đổi nhiều khi dữ liệu train thay đổi ít.

**Trả lời miệng:** “Bias cao thường liên quan mô hình quá hạn chế; variance cao nghĩa là mô hình nhạy với dữ liệu huấn luyện. Ta tìm mức độ phức tạp và regularization phù hợp để giảm sai số tổng quát hóa, thay vì chỉ giảm lỗi train.”

**Bẫy:** không phải cứ tăng độ phức tạp thì test chắc chắn xấu đi. Tradeoff là cách phân tích hữu ích; kết quả thực tế còn phụ thuộc dữ liệu và phương pháp học.

### ML18 [A] Regularization L1, L2 và early stopping dùng làm gì?

Regularization hạn chế mô hình học quá linh hoạt so với dữ liệu. Với mô hình tuyến tính, **L1** phạt tổng trị tuyệt đối trọng số, có thể đưa một số trọng số về 0; **L2** phạt tổng bình phương trọng số, thường làm chúng nhỏ lại.

**Ví dụ:** khi nhiều đặc trưng không hữu ích, L1 có thể tạo mô hình thưa hơn. L2 thường phân bổ trọng số nhỏ hơn thay vì giữ các hệ số rất lớn. Tác dụng phụ thuộc hệ số phạt và thang đo.

**Trả lời miệng:** “Regularization bổ sung ràng buộc hoặc hình phạt để hỗ trợ tổng quát hóa. L1 có thể tạo trọng số bằng 0, L2 thường co nhỏ trọng số. Early stopping là cách dừng học khi validation không cải thiện theo quy tắc đã chọn.”

**Hỏi tiếp:** Phạt càng mạnh càng tốt? → Không; quá mạnh có thể làm underfit. Chọn mức phạt bằng validation hoặc cross-validation.

## IV. Các thuật toán cần nhận diện và giải thích

### ML19 [A] Linear regression dự đoán bằng cách nào?

Hồi quy tuyến tính dùng tổ hợp tuyến tính các đặc trưng: `ŷ = w₁x₁ + … + wₚxₚ + b`. Bản bình phương tối thiểu tìm tham số giảm tổng bình phương sai số.

**Ví dụ:** `giá = 0,04 × diện_tích + 0,5`, đơn vị giá là tỷ và diện tích là m²; nhà 50 m² được dự đoán 2,5 tỷ. Đây chỉ là ví dụ, không phải công thức định giá thật.

**Trả lời miệng:** “Linear regression dự đoán giá trị số bằng tổng có trọng số của các đặc trưng cộng bias. Mô hình đơn giản, dễ làm baseline và diễn giải, nhưng có thể thiếu khớp nếu quan hệ cần học không được biểu diễn tốt bằng các đặc trưng hiện tại.”

**Bẫy:** hệ số diện tích dương không tự chứng minh tăng diện tích gây tăng giá đúng mức đó. Quan hệ dự đoán trong dữ liệu không mặc nhiên là nhân quả.

### ML20 [A] Logistic regression có phải hồi quy giá trị số không?

Logistic regression thường dùng cho phân loại. Bản nhị phân tính `z = wᵀx + b`, rồi qua sigmoid `p = 1/(1 + e^(−z))` để tạo xác suất ước lượng của lớp dương tính.

**Ví dụ:** mô hình cho email có p(spam) = 0,8. Dùng ngưỡng 0,5 thì gán spam; nếu ngưỡng 0,9 thì không. Ngưỡng là lựa chọn quyết định, không phải bản thân xác suất.

**Trả lời miệng:** “Dù tên có regression, logistic regression thường giải quyết phân loại. Nó biến tổ hợp tuyến tính của đặc trưng thành xác suất qua sigmoid trong bài toán nhị phân. Sau đó ta chọn ngưỡng phù hợp để ra quyết định.”

**Hỏi tiếp:** Xác suất 0,8 có bảo đảm đúng 80% không? → Không tự động; cần đánh giá hiệu chuẩn xác suất và chất lượng mô hình trên dữ liệu phù hợp.

### ML21 [B] KNN hoạt động thế nào? Chọn K có ảnh hưởng gì?

K-nearest neighbors tìm K mẫu train gần đầu vào mới nhất theo một khoảng cách. Phân loại thường bỏ phiếu theo nhãn; hồi quy thường lấy trung bình mục tiêu, có thể thêm trọng số theo khoảng cách.

**Ví dụ:** 5 khách hàng gần nhất có 4 người mua, 1 người không mua; cách bỏ phiếu đơn giản dự đoán mua. “Gần” phụ thuộc đặc trưng và thang đo, nên scaling rất quan trọng.

**Trả lời miệng:** “KNN dự đoán dựa trên các mẫu gần nhất. K quá nhỏ có thể nhạy với nhiễu; K quá lớn có thể làm mờ cấu trúc địa phương. Mô hình dễ hiểu nhưng việc dự đoán có thể tốn chi phí khi tập train lớn.”

**Hỏi tiếp:** KNN có học trọng số như hồi quy không? → KNN cơ bản chủ yếu lưu dữ liệu và thực hiện so sánh lúc dự đoán, không học một tập trọng số tuyến tính như vậy.

### ML22 [A] Decision tree học và dự đoán thế nào?

Cây quyết định đặt các câu hỏi theo đặc trưng để chia dữ liệu thành những nhóm nhỏ hơn. Các điểm chia được chọn để cải thiện tiêu chí như độ thuần nhất lớp hoặc giảm sai số hồi quy.

**Ví dụ:** “diện tích > 60?” rồi “quận trung tâm?”; đi theo các nhánh tới lá để nhận dự đoán. Cây quá sâu có thể tạo lá chứa rất ít mẫu và ghi nhớ nhiễu.

**Trả lời miệng:** “Decision tree dự đoán bằng chuỗi điều kiện chia dữ liệu. Nó biểu diễn quan hệ phi tuyến và khá dễ diễn giải khi cây nhỏ. Em có thể giới hạn độ sâu, số mẫu tối thiểu ở lá hoặc cắt tỉa để giảm overfitting.”

**Hỏi tiếp:** Cây có cần chuẩn hóa chỉ vì mét vuông lớn hơn số phòng không? → Thông thường không; cây chia theo ngưỡng từng đặc trưng, khác mô hình dựa trực tiếp trên khoảng cách.

### ML23 [B] Random forest khác một cây quyết định thế nào?

Random forest kết hợp nhiều cây. Các cây thường được học từ các mẫu bootstrap, tức lấy mẫu có hoàn lại; mỗi lần tìm điểm chia chỉ xét một tập con đặc trưng ngẫu nhiên. Phân loại tổng hợp dự đoán các cây, hồi quy thường lấy trung bình.

**Ví dụ:** thay vì tin một cây nhạy với vài điểm dữ liệu, lấy dự đoán từ nhiều cây đa dạng để làm kết quả ổn định hơn.

**Trả lời miệng:** “Random forest kết hợp nhiều cây được tạo có yếu tố ngẫu nhiên. Trung bình hóa giúp giảm variance so với một cây đơn lẻ trong nhiều trường hợp. Đổi lại mô hình lớn hơn và khó giải thích trực tiếp hơn.”

**Hỏi tiếp:** Có loại bỏ hoàn toàn overfitting không? → Không. Vẫn cần validation và cấu hình phù hợp; các cây giống nhau quá nhiều cũng hạn chế lợi ích tổng hợp.

### ML24 [B] Bagging và boosting khác nhau thế nào?

**Bagging** huấn luyện nhiều mô hình trên các tập lấy mẫu rồi tổng hợp, thường nhằm giảm variance. **Boosting** xây các mô hình theo chuỗi; bước sau tập trung cải thiện mục tiêu dựa trên mô hình hiện tại.

**Ví dụ:** random forest thuộc họ bagging với thêm ngẫu nhiên đặc trưng. Gradient boosting thêm cây để đi theo hướng giảm loss, thường liên quan gradient âm của loss; không phải mọi biến thể đều chỉ “tăng trọng số mẫu sai”.

**Trả lời miệng:** “Bagging tạo nhiều mô hình tương đối độc lập rồi tổng hợp; boosting thêm mô hình theo tuần tự để sửa những hạn chế của tổ hợp hiện tại. Boosting mạnh với nhiều bài toán dữ liệu bảng nhưng cần điều chỉnh số cây, độ sâu và learning rate.”

**Bẫy:** boosting không bảo đảm luôn tốt hơn random forest. Cần so sánh trên cùng cách chia và metric phù hợp.

### ML25 [C] SVM và kernel là gì?

Support Vector Machine tìm ranh giới phân loại với biên phân tách lớn, đồng thời cân bằng việc cho phép vi phạm biên trong bản soft-margin. Những điểm quan trọng gần biên gọi là support vectors.

**Ví dụ:** giữa hai nhóm điểm, có nhiều đường phân chia được chúng; SVM ưu tiên cách có khoảng cách biên phù hợp theo mục tiêu tối ưu. Kernel cho phép tính độ tương đồng tương đương với một không gian đặc trưng khác mà không nhất thiết dựng trực tiếp không gian đó.

**Trả lời miệng:** “SVM học ranh giới dựa trên ý tưởng tối đa hóa biên và cho phép một mức vi phạm có kiểm soát. Kernel giúp biểu diễn ranh giới phi tuyến. Scaling và các siêu tham số như C, gamma có thể ảnh hưởng mạnh.”

**Hỏi tiếp:** C rất lớn làm gì? → Phạt vi phạm biên mạnh hơn trong công thức soft-margin thường dùng; không có nghĩa kết quả test chắc chắn tốt hơn.

### ML26 [C] Naive Bayes có gì ‘naive’?

Naive Bayes dùng định lý Bayes để so xác suất các lớp theo đặc trưng. Giả định đơn giản hóa là **các đặc trưng độc lập có điều kiện khi đã biết lớp**, không phải độc lập hoàn toàn trong mọi dữ liệu.

**Ví dụ:** phân loại spam từ các từ trong email. Các từ thực tế có liên hệ, nhưng giả định đơn giản giúp tính toán nhanh và mô hình vẫn có thể dự đoán hữu ích.

**Trả lời miệng:** “Naive Bayes áp dụng Bayes với giả định đặc trưng độc lập có điều kiện theo lớp. Nhờ đó việc ước lượng dễ hơn. Nó thường là baseline nhanh cho văn bản, nhưng giả định có thể không đúng và xác suất dự đoán có thể chưa được hiệu chuẩn tốt.”

**Hỏi tiếp:** Một từ chưa xuất hiện trong lớp có thể gây gì? → Ước lượng xác suất bằng 0 có thể triệt tiêu tích xác suất; smoothing như Laplace giúp xử lý vấn đề này.

### ML27 [B] K-means phân cụm bằng cách nào?

K-means chọn K tâm, luân phiên gán mỗi điểm vào tâm gần nhất rồi cập nhật tâm bằng trung bình các điểm được gán. Mục tiêu phổ biến là giảm tổng bình phương khoảng cách trong cụm.

**Ví dụ:** nhóm khách hàng theo tần suất mua và mức chi tiêu. Nếu hai biến khác thang mạnh, nên xem xét scaling. Cụm có thể phản ánh nhóm hành vi nhưng chưa tự nói lên ý nghĩa kinh doanh.

**Trả lời miệng:** “K-means là thuật toán không giám sát, chia dữ liệu thành K cụm bằng cách gán điểm và cập nhật tâm lặp lại. Cần chọn K; kết quả nhạy với khởi tạo, thang đo và ngoại lệ, đồng thời không phù hợp mọi hình dạng cụm.”

**Hỏi tiếp:** Inertia giảm khi tăng K có chứng minh K càng lớn càng tốt không? → Không; tới mỗi điểm một cụm thì sai số bằng 0 nhưng phân cụm mất ý nghĩa tổng hợp.

### ML28 [C] PCA giảm chiều là làm gì?

Principal Component Analysis tìm các hướng trực giao sao cho những thành phần đầu giữ nhiều phương sai của dữ liệu đã được định tâm. Giữ vài thành phần đầu tạo biểu diễn ít chiều hơn; PCA không dùng nhãn trong cách thông thường.

**Ví dụ:** nhiều phép đo cơ thể tương quan có thể được tóm tắt bằng một số tổ hợp của chúng. Nếu đơn vị đo rất khác nhau, lựa chọn scaling có thể thay đổi kết quả mạnh.

**Trả lời miệng:** “PCA tạo các đặc trưng mới là tổ hợp tuyến tính của đặc trưng cũ, rồi giữ những hướng có nhiều phương sai. Nó giúp giảm chiều hoặc trực quan hóa, nhưng có thể làm mất thông tin dự đoán và khó diễn giải từng thành phần.”

**Bẫy:** phương sai lớn không đồng nghĩa hữu ích nhất cho nhãn. PCA không phải chọn một vài cột gốc và cũng không bảo đảm tăng accuracy.

## V. Đọc kết quả và chọn mô hình

### ML29 [A] Confusion matrix và accuracy là gì?

Chọn spam là lớp dương tính: **TP** báo spam đúng; **FP** báo spam nhầm; **FN** bỏ sót spam; **TN** nhận đúng không spam. Confusion matrix đếm các kiểu dự đoán này.

`Accuracy = (TP + TN) / (TP + TN + FP + FN)`.

**Ví dụ:** TP=8, FP=2, FN=12, TN=78 thì accuracy = 86/100 = 86%. Nhưng chỉ phát hiện 8 trong 20 email spam, nên accuracy chưa mô tả đầy đủ hiệu quả.

**Trả lời miệng:** “Confusion matrix giúp phân biệt dự đoán đúng, báo nhầm và bỏ sót. Accuracy là tỷ lệ đúng toàn bộ, nhưng có thể che giấu kết quả kém ở lớp hiếm. Em phải xác định rõ lớp nào là dương tính trước khi diễn giải.”

**Hỏi tiếp:** FP và FN có cùng hậu quả không? → Tùy bài toán; chặn nhầm thư quan trọng và bỏ lọt spam có thể có chi phí rất khác nhau.

### ML30 [A] Precision, recall và specificity trả lời những câu hỏi nào?

`Precision = TP/(TP+FP)`: trong các cảnh báo dương tính, bao nhiêu cái đúng? `Recall = TP/(TP+FN)`: trong các trường hợp thực sự dương tính, tìm được bao nhiêu? `Specificity = TN/(TN+FP)`: trong các trường hợp thực sự âm tính, loại đúng bao nhiêu?

**Ví dụ:** TP=8, FP=2, FN=12, TN=78: precision = 80%, recall = 40%, specificity = 97,5%. Mô hình báo khá chính xác nhưng bỏ sót nhiều spam.

**Trả lời miệng:** “Precision chú trọng độ đúng của cảnh báo; recall chú trọng tìm đủ các trường hợp dương tính; specificity đo khả năng nhận đúng âm tính. Chọn ưu tiên tùy chi phí báo nhầm và bỏ sót, không có chỉ số tốt nhất cho mọi việc.”

**Bẫy:** nếu mẫu số bằng 0, tỷ lệ không được xác định theo công thức thông thường; thư viện có quy ước xử lý riêng cần nêu rõ.

### ML31 [B] F1 và ngưỡng quyết định liên quan thế nào?

`F1 = 2 × precision × recall / (precision + recall)`, khi mẫu số khác 0. Đây là trung bình điều hòa, không phải trung bình cộng; chỉ số thấp nếu một trong hai rất thấp.

Với quy tắc “score ≥ ngưỡng thì dương tính”, giảm ngưỡng trên cùng một tập làm số cảnh báo và recall không giảm; precision thường giảm nhưng không được bảo đảm giảm đơn điệu.

**Ví dụ:** precision 0,8, recall 0,4 cho F1 ≈ 0,533. Có thể đổi ngưỡng để tìm thêm spam nhưng cần kiểm tra số thư thường bị chặn nhầm.

**Trả lời miệng:** “F1 cân bằng precision và recall theo trung bình điều hòa. Ngưỡng quyết định điều chỉnh cách chuyển điểm số thành lớp. Em chọn ngưỡng bằng validation theo chi phí hoặc chỉ số phù hợp, rồi giữ nguyên khi đánh giá test.”

**Hỏi tiếp:** F1 có xét TN không? → Không trực tiếp; nó cũng không tự phản ánh mọi chi phí nghiệp vụ.

### ML32 [C] ROC-AUC và PR curve khác nhau thế nào?

ROC biểu diễn **TPR = recall** theo **FPR = FP/(FP+TN)** khi thay ngưỡng. ROC-AUC tổng hợp khả năng xếp hạng; với quy ước xử lý điểm bằng nhau phù hợp, có thể hiểu là khả năng một mẫu dương tính ngẫu nhiên được xếp trên một mẫu âm tính.

PR curve biểu diễn precision theo recall. Khi lớp dương tính hiếm, PR thường giúp nhìn trực tiếp chất lượng cảnh báo hơn, vì precision chịu ảnh hưởng tỷ lệ lớp.

**Ví dụ:** FPR 1% có vẻ nhỏ nhưng trên một triệu mẫu âm tính vẫn tạo 10.000 báo nhầm.

**Trả lời miệng:** “ROC-AUC đánh giá xếp hạng qua nhiều ngưỡng; PR tập trung vào precision và recall, hữu ích khi quan tâm lớp dương tính hiếm. AUC cao không bảo đảm ngưỡng đang dùng phù hợp hoặc xác suất đã được hiệu chuẩn.”

**Bẫy:** diện tích PR và average precision có cách tổng hợp khác nhau; cần biết công cụ đang báo chỉ số nào.

### ML33 [A] MAE, MSE, RMSE và R² đo điều gì?

Với sai số `eᵢ = ŷᵢ − yᵢ`: **MAE** là trung bình `|eᵢ|`; **MSE** là trung bình `eᵢ²`; **RMSE** là căn MSE. MAE và RMSE cùng đơn vị với mục tiêu; MSE bình phương đơn vị và phạt lỗi lớn mạnh hơn.

`R² = 1 − Σ(yᵢ−ŷᵢ)² / Σ(yᵢ−ȳ)²`, với mẫu số khác 0. R² có thể âm nếu tổng sai số bình phương tệ hơn dự đoán bằng trung bình của bộ giá trị đang đánh giá.

**Ví dụ:** thực tế [1, 3], dự đoán [2, 5]: MAE=1,5; MSE=2,5; RMSE≈1,58; R²=−1,5.

**Trả lời miệng:** “MAE đo sai số tuyệt đối trung bình; MSE và RMSE nhấn mạnh lỗi lớn hơn. R² so sai số bình phương với mốc dự đoán trung bình. R² không phải accuracy và không luôn nằm trong khoảng 0 đến 1.”

**Bẫy:** khi mục tiêu không biến thiên, mẫu số R² bằng 0; phải xem quy ước của công cụ.

### ML34 [A] Chọn mô hình tốt nhất bằng cách nào? Baseline có ích gì?

Baseline là mốc so sánh đơn giản, như dự đoán lớp phổ biến hoặc giá trung bình học từ train. Một mô hình phức tạp chỉ đáng chọn nếu cải thiện có ý nghĩa đối với mục tiêu và chi phí sử dụng.

**Ví dụ:** mô hình A giảm MAE một ít nhưng cần vài giây mỗi dự đoán; B nhanh hơn nhiều và dễ giải thích. Lựa chọn phụ thuộc yêu cầu, không chỉ một con số.

**Trả lời miệng:** “Em chọn dựa trên metric phù hợp, cùng cách chia dữ liệu và baseline rõ ràng. Sau đó cân nhắc độ ổn định, tốc độ, tài nguyên và khả năng giải thích. Em không kết luận thuật toán nào tốt nhất cho mọi dữ liệu chỉ từ tên của nó.”

**Hỏi tiếp:** Một lần validation hơn 0,1% đã chắc tốt hơn chưa? → Chưa; cần xem dao động do chia dữ liệu, kích thước mẫu và mức khác biệt có ý nghĩa thực tế.

### ML35 [C] Giải thích mô hình và theo dõi drift là gì?

Giải thích mô hình giúp hiểu yếu tố liên quan tới dự đoán. Feature importance hoặc công cụ giải thích cục bộ không tự chứng minh quan hệ nhân quả; đặc trưng tương quan có thể làm cách diễn giải phức tạp.

**Data drift** là thay đổi phân phối đầu vào. **Concept drift** là thay đổi quan hệ giữa đầu vào và mục tiêu. Có drift không đồng nghĩa hiệu quả chắc chắn giảm, nhưng là tín hiệu cần kiểm tra.

**Ví dụ:** cách viết spam thay đổi sau vài tháng; dữ liệu mới có thể khác dữ liệu huấn luyện. Theo dõi đặc trưng, tỷ lệ thiếu, dự đoán và metric khi có nhãn thật.

**Trả lời miệng:** “Đưa mô hình vào sử dụng chưa phải kết thúc. Em theo dõi dữ liệu và hiệu quả vì môi trường có thể thay đổi. Các công cụ giải thích hỗ trợ kiểm tra dự đoán, nhưng không biến mô hình dự đoán thành bằng chứng nhân quả.”

**Hỏi tiếp:** Có cần tự động huấn luyện lại mỗi khi drift? → Không nhất thiết; cần xem tác động và kiểm định phiên bản mới trước khi thay thế.

## VI. Năm tình huống tự kiểm tra

Hãy trả lời trước khi đọc lời giải. Mỗi câu nên nói được **lý do**, không chỉ tên thuật toán hoặc công thức.

### Tình huống 1: Điểm đẹp bất thường

Bạn có dữ liệu 500 bệnh nhân, mỗi người 10 ảnh. Chia ngẫu nhiên 5.000 ảnh, được accuracy 99%. Điều gì cần kiểm tra?

**Lời giải:** nếu mục tiêu là áp dụng cho bệnh nhân mới, cần kiểm tra cùng bệnh nhân có xuất hiện ở cả train và test không. Mô hình có thể tận dụng đặc điểm riêng của bệnh nhân. Chia theo bệnh nhân, xử lý trùng lặp và học tiền xử lý trên train; sau đó đánh giá lại. Không mặc định 99% chắc là sai, nhưng chưa đủ đáng tin khi thiết kế chia tập chưa phù hợp.

### Tình huống 2: Tính chỉ số

100 email: 20 spam. Mô hình báo 10 spam, đúng 8. Hãy tính TP, FP, FN, TN, accuracy, precision và recall.

**Lời giải:** TP=8, FP=2, FN=12, TN=78. Accuracy=86%, precision=80%, recall=40%. Tỷ lệ đúng chung cao hơn mức phát hiện spam. Nếu muốn giảm bỏ sót, có thể thử ngưỡng thấp hơn trên validation rồi kiểm tra số báo nhầm và chi phí.

### Tình huống 3: Scaling sai quy trình

Bạn tính trung bình và độ lệch chuẩn trên tất cả dữ liệu, chuẩn hóa rồi chạy 5-fold cross-validation. Có vấn đề gì?

**Lời giải:** thống kê của phần đánh giá đã đi vào tiền xử lý train. Cần đặt scaler trong quy trình của mỗi fold: fit trên train fold, transform train và validation fold. Sau khi chọn cấu hình, fit quy trình trên tập phát triển và đánh giá test riêng. Tương tự với điền thiếu, chọn đặc trưng và PCA học từ dữ liệu.

### Tình huống 4: Chọn metric giá nhà

Hai mô hình có lỗi tuyệt đối trên 3 nhà: A = [1, 1, 10], B = [4, 4, 4], đơn vị trăm triệu. Mô hình nào tốt hơn?

**Lời giải:** cả hai có MAE=4. A có MSE=(1+1+100)/3=34; B có MSE=16. Nếu lỗi rất lớn đặc biệt tốn kém, B có lợi theo MSE/RMSE. Nếu mục tiêu chỉ là MAE, hai kết quả đang ngang nhau; vẫn cần xem nhiều mẫu hơn và các yêu cầu khác. “Tốt hơn” cần mục tiêu rõ ràng.

### Tình huống 5: Học thuộc hay học chưa đủ?

Một cây rất sâu đạt accuracy train 100%, validation 70%. Cây nông hơn đạt train 84%, validation 80%. Bạn chọn gì tiếp theo?

**Lời giải:** cây nông có kết quả validation tốt hơn, dù train thấp hơn; đây là minh họa vì sao không chọn bằng điểm train. Kiểm tra cách chia, các chỉ số liên quan và độ ổn định, rồi thử cấu hình quanh độ sâu phù hợp. Khi chốt mới đánh giá test. Không kết luận chỉ từ ví dụ này rằng cây nông luôn tốt hơn.

## VII. Bảng lựa chọn để tra nhanh

### Chọn thước đo theo câu hỏi

| Nhu cầu | Chỉ số nên xem | Điều kiện hoặc hạn chế |
|---|---|---|
| Tỷ lệ dự đoán đúng chung | Accuracy | Có thể gây hiểu nhầm khi lớp mất cân bằng |
| Cảnh báo phải ít báo nhầm | Precision, số FP | Precision còn phụ thuộc tỷ lệ lớp |
| Cần tìm đủ trường hợp dương tính | Recall, số FN | Recall cao có thể đi kèm nhiều cảnh báo |
| Cân bằng precision và recall | F1 | Không xét trực tiếp TN hoặc mọi chi phí |
| Xếp hạng qua nhiều ngưỡng | ROC-AUC, PR curve/AP | Không thay việc chọn ngưỡng và kiểm tra calibration |
| Sai số số học dễ diễn giải | MAE, RMSE | So trên cùng đơn vị, dữ liệu và quy trình |
| So sai số bình phương với mốc trung bình | R² | Có thể âm; không ổn định khi mục tiêu gần hằng số |

### Chọn thuật toán làm điểm bắt đầu

| Bài toán | Điểm bắt đầu hợp lý | Cần lưu ý |
|---|---|---|
| Hồi quy dữ liệu bảng | Baseline, linear regression, cây | Quan hệ, ngoại lệ và metric |
| Phân loại dữ liệu bảng | Baseline, logistic regression, cây | Mất cân bằng, ngưỡng, leakage |
| Dữ liệu bảng có quan hệ phức tạp | Random forest, gradient boosting | Cấu hình, tài nguyên, đánh giá công bằng |
| Dự đoán dựa trên độ tương tự | KNN | Thang đo, chiều dữ liệu, chi phí dự đoán |
| Phân loại văn bản với đặc trưng từ | Naive Bayes, mô hình tuyến tính | Biểu diễn văn bản, smoothing, đánh giá |
| Phân cụm dữ liệu số | K-means | Chọn K, scaling, hình dạng cụm |
| Giảm chiều tuyến tính | PCA | Phương sai không đồng nghĩa thông tin nhãn |

Đây là điểm bắt đầu để thử, không phải bảng kết luận thuật toán tối ưu cho mọi trường hợp.

## VIII. Từ điển Anh–Việt ngắn

| Thuật ngữ | Nghĩa cần nhớ |
|---|---|
| Feature / label / sample | Đặc trưng / nhãn mục tiêu / mẫu quan sát |
| Training / inference | Học tham số / dùng mô hình tạo dự đoán |
| Generalization | Khả năng làm tốt trên dữ liệu mới phù hợp bài toán |
| Parameter / hyperparameter | Tham số được học / cấu hình mô hình hoặc việc học |
| Loss / objective / metric | Mức sai / mục tiêu tối ưu / chỉ số đánh giá |
| Baseline | Mốc so sánh đơn giản |
| Leakage | Rò rỉ thông tin không hợp lệ vào phát triển mô hình |
| Overfitting / underfitting | Quá khớp / thiếu khớp |
| Regularization | Hạn chế độ phức tạp hoặc thêm ràng buộc để hỗ trợ tổng quát hóa |
| Threshold / calibration | Ngưỡng quyết định / mức phù hợp giữa xác suất dự đoán và tần suất thực tế |
| Cross-validation / fold | Đánh giá chéo / một phần chia dữ liệu |
| Ensemble | Tổ hợp nhiều mô hình |
| Imputation / encoding / scaling | Điền dữ liệu thiếu / mã hóa / biến đổi thang đo |
| Drift | Sự thay đổi của dữ liệu hoặc quan hệ cần dự đoán theo thời gian |

**Kiểm tra cuối:** Bạn có thể giải thích một quy trình từ dữ liệu tới đánh giá, nêu được một lỗi rò rỉ, phân biệt precision–recall và overfitting–underfitting, rồi chọn một mô hình đơn giản có lý do không? Nếu chưa, quay lại các câu [A] tương ứng trước khi học thêm tên thuật toán.
