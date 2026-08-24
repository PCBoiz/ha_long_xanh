import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { Reveal } from "@/components/ui/reveal";
import { DangKyForm } from "@/components/site/dang-ky-form";
import { DoiNguTuVan } from "@/components/site/doi-ngu-tu-van";
import { duAn, lienHe } from "@/data/project";

export const metadata: Metadata = {
  alternates: { canonical: "/lien-he" },
  title: "Liên hệ",
  description: `Liên hệ đội ngũ tư vấn ${duAn.ten} tại ${duAn.viTri}.`,
};

/**
 * Trang liên hệ.
 *
 * Trước đây biểu mẫu chỉ nằm ở cuối trang chủ, sau 12.000px cuộn. Khách được
 * ai đó gửi cho đường dẫn thì không có chỗ nào để đến thẳng, và tư vấn viên
 * cũng không có một địa chỉ ngắn để dán vào tin nhắn.
 *
 * Số điện thoại và Zalo TỰ ẨN chừng nào `lienHe` trong `data/project.ts` còn
 * trống — hiện đúng như vậy. Dựng sẵn một số giả để trang trông đầy đủ là cách
 * chắc chắn nhất để mất một khách thật đang muốn gọi.
 */
export default function TrangLienHe() {
  const coKenhTrucTiep = Boolean(lienHe.hotline || lienHe.zalo);

  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Nói chuyện với *người thật*" />
              </h1>
              <ClipReveal delay={120}>
                <p className="mt-6 max-w-md text-body text-paper-dim">
                  Để lại thông tin, đội ngũ tư vấn sẽ liên hệ trong giờ làm việc
                  và gửi bạn bảng hàng, chính sách bán hàng cùng tiến độ đang áp
                  dụng.
                </p>

                <dl className="mt-10 space-y-6 border-t border-ink-line pt-8">
                  <div>
                    <dt className="text-label uppercase text-paper-dim">
                      Dự án
                    </dt>
                    <dd className="mt-1.5 text-h4">{duAn.ten}</dd>
                  </div>
                  <div>
                    <dt className="text-label uppercase text-paper-dim">
                      Vị trí
                    </dt>
                    <dd className="mt-1.5 text-h4">{duAn.viTri}</dd>
                  </div>
                  <div>
                    <dt className="text-label uppercase text-paper-dim">
                      Chủ đầu tư
                    </dt>
                    <dd className="mt-1.5 text-h4">{duAn.chuDauTu}</dd>
                  </div>
                  <div>
                    <dt className="text-label uppercase text-paper-dim">
                      Tình trạng
                    </dt>
                    <dd className="mt-1.5 text-h4">{duAn.tinhTrang}</dd>
                  </div>
                </dl>

                {coKenhTrucTiep ? (
                  <div className="mt-10 flex flex-wrap gap-3 border-t border-ink-line pt-8">
                    {lienHe.hotline ? (
                      <a
                        href={`tel:${lienHe.hotline.replace(/\s/g, "")}`}
                        data-do="goi"
                        data-do-chi-tiet="trang-lien-he"
                        className="nut nut-chinh"
                      >
                        Gọi {lienHe.hotline}
                      </a>
                    ) : null}
                    {lienHe.zalo ? (
                      <a
                        // LỖI ĐÃ SỬA: chỗ này từng đặt thẳng `lienHe.zalo` vào
                        // `href`, tức là dựng ra `href="0941 328 658"` — một
                        // liên kết chết, có cả dấu cách. Bấm vào thì trình duyệt
                        // đi tìm một trang tương đối tên "0941 328 658".
                        //
                        // Lỗi này ẩn suốt vì hai ô liên hệ trước đây đều TRỐNG,
                        // nên khối tự ẩn và không ai bấm được để phát hiện. Điền
                        // số vào là nó hiện ra ngay — kiểu lỗi chỉ lộ đúng lúc
                        // tính năng bắt đầu có người dùng.
                        href={`https://zalo.me/${lienHe.zalo.replace(/\D/g, "")}`}
                        data-do="zalo"
                        data-do-chi-tiet="trang-lien-he"
                        target="_blank"
                        rel="noreferrer"
                        className="nut nut-phu"
                      >
                        Nhắn Zalo
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </ClipReveal>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={140}>
                <DangKyForm />
              </Reveal>
            </div>
          </div>
        </Khung>
      </section>

      {/* Người tư vấn đặt SAU biểu mẫu ở riêng trang này: khách đã chủ động vào
          trang liên hệ thì biểu mẫu là thứ họ tới để dùng, không nên đẩy nó
          xuống. Mảng người tư vấn ở đây là đường thứ hai cho ai muốn gọi thẳng.
          Tự ẩn khi chưa điền — xem `doiNguTuVan` trong `data/project.ts`. */}
      <DoiNguTuVan />

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <p className="text-label uppercase text-paper-dim">
            Trong lúc chờ liên hệ
          </p>
          <div className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-3">
            {[
              {
                ten: "Sơ đồ quy hoạch",
                mo: "Chín vịnh và đảo, bấm từng điểm để xem khu đó có gì.",
                href: "/quy-hoach",
              },
              {
                ten: "Bảng hàng & giá",
                mo: "Diện tích theo dòng sản phẩm và tiến độ thanh toán.",
                href: "/quy-can-global-gate-ha-long",
              },
              {
                ten: "Hồ sơ dự án",
                mo: "Pháp lý, tiến độ thi công và bộ tài liệu công bố.",
                href: "/du-an",
              },
            ].map((muc) => (
              <Link
                key={muc.href}
                href={muc.href}
                className="group border-t border-ink-line pt-5"
              >
                <span className="block font-display text-h3 font-normal transition-colors group-hover:text-jade">
                  {muc.ten}
                </span>
                <span className="mt-2 block text-small leading-relaxed text-paper-dim">
                  {muc.mo}
                </span>
              </Link>
            ))}
          </div>
        </Khung>
      </section>
    </>
  );
}
