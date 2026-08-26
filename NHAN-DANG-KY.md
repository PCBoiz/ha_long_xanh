# Dựng chỗ nhận đăng ký bằng Google Sheet

Biến `LEAD_WEBHOOK_URL` là địa chỉ mà trang gửi thông tin khách tới. Trang
không tự lưu — nó **chuyển tiếp**, và nếu không có nơi để chuyển thì:

- Trên Vercel: rơi vào nhánh `xemThu`. Không lưu ở đâu cả, và khách đọc được
  dòng "Đây là bản xem thử nên thông tin KHÔNG được lưu lại".
- Trên máy chủ riêng: ghi tạm vào `.data/dang-ky.jsonl`, và mất sạch ở lần
  triển khai kế tiếp.

Cả hai đều hỏng **im lặng về phía chủ trang**: không lỗi, không cảnh báo, chỉ
là không ai gọi lại cho những người thật đã để lại số.

Google Apps Script là cách dựng nhanh nhất, miễn phí, không cần máy chủ.

---

## 1. Tạo bảng tính

Vào [sheets.new](https://sheets.new), đặt tên (ví dụ `Đăng ký — Hạ Long Xanh`).

Dòng đầu tiên điền đúng sáu ô này, đúng thứ tự:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Thời điểm | Điện thoại | Quan tâm nhất | Họ tên | Đang xem | Ghi chú |

## 2. Dán mã

Trong bảng tính: **Tiện ích mở rộng → Apps Script**. Xoá hết nội dung có sẵn,
dán đoạn dưới đây vào:

```javascript
// Nhận đăng ký từ halongxanh360.vn và ghi xuống bảng tính.
//
// Trang gửi tới đây một đối tượng JSON đúng sáu trường:
//   dienThoai, uuTien, hoTen, quanTam, ghiChu, thoiDiem
//
// Tên trường phải khớp với `chuyenTiep` trong src/lib/lead/dang-ky-action.ts.
// Đổi tên trường bên đó mà quên đổi ở đây thì ô tương ứng lặng lẽ để trống —
// không có lỗi nào báo, vì Apps Script vẫn trả về 200.

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var bang = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    bang.appendRow([
      // Đổi sang giờ Việt Nam ngay lúc ghi. Trang gửi mốc thời gian dạng ISO
      // (giờ UTC); để nguyên thì mọi dòng lệch bảy tiếng, và dòng nào tới vào
      // đầu giờ sáng sẽ mang ngày hôm trước.
      d.thoiDiem
        ? Utilities.formatDate(new Date(d.thoiDiem), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm')
        : '',
      // Dấu nháy đơn ở đầu để Sheet giữ nguyên số 0 — không có nó thì
      // "0941328658" bị hiểu là số và thành "941328658".
      d.dienThoai ? "'" + d.dienThoai : '',
      d.uuTien || '',
      d.hoTen || '',
      d.quanTam || '',
      d.ghiChu || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (loi) {
    // Trả 200 kèm ok:false chứ KHÔNG ném lỗi ra ngoài.
    //
    // Apps Script không cho đặt mã trạng thái HTTP. Nếu để lỗi tự thoát ra, nó
    // trả về một trang HTML báo lỗi kèm mã 200 — trang sẽ coi là gửi thành công
    // và mất bản ghi. Ghi lại vào nhật ký Apps Script để còn truy được.
    console.error('Không ghi được đăng ký: ' + loi);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Triển khai

**Triển khai → Bản triển khai mới → ⚙️ → Ứng dụng web**, rồi đặt:

| Mục | Chọn |
|---|---|
| Thực thi với tư cách | **Tôi** (`ssn205.llc@gmail.com`) |
| Ai có quyền truy cập | **Bất kỳ ai** |

> ⚠️ Phải là **"Bất kỳ ai"**, không phải "Bất kỳ ai có Tài khoản Google". Máy chủ
> của trang gọi tới mà không đăng nhập bằng tài khoản nào cả — chọn sai mục này
> thì Google trả về trang đăng nhập, trang coi là lỗi, và khách thấy thông báo
> "hiện chưa gửi được".

Bấm **Triển khai**, cho phép quyền khi Google hỏi, rồi copy **URL ứng dụng web**.
Nó có dạng:

```
https://script.google.com/macros/s/AKfy...rất-dài.../exec
```

Đó chính là giá trị của `LEAD_WEBHOOK_URL`.

## 4. Thử trước khi tin

Chạy trên máy (PowerShell), thay `<URL>` bằng địa chỉ vừa copy:

```powershell
$than = '{"dienThoai":"0900000000","uuTien":"Thử máy","hoTen":"Kiểm tra","quanTam":"","ghiChu":"dòng thử, xoá được","thoiDiem":"2026-08-26T03:00:00.000Z"}'
Invoke-RestMethod -Uri "<URL>" -Method Post -ContentType 'application/json' -Body $than
```

Mở bảng tính: phải có một dòng mới, cột **Thời điểm** hiện `26/08/2026 10:00`
(giờ Việt Nam, không phải 03:00), và cột **Điện thoại** giữ nguyên số 0 ở đầu.

Đúng cả hai thì xoá dòng thử đi và dán URL vào Vercel.

---

## Về sau

Mỗi lần sửa mã trong Apps Script phải **Triển khai → Quản lý bản triển khai →
✏️ → Phiên bản: Mới → Triển khai**. Tạo "bản triển khai mới" thay vì sửa bản cũ
sẽ sinh ra một URL khác, và URL đang đặt trong Vercel vẫn trỏ về bản cũ.
