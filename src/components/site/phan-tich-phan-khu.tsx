import Link from "next/link";
import { ProjectImage } from "@/components/ui/project-image";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { anhPhanKhu, phanKhu } from "@/data/project";

/**
 * Phân tích vị trí từng vịnh và đảo.
 *
 * Mọi nhận định ở đây được TÍNH RA từ toạ độ các khu trên sơ đồ quy hoạch —
 * hướng so với tâm dự án, và hai khu liền kề gần nhất. Không có câu nào do tôi
 * nghĩ thêm: viết "view đẹp nhất dự án" hay "vị trí đắc địa" thì nghe hay nhưng
 * là quảng cáo, và người mua không kiểm chứng được.
 *
 * Đổi toạ độ trong `data/project.ts` là phần mô tả tự đổi theo.
 */

const HUONG = [
  "phía bắc",
  "đông bắc",
  "phía đông",
  "đông nam",
  "phía nam",
  "tây nam",
  "phía tây",
  "tây bắc",
] as const;

function moTaViTri(khu: (typeof phanKhu)[number]) {
  const tamX = phanKhu.reduce((t, k) => t + k.x, 0) / phanKhu.length;
  const tamY = phanKhu.reduce((t, k) => t + k.y, 0) / phanKhu.length;

  const lechX = khu.x - tamX;
  const lechY = khu.y - tamY;
  const khoangCachTam = Math.hypot(lechX, lechY);

  // Góc quy về 8 hướng. Trục y của ảnh hướng xuống nên phải đảo dấu để "lên
  // trên trong ảnh" tương ứng với "phía bắc".
  const goc = (Math.atan2(lechX, -lechY) * 180) / Math.PI;
  const huong = HUONG[Math.round(((goc + 360) % 360) / 45) % 8];

  const lienKe = phanKhu
    .filter((k) => k.ma !== khu.ma)
    .map((k) => ({ k, d: Math.hypot(k.x - khu.x, k.y - khu.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
    .map(({ k }) => k);

  return {
    huong,
    trungTam: khoangCachTam < 18,
    lienKe,
  };
}

export function PhanTichPhanKhu() {
  return (
    <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {phanKhu.map((khu, thuTu) => {
        const viTri = moTaViTri(khu);
        const anh = anhPhanKhu(khu.ma);
        return (
          <ClipReveal key={khu.ma} delay={(thuTu % 3) * 80}>
            <article className="flex h-full flex-col">
              {anh ? (
                <Link href={`/phan-khu/${khu.ma}`} className="group block overflow-hidden">
                  <ProjectImage
                    name={anh}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="aspect-4/3 w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                </Link>
              ) : null}

              <p className="mt-5 text-label uppercase text-paper/60">
                {khu.tenTiengAnh}
              </p>
              <h3 className="mt-2 font-display text-h3 font-normal">
                <Link
                  href={`/phan-khu/${khu.ma}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-jade"
                >
                  {khu.ten}
                </Link>
              </h3>

              <dl className="mt-5 space-y-3 border-t border-ink-line pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-paper-dim">Vị trí</dt>
                  <dd className="text-right">
                    {viTri.trungTam ? "Khu vực trung tâm" : `Nằm ${viTri.huong}`}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-paper-dim">Giáp khu</dt>
                  <dd className="text-right text-paper-dim">
                    {viTri.lienKe.map((k) => k.ten).join(" · ")}
                  </dd>
                </div>
              </dl>
            </article>
          </ClipReveal>
        );
      })}
    </div>
  );
}
