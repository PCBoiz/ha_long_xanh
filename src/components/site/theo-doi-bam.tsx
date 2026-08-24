"use client";

import { useEffect } from "react";
import { ghiSuKien, type LoaiSuKien } from "@/lib/do-luong";

/**
 * Một trình nghe DUY NHẤT cho toàn trang, thay vì gắn tay vào từng nút.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO LÀM KIỂU NÀY
 *
 * Cách thông thường là cho mỗi nút một `onClick`. Nhưng nút gọi, nút Zalo và
 * các đường dẫn tài liệu đều nằm trong THÀNH PHẦN MÁY CHỦ. Gắn `onClick` buộc
 * phải đổi từng cái sang thành phần trình duyệt — nghĩa là đẩy thêm mã sang
 * phía người dùng, cho một việc chẳng liên quan gì tới giao diện.
 *
 * Ở đây chỉ một trình nghe đặt trên `document`, bắt các cú bấm nổi lên từ bất
 * kỳ phần tử nào mang `data-do`. Thành phần máy chủ chỉ cần thêm một thuộc
 * tính là được đếm, và vẫn nguyên là thành phần máy chủ.
 *
 * Cách dùng:
 *     <a href="tel:..." data-do="goi">…</a>
 *     <a href="..." data-do="tai-lieu" data-do-chi-tiet="Hồ sơ pháp lý">…</a>
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * `closest` CHỨ KHÔNG PHẢI `event.target`
 *
 * Người dùng bấm trúng thẻ `<span>` bên trong nút, không phải chính thẻ `<a>`.
 * So sánh thẳng với `target` thì mọi nút có nội dung lồng nhau đều không được
 * đếm — và mọi nút đẹp trên trang này đều có nội dung lồng nhau.
 */
export function TheoDoiBam() {
  useEffect(() => {
    const khiBam = (su: MouseEvent) => {
      const nut = (su.target as Element | null)?.closest?.("[data-do]");
      if (!(nut instanceof HTMLElement)) return;

      const loai = nut.dataset.do as LoaiSuKien | undefined;
      if (!loai) return;

      ghiSuKien(loai, nut.dataset.doChiTiet);
    };

    // `capture: true` để vẫn bắt được cả khi một trình xử lý ở giữa gọi
    // `stopPropagation` — đo lường không nên phụ thuộc vào việc mã khác cư xử
    // đẹp.
    document.addEventListener("click", khiBam, { capture: true });
    return () =>
      document.removeEventListener("click", khiBam, { capture: true });
  }, []);

  return null;
}
