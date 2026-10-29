# DPL302m — RNN, NLP, Attention và Transformer

Tài liệu bám bốn bài 5.1–5.4 của môn DPL302m, giúp người mới hiểu cơ chế để trả lời vấn đáp. Đây là phần bổ sung cho [35 câu DL nền tảng](../Chuyen-de/03-Deep-Learning.md), đặc biệt các câu DL26, DL27, DL31 và DL32; không thay thế bài lab hoặc toàn bộ chứng minh toán học.

**Nguồn chính:** bốn file trong `F:\1. FPT Material\Sem5\DPL302m\extracted_texts`. Số slide dưới mỗi câu lấy từ marker `--- Slide N ---` thực tế, không lấy từ bản đồ vì một số khoảng trang trong bản đồ khác extract. Bản `summaries/ch5_sequence_models.md` chỉ dùng tham khảo thuật ngữ. Công thức và ví dụ số được diễn giải lại; những công thức hỏng khi extract chưa được xác minh bằng ảnh slide.

## Bản đồ và đường đọc

**Chuỗi → RNN dùng chung trọng số → BPTT → LSTM/GRU → language model → embedding → Seq2Seq → attention → Transformer.**

- **Cốt lõi:** DPL5-01–04, DPL5-06–09, DPL5-11–12, DPL5-14–15, DPL5-17.
- **Đọc tiếp:** DPL5-05, DPL5-10, DPL5-13, DPL5-16, DPL5-18.

Đây là thứ tự học, không phải xác suất ra đề. Sau mỗi câu, đóng tài liệu và nói lại bằng lời của mình. Với mô hình chuỗi, luôn hỏi: độ dài input/output là gì, trạng thái nào truyền tiếp, trọng số nào dùng chung, và mô hình được phép nhìn thông tin nào?

## DPL5-01 [Cốt lõi] Vì sao cần mô hình chuỗi? Ký hiệu và các dạng đầu vào/đầu ra?

**Nguồn:** `5.1 Recurrent Neural Networks.txt`, slide 5–13, 25–30.

Dữ liệu chuỗi có thứ tự mang ý nghĩa: “An đánh Bình” khác “Bình đánh An”. Câu có thể dài ngắn khác nhau; một từ quan trọng có thể xuất hiện ở đầu hoặc cuối. Mạng feed-forward với số đầu vào cố định không tự xử lý các vấn đề này theo cùng cách RNN chia sẻ tham số qua thời gian.

`x<t>` là vector đầu vào tại bước t; `y<t>` là mục tiêu tại bước t; `Tx`, `Ty` là độ dài input và output. Chỉ số thời gian khác chỉ số mẫu huấn luyện và chỉ số tầng. Tùy nhiệm vụ: many-to-one cho phân loại cảm xúc; many-to-many cùng độ dài cho gán nhãn từng từ; encoder–decoder cho dịch hai chuỗi khác độ dài. One-to-many có thể dùng để sinh caption từ ảnh; one-to-one là trường hợp không có chuỗi thực sự.

**Ví dụ:** “An học ML” có ba token trong cách tách đơn giản. NER có thể trả ba nhãn `[PERSON, O, O]`; phân loại cả câu chỉ trả một nhãn. Token không nhất thiết bằng từ: tokenizer có thể tách nhỏ hơn.

**Trả lời miệng:** “Mô hình chuỗi khai thác thứ tự và xử lý độ dài thay đổi. Em phân biệt time step với mẫu và tầng. Dạng đầu ra phụ thuộc bài toán: một nhãn cho cả chuỗi, một nhãn mỗi bước, hoặc một chuỗi mới có độ dài khác.”

**Hỏi tiếp:** RNN chỉ dùng cho văn bản? → Không; âm thanh, cảm biến, nhạc và video cũng có cấu trúc tuần tự.

## DPL5-02 [Cốt lõi] RNN truyền hidden state và chia sẻ trọng số thế nào?

**Nguồn:** `5.1 Recurrent Neural Networks.txt`, slide 14–18, 23.

RNN đọc từng phần tử. Cell ở bước t nhận input hiện tại và hidden state trước đó, rồi tạo hidden state mới. Dạng chuẩn được viết lại bằng ký hiệu dễ đọc:

`a<t> = tanh(Waa a<t−1> + Wax x<t> + ba)`.

Nếu cần dự đoán ở bước đó, có thể tính `ŷ<t> = softmax(Wya a<t> + by)` cho bài chọn một token. Activation đầu ra phải phù hợp nhiệm vụ, không phải mọi RNN đều dùng softmax.

Các ma trận được **dùng lại qua mọi time step**. Hidden state thay đổi, nhưng trọng số trong một forward pass không thay đổi theo vị trí. Nó giống một cách ghi nhớ/tóm tắt chung áp dụng sau mỗi token, thay vì một bộ quy tắc riêng cho vị trí 1, 2, 3.

**Ví dụ số bổ sung:** dùng trạng thái vô hướng `a<t>=tanh(0,5a<t−1>+x<t>)`, bắt đầu a0=0. Với x1=1 thì a1≈0,7616; với x2=0 thì a2≈tanh(0,3808)≈0,3634. Input thứ hai bằng 0 nhưng state vẫn chứa ảnh hưởng của input trước.

**Trả lời miệng:** “RNN kết hợp input hiện tại với hidden state trước. Trọng số được dùng chung qua thời gian, nên cùng quy tắc áp dụng ở nhiều vị trí và độ dài chuỗi. Hidden state mang thông tin quá khứ có giới hạn, không phải bản lưu chính xác mọi token.”

**Hỏi tiếp:** Dùng chung trọng số có làm output các bước bằng nhau? → Không, vì input và state khác nhau.

## DPL5-03 [Cốt lõi] BPTT, vanishing/exploding gradient và clipping là gì?

**Nguồn:** `5.1 Recurrent Neural Networks.txt`, slide 19–24, 41–42; mục tiêu clipping ở slide 2.

**BPTT** mở RNN thành đồ thị theo thời gian rồi dùng backpropagation. Loss có thể cộng qua các bước có nhãn; gradient của một trọng số dùng chung tích lũy đóng góp từ nhiều lần nó xuất hiện trong đồ thị. Forward cần giữ trạng thái trung gian để tính backward.

Qua nhiều bước, gradient đi qua tích các Jacobian, gồm ảnh hưởng trọng số và đạo hàm activation. Nó có thể nhỏ dần (**vanishing**), khiến tín hiệu từ xa khó học, hoặc tăng mạnh (**exploding**) làm cập nhật không ổn định. Không thể giải thích đầy đủ chỉ bằng eigenvalue của một ma trận, bỏ qua activation và các trạng thái khác.

**Ví dụ trực giác:** nhân 0,8 liên tiếp 20 lần còn khoảng 0,0115; nhân 1,2 liên tiếp 20 lần thành khoảng 38,3. Gradient thật phức tạp hơn nhưng cho thấy vì sao chuỗi dài khó tối ưu.

**Trả lời miệng:** “BPTT là backprop trên RNN mở theo thời gian. Các trọng số dùng chung nhận gradient từ nhiều time step. Chuỗi dài có thể làm gradient biến mất hoặc bùng nổ; clipping giới hạn gradient quá lớn, còn kiến trúc có cổng, khởi tạo và activation phù hợp giúp xử lý khó khăn phụ thuộc xa.”

**Hỏi tiếp:** Clipping có chữa vanishing không? → Không; nó chủ yếu xử lý gradient quá lớn. Truncated BPTT là phần bổ sung thực hành: cắt chiều dài truyền ngược để giảm chi phí, có đánh đổi về phụ thuộc học được.

## DPL5-04 [Cốt lõi] LSTM có những cổng nào? Cell state khác hidden state?

**Nguồn:** `5.1 Recurrent Neural Networks.txt`, slide 48–52.

LSTM có **cell state c** là đường bộ nhớ và **hidden state a** là biểu diễn được đưa ra ngoài cell. Ba cổng thường qua sigmoid: forget gate quyết định giữ phần nào của bộ nhớ cũ; input/update gate quyết định ghi thông tin ứng viên; output gate quyết định đưa phần nào ra hidden state.

Một dạng chuẩn: `c<t>=f<t>⊙c<t−1>+i<t>⊙c̃<t>`, rồi `a<t>=o<t>⊙tanh(c<t>)`. Ký hiệu `⊙` là nhân từng phần tử, không phải nhân ma trận. Tên gate và ký hiệu trong slide/thư viện có thể khác nhưng vai trò vẫn như nhau.

**Ví dụ số:** nếu một chiều bộ nhớ cũ bằng 2, forget gate=0,9, input gate=0,1, ứng viên=−1 thì bộ nhớ mới `0,9×2+0,1×(−1)=1,7`. Mô hình chủ yếu giữ thông tin cũ, thêm một ít thông tin mới. Giá trị cổng được học qua mạng chứ không do người lập trình đặt theo từng từ.

**Trả lời miệng:** “LSTM điều khiển bộ nhớ bằng ba cổng quên, ghi và xuất. Cell state giữ thông tin nội bộ, hidden state là biểu diễn hiện tại. Đường cộng có điều khiển giúp truyền thông tin dài hơn RNN thuần, nhưng không bảo đảm nhớ hoàn hảo mọi phụ thuộc.”

**Hỏi tiếp:** Cell state và hidden state có cùng vai trò? → Không; hidden state còn qua output gate và thường dùng cho dự đoán.

## DPL5-05 [Đọc tiếp] GRU, bidirectional RNN và deep RNN khác nhau thế nào?

**Nguồn:** `5.1 Recurrent Neural Networks.txt`, slide 43–47, 53–59.

GRU dùng cơ chế cổng gọn hơn LSTM, thường có update/reset gate và một trạng thái chính, không tách cell state riêng như LSTM chuẩn. Nó vẫn nhằm điều khiển giữ hoặc cập nhật thông tin. Ít cấu phần hơn không bảo đảm luôn nhanh hoặc chính xác hơn trong mọi triển khai.

Bidirectional RNN chạy một hướng xuôi và một hướng ngược, rồi kết hợp. Nó hữu ích nếu toàn bộ input đã có, như gán nhãn tên riêng trong câu. **Deep RNN** là xếp nhiều tầng RNN; nhiều tầng khác với nhiều time step.

**Ví dụ:** để nhận biết “bank” nghĩa ngân hàng hay bờ sông, các từ phía sau có thể giúp. Khi xử lý cả câu đã có, dùng hai chiều hợp lý; khi dự báo giá ngày mai, không được đưa dữ liệu ngày mai vào hướng ngược.

**Trả lời miệng:** “GRU là biến thể RNN có cổng. Bidirectional kết hợp ngữ cảnh hai hướng, còn deep RNN xếp nhiều tầng. Em chọn kiến trúc theo thông tin có sẵn lúc dự đoán; mô hình hai chiều có thể gây leakage nếu tương lai chưa được phép nhìn.”

**Hỏi tiếp:** Decoder sinh token có dùng tương lai thật để tính không? → Không, trong suy luận tự hồi quy token tương lai chưa tồn tại.

## DPL5-06 [Cốt lõi] Language model học và sinh chuỗi ra sao?

**Nguồn:** `5.1 Recurrent Neural Networks.txt`, slide 31–40.

Language model ước lượng xác suất chuỗi bằng phân rã `P(y1,…,yT)=Πt P(yt | y1,…,y(t−1))`. Mỗi bước dự đoán token tiếp theo dựa trên ngữ cảnh trước đó. Khi train, thường đưa token thật trước đó làm input; kỹ thuật này thường gọi teacher forcing.

Khi sinh, bắt đầu từ token khởi đầu hoặc state ban đầu, lấy phân phối token tiếp theo, chọn hoặc lấy mẫu token, rồi đưa token vừa sinh vào bước tiếp theo. Dừng ở `<EOS>` hoặc giới hạn chiều dài. Khác train, model phải sống với chính những token đã sinh, nên lỗi có thể tích lũy.

**Ví dụ:** sau “Tôi đang”, model cho “học”=0,6, “ăn”=0,3, từ khác=0,1. Greedy chọn “học”; sampling có thể chọn “ăn”. Đây là số minh họa, không phải kết quả từ model thật. Word-level có vocabulary lớn; character-level thường có chuỗi dài hơn.

**Trả lời miệng:** “Language model học xác suất token kế tiếp. Khi train có thể dùng token thật của bước trước; khi sinh phải dùng token vừa dự đoán. Sampling tạo đa dạng hơn greedy nhưng không bảo đảm câu đúng. EOS và giới hạn độ dài giúp kết thúc quá trình.”

**Hỏi tiếp:** Xác suất cao nhất từng token có cho cả câu xác suất cao nhất? → Không; đó là lý do cần phân biệt greedy với search trên cả chuỗi.

## DPL5-07 [Cốt lõi] One-hot, embedding và embedding matrix là gì?

**Nguồn:** `5.2 NLP and Word Embeddings.txt`, slide 4–16, 26–30.

One-hot của vocabulary V là vector dài số từ, chỉ một vị trí bằng 1. Nó mã hóa danh tính nhưng không tự biểu diễn “cam” gần “táo” hơn “bàn”. Embedding là vector số được học, thường ít chiều hơn one-hot, giúp nhiệm vụ phía sau dùng quan hệ giữa các đối tượng.

Theo quy ước slide, ma trận E có shape `d×|V|`; mỗi cột là embedding của một từ. `e_w=E o_w` lấy cột tương ứng. Trong code, lookup hiệu quả hơn tạo vector one-hot rồi nhân ma trận; thư viện có thể lưu E chuyển vị, nên phải đọc shape.

**Ví dụ:** V=10.000, d=300 thì E có 3 triệu tham số nếu toàn bộ bảng học được. Với batch 32 câu dài 20 token, output embedding thường shape `(32,20,300)` theo batch-first. Từ chưa có trong vocabulary cần cơ chế như UNK hoặc tokenization subword.

**Trả lời miệng:** “One-hot là mã định danh thưa; embedding là biểu diễn vector được học. Embedding matrix lưu vector cho mỗi token và lookup lấy hàng/cột tương ứng theo quy ước. Pretrained embedding có thể chuyển kiến thức từ corpus lớn sang bài toán nhỏ.”

**Hỏi tiếp:** Mỗi chiều embedding có chắc mang tên như tuổi/giới tính? → Không; các chiều học được không nhất thiết có ý nghĩa đơn giản để đặt tên.

## DPL5-08 [Cốt lõi] Cosine similarity và phép analogy có nghĩa gì?

**Nguồn:** `5.2 NLP and Word Embeddings.txt`, slide 18–25.

Cosine similarity so hướng hai vector khác 0: `cos(u,v)=(u·v)/(||u|| ||v||)`. Nó nằm trong [−1,1]; gần 1 nghĩa cùng hướng, gần 0 nghĩa gần vuông góc. Cùng hướng không nhất thiết cùng độ dài hoặc là hai vector hoàn toàn bằng nhau.

Analogy dùng quan hệ vector: thử tìm vector gần `e_king−e_man+e_woman`. Một số embedding học được quan hệ gần “queen”, nhưng đây là hiện tượng thực nghiệm, không phải đẳng thức luôn đúng. Corpus, ngôn ngữ, phép đo và bias đều ảnh hưởng.

**Ví dụ:** u=[1,0], v=[2,0] có cosine=1 dù u≠v. u=[1,0], v=[0,1] có cosine=0. Nếu một vector bằng 0 thì mẫu số bằng 0, phải xử lý riêng.

**Trả lời miệng:** “Cosine đo hướng tương đối, không đo độ dài tuyệt đối. Analogy khai thác những quan hệ mà embedding học được bằng phép cộng trừ vector. Nó hữu ích nhưng không bảo đảm suy luận ngôn ngữ chính xác trong mọi trường hợp.”

**Hỏi tiếp:** Cosine cao chứng minh hai từ đồng nghĩa? → Không; có thể cùng chủ đề, ngữ cảnh hoặc mang quan hệ khác.

## DPL5-09 [Cốt lõi] Skip-gram và CBOW trong Word2Vec khác nhau thế nào?

**Nguồn:** `5.2 NLP and Word Embeddings.txt`, slide 34–40.

Word2Vec học embedding qua bài toán dự đoán phụ từ văn bản. **Skip-gram:** cho một từ trung tâm, dự đoán các từ trong cửa sổ ngữ cảnh. **CBOW (Continuous Bag of Words):** dùng các từ quanh để dự đoán từ trung tâm. Extract ghi sai tên dài của CBOW ở một đoạn; đây là tên thuật ngữ chuẩn được sửa lại.

Mục tiêu chính là vector hữu ích, không phải giữ classifier phụ làm đầu ra cuối. Cửa sổ quyết định loại ngữ cảnh và số cặp học. Kết quả còn phụ thuộc vocabulary, tần suất từ, negative sampling và corpus.

**Ví dụ:** với “Tôi uống nước cam”, chọn trung tâm “nước” và cửa sổ một từ. Skip-gram có cặp nước→uống và nước→cam. CBOW dùng [uống,cam] để dự đoán nước. Không lấy các từ xa ngoài cửa sổ theo đúng cấu hình này.

**Trả lời miệng:** “Skip-gram dự đoán context từ center; CBOW dự đoán center từ context. Cả hai tạo tín hiệu học từ chính văn bản mà không cần người gán nhãn thủ công cho từng cặp. Sau đó embedding được dùng cho nhiệm vụ NLP khác.”

**Hỏi tiếp:** Word2Vec có biết thứ tự đầy đủ của cả câu như RNN không? → Không theo dạng cổ điển này; mục tiêu cửa sổ không mô hình hóa toàn bộ chuỗi tự hồi quy.

## DPL5-10 [Đọc tiếp] Negative sampling, GloVe và debiasing giải quyết việc gì?

**Nguồn:** `5.2 NLP and Word Embeddings.txt`, slide 40–55, 62–67.

Softmax trên vocabulary lớn đòi hỏi tính điểm và chuẩn hóa nhiều từ. **Negative sampling** dùng một cặp context–target thật làm nhãn 1, thêm K cặp âm lấy mẫu làm nhãn 0, rồi tối ưu bài toán nhị phân. Nó giúp chỉ xử lý một số vector ở mỗi ví dụ; objective này không phải tính nguyên softmax đầy đủ với ít từ hơn.

**GloVe** dùng số lần đồng xuất hiện `Xij` của hai từ trong corpus. Mô hình học để dot product và bias giải thích log của các số đếm, với trọng số điều tiết. Word2Vec dùng objective dự đoán các cặp theo cửa sổ; GloVe khai thác thống kê đồng xuất hiện được tổng hợp. Cả hai vẫn học từ ngữ cảnh văn bản, không có ranh giới tuyệt đối “local không dùng thông tin toàn corpus”.

**Ví dụ:** cặp “nước–cam” xuất hiện thật; ghép “nước–động cơ” như mẫu âm theo phân phối lấy mẫu. Mẫu âm không được bảo đảm vô nghĩa trong mọi câu; nó là tín hiệu huấn luyện có nhiễu. K=5 nghĩa là học một positive và năm negative cho ví dụ đó, không tính softmax cho 10.000 từ.

Embedding có thể mang bias xã hội từ dữ liệu. Phương pháp trong slide xác định hướng bias, neutralize từ trung tính và equalize một số cặp. Nó giảm một biểu hiện bias được định nghĩa, không bảo đảm xóa mọi thiên lệch hay khiến mọi ứng dụng công bằng.

**Trả lời miệng:** “Negative sampling giảm chi phí bằng bài toán phân biệt cặp thật và cặp lấy mẫu. GloVe học từ ma trận đồng xuất hiện. Vì embedding học từ văn bản thực tế, nó cũng có thể học bias; debiasing phải nêu rõ đang giảm dạng bias nào và còn giới hạn gì.”

**Hỏi tiếp:** Có thể dùng embedding vào sentiment analysis thế nào? → Lookup từng token, rồi tổng hợp hoặc đưa chuỗi vector qua RNN/LSTM và classifier. Trung bình embedding đơn giản mất thứ tự; “không tốt” khác “tốt”.

## DPL5-11 [Cốt lõi] Seq2Seq encoder–decoder và image captioning hoạt động ra sao?

**Nguồn:** `5.3 Sequence Models & Attention Mechanism.txt`, slide 3–9.

Seq2Seq ánh xạ một chuỗi sang chuỗi khác, như câu tiếng Pháp sang tiếng Anh. Encoder đọc input và tạo biểu diễn; decoder dùng biểu diễn đó cùng các token trước để dự đoán token tiếp theo. `Tx` và `Ty` không cần bằng nhau.

Ở mô hình RNN encoder–decoder cơ bản, toàn bộ câu được nén vào một vector ngữ cảnh cuối. Đây là nút thắt khi câu dài: decoder phải dựa vào một bản tóm tắt cố định cho mọi bước. Attention sẽ mở rộng cách truyền thông tin ở DPL5-14.

**Ví dụ:** image captioning có CNN làm encoder ảnh, còn decoder sinh “Một con mèo đang ngủ”. Input ảnh không phải chuỗi từ nhưng output là chuỗi. Không cần buộc encoder và decoder là cùng loại mạng.

**Trả lời miệng:** “Encoder tạo biểu diễn input, decoder sinh output tuần tự có điều kiện trên input đó. Seq2Seq xử lý độ dài đầu vào và đầu ra khác nhau. Trong captioning, encoder có thể là CNN; với RNN cổ điển, vector context cố định có thể làm mất thông tin ở chuỗi dài.”

**Hỏi tiếp:** Decoder có sinh cả câu trong một bước không? → Trong mô hình tự hồi quy đang học, nó sinh từng token cho tới EOS hoặc giới hạn độ dài.

## DPL5-12 [Cốt lõi] Greedy và beam search khác nhau? Vì sao dùng log và chuẩn hóa độ dài?

**Nguồn:** `5.3 Sequence Models & Attention Mechanism.txt`, slide 7–27.

Greedy chọn token có xác suất cao nhất ở từng bước. Cách chọn cục bộ có thể bỏ lỡ câu có xác suất tổng thể cao hơn. Exhaustive search thử mọi chuỗi thì quá lớn. **Beam search** giữ B tiền tố tốt nhất, mở rộng chúng rồi giữ B ứng viên tốt nhất cho bước sau; đây vẫn là tìm kiếm xấp xỉ.

**Ví dụ hai bước:** token đầu A có xác suất 0,6, B là 0,4. Phần tiếp tốt nhất sau A có xác suất 0,5, sau B là 0,9. Greedy chọn A, xác suất cả chuỗi là 0,30; nhánh B đạt 0,36. Beam đủ rộng có thể giữ B để phát hiện điều đó.

Nhân nhiều xác suất nhỏ dễ underflow; cộng log probability giữ thứ tự so sánh và ổn định hơn. Chuỗi dài thường nhận log-score âm hơn do thêm token. Length normalization điều chỉnh điểm theo độ dài, chẳng hạn chia tổng log-score cho `T^α`, để giảm thiên lệch chuỗi quá ngắn. Cách chọn α phụ thuộc đánh giá, không phải hằng số đúng mọi bài.

**Trả lời miệng:** “Greedy chỉ giữ một nhánh, beam giữ B giả thuyết nên giảm việc bỏ lỡ lựa chọn tốt về sau. Dùng tổng log để tránh underflow. Chuẩn hóa độ dài giúp so các câu dài ngắn hợp lý hơn, nhưng beam lớn hoặc normalization không bảo đảm luôn dịch tốt hơn.”

**Hỏi tiếp:** B=1 có liên hệ gì với greedy? → Với cùng quy tắc mở rộng/chấm điểm và điều kiện kết thúc thích hợp, nó tương ứng việc chỉ giữ một nhánh như greedy.

## DPL5-13 [Đọc tiếp] Đánh giá chuỗi: BLEU, lỗi search/model và bài toán âm thanh

**Nguồn:** `5.3 Sequence Models & Attention Mechanism.txt`, slide 23–34, 44–52. BLEU được ghi optional ở slide 28–29.

BLEU so n-gram của bản dịch với các bản tham chiếu, dùng **clipped precision** để không thưởng việc lặp từ vô ích và **brevity penalty** để phạt câu quá ngắn. Nó giúp đánh giá trên cùng bộ test/cấu hình, nhưng không hiểu hoàn hảo nghĩa và chất lượng diễn đạt; không dùng một điểm BLEU để chứng minh mọi câu dịch đúng.

**Ví dụ:** tham chiếu “the cat is on the mat” có hai lần “the”. Dự đoán “the the the the” chỉ được tính tối đa hai match cho unigram “the”, nên precision đã clip là 2/4. Đây chỉ là một thành phần, chưa phải toàn bộ BLEU.

Khi tìm kiếm sai, so điểm câu chuẩn với câu beam tìm được dưới **cùng objective**, gồm length normalization nếu đã dùng. Nếu câu chuẩn có điểm cao hơn mà beam bỏ lỡ, có bằng chứng search chưa tìm tốt; nếu model ưu tiên câu kém, cần xem model/objective. Với âm thanh, slide 45 nêu attention và **CTC** là hai hướng; CTC xử lý căn chỉnh không có nhãn tại từng frame bằng các đường có blank và phép gộp, không phải một loại attention. Trigger-word detection dự đoán thời điểm từ kích hoạt xuất hiện trên chuỗi đặc trưng âm thanh.

**Trả lời miệng:** “BLEU dùng n-gram có clipping và phạt độ dài, có giới hạn về ngữ nghĩa. Error analysis tách vấn đề model chấm điểm sai với search không tìm ra ứng viên điểm cao. CTC là mục tiêu căn chỉnh speech; trigger-word detection là nhận biết tín hiệu theo thời gian.”

**Hỏi tiếp:** Trong CTC, `a, blank, a` và `a, a` có cùng kết quả không? → Không; theo phép collapse chuẩn, trường hợp đầu cho “aa”, trường hợp sau cho “a”.

## DPL5-14 [Cốt lõi] Attention kiểu encoder–decoder giải quyết nút thắt như thế nào?

**Nguồn:** `5.3 Sequence Models & Attention Mechanism.txt`, slide 35–43; thuật ngữ đối chiếu self/cross-attention từ `5.4 Transformer Network.txt`, slide 18–19.

Thay vì chỉ truyền một vector cố định, attention cho decoder dùng các trạng thái encoder ở nhiều vị trí. Tại bước sinh t, mạng chấm điểm liên quan giữa trạng thái decoder và từng trạng thái nguồn. Softmax chuẩn hóa các điểm thành trọng số `α<t,t'>`; context động là tổng có trọng số của trạng thái nguồn.

Trong attention kiểu Bahdanau đang được giải thích, điểm liên quan được tính bằng một mạng nhỏ từ các trạng thái. Nó không bắt buộc chính là scaled dot-product của Transformer. **Self-attention** kết hợp các vị trí trong cùng chuỗi; **cross-attention** dùng thông tin từ chuỗi/nguồn khác, như decoder hỏi encoder.

**Ví dụ:** khi dịch phần nói về thời gian, decoder có thể đặt trọng số lớn hơn lên cụm “en septembre”. Tại bước khác, các trọng số thay đổi. Không phải mỗi bước bắt buộc chỉ chọn duy nhất một từ, và trọng số không tự là lời giải thích nhân quả chắc chắn.

**Trả lời miệng:** “Attention tạo context riêng cho từng bước decoder bằng tổng có trọng số các trạng thái encoder. Nó giảm nút thắt nén cả câu vào một vector. Self-attention xét nội bộ một chuỗi, còn cross-attention trao đổi giữa decoder và nguồn encoder.”

**Hỏi tiếp:** Attention có luôn đi kèm RNN? → Không; Transformer dùng attention làm thành phần chính mà không cần recurrence kiểu RNN trong mỗi lớp.

## DPL5-15 [Cốt lõi] Query, Key, Value và scaled dot-product attention tính thế nào?

**Nguồn:** `5.4 Transformer Network.txt`, slide 10–13, 15–16. Công thức được viết lại vì text trích xuất làm vỡ phân số/chỉ số.

Mỗi biểu diễn được chiếu thành query Q, key K và value V. Trực giác: query là thông tin đang tìm, key là đặc trưng để so mức phù hợp, value là thông tin sẽ được tổng hợp. Công thức:

`Attention(Q,K,V) = softmax(QKᵀ / √d_k) V`.

Với một head, Q có thể shape `(nq,dk)`, K `(nk,dk)`, V `(nk,dv)`. Điểm có shape `(nq,nk)`, softmax theo chiều key, đầu ra `(nq,dv)`. Chia căn `dk` giúp kiểm soát độ lớn score trong giả định thống kê thích hợp, tránh softmax quá bão hòa khi chiều key lớn. Nó không bảo đảm mọi gradient luôn tốt.

**Ví dụ số:** Q=[1], hai key là [0] và [1], nên score=[0,1], `dk=1`. Softmax xấp xỉ [0,269;0,731]. Với hai value 10 và 20, đầu ra `0,269×10+0,731×20≈17,31`. Key dùng để tính mức liên quan, value mới là thứ được trộn.

**Trả lời miệng:** “QKᵀ tính score, chia căn chiều key rồi softmax thành trọng số, sau đó nhân V để tổng hợp nội dung. Q, K, V thường là các phép chiếu học được. Trong self-attention chúng bắt nguồn từ cùng biểu diễn đầu vào nhưng không bắt buộc bằng nhau.”

**Hỏi tiếp:** Cross-attention lấy Q,K,V từ đâu? → Q từ decoder, K và V từ encoder trong kiến trúc encoder–decoder thường gặp.

## DPL5-16 [Đọc tiếp] Multi-head attention thêm điều gì?

**Nguồn:** `5.4 Transformer Network.txt`, slide 14–16.

Một head tạo một cách so và tổng hợp thông tin. Multi-head dùng nhiều bộ phép chiếu học được để tính attention trong các không gian con khác nhau, nối kết quả rồi chiếu lại: `MultiHead = Concat(head1,…,headh) Wo`.

Các head có thể học những quan hệ khác nhau, nhưng không được kiến trúc gán sẵn “head chủ-vị”, “head thời gian”. Đây là khả năng biểu diễn, không bảo đảm mỗi head có một vai trò ngôn ngữ dễ đặt tên.

**Ví dụ:** với `d_model=128`, 4 head và chia đều, mỗi head có chiều 32; nối bốn kết quả trả về 128 chiều trước phép chiếu output. Số token không tăng gấp bốn; chỉ có nhiều nhánh tính quan hệ.

**Trả lời miệng:** “Multi-head attention cho mô hình nhiều phép chiếu để xem các quan hệ theo những cách khác nhau, sau đó nối và trộn kết quả. Nó không phải lặp một phép attention y hệt không tham số, và không đảm bảo head nào cũng có ý nghĩa cố định.”

**Hỏi tiếp:** Càng nhiều head luôn tốt hơn? → Không; có đánh đổi về chiều mỗi head, tài nguyên và hiệu quả thực nghiệm.

## DPL5-17 [Cốt lõi] Vị trí, mask, residual, LayerNorm và luồng Transformer

**Nguồn:** `5.4 Transformer Network.txt`, slide 7, 18–20; sơ đồ chính ở slide 19.

Self-attention thuần không tự mã hóa thứ tự. **Positional encoding** đưa thông tin vị trí vào biểu diễn, thường bằng cách cộng vector vị trí với embedding. Công thức sinusoidal của Transformer gốc dùng `sin(pos/10000^(2i/d_model))` và `cos(pos/10000^(2i/d_model))` ở hai chiều liên tiếp. Đây là công thức chuẩn được bổ sung; text slide 19 bị vỡ định dạng và có chỗ đọc thành 1000, nên không sao chép nguyên text hỏng. Positional embedding học được cũng là một lựa chọn khác.

Encoder thường gồm self-attention và feed-forward theo từng vị trí. Decoder thêm **causal mask** trong self-attention để không dùng token tương lai, rồi cross-attention tới encoder. **Residual** cộng đầu vào sublayer với đầu ra khi shape phù hợp; **LayerNorm** chuẩn hóa các feature của một biểu diễn và có hệ số học được. LayerNorm khác BatchNorm, không lấy thống kê giữa các mẫu theo cách BN thông thường.

**Ví dụ:** khi dự đoán từ thứ ba, decoder được dùng hai từ trước và thông tin câu nguồn, nhưng không được đọc đáp án từ thứ tư. Trong huấn luyện có thể tính nhiều vị trí song song nhờ mask; khi sinh tự hồi quy vẫn thường tạo token nối tiếp.

**Trả lời miệng:** “Vị trí giúp attention biết thứ tự; causal mask chặn tương lai. Transformer kết hợp attention, feed-forward, residual và normalization. Encoder đọc input, decoder dùng masked self-attention rồi cross-attention để sinh. Khả năng song song hóa huấn luyện không có nghĩa sinh cả câu luôn chỉ mất một bước.”

**Hỏi tiếp:** Transformer luôn nhanh và rẻ hơn RNN? → Không; dense attention có ma trận score kích thước bậc hai theo độ dài chuỗi, còn tùy kiến trúc và triển khai.

## DPL5-18 [Đọc tiếp] Pretrained Transformer, NER/QA và so sánh BERT–GPT

**Nguồn:** `5.4 Transformer Network.txt`, slide 1 về mục tiêu NER/QA/fine-tuning; slide 18 nhắc BERT và BERT distill. **GPT là phần so sánh bổ sung**, chưa thấy tên GPT trong extract; không khẳng định môn đã dạy sâu GPT.

Pretraining học biểu diễn trên dữ liệu lớn; fine-tuning tiếp tục học một phần/toàn bộ tham số cho mục tiêu cụ thể. Với NER, thường dự đoán nhãn token; với extractive QA, dự đoán vị trí bắt đầu/kết thúc câu trả lời trong context. Input tokenization và việc nối token với nhãn/vị trí phải nhất quán.

**Ví dụ:** đoạn “An sinh ở Huế”, hỏi “An sinh ở đâu?”; QA trích xuất chọn span “Huế”. Đây khác sinh một câu trả lời tự do ngoài đoạn. Nếu một từ tách thành nhiều subword, NER cần quy tắc gán nhãn/mask loss thích hợp; không coi mọi subword đều là từ độc lập.

BERT điển hình là encoder-only với attention hai chiều và mục tiêu pretraining như masked language modeling; GPT điển hình là decoder-only có causal mask, dự đoán token tiếp theo. Đây là hai lựa chọn kiến trúc/mục tiêu, không có nghĩa encoder chỉ làm phân loại hay decoder không thể dùng cho hiểu văn bản. Transformer cũng không loại bỏ mọi trường hợp dùng RNN.

**Trả lời miệng:** “Em dùng pretrained Transformer rồi fine-tune cho NER hoặc QA. NER gán nhãn token, extractive QA chọn span trong context. BERT và GPT giúp phân biệt encoder hai chiều với mô hình tự hồi quy có causal mask; phần GPT ở đây là mở rộng để so sánh, chưa xác nhận trong slide.”

**Hỏi tiếp:** Fine-tune có luôn cần cập nhật toàn bộ trọng số? → Không; có thể freeze phần nền, học head hoặc mở một phần tầng tùy dữ liệu và tài nguyên.

## Bốn bài tự kiểm tra có lời giải

### Bài 1 — Shape và chia sẻ trọng số

Vocabulary có 10.000 từ, embedding 300 chiều. Một batch gồm 32 câu, pad đến 20 token; hidden size RNN=64. Theo batch-first, output embedding và toàn bộ hidden state có shape gì? Có 20 bộ trọng số RNN riêng không?

**Lời giải:** embedding `(32,20,300)`; chuỗi hidden `(32,20,64)`; hidden một bước `(32,64)`. Một cell RNN chuẩn chia sẻ trọng số qua 20 bước, không tạo 20 bộ trọng số. Với padding, cần mask/length để tránh coi pad như nội dung thật.

### Bài 2 — LSTM và clipping

Một chiều cell state cũ=2, forget=0,9, input gate=0,1, ứng viên=−1. Tính c mới. Một gradient khác có norm 12, clip-by-norm với threshold 5 thì hệ số scale bao nhiêu?

**Lời giải:** c mới=1,7. Gradient nhân `5/12≈0,4167`, norm mới=5. Hai phép này khác nhau: cổng LSTM học cách giữ thông tin, còn clipping giới hạn gradient khi tối ưu.

### Bài 3 — Vì sao greedy có thể bỏ lỡ câu tốt?

Hai token đầu A/B có xác suất 0,6/0,4. Token kết thúc tốt nhất sau A có xác suất 0,5, sau B là 0,9. Bỏ qua chuẩn hóa độ dài vì hai câu dài bằng nhau. Greedy chọn gì, câu nào có xác suất cao hơn?

**Lời giải:** greedy chọn A ở bước đầu, xác suất đường tốt nhất theo nhánh A=0,30. Nhánh B có 0,36 nên cao hơn. Beam width 2 giữ cả hai nhánh ở bước đầu có thể tìm ra B; ví dụ không chứng minh mọi beam width 2 đều tối ưu trên bài dài.

### Bài 4 — Attention và nguồn Q/K/V

Một query có score sau scale [0,1], softmax xấp xỉ [0,269;0,731], value 10 và 20. Tính output. Nếu đây là decoder cross-attention, Q và K/V đến từ đâu?

**Lời giải:** output≈17,31. Q từ biểu diễn decoder; K/V từ output encoder trong kiến trúc đang xét. K quyết định trọng số, V cung cấp nội dung được tổng hợp; chúng không phải cùng một vai trò.

## Từ điển để ôn miệng

| Thuật ngữ | Ý cần nhớ |
|---|---|
| Sequence / time step | Chuỗi / vị trí thời gian, khác chỉ số tầng |
| Hidden state / cell state | Biểu diễn hiện tại / bộ nhớ riêng của LSTM |
| BPTT / clipping | Backprop qua thời gian / giới hạn gradient lớn |
| GRU / bidirectional / deep RNN | Cell có cổng / hai hướng / nhiều tầng |
| Token / vocabulary / EOS | Đơn vị mã hóa / tập token / kết thúc chuỗi |
| Language model / teacher forcing | Dự đoán token kế / train bằng token thật trước |
| Embedding / lookup | Vector được học / lấy vector theo ID |
| Skip-gram / CBOW | Center dự đoán context / context dự đoán center |
| Negative sampling / GloVe | Học từ cặp thật–âm / thống kê đồng xuất hiện |
| Seq2Seq / encoder / decoder | Chuỗi sang chuỗi / mã hóa / giải mã |
| Beam width / log score | Số giả thuyết giữ / tổng log xác suất |
| BLEU / CTC | Metric n-gram / mục tiêu căn chỉnh chuỗi |
| Query / key / value | Truy vấn / so mức liên quan / thông tin tổng hợp |
| Self / cross-attention | Trong cùng nguồn / giữa các nguồn biểu diễn |
| Causal mask / position | Chặn tương lai / biểu diễn thứ tự |
| LayerNorm / residual | Chuẩn hóa feature / đường cộng tắt |
| Extractive QA / NER | Chọn span đáp án / gán nhãn thực thể token |

**Tự kiểm tra cuối:** hãy kể bằng lời chuỗi đi từ token → embedding → mô hình → phân phối output; sau đó giải thích RNN và Transformer truyền thông tin khác nhau thế nào. Nếu chưa nói được, quay lại DPL5-02, DPL5-07, DPL5-14 và DPL5-15 trước khi học thêm tên kiến trúc.
