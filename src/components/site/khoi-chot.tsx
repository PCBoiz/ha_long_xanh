import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { lienHe, thongDiepChot } from "@/data/project";
import { DUONG_DAN } from "@/lib/duong-dan";

/**
 * Khối chốt — đặt cuối những money page KHÔNG có biểu mẫu.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ LUẬN CỨ BAN ĐẦU CỦA KHỐI NÀY LÀ SAI. ĐỌC KỸ TRƯỚC KHI GẮN THÊM.
 *
 * Bản đầu ghi rằng bốn money page "KHÔNG có lấy một nút chuyển đổi chính nào".
 * Sai. Chúng không có nút `nut-chinh`, nhưng BỐN TRONG SÁU trang có sẵn
 * `<DangKyForm />` — tức là đã có lời mời mạnh nhất có thể: một biểu mẫu điền
 * ngay tại chỗ. Phép đếm ban đầu chỉ đếm class của nút, rồi kết luận thay cho
 * việc mở trang ra đọc.
 *
 * Hậu quả: gắn khối này vào cả sáu trang thì bốn trang thành ra HAI lời mời
 * dán liền nhau — trên `/quy-can` và `/chinh-sach` chỉ cách nhau sáu dòng, tức
 * là hai mảng kề nhau. Người đọc vừa nhìn thấy biểu mẫu, cuộn thêm một chút
 * lại gặp một nút xin đúng thứ đó. Xin hai lần trong một màn hình làm yếu cả
 * hai lần xin.
 *
 * ═══ QUY TẮC ═══
 * Trang ĐÃ có `<DangKyForm />` ở cuối  → KHÔNG gắn khối này.
 * Trang có lời mời riêng, cụ thể hơn   → KHÔNG gắn khối này.
 * Trang kết thúc bằng nội dung thuần   → GẮN.
 *
 * Hiện chỉ còn hai trang thoả: `/vi-tri-…` và `/phap-ly-…`. Cả hai kết thúc
 * bằng nội dung và trước đó không xin gì cả.
 *
 * Chữ lấy từ `thongDiepChot` trong `data/project.ts` — một chỗ khai, mọi nơi
 * đọc theo.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function KhoiChot({
  /** Một câu nối khối này với nội dung vừa đọc xong. Tuỳ chọn nhưng nên có. */
  dan,
}: {
  dan?: string;
}) {
  return (
    <section className="border-t border-ink-line py-nhip">
      <Khung>
        <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-h1 font-normal text-balance">
              <SplitReveal text={thongDiepChot.truocKhiQuyetDinh} />
            </h2>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            {dan ? (
              <p className="text-body leading-relaxed text-paper-dim">{dan}</p>
            ) : null}

            <p className="mt-5 max-w-[52ch] text-lead leading-relaxed text-jade">
              {thongDiepChot.cungMotCan}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href={DUONG_DAN.lienHe} className="nut nut-chinh">
                {thongDiepChot.nutChinh}
              </Link>
              {/* ⚠️ NÚT NÀY NHẮM MỘT NGƯỜI RẤT CỤ THỂ, ĐỪNG GỘP VỚI NÚT TRÊN.

                  Nút chính mời người CHƯA BIẾT GÌ bắt đầu tìm hiểu. Nút này
                  mời người ĐÃ ĐI XEM, ĐÃ CÓ BÁO GIÁ TRONG TAY, đang ở rất
                  gần lúc ký — và đó là người dễ chốt nhất trên cả trang.

                  Với họ, mọi lời mời "tìm hiểu dự án" đều vô nghĩa: họ tìm
                  hiểu xong rồi. Thứ họ còn thiếu là MỘT PHƯƠNG ÁN THỨ HAI để
                  đặt cạnh cái đang cầm. Không nút nào khác trên trang nói
                  với họ, nên họ đọc xong rồi đi.

                  Câu chữ cố ý thừa nhận họ đã có báo giá thay vì lờ đi. Người
                  đang cầm một bảng giá không muốn nghe mời chào lại từ đầu. */}
              <Link
                href={DUONG_DAN.lienHe}
                data-do="so-lai-bao-gia"
                className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-paper"
              >
                Tôi đã có báo giá — nhờ xem lại
              </Link>
              {/* Đường gọi thẳng đặt cạnh nút. Có người không bao giờ điền biểu
                  mẫu nhưng sẵn sàng bấm gọi — bắt họ đi tìm số ở chân trang là
                  mất đúng những người sốt ruột nhất. */}
              {lienHe.hotline ? (
                <a
                  href={`tel:${lienHe.hotline.replace(/\s/g, "")}`}
                  data-do="goi"
                  data-do-chi-tiet="khoi-chot"
                  className="link-underline tabular inline-flex min-h-11 items-center text-nav uppercase text-jade"
                >
                  Hoặc gọi {lienHe.hotline}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Khung>
    </section>
  );
}
