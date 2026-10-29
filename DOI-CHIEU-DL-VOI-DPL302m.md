# Đối chiếu bộ nền tảng cũ với môn DPL302m và trạng thái bổ sung

Ngày đối chiếu: 29/10/2026.

## Trạng thái sau khi có text slide

Đã bổ sung [72 câu DPL302m theo 5 chương](DPL302m/README.md), dựa trên 17 file trong `extracted_texts` và tham khảo 5 bản `summaries`. Bộ mới đi qua các chủ đề cơ bản của cả 17 bài; mức bao phủ và ánh xạ câu–bài nằm ở README đó. Đã thêm ví dụ, mẫu đáp và 19 bài tự kiểm tra, chưa thay thế thực hành code hoặc mọi chi tiết của slide.

Text extraction xác nhận các khoảng trống lớn được nêu dưới đây, đồng thời cho thấy **một số số trang trong bản đồ bị lệch**. Tài liệu mới dùng marker slide thực trong text. Phần bài 2.3 còn có mục tiêu GradientTape/tf.Variable/tf.function, bài 4.3 có region proposals optional, bài 5.4 có mục tiêu fine-tuning NER/QA. Các mục này được bổ sung hoặc nêu ở độ sâu nhập môn phù hợp.

Các công thức/hình bị mất hoặc vỡ trong text chưa được kiểm chứng trực tiếp bằng hình PowerPoint; công thức chuẩn được viết lại và phần bổ sung được ghi rõ. Ví dụ GPT được nhắc trong bản đồ/tóm tắt nhưng chưa tìm thấy tên trong text bài 5.4, nên phần so sánh với GPT được gắn nhãn bổ sung, không khẳng định đã được giảng sâu.

Bảng bên dưới lưu lại đánh giá **bộ 35 câu DL cũ trước cập nhật**, không phải kết luận rằng các phần mới vẫn còn trống.

## Kết luận ban đầu về bộ cũ

**Chưa bao phủ đầy đủ môn DPL302m.** Bộ 35 câu DL hiện tại là bài nhập môn tổng quát, hữu ích để hiểu mạng và một vòng huấn luyện, nhưng còn thiếu nhiều chủ đề cụ thể của môn học. Phần ML hỗ trợ thêm một số nội dung, nhưng không bù được các khoảng trống lớn về Computer Vision, mô hình chuỗi/NLP và chiến lược phát triển hệ thống.

Bộ trước được soạn khi chỉ có yêu cầu chung gồm bốn mảng, chưa có đề cương môn này. Do đó, số lượng 140 câu toàn bộ không đồng nghĩa đã bao phủ chương trình DPL302m: riêng DL chỉ có 35 câu, và một số câu chia sẻ nội dung nền tảng với ML.

Không nên xem nhãn A/B/C hiện tại là thứ tự ôn phù hợp hoàn toàn với môn học. Ví dụ Transformer và residual connection đang ở C vì bộ cũ ưu tiên người mới, nhưng chúng nằm trong chương trình của bạn và cần được ôn theo phạm vi thầy yêu cầu.

## Nguồn và cách đánh giá

Đối chiếu dựa trên:

- Bản đồ chương trình: `F:\1. FPT Material\Sem5\DPL302m\SLIDE_CURRICULUM_MAP.md`.
- [35 câu DL](Chuyen-de/03-Deep-Learning.md).
- [35 câu ML](Chuyen-de/02-Machine-Learning.md), nhất là chia dữ liệu, bias/variance, metrics và lựa chọn mô hình.

Đây là đối chiếu với **bản đồ nội dung được cung cấp**, chưa phải kiểm chứng từng trang PowerPoint gốc. Mốc slide trong báo cáo lấy theo bản đồ, không được xác minh độc lập bằng file PPTX.

Quy ước:

- **Khá ở mức nhập môn:** đã có trục kiến thức chính đủ để giải thích tổng quan, vẫn có thể thiếu toán hoặc thực hành.
- **Một phần:** đã giải thích một số concept, nhưng còn các nội dung đáng kể hoặc độ sâu chưa đủ so với bản đồ.
- **Rất ít:** chủ yếu có một vài ý dẫn nhập/liên quan, chưa đủ học bài đó.
- **Chưa có nội dung chuyên biệt:** không có phần dạy trực tiếp các concept đặc trưng của bài; một thuật ngữ xuất hiện thoáng qua không được tính là đã bao phủ.

Không đưa phần trăm bao phủ vì các chủ đề có độ rộng và trọng số khác nhau, đồng thời chưa có rubric kiểm tra của thầy.

## Bảng đối chiếu đủ 17 bộ slide

| Bài | Mức của bộ cũ | Các câu cũ đã hỗ trợ | Phần thiếu hoặc chưa đủ sâu trước bổ sung |
|---|---|---|---|
| **1.1: Introduction to DL** | Khá ở mức nhập môn | DL01, DL29; ML01, ML04 | Phân biệt structured/unstructured thành câu rõ ràng; quan hệ giữa quy mô dữ liệu, tính toán và năng lực mô hình. Không cần học thuộc các câu khẩu hiệu hoặc mốc lịch sử để hiểu bản chất. |
| **1.2: Basic Neural Network** | Một phần | DL03, DL07–DL11; ML20 | Logistic regression như một mạng cụ thể; công thức BCE/cost trên m mẫu; computation graph có nhiều bước; suy ra dz=a−y; vectorization, NumPy broadcasting, lỗi shape `(n,)` so với `(n,1)`. |
| **1.3: Shallow Neural Networks** | Một phần | DL04–DL06, DL10, DL19 | Ký hiệu tầng/neuron, công thức forward/backward cho một tầng ẩn trên m mẫu; Leaky ReLU, đạo hàm activation, thao tác nhân từng phần tử; tính toán ví dụ mạng hai tầng. |
| **1.4: Deep Neural Networks** | Một phần | DL01–DL04, DL10; ML03 | Shape W, b, Z, A theo từng tầng; kiểm tra một phép nhân ma trận cụ thể; cache forward/backward; đếm tầng, số neuron và tham số; biểu diễn phân tầng ở độ sâu của bài học. |
| **2.1: Practical Aspects** | Một phần, đã có nhiều ý nền | DL14–DL20, DL22; ML07, ML13, ML16–ML18 | Inverted dropout và keep_prob; công thức L2 và gradient; He/Xavier mới nêu tên; gradient checking chưa có; liên hệ chuẩn hóa với tối ưu cần ví dụ sâu hơn. |
| **2.2: Optimization Algorithms** | Một phần, thiên về trực giác | DL11–DL13, DL21, DL33; DL09 nhắc điểm yên ngựa | Exponentially weighted averages; Momentum, RMSprop, Adam thành các quy tắc phân biệt được; bias correction; ý nghĩa beta/epsilon; plateau/saddle point và giới hạn của optimizer. Nhắc Adam chưa đủ thay cả bài tối ưu. |
| **2.3: Hyperparameter Tuning** | Một phần | DL07, DL13, DL23; ML03 | Random search vs grid search, log scale, coarse-to-fine, Panda/Caviar; công thức BatchNorm, gamma/beta, khi nào bias trước BN dư thừa; softmax/cross-entropy có công thức và shape; bước dùng framework căn bản. |
| **3.1: ML Strategy** | Rất ít so với bài | ML07, ML17, ML29–ML31, ML34; DL14, DL17 | Orthogonalization; optimizing vs satisficing metric; human-level performance, Bayes optimal error, avoidable bias; phân tích khoảng cách sai số; khi nào điều chỉnh dev/test và metric. Biết định lý Bayes không đồng nghĩa đã học Bayes optimal error. |
| **3.2: Error Analysis** | Một phần | DL14, DL17, DL28, DL30; ML11, ML34, ML35 | Bảng phân loại lỗi và trần cải thiện; quy trình sửa nhãn dev/test; training-dev để tách variance/data mismatch; multi-task learning; end-to-end vs pipeline; giới hạn dữ liệu tổng hợp. |
| **4.1 - CNN** | Một phần | DL24–DL25 | Tự tính convolution 2D; Sobel/Scharr; valid/same và điều kiện của công thức padding; cross-correlation; shape volume RGB; đếm tham số conv; theo dõi kích thước qua cả ConvNet. |
| **4.2: CNN Case Studies** | Rất ít | DL34 về residual; DL16, DL28 về augmentation/transfer | LeNet, AlexNet, VGG; ResNet/degradation và các loại block; Inception, conv 1×1; depthwise separable convolution/MobileNet; compound scaling/EfficientNet. Residual connection mới là một phần nhỏ. |
| **4.3: Object Detection** | Chưa có nội dung chuyên biệt | DL16 chỉ nhắc biến đổi ảnh phải đổi bounding box | Classification/localization/detection; landmark; sliding-window detection; YOLO theo phiên bản giảng; IoU, NMS, anchor boxes; semantic segmentation, U-Net, transposed convolution. Cửa sổ trượt ở Giải thuật không thay cho bài detection này. |
| **4.4: Face Recognition** | Chưa có nội dung chuyên biệt | DL27 là nền về embedding, DL01 nhắc biểu diễn phân tầng | Verification vs recognition; one-shot; Siamese; triplet loss và margin; hard triplets; so khớp embedding; trực quan ConvNet; neural style transfer, content/style loss, Gram matrix; conv 1D/3D. |
| **5.1 - RNN** | Rất ít | DL26, DL20 | Forward RNN theo thời gian; BPTT; one-to-many/many-to-one/many-to-many; language model và sinh chuỗi; GRU; các cổng và cell state của LSTM; bidirectional/deep RNN. Một câu “RNN và LSTM là gì” không đủ thay bài này. |
| **5.2: NLP & Word Embeddings** | Rất ít | DL27; ML12 hỗ trợ one-hot khái quát | Ma trận embedding/lookup; cosine similarity; analogies và giới hạn; Word2Vec Skip-gram/CBOW theo phạm vi bản đồ; negative sampling; GloVe; debiasing và giới hạn. |
| **5.3: Sequence Models & Attention** | Chưa có phần chuyên biệt cho hầu hết nội dung | DL31 chỉ hỗ trợ ý tưởng attention nói chung | Encoder–decoder/Seq2Seq; image captioning; greedy vs beam search; log probability, length normalization; phân tích lỗi search/model; BLEU; Bahdanau attention; speech recognition/CTC/trigger-word detection. |
| **5.4: Transformer** | Một phần, mới ở nhận diện | DL31–DL32, DL34; DL27 là nền embedding | Công thức scaled dot-product attention và chia sqrt(dk); phép chiếu Q/K/V; multi-head; self vs cross-attention; encoder/decoder block; LayerNorm; positional encoding cụ thể; BERT vs GPT. |

## Những gì có thể học ngay từ bộ cũ

Bộ cũ vẫn làm tốt vai trò bước đệm. Các nhóm sau đã có định nghĩa, ví dụ và mẫu trả lời để bạn bắt đầu:

1. Nơ-ron, weight/bias, tầng ẩn, activation và forward pass - DL03–DL06.
2. Loại đầu ra, loss, gradient, backprop khác optimizer, bước gradient descent - DL07–DL11.
3. Batch/epoch/step, learning rate, overfit, early stopping, augmentation, chia tập - DL12–DL18.
4. Khởi tạo và vấn đề gradient ở mức trực giác - DL19–DL20.
5. Dropout/regularization và BatchNorm ở mức nguyên lý - DL22–DL23.
6. CNN/kernel/stride/padding/pooling nhập môn - DL24–DL25.
7. Transfer learning/fine-tuning - DL28.

Các nhóm này hữu ích nhưng không chứng minh đã đáp ứng độ sâu tính toán hoặc giải thích cơ chế mà môn học có thể yêu cầu.

## Ví dụ câu hỏi từ chương trình mà bộ hiện tại chưa chuẩn bị đủ

1. Với m mẫu và tầng trước có n đầu ra, W, b, Z, A ở tầng kế có kích thước gì? Vì sao cộng b được?
2. Vectorization khác dùng vòng for như thế nào? Broadcasting có thể gây lỗi âm thầm gì?
3. Vì sao inverted dropout chia activation cho keep_prob lúc train?
4. Momentum, RMSprop và Adam khác nhau ở đại lượng tích lũy nào? Vì sao cần bias correction?
5. Gradient checking kiểm tra gì? Vì sao không dùng nó để huấn luyện trực tiếp?
6. Train error 8%, training-dev error 9%, dev error 20% gợi ý vấn đề nào? Cần giả định gì khi so sánh?
7. Một lớp conv có filter 3×3, 16 kênh vào và 32 kênh ra thì có bao nhiêu tham số nếu mỗi filter có một bias?
8. Conv 1×1 để làm gì? Depthwise separable convolution khác convolution thông thường ở đâu?
9. IoU khác confidence thế nào? Vì sao detection thường cần NMS?
10. Classification, detection và segmentation có đầu ra khác nhau ra sao?
11. Siamese network và triplet loss học cách so sánh khuôn mặt thế nào?
12. LSTM có những cổng nào? Cell state khác hidden state thế nào?
13. Skip-gram khác CBOW như thế nào? Negative sampling giúp giảm công việc gì?
14. Beam search khác greedy decoding ra sao? Vì sao phải xét độ dài câu?
15. Attention(Q,K,V) tính như thế nào? Vì sao có sqrt(dk)?
16. Self-attention khác cross-attention ở nguồn Q, K, V thế nào? BERT và GPT dùng phần nào của Transformer?

Danh sách này minh họa các lỗ hổng, không phải dự đoán thầy sẽ hỏi đúng 16 câu đó.

## Cách điều chỉnh tài liệu để bám môn học

Nên giữ bộ cũ làm **nền tảng chung**, rồi bổ sung một bộ **DPL302m theo 17 bài**, thay vì tiếp tục ép toàn môn vào 35 câu.

Mỗi concept trong bộ bổ sung cần:

- Mã bài và tên bộ slide; mốc trang theo bản đồ, ghi rõ chưa xác minh nếu chưa mở slide gốc.
- Những câu nền tảng đã có để đọc trước, tránh giảng trùng toàn bộ.
- Giải thích dễ hiểu, một ví dụ thực sự tính hoặc chạy tay được, mẫu trả lời miệng và một câu hỏi nối tiếp.
- Công thức kèm định nghĩa ký hiệu, shape và điều kiện áp dụng khi relevant.
- Phân biệt “cần hiểu cơ chế” với “cần tính toán” và “nhận diện kiến trúc”.

Thứ tự bổ sung đề xuất dựa vào mức thiếu và quan hệ tiên quyết, không dự báo đề thi:

1. Bổ sung nền toán/thực hành của 1.2–1.4 và kỹ thuật huấn luyện 2.1–2.3 để không học các kiến trúc sau bằng tên gọi.
2. Dựng phần còn trống rõ nhất ở 4.3–4.4: detection, segmentation, face recognition.
3. Mở rộng chuỗi 5.1–5.4: RNN/LSTM/GRU → embeddings → Seq2Seq → Transformer.
4. Bổ sung 3.1–3.2 và so sánh các CNN ở 4.2. Nếu thầy nhấn mạnh strategy hoặc case studies thì đưa các phần này lên sớm hơn.

## Tác động tới prompt website đã viết

Prompt Antigravity hiện yêu cầu đúng 140 câu và các ID DL01–DL35. Đó là mô tả bộ nội dung cũ, **không phải tiêu chí bao phủ DPL302m**.

Nếu bổ sung nội dung môn học, cần cập nhật đặc tả trước khi nhập bộ mới:

- Tách navigation “Nền tảng chung” và “DPL302m theo bài/slide”, liên kết giữa hai đường học.
- Cho schema chứa courseId/lessonId/source references; giữ ID cũ để không mất tiến độ.
- Thay kiểm tra hardcode “mọi thứ tổng cộng 140” bằng manifest của từng bộ; vẫn kiểm tra đủ 140 câu của bộ nền tảng cũ.
- Thêm audit theo 17 bài và concept, không chỉ đếm số câu.
- Xem lại mô phỏng cần bổ sung như convolution/shape, IoU/NMS, LSTM gates hoặc attention, sau khi nội dung tương ứng đã được xác minh.

Đánh giá ban đầu là cơ sở của bộ bổ sung mới. Các ID và nội dung của bộ cũ được giữ; nội dung mới nằm riêng ở `DPL302m/`. Có [phụ lục cập nhật website](Trien-khai-web/CAP-NHAT-NOI-DUNG-DPL302m.md) để nhập thêm sau, không cần đổi mã câu cũ hoặc xóa tiến độ.

## Lưu ý khi dùng bản đồ làm nguồn biên soạn

Bản đồ giúp biết phạm vi, nhưng một vài câu tóm tắt cần diễn giải có điều kiện khi chuyển thành tài liệu học:

- “Filter luôn có kích thước lẻ” không phải quy tắc bắt buộc. Công thức same padding p=(f−1)/2 là trường hợp thông dụng với stride 1, filter lẻ và padding đối xứng.
- IoU 0,5 là một ngưỡng ví dụ/phụ thuộc giao thức đánh giá, không phải ngưỡng phổ quát. Để tính TP trong detection còn cần lớp và quy tắc ghép dự đoán với ground truth.
- Bài YOLO mô tả cách dùng grid/anchor của các phiên bản nhất định; không nên suy ra mọi YOLO đều dùng cùng thiết kế.
- BatchNorm có nhiều cách giải thích về hiệu quả tối ưu; không nên coi “giải quyết internal covariate shift” là nguyên nhân duy nhất đã được xác lập.
- Giảm số chiều tính toán tuần tự của Transformer không đồng nghĩa mọi tính toán attention là O(n); dense self-attention có chi phí bậc hai theo độ dài chuỗi cho ma trận attention, còn phụ thuộc chiều biểu diễn.
- CTC là một mục tiêu cho bài toán căn chỉnh chuỗi; không phải tên khác của attention hoặc thành phần bắt buộc của mọi hệ attention.

Đây là những chỗ cần kiểm tra kỹ khi biên soạn tiếp, không phải kết luận rằng các slide gốc dạy sai.
