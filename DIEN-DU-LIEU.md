# Những ô dữ liệu cần điền

Sau đợt cải tiến 14/08/2026, phần **mã** của trang đã xong việc của nó. Thứ còn
chặn lại không phải là code nữa mà là **bốn ô dữ liệu chỉ chủ mới có**.

Toàn bộ nằm trong một file duy nhất: **`src/data/project.ts`**. Không phải sửa
mã ở đâu khác. Mỗi ô điền xong thì phần giao diện tương ứng **tự hiện ra**; để
trống thì nó **tự ẩn** chứ không hiện ô trống.

---

## Vì sao bốn ô này quan trọng hơn mọi việc còn lại

Một bản đánh giá độc lập chấm trang này **8,8/10 về mỹ thuật** nhưng chỉ
**5,5/10 về độ tin cậy** và **5,8/10 về khả năng bán hàng**. Đối chiếu với mã
thì gần như toàn bộ khoảng cách đó nằm ở bốn ô dưới đây — không nằm ở màu, phông
chữ hay hiệu ứng.

Nói gọn: **hiện tại trên toàn bộ trang không có một số điện thoại nào**, và
không có một chữ nào nói ai đang bán.

---

## 1. Số điện thoại — `lienHe`

> ✅ **ĐÃ ĐIỀN.** Số đang dùng: `0941 328 658`, cho cả gọi và Zalo.

```ts
export const lienHe = {
  hotline: "0941 328 658",   // ← số gọi được
  zalo: "0941 328 658",      // ← số Zalo, thường trùng số trên
};
```

> ⚠️ **KHÔNG CÒN Ô EMAIL.** Trường `email` đã bị gỡ hẳn theo quyết định của chủ
> trang. Thêm lại vào đây sẽ **gãy TypeScript** vì kiểu của `lienHe` chỉ còn hai
> trường. Lý do bỏ: người mua bất động sản ở Việt Nam gọi hoặc nhắn Zalo; một
> dòng email gần như không ai bấm nhưng lại tạo ra một đường liên hệ không ai
> trực.

**Số này đang hiện ở sáu chỗ:**

| Chỗ | Hiện cái gì |
|---|---|
| Thanh dính đáy màn hình, **di động** | Gọi · Zalo · Phương án |
| Góc phải màn hình, **máy bàn** | Nút gọi tròn + nút Zalo, bám theo khi cuộn |
| Chân trang | Số bấm gọi được + đường nhắn Zalo |
| Trang `/lien-he` | Hàng nút "Gọi …", "Nhắn Zalo" |
| Khối người tư vấn & khối chốt cuối mỗi money page | Nút "Gọi Gia Giang — …" |
| Dữ liệu có cấu trúc | Trường `telephone` cho máy tìm kiếm |

---

## 2. Người tư vấn — `doiNguTuVan`

> ✅ **ĐÃ ĐIỀN.** Hiện có một người: Gia Giang.

```ts
export const doiNguTuVan: NguoiTuVan[] = [
  {
    ten: "Gia Giang",
    chucDanh: "Tư vấn lựa chọn sản phẩm & phương án mua",
    dienThoai: "0941 328 658",
    zalo: "0941328658",          // bỏ được, mặc định lấy theo dienThoai
    gioiThieu: "…",              // lời của chính người đó, không phải tính từ
    cauChot: "…",                // câu mời gọi, in khác đi bên dưới
  },
];
```

Điền xong thì mảng **"Người trực tiếp tư vấn cho bạn"** hiện ra ở trang chủ và
trang `/lien-he`, trên nền sáng.

> ⚠️ **KHÔNG CÓ TRƯỜNG `anh`.** Trường ảnh đã bị gỡ hẳn theo quyết định của chủ
> trang. Thêm `anh: "…"` vào đây sẽ **gãy TypeScript** — kiểu `NguoiTuVan` không
> còn trường đó.
>
> Lý do gỡ hẳn thay vì để trống: còn trường thì sớm muộn sẽ có người điền vào
> một tấm ảnh chân dung mua sẵn. Ảnh giả bị nhận ra nhanh hơn nhiều so với
> người ta tưởng, và nhận ra một lần là mất niềm tin ở mọi chỗ khác trên trang.
> Khối tư vấn giờ là một khối chữ — tên, chức danh, lời của chính người đó, và
> số gọi được — đọc ra như một trang hồ sơ.

**Về `gioiThieu`:** viết việc đã làm được, đừng viết tính từ. "Đã bàn giao 40
căn thấp tầng" nói được nhiều hơn "tận tâm, chuyên nghiệp" — và người mua vài
chục tỷ phân biệt được hai kiểu câu đó.

---

## 3. Danh tính bên bán — `benBan`

```ts
export const benBan = {
  ten: "Công ty TNHH ABC",             // hoặc tên đội ngũ
  maSoThue: "0100000000",              // bỏ được
  vanPhong: "Số 1 đường X, Hạ Long",   // bỏ được
  vaiTro: "Đội ngũ tư vấn phân phối",  // xem cảnh báo bên dưới
};
```

Điền xong thì chân trang hiện khối danh tính, và trường `name` trong dữ liệu có
cấu trúc đổi từ tên chung sang tên thật.

> ### ⚠️ Về chữ "đại lý chính thức"
>
> Mặc định là **"Đội ngũ tư vấn phân phối"** — cách nói khiêm tốn nhất mà vẫn
> đúng. **Chỉ đổi thành "Đại lý phân phối chính thức" khi có văn bản chỉ định
> của chủ đầu tư trong tay.** Tự nhận sai vai trò trong một giao dịch vài chục
> tỷ không phải chuyện chữ nghĩa.

Dù điền hay chưa, chân trang **luôn** hiện dòng: *"Đây là trang thông tin do …
lập, không phải trang chính thức của chủ đầu tư."* Dòng đó cố ý không tắt được —
để khách hiểu nhầm đây là trang của Vinhomes là rủi ro pháp lý thật.

---

## 4. Số liệu bán hàng — khi chủ đầu tư công bố

| Biến | Hiện ở đâu | Chưa có thì sao |
|---|---|---|
| `dongSanPham[].khoangGia` | Cột "Khoảng giá" ở `/quy-can-global-gate-ha-long` | Cột không dựng |
| `dongSanPham[].soTang` | Cột "Số tầng" | Cột không dựng |
| `bangHang` | Mảng "Quỹ căn" | Hiện trạng thái chưa có dữ liệu |
| `tienDoThanhToan` | Mảng "Tiến độ thanh toán" | Hiện lời giải thích + nút nhận |
| `diemKetNoi[].khoangCach` / `.thoiGian` | Quãng đường **chạy xe** ở `/vi-tri-global-gate-ha-long` | Chỉ hiện khoảng cách đường chim bay, tự tính từ toạ độ |
| `soSanhKhuVuc` | Bảng so sánh khu vực | Hiện lời mời nhận bản phân tích |

> ⚠️ **CHÍN ĐƯỜNG DẪN ĐÃ ĐỔI TÊN** trong đợt này để khớp câu người mua gõ vào ô
> tìm kiếm. Đường dẫn cũ vẫn sống, chuyển hướng 301 vĩnh viễn — xem
> `src/lib/duong-dan.ts`. Muốn đổi tên trang lần nữa thì sửa ở đúng file đó,
> đừng đi sửa từng chuỗi rải rác.

Cách xử lý khi trống **đã đổi** trong đợt này. Trước đây bảng dựng đủ cột rồi in
dấu gạch `—` vào mọi ô — mười lăm dấu gạch trong một bảng năm dòng, đọc ra là
"trang chưa làm xong" chứ không phải "chủ đầu tư chưa công bố". Giờ cột rỗng
hoàn toàn thì không dựng, và ngay dưới bảng có một khối nói rõ **mục nào chưa
có, vì sao, và lấy ở đâu khi có**.

Lượng thông tin y nguyên. Chỉ là nói thành câu một lần, thay vì rải dấu gạch.

---

## 5. Ô còn phải xác minh trước khi phát hành

Những mục dưới đây đang hiển thị trên trang nhưng **đọc từ sơ đồ tổng mặt bằng,
chưa đối chiếu hồ sơ gốc**. Trong chế độ phát triển chúng có dấu ⚠ bên cạnh.

- `6.206 ha` tổng diện tích
- `380.000 cư dân` quy mô dân cư
- Diện tích từng dòng sản phẩm (suy từ tên file trong thư mục layout)
- Các danh xưng "lớn nhất Việt Nam", "lớn nhất thế giới" trên hạng mục tiện ích

Sai số liệu bất động sản là rủi ro pháp lý, không phải lỗi trình bày.

---

## Kiểm sau khi điền

```bash
npm run typecheck && npm run lint && npm run build
npm run audit          # 33 lượt đo, chụp ảnh làm minh chứng
npm run audit:sau      # tốc độ tải, SEO, dò liên kết hỏng
```

⚠️ **Trước lần triển khai tới, phải áp một lần cấu trúc dữ liệu mới:**

```bash
npm run db:migrate
```

Bảng `su_kien` (đo lượt gọi, lượt Zalo, lượt gửi biểu mẫu) là bảng mới. Không
áp thì trang vẫn chạy bình thường, chỉ là không đếm được gì — và đây đúng là
kiểu hỏng im lặng khó phát hiện nhất.

Trạng thái tại 15/08/2026, đo trên bản dựng thật:

| Phép đo | Kết quả |
|---|---|
| Lượt đo giao diện | 39 (13 trang × 3 khổ màn hình) |
| Lỗi console | 0 |
| Tràn ngang | 0 |
| Lỗi tương phản màu | 0 |
| Ảnh thiếu mô tả | 0 |
| Sai thứ bậc tiêu đề | 0 |
| Điểm chạm dưới ngưỡng | 0 |
| Liên kết hỏng | 0 / 34 |
| LCP chậm nhất | 0,90 s (trang chủ) |
| CLS | 0 trên cả 11 trang đo tốc độ |
| Đường đăng bài Antigravity | 13/13 mục đạt |
