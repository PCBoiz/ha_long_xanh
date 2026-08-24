import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { GapMo } from "@/components/ui/gap-mo";
import { buocGiaThucTra, dinhViGiaThucTra } from "@/data/project";

/**
 * Mảng "Giá thực trả" ở trang chủ.
 *
 * Đây là mảng bán hàng thật sự của trang, và nó cố ý KHÔNG trông giống một
 * mảng bán hàng: không con số nhấp nháy, không đồng hồ đếm ngược, không chữ
 * "HOT". Với khách mua vài chục tỷ, những thứ đó không tạo áp lực mà tạo nghi
 * ngờ.
 *
 * Thứ tạo được cảm giác muốn gọi là một QUY TRÌNH nghe ra có người thật đang
 * làm việc thật — và cột "nếu bỏ qua" chính là chỗ đó. Một danh sách việc làm
 * chỉ nói "chúng tôi chăm chỉ"; danh sách việc làm kèm hậu quả của việc bỏ qua
 * nói "đây là những chỗ bạn có thể mất tiền".
 *
 * Nền TỐI, khác với các mảng bán hàng khác. Ba mảng nền sáng trên trang đều là
 * mảng thông tin — hồ sơ, số liệu, hỏi đáp. Mảng này là mảng thuyết phục, và
 * nền tối giữ nó ở đúng chất luxury thay vì trượt sang cảm giác tờ rơi.
 */
export function GiaThucTra() {
  return (
    <section
      id="gia-thuc-tra"
      className="scroll-mt-24 border-t border-ink-line py-nhip"
    >
      <Khung>
        <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-h1 font-normal text-balance">
              {dinhViGiaThucTra.chinh}
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="text-body leading-relaxed text-paper-dim">
              {dinhViGiaThucTra.phu}
            </p>
          </div>
        </div>

        {/* Danh sách có kẻ dòng, KHÔNG phải lưới thẻ.
            Sáu việc này là một quy trình có thứ tự — bước sau dựa trên bước
            trước. Lưới thẻ ba cột đọc ra thành sáu thứ ngang hàng và mất luôn
            trình tự, đúng phần khiến nó nghe ra như một quy trình thật. */}
        <ol className="mt-14 border-t border-ink-line">
          {buocGiaThucTra.map((buoc, thuTu) => (
            <li
              key={buoc.ten}
              className="border-b border-ink-line py-4 md:py-8"
            >
              {/* Trên di động sáu bước mở sẵn là hơn ba màn hình chữ nằm chắn
                  giữa phễu. Gấp lại thì người đọc thấy trọn cả sáu tên bước
                  trong một màn — tức là nắm được QUY TRÌNH ngay, rồi tự mở
                  bước nào họ quan tâm. Máy bàn vẫn mở hết như cũ. */}
              <GapMo
                tomTat={
                  <span className="flex items-baseline gap-4">
                    <span className="tabular text-label text-jade">
                      {String(thuTu + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-h3 font-normal text-balance">
                      {buoc.ten}
                    </span>
                  </span>
                }
              >
                <div className="mt-3 grid gap-x-10 gap-y-3 md:mt-0 md:grid-cols-8">
                  <p className="text-body leading-relaxed text-paper-dim md:col-span-4">
                    {buoc.moTa}
                  </p>

                  {/* Cột hậu quả. Mang sắc cảnh báo — đọc lướt cả mảng thì mắt
                      bắt được chuỗi rủi ro trước, và đó đúng là thứ cần bắt. */}
                  <p className="border-l border-warn/40 pl-5 text-small leading-relaxed text-paper-dim md:col-span-4">
                    <span className="mb-1 block text-label uppercase text-warn">
                      Nếu bỏ qua
                    </span>
                    {buoc.neuBoQua}
                  </p>
                </div>
              </GapMo>
            </li>
          ))}
        </ol>

        {/* ĐÃ GỠ MỘT DÒNG LẶP Ở ĐÂY.
            Bản trước đặt "Mua đúng căn quan trọng hơn mua nhanh." ngay trên
            nút — mà chính tiêu đề `h2` của mảng này (dòng ~32) đã nói đúng câu
            đó rồi, chỉ khác một dấu chấm. Hai dòng chữ to nhất mảng, cùng
            `font-display`, nói y hệt nhau: người đọc lướt qua bắt được cả hai
            và không nhận thêm được gì. */}
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href="/gia-thuc-tra-global-gate-ha-long" className="nut nut-chinh">
            Cách kiểm tra giá thực trả
          </Link>
          <Link
            href="/lien-he"
            className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
          >
            Nhờ rà soát phương án của tôi
          </Link>
        </div>
      </Khung>
    </section>
  );
}
