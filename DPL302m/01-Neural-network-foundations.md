# Chương 1 — Từ logistic regression đến mạng nhiều tầng

Đọc nối với DL01–DL18 trong [bộ nền tảng](../Chuyen-de/03-Deep-Learning.md). Phần này bổ sung ký hiệu, shape và phép tính cơ bản theo các bài 1.1–1.4 của DPL302m.

Nguồn là các file text trong `F:\1. FPT Material\Sem5\DPL302m\extracted_texts`. Số slide bên dưới lấy từ marker thực trong file text. Công thức được viết lại ở dạng chuẩn, dễ đọc; text extraction không giữ đầy đủ hình ảnh và công thức của slide nên không xem đây là bản chép nguyên văn PowerPoint.

## DPL1-01 [Cốt lõi] DL học từ dữ liệu có cấu trúc và phi cấu trúc như thế nào?

**Nguồn:** `1.1. Introduction to deep learning.txt`, slide 16–25.

Dữ liệu có cấu trúc thường là bảng: mỗi dòng là một căn nhà, các cột là diện tích, số phòng, giá. Dữ liệu phi cấu trúc như ảnh, âm thanh hoặc văn bản không có sẵn các cột đặc trưng mang ý nghĩa như vậy. Tuy nhiên khi đưa vào máy, chúng vẫn được mã hóa thành số và tensor có shape cụ thể.

Mô hình học một ánh xạ từ đầu vào x sang mục tiêu y. Mạng sâu có thể học các biểu diễn trung gian hữu ích, nhưng nhiều dữ liệu hoặc nhiều tầng không tự bảo đảm kết quả tốt. Chất lượng dữ liệu, mục tiêu, kiến trúc và tối ưu đều quan trọng. Dữ liệu bảng nhỏ vẫn có thể phù hợp với mô hình đơn giản hoặc cây hơn.

**Ví dụ:** dự đoán giá nhà từ diện tích là hồi quy trên bảng; nhận diện mèo từ ảnh là phân loại từ tensor pixel. Ảnh RGB 64×64 có 64×64×3 = 12.288 giá trị nếu làm phẳng.

**Mẫu đáp:** “DL học ánh xạ từ dữ liệu tới mục tiêu và có thể tự học biểu diễn qua nhiều tầng. Dữ liệu có cấu trúc thường là bảng, còn ảnh, âm thanh và văn bản thường gọi là phi cấu trúc. Cả hai vẫn cần biểu diễn số phù hợp. Quy mô dữ liệu và tính toán hỗ trợ DL nhưng không thay thế việc thiết kế và đánh giá đúng.”

**Hỏi tiếp:** Dữ liệu phi cấu trúc có nghĩa là không có shape? → Không. Ảnh hoặc batch ảnh vẫn có các chiều rõ ràng khi mã hóa thành tensor.

## DPL1-02 [Cốt lõi] Logistic regression có thể xem như một nơ-ron thế nào?

**Nguồn:** `1.2 Basic Neural Network.txt`, slide 4–10.

Với một mẫu x có n đặc trưng, tính `z = wᵀx + b`, rồi `a = sigmoid(z) = 1/(1+exp(−z))`. a được dùng làm xác suất dự đoán cho lớp 1 trong mô hình. Chọn ngưỡng để biến xác suất thành nhãn; 0,5 là một lựa chọn thông dụng, không bắt buộc cho mọi bài toán.

Đây là một đơn vị đầu ra với activation sigmoid, không có tầng ẩn. Nó học w và b từ dữ liệu. “Logistic regression” thường dùng cho phân loại dù tên có chữ regression.

**Ví dụ:** x=[1,2], w=[0,0], b=0 → z=0 → a=0,5. Nếu nhãn thật là 1, mô hình cần điều chỉnh tham số để tăng a cho mẫu này, đồng thời còn phải cân nhắc các mẫu khác trong tập học.

**Mẫu đáp:** “Logistic regression tính tổng có trọng số cộng bias rồi qua sigmoid, nên có thể xem là một nơ-ron đầu ra cho phân loại nhị phân. Mạng sâu bổ sung các tầng ẩn học biểu diễn trước đầu ra đó. Xác suất và nhãn phân loại khác nhau: cần một ngưỡng để ra quyết định.”

**Bẫy:** Khởi tạo w=0 có thể dùng cho logistic regression đơn lẻ. Vấn đề đối xứng khi nhiều nơ-ron ẩn giống nhau không có nghĩa mọi mô hình đều cấm khởi tạo 0.

## DPL1-03 [Cốt lõi] Binary cross-entropy và cost trên nhiều mẫu là gì?

**Nguồn:** `1.2 Basic Neural Network.txt`, slide 9–10, 59–62; `1.3 Shallow Neural Networks.txt`, slide 38–45.

Với y thuộc {0,1}, xác suất dự đoán a thuộc (0,1), loss một mẫu là:

`L(a,y) = −[y log(a) + (1−y) log(1−a)]`.

Nếu y=1, loss là −log(a); nếu y=0, loss là −log(1−a). Dự đoán càng tự tin vào nhãn sai thì phạt càng lớn. Dùng log tự nhiên trong các ví dụ này.

Cost trên m mẫu thường là trung bình: `J = (1/m) Σ L(a⁽ⁱ⁾, y⁽ⁱ⁾)`. Quy ước trung bình hay tổng ảnh hưởng độ lớn gradient nên phải nhất quán. Trong thực hành, hàm loss nhận logits có thể tính ổn định hơn việc tự sigmoid rồi lấy log.

**Ví dụ:** nhãn y=1, a=0,9 → loss≈0,105; a=0,1 → loss≈2,303. Không được gọi loss này là 1−accuracy.

**Mẫu đáp:** “BCE đo mức sai của xác suất trong phân loại nhị phân. Nó phạt mạnh dự đoán tự tin sai. Loss thường nói cho từng mẫu, cost là tổng hợp trên tập mẫu, chẳng hạn trung bình. Khi lập trình em kiểm tra hàm nhận logits hay xác suất để không áp sigmoid hai lần.”

**Hỏi tiếp:** a=0 và y=1 thì sao? → Loss toán học tiến tới vô hạn. Thư viện dùng công thức ổn định với logits hoặc xử lý số học thích hợp, không tùy tiện để log(0) gây NaN.

## DPL1-04 [Cốt lõi] Computation graph và chain rule giúp tính gradient ra sao?

**Nguồn:** `1.2 Basic Neural Network.txt`, slide 25–34.

Computation graph chia công thức lớn thành các phép nhỏ. Forward tính giá trị từ đầu vào tới loss; backward dùng đạo hàm từng phép và quy tắc dây chuyền để truyền ảnh hưởng ngược lại.

Ví dụ `u=wx`, `z=u+b`, `L=z²`. Cho x=2,w=1,b=1 thì u=2,z=3,L=9. Từ cuối: `dL/dz=2z=6`; vì `dz/du=1`, `du/dw=x=2`, suy ra `dL/dw=12`; `dL/db=6`.

Nếu một biến ảnh hưởng đầu ra qua nhiều đường, cộng các đóng góp gradient từ các đường đó. Không chỉ nhân đạo hàm của một nhánh rồi bỏ các nhánh còn lại.

**Mẫu đáp:** “Đồ thị tính toán tách hàm thành các bước nhỏ. Forward tính giá trị; backward dùng chain rule để tính ảnh hưởng của từng tham số tới loss. Khi nhiều nhánh cùng đóng góp, gradient được cộng lại. Backprop tính gradient, còn optimizer mới dùng gradient cập nhật tham số.”

**Hỏi tiếp:** Vì sao lưu giá trị forward? → Đạo hàm của một phép thường cần đầu vào hoặc đầu ra của nó; lưu cache giúp dùng lại thay vì tính lại toàn bộ.

## DPL1-05 [Cốt lõi] Vì sao logistic regression có dz=a−y?

**Nguồn:** `1.2 Basic Neural Network.txt`, slide 32–37.

Đây là kết quả của **sigmoid kết hợp BCE**. Đạo hàm loss theo a là `−y/a + (1−y)/(1−a)`; đạo hàm sigmoid là `a(1−a)`. Nhân hai biểu thức theo chain rule và rút gọn được `dL/dz=a−y`.

Với một mẫu: `dw=(a−y)x`, `db=a−y`. Nếu cost lấy trung bình m mẫu thì các gradient tham số cũng lấy trung bình tương ứng. Không dùng a−y như công thức chung cho mọi activation và mọi loss.

**Ví dụ:** x=[1,2], w=[0,0], b=0, y=1. a=0,5 → dz=−0,5; dw=[−0,5;−1], db=−0,5. Learning rate 0,1 cho w mới=[0,05;0,1], b mới=0,05. z mới=0,3, a mới≈0,574, tăng xác suất lớp đúng cho mẫu này.

**Mẫu đáp:** “Với sigmoid và BCE, chain rule rút gọn đạo hàm theo logit thành a−y. Sau đó nhân với đầu vào để có gradient trọng số và lấy trung bình nếu có nhiều mẫu. Đây là kết quả cho cặp activation-loss cụ thể, không phải quy tắc của mọi mạng.”

**Bẫy:** Tính các gradient từ cùng bộ tham số cũ rồi cập nhật; không cập nhật từng trọng số và dùng lẫn giá trị mới để tính gradient của bước cũ.

## DPL1-06 [Cốt lõi] Vectorization và broadcasting khác nhau thế nào?

**Nguồn:** `1.2 Basic Neural Network.txt`, slide 38–58; `1.3 Shallow Neural Networks.txt`, slide 18–25.

Vectorization tổ chức phép tính thành thao tác trên vector/ma trận thay vì vòng lặp Python qua từng mẫu hoặc từng phần tử. Thư viện số có thể xử lý các phép này hiệu quả hơn. Tốc độ cụ thể phụ thuộc dữ liệu, phần cứng và thư viện; không có hệ số tăng tốc cố định cho mọi bài.

Broadcasting cho phép thao tác với shape khác nhau khi các chiều tương thích. Theo quy tắc NumPy, so từ chiều cuối: hai chiều phải bằng nhau hoặc một chiều bằng 1; chiều thiếu được xem là 1. Nó không phải phép nhân ma trận và không tự hiểu ý nghĩa “mẫu” hay “đặc trưng”.

**Ví dụ:** Z có shape (3,5), b có shape (3,1). Z+b cộng bias của từng neuron vào cả 5 mẫu. Nhưng b shape (3,) không tương thích với (3,5), vì chiều cuối 3 và 5 không khớp. Nguy hiểm hơn: khi Z=(3,3), b=(3,) chạy được nhưng bias được áp theo cột, có thể sai ý đồ.

**Mẫu đáp:** “Vectorization dùng phép toán mảng để xử lý nhiều giá trị cùng lúc. Broadcasting tự mở rộng các chiều tương thích khi thao tác, ví dụ cộng bias vào mọi mẫu. Em vẫn phải kiểm tra shape và trục ý nghĩa vì chạy không lỗi chưa chắc đúng toán.”

**Hỏi tiếp:** `(n,)` và `(n,1)` có giống nhau không? → Không. Một cái là mảng một chiều, một cái là ma trận cột; transpose mảng một chiều không biến nó thành vector cột.

## DPL1-07 [Cốt lõi] Kiểm tra shape của mạng nhiều tầng thế nào?

**Nguồn:** `1.4 Deep Neural Networks.txt`, slide 5–13, 24–27.

Dùng quy ước trong slide: mỗi **cột là một mẫu**. X có shape `(n[0],m)`. Với tầng l có n[l] neuron:

- W[l]: `(n[l], n[l−1])`.
- b[l]: `(n[l],1)`.
- Z[l] và A[l]: `(n[l],m)`.

Forward: `Z[l]=W[l]A[l−1]+b[l]`, `A[l]=g[l](Z[l])`, với A[0]=X. Nhân ma trận cần hai chiều bên trong bằng nhau. Nhiều framework dùng batch ở chiều đầu; đó là quy ước khác, không phải slide sai hoặc framework sai.

**Ví dụ:** mạng 3→4→1, batch 5 mẫu. X=(3,5), W1=(4,3), b1=(4,1), A1=(4,5), W2=(1,4), b2=(1,1), A2=(1,5).

**Mẫu đáp:** “Em bắt đầu từ quy ước chiều mẫu. Theo slide, mẫu nằm ở cột, nên W tầng l có số hàng bằng số neuron tầng hiện tại và số cột bằng số đầu ra tầng trước. Nhân W với activation tầng trước rồi cộng bias broadcast cho mọi mẫu.”

**Hỏi tiếp:** Mạng ví dụ có bao nhiêu tham số? → Tầng 1: 4×3+4=16; tầng 2: 1×4+1=5; tổng 21. Số mẫu m không nhân thêm số tham số dùng chung.

## DPL1-08 [Cốt lõi] Một mạng có một tầng ẩn tính gì, và đếm tầng thế nào?

**Nguồn:** `1.3 Shallow Neural Networks.txt`, slide 3–25; `1.4 Deep Neural Networks.txt`, slide 3–10.

Theo quy ước của khóa học, input không tính vào số tầng có tham số. Mạng một tầng ẩn cộng một tầng đầu ra thường gọi là mạng hai tầng. Điều này dễ nhầm với cách đếm cả input trong một số tài liệu khác; hãy nói rõ quy ước.

Bốn phép của mạng là `Z1=W1X+b1`, `A1=g1(Z1)`, `Z2=W2A1+b2`, `A2=g2(Z2)`. Tầng ẩn biến đầu vào thành đặc trưng trung gian; tầng ra biến đặc trưng thành dự đoán phù hợp nhiệm vụ.

**Ví dụ một mẫu:** x=[1;2], W1=[[1,0],[0,1]], b1=0, ReLU → A1=[1;2]. W2=[1,−1], b2=0 → z2=−1; sigmoid cho a2≈0,269. Dù đầu vào đều dương, đầu ra logit có thể âm do trọng số âm.

**Mẫu đáp:** “Mạng một tầng ẩn có hai lần biến đổi có tham số: đầu vào qua tầng ẩn, rồi qua tầng đầu ra. Theo quy ước slide đó là mạng hai tầng. Em tính lần lượt tổng có trọng số, activation, rồi lặp cho tầng tiếp theo.”

**Hỏi tiếp:** Mạng 3→4→4→1 có mấy tầng? → Ba tầng có tham số, gồm hai tầng ẩn và một tầng đầu ra.

## DPL1-09 [Cốt lõi] Đạo hàm activation ảnh hưởng việc học ra sao?

**Nguồn:** `1.3 Shallow Neural Networks.txt`, slide 26–36.

Backprop nhân với đạo hàm activation. Sigmoid có đạo hàm a(1−a); tanh có đạo hàm 1−a². Ở vùng bão hòa, các đạo hàm này nhỏ, góp phần làm gradient suy giảm khi truyền qua nhiều tầng.

ReLU bằng max(0,z), đạo hàm là 1 khi z>0 và 0 khi z<0; tại 0 không khả vi, triển khai chọn quy ước phù hợp. Leaky ReLU dùng độ dốc nhỏ dương ở phía z<0, ví dụ 0,01, giúp phía âm vẫn có gradient. Nó không bảo đảm luôn tốt hơn mọi activation khác.

**Ví dụ:** z=−2: ReLU=0 và đạo hàm phía âm=0; Leaky ReLU với hệ số 0,01 cho −0,02 và đạo hàm 0,01. Sigmoid tại z=0 có a=0,5 nên đạo hàm 0,25.

**Mẫu đáp:** “Activation vừa tạo phi tuyến vừa ảnh hưởng gradient qua đạo hàm của nó. Sigmoid và tanh có vùng bão hòa; ReLU giữ gradient phía dương nhưng có thể có neuron không hoạt động ở phía âm. Leaky ReLU giữ một độ dốc nhỏ ở phía âm.”

**Bẫy:** Tanh zero-centered không có nghĩa luôn vượt sigmoid; còn phụ thuộc vị trí, mục tiêu và cách huấn luyện. Đầu ra hồi quy có thể tuyến tính.

## DPL1-10 [Đọc tiếp] Backprop của mạng hai tầng có công thức gì?

**Nguồn:** `1.3 Shallow Neural Networks.txt`, slide 37–50; `1.4 Deep Neural Networks.txt`, slide 19–27.

Giả sử đầu ra sigmoid với BCE, cost là trung bình m mẫu, quy ước mẫu theo cột. Đặt D2=A2−Y là đạo hàm loss theo logit của từng mẫu, chưa chia m. Khi đó:

```text
dW2 = (1/m) D2 A1ᵀ
db2 = (1/m) sum(D2, theo chiều các mẫu, giữ chiều)
D1  = (W2ᵀ D2) ⊙ g1'(Z1)
dW1 = (1/m) D1 Xᵀ
db1 = (1/m) sum(D1, theo chiều các mẫu, giữ chiều)
```

Ký hiệu ⊙ là nhân từng phần tử, không phải nhân ma trận. Việc chia m được đặt tại dW/db trong quy ước này; nếu thư viện đã chia ở gradient loss thì không chia thêm một lần nữa.

**Ví dụ kiểm tra shape:** mạng3→4→1, m=5. D2=(1,5), A1ᵀ=(5,4) nên dW2=(1,4), đúng shape W2. W2ᵀD2=(4,5), nhân từng phần tử với g1'(Z1)=(4,5) cho D1=(4,5).

**Mẫu đáp:** “Ở đầu ra sigmoid-BCE, sai số theo logit mỗi mẫu là A2−Y. Gradient trọng số là sai số nhân transpose của activation trước rồi lấy trung bình. Sai số truyền về tầng ẩn qua W2 transpose và đạo hàm activation; các gradient phải có shape giống tham số tương ứng.”

**Hỏi tiếp:** Cache cần gì? → Các activation trước, Z hoặc thông tin activation cần cho đạo hàm, và trọng số liên quan. Không phải forward phải lưu mọi thứ trong mọi cách tối ưu bộ nhớ.

## DPL1-11 [Cốt lõi] Vì sao khởi tạo ngẫu nhiên, và vì sao mạng sâu có ích?

**Nguồn:** `1.3 Shallow Neural Networks.txt`, slide 51–54; `1.4 Deep Neural Networks.txt`, slide 14–18.

Nếu nhiều neuron ẩn có cùng trọng số, bias và cách kết nối đối xứng, chúng có thể nhận cùng gradient rồi tiếp tục giống nhau. Khởi tạo ngẫu nhiên phù hợp giúp phá đối xứng, để các neuron có cơ hội học đặc trưng khác nhau. Bias bằng0 thường vẫn dùng được khi weights đã được khởi tạo phù hợp.

Độ sâu cho phép kết hợp nhiều mức biểu diễn: ví dụ cạnh → họa tiết → bộ phận. Đây là trực giác, không phải quy luật mọi tầng học đúng một cấp như thế. Một số họ hàm được biểu diễn hiệu quả hơn bằng chiều sâu, nhưng không có kết luận chung rằng mọi bài toán dùng mạng sâu đều tốt hơn mạng nông.

**Ví dụ:** hai neuron ẩn làm cùng phép tính không tạo hai đặc trưng khác nhau chỉ vì ta vẽ hai vòng tròn. Đổi khởi tạo giúp phá đối xứng; chọn độ lớn khởi tạo tốt còn giúp tín hiệu/gradient không phình hoặc co quá mức.

**Mẫu đáp:** “Khởi tạo ngẫu nhiên giúp các neuron ẩn không học giống hệt nhau do đối xứng. Độ sâu giúp kết hợp biểu diễn qua nhiều mức nhưng cần huấn luyện và dữ liệu phù hợp. Em không mặc định cứ thêm tầng là cải thiện.”

**Hỏi tiếp:** Cứ dùng số ngẫu nhiên thật lớn được không? → Không; có thể làm tín hiệu và gradient không ổn định. Xem He/Xavier ở chương2.

## DPL1-12 [Cốt lõi] Parameters, hyperparameters và quy trình thử nghiệm khác nhau thế nào?

**Nguồn:** `1.4 Deep Neural Networks.txt`, slide 28–33.

Parameters như W,b được cập nhật bởi quá trình học. Hyperparameters như learning rate, batch size, số tầng, số neuron và lựa chọn activation điều khiển mô hình hoặc quá trình học. Có thể chọn chúng bằng tìm kiếm tự động, nhưng chúng không vì thế trở thành W,b được học bằng cùng quy tắc gradient trong mô hình thông thường.

Một quy trình cơ bản: có giả thuyết → chọn thay đổi → huấn luyện → xem train/dev và metric → ghi lại kết quả → điều chỉnh. Giữ test cho đánh giá cuối. Đổi quá nhiều thứ cùng lúc khiến khó hiểu nguyên nhân cải thiện hoặc suy giảm.

**Ví dụ:** “learning rate=0,01” là cấu hình; “w1 học được=0,27” là kết quả tham số. Chọn learning rate bằng điểm test nhiều lần làm test không còn độc lập với lựa chọn.

**Mẫu đáp:** “Parameters là giá trị mô hình học, như trọng số và bias. Hyperparameters điều khiển mô hình và huấn luyện. DL có tính thực nghiệm: thử có mục tiêu, đánh giá bằng dev, ghi cấu hình và chỉ chốt đánh giá test khi đã chọn phương án.”

**Hỏi tiếp:** Số epoch có nhất thiết phải cố định từ đầu? → Không, early stopping có thể chọn điểm dừng theo quy tắc trên validation; vẫn không dùng test để chọn epoch.

## Bốn bài tự kiểm tra

1. **Shape và tham số:** mạng5→3→2, m=8, mẫu theo cột. → X=(5,8); W1=(3,5),b1=(3,1),A1=(3,8); W2=(2,3),b2=(2,1),A2=(2,8). Tổng tham số=15+3+6+2=26.
2. **BCE:** y=0, a=0,8. → −log(0,2)≈1,609. Nếu a=0,2 thì −log(0,8)≈0,223; dự đoán mới phù hợp nhãn0 hơn.
3. **Một bước logistic:** x=2, y=1, w=0, b=0, lr=0,1. → a=0,5; dz=−0,5; dw=−1; db=−0,5. Sau cập nhật: w=0,1; b=0,05; z=0,25; a≈0,562.
4. **Broadcast:** A shape(4,6), b shape(4,). Có cộng bias mỗi neuron trực tiếp đúng không? → Không tương thích ở chiều cuối6 và4; dùng b=(4,1) theo quy ước mẫu ở cột.

## Từ khóa

| Thuật ngữ | Cách hiểu |
|---|---|
| Logit / sigmoid | Điểm thô / phép biến đổi thành giá trị trong (0,1) |
| Loss / cost | Mức sai từng mẫu / mục tiêu tổng hợp theo quy ước |
| Computation graph | Các phép tính và quan hệ phụ thuộc |
| Chain rule | Quy tắc đạo hàm của hàm hợp |
| Vectorization / broadcasting | Tính bằng mảng / mở rộng chiều tương thích |
| Shape / transpose | Kích thước các chiều / chuyển vị |
| Cache | Giá trị trung gian lưu để dùng lại |
| Symmetry breaking | Phá việc nhiều neuron luôn tính và học giống nhau |
