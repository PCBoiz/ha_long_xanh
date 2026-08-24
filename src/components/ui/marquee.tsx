"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, giamChuyenDong } from "@/lib/motion/gsap";

interface MarqueeProps {
  /** Các cụm chữ lặp lại, ngăn nhau bằng một dấu trám. */
  items: string[];
  /** Thời gian chạy hết một vòng ở tốc độ nền, tính bằng giây. */
  duration?: number;
}

/**
 * Dải chữ chạy ngang, ĐỔI CHIỀU và TĂNG TỐC theo thao tác cuộn.
 *
 * Cuộn xuống thì chữ chạy sang trái, cuộn lên thì chạy sang phải, cuộn nhanh thì
 * chữ vọt theo rồi từ từ trở về tốc độ nền. Chi tiết nhỏ nhưng là thứ khiến
 * trang có cảm giác phản hồi lại người dùng chứ không phải một băng ghi sẵn.
 *
 * Nội dung được nhân đôi ở JSX rồi chạy đúng NỬA quãng đường, nên tới cuối vòng
 * khung hình trùng khít với lúc bắt đầu — mắt không bắt được điểm nối.
 *
 * Toàn bộ dải là trang trí: chữ chỉ lặp lại những cụm đã có ở nơi khác, nên ẩn
 * khỏi trình đọc màn hình để không phải nghe đọc đi đọc lại.
 */
export function Marquee({ items, duration = 48 }: MarqueeProps) {
  const duong = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (giamChuyenDong()) return;
    const ray = duong.current;
    if (!ray) return;

    const boi = gsap.context(() => {
      const vong = gsap.to(ray, {
        xPercent: -50,
        duration,
        ease: "none",
        repeat: -1,
      });

      let huong = 1;
      let ve: ReturnType<typeof setTimeout>;

      const dat = (nhanh: number) =>
        gsap.to(vong, { timeScale: nhanh, duration: 0.35, overwrite: true });

      const moc = ScrollTrigger.create({
        onUpdate: (minh) => {
          huong = minh.direction;
          // Vận tốc cuộn tính bằng điểm ảnh/giây; chia 500 rồi kẹp lại để cuộn
          // rất mạnh cũng không làm chữ nhoè thành vệt.
          const boi = gsap.utils.clamp(
            1,
            5,
            1 + Math.abs(minh.getVelocity()) / 500,
          );
          dat(huong * boi);

          // Ngừng cuộn thì thả về tốc độ nền, giữ nguyên chiều vừa rồi.
          clearTimeout(ve);
          ve = setTimeout(() => dat(huong), 220);
        },
      });

      return () => {
        clearTimeout(ve);
        moc.kill();
      };
    }, ray);
    return () => boi.revert();
  }, [duration]);

  const cum = (khoa: string) => (
    <div key={khoa} className="flex shrink-0 items-center">
      {items.map((chu, thuTu) => (
        <span key={`${khoa}-${thuTu}`} className="flex items-center">
          <span className="font-display text-h2 font-normal whitespace-nowrap text-paper/25">
            {chu}
          </span>
          <span className="mx-10 text-jade-deep md:mx-16">◆</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden py-10" aria-hidden="true">
      <div ref={duong} className="flex w-max">
        {cum("a")}
        {cum("b")}
      </div>
    </div>
  );
}
