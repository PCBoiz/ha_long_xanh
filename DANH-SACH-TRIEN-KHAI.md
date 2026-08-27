> ## ⚠️ TÀI LIỆU NÀY KHÔNG CÒN DÙNG ĐỂ LÀM THEO
>
> Nó viết trước khi chốt hướng triển khai, và **mâu thuẫn với các tài liệu khác
> trong kho ở năm chỗ**. Mục 0.2 nói "cả hai thư mục đều chưa phải kho git" — nay đã sai. Mục 4.1 bảo Antigravity trỏ về dạng `.com.vn`, mà dạng đó bị chuyển hướng 301 nên đăng bài sẽ thất bại.
>
> **Đọc [BAT-DAU-TAI-DAY.md](BAT-DAU-TAI-DAY.md) thay cho file này.**
>
> File này giữ lại để tra cứu chi tiết kỹ thuật, không phải để làm theo từng bước.

# Danh sách triển khai — từ hôm nay tới lúc mở cho khách

Sắp theo **thứ tự phải làm**, không theo mức quan trọng. Mỗi giai đoạn xong mới
sang giai đoạn sau.

Tổng: khoảng **3 giờ làm việc**, trải trên **2–3 ngày** (vì phải chờ DNS và chờ
xác nhận số liệu).

---

## Bảng tổng

| GĐ | Việc | Cần VPS? | Thời gian | Ai làm |
|---|---|---|---|---|
| **0** | Ba việc làm ngay hôm nay | không | 20 phút | bạn |
| **1** | Mua VPS | — | 20 phút | bạn |
| **2** | Dựng máy chủ | có | 15 phút | bạn |
| **3** | Đưa trang lên | có | 40 phút | bạn |
| **4** | Nối Antigravity | có | 20 phút | bạn |
| **5** | Mở cho khách | có | 30 phút | bạn + tôi |

---

# Giai đoạn 0 — Làm ngay, chưa cần VPS

Ba việc này **không phụ thuộc máy chủ**, và hai trong số đó đang là lỗ hổng mở.

### 0.1 — Bật chặn dò mật khẩu cho Antigravity ⚠️

**Đây là lỗ hổng đang mở ngay lúc này**, không phải việc của tương lai.

Vercel → dự án Antigravity → **Firewall** → **Configure** → **+ New Rule**

| Ô | Điền |
|---|---|
| Điều kiện | `Path` **equals** `/login` |
| Hành động | **Rate Limit** → Fixed Window |
| Cửa sổ | 60 giây |
| Giới hạn | 10 yêu cầu |
| Khoá đếm | IP |
| Khi vượt | **Deny (429)** |

→ **Review Changes** → **Publish**

Bộ chặn trong mã tôi đã viết **gần như vô tác dụng trên Vercel** — mỗi lần gọi
hàm chạy trong một microVM riêng nên bộ đếm không chia sẻ được. Xem
[NGHIEN-CUU-MAY-CHU.md](NGHIEN-CUU-MAY-CHU.md) phần 2.

### 0.2 — Đưa mã nguồn lên GitHub

Hiện **cả hai thư mục đều chưa phải kho git**. Không có kho thì:
- bước 3.2 (tải mã lên máy chủ) phải chép tay từng lần
- sửa hỏng là không hoàn tác được

Kho **riêng tư** (Private), rồi trên máy bạn:

```
cd D:\vinhomes_ha_long_xanh
git init
git add .
git commit -m "Bản đầu tiên"
git remote add origin <địa-chỉ-kho>
git push -u origin main
```

> 🔒 **Trước khi đẩy, chạy `git status` và kiểm KHÔNG có `.env`, `.data/`,
> `local.db`.** `.gitignore` đã chặn cả ba, nhưng kiểm một lần vẫn hơn — đẩy
> nhầm bí mật lên GitHub thì xoá đi vẫn còn trong lịch sử.

### 0.3 — Quyết chỗ nhận thông tin khách

Chưa đặt `LEAD_WEBHOOK_URL` thì mỗi lượt khách đăng ký rơi vào file tạm trên
máy chủ, **không sao lưu, mất cùng máy**.

Chọn một: Google Apps Script viết vào Google Sheet, n8n, hoặc CRM có sẵn. Cần
một địa chỉ nhận `POST` với thân JSON gồm `hoTen`, `dienThoai`, `quanTam`,
`ghiChu`, `thoiDiem`.

---

# Giai đoạn 1 — Mua VPS

### 1.1 — Đặt máy

**Đề xuất: Vinahost Cheap-SSD4** — 4 nhân / 4GB / 80GB SSD, khoảng $13,19 +VAT.
Xem so sánh đầy đủ ở [NGHIEN-CUU-MAY-CHU.md](NGHIEN-CUU-MAY-CHU.md) phần 3.

Khi tạo máy:
- [ ] Hệ điều hành: **Ubuntu 24.04 LTS** (script viết cho bản này)
- [ ] Trả **từng tháng** cho tháng đầu, đừng cam kết 36 tháng
- [ ] Lưu lại **địa chỉ IP** và mật khẩu đăng nhập

### 1.2 — Tạo cơ sở dữ liệu Neon

<https://neon.tech> → **New Project** → tên `halongxanh` → khu vực
**AWS ap-southeast-1 (Singapore)**.

Bấm **Connection string** → chọn dạng **Pooled connection** → sao chép.

> 🔒 Giữ chuỗi này trong trình quản lý mật khẩu. Đừng dán vào chat hay ảnh chụp.

### 1.3 — Sinh token đăng bài

```
node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"
```

Lưu vào trình quản lý mật khẩu — giai đoạn 3 và 4 đều cần.

---

# Giai đoạn 2 — Dựng máy chủ

### 2.1 — Trỏ tên miền **TRƯỚC**, vì phải chờ

Làm bước này **đầu tiên** trong giai đoạn 2, để trong lúc chờ lan truyền thì
làm tiếp các bước khác.

PA Việt Nam → **Quản lý dịch vụ** → **Tên miền** → **Quản lý DNS**:

| Loại | Tên | Giá trị | TTL |
|---|---|---|---|
| `A` | `@` | IP máy chủ | 3600 |
| `A` | `www` | cùng IP đó | 3600 |

Xoá các bản ghi `A`/`CNAME` cũ của `@` và `www`.

### 2.2 — Chạy script dựng máy

Chép `dung-may-chu.sh` lên máy chủ rồi:

```
bash dung-may-chu.sh
```

Cài Docker, bật tường lửa (chỉ mở SSH + 80 + 443), bật cập nhật bảo mật tự
động, tạo `/opt/halongxanh`.

Xong thì **đăng xuất rồi đăng nhập lại**.

### 2.3 — Chờ DNS, kiểm trước khi đi tiếp

```
dig +short tenmiencuaban.com.vn
```

**Phải ra đúng IP máy chủ mới được sang giai đoạn 3.**

> ⚠️ Đi tiếp khi DNS chưa trỏ đúng thì Caddy xin chứng chỉ SSL thất bại, mà
> Let's Encrypt chỉ cho thử **5 lần mỗi tuần** cho cùng tên miền. Sai ở đây là
> phải chờ cả tuần.

---

# Giai đoạn 3 — Đưa trang lên

### 3.1 — Tải mã nguồn

```
git clone <kho-của-bạn> /opt/halongxanh
cd /opt/halongxanh
```

### 3.2 — Điền cấu hình

```
cp .env.example .env
nano .env
```

| Ô | Lấy từ |
|---|---|
| `TEN_MIEN` | tên miền, **không** có `https://` |
| `EMAIL_SSL` | email bạn đọc thường xuyên |
| `NEXT_PUBLIC_SITE_URL` | `https://` + tên miền |
| `DATABASE_URL` | Neon, bước 1.2 |
| `INGEST_TOKEN` | token, bước 1.3 |
| `LEAD_WEBHOOK_URL` | bước 0.3 |

Lưu: `Ctrl+O` → `Enter` → `Ctrl+X`

### 3.3 — Tạo bảng trong cơ sở dữ liệu — chạy một lần

```
docker run --rm -v /opt/halongxanh:/app -w /app \
  -e DATABASE_URL="$(grep '^DATABASE_URL=' .env | cut -d= -f2-)" \
  node:22-alpine sh -c "npm ci --silent && npx drizzle-kit migrate"
```

### 3.4 — Bật trang

```
chmod +x trien-khai.sh
./trien-khai.sh
```

Script tự kiểm `.env`, kiểm cú pháp Caddyfile, dựng ảnh, bật hộp chứa, rồi
**chờ tới khi trang thật sự trả lời** mới báo thành công.

### 3.5 — Bật canh gác — chạy một lần

```
chmod +x canh-trang.sh
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/halongxanh/canh-trang.sh") | crontab -
```

### 3.6 — Sao lưu `.env` ra ngoài máy ⚠️

Chép **nội dung** `.env` vào trình quản lý mật khẩu.

Script canh gác có sao lưu `.env`, nhưng **bản sao đó nằm trên chính máy chủ nó
đang bảo vệ** — mất máy là mất luôn bản sao.

### 3.7 — Kiểm 4 chỗ

- [ ] Mở tên miền, có **ổ khoá xanh**
- [ ] `/quy-hoach` — bấm được vào các chấm trên sơ đồ
- [ ] Cuộn trang chủ tới "Phối cảnh" — ảnh chạy ngang
- [ ] Dán link lên Zalo cho chính mình — hiện **ảnh hoàng hôn kèm tên dự án**

---

# Giai đoạn 4 — Nối Antigravity

### 4.1 — Cho Antigravity biết đích

`.env.local` của Antigravity:

```
VINHOMES_SITE_URL=https://tenmiencuaban.com.vn
VINHOMES_INGEST_TOKEN=<token ở bước 1.3>
```

> ❗ Token phải **trùng khớp từng ký tự** với `INGEST_TOKEN` bên trang. Lệch một
> ký tự là lỗi 401. Chép dán, đừng gõ tay.

Khởi động lại Antigravity.

### 4.2 — Thêm khoá AI

<https://platform.deepseek.com> → **API keys** → **Create new API key**

Antigravity → `/ai-keys` → chọn DeepSeek → dán → **Verify** → phải thành
**active**.

### 4.3 — Kiểm đường ống, chưa tốn tiền AI

```
cd D:\Dự án cô Giang
npm run kiem:dang-bai
```

Phải ra **13/13 mục đạt**. Trượt thì chưa đi tiếp.

### 4.4 — Thử toàn tuyến

Antigravity → **Bắt đầu** → gõ chủ đề → **Bắt đầu viết** → chờ 2–4 phút →
**Đăng lên website** → mở `/tin-tuc` của trang, bài phải có ở đó.

---

# Giai đoạn 5 — Mở cho khách

**Chỉ làm khi đã xác nhận số liệu với hồ sơ gốc.**

### 5.1 — Xác nhận số liệu ⚠️

- [ ] `6.206 ha` tổng diện tích
- [ ] `380.000 cư dân`
- [ ] Bảo lãnh Techcombank
- [ ] Diện tích từng dòng sản phẩm (hiện suy ra từ **tên file** bản vẽ, chưa
      phải bảng hàng chính thức)

Sai số liệu bất động sản là **rủi ro pháp lý**, không phải chuyện trình bày.

### 5.2 — Điền thông tin liên hệ

`src/data/project.ts` → `lienHe`: hotline, Zalo, email.
Chừng nào còn trống, nút gọi và nút Zalo **tự ẩn**.

### 5.3 — Tắt màn mở đầu lặp lại

`src/components/ui/preloader.tsx` → `CHAY_MOI_LAN = false`.
Không tắt thì khách quay lại lần nào cũng phải ngồi chờ.

### 5.4 — Mở cho Google

`.env` → `NEXT_PUBLIC_CHO_LAP_CHI_MUC=1` → `./trien-khai.sh`

### 5.5 — Hỏi về thông báo Bộ Công Thương

Website thương mại điện tử tại Việt Nam thuộc diện phải **thông báo** với Bộ
Công Thương (online.gov.vn). Trang này giới thiệu dự án và thu thông tin khách
nên **có khả năng thuộc diện đó**.

**Tôi không phải nguồn tư vấn pháp lý** — hỏi bên bán tên miền hoặc luật sư
trước khi mở cho công chúng.

---

# Trạng thái hiện tại — kiểm ngày 14/08/2026

| Hạng mục | Kết quả |
|---|---|
| Antigravity: lint · typecheck · build | ✅ xanh |
| Antigravity: kiểm thử tự động | ✅ **183/183** |
| Antigravity: audit giao diện 15 trang × 2 khổ | ✅ **30/30**, 0 lỗi tương phản, 0 tràn ngang, 0 ô thiếu nhãn, 0 nút thiếu tên |
| Trang `/bat-dau` (chế độ Đơn giản) | ✅ sạch hoàn toàn, 0 thuật ngữ kỹ thuật |
| Đường đăng bài Antigravity → trang | ✅ **13/13** qua đường HTTP thật |
| Trang bất động sản: lint · typecheck · build | ✅ xanh |
| Caddyfile | ✅ 2 khối, không lỗi cấu trúc |
| 3 script triển khai | ✅ cú pháp đúng |

**Còn tồn:** 404 điểm chạm nhỏ hơn 40px trên các trang bản đầy đủ — đó là nút
`sm` cỡ 28px dùng trong bảng dày đặc. **Vẫn đạt ngưỡng WCAG 24px**; ngưỡng 40px
là chuẩn khắt khe hơn của Apple mà bộ kiểm của tôi dùng.

---

# Nếu chỉ làm được 3 việc

1. **Bật WAF cho `/login`** (bước 0.1) — lỗ hổng đang mở
2. **Đưa mã lên GitHub** (bước 0.2) — mọi thứ khác phụ thuộc
3. **Đặt `LEAD_WEBHOOK_URL`** (bước 0.3) — không có thì mất thông tin khách thật
