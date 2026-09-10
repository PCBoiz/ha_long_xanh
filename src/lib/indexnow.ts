import { DIA_CHI_GOC, CHO_LAP_CHI_MUC } from "@/lib/site";

/**
 * IndexNow — báo thẳng cho Bing khi có địa chỉ mới hoặc vừa đổi.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO ĐÁNG LÀM, VÀ VÌ SAO CHỈ BING
 *
 * Sitemap là lời mời: máy tìm kiếm ghé khi nào nó muốn, thường vài ngày tới
 * vài tuần với trang mới không có liên kết trỏ tới. IndexNow là cú gõ cửa: gửi
 * một địa chỉ, Bing nhận ngay.
 *
 * Google KHÔNG dùng IndexNow — họ nói rõ vậy. Nên đừng kỳ vọng ping xong là
 * lên Google. Giá trị nằm ở chỗ khác: Bing cấp dữ liệu cho **ChatGPT Search và
 * Copilot**. Bài được Bing lập chỉ mục sớm là bài có cửa được trợ lý AI nhắc
 * tới sớm — mà đó đúng là kênh trang này đang nhắm.
 *
 * ⚠️ MỘT KHOÁ SỐNG ĐƯỢC LÀ KHI TỆP KHOÁ TỒN TẠI TRÊN CHÍNH TÊN MIỀN ĐÓ.
 *
 * IndexNow xác minh quyền sở hữu bằng cách gọi ngược lại
 * `https://<tên miền>/<khoá>.txt` và đọc nội dung — nội dung phải đúng bằng
 * chính khoá.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO KHOÁ NẰM THẲNG TRONG MÃ, KHÔNG PHẢI TRONG BIẾN MÔI TRƯỜNG
 *
 * Khoá IndexNow KHÔNG phải bí mật. Cả cơ chế của nó là "tệp này đọc được công
 * khai trên tên miền, nên ai gửi được nó thì chứng tỏ có quyền ghi lên tên
 * miền". Ai mở `https://halongxanh360.vn/<khoá>.txt` đều đọc được. Giấu nó
 * trong biến môi trường không thêm một chút an toàn nào, mà lại tạo ra hai
 * nguồn sự thật — khoá ở biến, tệp ở nơi khác — và hai nguồn thì có ngày lệch.
 *
 * ⚠️ ĐÃ THỬ CÁCH KHÁC VÀ NÓ HỎNG THEO KIỂU IM LẶNG. Bản đầu ngày 10/09 dựng
 * một tuyến động `src/app/[khoaIndexNow]/route.ts` đọc khoá từ biến môi trường.
 * Nó chạy đúng: tệp khoá trả 200, khoá sai trả 404. Nhưng tuyến động một đoạn ở
 * GỐC bắt luôn MỌI địa chỉ lạ — và đo trên bản dựng thật:
 *
 *     /khong-ton-tai/abc   (hai đoạn, không bị bắt)  404 · 40.708 byte HTML
 *     /khong-ton-tai-dau   (một đoạn, bị bắt)        404 ·      0 byte
 *
 * Tức là mọi địa chỉ gõ sai một đoạn — `/du-a`, `/gia`, `/tien-ic` — nhận một
 * trang TRẮNG thay vì trang 404 của site. Thêm một tính năng cho Bing mà lấy
 * mất trang lỗi của người thật.
 *
 * Tệp tĩnh trong `public/` không có nhược điểm nào trong số đó: không bắt tuyến
 * nào, không cần biến lúc dựng, và chính TỆP là nguồn sự thật.
 *
 * `scripts/kiem-indexnow.mjs` khoá hai thứ lại với nhau — hằng số dưới đây phải
 * khớp đúng tên và nội dung tệp trong `public/`, sai là cổng kiểm đỏ.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Khoá IndexNow. Đổi khoá thì phải đổi CẢ tệp trong `public/` — `npm run kiem` giữ hai thứ khớp nhau. */
export const KHOA_INDEXNOW = "a89f551822f0aacd4133bb9aa6412a61";

const DIEM_CUOI = "https://api.indexnow.org/indexnow";
const HET_GIO_MS = 8_000;

export interface KetQuaIndexNow {
  daGui: boolean;
  /** Câu giải thích ngắn — để ghi log, không đưa ra cho người dùng. */
  lyDo: string;
}

/** Khoá IndexNow, hoặc `null` nếu hằng số bị sửa thành thứ IndexNow không nhận. */
export function layKhoaIndexNow(): string | null {
  // IndexNow yêu cầu khoá 8–128 ký tự, chỉ chữ số và dấu gạch ngang. Kiểm ở
  // đây thay vì để máy chủ Bing từ chối, vì lời từ chối của họ đến sau và
  // không ai đọc.
  return /^[A-Za-z0-9-]{8,128}$/.test(KHOA_INDEXNOW) ? KHOA_INDEXNOW : null;
}

/**
 * Báo cho Bing một hoặc nhiều địa chỉ vừa đổi.
 *
 * ⚠️ HÀM NÀY KHÔNG BAO GIỜ NÉM LỖI.
 *
 * Nó được gọi ngay sau khi bài đã được duyệt và đã vào cơ sở dữ liệu. Đến bước
 * đó thì việc đăng bài ĐÃ XONG — Bing có nhận được hay không là chuyện phụ.
 * Để một lỗi mạng ở đây làm nút "Duyệt và đăng" báo đỏ là nói dối người dùng
 * về một việc đã thành công, và tệ hơn: họ sẽ bấm lại.
 */
export async function baoIndexNow(
  duongDan: readonly string[],
): Promise<KetQuaIndexNow> {
  if (!CHO_LAP_CHI_MUC) {
    // Chưa mở lập chỉ mục thì mọi trang đang mang `noindex`. Mời Bing vào lúc
    // này là mời nó tới đọc một tấm biển "đừng lập chỉ mục".
    return { daGui: false, lyDo: "Chưa bật lập chỉ mục." };
  }

  const khoa = layKhoaIndexNow();
  if (!khoa) {
    return {
      daGui: false,
      lyDo: "KHOA_INDEXNOW không đúng dạng IndexNow chấp nhận (8–128 ký tự chữ/số/gạch ngang).",
    };
  }

  let host: string;
  try {
    host = new URL(DIA_CHI_GOC).host;
  } catch {
    return { daGui: false, lyDo: "Địa chỉ gốc không hợp lệ." };
  }
  if (host.startsWith("localhost")) {
    return { daGui: false, lyDo: "Đang chạy ở máy cục bộ." };
  }

  const urlList = [...new Set(duongDan)].map((d) =>
    d.startsWith("http") ? d : `${DIA_CHI_GOC}${d.startsWith("/") ? d : `/${d}`}`,
  );
  if (urlList.length === 0) {
    return { daGui: false, lyDo: "Không có địa chỉ nào để gửi." };
  }

  try {
    const phanHoi = await fetch(DIEM_CUOI, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: khoa,
        keyLocation: `${DIA_CHI_GOC}/${khoa}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(HET_GIO_MS),
    });

    // 200 và 202 đều là nhận. 202 nghĩa là "đã nhận, đang chờ xác minh khoá" —
    // gặp ở lần gửi đầu tiên sau khi đặt khoá mới, và là chuyện bình thường.
    if (phanHoi.status === 200 || phanHoi.status === 202) {
      return { daGui: true, lyDo: `Đã gửi ${urlList.length} địa chỉ.` };
    }
    // 403 gần như luôn là "tệp khoá không đọc được trên tên miền" — nói thẳng
    // ra đây để người đọc log không phải đi tra bảng mã lỗi.
    if (phanHoi.status === 403) {
      return {
        daGui: false,
        lyDo: `Bing không xác minh được khoá — kiểm ${DIA_CHI_GOC}/${khoa}.txt có mở được không.`,
      };
    }
    return { daGui: false, lyDo: `Bing trả HTTP ${phanHoi.status}.` };
  } catch {
    return { daGui: false, lyDo: "Không gọi được máy chủ IndexNow." };
  }
}
