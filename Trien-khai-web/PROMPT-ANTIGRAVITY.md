# Prompt triển khai website học vấn đáp cho Antigravity

> Đây là đặc tả triển khai. Hãy đọc toàn bộ trước khi viết code. Người dùng đã chọn trải nghiệm **đọc hiểu + mô phỏng tương tác + luyện vấn đáp**. Hãy triển khai ứng dụng hoạt động được dựa trên các file nguồn, kiểm tra và bàn giao đầy đủ.

## 1. Vai trò, bối cảnh và kết quả cần đạt

Bạn là kỹ sư frontend kiêm người thiết kế trải nghiệm học. Xây dựng website tiếng Việt để tôi học từ gần như số 0, chuẩn bị vấn đáp về:

1. Xác suất thống kê.
2. Machine Learning.
3. Deep Learning.
4. Giải thuật và cấu trúc dữ liệu.

Buổi kiểm tra gồm 5–7 câu/người. Tôi đang ôn gấp, nhưng muốn có toàn bộ bộ tài liệu để hiểu rộng và tra cứu lâu dài. Trải nghiệm chính phải là:

**Chọn concept → đọc hiểu → thử ví dụ/mô phỏng → đóng đáp án và tự trả lời → đối chiếu → đánh dấu phần cần ôn → quay lại đúng phần đó.**

Hãy tạo công cụ học thực sự: điều hướng nhanh, nội dung dễ đọc, tương tác có ích, tiến độ được lưu. Tên giao diện đề xuất: **Ôn Vấn Đáp**. Toàn bộ nhãn, trạng thái, giải thích và lỗi dành cho người dùng viết bằng tiếng Việt tự nhiên.

Các quyết định kỹ thuật và hình thức dưới đây là phương án triển khai đề xuất. Tự giải quyết chi tiết thường lệ trong phạm vi này; chỉ hỏi khi có thiếu dữ liệu thực sự ngăn hoàn thành, hoặc yêu cầu mới gây thay đổi phạm vi đáng kể. Đọc quy tắc workspace trước khi chỉnh sửa.

## 2. Workspace, nguồn nội dung và ranh giới chỉnh sửa

Workspace:

```text
F:\dpl13.10
```

Đọc trước:

```text
F:\dpl13.10\PRODUCT.md
F:\dpl13.10\On-tap-van-dap\README.md
```

Nguồn nội dung chính:

```text
F:\dpl13.10\On-tap-van-dap\Chuyen-de\00-Cach-hoc-va-ban-do-kien-thuc.md
F:\dpl13.10\On-tap-van-dap\Chuyen-de\01-Xac-suat-thong-ke.md
F:\dpl13.10\On-tap-van-dap\Chuyen-de\02-Machine-Learning.md
F:\dpl13.10\On-tap-van-dap\Chuyen-de\03-Deep-Learning.md
F:\dpl13.10\On-tap-van-dap\Chuyen-de\04-Giai-thuat.md
F:\dpl13.10\On-tap-van-dap\Chuyen-de\05-Bon-de-van-dap-tong-hop.md
```

Tạo ứng dụng tại:

```text
F:\dpl13.10\On-tap-van-dap\web
```

Nếu thư mục ứng dụng đã có code, kiểm tra trước và tiếp tục từ hiện trạng. Giữ nguyên tài liệu nguồn; mọi nội dung diễn giải mới hoặc metadata đặt trong app. Đừng thay bộ tài liệu bằng vài câu demo hoặc một trang giới thiệu.

Nguồn ở ngay `On-tap-van-dap/` bên ngoài `Chuyen-de/` là bản ngắn cũ; không nhập lẫn vào bộ 140 câu. Có thể đưa vào mục “Nhắc nhanh” nếu còn thời gian, nhưng phải ghi rõ vai trò và không đếm trùng.

Không tự xuất bản, mua dịch vụ, thêm backend hoặc đòi API key cho các chức năng cốt lõi. Ứng dụng cần chạy được local và build ra website tĩnh. Bàn giao cả lệnh chạy và cách dùng bản build. Không ghi đường dẫn Windows tuyệt đối vào mã chạy trong trình duyệt.

## 3. Phạm vi bắt buộc và thứ tự ưu tiên

### P0: Hoạt động học hoàn chỉnh

- Nhập đủ 140 câu; đủ phần dẫn nhập, 20 bài tự kiểm tra và 4 đề tổng hợp.
- Trang bắt đầu/tiếp tục học, mục lục bốn mảng, trang đọc từng câu.
- Tìm kiếm tiếng Việt có/không dấu; lọc theo mảng, mức A/B/C và trạng thái.
- Chế độ đọc hiểu và chế độ tự trả lời trước khi mở đáp án.
- Đánh dấu đã đọc, mức hiểu, lưu để ôn và ghi chú cá nhân.
- Lưu tiến độ local, tiếp tục đúng câu sau khi tải lại; xuất/nhập bản sao tiến độ.
- Luyện đề có sẵn hoặc tạo lượt ngẫu nhiên 5/7 câu, tự đánh giá có giải thích rõ.
- Responsive, thao tác bàn phím, nội dung tiếng Việt và công thức/code không vỡ.

### P1: Trực quan hóa bắt buộc để hoàn thành yêu cầu

- Tám mô phỏng trong mục 8, mỗi mảng hai mô phỏng có điều khiển thật.
- Liên kết mô phỏng với câu hỏi liên quan, liên kết concept trước/sau.
- Hoàn thiện bảng công thức, thuật ngữ và câu hỏi tiếp nối trong trang đọc.
- Kiểm tra số liệu, trạng thái biên và kiểm thử giao diện desktop/mobile.

P0 phải chạy được trước để tôi có thể học ngay. Tiếp tục làm P1; đừng kết thúc toàn bộ nhiệm vụ sau khi mới có P0. Nếu bị giới hạn công cụ thật sự, nói rõ phần đã chạy, phần còn thiếu và nguyên nhân, không gọi tính năng chưa làm là hoàn tất.

### P2: Có thể làm sau, không chặn bàn giao

- PWA/offline hoàn chỉnh, spaced repetition có lịch, đồng bộ nhiều thiết bị.
- AI chấm bài, microphone, ghi âm, speech-to-text, chatbot.
- Thêm tài khoản, leaderboard, streak, huy hiệu hoặc gamification.

Phiên bản này luyện nói bằng việc tự trả lời thành tiếng rồi đối chiếu. Không giả vờ đã nghe hoặc chấm lời nói khi không có microphone/AI.

## 4. Thiết kế trải nghiệm và hình thức

### Hướng đề xuất

Một **sổ học có thể thao tác**, ưu tiên đọc và sử dụng: nền giấy sáng hơi ấm, chữ đậm rõ, thanh mục lục gọn, sơ đồ xuất hiện đúng chỗ giải thích. Cảm giác bình tĩnh, tập trung, có cấu trúc. Không cần landing page marketing hoặc màn chào dài trước khi học.

Đề xuất palette có thể tinh chỉnh khi đo tương phản:

```css
--page: #f5f3ed;
--surface: #fffefa;
--surface-muted: #ecefe9;
--ink: #202b27;
--muted: #52615a;
--accent: #27624a;
--border: #d3dad1;
--warning-ink: #865510;
--danger-ink: #a33c32;
```

Màu nhóm có thể là xanh lam cho XS, xanh lá cho ML, nâu cam cho DL, xanh teal cho GT; luôn kèm tên/nhãn. Đừng dùng màu để thay thế thông tin trạng thái. Không lấy nền tím, gradient sặc sỡ hoặc hiệu ứng kính làm mặc định.

Typography đề xuất: **Be Vietnam Pro** cho giao diện và bài đọc, **JetBrains Mono** cho code. Kiểm tra đầy đủ dấu tiếng Việt; ưu tiên đóng gói font local có license. Cỡ chữ bài đọc khoảng 17–18px, line-height 1,65–1,8, độ rộng 65–75ch; cho chọn cỡ chữ. Tiêu đề có phân cấp, không phóng đại đến mức đẩy nội dung khỏi màn hình.

Phần nền quanh nội dung có thể dùng sắc độ chuyển rất nhẹ hoặc đường kẻ mảnh; vùng đọc phải sạch, tương phản tốt. Các danh sách câu dùng hàng có phân cấp và đường phân cách, không nhốt mọi đoạn vào card bo tròn. Dùng một bộ icon nhất quán, có nhãn cho thao tác quan trọng.

Chuyển động chỉ phục vụ hiểu trạng thái: tiến từng bước thuật toán, cập nhật biểu đồ, mở đáp án. Thời gian chuyển giao diện khoảng 150–200ms; hỗ trợ `prefers-reduced-motion`. Nội dung hiện ngay khi mở trang, không chờ animation.

### Desktop

- Thanh trên: tên app, tìm kiếm, điều khiển cần thiết.
- Sidebar khoảng 240–280px: bốn mảng, nhóm concept, tiến độ theo mảng; có thể thu gọn.
- Vùng bài đọc ở giữa, rộng vừa đọc; có tiêu đề câu, nhãn ưu tiên và vị trí trong chuyên đề.
- Rail phụ chỉ xuất hiện khi đủ chiều ngang, chứa mục trong câu/kiến thức liên quan. Nếu làm chật bài đọc thì bỏ rail trước.
- Khối mô phỏng có thể rộng hơn đoạn văn, nhưng vẫn nằm trong dòng học và có giải thích bằng chữ.

### Mobile

- Một cột, điều hướng mảng/mục lục bằng drawer có đóng/mở rõ ràng.
- Bài đọc là trọng tâm; không để sidebar chiếm màn hình ban đầu.
- Previous/next hoặc mở đáp án dễ chạm, không che dòng cuối và không chặn bàn phím khi ghi chú.
- Code, bảng rộng được cuộn trong chính vùng đó; toàn trang không bị tràn ngang.
- Mô phỏng chuyển thành xếp dọc: hình → kết quả → điều khiển; không thu nhỏ toàn bộ desktop cho vừa màn hình.

## 5. Cấu trúc thông tin và các màn hình

### 5.1. Bắt đầu / Tiếp tục học

Lần đầu: nói rõ bộ tài liệu có gì và đưa nút **“Bắt đầu từ nền tảng”**. Hiện bốn chuyên đề với số câu, mô tả ngắn và đường đọc. Người mới phải biết thao tác tiếp theo trong vài giây.

Quay lại: nổi bật **“Tiếp tục: [mã câu] - [tên câu]”**, tiếp theo là “Cần ôn lại” và lựa chọn mảng. Hiển thị tiến độ thật, ví dụ “Đã đọc 12/140”, “Tự đánh giá vững: 5”; mở trang không tự được tính là đã hiểu.

Có lối vào bài dẫn nhập và lộ trình 2h/4h tùy nguồn phù hợp. Đây là hướng dẫn chọn lọc, không hứa đọc hết 140 câu trong thời gian đó. Không hardcode countdown ngày mai hoặc hạn thi đã trôi qua; nếu muốn, cho người dùng tự nhập ngày thi sau.

### 5.2. Mục lục chuyên đề

Giữ nhóm concept theo nguồn: người học cần thấy thứ tự từ căn bản lên nâng cao. Mỗi hàng có ID, tiêu đề, nhãn A/B/C, đã đọc hay chưa, mức hiểu, lưu để ôn. Cho chuyển “Tất cả / A / B / C / Cần ôn”.

Nhắc ngắn rằng A/B/C là thứ tự học, không phải dự đoán câu thi. Đếm tổng đúng sau khi lọc. Không có kết quả thì giải thích bộ lọc đang dùng và có nút xóa lọc.

### 5.3. Trang một câu / concept

Phân cấp đề xuất:

1. Breadcrumb, ID và tiêu đề, mức ưu tiên.
2. Nội dung giải thích gốc, giữ các đoạn liên kết ý nghĩa.
3. Ví dụ/công thức/code, mô phỏng liên quan nếu có.
4. Mẫu trả lời miệng.
5. Câu hỏi tiếp nối hoặc bẫy dễ nhầm.
6. Ghi chú và đánh giá mức hiểu.
7. Câu trước/sau, kiến thức liên quan.

Không phải câu nguồn nào cũng có nhãn phần giống nhau. Có câu bắt đầu trực tiếp bằng văn xuôi, không có “Hiểu:”. Phải hiển thị đầy đủ, không để parser làm mất đoạn.

Hai chế độ:

- **Đọc hiểu:** nội dung giải thích và ví dụ mở sẵn; không bắt mở nhiều accordion chỉ để đọc bài.
- **Tự trả lời:** hiển thị câu hỏi, vùng ghi nháp tùy chọn và nút “Xem giải thích”. Giữ câu trả lời/mẫu đáp ẩn cho tới khi chủ động mở. Đổi câu phải đưa trạng thái tiết lộ về đúng mặc định.

Tự đánh giá: **“Chưa hiểu” / “Hiểu một phần” / “Tự giải thích được”**. Đây là đánh giá của người học; gắn nhãn rõ, không hiển thị như điểm AI. Đã đọc và mức hiểu là hai trường riêng. Có thể sửa lựa chọn, không khóa đáp án.

Tooltip/nhấn vào thuật ngữ chỉ là tiện ích bổ sung; định nghĩa vẫn có đường xem bằng bàn phím và trên mobile. Không làm người dùng bị kẹt trong popover.

### 5.4. Tìm kiếm

Tìm theo ID, tiêu đề, nội dung và thuật ngữ Anh–Việt. Chuẩn hóa truy vấn không dấu, bao gồm `đ → d`, nhưng kết quả hiển thị nguyên bản có dấu.

Ưu tiên khớp ID chính xác, rồi tiêu đề, rồi nội dung. Kết quả có trích đoạn ngắn, mảng và mức. Hỗ trợ Enter mở, Esc đóng nếu là dialog. Phím `/` hoặc Ctrl/Cmd+K là tùy chọn và không chặn gõ trong input/textarea. Khi đi từ kết quả sang bài rồi Back, giữ truy vấn/bộ lọc.

### 5.5. Luyện vấn đáp

Hai nguồn:

- Bốn đề tổng hợp có sẵn, đúng 7 câu mỗi đề và gợi ý nguồn tương ứng.
- Tạo lượt 5 hoặc 7 câu theo mảng, mức ưu tiên hoặc tập câu cần ôn.

Mặc định “Tổng hợp bốn mảng”: khi mỗi mảng còn ít nhất một câu đủ điều kiện, chọn ít nhất một câu/mảng rồi bổ sung ngẫu nhiên không trùng. Nếu bộ lọc làm mất mảng hoặc còn ít hơn số câu yêu cầu, giải thích và cho chọn học số còn lại hoặc chỉnh bộ lọc; không lặp câu để lấp số.

Mỗi lượt giữ danh sách câu cố định, không random lại khi render hoặc tải lại. Chỉ hiển thị một câu/lần, ẩn gợi ý. Có timer tùy chọn và nút pause; hết giờ không tự nhảy câu hoặc làm mất nháp. Timer là công cụ luyện, không phải thời lượng chính thức của thầy.

Sau khi người học bấm xem đáp án, cho tự chấm 0/1/2 theo rubric nguồn. Kết thúc hiển thị câu đã chấm, câu bỏ qua và phần cần ôn; điểm chỉ tính câu đã chấm và ghi rõ mẫu số. Đề tổng hợp chứa câu gộp nhiều ý nên lưu đánh giá ở cấp câu đề; không tự gán điểm đó thành mức hiểu cho mọi concept liên quan. Cho đi tới các concept cần xem lại.

Không tự trừ điểm vì nói lâu. Không giả vờ đánh giá nội dung câu trả lời từ độ dài đoạn gõ hoặc thời gian suy nghĩ.

### 5.6. Ôn lại, ghi chú và tiện ích

- Danh sách ưu tiên ôn: “Chưa hiểu” → “Hiểu một phần” → đã lưu để ôn; các trạng thái có thể giao nhau nên không đếm trùng.
- Xem/sửa ghi chú theo câu; tự lưu với phản hồi nhỏ, không toast mỗi ký tự.
- Truy cập glossary, bảng công thức, 20 bài tự kiểm tra và các ví dụ Python cuối chuyên đề.
- Bài tự kiểm tra ẩn lời giải lúc đầu; đề bài không bị cắt mất.
- Nút xuất/nhập tiến độ và ghi chú, có ngày sao lưu; giải thích dữ liệu lưu trên trình duyệt hiện tại.

## 6. Bảo toàn nội dung và kiến trúc dữ liệu

### 6.1. Import nội dung có thể lặp lại

Nguồn có tổng **140 câu**, mỗi mảng **35**, tổng **72 A / 48 B / 20 C**. ID ổn định:

```text
XS01–XS35
ML01–ML35
DL01–DL35
GT01–GT35
```

Viết script import bằng Markdown AST, chẳng hạn unified/remark. Đọc nguồn tại build/dev; xuất dữ liệu cho trình duyệt vào thư mục generated. Người chạy app không cần filesystem API trong browser. Tách mã importer khỏi UI.

Điểm quan trọng:

- Heading câu trong XS/ML/DL hiện dùng `###`, GT dùng `##`; nhận diện theo ID và nhãn ưu tiên trong heading, không chỉ theo cấp heading.
- Kết thúc một câu ở heading tiếp theo có cấp bằng hoặc cao hơn heading câu, gồm cả heading không mang ID. Không nuốt cả phần glossary/bài tập cuối vào câu 35.
- Code fence có dấu `#` không phải heading câu; dùng AST để xử lý.
- Giữ văn xuôi, blockquote, list, table, code fence và nhãn in đậm. Công thức nguồn có Unicode, inline code, dấu `|` đã escape trong bảng.
- Phần dẫn nhập, nhóm concept, bảng công thức, bài tập, glossary và đề tổng hợp cần cấu trúc riêng, vẫn truy cập được trên website.
- Không dùng regex cắt mọi nội dung ở chữ “Ví dụ” hoặc “Trả lời” vì các từ đó có thể xuất hiện trong văn xuôi.
- Nếu không nhận diện chắc một tiểu mục, giữ nguyên block nguồn trong bài; không bỏ nội dung âm thầm.
- Thêm title/group/prerequisites/relatedIds/simulationIds trong metadata riêng. Kiểm tra liên kết tới ID tồn tại.
- Lưu source file tương đối, heading/line range và hash nội dung để truy vết. Chạy import trước build; build phải lỗi nếu dữ liệu generated không đầy đủ.

Có thể giữ `bodyMarkdown` nguyên vẹn để kiểm tra bảo toàn, đồng thời tạo các block có ngữ nghĩa cho giao diện. Nếu UI tách riêng mẫu trả lời, phải hiển thị mỗi block nguồn đúng một lần, tránh lặp nguyên bài rồi lặp lại mẫu đáp.

### 6.2. Schema gợi ý

```ts
type SubjectId = 'xs' | 'ml' | 'dl' | 'gt';
type Priority = 'A' | 'B' | 'C';
type Understanding = 'unknown' | 'partial' | 'confident';

interface Concept {
  id: string;
  subjectId: SubjectId;
  priority: Priority;
  title: string;
  groupTitle: string;
  order: number;
  bodyMarkdown: string;
  blocks: ContentBlock[]; // AST-derived, giữ các block không phân loại được
  relatedIds: string[];
  prerequisiteIds: string[];
  simulationIds: string[];
  source: { file: string; heading: string; startLine: number; endLine: number; hash: string };
}

interface ConceptProgress {
  readAt?: string;
  understanding?: Understanding; // undefined = chưa tự đánh giá
  bookmarked: boolean;
  note: string;
  updatedAt: string;
}
```

Đây là khung đề xuất, hãy định nghĩa `ContentBlock`, `Module`, `Exercise`, `Exam`, `ExamSession` và schema storage đầy đủ, phù hợp triển khai. Session cần lưu thứ tự ID, index hiện tại, nháp, đã mở đáp án hay chưa và tự chấm theo từng câu. Dùng ID riêng cho câu đề, ví dụ `exam-1-q1`; không giả định mọi câu đề tương ứng đúng một concept.

### 6.3. Storage và khôi phục

- Dùng `localStorage` với version schema cho quy mô cá nhân này, hoặc IndexedDB nếu có lý do cụ thể.
- Lưu theo ID ổn định, không theo số thứ tự đang lọc.
- Dữ liệu có `schemaVersion`, `contentVersion`, `updatedAt`; migration không xóa ghi chú.
- JSON hỏng hoặc hết quota không làm app trắng trang; hiển thị lỗi và cho xuất phần còn đọc được.
- Import phải kiểm tra schema, giới hạn kích thước hợp lý, ID và kiểu dữ liệu; preview số mục hợp lệ/không còn tồn tại trước khi hợp nhất hoặc thay thế.
- Export bao gồm ghi chú, bookmark, đánh giá và session cần khôi phục; không chỉ xuất vài con số thống kê.
- Thao tác xóa tiến độ cần xác nhận rõ. Ghi chú nhập từ file phải render như văn bản an toàn.
- Khi mở nhiều tab, đồng bộ thay đổi storage hợp lý hoặc cảnh báo xung đột; không ghi đè bằng state cũ chỉ vì tab cũ được focus.

## 7. Stack, routing và cấu trúc code đề xuất

Nếu chưa có app, dùng **React + TypeScript + Vite**, React Router, CSS variables/CSS Modules hoặc Tailwind theo lựa chọn có lý do. Tránh thêm framework/server chỉ để hiển thị dữ liệu local.

Thư viện gợi ý:

- Markdown AST: unified, remark-parse, remark-gfm; renderer React phù hợp.
- KaTeX chỉ cho các biểu thức đã chuyển đúng sang math syntax; không tự đoán mọi inline code là LaTeX.
- Icon từ một bộ như Lucide.
- Mô phỏng đơn giản bằng SVG/HTML với React; dùng thư viện chart nhẹ khi nó giải quyết vấn đề thật.
- Vitest cho logic/parser/storage; Playwright cho hành trình trình duyệt nếu môi trường có hỗ trợ.

Render code Python có syntax highlight, copy và cuộn ngang riêng. Không cần chạy Python trong browser. Chặn raw HTML không được tin cậy, URL nguy hiểm và cách render bằng `dangerouslySetInnerHTML` không có kiểm soát.

Routing gợi ý:

```text
/#/                         Bắt đầu / Tiếp tục
/#/guide                    Bản đồ kiến thức và cách học
/#/subjects/:subjectId      Mục lục một mảng
/#/learn/:conceptId         Đọc một câu/concept
/#/review                   Các câu cần ôn
/#/practice                 Chọn lượt luyện vấn đáp
/#/practice/:sessionId      Lượt đang làm / kết quả
/#/reference/:subjectId     Bảng công thức, glossary, code và bài tập
/#/settings                 Cỡ chữ và sao lưu dữ liệu
```

Hash routing là mặc định đề xuất để link sâu hoạt động trên static hosting mà không cần rewrite server. Nếu dùng history routing, phải cấu hình và kiểm tra refresh URL sâu. Browser Back/Forward phải hoạt động đúng; route lạ có màn hình quay về học.

Cấu trúc gợi ý:

```text
web/
  scripts/import-content.ts
  src/
    app/              routing, layout, providers
    content/          generated data, metadata, schema
    features/
      reader/
      search/
      progress/
      practice/
      simulations/
      reference/
    components/       UI primitives có semantics
    lib/              storage, search normalization, sampling, math
    styles/           tokens, typography, responsive
  tests/
  public/fonts/
  PRODUCT.md          phạm vi app, tham chiếu PRODUCT cấp workspace
  DESIGN.md           token và nguyên tắc giao diện thực tế đã triển khai
  README.md           lệnh chạy, build, dữ liệu, kiểm thử, giới hạn
```

Giữ một lockfile và phiên bản phụ thuộc tương thích. Viết các module theo trách nhiệm; không dồn importer, UI, storage và mô phỏng vào một file lớn.

## 8. Tám mô phỏng bắt buộc

Mỗi mô phỏng cần: **câu hỏi gợi mở → hình/trạng thái → điều khiển → kết quả bằng số và chữ → kết luận có điều kiện**. Có Reset về ví dụ gốc. Phân biệt dữ liệu minh họa và dữ liệu thực tế; không gắn số liệu mô phỏng với kết quả thi hay hiệu quả học đã được kiểm chứng.

### 8.1. Mean, median và ngoại lệ: XS05, XS06

- Bắt đầu từ [1, 2, 3, 4, 10]. Dùng dot plot hoặc trục số thể hiện từng điểm, vạch mean và median.
- Cho thay điểm cuối bằng slider/input 4–100; đồng thời cập nhật mean, median, phương sai và SD.
- Ghi rõ đang tính phương sai mô tả của toàn bộ n điểm, chia n; nếu có toggle phương sai mẫu thì chia n−1 và giải thích.
- Câu gợi mở: “Khi kéo một điểm ra rất xa, trung bình hay trung vị thay đổi mạnh hơn?”
- Kiểm thử preset: mean=4, median=3, phương sai tổng thể=10, phương sai mẫu=12,5.

### 8.2. Bayes và tỷ lệ nền: XS11, XS12, XS13

- Ba điều khiển: tỷ lệ mắc, độ nhạy, tỷ lệ dương tính giả; giải thích mỗi nhãn bằng câu thường.
- Dùng cây xác suất hoặc bảng 2×2, quần thể giả định N=10.000.
- Tính TP=N×p×sensitivity; FN=N×p×(1−sensitivity); FP=N×(1−p)×FPR; TN=N×(1−p)×(1−FPR).
- Hiện `P(có bệnh | dương tính)=TP/(TP+FP)` và so với sensitivity; làm nổi bật hai mẫu số khác nhau.
- Các số có thể là số lượng kỳ vọng dạng thập phân; nếu làm tròn chỉ làm ở hiển thị, không dùng số đã làm tròn để tính lại xác suất.
- Khi không có dương tính, ghi “Không xác định vì mẫu số bằng 0”. Đây là ví dụ xác suất giả định, không phải công cụ chẩn đoán.
- Preset p=1%, sensitivity=90%, FPR=10% cho posterior xấp xỉ 8,33%.

### 8.3. Confusion matrix và ngưỡng: ML29, ML30, ML31

- Dataset minh họa cố định, có nhãn thật và score trong [0,1], gồm ít nhất 20 mẫu và cả hai lớp.
- Một slider threshold: dự đoán dương khi score ≥ threshold; tính lại TP/FP/FN/TN từ dữ liệu, không hardcode metric theo slider.
- Hiện confusion matrix, precision/recall/accuracy/F1, số ca bỏ sót và báo nhầm.
- Chọn một ô để highlight đúng các mẫu thuộc ô đó; có nội dung tương đương bằng text/bảng.
- Giá trị không xác định hiện “-” kèm lý do. Nếu dùng quy ước gán 0 phải nêu rõ và thống nhất công thức; ưu tiên tách undefined khỏi 0 thật.
- Giải thích giảm threshold thường tăng recall theo tập cố định, còn precision không bắt buộc thay đổi đơn điệu.

### 8.4. Độ phức tạp và overfitting: ML16, ML17, ML18

- Sinh dataset hồi quy một chiều bằng seed cố định, tách train/validation cố định trước khi fit; ghi rõ synthetic data.
- Cho chọn bậc đa thức 1–7, vẽ điểm train/validation, đường dự đoán và MSE trên hai tập.
- Chỉ dùng train để khớp hệ số. Dùng least squares/ridge nhẹ với phương pháp số ổn định, chuẩn hóa x thích hợp; tránh nghịch đảo ma trận ngây thơ thiếu kiểm tra.
- Kiểm tra kết quả hữu hạn; nếu nghiệm không ổn định thì xử lý rõ, không để NaN vẽ lên biểu đồ.
- Kết quả phải tính từ mô hình thật; không tạo đường validation luôn tăng chỉ để minh họa câu chuyện. Ghi rõ đây là một ví dụ, không phải định luật rằng mọi lần tăng bậc đều gây overfit.
- Đặt câu hỏi “Mô hình nào khớp train tốt nhất? Mô hình nào tốt nhất trên validation? Vì sao có thể khác?”

### 8.5. Một nơ-ron tính gì: DL03, DL05, DL06

- Sơ đồ hai đầu vào x1,x2 → nhân w1,w2 → cộng bias → activation → đầu ra.
- Cho đổi inputs, weights, bias và activation Linear/ReLU/Sigmoid; cập nhật công thức với số cụ thể.
- Hiện z và a riêng, tránh gọi đầu ra ReLU là xác suất.
- Preset x1=2, x2=1, w1=3, w2=−1, b=0 cho z=5; ReLU=5, sigmoid≈0,9933.
- Có ví dụ z<0 để thấy ReLU về 0. Nếu dùng slider phải có input số/keyboard tương đương.

### 8.6. Gradient descent: DL09, DL10, DL11, DL13

- Vẽ `L(w)=(w−3)²`; hiển thị điểm hiện tại, gradient `2(w−3)` và phép cập nhật.
- Điều khiển w ban đầu, learning rate, “Một bước”, “Chạy”, “Dừng”, “Reset”.
- Cho quan sát tốc độ chậm, hội tụ, dao động và phân kỳ bằng learning rate phù hợp. Giới hạn số bước và dừng an toàn khi trị số vượt miền biểu diễn; giải thích thay vì âm thầm clamp trọng số.
- Timer chạy phải được dọn khi đổi route, đổi preset hoặc Reset; không có hai vòng chạy chồng nhau.
- Preset w=1, lr=0,1 cho bước tiếp w=1,4; lr=1 dao động quanh 3 khi bắt đầu khác 3; lr>1 có thể phân kỳ trong hàm ví dụ.
- Nói rõ đây là tối ưu một tham số trên hàm đơn giản, không mô phỏng toàn bộ backprop của mạng lớn.

### 8.7. Binary search từng bước: GT02, GT12, GT13

- Mảng có thứ tự, hiển thị chỉ số và giá trị; inputs cho mảng và target, nút bước tới/reset, chạy tự động tùy chọn.
- Highlight left/right/mid, phạm vi còn lại và đoạn bị loại; cạnh đó là lời giải thích bước hiện tại.
- Kiểm tra mảng có thứ tự; báo lỗi dễ hiểu nếu chưa sắp xếp hoặc có giá trị không hợp lệ. Có nút sắp xếp chủ động và nêu dữ liệu đang đổi, không tự sửa mà không báo.
- Hỗ trợ không tìm thấy, mảng rỗng, một phần tử và trùng lặp; kết quả là một vị trí hợp lệ, không hứa vị trí đầu nếu chưa triển khai biến thể.
- Preset [1,3,5,7,9], target=8 cho các mid 2→3→4 rồi không tìm thấy.
- Có phiên bản text liệt kê từng bước; không chỉ dựa vào màu hoặc chuyển động.

### 8.8. BFS và DFS: GT08, GT09, GT24, GT26, GT27

- Đồ thị nhỏ cố định khoảng 6–8 đỉnh; có chu trình và một đỉnh không đi tới được từ nguồn mặc định.
- Chọn nguồn, BFS/DFS, bước tới/reset; hiển thị đồ thị, frontier (queue/stack), tập đã thăm và thứ tự duyệt.
- Thứ tự láng giềng cố định và công khai để mỗi lần chạy cho cùng kết quả.
- Dùng visited phù hợp để tránh vòng lặp; biểu diễn nhất quán với code đang minh họa.
- BFS hiển thị khoảng cách theo số cạnh; DFS không được gắn nhãn là đường ngắn nhất.
- Đỉnh cô lập và đồ thị chỉ duyệt được một phần phải có trạng thái rõ; nếu chỉ một nguồn thì không giả vờ đã duyệt toàn đồ thị.
- Có bảng/text tương đương cho người dùng bàn phím hoặc không nhìn rõ sơ đồ.

## 9. Trạng thái biên và chất lượng sử dụng

- Tải dữ liệu: không tạo skeleton giả nếu dữ liệu local đã sẵn; nếu thực sự lazy-load thì có loading/error/retry.
- Không có tiến độ: hướng dẫn bắt đầu, không dashboard toàn số 0 với lời thúc ép.
- Không có kết quả tìm kiếm/lượt luyện: có hành động để phục hồi.
- Nút disabled có nguyên nhân hiểu được; không tạo hàng nút chưa hoạt động.
- Fallback khi clipboard hoặc localStorage không khả dụng; tránh crash toàn app.
- Nút quay lại, URL sâu, refresh, chọn câu từ search đều đưa tới đúng bài.
- Tất cả nút có accessible name; label cho inputs, visible focus, focus trap/restore cho dialog.
- Contrast đạt WCAG AA: chữ thường tối thiểu 4,5:1; không giả định palette đề xuất đã đạt trên mọi tổ hợp.
- Kích thước chạm khoảng 44×44px cho điều khiển chính; vẫn dùng được ở zoom 200%.
- `lang="vi"`, heading hierarchy hợp lý; nội dung thay đổi quan trọng có thông báo phù hợp, không đọc mỗi frame animation qua screen reader.
- Bảng có header; biểu đồ có tiêu đề, đơn vị, caption và kết quả text. Số lớn/nhỏ phải định dạng nhất quán.
- Tránh dùng phím tắt khi người dùng đang gõ nháp/ghi chú hoặc đang thao tác input slider.
- Code và công thức không làm layout toàn trang tràn ngang ở 360px.

## 10. Kế hoạch triển khai theo mốc kiểm chứng

### Mốc 1: Kiểm kê nội dung và nền app

1. Đọc quy tắc workspace, PRODUCT, README và toàn bộ sáu nguồn chính.
2. Liệt kê cấu trúc heading, 140 ID, phân bố A/B/C, các phần ngoài câu hỏi và định dạng đặc biệt.
3. Tạo scaffold app; xây importer và schema, metadata còn thiếu ghi riêng.
4. Tạo báo cáo content inventory trong app; test số lượng, ID, link và phần ngoài câu.

**Qua mốc khi:** import lặp lại được, có đủ dữ liệu, một bài mỗi mảng render đúng gồm bảng/code/Unicode; build không cần truy cập đường dẫn máy tác giả.

### Mốc 2: Luồng học P0

1. Làm layout responsive, trang bắt đầu, mục lục và reader trên nội dung thật.
2. Làm search, lọc, điều hướng và đọc/tự trả lời.
3. Làm progress, notes, bookmarks, resume và backup/restore.
4. Làm bài tập và luyện đề có sẵn/ngẫu nhiên, xử lý hết câu và tự chấm.

**Qua mốc khi:** học từ trang đầu tới một lượt vấn đáp và quay lại ôn được; reload không mất tiến độ. Cung cấp cách mở bản local ngay ở mốc này rồi tiếp tục P1.

### Mốc 3: Trực quan hóa P1

1. Ưu tiên một mô phỏng mỗi mảng: mean/median, confusion matrix, nơ-ron, binary search.
2. Tiếp theo: Bayes, overfit, gradient descent, BFS/DFS.
3. Gắn vào bài tương ứng, thêm giải thích trạng thái, reset và phương án text/keyboard.
4. Test số liệu và điều kiện biên trước khi làm đẹp animation.

**Qua mốc khi:** đủ tám mô phỏng tính toán thật; điều khiển thay đổi kết quả đúng; không còn NaN/undefined không được giải thích.

### Mốc 4: Kiểm tra và bàn giao

1. Chạy typecheck, tests và production build.
2. Kiểm tra hành trình thật bằng trình duyệt trên desktop/mobile, cả reader dài và bảng/code rộng.
3. Sửa lỗi phát hiện; chụp lại màn hình các trạng thái đã sửa, không tự coi build thành công là UX đạt.
4. Hoàn thành README, DESIGN, báo cáo nội dung, kết quả test và giới hạn còn lại.

**Qua mốc khi:** tiêu chí nghiệm thu ở mục 11 đạt, hoặc có báo cáo cụ thể phần bị chặn bởi môi trường. Không kết thúc bằng lời hứa “có thể làm tiếp” khi vẫn còn phần bắt buộc triển khai được.

### Nếu dùng nhiều agent

Có thể chia công việc sau khi thống nhất schema, routes, props và tokens:

- Content: importer, generated data, content validation.
- App: layout, reader, search, reference, responsive.
- Learning state: progress/storage, backup, practice/session.
- Simulations: math logic, tám component, unit tests.

Chỉ định file/module sở hữu rõ; không để nhiều agent sửa cùng layout/config; một người tích hợp và kiểm tra toàn bộ. Chạy song song không thay thế kiểm tra luồng xuyên suốt. Nếu công cụ không hỗ trợ agent, làm tuần tự theo các mốc, không chặn task.

## 11. Tiêu chí nghiệm thu cụ thể

### Nội dung

- [ ] 140 ID duy nhất: mỗi prefix có 01–35, mỗi mảng 18 A / 12 B / 5 C.
- [ ] Đủ dẫn nhập, nhóm concept, 20 bài và lời giải, bốn đề 7 câu cùng gợi ý.
- [ ] Glossary, bảng công thức và hai code Python ở GT truy cập được.
- [ ] Không mất đoạn văn không có nhãn; GT35 không nuốt phần phụ lục.
- [ ] Không nhập nhầm 16 câu bản ngắn vào số đếm 140.
- [ ] Markdown table có xác suất điều kiện, dấu tiếng Việt, code và công thức render đúng.
- [ ] Links giữa concept và mô phỏng trỏ đúng ID tồn tại.

### Hành vi

- [ ] Tìm “xac suat”, “độ lệch chuẩn”, “do lech chuan”, “ML30”, “backprop” ra kết quả phù hợp.
- [ ] Chọn câu, lọc, Back/Forward và refresh URL sâu giữ đúng trang.
- [ ] Đã đọc không tự biến thành đã hiểu; ghi chú/đánh giá còn sau reload.
- [ ] Xuất rồi nhập lại khôi phục được ghi chú và tiến độ; JSON lỗi có phản hồi và không phá dữ liệu hiện có.
- [ ] Lượt tổng hợp đủ bốn mảng khi bộ lọc cho phép, 5/7 câu không trùng, thứ tự giữ sau reload.
- [ ] Session resume đúng câu và trạng thái đáp án/nháp; hết câu có màn hình kết quả thật.
- [ ] Bỏ qua khác điểm 0; tự chấm không được gọi là chấm bằng AI.
- [ ] Mỗi mô phỏng có kiểm thử logic độc lập và reset đúng preset.

### Trình bày và kỹ thuật

- [ ] Kiểm tra ít nhất 1440×900, 1024×768, 390×844 và chiều rộng 360px.
- [ ] Zoom 200%, bàn phím và reduced motion vẫn đọc/học được.
- [ ] Mục lục mobile mở/đóng được, focus trả đúng nơi, footer không che nội dung.
- [ ] Không lỗi console nghiêm trọng; không NaN trên biểu đồ; timers dừng khi rời mô phỏng.
- [ ] Production build chạy qua preview, không chỉ dev server.
- [ ] Cốt lõi không gọi dịch vụ AI, tracking hoặc backend; font/assets local không cần mạng sau khi trang được phục vụ.
- [ ] Không hứa offline toàn bộ nếu chưa triển khai và kiểm tra service worker/cache.
- [ ] Không có placeholder, số liệu tiến độ bịa, nút chết hoặc link localhost được ghi cứng vào app.

Test nên nhắm vào rủi ro thật: parser mất câu, chia nhầm phần, xác suất mẫu số 0, lấy mẫu đề trùng, persistence/session, thuật toán và navigation. Không cần snapshot mọi đoạn văn chỉ để tăng số lượng test.

## 12. Hồ sơ bàn giao và cách báo kết quả

Để lại trong thư mục app:

1. Source code hoàn chỉnh, lockfile và cấu hình build.
2. README: cài đặt, chạy dev, build, preview; cách cập nhật nguồn và import lại; lưu/sao lưu tiến độ; giới hạn.
3. DESIGN.md: tokens, font, layout, components, trạng thái và responsive thực tế dùng.
4. CONTENT-REPORT.md: số nguồn, số câu/mức, bài tập/đề/phụ lục và các ngoại lệ parser nếu có.
5. VERIFICATION.md: lệnh đã chạy, kết quả, hành trình đã kiểm tra, các ảnh desktop/mobile thực tế.

Lời bàn giao cuối cần ngắn và cụ thể: thư mục app, lệnh chạy, bản nào đã mở kiểm tra, chức năng đã hoàn thành, giới hạn thực sự còn lại. Không báo “đã test” nếu chỉ đọc code; không báo “đã deploy” khi chỉ chạy local.

**Bắt đầu bằng việc đọc các file nguồn, kiểm kê và tạo importer. Sau đó triển khai từng mốc tới khi ứng dụng học hoàn chỉnh hoạt động được.**
