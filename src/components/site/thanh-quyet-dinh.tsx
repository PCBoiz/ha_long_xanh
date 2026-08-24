import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { lienKet } from "@/data/project";

/**
 * Dải quyết định nhanh, đặt ngay dưới mảng mở đầu.
 *
 * VẤN ĐỀ NÓ GIẢI: trang chủ cao 11.000 điểm ảnh, tức mười bảy màn hình. Người
 * vào với một câu hỏi cụ thể — "còn căn nào", "chính sách gì", "dòng nào hợp
 * với tôi" — hiện phải cuộn qua toàn bộ phần kể chuyện mới tới được câu trả
 * lời, hoặc phải đoán xem mục menu nào chứa nó.
 *
 * Dải này là năm đường tắt, đặt ở đúng chỗ mắt dừng lại sau mảng mở đầu.
 *
 * VÌ SAO KHÔNG PHẢI THANH DÍNH THEO CUỘN: thanh dính chiếm chỗ vĩnh viễn trên
 * màn hình điện thoại, và trang đã có một thanh điều hướng dính rồi. Hai thanh
 * dính chồng nhau ăn mất một phần ba màn hình đọc.
 *
 * Mỗi mục dùng ĐỘNG TỪ chứ không phải danh từ. "Quỹ căn" là một chủ đề; "Xem
 * quỹ căn" là một việc làm được — và người đang có câu hỏi thì tìm việc làm.
 */

interface Muc {
  nhan: string;
  phu: string;
  href: string;
}

const MUC: Muc[] = [
  {
    nhan: "Xem quỹ căn & giá",
    phu: "Những gì đã công bố",
    href: "/quy-can-global-gate-ha-long",
  },
  {
    nhan: "Tìm dòng hợp với tôi",
    phu: "Ba câu hỏi",
    href: "/#tim-can",
  },
  {
    nhan: "Kiểm giá thực trả",
    phu: "Trước khi đặt cọc",
    href: "/gia-thuc-tra-global-gate-ha-long",
  },
  {
    nhan: "Đọc hồ sơ pháp lý",
    phu: "Không cần đăng ký",
    href: "/tai-lieu",
  },
  {
    nhan: "Xem tiềm năng đầu tư",
    phu: "Cả cơ hội và rủi ro",
    href: "/dau-tu",
  },
];

export function ThanhQuyetDinh() {
  // Tour 360° chỉ thêm vào khi có đường dẫn chạy được — xem `data/project.ts`.
  const muc: Muc[] = lienKet.tour360
    ? [
        ...MUC,
        { nhan: "Đi tour 360°", phu: "Xem tận nơi", href: lienKet.tour360 },
      ]
    : MUC;

  return (
    <section
      aria-label="Đường tắt tới thông tin thường được hỏi"
      className="border-b border-ink-line bg-ink-soft"
    >
      <Khung>
        {/* Lưới tự giãn theo số mục: thêm hay bớt một mục không phải sửa lớp.
            `minmax(0, 1fr)` chứ không phải `1fr` — không có `minmax(0,…)` thì ô
            lưới không co xuống dưới bề rộng nội dung và hàng tràn ngang trên
            màn hẹp. */}
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] divide-y divide-ink-line md:divide-x md:divide-y-0">
          {muc.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                className="group flex h-full min-h-20 flex-col justify-center gap-1 px-1 py-5 transition-colors md:px-6"
              >
                <span className="text-h4 transition-colors group-hover:text-jade">
                  {m.nhan}
                </span>
                <span className="text-small text-paper-dim">{m.phu}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Khung>
    </section>
  );
}
