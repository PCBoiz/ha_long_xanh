import quyCan from "@/data/quy-can.generated.json";

/**
 * Số liệu của MỘT dòng sản phẩm, tính từ bảng hàng đang mở bán.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO KHỐI NÀY TỒN TẠI
 *
 * Đo ngày 09/09/2026: năm trang `/san-pham/*` chỉ có 338–365 từ. Mỗi trang có
 * một tấm ảnh lớn, một câu mô tả, và một dòng diện tích. Hết.
 *
 * Đó là vấn đề ở hai phía cùng lúc:
 *
 *   · NGƯỜI ĐỌC — mở trang "Nhà liền kề" xong vẫn không biết còn bao nhiêu căn,
 *     xây bao nhiêu mét, bàn giao mức nào, nằm ở tiểu khu nào. Toàn bộ những
 *     câu đó đều đã có câu trả lời trong bảng hàng, chỉ là không ai đưa lên.
 *
 *   · TRỢ LÝ AI — một trang 350 từ hiếm khi được chọn làm nguồn trích dẫn.
 *     Không phải vì ngắn, mà vì không mang dữ kiện nào riêng có.
 *
 * ⚠️ KHÔNG MỘT CÂU NHẬN ĐỊNH NÀO Ở ĐÂY. Mọi con số đều tính từ
 * `quy-can.generated.json`, nên chúng tự đúng lại sau mỗi lần chạy
 * `npm run gop-bang-hang`. Không có bản chép tay thứ hai để lệch.
 *
 * VÀ PHẢI NÓI THẬT KHI KHÔNG CÓ HÀNG: hai dòng "biệt thự biển" và "căn hộ cao
 * tầng" hiện KHÔNG có căn nào trong bảng. Trả `null` để trang nói thẳng là chưa
 * mở bán, thay vì vẽ một bảng rỗng trông như lỗi.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Mã dòng sản phẩm trên trang → tên loại hình trong bảng hàng. */
const KHOP: Record<string, string> = {
  "lien-ke": "Liền kề",
  "song-lap": "Song lập",
  "don-lap": "Đơn lập",
  "biet-thu-bien": "Biệt thự biển",
  "can-ho": "Căn hộ",
};

type Can = (typeof quyCan.can)[number];

export interface SoLieuDong {
  soCan: number;
  dtDat: { nhoNhat: number; lonNhat: number } | null;
  dtXd: { nhoNhat: number; lonNhat: number } | null;
  gia: { nhoNhat: number; lonNhat: number } | null;
  donGiaDat: { nhoNhat: number; lonNhat: number } | null;
  banGiao: { ten: string; so: number }[];
  tieuKhu: { ten: string; so: number }[];
  bienThe: { ten: string; so: number }[];
  docLuc: string;
}

function khoang(cua: Can[], lay: (c: Can) => number | null): SoLieuDong["dtDat"] {
  // Bỏ cả 0 lẫn null — xem ghi chú cùng nội dung trong `scripts/gop-bang-hang.mjs`.
  const so = cua.map(lay).filter((v): v is number => typeof v === "number" && v > 0);
  if (so.length === 0) return null;
  return { nhoNhat: Math.min(...so), lonNhat: Math.max(...so) };
}

function dem(cua: Can[], lay: (c: Can) => string | null): { ten: string; so: number }[] {
  const bang = new Map<string, number>();
  for (const c of cua) {
    const v = lay(c);
    if (!v) continue;
    bang.set(v, (bang.get(v) ?? 0) + 1);
  }
  return [...bang]
    .map(([ten, so]) => ({ ten, so }))
    .sort((a, b) => b.so - a.so);
}

export function soLieuDong(ma: string): SoLieuDong | null {
  const ten = KHOP[ma];
  if (!ten) return null;
  const cua = quyCan.can.filter((c) => c.loaiHinh === ten);
  if (cua.length === 0) return null;

  return {
    soCan: cua.length,
    dtDat: khoang(cua, (c) => c.dtDat),
    dtXd: khoang(cua, (c) => c.dtXd),
    gia: khoang(cua, (c) => c.giaGomVat),
    donGiaDat: khoang(cua, (c) => c.donGiaDat),
    banGiao: dem(cua, (c) => c.banGiao),
    tieuKhu: dem(cua, (c) => c.tieuKhu),
    // Chỉ nêu biến thể khi nó KHÁC tên dòng — "Liền kề góc" đáng nói, còn
    // "Liền kề" trùng tên dòng thì nhắc lại chỉ tốn chỗ.
    bienThe: dem(cua, (c) => (c.loaiChiTiet === ten ? null : c.loaiChiTiet)),
    docLuc: quyCan.docLuc,
  };
}
