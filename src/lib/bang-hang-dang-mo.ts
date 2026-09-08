import quyCan from "@/data/quy-can.generated.json";

/**
 * Tóm tắt TOÀN BỘ bảng hàng đang mở bán — không gán vào phân khu nào.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ VÌ SAO KHÔNG GÁN THEO PHÂN KHU, DÙ ĐÃ HỎI VÀ ĐÃ CÓ CÂU TRẢ LỜI
 *
 * `quy-can.generated.json` sinh từ hệ thống SalePro của chủ đầu tư, và hệ thống
 * đó chỉ ghi TIỂU KHU (`row_name`), không có cột phân khu. Nên phép nối "tiểu
 * khu này thuộc phân khu kia" không suy ra được từ dữ liệu.
 *
 * Đã hỏi chủ trang (09/09/2026). Câu trả lời: cả hai tiểu khu đang mở —
 * "Vịnh Bình Minh 1" và "Thiên Đường Nhiệt Đới 1" — thuộc Vịnh Thiên Đường.
 *
 * NHƯNG tra chéo lại thì hai nguồn ngoài nói ngược nhau, và một trong hai nói
 * ngược với câu trên:
 *
 *   · vinhomeshalongxanhquangninh.com (trang mặt bằng Paradise Bay) mô tả
 *     Thiên Đường Nhiệt Đới là "khu vực bãi biển nhân tạo ngay phía Nam" CỦA
 *     Vịnh Thiên Đường, và liệt kê ba khu giáp ranh — tức nằm CẠNH, không phải
 *     nằm TRONG.
 *   · Một trang khác lại liệt kê đúng hai tiểu khu đó NẰM TRONG Vịnh Thiên Đường.
 *
 * Hai nguồn ngoài mâu thuẫn nhau nên chúng không phân xử được, và cũng không đủ
 * sức bác lời chủ trang — người đang giữ tài liệu gốc.
 *
 * Nên tệp này viết CÂU ĐÚNG DƯỚI CẢ HAI CÁCH HIỂU: "toàn dự án hiện mở bán N
 * căn ở hai tiểu khu X và Y". Câu đó lấy thẳng từ hệ thống chủ đầu tư và không
 * phụ thuộc vào việc tiểu khu nằm trong hay nằm cạnh phân khu nào.
 *
 * 🔓 KHI NÀO ĐƯỢC GÁN THEO PHÂN KHU: khi mặt bằng chính thức của chủ đầu tư ghi
 * rõ ranh giới. Lúc đó mới tách được thành từng trang phân khu — và trang
 * `/phan-khu/paradise-bay` sẽ nói được điều mạnh hơn hẳn hiện nay.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Can = (typeof quyCan.can)[number];

export interface BangHangDangMo {
  soCan: number;
  tieuKhu: { ten: string; so: number }[];
  loaiHinh: { ten: string; so: number }[];
  dtDat: { nhoNhat: number; lonNhat: number } | null;
  gia: { nhoNhat: number; lonNhat: number } | null;
  docLuc: string;
}

function khoang(cua: Can[], lay: (c: Can) => number | null) {
  // Bỏ cả 0 lẫn null: một bản ghi có diện tích xây dựng bằng 0, và hiện
  // "0 – 412,2 m²" là nói dối bằng một dấu gạch nối.
  const so = cua.map(lay).filter((v): v is number => typeof v === "number" && v > 0);
  if (so.length === 0) return null;
  return { nhoNhat: Math.min(...so), lonNhat: Math.max(...so) };
}

function dem(cua: Can[], lay: (c: Can) => string | null) {
  const bang = new Map<string, number>();
  for (const c of cua) {
    const v = lay(c);
    if (!v) continue;
    bang.set(v, (bang.get(v) ?? 0) + 1);
  }
  return [...bang].map(([ten, so]) => ({ ten, so })).sort((a, b) => b.so - a.so);
}

export function bangHangDangMo(): BangHangDangMo | null {
  const cua = quyCan.can;
  if (cua.length === 0) return null;
  return {
    soCan: cua.length,
    tieuKhu: dem(cua, (c) => c.tieuKhu),
    loaiHinh: dem(cua, (c) => c.loaiHinh),
    dtDat: khoang(cua, (c) => c.dtDat),
    gia: khoang(cua, (c) => c.giaGomVat),
    docLuc: quyCan.docLuc,
  };
}
