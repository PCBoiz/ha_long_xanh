/**
 * Danh sách trang đem đi đo — MỘT CHỖ KHAI, MỌI BỘ ĐO ĐỌC THEO.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ FILE NÀY SINH RA TỪ MỘT LỖI THẬT, ĐỌC TRƯỚC KHI SỬA.
 *
 * Danh sách này từng nằm ngay trong `audit.mjs`. Sau đợt đổi tên chín trang,
 * nó còn nguyên tám địa chỉ CŨ — mà địa chỉ cũ chuyển hướng 301 nên `page.goto`
 * vẫn trả 200 và bộ đo vẫn chạy trơn tru, không một dòng cảnh báo.
 *
 * Hậu quả: ba đợt audit liên tiếp báo "sạch" trong khi hai trang tiền mới chưa
 * bao giờ được đo, và mọi báo cáo lưu dưới tên cũ. Hỏng im lặng theo đúng nghĩa
 * xấu nhất — bộ đo báo xanh chính là thứ khiến không ai đi kiểm lại.
 *
 * Tách ra đây để lần sau đổi đường dẫn chỉ phải sửa MỘT chỗ. Thêm bộ đo mới thì
 * import từ đây, đừng chép danh sách sang file khác.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const TRANG = [
  { ten: "trang-chu", duong: "/" },
  { ten: "quy-hoach", duong: "/quy-hoach" },
  { ten: "tien-ich", duong: "/tien-ich" },
  { ten: "du-an", duong: "/du-an" },
  { ten: "lien-he", duong: "/lien-he" },
  { ten: "tai-lieu", duong: "/tai-lieu" },
  { ten: "tin-tuc", duong: "/tin-tuc" },
  { ten: "phan-khu", duong: "/phan-khu/paradise-bay" },
  { ten: "san-pham", duong: "/san-pham/biet-thu-bien" },
  { ten: "dau-tu", duong: "/dau-tu" },

  // ── Chín trang tiền, tên mới ──────────────────────────────────────────
  { ten: "gia", duong: "/gia-global-gate-ha-long" },
  { ten: "quy-can", duong: "/quy-can-global-gate-ha-long" },
  { ten: "gia-thuc-tra", duong: "/gia-thuc-tra-global-gate-ha-long" },
  { ten: "voucher", duong: "/voucher-vinhomes" },
  { ten: "gia-tri-tai-san", duong: "/gia-tri-tai-san-global-gate-ha-long" },
  { ten: "chinh-sach", duong: "/chinh-sach-global-gate-ha-long" },
  { ten: "phap-ly", duong: "/phap-ly-global-gate-ha-long" },
  { ten: "tien-do", duong: "/tien-do-global-gate-ha-long" },
  { ten: "vi-tri", duong: "/vi-tri-global-gate-ha-long" },
];

/**
 * Bảy trang đáng đo TỐC ĐỘ.
 *
 * Đo tốc độ dưới mạng bóp băng thông tốn khoảng nửa phút mỗi trang, nên không
 * đo hết mười chín trang. Bảy trang này là nơi khách đổ vào từ quảng cáo và tìm
 * kiếm — chậm ở đây là mất tiền thật, chậm ở trang giới thiệu thì không.
 */
export const TRANG_TOC_DO = [
  "trang-chu",
  "gia",
  "quy-can",
  "gia-thuc-tra",
  "voucher",
  "tien-do",
  "vi-tri",
];

/** Trang đáng thử ở chế độ xoay ngang: nơi khách xoay máy để xem ảnh và bảng. */
export const TRANG_NGANG = ["trang-chu", "quy-can", "tien-do", "vi-tri", "gia"];
