/**
 * Ảnh cho màn mở đầu của trang chủ.
 *
 * Nằm RIÊNG ở đây, không nằm trong `components/ui/preloader.tsx`, vì tệp đó là
 * `"use client"`: trang chủ (máy chủ) không gọi được hàm xuất từ một mô-đun
 * client — Next chặn thẳng lúc dựng ("Attempted to call … from the server but
 * … is on the client", đo 15/09/2026).
 *
 * Đều là cảnh hoàng hôn hoặc bình minh, loại có dải màu mạnh nhất trong bộ ảnh
 * dự án.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ KHÔNG ĐƯỢC CHỨA `toan-canh-hoang-hon`. ĐÓ LÀ ẢNH HERO CỦA TRANG CHỦ.
 *
 * Danh sách này từng có nó, và hậu quả tính được: bốc ngẫu nhiên 1 trong 4 nên
 * CỨ BỐN LẦN VÀO TRANG LÀ MỘT LẦN người xem nhìn đúng một tấm ảnh hai lần liên
 * tiếp — một lần ở màn chờ, rồi màn chờ tan ra và lộ ra chính tấm đó làm nền
 * hero. Hiệu ứng lao xuyên khi đó không mở ra cái gì mới cả.
 *
 * Đây chính là thứ khiến trang bị nhận xét "sao cứ thấy mấy tấm ảnh giống
 * nhau": bốn tấm trong danh sách đều là cảnh chụp từ trên cao, cùng vịnh, cùng
 * dải màu — nên trùng lặp ở đây đắt hơn ở bất kỳ chỗ nào khác trên trang.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const ANH_MO_DAU = [
  "khu-1-cong-vien-hoang-hon",
  "view-bien-sang-som",
  "toan-canh-sang-som",
] as const;

export type AnhMoDau = (typeof ANH_MO_DAU)[number];

/**
 * Chọn ảnh màn mở đầu — gọi ở TRANG (máy chủ), tức là lúc dựng trang.
 *
 * ⚠️ ĐỔI ẢNH Ở TRÌNH DUYỆT ĐÃ BỊ GỠ (15/09/2026) — nó tốn một tấm hero thứ hai.
 * Bản cũ dựng ảnh số 0 ở máy chủ rồi bốc ngẫu nhiên lại ngay khung hình sau. Cả
 * hai tấm đều mang `priority`, nên next/image chèn `<link rel=preload>` cho CẢ
 * HAI. Đo trên điện thoại bóp băng thông (390px, 1,6 Mbps, CPU chậm 4×): ba tấm
 * 1440px cùng preload, tổng ~450 KB, tấm cuối mãi 6.834 ms mới xong — trong khi
 * màn hình 390px không dùng tới quá một tấm. Cứ ba lượt vào là hai lượt tải
 * thừa ~300 KB.
 *
 * Chọn ở máy chủ thì bản HTML và bản trình duyệt luôn khớp, mỗi lượt khách tải
 * đúng một tấm, và mỗi đợt dựng lại trang vẫn ra một cảnh khác.
 */
export function chonAnhMoDau(): AnhMoDau {
  return ANH_MO_DAU[Math.floor(Math.random() * ANH_MO_DAU.length)]!;
}
