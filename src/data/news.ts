// Tin tức và tiến độ dự án.
//
// ĐÂY LÀ MẢNH GHÉP NỐI VỚI ANTIGRAVITY. Ở giai đoạn sau, cổng `/api/ingest` sẽ
// ghi bài vào một bảng cơ sở dữ liệu và trang này đọc từ đó thay vì đọc mảng
// tĩnh dưới đây. Kiểu dữ liệu `BaiViet` chính là hợp đồng giữa hai bên — bộ đẩy
// bài bên Antigravity phải sinh ra đúng những trường này.
//
// Giữ dạng mảng tĩnh ở bước đầu để trang chạy được ngay mà chưa cần cơ sở dữ
// liệu, và để hình dạng dữ liệu được chốt trước khi viết cổng nhận.

import { ngayVN } from "@/lib/thoi-gian";

export interface BaiViet {
  slug: string;
  tieuDe: string;
  moTa: string;
  /** Dạng ISO, ví dụ "2026-08-05". */
  ngayDang: string;
  chuyenMuc: "Tiến độ" | "Chính sách" | "Sự kiện" | "Thị trường";
  /** Nội dung HTML đã dựng sẵn. */
  noiDung?: string;
}

export const baiViet: BaiViet[] = [];

export function dinhDangNgay(iso: string): string {
  const ngay = new Date(iso);
  // Chốt múi giờ Việt Nam — xem `lib/thoi-gian.ts`. Không chốt thì máy chủ
  // (chạy giờ UTC trên Vercel) và trình duyệt dựng ra hai ngày khác nhau với
  // mọi bài đăng trong khoảng bảy tiếng đầu ngày, và React báo lệch.
  return Number.isNaN(ngay.getTime()) ? iso : ngayVN(ngay);
}
