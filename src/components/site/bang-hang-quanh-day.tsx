import Link from "next/link";
import { TuoiDuLieu } from "@/components/ui/tuoi-du-lieu";
import { DUONG_DAN } from "@/lib/duong-dan";
import { bangHangDangMo } from "@/lib/bang-hang-dang-mo";

const so = (n: number) => n.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
const ty = (n: number) =>
  (n / 1e9).toLocaleString("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Bảng hàng đang mở — hiện trên CẢ CHÍN trang phân khu.
 *
 * Chín trang phân khu hiện dừng ở 329–353 từ với cùng một khuôn: một bản đồ, ba
 * gạch đầu dòng. Người mở trang "Đảo Kim Cương" xong vẫn không biết dự án này
 * đang bán gì, giá bao nhiêu, còn bao nhiêu căn.
 *
 * ⚠️ KHỐI NÀY CỐ Ý GIỐNG NHAU Ở CẢ CHÍN TRANG, và đó không phải lười.
 * Bảng hàng của chủ đầu tư không có cột phân khu, nên chia số căn về từng khu
 * là một phép gán chưa ai xác nhận được — xem ghi chú dài trong
 * `src/lib/bang-hang-dang-mo.ts`. Nói một câu đúng chín lần vẫn hơn nói chín
 * câu, trong đó tám câu là đoán.
 *
 * Phần KHÁC nhau giữa chín trang nằm ở chỗ khác: câu láng giềng tính từ toạ độ,
 * và ba điểm nhấn riêng của từng khu.
 */
export function BangHangQuanhDay() {
  const d = bangHangDangMo();
  if (!d) return null;

  return (
    <section className="border-t border-ink-line px-6 py-nhip md:px-10">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="font-display text-h2 font-normal">
          Đang mở bán trong dự án
        </h2>
        <p className="mt-3 max-w-[70ch] text-small leading-relaxed text-paper-dim">
          Bảng hàng của chủ đầu tư ghi theo tiểu khu, không ghi theo phân khu —
          nên đây là số của toàn dự án, không phải riêng khu này. Đọc lúc
          <TuoiDuLieu moc={d.docLuc} />.
        </p>

        <dl className="mt-8 grid gap-x-12 border-t border-ink-line sm:grid-cols-2">
          <div className="flex items-baseline justify-between gap-6 border-b border-ink-line py-4">
            <dt className="text-small text-paper-dim">Căn còn hàng</dt>
            <dd className="tabular text-h4 text-paper">{d.soCan}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-ink-line py-4">
            <dt className="text-small text-paper-dim">Tiểu khu đang mở</dt>
            <dd className="text-right text-body text-paper">
              {d.tieuKhu.map((t) => `${t.ten} (${t.so})`).join(" · ")}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-ink-line py-4">
            <dt className="text-small text-paper-dim">Dòng sản phẩm</dt>
            <dd className="text-right text-body text-paper">
              {d.loaiHinh.map((t) => `${t.ten} (${t.so})`).join(" · ")}
            </dd>
          </div>
          {d.dtDat ? (
            <div className="flex items-baseline justify-between gap-6 border-b border-ink-line py-4">
              <dt className="text-small text-paper-dim">Diện tích đất</dt>
              <dd className="tabular text-h4 text-paper">
                {so(d.dtDat.nhoNhat)} – {so(d.dtDat.lonNhat)} m²
              </dd>
            </div>
          ) : null}
          {d.gia ? (
            <div className="flex items-baseline justify-between gap-6 border-b border-ink-line py-4 sm:col-span-2">
              <dt className="text-small text-paper-dim">
                Giá đầy đủ, gồm thuế và phí bảo trì
              </dt>
              <dd className="tabular text-h4 text-paper">
                {ty(d.gia.nhoNhat)} – {ty(d.gia.lonNhat)} tỷ
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link href={DUONG_DAN.quyCan} className="nut nut-chinh">
            Xem từng căn
          </Link>
          <Link
            href={DUONG_DAN.giaThucTra}
            className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
          >
            Giá thực trả gồm những gì
          </Link>
        </div>
      </div>
    </section>
  );
}
