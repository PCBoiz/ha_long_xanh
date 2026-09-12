import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { SoLieuDongSanPham } from "@/components/site/so-lieu-dong-san-pham";
import { ClipReveal, Parallax } from "@/components/motion/scroll-effects";
import { duAn, dongSanPham, taiLieu, duongDanDrive } from "@/data/project";
import { projectImages } from "@/data/images.generated";

// Năm trang dòng sản phẩm, sinh thẳng từ `data/project.ts`.
//
// Mọi dòng thông số CHỈ hiện khi có số thật. Với bất động sản, một con số bịa
// để "cho đầy trang" là rủi ro pháp lý chứ không phải chuyện trình bày.

export function generateStaticParams() {
  return dongSanPham.map((dong) => ({ ma: dong.ma }));
}

export async function generateMetadata({
  params,
}: PageProps<"/san-pham/[ma]">): Promise<Metadata> {
  const { ma } = await params;
  const dong = dongSanPham.find((muc) => muc.ma === ma);
  if (!dong) return {};
  return {
    alternates: { canonical: `/san-pham/${ma}` },
    title: dong.ten,
    description: `${dong.ten} tại ${duAn.ten}. ${dong.moTa}`,
  };
}

export default async function TrangSanPham({
  params,
}: PageProps<"/san-pham/[ma]">) {
  const { ma } = await params;
  const dong = dongSanPham.find((muc) => muc.ma === ma);
  if (!dong) notFound();

  const matBang = taiLieu.find((muc) => muc.ten === "Mặt bằng căn");
  const khac = dongSanPham.filter((muc) => muc.ma !== ma);

  const thongSo = [
    { nhan: "Diện tích", giaTri: dong.dienTich ? `${dong.dienTich} m²` : null },
    { nhan: "Số tầng", giaTri: dong.soTang ?? null },
    { nhan: "Khoảng giá", giaTri: dong.khoangGia ?? null },
    { nhan: "Pháp lý", giaTri: duAn.phapLy },
  ].filter((muc) => muc.giaTri);

  return (
    <>
      <section className="relative h-[70svh] overflow-hidden">
        <Parallax cuong={12} phongTo className="absolute inset-0">
          <ProjectImage
            name={dong.anh}
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </Parallax>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20"
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-10">
          <div className="mx-auto max-w-[92rem]">
            <Link
              href="/quy-can-global-gate-ha-long"
              className="link-underline inline-flex min-h-11 items-center text-label uppercase text-jade"
            >
              ← Bảng hàng &amp; giá
            </Link>
            <h1 className="mt-6 max-w-4xl font-display text-h1 font-normal">
              <SplitReveal text={dong.ten} stagger={90} />
            </h1>
          </div>
        </div>
      </section>

      <section className="px-6 py-nhip md:px-10">
        <div className="mx-auto grid max-w-[92rem] gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <ClipReveal>
              <p className="text-lead text-paper-dim">{dong.moTa}</p>
            </ClipReveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            {/* Chỉ MỘT lớp <div> giữa <dl> và <dt>/<dd> — ClipReveal đã là lớp
                đó (xem ghi chú cùng chỗ ở trang /du-an). */}
            <dl>
              {thongSo.map((muc, i) => (
                <ClipReveal
                  key={muc.nhan}
                  delay={i * 70}
                  className="flex items-baseline justify-between gap-6 border-b border-ink-line py-6"
                >
                  <dt className="text-sm text-paper-dim">{muc.nhan}</dt>
                  <dd className="tabular text-lead">{muc.giaTri}</dd>
                </ClipReveal>
              ))}
            </dl>

            {process.env.NODE_ENV !== "production" && dong.canXacNhan ? (
              <p className="mt-4 text-xs text-jade">
                ⚠ thông số cần xác nhận với bảng hàng chính thức
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/lien-he"
                className="nut nut-chinh"
              >
                Nhận bảng giá
              </Link>
              {matBang ? (
                <a
                  href={duongDanDrive(matBang)}
                  target="_blank"
                  rel="noreferrer"
                  className="nut nut-phu"
                >
                  Xem mặt bằng căn
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Mặt bằng — chỉ hiện khi có bản vẽ thật cho dòng này. */}
      {/* SỐ LIỆU THẬT, đặt NGAY SAU phần giới thiệu và TRƯỚC mặt bằng.

          Đo ngày 09/09/2026: năm trang /san-pham/* chỉ có 338–365 từ — một
          tấm ảnh lớn, một câu mô tả, một dòng diện tích, hết. Người mở trang
          "Nhà liền kề" xong vẫn không biết còn bao nhiêu căn, xây bao nhiêu
          mét, bàn giao mức nào. Toàn bộ những câu đó đã có sẵn câu trả lời
          trong bảng hàng, chỉ là chưa ai đưa lên.

          Đặt trước mặt bằng vì thứ tự câu hỏi của người mua là: còn hàng
          không → bao nhiêu tiền → rồi mới tới nhà trông thế nào. */}
      <SoLieuDongSanPham ma={ma} />

      {dong.matBang && dong.matBang.length > 0 ? (
        <section className="border-t border-ink-line px-6 py-nhip md:px-10">
          <div className="mx-auto max-w-[92rem]">
            <h2 className="max-w-2xl font-display text-h2 font-normal">
              Bản vẽ từng mẫu
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {dong.matBang.map((ten, i) => (
                <ClipReveal key={ten} delay={i * 90}>
                  <figure>
                    {/* Nền sáng: bản vẽ kỹ thuật là nét đen trên nền trắng, đặt
                        lên nền tối của trang thì gần như không đọc được. */}
                    <div className="bg-paper p-4">
                      <ProjectImage
                        name={ten}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="w-full object-contain"
                      />
                    </div>
                    <figcaption className="mt-4 text-sm text-paper-dim">
                      {projectImages[ten].alt}
                    </figcaption>
                  </figure>
                </ClipReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-ink-line px-6 py-nhip md:px-10">
        <div className="mx-auto max-w-[92rem]">
          <p className="text-label uppercase text-jade">Dòng khác</p>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {khac.map((muc, i) => (
              <ClipReveal key={muc.ma} delay={(i % 4) * 80}>
                <Link href={`/san-pham/${muc.ma}`} className="group block">
                  <div className="overflow-hidden bg-ink-soft">
                    <ProjectImage
                      name={muc.anh}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="aspect-4/3 w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-5 font-display text-h3 font-normal transition-colors group-hover:text-jade">
                    {muc.ten}
                  </p>
                </Link>
              </ClipReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
