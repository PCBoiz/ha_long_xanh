# Đưa Hạ Long Xanh 360 lên thật

**Đây là tài liệu DUY NHẤT cần đọc.** Mọi file `TRIEN-KHAI.md`, `LEN-VPS.md`,
`DANH-SACH-TRIEN-KHAI.md`, `DEPLOY-VERCEL.md` đều viết trước khi chốt hướng và
**mâu thuẫn nhau ở năm chỗ**. Chúng còn nằm trong kho để tra cứu chi tiết, không
phải để làm theo.

Cập nhật: 27/08/2026.

---

## Đích đến đã chốt

| | |
|---|---|
| Trang chạy ở | **VPS đặt tại Việt Nam** (Docker + Caddy) |
| Vì sao không Vercel | Gói Hobby **cấm dùng thương mại**. Nguyên văn: *"All commercial usage of the platform requires either a Pro or Enterprise plan"*, và định nghĩa của họ bao gồm *"advertising the sale of a product or service"*. Tài khoản hiện tại đang ở gói `hobby`. |
| Mã nguồn đi qua | **GitHub riêng tư** → máy chủ tự `git pull` |
| Tên miền | `halongxanh360.vn` (chính) · `halongxanh360.com.vn` (301 về chính) |
| Cơ sở dữ liệu | Neon Postgres, database `halongxanh` |
| Antigravity | **Ở LẠI Vercel** — đó là chủ ý, không phải sót |

> ⚠️ Antigravity vẫn nằm trên chính tài khoản Hobby đó, và nó cũng là công cụ
> phục vụ công việc có thu tiền. Chuyển trang này sang VPS **không** gỡ được
> vấn đề đó. Xử lý riêng, sau khi trang đã sống.

---

# Việc số 0 — Trước mọi thứ khác

## 0.1 Tên miền chưa hoạt động. Kiểm ngay hôm nay.

**Đây là việc chặn tất cả các việc còn lại.** Hoá đơn P.A Việt Nam ghi cả hai
tên miền, kỳ hạn 05/08/2026 – 05/08/2027, đã thanh toán 800.000₫. Nhưng máy chủ
gốc của `.vn` nói cả hai **không tồn tại**:

```
$ nslookup -type=NS halongxanh360.vn      a.dns-servers.vn
*** can't find halongxanh360.vn: Non-existent domain

$ nslookup -type=NS halongxanh360.com.vn  a.dns-servers.vn
*** can't find halongxanh360.com.vn: Non-existent domain

  đối chứng — cách hỏi là đúng:
$ nslookup -type=NS vinhomes.vn           a.dns-servers.vn
vinhomes.vn  nameserver = will.ns.cloudflare.com
```

"Non-existent domain" từ máy chủ **có thẩm quyền** không có nghĩa là "trỏ sai".
Nó có nghĩa là tên miền **không có một dòng nào** trong vùng `.vn`. Không thao
tác DNS nào ở phía mình sửa được điều đó.

Với tên miền `.vn`, **"đã mua" và "đang hoạt động" là hai việc tách rời.** Có
đúng hai khả năng:

1. Hồ sơ đăng ký chưa hoàn tất — `.vn` yêu cầu bản khai kèm chữ ký số hoặc định
   danh điện tử. Chưa xác thực thì tên miền không được đưa vào vùng.
2. Đã đăng ký xong nhưng **chưa khai báo máy chủ DNS** — bước này phải tự làm
   trong trang quản lý, không tự động.

**Làm gì:** đăng nhập <https://access.pavietnam.vn/> → mở tên miền
`halongxanh360.vn` → xem hai thứ:

- [ ] Trạng thái tên miền — có phải "Đang hoạt động" không?
- [ ] Mục **Cấu hình DNS** — có mở được không, hay báo chưa khai báo máy chủ tên?

Nếu vướng bất kỳ chỗ nào: gọi thẳng hỗ trợ P.A Việt Nam, đọc số hoá đơn. Đây là
việc của họ, không phải việc mình sửa được bằng kỹ thuật.

> **Đừng làm gì tiếp cho tới khi tên miền trả lời được.** Mọi bước sau đều dựa
> vào nó: chứng chỉ SSL cần tên miền để xác minh, Antigravity cần địa chỉ để đẩy
> bài, và Google cần địa chỉ ổn định để lập chỉ mục.

## 0.2 Hai thứ mua kèm sẽ quyết định cách trỏ DNS

Hoá đơn có **Email Pro** và **Bảo mật DNSSEC** trên cả hai tên miền. Hai thứ đó
đổi hẳn lời khuyên:

**Giữ nguyên máy chủ tên ở P.A Việt Nam. Đừng chuyển sang Cloudflare.**

- Email Pro nghĩa là hộp thư `@halongxanh360.vn` do P.A phục vụ, qua các bản ghi
  MX trong vùng DNS của họ. Chuyển máy chủ tên đi nơi khác mà quên chép MX sang
  là **mất hộp thư**, im lặng — thư gửi tới không báo lỗi cho ai cả.
- DNSSEC ký vùng DNS bằng khoá. Đổi nhà cung cấp DNS mà không đồng bộ khoá thì
  tên miền **ngừng phân giải hoàn toàn** — nặng hơn cả trỏ sai.

Ở lại P.A thì chỉ phải thêm hai bản ghi A. Đơn giản hơn, và không đụng vào hai
thứ trên.

---

# Giai đoạn 1 — Máy chủ

## 1.1 Thuê VPS

| Mục | Tối thiểu thật | Nên lấy |
|---|---|---|
| RAM | 4 GB | 4 GB |
| CPU | 2 nhân | 2 nhân |
| Ổ cứng | 40 GB SSD | 40 GB SSD |
| Hệ điều hành | **Ubuntu 24.04 LTS** | Ubuntu 24.04 LTS |

**Vì sao 4GB chứ không phải 2GB:** máy chủ chạy `next build` ngay trên nó mỗi
lần cập nhật. Bước đó ăn hết RAM rồi mới xong. Máy 2GB sẽ chết giữa chừng với
thông báo khó đoán — và `dung-may-chu.sh` hiện **không tạo swap**, nên không có
lưới đỡ.

Nhà cung cấp trong nước: Viettel IDC, VNPT Cloud, Vinahost, TinoHost, AZDIGI,
BizFly, CMC Cloud. **Hỏi trước khi trả tiền:**

- [ ] Có Ubuntu 24.04 không (đừng nhận 22.04 — script viết cho 24.04)
- [ ] Có địa chỉ IPv4 riêng không
- [ ] Trả theo tháng cho tháng đầu, **đừng cam kết 36 tháng**

> **Một điều về băng thông ít người nói:** VPS Việt Nam thường cho băng thông
> trong nước rất rộng nhưng **quốc tế chỉ khoảng 10 Mbps**. Cơ sở dữ liệu Neon
> hiện đặt ở **Mỹ (`us-east-1`)**, nên mọi truy vấn đi qua đúng cái ống hẹp đó.
> Xem mục 6.2 — có cách xử lý, và nên làm sớm.

## 1.2 Dựng máy chủ

Kết nối vào máy chủ bằng Console/SSH Web trên trang quản trị của nhà cung cấp.

```bash
bash dung-may-chu.sh
```

Script làm năm việc: cài Docker · bật tường lửa (chỉ mở SSH + 80 + 443) · bật
cập nhật bảo mật tự động · **tạo 4GB swap** · tạo `/opt/halongxanh`.

Xong phải thấy dòng `Swap: 4.0Gi`. Bước swap mới thêm vào, và nó không thừa:
`next build` chạy ngay trên máy chủ mỗi lần cập nhật, ăn hết RAM rồi mới xong.
Không có swap thì nhân hệ điều hành giết tiến trình dựng và để lại đúng một
dòng `exit code 137` — con số không nói gì về nguyên nhân.

> Chính máy dựng bộ này bị hệ điều hành giết **hai lần** trong lúc chạy thử, dù
> có 16GB RAM. Đó là lý do bước swap có mặt.

---

# Giai đoạn 2 — Mã nguồn qua GitHub

Hiện **cả hai kho đều chưa có địa chỉ từ xa** (`git remote -v` trả về rỗng), nên
mọi lệnh `git clone` trong các tài liệu cũ đều chưa làm được.

## 2.1 Tạo kho riêng tư

Kho phải để **Private**. Không phải vì bảng giá — bảng giá đã công khai trên
trang — mà vì kho chứa toàn bộ cấu trúc cổng nhận bài và logic hàng rào duyệt.

Đã kiểm trước khi đẩy: **kho sạch.** Quét 306 file được theo dõi và cả 5 commit:
không có `.env`, không có `.data/`, không có `anh-goc/`. Bốn chuỗi `postgresql://`
tìm thấy đều là chuỗi mẫu.

```
cd D:\vinhomes_ha_long_xanh
git remote add origin git@github.com:<tài-khoản>/halongxanh360.git
git push -u origin main
```

## 2.2 Cho máy chủ quyền đọc kho — dùng khoá triển khai

Không dùng mật khẩu, không dùng token cá nhân. **Deploy key**: một khoá SSH chỉ
đọc, chỉ dùng cho đúng kho này. Mất máy chủ thì gỡ một khoá, không ảnh hưởng gì
khác.

Trên **máy chủ**:

```bash
ssh-keygen -t ed25519 -C "may-chu-halongxanh" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Chép dòng vừa hiện ra → GitHub → kho → **Settings → Deploy keys → Add deploy
key** → dán vào → **KHÔNG tick "Allow write access"**.

Rồi lấy mã về:

```bash
cd /opt/halongxanh
git clone git@github.com:<tài-khoản>/halongxanh360.git .
```

---

# Giai đoạn 3 — Trỏ tên miền

Chỉ làm sau khi việc 0.1 xong và tên miền đã trả lời.

## 3.1 Bốn bản ghi tại P.A Việt Nam

<https://access.pavietnam.vn/> → tên miền → **Cấu hình DNS**.

| Loại | Tên | Giá trị | TTL |
|---|---|---|---|
| A | `@` | `<IP máy chủ>` | 300 |
| A | `www` | `<IP máy chủ>` | 300 |

Làm y hệt cho `halongxanh360.com.vn`.

**Đặt TTL 300 giây (5 phút) lúc mới trỏ.** Trỏ nhầm IP mà để TTL 24 giờ thì sửa
xong vẫn phải chờ hết một ngày. Sau một tuần chạy ổn thì nâng lên 3600.

> ⚠️ **Tuyệt đối không dùng CNAME cho tên miền gốc (`@`).** Quy chuẩn DNS cấm
> điều đó, và hậu quả cụ thể ở đây là **giết hộp thư**: một bản ghi CNAME ở gốc
> làm mọi bản ghi khác cùng tên — kể cả MX của Email Pro — bị bỏ qua.

**Đừng đụng vào các bản ghi MX, TXT, hay bản ghi nào có sẵn.** Chúng là Email Pro.

## 3.2 Kiểm

Chờ khoảng 30 phút rồi:

```bash
nslookup halongxanh360.vn 8.8.8.8       # phải ra đúng IP máy chủ
nslookup www.halongxanh360.vn 8.8.8.8
```

> Vùng `.vn` ghi nhớ câu trả lời "không tồn tại" trong tối đa 90 phút. Nếu vừa
> kích hoạt xong mà tra vẫn báo không có, đừng hoảng — đợi thêm rồi tra lại.

---

# Giai đoạn 4 — Điền cấu hình

Trên máy chủ, trong `/opt/halongxanh`:

```bash
cp .env.example .env
nano .env
```

| Ô | Điền gì |
|---|---|
| `TEN_MIEN` | `halongxanh360.vn` |
| `TEN_MIEN_PHU` | `halongxanh360.com.vn` |
| `EMAIL_SSL` | **Gmail bạn mở hằng ngày.** Không được là `@halongxanh360.vn` — xem ghi chú trong `.env.example`. |
| `NEXT_PUBLIC_SITE_URL` | `https://halongxanh360.vn` |
| `DATABASE_URL` | Chuỗi Neon, lấy ở bảng điều khiển Neon. Phải có `-pooler`, phải kết thúc `?sslmode=require`, và **database phải là `halongxanh`** — không phải `neondb` mặc định. |
| `INGEST_TOKEN` | Sinh bằng `openssl rand -base64 48`. **Lưu lại** — lát nữa phải dán y hệt sang Antigravity. |
| `LEAD_WEBHOOK_URL` | Địa chỉ Google Apps Script — xem `NHAN-DANG-KY.md`. |
| `NEXT_PUBLIC_CHO_LAP_CHI_MUC` | **Để `0`** lúc này. Mở ở giai đoạn 7. |

> **Ô `LEAD_WEBHOOK_URL` để trống là mất khách, và mất không báo.** Khách vẫn
> thấy màn hình cảm ơn; thông tin của họ rơi vào một file tạm bên trong hộp chứa
> rồi biến mất ở lần cập nhật kế tiếp. Đừng chạy một đồng quảng cáo nào khi ô
> này còn trống.

---

# Giai đoạn 5 — Bật trang

## 5.1 Chạy migration trước

Bảng phải có trước khi trang chạy. VPS **không có Node**, nên chạy trong hộp chứa:

```bash
cd /opt/halongxanh
set -a; source .env; set +a
docker run --rm -e DATABASE_URL \
  -v "$PWD:/app" -w /app node:22-alpine \
  sh -c "npm ci --omit=dev --ignore-scripts && npx drizzle-kit migrate"
```

*(Tài liệu `LEN-VPS.md` bảo chạy `npm run db:migrate` thẳng trên VPS — không làm
được, vì VPS không có Node.)*

## 5.2 Bật

```bash
./trien-khai.sh
```

Script sẽ: lấy mã mới → kiểm cú pháp Caddyfile → dựng ảnh → bật → rồi **kiểm
bốn thứ** trước khi báo xong:

- Hộp chứa có trả lời không
- Ảnh có bị rò `.env` vào trong không
- **Trang có mở được từ internet qua HTTPS không** — đây là phép kiểm duy nhất
  có ý nghĩa với khách, và bản trước không có nó
- `robots.txt` có khớp với `.env` không

Lần đầu mất 5–10 phút vì phải tải và dựng. Caddy tự xin chứng chỉ Let's Encrypt
— việc đó cần **cổng 80 mở** và **DNS đã trỏ đúng**.

## 5.3 Nếu không mở được từ ngoài

Script sẽ in ra bốn lệnh cần chạy theo thứ tự. Nguyên nhân hầu như luôn là một
trong bốn: DNS chưa lan truyền xong · Caddy không khởi động được · chứng chỉ
chưa xin được · cổng 80 bị chặn.

---

# Giai đoạn 6 — Nối Antigravity

## 6.1 Đặt hai biến

Vercel → dự án `antigravity-seo-automation` → **Settings → Environment Variables**:

| Biến | Giá trị |
|---|---|
| `VINHOMES_SITE_URL` | `https://halongxanh360.vn` |
| `VINHOMES_INGEST_TOKEN` | **Y HỆT** `INGEST_TOKEN` ở giai đoạn 4 |

> **Phải là tên miền chính, không phải `www.` và không phải `.com.vn`.** Hai
> dạng kia bị chuyển hướng 301, mà bộ đẩy bài cố ý **không đi theo chuyển
> hướng** — chuẩn `fetch` xoá header xác thực khi sang host khác, nên nếu đi
> theo thì job báo thành công trong khi không bài nào được tạo. Đặt sai sẽ nhận
> đúng thông báo: *"Site chuyển hướng sang địa chỉ khác (HTTP 301). Bài viết
> CHƯA được tạo."*

Đặt xong **phải triển khai lại Antigravity** thì biến mới có hiệu lực.

## 6.2 Chạy thử đường ống, đủ bốn chặng

1. Antigravity → chạy module đẩy bài → phải báo **đã vào hàng chờ**
2. Mở `https://halongxanh360.vn/duyet-bai` → dán `INGEST_TOKEN` → **bài phải
   hiện ra**
3. Bấm duyệt
4. Mở `https://halongxanh360.vn/tin-tuc` → **giờ mới thấy bài**

> Ba tài liệu cũ đều hứa bài sẽ hiện ngay ở `/tin-tuc` sau bước 1. **Sai.** Hàng
> rào duyệt bài thêm vào sau khi các tài liệu đó được viết. Bài chưa duyệt không
> hiện trên trang và không vào sitemap — đó là chủ ý.

---

# Giai đoạn 7 — Mở cho khách

## 7.1 Kiểm biểu mẫu bằng số thật

Điền form trên trang bằng **số điện thoại thật của bạn**, rồi mở Google Sheet
xem dòng đó có tới không. Xoá dòng thử sau khi xác nhận.

Google Apps Script trả về mã thành công **kể cả khi script bên trong hỏng** —
nên cách duy nhất biết nó chạy là nhìn thấy dòng dữ liệu.

## 7.2 Mở chỉ mục

Chỉ làm khi **số liệu dự án đã đối chiếu hồ sơ gốc**. Trước đó, mọi trang gắn
`noindex` và `robots.txt` chặn sạch — có chủ ý.

```bash
nano .env      # NEXT_PUBLIC_CHO_LAP_CHI_MUC=1
./trien-khai.sh
```

Phải chạy lại `trien-khai.sh`, không phải `docker compose up -d`. Biến
`NEXT_PUBLIC_*` bị **nướng cứng vào lúc dựng ảnh** — sửa `.env` mà không dựng lại
thì trang vẫn mang giá trị cũ, và hỏng này hoàn toàn im lặng.

Rồi: Google Search Console → thêm cả hai tên miền → nộp
`https://halongxanh360.vn/sitemap.xml`.

## 7.3 Sau một tuần chạy ổn — bật HSTS

Mở `Caddyfile`, bỏ dấu `#` ở dòng `Strict-Transport-Security`, chạy lại
`./trien-khai.sh`.

**Chỉ làm khi trang đã mở tốt liên tục 7 ngày** và `docker compose logs caddy`
không có dòng gia hạn thất bại nào. Lý do đầy đủ ghi ngay trong `Caddyfile` —
đọc trước khi bật, vì **thao tác này không gỡ được**.

---

# Ba việc nên làm sớm, không chặn

## A. Chuyển cơ sở dữ liệu về Singapore

Đo thật từ Đông Nam Á tới điểm cuối Neon hiện tại:

| Đích | Một vòng |
|---|---|
| `us-east-1` (đang dùng) | **~285 ms** |
| Singapore | **~55 ms** |

Nhưng đo tiếp thì thấy **24 trên 30 trang không chạm cơ sở dữ liệu lúc khách
mở** — toàn bộ trang tiền (trang chủ, giá, quỹ căn, chính sách, pháp lý, tiến
độ, đầu tư) đều dựng sẵn. Chỉ hai trang chịu độ trễ: `/tin-tuc` (+285 ms) và một
bài cụ thể (+570 ms, vì gọi ba lần).

Nên: **không gấp, nhưng nên làm ngay** — vì lúc này rẻ nhất. Cơ sở dữ liệu mới
có ba bảng và gần như chưa có dữ liệu thật. Neon **không đổi vùng được**; phải
tạo project mới ở Singapore rồi chuyển. Sau đó cập nhật `DATABASE_URL` ở đúng
hai nơi: `.env` trên máy chủ, và biến trên Vercel của Antigravity.

## B. Giới hạn tần suất cho hai cổng ghi

`/api/ingest` và `/api/su-kien` là hai đường duy nhất ghi được vào cơ sở dữ liệu
từ bên ngoài, và **hiện không có giới hạn tần suất nào**. Khối `rate_limit`
trong `Caddyfile` đang bị chú thích vì bản Caddy chuẩn không có mô-đun đó.

Không phải việc gấp: `/api/ingest` có khoá, `/api/su-kien` chỉ đếm và có danh
sách trắng. Rủi ro thật là ai đó bơm số làm hỏng thống kê và tốn dung lượng Neon.

## C. Nghĩa vụ về dữ liệu cá nhân

Trang thu số điện thoại khách. Đó là xử lý dữ liệu cá nhân, và pháp luật Việt
Nam có quy định riêng về việc này — gồm cả nghĩa vụ hồ sơ khi chuyển dữ liệu ra
nước ngoài (cơ sở dữ liệu Neon đặt ngoài Việt Nam, và **chuyển máy chủ web về
Việt Nam không làm dữ liệu ở lại Việt Nam**).

**Tôi không xác minh được đầy đủ và không tư vấn pháp lý được.** Đây là việc cần
hỏi người có chuyên môn, trước khi chạy quảng cáo. Ghi ở đây để nó không bị quên.

---

# Những gì đã sửa để tài liệu này chạy được

| Sửa | Vì sao |
|---|---|
| Thêm `.dockerignore` | Không có nó, `.env` bị chép vào **ảnh chạy thật** — đã kiểm bằng `cmp`: `.next/standalone/.env` giống hệt `.env` gốc. Next.js chép file `.env` vào thư mục `standalone`, rồi Dockerfile chép cả thư mục đó vào ảnh cuối. |
| `Dockerfile` dừng nếu thiếu `NEXT_PUBLIC_SITE_URL` | Chuỗi rỗng vẫn tính là "đã đặt" nên nó thắng giá trị trong `.env`. Hậu quả: canonical, sitemap, thẻ chia sẻ đều trỏ `http://localhost:3000` — và trang vẫn chạy bình thường. |
| `trien-khai.sh` kiểm từ internet vào | Bản trước in "✓ Trang đã chạy: https://tên-miền" mà **chưa từng gọi địa chỉ đó**. Caddy chết, chứng chỉ hỏng, DNS sai — cả ba đều cho ✓ xanh. |
| `trien-khai.sh` kiểm rò `.env` sau mỗi lần dựng | Một file cấu hình thì im lặng khi bị xoá. |
| `trien-khai.sh` chỉ dọn ảnh cũ sau khi kiểm xong | Dọn sớm là vứt đường lùi đúng lúc cần nó nhất. |
| Tắt HSTS lần đầu | Bản trước bật sẵn, mâu thuẫn với chính lời cảnh báo viết ngay trên nó. |
| `.env.example`: `EMAIL_SSL` để trống + giải thích | Trước đó đặt `ban@halongxanh360.vn` — chuông báo cháy nằm trong phòng đang cháy. |

## Đã chạy thử bằng Docker thật — không còn phải đoán

Toàn bộ bộ triển khai đã được dựng và cho chạy thật một lần trước khi anh/chị
thuê máy chủ. Ảnh nặng **373 MB**.

| Điều cần đúng | Kết quả thật |
|---|---|
| Ảnh chạy thật có lọt `.env` không | **Không** — `[ -f /app/.env ]` trong hộp chứa trả về không có |
| Hộp chứa tự báo tình trạng | **`Up 6 seconds (healthy)`** |
| Tối ưu ảnh (`sharp`) chạy trong Alpine | **Có** — trả `image/webp`, 72.516 byte |
| Trang phục vụ đúng nội dung | `<title>` và canonical `https://halongxanh360.vn` đều đúng |
| Không có cơ sở dữ liệu thì sao | `/tin-tuc` **200** · `/sitemap.xml` **200** — không sập |
| Chưa có `INGEST_TOKEN` thì cổng nhận bài trả gì | **503** kèm câu giải thích, không phải 500 |
| `caddy validate` bằng chính Caddy | **Valid configuration**, sạch, không còn cảnh báo nào |

**Luật gom tên miền, đo qua hộp chứa thật:**

| Tên miền của yêu cầu | Trả về |
|---|---|
| `halongxanh360.vn` | 200 |
| `www.halongxanh360.vn` | 308 → `https://halongxanh360.vn/…` |
| `halongxanh360.com.vn` | 308 → `https://halongxanh360.vn/…` |
| `127.0.0.1:3000` *(phép kiểm còn sống)* | 200 |
| `web:3000` | **308** — xem cảnh báo dưới |

> ⚠️ Dòng cuối là lý do **không bao giờ được thêm `header_up Host` vào
> `Caddyfile`.** Caddy giữ nguyên tên miền theo mặc định, nên Next thấy tên
> miền thật và trả 200. Thêm dòng đó thì Caddy hỏi hộp chứa bằng tên
> `web:3000`, Next thấy tên lạ nên trả 308 về tên miền chính, trình duyệt quay
> lại, Caddy lại hỏi bằng `web:3000`… vòng lặp vô hạn và **cả trang tắt**.
> Bộ kiểm `scripts/kiem-caddyfile.mjs` giờ chặn đúng dòng này.

Hai điều còn lại, kiểm bằng cách khác:

- Node 22 đủ cho Next 16 (Next khai `>=20.9.0`)
- Ký tự xuống dòng của script trong kho đã là LF, nên `git clone` trên Linux cho
  ra file chạy được — **đừng dùng SCP**, chép thẳng từ Windows sẽ làm Linux báo
  `bad interpreter`
