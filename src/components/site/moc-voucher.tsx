import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { thongDiepChot } from "@/data/project";
import { DUONG_DAN } from "@/lib/duong-dan";

/**
 * Móc "chưa có voucher Vin" — đặt ngay đầu phễu trang chủ.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO KHỐI NÀY ĐỨNG THỨ BA TRÊN TRANG CHỦ, TRƯỚC CẢ SẢN PHẨM VÀ GIÁ
 *
 * Vì nó nói đúng câu mà tệp khách trọng tâm đang tự nói trong đầu, và không
 * trang nào khác nói ra.
 *
 * Người đã mua Vinhomes trước đó có voucher, nên họ mặc nhiên rẻ hơn. Người
 * CHƯA từng mua nhìn vào bảng giá niêm yết rồi kết luận mình đang trả giá cao
 * nhất — và phần lớn họ tự bỏ cuộc ở đúng ý nghĩ đó, im lặng, không hỏi ai.
 *
 * Đó là nhóm khách lớn nhất và ít được phục vụ nhất. Một dòng chữ thừa nhận
 * đúng nỗi lo ấy có sức giữ chân hơn mọi ảnh phối cảnh.
 *
 * ⚠️ RANH GIỚI CHỮ NGHĨA — GIỮ NGUYÊN KHI SỬA:
 *
 *   ĐƯỢC nói: giá niêm yết chưa phải số tiền cuối; có nhiều nhóm quyền lợi
 *   khác nhau; chúng tôi rà xem bạn chạm nhóm nào.
 *
 *   KHÔNG được nói: chắc chắn có voucher · giá thấp nhất · chiết khấu bí mật ·
 *   nguồn voucher ở đâu ra · cách gộp người · bất kỳ cơ chế thương mại nội bộ
 *   nào.
 *
 * Ranh giới này không phải chuyện thận trọng quá mức: hứa một khoản giảm giá
 * mà khách không đủ điều kiện nhận là thứ họ phát hiện ra đúng lúc ký, và lúc
 * đó mất cả giao dịch lẫn mọi giao dịch họ có thể giới thiệu.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function MocVoucher() {
  return (
    <section className="border-t border-ink-line py-nhip">
      <Khung>
        <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-display text-h1 font-normal text-balance">
              {thongDiepChot.voucher}
            </h2>
            {/* Câu thứ hai nói ĐIỀU GÌ thật sự quyết định số tiền. Không có nó,
                câu tiêu đề dễ bị đọc thành lời hứa giảm giá — thứ trang này
                không được phép hứa. */}
            <p className="mt-6 max-w-[52ch] text-lead leading-relaxed text-jade">
              {thongDiepChot.cungMotCan}
            </p>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            {/* Đoạn này ĐÃ RÚT NGẮN. Bản trước mở đầu bằng "cùng một căn,
                hai người có thể trả hai con số khác nhau" — giờ chính là câu
                tiêu đề phụ ở cột trái, nên nhắc lại là bắt người đọc đọc hai
                lần cùng một ý ngay trong một màn hình.

                ═══════════════════════════════════════════════════════════
                ⚠️ ĐÃ BỎ CÁCH NÓI "NHÓM QUYỀN LỢI MÀ RIÊNG BẠN CHẠM TỚI".

                Tiêu đề khối này mời đúng người CHƯA CÓ voucher. Rồi hai câu
                ngay bên cạnh lại nói về "nhóm quyền lợi bạn chạm tới" và "rà
                xem bạn đang chạm được vào nhóm nào" — tức là vẫn đặt điều kiện
                lên người đọc, và người chưa có gì sẽ tự trả lời: chắc mình
                không chạm được nhóm nào.

                Nửa trên của khối kéo họ vào, nửa dưới đẩy họ ra. Câu đứng sau
                là câu họ mang đi.

                Bản mới nói thẳng điều làm nên khác biệt: phần lớn số tiền
                chênh KHÔNG nằm ở voucher, nên chưa có voucher vẫn còn nguyên
                phần đáng rà.
                ═══════════════════════════════════════════════════════════ */}
            {/* ⚠️ ĐÃ GỘP HAI ĐOẠN THÀNH MỘT. ĐỪNG TÁCH LẠI.

                Bản trước có một đoạn riêng mở đầu bằng "Thứ làm số tiền đổi
                đi là chính sách đang áp dụng lúc anh/chị ký, tiến độ thanh
                toán chọn theo…" — đặt NGAY DƯỚI câu phụ ở cột trái vốn đã
                nói đúng điều đó bằng chữ khác.

                Đo ngày 07/09/2026 bằng cách bóc toàn bộ chữ trên trang chủ:
                cùng một ý được nói lại NĂM LẦN ở năm khối khác nhau. Đó là
                dấu hiệu rõ nhất của chữ do máy viết — mỗi khối sinh ra riêng
                lẻ nên khối nào cũng nhắc lại luận điểm chung.

                Bản này giữ nguyên phần cụ thể (chính sách, tiến độ) nhưng
                nhét vào đúng câu mang thông điệp riêng của khối — câu về
                voucher. Mất một đoạn, không mất thông tin nào. */}
            {/* ⚠️ ĐOẠN NÀY TỪNG TỰ PHÁ LỢI THẾ CỦA CHÍNH KHỐI. ĐỌC KỸ.

                Bản cũ mở đầu bằng "Chưa có voucher cũng không sao — phần lớn
                khoản chênh không nằm ở voucher."

                Nghe thì trấn an. Nhưng cả khối này tồn tại để mời người CHƯA
                CÓ voucher gọi cho mình. Câu đó lại tự nói với họ rằng voucher
                không quan trọng lắm — tức là dựng lợi thế lên ở tiêu đề rồi
                phá nó ngay dòng dưới.

                Nó còn tiết lộ quá nhiều CÁCH LÀM: nói rõ khoản chênh nằm ở
                chính sách và tiến độ thanh toán là chỉ luôn cho người đọc chỗ
                cần hỏi, và họ hỏi được ở bất cứ đâu.

                Bản này chỉ nói MỘT điều: đừng vội nhận phương án đang được
                báo, có một phương án nữa đáng xem. Rồi dừng. Không nói làm
                bằng cách nào. */}
            <p className="text-body leading-relaxed text-paper-dim">
              Chưa có voucher Vin không có nghĩa anh/chị nên chấp nhận ngay
              phương án đang được báo. Trước khi quyết định, hãy để tôi xây
              thêm một phương án riêng cho trường hợp của anh/chị và so lại số
              tiền thực trả.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href={DUONG_DAN.voucher} className="nut nut-chinh">
                {/* ⚠️ ĐÃ ĐỔI RỒI ĐỔI LẠI. GIỮ NGUYÊN CÂU NÀY.

                    Hôm 07/09 tôi đổi nhãn này thành "Xem cách tôi rà quyền
                    lợi", lý do: bảy nút trên trang chủ đều dùng chữ "phương
                    án" nên nhìn lướt không phân biệt được nút nào đi đâu.

                    Lý do đó đúng về mặt điều hướng nhưng SAI về mặt bán hàng.
                    "Xem cách tôi rà quyền lợi" mời người đọc đi HỌC CÁCH LÀM,
                    trong khi việc cần họ làm là gọi hoặc để lại nhu cầu. Một
                    cái nút tốt hứa thứ người đọc NHẬN ĐƯỢC, không mô tả việc
                    người viết sẽ làm.

                    Chuyện bảy nút trùng chữ vẫn có thật — nhưng gỡ nó ở chỗ
                    khác, không phải bằng cách đổi lời mời mạnh nhất trang. */}
                Xem phương án của tôi
              </Link>
              <Link
                href={DUONG_DAN.giaThucTra}
                className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
              >
                Giá thực trả gồm những gì
              </Link>
            </div>
          </div>
        </div>
      </Khung>
    </section>
  );
}
