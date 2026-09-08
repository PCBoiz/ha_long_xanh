# Nhật ký — halongxanh360.vn

Mới nhất ở trên. Đọc tệp này **trước khi bắt tay vào việc**, đừng suy lại từ đầu
từ mã nguồn.

Sổ này KHÔNG chép lại git log — git đã ghi từng thay đổi và lý do rồi. Sổ giữ
đúng phần git không giữ được: trạng thái bắc qua nhiều phiên, việc nằm ngoài
kho, và những kết luận đã kiểm chứng để khỏi kiểm lại.

Kho anh em: `D:\Dự án cô Giang` (Antigravity OS) — nơi sinh ra bài đăng lên đây.

---

## 09/09/2026

### Đã làm
- `21c1e01` — nối liên kết nội bộ tự động trong thân bài (`src/lib/noi-lien-ket.ts`),
  gắn vào `/tin-tuc/[slug]`. Kèm `npm run kiem-noi-lien-ket`.
- `b112886` — khối số liệu thật cho năm trang `/san-pham/*` (338–365 từ → 502).

### Đã chứng minh
- **Bài tự động có đúng 0 liên kết nội bộ.** Không phải suy đoán: các module viết
  bài bên Antigravity không một dòng nào nhắc tới liên kết, và không chỗ nào đưa
  danh sách địa chỉ trang cho mô hình. Nên nếu bài có liên kết thì đó là địa chỉ
  bịa. Vì vậy nối ở phía trang, địa chỉ lấy từ `DUONG_DAN` để trình biên dịch kiểm.
- `kiem-noi-lien-ket` 11/11 đạt · `kiem-anh-treo` 66 ảnh, 0 treo · `tsc`, `eslint`,
  `next build` sạch.
- **`https://halongxanh360.vn/` ĐÃ được Google lập chỉ mục** (Search Console:
  "URL nằm trên Google", "Trang đã lập chỉ mục"). Câu hỏi treo từ hôm ChatGPT bảo
  không tìm ra trang — đã có đáp án. Từ đây mới có dữ liệu thật để nghiên cứu từ khoá.

### Chủ dự án cần làm
- **Redeploy VPS.** Kho này chạy trên VPS + Caddy, KHÔNG dính Vercel — không có
  tự động deploy. Nhiều commit đã đẩy mà chưa lên: HSTS, JSON-LD từng bài, ảnh
  đầu bài, khối số liệu sản phẩm, và nối liên kết.
- **Thu hồi khoá OpenAI `sk-proj-77fD…`** đã lộ trong hội thoại (đã dùng 5 lần).

### Đang chặn
- **Chưa đo được bộ nối liên kết trên bài thật.** `/tin-tuc` chưa có bài công khai
  nào; bài duy nhất còn nằm ở hàng chờ duyệt và không mở được nếu không có khoá.
  Nếu mô hình luôn viết "tiến độ dự án" chứ không viết trơn "tiến độ" thì bộ nối
  chạy đúng nhưng nối được ít. **Duyệt bài đầu tiên xong → đếm lại → chỉnh danh
  sách cụm trong `noi-lien-ket.ts` cho khớp giọng thật.**
- Nghiên cứu từ khoá: chờ CSV Keyword Planner của chủ dự án. Dữ liệu Search Console
  giờ đã mở đường (trang đã index) nhưng cần thời gian tích luỹ.

### Trang còn mỏng, chưa đụng
`/tin-tuc` 360 từ · `/phan-khu/*` ~350 · `/tai-lieu` 481 · `/quy-hoach` 627.

### Đang CHỜ LỆNH, không tự làm
Đợt rà soát cắt chữ thừa (giọng máy) trên toàn bộ trang.

### Sai lầm đã mắc, đừng lặp lại
- `scripts/kiem-anh-treo.mjs` bản đầu **làm vỡ `/quy-hoach`**: nó tìm chuỗi
  nguyên văn nên không thấy tên ảnh dựng lúc chạy (`` `khu-${ma}` ``), báo 9 ảnh
  là treo, và tôi xoá. `tsc`/`eslint`/`next build` đều xanh vì ảnh thiếu chỉ thành
  `null`. **Chủ dự án phát hiện bằng cách mở trang.** Bộ kiểm đọc mã nguồn không
  thay được việc nhìn.
