import { DIA_CHI_GOC } from "@/lib/site";
import { duAn } from "@/data/project";
import type { BaiViet } from "@/data/news";

/**
 * Dữ liệu có cấu trúc cho MỘT bài viết.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CẦN, VÀ VÌ SAO NÓ TỪNG BỊ BỎ QUÊN
 *
 * Đường ống tự động sinh bài chạy qua tám module, trong đó module #11 sinh hẳn
 * FAQ và khối JSON-LD. Nhưng module đăng bài chỉ lấy PHẦN CHỮ của FAQ rồi dán
 * vào thân bài dưới dạng `<h2>Câu hỏi thường gặp</h2>` — khối JSON-LD bị bỏ
 * lại.
 *
 * Hệ quả: trang bài viết có tiêu đề, mô tả, canonical, OpenGraph — nhưng KHÔNG
 * một dòng dữ liệu có cấu trúc nào. Với Google thì đó là mất phần kết quả mở
 * rộng. Với trợ lý AI thì nặng hơn: chúng ưu tiên trích nội dung đã được đánh
 * dấu rõ đâu là câu hỏi, đâu là câu trả lời, bài đăng ngày nào, ai viết.
 *
 * Tức là cả hệ thống bỏ tiền gọi model để sinh ra FAQ chuẩn GEO, rồi ném đi
 * đúng phần khiến nó là GEO.
 *
 * ⚠️ VÌ SAO BÓC LẠI TỪ HTML CHỨ KHÔNG SỬA HỢP ĐỒNG DỮ LIỆU
 *
 * Cách "đúng sách" là thêm trường `faq` vào cổng nhận bài. Nhưng nó kéo theo
 * một cột mới trong cơ sở dữ liệu, một lần chuyển đổi lược đồ trên máy chủ
 * thật, và sửa cả hai phía cùng lúc — trong khi chuyển đổi lược đồ vừa là thứ
 * làm hỏng cả đường ống hôm qua.
 *
 * Ở đây ta bóc lại từ chính HTML mình vừa sinh ra: cấu trúc đó do module đăng
 * bài tạo, không phải HTML lạ từ ngoài. Bóc thứ mình tự viết là việc đọc lại,
 * không phải việc đoán.
 *
 * NHƯNG PHẢI HỎNG VỀ PHÍA IM LẶNG: không tìm thấy FAQ thì trả mảng rỗng và
 * KHÔNG khai `FAQPage`. Khai một khối rỗng hoặc sai còn tệ hơn không khai —
 * Google phạt dữ liệu có cấu trúc không khớp nội dung hiển thị.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Gỡ thẻ, trả về chữ trơn đã gọn khoảng trắng. */
function chuTron(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export interface CapHoiDap {
  hoi: string;
  dap: string;
}

/**
 * Bóc các cặp hỏi–đáp trong khối "Câu hỏi thường gặp" của thân bài.
 *
 * Dạng do module đăng bài sinh ra:
 *     <h2>Câu hỏi thường gặp</h2>
 *     <p><strong>Câu hỏi?</strong><br />Câu trả lời.</p>
 */
export function bocFaq(noiDung: string | null | undefined): CapHoiDap[] {
  if (!noiDung) return [];
  const moc = /<h2[^>]*>\s*C[âa]u h[ỏo]i th[ưu][ờo]ng g[ặa]p\s*<\/h2>/i.exec(noiDung);
  if (!moc) return [];

  const sau = noiDung.slice(moc.index + moc[0].length);
  // Dừng ở tiêu đề h2 kế tiếp — FAQ chỉ gồm phần thuộc về nó.
  const ketThuc = /<h2[\s>]/i.exec(sau);
  const than = ketThuc ? sau.slice(0, ketThuc.index) : sau;

  const cap: CapHoiDap[] = [];
  for (const doan of than.matchAll(/<p>([\s\S]*?)<\/p>/gi)) {
    const trong = doan[1];
    const manh = /<strong>([\s\S]*?)<\/strong>\s*(?:<br\s*\/?>)?([\s\S]*)/i.exec(trong);
    if (!manh) continue;
    const hoi = chuTron(manh[1]);
    const dap = chuTron(manh[2]);
    // Một câu hỏi không có câu trả lời thì không phải một mục FAQ.
    if (hoi.length < 5 || dap.length < 10) continue;
    cap.push({ hoi, dap });
  }
  return cap;
}

/** Khối JSON-LD cho trang bài viết. Trả chuỗi rỗng nếu không có gì đáng khai. */
export function duLieuBaiViet(bai: BaiViet): string {
  const diaChi = `${DIA_CHI_GOC}/tin-tuc/${bai.slug}`;
  const faq = bocFaq(bai.noiDung);

  const khoi: Record<string, unknown>[] = [
    {
      "@type": "NewsArticle",
      "@id": `${diaChi}#bai-viet`,
      headline: bai.tieuDe,
      description: bai.moTa,
      inLanguage: "vi-VN",
      datePublished: bai.ngayDang,
      // `dateModified` LẤY TỪ MỐC THẬT, không lấy giờ dựng trang. Xem ghi chú
      // cùng nội dung trong `du-lieu-co-cau-truc.tsx`.
      dateModified: bai.ngayDang,
      articleSection: bai.chuyenMuc,
      mainEntityOfPage: { "@type": "WebPage", "@id": diaChi },
      // KHÔNG khai `author` là một con người có tên khi bài do máy soạn và
      // người duyệt. Khai tổ chức là mô tả đúng thứ đang xảy ra.
      author: { "@type": "Organization", name: duAn.ten, url: DIA_CHI_GOC },
      publisher: { "@type": "Organization", name: duAn.ten, url: DIA_CHI_GOC },
    },
  ];

  if (faq.length > 0) {
    khoi.push({
      "@type": "FAQPage",
      "@id": `${diaChi}#cau-hoi`,
      mainEntity: faq.map((c) => ({
        "@type": "Question",
        name: c.hoi,
        acceptedAnswer: { "@type": "Answer", text: c.dap },
      })),
    });
  }

  // Thoát `<` để một chuỗi chứa "</script>" không đóng sớm thẻ script.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": khoi }).replace(
    /</g,
    "\\u003c",
  );
}
