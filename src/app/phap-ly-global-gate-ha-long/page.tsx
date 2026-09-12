import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { duAn, lienKet, taiLieu, duongDanDrive } from "@/data/project";
import { KhoiChot } from "@/components/site/khoi-chot";

export const metadata: Metadata = {
  alternates: { canonical: "/phap-ly-global-gate-ha-long" },
  title: "Pháp lý dự án",
  description: `Hình thức sở hữu, hồ sơ pháp lý và những giấy tờ cần đối chiếu trước khi đặt cọc ${duAn.tenNgan} — mở xem trực tiếp, không cần đăng ký.`,
};

/**
 * Trang pháp lý.
 *
 * TÁCH RA khỏi `/tai-lieu` vì hai trang trả lời hai câu hỏi khác nhau:
 *   · /tai-lieu   — "có những tài liệu gì" (danh mục)
 *   · /phap-ly    — "dự án này có an toàn không" (câu hỏi thật của người mua)
 *
 * Người gõ "pháp lý Hạ Long Xanh" vào ô tìm kiếm đang hỏi câu thứ hai. Dẫn họ
 * tới một danh mục tài liệu là bắt họ tự đọc và tự kết luận — trong khi họ đến
 * đây chính vì chưa biết phải đọc gì.
 */

interface MucKiem {
  ten: string;
  hoi: string;
  giaiThich: string;
}

const CAN_KIEM: MucKiem[] = [
  {
    ten: "Quyết định chấp thuận chủ trương đầu tư",
    hoi: "Dự án có được cấp phép triển khai không?",
    giaiThich:
      "Văn bản gốc của cơ quan quản lý. Đây là giấy tờ đầu tiên trong chuỗi — thiếu nó thì mọi giấy tờ sau không có cơ sở.",
  },
  {
    ten: "Quyết định giao đất",
    hoi: "Phần đất bán cho tôi đã được giao cho chủ đầu tư chưa?",
    giaiThich:
      "Một dự án lớn thường được giao đất theo từng giai đoạn. Điều đáng kiểm không phải là dự án có quyết định giao đất hay chưa, mà là ĐÚNG PHÂN KHU chứa căn của bạn đã nằm trong phần được giao chưa.",
  },
  {
    ten: "Văn bản đủ điều kiện bán nhà hình thành trong tương lai",
    hoi: "Chủ đầu tư có được phép bán căn này ở thời điểm hiện tại không?",
    giaiThich:
      "Đây là giấy tờ quyết định việc ký hợp đồng mua bán có hợp lệ hay không. Trước khi có nó, mọi khoản tiền chỉ được nhận dưới các hình thức khác — và quyền của người mua ở giai đoạn đó yếu hơn hẳn.",
  },
  {
    ten: "Bảo lãnh ngân hàng",
    hoi: "Nếu dự án chậm bàn giao thì ai trả lại tiền cho tôi?",
    giaiThich:
      "Ngân hàng cam kết hoàn tiền nếu chủ đầu tư không bàn giao đúng hạn. Cần kiểm bảo lãnh áp dụng cho ĐÚNG CĂN của bạn — bảo lãnh thường theo từng đợt và từng phân khu, không phải một văn bản phủ toàn dự án.",
  },
  {
    ten: "Hợp đồng mua bán mẫu",
    hoi: "Tôi sẽ ký vào những điều khoản nào?",
    giaiThich:
      "Đọc trước khi đặt cọc, không phải đọc lúc ký. Ba phần đáng chú ý nhất: mốc bàn giao và điều kiện phạt chậm, quy định chuyển nhượng trước khi có sổ, và cách xử lý khi diện tích thực tế lệch so với hợp đồng.",
  },
];

export default function TrangPhapLy() {
  const hoSo = taiLieu.find((t) => t.ten === "Hồ sơ pháp lý");

  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Pháp lý — *năm giấy tờ* cần đối chiếu" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body leading-relaxed text-paper-dim">
                  Hồ sơ do chủ đầu tư phát hành, mở xem trực tiếp và không cần
                  để lại thông tin. Trang này nói thêm phần khó hơn: nhìn vào đó
                  thì phải kiểm những gì.
                </p>
              </ClipReveal>
            </div>
          </div>
        </Khung>
      </section>

      {/* Ba sự thật cơ bản, trả lời ngay. Câu giải thích là <dd> THỨ HAI của
          cùng thuật ngữ, không phải <p> — <dl> chỉ được chứa dt/dd (axe:
          definition-list); một thuật ngữ có nhiều dd là hợp lệ. */}
      <section className="mang-sang py-nhip">
        <Khung>
          <dl className="grid gap-x-12 gap-y-10 md:grid-cols-3">
            <div>
              <dt className="text-label uppercase text-jade">Hình thức sở hữu</dt>
              <dd className="mt-3 font-display text-h2 font-normal">
                {duAn.phapLy}
              </dd>
              <dd className="mt-3 text-small leading-relaxed text-paper-dim">
                Giữ được giá trị chuyển nhượng về sau, khác với sản phẩm có thời
                hạn vốn mất dần giá trị theo số năm còn lại.
              </dd>
            </div>
            <div>
              <dt className="text-label uppercase text-jade">Chủ đầu tư</dt>
              <dd className="mt-3 font-display text-h3 font-normal leading-tight">
                {duAn.chuDauTu}
              </dd>
              <dd className="mt-3 text-small leading-relaxed text-paper-dim">
                Toàn bộ giấy tờ trong mục hồ sơ pháp lý đều do liên danh này
                phát hành.
              </dd>
            </div>
            <div>
              <dt className="text-label uppercase text-jade">Tình trạng</dt>
              <dd className="mt-3 font-display text-h3 font-normal leading-tight">
                {duAn.tinhTrang}
              </dd>
              <dd className="mt-3 text-small leading-relaxed text-paper-dim">
                Dự án triển khai theo giai đoạn, nên giấy tờ cũng theo giai đoạn
                — xem mục thứ hai và thứ tư bên dưới.
              </dd>
            </div>
          </dl>
        </Khung>
      </section>

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display text-h1 font-normal text-balance">
                Năm giấy tờ, và câu hỏi mà mỗi giấy tờ trả lời
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 md:self-end">
              <p className="text-body leading-relaxed text-paper-dim">
                Điểm chung của hai mục dễ bỏ sót nhất: chúng đúng theo{" "}
                <strong className="text-paper">từng phân khu</strong>, không phải
                theo cả dự án. Hỏi &ldquo;dự án có bảo lãnh không&rdquo; là hỏi
                sai câu.
              </p>
            </div>
          </div>

          <ol className="mt-14 border-t border-ink-line">
            {CAN_KIEM.map((m, i) => (
              <li
                key={m.ten}
                className="grid gap-x-10 gap-y-4 border-b border-ink-line py-9 md:grid-cols-12"
              >
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span className="tabular text-label text-jade">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-h3 font-normal text-balance">
                    {m.ten}
                  </h3>
                </div>
                <p className="text-h4 leading-relaxed text-paper md:col-span-3">
                  {m.hoi}
                </p>
                <p className="max-w-[62ch] text-small leading-relaxed text-paper-dim md:col-span-5">
                  {m.giaiThich}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            {hoSo ? (
              <a
                href={duongDanDrive(hoSo)}
                target="_blank"
                rel="noreferrer"
                data-do="tai-lieu"
                data-do-chi-tiet="Hồ sơ pháp lý"
                className="nut nut-chinh"
              >
                Mở hồ sơ pháp lý
              </a>
            ) : null}
            <a
              href={lienKet.hoSoPhapLy}
              target="_blank"
              rel="noreferrer"
              className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
            >
              Cổng thông tin chủ đầu tư
            </a>
          </div>
        </Khung>
      </section>

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h2 font-normal text-balance">
                Nhờ đối chiếu giấy tờ của đúng căn bạn nhắm
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className="max-w-[64ch] text-body leading-relaxed text-paper-dim">
                Hai mục dễ hụt nhất — phần đất đã giao và bảo lãnh ngân hàng —
                đều phải tra theo từng phân khu và từng đợt. Gửi mã căn bạn đang
                cân nhắc, chúng tôi đối chiếu và gửi lại đúng văn bản áp dụng cho
                căn đó.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link href="/lien-he" className="nut nut-phu">
                  Nhờ đối chiếu
                </Link>
                <Link
                  href="/tai-lieu"
                  className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
                >
                  Toàn bộ tài liệu
                </Link>
              </div>
            </div>
          </div>
        </Khung>
      </section>
      <KhoiChot dan="Năm giấy tờ ở trên đều xin đối chiếu được. Nếu bạn đang nhắm một phân khu cụ thể, chúng tôi chỉ rõ giấy nào áp cho phân khu đó." />
    </>
  );
}
