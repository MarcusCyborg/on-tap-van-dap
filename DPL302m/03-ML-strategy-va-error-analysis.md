# Chương 3: ML strategy và phân tích lỗi: biết nên cải thiện điều gì

Chương này bám bài **3.1 Introduction to ML strategy** và **3.2 Error Analysis** của DPL302m. Có **10 câu: 8 Cốt lõi, 2 Đọc tiếp**. Không cần thêm nhiều công thức để bắt đầu: mục tiêu là nhìn kết quả mô hình rồi chọn bước tiếp theo có lý do.

Mạch học: **đặt mục tiêu đúng → đo trên dữ liệu đúng → tìm loại sai → chọn cách cải thiện → kiểm tra lại**. Trước khi đọc, nên biết train/dev/test, overfit và precision/recall trong [bộ ML nền tảng](../Chuyen-de/02-Machine-Learning.md), nhất là ML07, ML16–ML17, ML29–ML31.

Đọc trước DPL3-01 → 02 → 03 → 04 → 05 → 07 → 08 → 09. DPL3-06 và DPL3-10 giúp trả lời sâu hơn về dữ liệu và cách thiết kế hệ thống. Cốt lõi/Đọc tiếp là ưu tiên học trong tài liệu, không phải xác suất ra đề.

## Nguồn và giới hạn

Nguồn chính: hai file `3.1 Introduction to ML strategy.txt` và `3.2 Error Analysis.txt` trong `F:\1. FPT Material\Sem5\DPL302m\extracted_texts`. Mốc trang dưới đây lấy trực tiếp từ marker `--- Slide N ---`: lần lượt 66 và 59 slide. `summaries/ch3_ml_strategy.md` chỉ dùng làm tham khảo giải thích.

Các ví dụ số và mẫu trả lời dưới đây được biên soạn thêm; chúng không phải số liệu thực nghiệm của lớp. Một số nội dung trong text slide có tính khái quát hoặc thiếu hình, nên diễn giải dùng điều kiện phù hợp thay vì sao chép các từ “luôn”, “bắt buộc”, “chắc chắn”. Chưa kiểm tra hình/công thức trong PowerPoint gốc.

## DPL3-01 [Cốt lõi] Orthogonalization là gì? Vì sao cần tách bốn mục tiêu?

**Nguồn:** `3.1 Introduction to ML strategy.txt`, slide 3–11, đặc biệt slide 9.

**Hiểu từ đầu:** Khi mô hình kém, có thể thử tăng mạng, thêm dữ liệu, đổi optimizer hoặc đổi metric. Orthogonalization ở đây là cố gắng tách các mục tiêu để hiểu mỗi thay đổi chủ yếu xử lý vấn đề nào. Nó giống bảng điều khiển có nút chỉnh âm lượng riêng, độ sáng riêng, thay vì một nút thay tất cả.

Bốn bước cần kiểm tra: **(1)** học được train; **(2)** tổng quát hóa sang dev; **(3)** vẫn tốt trên test độc lập; **(4)** hữu ích ngoài thực tế. Nếu train kém, xem năng lực mô hình/tối ưu. Nếu train tốt nhưng dev kém, xem regularization/dữ liệu. Dev tốt nhưng test kém cần kiểm tra overfit vào dev, cỡ mẫu và phân phối. Test tốt nhưng sản phẩm kém có thể do metric hoặc dữ liệu đánh giá chưa phản ánh nhu cầu.

**Ví dụ:** mô hình train lỗi 1%, dev lỗi 20% thì thay ngay metric chưa chắc chữa được việc tổng quát hóa. Ngược lại, accuracy cao nhưng bỏ sót toàn bộ ca quan trọng có thể là mục tiêu đánh giá chưa phù hợp. Các “nút” thực tế vẫn tương tác, không độc lập tuyệt đối.

**Trả lời miệng:** “Orthogonalization giúp tách câu hỏi cần giải quyết: khớp train, khái quát hóa, đánh giá cuối và hiệu quả thực tế. Em xác định đang hỏng ở bước nào rồi chọn biện pháp chủ yếu tác động vào bước đó. Đây là nguyên tắc tổ chức thử nghiệm, không phải bảo đảm một siêu tham số chỉ ảnh hưởng duy nhất một thứ.”

**Hỏi tiếp:** Early stopping có trực giao hoàn toàn không? → Không. Nó vừa hạn chế thời gian tối ưu train vừa có tác dụng regularization, nên ảnh hưởng cả hai mục tiêu.

## DPL3-02 [Cốt lõi] Optimizing metric và satisficing metric khác nhau thế nào?

**Nguồn:** `3.1 Introduction to ML strategy.txt`, slide 12–20.

**Hiểu từ đầu:** Optimizing metric là chỉ số muốn làm tốt nhất, ví dụ giảm MAE hoặc tăng F1. Satisficing metric là điều kiện cần đạt ngưỡng, ví dụ thời gian dự đoán không quá 100ms. Ta có thể lọc những mô hình không đạt ràng buộc, rồi so chỉ số tối ưu giữa các mô hình còn lại.

Một chỉ số chính giúp quyết định nhanh hơn, nhưng không có nghĩa bỏ qua mọi lát cắt dữ liệu hoặc tác hại khác. Nếu precision và recall đều quan trọng, F1 là một cách tổng hợp: `2PR/(P+R)` khi mẫu số hợp lệ. F1 không tự đại diện đúng mọi chi phí sai của bài toán.

**Ví dụ:** A có accuracy 90%, thời gian 80ms; B là 92%, 95ms; C là 95%, 1.500ms. Nếu yêu cầu ≤100ms và tối đa accuracy, chọn B trong ba mô hình. C có accuracy cao nhất nhưng không đủ điều kiện thời gian.

**Trả lời miệng:** “Em phân biệt chỉ số cần tối ưu với các ràng buộc phải đáp ứng. Ví dụ tối đa accuracy trong nhóm mô hình chạy dưới 100ms. Cách này tránh tranh luận mô hình nào tốt hơn khi một mô hình chính xác hơn nhưng quá chậm; các ngưỡng cần xuất phát từ nhu cầu thực tế.”

**Hỏi tiếp:** Nếu không mô hình nào đạt ngưỡng? → Chưa có phương án đáp ứng yêu cầu; cần cải thiện mô hình/hệ thống hoặc xem lại ràng buộc có căn cứ, không âm thầm chọn mô hình vi phạm rồi gọi là đạt.

## DPL3-03 [Cốt lõi] Chọn dev/test theo mục tiêu nào? Khi nào cần thay đổi?

**Nguồn:** `3.1 Introduction to ML strategy.txt`, slide 21–38.

**Hiểu từ đầu:** Dev là nơi thử các ý tưởng; test là đánh giá cuối. Nếu cả hai dùng để đánh giá cùng mục tiêu triển khai, chúng nên lấy theo cùng phân phối mục tiêu và cùng quy tắc gán nhãn. Train có thể có thêm nguồn khác, nhưng việc đó cần phân tích riêng. Không thể chỉ đòi “chia ngẫu nhiên” mà bỏ qua nguồn, thời gian hoặc nhóm đối tượng.

Cỡ dev phải đủ để phân biệt những mô hình đang so; test đủ để đánh giá kết quả với độ bất định phù hợp. Tỷ lệ phần trăm không tự quyết định chất lượng: 1% của một triệu khác 1% của một nghìn. Nếu metric xếp mô hình ngược với nhu cầu thực tế, hoặc dữ liệu đánh giá sai môi trường, nên sửa mục tiêu đo lường trước khi tiếp tục tối ưu.

**Ví dụ:** app nhận ảnh điện thoại mờ nhưng dev/test toàn ảnh studio. Cải thiện trên studio chưa phản ánh app. Có thể thiết kế lại tập đánh giá đại diện điện thoại, ghi phiên bản và quy trình rõ. Nếu đã dùng kết quả test cũ để ra quyết định, cần đánh giá cuối độc lập phù hợp cho phiên bản tiếp theo.

**Trả lời miệng:** “Em chọn dev/test để phản ánh dữ liệu và mục tiêu thật. Chỉ số và dữ liệu phải giúp chọn được mô hình mà người dùng thực sự muốn. Khi mục tiêu đo sai, em điều chỉnh có lý do và ghi lại; không đổi test chỉ để làm điểm đẹp hơn.”

**Bẫy:** Không phải mọi hệ đánh giá đều chỉ có một phân phối; có thể thêm các test stress/out-of-distribution riêng. Phải gắn nhãn đúng mục đích, không so các điểm khác phân phối như cùng một phép đo.

## DPL3-04 [Cốt lõi] Human-level performance, Bayes error và avoidable bias là gì?

**Nguồn:** `3.1 Introduction to ML strategy.txt`, slide 39–64.

**Hiểu từ đầu:** Bayes optimal error là sai số tối thiểu có thể đạt theo bài toán, thông tin đầu vào, phân phối và loss đang xét. Nó có thể lớn hơn 0 vì dữ liệu mơ hồ hoặc thông tin đầu vào không đủ. Human-level performance (HLP) là hiệu năng một nhóm người được xác định rõ, chẳng hạn chuyên gia, không phải một hằng số chung cho mọi người.

Trong nhiệm vụ con người làm rất tốt, lỗi chuyên gia có thể là mốc gần Bayes error để định hướng. **Avoidable bias** được ước lượng bằng train error trừ lỗi tham chiếu phù hợp; khoảng dev−train gợi ý phần tổng quát hóa dưới các giả định phù hợp. Đây là phép chẩn đoán thực hành, không phải luôn là phân rã bias/variance toán học chính xác của mọi mô hình.

**Ví dụ:** chuyên gia 1%, train 8%, dev 10%, cùng cách đo và phân phối phù hợp. Khoảng tới chuyên gia là 7 **điểm phần trăm**, khoảng dev−train là 2 điểm. Nên xem việc khớp train trước. Nếu chuyên gia 7,5% thì khoảng đầu chỉ 0,5 điểm, thứ tự ưu tiên có thể khác.

**Trả lời miệng:** “Human-level error có thể giúp ước lượng mức sai có thể đạt ở một số nhiệm vụ, nhưng không bằng Bayes error theo định nghĩa. Em dùng mốc đó và khoảng train/dev để định hướng giảm avoidable bias hay variance. Nếu máy vượt con người thì mốc con người không còn cho biết chính xác còn cách tối ưu bao xa.”

**Hỏi tiếp:** Máy vượt người có nghĩa vượt Bayes optimum không? → Không. Con người không nhất thiết tối ưu; với cùng thông tin và mục tiêu, Bayes optimum vẫn là giới hạn lý thuyết tương ứng.

## DPL3-05 [Cốt lõi] Error analysis làm gì? “Trần cải thiện” được hiểu thế nào?

**Nguồn:** `3.2 Error Analysis.txt`, slide 3–8 và bảng slide 14.

**Hiểu từ đầu:** Error analysis là xem cụ thể các dự đoán sai rồi phân nhóm để tìm việc đáng làm. Có thể lập bảng: mã mẫu, nhãn thật, dự đoán, ảnh mờ, sai nhãn, đối tượng nhỏ, ghi chú. Một mẫu có thể thuộc nhiều nhóm, vì vậy tổng tỷ lệ các cột có thể vượt 100%.

Nếu một nhóm chiếm ít lỗi, chỉ sửa nhóm đó thường không thể giải quyết phần lớn vấn đề. “Trần cải thiện” là ước lượng lạc quan nếu sửa hết lỗi của nhóm và không làm hỏng mẫu khác, không phải lời hứa kết quả. Cần xem cả chi phí sửa, mức quan trọng của lỗi và độ đại diện của các mẫu được kiểm tra.

**Ví dụ:** trên 1.000 mẫu dev, mô hình sai 100; trong đó 8 lỗi liên quan chó bị nhận thành mèo. Nếu sửa đúng cả 8 và không tạo lỗi mới, error giảm từ 10% xuống 9,2%: cải thiện tối đa 0,8 điểm phần trăm trong ví dụ này. Nhóm đó chiếm 8% **các lỗi**, không phải 8% toàn dev.

**Trả lời miệng:** “Em xem một tập lỗi đại diện và phân nhóm để tìm hướng cải thiện có ảnh hưởng lớn. Tỷ lệ một loại lỗi giúp ước lượng lợi ích tối đa nếu chỉ sửa loại đó. Em kiểm tra mẫu số, các nhóm chồng lấn và chi phí thực hiện trước khi quyết định thu thập dữ liệu hay đổi mô hình.”

**Hỏi tiếp:** 60% lỗi là ảnh mờ thì chỉ cần tăng ảnh mờ là chắc sửa hết? → Không. Nhóm lỗi chỉ gợi ý hướng; còn chất lượng nhãn, thông tin ảnh, mô hình và dữ liệu thật sự cần thêm.

## DPL3-06 [Đọc tiếp] Có nên sửa mọi nhãn sai? Sửa dev/test thế nào cho nhất quán?

**Nguồn:** `3.2 Error Analysis.txt`, slide 9–15.

**Hiểu từ đầu:** Nhãn sai làm sai cả việc học lẫn phép đo. Tuy nhiên, mức ưu tiên sửa phụ thuộc tỷ lệ, tính ngẫu nhiên/hệ thống và mức tác động. Một hệ thống có thể chịu được phần nhiễu nhãn ngẫu nhiên nhất định, nhưng không có nghĩa nhãn sai luôn vô hại, đặc biệt nếu một nhóm bị gán sai có hệ thống.

Ở dev/test, cần tiêu chuẩn gán nhãn rõ và quy trình áp dụng nhất quán. Xem cả mẫu mô hình đoán đúng và sai: nếu chỉ sửa các nhãn làm mô hình có vẻ sai, có thể thiên lệch phép đo về phía mô hình. Việc chỉnh nhãn test là bảo trì chất lượng đánh giá, không phải cơ hội xem lỗi rồi tối ưu mô hình lặp lại trên test.

**Ví dụ:** dev error 2%, trong đó 0,6 điểm phần trăm do nhãn sai. Khi đang so hai mô hình chênh 0,2 điểm, lỗi nhãn này có thể đáng chú ý. Nếu dev error 20%, cùng 0,6 điểm do nhãn sai thì còn nhiều nguồn lỗi lớn hơn để xem.

**Trả lời miệng:** “Em đánh giá mức ảnh hưởng và cơ chế sai nhãn trước khi sửa. Với dev/test, em dùng cùng tiêu chuẩn, xem cả mẫu đoán đúng lẫn sai và lưu phiên bản dữ liệu. Chất lượng nhãn quan trọng, nhưng không nên sửa nhãn theo hướng ưu ái dự đoán hiện tại.”

**Hỏi tiếp:** Sửa nhãn dev có bắt buộc train lại không? → Không tự động. Nếu chỉ sửa dữ liệu đánh giá, trước hết đánh giá lại mô hình; train lại khi có lý do như đổi train, mục tiêu hoặc lựa chọn mô hình sau đó.

## DPL3-07 [Cốt lõi] Vì sao nên xây baseline nhanh rồi lặp cải thiện?

**Nguồn:** `3.2 Error Analysis.txt`, slide 16–20.

**Hiểu từ đầu:** Chưa có mô hình chạy được thì rất khó biết khó khăn chính nằm ở dữ liệu, năng lực mô hình hay triển khai. Baseline là hệ đơn giản, đo được và đủ đúng quy trình để tạo mốc. Nó có thể là dự đoán lớp phổ biến, một mô hình tuyến tính, hoặc pretrained model phù hợp với bài toán.

“Làm nhanh” không phải bỏ chia tập, metric hoặc kiểm tra leakage. Quy trình ngắn là đặt mục tiêu → dựng baseline → đo train/dev → xem lỗi → chọn thay đổi có lý do → đo lại với cùng tiêu chuẩn. Ghi cấu hình và phiên bản dữ liệu để biết thay đổi nào đi cùng kết quả nào.

**Ví dụ:** trước khi dành hai tuần thay Transformer lớn hơn, baseline cho thấy hầu hết câu sai chứa ký tự bị lỗi do tiền xử lý. Sửa pipeline có thể đáng làm trước. Nhưng đây là kết luận từ quan sát, không phải quy tắc mô hình đơn giản luôn đủ.

**Trả lời miệng:** “Baseline giúp em có bằng chứng để chọn hướng làm thay vì đoán. Em xây một hệ đơn giản nhưng có chia dữ liệu và metric đúng, sau đó dùng bias/variance và error analysis để ưu tiên cải thiện. Mỗi vòng thay đổi cần được ghi lại và so công bằng.”

**Hỏi tiếp:** Chỉ thử một random seed rồi kết luận hơn 0,1% có chắc không? → Chưa; cần cân nhắc nhiễu, kích thước tập đánh giá và độ ổn định của khác biệt.

## DPL3-08 [Cốt lõi] Training-dev giúp tách variance và data mismatch thế nào?

**Nguồn:** `3.2 Error Analysis.txt`, slide 21–38, đặc biệt 31–36.

**Hiểu từ đầu:** Nếu train là ảnh web còn dev là ảnh điện thoại, dev kém hơn có thể do chưa khái quát hóa ngay trên ảnh web, do khác phân phối, hoặc cả hai. Tạo **training-dev**: dữ liệu giữ lại từ cùng phân phối với train, nhưng không dùng để cập nhật trọng số. Nó khác tập dev theo mục tiêu triển khai.

So train với training-dev giúp xem khả năng khái quát hóa trên nguồn train; so training-dev với dev giúp nhận diện ảnh hưởng đổi phân phối. Các khoảng sai số là gợi ý chẩn đoán, không chứng minh nguyên nhân duy nhất. Cần cùng metric, cách gán nhãn, cỡ mẫu đủ và chú ý độ khó khác nhau giữa các miền.

**Ví dụ:** train=8%, training-dev=9%, dev=20%. Khoảng đầu là 1 điểm phần trăm, khoảng sau 11 điểm: data mismatch là hướng đáng xem. Có thể thu thập dữ liệu gần điện thoại hơn hoặc mô phỏng biến đổi hợp lý. Nếu chỉ lặp một loại nhiễu nhân tạo, mô hình có thể overfit chính loại nhiễu đó.

**Trả lời miệng:** “Training-dev là tập không train nhưng cùng phân phối với train. Nó giúp phân biệt khoảng cách do tổng quát hóa trên nguồn cũ với khoảng cách khi chuyển sang miền mục tiêu. Em xem các chênh lệch cùng error analysis, rồi làm dữ liệu train gần mục tiêu hơn nếu có bằng chứng mismatch.”

**Hỏi tiếp:** Training-dev có được dùng để backprop rồi vẫn làm vai trò này không? → Không. Khi đã dùng để cập nhật trọng số, nó không còn là mẫu giữ lại độc lập cho phép so sánh đó.

## DPL3-09 [Cốt lõi] Transfer learning khác multi-task learning thế nào?

**Nguồn:** `3.2 Error Analysis.txt`, slide 39–49; xem thêm DL28 trong [bộ DL nền tảng](../Chuyen-de/03-Deep-Learning.md).

**Hiểu từ đầu:** Transfer learning tận dụng kiến thức từ nhiệm vụ/nguồn trước cho nhiệm vụ mới. Ví dụ lấy backbone học trên nhiều ảnh, thay đầu phân loại để nhận diện hoa, rồi học đầu mới hoặc fine-tune một phần/toàn bộ mạng. Hiệu quả phụ thuộc mức liên quan của biểu diễn, không chỉ số lượng dữ liệu nguồn.

Multi-task learning học nhiều nhiệm vụ cùng lúc, thường chia sẻ một phần mạng và có đầu ra/loss riêng. Các nhiệm vụ có thể hỗ trợ nhau nếu cần đặc trưng chung, nhưng cũng có thể cạnh tranh hoặc gây **negative transfer**: chia sẻ làm một nhiệm vụ kém hơn. Cần xem trọng số loss, dữ liệu, năng lực mạng và kết quả từng nhiệm vụ.

**Ví dụ:** hệ thị giác dùng backbone chung cho phân loại loại xe và dự đoán hướng xe là một ý tưởng multi-task. Dùng backbone đó để khởi tạo bài nhận diện loài hoa sau này là transfer. Multilabel chỉ mô tả cấu trúc nhãn nhiều nhãn cùng đúng; không phải mọi bài multilabel đều cần gọi là một thiết kế multi-task riêng biệt.

**Trả lời miệng:** “Transfer learning chuyển kiến thức đã học sang nhiệm vụ mới; multi-task học nhiều nhiệm vụ đồng thời bằng chia sẻ biểu diễn phù hợp. Cả hai tận dụng điểm chung, nhưng không bảo đảm luôn cải thiện. Em so với baseline và theo dõi từng nhiệm vụ để phát hiện việc chia sẻ gây hại.”

**Hỏi tiếp:** Fine-tuning có nghĩa chỉ học tầng cuối? → Không; có thể cập nhật một phần hoặc toàn bộ mô hình. Chỉ học tầng cuối là một chiến lược khi đóng băng phần trước.

## DPL3-10 [Đọc tiếp] End-to-end khác pipeline thế nào? Khi nào nên dùng?

**Nguồn:** `3.2 Error Analysis.txt`, slide 50–58.

**Hiểu từ đầu:** Pipeline chia một nhiệm vụ thành nhiều chặng, chẳng hạn nhận vùng xương rồi dự đoán tuổi từ thông tin vùng đó. End-to-end học ánh xạ từ đầu vào tới mục tiêu cuối bằng mục tiêu huấn luyện chung, giảm phụ thuộc vào các bước trung gian được thiết kế/huấn luyện tách rời.

End-to-end vẫn có thể gồm nhiều khối nội bộ, tiền xử lý và cấu trúc được thiết kế. Ý chính không phải “không có bước nào ở giữa”, mà là cách toàn hệ học hướng tới mục tiêu cuối. Nó có thể tận dụng dữ liệu để học biểu diễn hữu ích, nhưng cần đủ dữ liệu cho độ phức tạp và có thể khó debug hơn. Pipeline cho phép đưa kiến thức miền vào hoặc kiểm tra từng chặng, đổi lại có nguy cơ lỗi tích lũy và mục tiêu từng chặng không khớp mục tiêu cuối.

**Ví dụ:** dịch máy có thể học từ cặp câu nguồn–đích. Một nhiệm vụ y tế ít nhãn nhưng có quy trình đo đạc đáng tin có thể hưởng lợi từ các chặng trung gian. Không thể quyết định chỉ vì end-to-end nghe hiện đại hơn.

**Trả lời miệng:** “End-to-end tối ưu ánh xạ tới mục tiêu cuối, còn pipeline tách bài toán thành các chặng có trách nhiệm riêng. Em cân nhắc dữ liệu, độ phức tạp, kiến thức miền và khả năng kiểm tra lỗi. Cả hai đều có đánh đổi; end-to-end không mặc định tốt hơn hoặc loại bỏ mọi thiết kế thủ công.”

**Hỏi tiếp:** Có thể kết hợp hai cách không? → Có. Một hệ lớn có pipeline ở cấp sản phẩm nhưng từng khối học end-to-end; cần nói rõ phạm vi đang xét.

## Ba bài tự kiểm tra có lời giải

### Bài 1: Chọn mục tiêu và mô hình

Ứng dụng cần dự đoán ≤100ms. A: F1=0,91, 70ms; B: F1=0,94, 130ms; C: F1=0,92, 95ms. Nếu tối đa F1 với ràng buộc đó, chọn gì? Nếu cả ba đều chậm hơn 100ms thì sao?

**Lời giải:** Chọn C trong những mô hình đạt điều kiện, dù B có F1 cao nhất. F1 là optimizing metric, latency là satisficing metric. Nếu không mô hình nào đạt, chưa có ứng viên đáp ứng yêu cầu; cần cải thiện hoặc đánh giá lại ràng buộc có căn cứ, không bỏ ràng buộc âm thầm.

### Bài 2: Chẩn đoán bốn mức sai số

Lỗi chuyên gia 1%, train 8%, training-dev 9%, dev 20%. Giả sử các phép so sánh đủ hợp lệ cho chẩn đoán nhập môn, tính các khoảng và giải thích.

**Lời giải:** Train−chuyên gia=7 điểm phần trăm, gợi ý còn avoidable bias nếu chuyên gia là mốc tốt. Training-dev−train=1 điểm, gợi ý khoảng khái quát hóa trên nguồn train. Dev−training-dev=11 điểm, gợi ý data mismatch lớn. Cả bias và mismatch đáng quan tâm; không thể chỉ lấy dev−train=12 rồi gọi toàn bộ là variance. Chuyên gia chỉ là proxy, không phải Bayes error đã biết.

### Bài 3: Mẫu số trong error analysis

Dev có 2.000 ảnh, sai 200 ảnh. Trong các lỗi, 50 ảnh mờ và 20 ảnh sai nhãn; 5 ảnh vừa mờ vừa sai nhãn. Nếu một biện pháp chỉ sửa hoàn hảo 50 lỗi ảnh mờ và không gây lỗi mới, lỗi chung giảm bao nhiêu? Có cộng 50+20 để nói có 70 ảnh thuộc hai nhóm không?

**Lời giải:** Lỗi chung ban đầu 10%; sửa 50 thì còn 150/2.000=7,5%, giảm 2,5 điểm phần trăm. 50/200=25% là tỷ lệ ảnh mờ trong **các lỗi**, không phải toàn dev. Số ảnh thuộc ít nhất một trong hai nhóm là 50+20−5=65, vì phải trừ phần giao. Trần cải thiện giả định không có lỗi mới và tập lỗi được xem đầy đủ như đề bài.

## Từ điển để ôn bằng lời

| Thuật ngữ | Ý nghĩa cần nhớ |
|---|---|
| Orthogonalization | Tách mục tiêu và vai trò của các thay đổi để chẩn đoán rõ hơn |
| Optimizing / satisficing metric | Chỉ số tối ưu / chỉ số cần đạt ngưỡng |
| Target distribution | Phân phối dữ liệu mình muốn làm tốt khi sử dụng |
| HLP | Hiệu năng con người được xác định theo nhóm và phép đo cụ thể |
| Bayes optimal error | Sai số tối thiểu theo thông tin, phân phối và mục tiêu đang xét |
| Avoidable bias | Phần sai trên train còn có thể giảm so với mốc phù hợp |
| Error analysis | Xem và phân loại những dự đoán sai để định hướng cải thiện |
| Training-dev | Tập giữ lại cùng phân phối train, không dùng cập nhật trọng số |
| Data mismatch | Khác phân phối giữa nguồn huấn luyện và miền mục tiêu |
| Transfer / multi-task | Chuyển kiến thức sang nhiệm vụ khác / học nhiều nhiệm vụ đồng thời |
| End-to-end / pipeline | Học theo mục tiêu cuối / tổ chức thành nhiều chặng |

**Tự kiểm tra cuối:** Khi nghe “mô hình kém”, hãy hỏi “kém trên tập nào, theo metric nào, so với mốc nào, sai chủ yếu kiểu gì?”. Bốn câu hỏi này giúp tránh phản xạ tăng độ sâu hoặc thêm dữ liệu trước khi biết vấn đề.
