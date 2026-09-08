import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { Reveal } from "@/components/ui/reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { BangHang } from "@/components/site/bang-hang";
import { DangKyForm } from "@/components/site/dang-ky-form";
import { dongSanPham, duAn, tienDoThanhToan } from "@/data/project";

export const metadata: Metadata = {
  alternates: { canonical: "/quy-can-global-gate-ha-long" },
  title: "Bảng hàng & giá",
  description: `Quỹ căn, khoảng diện tích theo dòng sản phẩm và tiến độ thanh toán của ${duAn.ten}.`,
};

/**
 * Trang thương mại.
 *
 * Ba khối dữ liệu ở đây — bảng hàng, khoảng giá, tiến độ thanh toán — ĐỀU
 * đang trống trong `data/project.ts`, và trống một cách CỐ Ý: đó là dữ liệu
 * bán hàng đổi từng ngày, chỉ chủ đầu tư mới có. Trang này dựng sẵn toàn bộ
 * giao diện, mỗi khối tự nhận biết mình có dữ liệu hay chưa.
 *
 * Cách trình bày khi trống cũng là một quyết định: KHÔNG ghi "Liên hệ" vào ô
 * giá rồi để bảng trông như đã đầy. Ô nào chưa có số thì nói thẳng là chưa có,
 * kèm đường để lấy số thật. Với bất động sản, một con số bịa không phải lỗi
 * trình bày mà là rủi ro pháp lý.
 */
export default function TrangBangHang() {
  /*
   * Cột nào đã có số. Bảng CHỈ dựng những cột này.
   *
   * VÌ SAO ĐỔI: bản trước dựng đủ bốn cột rồi in dấu gạch vào mọi ô chưa có —
   * mười lăm dấu gạch trong một bảng năm dòng. Ý định là trung thực, nhưng thứ
   * người xem đọc được lại là "trang này chưa làm xong" chứ không phải "chủ đầu
   * tư chưa công bố". Hai câu đó khác nhau rất xa với người sắp chuyển tiền tỷ.
   *
   * Cách mới KHÔNG giấu gì: cột chưa có số thì không dựng, và ngay dưới bảng có
   * một khối nói rõ mục nào chưa công bố, kèm lý do và đường lấy số thật. Lượng
   * thông tin y nguyên — chỉ nói thành câu một lần thay vì rải dấu gạch.
   */
  const coDienTich = dongSanPham.some((d) => d.dienTich);
  const coSoTang = dongSanPham.some((d) => d.soTang);
  const coKhoangGia = dongSanPham.some((d) => d.khoangGia);

  /*
   * Danh sách này ĐÃ NGẮN ĐI sau khi bảng hàng thật lên trang.
   *
   * "Quỹ căn còn lại" và "khoảng giá" từng nằm ở đây; giờ cả hai đều có số
   * thật ở mảng Quỹ căn ngay bên dưới, nên để lại là trang tự nói ngược với
   * chính mình — và đó là kiểu mâu thuẫn khách phát hiện ngay, rồi mất tin cả
   * những chỗ trang nói đúng.
   */
  const chuaCongBo = [
    !coSoTang && "số tầng theo dòng sản phẩm",
    tienDoThanhToan.length === 0 && "tiến độ thanh toán theo đợt",
    "chính sách bán hàng đang áp dụng",
  ].filter((muc): muc is string => typeof muc === "string");

  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Quỹ căn và *chính sách* đang áp dụng" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body leading-relaxed text-paper-dim">
                  Bảng hàng thật, giá từng căn, kèm giờ đọc file. Mỗi căn có hai
                  con số: giá đầy đủ đã gồm thuế và phí bảo trì, và giá nếu chọn
                  thanh toán sớm — vì đó là hai số tiền thực trả khác nhau, tuỳ
                  phương án anh/chị chọn.
                </p>
              </ClipReveal>
            </div>
          </div>
        </Khung>
      </section>

      {/* Ảnh căn ĐÃ HOÀN THIỆN ở Vịnh Bình Minh, đặt ngay dưới tiêu đề.
          Vịnh Bình Minh là tiểu khu chiếm 22 trong 32 căn của bảng hàng bên
          dưới, nên đây không phải ảnh trang trí: nó cho khách thấy trước thứ
          mà những con số sắp tới đang nói về. */}
      <section className="px-2 pb-nhip">
        <ClipReveal>
          <ProjectImage
            name="vbm-hoan-thien-04"
            alt="Đường phố hoàn thiện tại tiểu khu Vịnh Bình Minh"
            sizes="100vw"
            className="h-[48vh] w-full object-cover md:h-[62vh]"
          />
        </ClipReveal>
      </section>

      {/* ====================== KHOẢNG DIỆN TÍCH THEO DÒNG ==================== */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="font-display text-h2 font-normal">
            Theo dòng sản phẩm
          </h2>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink-line">
                  <th className="py-4 pr-6 text-label font-normal uppercase text-paper-dim">
                    Dòng sản phẩm
                  </th>
                  {coDienTich ? (
                    <th className="py-4 pr-6 text-label font-normal uppercase text-paper-dim">
                      Diện tích (m²)
                    </th>
                  ) : null}
                  {coSoTang ? (
                    <th className="py-4 pr-6 text-label font-normal uppercase text-paper-dim">
                      Số tầng
                    </th>
                  ) : null}
                  {coKhoangGia ? (
                    <th className="py-4 text-label font-normal uppercase text-paper-dim">
                      Khoảng giá
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {dongSanPham.map((dong) => (
                  <tr key={dong.ma} className="border-b border-ink-line/60">
                    <th scope="row" className="py-5 pr-6 text-left font-normal">
                      <Link
                        href={`/san-pham/${dong.ma}`}
                        className="link-underline inline-flex min-h-11 items-center text-h4 text-paper transition-colors hover:text-jade"
                      >
                        {dong.ten}
                      </Link>
                    </th>
                    {/* `ChuaCo` vẫn dùng cho ô LẺ còn thiếu trong một cột đã có
                        số ở dòng khác — đó mới đúng là "chỗ này chưa có". Cột
                        rỗng toàn bộ thì không dựng, xem chú thích đầu hàm. */}
                    {coDienTich ? (
                      <td className="tabular py-5 pr-6 text-body">
                        {dong.dienTich ?? <ChuaCo />}
                      </td>
                    ) : null}
                    {coSoTang ? (
                      <td className="tabular py-5 pr-6 text-body">
                        {dong.soTang ?? <ChuaCo />}
                      </td>
                    ) : null}
                    {coKhoangGia ? (
                      <td className="tabular py-5 text-body">
                        {dong.khoangGia ?? <ChuaCo />}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {coDienTich ? (
            <p className="mt-5 max-w-2xl text-small text-paper-dim">
              Diện tích suy ra từ bộ bản vẽ mặt bằng của chủ đầu tư, chưa phải
              bảng hàng chính thức — vui lòng đối chiếu với tư vấn viên trước khi
              đặt cọc.
            </p>
          ) : null}

          {/* ------------------ KHỐI "CHƯA CÔNG BỐ" -------------------------
              Thay cho những dấu gạch đã bỏ đi. Đây là chỗ nói ra bằng chữ:
              mục nào chưa có, VÌ SAO chưa có, và lấy ở đâu khi có.

              "Vì sao" là phần hay bị bỏ mà lại quan trọng nhất. "Chưa cập nhật"
              nghe như bỏ bê; "chỉ đăng khi chủ đầu tư công bố chính thức, vì số
              sai là rủi ro pháp lý" nghe ra một nguyên tắc — và một trang có
              nguyên tắc thì các con số nó CÓ đăng cũng đáng tin hơn. */}
          {chuaCongBo.length > 0 ? (
            <div className="mt-12 border-t border-ink-line pt-8">
              <div className="grid gap-x-12 gap-y-5 md:grid-cols-12">
                <div className="md:col-span-5">
                  <p className="font-display text-h3 font-normal">
                    Chưa công bố chính thức
                  </p>
                  <p className="mt-2 text-h4 text-jade">
                    {noiDanhSach(chuaCongBo)}
                  </p>
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <p className="max-w-[62ch] text-body leading-relaxed text-paper-dim">
                    Những mục trên chỉ được đăng khi chủ đầu tư công bố chính
                    thức. Trang này không đăng số phỏng đoán: với bất động sản,
                    một con số sai không phải lỗi trình bày mà là rủi ro pháp lý
                    cho cả hai bên.
                  </p>
                  <Link href="#nhan-chinh-sach" className="nut nut-phu mt-6">
                    Nhận khi có
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </Khung>
      </section>

      {/* ============================== QUỸ CĂN ============================== */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="font-display text-h2 font-normal">Quỹ căn</h2>
          <div className="mt-8">
            <BangHang />
          </div>
        </Khung>
      </section>

      {/* ======================== TIẾN ĐỘ THANH TOÁN ========================= */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="font-display text-h2 font-normal">
            Tiến độ thanh toán
          </h2>

          {tienDoThanhToan.length === 0 ? (
            <ClipReveal delay={100}>
              <div className="mt-8 border border-ink-line bg-ink-soft px-8 py-14">
                <p className="font-display text-h3 font-normal">
                  Chưa công bố chính sách chính thức
                </p>
                <p className="mt-4 max-w-xl text-body leading-relaxed text-paper-dim">
                  Tỉ lệ đóng tiền theo đợt là điều khoản trong hợp đồng mua bán.
                  Trang này chỉ đăng khi có chính sách bán hàng chính thức đang
                  áp dụng — một bảng tiến độ cũ hoặc phỏng đoán có thể khiến bạn
                  tính sai dòng tiền.
                </p>
                <Link
                  href="#nhan-chinh-sach"
                  className="mt-7 nut nut-phu"
                >
                  Nhận chính sách qua tư vấn
                </Link>
              </div>
            </ClipReveal>
          ) : (
            <ol className="mt-8 border-t border-ink-line">
              {tienDoThanhToan.map((dot, thuTu) => (
                <ClipReveal key={dot.ten} delay={(thuTu % 5) * 70}>
                  <li className="grid items-baseline gap-2 border-b border-ink-line py-6 md:grid-cols-[4rem_1fr_8rem] md:gap-8">
                    <span className="tabular text-label uppercase text-paper-dim">
                      Đợt {thuTu + 1}
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
                </ClipReveal>
              ))}
            </ol>
          )}
        </Khung>
      </section>

      {/* ============================== ĐĂNG KÝ ============================== */}
      <section
        id="nhan-chinh-sach"
        className="scroll-mt-24 border-t border-ink-line py-nhip"
      >
        <Khung>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Nhận bảng hàng *mới nhất*" />
              </h2>
              <ClipReveal delay={120}>
                <p className="mt-6 max-w-md text-body text-paper-dim">
                  Bảng hàng, chính sách bán hàng và tiến độ thanh toán đang áp
                  dụng sẽ được gửi trực tiếp cho bạn.
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

/**
 * Nối danh sách theo lối tiếng Việt: "a, b và c" — không phải "a, b, c".
 * Dấu phẩy cuối trước liên từ là lối viết tiếng Anh, đọc lợn cợn trong tiếng
 * Việt và đây là chỗ chữ phải chỉn chu nhất trang.
 */
function noiDanhSach(muc: string[]): string {
  if (muc.length <= 1) return muc[0] ?? "";
  return `${muc.slice(0, -1).join(", ")} và ${muc[muc.length - 1]}`;
}

/** Ô chưa có số. Nói thẳng là chưa có, không ghi "Liên hệ" cho bảng đỡ trống. */
function ChuaCo() {
  return (
    <span className="text-paper-dim/70" title="Chưa công bố">
      —
    </span>
  );
}
