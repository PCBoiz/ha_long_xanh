import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { Reveal } from "@/components/ui/reveal";
import { DangKyForm } from "@/components/site/dang-ky-form";
import { duAn, tienDoThanhToan } from "@/data/project";

export const metadata: Metadata = {
  alternates: { canonical: "/chinh-sach-global-gate-ha-long" },
  title: "Chính sách bán hàng 2026",
  description: `Một chính sách bán hàng ${duAn.tenNgan} gồm những phần nào, phần nào ảnh hưởng tới số tiền bạn trả, và cách đối chiếu trước khi đặt cọc.`,
};

/**
 * Trang chính sách bán hàng.
 *
 * ⚠️ `tienDoThanhToan` ĐANG RỖNG — chưa có chính sách chính thức để đăng.
 *
 * Cách xử lý ở đây là điểm đáng chú ý nhất của trang: thay vì dựng một trang
 * trống rồi mời để lại số, trang dạy người đọc CÁCH ĐỌC một chính sách. Kiến
 * thức đó đúng bất kể chính sách nào đang áp dụng, nên trang có giá trị ngay cả
 * khi ô dữ liệu còn trống — và nó tự đầy lên khi có số.
 *
 * Đây cũng là cách duy nhất để một trang "chính sách" chưa có chính sách vẫn
 * trả lời được đúng câu người ta gõ vào ô tìm kiếm.
 */

interface PhanChinhSach {
  ten: string;
  moTa: string;
  anhHuong: string;
}

/**
 * Sáu nhóm dưới đây KHÔNG phải kiến thức chung, mà đọc ra từ bảng chính sách
 * bán hàng đang áp dụng của chủ đầu tư.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ RANH GIỚI: NÓI CẤU TRÚC, KHÔNG NÓI CON SỐ. Đây là chỉ đạo của chủ trang
 * và phải giữ nguyên khi cập nhật trang này.
 *
 * ĐƯỢC nói: có những nhóm ưu đãi nào tồn tại, chúng ăn vào đâu, phải hỏi gì
 * để không hụt. Đó là thứ giúp người mua đọc được bất kỳ bảng chính sách nào
 * đưa cho họ, và không phụ thuộc vào đợt bán nào.
 *
 * KHÔNG được viết ở đây, dù có trong tay: phần trăm chiết khấu, mức hỗ trợ lãi
 * suất, thời hạn cụ thể, giá trị quà tặng, trần voucher, nguồn voucher, cách
 * gộp người, hay bất kỳ cơ chế thương mại nội bộ nào. KHÔNG hứa chắc có
 * voucher. KHÔNG viết "giá thấp nhất". KHÔNG viết "chiết khấu bí mật".
 *
 * Lý do nằm ở chính bản chất của những con số đó: chúng có cửa sổ hiệu lực vài
 * tuần và khác nhau theo từng khách. Một trang tĩnh đăng chúng lên thì hoặc là
 * lạc hậu, hoặc là hứa cho người này thứ chỉ đúng với người kia — cả hai đều
 * tệ hơn là không đăng.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const PHAN: PhanChinhSach[] = [
  {
    ten: "Chính sách chia theo loại quỹ, không dùng chung",
    moTa: "Quỹ xây thô và quỹ giãn xây đi theo một bộ chính sách; quỹ đã hoàn thiện đi theo một bộ khác hẳn — khác cả về nhóm ưu đãi lẫn cách tính tiến độ.",
    anhHuong:
      "Đây là chỗ sai nhiều nhất khi tự so sánh. Lấy ưu đãi nghe được của một căn hoàn thiện áp sang một căn xây thô là so hai thứ không cùng loại, và con số thực trả lệch đi rất xa.",
  },
  {
    ten: "Tiến độ thanh toán, khác nhau giữa hàng thô và hàng giãn xây",
    moTa: "Hàng xây thô chia đợt theo một cách, hàng giãn xây chia theo cách khác — trong đó phần tiền xây được tách riêng và trả sau, chứ không nằm trong đợt đầu.",
    anhHuong:
      "Phần ảnh hưởng lớn nhất tới dòng tiền của bạn. Hai căn cùng giá niêm yết nhưng khác loại quỹ có thể đòi số tiền phải chuẩn bị trong năm đầu chênh nhau rất nhiều.",
  },
  {
    ten: "Chiết khấu thanh toán sớm",
    moTa: "Mức giảm khi đóng trước hạn hoặc đóng một lần. Tỉ lệ và điều kiện đổi theo từng đợt mở bán.",
    anhHuong:
      "Phải đặt cạnh chi phí vốn của chính bạn. Nếu số tiền đó đang sinh lời ở chỗ khác, hoặc phải vay để đóng sớm, thì mức chiết khấu chưa chắc bù lại được.",
  },
  {
    ten: "Hỗ trợ lãi suất — và cái giá đi kèm",
    moTa: "Ngân hàng cho vay, chủ đầu tư trả thay phần lãi trong một khoảng thời gian. Chọn thời gian hỗ trợ càng dài thì mức giá áp cho căn đó càng tăng theo, và tỉ lệ vay càng cao thì mức tăng càng lớn.",
    anhHuong:
      "Đây là điều ít được nói ra nhất và đáng biết nhất: hỗ trợ lãi suất không miễn phí, nó đã được tính vào giá. Hỏi thẳng bảng đối chiếu giữa thời gian hỗ trợ và mức tăng giá, rồi so với lãi vay bạn thật sự phải trả nếu không lấy gói đó.",
  },
  {
    ten: "Các nhóm quyền lợi có điều kiện",
    moTa: "Ưu đãi theo hạng khách hàng thân thiết, quà tặng kèm, hỗ trợ phí dịch vụ, và các chương trình voucher. Mỗi nhóm có bộ điều kiện riêng, thời hạn riêng, và có nhóm chỉ áp cho một loại quỹ.",
    anhHuong:
      "Không nhóm nào tự động cộng vào. Phải đủ điều kiện và phải làm đúng thủ tục ở đúng thời điểm — bỏ sót thì sau khi ký không xin lại được. Có nhóm còn chia một phần vào giá, một phần vào điểm thưởng, nên nghe thì cùng một tỉ lệ mà số tiền giảm thật lại ít hơn.",
  },
  {
    ten: "Ràng buộc đi kèm khi dùng ưu đãi",
    moTa: "Một số chương trình đặt điều kiện ngược lại phía người mua — phổ biến nhất là giới hạn chuyển nhượng trong một khoảng thời gian sau khi dùng, và giới hạn mỗi suất ưu đãi chỉ áp cho một bất động sản.",
    anhHuong:
      "Với người mua để ở thì hầu như không ảnh hưởng. Với người tính sang tay sớm thì đây là điều khoản phải đọc TRƯỚC cả bảng giá — nhận ưu đãi rồi mới biết mình bị khoá thì đã muộn.",
  },
];

export default function TrangChinhSach() {
  const daCoChinhSach = tienDoThanhToan.length > 0;

  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Chính sách bán hàng gồm *những gì*" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body leading-relaxed text-paper-dim">
                  Chính sách thay theo từng đợt mở bán. Trang này không đoán
                  chính sách sắp tới — nó chỉ ra cấu trúc chung để bạn biết phải
                  hỏi gì và đọc kỹ chỗ nào.
                </p>
              </ClipReveal>
            </div>
          </div>
        </Khung>
      </section>

      {/* Trạng thái hiện tại, nói thẳng ở ngay đầu trang. */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-h2 font-normal text-balance">
                Hiện đang áp dụng chính sách nào
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              {daCoChinhSach ? (
                <ol className="border-t border-ink-line">
                  {tienDoThanhToan.map((dot, i) => (
                    <li
                      key={dot.ten}
                      className="grid items-baseline gap-2 border-b border-ink-line py-5 md:grid-cols-[4rem_1fr_8rem] md:gap-8"
                    >
                      <span className="tabular text-label uppercase text-paper-dim">
                        Đợt {i + 1}
                      </span>
                      <span>
                        <span className="block text-h4">{dot.ten}</span>
                        <span className="mt-1 block text-small text-paper-dim">
                          {dot.moc}
                        </span>
                      </span>
                      <span className="tabular font-display text-h3 text-jade md:text-right">
                        {dot.tyLe}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                /* ĐÃ ĐỔI CÁCH NÓI, và chỗ này quan trọng hơn vẻ ngoài của nó.
                   Trước đây trang viết "chưa có chính sách để đăng" — đúng lúc
                   viết, nhưng giờ thì sai: có bảng chính sách đang chạy, chỉ là
                   trang không đăng con số. Để nguyên câu cũ là nói sai với
                   khách theo hướng bất lợi cho chính mình: người đọc kết luận
                   dự án chưa bán, rồi bỏ đi. */
                <>
                  <p className="max-w-[68ch] text-lead leading-relaxed">
                    Có chính sách bán hàng đang áp dụng. Trang này công khai{" "}
                    <strong className="text-paper">cấu trúc</strong> của nó,
                    không công khai con số.
                  </p>
                  <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                    Lý do nằm ở chính bản chất của những con số ấy: mỗi bảng
                    chính sách có cửa sổ hiệu lực tính bằng tuần, tính từ ngày ký
                    thoả thuận giao dịch đầu tiên chứ không phải ngày bạn hỏi. Và
                    mức áp cho mỗi người còn phụ thuộc vào loại quỹ, tiến độ
                    chọn, tỉ lệ vay và các nhóm quyền lợi mà riêng người đó chạm
                    tới.
                  </p>
                  <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                    Một trang tĩnh đăng những con số đó lên thì hoặc là lạc hậu
                    sau vài tuần, hoặc là hứa với bạn thứ chỉ đúng với người
                    khác. Cả hai đều tệ hơn là không đăng. Phần dưới đây là thứ
                    đăng được và đáng đọc trước: sáu nhóm cấu thành nên chính
                    sách, và nhóm nào chạm vào túi tiền.
                  </p>
                  <Link href="#nhan-chinh-sach" className="nut nut-chinh mt-8">
                    Nhận bản áp cho căn bạn chọn
                  </Link>
                </>
              )}
            </div>
          </div>
        </Khung>
      </section>

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="max-w-3xl font-display text-h1 font-normal text-balance">
            Sáu nhóm của một chính sách, và nhóm nào chạm vào túi tiền
          </h2>

          <ol className="mt-12 border-t border-ink-line">
            {PHAN.map((p, i) => (
              <li
                key={p.ten}
                className="grid gap-x-10 gap-y-4 border-b border-ink-line py-9 md:grid-cols-12"
              >
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span className="tabular text-label text-jade">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-h3 font-normal text-balance">
                    {p.ten}
                  </h3>
                </div>
                <p className="text-body leading-relaxed text-paper-dim md:col-span-4">
                  {p.moTa}
                </p>
                <p className="border-l border-warn/40 pl-5 text-small leading-relaxed text-paper-dim md:col-span-4">
                  <span className="mb-1 block text-label uppercase text-warn">
                    Chỗ đáng đọc kỹ
                  </span>
                  {p.anhHuong}
                </p>
              </li>
            ))}
          </ol>
        </Khung>
      </section>

      <section
        id="nhan-chinh-sach"
        className="scroll-mt-24 border-t border-ink-line py-nhip"
      >
        <Khung>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Nhận chính sách *đang áp dụng*" />
              </h2>
              <ClipReveal delay={120}>
                <p className="mt-6 max-w-md text-body leading-relaxed text-paper-dim">
                  Kèm theo là phương án thực trả tính trên đúng dòng sản phẩm bạn
                  đang cân nhắc, không phải một bảng chung.
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
    </>
  );
}
