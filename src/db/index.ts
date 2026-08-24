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
let boNho: ReturnType<typeof taoKetNoi> | null | undefined;

function taoKetNoi() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
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
