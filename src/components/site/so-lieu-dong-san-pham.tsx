import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { TuoiDuLieu } from "@/components/ui/tuoi-du-lieu";
import { DUONG_DAN } from "@/lib/duong-dan";
import { soLieuDong } from "@/lib/so-lieu-dong";

const so = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
const ty = (n: number) =>
  (n / 1e9).toLocaleString("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const trieu = (n: number) => Math.round(n / 1e6).toLocaleString("vi-VN");

function Hang({ nhan, children }: { nhan: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-ink-line py-4">
      <dt className="text-small text-paper-dim">{nhan}</dt>
      <dd className="tabular text-right text-h4 text-paper">{children}</dd>
    </div>
  );
}

/**
 * Bảng số liệu thật cho một dòng sản phẩm.
 *
 * MỌI CON SỐ ĐỌC TỪ `quy-can.generated.json` — không có bản chép tay nào để
 * lệch, và tự đúng lại sau mỗi lần chạy `npm run gop-bang-hang`.
 *
 * ⚠️ DÒNG CHƯA MỞ BÁN THÌ NÓI THẲNG LÀ CHƯA. Vẽ một bảng rỗng trông như trang
 * hỏng, và người đọc sẽ nghĩ mình bấm nhầm chứ không nghĩ là chưa có hàng.
 */
export function SoLieuDongSanPham({ ma }: { ma: string }) {
  const d = soLieuDong(ma);

  if (!d) {
    return (
      <section className="border-t border-ink-line py-nhip">
        <Khung rong="doc">
          <h2 className="font-display text-h2 font-normal">Chưa mở bán</h2>
          <p className="mt-4 max-w-[60ch] text-body leading-relaxed text-paper-dim">
            Dòng này chưa có căn nào trong bảng hàng đang mở. Hai tiểu khu đang
            bán là Vịnh Bình Minh 1 và Thiên Đường Nhiệt Đới 1; các phân khu còn
            lại chưa tới đợt.
          </p>
          <Link
            href={DUONG_DAN.lienHe}
            className="link-underline mt-6 inline-flex min-h-11 items-center text-nav uppercase text-jade"
          >
            Nhờ tôi báo khi mở bán
          </Link>
        </Khung>
      </section>
    );
  }

  return (
    <section className="border-t border-ink-line py-nhip">
      <Khung rong="doc">
        <h2 className="font-display text-h2 font-normal">
          Dòng này trong bảng hàng
        </h2>
        <p className="mt-3 text-small text-paper-dim">
          Đọc từ bảng hàng đang mở bán
          <TuoiDuLieu moc={d.docLuc} />. Số căn đổi theo ngày — hỏi lại trước khi
          quyết vẫn là việc nên làm.
        </p>

        <dl className="mt-8 border-t border-ink-line">
          <Hang nhan="Căn còn hàng">{d.soCan}</Hang>
          {d.dtDat ? (
            <Hang nhan="Diện tích đất">
              {so(d.dtDat.nhoNhat)} – {so(d.dtDat.lonNhat)} m²
            </Hang>
          ) : null}
          {d.dtXd ? (
            <Hang nhan="Diện tích xây dựng">
              {so(d.dtXd.nhoNhat)} – {so(d.dtXd.lonNhat)} m²
            </Hang>
          ) : null}
          {d.gia ? (
            <Hang nhan="Giá đầy đủ, gồm thuế và phí bảo trì">
              {ty(d.gia.nhoNhat)} – {ty(d.gia.lonNhat)} tỷ
            </Hang>
          ) : null}
          {d.donGiaDat ? (
            <Hang nhan="Đơn giá đất">
              {trieu(d.donGiaDat.nhoNhat)} – {trieu(d.donGiaDat.lonNhat)} triệu/m²
            </Hang>
          ) : null}
          {d.banGiao.length > 0 ? (
            <Hang nhan="Mức bàn giao đang có">
              {d.banGiao.map((b) => `${b.ten} (${b.so})`).join(" · ")}
            </Hang>
          ) : null}
          {d.tieuKhu.length > 0 ? (
            <Hang nhan="Tiểu khu">
              {d.tieuKhu.map((t) => `${t.ten} (${t.so})`).join(" · ")}
            </Hang>
          ) : null}
          {d.bienThe.length > 0 ? (
            <Hang nhan="Biến thể vị trí">
              {d.bienThe.map((b) => `${b.ten} (${b.so})`).join(" · ")}
            </Hang>
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
      </Khung>
    </section>
  );
}
