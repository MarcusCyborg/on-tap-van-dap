# Thiết Kế Giao Diện & Design System (DESIGN.md)

Tài liệu này ghi nhận các tokens, nguyên tắc thẩm mỹ, hệ thống typography, components và responsive thực tế đã triển khai cho website **Ôn Vấn Đáp**.

## 1. Triết lý Thiết kế

Ứng dụng được thiết kế như một **cuốn sổ tay học tập có thể tương tác (Interactive Workbook)**:
- Nền giấy sáng hơi ấm, dịu mắt khi đọc lâu ban đêm.
- Độ tương phản chữ đạt chuẩn WCAG AA (> 4.5:1 đối với văn bản thông thường, > 7:1 đối với tiêu đề).
- Hạn chế tối đa các hiệu ứng bóng đổ lòe loẹt, gradient tím/hồng neon hay glassmorphism che khuất thông tin.
- Chuyển động (animation/transition) tinh gọn trong khoảng 150–200ms, phục vụ trực tiếp việc phản hồi trạng thái; tôn trọng hoàn toàn `prefers-reduced-motion`.

## 2. Bảng Màu & Tokens (CSS Variables)

```css
:root {
  /* Surface & Page */
  --page: #f5f3ed;          /* Nền giấy ấm dịu mắt */
  --surface: #fffefa;       /* Bề mặt card chính */
  --surface-muted: #ecefe9; /* Bề mặt thứ cấp, thanh công cụ */

  /* Text & Inks */
  --ink: #202b27;           /* Chữ chính (độ tương phản cao) */
  --muted: #52615a;         /* Chữ phụ, nhãn chú thích */

  /* Primary Accent */
  --accent: #27624a;        /* Xanh lá đậm học thuật */
  --accent-dark: #1b4534;

  /* Borders */
  --border: #d3dad1;        /* Đường viền mảnh có cấu trúc */

  /* Status Colors */
  --warning-ink: #865510;   /* Cảnh báo, mức B, hiểu một phần */
  --danger-ink: #a33c32;    /* Bẫy, chưa hiểu, phân kỳ */
}
```

### Màu Nhận Diện Bốn Chuyên Đề
Mỗi mảng kiến thức sở hữu một gam màu nhận diện rõ ràng, luôn đi kèm nhãn chữ (không chỉ dựa vào màu sắc):
1. **Xác suất thống kê (XS):** Xanh lam (`#2b5c8f`, nền phụ `#eef4fa`, viền `#c5d8ea`)
2. **Machine Learning (ML):** Xanh lá đậm (`#27624a`, nền phụ `#eef5f1`, viền `#c4ded3`)
3. **Deep Learning (DL):** Nâu cam / Hổ phách (`#8a4b16`, nền phụ `#faf2ea`, viền `#e8d2c0`)
4. **Giải thuật & CTDL (GT):** Xanh mòng két - Teal (`#1b6b68`, nền phụ `#ecf6f5`, viền `#bfdedc`)

## 3. Hệ Thống Typography

- **Font chữ giao diện & bài đọc:** Ưu tiên `Be Vietnam Pro`, kế thừa font hệ thống `system-ui, -apple-system, Segoe UI, Roboto`. Hỗ trợ hoàn hảo 100% dấu tiếng Việt không bị lệch chân hay lỗi font.
- **Font chữ code & công thức:** `JetBrains Mono, Consolas, Monaco, monospace`.
- **Cỡ chữ bài đọc (Reader) có 3 mức tùy chỉnh:**
  - `normal` (Bình thường): `1.0625rem` (17px), line-height: `1.75`
  - `large` (Lớn): `1.1875rem` (19px), line-height: `1.8`
  - `xlarge` (Rất lớn): `1.3125rem` (21px), line-height: `1.85`
- **Độ rộng tối ưu cho mắt đọc:** Vùng bài viết giới hạn trong khoảng `68ch–72ch`, giúp mắt không bị mỏi khi quét hết dòng.

## 4. Cấu Trúc Bố Cục (Layout)

### Desktop (≥ 1024px)
- **Top Bar (56px):** Cố định (sticky), chứa Logo, thanh nhảy nhanh 4 mảng, nút mở Modal tìm kiếm nhanh (`Ctrl+K`), thống kê tiến độ học thực tế, và Cài đặt.
- **Sidebar bên trái (256px):** Cố định (sticky), cuộn độc lập. Gồm: Trang chủ, Lộ trình 4h, Luyện vấn đáp, Danh sách cần ôn, Cây thư mục 4 chuyên đề với tiến độ từng mảng, và danh sách 8 mô phỏng.
- **Vùng nội dung chính:** Chiếm toàn bộ không gian còn lại, căn giữa tối đa 896px (`max-w-4xl`), thoáng đãng, tập trung cho việc đọc và tư duy.

### Mobile & Tablet (< 1024px)
- Sidebar chuyển thành **Navigation Drawer** trượt từ mép trái, có backdrop làm mờ nền và nút đóng mở dễ chạm.
- Chế độ một cột duy nhất; các bảng dữ liệu rộng và khối code cho phép cuộn ngang độc lập trong chính khung chứa, không làm vỡ layout toàn màn hình.
- Các nút tương tác quan trọng (Xem đáp án, Đánh giá, Chuyển câu) có kích thước chạm tối thiểu `44×44px`.

## 5. Các Component Chính

1. **Concept Reader:**
   - **Chế độ Đọc hiểu:** Mở sẵn định nghĩa, ví dụ, mẫu trả lời miệng và câu hỏi tiếp nối.
   - **Chế độ Tự trả lời:** Ẩn câu trả lời và gợi ý, cung cấp bảng nháp nhẩm tính, nút "Xem đáp án đối chiếu". Đổi sang câu khác sẽ tự động đưa trạng thái về ẩn mặc định.
   - **Thanh Tự đánh giá:** 3 mức riêng biệt ("Chưa hiểu" / "Hiểu một phần" / "Tự giải thích được"), có thể thay đổi bất kỳ lúc nào.
   - **Mẫu trả lời miệng:** Đặt trong khung nổi bật `bg-accent/10 border-accent/40`, văn phong tự nhiên hướng đến việc trả lời phỏng vấn trực tiếp.
2. **Search Modal:**
   - Phím tắt toàn cục `/` và `Ctrl+K`. Tự động vô hiệu hóa phím tắt khi người dùng đang gõ trong ô nhập liệu khác.
   - Tìm kiếm không phân biệt dấu tiếng Việt (`đ` tương đương `d`, `o` tương đương `ô, ơ`).
   - Điều hướng bàn phím `↑`, `↓`, `Enter`, `Esc`.
3. **Tám Mô Phỏng Tương Tác:**
   - Đặt trực tiếp bên trong các câu hỏi liên quan, đồng thời có thể mở nhanh từ thanh điều hướng.
   - Bao gồm đầy đủ: Câu hỏi gợi mở → Trục số/Sơ đồ SVG → Điều khiển tương tác (slider, nút bấm) → Kết quả số liệu tính toán thật → Kết luận logic có điều kiện → Nút Đặt lại (Reset).
   - Có bảng mô tả văn bản/nhật ký các bước cho người dùng dùng bàn phím hoặc công cụ hỗ trợ tiếp cận.
4. **Practice Exam Runner:**
   - Chạy từng câu một, kèm đồng hồ bấm giờ (có nút tạm dừng/chạy tiếp; hết giờ không tự ý nhảy câu làm mất nháp).
   - Bảng nháp nói thử.
   - Rubric tự chấm 0/1/2 điểm theo chuẩn nguồn.
   - Màn hình tổng kết phân tách rõ câu đã chấm và câu bỏ qua, gợi ý các concept liên quan cần ôn lại ngay kèm link chuyển trang trực tiếp.
