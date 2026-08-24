import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { DUONG_DAN } from "@/lib/duong-dan";
import { gioNgayVN } from "@/lib/thoi-gian";
import quyCan from "@/data/quy-can.generated.json";

/**
 * Quỹ căn và giá — bản xem trước trên trang chủ.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * KHỐI NÀY TỒN TẠI VÌ MỘT LÝ DO DUY NHẤT: CHỨNG MINH RẰNG TRANG CÓ SỐ THẬT
 *
 * Người vào một trang bất động sản đã quen với việc không tìm thấy giá. Họ
 * cuộn, thấy phối cảnh, thấy "liên hệ để nhận báo giá", rồi đi. Nên câu quan
 * trọng nhất trang chủ phải nói KHÔNG phải là "dự án đẹp" mà là "ở đây có số,
 * xem được ngay, không cần để lại gì".
 *
 * Bốn con số dưới đây làm đúng việc đó trong một màn hình: bao nhiêu căn, giá
 * trải từ đâu tới đâu, đọc lúc nào. Dấu thời gian là phần thuyết phục nhất —
 * nó nói rằng đây là dữ liệu sống, không phải một trang tĩnh viết từ năm ngoái.
 *
 * ⚠️ KHÔNG in bảng ba mươi hai dòng ở đây. Trang chủ chỉ cần chứng minh là có
 * số; xem chi tiết là việc của trang quỹ căn. Nhồi cả bảng vào đây vừa dài vừa
 * làm hai trang trùng nội dung.
 *
 * MỌI SỐ TÍNH TỪ `quy-can.generated.json`, không chép tay.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function QuyCanXemTruoc() {
  const gia = quyCan.can.map((c) => c.giaGomVat);
  const reNhat = Math.min(...gia);
  const datNhat = Math.max(...gia);
  const capNhat = new Date(quyCan.docLuc);

  const ty = (n: number) =>
    (n / 1e9).toLocaleString("vi-VN", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  return (
    <section className="mang-sang py-nhip">
      <Khung>
        <div className="grid gap-x-16 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-display text-h1 font-normal text-balance">
              Quỹ căn và giá, xem được ngay
            </h2>
            <p className="mt-5 max-w-md text-body leading-relaxed text-paper-dim">
              Không cần để lại số điện thoại. Bảng đọc thẳng từ file bảng hàng
              của chủ đầu tư, có giờ cập nhật, và ghi rõ đâu là giá trước thuế
              đâu là giá đầy đủ.
            </p>
            <p className="tabular mt-5 text-small text-paper-dim">
              Đọc lúc {gioNgayVN(capNhat)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href={DUONG_DAN.quyCan} className="nut nut-chinh">
                Xem bảng quỹ căn
              </Link>
              <Link
                href={DUONG_DAN.gia}
                className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
              >
                Khoảng giá từng dòng
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 md:col-span-6 md:col-start-7 md:self-center">
            <div>
              <dt className="text-label uppercase text-jade">Căn đang có</dt>
              <dd className="tabular mt-2 font-display text-display font-normal leading-none">
                {quyCan.tongSoCan}
              </dd>
            </div>
            <div>
              <dt className="text-label uppercase text-jade">Dòng sản phẩm</dt>
              <dd className="tabular mt-2 font-display text-display font-normal leading-none">
                {quyCan.theoLoaiHinh.length}
              </dd>
            </div>
            <div className="col-span-2 border-t border-ink-line pt-7">
              <dt className="text-label uppercase text-jade">
                Giá đầy đủ, đã gồm VAT + phí bảo trì
              </dt>
              <dd className="tabular mt-2 font-display text-h1 font-normal">
                {ty(reNhat)} – {ty(datNhat)}
                <span className="ml-2 text-body text-paper-dim">tỷ</span>
              </dd>
            </div>
          </dl>
        </div>
      </Khung>
    </section>
  );
}
