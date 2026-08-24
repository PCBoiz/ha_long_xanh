"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, giamChuyenDong } from "@/lib/motion/gsap";
import { datLenis } from "@/lib/motion/lenis-store";

/**
 * Cuộn quán tính, và — quan trọng hơn — NỐI nó vào GSAP.
 *
 * Trước đây tôi chỉ chạy Lenis rồi để mặc: Lenis cuộn theo nhịp riêng của nó,
 * còn ScrollTrigger vẫn nghe sự kiện cuộn gốc của trình duyệt. Hai đồng hồ chạy
 * lệch nhau nên hiệu ứng bám cuộn giật và trễ. Ba dòng dưới đây là cách nối
 * chuẩn:
 *
 *   1. `lenis.on("scroll", ScrollTrigger.update)` — Lenis nhích tới đâu báo cho
 *      ScrollTrigger tới đó, thay vì đợi sự kiện cuộn gốc.
 *   2. `gsap.ticker.add(...)` — để GSAP làm nhịp chung, thay vì Lenis tự gọi
 *      requestAnimationFrame riêng.
 *   3. `lagSmoothing(0)` — tắt cơ chế tự bù khung hình rơi của GSAP; nếu bật,
 *      nó nhảy cóc và làm lệch khỏi vị trí cuộn thật.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Người đã chọn "giảm chuyển động" thì trả lại đúng hành vi cuộn của hệ
    // điều hành. Cuộn có đà là thứ dễ gây chóng mặt nhất trên trang này.
    if (giamChuyenDong()) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Đường cong dừng dần — nhanh lúc đầu, tắt êm ở cuối.
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t)),
      // Trên thiết bị cảm ứng, cuộn gốc của hệ điều hành đã tốt và quen tay.
      syncTouch: false,
    });

    // Vài thành phần cần tự đặt vị trí cuộn (kéo ngang thư viện ảnh) nên phải
    // với tới được thể hiện này.
    datLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const nhip = (thoiDiem: number) => lenis.raf(thoiDiem * 1000);
    gsap.ticker.add(nhip);
    gsap.ticker.lagSmoothing(0);

    // ------------------------------------------------------------------
    // ĐO LẠI KHI CHIỀU CAO TRANG ĐỔI — đây là lỗi làm hỏng toàn bộ hiệu ứng.
    //
    // `next/image` lazy-load mọi ảnh trừ hero. ScrollTrigger đo vị trí các mốc
    // ngay lúc khởi tạo, khi trang còn ngắn hơn thực tế rất nhiều; ảnh tải dần
    // làm trang dài ra nhưng các mốc vẫn giữ số đo cũ. Hậu quả: mảng không ghim
    // được, chuyển động bám cuộn rơi sai chỗ, và phần tử tràn ra ngoài khung.
    //
    // Theo dõi chiều cao thân trang rồi đo lại là cách chữa gọn nhất: nó bắt
    // được cả ảnh lazy, cả nội dung đổi, cả lúc đổi cỡ cửa sổ — không cần dò
    // từng thẻ ảnh một.
    // ------------------------------------------------------------------
    let henDo: ReturnType<typeof setTimeout>;
    const doLai = () => {
      clearTimeout(henDo);
      // Gộp nhiều lần đổi liên tiếp thành một lần đo, vì đo lại là việc nặng.
      henDo = setTimeout(() => ScrollTrigger.refresh(), 180);
    };

    const theoDoiKichThuoc = new ResizeObserver(doLai);
    theoDoiKichThuoc.observe(document.body);
    window.addEventListener("load", doLai);

    // Liên kết neo phải đi qua Lenis, nếu không trình duyệt nhảy cái rụp trong
    // khi phần còn lại của trang trôi mượt — lệch hẳn nhịp.
    const bamNeo = (su: MouseEvent) => {
      if (su.defaultPrevented || su.button !== 0 || su.metaKey || su.ctrlKey) {
        return;
      }
      const the = (su.target as HTMLElement | null)?.closest("a");
      const href = the?.getAttribute("href");
      if (!href) return;

      const neo = href.startsWith("#")
        ? href
        : href.startsWith("/#") && window.location.pathname === "/"
          ? href.slice(1)
          : null;
      if (!neo || neo === "#") return;

      const dich = document.querySelector(neo);
      if (!dich) return;
      su.preventDefault();
      lenis.scrollTo(dich as HTMLElement, { offset: -80 });
    };

    document.addEventListener("click", bamNeo);
    return () => {
      document.removeEventListener("click", bamNeo);
      window.removeEventListener("load", doLai);
      theoDoiKichThuoc.disconnect();
      clearTimeout(henDo);
      gsap.ticker.remove(nhip);
      datLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
