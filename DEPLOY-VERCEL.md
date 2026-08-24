# Đưa trang lên Vercel

Bản xem thử, để gửi link cho người khác xem. Không cần tên miền, không cần máy chủ.

**Thời gian: khoảng 5 phút.** Lần đầu lâu hơn vì phải trả lời vài câu hỏi.

---

## Trước khi bắt đầu

Đã sẵn sàng:

- ✅ Đã đăng nhập Vercel trên máy này (tài khoản `sonthaiha07-3386`)
- ✅ Mã nguồn đã chỉnh cho chạy được trên Vercel
- ✅ `.vercelignore` đã chặn thư mục `.data` — chỗ chứa số điện thoại thật của
  những lượt đăng ký bạn thử ở máy

Không cần: tên miền, thẻ tín dụng, kho GitHub.

---

## Bước 1 — Mở cửa sổ lệnh

Trong VS Code: menu **Terminal → New Terminal**.

Hoặc: bấm phím Windows, gõ `powershell`, Enter.

---

## Bước 2 — Đi tới thư mục dự án

Gõ dòng này rồi Enter:

```
cd D:\vinhomes_ha_long_xanh
```

> ⚠️ **Đừng nối hai lệnh bằng `&&`.** PowerShell trên Windows không hiểu ký hiệu
> đó và sẽ báo lỗi đỏ. Gõ từng dòng một, mỗi dòng Enter một lần.

---

## Bước 3 — Chạy lệnh deploy

**Lần đầu tiên** dùng lệnh này (không có `--yes`), để bạn được chọn tên dự án:

```
npx vercel --prod
```

Nó sẽ hỏi 5 câu. Đây là từng câu và cách trả lời:

| Câu hỏi trên màn hình | Trả lời |
|---|---|
| `Set up and deploy "D:\vinhomes_ha_long_xanh"?` | gõ `y` rồi Enter |
| `Which scope do you want to deploy to?` | dùng phím mũi tên chọn tài khoản của bạn, Enter |
| `Link to existing project?` | gõ `n` rồi Enter |
| `What's your project's name?` | gõ `vinhomes-ha-long-xanh` rồi Enter |
| `In which directory is your code located?` | để nguyên `./`, chỉ cần Enter |

Nếu nó hỏi thêm về **Build Command** hay **Output Directory** — cứ Enter, nó tự
nhận ra đây là Next.js.

> **Tên dự án chỉ được dùng chữ thường, số và dấu gạch NGANG.** Tên thư mục có
> dấu gạch DƯỚI (`vinhomes_ha_long_xanh`) nên đừng bấm Enter để lấy mặc định —
> gõ tay `vinhomes-ha-long-xanh`.

---

## Bước 4 — Chờ

Màn hình chạy chữ khoảng **2–4 phút**. Xong sẽ hiện:

```
✅  Production: https://vinhomes-ha-long-xanh.vercel.app [3m]
```

**Đó là link để gửi cho người khác.** Bấm vào thử trước khi gửi.

---

## Bước 5 — Kiểm nhanh 4 chỗ

Mở link vừa nhận và xem:

- [ ] Màn mở đầu chạy, rồi hiện ảnh hoàng hôn ở trang chủ
- [ ] Vào `/quy-hoach`, bấm được vào các chấm trên sơ đồ
- [ ] Cuộn trang chủ tới mảng "Phối cảnh" — ảnh chạy ngang
- [ ] Dán link vào một tin nhắn Zalo cho chính mình — phải hiện **ảnh hoàng hôn
      kèm tên dự án**, không phải ô trắng

Chỗ thứ tư quan trọng nhất, vì đó là thứ người nhận link nhìn thấy đầu tiên.

---

# Những lần sau

Sửa mã xong, muốn cập nhật bản đã đăng:

```
cd D:\vinhomes_ha_long_xanh
npx vercel --prod --yes
```

Lần này thêm `--yes` nên không hỏi gì nữa. Link **giữ nguyên**, không đổi.

---

# Trang sẽ trông thế nào

Đây là **bản xem thử**, nên vài chỗ cố ý chưa đầy đủ:

| Chỗ | Trạng thái | Vì sao |
|---|---|---|
| Google tìm kiếm | **Không lập chỉ mục** | Số liệu dự án chưa đối chiếu hồ sơ gốc. Ai có link vẫn xem được bình thường. |
| Trang Tin tức | "Chưa có bài viết nào" | Chưa nối cơ sở dữ liệu |
| Biểu mẫu đăng ký | Chạy được, báo rõ *"thông tin KHÔNG được lưu lại"* | Chưa nối nơi tiếp nhận. Nói thật còn hơn hứa rồi không ai gọi lại. |
| Bảng hàng, giá, tiến độ thanh toán | Ô trống ghi "—" | Chưa có bảng hàng chính thức |
| Số hotline, Zalo | Ẩn | Chưa có số thật |

---

# Khi có sự cố

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `The term '&&' is not a valid...` | PowerShell không hiểu `&&` | Gõ từng dòng riêng, đừng nối |
| `Error: You must be logged in` | Phiên đăng nhập hết hạn | Gõ `npx vercel login`, làm theo hướng dẫn |
| `Project name is invalid` | Tên có dấu gạch dưới hoặc chữ hoa | Đặt lại thành `vinhomes-ha-long-xanh` |
| Build đỏ, dừng giữa chừng | Mã có lỗi | Chạy `npm run build` ở máy trước để xem lỗi gì |
| Dán link lên Zalo ra **ô trắng** | Chưa deploy lại sau khi sửa | Chạy lại `npx vercel --prod --yes` |
| Trang mở ra nhưng **không có hoạt ảnh nào** | Windows đang tắt hiệu ứng | *Settings → Accessibility → Visual effects → Animation effects* — bật lên |

---

# Muốn gỡ xuống

Vào <https://vercel.com/dashboard> → chọn dự án → **Settings** → kéo xuống cuối →
**Delete Project**.

Hoặc chỉ tạm ẩn: **Settings → Deployment Protection → Vercel Authentication** →
bật lên. Khi đó chỉ ai đăng nhập tài khoản Vercel của bạn mới xem được.

---

# Khi nào cần đổi sang tên miền thật

Gắn tên miền ở **Settings → Domains**, rồi thêm biến môi trường:

```
NEXT_PUBLIC_SITE_URL = https://tenmiencuaban.com.vn
```

Ở **Settings → Environment Variables**, rồi deploy lại.

**Bắt buộc phải làm bước biến môi trường này.** Không thì ảnh chia sẻ và địa chỉ
chính thức của trang vẫn trỏ về `.vercel.app` cũ — trang mở vẫn bình thường nên
rất dễ không nhận ra là đang sai.
