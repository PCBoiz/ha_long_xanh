"use client";

import { useRef, type ReactNode } from "react";
import { gsap, giamChuyenDong, useHieuUngBoCuc } from "@/lib/motion/gsap";

/**
 * Ảnh nở dần ra toàn màn hình khi cuộn tới, trong lúc mảng bị ghim lại.
 *
 * Hiệu ứng đắt giá nhất trong bộ: người xem cuộn nhưng trang đứng yên, chỉ có
 * khung ảnh mở rộng ra — cảm giác như bước vào trong bức ảnh.
 *
 * Dùng `clip-path` chứ KHÔNG dùng width/height. Đổi width/height buộc trình
 * duyệt tính lại bố cục mỗi khung hình nên rất giật; `clip-path` chỉ đổi vùng
 * hiển thị, chạy trên cùng lớp với transform nên mượt. Đổi lại, ảnh phải luôn
 * phủ kín khung ngay từ đầu — nó không "to lên" mà là được lộ ra dần.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ `useLayoutEffect` CHỨ KHÔNG PHẢI `useEffect`, VÀ ĐÂY LÀ LỖI ĐÃ LÀM SẬP
 *    TOÀN BỘ TRANG.
 *
 * `pin: true` khiến ScrollTrigger BỌC phần tử này vào một thẻ `pin-spacer` mà
 * nó tự tạo. Tức là nút do React dựng bỗng có một người cha khác — người cha
 * mà React không hề biết.
 *
 * Chừng nào còn ở trang chủ thì không sao. Nhưng lúc rời trang chủ, React đi
 * gỡ cây nút cũ và gọi `removeChild` trên đúng nút đó. Với `useEffect`, hàm
 * dọn dẹp chạy KHÔNG đồng bộ nên có thể chạy sau; `pin-spacer` vẫn còn đó,
 * React không tìm thấy nút ở nơi nó ghi nhớ và ném:
 *
 *     Failed to execute 'removeChild' on 'Node':
 *     The node to be removed is not a child of this node.
 *
 * Lỗi này KHÔNG hiện ra như một lỗi. Nó làm React bỏ luôn cả cây — trang mới
 * hiện ra trắng trơn, không thanh điều hướng, không nội dung, và cách duy nhất
 * để đọc được là bấm tải lại. Đo được: đi từ trang chủ sang bất cứ trang nào
 * cũng mất `<main>`; đi giữa hai trang trong thì bình thường; bật "giảm chuyển
 * động" (GSAP không chạy) thì cũng bình thường.
 *
 * `useLayoutEffect` chạy hàm dọn dẹp ĐỒNG BỘ, trước khi React đụng vào DOM —
 * `boi.revert()` trả nút về đúng cha cũ kịp lúc. Đây cũng chính là điều tài
 * liệu GSAP dặn cho React, và là lý do họ làm hẳn hook `useGSAP`.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function ExpandOnScroll({
  children,
  chuThich,
}: {
  children: ReactNode;
  chuThich?: ReactNode;
}) {
  const mang = useRef<HTMLElement>(null);
  const khung = useRef<HTMLDivElement>(null);
  const chu = useRef<HTMLDivElement>(null);

  useHieuUngBoCuc(() => {
    if (giamChuyenDong()) return;
    const goc = mang.current;
    const anh = khung.current;
    if (!goc || !anh) return;

    const boi = gsap.context(() => {
      const dong = gsap.timeline({
        scrollTrigger: {
          trigger: goc,
          start: "top top",
          // 65% chứ không phải 110%. Đo được: vùng ghim của mảng này chiếm
          // 1.890px trên trang chủ, trong đó 990px là quãng cuộn thuần tuý —
          // trang đứng yên, chỉ có khung ảnh mở dần. Ở 65% hiệu ứng vẫn đọc ra
          // trọn vẹn mà quãng cuộn chết giảm gần một nửa.
          end: "+=65%",
          scrub: 0.4,
          pin: true,
          // Kích thước tính lại khi xoay máy hoặc đổi cỡ cửa sổ, nếu không điểm
          // kết thúc bị chốt theo chiều cao cũ.
          invalidateOnRefresh: true,
        },
      });

      dong.fromTo(
        anh,
        { clipPath: "inset(24% 18% 24% 18%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none" },
      );

      if (chu.current) {
        // Chữ lui đi trước khi ảnh phủ kín, nếu không nó nằm chết giữa ảnh.
        dong.to(chu.current, { autoAlpha: 0, y: -24, ease: "none" }, 0);
      }
    }, goc);
    return () => boi.revert();
  }, []);

  return (
    <section ref={mang} className="relative h-svh overflow-hidden">
      <div ref={khung} className="absolute inset-0">
        {children}
      </div>

      {chuThich ? (
        <div
          ref={chu}
          className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center"
        >
          {chuThich}
        </div>
      ) : null}
    </section>
  );
}
