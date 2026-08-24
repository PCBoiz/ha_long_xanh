/**
 * Đo lường chuyển đổi — phía trình duyệt.
 *
 * Dùng `navigator.sendBeacon`, KHÔNG dùng `fetch`. Khác biệt quan trọng ở đúng
 * tình huống hay gặp nhất: người dùng bấm nút gọi, trình duyệt lập tức mở ứng
 * dụng điện thoại và bỏ trang. `fetch` đang dở dang lúc đó bị huỷ, nên chính
 * hành động đáng đo nhất lại là hành động không bao giờ ghi được.
 *
 * `sendBeacon` giao việc gửi cho trình duyệt và trình duyệt gửi tiếp kể cả sau
 * khi trang đã đóng.
 *
 * KHÔNG BAO GIỜ NÉM LỖI. Ghi nhận hỏng không được phép làm hỏng việc người dùng
 * đang làm — nếu phải chọn giữa mất một dòng số liệu và chặn một cuộc gọi, mất
 * số liệu là lựa chọn đúng, mọi lần.
 */

/** Các loại hành động được đếm. Thêm loại thì thêm ở đây, không rải chuỗi. */
export type LoaiSuKien =
  | "goi" // bấm số điện thoại
  | "zalo" // bấm nút Zalo
  | "bieu-mau" // gửi biểu mẫu thành công
  | "tai-lieu" // mở một bộ tài liệu
  | "tim-can"; // hoàn thành bộ chọn dòng sản phẩm

export function ghiSuKien(loai: LoaiSuKien, chiTiet?: string): void {
  // Chạy trên máy chủ hoặc trình duyệt cũ không có sendBeacon thì bỏ qua.
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return;

  try {
    const than = JSON.stringify({
      loai,
      // `pathname` thôi, KHÔNG kèm tham số truy vấn. Tham số hay mang theo mã
      // chiến dịch quảng cáo và đôi khi cả thông tin cá nhân dán nhầm vào —
      // giữ lại là biến một bảng đếm thành một kho dữ liệu cá nhân.
      duong: window.location.pathname,
      chiTiet,
    });

    navigator.sendBeacon(
      "/api/su-kien",
      new Blob([than], { type: "application/json" }),
    );
  } catch {
    // Im lặng, có chủ ý. Xem chú thích đầu file.
  }
}
