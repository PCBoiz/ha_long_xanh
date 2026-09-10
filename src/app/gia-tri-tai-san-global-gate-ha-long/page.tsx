import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { ProjectImage } from "@/components/ui/project-image";
import { duAn, dinhViThuongMai } from "@/data/project";
import quyCan from "@/data/quy-can.generated.json";

export const metadata: Metadata = {
  alternates: { canonical: "/gia-tri-tai-san-global-gate-ha-long" },
  title: "Có nên mua Hạ Long Xanh để ở",
  description: `Bốn yếu tố quyết định một căn ${duAn.tenNgan} có giữ được giá trị và dễ sang tay hay không — đọc bằng số liệu từ bảng hàng thật, không phải dự báo giá.`,
};

/**
 * Trang "giá trị tài sản / có nên mua".
 *
 * Phục vụ ĐÚNG tệp khách trọng tâm: người mua để Ở, nhưng vẫn muốn biết căn
 * mình chọn có giữ được giá trị và có dễ sang tay khi nhu cầu đổi không.
 *
 * ⚠️ RÀNG BUỘC CHẶT NHẤT CỦA TRANG NÀY: KHÔNG DỰ BÁO GIÁ.
 *
 * Không "sẽ tăng bao nhiêu phần trăm", không "lợi nhuận kỳ vọng", không so với
 * dự án khác. Những thứ đó không ai biết, và một trang nói ra chúng sẽ mất luôn
 * quyền được tin ở những chỗ nó nói đúng.
 *
 * Thay vào đó trang chỉ làm một việc: chỉ ra CÁC YẾU TỐ quyết định giá trị, và
 * cho thấy chúng hiện ra thế nào TRONG CHÍNH bảng hàng đang bán. Người đọc tự
 * rút kết luận — và kết luận tự rút thì bền hơn kết luận được bảo.
 */
export default function TrangGiaTriTaiSan() {
  const lienKe = quyCan.donGiaDat["Liền kề"];
  const chenh =
    lienKe && lienKe.nhoNhat > 0
      ? (lienKe.lonNhat / lienKe.nhoNhat).toFixed(1)
      : "—";
  const trieu = (n: number) => Math.round(n / 1e6).toLocaleString("vi-VN");

  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Mua để sống. Chọn để *giữ giá trị*." />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body leading-relaxed text-paper-dim">
                  {dinhViThuongMai.phu}
                </p>
              </ClipReveal>
            </div>
          </div>
        </Khung>
      </section>

      <section className="px-2 pb-nhip">
        <ClipReveal>
          <ProjectImage
            name="vbm-hoan-thien-02"
            alt="Dãy nhà đã hoàn thiện tại Vịnh Bình Minh"
            sizes="100vw"
            className="h-[46vh] w-full object-cover md:h-[60vh]"
          />
        </ClipReveal>
      </section>

      {/* ═══════════ TRẢ LỜI THẲNG ═══════════ */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-h2 font-normal text-balance">
                Ở tốt và giữ giá có mâu thuẫn không
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="max-w-[68ch] text-lead leading-relaxed">
                Không. Nhưng chúng không tự đi cùng nhau — phải chọn đúng ngay từ
                đầu, vì sau khi ký thì đổi căn không còn là một lựa chọn.
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Phần lớn thứ làm một căn dễ sống cũng là thứ làm nó dễ sang tay:
                vị trí trong khu, hướng, mặt tiền đường, khoảng cách tới tiện
                ích. Người mua lại sau này cũng là người sẽ ở đó, nên họ tìm đúng
                những gì bạn đang tìm.
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Chỗ hai mục tiêu tách nhau là <strong className="text-paper">giá
                mua vào</strong>. Trả cao hơn mặt bằng cho một căn đẹp thì vẫn ở
                tốt, nhưng phần chênh đó khó lấy lại khi bán. Đó là lý do bốn
                yếu tố dưới đây đều quy về một câu hỏi duy nhất: căn này đang
                được định giá thế nào so với các căn cạnh nó.
              </p>
            </div>
          </div>
        </Khung>
      </section>

      {/* ═══════════ BỐN YẾU TỐ ═══════════ */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="max-w-3xl font-display text-h1 font-normal text-balance">
            Bốn yếu tố đọc được ngay từ bảng hàng
          </h2>

          <ol className="mt-12 border-t border-ink-line">
            <YeuTo
              so="01"
              ten="Đơn giá đất so với các căn cùng dòng"
              than={
                <>
                  Đây là con số so sánh công bằng nhất giữa các căn cùng loại,
                  vì cùng dòng thì diện tích và số tầng tương đương. Ngay trong
                  bảng hàng đang bán, cùng là liền kề mà đơn giá trải từ{" "}
                  <span className="tabular text-paper">
                    {trieu(lienKe?.nhoNhat ?? 0)}
                  </span>{" "}
                  tới{" "}
                  <span className="tabular text-paper">
                    {trieu(lienKe?.lonNhat ?? 0)}
                  </span>{" "}
                  triệu mỗi mét vuông đất — chênh{" "}
                  <span className="tabular text-paper">{chenh}</span> lần.
                </>
              }
              vaSao="Cột giá tổng không cho thấy điều đó. Hai căn cùng dòng, cùng khoảng diện tích, nhìn giá tổng thì na ná nhau."
            />
            <YeuTo
              so="02"
              ten="Vị trí của lô trong nội khu"
              than={
                <>
                  Lô góc, lô mặt đường lớn, lô sát công viên và lô nằm sâu trong
                  tuyến nội bộ được định giá khác nhau — và chênh lệch đó chính
                  là phần lớn khoảng cách{" "}
                  <span className="tabular text-paper">{chenh}</span> lần ở yếu
                  tố trên.
                </>
              }
              vaSao="Đây là thứ bảng hàng không ghi thành chữ. Phải đối chiếu mã căn với sơ đồ quy hoạch mới đọc ra, và đó là việc mất công nhất trong cả quá trình chọn căn."
            />
            <YeuTo
              so="03"
              ten="Tiêu chuẩn bàn giao"
              than={
                <>
                  Bảng hàng hiện có ba mức: thô, giãn xây và hoàn thiện. Chúng
                  không chỉ khác nhau về giá mà khác cả về{" "}
                  <strong className="text-paper">
                    thời điểm bạn thật sự vào ở được
                  </strong>{" "}
                  và số tiền phải bỏ thêm sau khi nhận nhà.
                </>
              }
              vaSao="Với người mua để ở, một căn thô rẻ hơn có thể đắt hơn sau khi cộng chi phí và thời gian hoàn thiện. Với người tính sang tay, mức bàn giao ảnh hưởng trực tiếp tới tệp người mua lại."
            />
            <YeuTo
              so="04"
              ten="Độ dày của dòng sản phẩm"
              than={
                <>
                  Bảng hàng đang có{" "}
                  <span className="tabular text-paper">
                    {quyCan.theoLoaiHinh.map((t) => `${t.so} ${t.ten.toLowerCase()}`).join(" · ")}
                  </span>
                  . Dòng càng nhiều căn cùng lúc mở bán thì khi bạn muốn bán lại,
                  người mua càng có nhiều lựa chọn thay thế.
                </>
              }
              vaSao="Đây là mặt trái của một dự án quy mô lớn, và nó ít được nói tới: nguồn cung của chính dự án là đối thủ của bạn khi sang tay."
            />
          </ol>
        </Khung>
      </section>

      {/* ═══════════ KHÔNG DỰ BÁO ═══════════ */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h2 font-normal text-balance">
                Trang này không dự báo giá
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className="max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Không có con số tăng trưởng, không có suất sinh lời kỳ vọng,
                không có so sánh với dự án khác. Những thứ đó phụ thuộc vào thị
                trường vài năm tới, mà thị trường vài năm tới thì không ai biết —
                kể cả người nói rất chắc chắn.
              </p>
              <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-paper-dim">
                Thứ kiểm soát được là <strong className="text-paper">giá mua
                vào</strong> và <strong className="text-paper">căn nào</strong>.
                Bốn yếu tố ở trên đều nằm trong hai thứ đó, và đều đọc được ngay
                hôm nay từ bảng hàng thật.
              </p>
              <Link href="/dau-tu" className="nut nut-phu mt-7">
                Xem cả rủi ro
              </Link>
            </div>
          </div>
        </Khung>
      </section>

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Nhờ đối chiếu *căn bạn đang nhắm*" />
              </h2>
              <p className="mt-6 max-w-lg text-body leading-relaxed text-paper-dim">
                Gửi mã căn hoặc dòng sản phẩm bạn đang cân nhắc. Bạn sẽ nhận lại
                vị trí lô trên sơ đồ, đơn giá so với các căn cạnh nó, và những
                điểm yếu mà ảnh phối cảnh không cho thấy.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link href="/lien-he" className="nut nut-chinh">
                  Nhận phương án thực trả
                </Link>
                <Link
                  href="/quy-can-global-gate-ha-long"
                  className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
                >
                  Xem bảng hàng trước
                </Link>
              </div>
            </div>
          </div>
        </Khung>
      </section>
    </>
  );
}

function YeuTo({
  so,
  ten,
  than,
  vaSao,
}: {
  so: string;
  ten: string;
  than: React.ReactNode;
  vaSao: string;
}) {
  return (
    <li className="grid gap-x-10 gap-y-4 border-b border-ink-line py-9 md:grid-cols-12">
      <div className="flex items-baseline gap-4 md:col-span-4">
        <span className="tabular text-label text-jade">{so}</span>
        <h3 className="font-display text-h3 font-normal text-balance">{ten}</h3>
      </div>
      <p className="text-body leading-relaxed text-paper-dim md:col-span-4">
        {than}
      </p>
      <p className="border-l border-jade/30 pl-5 text-small leading-relaxed text-paper-dim md:col-span-4">
        <span className="mb-1 block text-label uppercase text-jade">
          Vì sao đáng chú ý
        </span>
        {vaSao}
      </p>
    </li>
  );
}
