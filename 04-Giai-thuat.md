# 04 — Giải thuật

**Ưu tiên tối nay: GT1–GT4.** Nếu chưa quen Python, hãy đọc ý tưởng và tự chạy bằng giấy; không cần thuộc cú pháp trước khi hiểu cách làm.

## GT1. Giải thuật và độ phức tạp Big-O là gì?

**Giải thuật** là một chuỗi bước rõ ràng để giải một bài toán. Khi đánh giá, ta quan tâm nó có đúng không, chạy tốn thời gian ra sao và cần bao nhiêu bộ nhớ.

**Big-O** mô tả một giới hạn trên cho tốc độ tăng của chi phí theo kích thước đầu vào `n`. Trong phỏng vấn người ta thường dùng nó để nêu bậc tăng trưởng tiêu biểu, bỏ qua hằng số và số hạng bậc thấp. Nó không cho biết số giây chạy chính xác.

| Bậc thường gặp | Trực giác | Ví dụ |
|---|---|---|
| O(1) | Chi phí không tăng theo n | Truy cập phần tử mảng theo chỉ số |
| O(log n) | Liên tục giảm phạm vi theo một tỷ lệ | Binary search trên mảng đã sắp xếp |
| O(n) | Xem lần lượt n phần tử | Tìm lớn nhất trong mảng chưa sắp xếp |
| O(n log n) | Thường gặp khi chia đôi và xử lý mỗi mức | Merge sort |
| O(n²) | Công việc tỷ lệ với bình phương n | Hai vòng lặp n lần lồng nhau |

**Ví dụ:** hai vòng lặp n lần nối tiếp tốn khoảng `n+n`, vẫn O(n). Hai vòng lặp n lần lồng nhau tốn khoảng `n×n`, là O(n²). Không phải cứ thấy hai vòng lặp là O(n²); cần xem mỗi vòng chạy bao nhiêu lần.

**Mẫu trả lời:** “Độ phức tạp mô tả chi phí tăng thế nào khi đầu vào lớn lên. Big-O biểu diễn giới hạn trên về bậc tăng trưởng, không phải thời gian chạy bằng giây. Duyệt một mảng là O(n), còn xét mọi cặp bằng hai vòng n lần lồng nhau là O(n²).”

**Hỏi tiếp:** Big-O có đồng nghĩa trường hợp xấu nhất không? → Không. Có thể dùng Big-O cho hàm chi phí tốt nhất, trung bình hoặc xấu nhất; phải nói rõ đang xét trường hợp nào.

## GT2. Linear search và binary search khác nhau thế nào?

**Linear search (tìm tuyến tính):** xem từng phần tử đến khi tìm thấy hoặc hết danh sách. Không cần dữ liệu được sắp xếp. Trường hợp xấu nhất O(n).

**Binary search (tìm nhị phân):** trên mảng đã sắp xếp, so phần tử cần tìm với phần tử giữa; loại nửa không thể chứa mục tiêu và lặp lại. Trường hợp xấu nhất O(log n) với mảng hỗ trợ truy cập chỉ số O(1).

**Ví dụ tìm 7 trong [1, 3, 5, 7, 9]:** so với 5 → chỉ giữ phần bên phải → kiểm tra 7 → tìm thấy.

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
```

Hàm giả định `a` đã sắp xếp tăng dần. Trả về chỉ số tìm được, hoặc −1 nếu không có. Mỗi lần bỏ cả phần tử giữa đã kiểm tra để phạm vi nhỏ đi. Bản lặp dùng O(1) bộ nhớ phụ.

**Mẫu trả lời:** “Linear search dò lần lượt và không cần sắp xếp, xấu nhất O(n). Binary search loại một nửa phạm vi sau mỗi bước nên là O(log n), nhưng cần mảng có thứ tự. Nếu dữ liệu chưa sắp xếp và chỉ tìm một lần thì phải tính cả chi phí sắp xếp; binary search không mặc nhiên là lựa chọn tốt hơn.”

**Tự nói:** Tìm 4 trong mảng trên sẽ kết thúc thế nào? → Phạm vi tìm kiếm trở nên rỗng, trả về −1.

## GT3. Array, linked list, stack, queue và hash table là gì?

Đây là các cách tổ chức dữ liệu hoặc quy tắc truy cập dữ liệu. Chọn đúng giúp thao tác cần thiết hiệu quả hơn.

| Cấu trúc | Ý tưởng | Điểm cần nhớ |
|---|---|---|
| Array / mảng | Các vị trí truy cập bằng chỉ số | Truy cập chỉ số O(1); chèn/xóa giữa thường cần dịch chuyển O(n) |
| Linked list / danh sách liên kết | Các nút giữ dữ liệu và liên kết | Truy cập phần tử thứ k phải lần theo liên kết; chèn có thể O(1) khi đã có đủ con trỏ cần thiết |
| Stack / ngăn xếp | Vào sau, ra trước — LIFO | Ví dụ chồng đĩa, hoàn tác thao tác |
| Queue / hàng đợi | Vào trước, ra trước — FIFO | Ví dụ người xếp hàng |
| Hash table / bảng băm | Ánh xạ khóa đến vị trí lưu bằng hàm băm | Tra cứu/chèn/xóa thường O(1) trung bình với giả định phù hợp; xấu nhất có thể O(n) |

**Ví dụ Python:** `list` là mảng động, không phải linked list. Có thể dùng `append()` và `pop()` cuối list để làm stack. `collections.deque` phù hợp làm queue với `append()` và `popleft()`; `list.pop(0)` tốn O(n) do phải dịch chuyển. `dict` và `set` dựa trên bảng băm.

**Mẫu trả lời:** “Mảng mạnh ở truy cập theo chỉ số; danh sách liên kết lưu qua các nút nên truy cập ngẫu nhiên chậm hơn. Stack lấy phần tử vào sau trước, queue lấy phần tử vào trước trước. Hash table phù hợp tra cứu theo khóa, thường có chi phí trung bình O(1), nhưng không bảo đảm O(1) mọi trường hợp.”

**Hỏi tiếp:** Tìm một giá trị trong mảng chưa sắp xếp có O(1) vì truy cập mảng O(1) không? → Không. Biết chỉ số khác với tìm chỉ số; tìm theo giá trị có thể phải duyệt O(n).

## GT4. Sắp xếp và đệ quy hoạt động ra sao?

**Sắp xếp** đưa dữ liệu về một thứ tự, giúp tìm kiếm hoặc xử lý tiếp thuận tiện hơn.

- **Bubble sort:** so các phần tử kề nhau và đổi chỗ nếu sai thứ tự, lặp qua nhiều lượt. Trung bình/xấu nhất O(n²).
- **Merge sort:** chia đôi, sắp xếp từng nửa rồi trộn hai nửa đã có thứ tự. Thời gian O(n log n); bản thông thường trên mảng cần O(n) bộ nhớ phụ.
- **Quicksort:** chọn một phần tử làm mốc (pivot), phân hoạch phần tử theo mốc rồi xử lý tiếp các phần. Trung bình O(n log n), xấu nhất O(n²), phụ thuộc cách phân hoạch và chọn mốc.

**Đệ quy (recursion)** là hàm gọi lại chính nó để giải bài toán nhỏ hơn. Cần **điểm dừng** và mỗi bước phải tiến về điểm dừng.

**Ví dụ giai thừa:** `4! = 4×3×2×1`. Với số nguyên n ≥ 0: `factorial(0)=1`, `factorial(n)=n×factorial(n−1)` khi n > 0. Bản đệ quy thực hiện n mức gọi; trong phân tích cơ bản coi phép nhân là O(1), thời gian O(n) và ngăn xếp O(n).

**Mẫu trả lời:** “Merge sort chia mảng thành các phần nhỏ, sắp xếp rồi trộn, đạt O(n log n). Đó là ví dụ chia để trị và thường được viết bằng đệ quy. Đệ quy cần điểm dừng, đồng thời bài toán phải nhỏ dần để tới điểm dừng; lời gọi hàm cũng tốn bộ nhớ ngăn xếp.”

**Hỏi tiếp:** Có điểm dừng là đủ chưa? → Chưa. Nếu từ n lại gọi n+1 mà điểm dừng là 0 thì với n dương sẽ không tiến tới điểm dừng.

## Chỉ đọc nếu còn thời gian

- **BFS:** duyệt đồ thị theo từng lớp, thường dùng queue; tìm đường đi ít cạnh nhất trong đồ thị không trọng số.
- **DFS:** đi sâu rồi quay lui, dùng đệ quy hoặc stack. Với danh sách kề và quản lý đã thăm đúng, BFS/DFS chạy O(V+E), V là số đỉnh, E là số cạnh.
- **Greedy (tham lam):** mỗi bước chọn phương án tốt nhất cục bộ; chỉ đúng khi bài toán có tính chất phù hợp. Ví dụ đổi 6 bằng đồng {1, 3, 4}: lấy đồng lớn nhất trước cho 4+1+1, nhưng 3+3 ít đồng hơn.
- **Dynamic programming (quy hoạch động):** lưu và tái sử dụng kết quả bài toán con; thường phù hợp khi bài toán con lặp lại, và với tối ưu hóa cần cấu trúc tối ưu phù hợp. Không phải cứ đệ quy là quy hoạch động.
