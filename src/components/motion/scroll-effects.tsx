"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, giamChuyenDong } from "@/lib/motion/gsap";

/* ================================ THỊ SAI ================================= */

interface ParallaxProps {
  children: ReactNode;
  /** Biên độ trôi, tính bằng % chiều cao phần tử. 6–14 là dải dùng được. */
  cuong?: number;
  /**
   * Phóng to lớp bên trong để lúc nó trôi lên/xuống không hở mép. Với ảnh thì
   * BẮT BUỘC bật, không thì thấy khoảng trống ở trên hoặc dưới.
   */
  phongTo?: boolean;
  className?: string;
}

/**
 * Lớp trôi chậm hơn trang khi cuộn.
 *
 * Đây là hiệu ứng "rẻ" nhất mà lại tạo cảm giác sống động nhất: chỉ cần vài lớp
 * đi khác tốc độ là mắt đọc ra chiều sâu.
 *
 * Khung ngoài làm mốc kích hoạt, lớp trong mới là thứ chuyển động. Nếu để chính
 * phần tử đang chuyển động làm mốc thì mốc tự dịch theo, và vị trí tính ra bị
 * trôi dần sau vài lần cuộn qua lại.
 */
export function Parallax({
  children,
  cuong = 10,
  phongTo = false,
  className = "",
}: ParallaxProps) {
  const khung = useRef<HTMLDivElement>(null);
  const lop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (giamChuyenDong()) return;
    const ngoai = khung.current;
    const trong = lop.current;
    if (!ngoai || !trong) return;

    const boi = gsap.context(() => {
      gsap.fromTo(
        trong,
        { yPercent: cuong },
        {
          yPercent: -cuong,
          ease: "none",
          scrollTrigger: {
            trigger: ngoai,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, ngoai);
    return () => boi.revert();
  }, [cuong]);

  return (
    <div ref={khung} className={`overflow-hidden ${className}`}>
      <div
        ref={lop}
        className={phongTo ? "h-full w-full scale-[1.28]" : "h-full w-full"}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================== MỞ BẰNG MẶT NẠ ============================= */

/**
 * Nội dung hiện ra như bị một tấm màn gạt lên, thay vì mờ dần.
 *
 * Mờ dần là hiệu ứng ai cũng dùng nên mắt bỏ qua; màn gạt thì có hướng, có mép,
 * nên người xem nhận ra là "vừa có gì đó xảy ra".
 */
export function ClipReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (giamChuyenDong()) return;
    const nut = ref.current;
    if (!nut) return;

    const boi = gsap.context(() => {
      gsap.fromTo(
        nut,
        { clipPath: "inset(0% 0% 100% 0%)", y: 34 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          duration: 1.25,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: { trigger: nut, start: "top 86%", once: true },
        },
      );
    }, nut);
    return () => boi.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ============================= NGHIÊNG THEO CHUỘT ========================= */

/**
 * Thẻ nghiêng nhẹ theo vị trí con trỏ, tạo cảm giác có chiều sâu.
 *
 * Chỉ bật với chuột thật. Trên cảm ứng không có "vị trí con trỏ" khi chưa chạm,
 * nên hiệu ứng hoặc không chạy hoặc giật cục lúc chạm vào — tệ hơn là không có.
 */
export function Tilt({
  children,
  nghieng = 7,
  className = "",
}: {
  children: ReactNode;
  /** Góc nghiêng tối đa, tính bằng độ. Trên 10 là bắt đầu thấy méo. */
  nghieng?: number;
  className?: string;
}) {
  const khung = useRef<HTMLDivElement>(null);
  const lop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (giamChuyenDong()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const ngoai = khung.current;
    const trong = lop.current;
    if (!ngoai || !trong) return;

    const quayX = gsap.quickTo(trong, "rotationX", { duration: 0.7, ease: "power3" });
    const quayY = gsap.quickTo(trong, "rotationY", { duration: 0.7, ease: "power3" });

    const theoChuot = (su: PointerEvent) => {
      const khoi = ngoai.getBoundingClientRect();
      // Đổi toạ độ chuột thành khoảng lệch −0,5…0,5 so với tâm thẻ.
      const lechX = (su.clientX - khoi.left) / khoi.width - 0.5;
      const lechY = (su.clientY - khoi.top) / khoi.height - 0.5;
      quayX(-lechY * nghieng * 2);
      quayY(lechX * nghieng * 2);
    };
    const roiRa = () => {
      quayX(0);
      quayY(0);
    };

    ngoai.addEventListener("pointermove", theoChuot);
    ngoai.addEventListener("pointerleave", roiRa);
    return () => {
      ngoai.removeEventListener("pointermove", theoChuot);
      ngoai.removeEventListener("pointerleave", roiRa);
    };
  }, [nghieng]);

  return (
    <div ref={khung} className={className} style={{ perspective: "1000px" }}>
      <div ref={lop} style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}

/* ================================ ĐẾM SỐ ================================== */

/**
 * Con số chạy từ 0 lên giá trị thật khi cuộn tới.
 *
 * Nhận vào CHUỖI đã định dạng sẵn (ví dụ "6.206") chứ không phải số, vì dữ liệu
 * dự án lưu ở dạng hiển thị. Chuỗi nào không phải số — "Lâu dài" chẳng hạn —
 * thì in nguyên, không cố đếm.
 *
 * HTML sinh ra ở máy chủ đã chứa sẵn giá trị cuối, nên bộ máy tìm kiếm và người
 * tắt JavaScript vẫn đọc được con số đúng.
 */
export function CountUp({ giaTri }: { giaTri: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (giamChuyenDong()) return;
    const nut = ref.current;
    if (!nut) return;

    // "6.206" → 6206. Dấu chấm ở tiếng Việt là phân cách hàng nghìn.
    const dich = Number(giaTri.replace(/\./g, ""));
    if (!Number.isFinite(dich) || dich === 0) return;

    const dem = { v: 0 };
    const boi = gsap.context(() => {
      gsap.to(dem, {
        v: dich,
        duration: 1.9,
        ease: "power2.out",
        snap: { v: 1 },
        onUpdate: () => {
          nut.textContent = Math.round(dem.v).toLocaleString("vi-VN");
        },
        scrollTrigger: { trigger: nut, start: "top 88%", once: true },
      });
    }, nut);
    return () => boi.revert();
  }, [giaTri]);

  return <span ref={ref}>{giaTri}</span>;
}
