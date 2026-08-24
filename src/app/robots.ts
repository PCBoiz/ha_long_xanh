import type { MetadataRoute } from "next";
import { CHO_LAP_CHI_MUC, DIA_CHI_GOC } from "@/lib/site";

/**
 * robots.txt — file quan trọng nhất cho việc được trợ lý AI nhắc tới.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO KHÔNG PHẢI `llms.txt`
 *
 * Tra cứu tháng 8/2026: `llms.txt` mới đạt 10,13% mức áp dụng trên 300.000 tên
 * miền, và KHÔNG hãng nào — OpenAI, Google, Anthropic, Meta, Mistral — công bố
 * là hệ thống chạy thật của họ có đọc nó. Nhật ký máy chủ của các bên đã triển
 * khai cho thấy GPTBot thỉnh thoảng tải về, còn ClaudeBot, Google-Extended và
 * PerplexityBot gần như không đụng tới.
 *
 * `robots.txt` là file DUY NHẤT được mọi bên hỗ trợ có chủ đích: OpenAI,
 * Anthropic, Google, Meta, Perplexity, Apple và Common Crawl đều công bố chuỗi
 * nhận dạng cùng hướng dẫn điều khiển qua đây.
 *
 * Trang vẫn có `llms.txt` như một canh bạc rẻ tiền cho tương lai. Nhưng thứ
 * quyết định trợ lý AI đọc được trang này hay không thì nằm ở file này.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * VÌ SAO LIỆT KÊ TỪNG BOT khi dòng `*` đã cho phép hết:
 *
 * Không phải để nới thêm quyền — `*` đã đủ. Mà để KHOÁ Ý ĐỊNH lại thành chữ.
 * Ngày nào đó sẽ có người muốn "chặn bot cho đỡ tốn băng thông" rồi sửa dòng
 * `*`; danh sách này khiến việc cắt mất trợ lý AI thành một hành động phải cố ý
 * làm, chứ không phải hệ quả phụ không ai để ý.
 */

/**
 * ĐỌC BIẾN MÔI TRƯỜNG LÚC CHẠY, không phải lúc dựng.
 *
 * Đây là bản vá cho một cái bẫy đã đo được thật. Mặc định Next.js dựng sẵn
 * `robots.txt` thành file tĩnh, nên giá trị `NEXT_PUBLIC_CHO_LAP_CHI_MUC` bị
 * nướng vào lúc `npm run build`. Hệ quả:
 *
 *   sửa .env từ 0 sang 1  →  docker compose up -d  →  robots.txt VẪN chặn hết
 *
 * Và hỏng hoàn toàn im lặng: trang chạy bình thường, mọi thứ trông đúng, chỉ
 * có điều không công cụ tìm kiếm nào và không trợ lý AI nào vào được. Vài tuần
 * sau mới nhận ra là trang không hề xuất hiện ở đâu cả.
 *
 * `force-dynamic` khiến file này dựng lại theo từng yêu cầu, nên giá trị đang
 * chạy luôn là giá trị thật. Chi phí gần bằng không — robots.txt vài trăm byte
 * và mỗi bot chỉ tải một lần mỗi ngày.
 */
export const dynamic = "force-dynamic";

/** Bot của các trợ lý AI. Xem chú thích trên về lý do liệt kê tường minh. */
const BOT_TRO_LY_AI = [
  // OpenAI — huấn luyện, tìm kiếm, và lượt tải do người dùng khởi tạo
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google — bot RIÊNG cho Gemini và AI Overviews, tách khỏi Googlebot. Chặn
  // cái này thì trang biến mất khỏi câu trả lời của Gemini mà thứ hạng tìm
  // kiếm thường vẫn nguyên, nên rất dễ chặn nhầm mà không nhận ra.
  "Google-Extended",
  // Apple Intelligence
  "Applebot-Extended",
  // ByteDance — nguồn của tìm kiếm bên trong TikTok. Với thị trường Việt Nam
  // thì đây không phải đường bên lề.
  "Bytespider",
  // Meta AI
  "meta-externalagent",
  // Common Crawl — kho dữ liệu mà rất nhiều mô hình lấy về dùng lại
  "CCBot",
  // Amazon, DuckDuckGo
  "Amazonbot",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  /*
   * Chặn sạch khi chưa mở chỉ mục.
   *
   * Lý do của cờ này ĐÃ ĐỔI. Trước đây nó chặn vì số liệu chưa đối chiếu hồ sơ
   * gốc; giờ số liệu đã hiện kèm nguồn ngay trên trang nên lý do đó không còn.
   *
   * Việc nó giữ bây giờ vẫn cần thiết: BẢN XEM THỬ KHÔNG ĐƯỢC VÀO CHỈ MỤC. Hai
   * địa chỉ khác nhau cùng một nội dung sẽ tranh nhau thứ hạng, và công cụ tìm
   * kiếm hoàn toàn có thể chọn đúng cái `*.vercel.app` làm bản chính thức —
   * lúc đó tên miền thật thành bản sao của bản xem thử.
   *
   * Bản chạy thật trên máy chủ riêng đặt `NEXT_PUBLIC_CHO_LAP_CHI_MUC=1`.
   */
  if (!CHO_LAP_CHI_MUC) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...BOT_TRO_LY_AI.map((ten) => ({ userAgent: ten, allow: "/" })),
    ],
    sitemap: `${DIA_CHI_GOC}/sitemap.xml`,
    // Nói rõ tên miền nào là chính thức. Dự án sở hữu cả `halongxanh360.vn` và
    // `halongxanh360.com.vn`; không chỉ định thì hai tên miền tranh nhau và
    // chia đôi thứ hạng của chính mình.
    host: DIA_CHI_GOC,
  };
}
