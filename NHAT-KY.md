# Nhật ký — halongxanh360.vn

Mới nhất ở trên. Đọc tệp này **trước khi bắt tay vào việc**, đừng suy lại từ đầu
từ mã nguồn.

Sổ này KHÔNG chép lại git log — git đã ghi từng thay đổi và lý do rồi. Sổ giữ
đúng phần git không giữ được: trạng thái bắc qua nhiều phiên, việc nằm ngoài
kho, và những kết luận đã kiểm chứng để khỏi kiểm lại.

Kho anh em: `D:\Dự án cô Giang` (Antigravity OS) — nơi sinh ra bài đăng lên đây.

---

## 09/09/2026 — kế hoạch bốn việc (chủ dự án giao cả bốn, tự xếp thứ tự)

### Đo thật trước khi xếp (09/09, đếm trên trang đang chạy)

```
  329–353  /phan-khu/*  (9 trang, gần như GIỐNG HỆT nhau)
  355      /tin-tuc     ← KHÔNG phải trang mỏng, xem ghi chú dưới
  377–486  /san-pham/*  (bản vá 502 từ đã commit, CHƯA deploy)
  477      /tai-lieu
  618      /quy-hoach
  694      /tien-ich
  783–1347 chín trang tiền — đều ổn
```

⚠️ **`/tin-tuc` mỏng vì ĐANG RỖNG, không vì thiếu chữ.** Nó hiện khối "Chưa có
bài viết nào". Nhồi chữ vào đó là chữa sai bệnh — nó tự đầy khi có bài được
duyệt. Đừng đưa trang này vào đợt viết thêm.

**Bề mặt hỏng lớn nhất là 9 trang phân khu**: vừa mỏng vừa trùng lặp gần như
hoàn toàn. Trên một tên miền mới chưa có uy tín, chín trang na ná nhau ở mức
330 từ là đúng hình dạng mà Google gọi là nội dung mỏng.

### Thứ tự đã chốt, và lý do

1. **Nghiên cứu từ khoá** — làm TRƯỚC vì nó quyết định nội dung của việc 2.
   Viết thêm 600 từ vào `/quy-hoach` mà chưa biết người ta gõ gì là đoán.
   Không có CSV Keyword Planner nên tra SERP thật + trang đối thủ; **KHÔNG bịa
   số lượng tìm kiếm** — chỉ ghi cụm truy vấn kèm nguồn tra được.
2. **Chín trang phân khu + `/tai-lieu` + `/quy-hoach` + `/tien-ich`**, và **cắt
   chữ thừa NGAY TRONG CÙNG MỘT LƯỢT**. Hai việc này sửa đúng cùng những đoạn
   văn; tách ra là đọc hai lần, sửa hai lần, và lần sau giẫm lên lần trước.
3. **Bố cục + ảnh bài đăng** — để CUỐI, vì cần một bài thật đã duyệt để đo.
   Việc đó đang chờ chủ dự án duyệt bài đầu tiên.

### Ảnh crawl từ Facebook / trang khác — ĐÃ TỪ CHỐI (09/09)

Chủ dự án đề nghị crawl ảnh từ trang khác và Facebook, cắt ghép xoá logo và số
điện thoại của bên kia trước khi dùng. Tôi không làm, vì cắt logo chỉ giải quyết
một trong ba vấn đề:

1. **Bản quyền.** Gỡ thông tin ghi nhận tác giả rồi đăng lại bị đánh giá nặng
   hơn đăng nguyên trạng, không nhẹ hơn.
2. **Không xác minh được nguồn.** Hai ảnh mẫu chủ dự án gửi gần như chắc chắn là
   ảnh AI (thuỷ phi cơ, dãy biệt thự lặp đều) — đúng loại chủ dự án đã tự bác khi
   phát hiện 204 tệp Drive có tên là câu lệnh sinh ảnh.
3. **Vi phạm chính luật chủ dự án đặt ra.** Ảnh mẫu in sẵn "12 tỷ + VOUCHER 30%
   = 8.4 tỷ" trên mặt ảnh — công khai đúng thứ đã cấm viết (chắc chắn có voucher,
   mức chiết khấu). Tấm infographic chính sách kết bằng "Kính chúc Quý Đại Lý",
   là tài liệu nội bộ gửi đại lý, chứa lãi suất HTLS và quà vàng — thuộc "cơ chế
   thương mại nội bộ" đã cấm công khai.

**Đường hợp lệ đã đề xuất:** chủ dự án là đại lý chính thức → xin **media kit
của chủ đầu tư** (render gốc, quyền dùng rõ ràng, phân giải cao hơn ảnh chụp màn
hình). Đang chờ.

### Ảnh: chủ dự án đã chốt (09/09)
**Chỉ dùng 66 ảnh thật trong kho.** Không sinh ảnh AI. Giữ đúng lằn ranh chủ dự
án đã vạch khi bác hai thư mục Drive — tên tệp là câu lệnh sinh ảnh, và có ảnh
chụp nơi khác gắn nhãn Hạ Long.

### Tra từ khoá — kết quả đầu tiên (09/09, tra SERP thật)

- Đối thủ xếp hạng bằng **tên tiếng Việt** của phân khu: "Vịnh Thiên Đường
  (Paradise Bay)", "Đảo Pha Lê", "Đảo Kỳ Quan", "Vịnh Lễ Hội". Trang mình CÓ tên
  tiếng Việt — tốt, không phải sửa.
- **Trang mình KHÔNG có chữ "mặt bằng"**, trong khi tiêu đề đang xếp hạng của đối
  thủ là *"Mặt Bằng Phân Khu Vịnh Thiên Đường (Paradise Bay) — Tiện Ích & Quy
  Hoạch"*. Đây là cụm người ta gõ thật mà trang mình không đáp.
- ⚠️ KHÔNG có số lượng tìm kiếm ở đây và sẽ không bịa ra. Chưa có CSV Keyword
  Planner; đây là cụm truy vấn quan sát được từ SERP, tra lại được.

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
