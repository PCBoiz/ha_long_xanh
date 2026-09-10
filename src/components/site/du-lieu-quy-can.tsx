import { DIA_CHI_GOC } from "@/lib/site";
import { soLieuDong } from "@/lib/so-lieu-dong";
import { bangHangDangMo } from "@/lib/bang-hang-dang-mo";
import { DUONG_DAN } from "@/lib/duong-dan";
import { dongSanPham } from "@/data/project";

/**
 * Dữ liệu có cấu trúc cho BẢNG HÀNG — giá, số căn, diện tích.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO KHỐI NÀY QUAN TRỌNG HƠN MỌI KHỐI SCHEMA KHÁC TRÊN TRANG
 *
 * Bảng hàng có dấu thời gian là thứ KHÁC BIỆT DUY NHẤT của trang này. Đo trên
 * các trang đại lý khác cùng bán dự án: riêng dòng liền kề, giá đang lan truyền
 * trải từ 3,8 tỷ tới 9,9 tỷ — chênh 2,6 lần — và không trang nào ghi rõ con số
 * của họ là trước thuế hay đã gồm thuế.
 *
 * Nghĩa là khi ai đó hỏi trợ lý AI "Global Gate Hạ Long giá bao nhiêu", trợ lý
 * phải chọn giữa một đống số mâu thuẫn không nguồn. Trang này có số thật, có
 * mốc thời gian, có ghi rõ trước/sau thuế — nhưng trước khối này thì **không
 * có gì để máy đọc**: mô hình phải tự bóc từ HTML của một bảng 616 dòng.
 *
 * ⚠️ KHÔNG KHAI 616 `Offer` RIÊNG LẺ. Ba lý do, lý do thứ ba là nặng nhất:
 *
 *   1. Nặng — 616 đối tượng JSON nhét vào `<head>` của một trang vốn đã 1,4 MB.
 *   2. Vô ích — không ai hỏi giá của đúng lô A-12-05; người ta hỏi khoảng giá.
 *   3. SAI BẢN CHẤT — một lô đã bán thì `Offer` đó thành lời mời chào không còn
 *      hiệu lực. Bảng đổi từng ngày, mà schema thì nằm lại trong bộ nhớ đệm của
 *      máy tìm kiếm. Khai khoảng giá thì không bao giờ lệch kiểu đó.
 *
 * Nên: một `AggregateOffer` cho toàn bộ, và mỗi dòng sản phẩm một `Product` với
 * khoảng giá riêng. Đó là mức chi tiết đúng bằng mức người ta hỏi.
 *
 * ⚠️ MỌI CON SỐ ĐỌC TỪ `quy-can.generated.json`. Không có bản chép tay thứ hai
 * để lệch, và tự đúng lại sau mỗi lần chạy `npm run gop-bang-hang`.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function DuLieuQuyCan() {
  const tong = bangHangDangMo();
  if (!tong || !tong.gia) return null;

  // Mỗi dòng sản phẩm một Product, nhưng CHỈ dòng thật sự có căn trong bảng.
  // Dòng chưa mở bán mà khai `Offer` là mời chào thứ không bán được.
  const sanPham = dongSanPham
    .map((dong) => ({ dong, sl: soLieuDong(dong.ma) }))
    .filter((x): x is { dong: (typeof dongSanPham)[number]; sl: NonNullable<ReturnType<typeof soLieuDong>> } =>
      x.sl !== null && x.sl.gia !== null,
    )
    .map(({ dong, sl }) => ({
      "@type": "Product",
      "@id": `${DIA_CHI_GOC}${DUONG_DAN.quyCan}#${dong.ma}`,
      name: `${dong.ten} — Vinhomes Global Gate Hạ Long`,
      category: "Bất động sản thấp tầng",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "VND",
        lowPrice: Math.round(sl.gia!.nhoNhat),
        highPrice: Math.round(sl.gia!.lonNhat),
        offerCount: sl.soCan,
        availability: "https://schema.org/InStock",
        // `priceValidUntil` cố ý KHÔNG đặt: bảng hàng đổi từng ngày và không ai
        // hứa giá giữ tới lúc nào. Đặt một ngày bịa để "cho đủ trường" là đúng
        // kiểu sai mà cả trang này tồn tại để tránh.
      },
    }));

  const duLieu = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${DIA_CHI_GOC}${DUONG_DAN.quyCan}#quy-can`,
        name: "Quỹ căn đang mở bán — Vinhomes Global Gate Hạ Long",
        description:
          `Bảng hàng ${tong.soCan} căn đang mở bán, đọc từ hệ thống của chủ đầu tư. ` +
          `Giá ghi ở đây là giá ĐẦY ĐỦ, đã gồm thuế giá trị gia tăng và phí bảo trì.`,
        category: "Bất động sản thấp tầng",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "VND",
          lowPrice: Math.round(tong.gia.nhoNhat),
          highPrice: Math.round(tong.gia.lonNhat),
          offerCount: tong.soCan,
          availability: "https://schema.org/InStock",
        },
      },
      ...sanPham,
      {
        // Dấu thời gian là thứ đáng trích dẫn nhất ở đây — nó trả lời câu
        // "số này của bao giờ", mà không trang đối thủ nào trả lời được.
        "@type": "Dataset",
        "@id": `${DIA_CHI_GOC}${DUONG_DAN.quyCan}#bang-hang`,
        name: "Bảng hàng Vinhomes Global Gate Hạ Long",
        description:
          `${tong.soCan} căn, ${tong.tieuKhu.map((t) => t.ten).join(" và ")}. ` +
          "Mỗi căn có mã, diện tích đất, diện tích xây dựng, tiêu chuẩn bàn giao, " +
          "giá trước thuế và giá đã gồm thuế cùng phí bảo trì.",
        dateModified: tong.docLuc,
        isAccessibleForFree: true,
        creator: { "@id": `${DIA_CHI_GOC}/#chu-dau-tu` },
        url: `${DIA_CHI_GOC}${DUONG_DAN.quyCan}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(duLieu).replace(/</g, "\\u003c"),
      }}
    />
  );
}
