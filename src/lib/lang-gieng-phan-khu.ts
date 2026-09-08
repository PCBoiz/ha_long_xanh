import { phanKhu } from "@/data/project";

/**
 * Hai phân khu gần nhất trên sơ đồ quy hoạch.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CHỈ NÓI "GẦN NHẤT" CHỨ KHÔNG NÓI "GIÁP" HAY "PHÍA BẮC"
 *
 * Toạ độ `x/y` là phần trăm TRÊN ẢNH sơ đồ, không phải kinh vĩ độ. Từ đó suy
 * ra hướng la bàn đòi hỏi biết ảnh có quay đúng hướng bắc hay không — không ai
 * xác nhận điều đó, nên "phía bắc" sẽ là một câu bịa nghe rất thật.
 *
 * "Giáp" cũng là một tuyên bố mạnh hơn thứ đo được: hai khu gần nhau trên bản
 * đồ chưa chắc chung đường biên. Còn "gần nhất trên sơ đồ" thì đúng đến từng
 * chữ, và tự kiểm được bằng chính hai con số đang có.
 *
 * ⚠️ VÀ ĐÂY LÀ THỨ LÀM CHÍN TRANG KHÁC NHAU. Chín trang phân khu hiện gần như
 * giống hệt nhau — cùng một tấm bản đồ, cùng ba gạch đầu dòng cùng khuôn. Trên
 * một tên miền mới chưa có uy tín, chín trang na ná nhau ở mức 330 từ đúng là
 * hình dạng mà Google gọi là nội dung mỏng.
 *
 * Câu láng giềng khác nhau ở từng trang, và khác vì SỰ THẬT khác — không phải
 * vì viết lách khác đi cho có vẻ khác.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function langGieng(ma: string, soLuong = 2) {
  const minh = phanKhu.find((k) => k.ma === ma);
  if (!minh) return [];
  return phanKhu
    .filter((k) => k.ma !== ma)
    .map((k) => ({ khu: k, xa: Math.hypot(k.x - minh.x, k.y - minh.y) }))
    .sort((a, b) => a.xa - b.xa)
    .slice(0, soLuong)
    .map((m) => m.khu);
}
