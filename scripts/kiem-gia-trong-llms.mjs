#!/usr/bin/env node
/**
 * `/llms.txt` PHẢI có khoảng giá thật, tính từ bảng hàng — không phải số chết.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LỖI PHÉP KIỂM NÀY GIỮ KHÔNG QUAY LẠI
 *
 * Ngày 30/09/2026, soát cả file `llms.txt` — tệp viết riêng cho trợ lý AI
 * đọc: không có một mức giá nào. Mục hỏi đáp "Giá bán bao nhiêu?" trả lời
 * bằng một đường dẫn sang trang khác. Trợ lý đọc xong vẫn không có gì để
 * trích, nên nó trích trang nào có số — ảnh chủ dự án gửi 18/09 cho thấy Bing
 * trả lời "bảng giá vin global gate" bằng câu của một trang đối thủ.
 *
 * Trớ trêu là chú thích trong chính mã nguồn đã hứa từ đầu rằng mảng ấy
 * "trả lời bằng số có nguồn". Ý định có, con số chưa bao giờ được thêm. Đó là
 * loại lỗi không triệu chứng: file vẫn dựng, vẫn đúng chính tả, vẫn đầy đủ —
 * chỉ là vô dụng đúng ở câu hỏi số một.
 *
 * Hai điều phép kiểm giữ:
 *   1. Khoảng giá được TÍNH từ `quy-can.generated.json`, không gõ tay. Số gõ
 *      tay sẽ lệch khỏi bảng hàng ngay lần cập nhật sau, mà không ai biết.
 *   2. Câu rào đi kèm con số. Một khoảng giá trần trụi bị trích ra ngoài sẽ
 *      thành "giá toàn dự án" — đúng kiểu sai mà trang này tồn tại để chữa.
 *
 * Kiểm ở MÃ NGUỒN, không ở bản dựng: rẻ, chạy trong mili-giây.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync } from "node:fs";

const TEP = "src/app/llms.txt/route.ts";
const nguon = readFileSync(TEP, "utf8");
const loi = [];

const doi = (mau, moTa) => {
  if (!mau.test(nguon)) loi.push(moTa);
};

doi(
  /import quyCan from "@\/data\/quy-can\.generated\.json"/,
  `${TEP}: không đọc bảng hàng (\`quy-can.generated.json\`) — khoảng giá trong llms.txt sẽ là số chết, lệch khỏi bảng hàng ngay lần cập nhật sau.`,
);
doi(
  /quyCan\.can\.map\(\(c\) => c\.giaGomVat\)/,
  `${TEP}: không tính khoảng giá từ cột giá đầy đủ của bảng hàng.`,
);
doi(
  /dong\.push\(\s*`Giá \$\{duAn\.ten\}/,
  `${TEP}: mảng giá không mở đầu bằng câu tự đứng được ("Giá <tên dự án> theo bảng hàng ngày…") — cắt ra khỏi file thì trợ lý AI không trích được.`,
);
doi(
  /ĐANG MỞ BÁN tại thời điểm đọc file, KHÔNG phải bảng giá của toàn bộ dự án/,
  `${TEP}: thiếu câu rào đi kèm khoảng giá — số bị trích ra ngoài sẽ thành "giá toàn dự án".`,
);
doi(
  /ngayVN\(quyCan\.docLuc\)/,
  `${TEP}: khoảng giá không kèm NGÀY đọc bảng hàng — một con số không có mốc thời gian thì không kiểm được.`,
);

// Số tiền gõ tay trong file này là dấu hiệu ai đó dán một mức giá vào thay vì
// tính. Bắt dạng "12,3 tỷ" / "12.3 ty" nằm trong chuỗi.
const soChet = nguon.match(/\d+[.,]\d+\s*tỷ/g);
if (soChet) {
  loi.push(`${TEP}: có mức giá gõ tay (${soChet.join(", ")}) — phải tính từ bảng hàng.`);
}

if (loi.length > 0) {
  console.error("✗ llms.txt thiếu khoảng giá tính từ bảng hàng:\n");
  for (const l of loi) console.error(`  · ${l}`);
  process.exit(1);
}
console.log("✓ llms.txt có khoảng giá tính từ bảng hàng, kèm ngày đọc và câu rào.");
