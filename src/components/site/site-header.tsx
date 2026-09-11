"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { benBan, dongSanPham } from "@/data/project";

/**
 * Điều hướng — GOM NHÓM, không còn hàng ngang phẳng.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO ĐỔI
 *
 * Bản trước là sáu mục ngang hàng: Quy hoạch · Tiện ích · Vị trí · Dự án ·
 * Bảng hàng · Tin tức. Sáu mục phẳng có ba vấn đề:
 *
 *  1. KHÔNG NÓI RA CẤU TRÚC. "Quy hoạch", "Tiện ích" và "Vị trí" đều là các
 *     mặt của cùng một thứ — hồ sơ dự án — nhưng bày ngang hàng thì người đọc
 *     phải tự ghép lại.
 *
 *  2. CHẠM TRẦN. Trang giờ có mười ba đích đến. Thêm nữa vào hàng ngang là
 *     đúng cái lỗi mà bản thiết kế 2.0 gọi tên: "không đưa 15–16 menu ngang
 *     hàng".
 *
 *  3. KHÔNG CÓ CHỖ CHO HÀNH ĐỘNG. Menu toàn danh từ thì không mục nào là việc
 *     cần làm. Giờ có một nút hành động tách hẳn ra khỏi danh sách.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VỀ MENU THẢ XUỐNG VÀ BÀN PHÍM
 *
 * Menu chỉ mở khi rê chuột là menu mà người dùng bàn phím và người dùng cảm
 * ứng KHÔNG BAO GIỜ mở được. Ở đây mỗi nhóm là một `button` thật:
 *
 *   · rê chuột vào  → mở (thói quen của người dùng chuột)
 *   · bấm / Enter   → mở (bàn phím và cảm ứng)
 *   · Esc           → đóng và trả tiêu điểm về nút
 *   · bấm ra ngoài  → đóng
 *
 * ĐIỂM NGẮT LÀ `lg` (1024px). Đo được ở bản trước: ở khổ 768px nội dung thanh
 * điều hướng rộng 881px trong khung 768px — tràn 113px, và mục "Liên hệ" bị
 * đẩy khỏi màn hình. Lỗi âm thầm vì trên màn 1440px mọi thứ vẫn hoàn hảo.
 */

interface Muc {
  nhan: string;
  href: string;
  /** Một dòng giải thích, chỉ hiện trong menu thả xuống. */
  mo?: string;
}

interface Nhom {
  ma: string;
  nhan: string;
  /** Trang đại diện của nhóm — bấm thẳng vào tên nhóm thì tới đây. */
  goc: string;
  muc: Muc[];
}

const NHOM: Nhom[] = [
  {
    ma: "du-an",
    nhan: "Dự án",
    goc: "/du-an",
    muc: [
      { nhan: "Tổng quan", href: "/du-an", mo: "Hồ sơ dự án đầy đủ" },
      { nhan: "Vị trí & kết nối", href: "/vi-tri-global-gate-ha-long", mo: "Trục hạ tầng vùng" },
      { nhan: "Quy hoạch", href: "/quy-hoach", mo: "Chín vịnh và đảo" },
      { nhan: "Tiện ích", href: "/tien-ich", mo: "Hạng mục và quy mô" },
    ],
  },
  {
    ma: "san-pham",
    nhan: "Sản phẩm",
    goc: "/quy-can-global-gate-ha-long",
    // Sinh từ dữ liệu thật: thêm một dòng sản phẩm là menu tự dài ra, không có
    // chuyện menu và trang lệch nhau.
    muc: dongSanPham.map((d) => ({
      nhan: d.ten,
      href: `/san-pham/${d.ma}`,
      mo: d.dienTich ? `${d.dienTich} m²` : undefined,
    })),
  },
  {
    ma: "gia",
    nhan: "Quỹ căn & giá",
    goc: "/quy-can-global-gate-ha-long",
    muc: [
      { nhan: "Giá bao nhiêu", href: "/gia-global-gate-ha-long", mo: "Khoảng giá theo từng dòng" },
      { nhan: "Quỹ căn đang bán", href: "/quy-can-global-gate-ha-long", mo: "Giá từng căn, có giờ cập nhật" },
      { nhan: "Chính sách bán hàng", href: "/chinh-sach-global-gate-ha-long", mo: "Sáu nhóm và chỗ đáng đọc kỹ" },
      { nhan: "Giá thực trả", href: "/gia-thuc-tra-global-gate-ha-long", mo: "Sáu việc trước khi đặt cọc" },
      {
        nhan: "Chưa có voucher Vin?",
        href: "/voucher-vinhomes",
        mo: "Rà soát quyền lợi áp dụng được",
      },
    ],
  },
  {
    ma: "gia-tri",
    nhan: "Giá trị",
    goc: "/gia-tri-tai-san-global-gate-ha-long",
    muc: [
      {
        nhan: "Có nên mua để ở",
        href: "/gia-tri-tai-san-global-gate-ha-long",
        mo: "Bốn yếu tố giữ giá trị",
      },
      { nhan: "Phân tích đầu tư", href: "/dau-tu", mo: "Cơ hội và cả rủi ro" },
    ],
  },
  {
    ma: "ho-so",
    nhan: "Hồ sơ",
    goc: "/phap-ly-global-gate-ha-long",
    muc: [
      { nhan: "Pháp lý", href: "/phap-ly-global-gate-ha-long", mo: "Năm giấy tờ cần đối chiếu" },
      { nhan: "Tiến độ thi công", href: "/tien-do-global-gate-ha-long", mo: "Hiện trạng công trường" },
      { nhan: "Toàn bộ tài liệu", href: "/tai-lieu", mo: "Không cần đăng ký" },
      { nhan: "Tin tức", href: "/tin-tuc", mo: "Cập nhật từ dự án" },
    ],
  },
];

export function SiteHeader() {
  const [daCuon, setDaCuon] = useState(false);
  const [moMenu, setMoMenu] = useState(false);
  const [moNhom, setMoNhom] = useState<string | null>(null);
  const duongDan = usePathname();
  const khungHeader = useRef<HTMLElement>(null);
  const maId = useId();

  useEffect(() => {
    const khiCuon = () => setDaCuon(window.scrollY > 40);
    khiCuon();
    window.addEventListener("scroll", khiCuon, { passive: true });
    return () => window.removeEventListener("scroll", khiCuon);
  }, []);

  // Khoá cuộn nền khi menu di động đang mở.
  useEffect(() => {
    document.body.style.overflow = moMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [moMenu]);

  // Đóng menu thả xuống khi bấm ra ngoài hoặc nhấn Esc.
  //
  // Thiếu phần này thì menu mở ra rồi ở lại đó che mất nội dung, và cách duy
  // nhất để đóng là rê chuột vào rồi rê ra — người dùng bàn phím kẹt hẳn.
  useEffect(() => {
    if (!moNhom) return;

    const khiBamNgoai = (su: MouseEvent) => {
      if (!khungHeader.current?.contains(su.target as Node)) setMoNhom(null);
    };
    const khiGoPhim = (su: KeyboardEvent) => {
      if (su.key === "Escape") setMoNhom(null);
    };

    document.addEventListener("mousedown", khiBamNgoai);
    document.addEventListener("keydown", khiGoPhim);
    return () => {
      document.removeEventListener("mousedown", khiBamNgoai);
      document.removeEventListener("keydown", khiGoPhim);
    };
  }, [moNhom]);

  const nenMo = daCuon || moMenu || moNhom !== null;
  const dangO = (href: string) =>
    duongDan === href || duongDan.startsWith(`${href}/`);
  const nhomDangO = (nhom: Nhom) => nhom.muc.some((m) => dangO(m.href));

  return (
    <header
      ref={khungHeader}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${
        nenMo
          ? "border-b border-ink-line bg-ink/95 backdrop-blur-lg"
          : "border-b border-transparent"
      }`}
    >
      {/* Khoảng cách giữa ba khối siết lại từ 1024 tới 1280px — khổ chật nhất
          của bố cục này. Từ 1280 trở lên thì nới ra như cũ. */}
      <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-6 py-3 md:px-10 xl:gap-6">
        <nav
          aria-label="Điều hướng chính"
          className="-ml-2.5 hidden flex-1 items-center gap-1 lg:flex"
          onMouseLeave={() => setMoNhom(null)}
        >
          {NHOM.map((nhom) => {
            const dangMo = moNhom === nhom.ma;
            const idBang = `${maId}-${nhom.ma}`;
            return (
              <div
                key={nhom.ma}
                className="relative"
                onMouseEnter={() => setMoNhom(nhom.ma)}
              >
                <button
                  type="button"
                  aria-expanded={dangMo}
                  aria-controls={idBang}
                  onClick={() => setMoNhom(dangMo ? null : nhom.ma)}
                  className={`link-underline inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap px-2.5 text-nav uppercase transition-colors hover:text-paper ${
                    nhomDangO(nhom) ? "text-paper" : "text-paper/60"
                  }`}
                >
                  {nhom.nhan}
                  {/* Mũi tên vẽ bằng SVG chứ không dùng ký tự `▾`.
                      Ký tự đó ở cỡ nhỏ của thanh điều hướng đọc ra thành một
                      dấu chấm — chụp màn hình kiểm lại thấy "DỰ ÁN ·" chứ
                      không phải một mũi tên, nên nó không nói được rằng bấm
                      vào sẽ mở ra menu. Hình dạng SVG không phụ thuộc vào phông
                      chữ nào đang được tải. */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 6"
                    className={`h-[5px] w-[9px] shrink-0 transition-transform duration-200 ${
                      dangMo ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M1 1l4 4 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {dangMo ? (
                  <div
                    id={idBang}
                    className="absolute left-0 top-full min-w-64 border border-ink-line bg-ink py-2 shadow-2xl shadow-black/40"
                  >
                    {/* Mục đầu tiên dẫn tới trang đại diện của nhóm. Không có
                        nó thì tên nhóm chỉ mở menu chứ không đi đâu được, và
                        người dùng bấm vào "Dự án" mong tới trang dự án sẽ hụt. */}
                    <ul>
                      {nhom.muc.map((m) => (
                        <li key={m.href}>
                          <Link
                            href={m.href}
                            onClick={() => setMoNhom(null)}
                            aria-current={dangO(m.href) ? "page" : undefined}
                            className={`block px-5 py-3 transition-colors hover:bg-ink-soft ${
                              dangO(m.href) ? "text-jade" : "text-paper"
                            }`}
                          >
                            <span className="block text-small">{m.nhan}</span>
                            {m.mo ? (
                              <span className="mt-0.5 block text-label text-paper-dim">
                                {m.mo}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <Link
          href="/"
          onClick={() => setMoMenu(false)}
          className="inline-flex min-h-11 items-center whitespace-nowrap font-display text-xl leading-none font-normal tracking-tight text-paper lg:text-center lg:text-[1.35rem]"
        >
          {/* ⚠️ CHỖ NÀY LÀ TÊN SITE, KHÔNG PHẢI TÊN DỰ ÁN (đổi 11/09).

              Trước đây hiện `duAn.tenNgan` — "Global Gate Hạ Long" — ở vị trí
              logo trên MỌI trang. Tức là site tự xưng là dự án của Vinhomes ở
              chỗ dễ thấy nhất, trong khi chân trang lại nói "không phải trang
              chính thức của chủ đầu tư". Hai câu ngược nhau, và câu sai là câu
              to hơn.

              Google liệt kê "heading và chữ trên trang chủ" là một nguồn để đặt
              tên site. Tra "halongxanh360" không ra trang này một phần vì
              không chỗ nào trên trang chủ gọi mình bằng tên đó. */}
          {benBan.ten}
        </Link>

        {/* Nút hành động TÁCH khỏi danh sách điều hướng, và là thứ duy nhất
            trên thanh này mang hình dáng nút. Menu là nơi để tìm; đây là việc
            để làm. */}
        <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
          {/* "Liên hệ" chỉ hiện từ 1280px trở lên.
              Đo ở khổ 1024px: nội dung thanh rộng 1.122px trong khung 1.024px
              — tràn 98px. Mục này là thứ đáng bỏ trước tiên vì nút bên cạnh
              dẫn tới cùng một luồng, và chân trang vẫn còn đường liên hệ. */}
          <Link
            href="/lien-he"
            className="link-underline hidden min-h-11 items-center whitespace-nowrap px-2.5 text-nav uppercase text-paper/60 transition-colors hover:text-paper xl:inline-flex"
          >
            Liên hệ
          </Link>
          {/* NÚT MẠNH NHẤT CỦA CẢ TRANG — và nó vừa đổi cả đích lẫn chữ.
              "Kiểm tra quỹ căn" mô tả một VIỆC, và là việc mọi trang bán dự án
              này đều mời làm. "Nhận phương án" mô tả THỨ KHÁCH NHẬN ĐƯỢC, và
              đó mới là điều chỉ nơi này làm: đối chiếu căn, chính sách và số
              tiền thực trả thành một phương án cho riêng người hỏi.
              Trang quỹ căn vẫn giữ nút "Kiểm tra quỹ căn" của nó. */}
          <Link href="/lien-he" className="nut nut-gon nut-chinh">
            Nhận phương án
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMoMenu((truoc) => !truoc)}
          aria-expanded={moMenu}
          aria-label={moMenu ? "Đóng menu" : "Mở menu"}
          className="-mr-3 inline-flex min-h-11 min-w-11 items-center justify-end px-3 text-nav uppercase text-paper lg:hidden"
        >
          {moMenu ? "Đóng" : "Menu"}
        </button>
      </div>

      {/* ───────────────────────── MENU DI ĐỘNG ────────────────────────────
          Mở sẵn TẤT CẢ các nhóm chứ không gấp lại. Mười ba đích đến trong một
          tấm cuộn được là hoàn toàn đọc hết được; bắt bấm mở từng nhóm thì
          thêm một cú chạm cho mỗi lần tìm, mà chẳng tiết kiệm được gì ngoài
          vài trăm điểm ảnh cuộn. */}
      {moMenu ? (
        <nav
          aria-label="Điều hướng di động"
          className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-ink-line bg-ink px-6 pb-12 pt-7 lg:hidden"
        >
          {NHOM.map((nhom) => (
            <div key={nhom.ma} className="mb-7">
              <p className="text-label uppercase text-jade">{nhom.nhan}</p>
              <ul className="mt-3 flex flex-col">
                {nhom.muc.map((m) => (
                  <li key={m.href}>
                    <Link
                      href={m.href}
                      // Đóng ngay trong sự kiện bấm chứ không đợi effect theo
                      // dõi đường dẫn: bấm vào chính trang đang mở thì đường
                      // dẫn không đổi nên effect không chạy — menu kẹt lại che
                      // kín màn hình.
                      onClick={() => setMoMenu(false)}
                      aria-current={dangO(m.href) ? "page" : undefined}
                      className={`flex min-h-12 items-center text-h4 ${
                        dangO(m.href) ? "text-jade" : "text-paper"
                      }`}
                    >
                      {m.nhan}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-3 border-t border-ink-line pt-7">
            <Link
              href="/lien-he"
              onClick={() => setMoMenu(false)}
              className="nut nut-chinh"
            >
              Nhận phương án
            </Link>
            <Link
              href="/lien-he"
              onClick={() => setMoMenu(false)}
              className="nut nut-phu"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
