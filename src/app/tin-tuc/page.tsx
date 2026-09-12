import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { dinhDangNgay } from "@/data/news";
import { docBaiViet } from "@/lib/tin-tuc";
import { tachAnhBia } from "@/lib/anh-bai";
import { duAn } from "@/data/project";

export const metadata: Metadata = {
  alternates: { canonical: "/tin-tuc" },
  title: "Tin tức & tiến độ",
  description: `Tiến độ xây dựng, chính sách bán hàng và sự kiện mới nhất của ${duAn.ten}.`,
};

// Danh sách bài đọc từ `docBaiViet()` chứ không phải từ mảng tĩnh: đó là nơi
// bài do Antigravity đẩy sang qua `/api/ingest` được ghi xuống. Trước đây trang
// này đọc thẳng mảng rỗng trong `data/news.ts`, nên đường ống có chạy thành
// công thì trang vẫn hiện "chưa có bài viết nào" — hỏng im lặng đúng kiểu khó
// tìm nhất.
export const dynamic = "force-dynamic";

export default async function TrangTinTuc() {
  const bai = await docBaiViet();
  const noiBat = bai[0];
  const conLai = bai.slice(1);

  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Tiến độ và *chính sách* mới nhất" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body text-paper-dim">
                  Cập nhật tiến độ thi công, chính sách bán hàng và sự kiện tại
                  dự án.
                </p>
              </ClipReveal>
            </div>
          </div>

          {bai.length === 0 ? (
            <ClipReveal delay={160}>
              <div className="mt-12 border border-ink-line bg-ink-soft px-8 py-16 text-center">
                <p className="font-display text-h3 font-normal">
                  Chưa có bài viết nào
                </p>
                <p className="mx-auto mt-4 max-w-lg text-body leading-relaxed text-paper-dim">
                  Mục này được cập nhật tự động khi hệ thống đăng bài đi vào hoạt
                  động. Trong lúc chờ, bạn có thể để lại thông tin để nhận tiến
                  độ và chính sách qua điện thoại.
                </p>
                <Link
                  href="/lien-he"
                  className="mt-8 nut nut-phu"
                >
                  Đăng ký nhận tin
                </Link>
              </div>
            </ClipReveal>
          ) : null}

          {/* Bài mới nhất đặt to hơn hẳn: danh sách mà mọi dòng cùng cỡ thì
              không có điểm vào, mắt phải đọc từ trên xuống mới biết bắt đầu ở
              đâu. */}
          {noiBat ? (
            <ClipReveal delay={160}>
              <article className="mt-12 border-t border-ink-line pt-8">
                <Link href={`/tin-tuc/${noiBat.slug}`} className="group block">
                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                    <span className="text-label uppercase text-jade">
                      {noiBat.chuyenMuc}
                    </span>
                    <time
                      dateTime={noiBat.ngayDang}
                      className="tabular text-small text-paper-dim"
                    >
                      {dinhDangNgay(noiBat.ngayDang)}
                    </time>
                    <span className="text-label uppercase text-paper-dim">
                      Mới nhất
                    </span>
                  </div>
                  <h2 className="mt-4 max-w-4xl font-display text-h1 font-normal text-balance transition-colors group-hover:text-jade">
                    {noiBat.tieuDe}
                  </h2>
                  <p className="mt-4 max-w-2xl text-lead text-paper-dim">
                    {noiBat.moTa}
                  </p>
                  {/* CHỈ bài nổi bật mới có ảnh, và chỉ khi bài có ảnh kèm (từ
                      Drive của chủ trang, 12/09). Danh sách phía dưới giữ dạng
                      chữ — đây là danh mục để lướt, không phải trang tạp chí. */}
                  {(() => {
                    const { anhBia } = tachAnhBia(noiBat.noiDung);
                    if (!anhBia) return null;
                    return (
                      <span className="mt-8 block max-w-4xl overflow-hidden rounded-sm bg-ink-soft">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={anhBia.src}
                          alt={anhBia.alt}
                          className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          loading="eager"
                        />
                      </span>
                    );
                  })()}
                </Link>
              </article>
            </ClipReveal>
          ) : null}
        </Khung>
      </section>

      {conLai.length > 0 ? (
        <section className="border-t border-ink-line py-nhip">
          <Khung>
            <ul className="border-t border-ink-line">
              {conLai.map((b, thuTu) => (
                <ClipReveal key={b.slug} delay={(thuTu % 4) * 70}>
                  <li className="border-b border-ink-line">
                    <Link
                      href={`/tin-tuc/${b.slug}`}
                      className="grid gap-2 py-7 transition-colors hover:text-jade md:grid-cols-[8rem_1fr_9rem] md:items-baseline md:gap-8"
                    >
                      <time
                        dateTime={b.ngayDang}
                        className="tabular text-small text-paper-dim"
                      >
                        {dinhDangNgay(b.ngayDang)}
                      </time>
                      <span>
                        <span className="block font-display text-h3 font-normal">
                          {b.tieuDe}
                        </span>
                        <span className="mt-1.5 block max-w-2xl text-small leading-relaxed text-paper-dim">
                          {b.moTa}
                        </span>
                      </span>
                      <span className="text-label uppercase text-jade md:text-right">
                        {b.chuyenMuc}
                      </span>
                    </Link>
                  </li>
                </ClipReveal>
              ))}
            </ul>
          </Khung>
        </section>
      ) : null}
    </>
  );
}
