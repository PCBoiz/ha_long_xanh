"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectImage } from "@/components/ui/project-image";
import { Reveal } from "@/components/ui/reveal";
import { Tilt } from "@/components/motion/scroll-effects";
import { dongSanPham } from "@/data/project";

/**
 * Danh sách dòng sản phẩm kèm bộ lọc nhanh.
 *
 * Nguyên tắc: mỗi dòng thông số CHỈ hiện khi có số thật trong `data/project.ts`.
 * Với bất động sản, một con số bịa để "cho đủ thẻ" là rủi ro pháp lý chứ không
 * phải chuyện trình bày — nên thà thẻ trống một dòng còn hơn.
 */
export function DanhSachSanPham() {
  const [loc, setLoc] = useState<string | null>(null);
  const hienThi = loc ? dongSanPham.filter((d) => d.ma === loc) : dongSanPham;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <ChipLoc dang={loc === null} onClick={() => setLoc(null)}>
          Tất cả
        </ChipLoc>
        {dongSanPham.map((dong) => (
          <ChipLoc
            key={dong.ma}
            dang={loc === dong.ma}
            onClick={() => setLoc(loc === dong.ma ? null : dong.ma)}
          >
            {dong.ten}
          </ChipLoc>
        ))}
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {hienThi.map((dong, thuTu) => (
          <Reveal key={dong.ma} delay={(thuTu % 3) * 90}>
            <article className="group flex h-full flex-col">
              <Tilt nghieng={6}>
                <div className="overflow-hidden bg-ink-soft">
                  <ProjectImage
                    name={dong.anh}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="aspect-4/3 w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </Tilt>

              <h3 className="mt-6 font-display text-h3 font-normal">{dong.ten}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                {dong.moTa}
              </p>

              <dl className="mt-6 space-y-2.5 border-t border-ink-line pt-5 text-sm">
                <Dong nhan="Diện tích" giaTri={dong.dienTich} donVi="m²" />
                <Dong nhan="Số tầng" giaTri={dong.soTang} />
                <Dong nhan="Khoảng giá" giaTri={dong.khoangGia} />
              </dl>

              {/* Nhắc việc chỉ hiện khi chạy máy dev — người xem thật không thấy. */}
              {process.env.NODE_ENV !== "production" && dong.canXacNhan ? (
                <p className="mt-3 text-xs text-jade">
                  ⚠ thông số cần xác nhận với bảng hàng chính thức
                </p>
              ) : null}

              <Link
                href="/lien-he"
                className="mt-auto inline-block pt-7 text-label uppercase text-jade transition-colors hover:text-paper"
              >
                Nhận bảng giá →
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ChipLoc({
  dang,
  onClick,
  children,
}: {
  dang: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={dang}
      className={`inline-flex min-h-11 items-center border px-5 text-label uppercase transition-colors ${
        dang
          ? "border-paper bg-paper text-ink"
          : "border-ink-line text-paper/65 hover:border-paper/50 hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}

/** Một dòng thông số. Không có giá trị thì không vẽ gì cả. */
function Dong({
  nhan,
  giaTri,
  donVi,
}: {
  nhan: string;
  giaTri?: string;
  donVi?: string;
}) {
  if (!giaTri) return null;
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-paper-dim">{nhan}</dt>
      <dd className="tabular text-paper">
        {giaTri}
        {donVi ? ` ${donVi}` : ""}
      </dd>
    </div>
  );
}
