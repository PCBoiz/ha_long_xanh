import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { SoDoKetNoi } from "@/components/site/so-do-ket-noi";
import {
  canDeTinhHieuQua,
  coHoiDauTu,
  duAn,
  ruiRoDauTu,
  type LuanDiem,
} from "@/data/project";

export const metadata: Metadata = {
  alternates: { canonical: "/dau-tu" },
  title: "Phân tích đầu tư",
  description: `Cơ hội, bằng chứng và rủi ro khi đầu tư ${duAn.ten} — nói cả hai phía, kèm căn cứ cho từng luận điểm.`,
};

/**
 * Trang phân tích đầu tư.
 *
 * ĐIỀU KHÁC BIỆT DUY NHẤT CỦA TRANG NÀY: nó có mảng rủi ro, và mảng rủi ro dài
 * hơn mảng cơ hội.
 *
 * Đó là quyết định thương mại chứ không phải quyết định đạo đức. Nhà đầu tư có
 * tiền đọc một trang chỉ toàn cơ hội thì không kết luận "dự án an toàn" mà kết
 * luận "trang này đang giấu gì". Nói ra trước, bằng chữ của mình, là cách duy
 * nhất để phần cơ hội được đọc nghiêm túc — và là thứ không đối thủ nào chịu
 * làm.
 *
 * Mảng cuối cùng biến toàn bộ sự trung thực đó thành một cuộc gọi: liệt kê
 * đúng những dữ liệu còn thiếu để tính được hiệu quả, và ai là người lấy được
 * chúng.
 */
export default function TrangDauTu() {
  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Cơ hội, và *cả* rủi ro" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body leading-relaxed text-paper-dim">
                  Mỗi luận điểm dưới đây đều kèm căn cứ. Chỗ nào chưa có căn cứ
                  thì không có luận điểm — kể cả khi nó nghe thuận tai.
                </p>
              </ClipReveal>
            </div>
          </div>
        </Khung>
      </section>

      {/* ============================== CƠ HỘI ============================== */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="font-display text-h2 font-normal">
            Điều đang ủng hộ dự án
          </h2>
          <div className="mt-10">
            <DanhSachLuanDiem muc={coHoiDauTu} sac="jade" />
          </div>
        </Khung>
      </section>

      {/* ============================== RỦI RO ==============================
          NỀN SÁNG. Đây là mảng duy nhất trên trang này đảo nền, và đó là chủ ý:
          nó buộc mắt dừng lại đúng chỗ mà mọi trang bất động sản khác lướt qua.
          Đặt rủi ro trên nền giấy cũng đổi giọng của nó — từ một lời cảnh báo
          thành một mục trong hồ sơ. */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display text-h2 font-normal text-balance">
                Điều bạn nên cân nhắc kỹ
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 md:self-end">
              <p className="text-body leading-relaxed text-paper-dim">
                Phần này có mặt vì nếu bạn không đọc ở đây thì cũng sẽ tự phát
                hiện ra sau — và phát hiện sau khi đã đặt cọc thì đắt hơn nhiều.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <DanhSachLuanDiem muc={ruiRoDauTu} sac="warn" />
          </div>
        </Khung>
      </section>

      {/* ============================ HẠ TẦNG =============================== */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display text-h2 font-normal text-balance">
                Hạ tầng quanh dự án
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 md:self-end">
              <p className="text-body leading-relaxed text-paper-dim">
                Các tuyến và cảng hàng không dưới đây đã vận hành, nên không phụ
                thuộc vào tiến độ của chính dự án.
              </p>
            </div>
          </div>
          <div className="mt-12">
            <SoDoKetNoi />
          </div>
        </Khung>
      </section>

      {/* ===================== CÒN THIẾU GÌ ĐỂ TÍNH ĐƯỢC ==================== */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Chưa đủ để tính *hiệu quả*" />
              </h2>
              <ClipReveal delay={120}>
                <p className="mt-6 max-w-md text-body leading-relaxed text-paper-dim">
                  Trang này không đưa ra con số lợi suất, vì với dữ liệu công
                  khai hiện có thì mọi con số như vậy đều là phỏng đoán. Đây là
                  những thứ phải có trong tay trước khi tính.
                </p>
                <Link href="/lien-he" className="nut nut-chinh mt-8">
                  Nhờ lấy giúp số liệu này
                </Link>
              </ClipReveal>
            </div>

            <ol className="md:col-span-6 md:col-start-7">
              {canDeTinhHieuQua.map((muc, thuTu) => (
                <li
                  key={muc}
                  className="flex items-baseline gap-5 border-b border-ink-line py-5"
                >
                  <span className="tabular shrink-0 text-label text-paper-dim">
                    {String(thuTu + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body leading-relaxed">{muc}</span>
                </li>
              ))}
            </ol>
          </div>
        </Khung>
      </section>
    </>
  );
}

/**
 * Một luận điểm: tên — nội dung — căn cứ.
 *
 * Dòng CĂN CỨ luôn hiện, không gấp lại. Đây là phần khiến trang khác với một
 * trang quảng cáo, mà giấu nó đi sau một cú bấm thì phần lớn người đọc không
 * bao giờ thấy — và trang mất đúng thứ làm nên khác biệt của mình.
 */
function DanhSachLuanDiem({
  muc,
  sac,
}: {
  muc: LuanDiem[];
  sac: "jade" | "warn";
}) {
  const mauSo = sac === "jade" ? "text-jade" : "text-warn";
  const mauVien = sac === "jade" ? "border-jade/35" : "border-warn/35";

  return (
    <ol className="border-t border-ink-line">
      {muc.map((m, thuTu) => (
        <li
          key={m.ten}
          className="grid gap-x-10 gap-y-3 border-b border-ink-line py-8 md:grid-cols-12"
        >
          <div className="flex items-baseline gap-4 md:col-span-5">
            <span className={`tabular text-label ${mauSo}`}>
              {String(thuTu + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-h3 font-normal text-balance">
              {m.ten}
            </h3>
          </div>

          <div className="md:col-span-7">
            <p className="max-w-[68ch] text-body leading-relaxed text-paper-dim">
              {m.noiDung}
            </p>
            <p
              className={`mt-4 max-w-[68ch] border-l ${mauVien} pl-5 text-small leading-relaxed text-paper-dim`}
            >
              <span className="mb-1 block text-label uppercase text-paper-dim">
                Căn cứ
              </span>
              {m.canCu}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
