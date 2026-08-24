import Link from "next/link";
import { lienHe } from "@/data/project";
import { DUONG_DAN } from "@/lib/duong-dan";

/**
 * Đường liên hệ luôn nằm trong tầm tay.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * HAI HÌNH DẠNG KHÁC NHAU CHO HAI LOẠI THIẾT BỊ, VÀ ĐÓ LÀ CHỦ Ý
 *
 * DI ĐỘNG — thanh dính hết chiều ngang ở đáy màn hình, ba việc: Gọi · Zalo ·
 * Phương án. Đây là nơi phần lớn khách bất động sản Việt Nam thật sự đọc trang,
 * và ngón cái của họ nằm sẵn ở đáy màn hình. Hai nút tròn nhỏ ở góc phải là bố
 * cục của máy bàn đem xuống điện thoại: nhỏ hơn ngưỡng chạm thoải mái, và che
 * mất chính nội dung đang đọc.
 *
 * MÁY BÀN — vẫn là hai nút tròn ở góc. Ở đó con trỏ đi tới đâu cũng được, và
 * một thanh chạy hết bề ngang màn hình 1440px trông như quảng cáo.
 *
 * VÌ SAO CÓ NÚT THỨ BA "PHƯƠNG ÁN". Gọi và Zalo đòi khách nói chuyện ngay —
 * có người chưa sẵn sàng, và với họ mà chỉ có hai lựa chọn ấy thì không còn
 * đường nào. Nút thứ ba dẫn tới biểu mẫu, nơi họ để lại số rồi được gọi sau.
 * Đây cũng chính là điều khác biệt của trang: thứ khách nhận là một PHƯƠNG ÁN,
 * không phải một tờ rơi.
 *
 * TỰ ẨN khi `lienHe` còn trống. Một nút gọi dẫn tới số rỗng sẽ mở ứng dụng gọi
 * với số trắng — người dùng tưởng máy mình hỏng.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function LienHeNoi() {
  const coHotline = lienHe.hotline.trim().length > 0;
  const coZalo = lienHe.zalo.trim().length > 0;
  if (!coHotline && !coZalo) return null;

  const soGoi = lienHe.hotline.replace(/\s/g, "");
  const soZalo = lienHe.zalo.replace(/\D/g, "");

  return (
    <>
      {/* ───────────────── DI ĐỘNG: thanh dính ở đáy ───────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-line bg-ink/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-3 divide-x divide-ink-line">
          {coHotline ? (
            <a
              href={`tel:${soGoi}`}
              data-do="goi"
              data-do-chi-tiet="thanh-dinh"
              className="flex min-h-14 items-center justify-center text-nav uppercase text-paper active:bg-ink-soft"
            >
              Gọi
            </a>
          ) : (
            <span aria-hidden="true" />
          )}

          {coZalo ? (
            <a
              href={`https://zalo.me/${soZalo}`}
              target="_blank"
              rel="noreferrer"
              data-do="zalo"
              data-do-chi-tiet="thanh-dinh"
              className="flex min-h-14 items-center justify-center text-nav uppercase text-paper active:bg-ink-soft"
            >
              Zalo
            </a>
          ) : (
            <span aria-hidden="true" />
          )}

          <Link
            href={DUONG_DAN.lienHe}
            data-do="phuong-an"
            data-do-chi-tiet="thanh-dinh"
            className="flex min-h-14 items-center justify-center bg-jade-deep text-nav uppercase text-paper active:bg-jade"
          >
            Phương án
          </Link>
        </div>
      </div>

      {/* Đệm bù đúng chiều cao thanh dính.
          Không có nó thì thanh che mất dòng cuối của chân trang — mà dòng cuối
          chân trang là dòng miễn trừ trách nhiệm, thứ bắt buộc phải đọc được. */}
      <div aria-hidden="true" className="h-14 md:hidden" />

      {/* ───────────────── MÁY BÀN: hai nút tròn ở góc ───────────────── */}
      <div className="fixed bottom-8 right-8 z-40 hidden flex-col gap-3 md:flex">
        {coZalo ? (
          <a
            href={`https://zalo.me/${soZalo}`}
            target="_blank"
            rel="noreferrer"
            data-do="zalo"
            data-do-chi-tiet="nut-noi"
            className="grid size-14 place-items-center rounded-full border border-ink-line bg-ink/90 text-xs font-medium uppercase tracking-wider backdrop-blur transition-colors hover:bg-paper hover:text-ink"
          >
            Zalo
          </a>
        ) : null}

        {coHotline ? (
          <a
            href={`tel:${soGoi}`}
            aria-label={`Gọi ${lienHe.hotline}`}
            data-do="goi"
            data-do-chi-tiet="nut-noi"
            className="grid size-14 place-items-center rounded-full bg-jade-deep text-lg text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            <span aria-hidden="true">☎</span>
          </a>
        ) : null}
      </div>
    </>
  );
}
