# 08 · Kiểm mức sẵn sàng cho AI Search — 08/09/2026

Chạy trên **trang thật đang chạy**, không phải trên máy dev. Mỗi mục dưới đây
đều có số đo kèm theo; nhật ký thô ở [08-log-bot.txt](08-log-bot.txt).

---

## Kết quả tóm tắt

| # | Mục kiểm | Kết quả |
|---|---|---|
| 1 | `robots.txt` cho phép OAI-SearchBot | ✅ khai đích danh, `Allow: /` |
| 2 | Cloudflare / WAF chặn bot | ✅ **không có** — không thấy `cf-ray`, Caddy phục vụ thẳng |
| 3 | Mọi trang tiền trả 200 | ✅ **16/16 trang × 5 bot = 80/80 lượt** đều 200 |
| 4 | Public, không đăng nhập / captcha | ✅ |
| 5 | Không `noindex` | ✅ 16/16 |
| 6 | `canonical` đúng | ✅ 16/16 |
| 7 | Nội dung chính nằm trong HTML thô | ✅ 481 – 2.891 từ, **không cần chạy JavaScript** |
| 8 | Sitemap đầy đủ | ✅ 31 địa chỉ, `lastmod` 31/31 |
| 9 | Liên kết nội bộ | ✅ 29 – 43 liên kết mỗi trang |
| 10 | FAQ máy đọc được | ✅ `FAQPage` trên 16/16 trang |
| 11 | **Ngày cập nhật trong dữ liệu có cấu trúc** | ❌ → **đã sửa** (chưa lên trang) |

---

## Chi tiết mục 3 — truy cập theo từng bot

```
TRANG                                  OAI-Searc    GPTBot Googlebot ClaudeBot Perplexit
─────────────────────────────────────────────────────────────────────────────────────────
/                                            200       200       200       200       200
/gia-global-gate-ha-long                     200       200       200       200       200
/quy-can-global-gate-ha-long                 200       200       200       200       200
/chinh-sach-global-gate-ha-long              200       200       200       200       200
/gia-thuc-tra-global-gate-ha-long            200       200       200       200       200
/voucher-vinhomes                            200       200       200       200       200
/vi-tri-global-gate-ha-long                  200       200       200       200       200
/phap-ly-global-gate-ha-long                 200       200       200       200       200
/tien-do-global-gate-ha-long                 200       200       200       200       200
/gia-tri-tai-san-global-gate-ha-long         200       200       200       200       200
/du-an                                       200       200       200       200       200
/quy-hoach                                   200       200       200       200       200
/tien-ich                                    200       200       200       200       200
/dau-tu                                      200       200       200       200       200
/tai-lieu                                    200       200       200       200       200
/lien-he                                     200       200       200       200       200
```

Không một lượt nào bị `403`, `429`, chuyển hướng, captcha hay thử thách
JavaScript. Thời gian trả lời 35 – 375 ms.

---

## 🔴 Lỗi duy nhất tìm được — và vì sao nó quan trọng hơn vẻ ngoài

**Cả 16 trang đều không khai `dateModified`.**

Với công cụ tìm kiếm thường, đó là thiếu sót nhỏ. Với trợ lý AI thì nặng hơn
nhiều: khi phải chọn giữa hai nguồn nói khác nhau về giá hoặc quỹ căn, thứ phân
xử đầu tiên là **nguồn nào mới hơn**.

Không khai ngày là tự bỏ cuộc ở đúng chỗ trang này mạnh nhất — nó có bảng hàng
đọc theo ngày, trong khi phần lớn trang đối thủ đăng một bảng rồi để đó.

### Đã sửa thế nào

Thêm `dateModified` vào hai khối `WebSite` và `FAQPage`, **lấy từ mốc đọc bảng
hàng thật** (`quy-can.generated.json` → `docLuc`) — cũng chính là mốc đang hiện
cho người đọc thấy ở khối quỹ căn.

**Không lấy giờ dựng trang.** Dùng giờ dựng thì mỗi lần triển khai lại — kể cả
khi chỉ sửa một dấu phẩy — trang sẽ tự khai là "vừa cập nhật". Đó là nói dối
máy, và máy học được điều đó.

⚠️ **Bản sửa chưa lên trang thật.** Nó nằm trong kho mã, cần một lần triển khai.

---

## Ba việc còn lại, xếp theo mức đáng làm

### 1 · Ba trang quá mỏng

```
/tai-lieu    481 từ
/tien-ich    613 từ
/quy-hoach   627 từ
```

Trợ lý AI trích được câu trả lời từ trang có nội dung đủ dày. Một trang 481 từ
hiếm khi được chọn làm nguồn. Đây không phải lỗi kỹ thuật mà là việc viết.

### 2 · `llms-full.txt` chưa có (`/llms.txt` đã có, 9 KB)

Mức đáng làm **thấp**: tra tháng 8/2026, chuẩn này mới được ~10% tên miền áp
dụng và chưa hãng nào xác nhận hệ thống chạy thật có đọc. Ghi lại cho đủ, không
ưu tiên.

### 3 · Chưa bật HSTS

Không liên quan AI Search, là việc bảo mật. Nằm ở `H8` trong `01-HA-TANG.md`.

---

## Cách chạy lại

```bash
npm run kiem-ai-search   # bảng trạng thái + canonical + sitemap
npm run log-bot          # sinh lại nhật ký truy cập bot
```
