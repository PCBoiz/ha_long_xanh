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
        <TomTatBangHang />
      </div>
    </section>
  );
}

/**
 * Phần ruột — con số và hai nút, không có tiêu đề hay khung ngoài.
 *
 * ⚠️ TỒN TẠI ĐỂ TRANG `/du-an` THÔI NHÚNG CẢ BẢNG 616 DÒNG.
 *
 * Đo ngày 09/09/2026: `/du-an` trả về 1,45 MB HTML và 34.442 từ — gần bằng
 * chính trang bảng hàng. Nguyên nhân: nó nhúng `<BangHang />` đầy đủ, tức là
 * toàn bộ 616 căn, trên một trang lẽ ra chỉ giới thiệu dự án.
 *
 * Hai hậu quả, và cái thứ hai âm thầm hơn:
 *
 *   · NẶNG. 1,45 MB cho một trang giới thiệu, tải trên 4G là thấy ngay.
 *
 *   · TRÙNG NỘI DUNG. Đúng bảng đó đã nằm ở `/quy-can-global-gate-ha-long`.
 *     Hai địa chỉ cùng mang một khối nội dung lớn thì Google phải tự chọn cái
 *     nào đáng xếp hạng cho truy vấn quỹ căn — và nó có thể chọn trang mình
 *     không muốn. Trang bảng hàng nên là nơi duy nhất giữ bảng.
 */
export function TomTatBangHang() {
  const d = bangHangDangMo();
  if (!d) return null;

  return (
    <>
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
    </>
  );
}
