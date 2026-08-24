import { randomUUID } from "node:crypto";
import { layDb, schema } from "@/db";

/**
 * Cổng nhận sự kiện chuyển đổi.
 *
 * Trả về 204 trong MỌI trường hợp, kể cả khi ghi hỏng. Đây là chủ ý: bên gọi là
 * `navigator.sendBeacon`, vốn không đọc phản hồi và không báo lại được gì cho
 * người dùng. Trả mã lỗi ở đây chỉ làm nhật ký trình duyệt bẩn thêm mà không ai
 * xử lý được — trong khi mọi thứ đáng biết đều đã nằm ở nhật ký máy chủ.
 *
 * KHÔNG có xác thực, và điều đó cần được nói rõ: bất kỳ ai cũng gửi được vào
 * đây. Chấp nhận được vì bảng này chỉ ĐẾM, không cấp quyền gì và không lưu gì
 * nhận dạng người. Rủi ro thật là ai đó bơm số cho hỏng thống kê — chặn bằng
 * giới hạn tần suất ở tầng Caddy nếu chuyện đó xảy ra, không phải bằng token
 * (token nằm trong mã trình duyệt thì ai cũng đọc được).
 */

export const runtime = "nodejs";

/** Danh sách trắng. Không có nó thì bảng đầy rác do người khác tự đặt tên. */
const LOAI_HOP_LE = new Set([
  "goi",
  "zalo",
  "bieu-mau",
  "tai-lieu",
  "tim-can",
]);

/** Cắt chuỗi cho vừa cột, tránh lỗi khi ai đó gửi một đoạn văn vào. */
function catNgan(gia: unknown, toiDa: number): string | null {
  if (typeof gia !== "string") return null;
  const sach = gia.trim();
  if (sach === "") return null;
  return sach.slice(0, toiDa);
}

export async function POST(yeuCau: Request): Promise<Response> {
  const khong = new Response(null, { status: 204 });

  try {
    const than = (await yeuCau.json()) as unknown;
    if (typeof than !== "object" || than === null) return khong;

    const { loai, duong, chiTiet } = than as Record<string, unknown>;

    if (typeof loai !== "string" || !LOAI_HOP_LE.has(loai)) return khong;

    // Đường dẫn phải bắt đầu bằng `/` và không được là URL tuyệt đối — chặn
    // việc bảng ghi lại địa chỉ của trang khác nếu ai đó gửi bừa.
    const duongSach = catNgan(duong, 300);
    if (!duongSach || !duongSach.startsWith("/")) return khong;

    const db = layDb();
    if (!db) return khong; // chưa cấu hình cơ sở dữ liệu — bỏ qua, không lỗi

    await db.insert(schema.suKien).values({
      id: randomUUID(),
      loai,
      duong: duongSach,
      chiTiet: catNgan(chiTiet, 200),
    });
  } catch (loi) {
    // Ghi ra nhật ký máy chủ để còn lần được, nhưng vẫn trả 204.
    console.error("[su-kien] không ghi được:", loi);
  }

  return khong;
}
