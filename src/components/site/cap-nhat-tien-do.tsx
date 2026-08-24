import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { DUONG_DAN } from "@/lib/duong-dan";
import { docTheoChuyenMuc } from "@/lib/tin-tuc";
import { ngayVN } from "@/lib/thoi-gian";

/**
 * Cập nhật tiến độ mới nhất — money page ĐẦU TIÊN được nuôi bằng đường ống
 * đăng bài tự động.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO MỞ RỘNG ĐƯỜNG ỐNG BẰNG TRANG NÀY, KHÔNG PHẢI TRANG KHÁC
 *
 * Antigravity tới giờ chỉ đẩy được bài vào `/tin-tuc` — một mục ít người mở.
 * Câu hỏi đúng không phải "làm sao đăng được nhiều nơi hơn", mà "trang nào có
 * nội dung thật sự thay đổi theo tháng".
 *
 * Tiến độ thi công là trang duy nhất thoả cả ba:
 *
 *   · Nội dung ĐỔI THẬT theo thời gian. Giá, chính sách, pháp lý thì không —
 *     ép một cỗ máy sinh chữ "làm mới" chúng hàng tháng chỉ tạo ra chữ mới cho
 *     cùng một sự thật, tức là rác.
 *   · Rủi ro pháp lý THẤP NHẤT trong các money page. Mô tả hiện trạng công
 *     trường sai thì sửa được; hứa sai một mức chiết khấu thì không.
 *   · Đây là câu khách hỏi nhiều nhất sau khi đã xem giá.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ KHỐI NÀY KHÔNG MỞ THÊM MỘT CỬA NÀO CẢ — VÀ ĐÓ LÀ CHỦ Ý.
 *
 * Cách hiển nhiên để làm việc này là thêm một bảng `moc_tien_do` và một cổng
 * nhận riêng. Làm thế là dựng lại từ đầu cả ba hàng rào đang bảo vệ `/tin-tuc`:
 * duyệt bài, hẹn ngày, và cổng chặn nội dung. Dựng lại ba lần thì tới lần thứ
 * ba sẽ thiếu một cái, và không ai biết là thiếu.
 *
 * Ở đây bài tiến độ CHÍNH LÀ bài viết chuyên mục "Tiến độ" — cùng bảng, cùng
 * cổng, cùng hàng chờ. Cái mở rộng ra là chỗ ĐỌC, không phải chỗ ghi. Bề mặt
 * tấn công không tăng thêm một dòng nào.
 *
 * Hệ quả: bài chưa duyệt và bài hẹn ngày tương lai không hiện ở đây, vì
 * `docTheoChuyenMuc` gọi lại `docBaiViet` chứ không tự viết truy vấn riêng.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export async function CapNhatTienDo() {
  const bai = await docTheoChuyenMuc("Tiến độ", 4);

  // Chưa có bài nào thì KHÔNG dựng gì cả — không dựng khối rỗng, không dựng
  // dòng "chưa có cập nhật". Một khối trống trên money page chỉ nói với khách
  // rằng chỗ này lẽ ra phải có gì đó mà không có.
  if (bai.length === 0) return null;

  return (
    <section className="border-t border-ink-line py-nhip">
      <Khung>
        <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-display text-h2 font-normal text-balance">
              <SplitReveal text="Cập nhật mới nhất từ công trường" />
            </h2>
            <p className="mt-5 max-w-[46ch] text-body leading-relaxed text-paper-dim">
              Những gì thay đổi kể từ đợt ảnh phía trên. Mỗi bản tin đều ghi
              ngày, và chỉ lên trang sau khi có người đọc lại.
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ul className="border-t border-ink-line">
              {bai.map((b) => (
                <li key={b.slug} className="border-b border-ink-line">
                  <Link
                    href={`${DUONG_DAN.tinTuc}/${b.slug}`}
                    className="block py-6 transition-colors hover:text-jade"
                  >
                    <time
                      dateTime={b.ngayDang}
                      className="tabular text-small text-paper-dim"
                    >
                      {ngayVN(b.ngayDang)}
                    </time>
                    <span className="mt-2 block font-display text-h3 font-normal">
                      {b.tieuDe}
                    </span>
                    <span className="mt-2 block max-w-[58ch] text-small leading-relaxed text-paper-dim">
                      {b.moTa}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={DUONG_DAN.tinTuc}
              className="link-underline mt-7 inline-flex min-h-11 items-center text-nav uppercase text-jade"
            >
              Xem tất cả bản tin
            </Link>
          </div>
        </div>
      </Khung>
    </section>
  );
}
