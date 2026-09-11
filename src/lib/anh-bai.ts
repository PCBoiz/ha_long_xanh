import { createHash } from "node:crypto";

/**
 * Ảnh đi kèm bài — do bên gửi bài (Antigravity) chọn từ THƯ MỤC DRIVE CỦA CHỦ
 * TRANG rồi gửi kèm nội dung.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ĐÂY LÀ NGOẠI LỆ CÓ CHỦ Ý CỦA LUẬT "ẢNH CHỌN Ở PHÍA TRANG" trong `anh-cho-bai.ts`.
 *
 * Luật đó có hai lý do: bên gửi không biết kho ảnh có gì, và ảnh không được
 * là ảnh AI. Cả hai vẫn đúng. Nhưng từ 12/09/2026 bên gửi có một nguồn ảnh
 * KHÁC: thư mục Google Drive của chính chủ trang — ảnh thật, chủ trang tự tải
 * lên, có mô tả từng tấm. Ảnh từ đó không phải đoán tên, không phải AI sinh.
 * Ảnh kèm bài KHÔNG thay kho ảnh sẵn: bài không có ảnh kèm vẫn lấy ảnh theo
 * chuyên mục như cũ.
 *
 * KHÔNG THÊM CỘT VÀO CƠ SỞ DỮ LIỆU. Ảnh bìa được ghi thành `<figure
 * data-anh-bia>` ở ĐẦU `noiDung`; lúc dựng trang thì tách ra làm ảnh đầu bài.
 * Đổi lược đồ trên máy chủ thật từng làm hỏng cả đường ống ngày 08/09 — và
 * `noiDung` là HTML, một `<figure>` là thứ nó vốn chứa được. Bộ lọc
 * `lamSachHtml` đã cho phép `img` với `src` nội bộ, không phải nới gì.
 *
 * Tệp ảnh nằm ở `.data/anh/<slug>/<băm>.<đuôi>` — thư mục `.data` có ổ đĩa
 * gắn ngoài trong docker-compose nên sống qua deploy; phục vụ qua
 * `/anh-bai/<slug>/<tệp>`.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const DUONG_ANH_BAI = "/anh-bai";
export const SO_ANH_TOI_DA = 2;
export const BYTE_ANH_TOI_DA = 3 * 1024 * 1024;

export const DUOI_THEO_MIME: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export interface AnhBai {
  src: string;
  alt: string;
}

/** Tên tệp = 12 ký tự băm nội dung + đuôi theo mime. Trùng nội dung thì trùng tên — vô hại. */
export function tenTepAnh(bytes: Uint8Array, mime: string): string {
  const duoi = DUOI_THEO_MIME[mime];
  if (!duoi) throw new Error(`Định dạng ảnh không hỗ trợ: ${mime}`);
  return `${createHash("sha256").update(bytes).digest("hex").slice(0, 12)}.${duoi}`;
}

/** Slug bài và tên tệp ảnh — dùng chung cho cổng nhận và tuyến phục vụ ảnh. */
export const MAU_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAU_TEN_TEP = /^[a-f0-9]{12}\.(?:webp|jpg|png)$/;

function thoatHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Một `<figure>` cho ảnh; ảnh bìa mang `data-anh-bia` để tách ra lúc dựng. */
export function dungFigure(anh: AnhBai, bia: boolean): string {
  return `<figure${bia ? ' data-anh-bia="1"' : ""}><img src="${thoatHtml(anh.src)}" alt="${thoatHtml(anh.alt)}"></figure>`;
}

/**
 * Ghép ảnh vào nội dung: tấm đầu là bìa (đặt ở ĐẦU), tấm sau đặt ở CUỐI thân
 * bài — trước phần FAQ nếu có, để ảnh không chen giữa các cặp hỏi–đáp.
 */
export function ghepAnhVaoBai(noiDung: string, anh: readonly AnhBai[]): string {
  if (anh.length === 0) return noiDung;
  const [bia, ...conLai] = anh;
  let than = noiDung.trim();
  if (conLai.length > 0) {
    const khoiThem = conLai.map((a) => dungFigure(a, false)).join("\n");
    const viTriFaq = than.search(/<h2[^>]*>\s*Câu hỏi thường gặp/i);
    than = viTriFaq >= 0 ? `${than.slice(0, viTriFaq).trimEnd()}\n\n${khoiThem}\n\n${than.slice(viTriFaq)}` : `${than}\n\n${khoiThem}`;
  }
  return `${dungFigure(bia!, true)}\n\n${than}`.trim();
}

/**
 * Tách ảnh bìa khỏi nội dung để dựng trang: trang dùng `anhBia` làm ảnh đầu
 * bài (thay ảnh theo chuyên mục), còn `than` là phần đưa qua bộ lọc HTML.
 */
export function tachAnhBia(noiDung: string | undefined): { anhBia: AnhBai | null; than: string } {
  if (!noiDung) return { anhBia: null, than: "" };
  const m = /^\s*<figure data-anh-bia="1"><img src="([^"]+)" alt="([^"]*)"><\/figure>\s*/.exec(noiDung);
  if (!m) return { anhBia: null, than: noiDung };
  const src = boThoat(m[1]!);
  // Chỉ nhận ảnh nội bộ của chính trang — nội dung là HTML do bên ngoài gửi.
  if (!src.startsWith(`${DUONG_ANH_BAI}/`)) return { anhBia: null, than: noiDung.slice(m[0].length) };
  return { anhBia: { src, alt: boThoat(m[2]!) }, than: noiDung.slice(m[0].length) };
}

function boThoat(s: string): string {
  return s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
}
