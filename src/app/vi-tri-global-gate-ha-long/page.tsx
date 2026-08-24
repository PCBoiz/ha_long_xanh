import type { Metadata } from "next";
import Link from "next/link";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { ProjectImage } from "@/components/ui/project-image";
import { SoDoKetNoi } from "@/components/site/so-do-ket-noi";
import { PhanTichPhanKhu } from "@/components/site/phan-tich-phan-khu";
import { BieuDoTienIch } from "@/components/site/bieu-do-tien-ich";
import { duAn, soSanhKhuVuc, dotAnhTienDo } from "@/data/project";
import { projectImages } from "@/data/images.generated";
import { KhoiChot } from "@/components/site/khoi-chot";

export const metadata: Metadata = {
  alternates: { canonical: "/vi-tri-global-gate-ha-long" },
  title: "Vị trí & kết nối",
  description: `${duAn.ten} tại ${duAn.viTri} — cách trung tâm Hạ Long khoảng 19 km về phía đông và cách Hải Phòng khoảng 20 km về phía tây, nằm trên trục cao tốc Hà Nội – Hải Phòng – Hạ Long.`,
};

export default function TrangViTri() {
  return (
    <>
      <section className="px-6 pb-16 pt-44 md:px-10">
        <div className="mx-auto max-w-[92rem]">
          <h1 className="max-w-4xl font-display text-h1 font-normal">
            <SplitReveal text="Nằm giữa *ba* trung tâm" />
          </h1>
          <ClipReveal delay={120}>
            <p className="mt-8 max-w-xl text-lead text-paper-dim">
              {duAn.viTri} — trên trục cao tốc nối Hà Nội, Hải Phòng và vịnh Hạ
              Long, cạnh hai cảng hàng không quốc tế.
            </p>
          </ClipReveal>
        </div>
      </section>

      <section className="px-6 pb-nhip md:px-10">
        <div className="mx-auto max-w-[92rem]">
          <ClipReveal>
            <SoDoKetNoi />
          </ClipReveal>
        </div>
      </section>

      {/* Ảnh toàn cảnh để người xem hình dung địa thế, sau khi đã đọc sơ đồ. */}
      <section className="px-2 pb-nhip">
        <ClipReveal>
          <ProjectImage
            name="toan-canh-sang-som"
            alt="Địa thế dự án nhìn từ trên cao"
            sizes="100vw"
            className="h-[52vh] w-full object-cover md:h-[72vh]"
          />
        </ClipReveal>
      </section>

      {/* ═══════════ ĐƯỜNG VÀO KHU, CHỤP THẬT ═══════════
          Một sơ đồ kết nối chỉ chứng minh được rằng các địa danh nằm ở đâu.
          Nó KHÔNG chứng minh được rằng đường tới đó đang thật sự được làm — mà
          với một khu đô thị mới, đó mới là câu hỏi thật: hạ tầng có theo kịp
          nhà không.

          Hai tấm dưới đây trả lời đúng câu đó bằng ảnh có ngày tháng, và là
          thứ không sơ đồ nào thay được. */}
      <section className="border-t border-ink-line px-6 py-nhip md:px-10">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text={`Đường vào khu, *chụp ${dotAnhTienDo.nhan}*`} />
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 md:self-end">
              <p className="text-body leading-relaxed text-paper-dim">
                Sơ đồ ở trên cho biết các nơi nằm cách bao xa. Hai tấm này cho
                biết đường nối tới đó đang được làm tới đâu.
              </p>
            </div>
          </div>

          <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2">
            {(
              [
                "tien-do-0826-cau-vuot-cao-toc",
                "tien-do-0826-coc-khoan-nhoi",
              ] as const
            ).map((ten) => (
              <li key={ten}>
                <figure>
                  <ClipReveal>
                    <ProjectImage
                      name={ten}
                      sizes="(min-width: 640px) 46vw, 92vw"
                      className="aspect-3/2 w-full object-cover"
                    />
                  </ClipReveal>
                  <figcaption className="mt-3 text-small leading-relaxed text-paper-dim">
                    {projectImages[ten].alt}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[70ch] text-small leading-relaxed text-paper-dim">
            Ảnh do chủ đầu tư phát hành, dấu thời gian in trên chính ảnh.
          </p>
          {/* Tách khỏi đoạn văn thay vì để làm liên kết chen giữa dòng chữ.
              Đo được trên điện thoại: liên kết trong dòng chỉ cao 18px — dưới
              xa ngưỡng chạm 44px, nên ngón tay bấm trượt sang chữ thường. */}
          <Link
            href="/tien-do-global-gate-ha-long"
            className="link-underline mt-3 inline-flex min-h-11 items-center text-nav uppercase text-jade"
          >
            Xem đủ mười hai tấm hiện trạng
          </Link>
        </div>
      </section>

      {/* ========================= QUY MÔ TIỆN ÍCH =========================== */}
      <section className="border-t border-ink-line px-6 py-nhip md:px-10">
        <div className="mx-auto max-w-[92rem]">
          <h2 className="max-w-3xl font-display text-h1 font-normal">
            <SplitReveal text="Cái gì *lớn* tới mức nào" />
          </h2>
          <ClipReveal delay={120} className="mt-14">
            <BieuDoTienIch />
          </ClipReveal>
        </div>
      </section>

      {/* ====================== PHÂN TÍCH TỪNG VỊNH & ĐẢO ==================== */}
      <section className="border-t border-ink-line px-6 py-nhip md:px-10">
        <div className="mx-auto max-w-[92rem]">
          <h2 className="max-w-3xl font-display text-h1 font-normal">
            <SplitReveal text="Từng vịnh nằm *ở đâu*" />
          </h2>
          <ClipReveal delay={120}>
            <p className="mt-8 max-w-2xl text-lead text-paper-dim">
              Hướng và các khu liền kề dưới đây được tính từ toạ độ thật trên sơ
              đồ quy hoạch, không phải mô tả quảng cáo.
            </p>
          </ClipReveal>

          <div className="mt-16">
            <PhanTichPhanKhu />
          </div>
        </div>
      </section>

      {/* =========================== SO SÁNH KHU VỰC ========================= */}
      <section className="border-t border-ink-line px-6 py-nhip md:px-10">
        <div className="mx-auto max-w-[92rem]">
          <h2 className="max-w-3xl font-display text-h1 font-normal">
            <SplitReveal text="Vì sao chọn *nơi này*" />
          </h2>

          {soSanhKhuVuc.length === 0 ? (
            <ClipReveal delay={120}>
              <div className="mt-14 border border-ink-line bg-ink-soft px-8 py-16 text-center">
                <p className="font-display text-h3 font-normal">
                  Số liệu so sánh đang được tổng hợp
                </p>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-paper-dim">
                  So sánh giá và tiện ích với khu vực khác là tuyên bố về thị
                  trường, nên chỉ công bố khi có nguồn số liệu rõ ràng. Đội ngũ
                  tư vấn có thể gửi bạn bản phân tích chi tiết.
                </p>
                <Link
                  href="/lien-he"
                  className="mt-8 nut nut-phu"
                >
                  Nhận bản phân tích
                </Link>
              </div>
            </ClipReveal>
          ) : (
            <div className="mt-14 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-ink-line text-left">
                    <th className="py-4 pr-6 font-normal text-paper-dim">
                      Tiêu chí
                    </th>
                    <th className="py-4 pr-6 font-display text-h3 font-normal">
                      {duAn.tenNgan}
                    </th>
                    <th className="py-4 font-normal text-paper-dim">
                      Khu vực khác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {soSanhKhuVuc.map((dong) => (
                    <tr
                      key={dong.tieuChi}
                      className="border-b border-ink-line/60 align-top"
                    >
                      <th
                        scope="row"
                        className="py-5 pr-6 text-left font-normal text-paper-dim"
                      >
                        {dong.tieuChi}
                      </th>
                      <td className="tabular py-5 pr-6 text-jade">
                        {dong.noiNay}
                      </td>
                      <td className="tabular py-5 text-paper-dim">
                        {dong.khuVucKhac}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      <KhoiChot dan="Vị trí quyết định phần lớn giá trị dài hạn của một căn. Nếu bạn đang nhắm một lô cụ thể, chúng tôi đối chiếu vị trí lô đó với đơn giá các căn cạnh nó." />
    </>
  );
}
