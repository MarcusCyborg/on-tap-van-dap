# 01: Xác suất thống kê

**Ưu tiên tối nay: XS1–XS4.** Xác suất mô tả mức độ có thể xảy ra của một sự kiện trong một mô hình; thống kê dùng dữ liệu để mô tả và suy luận về đối tượng ta quan tâm.

## XS1. Trung bình, trung vị và phương sai là gì?

- **Trung bình (mean):** cộng các giá trị rồi chia số lượng.
- **Trung vị (median):** giá trị giữa sau khi sắp xếp; nếu có số lượng chẵn thì lấy trung bình hai giá trị giữa.
- **Phương sai (variance):** đo độ phân tán bằng trung bình bình phương khoảng cách đến trung bình, với công thức tùy đang mô tả tổng thể hay ước lượng từ mẫu.
- **Độ lệch chuẩn (standard deviation):** căn bậc hai của phương sai; có cùng đơn vị với dữ liệu.

**Ví dụ:** dữ liệu [1, 2, 3, 4, 100] có trung bình 22 nhưng trung vị 3. Giá trị 100 là một điểm cực đoan, thường gọi là ngoại lệ (outlier); nó kéo trung bình lên rất mạnh.

Với [1, 2, 3], trung bình là 2. Nếu xem đây là toàn bộ tổng thể, phương sai là `((1−2)² + (2−2)² + (3−2)²) / 3 = 2/3`. Phương sai mẫu thường dùng để ước lượng phương sai tổng thể chia cho `n−1`, nên trong ví dụ đó bằng 1. Tối nay cần hiểu ý nghĩa trước khi nhớ công thức.

**Mẫu trả lời:** “Trung bình và trung vị mô tả vị trí trung tâm của dữ liệu. Trung bình nhạy với giá trị cực đoan hơn trung vị. Phương sai và độ lệch chuẩn mô tả mức độ phân tán; hai nhóm có cùng trung bình vẫn có thể phân tán khác nhau.”

**Hỏi tiếp:** Vì sao khi mô tả thu nhập có thể dùng trung vị? Vì một số người thu nhập rất cao có thể kéo trung bình lên, trong khi trung vị ít bị ảnh hưởng hơn.

**Tự nói:** Giải thích sự khác nhau giữa [5, 5, 5] và [0, 5, 10] dù cả hai có trung bình 5.

## XS2. Xác suất có điều kiện và độc lập là gì?

Một **biến cố** là sự kiện đang xét, ví dụ “lần tung xúc xắc ra số chẵn”. Xác suất nằm trong [0, 1].

`P(A | B)` là xác suất A xảy ra **khi đã biết B xảy ra**. Khi `P(B) > 0`:

`P(A | B) = P(A ∩ B) / P(B)`

Ký hiệu `A ∩ B` nghĩa là A và B cùng xảy ra.

**Ví dụ:** tung một xúc xắc công bằng, biết số ra lớn hơn 3. Khi đó chỉ còn {4, 5, 6}; xác suất ra số chẵn là 2/3, khác xác suất ban đầu 1/2.

Hai biến cố **độc lập** nếu biết biến cố này không làm thay đổi xác suất biến cố kia. Khi xác suất điều kiện xác định, `P(A | B) = P(A)`; dạng tổng quát là `P(A ∩ B) = P(A)P(B)`.

**Mẫu trả lời:** “Xác suất có điều kiện là xác suất sau khi đã biết thêm một sự kiện. Hai sự kiện độc lập khi thông tin về một sự kiện không thay đổi xác suất sự kiện còn lại. Ví dụ hai lần tung đồng xu độc lập: kết quả lần đầu không thay đổi xác suất lần sau.”

**Dễ nhầm:** độc lập không phải xung khắc. Xung khắc là không thể cùng xảy ra. Hai biến cố xung khắc đều có xác suất dương thì không độc lập.

**Tự nói:** Ra số 1 và ra số 2 trong cùng một lần tung xúc xắc là độc lập hay xung khắc? → Xung khắc, không độc lập.

## XS3. Định lý Bayes dùng để làm gì?

Bayes liên hệ hai xác suất có điều kiện theo hai chiều:

`P(A | B) = P(B | A) × P(A) / P(B)`, khi `P(B) > 0`.

Ta dùng nó để cập nhật xác suất của giả thuyết A sau khi quan sát bằng chứng B. `P(A)` là xác suất trước khi có bằng chứng; `P(A | B)` là xác suất sau khi có bằng chứng.

**Ví dụ giả định:** trong 1.000 người, 10 người mắc một bệnh. Xét nghiệm tìm đúng 9 người mắc bệnh nhưng cũng báo dương tính nhầm 99 người khỏe. Trong 108 người dương tính, chỉ 9 người thực sự mắc bệnh: xác suất mắc bệnh khi dương tính là `9/108 ≈ 8,3%`.

Ví dụ này chỉ để học xác suất. Ý chính: “dương tính khi có bệnh” và “có bệnh khi dương tính” là hai xác suất khác nhau; cần xét cả mức phổ biến của bệnh và dương tính giả.

**Mẫu trả lời:** “Bayes giúp cập nhật xác suất một giả thuyết khi có bằng chứng mới. Nó kết hợp xác suất ban đầu với khả năng quan sát bằng chứng nếu giả thuyết đúng. Vì vậy em không thể coi P(A khi B) bằng P(B khi A).”

**Hỏi tiếp:** Chỉ biết xét nghiệm phát hiện được 90% người bệnh có đủ tính xác suất mắc bệnh khi dương tính không? → Chưa; cần thêm thông tin như tỷ lệ mắc bệnh và tỷ lệ dương tính giả.

## XS4. Tổng thể, mẫu và tương quan khác nhân quả thế nào?

**Tổng thể (population)** là toàn bộ nhóm muốn tìm hiểu. **Mẫu (sample)** là phần ta thu thập được. Ví dụ muốn biết chiều cao sinh viên trường thì tổng thể là sinh viên toàn trường; 100 sinh viên được đo là mẫu.

Thống kê trên mẫu có thể dùng để ước lượng đặc trưng tổng thể, nhưng kết quả phụ thuộc cách lấy mẫu. Chỉ đo đội bóng rổ có thể làm ước lượng chiều cao bị lệch. Mẫu lớn vẫn có thể lệch nếu cách lấy mẫu thiên lệch.

**Tương quan** là hai đại lượng có xu hướng biến đổi cùng nhau. **Nhân quả** là thay đổi một yếu tố gây thay đổi yếu tố kia. Thấy tương quan chưa đủ để kết luận nhân quả.

**Ví dụ:** doanh số kem và số người đi bơi cùng tăng trong mùa nóng. Không thể từ đó kết luận ăn kem làm người ta đi bơi; thời tiết nóng có thể ảnh hưởng cả hai.

**Mẫu trả lời:** “Mẫu là một phần của tổng thể được dùng để mô tả hoặc suy luận về tổng thể. Cần chú ý tính đại diện và cách lấy mẫu. Tương quan trong dữ liệu chưa chứng minh quan hệ nhân quả vì có thể tồn tại yếu tố thứ ba hoặc nguyên nhân khác.”

**Tự nói:** Khảo sát chỉ bạn bè của mình để kết luận toàn trường thích môn nào có hạn chế gì?

## Chỉ đọc nếu còn thời gian

- **Biến ngẫu nhiên:** gán một giá trị số cho kết quả ngẫu nhiên, ví dụ số mặt ngửa sau 3 lần tung đồng xu.
- **Kỳ vọng:** trung bình có trọng số theo xác suất. Biến rời rạc: `E[X] = Σ xP(X=x)`. Xúc xắc công bằng có kỳ vọng 3,5 dù không thể tung ra mặt 3,5.
- **Phân phối chuẩn:** phân phối liên tục có đồ thị hình chuông đối xứng; được xác định bởi trung bình và phương sai. Không phải dữ liệu nào cũng có phân phối chuẩn.
- **P-value:** dưới giả thuyết không H0 và các giả định của phép kiểm định, là xác suất thu được thống kê kiểm định ít nhất cũng cực đoan như quan sát. Nó không phải xác suất H0 đúng. P-value nhỏ là bằng chứng chống H0, không tự cho biết tác động lớn hay quan trọng.
