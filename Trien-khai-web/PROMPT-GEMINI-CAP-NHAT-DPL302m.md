# Prompt cho Gemini: cập nhật website bằng bộ DPL302m mới

Bạn đang tiếp tục phát triển website học vấn đáp đã có tại:

```text
F:\dpl13.10\On-tap-van-dap\web
```

Hãy trực tiếp cập nhật ứng dụng hiện tại, chạy kiểm thử và bàn giao kết quả hoạt động được. Nhiệm vụ là đưa bộ kiến thức Deep Learning theo môn DPL302m vừa được bổ sung vào website. Giữ giao diện và chức năng hiện có, mở rộng nơi cần thiết để học bộ mới thuận tiện; không dựng lại một app khác.

## 1. Bối cảnh và mục tiêu

Tôi học môn DPL302m, đang ôn vấn đáp từ nền tảng còn yếu. Bộ ban đầu có 140 câu thuộc Xác suất thống kê, ML, DL và Giải thuật, nhưng 35 câu DL của bộ đó chưa bao phủ đủ chương trình môn học.

Đã có một bộ bổ sung **72 câu DPL302m theo 5 chương**, được biên soạn từ text trích 17 bộ slide, với giải thích dễ hiểu, ví dụ, mẫu trả lời và câu hỏi tiếp nối. Hãy nhập đúng bộ đã biên soạn, không tự thay bằng nội dung rút gọn hoặc tự sinh lại 72 câu.

Trải nghiệm tôi muốn tiếp tục dùng:

**Đọc hiểu → thử ví dụ/mô phỏng liên quan → tự trả lời → xem giải thích → đánh dấu mức hiểu → ôn phần yếu.**

Kết quả cần đạt: bộ cũ và bộ mới cùng sử dụng được, nhưng DPL302m được ưu tiên trong điều hướng vì đây là môn tôi đang học. Tiến độ và ghi chú cũ phải còn nguyên.

## 2. Đọc các nguồn sau trước khi sửa code

Quy tắc workspace và bối cảnh sản phẩm:

```text
F:\dpl13.10\PRODUCT.md
F:\dpl13.10\On-tap-van-dap\README.md
F:\dpl13.10\On-tap-van-dap\DPL302m\README.md
F:\dpl13.10\On-tap-van-dap\DPL302m\manifest.json
F:\dpl13.10\On-tap-van-dap\Trien-khai-web\CAP-NHAT-NOI-DUNG-DPL302m.md
```

Năm file phải được nhập đầy đủ:

```text
F:\dpl13.10\On-tap-van-dap\DPL302m\01-Neural-network-foundations.md
F:\dpl13.10\On-tap-van-dap\DPL302m\02-Huan-luyen-va-toi-uu.md
F:\dpl13.10\On-tap-van-dap\DPL302m\03-ML-strategy-va-error-analysis.md
F:\dpl13.10\On-tap-van-dap\DPL302m\04-CNN-va-thi-giac-may-tinh.md
F:\dpl13.10\On-tap-van-dap\DPL302m\05-RNN-NLP-va-Transformer.md
```

Nguồn gốc để đối chiếu khi cần, không nhập thẳng toàn bộ vào reader:

```text
F:\1. FPT Material\Sem5\DPL302m\extracted_texts
F:\1. FPT Material\Sem5\DPL302m\summaries
F:\1. FPT Material\Sem5\DPL302m\SLIDE_CURRICULUM_MAP.md
```

Text extraction có marker slide thực tế; một số mốc trang trong map bị lệch. Dùng dẫn nguồn đã ghi trong các chương mới. Các summaries là nguồn tham khảo, không phải đáp án luôn đúng để tự ghi đè tài liệu.

Đọc `web/README.md`, `web/DESIGN.md`, `web/CONTENT-REPORT.md`, `web/VERIFICATION.md`, `package.json` và các file triển khai liên quan. Báo cáo cũ chỉ mô tả lần kiểm tra trước, không thay cho việc chạy lại sau cập nhật. Nếu có AGENTS.md áp dụng, đọc và tuân thủ.

## 3. Số liệu nội dung phải đúng

### Bộ cũ: foundations

- 140 câu, gồm XS01–XS35, ML01–ML35, DL01–DL35, GT01–GT35.
- Nhãn A/B/C, tổng 72 A, 48 B, 20 C.
- 20 bài tự kiểm tra và 4 đề tổng hợp, mỗi đề 7 câu.
- Mã câu, nội dung, URL đang dùng và dữ liệu tiến độ phải tiếp tục hoạt động.

### Bộ bổ sung: dpl302m

| Chương | File | ID | Tổng | Cốt lõi | Đọc tiếp |
|---|---|---|---:|---:|---:|
| 1. Neural network foundations | 01-Neural-network-foundations.md | DPL1-01–DPL1-12 | 12 | 11 | 1 |
| 2. Huấn luyện và tối ưu | 02-Huan-luyen-va-toi-uu.md | DPL2-01–DPL2-14 | 14 | 11 | 3 |
| 3. ML strategy/error analysis | 03-ML-strategy-va-error-analysis.md | DPL3-01–DPL3-10 | 10 | 8 | 2 |
| 4. CNN/thị giác máy tính | 04-CNN-va-thi-giac-may-tinh.md | DPL4-01–DPL4-18 | 18 | 14 | 4 |
| 5. RNN/NLP/Transformer | 05-RNN-NLP-va-Transformer.md | DPL5-01–DPL5-18 | 18 | 13 | 5 |
| Tổng | | | **72** | **57** | **15** |

Bộ mới có **19 bài tự kiểm tra**: chương 1/2/4/5 mỗi chương 4 bài, chương 3 có 3 bài; kèm glossary và hướng dẫn theo từng chương.

Khi hiển thị toàn thư viện: **212 mục hỏi**, **39 bài tự kiểm tra**, giữ 4 đề tổng hợp cũ. Tổng này không tính mỗi câu trong đề tổng hợp như một concept mới. Có nội dung chồng lấn giữa hai bộ; không quảng bá là 212 khái niệm độc lập hoặc toàn bộ kiến thức ngành.

## 4. Những chỗ trong code hiện có cần kiểm tra trước

Cấu trúc ghi nhận lúc chuẩn bị prompt:

```text
scripts/import-content.ts
src/content/types.ts
src/content/metadata.ts
src/content/generated/
src/lib/storage.ts
src/lib/sampling.ts
src/lib/search.ts
src/app/App.tsx
src/components/layout/Sidebar.tsx
src/features/home/HomeView.tsx
src/features/subjects/SubjectTocView.tsx
src/features/reader/ConceptReader.tsx
src/features/practice/PracticeHub.tsx
src/features/practice/PracticeSessionView.tsx
src/features/review/ReviewView.tsx
src/features/reference/ReferenceView.tsx
src/features/search/SearchModal.tsx
src/features/settings/SettingsView.tsx
```

Xác minh lại code vì có thể đã thay đổi sau khi prompt này được viết. Các điểm đã quan sát:

1. Importer đang lấy nguồn từ `../../Chuyen-de`, cần thêm bộ `../../DPL302m`.
2. `parseConceptBlocks` có nhận “Trả lời miệng”/“Trả lời”, nhưng chưa nhận “Mẫu đáp”. Bộ mới dùng cả hai cách viết.
3. `computeUserStats` trong `src/lib/storage.ts` đang có `totalConcepts = 140`, vòng lặp 1..35 và bốn prefix XS/ML/DL/GT. Cần tính từ danh mục dữ liệu thực, theo collection/filter.
4. Storage key hiện tại là `on_van_dap_user_data_v1`. Không đổi key rồi bỏ dữ liệu cũ.
5. Importer có hàm hash rút gọn sau `.trim()`, trong khi manifest DPL có SHA-256 đầy đủ theo byte file. Nếu kiểm tra hash manifest, dùng đúng cách hash; không so hai loại hash rồi báo sai nội dung.

Không thay đồng loạt chuỗi “140” thành “212”: các báo cáo/check của bộ foundations vẫn cần 140, thống kê DPL cần 72, toàn thư viện cần 212.

## 5. Mở rộng importer và dữ liệu

### Collection và cấp nội dung

Thêm khái niệm collection độc lập với subject và chapter:

- `foundations`: bốn mảng nền tảng.
- `dpl302m`: khóa học DL có năm chương và 17 bài nguồn.

Có thể giữ `subjectId: dl` cho câu DPL nhưng bắt buộc phân biệt bằng collection/chapter để các màn hình không vô tình gom mọi câu DL mới vào mục cũ “35 câu”. Không biến năm chương DPL thành năm môn học mới chỉ để dùng lại union SubjectId.

Schema gợi ý, điều chỉnh phù hợp code đang có:

```ts
type CollectionId = 'foundations' | 'dpl302m';
type StudyLevel = 'core' | 'further';

interface CourseMetadata {
  collectionId: CollectionId;
  chapterId?: string;
  lessonIds?: string[];
  studyLevel?: StudyLevel;
  sourceReferences?: SourceReference[];
}
```

Giữ `priority: A | B | C` cho bộ cũ. Đối với câu DPL, dùng `studyLevel`; không tự quy “Cốt lõi=A” hoặc “Đọc tiếp=C”. Cho schema biểu diễn rõ hai trường hợp, tránh gán priority giả chỉ để compiler hết lỗi.

### Bảo toàn Markdown

- Nhận dạng heading mới như `## DPL1-01 [Cốt lõi] ...` và `[Đọc tiếp]`.
- Dùng Markdown AST hoặc parser đủ chắc để không nhầm heading trong code fence. Đừng mở rộng bằng các regex làm mất cấu trúc bảng/list/code.
- Câu kết thúc trước heading cùng cấp hoặc cấp cao hơn. Phụ lục sau câu cuối không được bị nuốt vào câu cuối.
- Giữ các nhãn “Nguồn”, “Hiểu từ đầu”, “Ví dụ”, “Mẫu đáp”, “Trả lời miệng”, “Hỏi tiếp”, “Bẫy” và các biến thể thực sự có trong file.
- Một số đoạn không có nhãn; giữ nguyên chúng dưới dạng prose, không bỏ đi vì không parse được.
- Chương 1 trình bày bốn bài tập trong một ordered list, khác các chương dùng heading “Bài 1…”. Phải nhập đủ cả hai dạng.
- Lời giải nằm cùng list item hoặc dưới nhãn lời giải cần được phân biệt với đề bài khi UI ẩn đáp án. Không cắt nhầm dấu mũi tên trong công thức thành điểm bắt đầu lời giải của mọi block.
- Giữ nguồn thô để kiểm tra, nhưng renderer chỉ hiển thị mỗi block một lần. Tránh vừa render cả body vừa lặp lại các block riêng.
- README và manifest là hướng dẫn/metadata, không tạo thêm câu hỏi giả từ heading của chúng.
- Tạo generated data bằng script có thể chạy lại; không sửa bằng tay rồi để lần `prebuild` sau ghi đè mất.
- Không đổi Markdown nguồn chỉ để nó vừa parser. Nếu phát hiện vấn đề nội dung thật, báo rõ và tách khỏi thay đổi importer.

### Nguồn và công thức

Hiển thị gọn tên bài + marker slide. Không tạo link trình duyệt tới ổ F: hoặc `file://` giả vờ mở được trên host khác. Dùng thông tin nguồn như text hoặc route nội bộ phù hợp.

Giữ ghi chú giới hạn extraction, nội dung được diễn giải lại, và GPT là phần bổ sung trong DPL5-18. Công thức inline code/Unicode phải đọc được ngay; chỉ chuyển sang KaTeX khi kiểm tra được biểu thức và không làm đổi nghĩa.

Manifest có `sourceRoot` là đường dẫn dùng trên máy tác giả. Website build xong phải chạy không cần truy cập thư mục ngoài workspace tại runtime.

## 6. Điều hướng và các màn hình học

### Trang đầu và sidebar

- Thêm lối vào ưu tiên **“Deep Learning: DPL302m”**, mô tả “72 câu theo 5 chương”.
- Có lối vào **“Nền tảng chung”** cho bốn mảng cũ.
- Nếu có câu học dở, giữ nút “Tiếp tục học” trỏ đúng ID trước đó, dù thuộc bộ nào.
- Trạng thái đầu tiên là chưa đọc/chưa đánh giá; không điền tiến độ demo.
- Bố cục/màu/font/component kế thừa website đã làm; chỉ bổ sung nhóm điều hướng cần thiết.

### Trang khóa học và chương

- Khóa DPL có năm chương, số câu và tiến độ riêng.
- Mỗi chương có danh sách câu theo thứ tự nguồn, lọc “Tất cả / Cốt lõi / Đọc tiếp / Cần ôn”.
- Có bảng nối 17 bài với câu học từ README để tra cứu theo bài 1.1…5.4, không cần tạo 17 bản sao nội dung.
- Tính progress theo đúng tập ID đang hiển thị. Lọc Cốt lõi phải có mẫu số 57 trên toàn DPL, hoặc số core của chương đó.
- Giải thích ngắn mức ưu tiên là thứ tự học, không dự báo đề thi.

### Reader

- Tái sử dụng reader hiện có cho câu DPL, hiển thị collection/chapter, ID, mức học và nguồn.
- Previous/Next đi theo thứ tự trong chương/collection đang học, không nhảy giữa DPL và bộ DL cũ do sort chuỗi toàn cục.
- Nếu đang học một danh sách lọc, quyết định rõ Previous/Next đi trong danh sách lọc hay chương và hiển thị nhất quán.
- Câu cũ và mới đều dùng được bookmark, ghi chú, cỡ chữ, trạng thái đã đọc và tự đánh giá.
- Chế độ tự trả lời phải thực sự ẩn “Mẫu đáp”/“Trả lời miệng”, và các phần gợi ý trả lời theo quy tắc hiện có. Chuyển câu phải reset reveal đúng cách.
- Liên kết đến file Markdown/chương/câu cũ chuyển thành route app nếu có thể phân giải; nếu nguồn chỉ nhắc một mã bằng chữ, metadata có thể thêm link chính xác. Không bịa mapping một câu với mọi bài nguồn của chương.

### Search và ôn lại

- Tìm kiếm theo ID cũ/mới, tiêu đề, nội dung, Anh–Việt và không dấu (`đ → d`).
- Thử `DPL4-13`, `IoU`, `NMS`, `gradient checking`, `LSTM`, `broadcasting`, `xac suat`, `DL07`.
- Hiển thị collection/chương trong kết quả để phân biệt câu trùng concept.
- Review có lọc collection; mỗi ID chỉ xuất hiện một lần dù vừa bookmark vừa đánh dấu chưa hiểu.
- Không gộp đánh giá của câu DPL với câu DL cũ chỉ vì giống chủ đề: người dùng có thể hiểu câu nhập môn nhưng chưa hiểu câu tính toán.

### Tài liệu tham khảo và bài tập

- Đủ 19 bài mới, cùng glossary, bảng/công thức, hướng dẫn ở đầu/cuối chương.
- Giữ 20 bài và 4 đề cũ, không ghi đè referenceSections theo key `dl` khiến dữ liệu hai bộ trùng nhau.
- Có đường mở phần bài tập/glossary dễ tìm từ mỗi chương.
- Bài tập có đề trước, lời giải mở sau; bố cục table/code dài không tràn ngang toàn trang ở mobile.

## 7. Luyện vấn đáp

Thêm lựa chọn **“DPL302m”** cho lượt 5 hoặc 7 câu, lọc theo chương và mức học. Giữ các lựa chọn cũ và bốn đề tổng hợp có sẵn.

Với chế độ tổng hợp DPL:

- Nếu đủ năm chương trong pool và chọn ít nhất năm câu, lấy ít nhất một câu mỗi chương rồi chọn số còn lại không trùng.
- Nếu lọc chỉ còn một vài chương, phân bổ theo pool thực và giải thích phạm vi, không bí mật kéo câu ngoài filter vào.
- Nếu pool ít hơn số cần, cho chọn số còn lại hoặc sửa bộ lọc; không lặp câu để đủ số.
- Danh sách ID được chọn một lần và lưu session; không random lại sau render/reload.
- Tự chấm 0/1/2, bỏ qua khác điểm0, điểm là tự đánh giá chứ không phải AI đã nghe câu trả lời.
- Session cũ đang làm vẫn khôi phục đúng câu, thứ tự, nháp, điểm và trạng thái mở đáp án. Không thêm câu mới vào session đang tồn tại.

## 8. Bảo toàn dữ liệu người học

Kiểm tra đầy đủ `storage.ts`, các hooks/listeners và import/export, không chỉ đổi version.

- Giữ key hiện tại nếu schema tương thích. Nếu cần migration, viết migration có version, chạy lặp lại không làm hỏng dữ liệu và chỉ ghi sau khi chuyển đổi thành công.
- Không gọi reset/clear/removeItem trên dữ liệu người dùng để “sửa” lỗi schema.
- Giữ nguyên ID cũ, ghi chú, bookmark, mức hiểu, ngày đọc, fontSize, lastStudiedConceptId, activeSessionId và examSessions.
- Thêm ID mới dưới trạng thái chưa học. Không tự đánh dấu đã hiểu theo chương đã đọc.
- Dữ liệu có ID chưa nhận diện vẫn cần được bảo toàn cho backup/khôi phục, chỉ loại khỏi thống kê active content; không bỏ âm thầm.
- Backup cũ nhập được ở app mới. Kiểm tra kiểu dữ liệu từng field và giới hạn hợp lý trước khi merge; JSON hỏng không được phá storage hiện tại.
- Gộp backup phải có quy tắc giải quyết xung đột ghi chú rõ, ưu tiên bản cập nhật phù hợp hoặc cho lựa chọn, không ghi đè bằng bản cũ mà UI gọi là “giữ bản mới nhất”.
- Kiểm thử bằng dữ liệu fixture trên browser profile/origin test riêng; không xóa tiến độ thật để test.
- Lưu ý localStorage gắn với origin: đổi hostname/port có thể khiến trông như mất tiến độ. Giữ cách chạy hiện tại, hoặc dùng export/import chuyển dữ liệu và giải thích nếu phải đổi origin; không coi khác origin là migration tự động.

## 9. Mô phỏng và giới hạn phạm vi

Giữ tám mô phỏng hiện có. Có thể gắn lại chúng vào câu DPL liên quan thông qua metadata nếu concept thực sự khớp, ví dụ nơ-ron hoặc gradient descent. Không đưa binary search vào bài detection chỉ vì cùng có chữ search.

Sáu mô phỏng nâng cao trong phụ lục cập nhật là gợi ý tương lai, chưa phải phần bắt buộc của task nhập nội dung này. Không cần mở rộng thiết kế hoặc tạo placeholder cho chúng. Ưu tiên nội dung đầy đủ, luyện vấn đáp, tìm kiếm và tiến độ chính xác.

Không thêm tài khoản, backend, AI API, microphone hoặc deploy công khai. Không thay stack hay nâng cấp hàng loạt dependency trừ khi có lỗi tương thích thực tế cần giải quyết.

## 10. Thứ tự thực hiện

1. **Khảo sát:** đọc nguồn và code; lập danh sách vị trí phụ thuộc 140/35, prefix, priority và subject.
2. **Dữ liệu:** mở rộng types/importer/metadata theo collection; chạy import; kiểm tra ID, số lượng và bảo toàn nội dung.
3. **Tiến độ:** sửa thống kê theo dữ liệu thật, migration/backup tương thích, thêm test trước khi dùng trên UI.
4. **Giao diện học:** bổ sung entry DPL, chapter pages, reader, reference, search, review; giữ routes cũ.
5. **Vấn đáp:** thêm lọc DPL và sampling theo chương, giữ session cũ.
6. **Nghiệm thu:** tests, build, browser, kiểm tra tiến độ và cập nhật báo cáo.

Đưa ra kế hoạch ngắn rồi thực hiện, đừng dừng ở việc tư vấn. Tự quyết định chi tiết triển khai thông thường trong phạm vi đặc tả. Nếu cần câu trả lời thật sự chặn công việc, hỏi cụ thể và tiếp tục phần độc lập. Không ghi đè những thay đổi chưa liên quan của người dùng hoặc agent khác.

## 11. Kiểm thử và tiêu chí hoàn thành

### Content/importer

- Foundations:140 IDs; DPL:72 IDs; toàn bộ:212 IDs duy nhất.
- Mỗi chương có đúng số câu và phân mức trong manifest.
- Có 19 bài mới, kiểm tra riêng bốn bài dạng ordered list ở chương1; không nhầm chúng thành prose của DPL1-12.
- Có đủ source, example, answer/followup/trap nơi nguồn cung cấp. Chỉ đếm72heading không đủ chứng minh nhập đủ nội dung.
- Spot-check câu đầu/cuối mỗi chương; DPL1-10 code/formula, DPL2-11 optimizer, DPL4-13 IoU/NMS, DPL5-15 attention.
- Nhãn “Mẫu đáp” được phân loại answer, không để rò rỉ đáp án trong chế độ ẩn.
- Chạy import hai lần cho kết quả ổn định; không sinh ID mới mỗi lần hoặc append dữ liệu trùng.
- Hash manifest nếu kiểm tra phải đúng byte file; nếu lệch thì báo nguồn đã thay đổi, không sửa hash cho qua mà không xem khác biệt.

### Tiến độ/session

- Fixture cũ có note/bookmark/understanding/lastStudiedConceptId/session vẫn giữ đủ sau load/migrate/save/reload.
- Tiến độ câu DPL được lưu, có trong thống kê và review đúng collection.
- Session cũ không đổi ID hoặc thứ tự; session DPL reload khôi phục đúng vị trí.
- Backup round-trip giữ nội dung; backup cũ tương thích; JSON lỗi bị từ chối an toàn.
- Unknown ID không mất khỏi backup và không làm mẫu số thống kê sai.

### Browser

- Duyệt trang đầu → DPL → chương → câu → ghi chú/đánh giá → review → luyện đề → kết quả.
- Thử URL sâu, refresh, Back/Forward và quay lại câu cũ DL01.
- Test search cả mã mới, thuật ngữ mới và query không dấu.
- Desktop khoảng1440px và mobile390px, thêm kiểm tra360px; các bảng/công thức không đẩy trang tràn ngang.
- Mục lục mobile, bàn phím, focus, nút mở đáp án và cỡ chữ hoạt động như trước.
- Không lỗi console nghiêm trọng, route hỏng hoặc nút dẫn tới feature chưa có.

Các script hiện có tại thời điểm viết prompt:

```text
npm run import
npm run test
npm run build
npm run preview
```

Xác minh lại `package.json` rồi chạy các lệnh phù hợp. `build` hiện chạy TypeScript và Vite, `prebuild` import dữ liệu. Nếu có `scripts/verify-ui.ts`, cập nhật kịch bản cho DPL và chạy sau khi có server phù hợp. Không chỉ dựa vào số test cũ hoặc ghi “pass” nếu chưa chạy.

Nếu browser automation hoặc dependency không chạy được, ghi lỗi cụ thể, thực hiện các kiểm tra còn lại và phân biệt phần đã xác minh với phần chưa xác minh.

## 12. Bàn giao

Cập nhật trong app:

- README: cách học hai collection, cập nhật nội dung, backup và lệnh chạy.
- CONTENT-REPORT: thống kê tách140/72/212, 20/19/39 bài tập,4đề cũ và các phần phụ lục.
- VERIFICATION: lệnh thực sự chạy, kết quả, browser flows và hạn chế còn lại.
- DESIGN chỉ khi bổ sung thành phần hoặc quy tắc mới cần ghi lại; giữ hệ thống hiện tại.

Lời bàn giao cuối ngắn gọn: đã thêm gì, mở DPL ở đâu, tiến độ cũ được giữ bằng cách nào, kiểm tra nào đã chạy và lỗi nào còn tồn tại. Đính kèm ảnh desktop/mobile nếu đã chụp và xem xác nhận.

**Bắt đầu đọc file, kiểm tra code hiện tại rồi triển khai bản cập nhật tới khi các tiêu chí nội dung, học tập và bảo toàn tiến độ đạt.**
