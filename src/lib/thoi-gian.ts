/**
 * Định dạng ngày giờ — LUÔN theo giờ Việt Nam.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ ĐỪNG BAO GIỜ GỌI THẲNG `toLocaleTimeString` / `toLocaleDateString` NỮA.
 *
 * Không khai múi giờ thì hàm lấy múi giờ của MÁY ĐANG CHẠY. Trên Vercel, máy
 * chạy giờ UTC; trên máy khách ở Việt Nam là UTC+7. Cùng một mốc thời gian ra
 * hai chuỗi khác nhau, lệch đúng bảy tiếng.
 *
 * Hậu quả đo được trên bản đang chạy thật:
 *
 *   1. React ném lỗi #418 — bản dựng ở máy chủ không khớp bản dựng lại ở trình
 *      duyệt. Lỗi này KHÔNG hiện trên máy người làm, vì máy làm và trình duyệt
 *      thử cùng một múi giờ. Nó chỉ xuất hiện sau khi lên máy chủ thật.
 *
 *   2. Nặng hơn lỗi kỹ thuật: khách đọc SAI GIỜ. Dòng "đọc từ bảng hàng lúc
 *      11:20" là chỗ neo uy tín duy nhất của cả bảng giá — nó là câu trả lời
 *      cho "số này của lúc nào". Hiện sai bảy tiếng ở lượt dựng đầu rồi nhảy
 *      sang giờ khác sau khi trang chạy được JavaScript.
 *
 * Chốt cứng `Asia/Ho_Chi_Minh` giải quyết cả hai: hai bên dựng ra cùng một
 * chuỗi, và chuỗi đó đúng với người đọc — vì người đọc ở Việt Nam, còn máy chủ
 * ở đâu thì không ai quan tâm.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const MUI_GIO = "Asia/Ho_Chi_Minh";

/** Ví dụ: "18:20". */
export function gioVN(luc: Date | string): string {
  return new Date(luc).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: MUI_GIO,
  });
}

/** Ví dụ: "15/08/2026". */
export function ngayVN(luc: Date | string): string {
  return new Date(luc).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: MUI_GIO,
  });
}

/**
 * Hôm nay theo giờ Việt Nam, dạng `YYYY-MM-DD`.
 *
 * ⚠️ KHÔNG dùng `new Date().toISOString().slice(0, 10)` cho việc này. Hàm đó
 * trả ngày theo giờ UTC. Việt Nam là UTC+7, nên từ 0h tới 7h sáng giờ Việt Nam,
 * ngày UTC vẫn là HÔM QUA.
 *
 * Hậu quả cụ thể: một bài hẹn đăng "hôm nay" sẽ không hiện ra suốt bảy tiếng
 * đầu ngày, hoặc một bài đăng lúc 1h sáng bị gắn nhãn ngày hôm trước. Cả hai
 * đều hỏng im lặng và chỉ lộ ra vào đúng khung giờ ít ai ngồi kiểm.
 */
export function homNayVN(): string {
  // `en-CA` cho ra đúng dạng YYYY-MM-DD — không phải mẹo vặt mà là dạng ngày
  // chuẩn của vùng đó, nên ổn định qua các phiên bản trình duyệt và Node.
  return new Date().toLocaleDateString("en-CA", { timeZone: MUI_GIO });
}

/** Ví dụ: "18:20 ngày 15/08/2026". */
export function gioNgayVN(luc: Date | string): string {
  return `${gioVN(luc)} ngày ${ngayVN(luc)}`;
}
