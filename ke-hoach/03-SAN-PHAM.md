# 03 · Hoàn thiện sản phẩm

**Ưu tiên số 3.** Làm trang đáng tin trước khi đổ người vào.

**Ràng buộc thiết kế do chủ trang chốt ngày 07/09/2026: "nới — nâng cấp trong
tinh thần cũ".** Nghĩa là được cải thiện thị giác đáng kể, nhưng **giữ bảng màu
và chất liệu hiện tại**. Không làm lại nhận diện. Mỗi hạng mục đề xuất trước,
chủ trang duyệt từng cái.

---

## 🟠 S1 · Ảnh giống nhau — vấn đề thật, và cách đo nó

**Đây là việc chủ trang phàn nàn nhiều lần nhất.**

### Lần trước đã sửa gì, và vì sao chưa đủ

Đợt trước tôi sửa **trùng lặp tuyệt đối**: ba mã Drive bị khai hai lần, tải về
thành hai file giống hệt. Đã gỡ, 55 file còn 52, và đã thêm chốt chặn để không
tái diễn.

Nhưng cái chủ trang đang thấy là **giống nhau về thị giác**, không phải trùng
file. Băm file **không bao giờ bắt được loại này** — hai ảnh flycam chụp cách
nhau mười giây là hai file khác nhau hoàn toàn về dữ liệu, nhưng mắt người nhìn
vào chỉ thấy một cảnh.

### Đo được gì rồi

Nhìn tên file đã thấy nguồn cơn:

```
12 ảnh  tien-do-0826-*   ← ảnh flycam tiến độ, cùng công trường, cùng độ cao
 4 ảnh  *toan-canh*      ← toàn cảnh: sáng sớm, hoàng hôn, vịnh, khu ở
 5 ảnh  tien-ich-*
 4 ảnh  vbm-hoan-thien-*
```

12 trên 52 ảnh — gần **một phần tư kho** — là ảnh tiến độ cùng một đợt chụp.

### Làm gì

Chủ trang chọn **lọc từ kho hiện có**, không bổ sung nguồn mới. Nên:

1. Tính **băm tri giác** cho cả 52 ảnh: thu về lưới nhỏ, so cấu trúc sáng tối
   thay vì so từng điểm ảnh. `sharp` đã có sẵn trong kho, không cần cài gì.
2. Xếp thành cụm theo khoảng cách Hamming, chọn ngưỡng bằng cách **nhìn kết quả
   rồi chỉnh**, không chọn theo con số đọc được ở đâu đó.
3. Mỗi cụm giữ **một** ảnh — ưu tiên ảnh sắc nét nhất, ít chữ chìm nhất, và
   khác biệt nhất so với các cụm còn lại.
4. Trang nào mất ảnh thì **để trống có chủ ý** thay vì lấp bằng ảnh cụm khác.
   Một trang ít ảnh nhưng ảnh nào cũng nói được điều riêng, tốt hơn một trang
   đầy ảnh mà cái nào cũng như cái nào.
5. Thêm chốt chặn: ảnh mới vào kho mà quá giống ảnh đã có thì báo lúc chạy
   `npm run assets`, không đợi tới lúc chủ trang nhìn thấy trên trang.

### Một việc đã biết trước, chưa sửa

Các ảnh cắt cho từng phân khu **không thật sự khoanh đúng phân khu chúng đặt
tên**. Cùng một ảnh tổng, cắt ở vị trí khác nhau, rồi gắn tên chín phân khu.
Đây là lý do thứ hai khiến trang có cảm giác lặp — và nó **cũng là một khẳng
định sai**: người đọc tin rằng mình đang nhìn phân khu đó.

---

## 🟠 S2 · Chữ chìm trong ảnh gốc

Phát hiện khi đưa cả 52 ảnh về cỡ 32 điểm ảnh: rất nhiều ảnh có **vệt màu nằm
ngang** ở cùng một vị trí. Đó là chữ chú thích của chủ đầu tư nướng sẵn vào
ảnh — kiểu như *"(*) Thông tin hình ảnh chỉ mang tính chất minh hoạ…"*, và các
nhãn tên hạng mục.

Cần rà lại từng ảnh ở cỡ thật để biết ảnh nào có chữ, chữ đó nói gì, và có mâu
thuẫn với nội dung trang không. Một dòng chữ chìm sai trong ảnh cũng là một
khẳng định sai trên trang.

---

## ⚪ S3 · Nâng cấp thị giác trong tinh thần cũ

Chủ trang nới ràng buộc. Nhưng **nới không phải là mở**, nên thứ tự là: đề xuất
từng hạng mục kèm lý do → duyệt → làm.

Nguồn tham khảo (chi tiết ở `05-CONG-CU.md`): **uiverse.io**, miễn phí, giấy
phép MIT.

> **Quy tắc bắt buộc khi lấy từ đó: chép ý tưởng, viết lại bằng biến màu của
> trang.** Mỗi thành phần trên uiverse mang sẵn phong cách riêng của người làm
> ra nó. Dán nguyên khối CSS vào là trang có hai giọng thị giác đánh nhau —
> đúng thứ bản kiểm định bên ngoài đã cảnh báo.

Đã **bỏ** shaders.com: nền động lấp lánh vừa đổi tone, vừa không chạy đều trên
điện thoại tầm trung, vừa là dấu hiệu nhận biết của trang do AI dựng. Lý do đầy
đủ ở `C9`.

---

## ⚪ S4 · Tốc độ

Chưa đo bằng công cụ thật. Mọi con số hiện có đều là kích thước HTML, không phải
thời gian khách thật nhìn thấy nội dung.

Hai chỗ đã nghi từ trước:

- **Màn hình mở đầu (preloader)** — nó đứng chắn trước nội dung chính, nên rất
  có thể đang làm chậm mốc "khách nhìn thấy gì đó". Cần đo trước khi bàn giữ hay
  bỏ.
- **Hai trang tin tức khai `force-dynamic`** — mỗi lượt xem là một truy vấn đi
  Mỹ. Đổi sang đệm 60 giây thì một phút chỉ còn một truy vấn. Đánh đổi: bài mới
  đăng xuất hiện chậm nhất sau một phút. Việc này cũng gỡ luôn `H7`.

Đo bằng `chrome-devtools-mcp` (`C2`), trên hồ sơ mạng 4G và máy yếu — không đo
trên máy tính có cáp quang, vì đó không phải thiết bị của khách.

---

## ⚪ S5 · Rà soát ánh xạ sản phẩm

Chưa làm. Cần soi từng dòng sản phẩm theo một chuỗi: **tiêu đề → diện tích →
ảnh đại diện → thư viện ảnh → mặt bằng → đường dẫn chi tiết**, xem có chỗ nào
lệch không.

Loại lỗi này không làm gãy trang. Nó chỉ làm người đọc nhìn thấy một con số ở
trang danh sách và một con số khác ở trang chi tiết — rồi thôi không tin gì nữa.

---

## ⚪ S6 · Câu tiêu đề Hero

Bản kiểm định bên ngoài đề xuất **"MUA ĐỂ SỐNG. CHỌN ĐỂ GIỮ GIÁ TRỊ."** Chưa
làm, và chưa ai quyết. Nằm trong ranh giới "không phá Hero" nên cần chủ trang
gật đầu riêng.

---

## 🟡 S7 · Rà giọng máy toàn trang — CHỜ LỆNH

Đã có tiêu chuẩn nhận diện những câu nghe như máy viết. Đợt rà soát toàn bộ
trang **đang chờ lệnh của chủ trang, tôi không tự làm**.

Ghi ở đây để không rơi, không phải để tự khởi động.
