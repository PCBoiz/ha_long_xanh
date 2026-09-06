import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { GapMo } from "@/components/ui/gap-mo";
import { cauHoiThuongGap } from "@/data/project";

/**
 * Câu hỏi thường gặp.
 *
 * HAI QUYẾT ĐỊNH ĐÁNG GHI LẠI.
 *
 * 1. MỞ SẴN Ở MÁY BÀN, GẤP LẠI TRÊN DI ĐỘNG.
 *
 *    Bản trước không gấp gì cả, với lý do: câu trả lời gấp lại thì người đọc
 *    phải bấm mới biết bên trong có gì, mà phần lớn không bấm. Lý do đó vẫn
 *    đúng — nhưng chỉ đúng ở nơi có chỗ để mở hết. Trên điện thoại, bảy câu
 *    hỏi mở sẵn là gần bốn màn hình chữ mà người đọc phải cuộn qua để tới
 *    được nút gọi.
 *
 *    `GapMo` giải quyết cả hai: HTML dựng ra luôn ở trạng thái mở, và chỉ khi
 *    màn hình hẹp mới gấp lại. Hỏng JavaScript thì mở hết như cũ. Chữ nằm
 *    trong HTML ở cả hai trạng thái nên công cụ tìm kiếm đọc được như nhau.
 *
 * 2. GIỮ CẢ CÂU CHƯA TRẢ LỜI ĐƯỢC. "Giá bao nhiêu" và "thanh toán mấy đợt" đều
 *    có câu trả lời hiện nay là "chưa công bố". Bỏ hai câu đó khỏi danh sách
 *    không làm khách thôi thắc mắc — chỉ làm họ đi tìm chỗ khác để hỏi.
 *
 * Nội dung nằm ở `data/project.ts`; mảng này cũng là nguồn của khối dữ liệu có
 * cấu trúc FAQPage, nên sửa một chỗ là đổi cả hai.
 */
export function CauHoiThuongGap() {
  if (cauHoiThuongGap.length === 0) return null;

  return (
    <section id="cau-hoi" className="mang-sang scroll-mt-24 py-nhip">
      <Khung>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <h2 className="max-w-xl font-display text-h1 font-normal text-balance">
            Những câu khách hỏi trước khi gọi
          </h2>
          <Link
            href="/lien-he"
            className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
          >
            Hỏi câu chưa có ở đây
          </Link>
        </div>

        {/* ĐÃ BỎ `dl`/`dt`/`dd`, và lý do đáng ghi lại.
            
            Bản trước dùng `dl` với lập luận: đây là danh sách cặp thuật ngữ và
            định nghĩa, trình đọc màn hình sẽ đọc ra quan hệ hỏi–đáp. Lập luận
            đúng — cho tới khi thêm `GapMo` vào giữa.
            
            `GapMo` bọc nội dung trong `<details>` và `<summary>`. Kết quả là
            `<dt>` nằm trong `<summary>`, `<dd>` nằm trong một `<div>` — cả hai
            đều KHÔNG còn là con trực tiếp của `dl`, tức là HTML sai chuẩn. Và
            khi sai chuẩn thì trình đọc màn hình không đọc ra quan hệ hỏi–đáp
            nữa: được cái tệ nhất của cả hai đường.
            
            `<details>`/`<summary>` tự nó đã là phần tử đúng cho khối gấp mở —
            trình đọc màn hình thông báo nó là một nút bung/thu, kèm trạng thái.
            Quan hệ hỏi–đáp cho MÁY vẫn còn nguyên trong dữ liệu có cấu trúc
            FAQPage, sinh từ cùng một mảng dữ liệu. */}
        <ul className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {cauHoiThuongGap.map((muc, thuTu) => (
            <li key={muc.hoi} className="border-t border-ink-line pt-4 md:pt-6">
              {/* BA CÂU ĐẦU MỞ SẴN, SÁU CÂU SAU GẤP LẠI — KỂ CẢ MÁY BÀN.

                  Đo ngày 07/09/2026: trang chủ 2.434 từ, hơn 12 phút đọc.
                  Riêng khối này khoảng 540 từ, và trên máy bàn mở hết chín câu.

                  Giá trị của khối KHÔNG nằm ở việc đọc hết chín câu trả lời —
                  nó nằm ở việc thấy được CHÍN CÂU HỎI, tức biết ngay ở đây có
                  trả lời những gì. Gấp lại vẫn giữ nguyên phần đó.

                  Ba câu đầu mở sẵn để khối không trông như một hàng nút câm,
                  và để người lướt nhanh vẫn nhận được câu trả lời hay hỏi nhất
                  mà không phải bấm. */}
              <GapMo
                gapCaOMayBan={thuTu >= 3}
                tomTat={
                  <h3 className="font-display text-h3 font-normal text-balance">
                    {muc.hoi}
                  </h3>
                }
              >
                <p className="mt-3 max-w-[62ch] text-body leading-relaxed text-paper-dim">
                  {muc.dap}
                </p>
              </GapMo>
            </li>
          ))}
        </ul>
      </Khung>
    </section>
  );
}
