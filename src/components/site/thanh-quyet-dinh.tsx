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
    // Dòng phụ của các mục khác đều trả lời "được gì / phải lưu ý gì"
    // ("Những gì đã công bố", "Trước khi đặt cọc", "Cả cơ hội và rủi ro").
    // "Ba câu hỏi" thì chỉ mô tả cơ chế — nói công cụ hoạt động ra sao, trong
    // khi thứ người đọc đang cân nhắc là có nên bấm vào hay không. Điều giữ
    // họ lại là sợ bị đòi số điện thoại, nên trả lời đúng nỗi sợ đó.
    phu: "Không cần để lại số",
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
    // ĐỔI TỪ "Xem tiềm năng đầu tư" — VÀ ĐỔI CẢ ĐÍCH ĐẾN, không chỉ đổi chữ.
    //
    // Nhãn cũ trỏ sang `/dau-tu`, trang phân tích cơ hội và rủi ro, viết cho
    // người mua để đầu tư. Định vị đã chốt thì ngược lại: mua để Ở, và căn đó
    // vẫn giữ được giá trị.
    //
    // `/gia-tri-tai-san-…` mới đúng là trang trả lời câu đó — nó đọc số liệu
    // từ bảng hàng thật để xem một căn có giữ giá và dễ sang tay không, không
    // dự báo giá. Đổi mỗi cái nhãn mà vẫn trỏ sang trang đầu tư thì chữ nói
    // một đằng, trang mở ra một nẻo.
    nhan: "Giá trị tài sản",
    phu: "Ở hôm nay · giữ giá trị ngày mai",
    href: "/gia-tri-tai-san-global-gate-ha-long",
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
