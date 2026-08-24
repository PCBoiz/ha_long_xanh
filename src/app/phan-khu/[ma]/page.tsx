import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { anhPhanKhu, duAn, phanKhu } from "@/data/project";

// Chín trang phân khu sinh thẳng từ `data/project.ts`. Thêm một phân khu vào
// mảng đó là có ngay một trang mới — không phải đụng vào file này.
//
// Trang KHÔNG gán ảnh phối cảnh riêng cho từng khu: bộ ảnh chủ đầu tư gửi không
// ghi rõ ảnh nào chụp khu nào, gán bừa là nói sai với người mua. Thay vào đó,
// trang chỉ đúng vị trí khu đó trên sơ đồ quy hoạch thật — vừa trung thực, vừa
// trả lời đúng câu hỏi đầu tiên của khách: "nó nằm ở đâu?".

export function generateStaticParams() {
  return phanKhu.map((khu) => ({ ma: khu.ma }));
}

export async function generateMetadata({
  params,
}: PageProps<"/phan-khu/[ma]">): Promise<Metadata> {
  const { ma } = await params;
  const khu = phanKhu.find((muc) => muc.ma === ma);
  if (!khu) return {};
  return {
    alternates: { canonical: `/phan-khu/${ma}` },
    title: `${khu.ten} (${khu.tenTiengAnh})`,
    description: `${khu.ten} — phân khu thuộc ${duAn.ten}. ${khu.diemNhan[0] ?? ""}`,
  };
}

export default async function TrangPhanKhu({
  params,
}: PageProps<"/phan-khu/[ma]">) {
  const { ma } = await params;
  const khu = phanKhu.find((muc) => muc.ma === ma);
  if (!khu) notFound();

  const anhKhu = anhPhanKhu(khu.ma);
  const thuTu = phanKhu.findIndex((muc) => muc.ma === ma);
  const truoc = phanKhu[(thuTu - 1 + phanKhu.length) % phanKhu.length];
  const sau = phanKhu[(thuTu + 1) % phanKhu.length];

  return (
    <>
      <section className="px-6 pb-16 pt-44 md:px-10">
        <div className="mx-auto max-w-[92rem]">
          {/* Trỏ sang trang quy hoạch thật, không phải cái neo `/#so-do` cũ —
              sơ đồ đã chuyển khỏi trang chủ nên neo đó nay không dẫn tới đâu. */}
          <Link
            href="/quy-hoach"
            className="link-underline inline-flex min-h-11 items-center text-label uppercase text-jade"
          >
            ← Sơ đồ quy hoạch
          </Link>
          <p className="mt-10 text-label uppercase text-paper/40">
            {khu.tenTiengAnh}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-display font-normal">
            <SplitReveal text={khu.ten} stagger={90} />
          </h1>
        </div>
      </section>

      {/* Cận cảnh khu này, cắt từ sơ đồ quy hoạch — bên cạnh là vị trí của nó
          trong toàn cảnh, để người xem hiểu cả "trông ra sao" lẫn "nằm ở đâu". */}
      <section className="px-6 md:px-10">
        <div className="mx-auto grid max-w-[92rem] gap-6 lg:grid-cols-5">
          {anhKhu ? (
            <ClipReveal className="lg:col-span-2">
              <ProjectImage
                name={anhKhu}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
          ) : null}

          <ClipReveal delay={120} className={anhKhu ? "lg:col-span-3" : "lg:col-span-5"}>
            <div className="relative overflow-hidden bg-ink-soft">
              <ProjectImage
                name="tmb-ban-do"
                alt={`Vị trí ${khu.ten} trong toàn cảnh quy hoạch`}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="w-full object-cover opacity-70"
              />
              <span
                aria-hidden="true"
                style={{ left: `${khu.x}%`, top: `${khu.y}%` }}
                className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center"
              >
                <span className="absolute size-8 animate-ping rounded-full bg-jade/40 motion-reduce:animate-none" />
                <span className="relative size-4 rounded-full border-2 border-paper bg-jade" />
              </span>
            </div>
          </ClipReveal>
        </div>
      </section>

      <section className="px-6 py-nhip md:px-10">
        <div className="mx-auto grid max-w-[92rem] gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <h2 className="text-label uppercase text-jade">Điểm nhấn</h2>
          </div>
          <ul className="md:col-span-8 md:col-start-5">
            {khu.diemNhan.map((diem, i) => (
              <ClipReveal key={diem} delay={i * 90}>
                <li className="flex gap-6 border-b border-ink-line py-7">
                  <span className="tabular text-label text-jade">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-h3 font-normal">{diem}</span>
                </li>
              </ClipReveal>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-20 max-w-[92rem]">
          <div className="flex flex-wrap items-center gap-4 border-t border-ink-line pt-10">
            <Link
              href="/lien-he"
              className="nut nut-chinh"
            >
              Nhận bảng giá khu này
            </Link>
            <Link
              href="/quy-can-global-gate-ha-long"
              className="nut nut-phu"
            >
              Xem dòng sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Điều hướng vòng tròn giữa chín khu — không có ngõ cụt. */}
      <section className="border-t border-ink-line px-6 py-16 md:px-10">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-6">
          <Link href={`/phan-khu/${truoc.ma}`} className="group max-w-[45%]">
            <span className="text-label uppercase text-paper/40">Khu trước</span>
            <span className="mt-2 block font-display text-h3 font-normal transition-colors group-hover:text-jade">
              ← {truoc.ten}
            </span>
          </Link>
          <Link
            href={`/phan-khu/${sau.ma}`}
            className="group max-w-[45%] text-right"
          >
            <span className="text-label uppercase text-paper/40">Khu tiếp</span>
            <span className="mt-2 block font-display text-h3 font-normal transition-colors group-hover:text-jade">
              {sau.ten} →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
