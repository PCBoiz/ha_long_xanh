# 06 · Ảnh — nghiên cứu và kết quả

Cập nhật **08/09/2026 (lần 2)**. Bản đầu của tài liệu này kết luận *"bộ PDF
không dùng làm nguồn ảnh được"*. **Kết luận đó sai, và đã sửa.** Phần đính
chính nằm ngay dưới, vì nó là phần quan trọng nhất của tài liệu.

---

## ⚠️ ĐÍNH CHÍNH — tôi đã loại cả một bộ ảnh vì một phép đo đúng, đọc sai

Chủ trang nói: *"File pdf đấy khá nhiều ảnh đẹp đấy."* Chủ trang đúng.

Điều tôi đo được thì đúng. Điều tôi kết luận từ nó thì sai.

```
ĐO ĐƯỢC (vẫn đúng)   Ảnh lớn nhất trong PDF   785 × 308
                     Ảnh đang dùng trên trang 2560 × ~1700

KẾT LUẬN (sai)       "Không đủ cho cả cái thẻ nhỏ nhất → bộ PDF không dùng được"
```

Sai ở đâu: tôi so ảnh PDF với **chỗ dùng ảnh lớn nhất** rồi kết luận cho **mọi
chỗ dùng ảnh**. Một tấm 785px không làm được ảnh nền toàn màn hình — đúng.
Nhưng nó thừa sức làm một thẻ trong dải trượt, và **thẻ trong dải trượt mới là
thứ trang đang thiếu**.

Và tôi kết luận mà **không thử phóng to lấy một lần**. Chủ trang phải bảo
*"thử resize lại rồi làm nét nó thử xem"* thì mới có phép thử. Kết quả: phóng
2,3× bằng lanczos3 kèm làm nét thì ảnh **giữ được nét**, so ở tỉ lệ 1:1 với bản
phóng thô thì hơn hẳn.

> **Bài học, cùng họ với bài học diện tích liền kề bên dưới:** một phép đo chỉ
> bác bỏ được đúng cái nó đo. Muốn kết luận rộng hơn thì phải đo rộng hơn —
> hoặc phải thử.

---

## Đã làm gì — đợt 08/09

### Bóc lại toàn bộ PDF, lần này tra tận gốc

Lần đầu quét theo dấu hiệu đầu/cuối JPEG, được 72 ảnh. Lần này đọc thẳng bảng
đối tượng của PDF: **95 ảnh khai trong file**, trong đó 72 là JPEG (đúng bộ đã
bóc) và 23 còn lại là ảnh mặt nạ hoặc logo bé xíu. **Không sót tấm lớn nào** —
trần độ phân giải 785 × 308 là thật.

### Chọn 13 tấm, theo ba luật

Đọc từng tấm bằng mắt ở cỡ thật, không tin bảng số.

**Luật 1 — chỉ lấy ảnh sạch.** Phần lớn là cả trang đã dàn sẵn, chữ quảng cáo
của chủ đầu tư nướng vào ảnh. Dán một trang như thế lên đây là đưa lời quảng
cáo của bên bán vào một trang tự nhận là kênh tư vấn độc lập.

**Luật 2 — không lấy ảnh mang nhãn bên thứ ba.** Đã loại hai tấm đẹp:

| Tấm | Vì sao loại |
|---|---|
| Sân trường đại học, có sinh viên | Góc trái có logo **ARA HOMES** — một sàn môi giới khác |
| Phố hàng hiệu, có khách ngồi café | Biển **Hermès · Hennessy · Häagen-Dazs** — hứa hộ chủ đầu tư những thương hiệu chưa ai công bố sẽ có mặt |

Tấm thứ hai đáng tiếc nhất: nó trả lời đúng câu *"tối ở đây có gì"*. Nhưng một
tấm ảnh có biển Hermès là một lời hứa, và trang này không hứa hộ ai.

**Luật 3 — cắt chữ chú thích, rồi nói lại bằng chữ đọc được.** Ảnh gốc có dòng
*"hình ảnh chỉ mang tính chất minh hoạ"* ở mép dưới, cao 8–20 điểm ảnh, không
ai đọc nổi. Đã cắt, và thay bằng hai thứ đọc được:

- mọi câu `alt` mở đầu bằng chữ **"Phối cảnh"**
- một câu in đậm ngay dưới tiêu đề khối: *"Toàn bộ là phối cảnh do chủ đầu tư
  phát hành — chưa phải ảnh chụp công trình đã xong"*, kèm liên kết sang trang
  tiến độ nơi có ảnh công trường thật, có ngày tháng

Cắt một lời cảnh báo không ai đọc được rồi thay bằng lời cảnh báo đọc được thì
trang **minh bạch hơn**, không phải kém đi.

### Xử lý ảnh

```
Cắt bỏ phần có chữ  →  phóng lanczos3, TỐI ĐA 2,3×  →  làm nét (sigma 0.8)
                                  ↓
                            846 – 1400 px
```

Hệ số 2,3× không phải số đẹp; đó là mức đã so bằng mắt ở tỉ lệ 1:1 và thấy còn
giữ nét. Vượt mức đó là đoán.

⚠️ `prepare()` trong `fetch-assets.mjs` áp `withoutEnlargement`, nên **mọi việc
phóng to phải xong TRƯỚC khi file vào `anh-goc/`** — script không phóng hộ.

### Đưa 13 tấm vào đúng chỗ

| Ở đâu | Bao nhiêu | Làm gì |
|---|---|---|
| Trang chủ — khối *"Sống ở đây thì một ngày trôi thế nào"* | 10 | Dải trượt ngang, mỗi thẻ là một câu người mua hay hỏi |
| `/tien-ich` — khối *"Cùng những nơi đó, khi có người"* | 3 | Đối trọng với bốn tấm cảnh rỗng ngay phía trên |

**Không tấm nào nằm không.** Đã đối chiếu tên ảnh sinh ra với tên ảnh được nhắc
trong `src/` — 13/13 đều có chỗ dùng. Đây là rút kinh nghiệm từ chín tấm `khu-*`
từng nằm chết trong kho sau khi bị gỡ khỏi trang.

---

## Vì sao KHÔNG đổi ảnh năm thẻ sản phẩm

Bản kiểm định bên ngoài muốn mỗi dòng sản phẩm đại diện một **lối sống** chứ
không phải một kiểu nhà. Yêu cầu đúng. **Nhưng bộ ảnh mới không đáp ứng được,
và ghép bừa thì tệ hơn là để nguyên.**

Cụ thể: tấm *"gia đình đi trên thảm cỏ"* chụp một dãy **nhà phố hiện đại**.
Gán nó cho **biệt thự song lập** là nói với người đọc rằng song lập trông như
thế — một khẳng định sai, nói bằng hình. Cùng loại lỗi với chín tấm cắt từ một
bản đồ mà mỗi tấm lại mang tên một phân khu khác.

Ảnh sản phẩm hiện tại là phối cảnh do chủ đầu tư phát hành **cho đúng dòng đó**,
nhãn khớp nội dung. Giữ nguyên.

**Cần gì để làm được:** ảnh lối sống mà chủ đầu tư ghi rõ thuộc dòng nào. Chưa
có nguồn nào như thế.

---

## Vì sao dải chín phân khu vẫn KHÔNG có ảnh

Đã đổi từ lưới bốn thẻ sang **dải trượt đủ chín** — tiêu đề ghi "Chín vịnh và
đảo" mà bày bốn cái thì người đọc đếm được, và cái họ rút ra không phải "còn
năm khu ở trang khác" mà "trang này nói một đằng bày một nẻo".

Nhưng vẫn không thẻ nào có ảnh, vì lý do cũ chưa mất: ảnh phân khu đều cắt từ
**cùng một** bản vẽ quy hoạch, và bộ phối cảnh mới **không lấp được chỗ này**.
Một tấm phối cảnh phố thương mại là phối cảnh của dự án nói chung; gán nó cho
*Đảo Pha Lê* là bịa ra một sự thật về nơi cụ thể đó.

Chỉ ảnh nào chủ đầu tư ghi rõ thuộc phân khu nào mới được đặt vào đây.

---

## Kho ảnh sau đợt này

```
                          trước    sau
Phối cảnh kiến trúc         14      14
Tiến độ công trường         12      12
Cắt từ bản đồ                9       9   (không dùng trên trang)
Bản đồ / mặt bằng            6       6
Toàn cảnh / phong cảnh       6       6
Tiện ích                     5       5
Đời sống (mới)               0      13   ← đợt này
                           ────    ────
                            52      65
```

Ba con số từng là **0**:

```
                          trước    sau
Ảnh nội thất                 0       2
Ảnh giải trí                 0       4
Ảnh có người trong khung  gần 0       8
```

Tỉ lệ kiến trúc / đời sống từ khoảng **95/5** về khoảng **80/20**. Bản kiểm
định muốn 50/50; chưa tới, và không tới được bằng bộ PDF này — phần còn lại
phải là ảnh gốc xin từ chủ đầu tư.

---

## Vẫn cần xin chủ đầu tư

| Ưu tiên | Cần ảnh gì | Vì sao bộ PDF không thay được |
|---|---|---|
| **1** | Nội thất **theo từng dòng sản phẩm** | Hai tấm hiện có là căn mẫu chung, không rõ thuộc dòng nào |
| **1** | Ảnh lối sống **gắn tên dòng sản phẩm** | Không gán được nếu chủ đầu tư không ghi rõ |
| **2** | Ảnh **gắn tên phân khu** | Chín thẻ phân khu vẫn không có ảnh nào dùng được |
| **3** | Bản độ phân giải đầy đủ của chính 13 tấm này | Bản đang dùng là bản phóng 2,3×; có bản gốc thì dùng được cả ở khổ lớn |

**Việc của chủ trang:** xin bộ ảnh gốc, tải lên thư mục Drive đang dùng, gửi lại
danh sách ID. Thêm ảnh chỉ là thêm một mục vào `ASSETS` rồi chạy `npm run assets`.

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

---

## Cảnh báo còn nguyên hiệu lực

Bộ tài liệu có **giá theo tiểu khu**. **KHÔNG đưa lên trang** — chủ trang đã chốt
không công khai con số giá nào, và quyết định đó vẫn giữ.
