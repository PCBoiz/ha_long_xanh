> ## ⚠️ TÀI LIỆU NÀY KHÔNG CÒN DÙNG ĐỂ LÀM THEO
>
> Nó viết trước khi chốt hướng triển khai, và **mâu thuẫn với các tài liệu khác
> trong kho ở năm chỗ**. Nó hướng dẫn đưa trang lên Vercel và mời gắn tên miền thật vào đó — trái với quyết định đã chốt, và trái điều khoản gói Hobby (cấm dùng thương mại).
>
> **Đọc [BAT-DAU-TAI-DAY.md](BAT-DAU-TAI-DAY.md) thay cho file này.**
>
> File này giữ lại để tra cứu chi tiết kỹ thuật, không phải để làm theo từng bước.

# Đưa trang lên Vercel

Bản xem thử, để gửi link cho người khác xem. Không cần tên miền, không cần máy chủ.

---

## ⚠️ Cái bẫy trông y hệt "build chậm"

**Triệu chứng:** `npx vercel --prod --yes` in ra `Building…` rồi đứng im hàng
chục phút. Bấm vào link Inspect cũng không thấy nhật ký nào.

**Thực tế:** bản dựng chưa chạy một giây nào. Hỏi API thì thấy:

```
readyState        BLOCKED
readyStateReason  Git author <email> must have access to the team … on Vercel
                  to create deployments.
```

Vercel CLI gắn **email tác giả của commit** vào mỗi bản triển khai, và chặn nếu
email đó không thuộc team. `vercel ls` **không hiện** bản bị chặn, nên nhìn từ
mọi phía đều giống như đang tải lên rất lâu.

**Vì sao nó mới xuất hiện:** phép kiểm này chỉ chạy khi kho mã có `remote`. Ngày
28/08 kho được nối lên GitHub, và từ lần triển khai kế tiếp mọi bản đều mang
theo email tác giả. Trước đó không có remote nên không có gì để kiểm.

**Cách sửa** — đặt email tác giả của kho này trùng với tài khoản Vercel:

```bash
git config user.email "email-cua-tai-khoan-vercel@gmail.com"
git commit --allow-empty -m "Doi tac gia cho khop tai khoan Vercel"
npx vercel --prod --yes
```

`git config` không có `--global`, nên chỉ đổi trong kho này. Bản triển khai đọc
tác giả của commit **HEAD**, nên phải có một commit MỚI sau khi đổi — sửa cấu
hình thôi thì chưa đủ.

Kiểm nhanh xem có đang bị chặn không, thay `<id>` bằng id ở link Inspect:

```bash
npx vercel inspect <url-ban-trien-khai>
```
`status BLOCKED` là dính bẫy này; `status BUILDING` mới thật sự là đang dựng.

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
