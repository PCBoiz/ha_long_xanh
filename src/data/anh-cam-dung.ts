/**
 * DANH SÁCH ẢNH CẤM DÙNG — và lý do của từng tấm.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CẦN TỆP NÀY THAY VÌ XOÁ TỆP ẢNH ĐI
 *
 * Ảnh trong `public/images` được sinh lại từ Google Drive bằng `npm run assets`.
 * Xoá tệp là vô ích: lần chạy sau nó quay lại, và người chạy lệnh đó sẽ không
 * biết vì sao trước đó nó bị bỏ.
 *
 * Nên phải ghi lý do ở chỗ mã nguồn giữ được. Một tấm ảnh bị gỡ mà không ai
 * ghi vì sao thì ba tháng nữa sẽ có người đưa lại — đúng như đã xảy ra với bộ
 * này: chú thích thẩm định trên `/tien-ich` nói "ba tấm", nhưng mảng đã có sáu.
 * Ba tấm thêm sau không ai thẩm định, và đúng ba tấm đó là ảnh AI.
 *
 * `scripts/kiem-anh-treo.mjs` đọc danh sách này để phân biệt ảnh BỊ QUÊN với
 * ảnh CỐ Ý KHÔNG DÙNG. Không có phân biệt đó thì mỗi lần cách ly một tấm là
 * một lần cổng kiểm đỏ, và người ta sẽ tắt cổng thay vì sửa.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface AnhCamDung {
  ten: string;
  lyDo: string;
  /** Bằng chứng quan sát được, để không phải thẩm định lại. */
  bangChung: string;
}

export const ANH_CAM_DUNG: AnhCamDung[] = [
  {
    ten: "giai-tri-lang-tuyet",
    lyDo: "Ảnh sinh bằng AI",
    bangChung:
      'Biển chỉ đường ghi "NORTH S POLE" — chữ vỡ, khoảng cách sai; biển trên ' +
      "nhà gỗ là ký tự vô nghĩa. Kích thước 961×656, không khớp bộ ảnh gốc " +
      "2560px của chủ đầu tư.",
  },
  {
    ten: "giai-tri-cong-vien-nuoc",
    lyDo: "Ảnh sinh bằng AI",
    bangChung:
      'Biển ghi "Công viên Nước Đ5 chề mts" — chữ Việt vỡ nát. Chủ đề ' +
      '"INCA EMPIRE" giữa vịnh Hạ Long. Kích thước 1279×803.',
  },
  {
    ten: "giai-tri-rap-xiec",
    lyDo: "Ảnh sinh bằng AI",
    bangChung:
      "Còn nguyên HÌNH MỜ của trình sinh ảnh ở góc phải dưới (sao bốn cánh), " +
      "kèm một dòng miễn trừ nhỏ ở góc trái dưới. Chữ neon lặp không nhất quán.",
  },
  {
    ten: "giai-tri-nha-hang-duoi-nuoc",
    lyDo: "Chưa xác minh được nguồn — nghi ảnh chụp nơi khác",
    bangChung:
      "Trông như ảnh CHỤP một nhà hàng thuỷ cung đã tồn tại, không phải phối " +
      'cảnh dựng. "Nhà hàng dưới nước" KHÔNG có trong `hangMucTienIch` — danh ' +
      "sách tiện ích đã xác minh. Kích thước 1067×736, cùng dải với các tấm AI.",
  },
  {
    ten: "giai-tri-thuy-cung",
    lyDo: "Chưa xác minh được nguồn",
    bangChung:
      "Kích thước 1400×920 — cùng dải với `giai-tri-cong-vien-chu-de` (ảnh " +
      "quảng cáo VinWonders tải từ web), khác hẳn bộ gốc 2560px. Nghi là ảnh " +
      "tải về chứ không phải tài liệu chủ đầu tư gửi. Ngoài ra 1400px là quá " +
      "nhỏ cho dải ảnh lớn nơi nó từng nằm.",
  },
];

export const TEN_ANH_CAM_DUNG = ANH_CAM_DUNG.map((a) => a.ten);
