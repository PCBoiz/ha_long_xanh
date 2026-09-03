/**
 * Giới hạn tần suất cho hai cổng ghi.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO LẦN NÀY LÀM ĐƯỢC TRONG ỨNG DỤNG, TRONG KHI BÊN ANTIGRAVITY THÌ KHÔNG
 *
 * Antigravity chạy trên Vercel, nơi mỗi lượt gọi hàm nằm trong một máy ảo
 * riêng. Bộ đếm trong bộ nhớ ở đó gần như vô tác dụng: mỗi yêu cầu thấy một bộ
 * đếm trống, nên kẻ dò chỉ cần gửi đủ nhanh để mỗi lượt rơi vào một máy khác.
 * Đó là lý do phần chặn dò mật khẩu bên kia phải đẩy lên tầng tường lửa.
 *
 * Trang này KHÔNG chạy như vậy. Nó là MỘT tiến trình Node sống lâu trong một
 * hộp chứa Docker, phục vụ mọi yêu cầu. Bộ đếm trong bộ nhớ ở đây thấy đúng
 * toàn bộ lưu lượng — nên nó là lớp bảo vệ thật, không phải hình thức.
 *
 * Cách "đúng bài bản" là chặn ở Caddy. Nhưng khối `rate_limit` trong Caddyfile
 * đang phải chú thích lại: bản Caddy chuẩn KHÔNG có mô-đun đó, và bật lên là
 * Caddy từ chối khởi động — mất cả trang. Đổi sang bản Caddy tự dựng kèm mô-đun
 * là thêm một bước biên dịch Go vào mỗi lần triển khai, cho một trang mà người
 * vận hành không đọc được nhật ký.
 *
 * Nên: chặn ở đây, ngay bây giờ, bằng ba mươi dòng. Chặn ở Caddy vẫn tốt hơn
 * (yêu cầu rác không đánh thức Next.js), nhưng "tốt hơn" mà chưa có thì không
 * bảo vệ được gì.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Một cửa sổ đếm cho một khoá. */
interface CuaSo {
  /** Số lượt đã nhận trong cửa sổ hiện tại. */
  dem: number;
  /** Thời điểm cửa sổ hiện tại kết thúc (mili giây). */
  hetLuc: number;
}

/**
 * ⚠️ GIỚI HẠN SỐ KHOÁ, KHÔNG PHẢI ĐỂ TIẾT KIỆM — ĐỂ KHÔNG TỰ GIẾT MÌNH.
 *
 * Một bộ đếm keyed theo IP mà không có trần là một đường tấn công MỚI, không
 * phải một lớp bảo vệ: kẻ gửi rác chỉ cần đổi IP mỗi lượt (rất rẻ với IPv6) là
 * cái Map này phình tới khi hộp chứa hết bộ nhớ và bị Docker giết. Lúc đó cả
 * trang tắt — tệ hơn hẳn thứ mình đang cố ngăn.
 *
 * 10.000 khoá là đủ rộng cho lưu lượng thật của một trang bất động sản, và đủ
 * hẹp để phần bộ nhớ chiếm luôn nằm dưới vài MB.
 */
const TRAN_SO_KHOA = 10_000;

const bang = new Map<string, CuaSo>();

/**
 * Dọn các cửa sổ đã hết hạn. Gọi khi bảng chạm trần.
 *
 * Nếu dọn xong vẫn chạm trần — tức đang có hơn 10.000 IP hoạt động cùng lúc —
 * thì xoá sạch và bắt đầu lại. Thà mất bộ đếm một nhịp còn hơn tăng vô hạn.
 */
function don(bayGio: number): void {
  for (const [khoa, o] of bang) {
    if (o.hetLuc <= bayGio) bang.delete(khoa);
  }
  if (bang.size >= TRAN_SO_KHOA) bang.clear();
}

/**
 * Lấy khoá đếm từ yêu cầu.
 *
 * ⚠️ HEADER NÀY CHỈ ĐÁNG TIN KHI ĐỨNG SAU CADDY.
 *
 * `Caddyfile` có `header_up X-Real-IP {remote_host}`, và `header_up` GHI ĐÈ giá
 * trị khách gửi lên — nên sau Caddy thì header này là địa chỉ thật, khách không
 * giả được.
 *
 * Nhưng nếu ai đó mở thẳng cổng 3000 ra internet (bỏ qua Caddy), header này do
 * chính kẻ gọi đặt, và họ đổi nó mỗi lượt để có hạn mức vô hạn. `docker-
 * compose.yml` cố ý chỉ `expose` chứ không `ports` đúng vì lý do đó — đừng đổi.
 *
 * Không có header thì gom hết vào một khoá chung. Chặt hơn mức cần, nhưng
 * hướng sai an toàn: chạy ở máy thì mọi yêu cầu đều là của chính mình.
 */
function khoaTu(dau: Headers): string {
  const thuc = dau.get("x-real-ip");
  if (thuc) return thuc;

  // `X-Forwarded-For` là một danh sách; mục ĐẦU là khách gốc.
  const chuyenTiep = dau.get("x-forwarded-for");
  if (chuyenTiep) return chuyenTiep.split(",")[0]!.trim();

  return "khong-ro";
}

export interface KetQuaGioiHan {
  /** `true` nghĩa là ĐÃ VƯỢT hạn mức — bên gọi phải từ chối. */
  vuot: boolean;
  /** Số giây tới khi cửa sổ mở lại. Dùng cho header `Retry-After`. */
  choGiay: number;
}

/**
 * Đếm một lượt và cho biết đã vượt hạn mức chưa.
 *
 * Cửa sổ CỐ ĐỊNH, không phải trượt. Cố định thì kém chính xác hơn ở mép cửa sổ
 * (kẻ gửi rác canh đúng lúc chuyển cửa sổ có thể gửi gấp đôi trong chốc lát),
 * nhưng nó chỉ tốn một số nguyên cho mỗi khoá thay vì một danh sách mốc thời
 * gian. Với mục đích ở đây — chặn máy bơm số, không phải chống tấn công có tổ
 * chức — đó là đổi đúng chiều.
 *
 * @param cong    tên cổng, để hai cổng đếm riêng nhau
 * @param yeuCau  yêu cầu đang xử lý
 * @param soLuot  số lượt cho phép trong một cửa sổ
 * @param giay    độ dài cửa sổ, tính bằng giây
 */
export function demMotLuot(
  cong: string,
  yeuCau: Request,
  soLuot: number,
  giay: number,
): KetQuaGioiHan {
  return demMotLuotTuHeader(cong, yeuCau.headers, soLuot, giay);
}

/**
 * Bản nhận thẳng `Headers` — dùng cho SERVER ACTION.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO PHẢI CÓ BẢN NÀY, VÀ NÓ VÁ LỖ GÌ
 *
 * Server action không nhận được đối tượng `Request` như route handler, nên nó
 * KHÔNG gọi được `demMotLuot`. Hệ quả đo được: `/api/ingest` có chặn dò khoá
 * (20 lượt/phút) còn `/duyet-bai` thì không — trong khi CẢ HAI dùng chung đúng
 * một `INGEST_TOKEN`.
 *
 * Tức là khoá có hai cửa, chỉ một cửa có người gác. Kẻ dò chỉ cần bỏ qua cửa
 * có gác và gõ cửa còn lại với tốc độ tuỳ thích. Hạn mức đặt ở cổng nhận bài
 * trở thành trang trí.
 *
 * Lấy header trong server action bằng `headers()` của `next/headers` — hàm
 * BẤT ĐỒNG BỘ ở Next 16, phải `await`.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function demMotLuotTuHeader(
  cong: string,
  dau: Headers,
  soLuot: number,
  giay: number,
): KetQuaGioiHan {
  const bayGio = Date.now();
  const khoa = `${cong}:${khoaTu(dau)}`;

  if (bang.size >= TRAN_SO_KHOA) don(bayGio);

  const o = bang.get(khoa);

  if (!o || o.hetLuc <= bayGio) {
    bang.set(khoa, { dem: 1, hetLuc: bayGio + giay * 1000 });
    return { vuot: false, choGiay: 0 };
  }

  o.dem++;
  if (o.dem > soLuot) {
    return { vuot: true, choGiay: Math.max(1, Math.ceil((o.hetLuc - bayGio) / 1000)) };
  }
  return { vuot: false, choGiay: 0 };
}

/** Xoá sạch bộ đếm. CHỈ dùng trong kiểm thử. */
export function xoaSachBoDem(): void {
  bang.clear();
}
