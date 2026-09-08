import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { ClipReveal, CountUp } from "@/components/motion/scroll-effects";
import { TomTatBangHang } from "@/components/site/bang-hang-quanh-day";
import { BangSoSanh, TienDoThanhToan } from "@/components/site/bang-so-sanh";
import { duAn, lienKet, phanKhu, soLieu } from "@/data/project";
import type { ProjectImageName } from "@/data/images.generated";

export const metadata: Metadata = {
  alternates: { canonical: "/du-an" },
  title: "Thông tin dự án",
  description: `Thông số, quy hoạch, tiện ích, pháp lý và thư viện phối cảnh ${duAn.ten}.`,
};

/**
 * Thư viện phối cảnh.
 *
 * ⚠️ KHÔNG ĐƯỢC CHỨA ẢNH ĐANG LÀM ẢNH MỞ ĐẦU CỦA CHÍNH TRANG NÀY.
 *
 * Ô đầu tiên từng là `khu-1-view-bien` — đúng tấm phủ kín màn hình ngay phía
 * trên. Người xem cuộn một nhịp là gặp lại y nguyên tấm vừa nhìn, và thứ đọng
 * lại là "trang này có mỗi mấy tấm ảnh", trong khi danh mục có năm mươi hai
 * tấm. Trùng trong cùng một màn hình đắt hơn trùng giữa hai trang rất nhiều.
 *
 * Ô cuối từng là `khu-1-cong-vien-hoang-hon`, chú thích "Công viên trung tâm".
 * Mở ảnh ra xem thì đó là ảnh chụp cả bán đảo từ trên cao — không có công viên
 * nào trong khung hình. Chú thích sai kiểu này tệ hơn không chú thích: người
 * mua tìm công viên trong ảnh, không thấy, rồi bắt đầu ngờ những con số khác
 * trên trang.
 *
 * Hai tấm thay vào đều thuộc nhóm chưa trang nào dùng, và cùng chụp ở TẦM MẮT
 * NGƯỜI ĐỨNG DƯỚI ĐẤT — thứ mà sáu tấm phối cảnh từ trên cao không cho thấy.
 */
const thuVien: { anh: ProjectImageName; chuThich: string }[] = [
  { anh: "vbm-hoan-thien-03", chuThich: "Dãy nhà phố ven kênh lúc hoàng hôn" },
  { anh: "view-san-golf", chuThich: "Khu biệt thự cạnh sân golf" },
  { anh: "cao-tang-02", chuThich: "Quần thể căn hộ cao tầng" },
  { anh: "san-pham-biet-thu-bien", chuThich: "Biệt thự hướng biển" },
  { anh: "san-pham-lien-ke", chuThich: "Dãy phố liền kề" },
  {
    anh: "kien-truc-don-lap-02",
    chuThich: "Biệt thự đơn lập nhìn từ đường nội khu",
  },
];

const thongSo = [
  { nhan: "Tên dự án", giaTri: duAn.ten },
  { nhan: "Tên gọi khác", giaTri: duAn.tenKhac },
  { nhan: "Vị trí", giaTri: duAn.viTri },
  { nhan: "Chủ đầu tư", giaTri: duAn.chuDauTu },
  { nhan: "Pháp lý", giaTri: duAn.phapLy },
  { nhan: "Tình trạng", giaTri: duAn.tinhTrang },
];

export default function TrangDuAn() {
  return (
    <>
      {/* ============================== MỞ ĐẦU =============================== */}
      <section className="relative flex min-h-[72svh] items-end overflow-hidden">
        <ProjectImage
          name="khu-1-view-bien"
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
        />

        <div className="relative mx-auto w-full max-w-[92rem] px-6 pb-20 pt-40 md:px-10">
          <h1 className="max-w-4xl font-display text-h1 font-normal">
            <SplitReveal text={duAn.ten} stagger={80} />
          </h1>
        </div>
      </section>

      {/* ============================== SỐ LIỆU ============================== */}
      <section className="py-nhip">
        <div className="mx-auto max-w-[92rem] px-6 md:px-10">
          <dl className="grid grid-cols-2 border-t border-ink-line lg:grid-cols-4">
            {soLieu.map((muc, thuTu) => (
              <Reveal
                key={muc.nhan}
                delay={thuTu * 90}
                className="border-b border-ink-line px-1 py-10 lg:border-r lg:last:border-r-0"
              >
                <dt className="text-label uppercase text-paper-dim">
                  {muc.nhan}
                </dt>
                <dd className="mt-5 flex items-baseline gap-2">
                  <span className="tabular font-display text-h1 font-normal leading-none">
                    <CountUp giaTri={muc.giaTri} />
                  </span>
                  {muc.donVi ? (
                    <span className="text-sm text-paper-dim">{muc.donVi}</span>
                  ) : null}
                </dd>
                {/* Nhãn nhắc việc, CHỈ hiện khi chạy máy dev — người xem thật
                    không bao giờ thấy, còn người làm thì không quên xác nhận. */}
                {process.env.NODE_ENV !== "production" && muc.canXacNhan ? (
                  <p className="mt-3 text-xs text-jade">⚠ cần xác nhận số liệu</p>
                ) : null}
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ============================== THÔNG SỐ ============================= */}
      <section className="pb-nhip">
        <div className="mx-auto grid max-w-[92rem] gap-12 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-3">
            <h2 className="text-label uppercase text-jade">Thông số</h2>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <dl>
              {thongSo.map((muc, thuTu) => (
                <Reveal key={muc.nhan} delay={thuTu * 60}>
                  <div className="grid gap-2 border-b border-ink-line py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
                    <dt className="text-sm text-paper-dim">{muc.nhan}</dt>
                    <dd className="text-lead">{muc.giaTri}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ========================== PHÂN KHU & TIỆN ÍCH ======================
          Trang chủ cho bấm trên sơ đồ; ở đây liệt kê đầy đủ cả chín phân khu để
          người muốn đọc kỹ không phải bấm từng cái một. */}
      <section className="border-y border-ink-line bg-ink-soft py-nhip">
        <div className="mx-auto max-w-[92rem] px-6 md:px-10">
          <h2 className="max-w-3xl font-display text-h1 font-normal">
            <SplitReveal text="Chín vịnh và đảo, *một* đô thị" />
          </h2>

          <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {phanKhu.map((khu, thuTu) => (
              <Reveal key={khu.ma} delay={(thuTu % 3) * 90}>
                <div className="border-t border-ink-line pt-6">
                  <p className="text-label uppercase text-paper/35">
                    {khu.tenTiengAnh}
                  </p>
                  <h3 className="mt-2.5 font-display text-h3 font-normal">
                    {khu.ten}
                  </h3>
                  <ul className="mt-5 space-y-2.5">
                    {khu.diemNhan.map((diem) => (
                      <li
                        key={diem}
                        className="flex gap-3 text-sm leading-relaxed text-paper-dim"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1 shrink-0 bg-jade"
                        />
                        <span>{diem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-16">
            <ProjectImage
              name="tmb-tong-tien-ich"
              alt="Sơ đồ tổng mặt bằng và hệ tiện ích toàn dự án"
              sizes="100vw"
              className="w-full object-contain"
            />
          </Reveal>
        </div>
      </section>

      {/* ============================ THƯ VIỆN ẢNH =========================== */}
      <section className="py-nhip">
        <div className="mx-auto max-w-[92rem] px-6 md:px-10">
          <h2 className="max-w-2xl font-display text-h1 font-normal">
            <SplitReveal text="Phối cảnh *dự án*" />
          </h2>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {thuVien.map((muc, thuTu) => (
              <Reveal key={muc.anh} delay={(thuTu % 3) * 100}>
                <figure>
                  <ProjectImage
                    name={muc.anh}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-4/3 w-full object-cover"
                  />
                  <figcaption className="mt-4 text-sm text-paper-dim">
                    {muc.chuThich}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== BẢNG HÀNG ============================ */}
      <section id="bang-hang" className="scroll-mt-24 pb-nhip">
        <div className="mx-auto max-w-[92rem] px-6 md:px-10">
          <h2 className="max-w-3xl font-display text-h1 font-normal">
            <SplitReveal text="Quỹ căn *đang mở bán*" />
          </h2>
          {/* TÓM TẮT, KHÔNG PHẢI CẢ BẢNG. Xem ghi chú trong
              `bang-hang-quanh-day.tsx` về 1,45 MB và chuyện trùng nội dung
              với `/quy-can-global-gate-ha-long`. */}
          <ClipReveal delay={140} className="mt-12">
            <TomTatBangHang />
          </ClipReveal>
        </div>
      </section>

      {/* ============================== SO SÁNH ============================== */}
      <section className="border-y border-ink-line bg-ink-soft py-nhip">
        <div className="mx-auto max-w-[92rem] px-6 md:px-10">
          <h2 className="max-w-3xl font-display text-h1 font-normal">
            <SplitReveal text="Dòng nào *hợp với bạn*" />
          </h2>
          <ClipReveal delay={140} className="mt-12">
            <BangSoSanh />
          </ClipReveal>
        </div>
      </section>

      {/* ========================= TIẾN ĐỘ THANH TOÁN ======================== */}
      <section className="py-nhip">
        <div className="mx-auto max-w-[92rem] px-6 md:px-10">
          <h2 className="max-w-3xl font-display text-h1 font-normal">
            <SplitReveal text="Đóng tiền *theo đợt*" />
          </h2>
          <ClipReveal delay={140} className="mt-12">
            <TienDoThanhToan />
          </ClipReveal>
        </div>
      </section>

      {/* ============================ PHÁP LÝ & TOUR ========================= */}
      <section className="pb-nhip">
        <div className="mx-auto grid max-w-[92rem] gap-14 px-6 md:grid-cols-2 md:px-10">
          <Reveal>
            <h2 className="font-display text-h2 font-normal">
              Hồ sơ và tài liệu
            </h2>
            <p className="mt-5 max-w-md text-paper-dim">
              Quyết định chấp thuận đầu tư, quyết định giao đất và cam kết bảo
              lãnh ngân hàng được công bố tại cổng thông tin của chủ đầu tư.
            </p>
            <a
              href={lienKet.hoSoPhapLy}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block border border-paper/25 px-8 py-4 text-label uppercase transition-colors hover:bg-paper hover:text-ink"
            >
              Xem hồ sơ pháp lý
            </a>
          </Reveal>

          {/* Khối tour CHỈ hiện khi có link chạy được. Link Kuula cũ đã bị khoá
              riêng tư nên để trống — xem ghi chú ở `data/project.ts`. */}
          {lienKet.tour360 ? (
            <Reveal delay={120}>
              <h2 className="font-display text-h2 font-normal">
                Tour thực tế ảo 360°
              </h2>
              <p className="mt-5 max-w-md text-paper-dim">
                Đi qua từng phân khu và không gian mẫu ngay trên trình duyệt.
              </p>
              <a
                href={lienKet.tour360}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block border border-paper/25 px-8 py-4 text-label uppercase transition-colors hover:bg-paper hover:text-ink"
              >
                Mở tour 360°
              </a>
            </Reveal>
          ) : (
            <Reveal delay={120}>
              <h2 className="font-display text-h2 font-normal">
                Tiến độ xây dựng
              </h2>
              <p className="mt-5 max-w-md text-paper-dim">
                Hình ảnh và mốc thi công được cập nhật theo tháng.
              </p>
              <Link
                href="/tin-tuc"
                className="mt-8 inline-block border border-paper/25 px-8 py-4 text-label uppercase transition-colors hover:bg-paper hover:text-ink"
              >
                Xem tin tức
              </Link>
            </Reveal>
          )}
        </div>

        <div className="mx-auto mt-24 max-w-[92rem] px-6 md:px-10">
          <Reveal>
            <div className="border-t border-ink-line pt-12">
              <p className="max-w-xl text-lead text-paper-dim">
                Cần bảng giá, chính sách bán hàng và quỹ căn đang mở?
              </p>
              <Link
                href="/lien-he"
                className="mt-7 nut nut-phu"
              >
                Đăng ký nhận tư vấn
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
