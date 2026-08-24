"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Báo khi phần tử lọt vào tầm nhìn, đúng MỘT lần.
 *
 * Ngắt theo dõi ngay sau lần đầu: nội dung nhấp nháy lại mỗi lần cuộn qua trông
 * rẻ tiền, và giữ observer sống cho hàng chục phần tử là lãng phí vô ích.
 *
 * Người bật "giảm chuyển động" được xử lý HOÀN TOÀN ở CSS — quy tắc trong
 * `@media (prefers-reduced-motion: reduce)` đặt lại opacity và transform nên nội
 * dung hiện sẵn bất kể hook này trả về gì.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [hien, setHien] = useState(false);

  useEffect(() => {
    const nut = ref.current;
    if (!nut) return;

    const theoDoi = new IntersectionObserver(
      (muc) => {
        for (const item of muc) {
          if (!item.isIntersecting) continue;
          setHien(true);
          theoDoi.disconnect();
        }
      },
      // Kích hoạt khi phần tử vào sâu 12% màn hình, để hiệu ứng chạy lúc mắt đã
      // nhìn tới chứ không phải khi mới ló ra ở mép dưới.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    theoDoi.observe(nut);
    return () => theoDoi.disconnect();
  }, []);

  return { ref, hien };
}
