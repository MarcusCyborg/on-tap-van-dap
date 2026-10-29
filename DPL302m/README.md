# DPL302m — Kiến thức cơ bản bám môn Deep Learning

Bộ bổ sung này có **72 câu theo 5 chương: 57 Cốt lõi, 15 Đọc tiếp**, kèm **19 bài tự kiểm tra có lời giải**. Mục tiêu là hiểu khái niệm, giải thích được cơ chế và làm các phép tính nhỏ phục vụ vấn đáp.

Đây là phần học chính cho môn DPL302m. [35 câu DL trước đó](../Chuyen-de/03-Deep-Learning.md) vẫn hữu ích làm bước đệm và giữ nguyên mã DL01–DL35. Tổng hai bộ là 107 mục liên quan DL, nhưng có phần ôn lại/chồng lấn; không đồng nghĩa 107 concept hoàn toàn riêng biệt hoặc bao phủ toàn bộ chi tiết môn.

## Đọc theo thứ tự

| Chương | Tài liệu | Số câu | Trọng tâm |
|---|---|---:|---|
| 1 | [Neural network foundations](01-Neural-network-foundations.md) | 12 | Logistic/BCE, computation graph, vectorization, broadcasting, shape, forward/backward |
| 2 | [Huấn luyện và tối ưu](02-Huan-luyen-va-toi-uu.md) | 14 | Bias/variance, L2/dropout, khởi tạo, gradient checking, Momentum/RMSprop/Adam, tuning/BN |
| 3 | [ML strategy và error analysis](03-ML-strategy-va-error-analysis.md) | 10 | Mục tiêu, HLP, avoidable bias, training-dev, lỗi dữ liệu, transfer/multi-task/end-to-end |
| 4 | [CNN và thị giác máy tính](04-CNN-va-thi-giac-may-tinh.md) | 18 | Convolution/shape, kiến trúc CNN, YOLO/IoU/NMS, U-Net, face recognition và style transfer |
| 5 | [RNN, NLP và Transformer](05-RNN-NLP-va-Transformer.md) | 18 | RNN/LSTM/GRU, embeddings, Word2Vec, Seq2Seq, beam/BLEU, attention/Transformer |

Nếu chưa biết loss và gradient là gì, đọc DL03–DL13 trong bản nền tảng trước. Không cần đọc lại toàn bộ bốn mảng mới bắt đầu được môn này.

## Cách học trong thời gian ngắn

1. Lướt tiêu đề 5 chương để có bức tranh chung.
2. Học các câu **Cốt lõi**: đọc phần giải thích, tự chạy ví dụ, đóng tài liệu và nói lại.
3. Với công thức, hiểu từng ký hiệu và shape trước khi cố nhớ nguyên biểu thức.
4. Làm bài tự kiểm tra cuối chương. Sai câu nào thì quay lại đúng concept đó.
5. Đọc **Đọc tiếp** khi phần cơ sở đã rõ hoặc thầy nhấn mạnh nội dung đó trên lớp.

Nhãn là ưu tiên sư phạm, không dự báo xác suất ra đề. “Biết tên” chưa đủ: với mỗi concept, tự trả lời **nó làm gì, hoạt động ra sao, một ví dụ và một điều dễ nhầm**.

## Nguồn được dùng

Nguồn chính: 17 file text trích từ slide, có tổng 1.030 marker slide, tại:

```text
F:\1. FPT Material\Sem5\DPL302m\extracted_texts
```

Nguồn phụ: 5 bản tổng hợp trong `F:\1. FPT Material\Sem5\DPL302m\summaries`. Bản `SLIDE_CURRICULUM_MAP.md` dùng để rà phạm vi, không dùng một mình để xác định trang.

Mỗi câu ghi tên text nguồn và marker slide thực tế đã đối chiếu. Một số mốc trong bản đồ lệch so với text. Marker là vị trí trong bản trích xuất; chưa khẳng định tương đương số trang trình chiếu hay đã xem trực tiếp mọi hình PowerPoint.

Các công thức bị vỡ khi trích text được viết lại theo công thức chuẩn và ghi rõ khi cần. Ví dụ, giải thích và mẫu đáp là phần biên soạn phục vụ người mới, không phải trích nguyên lời giảng viên. Phần GPT so sánh với BERT được ghi là bổ sung vì chưa tìm thấy tên GPT trong text bài 5.4.

## Bảng nối 17 bài với câu học

| Bài nguồn | Câu nên đọc | Mức bao phủ mới |
|---|---|---|
| 1.1 Introduction | DPL1-01; DL01, DL29 cũ | Dữ liệu, ứng dụng và động lực của DL ở mức cơ bản |
| 1.2 Basic NN | DPL1-02–DPL1-07 | Logistic/BCE, computation graph, vectorization/broadcasting |
| 1.3 Shallow NN | DPL1-08–DPL1-11 | Một tầng ẩn, activation, backprop, phá đối xứng |
| 1.4 Deep NN | DPL1-07, DPL1-10–DPL1-12 | Shape, cache, biểu diễn sâu, parameters/hyperparameters |
| 2.1 Practical aspects | DPL2-01–DPL2-08 | Quy trình dữ liệu và kỹ thuật huấn luyện cơ bản |
| 2.2 Optimization | DPL2-09–DPL2-12 | Mini-batch, EWMA, Momentum/RMSprop/Adam, decay |
| 2.3 Hyperparameters | DPL2-13–DPL2-14 | Tuning, BatchNorm, softmax, vai trò các API framework |
| 3.1 ML strategy | DPL3-01–DPL3-04 | Mục tiêu đo lường, dev/test, HLP và avoidable bias |
| 3.2 Error analysis | DPL3-05–DPL3-10 | Error analysis, label, training-dev, transfer/multitask/end-to-end |
| 4.1 CNN | DPL4-01–DPL4-05 | Phép conv, shape/tham số, pooling và luồng ConvNet |
| 4.2 Case studies | DPL4-06–DPL4-09 | Ý tưởng chính của các kiến trúc; chưa học thuộc sơ đồ từng tầng |
| 4.3 Detection | DPL4-10–DPL4-14 | Đầu ra, sliding window, YOLO, IoU/NMS, U-Net |
| 4.4 Face recognition | DPL4-15–DPL4-18 | Verification/recognition, Siamese/triplet, style, conv1D/3D |
| 5.1 RNN | DPL5-01–DPL5-06 | Chuỗi, RNN/BPTT, LSTM/GRU, sinh chuỗi |
| 5.2 NLP/embeddings | DPL5-07–DPL5-10 | Embedding/cosine, Word2Vec, negative sampling/GloVe |
| 5.3 Seq2Seq/attention | DPL5-11–DPL5-14 | Seq2Seq, decoding, đánh giá, attention và âm thanh ở mức nhập môn |
| 5.4 Transformer | DPL5-15–DPL5-18 | QKV, multi-head, positions/mask, cấu trúc và pretrained models |

Đây là bao phủ **nhập môn theo các chủ đề chính** của cả 17 bài. Bộ này không thay phần thực hành lập trình, mọi chứng minh toán học, chi tiết từng kiến trúc hoặc rubric kiểm tra của thầy.

## Dành cho cập nhật website sau

- [Manifest nội dung](manifest.json): file, ID, số câu, mức ưu tiên và bài nguồn.
- [Hướng dẫn Antigravity nhập bộ bổ sung](../Trien-khai-web/CAP-NHAT-NOI-DUNG-DPL302m.md).
- [Đối chiếu ban đầu và ghi chú sau cập nhật](../DOI-CHIEU-DL-VOI-DPL302m.md).

Bộ 140 câu cũ được giữ nguyên. Khi nhập thêm 72 câu, tổng số ID là 212. Website nên tách “Nền tảng chung” và “DPL302m theo môn học”, giữ tiến độ gắn với ID cũ.
