import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { Khung } from "@/components/ui/khung";
import { DUONG_DAN } from "@/lib/duong-dan";
import { Preloader } from "@/components/ui/preloader";
import { TieuDeMang } from "@/components/ui/tieu-de-mang";
import { ClipReveal, CountUp } from "@/components/motion/scroll-effects";
import { ExpandOnScroll } from "@/components/motion/expand-on-scroll";
import { HeroAnh } from "@/components/site/hero-anh";
import { DanhSachSanPham } from "@/components/site/danh-sach-san-pham";
import { DangKyForm } from "@/components/site/dang-ky-form";
import { MocVoucher } from "@/components/site/moc-voucher";
import { QuyCanXemTruoc } from "@/components/site/quy-can-xem-truoc";
import { HoSoMinhBach } from "@/components/site/ho-so-minh-bach";
import { DoiNguTuVan } from "@/components/site/doi-ngu-tu-van";
import { CauHoiThuongGap } from "@/components/site/cau-hoi-thuong-gap";
import { ThanhQuyetDinh } from "@/components/site/thanh-quyet-dinh";
import { TimCanPhuHop } from "@/components/site/tim-can-phu-hop";
import { GiaThucTra } from "@/components/site/gia-thuc-tra";
import {
  anhPhanKhu,
  diemTinCay,
  duAn,
  lienKet,
  phanKhu,
  soLieu,
  thongDiepChot,
  chuTron,
} from "@/data/project";

// Bố cục đi theo đúng thứ tự một người mua thật sự cần:
//   mở màn → tin được không → nó nằm ở đâu → có gì bán → có gì chơi → trông ra
//   sao → chuyện gì đang diễn ra → để lại số
//
// So với bản trước, trang này CÓ NHIỀU MẢNG HƠN nhưng NGẮN HƠN NHIỀU. Đo bản
// cũ ở 1440px: 12.327px cho 10 mảng, tức 1.233px mỗi mảng, chữ chiếm 8,6% diện
// tích trang. Trang tham chiếu market.vinhomes.vn: 504px mỗi mảng, chữ 20,6%.
// Cách sửa không phải là bỏ bớt mảng mà là bỏ khoảng trống bên trong mỗi mảng
// và cho mảng nào cũng có nội dung thật để đọc.
//
// Sơ đồ quy hoạch đã CHUYỂN sang trang riêng `/quy-hoach`: nó là thứ giữ chân
// lâu nhất nên xứng đáng có địa chỉ riêng để gửi cho khách, thay vì là một cái
// neo `/#so-do` chỉ cuộn trong trang chủ.


export default function TrangChu() {
  const phanKhuNoiBat = phanKhu.slice(0, 4);

  return (
    <>
      {/* Màn mở đầu sống Ở ĐÂY chứ không ở bố cục gốc — nó chỉ thuộc về trang
          chủ. Lý do đầy đủ ghi trong `app/layout.tsx`, chỗ nó từng đứng. */}
      <Preloader />

      {/* ================================ HERO ================================
          Tiêu đề nằm ở ĐÁY ảnh chứ không giữa khung: đặt giữa thì chữ đè lên
          đúng phần đẹp nhất của phối cảnh, và phải phủ tối cả tấm mới đọc được. */}
      <HeroAnh anh="toan-canh-hoang-hon">
        <Khung className="pb-10 md:pb-14">
          <p className="text-label uppercase text-jade">{duAn.ten}</p>

          <h1 className="mt-5 max-w-5xl">
            <span className="block font-display text-display font-normal">
              <SplitReveal text={duAn.tuyenBoChinh} stagger={110} delay={120} />
            </span>
            <span className="mt-3 block max-w-2xl font-display text-h2 font-normal text-paper/75">
              <SplitReveal text={duAn.tuyenBoPhu} stagger={45} delay={420} />
            </span>
          </h1>

          {/* THỨ TỰ HAI NÚT NÀY ĐÃ ĐẢO so với bản trước, và đây là thay đổi
              thương mại chứ không phải thẩm mỹ.

              Trước: nút đặc (nút chính) dẫn tới "Khám phá quy hoạch", nút viền
              mới là bảng hàng. Nghĩa là màn hình đầu tiên mời khách đi xem chứ
              không mời khách mua — trong khi phần lớn người vào trang bất động
              sản đang mang sẵn một câu hỏi rất cụ thể: giá bao nhiêu, còn căn
              nào, chính sách gì.

              ĐỢT NÀY ĐỔI CẢ HAI NÚT, và lý do là trang đã khác trước.

              Nút chính từng ghi "Nhận bảng hàng & chính sách" — đúng ở thời
              điểm trang chưa có giá công bố. Giờ trang có bảng hàng thật với
              giá từng căn, nên hứa gửi bảng hàng là hứa một thứ khách tự xem
              được, tức là tự làm mình thành thừa. Thứ khách KHÔNG tự làm được
              là ghép căn, chính sách và số tiền thực trả thành một phương án
              cho riêng họ — nên đó mới là thứ nút chính nên hứa.

              Nút phụ đổi từ "Khám phá quy hoạch" sang giá: người vào trang bất
              động sản hỏi giá trước, hỏi quy hoạch sau. Quy hoạch vẫn nằm
              trong thanh điều hướng cho ai muốn tìm. */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href={DUONG_DAN.lienHe} className="nut nut-chinh">
              Nhận phương án thực trả
            </Link>
            <Link href={DUONG_DAN.gia} className="nut nut-phu">
              Xem giá &amp; quỹ căn
            </Link>
            {/* Nút tour chỉ hiện khi có link chạy được — xem `data/project.ts`. */}
            {lienKet.tour360 ? (
              <a
                href={lienKet.tour360}
                target="_blank"
                rel="noreferrer"
                className="nut nut-phu"
              >
                Tour 360°
              </a>
            ) : null}
          </div>

          {/* Dải niềm tin ĐẶT NGAY TRONG HERO thay vì thành một mảng riêng.
              Người mua bất động sản hỏi "có thật không" trước khi hỏi "đẹp
              không"; để nó ở đây thì câu trả lời nằm cùng màn hình đầu tiên,
              và tiết kiệm được nguyên một mảng cao 300px. */}
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-paper/15 pt-7 md:grid-cols-4">
            {diemTinCay.map((muc) => (
              <div key={muc.nhan}>
                <dt className="text-label uppercase text-paper/45">{muc.nhan}</dt>
                <dd className="mt-1.5 text-h4">
                  {muc.giaTri}
                  {process.env.NODE_ENV !== "production" && muc.canXacNhan ? (
                    <span className="ml-2 text-small text-jade">⚠</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </Khung>
      </HeroAnh>

      {/* ==================== DẢI QUYẾT ĐỊNH NHANH ==========================
          Năm đường tắt, đặt ngay dưới mảng mở đầu. Trang chủ cao mười bảy màn
          hình; người vào với một câu hỏi cụ thể không nên phải cuộn hết phần
          kể chuyện mới tới được câu trả lời. */}
      <ThanhQuyetDinh />

      {/* KHỐI 03 — MÓC VOUCHER. Đứng ngay sau dải quyết định nhanh, trước cả
          sản phẩm và giá. Lý do đầy đủ ghi trong chính thành phần. */}
      <MocVoucher />

      {/* ============ QUY MÔ — chữ trái, số phải — MẢNG NỀN SÁNG =============
          Hai cột lệch: bản cũ để bốn con số nằm trơ một hàng ngang không có gì
          giải thích chúng. Giờ cột trái nói dự án là gì, cột phải là số liệu —
          đọc xong hàng số thì đã có ngữ cảnh.

          NỀN SÁNG, và đặt ngay sau mảng mở đầu là chủ ý. Cắt thẳng từ tấm ảnh
          hoàng hôn tối sang một mảng sáng như trang giấy làm hai việc cùng lúc:
          mắt được nghỉ ngay thay vì phải đợi tới giữa trang, và bốn con số quy
          mô đọc ra như số liệu trong hồ sơ chứ không như chữ trên tấm áp phích.
          Cùng một con số, đặt trên nền khác thì mức tin cũng khác. */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Một đô thị, *không phải* một khu nhà" />
              </h2>
              <ClipReveal delay={120}>
                <p className="mt-6 max-w-md text-body text-paper-dim">
                  {duAn.moTaNgan}
                </p>
                <Link
                  href="/du-an"
                  className="link-underline mt-6 inline-flex min-h-11 items-center text-label uppercase text-jade"
                >
                  Hồ sơ dự án đầy đủ
                </Link>
              </ClipReveal>
            </div>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-10 md:col-span-6 md:col-start-7">
              {soLieu.map((muc, thuTu) => (
                <ClipReveal key={muc.nhan} delay={thuTu * 80}>
                  <dt className="text-label uppercase text-paper-dim">
                    {muc.nhan}
                  </dt>
                  {/* flex-wrap: đơn vị xuống dòng khi hết chỗ.
                      Ở khổ 320px, con số dùng cỡ chữ tiêu đề chiếm khoảng
                      110px trong một cột chỉ rộng 120px, nên nhãn đơn vị bị
                      đẩy hẳn ra ngoài — đo được "cư dân" kết thúc ở 320,64px.
                      Nửa điểm ảnh đó đủ làm cả thân trang cuộn ngang được, và
                      kéo theo cả thanh điều hướng lẫn thanh gọi phía dưới rộng
                      321px vì chúng là fixed inset-x-0.

                      Chỉ có tác dụng khi thiếu chỗ, nên khổ rộng hơn không đổi
                      một pixel nào. */}
                  <dd className="mt-3 flex flex-wrap items-baseline gap-2">
                    <span className="tabular font-display text-h1 font-normal leading-none">
                      <CountUp giaTri={muc.giaTri} />
                    </span>
                    {muc.donVi ? (
                      <span className="text-small text-paper-dim">{muc.donVi}</span>
                    ) : null}
                  </dd>
                  {/* NGUỒN HIỆN RA TRÊN TRANG, không còn chỉ hiện lúc phát
                      triển. Trước đây chỗ này là dấu ⚠ chỉ người viết mã thấy —
                      nghĩa là người duy nhất KHÔNG biết con số lấy ở đâu lại
                      chính là người mua.

                      Đây cũng là đòn bẩy đo được cho việc được trợ lý AI trích
                      dẫn: xem chú thích trường `nguon` trong `data/project.ts`. */}
                  {muc.nguon ? (
                    <p className="mt-2 max-w-[34ch] text-small leading-snug text-paper-dim">
                      {muc.nguon}
                    </p>
                  ) : null}
                </ClipReveal>
              ))}
            </dl>
          </div>
        </Khung>
      </section>

      {/* =============================== SẢN PHẨM ============================= */}
      <section
        id="san-pham"
        className="scroll-mt-24 border-t border-ink-line py-nhip"
      >
        <Khung>
          <TieuDeMang
            tieuDe="Năm cách để *thuộc về* nơi này"
            dan={
              <p>
                Từ nhà liền kề trong lõi đô thị tới biệt thự đứng riêng bên mặt
                nước. Diện tích lấy từ bộ bản vẽ mặt bằng của chủ đầu tư.
              </p>
            }
            lienKet={{ nhan: "Xem bảng hàng & giá", href: "/quy-can-global-gate-ha-long" }}
          />

          <Reveal delay={140} className="mt-12">
            <DanhSachSanPham />
          </Reveal>
        </Khung>
      </section>

      {/* ======================== TÌM DÒNG PHÙ HỢP ==========================
          Ngay sau khi khách vừa xem qua năm dòng sản phẩm. Đó là lúc câu hỏi
          trong đầu chuyển từ "có những gì" sang "cái nào là của tôi" — hỏi
          đúng lúc đó thì ba câu hỏi là trợ giúp, hỏi sớm hơn thì là cản đường. */}
      <TimCanPhuHop />

      {/* ========================== GIÁ THỰC TRẢ ============================
          Mảng bán hàng thật sự của trang. Đặt SAU phần chứng minh chứ không
          phải trước: đề nghị "để chúng tôi kiểm giá giúp" chỉ có nghĩa với
          người đã tin dự án là thật. */}
      {/* KHỐI 06 — QUỸ CĂN & GIÁ XEM TRƯỚC. Đặt NGAY TRƯỚC khối giá thực trả:
          thấy số thật rồi mới hiểu vì sao "giá thực trả" là một câu chuyện
          khác. Đảo thứ tự thì khối giá thực trả nói về một con số mà người đọc
          chưa từng nhìn thấy. */}
      <QuyCanXemTruoc />

      <GiaThucTra />

      {/* ========================= QUY HOẠCH (dẫn sang trang) ==================
          Bốn phân khu tiêu biểu kèm ảnh, phần còn lại nằm ở trang riêng. Bản
          cũ nhúng cả sơ đồ tương tác vào đây rồi bỏ trống 900px xung quanh. */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <TieuDeMang
            tieuDe="Chín vịnh và đảo, *một* đô thị"
            dan={
              <p>
                Mỗi vịnh và đảo có một tính cách riêng — thể thao, nghỉ dưỡng,
                hưu trí, lễ hội. Sơ đồ tương tác cho biết từng khu nằm ở đâu và
                giáp với khu nào.
              </p>
            }
            lienKet={{ nhan: "Mở sơ đồ quy hoạch", href: "/quy-hoach" }}
          />

          <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {phanKhuNoiBat.map((khu, thuTu) => {
              const anh = anhPhanKhu(khu.ma);
              return (
                <Reveal key={khu.ma} delay={(thuTu % 4) * 80}>
                  <Link href={`/phan-khu/${khu.ma}`} className="group block">
                    {anh ? (
                      <div className="overflow-hidden bg-ink-soft">
                        <ProjectImage
                          name={anh}
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="aspect-4/3 w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                        />
                      </div>
                    ) : null}
                    <h3 className="mt-4 font-display text-h3 font-normal transition-colors group-hover:text-jade">
                      {khu.ten}
                    </h3>
                    {khu.diemNhan[0] ? (
                      <p className="mt-2 text-small leading-relaxed text-paper-dim">
                        {khu.diemNhan[0]}
                      </p>
                    ) : null}
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Khung>
      </section>

      {/* ======================== ẢNH NỞ RA TOÀN MÀN ========================= */}
      <ExpandOnScroll
        chuThich={
          <p className="font-display text-h1 font-normal drop-shadow-lg">
            Một đô thị mở ra <span className="italic">từ mặt nước</span>
          </p>
        }
      >
        <ProjectImage
          name="toan-canh-sang-som"
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </ExpandOnScroll>

      {/* ====================== HỒ SƠ MỞ — MẢNG NỀN SÁNG ======================
          Đặt giữa hai mảng thương mại, và vị trí này là chủ ý. Khách vừa được
          gợi ý một dòng sản phẩm, sắp được mời kiểm tra giá — chen vào giữa là
          bằng chứng rằng dự án có thật và hồ sơ mở cho ai cũng xem được.

          Bán → chứng minh → bán. Hai mảng bán hàng dính liền nhau thì mảng thứ
          hai đọc ra như nài nỉ. */}
      <HoSoMinhBach />

      {/* ==================== CÂU HỎI THƯỜNG GẶP — NỀN SÁNG ====================
          Đặt ngay TRƯỚC biểu mẫu, không phải sau. Người sắp điền số điện thoại
          là người còn đúng vài thắc mắc cuối; trả lời xong rồi mới xin số thì
          biểu mẫu bớt giống một bức tường phải vượt qua. */}
      <CauHoiThuongGap />

      {/* KHỐI TIỆN ÍCH ĐÃ CHUYỂN SANG `/tien-ich`.

          Nó liệt kê sáu hạng mục kèm diện tích — nội dung tốt, nhưng là nội
          dung của người ĐANG TÌM HIỂU, không phải của người đang quyết định
          mua. Trên trang chủ nó chiếm gần một màn hình ngay giữa phễu, đúng
          chỗ đáng ra phải hỏi tiền và hỏi căn.

          Trang `/tien-ich` đã có đủ nội dung đó và còn nhiều hơn, lại nhắm
          đúng một ý định tìm kiếm riêng. Để ở đó thì cùng một đoạn chữ vừa
          phục vụ được người muốn đọc, vừa không cản người muốn mua. */}

      {/* KHỐI TIN TỨC ĐÃ CHUYỂN SANG `/tin-tuc`.

          Nó tự ẩn khi chưa có bài, nên hôm nay gỡ đi không đổi gì trên màn
          hình. Nhưng đây là ĐÍCH của đường ống đăng bài tự động — nghĩa là
          ngày đường ống chạy, trang chủ tự dài thêm một mảng mà không ai
          quyết định điều đó. Giữ trang chủ ở đúng mười khối là một lựa chọn
          phải bảo vệ trước tương lai, không chỉ trước hiện tại. */}

      {/* ===================== NGƯỜI TƯ VẤN — MẢNG NỀN SÁNG ====================
          Tự ẩn khi `doiNguTuVan` còn trống — xem `data/project.ts`. */}
      <DoiNguTuVan />

      {/* =============================== ĐĂNG KÝ ============================== */}
      <section
        id="dang-ky"
        className="scroll-mt-24 border-t border-ink-line py-nhip"
      >
        <Khung>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h1 font-normal text-balance">
                {/* "Nhận bảng giá mới nhất" là câu mà tám trang đối thủ cùng
                    dùng, nên nó không hứa gì riêng. Câu này hứa đúng thứ chỉ
                    nơi này làm được: ghép quỹ căn thật với một phương án tính
                    riêng cho người hỏi. */}
                <SplitReveal text="Nhận quỹ căn + *phương án thực trả*" />
              </h2>
              <ClipReveal delay={120}>
                {/* Câu mời hành động, đặt NGAY TRÊN đoạn giải thích. Đây là
                    khối chốt cuối trang chủ — chỗ duy nhất trên cả trang mà
                    người đọc đã đi hết phễu và đang cân nhắc có để lại số hay
                    không. Một câu, nói thẳng việc cần làm. */}
                <p className="mt-6 max-w-md text-lead leading-relaxed text-jade">
                  {chuTron(thongDiepChot.truocKhiQuyetDinh)}
                </p>
                <p className="mt-5 max-w-md text-body leading-relaxed text-paper-dim">
                  Cho tôi biết điều anh/chị muốn. Tôi sẽ dựa vào đó để tìm căn
                  phù hợp, đối chiếu chính sách đang áp dụng và xây một phương
                  án thực trả để anh/chị có thêm cơ sở trước khi quyết định.
                </p>
                <Link
                  href="/lien-he"
                  className="link-underline mt-6 inline-flex min-h-11 items-center text-label uppercase text-jade"
                >
                  Hoặc xem thông tin liên hệ
                </Link>
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
