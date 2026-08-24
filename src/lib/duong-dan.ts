/**
 * BẢN ĐỒ ĐƯỜNG DẪN — một chỗ khai, mọi nơi đọc theo.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CÓ FILE NÀY
 *
 * Đợt này đổi chín đường dẫn cùng lúc. Nếu địa chỉ nằm rải rác dưới dạng chuỗi
 * trong ba mươi file JSX, thì đổi tên một trang là đi lùng bằng tay khắp kho
 * mã — và chỉ cần sót MỘT chỗ là có một liên kết chết mà không ai thấy, vì
 * TypeScript không kiểm được nội dung của một chuỗi.
 *
 * Khai ở đây thì trình biên dịch trở thành lưới an toàn: gõ sai tên khoá là
 * đỏ ngay lúc viết, không phải đợi khách bấm vào mới biết.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO ĐƯỜNG DẪN DÀI VÀ CÓ VẺ LẶP
 *
 * `/gia-global-gate-ha-long` xấu hơn `/gia` rất nhiều. Đây là lựa chọn có ý
 * thức của chủ trang, đổi vẻ đẹp lấy khớp truy vấn: người Việt tìm bất động
 * sản gõ nguyên cụm "giá vinhomes global gate hạ long", và toàn bộ trang đối
 * thủ đang chiếm đúng dạng địa chỉ đó.
 *
 * ⚠️ THỜI ĐIỂM ĐỔI LÀ CỐ Ý. Trang chưa mở lập chỉ mục nên đổi bây giờ không
 * mất gì. Sau khi Google đã xếp hạng, mỗi lần đổi địa chỉ là một lần mất một
 * phần sức mạnh liên kết dù có 301 đầy đủ. Đây là cửa sổ duy nhất còn miễn phí.
 *
 * ĐƯỜNG DẪN CŨ VẪN SỐNG, chuyển hướng 301 vĩnh viễn — xem `next.config.ts`.
 * Bất kỳ ai đã lưu hay đã gửi link cũ cho khách đều không bị rơi vào trang lỗi.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const DUONG_DAN = {
  trangChu: "/",

  // ── Chín trang tiền ────────────────────────────────────────────────────
  gia: "/gia-global-gate-ha-long",
  quyCan: "/quy-can-global-gate-ha-long",
  chinhSach: "/chinh-sach-global-gate-ha-long",
  giaThucTra: "/gia-thuc-tra-global-gate-ha-long",
  voucher: "/voucher-vinhomes",
  viTri: "/vi-tri-global-gate-ha-long",
  phapLy: "/phap-ly-global-gate-ha-long",
  tienDo: "/tien-do-global-gate-ha-long",
  giaTriTaiSan: "/gia-tri-tai-san-global-gate-ha-long",

  // ── Các trang còn lại ──────────────────────────────────────────────────
  duAn: "/du-an",
  quyHoach: "/quy-hoach",
  tienIch: "/tien-ich",
  dauTu: "/dau-tu",
  taiLieu: "/tai-lieu",
  tinTuc: "/tin-tuc",
  lienHe: "/lien-he",
} as const;

export type TenDuongDan = keyof typeof DUONG_DAN;

/**
 * Địa chỉ cũ → địa chỉ mới, dùng để sinh chuyển hướng 301.
 *
 * Giữ MÃI MÃI, không phải tạm thời. Link cũ có thể đang nằm trong tin nhắn
 * Zalo, trong ghi chú của khách, trong lịch sử trình duyệt của người đã xem —
 * những chỗ không ai cập nhật được. Xoá bảng này đi là làm chết những link đó.
 */
export const CHUYEN_HUONG_CU: { cu: string; moi: string }[] = [
  { cu: "/bang-hang", moi: DUONG_DAN.quyCan },
  { cu: "/gia-thuc-tra", moi: DUONG_DAN.giaThucTra },
  { cu: "/chinh-sach", moi: DUONG_DAN.chinhSach },
  { cu: "/ho-tro-quyen-loi", moi: DUONG_DAN.voucher },
  { cu: "/vi-tri", moi: DUONG_DAN.viTri },
  { cu: "/phap-ly", moi: DUONG_DAN.phapLy },
  { cu: "/tien-do", moi: DUONG_DAN.tienDo },
  { cu: "/gia-tri-tai-san", moi: DUONG_DAN.giaTriTaiSan },
];
