"use client";

import { useEffect, useRef } from "react";
import { ProjectImage } from "@/components/ui/project-image";
import { gsap, giamChuyenDong } from "@/lib/motion/gsap";
import type { ProjectImageName } from "@/data/images.generated";

/**
 * Mảng mở đầu: MỘT TẤM ẢNH THẬT, không phải nét vẽ.
 *
 * Bản trước dùng hình núi đá vôi vẽ bằng SVG trôi ngang. Chụp lại ở cả ba khổ
 * màn hình thì mảng mở đầu gần như một khung đen — nét vẽ mảnh trên nền tối
 * không đọc ra được, nên vừa qua màn mở đầu là người xem gặp một khoảng trống
 * kèm dòng chữ. Thay bằng ảnh phối cảnh hoàng hôn: đây là thứ mạnh nhất dự án
 * có, và cũng là thứ khách muốn thấy đầu tiên.
 *
 * Ảnh trôi rất chậm và phóng rất nhẹ (Ken Burns). Biên độ cố ý nhỏ — mảng mở
 * đầu đứng yên nhiều giây trong lúc người xem đọc tiêu đề, chuyển động lớn ở
 * đây sẽ tranh chỗ với chữ.
 */
export function HeroAnh({
  anh,
  children,
}: {
  anh: ProjectImageName;
  children: React.ReactNode;
}) {
  const khung = useRef<HTMLDivElement>(null);
  const lopAnh = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (giamChuyenDong()) return;
    const el = lopAnh.current;
    if (!el) return;

    const boi = gsap.context(() => {
      // Phóng rất nhẹ và không lặp lại: ảnh "thở" một hơi rồi dừng, thay vì
      // chuyển động vĩnh viễn làm mắt không nghỉ được.
      gsap.fromTo(
        el,
        { scale: 1.08 },
        { scale: 1, duration: 14, ease: "power1.out" },
      );
      // Trôi lên khi cuộn — chậm hơn chữ nên mắt đọc ra chiều sâu.
      gsap.to(el, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: khung.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, khung);
    return () => boi.revert();
  }, []);

  return (
    <section
      ref={khung}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <div ref={lopAnh} className="absolute inset-0 will-change-transform">
        <ProjectImage
          name={anh}
          // Ảnh đầu trang là thứ quyết định cảm giác "trang đã tải xong" nên
          // phải nạp trước, không để trình duyệt xếp nó xuống cuối hàng.
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Màn lọc BA LỚP thay vì một lớp phủ đều.
          Lớp đều làm ảnh xám xịt hết; ba lớp này chỉ tối ở chỗ có chữ:
            · dọc — tối ở đáy, nơi đặt tiêu đề
            · ngang — tối nhẹ ở trái, nơi bắt đầu dòng chữ
            · toàn khung — một lớp rất mỏng để giữ tương phản khi ảnh sáng */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-ink via-ink/45 via-45% to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-ink/70 to-transparent md:to-40%"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ink/15" />

      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
