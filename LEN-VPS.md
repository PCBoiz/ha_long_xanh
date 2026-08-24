# Đưa halongxanh360.vn lên VPS

Tài liệu này thay phần "trỏ tên miền" trong [TRIEN-KHAI.md](TRIEN-KHAI.md) bằng
số liệu thật của hai tên miền đã mua tại P.A Việt Nam.

**Kiến trúc đã chốt:**

| Thành phần | Chạy ở đâu | Địa chỉ |
|---|---|---|
| Trang bán hàng | VPS riêng | `halongxanh360.vn` |
| Tên miền phụ | cùng VPS, 301 về chính | `halongxanh360.com.vn` |
| Antigravity | **ở lại Vercel** | `*.vercel.app` |
| Cơ sở dữ liệu | Neon | dùng chung cho cả hai |

---

## ⚠️ Ba cái bẫy đọc trước khi đụng vào DNS

### 1. Đừng xoá bản ghi MX — email sẽ chết

Hoá đơn có **Email Pro #1** cho cả hai tên miền. Nghĩa là đang có bản ghi MX
trỏ về máy chủ thư của P.A Việt Nam.

Khi thêm bản ghi A trỏ về VPS, **chỉ thêm và sửa bản ghi A**. Xoá sạch rồi tạo
lại từ đầu là mất luôn MX, và mọi email gửi tới tên miền sẽ bị trả về — im
lặng, vì trang web vẫn chạy bình thường nên không ai nghĩ tới email.

Chụp màn hình bảng DNS trước khi sửa. Mất ba mươi giây.

### 2. DNSSEC đang bật — sai là hỏng nặng hơn bình thường

Hoá đơn có **Bảo Mật DNSSEC** cho cả hai tên miền. DNSSEC ký số cho bản ghi
DNS, nên khi cấu hình lệch, trình duyệt không "tạm thời không vào được" mà
**từ chối phân giải hẳn**.

Đổi bản ghi A trong cùng vùng DNS thì không sao. Nhưng **đổi máy chủ tên (NS)
sang nhà cung cấp khác** — ví dụ chuyển sang Cloudflare — thì phải tắt DNSSEC
trước, chuyển xong, bật lại. Bỏ bước tắt là tên miền chết vài giờ tới vài ngày.

Kế hoạch này **không đổi NS**, chỉ sửa bản ghi A ngay tại P.A Việt Nam. An
toàn nhất.

### 3. Trỏ DNS TRƯỚC, rồi mới chạy triển khai

Caddy xin chứng chỉ SSL bằng cách để Let's Encrypt gọi ngược về tên miền. DNS
chưa trỏ đúng thì lượt gọi đó thất bại.

**Let's Encrypt chỉ cho 5 lần thất bại mỗi tuần cho cùng một tên miền.** Đốt
hết là phải chờ sang tuần. Đây là lỗi khó chịu nhất trong cả quy trình, và
tránh được bằng đúng một việc: kiểm tra DNS đã trỏ đúng trước khi chạy
`./trien-khai.sh`.

---

## Giai đoạn 1 — Mua VPS

Cấu hình tối thiểu cho riêng trang này (Antigravity ở lại Vercel nên không cần
thêm bộ nhớ cho nó):

| Mục | Tối thiểu | Nên có |
|---|---|---|
| RAM | 2 GB | 4 GB |
| CPU | 2 nhân | 2 nhân |
| Ổ SSD | 40 GB | 60 GB |
| Hệ điều hành | Ubuntu 24.04 LTS | Ubuntu 24.04 LTS |
| Vị trí | Việt Nam | Việt Nam |

Chọn máy chủ **đặt tại Việt Nam**: khách là người Hà Nội, Hải Phòng, Quảng
Ninh, và đường truyền trong nước nhanh hơn đáng kể so với đi qua Singapore.

Sau khi mua, ghi lại **địa chỉ IP** của VPS. Toàn bộ phần DNS dưới đây cần đúng
con số đó.

---

## Giai đoạn 2 — Trỏ DNS tại P.A Việt Nam

### Vào trang quản lý

Hai đường, dùng đường nào cũng được:

- `https://access.pavietnam.vn/login.php` — đăng nhập bằng **tên miền** và mật
  khẩu được cấp khi mua
- `https://support.pavietnam.vn` — đăng nhập bằng **mã khách hàng** dạng
  `PA-xxxxx`, rồi vào **Dịch vụ → Đang sử dụng →** nút `…` ở cột Quản lý **→
  Quản lý**

### Bản ghi cần có cho `halongxanh360.vn`

| Loại | Tên | Giá trị | Ghi chú |
|---|---|---|---|
| A | `@` (hoặc để trống) | `<IP VPS>` | tên miền gốc |
| A | `www` | `<IP VPS>` | Caddy sẽ 301 về gốc |
| MX | *(giữ nguyên)* | *(giữ nguyên)* | **đừng đụng vào** |

### Bản ghi cần có cho `halongxanh360.com.vn`

Giống hệt — cả hai bản ghi A cùng trỏ về **một IP**. Caddy phân biệt bằng tên
miền trong yêu cầu và chuyển hướng 301 về `halongxanh360.vn`.

| Loại | Tên | Giá trị |
|---|---|---|
| A | `@` | `<IP VPS>` |
| A | `www` | `<IP VPS>` |
| MX | *(giữ nguyên)* | *(giữ nguyên)* |

### Kiểm tra đã trỏ đúng chưa

Chờ 15–30 phút rồi chạy trên máy của bạn:

```bash
nslookup halongxanh360.vn
nslookup www.halongxanh360.vn
nslookup halongxanh360.com.vn
nslookup www.halongxanh360.com.vn
```

Cả bốn phải trả về đúng IP của VPS. **Chỉ khi cả bốn đều đúng mới sang bước
sau.** Một cái sai là Caddy đốt một lượt trong hạn mức 5 lần/tuần.

---

## Giai đoạn 3 — Dựng máy chủ

Đăng nhập VPS qua SSH rồi chạy:

```bash
# 1. Cài Docker, tường lửa, cập nhật bảo mật tự động
bash dung-may-chu.sh

# 2. Lấy mã về (sau khi đã đẩy lên GitHub)
git clone <địa-chỉ-kho> halongxanh
cd halongxanh

# 3. Tạo file cấu hình
cp .env.example .env
nano .env
```

Điền `.env`:

```bash
TEN_MIEN=halongxanh360.vn
TEN_MIEN_PHU=halongxanh360.com.vn
EMAIL_SSL=<email bạn đọc thường xuyên>
NEXT_PUBLIC_SITE_URL=https://halongxanh360.vn
DATABASE_URL=<chuỗi kết nối Neon, có -pooler và ?sslmode=require>
INGEST_TOKEN=<sinh ở bước dưới>
NEXT_PUBLIC_CHO_LAP_CHI_MUC=1
```

Sinh token cho cổng nhận bài:

```bash
openssl rand -base64 48
```

Chép giá trị đó vào `INGEST_TOKEN`. **Lát nữa cần lại giá trị này để dán sang
Antigravity** — hai bên phải trùng khớp tuyệt đối.

Rồi chạy:

```bash
./trien-khai.sh
```

Script tự kiểm `.env` đủ ô chưa, kiểm cú pháp Caddyfile, dựng, và chờ tới khi
trang trả về phản hồi thật.

---

## Giai đoạn 4 — Áp cấu trúc dữ liệu

Bảng `su_kien` (đo lường chuyển đổi) là bảng mới, chưa có trên Neon.

```bash
npm run db:migrate
```

Chạy **một lần**, từ máy có `DATABASE_URL`. Không chạy thì cổng `/api/su-kien`
ghi hỏng và im lặng bỏ qua — trang vẫn chạy, chỉ là không đếm được gì.

---

## Giai đoạn 5 — Nối Antigravity

Antigravity ở lại Vercel. Nó gọi tới cổng nhận bài của trang qua internet.

### Bên Antigravity — thêm hai biến môi trường

Vào bảng điều khiển Vercel của dự án Antigravity → **Settings → Environment
Variables**, thêm:

| Tên biến | Giá trị |
|---|---|
| `VINHOMES_SITE_URL` | `https://halongxanh360.vn` |
| `VINHOMES_INGEST_TOKEN` | *(đúng chuỗi đã đặt cho `INGEST_TOKEN` ở bước 3)* |

Rồi triển khai lại Antigravity để biến mới có hiệu lực.

### Kiểm đường đăng bài

Từ máy bất kỳ:

```bash
curl -i -X POST https://halongxanh360.vn/api/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <INGEST_TOKEN>" \
  -d '{"slug":"thu-nghiem","tieuDe":"Bài thử","moTa":"Kiểm đường ống","ngayDang":"2026-08-15","chuyenMuc":"tien-do"}'
```

- **200** → đường ống thông. Mở `https://halongxanh360.vn/tin-tuc` sẽ thấy bài.
- **401** → token hai bên không khớp.
- **503** → `INGEST_TOKEN` trên VPS còn trống.

Xoá bài thử bằng cách xoá dòng đó trong bảng `bai_viet` trên Neon.

### Về bảo mật của cổng này

Token đi qua internet nên **bắt buộc phải là HTTPS** — cổng từ chối HTTP. Đây
là đánh đổi của việc để Antigravity ở lại Vercel: nếu cả hai cùng nằm trên một
VPS thì lượt gọi đi trong mạng nội bộ Docker và token không bao giờ rời khỏi
máy.

Đổi lại, cách hiện tại có ưu điểm thật: **một bên hỏng không kéo bên kia**. VPS
sập thì Antigravity vẫn chạy và bài viết xếp hàng chờ; Antigravity lỗi thì trang
bán hàng không hề hấn gì.

---

## Giai đoạn 6 — GEO: mở cho công cụ tìm kiếm và trợ lý AI

`NEXT_PUBLIC_CHO_LAP_CHI_MUC=1` đã bật ở bước 3. Kiểm lại:

```bash
curl https://halongxanh360.vn/robots.txt
curl https://halongxanh360.vn/llms.txt | head -30
curl -s https://halongxanh360.vn/ | grep -o '"@type":"FAQPage"'
```

`robots.txt` phải liệt kê `GPTBot`, `ClaudeBot`, `PerplexityBot`,
`Google-Extended` với `Allow: /`. Nếu thấy `Disallow: /` thì biến chưa vào —
kiểm lại `.env` rồi chạy lại `./trien-khai.sh`.

### Khai báo với Google

1. `search.google.com/search-console` → **Add property** → chọn **Domain** →
   nhập `halongxanh360.vn`
2. Google cho một bản ghi **TXT** → thêm vào DNS ở P.A Việt Nam (thêm, không
   xoá gì)
3. Xác minh xong → **Sitemaps** → nộp `https://halongxanh360.vn/sitemap.xml`

Làm tương tự với `halongxanh360.com.vn` để Google hiểu quan hệ chuyển hướng.

### Về việc được trợ lý AI trích dẫn

Không có nút nào để bấm. Ba việc thật sự có tác dụng, theo thứ tự:

1. **`robots.txt` cho bot AI vào** — điều kiện cần, đã xong ở trên.
2. **Số liệu ghi rõ nguồn** — đã làm; nghiên cứu đo được số có nguồn tăng khả
   năng được dẫn lại 25,9%.
3. **Nội dung mới đều đặn mỗi 7–14 ngày** — đây là việc của Antigravity, và là
   lý do đường ống ở giai đoạn 5 đáng dựng.

`llms.txt` đã có nhưng **đừng kỳ vọng**: mức áp dụng toàn cầu mới 10%, và chưa
hãng AI nào cam kết đọc nó.

---

## Danh sách kiểm sau khi lên

```bash
# Cả bốn địa chỉ đều về được, ba cái phải trả 301
curl -I https://halongxanh360.vn            # 200
curl -I https://www.halongxanh360.vn        # 301 → halongxanh360.vn
curl -I https://halongxanh360.com.vn        # 301 → halongxanh360.vn
curl -I https://www.halongxanh360.com.vn    # 301 → halongxanh360.vn

# HTTP tự chuyển sang HTTPS
curl -I http://halongxanh360.vn             # 308

# Email vẫn sống — quan trọng, dễ quên nhất
nslookup -type=MX halongxanh360.vn          # phải còn bản ghi
```

Rồi gửi một tin nhắn thử tới email của tên miền và kiểm xem có nhận được không.
Đây là bước duy nhất trong cả tài liệu mà nếu bỏ qua, hỏng hóc có thể trôi qua
nhiều ngày không ai biết.

---

## Sau khi chạy ổn vài ngày

Mở [Caddyfile](Caddyfile) và cân nhắc hai việc:

1. **HSTS** — dòng `Strict-Transport-Security` đang đặt một năm. Trong tuần
   đầu nên hạ xuống `max-age=300`, chạy ổn rồi mới nâng. Bật một năm mà HTTPS
   hỏng thì khách không vào được bằng bất cứ cách nào cho tới khi hết hạn.

2. **Giới hạn tần suất** — khối `rate_limit` đang chú thích lại vì cần bản
   Caddy dựng kèm mô-đun `caddy-ratelimit`. Nếu `/api/su-kien` bị bơm số rác
   thì đổi ảnh Docker sang bản có mô-đun rồi bỏ chú thích.

---

## Nguồn

- [Hướng dẫn trỏ, thay đổi DNS và trỏ IP cho tên miền .VN — P.A Việt Nam](https://kienthuc.pavietnam.vn/article/Huong-dan-tro-thay-doi-DNS-va-tro-IP-cho-ten-mien-.VN.html)
- [Hướng dẫn cấu hình tên miền trong trang access.pavietnam.vn](https://kb.pavietnam.vn/huong-dan-cau-hinh-ten-mien-thay-doi-ip-va-dns-trong-trang-access-pavietnam-vn.html)
