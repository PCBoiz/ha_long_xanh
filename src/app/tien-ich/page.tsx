import type { Metadata } from "next";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { Reveal } from "@/components/ui/reveal";
import { BieuDoTienIch } from "@/components/site/bieu-do-tien-ich";
import { duAn, hangMucTienIch } from "@/data/project";
import type { ProjectImageName } from "@/data/images.generated";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich" },
  title: "Tiện ích",
  description: `Hệ tiện ích của ${duAn.ten}: sân golf, biển Lagoon, công viên rừng, VinWonders và các hạng mục lớn khác, kèm diện tích công bố.`,
};

/**
 * Ảnh minh hoạ cho phần tiện ích.
 *
 * CHỈ ghép ảnh vào hạng mục khi ảnh thật sự chụp hạng mục đó. Năm tấm
 * `tien-ich-*` là các khu chủ đề trong công viên giải trí, nên chúng minh hoạ
 * cho VinWonders — không phải cho sân golf hay rừng ngập mặn. Ghép bừa thì
 * khách xem ảnh Cổng Babylon rồi tưởng đó là công viên rừng.
 */
const anhMinhHoa: { anh: ProjectImageName; chu: string }[] = [
  // ⚠️ `tien-ich-01` ("Quảng trường rạp xiếc") đã GỠ 12/09/2026: ảnh AI — biển
  // trên cổng ghi "ƂHAIAAHIANGR". Bằng chứng trong `anh-cam-dung.ts`. Không thay
  // bằng ảnh AI khác: đó đúng là cách ba tấm ngày 10/09 đã lọt vào.
  { anh: "tien-ich-03", chu: "Khu chủ đề Ai Cập" },
  { anh: "tien-ich-05", chu: "Cổng Babylon" },
  {
    anh: "giai-tri-cong-vien-chu-de",
    chu: "Quảng trường lễ hội ban ngày",
  },
];

/**
 * Số đếm trong câu dẫn LẤY TỪ MẢNG, không gõ tay.
 *
 * Trang này đã hai lần có câu dẫn đếm sai: "ba tấm" khi mảng có sáu (09/09), và
 * "Bốn hạng mục gắn với mặt nước" khi mảng còn ba (tấm thứ tư — nhà hàng dưới
 * nước — bị cấm mà câu dẫn không ai sửa). Một câu đếm số tự đọc mảng thì không
 * thể nói dối.
 */
function chuSo(n: number): string {
  return ["không", "một", "hai", "ba", "bốn", "năm", "sáu"][n] ?? String(n);
}
function ChuSoHoa(n: number): string {
  const c = chuSo(n);
  return c.charAt(0).toUpperCase() + c.slice(1);
}

/**
 * Bốn tấm ở trên là cảnh RỖNG — kiến trúc đứng một mình, không một bóng người.
 * Ba tấm dưới đây là cùng loại nơi chốn, nhưng có người đang dùng nó.
 *
 * Đó không phải chuyện thẩm mỹ. Một quảng trường không người trả lời câu "chỗ
 * này xây thế nào"; một quảng trường có người trả lời câu "đến đây thì làm gì"
 * — và câu thứ hai mới là câu người sắp mua nhà đang hỏi.
 *
 * Vẫn giữ nguyên luật của mảng trên: CHỈ ghép ảnh vào hạng mục khi ảnh thật sự
 * là hạng mục đó. Ba tấm này lấy từ bộ tài liệu 06/09 của chủ đầu tư, mỗi tấm
 * nằm đúng trang nói về hạng mục tương ứng.
 *
 * ⚠️ ĐÃ CÓ LẦN TRÔI, ĐỌC TRƯỚC KHI THÊM TẤM THỨ TƯ.
 *
 * Chú thích này từng nói "ba tấm" trong khi mảng đã có SÁU. Ba tấm thêm sau
 * không ai thẩm định — và audit ngày 09/09 cho thấy cả ba đều là ẢNH SINH BẰNG
 * AI: một tấm có biển ghi "NORTH S POLE" chữ vỡ, một tấm có biển tiếng Việt
 * nát thành "Đ5 chề mts", một tấm còn nguyên hình mờ của trình sinh ảnh ở góc.
 *
 * Chúng đã nằm trên trang đang chạy, được giới thiệu như tiện ích của dự án.
 *
 * Bài học không phải "kiểm ảnh kỹ hơn" mà là: MỘT CHÚ THÍCH ĐẾM SỐ THÌ PHẢI
 * ĐẾM LẠI KHI THÊM. Chú thích nói ba mà mảng có sáu là chú thích đang nói dối,
 * và nó nói dối đúng lúc người đọc tin nó nhất.
 *
 * Danh sách cấm và bằng chứng từng tấm: `src/data/anh-cam-dung.ts`.
 */
const anhCoNguoi: { anh: ProjectImageName; chu: string }[] = [
  {
    anh: "song-le-hoi-ben-du-thuyen",
    chu: "Vịnh Lễ Hội — sân khấu ngoài trời nhìn từ bến du thuyền",
  },
  {
    anh: "thien-nhien-cam-trai-rung-ngap-man",
    chu: "Công viên rừng ngập mặn — khu cắm trại bên mép nước",
  },
  { anh: "view-san-golf", chu: "Khu biệt thự nhìn ra sân golf" },
];

/**
 * Bốn hạng mục gắn với MẶT NƯỚC. Tách riêng vì đây là thứ phân biệt dự án này
 * với mọi đô thị nội địa — và cũng là thứ người mua hỏi nhiều nhất sau giá.
 *
 * ⚠️ BỐN TẤM NÀY ĐÃ QUA SÀNG LỌC, đọc trước khi thêm tấm thứ năm.
 *
 * Thư mục "TIỆN ÍCH" của chủ đầu tư có 22 tệp, nhưng QUÁ NỬA là ẢNH THẬT CHỤP
 * NƠI KHÁC, dùng làm ảnh tham chiếu ý tưởng trong bộ bán hàng:
 *
 *     "TỔ HỢP … C-DISTRICT"  → một ngôi chùa có thật, không ở Hạ Long
 *     "LÀNG BIA … BEER TOWN" → ảnh lễ hội bia châu Âu
 *     "CÔNG VIÊN ỐC ĐẢO …"   → một công viên kiểu Anh
 *     "CỤM 03 SÂN GOLF"      → sân golf ở nơi khác
 *
 * Đưa những tấm ấy lên đây là nói với người đọc rằng dự án SẼ có đúng cái họ
 * đang nhìn — trong khi chủ đầu tư chỉ dùng chúng để mô tả TINH THẦN. Đó là
 * một khẳng định sai, nói bằng hình, và người đọc không có cách nào biết.
 *
 * Các tấm dưới đây là phối cảnh do chủ đầu tư dựng CHO CHÍNH DỰ ÁN NÀY. Tấm
 * thứ tư (nhà hàng dưới nước) đã bị cấm — xem `anh-cam-dung.ts`.
 */
const anhMatNuoc: { anh: ProjectImageName; chu: string }[] = [
  { anh: "tien-ich-be-boi-noi", chu: "Bể bơi nổi trên mặt biển" },
  { anh: "tien-ich-bien-ho-trung-tam", chu: "Biển hồ trung tâm nhìn từ trên cao" },
  { anh: "tien-ich-cong-vien-hai-au", chu: "Công viên ven biển có hải đăng" },
];



export default function TrangTienIch() {
  const tong = hangMucTienIch.reduce((s, m) => s + m.dienTich, 0);

  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Cái gì *lớn* tới mức nào" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body text-paper-dim">
                  Mười hai hạng mục dưới đây cộng lại khoảng{" "}
                  <span className="tabular text-paper">
                    {tong.toLocaleString("vi-VN")} ha
                  </span>
                  . Số liệu đọc từ sơ đồ tổng mặt bằng chính thức; các danh xưng
                  so sánh là tuyên bố của chủ đầu tư in trên bản vẽ.
                </p>
              </ClipReveal>
            </div>
          </div>

          <ClipReveal delay={180} className="mt-12">
            <BieuDoTienIch />
          </ClipReveal>
        </Khung>
      </section>

      {/* ============================ ẢNH MINH HOẠ ============================ */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <h2 className="font-display text-h2 font-normal">
            Trong công viên chủ đề
          </h2>
          <p className="mt-3 max-w-xl text-body text-paper-dim">
            {ChuSoHoa(anhMinhHoa.length)} khung cảnh chụp ở tầm mắt người đi bộ,
            đã có người trong khung — thứ mà phối cảnh nhìn từ trên cao không cho
            thấy.
          </p>

          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {anhMinhHoa.map((muc, thuTu) => (
              <Reveal key={muc.anh} delay={(thuTu % 3) * 80}>
                <figure>
                  <div className="overflow-hidden bg-ink-soft">
                    <ProjectImage
                      name={muc.anh}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-3/4 w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-small text-paper-dim">
                    {muc.chu}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <h3 className="mt-16 font-display text-h2 font-normal">
            Ngoài công viên
          </h3>
          <p className="mt-3 max-w-xl text-body text-paper-dim">
            {ChuSoHoa(anhCoNguoi.length)} nơi khác, cũng nhìn từ chỗ người đứng
            — vì câu người mua hỏi không phải &ldquo;xây thế nào&rdquo; mà
            &ldquo;đến đây thì làm gì&rdquo;.
          </p>

          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {anhCoNguoi.map((muc, thuTu) => (
              <Reveal key={muc.anh} delay={(thuTu % 3) * 80}>
                <figure>
                  <div className="overflow-hidden bg-ink-soft">
                    <ProjectImage
                      name={muc.anh}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-3/2 w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-small text-paper-dim">
                    {muc.chu}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <h3 className="mt-16 font-display text-h2 font-normal">
            {ChuSoHoa(anhMatNuoc.length)} hạng mục gắn với mặt nước
          </h3>
          <p className="mt-3 max-w-xl text-body text-paper-dim">
            Thứ phân biệt nơi này với một đô thị nội địa — và là câu người mua
            hỏi nhiều thứ hai, ngay sau giá.
          </p>

          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {anhMatNuoc.map((muc, thuTu) => (
              <Reveal key={muc.anh} delay={(thuTu % 3) * 80}>
                <figure>
                  <div className="overflow-hidden bg-ink-soft">
                    <ProjectImage
                      name={muc.anh}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-4/3 w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-small text-paper-dim">
                    {muc.chu}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Khung>
      </section>

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-12 md:items-end">
            <p className="font-display text-h2 font-normal md:col-span-7">
              Tiện ích nào gần căn của bạn nhất còn tuỳ phân khu.
            </p>
            {/* Cột NĂM phần chứ không phải bốn: cột bốn phần ở khổ 768px chỉ
                rộng 210px, mà nút bên trong rộng 251px — nút tràn khỏi mép
                trang 14px. Đo bằng `scripts/audit.mjs`, không phải đoán. */}
            <div className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8">
              <Link href="/quy-hoach" className="nut nut-chinh">
                Xem sơ đồ quy hoạch
              </Link>
            </div>
          </div>
        </Khung>
      </section>
    </>
  );
}
