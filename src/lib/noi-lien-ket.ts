import { DUONG_DAN } from "@/lib/duong-dan";

/**
 * Tự nối cụm từ khoá trong thân bài tới trang tương ứng.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO BÀI TỰ ĐỘNG KHÔNG BAO GIỜ CÓ LIÊN KẾT
 *
 * Mô hình viết bài không biết trang này có những địa chỉ nào. Nó không cãi lệnh
 * — chỉ là không ai đưa cho nó bản đồ. Và cũng KHÔNG NÊN đưa: một mô hình được
 * phát cho danh sách URL sẽ bịa thêm những URL nghe hợp lý mà không tồn tại,
 * và mỗi liên kết chết là một lần người đọc bấm vào chỗ trống.
 *
 * Nên việc nối liên kết thuộc về phía TRANG, nơi danh sách địa chỉ là thứ trình
 * biên dịch kiểm được (`DUONG_DAN`).
 *
 * Bài viết không liên kết đi đâu thì mất ba thứ cùng lúc: người đọc hết bài rồi
 * dừng, Google không có đường đi tiếp để hiểu cấu trúc trang, và trợ lý AI mất
 * ngữ cảnh để trả lời sâu hơn câu vừa đọc.
 *
 * ⚠️ BỐN RÀNG BUỘC, MỖI CÁI CHỐNG MỘT CÁCH HỎNG CỤ THỂ
 *
 * 1 · CHỈ LẦN XUẤT HIỆN ĐẦU TIÊN của mỗi cụm. Nối mọi lần là biến bài thành
 *     một rừng chữ xanh, và Google đọc ra là nhồi liên kết.
 *
 * 2 · KHÔNG nối bên trong `<a>` đang có, và KHÔNG nối trong `<h2>`/`<h3>`.
 *     Liên kết lồng nhau là HTML hỏng; còn tiêu đề là mốc điều hướng, gắn liên
 *     kết vào đó làm người đọc mất chỗ bám khi lướt.
 *
 * 3 · TRẦN 6 LIÊN KẾT mỗi bài. Không phải con số thiêng — nhưng một bài 1.300
 *     từ mà có 15 liên kết thì đọc như trang quảng cáo.
 *
 * 4 · CỤM DÀI XÉT TRƯỚC. "giá thực trả" phải được xét trước "giá", nếu không
 *     thì cụm ngắn nuốt mất cụm dài và liên kết trỏ sai trang.
 *
 * VÌ SAO KHÔNG DÙNG REGEX THẲNG TRÊN HTML
 *
 * Vì nó sẽ thay cả chữ nằm trong thuộc tính thẻ — `alt="... giá ..."` biến
 * thành một thẻ `<a>` nhét giữa thuộc tính, và cả khối HTML vỡ. Nên phải tách
 * chuỗi thành đoạn THẺ và đoạn CHỮ trước, chỉ đụng vào đoạn chữ.
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface Cum {
  /** Cụm chữ cần tìm, không phân biệt hoa thường. */
  cum: string;
  duongDan: string;
}

/**
 * Xếp theo ĐỘ DÀI GIẢM DẦN ở bước dùng, không phải ở đây — nhưng vẫn viết dài
 * trước cho người đọc mã thấy rõ thứ tự ưu tiên.
 */
const CUM: Cum[] = [
  { cum: "giá thực trả", duongDan: DUONG_DAN.giaThucTra },
  { cum: "chính sách bán hàng", duongDan: DUONG_DAN.chinhSach },
  { cum: "voucher vinhomes", duongDan: DUONG_DAN.voucher },
  { cum: "giá trị tài sản", duongDan: DUONG_DAN.giaTriTaiSan },
  { cum: "tiến độ xây dựng", duongDan: DUONG_DAN.tienDo },
  { cum: "quy hoạch", duongDan: DUONG_DAN.quyHoach },
  { cum: "pháp lý", duongDan: DUONG_DAN.phapLy },
  { cum: "quỹ căn", duongDan: DUONG_DAN.quyCan },
  { cum: "tiện ích", duongDan: DUONG_DAN.tienIch },
  { cum: "vị trí", duongDan: DUONG_DAN.viTri },
  { cum: "tiến độ", duongDan: DUONG_DAN.tienDo },
  { cum: "voucher", duongDan: DUONG_DAN.voucher },
];

const TRAN = 6;

/** Thoát ký tự đặc biệt của biểu thức chính quy. */
function thoat(cau: string): string {
  return cau.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function noiLienKet(html: string): string {
  if (!html) return html;

  const daNoi = new Set<string>();
  let soLienKet = 0;

  // Tách thành đoạn THẺ (<...>) và đoạn CHỮ. Chỉ đụng vào đoạn chữ.
  const manh = html.split(/(<[^>]+>)/);

  // Theo dõi đang ở trong <a> hay trong tiêu đề — hai chỗ tuyệt đối không nối.
  let trongA = 0;
  let trongTieuDe = 0;

  for (let i = 0; i < manh.length; i++) {
    const m = manh[i];

    if (m.startsWith("<")) {
      if (/^<a[\s>]/i.test(m)) trongA++;
      else if (/^<\/a>/i.test(m)) trongA = Math.max(0, trongA - 1);
      else if (/^<h[1-6][\s>]/i.test(m)) trongTieuDe++;
      else if (/^<\/h[1-6]>/i.test(m)) trongTieuDe = Math.max(0, trongTieuDe - 1);
      continue;
    }

    if (trongA > 0 || trongTieuDe > 0 || soLienKet >= TRAN) continue;

    let doan = m;
    // Cụm dài trước — xem ràng buộc 4.
    for (const { cum, duongDan } of [...CUM].sort((a, b) => b.cum.length - a.cum.length)) {
      if (soLienKet >= TRAN) break;
      if (daNoi.has(duongDan)) continue;

      const re = new RegExp(thoat(cum), "i");
      const khop = re.exec(doan);
      if (!khop) continue;

      // Giữ NGUYÊN VĂN chữ trong bài, chỉ bọc thẻ quanh nó — đổi chữ của người
      // viết thành chữ của mình là sửa bài, không phải nối liên kết.
      const goc = khop[0];
      doan =
        doan.slice(0, khop.index) +
        `<a href="${duongDan}">${goc}</a>` +
        doan.slice(khop.index + goc.length);
      daNoi.add(duongDan);
      soLienKet++;
    }
    manh[i] = doan;
  }

  return manh.join("");
}
