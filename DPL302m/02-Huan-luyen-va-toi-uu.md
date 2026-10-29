# Chương 2: Huấn luyện và tối ưu hóa: hiểu vì sao mạng học tốt hoặc học hỏng

Chương này bám ba bài **2.1 Practical Aspects**, **2.2 Optimization Algorithms**, **2.3 Hyper parameter tuning** của DPL302m. Có **14 câu: 11 Cốt lõi, 3 Đọc tiếp**. Nhãn chỉ thứ tự học, không dự đoán câu thi.

Nếu chưa hiểu forward, loss, gradient và backprop, đọc DL07–DL13 trong [bộ DL nền tảng](../Chuyen-de/03-Deep-Learning.md) trước. Mạch của chương là: **chia dữ liệu đúng → chẩn đoán lỗi → kiểm soát overfitting → chuẩn bị tín hiệu/gradient → chọn cách cập nhật → chọn siêu tham số**.

Đường đọc nhanh: DPL2-01 → 02 → 03 → 04 → 05 → 06 → 07 → 09 → 10 → 11 → 14. Sau đó đọc 08 để biết kiểm tra gradient, 12 về lịch learning rate và 13 về tìm cấu hình. Mỗi câu hãy tự trả lời một lần trước khi xem mẫu đáp.

## Nguồn và cách sử dụng

Nguồn chính là text trích xuất có marker `--- Slide N ---` trong `F:\1. FPT Material\Sem5\DPL302m\extracted_texts`:

- `2.1 Practical Aspects of Deep Learning.txt` - 74 marker slide.
- `2.2 Optimization Algorithms.txt` - 59 marker slide.
- `2.3 Hyper parameter tuning.txt` - 54 marker slide.

Số slide dưới đây lấy từ marker thực trong text, không lấy khoảng trang của bản đồ mục lục. Một số slide mất công thức/hình khi trích text; công thức chuẩn và ví dụ số được diễn giải bổ sung để học, không coi là bản chép nguyên văn hình slide. Những đoạn “Trả lời miệng”, ví dụ và bài tập là phần biên soạn mới. File `summaries/ch2_training_and_optimization.md` là nguồn tham khảo phụ; không mặc định mọi khẳng định trong bản tóm tắt đúng cho mọi tình huống.

## DPL2-01 [Cốt lõi] Train, dev, test dùng để làm gì? Có tỷ lệ chia bắt buộc không?

**Nguồn:** `2.1 Practical Aspects of Deep Learning.txt`, slide 3–8.

**Hiểu từ đầu:** Train là tập cho mạng học trọng số. Dev, cũng gọi validation, giúp chọn kiến trúc, learning rate, số epoch hoặc ngưỡng dự đoán. Test dùng để đánh giá cuối sau khi chốt các lựa chọn. Nếu liên tục nhìn test rồi sửa mô hình, ta đã dùng nó như dev và làm đánh giá cuối thiên lệch.

Không có tỷ lệ cố định cho mọi bài toán. Với hàng triệu mẫu, 1% dữ liệu vẫn có thể đủ lớn cho dev, nhưng “1%” tự nó không bảo đảm đại diện hoặc độ tin cậy. Dev/test nên phản ánh tình huống muốn sử dụng mô hình; dữ liệu cùng người, gần trùng hoặc theo thời gian cần chia phù hợp trước khi tiền xử lý có học tham số.

**Ví dụ:** mô hình dùng cho ảnh điện thoại nhưng train toàn ảnh web rõ nét. Dev/test chỉ gồm ảnh web sẽ không cho biết tốt khả năng dùng trên điện thoại. Cần tập đánh giá phản ánh mục tiêu thực tế; việc trộn dữ liệu đòi hỏi kiểm tra phân phối.

**Trả lời miệng:** “Train để học tham số, dev để lựa chọn cấu hình, test để đánh giá cuối. Em chọn kích thước và cách chia theo dữ liệu, không áp dụng máy móc một tỷ lệ. Tập đánh giá phải gần tình huống sử dụng và không bị rò rỉ thông tin vào huấn luyện.”

**Hỏi tiếp:** Không có test có train được không? → Có, nhưng khi chỉ dùng dev để điều chỉnh, ta thiếu một tập độc lập cho đánh giá cuối. Train được khác với đánh giá khách quan được.

## DPL2-02 [Cốt lõi] Nhìn train/dev error để phân biệt bias và variance thế nào?

**Nguồn:** `2.1 Practical Aspects of Deep Learning.txt`, slide 9–20; giả định được nêu rõ ở slide 16.

**Hiểu từ đầu:** Trong chẩn đoán nhập môn, train error cao so với mức có thể đạt được gợi ý mô hình chưa học tốt, thường gọi high bias. Train thấp nhưng dev cao hơn nhiều gợi ý high variance: khả năng tổng quát hóa kém. Cả hai vấn đề có thể cùng xuất hiện.

Phải so trên cùng thước đo và bối cảnh. Train 10% không tự động “cao”: nếu bài rất khó và sai số không thể tránh gần 10% thì kết luận khác. Nếu train và dev khác phân phối, khoảng cách còn có thể do data mismatch. Việc tách training-dev được học kỹ hơn ở chương 3.

**Ví dụ:** giả sử mức lỗi tham chiếu phù hợp khoảng 1%, train/dev cùng phân phối. Train 1%, dev 12% gợi ý variance; train 15%, dev 16% gợi ý bias; train 15%, dev 28% gợi ý cả hai. Chưa được kết luận nguyên nhân duy nhất từ hai con số.

**Trả lời miệng:** “Em so lỗi train với mức lỗi có thể đạt được, rồi xem khoảng cách dev–train. Nếu train còn kém, em kiểm tra năng lực mô hình, dữ liệu và tối ưu. Nếu train tốt nhưng dev kém, em kiểm tra overfitting và phân phối trước khi thêm dữ liệu hay regularization.”

**Hỏi tiếp:** Thêm regularization khi train đã rất kém có luôn giúp? → Không; regularization quá mạnh có thể làm thiếu khớp nặng hơn. Phải xử lý theo chẩn đoán.

## DPL2-03 [Cốt lõi] L2 regularization làm gì? Có phải luôn là weight decay?

**Nguồn:** `2.1 Practical Aspects of Deep Learning.txt`, slide 21–30. Phân biệt với AdamW là giải thích bổ sung.

**Hiểu từ đầu:** L2 thêm hình phạt cho trọng số lớn vào mục tiêu học. Ví dụ dùng quy ước `J = J_data + (λ/2)Σw²`, với λ ≥ 0, thì gradient của phần phạt theo w là λw. Optimizer vừa giảm sai số dữ liệu, vừa chịu áp lực giữ trọng số nhỏ hơn.

Với gradient descent cơ bản, cập nhật thành `w_mới = (1−ηλ)w − ηg_data`. Vì có hệ số co trọng số nên nó liên hệ với weight decay. Nhưng với optimizer thích nghi như Adam, thêm L2 vào loss không hoàn toàn tương đương tách một bước weight decay như AdamW. Nếu tài liệu dùng `λ/(2m)` thì gradient phần phạt là `λw/m`; cần nhất quán quy ước.

**Ví dụ:** w=2, gradient từ dữ liệu=0,5, η=0,1, λ=0,2. Gradient tổng là 0,9; w mới = 1,91. Không có L2 thì w mới = 1,95. L2 làm bước này co mạnh hơn, nhưng dùng quá mạnh có thể underfit.

**Trả lời miệng:** “L2 thêm hình phạt bình phương trọng số vào loss để hạn chế cách mô hình khớp dữ liệu. Với gradient descent nó tạo hiệu ứng co trọng số. Mức phạt cần chọn bằng dev; nó không bảo đảm mọi trọng số về 0 hoặc mọi mô hình đều tốt hơn.”

**Bẫy:** Trọng số nhỏ không đồng nghĩa mọi đặc trưng ít quan trọng; còn thang đo đầu vào và các tầng khác. Không nên giải thích L2 như chắc chắn biến toàn mạng phi tuyến thành tuyến tính.

## DPL2-04 [Cốt lõi] Inverted dropout là gì? Vì sao chia cho keep_prob?

**Nguồn:** `2.1 Practical Aspects of Deep Learning.txt`, slide 31–40, đặc biệt 33–36.

**Hiểu từ đầu:** Trong lúc train, dropout ngẫu nhiên bỏ một phần activation để mạng bớt phụ thuộc vào một nhóm đơn vị cố định. Gọi q=`keep_prob` là xác suất giữ, với 0<q≤1; mặt nạ d nhận 1 với xác suất q và 0 nếu bị bỏ.

Inverted dropout dùng `a_train = d×a/q`. Với a đang xét cố định, kỳ vọng theo mặt nạ là `E[d×a/q]=a`, vì E[d]=q. Đây là giữ kỳ vọng của activation tại phép dropout, không bảo đảm đầu ra toàn mạng sau các phi tuyến có kỳ vọng hoàn toàn giống mạng không dropout. Khi inference thông thường, tắt dropout và dùng activation không bị bỏ.

**Ví dụ:** a=4, q=0,8. Khi được giữ, giá trị là 5; khi bỏ là 0. Trung bình theo xác suất: `0,8×5 + 0,2×0 = 4`. Một lần chạy không nhất thiết giữ đúng 80% mọi đơn vị.

**Trả lời miệng:** “Inverted dropout bỏ ngẫu nhiên activation lúc train, rồi chia những activation còn lại cho xác suất giữ để bảo toàn kỳ vọng tại bước đó. Khi dự đoán thông thường thì không bỏ đơn vị. Dropout quá mạnh có thể làm học khó, nên tỷ lệ cần được chọn phù hợp.”

**Hỏi tiếp:** `dropout rate=0,2` có phải `keep_prob=0,2`? → Không; keep_prob=0,8. Nhầm hai cách đặt tên sẽ làm rơi mất quá nhiều đơn vị.

## DPL2-05 [Cốt lõi] Augmentation và early stopping giúp giảm overfitting ra sao?

**Nguồn:** `2.1 Practical Aspects of Deep Learning.txt`, slide 41–44.

**Hiểu từ đầu:** Data augmentation tạo biến thể hợp lệ của dữ liệu train, giúp mô hình thấy thêm các tình huống mà ta muốn nó xử lý. Nó dựa vào giả định phép biến đổi giữ ý nghĩa nhiệm vụ: ảnh con mèo sáng hơn vẫn là mèo, nhưng xoay số 6 có thể đổi nhãn.

Early stopping theo dõi dev và dừng khi không cải thiện theo quy tắc, thường có patience để tránh phản ứng với một dao động. Lưu checkpoint tốt nhất thay vì mặc định dùng epoch cuối. Early stopping đồng thời ảnh hưởng mức tối ưu trên train và mức regularization, nên không phải hai “nút chỉnh” độc lập hoàn toàn.

**Ví dụ:** dev loss qua bốn lần đánh giá là 0,6; 0,4; 0,45; 0,5. Trong các bản đã lưu, bản thứ hai tốt nhất theo tiêu chí dev loss. Nếu đã thiết kế patience phù hợp thì có thể dừng sau các lần không cải thiện; không mở test để chọn epoch.

**Trả lời miệng:** “Augmentation giúp tăng sự đa dạng bằng biến đổi hợp lệ; early stopping giới hạn việc tiếp tục khớp train khi dev không còn cải thiện. Em chọn phép biến đổi giữ đúng nhãn, chia dữ liệu trước augmentation và khôi phục checkpoint phù hợp.”

**Hỏi tiếp:** Augmentation có thay hoàn toàn dữ liệu thật mới không? → Không. Nó chỉ tạo biến thể theo các giả định đã chọn và có thể không tái hiện được môi trường triển khai.

## DPL2-06 [Cốt lõi] Chuẩn hóa đầu vào khác biến dữ liệu thành phân phối chuẩn thế nào?

**Nguồn:** `2.1 Practical Aspects of Deep Learning.txt`, slide 45–51.

**Hiểu từ đầu:** Với mỗi đặc trưng, chuẩn hóa dạng z-score tính `x'=(x−μ)/σ`, dùng trung bình và độ lệch chuẩn từ train. Điều này đưa các đặc trưng về thang đo dễ xử lý hơn, thường hỗ trợ tối ưu khi một biến tính bằng nghìn và biến khác chỉ quanh 0–1.

Không tính μ,σ trên toàn bộ dữ liệu trước khi chia; đó là đưa thông tin của dev/test vào xử lý train. Sau khi học μ,σ từ train, dùng đúng chúng cho dev/test và inference. Chuẩn hóa chỉ đổi vị trí và thang đo, không biến mọi phân phối lệch thành phân phối chuẩn, cũng không bảo đảm loss luôn có hình tròn đẹp.

**Ví dụ:** train cho μ=50, σ=10. Một mẫu mới x=70 thành 2. Nếu dev tự tính một μ khác để biến cùng giá trị thành số khác, mô hình nhận thang đo không nhất quán.

**Trả lời miệng:** “Chuẩn hóa giúp các đặc trưng có thang đo phù hợp hơn cho tối ưu. Em học thống kê trên train rồi áp dụng lại cho các tập khác. Đây không phải biến dữ liệu thành phân phối chuẩn, và cần xử lý cột có độ lệch chuẩn bằng 0.”

**Hỏi tiếp:** Chia cho phương sai hay độ lệch chuẩn? → Z-score chia cho độ lệch chuẩn σ. Phương sai là σ²; trộn hai khái niệm tạo phép biến đổi khác.

## DPL2-07 [Cốt lõi] Vì sao cần khởi tạo ngẫu nhiên, Xavier hoặc He?

**Nguồn:** `2.1 Practical Aspects of Deep Learning.txt`, slide 53–61; xem thêm DL19–DL20 ở bộ nền tảng.

**Hiểu từ đầu:** Các nơ-ron ẩn khởi tạo giống hệt nhau có thể nhận gradient giống nhau và học cùng một đặc trưng. Khởi tạo ngẫu nhiên phá đối xứng. Tuy nhiên, “ngẫu nhiên” chưa đủ: trọng số quá lớn/nhỏ có thể làm activation và gradient phóng đại hoặc suy giảm qua nhiều tầng.

He cho ReLU thường lấy trọng số có phương sai `2/fan_in`, tức lấy chuẩn tắc nhân `sqrt(2/fan_in)`. Xavier/Glorot thường phù hợp tanh hoặc phép biến đổi gần tuyến tính; dạng thông dụng cân bằng fan-in/fan-out có phương sai `2/(fan_in+fan_out)`. Dạng `1/fan_in` trong bài là một trực giác/biến thể đơn giản, trùng khi fan-in=fan-out. Bias bằng 0 thường vẫn hợp lệ.

**Ví dụ:** fan_in=100, He normal có độ lệch chuẩn `sqrt(0,02)≈0,1414`. Không phải đặt mọi trọng số bằng 0,1414; đó là thang của phân phối ngẫu nhiên.

**Trả lời miệng:** “Khởi tạo cần vừa phá đối xứng vừa giữ thang tín hiệu hợp lý qua các tầng. He thường dùng với ReLU; Xavier thường dùng với tanh và các cấu hình phù hợp. Chúng giúp giảm vấn đề gradient nhưng không bảo đảm loại bỏ hoàn toàn vanishing hoặc exploding.”

**Hỏi tiếp:** Gradient clipping có chữa vanishing gradient không? → Nó chủ yếu giới hạn gradient quá lớn, không khôi phục gradient đã quá nhỏ.

## DPL2-08 [Đọc tiếp] Gradient checking kiểm tra gì và vì sao không dùng để train?

**Nguồn:** `2.1 Practical Aspects of Deep Learning.txt`, slide 62–72.

**Hiểu từ đầu:** Ta muốn kiểm tra mã backprop có tính đúng đạo hàm không. Với tham số θᵢ, xấp xỉ gradient bằng cách dịch θᵢ một lượng nhỏ ở hai phía: `[J(θ+εeᵢ)−J(θ−εeᵢ)]/(2ε)`, trong đó eᵢ chỉ thay đúng tọa độ i.

So vector gradient số với gradient backprop, ví dụ dùng tỷ lệ `||g_num−g_bp||/(||g_num||+||g_bp||)`, có xử lý trường hợp mẫu số gần 0. Phép thử tốn nhiều lượt forward theo số tham số nên phù hợp debug trên mạng/dữ liệu nhỏ. Cần cùng dữ liệu, cùng mục tiêu gồm regularization, kiểm soát ngẫu nhiên; thường tắt dropout. Kiểm tra ngay tại điểm gãy của ReLU, hoặc chọn ε quá lớn/quá nhỏ, có thể làm kết quả khó diễn giải.

**Ví dụ:** J(w)=w², w=3, ε=0,001. Hiệu hai phía là `((3,001)²−(2,999)²)/0,002=6`, khớp đạo hàm 2w. Trong tính toán số thực có sai số làm tròn nên không đòi hai vector giống tuyệt đối.

**Trả lời miệng:** “Gradient checking dùng sai phân hữu hạn để đối chiếu đạo hàm do backprop tính. Nó giúp tìm lỗi triển khai, không thay backprop trong train vì rất tốn. Em giữ phép tính xác định, tính cả phần phạt và hiểu rằng ngưỡng sai số phụ thuộc độ chính xác số và hàm đang kiểm tra.”

**Bẫy:** Chọn ε=10⁻⁷ không tự bảo đảm đúng; ngưỡng trong ví dụ giảng dạy không là luật cho mọi kiểu dữ liệu và mô hình.

## DPL2-09 [Cốt lõi] Batch GD, SGD và mini-batch khác nhau ở đâu?

**Nguồn:** `2.2 Optimization Algorithms.txt`, slide 3–17.

**Hiểu từ đầu:** Full-batch tính gradient trên toàn bộ tập train cho một bước. SGD theo nghĩa chặt dùng một mẫu; mini-batch dùng một nhóm. Mini-batch tận dụng phép tính vector hóa mà không cần giữ toàn bộ dữ liệu trong bộ nhớ, nhưng gradient từng batch có nhiễu nên loss có thể dao động.

Epoch là một lượt qua train; step thường là một lần cập nhật. Kích thước batch ảnh hưởng bộ nhớ, số bước, tốc độ và đặc tính tối ưu. Các giá trị 32/64/128 là điểm thử thường gặp, không phải điều kiện bắt buộc hay bảo đảm batch càng lớn càng tốt. Optimizer có tên SGD trong thư viện vẫn thường chạy trên mini-batch.

**Ví dụ:** 1.030 mẫu, batch size 128: giữ batch cuối thì 9 step/epoch, trong đó batch cuối 6 mẫu. Bỏ batch cuối thì 8 step/epoch. Ví dụ giả định một batch dẫn tới một bước, không gradient accumulation.

**Trả lời miệng:** “Ba cách khác ở số mẫu dùng để ước lượng gradient mỗi bước. Mini-batch thường là lựa chọn thực tế vì cân bằng bộ nhớ và hiệu quả tính toán. Loss mỗi bước không bắt buộc giảm đều vì batch khác nhau; em theo dõi xu hướng và metric đánh giá phù hợp.”

**Hỏi tiếp:** Batch lớn gấp đôi có làm thời gian train giảm đúng một nửa không? → Không. Còn phần cứng, truyền dữ liệu, số phép tính và số epoch cần học.

## DPL2-10 [Cốt lõi] Trung bình trượt có trọng số mũ liên quan gì tới momentum?

**Nguồn:** `2.2 Optimization Algorithms.txt`, slide 18–38.

**Hiểu từ đầu:** Exponentially weighted average lưu một trung bình cập nhật dần: `v_t=βv_(t−1)+(1−β)x_t`. β gần 1 giữ ký ức lâu hơn và làm chuỗi mượt hơn, nhưng phản ứng chậm hơn với thay đổi. Trực giác độ dài ghi nhớ khoảng `1/(1−β)`, không phải một cửa sổ cắt cứng.

Momentum áp dụng ý tưởng này cho gradient g_t rồi cập nhật `w_t=w_(t−1)−ηv_t`. Các hướng gradient nhất quán được tích lũy, hướng đổi dấu liên tục bớt gây dao động. Có biến thể momentum không viết hệ số `(1−β)`; khi so công thức phải chú ý quy ước và learning rate tương ứng.

**Ví dụ:** v₀=0, β=0,9, gradient lần đầu 2 rồi 4. v₁=0,2; v₂=0,9×0,2+0,1×4=0,58. Giá trị không bằng trung bình cộng 3 vì có trọng số giảm dần và khởi tạo từ 0.

**Trả lời miệng:** “Momentum dùng thông tin gradient từ nhiều bước thay vì chỉ bước hiện tại. Nó có thể làm cập nhật bớt dao động và tiến nhanh theo hướng ổn định. Beta điều khiển mức ghi nhớ, còn learning rate vẫn quyết định độ lớn bước; momentum không bảo đảm luôn nhanh hơn.”

**Hỏi tiếp:** Vì sao trung bình ban đầu bị thấp khi bắt đầu bằng 0? → Chưa có đủ lịch sử nên hệ số tổng chưa bằng 1. Với EWMA khởi tạo 0, có thể hiệu chỉnh bằng chia `1−β^t`; Adam dùng ý tưởng này.

## DPL2-11 [Cốt lõi] RMSprop và Adam khác momentum thế nào? Bias correction làm gì?

**Nguồn:** `2.2 Optimization Algorithms.txt`, slide 31–34 và 39–48.

**Hiểu từ đầu:** RMSprop lưu trung bình trượt của **bình phương gradient**: `s_t=β₂s_(t−1)+(1−β₂)g_t²`, rồi cập nhật theo `g_t/(sqrt(s_t)+ε)`. Phép bình phương/căn/chia được thực hiện theo từng tham số. Chiều có lịch sử gradient lớn nhận điều chỉnh khác chiều có gradient nhỏ.

Adam kết hợp một trung bình của gradient `v_t=β₁v_(t−1)+(1−β₁)g_t` và một trung bình bình phương s_t. Khi khởi tạo cả hai bằng 0, dùng `v̂_t=v_t/(1−β₁^t)`, `ŝ_t=s_t/(1−β₂^t)`, rồi `w_t=w_(t−1)−ηv̂_t/(sqrt(ŝ_t)+ε)`. ε giúp ổn định mẫu số; β₁=0,9 và β₂=0,999 là các giá trị thử phổ biến, không phải tối ưu cho mọi bài.

**Ví dụ:** bước đầu g=2 cho v₁=0,2 và s₁=0,004 với hai beta trên. Hiệu chỉnh cho v̂₁=2 và ŝ₁=4. Tỷ lệ `2/(sqrt(4)+ε)` gần 1; bước cập nhật gần η, không phải 2η như GD thuần.

**Trả lời miệng:** “Momentum làm mượt gradient; RMSprop dùng bình phương gradient để điều chỉnh từng chiều. Adam kết hợp cả hai và hiệu chỉnh sự lệch do bắt đầu các trung bình bằng 0. Adam vẫn cần chọn learning rate và đánh giá bằng dev, không có bảo đảm luôn vượt SGD.”

**Bẫy:** Bias correction này không phải sửa high bias/underfitting của mô hình, cũng không phải cập nhật tham số bias b của nơ-ron.

## DPL2-12 [Đọc tiếp] Learning-rate decay giúp gì? Gradient bằng 0 có chắc là nghiệm tốt?

**Nguồn:** `2.2 Optimization Algorithms.txt`, slide 49–58.

**Hiểu từ đầu:** Learning-rate decay giảm η theo lịch hoặc tín hiệu để các bước về sau nhỏ hơn. Một lịch ví dụ là `η_epoch=η₀/(1+d×epoch)`. Ta có thể đi tương đối nhanh ở đầu và tinh chỉnh về sau, nhưng giảm quá sớm có thể làm mạng gần như ngừng học.

Không gian loss có thể có cực tiểu, cực đại, điểm yên ngựa và vùng phẳng. Ở điểm yên ngựa, một hướng có thể đi lên còn hướng khác đi xuống. Gradient nhỏ hoặc bằng 0 không tự chứng minh mô hình đã đạt nghiệm tốt nhất. Momentum/Adam đôi khi hỗ trợ quá trình tối ưu, nhưng không được khẳng định chúng luôn thoát mọi điểm yên ngựa hoặc tìm global minimum.

**Ví dụ:** η₀=0,1, d=0,1, epoch=10 thì η=0,05. Với hàm minh họa `f(x,y)=x²−y²`, tại (0,0) gradient bằng 0 nhưng tăng x làm f tăng, tăng y làm f giảm: đó là điểm yên ngựa.

**Trả lời miệng:** “Decay thay learning rate theo tiến trình để điều chỉnh độ lớn bước học. Em theo dõi cả tối ưu và dev để chọn lịch. Loss đứng yên có thể do learning rate, vùng phẳng hoặc lỗi khác; gradient bằng 0 chưa nói được đây là nghiệm tốt nhất.”

**Hỏi tiếp:** Learning-rate decay khác L2 weight decay không? → Có. Một cái thay η; một cái tác động lên trọng số. Tên đều có decay nhưng không cùng cơ chế.

## DPL2-13 [Đọc tiếp] Tìm siêu tham số thế nào để không phí công?

**Nguồn:** `2.3 Hyper parameter tuning.txt`, slide 3–16.

**Hiểu từ đầu:** Grid search thử các tổ hợp trên lưới đã chọn; random search lấy các cấu hình ngẫu nhiên trong miền. Khi chỉ vài siêu tham số thật sự quan trọng, random search có thể khảo sát nhiều giá trị khác nhau của chúng hơn với cùng ngân sách. Không phải random luôn thắng mọi lưới nhỏ có cơ sở.

Learning rate thường khác nhau theo bậc độ lớn, nên thử trên log scale: lấy r đều trong [−4,−1], đặt η=10^r. Khi đó vùng [10⁻⁴,10⁻³] được quan tâm ngang vùng [10⁻³,10⁻²], thay vì dồn hầu hết lượt vào khoảng có giá trị lớn. Với β gần 1, có thể lấy log scale cho `1−β`, rồi suy ra β.

**Ví dụ:** thử rộng, thấy η quanh 0,001 tốt thì lấy mẫu dày hơn ở miền đó, gọi là coarse-to-fine. “Panda” là chăm một vài lượt train khi ít tài nguyên; “Caviar” là chạy nhiều cấu hình song song. Đây là ví von về ngân sách, không phải thuật toán mới.

**Trả lời miệng:** “Em xác định miền thử và ngân sách, ưu tiên các siêu tham số ảnh hưởng lớn, chọn thang đo thích hợp rồi thu hẹp quanh vùng tốt. Mọi lựa chọn dựa trên dev; không dùng test làm bảng xếp hạng cấu hình. Em ghi lại cấu hình để kết quả tái lập được.”

**Hỏi tiếp:** Tăng gấp đôi số cấu hình thử có chắc tăng chất lượng thực tế? → Không. Có thể tốn hơn hoặc quá thích nghi với dev; cần đánh giá cuối độc lập và kiểm tra độ ổn định.

## DPL2-14 [Cốt lõi] BatchNorm hoạt động ra sao? Framework tự làm phần nào?

**Nguồn:** `2.3 Hyper parameter tuning.txt`, slide 17–29 (BatchNorm), 30–41 (softmax), 42–53 và mục tiêu slide 1 (framework). Chi tiết inference và cách diễn đạt TensorFlow 2 dưới đây là giải thích bổ sung; một số công thức BN không còn trong text trích xuất.

**Hiểu từ đầu:** BatchNorm chuẩn hóa giá trị trung gian theo các chiều thích hợp của mini-batch: `z_norm=(z−μ_batch)/sqrt(σ²_batch+ε)`, sau đó `z_out=γz_norm+β`. Gamma và beta là tham số được học, giúp mạng chọn lại thang và vị trí sau bước chuẩn hóa. Beta ở đây khác beta của Adam.

Trong cấu hình thường dùng, train dùng thống kê batch và cập nhật trung bình/phương sai chạy; inference dùng thống kê chạy đã lưu. Không chuẩn hóa một mẫu mới bằng cách tùy tiện tính lại mọi thống kê của tập test. Nếu BN đặt ngay sau phép affine, bias trước BN thường dư thừa trong cách đặt thông dụng vì bị trừ khi định tâm; đây không phải lệnh xóa mọi bias trong mọi kiến trúc. BN giúp tối ưu trong nhiều trường hợp, không bảo đảm luôn hiệu quả với mọi batch size.

**Ví dụ:** z=[2,4], μ=3, phương sai chia 2 là 1. Bỏ qua ε rất nhỏ, z_norm=[−1,1]. Nếu γ=2, β=3 thì đầu ra [1,5]. Như vậy đầu ra sau BN không bắt buộc có mean 0, variance 1 vì mạng còn học phép co/dịch.

**Trả lời miệng:** “BatchNorm chuẩn hóa activation trung gian rồi học thêm gamma và beta để giữ tính linh hoạt. Train và inference dùng thống kê khác nhau trong cấu hình phổ biến, nên cần chế độ đúng. Nó khác chuẩn hóa dữ liệu đầu vào và không thay thế việc chia dữ liệu hay chọn learning rate đúng.”

**Hỏi tiếp:** BN có bắt buộc loại bỏ overfitting không? → Không. Nhiễu do batch có thể tạo một hiệu ứng regularization, nhưng không thay mọi phương pháp kiểm soát overfit.

### Liên hệ softmax trong cùng bài 2.3

Với C lớp loại trừ nhau, `p_i=exp(z_i)/Σ_j exp(z_j)`, tổng p bằng 1. Để ổn định số học, có thể trừ cùng `max(z)` trước khi lấy exp. Cross-entropy của một nhãn đúng là `−log(p_đúng)`; đạo hàm theo logit là `p−y` cho một mẫu với nhãn one-hot. Nếu cost lấy trung bình m mẫu thì có thêm cách phân bố hệ số 1/m trong công thức gradient. Xem DL07–DL08 trong [bộ DL nền tảng](../Chuyen-de/03-Deep-Learning.md). Không dùng softmax để ép các nhãn cạnh tranh khi bài toán cho phép nhiều nhãn cùng đúng.

### TensorFlow: hiểu vai trò, không học lẫn hai thế hệ API

- `tf.Variable`: chứa giá trị có thể cập nhật, ví dụ trọng số. GradientTape mặc định theo dõi trainable variables được dùng trong phép tính được ghi lại.
- `tf.GradientTape`: ghi các phép toán phù hợp để tính đạo hàm bằng automatic differentiation; optimizer dùng gradient để cập nhật.
- `@tf.function`: chuyển hàm phù hợp sang computation graph nhằm hỗ trợ thực thi tối ưu; không tự bảo đảm mọi chương trình chạy nhanh hơn hoặc tự sửa lỗi dữ liệu.

Mục tiêu slide 1 có nhắc các API này, nhưng ví dụ slide 49–52 lại dùng `Session`, `placeholder` và `tf.train.GradientDescentOptimizer` theo cách TensorFlow 1. Đừng trộn chúng thành một chương trình TensorFlow 2 mà không có lớp tương thích. Điều cốt lõi cần trả lời: **mình định nghĩa forward/loss, framework tính gradient, optimizer cập nhật; vẫn phải chọn dữ liệu, loss, shape và chế độ train/inference đúng**.

## Bốn bài tự kiểm tra

### Bài 1: Chẩn đoán và chọn hướng xử lý

Giả sử train/dev cùng phân phối, sai số tham chiếu phù hợp khoảng 1%. Mô hình A có lỗi 2%/15%; B có lỗi 18%/19%. Gợi ý vấn đề gì và thử gì trước?

**Lời giải:** A có khoảng cách lớn, gợi ý variance; kiểm tra leakage/cách chia, rồi cân nhắc dữ liệu phù hợp và regularization. B train đã kém, gợi ý bias hoặc tối ưu chưa tốt; xem kiến trúc, đặc trưng, dữ liệu, learning rate và thời gian học. Không chỉ tăng L2 cho B. Đây là chẩn đoán có điều kiện, chưa chứng minh nguyên nhân.

### Bài 2: Inverted dropout

Activation [2,4,6,8], keep_prob=0,5, mặt nạ [1,0,1,0]. Đầu ra train là gì? Mỗi activation có kỳ vọng ra sao nếu lấy mặt nạ ngẫu nhiên đúng q?

**Lời giải:** Nhân mặt nạ rồi chia 0,5 được [4,0,12,0]. Với một activation a, xác suất 0,5 cho 2a và 0,5 cho 0, nên kỳ vọng là a. Không suy ra tổng của mọi lần chạy đều bằng tổng đầu vào.

### Bài 3: Một bước L2 và Adam

(a) Dùng `J=J_data+(λ/2)w²`, w=2, g_data=0,5, λ=0,2, η=0,1. Tính w mới bằng GD. (b) Adam bước đầu có g=2, β₁=0,9, β₂=0,999, hai bộ tích lũy ban đầu bằng 0. Tính hai moment sau hiệu chỉnh.

**Lời giải:** (a) g tổng=0,5+0,4=0,9; w mới=1,91. (b) v=0,2, s=0,004; v̂=0,2/0,1=2, ŝ=0,004/0,001=4. Hiệu chỉnh này bù khởi tạo moment bằng 0, không sửa bias dự đoán của mô hình.

### Bài 4: Chuẩn hóa và BatchNorm

(a) Train cho μ=10, σ=2. Mẫu dev x=14 được chuẩn hóa thế nào? (b) Một kênh BN có batch [2,4], γ=2, β=3; bỏ qua ε nhỏ, đầu ra là gì? (c) Inference có dùng lại thống kê của batch test hiện tại theo cách train thông thường không?

**Lời giải:** (a) (14−10)/2=2, dùng thống kê train. (b) Mean=3, variance=1, chuẩn hóa [−1,1], đầu ra [1,5]. (c) Trong cấu hình BN phổ biến có running statistics, dùng thống kê chạy đã lưu; hành vi cụ thể vẫn cần xem cấu hình framework. Chuẩn hóa đầu vào và BN nằm ở hai vị trí khác nhau.

## Từ điển ngắn để trả lời bằng lời của mình

| Thuật ngữ | Ý nghĩa trong chương |
|---|---|
| Dev / validation | Tập dùng lựa chọn cấu hình và theo dõi tổng quát hóa |
| Regularization | Hạn chế cách mô hình khớp dữ liệu để hỗ trợ tổng quát hóa |
| Keep probability | Xác suất giữ đơn vị ở dropout |
| Initialization | Khởi tạo tham số trước khi học |
| Fan-in / fan-out | Số đầu vào / đầu ra của tầng theo quy ước đang xét |
| Gradient checking | Đối chiếu gradient backprop với xấp xỉ sai phân hữu hạn |
| EWMA / momentum | Trung bình trượt có trọng số mũ / dùng lịch sử gradient khi cập nhật |
| Bias correction | Hiệu chỉnh moment khởi tạo từ 0, không phải underfitting |
| Learning-rate decay | Giảm tốc độ học theo quy tắc |
| Plateau / saddle point | Vùng phẳng / điểm yên ngựa của hàm mục tiêu |
| BatchNorm | Chuẩn hóa giá trị trung gian theo batch và học co/dịch |
| Automatic differentiation | Tự động tính đạo hàm của chương trình từ các phép toán |

**Kiểm tra cuối:** Hãy kể được ba việc khác nhau: “mạng tính gradient thế nào”, “optimizer dùng gradient thế nào”, “dev giúp chọn mô hình thế nào”. Nếu đang gộp chúng làm một, quay lại DL10–DL11 và DPL2-01 trước khi học thêm tên thuật toán.
