import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { Reveal } from "@/components/ui/reveal";
import { DangKyForm } from "@/components/site/dang-ky-form";
import { DoiNguTuVan } from "@/components/site/doi-ngu-tu-van";
import { buocGiaThucTra, dinhViGiaThucTra, duAn } from "@/data/project";

export const metadata: Metadata = {
  alternates: { canonical: "/gia-thuc-tra-global-gate-ha-long" },
  title: "Giá thực trả",
  description: `Sáu bước kiểm tra trước khi đặt cọc ${duAn.tenNgan}: đối chiếu quỹ căn, xác nhận chính sách, rà soát quyền lợi và tính ra số tiền thật sự phải trả.`,
};

/**
 * Trang "Giá thực trả".
 *
 * Đây là trang bán hàng mạnh nhất của cả site, và nó không chứa một con số giá
 * nào — vì thứ nó bán không phải giá mà là VIỆC KIỂM TRA giá.
 *
 * Cách viết ở đây cố ý ngược với thói quen của ngành: không nói mình giỏi, chỉ
 * mô tả sáu việc cụ thể và hậu quả của việc bỏ qua từng việc. Người đọc tự rút
 * ra kết luận, và kết luận tự rút ra thì bền hơn kết luận được bảo.
 *
 * Trang này cũng là đích của mục "Kiểm giá thực trả" trên dải quyết định nhanh
 * và của nút chính trong mảng cùng tên ở trang chủ.
 */
export default function TrangGiaThucTra() {
  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Mua *đúng căn* quan trọng hơn mua nhanh" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body leading-relaxed text-paper-dim">
                  {dinhViGiaThucTra.phu}
                </p>
              </ClipReveal>
            </div>
          </div>
        </Khung>
      </section>

      {/* ====================== GIÁ THỰC TRẢ LÀ GÌ ==========================
          Định nghĩa đặt lên đầu và viết thành một đoạn trả lời trọn vẹn.

          Hai lý do. Với người đọc: phần lớn khách chưa từng nghe cụm này, mà
          không hiểu tên thì không quan tâm nội dung. Với trợ lý AI: một đoạn
          định nghĩa đứng ngay sau tiêu đề là dạng văn bản dễ được trích lại
          nhất — và câu "giá thực trả là gì" thì có người hỏi thật. */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-h2 font-normal text-balance">
                Giá thực trả là gì
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="max-w-[68ch] text-lead leading-relaxed">
                Giá thực trả là số tiền bạn thật sự chuyển đi để sở hữu một căn,
                sau khi trừ mọi quyền lợi bạn đủ điều kiện nhận và cộng lại các
                khoản đi kèm.
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Nó khác giá niêm yết, và thường khác không ít. Hai căn cùng giá
                niêm yết có thể chênh nhau đáng kể về giá thực trả, tuỳ chính
                sách đang áp dụng, tiến độ đóng tiền bạn chọn và những quyền lợi
                bạn đủ điều kiện. So sánh bằng giá niêm yết vì thế có thể dẫn
                tới kết luận ngược với thực tế.
              </p>
            </div>
          </div>
        </Khung>
      </section>

      {/* ========================== SÁU BƯỚC ================================ */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="max-w-3xl font-display text-h1 font-normal text-balance">
            Sáu việc cần làm trước khi đặt cọc
          </h2>

          <ol className="mt-12 border-t border-ink-line">
            {buocGiaThucTra.map((buoc, thuTu) => (
              <li
                key={buoc.ten}
                className="grid gap-x-10 gap-y-4 border-b border-ink-line py-9 md:grid-cols-12"
              >
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span className="tabular text-label text-jade">
                    {String(thuTu + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-h3 font-normal text-balance">
                    {buoc.ten}
                  </h3>
                </div>

                <p className="text-body leading-relaxed text-paper-dim md:col-span-4">
                  {buoc.moTa}
                </p>

                <p className="border-l border-warn/40 pl-5 text-small leading-relaxed text-paper-dim md:col-span-4">
                  <span className="mb-1 block text-label uppercase text-warn">
                    Nếu bỏ qua
                  </span>
                  {buoc.neuBoQua}
                </p>
              </li>
            ))}
          </ol>
        </Khung>
      </section>

      {/* ====================== ĐIỀU CHÚNG TÔI KHÔNG HỨA ====================
          Mảng này trông như tự bắn vào chân mình. Thực ra ngược lại: nó là mảng
          làm cho mọi lời hứa còn lại đáng tin. Một bên nói rõ mình KHÔNG làm
          được gì là bên có thể tin ở những chỗ họ nói mình làm được. */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h2 font-normal text-balance">
                Điều chúng tôi không hứa
              </h2>
            </div>
            <ul className="md:col-span-6 md:col-start-7">
              {[
                "Không hứa giá rẻ nhất thị trường. Giá do chủ đầu tư quyết, không do bên bán nào quyết.",
                "Không hứa mức lợi nhuận. Không ai dự báo được thị trường vài năm tới, kể cả người nói rất chắc chắn.",
                "Không hứa giữ căn khi chưa có xác nhận. Quỹ căn đổi theo ngày, và giữ chỗ phải theo đúng quy trình của chủ đầu tư.",
                "Không thúc bạn quyết trong hôm nay. Một căn phù hợp bị bỏ lỡ còn rẻ hơn một căn không phù hợp đã mua.",
              ].map((cau) => (
                <li
                  key={cau}
                  className="border-b border-ink-line py-5 text-body leading-relaxed text-paper-dim"
                >
                  {cau}
                </li>
              ))}
            </ul>
          </div>
        </Khung>
      </section>

      <DoiNguTuVan />

      {/* ============================== ĐĂNG KÝ ============================= */}
      <section
        id="ra-soat"
        className="scroll-mt-24 border-t border-ink-line py-nhip"
      >
        <Khung>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Nhờ rà soát *phương án* của bạn" />
              </h2>
              <ClipReveal delay={120}>
                <p className="mt-6 max-w-md text-body leading-relaxed text-paper-dim">
                  Đang cân nhắc vài căn, hoặc vừa nhận một bảng chào giá từ đâu
                  đó? Gửi lại đây, sáu bước ở trên sẽ được làm trên đúng phương
                  án bạn đang có.
                </p>
              </ClipReveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={160}>
                <DangKyForm />
              </Reveal>
            </div>
          </div>
        </Khung>
      </section>

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/quy-can-global-gate-ha-long" className="nut nut-phu">
              Xem những gì đã công bố
            </Link>
            <Link href="/dau-tu" className="nut nut-phu">
              Phân tích đầu tư
            </Link>
          </div>
        </Khung>
      </section>
    </>
  );
}
