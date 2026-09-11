import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Khung } from "@/components/ui/khung";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { dinhDangNgay } from "@/data/news";
import { docBaiViet, docMotBai } from "@/lib/tin-tuc";
import { lamSachHtml } from "@/lib/lam-sach-html";
import { noiLienKet } from "@/lib/noi-lien-ket";
import { duAn } from "@/data/project";
import { duLieuBaiViet } from "@/lib/du-lieu-bai-viet";
import { anhChoBai, chuThichAnh } from "@/lib/anh-cho-bai";
import { ProjectImage } from "@/components/ui/project-image";
import { tachAnhBia } from "@/lib/anh-bai";
import { DIA_CHI_GOC } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/tin-tuc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const bai = await docMotBai(slug);
  if (!bai) return { title: "Không tìm thấy bài viết" };
  // Bài có ảnh kèm thì ảnh đó là ảnh chia sẻ (Zalo, Facebook lấy og:image).
  const { anhBia } = tachAnhBia(bai.noiDung);
  return {
    alternates: { canonical: `/tin-tuc/${slug}` },
    title: bai.tieuDe,
    description: bai.moTa,
    openGraph: {
      title: bai.tieuDe,
      description: bai.moTa,
      type: "article",
      publishedTime: bai.ngayDang,
      locale: "vi_VN",
      ...(anhBia ? { images: [{ url: `${DIA_CHI_GOC}${anhBia.src}`, alt: anhBia.alt }] } : {}),
    },
  };
}

export default async function TrangBaiViet({
  params,
}: PageProps<"/tin-tuc/[slug]">) {
  const { slug } = await params;
  const bai = await docMotBai(slug);
  if (!bai) notFound();

  const khac = (await docBaiViet()).filter((b) => b.slug !== slug).slice(0, 3);

  return (
    <>
      <article>
        {/* Dữ liệu có cấu trúc RIÊNG cho bài này: NewsArticle, cộng FAQPage
            nếu bài có khối câu hỏi thường gặp.

            Khối dùng chung ở layout chỉ mô tả TRANG WEB và DỰ ÁN — nó không
            biết gì về bài đang mở. Nên trước đợt này, mỗi bài viết ra đời mà
            không mang theo một dòng dữ liệu máy đọc được nào: không ai biết
            đây là một bài báo, đăng ngày nào, thuộc chuyên mục gì.

            Xem `lib/du-lieu-bai-viet.ts`. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: duLieuBaiViet(bai) }}
        />
        {/* Khung `doc` chứ không phải `rong`: đây là chữ đọc liền mạch. Đo bản
            cũ ở 1440px thấy có dòng dài tới 103 ký tự — quá 75 thì mắt hay
            nhảy nhầm dòng khi xuống hàng. */}
        <section className="pb-nhip pt-36 md:pt-44">
          <Khung rong="doc">
            <Link
              href="/tin-tuc"
              className="link-underline inline-flex min-h-11 items-center text-label uppercase text-jade"
            >
              ← Tin tức
            </Link>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="text-label uppercase text-jade">
                {bai.chuyenMuc}
              </span>
              <time
                dateTime={bai.ngayDang}
                className="tabular text-small text-paper-dim"
              >
                {dinhDangNgay(bai.ngayDang)}
              </time>
            </div>

            <h1 className="mt-4 font-display text-h1 font-normal text-balance">
              {bai.tieuDe}
            </h1>
            <p className="mt-6 text-lead text-paper-dim">{bai.moTa}</p>

            {/* ẢNH ĐẦU BÀI, chọn từ kho ảnh có sẵn theo chuyên mục.

                Trước đợt này bài tự động ra đời KHÔNG CÓ ẢNH NÀO — một khối
                chữ dài hơn nghìn từ, không một chỗ nào cho mắt nghỉ. Đọc trên
                điện thoại thì đó là mấy màn hình chữ liên tiếp.

                Ảnh KHÔNG do bên gửi bài chọn và KHÔNG do AI sinh — xem lý do
                đầy đủ trong `lib/anh-cho-bai.ts`. Câu chú thích nói đúng loại:
                ảnh tiến độ là ảnh CHỤP, còn lại là PHỐI CẢNH. */}
            {/* TỪ 12/09/2026: bài có ẢNH KÈM (Antigravity chọn từ thư mục Drive
                của chủ trang — ảnh thật, không phải AI) thì dùng ảnh đó; không
                có thì vẫn chọn theo chuyên mục như trên. Xem `lib/anh-bai.ts`. */}
            {(() => {
              const { anhBia } = tachAnhBia(bai.noiDung);
              if (anhBia) {
                return (
                  <figure className="mt-10">
                    <div className="overflow-hidden rounded-sm bg-ink-soft">
                      {/* Ảnh chạy trên đĩa máy chủ, không qua kho ảnh tĩnh nên
                          không dùng `ProjectImage`/`next/image` — chúng đòi
                          kích thước hoặc danh sách host biết trước. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={anhBia.src}
                        alt={anhBia.alt}
                        className="aspect-video w-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                      />
                    </div>
                    {anhBia.alt ? (
                      <figcaption className="mt-3 text-small text-paper-dim">{anhBia.alt}</figcaption>
                    ) : null}
                  </figure>
                );
              }
              const anh = anhChoBai(bai);
              return (
                <figure className="mt-10">
                  <div className="overflow-hidden rounded-sm bg-ink-soft">
                    <ProjectImage
                      name={anh}
                      className="aspect-video w-full object-cover"
                      sizes="(min-width: 1024px) 60rem, 100vw"
                      priority
                    />
                  </div>
                  <figcaption className="mt-3 text-small text-paper-dim">
                    {chuThichAnh(anh)}
                  </figcaption>
                </figure>
              );
            })()}

            {bai.noiDung ? (
              <div
                className="bai-viet mt-12 border-t border-ink-line pt-10"
                // Đã lọc qua danh sách thẻ cho phép ở `lamSachHtml`; xem ghi chú
                // về giới hạn của bộ lọc trong chính file đó.
                //
                // NỐI LIÊN KẾT SAU KHI LỌC, không phải trước. Lọc trước thì bộ
                // lọc còn cơ hội xem xét từng thẻ do mô hình sinh ra; nối sau
                // thì những thẻ `<a>` thêm vào đây là của chính kho mã này,
                // địa chỉ lấy từ `DUONG_DAN` nên không thể trỏ sai.
                //
                // Ngược lại — nối trước rồi lọc — là tự đưa liên kết của mình
                // qua một bộ lọc thiết kế để phòng nội dung bên ngoài.
                dangerouslySetInnerHTML={{
                  // Thân bài KHÔNG gồm ảnh bìa (đã tách ra làm ảnh đầu bài ở trên).
                  __html: noiLienKet(lamSachHtml(tachAnhBia(bai.noiDung).than)),
                }}
              />
            ) : (
              <p className="mt-12 border-t border-ink-line pt-10 text-body text-paper-dim">
                Bài viết này chưa có nội dung chi tiết.
              </p>
            )}
          </Khung>
        </section>
      </article>

      {khac.length > 0 ? (
        <section className="border-t border-ink-line py-nhip">
          <Khung rong="doc">
            <h2 className="text-label uppercase text-paper-dim">Bài khác</h2>
            <ul className="mt-6 border-t border-ink-line">
              {khac.map((b, thuTu) => (
                <ClipReveal key={b.slug} delay={(thuTu % 3) * 70}>
                  <li className="border-b border-ink-line">
                    <Link
                      href={`/tin-tuc/${b.slug}`}
                      className="grid gap-2 py-6 transition-colors hover:text-jade md:grid-cols-[8rem_1fr] md:items-baseline md:gap-8"
                    >
                      <time
                        dateTime={b.ngayDang}
                        className="tabular text-small text-paper-dim"
                      >
                        {dinhDangNgay(b.ngayDang)}
                      </time>
                      <span className="font-display text-h3 font-normal">
                        {b.tieuDe}
                      </span>
                    </Link>
                  </li>
                </ClipReveal>
              ))}
            </ul>
          </Khung>
        </section>
      ) : null}

      <section className="border-t border-ink-line py-nhip">
        <Khung rong="doc">
          <p className="font-display text-h2 font-normal text-balance">
            Quan tâm tới {duAn.tenNgan}?
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/quy-can-global-gate-ha-long"
              className="nut nut-chinh"
            >
              Bảng hàng &amp; giá
            </Link>
            <Link
              href="/lien-he"
              className="nut nut-phu"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </Khung>
      </section>
    </>
  );
}
