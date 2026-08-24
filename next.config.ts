import type { NextConfig } from "next";
import { CHUYEN_HUONG_CU } from "./src/lib/duong-dan";

const nextConfig: NextConfig = {
  // `standalone` gói sẵn đúng những gì cần chạy vào một thư mục, kèm bản
  // node_modules tối giản. Đây là thứ làm ảnh Docker nhỏ đi vài trăm MB và là
  // điều kiện để `Dockerfile` chỉ cần sao chép một thư mục thay vì cả dự án.
  //
  // TẮT KHI CHẠY TRÊN VERCEL. Vercel có cách đóng gói riêng; bật `standalone`
  // ở đó là dựng thừa một bản sao node_modules mà không ai dùng — build lâu
  // hơn và dễ vượt giới hạn dung lượng. Biến `VERCEL` do chính Vercel đặt sẵn
  // trong môi trường build, không phải thứ mình phải khai.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),

  images: {
    // AVIF trước, WebP sau. Trình duyệt nào hiểu AVIF thì nhận file nhẹ hơn
    // WebP khoảng 20–30% ở cùng chất lượng; trình duyệt cũ tự rơi về WebP.
    //
    // Đo được ở audit: ảnh chiếm 228–919KB mỗi trang, tức phần lớn dung lượng.
    // `toan-canh-sang-som.webp` một mình đã 304KB. Giảm ảnh là đòn bẩy lớn nhất
    // cho tốc độ tải, lớn hơn hẳn việc cắt gọt JavaScript.
    // CHỈ WebP. Đã thử bật thêm AVIF trong phiên này rồi GỠ RA, vì số đo nói
    // ngược lại phỏng đoán ban đầu:
    //
    //   AVIF  — mã hoá lần đầu ~4,1 giây mỗi cỡ, file 139KB
    //   WebP  — mã hoá lần đầu ~0,65 giây mỗi cỡ, file 233KB
    //
    // AVIF nhẹ hơn 40% nhưng tốn CPU gấp 6 lần. Hậu quả đo được ngay: 11 trên
    // 33 lượt audit hết giờ ở mốc 45 giây, và bước hâm nóng bộ đệm cho MỘT ảnh
    // chạy quá 5 phút — trên máy phát triển nhiều nhân. Máy chủ 2 nhân sẽ tệ
    // hơn.
    //
    // Có thể dựng thêm máy móc để che (hâm nóng sau mỗi lần triển khai), nhưng
    // đó là thêm một thứ nữa để hỏng, cho một trang mà người vận hành không đọc
    // được nhật ký. 40% dung lượng ảnh không đáng đổi lấy rủi ro đó.
    formats: ["image/webp"],

    // Cắt bớt số cỡ ảnh. Mặc định của Next là 8 cỡ thiết bị + 8 cỡ nhỏ = tới 16
    // biến thể cho MỖI ảnh, nhân với 32 ảnh của dự án là hàng trăm lần mã hoá.
    // Danh sách dưới đây bám đúng các điểm ngắt bố cục đang dùng thật.
    // 2048 và 3840 bị bỏ: ảnh gốc chỉ rộng 2560px nên phóng lên không thêm chi
    // tiết, chỉ thêm dung lượng.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    // Chỉ dùng cho ảnh khai `sizes` nhỏ — trang này không có ảnh thu nhỏ nào
    // dưới 256px.
    imageSizes: [256, 384],

    // Bộ ảnh dự án đều là ảnh tĩnh nằm trong `public`, không đổi giữa các lần
    // build, nên giữ bản đã tối ưu trong bộ nhớ đệm một năm.
    minimumCacheTTL: 31_536_000,
  },

  /**
   * Chuyển hướng VĨNH VIỄN từ địa chỉ cũ sang địa chỉ mới.
   *
   * Đợt này đổi tên chín trang để khớp đúng câu người mua gõ vào ô tìm kiếm.
   * Đổi tên mà không chuyển hướng thì mọi link đã gửi đi trước đó đều thành
   * trang lỗi — mà những link ấy nằm trong tin nhắn Zalo, trong ghi chú của
   * khách, trong lịch sử trình duyệt: không ai đi sửa lại được.
   *
   * `permanent: true` phát mã 301, không phải 302. Khác biệt không nhỏ:
   * 301 nói với công cụ tìm kiếm rằng địa chỉ đã dời HẲN, nên sức mạnh liên
   * kết chuyển sang địa chỉ mới và địa chỉ cũ được rút khỏi kết quả. 302 nói
   * "tạm thời", nên công cụ tìm kiếm giữ địa chỉ cũ trong chỉ mục và chia đôi
   * tín hiệu giữa hai nơi.
   *
   * ⚠️ ĐỪNG XOÁ khi thấy "chẳng ai còn dùng link cũ nữa". Chi phí giữ lại gần
   * như bằng không; chi phí xoá là những cú bấm rơi vào trang lỗi mà không ai
   * đo được.
   */
  async redirects() {
    return CHUYEN_HUONG_CU.map(({ cu, moi }) => ({
      source: cu,
      destination: moi,
      permanent: true,
    }));
  },

  // Máy chủ tự quản không có lớp bảo vệ mặc định như nền tảng đám mây, nên các
  // tiêu đề an toàn phải tự đặt.
  async headers() {
    return [
      {
        source: "/:duong*",
        headers: [
          // Chặn trình duyệt tự đoán kiểu tệp — nguồn gốc của kiểu tấn công
          // tải lên một tệp "ảnh" mà trình duyệt lại chạy như mã.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Không cho trang bị nhúng trong khung của trang khác (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          // Chỉ gửi tên miền khi người dùng bấm sang trang khác, không gửi cả
          // đường dẫn đầy đủ.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Trang không dùng ba quyền này; tắt sẵn để mã của bên thứ ba (nếu
          // sau này có) cũng không xin được.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
