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

/**
 * Chạy một truy vấn, và THỬ LẠI ĐÚNG MỘT LẦN nếu cơ sở dữ liệu đang ngủ dậy.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ KHÔNG PHẢI "THỬ LẠI CHO CHẮC". ĐÂY LÀ BẢN VÁ CHO MỘT LỖI ĐO ĐƯỢC.
 *
 * Neon gói miễn phí thu máy tính toán về 0 khi không ai dùng. Lần gọi đầu tiên
 * sau khi ngủ KHÔNG chờ máy dậy — nó thất bại luôn.
 *
 * Đo ngày 07/09/2026 trên máy chủ thật, gọi liên tiếp 5 lần cách nhau 2 giây:
 *
 *     lần 1   503  hỏng      761ms     ← thất bại
 *     lần 2   200  ok       1271ms     ← chậm, đang thức dậy
 *     lần 3   200  ok        254ms     ← đã ấm
 *     lần 4   200  ok        254ms
 *     lần 5   200  ok        251ms
 *
 * Hậu quả nếu không vá: trang ít khách thì cơ sở dữ liệu ngủ gần như liên tục,
 * nên MỖI VỊ KHÁCH ĐẦU TIÊN sau mỗi quãng vắng đều thấy mục tin tức rỗng. Hỏng
 * im lặng và ngắt quãng — kiểm lần thứ hai lại thấy bình thường, nên rất dễ
 * kết luận là "đã tự khỏi".
 *
 * KHÔNG giữ ấm bằng cách gọi định kỳ: 100 giờ tính toán/tháng, mà một tháng có
 * 730 giờ. Thức 24/7 là vượt trần khoảng ngày thứ mười sáu, và vượt trần thì
 * Neon treo tới đầu tháng sau.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * CHỈ THỬ LẠI KHI LỖI KHÔNG CÓ MÃ POSTGRES.
 *
 * Máy đang ngủ thì hỏng ở tầng vận chuyển — không có mã lỗi Postgres nào cả.
 * Còn `42P01` (bảng không tồn tại) hay `28P01` (sai mật khẩu) là lỗi thật: thử
 * lại chỉ làm mọi trang chậm gấp đôi rồi vẫn hỏng, và làm nhật ký khó đọc hơn.
 *
 * ĐÚNG MỘT LẦN, không phải vòng lặp. Máy đã dậy thì một lần là đủ; máy chết
 * thật thì thử mười lần cũng thế, mà khách phải chờ mười lần lâu hơn.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export async function thuLaiKhiNguDay<T>(chay: () => Promise<T>): Promise<T> {
  try {
    return await chay();
  } catch (loi) {
    const layMa = (x: unknown) => (x as { code?: string } | undefined)?.code;
    const ma = layMa(loi) ?? layMa((loi as { cause?: unknown }).cause);
    if (ma) throw loi; // Lỗi Postgres thật — thử lại vô ích.

    console.warn(
      "[db] Truy vấn đầu tiên thất bại không kèm mã Postgres — nhiều khả năng " +
        "Neon đang ngủ dậy. Chờ 1,2 giây rồi thử lại một lần.",
    );
    await new Promise((tiep) => setTimeout(tiep, 1200));
    return await chay();
  }
}
