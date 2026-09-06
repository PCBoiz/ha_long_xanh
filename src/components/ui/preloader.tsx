"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { ProjectImage } from "@/components/ui/project-image";
import { duAn } from "@/data/project";

/**
 * `useLayoutEffect` ở trình duyệt, `useEffect` khi dựng ở máy chủ.
 *
 * Cần đúng thời điểm này cho việc gắn cờ `data-co-man-mo`: cờ phải có mặt
 * TRƯỚC khung hình đầu tiên. Gắn muộn một khung hình thì chữ hero kịp nhúc
 * nhích rồi mới bị khoá lại — một cú giật nhỏ nhưng nằm đúng chỗ đắt nhất
 * của trang.
 */
const useDungBoCuc = typeof window === "undefined" ? useEffect : useLayoutEffect;

const KHOA_PHIEN = "vhgg:da-xem-preloader";

/**
 * Chạy màn mở đầu ở mọi lần tải trang chủ, hay chỉ lần đầu mỗi phiên.
 *
 * ĐÃ ĐỔI VỀ `false`. Từ nay màn mở đầu chỉ còn ở trang chủ, mà trang chủ lại là
 * nơi khách quay về nhiều nhất giữa các lần xem quỹ căn — bắt xem lại 2,4 giây
 * mỗi lần là tra tấn đúng người đang quan tâm nhất.
 *
 * Ghi lại cái bẫy đã mắc, vì nó không hiển nhiên: `sessionStorage` sống sót qua
 * cả Ctrl+Shift+R, chỉ mất khi đóng hẳn tab. Nên trong lúc làm trang, người sửa
 * tưởng đang chỉnh màn mở đầu mà thật ra nó không hề chạy. Muốn xem lại thì mở
 * cửa sổ ẩn danh, hoặc xoá khoá `vhgg:da-xem-preloader` trong tab Application
 * của công cụ nhà phát triển.
 */
const CHAY_MOI_LAN = false;

/** Mốc thời gian của từng chặng, tính từ lúc bắt đầu (mili giây). */
const MOC = {
  chu: 520, // ảnh bắt đầu lùi về thì chữ trồi lên
  toiThieu: 2400, // tổng thời lượng tối thiểu, để không cụt lủn khi tải nhanh
  lao: 480, // đợi chữ lui hết rồi mới lao xuyên
  ketThuc: 1350, // thời lượng hiệu ứng lao xuyên
} as const;

type Chang = "anh" | "chu" | "mo" | "xong";

/**
 * Các ảnh có thể xuất hiện ở màn mở đầu — đều là cảnh hoàng hôn hoặc bình minh,
 * loại có dải màu mạnh nhất trong bộ ảnh dự án.
 *
 * Phần tử ĐẦU TIÊN là ảnh dựng sẵn ở máy chủ. Ảnh đổi luân phiên chỉ diễn ra
 * sau khi trang chạy được JavaScript, để bản HTML máy chủ và bản trình duyệt
 * dựng lại luôn khớp nhau — nếu chọn ngẫu nhiên ngay lúc dựng thì React sẽ báo
 * lệch và dựng lại cả cây.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ KHÔNG ĐƯỢC CHỨA `toan-canh-hoang-hon`. ĐÓ LÀ ẢNH HERO CỦA TRANG CHỦ.
 *
 * Danh sách này từng có nó, và hậu quả tính được: bốc ngẫu nhiên 1 trong 4 nên
 * CỨ BỐN LẦN VÀO TRANG LÀ MỘT LẦN người xem nhìn đúng một tấm ảnh hai lần liên
 * tiếp — một lần ở màn chờ, rồi màn chờ tan ra và lộ ra chính tấm đó làm nền
 * hero. Hiệu ứng lao xuyên khi đó không mở ra cái gì mới cả.
 *
 * Đây chính là thứ khiến trang bị nhận xét "sao cứ thấy mấy tấm ảnh giống
 * nhau": bốn tấm trong danh sách đều là cảnh chụp từ trên cao, cùng vịnh, cùng
 * dải màu — nên trùng lặp ở đây đắt hơn ở bất kỳ chỗ nào khác trên trang.
 *
 * Ba tấm còn lại vẫn giữ được ý đồ ban đầu (mỗi lượt vào một cảnh khác), mà
 * KHÔNG BAO GIỜ đụng vào ảnh hero.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ANH_MO_DAU = [
  "khu-1-cong-vien-hoang-hon",
  "view-bien-sang-som",
  "toan-canh-sang-som",
] as const;

/**
 * Bật cờ trên thẻ <html> để CSS thả cho chữ hero trồi lên.
 *
 * Không có cờ này, hiệu ứng chữ chạy hết trong lúc màn còn che; màn mở ra là
 * thấy chữ đã đứng sẵn — mất đúng khoảnh khắc đáng giá nhất của trang.
 */
function moKhoaHieuUngChu(): void {
  document.documentElement.dataset.preloaded = "true";
}

/**
 * Màn mở đầu.
 *
 * Diễn biến: ảnh hoàng hôn phủ kín màn hình và lùi rất chậm về đúng cỡ → tên
 * dự án trồi lên cùng bộ đếm 000→100 → chữ lui đi, ảnh phóng mạnh lao về phía
 * người xem rồi mờ đi, để lộ trang phía sau.
 *
 * Ba điều đáng nói:
 *
 * 1. CHỈ dựng ở TRANG CHỦ, và chỉ chạy lần đầu mỗi phiên. Bắt người dùng xem
 *    lại mỗi lần bấm về trang chủ là tra tấn, không phải thẩm mỹ; còn bắt
 *    người vào thẳng trang bảng giá xem thì là đuổi khách.
 * 2. Bộ đếm bò tới 92 rồi ĐỢI sự kiện `load` thật mới chạy nốt về 100. Nếu để
 *    nó tự chạy đủ theo đồng hồ thì có lúc màn mở ra trong khi ảnh còn trắng.
 * 3. Ảnh dùng `priority` nên nó cũng chính là ảnh hero được tải trước — màn mở
 *    đầu không làm chậm trang, mà tận dụng đúng thứ trang đang phải tải.
 */
export function Preloader() {
  const [chang, setChang] = useState<Chang>("anh");
  const [dem, setDem] = useState(0);
  const [chiSoAnh, setChiSoAnh] = useState(0);

  /**
   * Khai với CSS rằng trang NÀY có màn mở đầu.
   *
   * Luật giữ chữ hero nằm im (`globals.css`) phải hỏi cờ này. Không có nó thì
   * luật áp cho cả những trang không hề có màn mở đầu — và ở đó không ai gắn
   * `data-preloaded`, nên mọi tiêu đề lớn nằm im dưới đáy ô cắt vĩnh viễn.
   * Trang dựng đủ chữ, kiểm tra tự động vẫn xanh, người mở trang thì thấy một
   * khoảng trống.
   *
   * Gỡ cờ khi rời trang chủ, để trạng thái không bám lại trên thẻ <html> qua
   * các lần chuyển trang không tải lại.
   */
  useDungBoCuc(() => {
    document.documentElement.dataset.coManMo = "true";
    return () => {
      delete document.documentElement.dataset.coManMo;
    };
  }, []);

  useEffect(() => {
    // Đổi ảnh ở khung hình kế tiếp, không đổi ngay lúc dựng — xem ghi chú ở
    // `ANH_MO_DAU`.
    const id = requestAnimationFrame(() => {
      setChiSoAnh(Math.floor(Math.random() * ANH_MO_DAU.length));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    // Đã xem rồi thì bỏ qua ngay ở khung hình kế tiếp. Đặt trong rAF thay vì
    // gọi thẳng để không tạo render dây chuyền ngay trong effect.
    if (!CHAY_MOI_LAN && sessionStorage.getItem(KHOA_PHIEN)) {
      const id = requestAnimationFrame(() => {
        moKhoaHieuUngChu();
        setChang("xong");
      });
      return () => cancelAnimationFrame(id);
    }

    const batDau = performance.now();
    const hens: ReturnType<typeof setTimeout>[] = [];
    const hen = (viec: () => void, tre: number) => {
      hens.push(setTimeout(viec, tre));
    };

    hen(() => setChang("chu"), MOC.chu);

    // Bò dần và chậm lại khi tới gần 92 — cảm giác "đang thật sự tải".
    const nhip = setInterval(() => {
      setDem((truoc) =>
        truoc >= 92 ? truoc : truoc + Math.max(1, (92 - truoc) * 0.09),
      );
    }, 90);

    const hoanTat = () => {
      const conLai = Math.max(0, MOC.toiThieu - (performance.now() - batDau));
      hen(() => {
        clearInterval(nhip);
        setDem(100);
        hen(() => {
          sessionStorage.setItem(KHOA_PHIEN, "1");
          moKhoaHieuUngChu();
          setChang("mo");
          hen(() => setChang("xong"), MOC.ketThuc);
        }, MOC.lao);
      }, conLai);
    };

    if (document.readyState === "complete") {
      hoanTat();
    } else {
      window.addEventListener("load", hoanTat, { once: true });
    }

    return () => {
      clearInterval(nhip);
      for (const id of hens) clearTimeout(id);
      window.removeEventListener("load", hoanTat);
    };
  }, []);

  return (
    <div
      className="preloader"
      data-phase={chang}
      // Nội dung thật đã nằm sau lớp phủ này, nên không cần trình đọc màn hình
      // thông báo gì thêm.
      aria-hidden="true"
    >
      <div className="preloader-anh">
        <ProjectImage
          name={ANH_MO_DAU[chiSoAnh]}
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        {/* Chỉ tối vùng sau chữ, giữ nguyên dải cam vàng ở phần còn lại. */}
        <div aria-hidden="true" className="preloader-toi-chu" />
      </div>

      <div className="preloader-noi-dung">
        <div className="text-center">
          <p className="font-display text-h3 font-normal italic text-paper/60">
            Vinhomes
          </p>
          <p className="mt-2 font-display text-h1 font-normal uppercase leading-[0.95] tracking-tight">
            Global Gate
          </p>
          <p className="font-display text-h1 font-normal uppercase leading-[0.95] tracking-tight">
            Hạ Long
          </p>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div
            className="preloader-thanh"
            style={{ "--tien-do": dem / 100 } as React.CSSProperties}
          >
            <span />
          </div>
          {/* `tabular` để chữ số không nhảy qua nhảy lại khi đếm. */}
          <p className="tabular text-label text-paper/55">
            {String(Math.round(dem)).padStart(3, "0")}
          </p>
        </div>
      </div>

      <p className="sr-only">{duAn.ten}</p>
    </div>
  );
}
