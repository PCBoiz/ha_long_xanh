import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { Reveal } from "@/components/ui/reveal";
import { DangKyForm } from "@/components/site/dang-ky-form";
import { DoiNguTuVan } from "@/components/site/doi-ngu-tu-van";
import {
  buocQuyenLoi,
  duAn,
  dinhViThuongMai,
} from "@/data/project";

export const metadata: Metadata = {
  alternates: { canonical: "/voucher-vinhomes" },
  title: "Chưa có voucher Vinhomes?",
  description: `Giá niêm yết không phải số tiền cuối cùng bạn trả. Cách rà soát quyền lợi và dựng phương án thực trả khi mua ${duAn.tenNgan}.`,
};

/**
 * Trang hỗ trợ quyền lợi — nhắm tệp khách CHƯA CÓ voucher.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ TRANG NHẠY CẢM NHẤT CỦA CẢ SITE. Ranh giới chữ nghĩa nằm ở khối chú thích
 * đầu mục `buocQuyenLoi` trong `data/project.ts` — đọc trước khi sửa một chữ.
 *
 * Tóm tắt ranh giới:
 *   ĐƯỢC   nói rằng có nhiều nhóm quyền lợi, mỗi nhóm một bộ điều kiện, và
 *          chúng tôi rà soát xem bạn chạm được nhóm nào
 *   KHÔNG  hứa chắc có voucher · nói giá thấp nhất · nhắc nguồn voucher ·
 *          mô tả bất kỳ cách thu xếp nội bộ nào
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * VÌ SAO TRANG NÀY TỒN TẠI: bảng quỹ căn có ô tính voucher, nhưng ô đó chỉ phục
 * vụ người ĐÃ CÓ voucher trong tay. Người chưa có — tệp lớn hơn nhiều — nhìn
 * vào bảng giá và dừng lại ở con số niêm yết, tưởng đó là số cuối cùng.
 *
 * Không trang đối thủ nào nói với tệp này. Họ đăng giá rồi thôi.
 */
export default function TrangHoTroQuyenLoi() {
  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Chưa có voucher Vin? Đừng vội chỉ nhìn vào *giá niêm yết*" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body leading-relaxed text-paper-dim">
                  Giá niêm yết là điểm bắt đầu của phép tính, không phải kết
                  quả. Số tiền bạn thật sự chuyển đi phụ thuộc vào những điều
                  kiện mà chính bạn cũng chưa chắc biết mình có.
                </p>
              </ClipReveal>
            </div>
          </div>
        </Khung>
      </section>

      {/* ═══════════ ĐOẠN TRẢ LỜI THẲNG ═══════════
          Đặt ngay sau tiêu đề và viết thành một đoạn trọn vẹn.

          Hai lý do. Với người đọc: họ vào đây mang đúng một câu hỏi, trả lời
          ngay là tôn trọng họ. Với trợ lý AI: đoạn định nghĩa đứng liền sau
          tiêu đề là dạng văn bản dễ được trích lại nhất, và "chưa có voucher
          thì mua Vinhomes thế nào" là câu có người hỏi thật. */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-h2 font-normal text-balance">
                Không có voucher thì mua thế nào
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="max-w-[68ch] text-lead leading-relaxed">
                Vẫn mua bình thường. Voucher chỉ là một trong nhiều nhóm quyền
                lợi trong một chương trình bán hàng, và mỗi nhóm có bộ điều kiện
                riêng — theo cách thanh toán, theo thời điểm, theo dòng sản phẩm,
                theo tình trạng của chính người mua.
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Việc đáng làm không phải là đi tìm voucher, mà là{" "}
                <strong className="text-paper">
                  biết trường hợp của mình đủ điều kiện những nhóm nào
                </strong>{" "}
                rồi tính ra con số thực trả cho từng phương án. Hai người mua
                cùng một căn, cùng một ngày, có thể chuyển đi hai số tiền khác
                nhau chỉ vì chọn tiến độ thanh toán khác nhau.
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Đó là phép tính mất khoảng một cuộc gọi, và không tốn gì.
              </p>
            </div>
          </div>
        </Khung>
      </section>

      {/* ═══════════ NĂM BƯỚC ═══════════ */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display text-h1 font-normal text-balance">
                {dinhViThuongMai.chinh}
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 md:self-end">
              <p className="text-body leading-relaxed text-paper-dim">
                {dinhViThuongMai.phu}
              </p>
            </div>
          </div>

          <ol className="mt-14 border-t border-ink-line">
            {buocQuyenLoi.map((buoc, thuTu) => (
              <li
                key={buoc.ten}
                className="grid gap-x-10 gap-y-3 border-b border-ink-line py-8 md:grid-cols-12"
              >
                <div className="flex items-baseline gap-4 md:col-span-5">
                  <span className="tabular text-label text-jade">
                    {String(thuTu + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-h3 font-normal text-balance">
                    {buoc.ten}
                  </h3>
                </div>
                <p className="max-w-[68ch] text-body leading-relaxed text-paper-dim md:col-span-7">
                  {buoc.moTa}
                </p>
              </li>
            ))}
          </ol>
        </Khung>
      </section>

      {/* ⚠️ KHỐI "NHỮNG ĐIỀU CHÚNG TÔI KHÔNG HỨA" ĐÃ GỠ. ĐỪNG DỰNG LẠI.

          Ý đồ ban đầu đúng: nói trước mình không làm được gì thì phần nói mình
          làm được sẽ đáng tin hơn. Trên giấy đó là một nước cờ khôn.

          Nhưng đọc trên trang thì nó chiếm trọn một màn hình để nói toàn chữ
          KHÔNG — không hứa, không có, không thúc. Người đang cân nhắc xuống vài
          tỷ đọc xong không nhớ mình được gì, chỉ nhớ một danh sách phủ định. Và
          một trang tự bào chữa trước khi bị ai hỏi thì nghe như đang phòng thủ.

          Những ranh giới đó VẪN GIỮ NGUYÊN, chỉ đổi chỗ nói: chúng nằm trong
          hàng rào nội dung (`lib/cong-chan.ts`) chặn thật ở cấp mã, và trong
          từng câu cụ thể nơi nó có nghĩa — chứ không gom thành một bảng tuyên
          ngôn. Giữ lời hứa bằng cách làm đúng thì mạnh hơn bằng cách kể ra. */}

      <DoiNguTuVan />

      {/* ═══════════ CTA TRỌNG TÂM ═══════════ */}
      <section
        id="nhan-phuong-an"
        className="scroll-mt-24 border-t border-ink-line py-nhip"
      >
        <Khung>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Nhận *phương án thực trả*" />
              </h2>
              <ClipReveal delay={120}>
                <p className="mt-6 max-w-md text-body leading-relaxed text-paper-dim">
                  Cho biết bạn đang cân nhắc dòng nào và dự định thanh toán ra
                  sao. Bạn sẽ nhận lại vài phương án đặt cạnh nhau, mỗi phương
                  án một con số thực trả — kèm điều kiện áp dụng của từng cái.
                </p>
                <p className="mt-4 max-w-md text-small leading-relaxed text-paper-dim">
                  Không tốn phí, và không cần bạn quyết gì sau đó.
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
          <p className="text-label uppercase text-paper-dim">Đọc tiếp</p>
          <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-3">
            {[
              {
                ten: "Giá thực trả",
                mo: "Sáu việc cần kiểm trước khi đặt cọc.",
                href: "/gia-thuc-tra-global-gate-ha-long",
              },
              {
                ten: "Quỹ căn & giá",
                mo: "Bảng hàng thật, giá từng căn, kèm giờ cập nhật.",
                href: "/quy-can-global-gate-ha-long",
              },
              {
                ten: "Chính sách bán hàng",
                mo: "Cấu trúc một chính sách và cách đối chiếu.",
                href: "/chinh-sach-global-gate-ha-long",
              },
            ].map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group border-t border-ink-line pt-5"
              >
                <span className="block font-display text-h3 font-normal transition-colors group-hover:text-jade">
                  {m.ten}
                </span>
                <span className="mt-2 block text-small leading-relaxed text-paper-dim">
                  {m.mo}
                </span>
              </Link>
            ))}
          </div>
        </Khung>
      </section>
    </>
  );
}
