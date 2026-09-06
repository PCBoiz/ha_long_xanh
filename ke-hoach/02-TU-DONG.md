# 02 · Dây chuyền tự động

**Ưu tiên số 2.** Nội dung phải *chảy được* trước khi bàn chuyện nội dung hay.

---

## ⚪ T1 · Nối Antigravity vào cổng nhận bài

**Trạng thái:** cổng đã sẵn sàng, chỉ còn nối đầu bên kia.

Đo từ ngoài ngày 07/09/2026:

| Phép thử | Kết quả | Nghĩa là |
|---|---|---|
| `POST /api/ingest` không kèm mã | **401** | Cổng sống, chặn đúng |
| `GET /api/ingest` | 405 | Chỉ nhận POST — đúng thiết kế |
| `/duyet-bai` | 200 | Màn hình duyệt đã lên |

**401 chứ không phải 503** là điểm mấu chốt: mã nguồn trả 503 khi `INGEST_TOKEN`
còn trống. Nó trả 401 nghĩa là đã đọc được mã, và đang từ chối vì người gọi
không có mã.

**Làm gì:** đặt `VINHOMES_INGEST_TOKEN` bên Antigravity **trùng khớp** với
`INGEST_TOKEN` trong `/opt/halongxanh/.env`, và trỏ đích tới:

```
https://halongxanh360.vn/api/ingest
```

> ⚠️ **KHÔNG dùng `.com.vn`.** Địa chỉ đó bị chuyển hướng 301 sang tên miền
> chính, và phần lớn thư viện gửi HTTP không giữ lại phần thân cùng header khi
> đi theo chuyển hướng POST. Bài sẽ thất bại theo cách rất khó đoán: lần chuyển
> hướng trả về 200, nhưng không bài nào được lưu.

---

## 🟡 T2 · Antigravity ở đâu — phân tích, chưa kết luận

Chủ trang chọn *"chưa quyết, để tôi phân tích"*. Đây là phần phân tích, và nó
**chưa đủ dữ liệu để kết luận** — thiếu đúng một phép đo.

### Vấn đề nền

Antigravity đang chạy trên **Vercel gói Hobby**, mà gói đó **cấm dùng cho mục
đích thương mại**. Nguyên văn điều khoản: *All commercial usage of the platform
requires either a Pro or Enterprise plan*, và định nghĩa của họ bao gồm
*advertising the sale of a product or service*.

Antigravity là công cụ phục vụ công việc có thu tiền. Chuyển trang bán hàng
sang máy chủ riêng **không gỡ được** vấn đề này — Antigravity vẫn ở đó.

### Ba đường, và cái giá thật của mỗi đường

| | Tiền mỗi tháng | Được | Mất |
|---|---|---|---|
| **Lên Vercel Pro** | ~20 USD (~500.000đ) | Hai hệ tách biệt, sự cố không lây sang nhau | Đắt nhất, thêm một nhà cung cấp phải quản |
| **Nâng máy chủ #2 lên #3** rồi dồn cả hai về | +140.000đ | Một hoá đơn, một đầu mối hỗ trợ | Một máy chứa hai ứng dụng: một lần dựng hỏng có thể kéo đổ cả hai |
| **Giữ nguyên** | 0 | — | Vi phạm điều khoản, đang tiếp diễn |

Đáng chú ý: **nâng máy chủ rẻ hơn Vercel Pro khoảng ba lần rưỡi.**

### Phép đo còn thiếu

Chưa ai đo **trang này ăn bao nhiêu bộ nhớ khi đang chạy thật**. Con số duy
nhất đang có (463 MB) là đo **trước** khi trang khởi động, nên nó vô nghĩa cho
việc này.

Chạy trên máy chủ, lúc trang đã chạy được vài giờ:

```
free -h && docker stats --no-stream
```

Rồi lặp lại **trong lúc đang chạy `trien-khai.sh`** — đó mới là đỉnh thật, vì
bước dựng ăn nhiều bộ nhớ nhất.

**Có hai con số đó mới nói được 6 GB có gánh nổi hai ứng dụng hay không.** Trước
đó, mọi lời khuyên đều là đoán, kể cả của tôi.

---

## ⚪ T3 · Quy trình duyệt bài

`/duyet-bai` đã chạy và có chặn dò mật khẩu (10 lượt mỗi 60 giây, đã kiểm 7/7
ca đúng).

Chưa có: **thói quen dùng nó**. Cần chốt ai duyệt, duyệt theo tiêu chí gì, bao
lâu một lần. Một hàng chờ không ai mở là một hàng chờ dài mãi.

---

## ⚪ T4 · Kiểm chất lượng nội dung tự sinh

Cổng chặn đã có và đã kiểm **11/11 ca đúng** — bắt được chiết khấu bí mật, gắn
cờ con số giá, cho qua bài sạch.

**Còn thiếu:** cách xử lý bài bị gắn cờ *cần đối chiếu*. Hiện nó vào hàng chờ
rồi nằm đó. Cần một đường đi rõ ràng: bài gắn cờ → người đối chiếu hồ sơ →
duyệt hoặc trả lại.

**Và một câu hỏi chưa ai trả lời:** khi Antigravity viết ra một con số — giá,
tiến độ, khoảng cách — thì con số đó lấy từ đâu? Nếu từ mô hình chứ không từ hồ
sơ gốc, thì cổng chặn phải **chặn** mọi con số chứ không chỉ gắn cờ. Khác biệt
giữa hai cách xử lý là khác biệt giữa một trang đáng tin và một trang bịa số
rất trôi chảy.

---

## ⚪ T5 · Lịch đăng

Chưa có. Cần chốt tần suất, chủ đề, và ai chịu trách nhiệm.

Việc này phụ thuộc `04-RA-KHACH.md`: đăng gì là do chiến lược từ khoá và GEO
quyết định, không phải do hứng.
