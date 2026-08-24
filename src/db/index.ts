import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Kết nối cơ sở dữ liệu.
 *
 * TRẢ VỀ `null` KHI CHƯA CẤU HÌNH, chứ không ném lỗi lúc nạp module. Lý do:
 * trang này phải chạy được trên máy của người phát triển mà không cần cơ sở dữ
 * liệu — nếu thiếu `DATABASE_URL` là sập ngay khi khởi động thì không ai xem
 * được giao diện cho tới khi dựng xong Neon.
 *
 * Nơi gọi phải tự xử lý trường hợp `null`. Ở `lib/tin-tuc.ts` là rơi về file
 * JSONL cục bộ; ở cổng nhận bài là trả lỗi 503 "chưa cấu hình" — cố ý KHÔNG trả
 * 200, để bên gửi giữ bài lại và thử lại thay vì tưởng đã đăng xong.
 */
/**
 * Những chuỗi CHẮC CHẮN không phải cơ sở dữ liệu thật.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ KHỐI NÀY SINH RA TỪ MỘT BẢN DỰNG HỎNG THẬT, ĐỌC TRƯỚC KHI GỠ.
 *
 * Việc đầu tiên ai cũng làm khi dựng trang này là chép `.env.example` thành
 * `.env`. Chép xong mà chưa kịp lấy chuỗi kết nối Neon thì `DATABASE_URL` mang
 * đúng giá trị mẫu: `postgresql://nguoi_dung:mat_khau@ep-abc-123-pooler…`.
 *
 * Với `layDb`, chuỗi đó là một cấu hình HỢP LỆ — có đủ giao thức, tài khoản,
 * máy chủ. Nên nó không rơi về đường file, nó đi kết nối thật, tới một máy chủ
 * không tồn tại. Bản dựng chết ở `/sitemap.xml` kèm một bãi trường Postgres
 * rỗng: `code: ''`, `detail: undefined`, `hint: undefined`, `position:
 * undefined`… hai mươi dòng không nói được điều duy nhất cần nói.
 *
 * Người đọc thông báo đó sẽ đi kiểm Neon, kiểm mạng, kiểm quyền truy cập — mọi
 * thứ trừ dòng `.env` mà chính họ vừa chép hai phút trước.
 *
 * Bắt đúng chuỗi mẫu chứ KHÔNG đoán mò theo kiểu "địa chỉ trông có vẻ giả":
 * đoán mò sẽ có ngày chặn nhầm một cơ sở dữ liệu thật, và chặn nhầm ở đây
 * nghĩa là trang chạy nhưng không có bài viết nào.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const CHUOI_MAU = ["nguoi_dung:mat_khau", "ep-abc-123-pooler", "ten_db"];

let boNho: ReturnType<typeof taoKetNoi> | null | undefined;

function taoKetNoi() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  // Chuỗi mẫu chưa thay = coi như CHƯA CẤU HÌNH, không phải cấu hình sai.
  //
  // Trả `null` ở đây khiến trang chạy đúng như lúc không có `.env`: đọc bài từ
  // file cục bộ, cổng nhận bài trả 503. Người dựng thấy giao diện chạy được
  // ngay, kèm một dòng nhật ký nói thẳng phải sửa ở đâu — thay vì một bản dựng
  // chết không rõ lý do.
  if (CHUOI_MAU.some((mau) => url.includes(mau))) {
    console.warn(
      "[db] DATABASE_URL vẫn là chuỗi MẪU trong .env.example, chưa phải chuỗi " +
        "kết nối thật. Đang chạy như khi chưa cấu hình cơ sở dữ liệu.\n" +
        "     Sửa: lấy chuỗi ở Neon → Connection string (nhớ chọn đúng database " +
        "và bản Pooled), dán vào DATABASE_URL trong .env.",
    );
    return null;
  }

  // Trình điều khiển HTTP của Neon gửi mỗi truy vấn thành một yêu cầu HTTPS,
  // không giữ kết nối TCP thường trực. Chậm hơn chút ở truy vấn lẻ nhưng không
  // bao giờ cạn hạn mức kết nối — thứ hay giết các ứng dụng chạy nhiều tiến
  // trình song song.
  return drizzle(neon(url), { schema });
}

export function layDb() {
  // Gọi một lần rồi giữ lại. `undefined` nghĩa là chưa thử, `null` nghĩa là đã
  // thử và không có cấu hình — phân biệt hai cái để không dựng lại mỗi lần gọi.
  if (boNho === undefined) boNho = taoKetNoi();
  return boNho;
}

export { schema };
