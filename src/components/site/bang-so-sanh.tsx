import Link from "next/link";
import { dongSanPham, tienDoThanhToan } from "@/data/project";

/**
 * Bảng đặt các dòng sản phẩm cạnh nhau.
 *
 * Ô nào chưa có số thì in dấu gạch, KHÔNG bịa. Người mua bất động sản đọc bảng
 * so sánh để ra quyết định — một con số sai ở đây đắt hơn nhiều so với một ô
 * trống.
 */
export function BangSoSanh() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[42rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink-line text-left">
            <th className="py-4 pr-6 font-normal text-paper-dim">Tiêu chí</th>
            {dongSanPham.map((dong) => (
              <th
                key={dong.ma}
                className="py-4 pr-6 font-display text-h3 font-normal"
              >
                {dong.ten}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <HangSoSanh
            nhan="Diện tích"
            lay={(d) => (d.dienTich ? `${d.dienTich} m²` : null)}
          />
          <HangSoSanh nhan="Số tầng" lay={(d) => d.soTang ?? null} />
          <HangSoSanh nhan="Khoảng giá" lay={(d) => d.khoangGia ?? null} />
          <HangSoSanh nhan="Phù hợp với" lay={(d) => d.moTa} />
        </tbody>
      </table>
    </div>
  );
}

function HangSoSanh({
  nhan,
  lay,
}: {
  nhan: string;
  lay: (dong: (typeof dongSanPham)[number]) => string | null;
}) {
  return (
    <tr className="border-b border-ink-line/60 align-top">
      <th scope="row" className="py-5 pr-6 text-left font-normal text-paper-dim">
        {nhan}
      </th>
      {dongSanPham.map((dong) => {
        const giaTri = lay(dong);
        return (
          <td key={dong.ma} className="tabular py-5 pr-6">
            {giaTri ?? <span className="text-paper/30">—</span>}
          </td>
        );
      })}
    </tr>
  );
}

/**
 * Tiến độ thanh toán theo đợt.
 *
 * `tienDoThanhToan` đang rỗng cho tới khi có chính sách bán hàng chính thức —
 * tỉ lệ đóng tiền sai là chuyện pháp lý, không phải chuyện trình bày.
 */
export function TienDoThanhToan() {
  if (tienDoThanhToan.length === 0) {
    return (
      <div className="border border-ink-line bg-ink-soft px-8 py-14 text-center">
        <p className="font-display text-h3 font-normal">
          Chính sách bán hàng đang được cập nhật
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper-dim">
          Tiến độ thanh toán, chương trình vay và ưu đãi thay đổi theo từng đợt
          mở bán. Đăng ký để nhận bản đang áp dụng.
        </p>
        <Link
          href="/lien-he"
          className="mt-8 nut nut-phu"
        >
          Nhận chính sách
        </Link>
      </div>
    );
  }

  return (
    <ol className="border-t border-ink-line">
      {tienDoThanhToan.map((dot, thuTu) => (
        <li
          key={dot.ten}
          className="grid gap-2 border-b border-ink-line py-6 sm:grid-cols-[3rem_1fr_8rem_1fr] sm:items-baseline sm:gap-6"
        >
          <span className="tabular text-label text-jade">
            {String(thuTu + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-h3 font-normal">{dot.ten}</span>
          <span className="tabular text-lead">{dot.tyLe}</span>
          <span className="text-sm text-paper-dim">{dot.moc}</span>
        </li>
      ))}
    </ol>
  );
}
