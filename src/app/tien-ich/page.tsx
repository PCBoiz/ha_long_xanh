import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { Reveal } from "@/components/ui/reveal";
import { BieuDoTienIch } from "@/components/site/bieu-do-tien-ich";
import { duAn, hangMucTienIch } from "@/data/project";
import type { ProjectImageName } from "@/data/images.generated";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich" },
  title: "Tiện ích",
  description: `Hệ tiện ích của ${duAn.ten}: sân golf, biển Lagoon, công viên rừng, VinWonders và các hạng mục lớn khác, kèm diện tích công bố.`,
};

/**
 * Ảnh minh hoạ cho phần tiện ích.
 *
 * CHỈ ghép ảnh vào hạng mục khi ảnh thật sự chụp hạng mục đó. Năm tấm
 * `tien-ich-*` là các khu chủ đề trong công viên giải trí, nên chúng minh hoạ
 * cho VinWonders — không phải cho sân golf hay rừng ngập mặn. Ghép bừa thì
 * khách xem ảnh Cổng Babylon rồi tưởng đó là công viên rừng.
 */
const anhMinhHoa: { anh: ProjectImageName; chu: string }[] = [
  { anh: "tien-ich-01", chu: "Quảng trường rạp xiếc lúc chiều buông" },
  { anh: "tien-ich-03", chu: "Khu chủ đề Ai Cập" },
  { anh: "tien-ich-05", chu: "Cổng Babylon" },
  { anh: "view-san-golf", chu: "Quần thể sân golf ven vịnh" },
];

export default function TrangTienIch() {
  const tong = hangMucTienIch.reduce((s, m) => s + m.dienTich, 0);

  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Cái gì *lớn* tới mức nào" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body text-paper-dim">
                  Mười hai hạng mục dưới đây cộng lại khoảng{" "}
                  <span className="tabular text-paper">
                    {tong.toLocaleString("vi-VN")} ha
                  </span>
                  . Số liệu đọc từ sơ đồ tổng mặt bằng chính thức; các danh xưng
                  so sánh là tuyên bố của chủ đầu tư in trên bản vẽ.
                </p>
              </ClipReveal>
            </div>
          </div>

          <ClipReveal delay={180} className="mt-12">
            <BieuDoTienIch />
          </ClipReveal>
        </Khung>
      </section>

      {/* ============================ ẢNH MINH HOẠ ============================ */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="font-display text-h2 font-normal">
            Trong công viên chủ đề
          </h2>
          <p className="mt-3 max-w-xl text-body text-paper-dim">
            Bốn khung cảnh chụp ở tầm mắt người đi bộ — thứ mà phối cảnh nhìn từ
            trên cao không cho thấy.
          </p>

          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {anhMinhHoa.map((muc, thuTu) => (
              <Reveal key={muc.anh} delay={(thuTu % 4) * 80}>
                <figure>
                  <div className="overflow-hidden bg-ink-soft">
                    <ProjectImage
                      name={muc.anh}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-3/4 w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-small text-paper-dim">
                    {muc.chu}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Khung>
      </section>

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-12 md:items-end">
            <p className="font-display text-h2 font-normal md:col-span-7">
              Tiện ích nào gần căn của bạn nhất còn tuỳ phân khu.
            </p>
            {/* Cột NĂM phần chứ không phải bốn: cột bốn phần ở khổ 768px chỉ
                rộng 210px, mà nút bên trong rộng 251px — nút tràn khỏi mép
                trang 14px. Đo bằng `scripts/audit.mjs`, không phải đoán. */}
            <div className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8">
              <Link href="/quy-hoach" className="nut nut-chinh">
                Xem sơ đồ quy hoạch
              </Link>
            </div>
          </div>
        </Khung>
      </section>
    </>
  );
}
