import type { Metadata } from "next";
import { Khung } from "@/components/ui/khung";
import { BangDuyet } from "@/components/site/bang-duyet";

/**
 * Màn hình duyệt bài.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ TRANG NÀY DỰNG RA MỘT VỎ RỖNG. ĐỪNG ĐỌC HÀNG CHỜ Ở ĐÂY.
 *
 * Bản đầu gọi `docBaiChoDuyet()` ngay trong thành phần máy chủ rồi dựng cả
 * hàng chờ ra HTML, và chỉ kiểm khoá khi BẤM nút duyệt. Nghĩa là bất kỳ ai mở
 * địa chỉ này đều đọc được toàn văn mọi bài chưa duyệt — kể cả bài do mô hình
 * ngôn ngữ viết ra với những con số chưa ai kiểm.
 *
 * Tái hiện bằng một lệnh curl không kèm khoá: bài thử chứa câu bịa "chiết khấu
 * 15% bí mật" hiện ra đầy đủ. Hàng rào dựng lên để chặn đúng loại nội dung đó,
 * lại để nó rò ra qua chính trang quản lý hàng rào.
 *
 * Giờ hàng chờ chỉ về sau khi máy chủ nhận đúng khoá — xem `layHangCho` trong
 * `lib/duyet-bai.ts`. HTML đầu tiên không mang theo một chữ nào của bài chưa
 * duyệt.
 *
 * `noindex, nofollow` vẫn giữ, và trang vẫn không nằm trong sitemap hay bất kỳ
 * liên kết nội bộ nào. Đó là lớp che, không phải lớp khoá; lớp khoá là token.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const metadata: Metadata = {
  title: "Duyệt bài",
  robots: { index: false, follow: false },
};

export default function TrangDuyetBai() {
  return (
    <section className="pb-nhip pt-32 md:pt-40">
      <Khung>
        <div className="max-w-3xl">
          <h1 className="font-display text-h1 font-normal text-balance">
            Hàng chờ duyệt
          </h1>
          <p className="mt-5 text-body leading-relaxed text-paper-dim">
            Bài do Antigravity viết và đẩy sang nằm ở đây cho tới khi được
            duyệt. Chưa duyệt thì bài{" "}
            <strong className="text-paper">không hiện trên trang</strong> và
            không vào sitemap.
          </p>
          <p className="mt-4 max-w-[68ch] text-small leading-relaxed text-paper-dim">
            Đọc kỹ phần có con số trước khi duyệt: giá, phần trăm chiết khấu,
            mốc bàn giao, khoảng cách. Đó là những chỗ một mô hình ngôn ngữ viết
            trôi chảy nhất mà lại không biết mình đang đoán.
          </p>
        </div>

        <div className="mt-12">
          <BangDuyet />
        </div>
      </Khung>
    </section>
  );
}
