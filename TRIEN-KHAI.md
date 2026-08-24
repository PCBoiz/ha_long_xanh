# Đưa trang lên máy chủ

Hướng dẫn này viết cho người **không biết lập trình**. Mỗi bước là một việc,
làm xong bước này mới sang bước sau. Chỗ nào cần gõ lệnh thì chép nguyên văn.

Tổng thời gian lần đầu: khoảng **90 phút**, trong đó 30 phút là ngồi chờ tên
miền lan truyền.

---

## Trước khi bắt đầu — hiểu bạn đang dựng cái gì

```
        Antigravity                          Máy chủ của bạn
   (đang chạy trên Vercel)                  (thuê ở Việt Nam)
                                    ┌──────────────────────────────┐
   ┌─────────────────┐              │  ┌────────┐    ┌──────────┐  │
   │  Sinh bài viết  │──── HTTPS ──▶│  │ Caddy  │───▶│   web    │  │
   │  hằng ngày      │   kèm token  │  │  SSL   │    │ (Next.js)│  │
   └─────────────────┘              │  └────────┘    └────┬─────┘  │
                                    └───────────────────┬─┼────────┘
                                                        │ │
                                          Khách ────────┘ │
                                                          ▼
                                                 ┌─────────────────┐
                                                 │  Neon Postgres  │
                                                 │  (lưu bài viết) │
                                                 └─────────────────┘
```

Ba thứ tách rời nhau, và đó là chủ ý: **cơ sở dữ liệu nằm ngoài máy chủ**. Máy
chủ có cháy, có bị xoá nhầm, bài viết vẫn còn nguyên ở Neon — dựng lại máy chủ
mới rồi cắm lại là xong.

---

## Bước 1 — Thuê máy chủ

Bạn cần một **VPS** (máy chủ ảo) đặt tại Việt Nam. Cấu hình tối thiểu:

| Mục | Tối thiểu | Nên có |
|---|---|---|
| RAM | 2 GB | 4 GB |
| CPU | 2 nhân | 2 nhân |
| Ổ cứng | 20 GB SSD | 40 GB SSD |
| Hệ điều hành | **Ubuntu 24.04 LTS** | Ubuntu 24.04 LTS |

> **Vì sao 2GB là tối thiểu thật, không phải con số cho đẹp:** bước dựng ảnh
> Docker chạy `next build`, và bước đó ăn khoảng 1,5GB. Máy 1GB sẽ chết giữa
> chừng với thông báo khó hiểu.

Nhà cung cấp trong nước: Viettel IDC, VNPT Cloud, Vinahost, TinoHost, AZDIGI.
Khi tạo máy, chọn **Ubuntu 24.04** và **lưu lại địa chỉ IP** — bước 3 cần nó.

---

## Bước 2 — Dựng máy chủ bằng một lệnh

Kết nối vào máy chủ bằng **Terminal** mà nhà cung cấp cho sẵn trên trang quản
trị (thường gọi là *Console* hoặc *SSH Web*).

Chép file `dung-may-chu.sh` lên máy chủ rồi chạy:

```bash
bash dung-may-chu.sh
```

Script làm bốn việc mà để tự nhớ thì sẽ quên:

| Việc | Vì sao cần |
|---|---|
| Cài Docker | thứ duy nhất máy chủ cần cài |
| Bật tường lửa, chỉ mở SSH + 80 + 443 | mọi cổng khác đóng, kể cả cổng 3000 của trang |
| Bật cập nhật bảo mật tự động | máy chủ tự quản không có ai vá lỗi hộ |
| Tạo thư mục `/opt/halongxanh` | chỗ đặt mã nguồn |

> ⚠️ Script mở cổng SSH **trước khi** bật tường lửa. Làm ngược lại là tự khoá
> mình ra khỏi máy chủ, và cách duy nhất vào lại là console cứu hộ của nhà
> cung cấp.

Xong thì **đăng xuất rồi đăng nhập lại** — để chạy `docker` không cần `sudo`.

---

## Bước 3 — Trỏ tên miền về máy chủ (PA Việt Nam)

Tên miền `.vn` ở PA Việt Nam **không đổi được nameserver dễ như tên miền quốc
tế**, nên ta sửa thẳng bản ghi DNS.

1. Đăng nhập <https://www.pavietnam.vn> → **Quản lý dịch vụ** → **Tên miền**
2. Chọn tên miền của bạn → **Quản lý DNS**
3. Xoá hết các bản ghi `A` và `CNAME` đang có của `@` và `www`
4. Thêm **hai** bản ghi mới:

| Loại | Tên (Host) | Giá trị | TTL |
|---|---|---|---|
| `A` | `@` | *địa chỉ IP máy chủ ở bước 1* | 3600 |
| `A` | `www` | *cùng địa chỉ IP đó* | 3600 |

5. Lưu lại.

**Chờ 15–30 phút.** Kiểm tra bằng cách gõ trên máy chủ:

```bash
dig +short tenmiencuaban.com.vn
```

Hiện ra đúng IP máy chủ là được. Còn hiện IP cũ hoặc không hiện gì thì **chờ
thêm** — đừng sang bước tiếp, vì Caddy sẽ xin chứng chỉ SSL thất bại và
Let's Encrypt chỉ cho thử **5 lần mỗi tuần**.

> ⚠️ **Về đăng ký với Bộ Công Thương:** website thương mại điện tử bán hàng
> tại Việt Nam thuộc diện phải **thông báo** với Bộ Công Thương
> (online.gov.vn). Trang này giới thiệu dự án và thu thông tin khách nên
> **có khả năng thuộc diện đó**. Tôi không phải là nguồn tư vấn pháp lý —
> bạn nên hỏi bên bán tên miền hoặc luật sư trước khi mở cho công chúng.

---

## Bước 4 — Tạo cơ sở dữ liệu Neon

1. Vào <https://neon.tech> → đăng nhập
2. **New Project** → đặt tên `halongxanh` → chọn khu vực
   **AWS ap-southeast-1 (Singapore)** — gần Việt Nam nhất
3. Tạo xong, bấm **Connection string**
4. Chọn dạng có chữ **Pooled connection** rồi bấm sao chép

Chuỗi trông như sau (của bạn sẽ khác):

```
postgresql://ten:matkhau@ep-abc-123-pooler.ap-southeast-1.aws.neon.tech/halongxanh?sslmode=require
```

**Giữ chuỗi này cẩn thận.** Ai có nó là đọc và sửa được toàn bộ bài viết.
Đừng dán vào tin nhắn, email hay ảnh chụp màn hình.

---

## Bước 5 — Tải mã nguồn lên máy chủ

Trên máy chủ:

```bash
cd /opt
sudo git clone <ĐỊA-CHỈ-KHO-GIT-CỦA-BẠN> halongxanh
sudo chown -R $USER:$USER halongxanh
cd halongxanh
```

> **Chưa có kho git?** Xem mục *"Phụ lục A"* ở cuối trang.

---

## Bước 6 — Điền cấu hình

```bash
cp .env.example .env
nano .env
```

Trình soạn thảo `nano` mở ra. Điền năm giá trị:

| Ô | Điền gì |
|---|---|
| `TEN_MIEN` | tên miền, **không** có `https://`, ví dụ `halongxanh.com.vn` |
| `EMAIL_SSL` | email bạn đọc thường xuyên |
| `NEXT_PUBLIC_SITE_URL` | `https://` + tên miền |
| `DATABASE_URL` | chuỗi Neon ở bước 4 |
| `INGEST_TOKEN` | *xem ngay dưới* |

Tạo `INGEST_TOKEN` bằng cách mở **một cửa sổ Terminal khác** và gõ:

```bash
openssl rand -base64 48
```

Chép chuỗi hiện ra vào ô `INGEST_TOKEN`. **Giữ lại chuỗi này** — bước 9 cần
dán nó sang Antigravity.

Lưu và thoát `nano`: bấm `Ctrl+O` → `Enter` → `Ctrl+X`.

---

## Bước 7 — Tạo bảng trong cơ sở dữ liệu

Chạy **một lần duy nhất**:

```bash
docker run --rm -v /opt/halongxanh:/app -w /app \
  -e DATABASE_URL="$(grep '^DATABASE_URL=' .env | cut -d= -f2-)" \
  node:22-alpine sh -c "npm ci --silent && npx drizzle-kit migrate"
```

Hiện ra `migrations applied successfully` là xong.

---

## Bước 8 — Bật trang

```bash
chmod +x trien-khai.sh
./trien-khai.sh
```

Lần đầu mất **5–10 phút** vì phải dựng ảnh Docker từ đầu. Script sẽ tự:

1. kiểm `.env` đủ giá trị chưa
2. kiểm cú pháp Caddyfile
3. dựng ảnh mới
4. bật hai hộp chứa
5. **chờ tới khi trang thật sự trả lời** rồi mới báo thành công

Thấy dòng `✓ Trang đã chạy` thì mở tên miền trên trình duyệt. Phải có **ổ khoá
xanh** ở thanh địa chỉ.


---

## Bước 8b — Bật canh gác tự động

Chạy **một lần**:

```bash
chmod +x canh-trang.sh
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/halongxanh/canh-trang.sh") | crontab -
```

Từ đó cứ 5 phút máy chủ tự làm ba việc:

| Việc | Vì sao cần |
|---|---|
| Gọi thử trang | `restart: unless-stopped` chỉ dựng lại khi hộp chứa **chết**. Có kiểu hỏng tệ hơn: tiến trình còn sống mà không trả lời ai nữa — Docker thấy vẫn "đang chạy" nên không làm gì, và trang chết im lặng tới khi có người gọi điện báo |
| Sao lưu `.env` | Bài viết đã an toàn ở Neon vì Neon tự sao lưu. Nhưng `.env` thì **chỉ có trên máy chủ này** — mất nó là mất chuỗi kết nối và token đăng bài. Giữ 14 bản gần nhất |
| Cảnh báo ổ cứng | Ổ đầy là kiểu hỏng khó đoán nhất: Docker không kéo được ảnh, Caddy không ghi được chứng chỉ, cơ sở dữ liệu không ghi được — tất cả cùng lúc và trông không liên quan gì nhau |

Trang hỏng thì nó **thử khởi động lại đúng một lần**, rồi ghi 40 dòng nhật ký
cuối của hộp chứa để còn truy nguyên nhân. Cố ý không khởi động lại liên tục
mỗi 5 phút — vòng lặp đó che mất nguyên nhân thật.

Xem nhật ký canh gác:

```bash
tail -30 /opt/halongxanh/.canh-trang.log
```

---

## Bước 9 — Nối Antigravity vào

Bên Antigravity (trên Vercel), thêm **hai** biến môi trường:

| Tên biến | Giá trị |
|---|---|
| `VINHOMES_SITE_URL` | `https://` + tên miền của trang này |
| `VINHOMES_INGEST_TOKEN` | **đúng chuỗi** `INGEST_TOKEN` ở bước 6 |

Vào Vercel → dự án `antigravity-seo-automation` → **Settings** →
**Environment Variables** → **Add**. Thêm xong phải **Redeploy** thì biến mới
có hiệu lực.

Thử đường ống bằng lệnh này (chạy ở đâu cũng được, thay hai chỗ trong ngoặc):

```bash
curl -X POST https://<TEN-MIEN>/api/ingest \
  -H "Authorization: Bearer <INGEST_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"slug":"bai-thu","tieuDe":"Bài thử đường ống","moTa":"Kiểm tra kết nối Antigravity với trang.","ngayDang":"2026-08-10","chuyenMuc":"Tiến độ"}'
```

| Kết quả | Nghĩa là |
|---|---|
| `{"ok":true,...}` | ✅ Đường ống thông. Mở `/tin-tuc` sẽ thấy bài. |
| `401` | Token hai bên không khớp |
| `503` | Chưa điền `INGEST_TOKEN` trong `.env` |
| `422` | Dữ liệu bài sai định dạng — thông báo nói rõ sai chỗ nào |

Xoá bài thử: vào Neon → **SQL Editor** → chạy
`DELETE FROM bai_viet WHERE slug = 'bai-thu';`

---

## Bước 10 — Mở cho Google

Chỉ làm khi **số liệu dự án đã đối chiếu hồ sơ gốc**. Trong `.env`:

```
NEXT_PUBLIC_CHO_LAP_CHI_MUC=1
```

Rồi `./trien-khai.sh`.

Trước khi mở, còn ba việc nữa:

- [ ] Điền số hotline và Zalo thật trong `src/data/project.ts`
- [ ] Đổi `CHAY_MOI_LAN = false` trong `src/components/ui/preloader.tsx`
- [ ] Xác nhận `6.206 ha`, `380.000 cư dân`, bảo lãnh Techcombank

---

# Vận hành hằng ngày

**Bạn không cần làm gì cả.** Trang tự chạy. Máy chủ mất điện rồi có lại — trang
tự bật. Hộp chứa sập — Docker tự dựng dậy. Chứng chỉ SSL — Caddy tự gia hạn.

Khi cần, đây là bốn lệnh duy nhất:

| Việc | Lệnh |
|---|---|
| Cập nhật trang lên bản mới | `cd /opt/halongxanh && ./trien-khai.sh` |
| Xem trang có đang chạy không | `docker compose ps` |
| Xem trang báo lỗi gì | `docker compose logs --tail=80 web` |
| Khởi động lại | `docker compose restart` |

---

# Khi có sự cố

| Hiện tượng | Nguyên nhân hay gặp nhất | Cách xử lý |
|---|---|---|
| Trình duyệt báo *không an toàn* | DNS chưa trỏ đúng khi Caddy xin chứng chỉ | `dig +short <tên miền>` kiểm IP, rồi `docker compose restart caddy` |
| Trang trắng trơn | Hộp chứa `web` chết | `docker compose logs --tail=80 web` |
| Trang tin trống dù đã đăng | Thiếu `DATABASE_URL` | Xem nhật ký, tìm dòng `CẢNH BÁO: thiếu DATABASE_URL` |
| Antigravity báo lỗi 401 | Token hai bên lệch nhau | So lại `INGEST_TOKEN` và `VINHOMES_INGEST_TOKEN` |
| Máy chủ đầy ổ cứng | Ảnh Docker cũ tích lại | `docker system prune -af` |
| `./trien-khai.sh` dừng ở bước kiểm Caddy | Caddyfile sai cú pháp | Thông báo lỗi chỉ rõ dòng nào |

---

# Việc bạn PHẢI tự làm — vì bạn chọn máy chủ riêng

Nền tảng đám mây làm sẵn mấy việc này; máy chủ riêng thì không.

**Mỗi tháng một lần** — cập nhật bản vá bảo mật của hệ điều hành:

```bash
sudo apt update && sudo apt upgrade -y
```

**Bật cập nhật bảo mật tự động** (làm một lần, đỡ phải nhớ):

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

**Bật tường lửa** (làm một lần):

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw --force enable
```

**Về sao lưu:** bài viết nằm ở Neon nên đã an toàn — Neon giữ lịch sử khôi
phục sẵn. Nhưng file `.env` thì **chỉ có trên máy chủ**. Chép nội dung nó vào
một trình quản lý mật khẩu ngay hôm nay; mất nó là phải tạo lại token và cấu
hình lại Antigravity.

---

# Phụ lục A — Nếu chưa có kho git

Thư mục mã nguồn hiện **chưa phải kho git**, nên bước 5 chưa chạy được. Có hai
đường:

**Đường 1 — đưa lên GitHub (nên chọn).** Về sau mỗi lần sửa chỉ cần `git push`
rồi chạy `./trien-khai.sh` trên máy chủ. Tạo kho riêng tư (Private) trên
GitHub, rồi trên máy tính của bạn:

```bash
cd D:/vinhomes_ha_long_xanh
git init
git add .
git commit -m "Bản đầu tiên"
git remote add origin <địa-chỉ-kho-vừa-tạo>
git push -u origin main
```

> Kiểm lại trước khi đẩy: `git status` **không được** liệt kê file `.env`.
> Nếu có, dừng lại — `.gitignore` chưa đúng.

**Đường 2 — chép thẳng bằng SCP.** Nhanh cho lần đầu nhưng mỗi lần cập nhật
phải chép lại tay:

```bash
scp -r D:/vinhomes_ha_long_xanh root@<IP>:/opt/halongxanh
```

---

# Phụ lục B — Đường ống Antigravity chạy thế nào

## Hợp đồng giữa hai hệ thống

Antigravity gửi `POST` tới `https://<tên-miền>/api/ingest`, kèm header
`Authorization: Bearer <INGEST_TOKEN>` và thân JSON:

| Trường | Bắt buộc | Ràng buộc |
|---|---|---|
| `slug` | ✅ | chữ thường, số, gạch nối; tối đa 200 ký tự |
| `tieuDe` | ✅ | tối đa 300 ký tự |
| `moTa` | ✅ | tối đa 600 ký tự |
| `ngayDang` | ✅ | dạng `2026-08-10` |
| `chuyenMuc` | ✅ | một trong: `Tiến độ`, `Chính sách`, `Sự kiện`, `Thị trường` |
| `noiDung` | ⬜ | HTML thân bài |

**Gửi lại cùng `slug` là SỬA bài, không tạo bài mới.** Cố ý như vậy: nếu lần
gửi trước hết thời gian chờ mà thật ra đã ghi thành công, lần thử lại sẽ không
sinh ra bài trùng.

## Bốn lớp chặn trên đường đi

1. **Token** — so sánh theo thời gian hằng số, không lộ độ dài phần khớp
2. **Kiểm dữ liệu** — sai định dạng thì trả `422` kèm câu tiếng Việt nói rõ
   sai chỗ nào, không nhận bừa
3. **Lọc HTML** — thân bài đi qua danh sách thẻ cho phép trước khi hiển thị
4. **Chưa cấu hình thì từ chối** — thiếu `INGEST_TOKEN` trả `503`, không im
   lặng trả `200`

Nguyên tắc xuyên suốt: **thà từ chối còn hơn nhận rồi đánh rơi.** Bên gửi luôn
biết bài đã vào hay chưa.

> ⚠️ **Giới hạn của lớp lọc HTML:** nó dựa trên biểu thức chính quy, không phải
> bộ phân tích HTML thật, nên về nguyên tắc có thể bị vượt qua bằng HTML dị
> dạng. Hàng phòng thủ chính là token. Nếu sau này bài viết có thể đến từ nguồn
> không do bạn kiểm soát, phải thay bằng thư viện lọc thật.

## Đăng bài hằng ngày

Antigravity đang chạy trên Vercel nên **cron vẫn nằm bên đó**, không cần gì ở
máy chủ này. Vercel gọi module đăng bài theo lịch, module sinh nội dung rồi
`POST` sang đây.

Việc còn thiếu: **quyết định mỗi ngày đăng bài gì** — xoay vòng 9 phân khu và 5
dòng sản phẩm, bám tiến độ thi công, hay theo từ khoá đang lên. Đó là quyết định
nội dung, không phải kỹ thuật.

---

# Phụ lục C — Vì sao chọn từng thứ

| Thành phần | Vì sao | Đánh đổi |
|---|---|---|
| **Docker** | Máy chủ chỉ cần cài đúng một thứ. Không có chuyện "máy tôi chạy được mà máy chủ thì không" | Thêm một lớp phải hiểu |
| **Caddy** | Tự xin và tự gia hạn SSL. Đây là việc hay bị quên nhất khi tự quản máy chủ | Ít tài liệu tiếng Việt hơn Nginx |
| **Neon** | Cơ sở dữ liệu nằm NGOÀI máy chủ, nên máy chủ hỏng không mất bài | Phụ thuộc một dịch vụ nước ngoài |
| **`standalone`** | Ảnh Docker nhỏ hơn ~8 lần và không mang mã nguồn lên máy chủ | Phải chép `public` và `.next/static` riêng |
| **Không mở cổng 3000** | Chỉ Caddy vào được `web`. Không ai bỏ qua HTTPS được | Gỡ lỗi phải qua `docker compose exec` |
