/**
 * Địa chỉ gốc của site, dùng cho sitemap, robots, canonical và thẻ chia sẻ.
 *
 * Thứ tự ưu tiên, và thứ tự này quan trọng:
 *
 *  1. `NEXT_PUBLIC_SITE_URL` — tên miền thật, do người triển khai đặt.
 *  2. `VERCEL_URL`           — địa chỉ Vercel tự cấp cho mỗi lần triển khai.
 *  3. máy cục bộ.
 *
 * VÌ SAO CÓ BƯỚC 2: đẩy bản xem thử lên Vercel mà không đặt gì thì mọi đường
 * dẫn tuyệt đối đều trỏ về `http://localhost:3000` — nghĩa là dán link lên Zalo
 * ra ô trắng (ảnh chia sẻ nằm ở địa chỉ không ai mở được), và canonical trỏ
 * vào máy của chính mình. Hỏng im lặng: trang vẫn mở bình thường trên trình
 * duyệt nên rất dễ không nhận ra.
 *
 * `VERCEL_URL` KHÔNG có tiền tố giao thức và KHÔNG bao gồm tên miền tuỳ chỉnh —
 * nó là địa chỉ `*.vercel.app` của đúng lần triển khai đó. Dùng làm bản xem thử
 * thì đúng; khi gắn tên miền thật phải đặt `NEXT_PUBLIC_SITE_URL`.
 */
function diaChiGoc(): string {
  const datTay = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (datTay) return datTay;

  const cuaVercel = process.env.VERCEL_URL;
  if (cuaVercel) return `https://${cuaVercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const DIA_CHI_GOC = diaChiGoc();

/**
 * Site đã sẵn sàng cho công cụ tìm kiếm chưa.
 *
 * Chừng nào còn `false`, mọi trang đều gắn `noindex` và robots.txt chặn sạch —
 * số liệu dự án chưa được đối chiếu hồ sơ gốc thì để Google lập chỉ mục là phát
 * tán thông tin chưa kiểm chứng.
 *
 * Với bản XEM THỬ gửi cho người khác, để `false` là ĐÚNG: ai có link vẫn mở
 * được bình thường, chỉ Google là không vào lập chỉ mục.
 *
 * TODO(owner): đặt `NEXT_PUBLIC_CHO_LAP_CHI_MUC=1` khi số liệu đã xác nhận.
 */
export const CHO_LAP_CHI_MUC = process.env.NEXT_PUBLIC_CHO_LAP_CHI_MUC === "1";
