import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";
import { benBan, duAn, lienHe, lienKet } from "@/data/project";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-line bg-ink text-paper">
      {/* Dải chữ chạy ngang ngay trước chân trang — đúng vị trí của
          `marquee_section` trong bản tham chiếu. */}
      <div className="border-b border-ink-line">
        <Marquee
          items={[duAn.tenNgan, duAn.viTri, "Sở hữu lâu dài", "Vịnh di sản"]}
        />
      </div>

      <div className="mx-auto max-w-[92rem] px-6 py-nhip md:px-10">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-h2 font-normal leading-tight">
              {duAn.ten}
            </p>
            <p className="mt-5 max-w-md text-body leading-relaxed text-paper-dim">
              {duAn.moTaNgan}
            </p>
          </div>

          {/* Chân trang liệt kê ĐỦ các trang thật. Trước đây nó trỏ về
              `/#phoi-canh` và `/#dang-ky` — hai cái neo trong trang chủ, nên
              chân trang chẳng dẫn đi đâu cả.

              ⚠️ ĐỢT NÀY THÊM NĂM TRANG BỊ BỎ QUÊN, và đó là một lỗi đắt.
              `/chinh-sach-global-gate-ha-long`, `/phap-ly-global-gate-ha-long`, `/tien-do-global-gate-ha-long`, `/gia-tri-tai-san-global-gate-ha-long` và
              `/voucher-vinhomes` dựng xong nhưng KHÔNG có liên kết nào trỏ tới
              từ trang chủ hay chân trang — chỉ nằm trong menu thả xuống, thứ
              phải rê chuột mới mở. Đo trên bản dựng: mã nguồn trang chủ không
              chứa địa chỉ nào trong số đó.

              Hậu quả gấp đôi. Người đọc không tình cờ gặp chúng. Và với công cụ
              tìm kiếm, một trang không được trang nào trỏ tới là trang gần như
              không tồn tại — nó nằm trong sitemap nhưng không nhận được chút
              sức mạnh liên kết nào, nên xếp hạng sau cùng.

              QUY TẮC TỪ NAY: thêm một trang thì thêm luôn một dòng ở đây. Menu
              thả xuống KHÔNG tính là liên kết nội bộ. */}
          <CotLienKet
            tieuDe="Tìm hiểu dự án"
            muc={[
              { nhan: "Thông tin dự án", href: "/du-an" },
              { nhan: "Quy hoạch & phân khu", href: "/quy-hoach" },
              { nhan: "Vị trí & kết nối", href: "/vi-tri-global-gate-ha-long" },
              { nhan: "Tiện ích", href: "/tien-ich" },
              { nhan: "Tiến độ thi công", href: "/tien-do-global-gate-ha-long" },
              { nhan: "Tin tức", href: "/tin-tuc" },
            ]}
          />

          <CotLienKet
            tieuDe="Trước khi quyết định"
            muc={[
              { nhan: "Giá bao nhiêu", href: "/gia-global-gate-ha-long" },
              { nhan: "Quỹ căn đang bán", href: "/quy-can-global-gate-ha-long" },
              { nhan: "Giá thực trả", href: "/gia-thuc-tra-global-gate-ha-long" },
              { nhan: "Chính sách bán hàng", href: "/chinh-sach-global-gate-ha-long" },
              // HAI NHÃN NÀY ĐÃ ĐỔI ĐỂ KHỚP THANH ĐIỀU HƯỚNG TRÊN ĐẦU.
              //
              // Chân trang dễ thành kho lưu dấu vết của bản chiến lược cũ nhất:
              // nó ít bị nhìn tới nên mỗi lần đổi định vị là bị bỏ quên. Đo được
              // lần này: cùng một trang `/voucher-vinhomes` mang HAI cái tên
              // khác nhau ở hai chỗ điều hướng.
              //
              // "Hỗ trợ quyền lợi" hàm ý người đọc PHẢI CÓ SẴN quyền lợi nào đó
              // thì mới được hỗ trợ — đúng ngược với nhóm khách trang này muốn
              // kéo, là người CHƯA có voucher.
              { nhan: "Chưa có voucher Vin?", href: "/voucher-vinhomes" },
              { nhan: "Giá trị tài sản", href: "/gia-tri-tai-san-global-gate-ha-long" },
              { nhan: "Pháp lý", href: "/phap-ly-global-gate-ha-long" },
              // "Phân tích đầu tư" đặt trọng tâm vào mua-để-đầu-tư. Trang này
              // nói cả cơ hội lẫn rủi ro, nên gọi đúng nội dung của nó vừa
              // trung thực hơn vừa không lệch định vị.
              { nhan: "Cơ hội và rủi ro", href: "/dau-tu" },
              { nhan: "Tài liệu", href: "/tai-lieu" },
              { nhan: "Liên hệ tư vấn", href: "/lien-he" },
            ]}
          />

          <div>
            <p className="text-label uppercase text-jade">Liên hệ</p>
            <ul className="mt-5 flex flex-col text-small text-paper/80">
              <li className="flex min-h-11 items-center">{duAn.viTri}</li>
              {lienHe.hotline ? (
                <li>
                  <a
                    href={`tel:${lienHe.hotline.replace(/\s/g, "")}`}
                    data-do="goi"
                    data-do-chi-tiet="chan-trang"
                    className="link-underline flex min-h-11 items-center"
                  >
                    {lienHe.hotline}
                  </a>
                </li>
              ) : null}
              {/* Zalo đặt ngay dưới số gọi. Ở Việt Nam đây là hai đường liên
                  hệ thật sự có người bấm; dòng email cũ đã bỏ hẳn — xem ghi
                  chú ở `lienHe` trong `data/project.ts`. */}
              {lienHe.zalo ? (
                <li>
                  <a
                    href={`https://zalo.me/${lienHe.zalo.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    data-do="zalo"
                    data-do-chi-tiet="chan-trang"
                    className="link-underline flex min-h-11 items-center"
                  >
                    Nhắn Zalo
                  </a>
                </li>
              ) : null}
              {/* Chỉ hiện khi có link tour chạy được — xem `data/project.ts`. */}
              {lienKet.tour360 ? (
                <li>
                  <a
                    href={lienKet.tour360}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline flex min-h-11 items-center"
                  >
                    Tham quan 360°
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/*
          BA DÒNG DƯỚI ĐÂY LÀ PHẦN PHÁP LÝ CỦA CHÂN TRANG. Đừng gộp lại cho gọn:
          mỗi dòng trả lời một câu hỏi khác nhau, và câu thứ hai là câu mới thêm
          vào bản này.

            1. Ảnh và số liệu là minh hoạ  → tránh hiểu nhầm về sản phẩm
            2. Trang này KHÔNG PHẢI của chủ đầu tư → tránh hiểu nhầm về người bán
            3. Chủ đầu tư là ai            → nói đúng nguồn của dự án

          Câu 2 quan trọng hơn vẻ ngoài của nó. Không có câu đó, một trang chỉ
          nhắc tên Vinhomes ở mọi mảng sẽ đọc ra như trang chính thức của
          Vinhomes — và để khách hiểu nhầm điều đó là rủi ro pháp lý thật, chứ
          không phải chuyện chữ nghĩa.
        */}
        <div className="mt-nhip border-t border-ink-line pt-8">
          {/* Danh tính bên bán. Tự ẩn khi chưa điền — xem `benBan` trong
              `data/project.ts`. */}
          {benBan.ten ? (
            <div className="mb-7">
              <p className="text-label uppercase text-jade">{benBan.vaiTro}</p>
              <p className="mt-2 font-display text-h3 font-normal">
                {benBan.ten}
              </p>
              <p className="mt-1.5 text-small text-paper/60">
                {[benBan.maSoThue && `MST ${benBan.maSoThue}`, benBan.vanPhong]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          ) : null}

          <p className="max-w-[68ch] text-small leading-relaxed text-paper/35">
            Hình ảnh, sơ đồ và thông tin trên trang mang tính minh hoạ. Số liệu
            thực tế căn cứ theo hồ sơ pháp lý và hợp đồng mua bán do chủ đầu tư
            phát hành tại thời điểm giao dịch.
          </p>
          <p className="mt-3 max-w-[68ch] text-small leading-relaxed text-paper/35">
            Đây là trang thông tin do {benBan.ten || benBan.vaiTro.toLowerCase()}{" "}
            lập, không phải trang chính thức của chủ đầu tư.{" "}
            {/* Câu thứ hai nói rõ số liệu trên trang được đối chiếu KHI NÀO.
                Thiếu nó, dòng miễn trừ chỉ nói trang này là ai — chưa nói giá,
                quỹ căn, chính sách và pháp lý ở đây có thể đã đổi kể từ lúc
                đăng. Đó mới là phần khách cần biết trước khi tin một con số. */}
            Thông tin giá, quỹ căn, chính sách và pháp lý được đối chiếu tại
            thời điểm tư vấn.
          </p>
          <p className="mt-4 text-small text-paper/35">
            Chủ đầu tư: {duAn.chuDauTu}
          </p>
        </div>
      </div>
    </footer>
  );
}

function CotLienKet({
  tieuDe,
  muc,
}: {
  tieuDe: string;
  muc: { nhan: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-label uppercase text-jade">{tieuDe}</p>
      {/* HAI CỘT TRÊN ĐIỆN THOẠI, MỘT CỘT TỪ MÀN HÌNH VỪA TRỞ LÊN.

          Đo bằng trình duyệt thật ngày 07/09/2026, khung 390×844:
          chân trang cao 1.788px = 2,4 màn hình — MẢNG CAO NHẤT TRANG CHỦ,
          cao hơn cả mảng mở đầu. Trong đó 836px là mười tám đường dẫn xếp
          một cột dọc.

          Mỗi ô vẫn giữ chiều cao tối thiểu 44px (`min-h-11`) nên vùng chạm
          không nhỏ đi — chỉ là hai đường dẫn nằm cạnh nhau thay vì chồng
          lên nhau. Tiết kiệm khoảng 400px, tức nửa màn hình cuộn.

          Từ `md` trở lên giữ nguyên một cột, vì ở đó chân trang đã là lưới
          bốn cột — thêm cột nữa là chia bốn thành tám. */}
      <ul className="mt-5 grid grid-cols-2 gap-x-6 text-small md:flex md:flex-col">
        {muc.map((m) => (
          <li key={m.href}>
            <Link
              href={m.href}
              className="link-underline flex min-h-11 items-center text-paper/80"
            >
              {m.nhan}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
