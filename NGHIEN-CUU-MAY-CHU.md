# Nghiên cứu: thuê máy chủ nào, và mất máy thì dựng lại ra sao

Ba phần, xếp theo mức quan trọng thật — không theo thứ tự bạn hỏi:

1. **Diễn tập khôi phục** — tìm ra 2 lỗ hổng, đã vá
2. **Chặn dò mật khẩu** — tìm ra 1 lỗ hổng nghiêm trọng hơn tôi tưởng
3. **So sánh nhà cung cấp VPS** — giá thật, tra ngày 14/08/2026

---

# Phần 1 — Diễn tập khôi phục

Câu hỏi: *máy chủ mất sạch lúc này, dựng lại mất bao lâu, và mất gì vĩnh viễn?*

## Kiểm kê: cái gì nằm ở đâu

| Thứ | Nằm ở đâu | Mất máy chủ thì |
|---|---|---|
| Mã nguồn (30MB) | máy bạn + kho git | ✅ còn |
| Ảnh dự án (14MB, 32 tấm) | trong mã nguồn | ✅ còn |
| Bài viết | **Neon** (ngoài máy chủ) | ✅ còn, Neon tự sao lưu |
| Chứng chỉ SSL | ổ đĩa Docker | ✅ Caddy tự xin lại |
| `.env` | **chỉ trên máy chủ** | ⚠️ dựng lại được từ chỗ khác |
| **Đăng ký của khách** | **chỉ trên máy chủ** | ❌ **MẤT VĨNH VIỄN** |

## Lỗ hổng 1 — bản sao lưu nằm trên chính máy nó bảo vệ

Script canh gác tôi viết sao lưu `.env` vào `/opt/halongxanh/.sao-luu/`.

**Sai chỗ.** Nó cứu được *"hôm qua sửa `.env` sai, muốn quay lại"*. Nó **không**
cứu được *"máy chủ mất"* — vì lúc đó bản sao lưu mất cùng.

Đã sửa: ghi rõ giới hạn này ngay trong script, và bản sao lưu thật phải nằm
ngoài máy — chép nội dung `.env` vào trình quản lý mật khẩu.

May là `.env` **dựng lại được** từ nơi khác:

| Ô | Lấy lại ở đâu |
|---|---|
| `TEN_MIEN`, `EMAIL_SSL`, `NEXT_PUBLIC_SITE_URL` | tự nhớ |
| `DATABASE_URL` | bảng điều khiển Neon |
| `INGEST_TOKEN` | `.env.local` của Antigravity trên máy bạn |

## Lỗ hổng 2 — thông tin khách rơi vào file tạm rồi biến mất

Chưa đặt `LEAD_WEBHOOK_URL` thì mỗi lượt khách bấm "Đăng ký tư vấn" bị ghi
xuống `.data/dang-ky.jsonl` **ngay trên máy chủ**. Đó là **số điện thoại thật
của khách hàng thật**, không sao lưu ở đâu, mất cùng máy chủ.

Đây là kiểu mất mát tệ nhất: hệ thống chạy đúng, khách điền form thành công,
không có thông báo lỗi nào — mà không ai gọi lại cho họ. Bạn chỉ biết khi
nghe ai đó nói *"tôi đăng ký mãi mà chẳng thấy ai liên hệ"*.

Đã sửa: script canh gác giờ **đếm số lượt đang nằm trong file tạm** và cảnh báo
kèm lệnh tải về. Nhưng đó chỉ là băng dán — **cách đúng là đặt
`LEAD_WEBHOOK_URL`** trỏ về Google Sheet, n8n hoặc CRM trước khi mở cho khách.

## Quy trình khôi phục — dựng lại từ số không

| Bước | Việc | Thời gian |
|---|---|---|
| 1 | Thuê VPS mới, lấy IP | 10 phút |
| 2 | Sửa bản ghi DNS ở PA Việt Nam sang IP mới | 5 phút + **15–30 phút chờ lan truyền** |
| 3 | `bash dung-may-chu.sh` | 3 phút |
| 4 | Tải mã nguồn về `/opt/halongxanh` | 2 phút |
| 5 | Dựng lại `.env` từ trình quản lý mật khẩu + Neon | 5 phút |
| 6 | `./trien-khai.sh` | 5–10 phút |
| | **Tổng** | **45–65 phút** |

**Không cần chạy lại migration** — bảng vẫn còn nguyên ở Neon.

> ⚠️ Bước 2 là bước dài nhất và không rút ngắn được. Trong lúc chờ DNS lan
> truyền, Caddy **chưa xin được chứng chỉ SSL** — đừng chạy `trien-khai.sh`
> sớm, vì Let's Encrypt chỉ cho thử **5 lần mỗi tuần** cho cùng một tên miền.

## Hai việc nên làm trước khi cần tới

- [ ] Chép nội dung `.env` vào trình quản lý mật khẩu — **hôm nay**
- [ ] Đặt `LEAD_WEBHOOK_URL` trước khi mở trang cho khách thật

---

# Phần 2 — Chặn dò mật khẩu: vấn đề lớn hơn tôi tưởng

## Điều tôi vừa phát hiện

Tôi đã thêm bộ chặn dò mật khẩu cho Antigravity, đếm trong bộ nhớ. Tôi có ghi
chú rằng *"chạy nhiều bản song song thì hạn mức bị nhân lên"* và coi đó là
chuyện của tương lai.

**Đó là chuyện của hiện tại.** Antigravity ở lại Vercel, và tài liệu Vercel nói
rõ: mỗi lần gọi chạy trong một **microVM riêng**, và nền tảng **tự động mở rộng
tới 30.000 lượt đồng thời** trên gói Hobby/Pro.

Nghĩa là bộ đếm trong bộ nhớ **gần như vô tác dụng trên Vercel**: mỗi yêu cầu
của kẻ tấn công có thể rơi vào một microVM khác, mỗi microVM đếm từ 0.

Tệ hơn: hàm băm mật khẩu `scrypt` **cố tình tốn CPU**. Không chặn được ở lớp
ngoài thì mỗi lần thử mật khẩu là một lần đốt CPU tính tiền của bạn.

## Cách đúng: chặn ở lớp biên, không chặn trong mã

Vercel có **WAF Rate Limiting** ngay trong bảng điều khiển, và **có sẵn trên gói
Hobby**:

| | Hobby | Pro |
|---|---|---|
| Khoá đếm | IP, JA4 | IP, JA4 |
| Cửa sổ đếm | 10 giây – 10 phút | 10 giây – 10 phút |
| Số luật | **1 mỗi dự án** | 40 |
| Lượt đã bao gồm | 1.000.000 | tính theo dùng |

Ưu điểm quyết định: nó chặn **trước khi hàm được gọi**, nên kẻ dò không đốt
được CPU của bạn.

### Cấu hình (5 phút, không cần sửa mã)

1. Vercel → dự án Antigravity → **Firewall** → **Configure** → **+ New Rule**
2. Điều kiện: `Path` **equals** `/login`
3. Hành động: **Rate Limit** → Fixed Window
4. Cửa sổ **60 giây**, giới hạn **10 yêu cầu**
5. Khoá đếm: **IP**
6. Hành động khi vượt: **Deny (429)**
7. **Review Changes** → **Publish**

> ⚠️ Gói Hobby chỉ cho **1 luật mỗi dự án** — dùng đúng luật đó cho `/login`.

> ⚠️ Tài liệu Vercel ghi rõ: bộ đếm **tính theo từng vùng**. Lưu lượng từ nhiều
> vùng cộng lại có thể vượt hạn mức bạn đặt. Không hoàn hảo, nhưng hơn hẳn đếm
> trong bộ nhớ microVM.

## Kết luận về bộ đếm tôi đã viết

**Giữ lại, không xoá.** Nó là lớp thứ hai, và nó hoạt động ĐÚNG ở hai nơi:

- khi Antigravity chạy trên máy bạn (một tiến trình duy nhất)
- nếu sau này đưa Antigravity lên VPS (cũng một tiến trình)

Nhưng **không được coi nó là lớp bảo vệ chính khi còn ở Vercel**. Lớp chính
phải là WAF.

---

# Phần 3 — So sánh nhà cung cấp VPS

> **Giá tra ngày 14/08/2026, không phải báo giá.** Giá VPS đổi liên tục theo
> khuyến mãi và kỳ thanh toán. Kiểm lại trên trang chính chủ trước khi mua.

## Nhu cầu thật của trang này

| Mục | Cần | Vì sao |
|---|---|---|
| RAM | **4GB** | `next build` ăn ~1,5GB. 2GB chạy được nhưng sát ngưỡng |
| CPU | 2 nhân | đủ; trang phần lớn là tĩnh |
| Ổ cứng | 40GB | mã 30MB + ảnh Docker + nhật ký |
| Băng thông | không lo | ảnh 14MB, Next tự nén theo khổ màn hình |

**Không cần cơ sở dữ liệu trên máy** — đã dùng Neon.

## Giá thật tìm được

| Nhà cung cấp | Gói | Giá/tháng | vCPU | RAM | Ổ cứng |
|---|---|---|---|---|---|
| **Vinahost** | Cheap-SSD4 | **$13,19** | 4 | 4GB | 80GB SSD |
| Vinahost | Cheap-SSD3 | $9,03 | 3 | 3GB | 60GB SSD |
| Vinahost | Cheap-SSD2 | $5,96 | 2 | 2GB | 40GB SSD |
| **Vietnix** | VPS Cheap 2 | từ 157.000₫ | 2 | 4GB | 40GB SSD |
| **AZDIGI** | X-Platinum | 249.000₫ | 2 | 2GB | 25GB NVMe |
| **TND** | VPS 50 | 639.000₫ | 4 | 4GB | 50GB NVMe |
| **FPT Cloud** | STANDARD | *liên hệ báo giá* | 4 | 8GB | 100GB | 

Giá Vinahost tính bằng **USD và chưa gồm 10% VAT** — quy đổi theo tỉ giá lúc
bạn mua. Hợp đồng tối thiểu 3 tháng với gói dưới $10.

## Ba cái bẫy khi so giá

**1. Giá quảng cáo là giá kỳ 36 tháng.** AZDIGI ghi "từ 79.000₫" nhưng đó là
giá trả trước 3 năm; kỳ 12 tháng là 99.000₫. Trả từng tháng còn cao hơn.

**2. Chưa gồm VAT.** Hầu hết đều ghi "chưa VAT" — cộng thêm 8–10%.

**3. Cấu hình khởi điểm khác nhau.** "Từ 61.000₫" của Vinahost là gói 1 nhân /
1GB RAM — **không đủ chạy `next build`**.

## Đề xuất

Bạn chọn ngân sách **200–500k**, ưu tiên **máy ổn, tự xử lý được**:

**→ Vinahost Cheap-SSD4** — 4 nhân / 4GB / 80GB SSD, khoảng $13,19 + VAT.

Vì sao:
- **Đúng cấu hình cần**, không thừa không thiếu
- **Bảng giá công khai, minh bạch** — không phải "liên hệ báo giá"
- Nhà cung cấp lâu năm nhất Việt Nam
- Nằm gọn trong ngân sách kể cả sau VAT

**Cân nhắc thay thế:** Vietnix VPS Cheap 2 (2 nhân / 4GB / 40GB, từ 157.000₫)
rẻ hơn với cùng RAM. Ít nhân hơn nên `next build` chậm hơn, nhưng build chỉ
chạy lúc triển khai — không ảnh hưởng khách.

**Không nên với nhu cầu này:** FPT Cloud (phải liên hệ báo giá, cấu hình tối
thiểu đã 8GB — thừa và đắt), TND (639.000₫ vượt ngân sách cho cùng cấu hình).

## Ba việc phải làm khi mua

1. **Trả từng tháng cho tháng đầu**, đừng cam kết 36 tháng. Chưa dùng thì chưa
   biết máy có ổn không.
2. **Thử bộ phận hỗ trợ trước khi mua** — gửi một câu hỏi, xem bao lâu có trả
   lời. Bạn chọn "tự xử lý được" nên đây không phải yếu tố quyết định, nhưng
   biết trước vẫn hơn.
3. **Chọn Ubuntu 24.04 LTS** khi tạo máy. Script `dung-may-chu.sh` viết cho bản
   này.

---

## Nguồn

- [Top 7 VPS Việt Nam giá rẻ 2026 — TND](https://www.tnd.vn/top-vps-viet-nam-gia-re-2026-so-sanh-7-nha-cung-cap-12925/)
- [Thuê VPS giá rẻ Việt Nam — Vinahost](https://vinahost.vn/en/cheap-vps-vietnam/)
- [Bảng giá thuê VPS Việt Nam 2026 — AZDIGI](https://azdigi.com/blog/kien-thuc-vps/bang-gia-thue-vps-viet-nam)
- [Bảng giá thuê VPS — FPT Cloud](https://fptcloud.com/bang-gia-thue-vps/)
- [Cho thuê VPS Việt Nam — Vietnix](https://vietnix.vn/vps/)
- [WAF Rate Limiting — Vercel](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
- [Functions Runtimes — Vercel](https://vercel.com/docs/functions/runtimes)
