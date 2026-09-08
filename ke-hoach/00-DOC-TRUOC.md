# Kế hoạch cải tiến — đọc file này trước

Lập ngày **07/09/2026**, ngay sau khi trang lên máy chủ thật lần đầu.

## Cách dùng bộ tài liệu này

Tám file, xếp theo **thứ tự chủ trang đã chốt**, không phải theo mức quan trọng
cảm tính:

| File | Việc | Vì sao xếp ở đây |
|---|---|---|
| [01-HA-TANG.md](01-HA-TANG.md) | Củng cố hạ tầng | Mọi thứ khác dựng trên nó. Hỏng ở đây thì công sức bên trên mất trắng |
| [02-TU-DONG.md](02-TU-DONG.md) | Dây chuyền tự động | Nội dung phải chảy được trước khi bàn chuyện nội dung hay |
| [03-SAN-PHAM.md](03-SAN-PHAM.md) | Hoàn thiện sản phẩm | Làm trang đáng tin trước khi đổ người vào |
| [04-RA-KHACH.md](04-RA-KHACH.md) | Ra khách thật | Việc cuối, vì ba việc trên quyết định nó có nghĩa hay không |
| [05-CONG-CU.md](05-CONG-CU.md) | Công cụ và phương pháp | Đọc song song — nó quyết định *cách* làm bốn file kia |
| [06-ANH.md](06-ANH.md) | Ảnh — nghiên cứu 08/09 | 13 tấm bóc từ PDF chủ đầu tư đã lên trang, và **đính chính một kết luận sai của tôi** |
| [07-DA-LAM-0809.md](07-DA-LAM-0809.md) | Nhật ký đợt 08/09 | Đã sửa gì, vì sao, và cái gì cố ý chưa làm |
| [08-AI-SEARCH.md](08-AI-SEARCH.md) | Sẵn sàng cho AI Search | Đo trên trang thật: 80/80 lượt bot đều 200; một lỗi đã sửa |

**Mỗi việc có một mã** (`H1`, `T3`, `S2`…). Nhắc mã đó là tôi biết ngay đang
nói việc nào, không phải mô tả lại.

## Ký hiệu trạng thái

- 🔴 **ĐANG HỎNG** — có người đang chịu thiệt ngay lúc này
- 🟠 **HỞ** — chưa hỏng, nhưng không có gì chặn khi nó hỏng
- 🟡 **CHỜ QUYẾT** — cần chủ trang chọn, tôi không tự quyết được
- ⚪ **CHƯA LÀM** — biết phải làm, chưa tới lượt
- ✅ **XONG**

## Trạng thái ngày 07/09/2026

**Đã có:**

- Tên miền `halongxanh360.vn` + `.com.vn`, cả bốn địa chỉ trỏ đúng, ba cái phụ
  chuyển hướng 301 về địa chỉ chính
- Máy chủ P.A/SuperData — Ubuntu 24.04, 4 nhân · 4 GB · 60 GB, IP `103.7.40.145`
- Tường lửa mở đúng ba cổng, vá bảo mật tự động, 5 GB bộ nhớ dự phòng
- Docker + Caddy, chứng chỉ HTTPS tự gia hạn
- Trang chạy, 31 đường dẫn, lập chỉ mục đã mở
- `robots.txt` liệt kê đích danh 16 bot AI · `llms.txt` 8.820 ký tự
- Dữ liệu có cấu trúc: `Organization`, `Place`, `RealEstateAgent`, `FAQPage` 9 cặp
- Đường nhận khách: biểu mẫu → Google Apps Script → Google Sheet (đã thử, 200 OK)

**Chưa có:**

- Sao lưu cơ sở dữ liệu — **không có gì cả**
- Giám sát — trang chết lúc 2 giờ sáng thì không ai biết
- Đăng nhập máy chủ bằng khoá — vẫn đang dùng mật khẩu

## Ba quyết định còn treo của chủ trang

Ghi lại ở đây để không rơi:

1. **Antigravity ở đâu** — Vercel gói Hobby cấm dùng thương mại. Xem `T2`.
2. **Giá trên trang** — chủ trang chọn không công khai giá; bản kiểm định bên
   ngoài lại khen phần hiển thị giá và muốn giữ. Mâu thuẫn chưa gỡ. Xem `K6`.
3. **"Sở hữu lâu dài"** — đang gắn cờ `canXacNhan: true`, cần đối chiếu hồ sơ
   gốc theo *từng dòng sản phẩm*. Căn hộ có thể khác nhà gắn liền đất. Xem `K6`.

## Nguyên tắc giữ nguyên khi làm mọi việc dưới đây

Không bàn lại, chỉ nhắc:

- Không bịa giá, quỹ căn, chính sách, voucher, pháp lý, tiến độ, khoảng cách
- Không viết "chắc chắn có voucher" · "giá thấp nhất" · "chiết khấu bí mật"
- Không công khai nguồn voucher, cách gộp người, cơ chế thương mại nội bộ
- Mã voucher của khách là giấy tờ có giá của **một người cụ thể** — không bao
  giờ xuất hiện trong mã nguồn hay trên trang
- Không đưa bí mật vào mã nguồn, tài liệu, hay gói gửi về trình duyệt
- `anh-goc/` là tài liệu thương mại nội bộ — không lên git, không lên máy chủ
