import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { ProjectImage } from "@/components/ui/project-image";
import { duAn, thongDiepChot } from "@/data/project";
import { DUONG_DAN } from "@/lib/duong-dan";
import { gioNgayVN } from "@/lib/thoi-gian";
import quyCan from "@/data/quy-can.generated.json";

export const metadata: Metadata = {
  alternates: { canonical: DUONG_DAN.gia },
  title: "Giá bao nhiêu",
  description: `Giá ${duAn.ten} đọc từ bảng hàng thật: khoảng giá theo từng dòng sản phẩm, chênh lệch giữa giá trước thuế và giá đầy đủ, và đơn giá trên mỗi mét vuông đất — con số duy nhất so sánh ngang được hai căn khác diện tích.`,
};

/**
 * Trang "giá bao nhiêu".
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * TRANG NÀY KHÁC TRANG QUỸ CĂN THẾ NÀO, VÀ VÌ SAO PHẢI TÁCH RA
 *
 * Hai câu hỏi khác nhau, dù cùng nói về tiền:
 *
 *   "Giá bao nhiêu"  → người đang tìm hiểu, chưa chọn căn. Họ cần một KHOẢNG,
 *                      và cần biết con số ấy nghĩa là gì.
 *   "Còn căn nào"    → người đã quyết mua, đang chọn. Họ cần BẢNG, bộ lọc, và
 *                      mã căn cụ thể.
 *
 * Nhồi cả hai vào một trang thì người thứ nhất bị ném thẳng vào bảng ba mươi
 * hai dòng, còn người thứ hai phải cuộn qua ba màn hình giải thích. Tách ra,
 * mỗi trang trả lời trọn một câu và cả hai đều ngắn hơn.
 *
 * ⚠️ CHỐNG TRÙNG NỘI DUNG: trang này KHÔNG in lại bảng ba mươi hai dòng. Nó chỉ
 * có số TỔNG HỢP tính từ chính bảng đó, rồi dẫn sang. Hai trang gần giống nhau
 * là cách nhanh nhất để công cụ tìm kiếm chọn nhầm trang và dìm cả hai.
 *
 * MỌI SỐ Ở ĐÂY ĐỀU TÍNH TỪ `quy-can.generated.json`, không chép tay. Bảng hàng
 * đổi thì trang này đổi theo — không có chuyện trang giá nói một đằng, bảng
 * hàng nói một nẻo.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function TrangGia() {
  const capNhat = new Date(quyCan.docLuc);

  /** Khoảng giá đầy đủ theo từng dòng sản phẩm, tính từ chính bảng hàng. */
  const theoDong = quyCan.theoLoaiHinh.map((loai) => {
    const cua = quyCan.can.filter((c) => c.loaiHinh === loai.ten);
    const gia = cua.map((c) => c.giaGomVat);
    const dat = cua.map((c) => c.dtDat);
    return {
      ten: loai.ten,
      so: loai.so,
      thapNhat: Math.min(...gia),
      caoNhat: Math.max(...gia),
      datNhoNhat: Math.min(...dat),
      datLonNhat: Math.max(...dat),
      donGia: quyCan.donGiaDat[loai.ten as keyof typeof quyCan.donGiaDat],
    };
  });

  const reNhat = Math.min(...quyCan.can.map((c) => c.giaGomVat));
  const datNhat = Math.max(...quyCan.can.map((c) => c.giaGomVat));

  // Chênh lệch trung bình giữa hai cột giá, tính bằng phần trăm. Đây là con số
  // trả lời đúng câu "vì sao chỗ khác báo giá thấp hơn".
  const chenhVat =
    (quyCan.can.reduce((t, c) => t + (c.giaGomVat / c.giaTruocVat - 1), 0) /
      quyCan.can.length) *
    100;

  const ty = (n: number) =>
    (n / 1e9).toLocaleString("vi-VN", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  const trieu = (n: number) => Math.round(n / 1e6).toLocaleString("vi-VN");

  return (
    <>
      <section className="pb-nhip-nho pt-32 md:pb-nhip md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Giá *bao nhiêu*" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body leading-relaxed text-paper-dim">
                  Số dưới đây đọc từ bảng hàng do chủ đầu tư phát hành, không
                  phải khoảng giá lan truyền. Kèm dấu thời gian và cách đọc.
                </p>
              </ClipReveal>
            </div>
          </div>
        </Khung>
      </section>

      {/* ═══════════ CÂU TRẢ LỜI THẲNG, NGAY MÀN HÌNH ĐẦU ═══════════
          Người gõ "giá bao nhiêu" muốn một con số, không muốn một bài giảng.
          Đưa khoảng giá ra trước, giải thích sau — thứ tự ngược lại là cách
          chắc chắn nhất để họ bấm quay lại. */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-h2 font-normal text-balance">
                Quỹ căn đang mở bán
              </h2>
              <p className="tabular mt-4 text-small text-paper-dim">
                {quyCan.tongSoCan} căn · đọc lúc {gioNgayVN(capNhat)}
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="text-lead leading-relaxed">
                Toàn bộ quỹ căn hiện có trải từ{" "}
                <strong className="tabular text-paper">{ty(reNhat)} tỷ</strong>{" "}
                tới{" "}
                <strong className="tabular text-paper">{ty(datNhat)} tỷ</strong>
                , tính theo giá đầy đủ — đã gồm thuế giá trị gia tăng và phí bảo
                trì.
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Đây là con số của những căn ĐANG CÓ, không phải khoảng giá của cả
                dự án. Căn có người giữ chỗ là rời khỏi bảng, nên khoảng này đổi
                theo ngày.
              </p>
            </div>
          </div>
        </Khung>
      </section>

      {/* ═══════════ THEO TỪNG DÒNG SẢN PHẨM ═══════════ */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="max-w-3xl font-display text-h1 font-normal text-balance">
            Khoảng giá theo từng dòng
          </h2>

          <ul className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
            {theoDong.map((d) => (
              <li
                key={d.ten}
                className="border border-ink-line bg-ink-soft p-6 md:p-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-h2 font-normal">{d.ten}</h3>
                  <span className="tabular text-small text-paper-dim">
                    {d.so} căn
                  </span>
                </div>

                <p className="tabular mt-6 font-display text-h1 font-normal text-jade">
                  {ty(d.thapNhat)} – {ty(d.caoNhat)}
                  <span className="ml-2 text-body text-paper-dim">tỷ</span>
                </p>
                <p className="mt-1 text-small text-paper-dim">
                  giá đầy đủ, đã gồm VAT + phí bảo trì
                </p>

                <dl className="mt-6 space-y-2 border-t border-ink-line pt-5 text-small">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-paper-dim">Diện tích đất</dt>
                    <dd className="tabular">
                      {d.datNhoNhat} – {d.datLonNhat} m²
                    </dd>
                  </div>
                  {d.donGia ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-paper-dim">Đơn giá đất</dt>
                      <dd className="tabular text-jade">
                        {trieu(d.donGia.nhoNhat)} – {trieu(d.donGia.lonNhat)}{" "}
                        triệu/m²
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[70ch] text-small leading-relaxed text-paper-dim">
            Đơn giá đất so sánh công bằng giữa các căn <em>cùng một dòng</em>.
            So ngang giữa hai dòng thì phải cẩn thận — liền kề xây nhiều tầng
            trên nền đất nhỏ, song lập thì ngược lại, nên đơn giá đất của liền kề
            tự nhiên cao hơn mà không có nghĩa là đắt hơn.
          </p>
        </Khung>
      </section>

      <section className="px-2 pb-nhip">
        <ClipReveal>
          <ProjectImage
            name="tien-do-0826-ha-tang-hoan-thien"
            sizes="100vw"
            className="h-[36vh] w-full object-cover md:h-[52vh]"
          />
        </ClipReveal>
      </section>

      {/* ═══════════ VÌ SAO CHỖ KHÁC BÁO GIÁ KHÁC ═══════════
          Đây là mảng đáng giá nhất trang, vì nó trả lời đúng câu người mua tự
          hỏi sau khi xem ba trang khác nhau và thấy ba con số khác nhau. */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h2 font-normal text-balance">
                Vì sao mỗi nơi báo một giá khác nhau
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className="max-w-[68ch] text-lead leading-relaxed">
                Vì phần lớn trang không ghi con số của họ là giá nào.
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Một căn có hai mức giá hợp lệ cùng lúc:{" "}
                <strong className="text-paper">giá trước thuế</strong> và{" "}
                <strong className="text-paper">
                  giá đầy đủ đã gồm thuế giá trị gia tăng cộng phí bảo trì
                </strong>
                . Đo trên chính bảng hàng này, hai mức chênh nhau trung bình{" "}
                <strong className="tabular text-paper">
                  {chenhVat.toFixed(1)}%
                </strong>
                .
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Với một căn mười tỷ, đó là hơn một tỷ đồng. Nên hai con số đọc
                được ở hai nơi có thể đều đúng mà vẫn không so sánh được với
                nhau — trừ khi biết mỗi con số thuộc cột nào.
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Bảng quỹ căn của trang này ghi{" "}
                <strong className="text-paper">
                  cả hai cột, có nhãn rõ ràng
                </strong>
                , cho từng căn một.
              </p>
              <Link href={DUONG_DAN.quyCan} className="nut nut-chinh mt-8">
                Xem bảng quỹ căn
              </Link>
            </div>
          </div>
        </Khung>
      </section>

      {/* ═══════════ GIÁ NIÊM YẾT ≠ SỐ TIỀN BẠN TRẢ ═══════════ */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Giá niêm yết chưa phải *số tiền bạn trả*" />
              </h2>
              <p className="mt-6 max-w-lg text-lead leading-relaxed text-jade">
                {thongDiepChot.cungMotCan}
              </p>
              <p className="mt-5 max-w-lg text-body leading-relaxed text-paper-dim">
                Chính sách bán hàng, tiến độ thanh toán chọn theo, và các nhóm
                quyền lợi mà riêng người đó chạm tới đều ăn vào con số cuối cùng.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link href={DUONG_DAN.lienHe} className="nut nut-chinh">
                  {thongDiepChot.nutChinh}
                </Link>
                <Link
                  href={DUONG_DAN.giaThucTra}
                  className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
                >
                  Giá thực trả gồm những gì
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 md:col-start-8">
              <p className="text-label uppercase text-jade">Đọc thêm</p>
              <ul className="mt-5 border-t border-ink-line">
                {[
                  {
                    nhan: "Chính sách bán hàng gồm những nhóm nào",
                    href: DUONG_DAN.chinhSach,
                  },
                  {
                    nhan: "Chưa có voucher Vinhomes thì mua thế nào",
                    href: DUONG_DAN.voucher,
                  },
                  {
                    nhan: "Căn nào giữ được giá trị",
                    href: DUONG_DAN.giaTriTaiSan,
                  },
                ].map((m) => (
                  <li key={m.href} className="border-b border-ink-line">
                    <Link
                      href={m.href}
                      className="link-underline flex min-h-14 items-center text-body text-paper-dim"
                    >
                      {m.nhan}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Khung>
      </section>
    </>
  );
}
