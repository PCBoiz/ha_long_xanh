/**
 * Kiểu dữ liệu và trạng thái ban đầu cho màn hình duyệt bài.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ VÌ SAO PHẢI Ở FILE RIÊNG, KHÔNG ĐƯỢC ĐỂ TRONG `duyet-bai.ts`
 *
 * File đó mở đầu bằng `"use server"`. Trong một file như thế, Next.js coi MỌI
 * thứ được export là một hành động chạy trên máy chủ và thay nó bằng một tham
 * chiếu gọi qua mạng — kể cả khi thứ đó chỉ là một đối tượng hằng.
 *
 * Hậu quả đo được: `useActionState(layHangCho, ketQuaHangChoBanDau)` nhận
 * trạng thái ban đầu là một THAM CHIẾU HÀM chứ không phải `{trangThai:"cho"}`.
 * Mọi phép đọc `hangCho.thongBao`, `hangCho.bai` đều ra `undefined`, nên màn
 * hình duyệt không báo lỗi khi nhập sai khoá và không hiện được gì cả.
 *
 * ĐÂY LÀ LẦN THỨ HAI cùng một cái bẫy trong dự án — lần đầu ở
 * `lib/lead/uu-tien.ts`, với mảng lựa chọn của biểu mẫu. Cả hai lần đều không
 * gãy lúc build, chỉ hỏng lúc chạy, và thông báo lỗi không nhắc gì tới
 * `"use server"`.
 *
 * QUY TẮC: file `"use server"` CHỈ được export hàm async. Kiểu dữ liệu, hằng
 * số và trạng thái ban đầu đều phải ra file riêng như file này.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface BaiTrongHangCho {
  slug: string;
  tieuDe: string;
  moTa: string;
  chuyenMuc: string;
  ngay: string;
  noiDung: string;
  /** Bài này từng được duyệt rồi bị sửa lại — cần soi kỹ hơn bài mới. */
  daTungDang: boolean;
  /**
   * Những chỗ cổng chặn đánh dấu là CẦN ĐỐI CHIẾU — giá, phần trăm thương
   * mại, mốc bàn giao, khoảng cách, pháp lý.
   *
   * Tính lúc ĐỌC chứ không lưu vào cơ sở dữ liệu. Hai cái lợi: không phải
   * thêm cột, và mọi bài đang nằm sẵn trong hàng chờ cũng được soi bằng bộ
   * luật mới nhất — kể cả bài đã vào hàng chờ từ trước khi có luật đó.
   */
  canhBao: { luat: string; lyDo: string; trichDan: string }[];
}

export interface KetQuaHangCho {
  trangThai: "cho" | "xong" | "loi";
  thongBao?: string;
  bai?: BaiTrongHangCho[];
}

export const ketQuaHangChoBanDau: KetQuaHangCho = { trangThai: "cho" };

export interface KetQuaDuyet {
  trangThai: "cho" | "xong" | "loi";
  thongBao?: string;
}

export const ketQuaDuyetBanDau: KetQuaDuyet = { trangThai: "cho" };
