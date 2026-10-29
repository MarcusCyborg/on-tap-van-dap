# Xác suất thống kê: hiểu concept và tập vấn đáp từ số 0

Tài liệu gồm **35 câu: 18 câu [A], 12 câu [B], 5 câu [C]**. Đây là bản đồ kiến thức nhập môn để học và tra cứu, không phải dự đoán đề của thầy.

- **[A] Học trước:** hiểu ý nghĩa, tự kể ví dụ và trả lời được câu hỏi chính.
- **[B] Học tiếp:** kết nối các khái niệm và xử lý câu hỏi đào sâu.
- **[C] Nhận diện:** biết đang nói về vấn đề gì; chưa cần chứng minh hoặc thuộc công thức chi tiết tối nay.

## Bản đồ concept

**Có dữ liệu → mô tả dữ liệu → nhận ra dữ liệu chỉ là một mẫu → dùng xác suất mô tả sự ngẫu nhiên → ước lượng tổng thể → kiểm định nhận định.**

Ví dụ xuyên suốt: muốn biết chiều cao trung bình sinh viên một trường. Ta không đo được mọi người nên lấy mẫu. Trung bình mẫu là một con số quan sát được, nhưng mẫu khác có thể cho kết quả khác. Xác suất giúp mô tả độ bất định đó; khoảng tin cậy và kiểm định giúp đưa ra kết luận có điều kiện.

Đường đọc tối nay: **XS01 → XS02 → XS03 → XS05 → XS06 → XS09 → XS11 → XS12 → XS13 → XS14 → XS16 → XS18 → XS19 → XS22 → XS23 → XS24 → XS26 → XS27**. Sau đó bổ sung XS31 về tương quan và nhân quả nếu còn thời gian.

Mỗi câu: đọc giải thích → tự làm ví dụ → che tài liệu và nói mẫu trả lời bằng lời của mình → trả lời câu nối tiếp. Không cần thuộc nguyên văn. Ký hiệu `Σ` nghĩa là cộng tất cả các số hạng; `√` là căn bậc hai; `∩` là “và”, `∪` là “hoặc”.

## Cụm 1: Nhìn dữ liệu trước khi tính

### XS01 [A] Xác suất và thống kê khác nhau thế nào?

**Hiểu:** Xác suất bắt đầu từ một mô hình rồi hỏi những kết quả nào có thể xảy ra. Thống kê bắt đầu từ dữ liệu quan sát để mô tả hoặc suy luận về mô hình/tổng thể. Hai lĩnh vực hỗ trợ nhau.

**Ví dụ:** nếu đồng xu công bằng, xác suất ngửa là 1/2: đó là bài xác suất. Tung một đồng xu chưa biết có công bằng không 100 lần, thấy 70 lần ngửa rồi đánh giá giả thuyết công bằng: đó là thống kê. Chỉ thấy 70 lần ngửa chưa đồng nghĩa đã chứng minh đồng xu gian lận.

**Trả lời miệng:** “Xác suất đi từ giả định mô hình đến khả năng xuất hiện dữ liệu. Thống kê dùng dữ liệu để mô tả hoặc suy luận về tổng thể. Ví dụ dự đoán số lần ngửa của đồng xu công bằng là xác suất; dùng kết quả tung để đánh giá đồng xu có công bằng không là thống kê.”

**Nối tiếp:** Thống kê mô tả và suy luận? → Mô tả tóm tắt dữ liệu đã có; suy luận dùng mẫu để kết luận về tổng thể kèm bất định.

### XS02 [A] Dữ liệu định tính và định lượng là gì?

**Hiểu:** Dữ liệu định tính biểu thị nhóm hoặc tính chất: màu sắc, ngành học. Dữ liệu định lượng biểu thị lượng: chiều cao, số người. Định lượng rời rạc thường là số đếm; liên tục là phép đo có thể nhận các giá trị trong một khoảng theo mô hình.

**Ví dụ:** mã sinh viên “1001” có dạng số nhưng là định danh; lấy trung bình các mã không có ý nghĩa. Mức hài lòng “thấp, vừa, cao” có thứ tự, nhưng khoảng cách giữa các mức không tự động bằng nhau.

**Trả lời miệng:** “Em phân biệt theo ý nghĩa dữ liệu, không theo cách nó được lưu. Định tính mô tả loại hoặc nhóm, còn định lượng mô tả số lượng. Số sinh viên là rời rạc; chiều cao thường được mô hình hóa liên tục dù dụng cụ chỉ đo tới một độ chính xác nhất định.”

**Nối tiếp:** Nhãn 0/1 có thể là gì? → Mã hóa hai lớp; trung bình của chỉ báo 0/1 cũng có ý nghĩa là tỷ lệ thuộc lớp 1.

### XS03 [A] Tổng thể, mẫu, tham số và thống kê là gì?

**Hiểu:** Tổng thể là toàn bộ nhóm muốn nghiên cứu; mẫu là phần được quan sát. **Tham số** mô tả tổng thể, thường chưa biết. **Thống kê mẫu** được tính từ mẫu để mô tả mẫu hoặc ước lượng tham số.

**Ví dụ:** muốn biết chiều cao trung bình 10.000 sinh viên nhưng chỉ đo 100 người. Trung bình thật của 10.000 người là tham số `μ`; trung bình 100 người đo được là `x̄`. Nếu lấy 100 người khác, `x̄` có thể đổi.

**Trả lời miệng:** “Tổng thể là nhóm em muốn kết luận, mẫu là nhóm thực sự thu thập dữ liệu. Tham số thuộc tổng thể, còn thống kê được tính từ mẫu. Em dùng trung bình mẫu để ước lượng trung bình tổng thể, nhưng cần thừa nhận sai số do lấy mẫu.”

**Nối tiếp:** Mẫu 100 người có luôn nhỏ hơn tổng thể không? → Không bắt buộc; nếu đo toàn bộ đối tượng thì là điều tra toàn bộ, nhưng có thể vẫn còn sai số đo lường.

### XS04 [B] Vì sao mẫu lớn vẫn có thể cho kết luận sai?

**Hiểu:** Có **sai số ngẫu nhiên** do tình cờ chọn người này thay vì người kia, và **thiên lệch** do cách thu thập khiến một nhóm bị đại diện quá nhiều hoặc quá ít. Tăng cỡ mẫu thường giảm phần ngẫu nhiên dưới giả định phù hợp, không tự sửa thiên lệch.

**Ví dụ:** khảo sát 5.000 thành viên câu lạc bộ bóng rổ để ước lượng chiều cao sinh viên toàn trường có thể lệch hơn mẫu ngẫu nhiên 200 người.

**Trả lời miệng:** “Chất lượng mẫu phụ thuộc cách lấy mẫu và đo lường, không chỉ số lượng. Mẫu lớn nhưng thiên lệch có thể cho kết quả rất ổn định quanh một giá trị sai. Em cần xem tổng thể mục tiêu, người bị bỏ sót và cơ chế chọn mẫu.”

**Nối tiếp:** Một cách cải thiện? → Lấy mẫu ngẫu nhiên phù hợp; có thể phân tầng theo các nhóm quan trọng rồi chọn ngẫu nhiên trong từng nhóm. Không bảo đảm hoàn hảo nếu có không phản hồi hoặc đo sai.

### XS05 [A] Mean, median, mode khác nhau thế nào?

**Hiểu:** Mean là tổng chia số lượng; median là vị trí giữa sau sắp xếp, nếu chẵn thì trung bình hai giá trị giữa; mode là giá trị xuất hiện nhiều nhất, có thể có nhiều mode.

**Ví dụ:** [1, 2, 2, 3, 12] có mean 4, median 2, mode 2. Điểm 12 kéo mean lên, nhưng không kéo median tương tự. Median thường hữu ích khi dữ liệu lệch hoặc có giá trị cực đoan; mean vẫn hữu ích khi quan tâm tổng lượng trên đầu người.

**Trả lời miệng:** “Cả ba mô tả trung tâm theo cách khác nhau. Mean dùng mọi giá trị nên nhạy với ngoại lệ. Median dựa vào thứ tự nên bền vững hơn trước một số giá trị rất lớn hoặc rất nhỏ. Mode là giá trị phổ biến nhất và cũng dùng được cho dữ liệu phân loại.”

**Nối tiếp:** Trung vị luôn là một điểm có trong dữ liệu? → Không. Với [1, 4], median là 2,5.

### XS06 [A] Phương sai và độ lệch chuẩn đo điều gì?

**Hiểu:** Cả hai đo độ phân tán quanh trung bình. Phương sai lấy bình phương độ lệch để số âm/dương không triệt tiêu. Độ lệch chuẩn là căn phương sai, nên trở lại đơn vị ban đầu.

**Ví dụ:** [5, 5, 5] và [0, 5, 10] cùng mean 5, nhưng nhóm sau phân tán hơn. Nếu coi mỗi nhóm là toàn bộ tổng thể, phương sai nhóm đầu là 0; nhóm sau là `(25+0+25)/3 = 50/3`.

**Trả lời miệng:** “Trung bình chưa mô tả hết dữ liệu; em cần biết các điểm cách trung bình bao xa. Phương sai là độ lệch bình phương trung bình theo công thức tương ứng. Độ lệch chuẩn là căn phương sai và cùng đơn vị dữ liệu, nên dễ diễn giải hơn.”

**Nối tiếp:** Nếu chiều cao tính bằng cm thì đơn vị phương sai? → cm²; độ lệch chuẩn là cm. Độ lệch chuẩn không phải độ lệch tuyệt đối trung bình.

### XS07 [B] Quantile, IQR và outlier là gì?

**Hiểu:** Quantile chia dữ liệu theo tỷ lệ. Median là phân vị 50%; Q1 và Q3 tương ứng khoảng 25% và 75%. `IQR = Q3−Q1` mô tả độ rộng của phần giữa 50% dữ liệu.

**Ví dụ:** nếu Q1 = 10, Q3 = 20 thì IQR = 10. Quy tắc boxplot thường đánh dấu điểm dưới `10−1,5×10 = −5` hoặc trên `20+1,5×10 = 35` là ngoại lệ tiềm năng.

**Trả lời miệng:** “Phân vị mô tả vị trí theo tỷ lệ trong dữ liệu đã sắp xếp. IQR đo khoảng giữa hai tứ phân vị và ít bị điểm cực đoan chi phối hơn khoảng min–max. Outlier là điểm bất thường so với phần còn lại, cần kiểm tra bối cảnh trước khi xử lý.”

**Nối tiếp:** Có nên xóa mọi outlier? → Không; có thể là nhập sai hoặc một hiện tượng thật quan trọng. Các phần mềm cũng có quy ước tính phân vị hơi khác nhau.

### XS08 [B] Vì sao phương sai mẫu thường chia n−1?

**Hiểu:** Khi chưa biết trung bình tổng thể, ta dùng trung bình mẫu. Các độ lệch quanh trung bình mẫu cộng lại bằng 0, nên sau khi biết n−1 độ lệch thì độ lệch cuối đã bị xác định. Đây là một cách hiểu **bậc tự do**.

Với mẫu độc lập cùng phân phối, phương sai hữu hạn, `s² = Σ(xᵢ−x̄)²/(n−1)` là ước lượng không chệch của phương sai tổng thể, khi n > 1.

**Ví dụ:** [1, 2, 3] có tổng bình phương độ lệch là 2. Chia n cho 2/3 khi mô tả chính ba điểm; chia n−1 cho 1 khi dùng công thức ước lượng nói trên.

**Trả lời miệng:** “Chia n−1 là hiệu chỉnh khi ước lượng phương sai tổng thể bằng trung bình mẫu. Không phải mọi bài tính phương sai đều chia n−1; cần biết đang mô tả toàn bộ dữ liệu hay ước lượng từ mẫu.”

**Bẫy:** Căn của phương sai mẫu không chệch không tự động là ước lượng không chệch của độ lệch chuẩn.

## Cụm 2: Xác suất và thông tin mới

### XS09 [A] Biến cố, phần bù, giao và hợp là gì?

**Hiểu:** Không gian mẫu gồm các kết quả có thể xảy ra. Biến cố là tập kết quả thỏa điều kiện. Phần bù `Aᶜ` là A không xảy ra; giao `A∩B` là cả hai; hợp `A∪B` là ít nhất một xảy ra.

**Ví dụ:** xúc xắc công bằng, A = {2, 4, 6}, B = {4, 5, 6}. Giao = {4, 6}, hợp = {2, 4, 5, 6}. `P(A∪B)=1/2+1/2−1/3=2/3`. Phải trừ giao vì đã đếm hai lần.

**Trả lời miệng:** “Một biến cố là sự kiện quan tâm. Xác suất phần bù bằng 1 trừ xác suất biến cố. Với hợp hai biến cố, em cộng hai xác suất rồi trừ phần giao, vì các kết quả thuộc cả hai không được đếm hai lần.”

**Nối tiếp:** Xác suất bằng số kết quả thuận lợi chia tổng số kết quả luôn đúng? → Chỉ dùng trực tiếp cách đếm đó khi các kết quả cơ bản đồng khả năng.

### XS10 [C] Hoán vị và tổ hợp khác nhau thế nào?

**Hiểu:** Nếu thứ tự quan trọng, cần đếm theo thứ tự; nếu chỉ chọn nhóm, dùng tổ hợp. Chọn k phần tử khác nhau từ n phần tử, không xét thứ tự, có `C(n,k)=n!/[k!(n−k)!]` cách. Giai thừa `n! = 1×2×…×n`, với `0!=1`.

**Ví dụ:** chọn 2 bạn từ 4 bạn có `C(4,2)=6` nhóm. Chọn một lớp trưởng rồi một lớp phó từ 4 bạn có `4×3=12` cách vì đổi chức vụ tạo kết quả khác.

**Trả lời miệng:** “Em xác định thứ tự có làm thay đổi kết quả không. Chọn một nhóm thường không xét thứ tự; phân vai hoặc xếp hàng thì có. Em cũng phải kiểm tra có được chọn lặp và có hoàn lại hay không.”

**Nối tiếp:** Xác suất chọn đúng một cặp cụ thể trong 4 người? → 1/6 nếu chọn đều giữa sáu cặp.

### XS11 [A] Xác suất có điều kiện nghĩa là gì?

**Hiểu:** `P(A|B)` là xác suất A khi biết B đã xảy ra. Ta thu hẹp sự quan tâm vào B: `P(A|B)=P(A∩B)/P(B)`, với `P(B)>0`.

**Ví dụ:** xúc xắc công bằng, biết kết quả lớn hơn 3, chỉ còn {4, 5, 6}; khả năng chẵn là 2/3. Trước khi có thông tin, khả năng chẵn là 1/2.

**Trả lời miệng:** “Xác suất có điều kiện phản ánh thông tin đã biết. Biết B nghĩa là em xét những trường hợp B xảy ra, rồi tính trong số đó bao nhiêu trường hợp có A. Vì thế xác suất sau khi biết B có thể khác xác suất ban đầu.”

**Nối tiếp:** `P(A|B)` có bằng `P(B|A)` không? → Nói chung không. Trong ví dụ này, xác suất lớn hơn 3 khi biết chẵn cũng là 2/3 chỉ là trùng hợp; không phải quy tắc.

### XS12 [A] Độc lập khác xung khắc thế nào?

**Hiểu:** Độc lập nghĩa là sự xuất hiện của biến cố này không thay đổi xác suất biến cố kia: `P(A∩B)=P(A)P(B)`. Xung khắc nghĩa là không thể cùng xảy ra: `A∩B` rỗng.

**Ví dụ:** ngửa ở lần tung thứ nhất và ngửa ở lần tung thứ hai có thể độc lập theo mô hình các lần tung độc lập. Ra 1 và ra 2 trong cùng một lần tung xúc xắc là xung khắc, không độc lập: biết ra 1 thì khả năng ra 2 bằng 0.

**Trả lời miệng:** “Độc lập nói về việc thông tin có làm đổi xác suất không; xung khắc nói về khả năng cùng xảy ra. Hai biến cố xung khắc có xác suất dương không độc lập, vì biết một biến cố xảy ra sẽ loại trừ biến cố còn lại.”

**Nối tiếp:** Rút hai lá bài không hoàn lại thường độc lập không? → Không; lá đầu làm thay đổi thành phần bộ bài còn lại.

### XS13 [A] Bayes dùng làm gì, và vì sao phải nhớ tỷ lệ nền?

**Hiểu:** Bayes đảo chiều điều kiện: `P(A|B)=P(B|A)P(A)/P(B)`, khi `P(B)>0`. Nó cập nhật xác suất giả thuyết A sau khi thấy bằng chứng B. `P(A)` là xác suất trước, `P(A|B)` là xác suất sau.

**Ví dụ giả định:** 1.000 người có 10 người mắc bệnh. Xét nghiệm báo dương tính đúng 9 người bệnh, nhưng báo nhầm 99 người khỏe. Trong 108 người dương tính, chỉ 9 người bệnh: `9/108≈8,3%`. Khả năng phát hiện 90% người bệnh không đồng nghĩa dương tính thì có 90% khả năng bệnh.

**Trả lời miệng:** “Bayes kết hợp xác suất ban đầu với bằng chứng mới. Khi đảo chiều điều kiện, em phải tính cả tỷ lệ nền và báo nhầm. Một sự kiện rất hiếm có thể vẫn ít khả năng dù bằng chứng nghe có vẻ mạnh.”

**Nối tiếp:** Chỉ biết độ nhạy 90% có tính được xác suất bệnh khi dương tính? → Chưa đủ thông tin.

## Cụm 3: Biến ngẫu nhiên và phân phối

### XS14 [A] Biến ngẫu nhiên và phân phối là gì?

**Hiểu:** Biến ngẫu nhiên gán một số cho kết quả ngẫu nhiên. Phân phối mô tả xác suất của các giá trị hoặc khoảng giá trị đó. Rời rạc nhận các giá trị đếm được; liên tục được mô tả bằng mật độ trong mô hình đang xét.

**Ví dụ:** tung hai đồng xu, X là số mặt ngửa. X nhận 0, 1, 2 với xác suất lần lượt 1/4, 1/2, 1/4 nếu các xu công bằng và độc lập. Các chuỗi ngửa–sấp và sấp–ngửa khác nhau nhưng đều cho X = 1.

**Trả lời miệng:** “Biến ngẫu nhiên biến kết quả của thí nghiệm thành một giá trị số; phân phối cho biết các giá trị đó xuất hiện với khả năng nào. Em phân biệt kết quả gốc của thí nghiệm với số được biến ngẫu nhiên gán cho kết quả.”

**Nối tiếp:** Thời gian chờ xe buýt là loại nào? → Thường mô hình hóa liên tục; số xe đi qua là rời rạc.

### XS15 [B] PMF, PDF và CDF khác nhau thế nào?

**Hiểu:** PMF cho xác suất từng giá trị rời rạc: `p(x)=P(X=x)`. PDF là mật độ của biến liên tục; xác suất trên khoảng là diện tích dưới đường mật độ. CDF là hàm tích lũy `F(x)=P(X≤x)`, dùng được cho cả hai.

**Ví dụ:** X phân bố đều trên [0, 0,5] có mật độ 2 trong khoảng. Mật độ lớn hơn 1 vẫn hợp lệ vì diện tích toàn bộ bằng `2×0,5=1`. Xác suất X trong [0,1; 0,2] là `2×0,1=0,2`.

**Trả lời miệng:** “Với biến rời rạc, PMF là xác suất tại từng điểm. Với biến liên tục, PDF là mật độ, không phải xác suất tại một điểm. CDF luôn là xác suất không vượt quá một ngưỡng.”

**Nối tiếp:** Với phân phối liên tục có mật độ, `P(X=x)` bằng bao nhiêu? → 0 tại từng điểm, nhưng xác suất của một khoảng có thể dương.

### XS16 [A] Kỳ vọng là gì? Có nhất thiết xảy ra được không?

**Hiểu:** Kỳ vọng là trung bình có trọng số theo xác suất: `E[X]=ΣxP(X=x)` cho biến rời rạc có kỳ vọng tồn tại. Nó là đặc trưng phân phối, không phải cam kết kết quả lần tới.

**Ví dụ:** xúc xắc công bằng có kỳ vọng `(1+2+3+4+5+6)/6=3,5`, dù không có mặt 3,5. Trò chơi nhận 10 điểm với xác suất 0,2 và 0 điểm với xác suất 0,8 có kỳ vọng 2 điểm mỗi lượt.

**Trả lời miệng:** “Kỳ vọng là giá trị trung bình theo phân phối. Một kết quả càng có xác suất lớn thì đóng góp càng nhiều. Kỳ vọng không cần là giá trị có thể quan sát trong một lần thử; nó có ý nghĩa trung bình dài hạn dưới các giả định phù hợp.”

**Nối tiếp:** `E[X+Y]=E[X]+E[Y]` có cần độc lập không? → Không, khi các kỳ vọng liên quan tồn tại.

### XS17 [B] Phương sai biến ngẫu nhiên có những quy tắc nào?

**Hiểu:** `Var(X)=E[(X−E[X])²]=E[X²]−(E[X])²`, khi moment bậc hai hữu hạn. Nếu cộng hằng số b, độ phân tán không đổi. Nhân mọi giá trị với a làm phương sai nhân `a²`.

**Ví dụ:** `Var(2X+3)=4Var(X)`. Hai lần tung đồng xu độc lập, mỗi biến chỉ báo ngửa có phương sai 1/4; tổng số ngửa có phương sai 1/2.

**Trả lời miệng:** “Phương sai đo độ phân tán của phân phối quanh kỳ vọng. Dịch chuyển mọi giá trị không làm đổi phương sai; co giãn dữ liệu làm phương sai đổi theo bình phương hệ số. Khi cộng hai biến độc lập có phương sai hữu hạn, phương sai tổng bằng tổng phương sai.”

**Nối tiếp:** Nếu không độc lập? → `Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y)`. Không được tự bỏ hiệp phương sai; độc lập là điều kiện đủ, hiệp phương sai bằng 0 cũng đủ cho công thức cộng.

### XS18 [A] Bernoulli và nhị thức mô tả điều gì?

**Hiểu:** Bernoulli mô tả một thử nghiệm có hai kết quả, mã hóa thành công = 1 với xác suất p, thất bại = 0. Nhị thức đếm số thành công trong n thử nghiệm Bernoulli độc lập, cùng xác suất p.

**Ví dụ:** X là số ngửa trong 3 lần tung xu công bằng độc lập. `P(X=2)=C(3,2)(1/2)²(1/2)=3/8`. Có ba vị trí cho lần sấp. Nhị thức có `E[X]=np`, `Var(X)=np(1−p)`.

**Trả lời miệng:** “Bernoulli dùng cho một lần có hai kết quả, nhị thức dùng cho số lần thành công trong n lần thử. Em cần kiểm tra số lần thử cố định, các lần độc lập và xác suất thành công không đổi trước khi dùng mô hình nhị thức.”

**Nối tiếp:** Rút nhiều lá bài không hoàn lại có phải nhị thức chính xác không? → Thường không, vì xác suất thay đổi và các lượt phụ thuộc.

### XS19 [A] Phân phối chuẩn là gì?

**Hiểu:** Phân phối chuẩn là phân phối liên tục hình chuông đối xứng, xác định bởi trung bình μ và phương sai σ². Với σ > 0, mean = median = mode = μ. Chuẩn tắc có μ = 0 và σ = 1.

**Ví dụ:** nếu X thật sự có phân phối chuẩn, khoảng μ±σ chứa khoảng 68% xác suất; μ±2σ khoảng 95%; μ±3σ khoảng 99,7%. Đây là tính chất của phân phối chuẩn, không phải quy tắc áp cho mọi dữ liệu.

**Trả lời miệng:** “Phân phối chuẩn được xác định bởi vị trí trung tâm và độ phân tán, có hình chuông đối xứng. Nó quan trọng vì xuất hiện trong nhiều mô hình và kết quả xấp xỉ. Tuy vậy em không được mặc định mọi biến, chẳng hạn thu nhập, đều phân phối chuẩn.”

**Nối tiếp:** Đồ thị đối xứng có đủ chứng minh là chuẩn? → Không; nhiều phân phối khác cũng đối xứng.

### XS20 [B] Z-score và chuẩn hóa có biến dữ liệu thành chuẩn không?

**Hiểu:** `z=(x−μ)/σ` đo một điểm cách trung bình bao nhiêu độ lệch chuẩn, khi σ > 0. Trong dữ liệu mẫu có thể dùng x̄ và s để chuẩn hóa theo mẫu. Phép biến đổi này thay đổi vị trí và thang đo, không tự thay hình dạng phân phối thành hình chuông.

**Ví dụ:** điểm 80 trong nhóm mean 60, SD 10 có z = 2. Điểm này cao hơn trung bình hai độ lệch chuẩn. Chỉ nếu có mô hình phân phối phù hợp mới chuyển z thành xác suất theo bảng chuẩn.

**Trả lời miệng:** “Z-score giúp so vị trí tương đối trên những thang đo khác nhau. Chuẩn hóa đưa dữ liệu về thang trung bình 0, độ lệch chuẩn 1 theo các giá trị dùng để chuẩn hóa, nhưng dữ liệu lệch vẫn có thể lệch. Standardization không đồng nghĩa biến thành phân phối chuẩn.”

**Nối tiếp:** Nếu mọi điểm bằng nhau? → SD = 0, công thức chia cho 0 nên không dùng trực tiếp được.

### XS21 [B] Luật số lớn khác định lý giới hạn trung tâm thế nào?

**Hiểu:** Với điều kiện phù hợp, **luật số lớn** nói trung bình mẫu tiến gần kỳ vọng khi cỡ mẫu tăng. **Định lý giới hạn trung tâm** nói về hình dạng phân phối của trung bình/tổng đã chuẩn hóa: thường tiến gần chuẩn.

**Ví dụ:** tung xu nhiều lần, tỷ lệ ngửa ổn định gần 1/2 là trực giác luật số lớn. Nếu lặp việc lấy nhiều mẫu cùng cỡ n và vẽ phân phối các trung bình mẫu, dạng gần chuông khi n đủ lớn là trực giác CLT.

**Trả lời miệng:** “Luật số lớn nói trung bình hội tụ về đâu; CLT nói sai số trung bình sau chuẩn hóa có phân phối giới hạn gì. CLT không nói dữ liệu gốc biến thành chuẩn. Dạng cơ bản áp cho quan sát độc lập cùng phân phối, phương sai hữu hạn.”

**Nối tiếp:** n ≥ 30 luôn đủ? → Không; mức lệch, đuôi phân phối và cấu trúc phụ thuộc ảnh hưởng chất lượng xấp xỉ.

## Cụm 4: Ước lượng và độ bất định

### XS22 [A] Ước lượng điểm là gì? Không chệch nghĩa là gì?

**Hiểu:** Ước lượng điểm dùng một con số để ước lượng tham số, như x̄ ước lượng μ. **Estimator** là quy tắc tính từ mẫu; **estimate** là kết quả cụ thể. Không chệch nghĩa là kỳ vọng của estimator bằng tham số, qua quá trình lấy mẫu lặp lại.

**Ví dụ:** mẫu chiều cao có mean 168 cm thì 168 là một ước lượng điểm. Với lấy mẫu độc lập cùng phân phối và kỳ vọng hữu hạn, x̄ không chệch cho μ; nhưng mẫu lần này vẫn có thể lệch khỏi μ.

**Trả lời miệng:** “Ước lượng điểm cung cấp một giá trị đại diện cho tham số chưa biết. Không chệch là tính chất trung bình qua nhiều mẫu, không phải lời hứa lần nào cũng đúng. Em còn cần quan tâm độ biến động của ước lượng và cách thu thập dữ liệu.”

**Nối tiếp:** Không chệch có tự động tốt nhất? → Không; một estimator không chệch vẫn có phương sai lớn. Chất lượng còn phụ thuộc mục tiêu đánh giá.

### XS23 [A] Standard deviation và standard error khác nhau thế nào?

**Hiểu:** SD mô tả độ phân tán của các quan sát. SE mô tả độ biến động của một estimator qua các mẫu lặp lại. Với n quan sát độc lập cùng phân phối, phương sai hữu hạn, `SE(x̄)=σ/√n`; thường ước lượng bằng `s/√n`.

**Ví dụ:** chiều cao mẫu có s = 10 cm, n = 100. SD của chiều cao là 10 cm, còn SE ước lượng của trung bình là 1 cm. Trung bình 100 người ổn định hơn chiều cao một người ngẫu nhiên.

**Trả lời miệng:** “SD nói các điểm dữ liệu khác nhau bao nhiêu; SE nói ước lượng của em sẽ dao động bao nhiêu nếu lấy mẫu lại. Với trung bình mẫu độc lập, SE giảm theo căn cỡ mẫu. Tăng n không bắt buộc làm SD của dữ liệu nhỏ đi.”

**Nối tiếp:** Tăng n gấp 4 thì SE thế nào? → Giảm khoảng một nửa nếu độ phân tán và các giả định khác giữ nguyên.

### XS24 [A] Khoảng tin cậy 95% phải hiểu thế nào?

**Hiểu:** Khoảng tin cậy được tạo bằng một thủ tục mà, dưới các giả định của phương pháp, khoảng 95% các khoảng tạo ra qua lấy mẫu lặp lại sẽ chứa tham số thật.

**Ví dụ:** mẫu lớn phù hợp có x̄ = 50, SE ước lượng = 2. Khoảng xấp xỉ chuẩn 95% là `50±1,96×2`, tức [46,08; 53,92]. Khi σ chưa biết và mẫu nhỏ từ phân phối chuẩn, thường dùng phân phối t với n−1 bậc tự do, không máy móc dùng 1,96.

**Trả lời miệng:** “Mức 95% nói về độ bao phủ của phương pháp qua nhiều mẫu. Theo cách hiểu frequentist, tham số thật cố định còn khoảng thay đổi theo mẫu. Khoảng tin cậy thể hiện độ bất định của ước lượng dưới các giả định, không phải nơi chứa 95% các điểm dữ liệu.”

**Nối tiếp:** Có nói xác suất tham số nằm trong khoảng đã tính là 95% không? → Không theo diễn giải frequentist thông thường; diễn giải xác suất tham số thuộc khoảng thuộc khuôn khổ Bayes.

### XS25 [C] Điều gì làm khoảng tin cậy rộng hoặc hẹp?

**Hiểu:** Khoảng thường có dạng `ước lượng ± hệ số tới hạn × SE`. Mức tin cậy cao hơn cần hệ số lớn hơn nên khoảng rộng hơn. Nhiều dữ liệu độc lập hơn thường làm SE nhỏ hơn. Dữ liệu phân tán hơn thường làm khoảng rộng hơn.

**Ví dụ:** nếu muốn giảm một nửa sai số biên của trung bình, thường cần khoảng bốn lần cỡ mẫu, giữ cùng mức tin cậy và độ phân tán. Muốn 99% tin cậy thay vì 95% thì phải chấp nhận khoảng rộng hơn với cùng dữ liệu.

**Trả lời miệng:** “Độ rộng phản ánh đánh đổi giữa độ chắc chắn và độ chính xác. Em có thể làm khoảng hẹp hơn bằng cách thu thập thêm mẫu phù hợp, nhưng không nên hạ mức tin cậy chỉ để trình bày kết quả đẹp. Công thức cũng không sửa được thiên lệch thu thập dữ liệu.”

**Nối tiếp:** Lặp lại cùng bản ghi 100 lần có thêm 100 mẫu độc lập? → Không; sao chép dữ liệu không tạo thông tin mới tương ứng.

## Cụm 5: Kiểm định, quan hệ và kết luận

### XS26 [A] H0, H1 và kiểm định giả thuyết là gì?

**Hiểu:** H0 là giả thuyết không, thường biểu diễn không có khác biệt hoặc một giá trị chuẩn. H1 là phương án đối lập quan tâm. Ta giả sử H0 và mô hình đúng, rồi xem dữ liệu có bất thường tới mức cần bác bỏ H0 không.

**Ví dụ:** kiểm tra khối lượng trung bình túi hàng: H0: μ = 500 g; H1: μ ≠ 500 g. Tính một thống kê kiểm định từ mẫu và đối chiếu phân phối của nó dưới H0.

**Trả lời miệng:** “Kiểm định đặt một giả thuyết cơ sở và đánh giá mức độ dữ liệu tương thích với giả thuyết đó dưới các giả định. Kết quả thường là bác bỏ hoặc chưa đủ bằng chứng bác bỏ H0. Không bác bỏ không có nghĩa đã chứng minh H0 đúng.”

**Nối tiếp:** Vì sao chưa bác bỏ? → Có thể H0 đúng, hoặc hiệu ứng nhỏ, mẫu ít, nhiễu lớn hay phép kiểm định thiếu lực để phát hiện.

### XS27 [A] P-value là gì và không phải là gì?

**Hiểu:** Dưới H0 và các giả định của phép kiểm định, p-value là xác suất thu được thống kê kiểm định ít nhất cũng cực đoan như quan sát theo hướng kiểm định. P nhỏ biểu thị dữ liệu ít tương thích với mô hình H0 hơn.

**Ví dụ:** p = 0,03 nghĩa là nếu H0 và giả định đúng, xác suất thống kê cực đoan như vậy hoặc hơn là 3%. Với ngưỡng α = 0,05 đã chọn trước, ta bác bỏ H0.

**Trả lời miệng:** “P-value là xác suất về dữ liệu hoặc thống kê kiểm định giả sử H0 đúng, không phải xác suất H0 đúng. P nhỏ hỗ trợ bác bỏ H0 theo ngưỡng đã chọn, nhưng không tự cho biết tác động lớn hay có ích thực tế.”

**Bẫy:** p = 0,03 không nghĩa là “97% khả năng H1 đúng”, cũng không nghĩa “3% kết quả do ngẫu nhiên”. Việc thử nhiều phân tích rồi chỉ chọn p nhỏ làm sai diễn giải thông thường.

### XS28 [B] Alpha, lỗi loại I, loại II và power là gì?

**Hiểu:** Lỗi loại I: bác bỏ H0 khi H0 đúng. Lỗi loại II: không bác bỏ H0 khi một phương án H1 cụ thể đúng. α đặt giới hạn tỷ lệ lỗi loại I của phép kiểm định hợp lệ; β là xác suất loại II tại phương án đó; power = 1−β.

**Ví dụ:** H0 là máy đóng gói đúng trung bình 500 g. Báo máy lệch khi thật sự đúng là loại I; bỏ sót máy thật sự lệch là loại II.

**Trả lời miệng:** “Kiểm định có hai hướng sai: báo khác biệt không có thật và bỏ sót khác biệt có thật. Power là khả năng phát hiện một mức khác biệt cụ thể. Với các yếu tố khác giữ nguyên, thêm mẫu thường tăng power; hạ alpha thường khiến phát hiện khó hơn.”

**Nối tiếp:** Power chỉ phụ thuộc α? → Không; còn cỡ mẫu, độ nhiễu, độ lớn hiệu ứng và phép kiểm định. α không phải xác suất kết luận cụ thể lần này sai.

### XS29 [C] Kiểm định một phía và hai phía khác gì?

**Hiểu:** Hai phía tìm khác biệt cả lớn hơn lẫn nhỏ hơn, như H1: μ ≠ 500. Một phía nhắm một hướng, như H1: μ < 500; H0 tương ứng bao gồm μ ≥ 500. Lựa chọn phải xuất phát từ câu hỏi nghiên cứu trước khi nhìn kết quả.

**Ví dụ:** nếu chỉ quan tâm sản phẩm bị thiếu trọng lượng và thiết kế nghiên cứu phù hợp, có thể chọn kiểm định một phía. Nếu lệch ở cả hai hướng đều quan trọng, dùng hai phía.

**Trả lời miệng:** “Một phía tập trung bằng chứng vào một hướng đã xác định; hai phía xét sai lệch cả hai hướng. Em không đổi sang một phía sau khi thấy dữ liệu chỉ để giảm p-value. Cần nêu rõ giả thuyết, bối cảnh và hướng kiểm định.”

**Nối tiếp:** Có luôn lấy p hai phía chia 2? → Không máy móc; phụ thuộc phân phối kiểm định, hướng quan sát và cách định nghĩa p-value.

### XS30 [B] Chọn phép kiểm định ở mức cơ bản như thế nào?

**Hiểu:** Hỏi trước: biến kết quả là số hay phân loại, có bao nhiêu nhóm, các nhóm độc lập hay ghép cặp, và giả định có phù hợp không.

**Ví dụ:** so chiều cao trung bình hai nhóm độc lập có thể dùng Welch t-test nếu điều kiện phù hợp. Đo huyết áp cùng người trước/sau cần xét hiệu số ghép cặp. Xét liên hệ giữa hai biến phân loại có thể dùng chi-square độc lập khi tần số kỳ vọng đủ phù hợp; bảng thưa có thể cần phương pháp khác như Fisher exact.

**Trả lời miệng:** “Em không chọn test chỉ theo tên quen thuộc. Em xác định kiểu dữ liệu, thiết kế độc lập hay ghép cặp, số nhóm và giả định. T-test thường xét trung bình; chi-square thường xét tần số hoặc liên hệ phân loại; mỗi phép có điều kiện riêng.”

**Nối tiếp:** Dữ liệu không chuẩn thì luôn dùng kiểm định phi tham số? → Không; còn cỡ mẫu, mức lệch, mục tiêu và độ bền vững. Phi tham số cũng có giả định.

### XS31 [B] Tương quan Pearson khác quan hệ nhân quả thế nào?

**Hiểu:** Pearson r đo mức liên hệ **tuyến tính**, nằm trong [−1, 1] nếu phương sai hai biến dương. Dấu cho hướng; độ lớn cho độ chặt của liên hệ tuyến tính. Tương quan chưa chứng minh biến này gây biến kia.

**Ví dụ:** kem bán nhiều và người đi bơi nhiều có thể cùng do trời nóng. Một biến thứ ba là yếu tố gây nhiễu. Quan hệ hình chữ U có thể rất rõ nhưng r gần 0 vì không tuyến tính.

**Trả lời miệng:** “Pearson mô tả liên hệ tuyến tính, không phải mọi kiểu phụ thuộc. Tương quan có thể do nhân quả, yếu tố thứ ba hoặc cấu trúc dữ liệu khác. Muốn kết luận nhân quả cần thiết kế nghiên cứu và giả định mạnh hơn, chẳng hạn thí nghiệm ngẫu nhiên phù hợp.”

**Nối tiếp:** r = 0 nghĩa là độc lập? → Không nói chung. Độc lập với moment phù hợp suy ra hiệp phương sai 0, nhưng chiều ngược lại không luôn đúng.

### XS32 [B] Hiệp phương sai khác tương quan thế nào?

**Hiểu:** `Cov(X,Y)=E[(X−E[X])(Y−E[Y])]` đo xu hướng lệch cùng chiều hoặc ngược chiều. Tương quan Pearson chuẩn hóa nó bằng hai độ lệch chuẩn: `ρ=Cov(X,Y)/(σXσY)` khi các đại lượng tồn tại và σX, σY > 0.

**Ví dụ:** đổi chiều cao từ mét sang centimet làm covariance với cân nặng nhân 100, nhưng tương quan không đổi vì độ lệch chuẩn chiều cao cũng nhân 100.

**Trả lời miệng:** “Hiệp phương sai biểu thị hai biến cùng tăng giảm quanh trung bình thế nào, nhưng độ lớn phụ thuộc đơn vị. Tương quan chuẩn hóa nên không mang đơn vị và có thể so sánh thuận tiện hơn. Cả hai chủ yếu phản ánh liên hệ tuyến tính.”

**Nối tiếp:** Nếu một biến luôn bằng hằng số thì tương quan? → Không xác định theo công thức vì độ lệch chuẩn bằng 0, không phải cứ gán r = 0.

### XS33 [B] Có ý nghĩa thống kê có đồng nghĩa quan trọng thực tế?

**Hiểu:** Ý nghĩa thống kê thường nói p nhỏ hơn ngưỡng đã chọn. Ý nghĩa thực tế hỏi hiệu ứng đủ lớn để đáng quan tâm hay hành động không. Cần xem độ lớn hiệu ứng, khoảng tin cậy, chi phí và bối cảnh.

**Ví dụ:** với mẫu rất lớn, mức tăng doanh thu trung bình 1 đồng có thể có p rất nhỏ nhưng không đủ bù chi phí triển khai. Ngược lại, một cải thiện có ích có thể chưa đạt ngưỡng thống kê vì mẫu ít.

**Trả lời miệng:** “P-value không đo độ lớn tác động. Em cần báo cả ước lượng hiệu ứng và độ bất định, sau đó đánh giá theo mục tiêu thực tế. Không đạt ý nghĩa thống kê cũng không chứng minh hiệu ứng bằng 0.”

**Nối tiếp:** p = 0,049 và p = 0,051 có khác nhau rất lớn về bằng chứng? → Không; ngưỡng quyết định tạo hai nhãn nhưng bằng chứng thay đổi liên tục. Tránh chỉ đọc nhãn đạt/không đạt.

### XS34 [C] Vì sao thử nhiều giả thuyết dễ ra kết quả dương tính giả?

**Hiểu:** Mỗi kiểm định có một cơ hội báo động nhầm. Thử nhiều lần rồi chỉ công bố lần “có ý nghĩa” làm rủi ro tổng thể lớn hơn mức α của từng phép.

**Ví dụ:** nếu 20 H0 đều đúng, các kiểm định độc lập và mỗi test có xác suất loại I đúng 0,05, xác suất có ít nhất một lần bác bỏ nhầm là `1−0,95²⁰≈64%`.

**Trả lời miệng:** “Thử nhiều giả thuyết làm tăng cơ hội tình cờ thấy p nhỏ. Em cần xác định câu hỏi từ trước, báo đầy đủ và cân nhắc hiệu chỉnh nhiều kiểm định. Bonferroni là cách đơn giản dùng ngưỡng α/m cho m kiểm định để kiểm soát xác suất có ít nhất một lỗi loại I.”

**Nối tiếp:** Bonferroni có cần các kiểm định độc lập để bảo đảm kiểm soát không? → Không, nếu từng p-value hợp lệ; nhưng có thể khá bảo thủ. Công thức 64% ở ví dụ thì đã giả định độc lập.

### XS35 [C] MLE và suy luận Bayes khác nhau ở ý tưởng nào?

**Hiểu:** **Likelihood** xem dữ liệu đã quan sát là cố định rồi đánh giá các giá trị tham số. MLE chọn tham số làm likelihood lớn nhất. Suy luận Bayes kết hợp likelihood với phân phối trước của tham số để có phân phối sau.

**Ví dụ:** 10 lần tung xu độc lập thấy 7 ngửa. MLE của xác suất ngửa p là 0,7. Bayes còn dùng prior; với prior đều Beta(1,1), posterior là Beta(8,4), trung bình posterior là 8/12. Tối nay chỉ cần hiểu prior ảnh hưởng kết quả, chưa cần học họ Beta.

**Trả lời miệng:** “MLE chọn giá trị tham số khiến dữ liệu quan sát có likelihood cao nhất. Bayes bổ sung thông tin trước và tạo phân phối sau cho tham số. Khoảng credible của Bayes có thể diễn giải bằng xác suất posterior, còn confidence interval frequentist nói về độ bao phủ của thủ tục.”

**Nối tiếp:** Likelihood có tự là phân phối xác suất trên tham số không? → Không; không được coi nó đã được chuẩn hóa trên tham số.

## Năm bài tự kiểm tra có lời giải

Hãy che phần lời giải và nói lý do trước khi tính. Dùng dữ liệu nhỏ để kiểm tra bản chất, không thi tốc độ bấm máy.

### Bài 1: Trung tâm và phân tán

Dữ liệu [1, 2, 3, 4, 10]. Tính mean, median, phương sai nếu coi đây là tổng thể, và phương sai mẫu hiệu chỉnh.

**Lời giải:** mean = 20/5 = 4; median = 3. Tổng bình phương độ lệch = 9+4+1+0+36 = 50. Phương sai tổng thể = 50/5 = 10. Phương sai mẫu hiệu chỉnh = 50/4 = 12,5. Đừng chọn mẫu số mà không nói đang tính loại nào.

### Bài 2: Bayes bằng bảng đếm

Trong 1.000 email, 200 email là spam. Bộ lọc đánh dấu 160 spam và đánh dấu nhầm 80 email thường. Biết email bị đánh dấu, xác suất nó là spam bao nhiêu? Khả năng đánh dấu khi email là spam bao nhiêu?

**Lời giải:** tổng email bị đánh dấu = 160+80 = 240. `P(spam|đánh dấu)=160/240=2/3`. `P(đánh dấu|spam)=160/200=0,8`. Hai điều kiện khác nhau tạo hai mẫu số khác nhau. Đây cũng là trực giác precision và recall trong ML.

### Bài 3: Nhị thức

Ba lần thử độc lập, mỗi lần thành công với xác suất 0,2. X là số thành công. Tính P(X = 1), E[X], Var(X).

**Lời giải:** có 3 vị trí cho lần thành công, nên `P(X=1)=3×0,2×0,8²=0,384`. `E[X]=3×0,2=0,6`; `Var(X)=3×0,2×0,8=0,48`. Kỳ vọng 0,6 không phải số thành công của một lượt ba lần thử, mà là trung bình theo phân phối.

### Bài 4: SE và khoảng tin cậy

Mẫu độc lập cỡ 100 có mean 50 và SD mẫu 10. Dùng xấp xỉ chuẩn được giả định phù hợp, tính SE và khoảng 95%. Nếu tăng n lên 400 với SD tương tự, SE ra sao?

**Lời giải:** SE ước lượng = 10/√100 = 1. Khoảng xấp xỉ = `50±1,96`, tức [48,04; 51,96]. Với n = 400, SE ≈ 0,5. Khoảng này ước lượng trung bình tổng thể, không phải vùng chứa 95% các cá nhân. Nếu dùng t thay chuẩn, hệ số và hai đầu khoảng sẽ hơi khác.

### Bài 5: Diễn giải kiểm định

Đặt α = 0,05 trước khi phân tích; một kiểm định hợp lệ cho p = 0,08. Có được nói “H0 đúng với xác suất 92%” hoặc “không có tác động” không?

**Lời giải:** không được nói cả hai. Kết luận là chưa đủ bằng chứng bác bỏ H0 ở mức 0,05. P không phải xác suất H0. Cần xem ước lượng tác động, khoảng tin cậy, cỡ mẫu, power và giả định trước khi đánh giá kết quả.

## Bảng công thức tối thiểu và điều kiện

| Nội dung | Công thức | Điều cần nhớ |
|---|---|---|
| Trung bình mẫu | `x̄ = Σxᵢ/n` | n > 0, dữ liệu số có ý nghĩa |
| Phương sai toàn bộ n điểm | `Σ(xᵢ−x̄)²/n` | Mô tả chính tập điểm đó |
| Phương sai mẫu hiệu chỉnh | `s² = Σ(xᵢ−x̄)²/(n−1)` | n > 1; không chệch dưới giả định lấy mẫu phù hợp |
| Phần bù | `P(Aᶜ)=1−P(A)` | Không cần độc lập |
| Hợp | `P(A∪B)=P(A)+P(B)−P(A∩B)` | Chỉ bỏ giao khi giao có xác suất 0 |
| Điều kiện | `P(A\|B)=P(A∩B)/P(B)` | P(B) > 0 |
| Độc lập | `P(A∩B)=P(A)P(B)` | Là điều kiện cần kiểm tra/giả định, không mặc định |
| Bayes | `P(A\|B)=P(B\|A)P(A)/P(B)` | P(B) > 0 |
| Xác suất toàn phần, hai nhánh | `P(B)=P(B\|A)P(A)+P(B\|Aᶜ)P(Aᶜ)` | Các xác suất điều kiện cần xác định |
| Kỳ vọng rời rạc | `E[X]=ΣxP(X=x)` | Kỳ vọng cần tồn tại |
| Phương sai | `Var(X)=E[X²]−E[X]²` | Moment bậc hai hữu hạn |
| Biến đổi affine | `Var(aX+b)=a²Var(X)` | a, b là hằng số |
| Nhị thức | `P(X=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ` | n thử độc lập cùng p; k từ 0 đến n |
| Nhị thức | `E[X]=np`, `Var(X)=np(1−p)` | Cùng điều kiện mô hình nhị thức |
| Z-score | `z=(x−μ)/σ` | σ > 0; không tự làm phân phối thành chuẩn |
| SE trung bình | `σ/√n`, ước lượng `s/√n` | Dạng cơ bản: mẫu độc lập cùng phân phối, phương sai hữu hạn |
| CI trung bình xấp xỉ | `x̄ ± hệ_số_tới_hạn × SE` | Chọn chuẩn/t và giả định phù hợp; 1,96 không phải hằng số cho mọi bài |

## Từ điển Anh–Việt để không bị vướng thuật ngữ

| Tiếng Anh | Cách hiểu ngắn |
|---|---|
| Population / sample | Tổng thể / mẫu |
| Parameter / statistic | Tham số tổng thể / thống kê mẫu |
| Mean / median / mode | Trung bình / trung vị / mốt |
| Variance / standard deviation | Phương sai / độ lệch chuẩn |
| Quantile / outlier | Phân vị / điểm ngoại lệ |
| Bias / sampling error | Thiên lệch / sai số lấy mẫu |
| Conditional / independent | Có điều kiện / độc lập |
| Random variable / distribution | Biến ngẫu nhiên / phân phối |
| Expectation / covariance | Kỳ vọng / hiệp phương sai |
| Standard error / confidence interval | Sai số chuẩn / khoảng tin cậy |
| Null / alternative hypothesis | Giả thuyết không / đối thuyết |
| Significance level / power | Mức ý nghĩa / lực kiểm định |
| Correlation / causation | Tương quan / quan hệ nhân quả |
| Prior / likelihood / posterior | Phân phối trước / hàm hợp lý / phân phối sau |

**Mốc tự kiểm tra cuối:** bạn có thể giải thích vì sao mean không đủ, vì sao đảo điều kiện dễ sai, vì sao mẫu lớn vẫn lệch, và vì sao p-value không là xác suất H0? Nếu chưa, ưu tiên sửa bốn chỗ đó trước khi học thêm công thức.
