# DPL302m — CNN và thị giác máy tính từ nền tảng

Tài liệu gồm 18 câu bổ sung cho bốn bài 4.1–4.4. Mục tiêu là hiểu khối CNN, phân biệt các nhiệm vụ thị giác máy tính và trả lời được câu hỏi cơ bản bằng ví dụ. Các nguồn nằm trong thư mục F:/1. FPT Material/Sem5/DPL302m/extracted_texts/. Số slide ghi dưới đây được đối chiếu với marker “Slide N” trong text, không lấy từ bản đồ mục lục.

## Đọc theo mạch nào?

**Ảnh → filter → kích thước/chi phí → kiến trúc CNN → nhận dạng và định vị → so sánh khuôn mặt.**

- Học trước 14 câu [Cốt lõi]: 01–05, 07, 09–10, 12–16, 18. Riêng 18 có thể đọc nhanh để nhận diện chiều dữ liệu.
- Bốn câu [Đọc tiếp]: 06, 08, 11, 17; đưa lên sớm nếu thầy nhấn mạnh kiến trúc hoặc thuật toán đó.
- Trong [bộ DL nền](../Chuyen-de/03-Deep-Learning.md), DL24–25 giải thích CNN/pooling sơ lược, DL28 nói transfer learning và DL34 nói residual. Bộ này mở rộng theo bài học của môn, giữ nguyên các ID cũ.

Mỗi câu có nguồn, giải thích, ví dụ, mẫu đáp và câu nối tiếp. Các ví dụ số được tự biên soạn để bạn chạy tay, không phải lời trích nguyên slide. Mức ưu tiên là hướng đọc, không dự đoán câu thi. Text trích xuất có thể mất hình hoặc làm hỏng công thức; các chỗ cần điều kiện được nói rõ thay vì chép máy móc.

## DPL4-01 [Cốt lõi] Vì sao CNN phù hợp với ảnh?

**Nguồn:** 4.1 Convolutional Neural Networks.txt, slide 5–8, 11–14.

Ảnh có cấu trúc không gian: những pixel gần nhau thường liên quan tới cùng cạnh, góc hoặc bộ phận. Nếu nối toàn bộ ảnh 224×224×3 vào 1.000 neuron, riêng lớp đó đã cần khoảng 150 triệu trọng số. CNN khai thác hai tính chất để giảm gánh nặng:

- **Kết nối cục bộ:** mỗi output nhìn một vùng nhỏ, thay vì toàn bộ ảnh.
- **Chia sẻ tham số:** cùng filter được áp dụng ở nhiều vị trí. Một bộ phát hiện cạnh có thể hữu ích ở cả góc trái lẫn góc phải.

Các tầng có thể học từ cạnh, họa tiết tới bộ phận và đối tượng; đây là cách hình dung biểu diễn phân tầng, không phải mỗi tầng luôn tương ứng chính xác một loại mẫu.

**Ví dụ:** ảnh 28×28×1 có 784 giá trị. Filter 3×3×1 có 9 trọng số được dùng lại trên nhiều vùng ảnh. Dù ảnh lớn hơn, vẫn có thể dùng đúng filter đó.

**Trả lời miệng:** “CNN tận dụng quan hệ lân cận trong ảnh bằng kết nối cục bộ và dùng lại filter trên nhiều vị trí. Điều này giảm số tham số so với nối đầy đủ, đồng thời giúp phát hiện cùng kiểu mẫu ở các vị trí khác nhau.”

**Nối tiếp:** CNN có tự động bất biến với mọi phép xoay hoặc dịch ảnh không? → Không. Tính chất tích chập, pooling và dữ liệu huấn luyện giúp theo những điều kiện nhất định; không bảo đảm mọi biến đổi đều giữ dự đoán.

## DPL4-02 [Cốt lõi] Filter, convolution và feature map thực sự tính gì?

**Nguồn:** 4.1 Convolutional Neural Networks.txt, slide 14, 17–30, 40.

Filter/kernel là một nhóm trọng số nhỏ. Tại mỗi vị trí, lấy vùng ảnh tương ứng, nhân từng cặp phần tử rồi cộng, có thể cộng bias. Dịch filter sang vị trí khác và làm tiếp; bảng kết quả là **feature map**.

**Ví dụ chạy tay:** vùng ảnh [[1,2],[3,4]], filter [[1,0],[0,−1]] cho 1×1 + 2×0 + 3×0 + 4×(−1) = −3. Giá trị âm/dương phụ thuộc filter và hướng tương phản, không đồng nghĩa “ảnh xấu/tốt”.

Filter thủ công như Sobel/Scharr minh họa phát hiện cạnh. Trong CNN, các giá trị filter thường được học bằng backprop. Phép được gọi là convolution trong nhiều thư viện thực ra là cross-correlation: không lật kernel trước khi nhân. Đây là quy ước cần nhất quán khi tự tính.

**Trả lời miệng:** “Filter quét các vùng nhỏ và tính tổng có trọng số để tạo feature map. Các filter khác nhau có thể phản ứng với các mẫu khác nhau. Mạng học giá trị filter từ dữ liệu, thay vì bắt buộc dùng bộ phát hiện cạnh được viết sẵn.”

**Nối tiếp:** Một filter có phát hiện được mọi loại đặc trưng không? → Không nên kỳ vọng như vậy; một lớp thường có nhiều filter để tạo nhiều kênh đặc trưng.

## DPL4-03 [Cốt lõi] Stride, padding, valid và same ảnh hưởng kích thước thế nào?

**Nguồn:** 4.1 Convolutional Neural Networks.txt, slide 31–40.

**Stride s** là bước dịch filter. **Padding p** thêm phần biên, thường là số 0. Không padding, mỗi lần convolution có thể làm ảnh nhỏ đi và các pixel biên được dùng ít hơn.

Với một chiều input n, kernel f, padding đối xứng p, stride s và không dilation:

**n_out = floor((n + 2p − f)/s) + 1.**

Valid nghĩa là không thêm padding. Với stride 1 và kernel lẻ, chọn p=(f−1)/2 giữ kích thước; đây là trường hợp same quen thuộc. Với stride lớn hơn 1, “same” trong thư viện thường có quy ước output ceil(n/s), có thể cần padding bất đối xứng. Không phải mọi filter đều buộc có kích thước lẻ.

**Ví dụ:** n=6, f=3, p=0, s=2 cho floor(3/2)+1=2. Nếu p=1, s=1 thì output bằng 6.

**Trả lời miệng:** “Stride điều khiển bước trượt, padding thêm biên và ảnh hưởng kích thước output. Em tính riêng chiều cao và rộng bằng công thức có floor. Valid không padding; same giữ kích thước trong cấu hình stride 1 phù hợp, còn trường hợp khác cần xem quy ước thư viện.”

**Nối tiếp:** Kernel 3×3, stride 1, padding 1 luôn làm output bằng input không? → Với dilation 1 và padding một pixel mỗi phía, đúng; thay dilation thì phải đổi công thức.

## DPL4-04 [Cốt lõi] CNN trên ảnh RGB: shape và số tham số là gì?

**Nguồn:** 4.1 Convolutional Neural Networks.txt, slide 41–59.

Ở convolution tiêu chuẩn, mỗi filter trải qua toàn bộ C_in kênh đầu vào. Ảnh RGB có 3 kênh nên filter không gian 3×3 sẽ có shape 3×3×3. Một filter tạo một kênh output; K filter tạo K kênh. Chú ý phân biệt số kênh với số ảnh trong batch.

Với một bias/filter, số tham số là:

**(f_h × f_w × C_in + 1) × C_out.**

Đây là số weight và bias cần học; không nhân thêm số vị trí trên ảnh, vì các vị trí chia sẻ weight.

**Ví dụ:** input 6×6×3, 10 filter 3×3×3, stride 1, valid → output 4×4×10. Số tham số (27+1)×10=280. Bỏ bias thì còn 270.

**Trả lời miệng:** “Chiều sâu filter khớp số kênh input, còn số filter quyết định số kênh output. Kích thước không gian tính theo kernel, stride, padding. Tham số của conv phụ thuộc filter và kênh, không trực tiếp phụ thuộc chiều cao/rộng ảnh.”

**Nối tiếp:** Ảnh lớn gấp đôi chiều cao/rộng mà số tham số không tăng thì chi phí cũng không tăng? → Sai; số vị trí cần áp filter tăng, nên tính toán và activation cần lưu vẫn tăng.

## DPL4-05 [Cốt lõi] Pooling, flatten và fully-connected có vai trò gì?

**Nguồn:** 4.1 Convolutional Neural Networks.txt, slide 61–74.

Pooling tóm tắt các vùng của feature map. **Max pooling** lấy giá trị lớn nhất, **average pooling** lấy trung bình. Các phiên bản thông thường không có trọng số học được; kernel size/stride là cấu hình. Pooling thường áp độc lập trên từng kênh.

**Ví dụ:** vùng [[1,3],[2,4]] cho max=4, average=2,5. Max pooling 2×2 stride 2 trên volume 8×8×16 tạo 4×4×16. Nó giảm không gian, không tự giảm số kênh.

Flatten đổi tensor thành vector, chẳng hạn 4×4×16 thành 256 số. Fully-connected biến vector đặc trưng thành output phân loại/hồi quy. Một pipeline cổ điển là Conv → ReLU → Pool → Conv → Pool → Flatten → FC → Output; cũng có kiến trúc dùng global average pooling thay phần FC lớn.

**Trả lời miệng:** “Pooling giảm độ phân giải bằng phép tóm tắt vùng, còn flatten chỉ đổi cách sắp xếp tensor thành vector. Fully-connected dùng đặc trưng để dự đoán. Pooling có thể tiết kiệm tính toán nhưng cũng làm mất chi tiết vị trí.”

**Nối tiếp:** Pooling luôn giảm overfitting hoặc luôn có ích? → Không. Nó là lựa chọn kiến trúc; nhiệm vụ cần biên chính xác phải cân nhắc lượng thông tin bị mất.

## DPL4-06 [Đọc tiếp] Cần nhớ gì về LeNet, AlexNet và VGG?

**Nguồn:** 4.2Case Studies.txt, slide 7–16.

Học ba mạng theo ý tưởng thiết kế thay vì thuộc mọi số tầng:

| Mạng | Ý tưởng chính | Điều cần nhớ |
|---|---|---|
| LeNet-5 | Conv/pooling rồi FC, phục vụ chữ số/ký tự | Ví dụ sớm, quy mô nhỏ |
| AlexNet | Mạng lớn hơn, ReLU, huấn luyện ảnh quy mô lớn | Dùng dữ liệu/tính toán và kỹ thuật huấn luyện để tăng khả năng |
| VGG-16 | Nhiều conv 3×3 theo cấu trúc đều, xen pooling | Dễ theo dõi nhưng tốn tham số/tài nguyên |

**Ví dụ:** trong VGG-16, “16” thường đếm 13 lớp conv và 3 lớp FC có weight; không cộng mọi pooling/activation vào con số này. Hai conv 3×3 stride 1 có receptive field 5×5 nếu bỏ qua các yếu tố biên, đồng thời có activation giữa hai conv; không giống hệt một conv 5×5 tuyến tính.

**Trả lời miệng:** “LeNet cho cấu trúc CNN cổ điển, AlexNet mở rộng quy mô với ReLU, VGG dùng các conv nhỏ xếp sâu theo quy luật. Em so chúng theo cách xây khối, khả năng biểu diễn và chi phí, không kết luận kiến trúc mới luôn tốt nhất.”

**Nối tiếp:** Có cần tự xây lại VGG cho bộ dữ liệu nhỏ? → Không bắt buộc; dùng pretrained model phù hợp và đánh giá validation thường là điểm xuất phát thực tế.

## DPL4-07 [Cốt lõi] ResNet và residual connection giúp mạng sâu thế nào?

**Nguồn:** 4.2Case Studies.txt, slide 17–28.

Với mạng plain rất sâu, **training error** đôi khi tăng khi thêm tầng: đây là degradation liên quan khó khăn tối ưu, khác overfitting vốn thường nói train tốt nhưng dev kém. ResNet cho khối học phần điều chỉnh F(x) và cộng đường tắt x:

**y = F(x) + x**, hoặc y=g(F(x)+x) tùy loại block.

Nếu F(x) gần 0, khối giữ được đường truyền identity theo cấu hình phù hợp. Đường tắt cũng hỗ trợ gradient. Nếu shape khác nhau, cần projection, thường bằng conv 1×1, để cộng được.

**Ví dụ:** x=[2,3], F(x)=[0,1] → trước activation, kết quả [2,4]. Phép cộng là giữa input của block và nhánh đã biến đổi, không mặc định cộng output của conv thứ nhất với conv thứ hai.

**Trả lời miệng:** “ResNet thêm skip connection để khối học phần residual và giữ đường truyền input. Nó giúp tối ưu mạng sâu và giảm degradation trong nhiều trường hợp. Tuy nhiên nó không loại bỏ mọi vấn đề gradient và không tự giải quyết overfitting.”

**Nối tiếp:** Mạng sâu train error thấp, dev error cao có phải degradation không? → Đó gợi ý overfitting hoặc vấn đề phân phối; cần phân biệt với train error tăng do tối ưu khi thêm tầng.

## DPL4-08 [Đọc tiếp] Conv 1×1, Inception, MobileNet và EfficientNet khác nhau ra sao?

**Nguồn:** 4.2Case Studies.txt, slide 29–45, 47–95.

Conv 1×1 **trộn các kênh tại mỗi vị trí**. Input 28×28×192 qua 32 filter 1×1, stride 1 sẽ thành 28×28×32. Đây là bottleneck giảm kênh trước conv lớn, không phải chỉ nhân mỗi pixel với một số khi có nhiều kênh.

Inception chạy các nhánh kernel khác nhau và pooling rồi **nối theo kênh**; 1×1 giúp giảm chi phí. MobileNet dùng **depthwise separable convolution**: lọc không gian từng kênh bằng depthwise, rồi trộn kênh bằng pointwise 1×1. EfficientNet dùng **compound scaling**, cân đối depth, width và resolution theo ngân sách.

**Ví dụ số, bỏ bias:** conv 3×3 từ 16 kênh sang 32 cần 3×3×16×32=4.608 weight. Depthwise (một filter/kênh) rồi pointwise cần 3×3×16 + 16×32=656 weight. Số phép tính còn phụ thuộc kích thước output, không phải mọi cấu hình đều tiết kiệm cùng tỷ lệ.

**Trả lời miệng:** “1×1 trộn và giảm kênh; Inception ghép nhiều nhánh quy mô khác nhau. MobileNet tách lọc không gian và trộn kênh để tiết kiệm. EfficientNet cân đối tăng độ sâu, độ rộng và độ phân giải.”

**Nối tiếp:** MobileNetV2 thêm ý gì? → Mở rộng kênh, depthwise rồi projection hẹp với linear bottleneck; residual được dùng khi shape/stride cho phép.

## DPL4-09 [Cốt lõi] Dùng pretrained CNN và augmentation thế nào khi ít dữ liệu?

**Nguồn:** 4.2Case Studies.txt, slide 96–105; kiến thức nền liên quan DL28.

Pretrained backbone đã học đặc trưng từ dữ liệu lớn. Với bài mới, có thể thay classifier, đóng băng backbone rồi học tầng đầu ra; sau đó cân nhắc mở một phần/tất cả tầng để fine-tune với learning rate phù hợp. Số tầng mở phụ thuộc độ lớn và mức khác biệt của dữ liệu mới, không có một quy tắc cố định.

**Ví dụ:** có 800 ảnh hoa thuộc 4 loại. Bắt đầu với backbone ảnh pretrained, đầu ra 4 lớp, augmentation hợp lệ, theo dõi validation. Không đánh giá bằng chính ảnh đã dùng fine-tune.

Augmentation như đổi sáng/crop/flip tạo biến thể có nhãn vẫn đúng. Với detection phải biến đổi box; segmentation phải biến đổi mask cùng ảnh. Đóng băng weight không tự bảo đảm BatchNorm ngừng cập nhật thống kê; cần chọn chế độ đúng.

**Trả lời miệng:** “Transfer learning tận dụng biểu diễn đã học để giảm nhu cầu train từ đầu. Em giữ tiền xử lý phù hợp backbone, học đầu ra mới, rồi fine-tune có kiểm soát. Augmentation giúp tăng đa dạng nhưng phải giữ đúng nhãn và đánh giá trên dữ liệu chưa dùng học.”

**Nối tiếp:** Lật ngang ảnh lúc nào không hợp lệ? → Khi hướng trái/phải, chữ hoặc nhãn phụ thuộc hướng; cần xét bài toán thay vì dùng mọi biến đổi sẵn có.

## DPL4-10 [Cốt lõi] Classification, localization, detection và landmark khác nhau thế nào?

**Nguồn:** 4.3 Object Detection.txt, slide 4–10.

Các bài toán khác nhau ở **đầu ra cần dự đoán**:

- Classification: ảnh thuộc lớp nào.
- Classification + localization: có đối tượng gì và box ở đâu, trong ví dụ thường có một đối tượng chính.
- Detection: nhiều đối tượng, mỗi đối tượng có lớp và box.
- Landmark detection: tọa độ các điểm mốc như mắt, khóe môi hoặc khớp.

**Ví dụ:** nhận “xe” là classification; vẽ box cho chiếc xe là localization; tìm ba xe và hai người là detection; tìm các khớp của một người là landmark.

Vector label minh họa có objectness p_c, bốn tọa độ box và thông tin class. Khi không có đối tượng, tọa độ có thể không tham gia loss theo quy tắc đã thiết kế. Quy ước tọa độ tâm/góc, chuẩn hóa theo ảnh/cell phải được nêu rõ.

**Trả lời miệng:** “Em phân biệt theo output: nhãn, nhãn kèm box, nhiều nhãn/box hoặc tọa độ các điểm mốc. Vì output khác nhau nên cần nhãn huấn luyện, loss và thước đo phù hợp.”

**Nối tiếp:** Detection có biết chính xác pixel nào thuộc vật không? → Box chỉ bao hình chữ nhật; muốn nhãn theo pixel thì dùng segmentation.

## DPL4-11 [Đọc tiếp] Sliding-window detection và region proposals là gì?

**Nguồn:** 4.3 Object Detection.txt, slide 12–19, 37–39, 47; region proposals được ghi “Optional” trong slide.

Sliding window cắt nhiều vùng ảnh ở nhiều vị trí/kích thước rồi đưa qua classifier. Các crop chồng lấp làm lặp rất nhiều tính toán. Đổi các lớp fully-connected thành convolution tương đương cho phép chạy trên ảnh lớn và chia sẻ feature computation giữa nhiều vị trí.

**Ví dụ:** một FC nhận tensor 5×5×16 và trả 400 số có thể biểu diễn bằng 400 filter 5×5×16 trên đúng vùng đó. Khi áp mạng lên ảnh lớn hơn, output không gian cho nhiều vị trí ứng viên.

Region proposals chọn trước vùng có khả năng chứa vật thể. R-CNN xử lý các vùng đề xuất; Fast/Faster R-CNN cải thiện chia sẻ tính toán và đề xuất vùng. Tối nay chỉ cần nắm khác biệt về cách tạo/xử lý ứng viên, chưa cần thuộc mọi phiên bản.

**Trả lời miệng:** “Sliding window thử nhiều crop nên tốn công. Triển khai bằng convolution giúp chia sẻ phép tính. Region proposals tìm vùng ứng viên trước để giảm số vùng cần xét; đó là một hướng khác với dự đoán trực tiếp kiểu YOLO.”

**Nối tiếp:** Feature computation chia sẻ có bảo đảm box định vị tốt? → Không. Vẫn cần học tọa độ, xử lý nhiều kích thước và loại dự đoán trùng.

## DPL4-12 [Cốt lõi] YOLO trong bài học dùng grid và anchor boxes ra sao?

**Nguồn:** 4.3 Object Detection.txt, slide 20–23, 33–36, 40–46.

Trong cách YOLO được giảng ở đây, ảnh chia thành grid S×S. Mỗi ô dự đoán objectness, bốn thông số box và thông tin lớp. Quy tắc gán đối tượng thường dựa vào ô chứa tâm của nó; box có thể vượt ranh giới ô.

**Anchor boxes** là các hình dạng tham chiếu giúp một ô có nhiều vị trí dự đoán hình dạng khác nhau. Chọn anchor liên quan đến hình dạng đối tượng; một ô không chỉ có đúng một vector dự đoán nữa.

**Ví dụ:** S=3, B=2 anchors, C=3 lớp → mỗi anchor có 5+C=8 số; tensor 3×3×2×8, tương đương 3×3×16 nếu gộp trục. Tọa độ, objectness và class phải decode theo đúng phiên bản.

**Trả lời miệng:** “YOLO dự đoán các hộp và lớp trên toàn ảnh trong một forward pass. Grid tổ chức output; anchor là hình dạng tham chiếu cho nhiều dự đoán mỗi ô. Sau forward cần decode, lọc và thường chạy NMS.”

**Nối tiếp:** Mọi phiên bản YOLO đều dùng anchor? → Không. Bài này mô tả một thiết kế cụ thể; có các phiên bản/thiết kế anchor-free. Không áp công thức của một phiên bản cho mọi mô hình mang tên YOLO.

## DPL4-13 [Cốt lõi] IoU khác confidence thế nào? NMS làm gì?

**Nguồn:** 4.3 Object Detection.txt, slide 24–32.

**IoU = diện tích giao / diện tích hợp** đo độ chồng lấp hai box hợp lệ. **Confidence/score** là điểm dự đoán của mô hình theo quy ước detector. Điểm cao không bảo đảm box chồng đúng ground truth.

**Ví dụ tọa độ:** box A=[0,0,2,2], B=[1,0,3,2]. Diện tích mỗi box là 4, giao là 2, hợp là 4+4−2=6, nên IoU=1/3. Dùng diện tích hình học liên tục ở đây, không cộng thêm 1 vào độ dài cạnh.

NMS thông thường: bỏ điểm thấp → chọn box điểm cao nhất → loại box cùng lớp chồng quá ngưỡng với box vừa chọn → lặp. Nó giảm dự đoán trùng, không bảo đảm luôn giữ đúng các vật thể gần nhau. Ngưỡng IoU 0,5 trong slide là ví dụ, không phải chuẩn duy nhất.

**Trả lời miệng:** “Confidence nói mức điểm của dự đoán; IoU nói box chồng nhau bao nhiêu. NMS dùng điểm và IoU để giữ box mạnh, loại box trùng, thường làm riêng theo lớp. Khi đánh giá TP còn cần lớp và quy tắc ghép với ground truth.”

**Nối tiếp:** NMS có dùng box thật khi inference không? → Không; nó so các box dự đoán với nhau. IoU trong đánh giá mới thường so với ground truth.

## DPL4-14 [Cốt lõi] Segmentation, U-Net và transposed convolution

**Nguồn:** 4.3 Object Detection.txt, slide 48–63.

Semantic segmentation gán **class cho từng pixel**. Hai chiếc xe cùng có nhãn “xe” vẫn có thể chưa được tách thành hai instance riêng. U-Net dùng encoder giảm độ phân giải để học ngữ cảnh, decoder tăng độ phân giải và skip connections nối feature chi tiết từ encoder sang decoder.

**Ví dụ:** ảnh 128×128 với 3 lớp có thể cho logits 128×128×3; mỗi pixel chọn một lớp. Nhãn là mask H×W chứa mã lớp, không phải một nhãn cho toàn ảnh. Categorical cross-entropy có thể áp từng pixel; sparse categorical cross-entropy nhận nhãn lớp dạng số nguyên theo API.

Transposed convolution là phép biến đổi học được có thể tăng kích thước. Nó không phải phép nghịch đảo duy nhất của convolution. Với dilation 1, một quy ước thường dùng là n_out=(n−1)s−2p+f+output_padding. Ví dụ n=2,s=2,p=1,f=3 cho 3 khi output_padding=0, hoặc 4 khi output_padding=1. Vì vậy ví dụ 2→4 trong text cần hiểu cùng quy ước output shape, không bỏ qua điều kiện.

**Trả lời miệng:** “U-Net kết hợp ngữ cảnh từ encoder với chi tiết qua skip connections để dự đoán theo pixel. Decoder dùng upsampling, có thể bằng transposed convolution. Skip ở U-Net thường ghép kênh, khác phép cộng residual trong ResNet.”

**Nối tiếp:** Segmentation có tự phân biệt hai người cùng class không? → Semantic segmentation không nhất thiết; instance segmentation mới tách từng cá thể.

## DPL4-15 [Cốt lõi] Verification, recognition và one-shot learning khác nhau thế nào?

**Nguồn:** 4.4 Face recognition.txt, slide 5–11.

**Verification** là 1:1: “Ảnh này có đúng là người A khai báo không?”. **Recognition** là tìm trong K danh tính: “Người trong ảnh là ai?”, có thể trả “không nhận ra”.

One-shot trong tình huống này nghĩa là mỗi danh tính mới chỉ có một ảnh tham chiếu. Nó **không có nghĩa toàn bộ mạng được huấn luyện từ duy nhất một ảnh**. Encoder so sánh khuôn mặt thường đã được học từ nhiều ảnh/người trước đó.

**Ví dụ:** công ty thêm nhân viên mới. Có thể lưu embedding ảnh của người đó, rồi so ảnh mới với hồ sơ, thay vì thay số class và retrain classifier cho mỗi lần thêm người. Threshold cần kiểm tra theo dữ liệu, đánh đổi nhận nhầm và từ chối nhầm.

**Trả lời miệng:** “Verification xác nhận một danh tính cụ thể; recognition tìm danh tính trong database. Với one-shot, ta tận dụng encoder đã học để so sánh với ít ảnh tham chiếu, chứ không học toàn bộ khả năng nhận diện từ một ảnh.”

**Nối tiếp:** Recognition có được ép mọi ảnh về một người trong database không? → Không nên; cần cơ chế từ chối nếu không đủ tương đồng, theo yêu cầu hệ thống.

## DPL4-16 [Cốt lõi] Siamese network và triplet loss học embedding ra sao?

**Nguồn:** 4.4 Face recognition.txt, slide 12–30.

Siamese dùng các nhánh **chia sẻ cùng trọng số** để biến ảnh thành embedding f(x). Cùng phép biến đổi giúp các vector nằm trong không gian có thể so sánh. Khoảng cách nhỏ có thể gợi ý cùng người; ngưỡng được chọn theo dữ liệu. Một cách khác trong slide là đưa độ khác biệt embedding qua bộ phân loại nhị phân.

Triplet loss dùng A=anchor, P=positive cùng người, N=negative khác người. Đặt D_AP=||f(A)−f(P)||² và D_AN=||f(A)−f(N)||²:

**L=max(D_AP−D_AN+α, 0).**

**Ví dụ:** D_AP=0,8, D_AN=1,1, margin α=0,5 → L=max(0,2;0)=0,2. Muốn loss 0 thì D_AN phải ít nhất 1,3 với D_AP đang là 0,8. Đây là **khoảng cách đã bình phương**, không bình phương các số này lần nữa.

Triplet quá dễ đã loss 0 nên ít cung cấp tín hiệu. Chọn triplet khó vừa đủ giúp học; nhãn sai và triplet cực khó có thể gây vấn đề. Encoder pretrained có thể giảm nhu cầu học từ đầu.

**Trả lời miệng:** “Siamese là kiến trúc chia sẻ encoder, còn triplet loss là mục tiêu học. Triplet khuyến khích ảnh cùng người gần nhau hơn ảnh khác người một margin trên khoảng cách bình phương. Hai khái niệm liên quan nhưng không phải hai tên cho cùng một thứ.”

**Nối tiếp:** Loss 0 có nghĩa khoảng cách positive bằng 0? → Không; chỉ cần thỏa D_AP+α≤D_AN cho triplet đó.

## DPL4-17 [Đọc tiếp] Neural Style Transfer, content/style loss và Gram matrix

**Nguồn:** 4.4 Face recognition.txt, slide 33–35, 38–60. Thuật ngữ Gram matrix được dùng để gọi phép tổng tích activation giữa các kênh mô tả ở slide 58.

Trong cách style transfer cổ điển đang học, giữ CNN pretrained cố định và tối ưu **pixel ảnh sinh G**. Content loss so đặc trưng của G với ảnh nội dung C. Style loss so thống kê activation của G với ảnh phong cách S. Mục tiêu tổng hợp J=αJ_content+βJ_style.

Gram matrix đo tích vô hướng giữa feature maps kênh k và k' sau khi trải các vị trí không gian. Ví dụ hai kênh [1,2] và [3,4] có tích vô hướng 11; đó là một phần tử ngoài đường chéo của Gram matrix chưa chuẩn hóa. Cách chuẩn hóa được chọn nhất quán với công thức loss.

Thống kê này giữ sự đồng xuất hiện của mẫu tốt hơn vị trí từng chi tiết. Nó là một cách mô hình hóa phong cách trong thuật toán, không phải định nghĩa toàn bộ phong cách nghệ thuật.

**Trả lời miệng:** “Neural style transfer tìm ảnh mới giữ nội dung của C và thống kê phong cách của S. CNN tạo đặc trưng để tính loss; ở bản cổ điển, ta cập nhật ảnh sinh, giữ weight mạng cố định. Gram matrix tổng hợp quan hệ giữa các kênh.”

**Nối tiếp:** Content loss có so pixel trực tiếp không? → Trong cách này thường so activation, nên không bắt ảnh sinh sao chép từng pixel của ảnh nội dung.

## DPL4-18 [Cốt lõi] Conv1D, Conv2D, Conv3D dùng khi nào?

**Nguồn:** 4.4 Face recognition.txt, slide 63–67, 79–81.

Số chiều ở đây nói tới **các trục kernel trượt**, không chỉ số chiều tensor trong code. Conv1D trượt trên thời gian/tọa độ một chiều như ECG; Conv2D trượt trên cao/rộng của ảnh; Conv3D trượt trên volume hoặc không gian–thời gian video. Các dạng này vẫn có kênh và batch riêng.

**Ví dụ:** batch ảnh RGB có thể là tensor 4 chiều nhưng vẫn dùng Conv2D. Volume 14×14×14 với một kênh, 16 filter 5×5×5, stride 1, valid tạo 10×10×10×16. Số kênh input của filter phải bằng số kênh input; số kênh output do số filter quyết định.

CNN sâu có thể học biểu diễn phức tạp từ dữ liệu này, nhưng không phải mọi tầng đều giải thích được bằng một khái niệm con người dễ đặt tên. Trực quan hóa activation giúp khảo sát, chưa chứng minh nhân quả của dự đoán.

**Trả lời miệng:** “Em chọn số chiều conv theo cấu trúc lân cận cần khai thác: tín hiệu 1D, ảnh 2D, volume hoặc video 3D. Batch và kênh không phải các trục trượt tương đương. Video cũng có thể xử lý bằng CNN từng frame kết hợp mô hình chuỗi.”

**Nối tiếp:** Dữ liệu video bắt buộc dùng Conv3D? → Không; đó là một lựa chọn, cần xét dữ liệu, phụ thuộc thời gian và tài nguyên.

## Bốn bài tự kiểm tra có lời giải

### Bài 1 — Theo dõi shape và số tham số

Input 32×32×3, Conv 3×3 với 16 filter, stride 1, padding 1, có bias; sau đó MaxPool 2×2 stride 2. Tính output mỗi lớp và tham số học thêm ở mỗi lớp.

**Lời giải:** conv tạo 32×32×16, có (3×3×3+1)×16=448 tham số. Pool tạo 16×16×16, không thêm weight/bias. Flatten sau đó sẽ tạo vector 4.096 số. Các số này chưa tính batch.

### Bài 2 — IoU và NMS

A=[0,0,2,2], B=[1,0,3,2], cùng class, score 0,9 và 0,7. Tính IoU; nếu NMS loại khi IoU>0,3 thì box nào còn? Nếu threshold là 0,5 thì sao?

**Lời giải:** giao=2, hợp=6, IoU=1/3. Với 0,3, chọn A trước rồi loại B. Với 0,5, cả hai còn vì IoU chưa qua ngưỡng. Box còn không tự chứng minh là dự đoán đúng; phải đánh giá với ground truth.

### Bài 3 — Triplet loss

Khoảng cách Euclid từ A tới P là 0,6, từ A tới N là 0,8, margin α=0,3. Tính loss với công thức dùng khoảng cách bình phương.

**Lời giải:** D_AP=0,36, D_AN=0,64; L=max(0,36−0,64+0,3;0)=0,02. Chú ý khác DPL4-16, đề này cho khoảng cách chưa bình phương, nên phải bình phương trước.

### Bài 4 — Chọn output

Bạn muốn (a) biết ảnh có xe không; (b) tìm box của mọi xe; (c) phân loại pixel đường/xe/người; (d) kiểm tra người trước camera có đúng mã nhân viên đã khai báo. Nêu task và dạng output.

**Lời giải:** (a) classification, nhãn/xác suất ảnh; (b) detection, danh sách box/class/score; (c) semantic segmentation, nhãn hoặc logits từng pixel; (d) verification, kết luận khớp/không khớp dựa trên score và threshold. Các task không dùng cùng dạng nhãn hoặc chỉ số đánh giá.

## Bảng công thức và lỗi dễ nhầm

| Nội dung | Công thức/ý chính | Điều kiện |
|---|---|---|
| Conv output một chiều | floor((n+2p−f)/s)+1 | Padding đối xứng, dilation 1 |
| Conv parameters | (f_h×f_w×C_in+1)×C_out | Conv tiêu chuẩn, một bias/filter |
| Pooling | Giảm không gian, thường giữ kênh | Max/average pooling theo từng kênh |
| Residual | F(x)+x | Cùng shape hoặc có projection |
| IoU | Giao/hợp | Box hợp lệ, diện tích hợp dương |
| Triplet | max(D_AP−D_AN+α,0) | D là khoảng cách bình phương trong công thức này |
| YOLO output minh họa | S×S×B×(5+C) | Thiết kế anchor-based trong bài |
| Transposed conv output | (n−1)s−2p+f+output_padding | Dilation 1, theo quy ước này |

## Thuật ngữ Anh–Việt

| Thuật ngữ | Nghĩa cần nhớ |
|---|---|
| Kernel / filter | Bộ trọng số quét vùng cục bộ |
| Feature map / channel | Bản đồ phản ứng / kênh đặc trưng |
| Stride / padding | Bước trượt / đệm biên |
| Parameter sharing | Chia sẻ trọng số giữa các vị trí |
| Flatten / fully connected | Trải thành vector / nối đầy đủ |
| Backbone / fine-tuning | Phần trích đặc trưng / học tiếp tham số |
| Residual / concatenate | Phần điều chỉnh cộng thêm / ghép tensor |
| Depthwise / pointwise | Lọc riêng từng kênh / trộn kênh bằng 1×1 |
| Localization / detection | Định vị / phát hiện nhiều đối tượng |
| Landmark / bounding box | Điểm mốc / hộp bao |
| Semantic segmentation | Phân loại theo pixel |
| Verification / recognition | Xác thực 1:1 / tìm danh tính 1:K |
| Embedding / margin | Vector biểu diễn / khoảng cách an toàn trong loss |
| Gram matrix | Ma trận tích vô hướng giữa các kênh đặc trưng |

## Phạm vi nguồn và phần thực hành nên xem tiếp

Bốn file text đều đã được dùng để xác định mục tiêu, thứ tự bài và các trang nguồn. Sơ đồ chỉ tồn tại dưới dạng ảnh có thể không đọc đầy đủ từ text; các ví dụ số ở đây là giải thích bổ sung chuẩn hóa, không phải xác nhận hình gốc.

Learning objectives còn có thực hành NumPy convolution/pooling, Keras Sequential/Functional API, xây ResNet, fine-tune MobileNet, IoU/NMS, U-Net và face embeddings. Bộ câu hỏi này giúp hiểu trước khi viết code; để ôn thực hành, cần xem lại notebook/bài tập thật. Không coi việc đọc đủ 18 câu là đã thực hiện được toàn bộ các bài lập trình.

Nếu còn ít thời gian, tự tính bài 1–3 và nói được output khác nhau của bài 4 trước khi cố nhớ lịch sử hoặc từng số tầng của các kiến trúc.

