# 01 · Củng cố hạ tầng

**Ưu tiên số 1 theo chỉ đạo của chủ trang.** Lý do xếp đầu: mọi việc ở ba file
sau đều dựng trên tầng này. Hỏng ở đây thì công sức bên trên mất trắng, và
thường mất *im lặng*.

---

## ✅ H1 · Cơ sở dữ liệu không đọc được — ĐÃ CHẨN ĐOÁN VÀ VÁ

**Trạng thái:** xong ngày 07/09/2026. Giữ lại toàn bộ mô tả bên dưới vì cách
chẩn đoán sai lúc đầu đáng ghi lại hơn cả kết luận.

### Nguyên nhân thật: Neon ngủ, và lần gọi đầu tiên sau khi ngủ thì thất bại

Gọi `/api/suc-khoe` liên tiếp 5 lần, cách nhau 2 giây:

```
lần 1   503  hỏng      761ms     ← thất bại
lần 2   200  ok       1271ms     ← chậm, đang thức dậy
lần 3   200  ok        254ms     ← đã ấm
lần 4   200  ok        254ms
lần 5   200  ok        251ms
```

Không phải bảng thiếu, không phải sai chuỗi kết nối, không phải mất mạng. Neon
gói miễn phí thu máy tính toán về 0 khi không ai dùng, và lần gọi đầu tiên sau
đó **không chờ máy dậy** — nó hỏng luôn.

**Vì sao đây là kiểu hỏng tệ nhất:** trang ít khách thì cơ sở dữ liệu ngủ gần
như liên tục, nên **mỗi vị khách đầu tiên sau mỗi quãng vắng đều thấy mục tin
tức rỗng**. Im lặng, ngắt quãng, và kiểm lần thứ hai là lại thấy bình thường.

**Không giữ ấm được bằng cách gọi định kỳ:** 100 giờ tính toán/tháng, mà một
tháng có 730 giờ. Thức 24/7 là vượt trần khoảng ngày thứ mười sáu, và vượt trần
thì Neon treo tới đầu tháng sau.

**Đã vá:** `thuLaiKhiNguDay()` trong `src/db/index.ts` — thử lại ĐÚNG MỘT
LẦN sau 1,2 giây, và **chỉ khi lỗi không kèm mã Postgres**. Lỗi thật như
`42P01` thì không thử lại, vì thử lại chỉ làm mọi trang chậm gấp đôi rồi vẫn
hỏng.

### Ba lần chẩn đoán sai trước khi ra kết quả — ghi lại để không lặp

1. **"200 nghĩa là cơ sở dữ liệu chạy tốt"** — sai. `/tin-tuc` bắt lỗi rồi trả
   danh sách rỗng, nên trang vẫn 200 khi cơ sở dữ liệu đã hỏng.
2. **"Bảng chưa tồn tại"** — sai. Truy vấn thẳng Neon cho thấy đủ cả ba bảng
   `bai_viet`, `dang_ky`, `su_kien`.
3. **Bảng điều khiển Neon đã ghi sẵn `Primary ● Idle`** ngay trong ảnh chụp từ
   hôm trước. Đọc lướt qua mà không nối được với triệu chứng.

---

## 🔴 H1-cũ · Mô tả gốc lúc chưa biết nguyên nhân

**Trạng thái lúc ghi:** ĐANG HỎNG, trên máy chủ thật.

Nhật ký máy chủ ngày 07/09/2026 lặp lại liên tục:

```
[tin-tuc] KHÔNG ĐỌC ĐƯỢC cơ sở dữ liệu khi đọc bài đã đăng.
          Trang vẫn chạy nhưng phần bài viết sẽ TRỐNG.
          Lỗi gốc: Failed query: select ... from "bai_viet" ...
```

**Vì sao nguy hiểm hơn vẻ ngoài:** trang `/tin-tuc` vẫn trả về **HTTP 200**. Mã
nguồn bắt lỗi rồi trả danh sách rỗng — đúng thiết kế, nhưng nghĩa là **mọi phép
đo bằng mã HTTP đều báo "khoẻ"**. Tôi đã tự mắc bẫy này một lần đêm 07/09 khi
kết luận "200 nghĩa là cơ sở dữ liệu chạy".

**Đã loại trừ:** chuỗi kết nối trong hộp chứa sạch, không dính dấu nháy
(`14 ký tự đầu: "postgresql://n"`).

**Còn ba khả năng:**
1. Bảng `bai_viet` chưa tồn tại — migration chưa chạy trên cơ sở dữ liệu này
2. Neon đang ngủ, hoặc đã chạm hạn mức gói miễn phí
3. Hộp chứa không ra được internet tới Neon

**Việc kèm theo — sửa chỗ ghi nhật ký.** [tin-tuc.ts](../src/lib/tin-tuc.ts)
in ra `(loi as Error)?.message`, mà với lỗi Drizzle thì `.message` chỉ chứa
*"Failed query: …"*. Lỗi Postgres thật nằm ở `.cause` và **không bao giờ được
in ra**. Khối chẩn đoán viết rất công phu nhưng lấy nhầm nửa thông tin — nên
một sự cố mười phút thành một cuộc dò tìm.

---

## 🟠 H2 · Không có sao lưu — không có gì cả

**Trạng thái:** HỞ. Mất dữ liệu bây giờ là mất vĩnh viễn.

Ba kho dữ liệu, không kho nào được sao lưu:

| Kho | Chứa gì | Rủi ro |
|---|---|---|
| Neon Postgres | Toàn bộ bài viết | Gói miễn phí **không có phục hồi theo thời điểm** |
| Ổ `du_lieu_roi_ve` | Lượt đăng ký rơi về khi webhook lỗi | **Số điện thoại thật của người thật** |
| Google Sheet | Danh sách khách | Có bản lưu của Google, nhưng xoá nhầm là xoá thật |

P.A có sao lưu máy chủ hằng tuần — **không đủ**: nó chụp cả máy, không phục hồi
được một bảng, và bảy ngày là quá thưa cho dữ liệu khách.

**Làm gì:** một việc định kỳ mỗi đêm xuất `pg_dump` ra máy chủ, giữ 14 bản, kèm
sao chép ra một nơi *khác máy chủ*. Sao lưu nằm cùng máy với thứ nó bảo vệ thì
không phải sao lưu.

---

## 🟠 H3 · Không ai canh trang

**Trạng thái:** HỞ. Trang chết lúc 2 giờ sáng thì sáng ra mới biết.

Hộp chứa có `restart: unless-stopped` nên tự dựng lại khi sập. Nhưng nó không
cứu được: máy chủ chết, hết ổ đĩa, chứng chỉ hết hạn, DNS đổi, Neon hết hạn
mức. Trong mọi trường hợp đó trang tắt và **không có gì báo cho ai**.

**Làm gì:** một dịch vụ giám sát bên ngoài (UptimeRobot / Better Stack, gói
miễn phí đủ dùng) gọi `https://halongxanh360.vn/` mỗi 5 phút, báo về Telegram
hoặc email khi hai lần liên tiếp thất bại.

**Phải là dịch vụ ngoài, không phải script trên máy chủ.** Máy chủ chết thì
script trên nó cũng chết — chuông báo cháy đặt trong phòng đang cháy.

**Nên canh thêm** một địa chỉ *có chạm cơ sở dữ liệu*, vì `H1` cho thấy trang
chủ vẫn 200 khi cơ sở dữ liệu đã hỏng.

---

## 🟠 H4 · Vào máy chủ vẫn bằng mật khẩu

**Trạng thái:** HỞ.

Cổng 22 mở ra toàn bộ internet, đăng nhập bằng mật khẩu, tài khoản `root`. Máy
chủ Việt Nam mới mở thường bắt đầu nhận hàng nghìn lượt dò trong vài giờ.

Mật khẩu hiện tại do chủ trang tự đặt lúc cài lại, chưa từng đi qua email — đã
tốt hơn nhiều so với mật khẩu P.A gửi ban đầu. Nhưng dò mật khẩu vẫn là một cửa
mở, và nó không bao giờ mệt.

**Làm gì, theo thứ tự:**
1. Sinh khoá trên máy chủ, khai lên `~/.ssh/authorized_keys`
2. **Thử đăng nhập bằng khoá ở một cửa sổ MỚI, giữ nguyên cửa sổ đang mở**
3. Chỉ khi cửa sổ mới vào được mới tắt đăng nhập bằng mật khẩu
4. Cài `fail2ban`

> ⚠️ Bước 2 không được bỏ. Tắt đăng nhập mật khẩu trong khi khoá chưa chạy là
> tự khoá mình ra khỏi máy chủ, và đường vào duy nhất còn lại là chế độ cứu hộ
> của P.A.

---

## 🟠 H5 · Bảng điều khiển P.A chưa bật xác thực hai bước

**Trạng thái:** HỞ. Mục `2FA` trong Cloudpanel vẫn `OFF` (đo 07/09/2026).

Bảng điều khiển đó **quyền cao hơn cả mật khẩu root**: nó cài lại được máy, đặt
lại được mật khẩu root, mở được console cứu hộ. Ai vào được đó thì đổi mật khẩu
root cũng vô ích.

Mà mật khẩu vào đó thì P.A đã gửi qua email dạng chữ trần, và email đó nằm vĩnh
viễn trong hộp Gmail.

**Làm gì:** bật 2FA ngay trong khối `Account`, quét mã bằng Google
Authenticator. Đây là việc **rẻ nhất và chặn được nhiều đường nhất** trong cả
file này.

---

## 🟡 H6 · Bước tự kiểm cuối của `trien-khai.sh` báo động giả

**Trạng thái:** CHỜ XÁC ĐỊNH.

Lần triển khai đầu, script báo đỏ:

```
✗ https://halongxanh360.vn trả về HTTP 000000, không phải 200.
```

Nhưng đo từ bên ngoài đúng lúc đó: **HTTP 200, 163 KB, chứng chỉ hợp lệ**.

Nó gọi `curl` **từ chính máy chủ** tới địa chỉ công cộng của chính nó. Hai lời
giải: Caddy chưa kịp xin xong chứng chỉ, hoặc mạng của nhà cung cấp không cho
một máy tự gọi địa chỉ công cộng của mình.

**Phân biệt bằng một lệnh** (chạy khi mọi thứ đã ổn định):

```
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' --max-time 25 https://halongxanh360.vn/
```

`200` → chỉ là chưa kịp, không cần làm gì.
`000` → phải sửa script kiểm bằng cách khác, **nếu không mọi lần triển khai sau
đều báo đỏ giả** — và một cảnh báo luôn sai là một cảnh báo sẽ bị bỏ qua đúng
lúc nó nói thật.

---

## 🟠 H7 · Hạn mức Neon gói miễn phí

**Trạng thái:** HỞ, chưa chạm.

Gói miễn phí: **0,5 GB lưu trữ** và **100 giờ tính toán mỗi tháng**. Chạm bất
kỳ hạn mức nào là **treo phần tính toán tới đầu tháng sau** — nghĩa là trang
mất phần bài viết cho tới khi sang tháng.

Hai trang tin tức khai `force-dynamic`: **mỗi lượt xem** là một truy vấn. Chưa
có khách thì không sao; có khách rồi thì đây là thứ chạm hạn mức trước tiên.

**Làm gì:** hoặc đổi hai trang đó sang đệm 60 giây (một truy vấn mỗi phút thay
vì mỗi lượt xem), hoặc theo dõi mức dùng và nâng gói trước khi chạm trần. Xem
thêm ở `03-SAN-PHAM.md` mục tốc độ.

---

## ⚪ H8 · Chưa bật HSTS

Ép trình duyệt chỉ mở trang qua HTTPS. [Caddyfile](../Caddyfile) đã có sẵn khối
này nhưng **cố ý tắt**, và tắt là đúng ở giai đoạn này.

**Bật sau ít nhất một tuần chạy ổn.** Lý do phải chờ: bật rồi thì trình duyệt
ghi nhớ trong một năm và **từ chối mở trang qua HTTP kể cả khi người dùng gõ
tay**. Có sự cố chứng chỉ trong tuần đầu mà đã bật HSTS thì không có đường lùi
nhanh.

---

## ⚪ H9 · Chưa có chốt chặn cho lỗi `"use server"`

Cùng một cái bẫy đã sập **ba lần** trong kho này:

| Lần | Ở đâu | Hậu quả |
|---|---|---|
| 1 | `lib/lead/uu-tien.ts` | Build gãy: `e.map is not a function` |
| 2 | `lib/duyet-bai-kieu.ts` | Màn hình duyệt bài không hiện gì, không báo lỗi |
| 3 | `lib/lead/dang-ky-action.ts` | **Biểu mẫu chết trên máy chủ thật**, 07/09/2026 |

Cả ba lần đều **không gãy lúc build**, và thông báo lỗi không nhắc gì tới
`"use server"`. Quy tắc đã được ghi lại trong chú thích sau lần 1 và lần 2 —
ghi lại không đủ để chặn lần 3.

**Làm gì:** thêm `scripts/kiem-use-server.mjs` theo đúng khuôn các script
`kiem-*` đã có: duyệt mọi file mở đầu bằng `"use server"`, thoát mã 1 nếu có
export nào không phải hàm `async`. Nối vào `trien-khai.sh` trước bước dựng ảnh.

Một script mười dòng đổi lấy việc không có lần thứ tư.
