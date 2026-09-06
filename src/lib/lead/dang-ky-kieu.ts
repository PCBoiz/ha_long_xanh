/**
 * Kiểu dữ liệu và trạng thái ban đầu cho biểu mẫu đăng ký tư vấn.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ VÌ SAO PHẢI Ở FILE RIÊNG, KHÔNG ĐƯỢC ĐỂ TRONG `dang-ky-action.ts`
 *
 * File đó mở đầu bằng `"use server"`. Trong một file như thế, Next.js coi MỌI
 * thứ được export là một hành động chạy trên máy chủ và thay nó bằng một tham
 * chiếu gọi qua mạng — kể cả khi thứ đó chỉ là một đối tượng hằng.
 *
 * ĐÂY LÀ LẦN THỨ BA cùng một cái bẫy trong dự án:
 *
 *   1. `lib/lead/uu-tien.ts`    — mảng lựa chọn của biểu mẫu
 *   2. `lib/duyet-bai-kieu.ts`  — trạng thái ban đầu của màn hình duyệt bài
 *   3. file này                 — trạng thái ban đầu của biểu mẫu đăng ký
 *
 * Hai lần đầu hỏng ÂM THẦM. Lần này gãy hẳn, và gãy ở môi trường thật. Đo trên
 * máy chủ ngày 07/09/2026, Next.js 16.3:
 *
 *     ⨯ Error: A "use server" file can only export async functions,
 *              found object.
 *       digest: '2788191844@E352'
 *
 * và mỗi lần có người bấm gửi biểu mẫu:
 *
 *     Error: The Server Reference ID did not match the expected format.
 *            Received "x".
 *
 * `"x"` và `"y"` là tên đã bị nén của những export không phải hàm — Next.js
 * vẫn đăng ký chúng như hành động máy chủ, rồi từ chối chính chúng lúc chạy.
 *
 * Khách nhìn thấy một màn hình trắng "This page couldn't load". Lượt đăng ký
 * đó mất, và không có gì trên trang cho biết vừa mất.
 *
 * QUY TẮC: file `"use server"` CHỈ được export hàm async. Kiểu dữ liệu, hằng
 * số và trạng thái ban đầu đều phải ra file riêng như file này.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface KetQuaDangKy {
  trangThai: "cho" | "thanhCong" | "loi";
  thongBao?: string;
  /** Lỗi theo từng ô, để hiện ngay dưới ô đó. */
  loiTruong?: Partial<Record<"dienThoai" | "uuTien", string>>;
}

export const ketQuaBanDau: KetQuaDangKy = { trangThai: "cho" };
