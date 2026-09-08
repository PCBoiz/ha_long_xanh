# 06 · Ảnh — nghiên cứu, ngày 08/09/2026

Chủ trang yêu cầu *"nghiên cứu kĩ việc thêm ảnh"* và gửi kèm bộ tài liệu bán
hàng của chủ đầu tư (`Event 06.09`, PDF 7,8 MB, 31 trang).

Kết luận ngắn: **bộ PDF đó không dùng làm nguồn ảnh được.** Lý do bên dưới, kèm
số đo. Và khoảng trống về ảnh thì **lớn hơn** bản kiểm định bên ngoài ước tính.

---

## Kho ảnh hiện có: 52 tấm, và nó lệch hẳn về một phía

```
Phối cảnh kiến trúc      14  ██████████████
Tiến độ công trường      12  ████████████
Cắt từ bản đồ             9  █████████   ← đã gỡ khỏi trang, xem 03-SAN-PHAM
Bản đồ / mặt bằng         6  ██████
Toàn cảnh / phong cảnh    6  ██████
Tiện ích                  5  █████
                         ──
                         52
```

Ba con số đáng chú ý hơn cả bảng trên:

```
Ảnh NỘI THẤT                 0
Ảnh giải trí (VinWonders…)   0
Ảnh có NGƯỜI trong khung     gần như 0
```

Bản kiểm định bên ngoài nói trang đang *"70% dự án/kiến trúc, 30% đời sống"* và
muốn về 50/50. Đo thật thì tỉ lệ còn lệch hơn thế nhiều — gần **95/5**.

Không có một tấm nào cho thấy **người đang sống ở đó**. Toàn bộ là kiến trúc
rỗng, công trường, và bản vẽ.

Điều đó quan trọng vì một người sắp chuyển vài tỷ không mua mặt tiền. Họ mua
một hình dung: *cuối tuần tôi ở đây thế nào, con tôi chơi ở đâu, nhà tôi trông
ra cái gì*. Trang hiện tại không trả lời câu nào trong số đó bằng ảnh.

---

## Vì sao bộ PDF không dùng được

Đã bóc thử: quét toàn bộ file tìm dấu hiệu đầu/cuối JPEG, tách được **72 ảnh**.
Hai lý do khiến chúng không dùng được, và lý do thứ hai là lý do chặn.

### Lý do 1 — phần lớn là trang đã dàn sẵn, có chữ nướng vào ảnh

Chúng không phải ảnh chụp rời. Chúng là **cả trang tài liệu** gồm ảnh, khung
màu, và chữ quảng cáo của chủ đầu tư đã in chồng lên.

Dán một trang như thế lên trang này là đưa **lời quảng cáo của chủ đầu tư** vào
một trang tự nhận là *kênh thông tin và tư vấn độc lập*. Nó phá đúng thứ làm
nên vị thế của trang.

### Lý do 2 — ảnh sạch thì quá nhỏ. Đây là lý do chặn.

Số ít ảnh rời không dính chữ đều là ảnh chèn nhỏ trong trang:

```
Ảnh sạch lớn nhất trong PDF     785 × 308
Ảnh đang dùng trên trang       2560 × ~1700
```

Và đây là phép tính quyết định. Thẻ sản phẩm khai:

```
sizes="(min-width: 1024px) 33vw, …"
```

```
Màn 1440px  →  thẻ rộng ~470px  →  màn hình 2x cần ảnh ~940px
Ảnh trong PDF                    :  785px      ← THIẾU
```

**Ảnh trong PDF không đủ cho cả cái thẻ nhỏ nhất trên trang.** Phóng to lên thì
nhoè, và nhoè trên một trang bán nhà tiền tỷ đọc ra là cẩu thả.

---

## Đường đúng: Google Drive, đúng đường ống đang có

`scripts/fetch-assets.mjs` đã tải ảnh theo **ID file Google Drive** từ thư mục
chia sẻ của chủ đầu tư. Thêm ảnh mới chỉ là thêm một mục:

```js
{
  id:   "<ID file trên Drive>",
  name: "<ten-khong-dau-cach-bang-gach>",
  alt:  "<mô tả tiếng Việt, hiển thị cho người dùng>",
}
```

Rồi `npm run assets` tải về, nén, và sinh lại bản kê.

**Việc của chủ trang:** xin chủ đầu tư bộ ảnh gốc độ phân giải đầy đủ, tải lên
đúng thư mục Drive đó, rồi gửi lại danh sách ID. Không cần làm gì thêm.

---

## Danh sách ảnh cần xin — xếp theo nhịp trang

Bản kiểm định đề xuất nhịp: **QUY MÔ → CON NGƯỜI → NHÀ → GIẢI TRÍ → GIÁ →
LIFESTYLE → PHÁP LÝ → SALE**. Đối chiếu với kho hiện có thì thiếu đúng những ô
dưới đây.

| Ưu tiên | Cần ảnh gì | Dùng ở đâu | Hiện có |
|---|---|---|---|
| **1** | **Nội thất** — phòng khách, bếp, phòng ngủ đã hoàn thiện | Trang từng dòng sản phẩm; khối "chọn theo cách sống" | **0** |
| **1** | **Người đang sống** — gia đình đi dạo, trẻ con chơi, người lớn tuổi | Xen giữa các khối kiến trúc | **0** |
| **2** | **Biển lagoon có người** — bãi cát, bơi, thuyền | Khối tiện ích, khối biệt thự biển | 0 |
| **2** | **Golf đang chơi** — không phải ảnh sân golf từ trên cao | Dòng biệt thự, khối giá trị tài sản | 1 (ảnh trên cao) |
| **3** | **VinWonders / thuỷ cung / công viên nước** | Khối tiện ích, khối "chín vịnh" | 0 |
| **3** | **Phố thương mại buổi tối có người** | Dòng liền kề — đúng lời hứa "vừa ở vừa kinh doanh" | 0 |
| **3** | **Rừng ngập mặn / cắm trại** | Khối phân khu, khối thiên nhiên | 0 |

Với **mỗi dòng sản phẩm**, bản kiểm định muốn ảnh nói được một **lối sống** chứ
không chỉ một kiểu nhà:

```
Nhà liền kề    nhà + phố thương mại + người đi bộ / quán cà phê
Song lập       nhà + sân vườn + gia đình
Đơn lập        nhà + khoảng riêng + cây xanh hoặc mặt nước
Biệt thự biển  nhà PHẢI thấy rõ mặt nước — nhìn một phát là biết biển
Căn hộ         toà nhà + view vịnh hoặc công viên + tiện ích
```

---

## Diện tích sản phẩm — đã tra cứu, và tôi đã báo động nhầm

Ngày 08/09 tôi cảnh báo một sai lệch: trang ghi liền kề **60 – 144 m²**, còn bộ
tài liệu chủ đầu tư ngày 06/09 ghi **50 · 60 · 70 m²**.

**Cảnh báo đó sai.** Tra lại ở `market.vinhomes.vn` — tên miền của Vinhomes:

> *"Nhà liền kề … diện tích đất từ 60m2 - 144m2, 4 tầng"* — phân khu Vịnh Thiên Đường

Con số trên trang **đúng**. Những số 50/60/70 m² trong PDF là **từng mẫu nhà cụ
thể** có mặt bằng 3D riêng, không phải khoảng diện tích của cả dòng. Tôi đọc một
danh sách mẫu rồi tưởng là một khoảng — và suýt sửa một con số đang đúng.

### Đã bổ sung được một số liệu còn thiếu

| Dòng | Diện tích đất | Tình trạng |
|---|---|---|
| Nhà liền kề | 60 – 144 m² | ✅ đối chiếu khớp nguồn chính thức |
| Biệt thự song lập | 162 – 183 m² | ✅ nguồn ghi "khoảng 162 m²" |
| **Biệt thự đơn lập** | **250 – 500 m²** | ✅ **mới bổ sung 08/09** |
| Biệt thự biển | 1.029 – 1.053 m² | chưa đối chiếu được |
| **Căn hộ cao tầng** | **vẫn trống** | ❌ không nguồn nào nêu |

Về **căn hộ cao tầng**: cả trang chính thức lẫn bộ tài liệu 06/09 đều **không
nêu diện tích từng căn**. Tài liệu chỉ nói quy mô cụm — The Sunrise Bay, 4,3 ha,
5 toà, 25 tầng, 2.300 căn. Nên ô này để trống, và **không suy ra**.

⚠️ Cả bốn con số vẫn gắn cờ `canXacNhan`. Trang tiếp thị của chủ đầu tư không
phải hồ sơ pháp lý — căn cứ cuối cùng vẫn là bảng hàng và hợp đồng mua bán tại
thời điểm giao dịch, đúng như câu trang này vẫn nói với khách.

### Bài học, vì nó suýt gây hại

Tôi đọc một tài liệu bán hàng rồi kết luận trang đang sai. Nếu chủ trang tin
tôi và sửa, trang đã mang một con số sai — do chính bước "kiểm tra" tạo ra.

Với số liệu, **một nguồn không đủ để bác bỏ một nguồn khác**. Phải tìm nguồn có
thẩm quyền cao hơn trước khi kết luận bên nào sai.

## Cảnh báo còn nguyên hiệu lực

Bộ tài liệu có **giá theo tiểu khu**. **KHÔNG đưa lên trang** — chủ trang đã chốt
không công khai con số giá nào, và quyết định đó vẫn giữ.