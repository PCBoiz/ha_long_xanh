"use client";

import type Lenis from "lenis";

// Chỗ giữ chung một thể hiện Lenis duy nhất của trang.
//
// Cần thiết vì vài thành phần phải TỰ ĐẶT vị trí cuộn — ví dụ kéo ngang thư
// viện ảnh thực chất là dịch thanh cuộn dọc. Gọi `window.scrollTo` không ăn
// thua: Lenis đang giữ quyền điều khiển và sẽ ghi đè lại ngay ở khung hình kế.
//
// Không dùng React context vì thứ này không phải trạng thái giao diện — nó chỉ
// là một cái tay cầm, và bọc context vào chỉ khiến mọi cây con render lại vô ích.

let hienTai: Lenis | null = null;

export function datLenis(muc: Lenis | null): void {
  hienTai = muc;
}

export function layLenis(): Lenis | null {
  return hienTai;
}
