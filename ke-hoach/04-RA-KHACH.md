# 04 · Ra khách thật

**Ưu tiên số 4.** Xếp cuối không phải vì ít quan trọng, mà vì ba việc trước
quyết định việc này có nghĩa hay không: đổ người vào một trang chưa sao lưu,
chưa ai canh, biểu mẫu thỉnh thoảng chết — là đổ tiền vào một cái thùng thủng.

---

## Nền SEO: tốt hơn dự đoán, không phải làm lại

Đọc trực tiếp mã HTML của trang thật ngày 07/09/2026:

| Hạng mục | Tình trạng |
|---|---|
| Tiêu đề · mô tả · canonical | ✅ đủ và đúng |
| `sitemap.xml` | ✅ **31 đường dẫn** |
| Dữ liệu có cấu trúc | ✅ `Organization`, `WebSite`, `Place`, `RealEstateAgent`, `PostalAddress` |
| Câu hỏi thường gặp | ✅ `FAQPage`, **9 cặp hỏi–đáp** |
| Đặc điểm vị trí | ✅ 8 khối `LocationFeatureSpecification` |
| Thẻ chia sẻ mạng xã hội | ✅ đủ, kèm ảnh 1200×630 tự sinh |
| Cấu trúc tiêu đề | ✅ đúng 1 thẻ `h1`, 11 thẻ `h2` |
| Ảnh thiếu mô tả | ✅ **0 trên 7** |
| `robots.txt` | ✅ mở, **liệt kê đích danh 16 bot AI** |
| `llms.txt` | ✅ **8.820 ký tự** |

`llms.txt` đáng nói riêng. Nó mở đầu bằng câu tự khai:

> *KHÔNG phải trang chính thức của chủ đầu tư.*

và ghi nguồn cho **từng con số**, tự đánh dấu cái nào chưa xác minh:

> *Tổng diện tích: 6.206 ha (nguồn: Sơ đồ tổng mặt bằng chủ đầu tư · **chưa đối
> chiếu hồ sơ gốc**)*

Đó đúng là thứ làm một trợ lý AI dám trích dẫn: nói rõ mình là ai, và nói rõ
mình chắc tới đâu. Nhiều trang bất động sản khác không làm được điều thứ hai.

---

## ⚪ K1 · Khai báo Google Search Console

Chưa làm. Google **chưa biết trang tồn tại** — lập chỉ mục vừa mở tối 07/09, và
một tên miền hoàn toàn mới cần vài ngày tới vài tuần.

Khai báo rồi nộp `sitemap.xml` là cách nói cho Google biết sớm nhất. Nó cũng là
nơi **duy nhất** thấy được trang nào bị loại khỏi chỉ mục và vì sao — thứ không
đoán được từ bên ngoài.

**Làm cùng lúc:** Bing Webmaster Tools. Bing là nguồn dữ liệu của ChatGPT
Search — với GEO thì nó không phải công cụ hạng hai.

---

## ⚪ K2 · `llms-full.txt`

`llms.txt` đã có. `llms-full.txt` trả 404.

Quy ước đang hình thành: `llms.txt` là **mục lục**, `llms-full.txt` là **toàn
văn** để trợ lý AI đọc một lần thay vì phải đi qua 31 trang.

Với trang này nó đặc biệt đáng làm, vì phần lớn nội dung là **dữ kiện dự án** —
đúng thứ người ta hỏi trợ lý AI, và đúng thứ trợ lý AI cần trích được nguồn.

---

## ⚪ K3 · Rà SEO từng trang

Mới đo trang chủ. Còn 30 trang chưa soi:

- Tiêu đề có trùng nhau giữa các trang không
- Mô tả có bị cắt cụt trên kết quả tìm kiếm không
- Dữ liệu có cấu trúc có đúng **loại** cho từng trang không — trang sản phẩm
  nên khai `Product` hoặc `Residence`, không phải `WebPage` chung chung

Làm nhanh bằng `chrome-devtools-mcp` (xem `C2` trong `05-CONG-CU.md`).

---

## ⚪ K4 · Đo lường

Kho đã có `lib/do-luong.ts`, và biểu mẫu đã gọi `ghiSuKien`. Chưa rõ nó gửi đi
đâu và ai đọc.

Cần chốt **ba con số** trước khi tiêu đồng quảng cáo nào:

1. Bao nhiêu người vào trang
2. Bao nhiêu người điền biểu mẫu
3. **Bao nhiêu người trong số đó nghe máy**

Thiếu con số thứ ba thì hai con số đầu chỉ là thứ để nhìn cho vui. Nó cũng là
con số duy nhất không tự thu được — phải có người ghi lại sau mỗi cuộc gọi.

---

## 🟡 K5 · Nội dung

Phụ thuộc `T5`. Nhưng có một điều nói được ngay: với GEO, **một bài trả lời
đúng một câu hỏi thật, có ghi nguồn** giá trị hơn mười bài viết chung chung.
Trợ lý AI trích dẫn thứ nó kiểm chứng được, không trích thứ nghe hay.

---

## 🟡 K6 · Hai điều còn nợ, và chúng chặn việc mở rộng

### Giá trên trang — mâu thuẫn chưa gỡ

Chủ trang chọn **không công khai giá**, chỉ mời liên hệ. Bản kiểm định bên
ngoài lại **khen phần hiển thị giá** và đề nghị giữ.

Hiện trang chủ đã bỏ giá theo ý chủ trang, nhưng `/gia-global-gate-ha-long` và
`/quy-can-global-gate-ha-long` **vẫn còn**. Chưa ai quyết hai trang đó.

Cần một quyết định, vì hiện tại trang đang nói hai giọng: trang chủ bảo "liên hệ
để nhận bảng giá", trang trong thì in bảng giá ra.

### "Sở hữu lâu dài" — chưa đối chiếu hồ sơ gốc

Đang gắn cờ `canXacNhan: true` trong mã, và **đang xuất hiện trong `llms.txt`**
— tức là đang được đưa cho trợ lý AI đọc như một dữ kiện đã xác minh.

Đây là **khẳng định pháp lý**. Căn hộ có thể khác nhà gắn liền đất. Cần xác nhận
**theo từng dòng sản phẩm**, không phải một câu chung cho cả dự án.

Đây là mục rủi ro cao nhất trong cả bốn file. Một khẳng định pháp lý sai, được
trợ lý AI trích dẫn lại rồi lan ra, là thứ rất khó thu hồi — khó hơn nhiều so
với sửa một dòng trên trang.
