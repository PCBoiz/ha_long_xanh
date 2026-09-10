import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { Reveal } from "@/components/ui/reveal";
import { SoDoPhanKhu } from "@/components/site/so-do-phan-khu";
import { anhPhanKhu, duAn, phanKhu } from "@/data/project";

export const metadata: Metadata = {
  alternates: { canonical: "/quy-hoach" },
  title: "Mặt bằng & quy hoạch phân khu",
  description: `Sơ đồ quy hoạch ${duAn.ten}: chín vịnh và đảo, vị trí từng phân khu và điểm nhấn của mỗi khu.`,
};

/**
 * Trang quy hoạch.
 *
 * Sơ đồ tương tác trước đây nằm giữa trang chủ sau cái neo `/#so-do`. Đó là
 * thứ giữ chân lâu nhất của trang mà lại không có địa chỉ riêng để gửi cho
 * khách, không lên được kết quả tìm kiếm, và không quay lại được bằng nút Back.
 * Tách ra đây rồi thì trang chủ chỉ giới thiệu bốn khu tiêu biểu và dẫn sang.
 */
export default function TrangQuyHoach() {
  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Chín vịnh và đảo, *một* đô thị" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body text-paper-dim">
                  Bấm vào từng điểm trên sơ đồ để xem phân khu đó có gì. Toạ độ
                  các điểm đặt theo sơ đồ tổng mặt bằng của chủ đầu tư.
                </p>
              </ClipReveal>
            </div>
          </div>

          <ClipReveal delay={180} className="mt-12">
            <SoDoPhanKhu />
          </ClipReveal>
        </Khung>
      </section>

      {/* ===================== DANH SÁCH ĐẦY ĐỦ CHÍN PHÂN KHU ==================
          Sơ đồ là cách xem theo VỊ TRÍ; danh sách này là cách xem theo NỘI DUNG.
          Hai cách đọc khác nhau cho cùng một tập dữ liệu — người tìm "khu nào
          có sân golf" không muốn phải rê chuột khắp bản đồ để dò. */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="font-display text-h1 font-normal text-balance">
            <SplitReveal text="Từng khu *có gì*" />
          </h2>

          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {phanKhu.map((khu, thuTu) => {
              const anh = anhPhanKhu(khu.ma);
              return (
                <Reveal key={khu.ma} delay={(thuTu % 3) * 80}>
                  <article className="group flex h-full flex-col">
                    <Link href={`/phan-khu/${khu.ma}`} className="flex h-full flex-col">
                      {anh ? (
                        <div className="overflow-hidden bg-ink-soft">
                          <ProjectImage
                            name={anh}
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="aspect-4/3 w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                          />
                        </div>
                      ) : null}

                      <h3 className="mt-5 font-display text-h3 font-normal transition-colors group-hover:text-jade">
                        {khu.ten}
                      </h3>
                      <p className="mt-1 text-label uppercase text-paper-dim">
                        {khu.tenTiengAnh}
                      </p>

                      <ul className="mt-4 flex-1 space-y-2 border-t border-ink-line pt-4">
                        {khu.diemNhan.map((diem) => (
                          <li
                            key={diem}
                            className="flex gap-3 text-small leading-relaxed text-paper-dim"
                          >
                            <span aria-hidden="true" className="text-jade">
                              ·
                            </span>
                            {diem}
                          </li>
                        ))}
                      </ul>
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Khung>
      </section>

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-12 md:items-end">
            <p className="font-display text-h2 font-normal md:col-span-7">
              Muốn biết từng vịnh nằm ở đâu so với nhau?
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-4 md:col-start-9">
              <Link
                href="/vi-tri-global-gate-ha-long"
                className="nut nut-chinh"
              >
                Phân tích vị trí
              </Link>
              <Link
                href="/tien-ich"
                className="nut nut-phu"
              >
                Tiện ích
              </Link>
            </div>
          </div>
        </Khung>
      </section>
    </>
  );
}
