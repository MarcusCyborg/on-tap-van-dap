# Giải thuật và cấu trúc dữ liệu: 35 câu từ nền tảng

Bạn không cần thuộc nhiều tên thuật toán trước khi hiểu bài toán. Với mỗi câu, hãy hỏi: **đầu vào là gì, cần trả về gì, vì sao các bước làm đúng, tốn bao nhiêu thời gian và bộ nhớ?**

## Bản đồ concept và đường đọc

**Bài toán và tính đúng → độ phức tạp → tổ chức dữ liệu → tìm kiếm/sắp xếp → đệ quy/cây → đồ thị → chiến lược giải bài.**

| Cụm | Câu | Điều cần hiểu |
|---|---|---|
| Đánh giá lời giải | GT01–GT05 | Đúng trước, rồi xét thời gian/bộ nhớ và trường hợp đầu vào |
| Cấu trúc dữ liệu | GT06–GT11 | Cách lưu quyết định thao tác nào nhanh/chậm |
| Tìm kiếm và sắp xếp | GT12–GT18 | Mỗi thuật toán có điều kiện và đánh đổi |
| Đệ quy và cây | GT19–GT23 | Chia bài toán, điểm dừng, độ cao cây |
| Đồ thị | GT24–GT28 | Quan hệ nhiều đỉnh, duyệt và đường đi |
| Kỹ thuật giải bài | GT29–GT35 | Greedy, DP và khai thác cấu trúc của dãy |

**Đường đọc A (18 câu):** GT01 → GT02 → GT03 → GT05 → GT06 → GT08 → GT09 → GT10 → GT12 → GT14 → GT16 → GT19 → GT20 → GT22 → GT24 → GT26 → GT27 → GT30.

**B (12 câu):** GT04, GT07, GT11, GT13, GT15, GT17, GT21, GT23, GT25, GT29, GT31, GT33.

**C (5 câu):** GT18, GT28, GT32, GT34, GT35. A/B/C là thứ tự ưu tiên trong tài liệu, không phải xác suất ra đề. Đọc B/C trước nếu thầy đã nhấn mạnh chúng trên lớp.

## GT01 [A] Giải thuật là gì? Thế nào là một lời giải đúng?

**Trả lời miệng:** “Giải thuật là các bước biến đầu vào hợp lệ thành đầu ra mong muốn. Em kiểm tra yêu cầu và trường hợp biên trước, rồi giải thích vì sao cách làm đúng. Chạy đúng vài ví dụ là bằng chứng hữu ích nhưng chưa chứng minh đúng với mọi đầu vào.”

Giải thuật là dãy bước rõ ràng giải một bài toán. Trước khi chọn cách làm, cần biết miền đầu vào, đầu ra và giới hạn. “Tìm số lớn nhất” khác “tìm vị trí của số lớn nhất”; với dữ liệu rỗng còn cần quy ước riêng.

**Ví dụ:** tìm lớn nhất trong [−5, −2, −9]. Nếu khởi tạo kết quả là 0 rồi chỉ cập nhật khi gặp số lớn hơn, ta trả về 0 dù 0 không có trong mảng. Khởi tạo từ phần tử đầu giải quyết lỗi này khi mảng không rỗng.

**Hỏi tiếp:** Trường hợp biên là gì? → Các trường hợp dễ bị bỏ sót: rỗng, một phần tử, trùng lặp, toàn số âm, mục tiêu không tồn tại.

## GT02 [A] Big-O là gì và dùng để làm gì?

**Trả lời miệng:** “Big-O mô tả bậc tăng của chi phí theo đầu vào, bỏ qua hằng số để nhìn khi dữ liệu lớn. Duyệt một lần thường O(n), tìm nhị phân trên mảng đã sắp xếp O(log n). Nhưng Big-O thấp hơn chưa bảo đảm nhanh hơn ở mọi kích thước nhỏ.”

Big-O biểu diễn một giới hạn trên cho tốc độ tăng của chi phí khi kích thước đầu vào n lớn dần. Nó giúp so khả năng mở rộng, không cho biết số giây thực tế. Ta thường bỏ hằng số và số hạng bậc thấp: 3n + 10 là O(n).

**Ví dụ:** duyệt n số là O(n); xét mọi cặp bằng hai vòng n lần là O(n²). Nếu n tăng từ 1.000 lên 10.000, số thao tác tương ứng tăng khoảng 10 lần và 100 lần, khi xét các dạng chi phí này.

**Bẫy:** Nói O(n) cũng thuộc O(n²) về giới hạn trên là đúng toán học, nhưng khi phỏng vấn nên nêu giới hạn chặt hữu ích; Θ diễn tả bậc tăng chặt cả trên lẫn dưới.

## GT03 [A] Độ phức tạp bộ nhớ khác độ phức tạp thời gian thế nào?

**Trả lời miệng:** “Độ phức tạp thời gian đo lượng công việc, còn bộ nhớ đo không gian cần dùng. Em sẽ nói rõ đang tính bộ nhớ phụ hay tổng bộ nhớ, và tính cả ngăn xếp lời gọi khi có đệ quy.”

Thời gian đếm công việc; bộ nhớ đếm không gian cần giữ dữ liệu. Cần phân biệt **bộ nhớ phụ** ngoài đầu vào với tổng bộ nhớ có tính cả đầu vào/đầu ra. Một lời giải nhanh hơn có thể cần nhiều bộ nhớ hơn.

**Ví dụ:** duyệt mảng để cộng tổng, chỉ giữ biến tổng: O(n) thời gian, O(1) bộ nhớ phụ. Tạo thêm bản sao n phần tử: O(n) bộ nhớ phụ. Đệ quy n mức cũng có thể tốn O(n) bộ nhớ ngăn xếp dù không tạo mảng mới.

**Hỏi tiếp:** O(1) bộ nhớ phụ có nghĩa là không dùng bộ nhớ? → Không; vẫn có biến, nhưng số lượng không tăng theo n trong mô hình phân tích đang dùng.

## GT04 [B] Tốt nhất, trung bình, xấu nhất và amortized khác nhau ra sao?

**Trả lời miệng:** “Khi nêu độ phức tạp, em cần nói trường hợp nào. Trung bình phụ thuộc giả định đầu vào, còn amortized nhìn tổng một chuỗi thao tác. Một lần append mảng động có thể O(n) dù amortized là O(1).”

Một thuật toán có thể chạy khác nhau trên các đầu vào cùng kích thước. **Tốt nhất/xấu nhất** xét đầu vào thuận lợi/bất lợi nhất; **trung bình** cần giả định phân phối đầu vào. **Amortized (khấu hao)** phân bổ tổng chi phí của một chuỗi thao tác, không nhất thiết dùng giả định ngẫu nhiên.

**Ví dụ:** tìm tuyến tính thấy mục tiêu ở đầu thì O(1), phải xem hết thì O(n). Thêm vào cuối mảng động thường rẻ, đôi lúc phải cấp vùng lớn và sao chép; với cách tăng dung lượng phù hợp, chi phí khấu hao mỗi lần thêm là O(1).

**Bẫy:** Big-O không đồng nghĩa “xấu nhất”; có thể dùng ký hiệu đó cho hàm chi phí của bất kỳ trường hợp nào đã xác định.

## GT05 [A] Nhìn vòng lặp thì tính độ phức tạp thế nào?

**Trả lời miệng:** “Em đếm số lần thực hiện thân vòng và chi phí mỗi lần. Vòng nối tiếp thì cộng, lồng nhau thường nhân, nhưng phải xem giới hạn thực tế. Hai vòng không luôn đồng nghĩa O(n²).”

Đếm số lần công việc được thực hiện, không chỉ đếm số vòng lặp trong mã. Hai vòng n lần **nối tiếp** là 2n, O(n). Hai vòng n lần **lồng nhau** là n², O(n²), nếu thân vòng có chi phí O(1).

**Ví dụ:** vòng ngoài chạy n lần, vòng trong chỉ chạy 3 lần thì O(n). Nếu biến tăng gấp đôi mỗi bước từ 1 đến n, số bước khoảng log₂n, nên O(log n). Hai vòng lần lượt n và m lần lồng nhau là O(nm), không tự thay m bằng n.

**Hỏi tiếp:** Vòng trong chạy i lần khi vòng ngoài i từ 1 tới n? → Tổng 1+2+…+n = n(n+1)/2, vẫn O(n²).

## GT06 [A] Mảng và mảng động là gì? Python list thuộc loại nào?

**Trả lời miệng:** “Mảng mạnh ở truy cập theo chỉ số O(1), nhưng chèn hoặc xóa ở giữa thường O(n). Mảng động có thể tăng dung lượng; append cuối thường O(1) khấu hao, không phải mọi lần đều O(1).”

Mảng cho phép truy cập bằng chỉ số. Với mô hình mảng thông thường, địa chỉ phần tử tính trực tiếp nên truy cập O(1). Chèn/xóa giữa thường phải dịch các phần tử sau, tốn O(n).

Mảng động có dung lượng được mở rộng khi cần. Python `list` là mảng động chứa tham chiếu tới đối tượng, không phải danh sách liên kết.

**Ví dụ:** [10, 20, 30], muốn chèn 15 ở chỉ số 1 thì cần dời 20 và 30 sang phải. Lấy phần tử chỉ số 1 là thao tác khác với tìm xem số 20 ở vị trí nào.

**Hỏi tiếp:** Biết mảng truy cập O(1), tìm một giá trị có O(1) không? → Không; chưa biết chỉ số thì có thể phải dò O(n).

## GT07 [B] Linked list là gì, khi nào chèn/xóa O(1)?

**Trả lời miệng:** “Linked list tổ chức dữ liệu bằng các nút và liên kết. Chèn/xóa có thể O(1) khi đã có các nút hoặc con trỏ cần thiết, nhưng tìm vị trí có thể O(n). Nó cũng tốn bộ nhớ cho liên kết.”

Danh sách liên kết gồm các **nút** chứa dữ liệu và liên kết sang nút khác. Danh sách đơn có liên kết tới nút sau; danh sách đôi có thêm liên kết về nút trước. Không truy cập trực tiếp nút thứ k như mảng; thường phải đi từ đầu.

**Ví dụ:** A → B → C. Nếu đã có nút B, chèn X sau B chỉ cần đổi liên kết thành B → X → C. Nhưng nếu chỉ biết giá trị “B”, tìm nút B trước có thể O(n).

**Bẫy:** Với danh sách đơn, biết nút cần xóa chưa chắc đủ để xóa tổng quát O(1); thường cần nút trước, đặc biệt khi xét xóa nút cuối.

## GT08 [A] Stack hoạt động thế nào?

**Trả lời miệng:** “Stack lấy phần tử thêm gần nhất trước, giống chồng đĩa. Nó hữu ích khi cần quay lại việc gần nhất, như kiểm tra ngoặc, undo hoặc mô phỏng lời gọi hàm. Trong Python có thể dùng list.append và list.pop ở cuối.”

Stack là cấu trúc theo quy tắc **LIFO: vào sau, ra trước**. `push` thêm ở đỉnh, `pop` lấy khỏi đỉnh, `peek` xem đỉnh. Các thao tác thường O(1), với mảng động thì push có thể hiểu theo chi phí khấu hao.

**Ví dụ:** đẩy 1, rồi 2, rồi 3; lấy ra được 3 trước. Khi kiểm tra ngoặc “([])”, gặp dấu mở thì đẩy vào stack; gặp dấu đóng phải khớp với dấu mở gần nhất chưa đóng.

**Hỏi tiếp:** Chỉ đếm tổng số dấu mở/đóng có đủ kiểm tra ngoặc đúng không? → Không; “)(” có số lượng bằng nhau nhưng sai thứ tự.

## GT09 [A] Queue và deque khác stack ra sao?

**Trả lời miệng:** “Queue phục vụ phần tử đến trước trước, còn stack phục vụ phần tử đến sau trước. Deque cho phép thao tác cả hai đầu. Em dùng deque để làm queue trong Python, tránh lấy đầu list nhiều lần.”

Queue theo **FIFO: vào trước, ra trước**, giống hàng chờ. Thêm cuối, lấy đầu. Deque là hàng đợi hai đầu, hỗ trợ thêm/xóa ở cả hai phía hiệu quả trong triển khai phù hợp.

**Ví dụ:** A, B, C vào queue theo thứ tự thì A ra trước. Python `collections.deque` có `append()` thêm cuối và `popleft()` lấy đầu, các thao tác ở đầu/cuối thường O(1). `list.pop(0)` phải dời phần tử nên O(n).

**Hỏi tiếp:** Deque có phải mọi thao tác đều O(1)? → Không; truy cập một vị trí ở giữa không có lợi thế O(1) như mảng.

## GT10 [A] Hash table, dict và set là gì?

**Trả lời miệng:** “Hash table tra cứu theo khóa nhờ hàm băm. Dict dùng khi cần giá trị ứng với khóa, set dùng khi chủ yếu kiểm tra tồn tại hoặc loại trùng. Chi phí trung bình thường O(1), nhưng không bảo đảm cho mọi trường hợp.”

Bảng băm dùng **hàm băm** biến khóa thành thông tin để chọn vị trí lưu/tra cứu. `dict` lưu cặp khóa–giá trị; `set` lưu các phần tử khác nhau, phù hợp kiểm tra có tồn tại hay chưa.

**Ví dụ:** đếm từ “a b a”: cập nhật dict để được {a: 2, b: 1}. Nếu chỉ muốn biết những từ đã xuất hiện, dùng set {a, b}. Tra cứu/chèn/xóa thường có chi phí trung bình O(1) theo số phần tử dưới giả định phù hợp.

**Bẫy:** Độ dài khóa vẫn có thể ảnh hưởng chi phí băm/so sánh; đừng suy ra xử lý một chuỗi dài tùy ý luôn O(1).

## GT11 [B] Collision là gì? Vì sao hash table có thể chậm?

**Trả lời miệng:** “Va chạm là nhiều khóa cùng rơi vào một vị trí băm. Bảng băm cần cơ chế xử lý để vẫn tìm đúng khóa. Nếu nhiều khóa dồn vào cùng vùng, chi phí có thể tăng; trong mô hình thường gặp, xấu nhất một thao tác có thể O(n).”

**Collision (va chạm)** xảy ra khi các khóa khác nhau dẫn tới cùng vị trí băm cần xử lý. Hai cách phổ biến là giữ nhiều mục tại một bucket hoặc tìm vị trí trống khác theo quy tắc. Khi bảng quá đầy, triển khai có thể mở rộng và phân bố lại dữ liệu.

**Ví dụ:** hàm ví dụ lấy số dư chia 10 khiến 12 và 22 cùng về vị trí 2. Bảng vẫn phải phân biệt hai khóa thật, không coi chúng là một.

**Hỏi tiếp:** Hai khóa có cùng hash có bắt buộc bằng nhau không? → Không. Với khóa hợp lệ, bằng nhau phải có hash nhất quán; chiều ngược lại không đúng.

## GT12 [A] Linear search và binary search khác nhau thế nào?

**Trả lời miệng:** “Tìm tuyến tính dò từng phần tử, không cần sắp xếp và xấu nhất O(n). Tìm nhị phân dùng thứ tự để loại một nửa phạm vi mỗi bước nên O(log n) trên mảng. Nếu phải sắp xếp trước, em cần tính thêm chi phí đó.”

Linear search kiểm tra lần lượt đến khi tìm thấy hoặc hết dữ liệu; xấu nhất O(n), không cần sắp xếp. Binary search kiểm tra phần tử giữa và loại nửa không thể chứa mục tiêu; cần dữ liệu có thứ tự hoặc một tính chất đơn điệu phù hợp.

**Ví dụ:** tìm 7 trong [1, 3, 5, 7, 9]: so với 5, mục tiêu lớn hơn nên bỏ nửa trái; sau đó tìm trong [7, 9]. Với mảng truy cập chỉ số O(1), số bước xấu nhất O(log n).

**Hỏi tiếp:** Mảng chưa sắp xếp, chỉ tìm một lần? → Duyệt thẳng O(n) thường hợp lý hơn sắp xếp chỉ để tìm.

## GT13 [B] Viết binary search cần tránh những lỗi nào?

**Trả lời miệng:** “Em xác định rõ khoảng còn có thể chứa mục tiêu. Sau mỗi bước phải loại được phần tử giữa và một phía, tránh vòng lặp vô hạn. Với dữ liệu trùng, tìm được một vị trí chưa chắc là vị trí đầu tiên.”

Cần nhất quán khoảng tìm kiếm và đảm bảo khoảng nhỏ đi. Với khoảng đóng `[left, right]`, điều kiện lặp là `left <= right`; sau khi so phần tử giữa không bằng mục tiêu, cập nhật `mid+1` hoặc `mid−1` để loại vị trí đã xét.

**Ví dụ:** tìm 4 trong [1, 3, 5]. So 3 rồi xét 5; cuối cùng left vượt right, kết luận không có. Mảng rỗng có right = −1 nên không vào vòng lặp.

**Hỏi tiếp:** Muốn tìm lần xuất hiện đầu tiên của 3 trong [1, 3, 3, 3, 5]? → Khi gặp 3, lưu đáp án rồi tiếp tục tìm bên trái, thay vì trả về ngay.

## GT14 [A] Vì sao cần sắp xếp và chọn thuật toán dựa vào gì?

**Trả lời miệng:** “Sắp xếp giúp biến bài toán thành dạng dễ xử lý hơn, nhưng bản thân nó có chi phí. Em cân nhắc O(n²) hay O(n log n), bộ nhớ phụ, tính ổn định và dữ liệu ban đầu. Trong thực tế thường dùng hàm thư viện đã được kiểm chứng.”

Sắp xếp đưa dữ liệu theo thứ tự, hỗ trợ tìm kiếm, gom các giá trị bằng nhau hoặc xử lý theo ưu tiên. Chọn cách sắp xếp dựa vào kích thước, trạng thái ban đầu, bộ nhớ, yêu cầu ổn định và trường hợp xấu nhất.

**Ví dụ:** [4, 1, 3, 1] thành [1, 1, 3, 4]. Sau đó hai giá trị 1 nằm cạnh nhau, dễ đếm hoặc loại trùng. Nhưng sắp xếp có thể làm mất thứ tự ban đầu nếu không giữ chỉ số.

**Hỏi tiếp:** Python `sorted(a)` và `a.sort()` khác gì? → `sorted` tạo list mới; `sort` sửa list hiện có và trả về None. Việc sửa tại chỗ ở API không đồng nghĩa thuật toán chỉ dùng O(1) bộ nhớ phụ.

## GT15 [B] Bubble, selection và insertion sort khác nhau thế nào?

**Trả lời miệng:** “Ba cách này dễ hiểu và thường xấu nhất O(n²). Insertion sort chèn vào đoạn đã sắp xếp và có thể chạy tốt trên dữ liệu gần có thứ tự. Selection sort vẫn phải tìm nhỏ nhất qua phần còn lại nên thường có Θ(n²) phép so sánh dù đầu vào đã sắp xếp.”

Bubble sort đổi chỗ cặp kề nhau sai thứ tự; selection sort chọn phần tử nhỏ nhất còn lại đưa lên đầu; insertion sort lấy phần tử tiếp theo chèn vào phần đầu đã có thứ tự.

**Ví dụ:** insertion sort [3, 1, 2]: bắt đầu [3], chèn 1 thành [1, 3], chèn 2 thành [1, 2, 3]. Cách này giống sắp bài trên tay.

**Hỏi tiếp:** Bubble sort tốt nhất O(n) luôn đúng không? → Cần phiên bản có cờ dừng khi một lượt không đổi chỗ; bản luôn chạy đủ các lượt vẫn O(n²).

## GT16 [A] Merge sort hoạt động ra sao và vì sao O(n log n)?

**Trả lời miệng:** “Merge sort chia đôi, sắp xếp hai nửa rồi trộn tuyến tính. Nó có thời gian O(n log n), kể cả xấu nhất ở bản chuẩn. Đánh đổi là bản thông thường trên mảng cần O(n) bộ nhớ phụ.”

Merge sort chia mảng thành hai nửa, sắp xếp từng nửa, rồi **trộn** hai dãy đã có thứ tự. Khi trộn, so hai phần tử đầu chưa lấy, lấy phần tử nhỏ hơn và tiếp tục.

**Ví dụ:** [4, 1, 3, 2] chia thành [4, 1] và [3, 2], sắp thành [1, 4] và [2, 3], trộn được [1, 2, 3, 4]. Có khoảng log n mức chia; tổng công trộn mỗi mức O(n), nên O(n log n).

**Hỏi tiếp:** Merge sort có ổn định không? → Bản trộn chọn phần tử bên trái trước khi hai khóa bằng nhau có thể giữ thứ tự tương đối, nên ổn định.

## GT17 [B] Quicksort khác merge sort thế nào?

**Trả lời miệng:** “Quicksort phân hoạch quanh pivot, trung bình hoặc kỳ vọng với lựa chọn ngẫu nhiên phù hợp là O(n log n). Nếu phân hoạch liên tục rất lệch, xấu nhất O(n²). Cách chọn pivot và xử lý dữ liệu trùng ảnh hưởng hiệu quả.”

Quicksort chọn **pivot (mốc)** rồi phân hoạch dữ liệu theo mốc và xử lý tiếp các phần. Merge sort chia theo vị trí rồi cần trộn; quicksort làm công phân hoạch trước, thường không cần bước trộn kiểu merge sort.

**Ví dụ:** [4, 1, 3, 2], chọn 3 làm mốc, có thể phân thành [1, 2], [3], [4]; tiếp tục xử lý phần chưa sắp xếp. Cách xử lý phần tử bằng mốc tùy biến thể.

**Bẫy:** “Quicksort luôn O(1) bộ nhớ” sai nếu tính ngăn xếp đệ quy. Bản phân hoạch tại chỗ thường có stack O(log n) khi cân bằng và có thể O(n) khi lệch nếu không tối ưu thêm.

## GT18 [C] Stable sort và in-place nghĩa là gì?

**Trả lời miệng:** “Tính ổn định quan tâm thứ tự giữa các phần tử cùng khóa, còn in-place quan tâm bộ nhớ phụ. Đây là hai thuộc tính khác nhau. Khi dữ liệu có nhiều trường hoặc sắp xếp nhiều lượt, ổn định có thể quan trọng.”

**Stable (ổn định)** giữ thứ tự tương đối của các phần tử có cùng khóa sắp xếp. **In-place** thường nói tới việc dùng rất ít bộ nhớ phụ, nhưng cần nêu quy ước có tính ngăn xếp hay không; việc sửa đầu vào không tự chứng minh O(1) bộ nhớ.

**Ví dụ:** [(An, 8), (Bình, 7), (Chi, 8)] sắp tăng theo điểm. Stable sort giữ An trước Chi trong nhóm điểm 8. Nếu chỉ có các số bằng nhau mà không có thông tin đi kèm, ta khó nhìn thấy ý nghĩa này.

**Hỏi tiếp:** Bản selection sort đổi chỗ thông thường có ổn định không? → Không bảo đảm; việc đổi chỗ xa có thể đảo thứ tự các phần tử cùng khóa.

## GT19 [A] Đệ quy là gì và vì sao cần điểm dừng?

**Trả lời miệng:** “Đệ quy giải bài toán qua những phiên bản nhỏ hơn của chính nó. Em cần điểm dừng và bảo đảm mỗi bước tới gần điểm dừng. Ngoài thời gian, em tính bộ nhớ ngăn xếp; đệ quy quá sâu có thể vượt giới hạn.”

Đệ quy là hàm gọi lại chính nó trên bài toán nhỏ hơn. Cần **base case (điểm dừng)** và bước chuyển thực sự tiến về điểm dừng. Mỗi lời gọi còn đang chờ thường chiếm một khung trên ngăn xếp.

**Ví dụ:** giai thừa số nguyên n ≥ 0: `fact(0)=1`; với n>0, `fact(n)=n*fact(n−1)`. Tính fact(3) mở chuỗi 3×fact(2), 2×fact(1), 1×fact(0), rồi trả kết quả ngược lên là 6.

**Hỏi tiếp:** Có điểm dừng n=0 nhưng từ n>0 lại gọi n+1 thì sao? → Không tiến tới điểm dừng. Với factorial, còn phải kiểm tra điều kiện n không âm.

## GT20 [A] Chia để trị có phải cứ chia đôi là xong?

**Trả lời miệng:** “Chia để trị gồm chia, giải bài toán con và kết hợp. Độ phức tạp phụ thuộc số bài toán con, kích thước của chúng và công kết hợp. Binary search chỉ giữ một nửa; merge sort xử lý cả hai nửa nên có độ phức tạp khác.”

**Divide and conquer (chia để trị)** gồm chia bài toán thành các bài toán con, giải chúng, rồi kết hợp kết quả. Đệ quy thường là cách triển khai, nhưng bản thân “có đệ quy” không có nghĩa là một thuật toán chia để trị hiệu quả.

**Ví dụ:** merge sort chia hai nửa, giải từng nửa và trộn. Mỗi mức vẫn làm tổng O(n) công; không thể nói “chia đôi nên O(log n)” mà bỏ qua công xử lý cả hai nhánh.

**Hỏi tiếp:** Khác DP ở đâu? → DP nhấn mạnh lưu/tái sử dụng các bài toán con lặp lại; chia để trị điển hình có các bài toán con độc lập, ít trùng hơn.

## GT21 [B] Cây, cây nhị phân, độ cao và các kiểu duyệt là gì?

**Trả lời miệng:** “Cây biểu diễn cấu trúc phân cấp. Cây nhị phân giới hạn mỗi nút tối đa hai con, chưa nói gì về thứ tự giá trị. Khi phân tích tìm kiếm, độ cao quan trọng vì nó quyết định số mức cần đi qua.”

Cây có các nút và cạnh; cây có gốc cho mỗi nút không phải gốc một nút cha. **Cây nhị phân** có tối đa hai con ở mỗi nút. Lá là nút không có con. Ở đây độ cao tính theo số cạnh dài nhất từ gốc tới lá, nên cây một nút có độ cao 0; có tài liệu dùng số nút, cần đọc quy ước.

**Ví dụ:** gốc 2, con trái 1, con phải 3. Preorder: 2,1,3; inorder: 1,2,3; postorder: 1,3,2, tương ứng gốc trước/giữa/sau hai cây con.

**Hỏi tiếp:** Mọi cây nhị phân có inorder tăng dần không? → Không; cần tính chất cây tìm kiếm nhị phân thích hợp.

## GT22 [A] BST là gì? Vì sao không phải lúc nào tìm cũng O(log n)?

**Trả lời miệng:** “BST dùng thứ tự để bỏ một nhánh khi tìm. Thời gian phụ thuộc độ cao: cây cân bằng O(log n), nhưng cây lệch có thể O(n). Cây nhị phân và BST khác nhau vì BST có thêm quy tắc thứ tự.”

**Binary search tree (BST)** tổ chức để các giá trị bên trái nhỏ hơn nút, bên phải lớn hơn nút; dữ liệu trùng cần quy tắc riêng. Tìm kiếm so với nút hiện tại rồi chỉ đi một phía. Chi phí là O(h), h là độ cao cây.

**Ví dụ:** chèn lần lượt 1,2,3,4 vào BST thường không cân bằng có thể thành một chuỗi lệch phải. Tìm 4 phải qua cả bốn nút. Cây cân bằng giữ độ cao O(log n); AVL và red-black là các cách cân bằng phổ biến.

**Hỏi tiếp:** Inorder của BST cho gì? → Dãy đã sắp xếp theo quy tắc so sánh và cách xử lý giá trị trùng của cây.

## GT23 [B] Heap và priority queue là gì?

**Trả lời miệng:** “Heap hỗ trợ xem nhỏ nhất O(1), thêm và lấy nhỏ nhất O(log n) trong binary heap. Nó phù hợp hàng đợi ưu tiên. Heap không yêu cầu toàn bộ mảng đã sắp xếp; chỉ có quan hệ cha–con.”

Priority queue lấy phần tử theo ưu tiên, không nhất thiết theo thời điểm vào. **Min-heap nhị phân** thường là cây nhị phân hoàn chỉnh được lưu trong mảng, mỗi nút cha không lớn hơn con. “Hoàn chỉnh” ở đây nghĩa là các tầng trước tầng cuối đều đầy, tầng cuối được điền từ trái sang phải. Phần tử nhỏ nhất ở gốc.

**Ví dụ:** các việc có ưu tiên 5, 2, 8; min-heap lấy ưu tiên 2 trước. Sau khi thêm hoặc bỏ gốc, đẩy phần tử lên/xuống để khôi phục tính chất heap.

**Hỏi tiếp:** Tìm một giá trị bất kỳ trong heap có O(log n) không? → Không bảo đảm; thường có thể phải duyệt O(n). Xây heap từ toàn bộ n phần tử bằng heapify có thể O(n), khác thêm từng phần tử O(n log n).

## GT24 [A] Đồ thị là gì? Có những loại nào?

**Trả lời miệng:** “Đồ thị biểu diễn các đối tượng và mối liên hệ, có thể có hướng hoặc vô hướng, có trọng số hoặc không. Trước khi chọn thuật toán, em cần biết loại đồ thị và ý nghĩa trọng số.”

Đồ thị gồm **đỉnh (vertex)** và **cạnh (edge)** biểu diễn đối tượng và quan hệ. Cạnh có hướng như A theo dõi B; cạnh vô hướng như hai thành phố nối đường hai chiều. Trọng số là chi phí trên cạnh, như khoảng cách hoặc thời gian.

**Ví dụ:** A nối B và C; B nối D. Nếu cạnh không trọng số, ta thường coi mỗi bước có cùng chi phí. Đồ thị có thể có chu trình; khi duyệt cần tránh đi vòng mãi bằng cách quản lý đã thăm.

**Hỏi tiếp:** Cây liên quan đồ thị thế nào? → Cây vô hướng là đồ thị liên thông không chu trình; với n đỉnh có n−1 cạnh. Không phải mọi đồ thị đều là cây.

## GT25 [B] Danh sách kề và ma trận kề khác nhau thế nào?

**Trả lời miệng:** “Đồ thị thưa thường hợp với danh sách kề vì chỉ lưu những cạnh có thật. Ma trận kề tốn O(V²) bộ nhớ nhưng kiểm tra một cặp có cạnh thường O(1). Chọn cách biểu diễn còn phụ thuộc thao tác mình cần.”

**Danh sách kề** lưu các đỉnh kề của mỗi đỉnh. **Ma trận kề** có V hàng và V cột, mỗi ô thể hiện cạnh tương ứng có tồn tại hoặc có trọng số bao nhiêu.

**Ví dụ:** A nối B và C; danh sách của A chứa [B,C]. Ma trận phải dành chỗ cho mọi cặp đỉnh, kể cả không có cạnh. Danh sách kề thường cần O(V+E) bộ nhớ; ma trận O(V²).

**Hỏi tiếp:** BFS/DFS luôn O(V+E) dù biểu diễn thế nào? → Không. Với ma trận, quét hàng để tìm láng giềng có thể làm tổng O(V²).

## GT26 [A] BFS hoạt động thế nào và khi nào tìm được đường ngắn nhất?

**Trả lời miệng:** “BFS dùng queue để mở rộng theo lớp. Nó tìm đường ít cạnh nhất từ nguồn trong đồ thị không trọng số hoặc các cạnh cùng trọng số dương. Với danh sách kề, thời gian tuyến tính theo số đỉnh và cạnh.”

**Breadth-first search (duyệt rộng)** xử lý theo từng lớp khoảng cách từ nguồn, dùng queue. Đánh dấu đã thăm khi đưa đỉnh vào queue để tránh thêm lặp nhiều lần. Với danh sách kề, một lần duyệt toàn đồ thị qua các thành phần có chi phí O(V+E).

**Ví dụ:** A nối B,C; B nối D. Bắt đầu A, lớp tiếp theo là B,C, rồi D. Khoảng cách theo số cạnh từ A đến D là 2. Thứ tự trong cùng một lớp phụ thuộc thứ tự danh sách kề.

**Hỏi tiếp:** Nếu cạnh có chi phí 1, 5, 100 thì BFS có tối thiểu tổng chi phí không? → Không; ít cạnh nhất có thể không rẻ nhất.

## GT27 [A] DFS khác BFS thế nào?

**Trả lời miệng:** “DFS đi sâu rồi quay lui, còn BFS đi theo lớp. Cả hai có thể O(V+E) với danh sách kề và quản lý đã thăm đúng. DFS không bảo đảm đường đầu tiên tìm được là đường ít cạnh nhất.”

**Depth-first search (duyệt sâu)** đi sâu theo một nhánh rồi quay lại, dùng đệ quy hoặc stack. Nó hữu ích khi kiểm tra khả năng đi tới, tìm thành phần liên thông, hoặc làm nền cho các thuật toán khác. Vẫn cần đánh dấu đã thăm với đồ thị có chu trình.

**Ví dụ:** A có B,C; B có D. Một thứ tự DFS có thể là A,B,D,C, trong khi BFS có thể là A,B,C,D. Thứ tự cụ thể phụ thuộc cách chọn láng giềng.

**Hỏi tiếp:** Muốn duyệt cả đồ thị nhưng nguồn không đi tới mọi đỉnh? → Sau lượt đầu, tiếp tục bắt đầu từ các đỉnh chưa thăm; một lượt từ nguồn chỉ bao phủ phần đi tới được.

## GT28 [C] Dijkstra giải bài toán gì và điều kiện quan trọng là gì?

**Trả lời miệng:** “Dijkstra dùng để tìm đường ngắn nhất theo tổng trọng số không âm. Nó chốt dần đỉnh có khoảng cách tạm nhỏ nhất và cập nhật láng giềng. Điều kiện không có cạnh âm là quan trọng để lập luận chốt khoảng cách đúng.”

Dijkstra tìm đường có tổng trọng số nhỏ nhất từ một nguồn khi **mọi trọng số cạnh không âm**. Nó giữ khoảng cách tạm thời, lấy đỉnh chưa chốt có khoảng cách nhỏ nhất rồi thử cải thiện khoảng cách qua các cạnh, gọi là relaxation.

**Ví dụ:** A→B giá 10, A→C giá 1, C→B giá 2. Đường tới B được cải thiện từ 10 xuống 3 qua C. Một cạnh trực tiếp không luôn là đường rẻ nhất.

**Hỏi tiếp:** Vì sao không nói luôn O(V²)? → Phụ thuộc triển khai; bản chọn đỉnh bằng quét thường O(V²), bản danh sách kề và binary heap thường O((V+E)log V) theo mô hình triển khai phù hợp. Cạnh âm cần thuật toán khác như Bellman–Ford.

## GT29 [B] Greedy là gì? Vì sao lựa chọn tốt trước mắt có thể sai?

**Trả lời miệng:** “Greedy chọn tốt nhất ở mỗi bước theo một tiêu chí. Ưu điểm là thường đơn giản và nhanh, nhưng cần chứng minh phù hợp bài toán. Em sẽ tìm phản ví dụ hoặc lập luận trao đổi, không chỉ thử vài trường hợp rồi kết luận đúng.”

**Greedy (tham lam)** mỗi bước chọn phương án có vẻ tốt nhất theo tiêu chí cục bộ, thường không quay lại sửa lựa chọn. Nó chỉ đúng khi có tính chất bài toán cho phép chứng minh lựa chọn cục bộ vẫn dẫn tới nghiệm tối ưu.

**Ví dụ:** đổi 6 bằng các đồng {1,3,4}, có đủ số lượng mỗi loại. Chọn đồng lớn nhất trước tạo 4+1+1, cần 3 đồng; nhưng 3+3 chỉ cần 2. Vậy quy tắc đó không đúng cho mọi hệ đồng tiền.

**Hỏi tiếp:** Có bài greedy đúng không? → Có, chẳng hạn chọn nhiều khoảng thời gian không chồng nhau nhất bằng cách ưu tiên khoảng kết thúc sớm, với mục tiêu đếm số khoảng và mô hình chuẩn.

## GT30 [A] Quy hoạch động là gì và nhận diện bằng cách nào?

**Trả lời miệng:** “DP tránh tính lại các bài toán con bằng cách lưu kết quả. Em cần định nghĩa trạng thái, công thức chuyển, giá trị gốc và thứ tự tính. Không phải cứ đệ quy là DP; điểm quan trọng là tái sử dụng kết quả phù hợp.”

**Dynamic programming (DP)** giải và lưu kết quả các bài toán con để tái sử dụng. Nó phù hợp khi bài toán con lặp lại; với bài toán tối ưu, cần xác định cách nghiệm tối ưu được xây từ các trạng thái con thích hợp.

**Ví dụ:** Fibonacci `F(n)=F(n−1)+F(n−2)`. Đệ quy ngây thơ tính F(3), F(2)… nhiều lần. Lưu mỗi F(k) rồi dùng lại giúp chỉ tính O(n) trạng thái. Theo mô hình coi phép cộng là O(1), thời gian O(n); số Fibonacci rất lớn còn có chi phí số nguyên lớn.

**Hỏi tiếp:** DP có luôn cần bảng O(n) không? → Không. Fibonacci chỉ cần hai giá trị trước nếu chỉ muốn F(n), nên O(1) số biến phụ trong mô hình cơ bản.

## GT31 [B] Memoization và tabulation khác nhau thế nào?

**Trả lời miệng:** “Memoization tính trạng thái khi cần rồi nhớ lại, dễ bám theo đệ quy nhưng có stack. Tabulation chọn thứ tự để các trạng thái cần dùng đã được tính, thường tránh đệ quy. Em chọn dựa vào miền trạng thái, phụ thuộc và bộ nhớ.”

**Memoization** thường là đệ quy từ trên xuống và lưu kết quả mỗi trạng thái. **Tabulation** thường tính từ dưới lên theo thứ tự phụ thuộc, điền bảng hoặc cập nhật các biến. Cả hai là cách tổ chức DP.

**Ví dụ:** số cách leo n bậc khi mỗi bước đi 1 hoặc 2: `ways(n)=ways(n−1)+ways(n−2)`, với `ways(0)=1`, `ways(1)=1`. Với n=3 có ba cách: 1+1+1, 1+2, 2+1.

**Hỏi tiếp:** Cách ước lượng thời gian DP? → Thường là số trạng thái được tính nhân chi phí xét chuyển cho mỗi trạng thái; không tự kết luận O(n) vì có một bảng.

## GT32 [C] Backtracking và pruning là gì?

**Trả lời miệng:** “Backtracking duyệt không gian lựa chọn bằng thử và quay lại. Cắt nhánh giúp bỏ những hướng chắc chắn không cần xét, nhưng điều kiện cắt phải đúng để không mất đáp án. Xấu nhất vẫn có thể tăng theo hàm mũ.”

**Backtracking (quay lui)** xây lời giải từng bước, thử một lựa chọn, đi tiếp, rồi hoàn tác để thử lựa chọn khác. **Pruning (cắt nhánh)** loại sớm nhánh chắc chắn không thể cho lời giải hợp lệ hoặc không thể cải thiện đáp án theo lập luận đúng.

**Ví dụ:** sinh chuỗi ngoặc đúng độ dài 4. Nếu một tiền tố có nhiều dấu đóng hơn dấu mở, như “)(”, có thể loại ngay. Các lời giải là “(())” và “()()”.

**Hỏi tiếp:** Khác greedy thế nào? → Greedy thường giữ luôn lựa chọn; backtracking thử rồi có thể hoàn tác. Khác DP ở chỗ DP chủ yếu tái sử dụng trạng thái, không chỉ duyệt nhánh.

## GT33 [B] Two pointers là gì và khi nào hiệu quả?

**Trả lời miệng:** “Hai con trỏ có thể giảm bài xét cặp xuống một lượt khi có quy tắc di chuyển không bỏ sót đáp án. Với mảng đã sắp xếp, tìm cặp tổng cho trước có thể O(n), mỗi con trỏ đi một chiều.”

**Two pointers (hai con trỏ/chỉ số)** dùng hai vị trí di chuyển theo quy tắc để tránh xét mọi cặp. Cần khai thác được tính chất dữ liệu; không phải dùng hai biến chỉ số là tự nhiên O(n).

**Ví dụ:** trong mảng tăng [1,2,4,7], tìm hai số tổng 6. Bắt đầu 1+7=8 lớn quá nên giảm phải; 1+4=5 nhỏ quá nên tăng trái; 2+4=6. Thứ tự tăng cho phép loại lựa chọn đúng.

**Bẫy:** Nếu phải sắp xếp trước thì tổng thời gian thường gồm O(n log n). Nếu cần chỉ số gốc, phải lưu lại thông tin đó.

## GT34 [C] Sliding window là gì và có luôn dùng được không?

**Trả lời miệng:** “Cửa sổ trượt xử lý các đoạn liên tiếp bằng cập nhật khi thêm hoặc bỏ phần tử. Với độ dài cố định và tổng, có thể cập nhật O(1) mỗi bước. Cửa sổ độ dài thay đổi cần điều kiện cho phép mở rộng và thu hẹp đúng.”

**Sliding window (cửa sổ trượt)** duy trì thông tin của một đoạn liên tiếp khi dịch hai đầu đoạn. Với cửa sổ độ dài cố định k, thêm phần tử mới và bỏ phần tử cũ có thể tránh cộng lại cả đoạn.

**Ví dụ:** [2,1,3,2], k=2. Tổng các cửa sổ là 3,4,5. Từ tổng 3 của [2,1], bỏ 2 thêm 3 để có 4. Tìm tổng lớn nhất cần O(n), thay vì cộng mỗi cửa sổ O(k).

**Hỏi tiếp:** Mảng có số âm ảnh hưởng gì? → Không phá ví dụ tổng cửa sổ cố định, nhưng có thể phá tính đơn điệu của cách mở/thu cửa sổ để tìm đoạn có tổng theo ngưỡng.

## GT35 [C] Prefix sum giúp trả lời tổng đoạn như thế nào?

**Trả lời miệng:** “Prefix sum lưu tổng tích lũy để lấy tổng một đoạn bằng hiệu hai tổng. Nó phù hợp khi có nhiều truy vấn trên mảng ít hoặc không thay đổi. Đánh đổi là thêm O(n) bộ nhớ và O(n) thời gian chuẩn bị.”

**Prefix sum (tổng tiền tố)** lưu tổng từ đầu tới từng vị trí. Dùng `prefix[0]=0` và `prefix[i+1]=prefix[i]+a[i]`; khi đó tổng đoạn từ chỉ số l tới r, gồm cả hai đầu, là `prefix[r+1]−prefix[l]`.

**Ví dụ:** a=[2,1,3,2] thì prefix=[0,2,3,6,8]. Tổng đoạn chỉ số 1 tới 3 là 8−2=6, đúng bằng 1+3+2. Tiền xử lý O(n), mỗi truy vấn tổng đoạn O(1).

**Hỏi tiếp:** Nếu cập nhật một phần tử nhiều lần? → Nhiều giá trị prefix phía sau phải đổi; có thể cần cấu trúc khác như Fenwick tree/segment tree, chưa cần học sâu khi nền tảng chưa chắc.

## Hai ví dụ Python có thể chạy trực tiếp

Đọc điều kiện đầu vào trước khi học mã. Cả hai đều có ví dụ kiểm tra trường hợp rỗng hoặc không tìm thấy/không đi tới được.

### 1. Binary search trên mảng tăng dần

```python
def binary_search(a, target):
    left, right = 0, len(a) - 1
    while left <= right:
        mid = (left + right) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1


assert binary_search([1, 3, 5, 7, 9], 7) == 3
assert binary_search([1, 3, 5], 4) == -1
assert binary_search([], 1) == -1
assert binary_search([2], 2) == 0
```

Trả chỉ số, không phải giá trị phần tử; với giá trị trùng, hàm tìm một vị trí bất kỳ phù hợp. Thời gian xấu nhất O(log n), bộ nhớ phụ O(1), giả sử truy cập mảng và so sánh O(1).

### 2. BFS tính khoảng cách theo số cạnh

```python
from collections import deque


def bfs_distances(graph, start):
    distance = {start: 0}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for neighbor in graph.get(node, []):
            if neighbor not in distance:
                distance[neighbor] = distance[node] + 1
                queue.append(neighbor)
    return distance


graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A"],
    "D": ["B"],
    "E": [],
}
assert bfs_distances(graph, "A") == {"A": 0, "B": 1, "C": 1, "D": 2}
assert bfs_distances(graph, "E") == {"E": 0}
```

Đồ thị dùng danh sách kề, không có trọng số; quy ước `start` là đỉnh hợp lệ, đỉnh không có khóa được xem như không có cạnh đi ra. E không xuất hiện trong kết quả từ A vì không đi tới được. Dictionary `distance` đồng thời đánh dấu đã thăm, và được cập nhật **trước khi** thêm vào queue.

## Năm bài tự kiểm tra và lời giải

### Bài 1: Trường hợp biên và chi phí

Bạn cần tìm lớn nhất trong một list không rỗng gồm n số nguyên. Hãy mô tả cách làm, kiểm tra với [−8,−3,−6], nêu thời gian và bộ nhớ phụ.

**Lời giải:** lấy phần tử đầu làm best, duyệt phần còn lại và cập nhật khi gặp số lớn hơn. Best lần lượt −8,−3,−3; trả −3. O(n) thời gian, O(1) số biến phụ. Nếu yêu cầu cho phép list rỗng, phải xác định trả None, báo lỗi hay quy ước khác, không tự đặt 0 làm đáp án.

### Bài 2: Chạy tay binary search

Tìm 8 trong [1,3,5,7,9] bằng mã trên. Ghi left, right và mid ở mỗi vòng.

**Lời giải:** (0,4,2): gặp 5, left=3. (3,4,3): gặp 7, left=4. (4,4,4): gặp 9, right=3. Lúc này left=4 > right=3, trả −1. Không có bước nào giữ nguyên toàn bộ phạm vi, nên vòng lặp tiến tới kết thúc.

### Bài 3: Chọn cấu trúc dữ liệu

Bạn cần (a) xử lý yêu cầu đúng thứ tự đến; (b) kiểm tra mã sinh viên đã xuất hiện; (c) luôn xử lý công việc có độ ưu tiên nhỏ nhất trước. Chọn gì?

**Lời giải:** (a) queue, Python deque; (b) hash set nếu chỉ cần tồn tại, dict nếu cần thêm thông tin; (c) priority queue, thường triển khai bằng min-heap. Đừng dùng queue thường cho ưu tiên vì đến trước không đồng nghĩa ưu tiên cao.

### Bài 4: BFS hay Dijkstra?

Đồ thị có cạnh A→B giá 10, A→C giá 1, C→B giá 2. Đường ít cạnh nhất từ A tới B là gì? Đường rẻ nhất là gì? Nếu bỏ trọng số thì chọn thuật toán nào?

**Lời giải:** ít cạnh nhất là A→B, một cạnh. Rẻ nhất là A→C→B, tổng 3; Dijkstra áp dụng được vì trọng số không âm. Nếu mọi cạnh coi bằng nhau, BFS cho đường ít cạnh nhất. Bài này cho thấy cần làm rõ “ngắn nhất” nghĩa là ít cạnh hay nhỏ tổng trọng số.

### Bài 5: Thiết lập DP cho đổi tiền

Có các đồng {1,3,4}, đủ số lượng mỗi loại. Tìm số đồng ít nhất để đổi 6. Gọi dp[x] là số đồng ít nhất để đổi x; đặt trạng thái gốc và phép chuyển.

**Lời giải:** dp[0]=0. Với x>0, lấy nhỏ nhất trong `dp[x−c]+1` qua các đồng c≤x có trạng thái trước đạt được; nếu không có thì đánh dấu không thể. Các giá trị dp[0..6] là [0,1,2,1,1,2,2], nên 6 dùng 3+3. Với số tiền S và k loại đồng, cách này O(Sk) thời gian, O(S) bộ nhớ; đây là theo giá trị S, không phải số bit biểu diễn S. Greedy lớn nhất trước cho 4+1+1 nên sai trên ví dụ.

## Bảng độ phức tạp cần nhớ cùng điều kiện

| Thao tác/thuật toán | Thời gian | Điều kiện và bộ nhớ đáng chú ý |
|---|---|---|
| Truy cập mảng theo chỉ số | O(1) | Không đồng nghĩa tìm theo giá trị |
| Chèn/xóa giữa mảng | O(n) xấu nhất | Do dịch chuyển |
| Append mảng động | O(1) khấu hao | Một lần mở rộng có thể O(n) |
| Tra cứu hash table | O(1) trung bình, O(n) xấu nhất | Giả định băm/so sánh khóa phù hợp |
| Linear search | O(n) xấu nhất | Không cần sắp xếp, O(1) bộ nhớ phụ |
| Binary search | O(log n) xấu nhất | Mảng có thứ tự, truy cập O(1); bản lặp O(1) bộ nhớ phụ |
| Bubble/insertion sort | O(n²) xấu nhất | Phiên bản thích hợp có tốt nhất O(n) |
| Selection sort chuẩn | Θ(n²) so sánh | Kể cả đã sắp xếp |
| Merge sort chuẩn trên mảng | O(n log n) | Thường O(n) bộ nhớ phụ |
| Quicksort | O(n log n) trung bình/kỳ vọng phù hợp; O(n²) xấu nhất | Tính thêm stack, phụ thuộc pivot/phân hoạch |
| Tìm trong BST | O(h) | h có thể O(n); cân bằng cho O(log n) |
| Xem min / thêm / lấy min ở binary heap | O(1) / O(log n) / O(log n) | Mảng heap không phải mảng sắp xếp |
| BFS/DFS | O(V+E) | Danh sách kề; thường O(V) bộ nhớ phụ, chưa tính đồ thị |
| Prefix sum | O(n) chuẩn bị, O(1) mỗi truy vấn | Mảng tĩnh, O(n) bộ nhớ phụ |

Các chi phí cơ bản thường coi phép toán trên một giá trị kích thước máy là O(1). Chuỗi dài, số nguyên rất lớn, thao tác thư viện ẩn hoặc cấu trúc lưu khác có thể thay đổi phân tích.

## Từ điển Anh–Việt ngắn

| Thuật ngữ | Cách hiểu |
|---|---|
| Algorithm / correctness | Giải thuật / tính đúng |
| Input / output / constraint | Đầu vào / đầu ra / ràng buộc |
| Edge case | Trường hợp biên, dễ bỏ sót |
| Time / space complexity | Độ phức tạp thời gian / bộ nhớ |
| Auxiliary space | Bộ nhớ phụ ngoài dữ liệu đầu vào, theo quy ước phân tích |
| Amortized | Khấu hao qua một chuỗi thao tác |
| Array / linked list | Mảng / danh sách liên kết |
| Stack / queue / deque | Ngăn xếp / hàng đợi / hàng đợi hai đầu |
| Hash / collision | Băm / va chạm |
| Recursion / base case | Đệ quy / trường hợp dừng |
| Divide and conquer | Chia để trị |
| Stable sort / pivot | Sắp xếp ổn định / mốc phân hoạch |
| Root / leaf / height | Gốc / lá / độ cao |
| Heap / priority queue | Heap / hàng đợi ưu tiên |
| Vertex / edge / adjacency | Đỉnh / cạnh / quan hệ kề |
| Traversal / visited | Duyệt / đã thăm |
| Greedy / dynamic programming | Tham lam / quy hoạch động |
| State / transition | Trạng thái / phép chuyển |
| Memoization / tabulation | Ghi nhớ kết quả theo yêu cầu / tính bảng theo thứ tự |
| Backtracking / pruning | Quay lui / cắt nhánh |
| Two pointers / sliding window / prefix sum | Hai con trỏ / cửa sổ trượt / tổng tiền tố |

**Tự kiểm tra cuối:** Nếu chỉ nhớ tên mà không chạy tay được một ví dụ 4–5 phần tử, hãy quay lại ví dụ trước khi mở thêm thuật toán. Khi vấn đáp, nói rõ giả định và lý do chọn cách làm thường có giá trị hơn kể một danh sách thuật toán.
