/**
 * Sáu điều khách có thể ưu tiên nhất.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ VÌ SAO MẢNG NÀY PHẢI Ở FILE RIÊNG, KHÔNG ĐƯỢC ĐỂ TRONG `dang-ky-action.ts`
 *
 * File đó mở đầu bằng `"use server"`. Trong một file như thế, Next.js coi MỌI
 * thứ được export là một hành động chạy trên máy chủ và thay nó bằng một tham
 * chiếu gọi qua mạng — kể cả khi thứ đó là một mảng hằng.
 *
 * Hậu quả đo được: build chạy tới bước dựng sẵn trang thì gãy với
 *
 *     TypeError: e.map is not a function
 *
 * Thông báo không nhắc gì tới `"use server"`, tới mảng, hay tới tên file. Nó
 * chỉ nói một biến nào đó không map được — nên rất dễ đi tìm nhầm sang phía
 * giao diện. Ghi lại ở đây để lần sau không mất công dò lại.
 *
 * QUY TẮC: file `"use server"` CHỈ được export hàm async. Hằng số, kiểu dữ
 * liệu và mảng lựa chọn đều phải ra file riêng như file này.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * VÌ SAO Ô NÀY THAY CHO Ô "KHOẢNG NGÂN SÁCH"
 *
 * Hỏi ngân sách ngay ở biểu mẫu đầu là bắt khách tự định giá mình trước khi họ
 * biết mình mua được gì. Người có ba tỷ nhìn thấy ô "khoảng ngân sách" rồi tự
 * loại mình và đóng trang — trong khi phương án thanh toán có thể đưa họ tới
 * đúng căn họ muốn.
 *
 * Ô này hỏi thứ ngược lại: điều gì QUAN TRỌNG NHẤT với họ. Câu trả lời vừa
 * không làm ai ngại, vừa nói cho người tư vấn biết phải mở đầu cuộc gọi bằng
 * chuyện gì — hữu ích hơn một con số ngân sách mà khách thường khai thấp hơn
 * thực tế.
 *
 * "Tôi muốn trao đổi trực tiếp" để CUỐI là cố ý. Ai chọn nó là người sẵn sàng
 * nghe máy nhất, nên đó là lượt gọi trước tiên.
 */
export const DIEU_UU_TIEN = [
  "Căn phù hợp để ở",
  "Tổng tiền thực trả",
  "Dòng tiền thanh toán",
  "View / vị trí căn",
  "Giữ giá trị khi cần chuyển nhượng",
  "Tôi muốn trao đổi trực tiếp",
] as const;
