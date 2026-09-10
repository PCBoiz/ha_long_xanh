# Nhật ký — halongxanh360.vn

Mới nhất ở trên. Đọc tệp này **trước khi bắt tay vào việc**, đừng suy lại từ đầu
từ mã nguồn.

Sổ này KHÔNG chép lại git log — git đã ghi từng thay đổi và lý do rồi. Sổ giữ
đúng phần git không giữ được: trạng thái bắc qua nhiều phiên, việc nằm ngoài
kho, và những kết luận đã kiểm chứng để khỏi kiểm lại.

Kho anh em: `D:\Dự án cô Giang` (Antigravity OS) — nơi sinh ra bài đăng lên đây.

---

## 10/09/2026 — VÒNG 7 · nghiên cứu GEO/SEO và việc có tác động cao nhất

### Việc có tác động cao nhất hoá ra nhỏ nhất — và tôi đã nhìn qua nó nhiều lần

Tên miền là `halongxanh360.vn` mà **0/17 tiêu đề có chữ "Hạ Long Xanh"**. Chỉ
2/17 có "Vinhomes". Khuôn tiêu đề dùng tên ngắn "Global Gate Hạ Long" — tiết kiệm
9 ký tự, nhưng 9 ký tự đó đúng là chữ người ta gõ vào ô tìm kiếm.

**Đây là hai cụm truy vấn TÁCH BIỆT:** người gõ "hạ long xanh giá bán" ra một
nhóm trang hoàn toàn khác nhóm "vinhomes global gate". Trang chỉ phủ một nửa, và
nửa bị bỏ chính là nửa trùng tên miền của mình.

| | Trước | Sau |
|---|---|---|
| "Vinhomes" trong tiêu đề | 2/17 | **17/17** |
| "Hạ Long Xanh" | **0/17** | 3/17 |
| "2026" | 1/17 | 4/17 |
| Tiêu đề vượt 65 ký tự | 1 | 0 |

Tiêu đề trang chủ bỏ khẩu hiệu (71 → 43 ký tự) vì Google cắt ở khoảng 60, mà cắt
thì mất đúng phần đuôi. Khẩu hiệu vẫn ở H1, ở `og:title`, và trong dữ liệu có
cấu trúc.

### Ba kết luận nghiên cứu làm đổi thứ tự ưu tiên

1. **Bất động sản là ngành AI Overviews xuất hiện ÍT NHẤT** — 4,48–5,8% truy vấn
   (Ahrefs 146 triệu SERP; Conductor 21,9 triệu truy vấn), thấp nhất mọi ngành.
   Và khi lọt vào, người dùng **chỉ bấm link trong đó 1% số lần** (Pew, 68.879
   truy vấn). Đổ công riêng cho AIO là cược vào chỗ gần như không tồn tại.

2. **"GEO" chủ yếu vẫn là SEO tốt.** Tổng hợp 54 nghiên cứu: thứ hạng tìm kiếm
   9,4/10, **JSON-LD chỉ 5,6**, **llms.txt 2,0 — thấp nhất trong 23 yếu tố**.

3. **FAQ schema BỊ DỮ LIỆU BÁC BỎ.** Seer (8.500 từ khoá, 6.354 trang): nhóm có
   tỷ lệ FAQ schema cao nhất (69%) **thua 10 lần**. "Article + Breadcrumb là đủ,
   phần còn lại là markup lãng phí."

⚠️ **Tự hiệu chỉnh:** bản vá `FAQPage` ở vòng 6 vẫn đúng **nhưng vì lý do khác** —
nó sửa một vi phạm chính sách (khai câu hỏi ở trang không hiển thị), không phải
để tăng thứ hạng. Và khối `DuLieuQuyCan` tôi thêm cùng vòng nằm ở mức **trung
bình** về tác động, không cao như tôi tưởng lúc bắt tay. Phần đáng giá của nó
không phải bản thân JSON-LD mà là **số liệu cụ thể có mốc thời gian** (8,3/10).

### Chỗ trang này đang thắng — đo trên HTML đối thủ

| | halongxanh360 | đối thủ |
|---|---|---|
| Số địa chỉ trong sitemap | 31 | 185–270 |
| Từ ở trang quỹ căn | **34.322** | không ai có |
| Video nhúng | 0 | 3–7 |

Trên các trang khác, riêng dòng liền kề giá lan truyền từ **3,8 tỷ tới 9,9 tỷ**
— chênh 2,6 lần — và không trang nào ghi rõ trước hay sau thuế. Người mua không
có cách nào so sánh. **10/10 đối thủ top đều tự xưng "Thông Tin Chính Thức Chủ
Đầu Tư"**, nên góc tư vấn độc lập là chỗ trống thật.

Cách lấp khoảng cách 31 so với 270 **không phải viết thêm 200 bài** mà đào sâu
hai chỗ trên.

### Kỳ vọng thời gian, có số
Ahrefs (~2 triệu từ khoá): **chỉ 5,7% trang mới lọt top 10 trong một năm**; với
từ khoá lượng tìm cao là 0,3%. Google tự nói "bốn tháng đến một năm". **Sáu tháng
tới khách đến từ Zalo, nhóm Facebook, sàn đăng tin** — không từ tìm kiếm.

### Vòng sau nên làm
- Đối thủ có video nhúng, trang này có 0.
- Viết cho truy vấn đuôi dài dạng câu hỏi (≥7 chữ kích hoạt AIO 46,4% so với 1
  chữ 9,5%).
- `llms.txt` còn 14/31 link ở dạng URL trần, và mốc `Cập nhật:` dùng giờ UTC nên
  lệch ngày với giờ Việt Nam (kho đã có sẵn `homNayVN()` mà chỗ này không dùng).

Toàn bộ: `KE-HOACH-LEN-TIM-KIEM.md` (+ PDF).

## 10/09/2026 — VÒNG 6 · hai lỗi dữ liệu có cấu trúc

Tìm ra bằng một tác tử audit riêng, tôi kiểm lại từng cái trước khi sửa.

### 1. `sitemap.ts` là tệp động DUY NHẤT bị bỏ sót `force-dynamic`

`robots.ts`, `llms.txt/route.ts`, `tin-tuc/page.tsx`, `tin-tuc/[slug]` đều đã khai
cờ này. Riêng `sitemap.ts` thì không — nên Next dựng sẵn lúc build rồi phục vụ
bản đóng băng.

**Hậu quả đúng bằng điều chú thích trong chính tệp đó nói là phải tránh:** bài đầu
tiên do Antigravity đăng sẽ hiện ngay ở `/tin-tuc` nhưng **không bao giờ vào
sitemap** cho tới lần dựng lại. Chú thích đúng ý định, chỉ hành vi là sai.

Nhân tiện bỏ luôn `lastModified` của trang tĩnh: cả 31 địa chỉ mang cùng một mốc
`new Date()` lúc build, nhảy theo mỗi lần deploy chứ không theo nội dung. Google
bỏ qua `lastmod` khi thấy không nhất quán. **Một mốc bịa tệ hơn không có mốc.**
Bài viết có ngày đăng thật thì vẫn giữ.

### 2. `FAQPage` phát trên MỌI trang, trong khi FAQ chỉ hiện ở trang chủ

`DuLieuCoCauTruc` gắn ở `layout.tsx:126` nên nó đi theo mọi trang. Khối `FAQPage`
9 câu hỏi vì thế xuất hiện cả ở `/gia-…` và `/quy-can-…` — những trang **không hề
hiển thị câu hỏi nào**.

Google yêu cầu dữ liệu có cấu trúc phải khớp nội dung nhìn thấy được. Khai câu hỏi
không hiển thị là vi phạm, và hình phạt không phải mất riêng khối sai — **mà là bỏ
qua cả khối đang đúng ở trang chủ.**

Chú thích ngay trên khối đó đã viết *"đang HIỂN THỊ trên trang chủ"* từ đầu. Ý định
đúng, chỗ đặt sai, và không ai thấy vì trang vẫn dựng được.

Đã sửa: `coFaq` mặc định tắt, cộng một thành phần `DuLieuFaq` riêng đặt ngay cạnh
`CauHoiThuongGap` ở trang chủ — hai thứ đi cùng nhau thì không rời nhau được nữa.
**Đo lại: trang chủ 1 khối `FAQPage`, `/gia-…` và `/quy-can-…` đều 0.**

### Đã kiểm và KHÔNG cần sửa
- `robots.txt` tốt, đúng thực hành 2026: 13/14 bot AI có nhóm riêng, và `*` phủ
  phần còn lại nên **không bot nào bị chặn**. Có dòng `Sitemap:`.
- `llms.txt` đúng quy ước llmstxt.org, **31/31 link trỏ tới tuyến có thật, 0 link chết**.
- `sitemap.xml` 31 URL, khớp đúng 21 `page.tsx` (17 tĩnh + 9 phân khu + 5 sản phẩm).
- `/duyet-bai` cố ý ngoài sitemap và có `noindex, nofollow` — đúng.
- **Không có chuẩn mới nào của 2026 mà trang đang thiếu.** llms.txt vẫn chưa được
  hãng nào cam kết đọc; Google xác nhận không hỗ trợ. Chú thích trong kho mô tả
  đúng tình trạng đó.

### Vòng sau nên làm
- Trang quỹ căn chưa có `Product`/`Offer` schema — bảng giá từng căn là dữ liệu AI
  trích dẫn nhiều nhất, mà hiện không có gì cho máy đọc.
- 14/31 link trong `llms.txt` ở dạng URL trần thay vì `[tên](url)`.
- `Cập nhật:` trong `llms.txt` dùng giờ UTC (lệch ngày với giờ Việt Nam) — kho đã
  có sẵn `homNayVN()` mà chỗ này không dùng.

## 09/09/2026 — VÒNG 1 tự chủ · audit ảnh

### Tìm ra: ba ảnh AI đang nằm trên trang đang chạy

`/tien-ich` giới thiệu ba tấm này như tiện ích của dự án, cả ba là **ảnh sinh
bằng AI**. Bằng chứng nhìn thấy được, không phải suy đoán:

| Ảnh | Bằng chứng |
|---|---|
| `giai-tri-lang-tuyet` | Biển ghi **"NORTH S POLE"** — chữ vỡ, khoảng cách sai; biển nhà gỗ là ký tự vô nghĩa |
| `giai-tri-cong-vien-nuoc` | Biển ghi **"Công viên Nước Đ5 chề mts"** — chữ Việt nát; chủ đề "INCA EMPIRE" giữa vịnh Hạ Long |
| `giai-tri-rap-xiec` | Còn nguyên **hình mờ của trình sinh ảnh** ở góc phải dưới |

Hai tấm nữa bị cách ly vì chưa xác minh được nguồn: `giai-tri-nha-hang-duoi-nuoc`
(trông như ảnh chụp một nhà hàng thuỷ cung đã tồn tại, và "nhà hàng dưới nước"
KHÔNG có trong `hangMucTienIch`) và `giai-tri-thuy-cung` (1400×920, cùng dải với
ảnh tải từ web, khác hẳn bộ gốc 2560px).

### Nguyên nhân gốc — đáng nhớ hơn cả phát hiện

Chú thích thẩm định ngay trên mảng đó viết *"Ba tấm này lấy từ bộ tài liệu 06/09
của chủ đầu tư"* — **nhưng mảng đã có SÁU tấm.** Ba tấm thêm sau không ai thẩm
định, và đúng ba tấm đó là ảnh AI.

**Bài học không phải "kiểm ảnh kỹ hơn" mà là: một chú thích đếm số thì phải đếm
lại khi thêm.** Chú thích nói ba mà mảng có sáu là chú thích đang nói dối, và nó
nói dối đúng lúc người đọc tin nó nhất.

### Đã sửa
- Gỡ 4 ảnh khỏi `/tien-ich`, 1 ảnh khỏi dải ảnh lớn.
- Tạo `src/data/anh-cam-dung.ts` — danh sách cấm kèm **bằng chứng từng tấm**, để
  không phải thẩm định lại và để người sau không đưa lại.
- Dạy `kiem-anh-treo` phân biệt **ảnh bị quên** với **ảnh cố ý cách ly**. Không có
  phân biệt đó thì mỗi lần cách ly là một lần cổng đỏ, và cách người ta xử một
  cổng đỏ mãi không xanh được là tắt nó đi.
- ⚠️ Và phải loại `anh-cam-dung.ts` khỏi phép `git grep` của bộ kiểm — vì nó CHỨA
  TÊN ảnh, không loại thì ảnh vừa cấm lại được đếm là "đang dùng". Bộ kiểm nói
  dối theo hướng trấn an là kiểu hỏng tệ nhất.

### Dương tính giả — đừng điều tra lại
- `kiem-anh-trung` cụm 1 (ba mặt bằng) và cụm 2 (bãi tắm ↔ nhà hàng): **không
  phải trùng**. Bản vẽ nét trên nền trắng, và ảnh cùng tông xanh, thì băm tri
  giác nào cũng báo giống nhau. Máy so pixel; mắt so tài vật.
- `giai-tri-cong-vien-chu-de` **giữ lại**: đó là ảnh quảng cáo chính thức của
  VinWonders, không phải ảnh AI. VinWonders có trong danh sách tiện ích đã xác minh.

### VÒNG 2 — không phép kiểm nào bị quên được nữa

Vòng 1 tìm ra: `scripts/` có 21 tệp, `package.json` chỉ gọi 14. Bảy tệp không
chạy được bằng `npm run`, **trong đó có hai bộ `kiem-*`**.

Cách chữa **không phải** đăng ký hai cái đó — hôm nay xanh, nhưng lần sau thêm
phép kiểm thứ ba mà quên đăng ký thì lặp lại đúng chuyện. Đã bỏ hẳn bước đăng ký:
`npm run kiem` **tự tìm** mọi tệp tên `kiem-*` rồi chạy hết. Không có gì để quên.

**9/9 phép kiểm đạt** — gồm cả hai cái trước đây không ai chạy được.

Một phép kiểm hỏng KHÔNG dừng cả bộ: chạy hết rồi mới báo, vì khi sửa người ta
cần biết tất cả cái đang hỏng, không phải cái đầu tiên.

Kèm `scripts/thu-nho-anh.mjs` để soi ảnh 2560px bằng mắt (vượt giới hạn công cụ
đọc ảnh). ⚠️ Bản đầu dùng `file://` trong `setContent` — trình duyệt chặn, ảnh
không nạp, và ảnh chụp ra là **khung vuông trống**. Có tệp đầu ra, đúng tên, chỉ
là không có ảnh. Đã đổi sang nhúng `data:` URI.

### VÒNG 4 — bộ kiểm liên kết chết

Kho có `kiem-anh-treo` canh ảnh, nhưng **liên kết thì chưa có gì canh** — trong
khi liên kết chết nhìn từ phía người dùng còn tệ hơn ảnh thiếu: ảnh thiếu là một
khoảng trống, liên kết chết là một lần bấm rơi vào trang lỗi.

Và đây đúng loại lỗi biên dịch được mà vẫn hỏng: `href="/quy-hoac"` thiếu một
chữ vẫn qua `tsc`, qua `eslint`, qua `next build`. Đúng hình dạng của lỗi đã làm
vỡ `/quy-hoach` trước đây.

`npm run kiem` giờ chạy **10/10**, gồm `kiem-lien-ket` mới: 18 tuyến tĩnh, 3
tuyến động, 9 chuyển hướng 301, kiểm 25 liên kết — không cái nào trỏ vào hư không.

**⚠️ Đã CHỨNG MINH nó biết báo lỗi**, không chỉ biết báo đạt: tạo một tệp tạm có
`href="/tuyen-khong-ton-tai"`, bộ kiểm bắt đúng và chỉ ra tệp:dòng. Một phép kiểm
chưa bao giờ báo lỗi thì chưa chứng minh được nó biết báo lỗi — và một phép kiểm
luôn xanh còn nguy hiểm hơn không có, vì nó làm người ta yên tâm.

Hai thứ cố ý tính là HỢP LỆ, đừng "sửa": tuyến động (`/phan-khu/[ma]` khớp mọi
mã), và chuyển hướng 301 (`/bang-hang` không còn là tuyến nhưng vẫn sống — coi
là lỗi thì bộ kiểm đang bảo gỡ đúng thứ được cố ý giữ cho link cũ khỏi chết).

### CHƯA XÉT — đừng tưởng đã xong
`kiem-anh-trung` cụm 3: `song-dai-lo-mua-hoa` ↔ `vbm-hoan-thien-02`, lệch 10 bit.
**Tôi không xem được hai tấm này** — công cụ đọc ảnh từ chối kể cả sau khi thu
xuống 760px. Đây là hạn chế phía công cụ, không phải kết luận rằng chúng ổn.
Cần một người mở hai tệp đó ra nhìn.

### Vòng sau nên làm
- 7 script trong `scripts/` không đăng ký trong `package.json` nên không chạy được
  bằng `npm run` — trong đó có **hai bộ `kiem-*`**. Một phép kiểm không ai chạy
  được là một phép kiểm không chạy. **Đã đăng ký 2 cái, còn 5 tệp công cụ.**
- Thêm một phép kiểm meta: mọi `scripts/kiem-*.mjs` phải có mặt trong `package.json`.

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

### Lỗi tìm được khi đo, không phải khi đoán (09/09)

**`/du-an` đang nhúng cả bảng 616 căn** — 1,45 MB HTML, 34.442 từ, gần bằng
chính trang bảng hàng. Phát hiện ra vì con số 34.442 đứng lệch hẳn khỏi phần
còn lại khi đếm từ toàn trang, chứ không phải vì mở trang ra xem.

Hai hậu quả, cái thứ hai âm thầm hơn: nặng; và **trùng nội dung** với
`/quy-can-global-gate-ha-long` — hai địa chỉ cùng mang một khối lớn thì Google
tự chọn cái nào đáng xếp hạng, và có thể chọn trang mình không muốn.

Đã thay bằng tóm tắt: **1.450 KB → 129 KB · 34.452 từ → 916 từ**. Bảng vẫn ở
nguyên một nơi duy nhất. `/phan-khu/*` cũng tăng 345 → 492 từ nhờ khối tóm tắt.

Bài học ghi lại: **đếm từ toàn bộ trang là phép đo rẻ mà bắt được lỗi cấu trúc.**
Nên chạy lại sau mỗi đợt sửa lớn.

### ⚠️ MÂU THUẪN CHƯA GIẢI — tiểu khu thuộc phân khu nào (09/09)

Bảng hàng SalePro **chỉ có cột tiểu khu**, không có cột phân khu. Nên không suy
ra được "tiểu khu này thuộc phân khu kia" từ dữ liệu.

- **Chủ trang trả lời (09/09):** cả "Vịnh Bình Minh 1" (345 căn) và "Thiên Đường
  Nhiệt Đới 1" (271 căn) đều thuộc **Vịnh Thiên Đường**.
- **Tra chéo lại thì ngược:** vinhomeshalongxanhquangninh.com (trang mặt bằng
  Paradise Bay) mô tả Thiên Đường Nhiệt Đới là *"khu vực bãi biển nhân tạo ngay
  phía Nam"* **CỦA** Vịnh Thiên Đường, và liệt kê ba khu giáp ranh là Thiên
  Đường Xanh / Đảo Thiên Đường / Vịnh Hoàng Hôn — tức nằm CẠNH, không nằm TRONG.
- **Nhưng một trang khác lại nói nằm TRONG.** Hai nguồn ngoài mâu thuẫn nhau nên
  không phân xử được, và không đủ sức bác người đang giữ tài liệu gốc.

**Đã xử lý:** viết câu đúng dưới CẢ HAI cách hiểu — "toàn dự án hiện mở bán 616
căn ở hai tiểu khu X và Y", lấy thẳng từ hệ thống chủ đầu tư. Khối này hiện trên
cả chín trang phân khu (`bang-hang-quanh-day.tsx`).

**🔓 Mở khoá khi nào:** khi có mặt bằng chính thức của chủ đầu tư ghi rõ ranh
giới phân khu. Lúc đó tách được theo từng khu, và `/phan-khu/paradise-bay` sẽ
nói được điều mạnh hơn hẳn hiện nay.

### Ba dữ liệu chủ trang xác nhận LÀ CÓ trong tài liệu, nhưng chưa gửi (09/09)
1. Diện tích từng phân khu (ha)
2. Lộ trình mở bán từng khu (chỉ cần thứ tự đợt, không cần ngày)
3. Phân khu nào bán dòng sản phẩm nào

Chín trang phân khu mỏng vì **kho chỉ giữ ba gạch đầu dòng + một toạ độ mỗi
khu**. Ba dữ liệu trên là thứ duy nhất làm chúng dày lên mà không phải bịa.
Không có chúng thì đừng viết thêm — nói vòng còn tệ hơn ngắn.

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
