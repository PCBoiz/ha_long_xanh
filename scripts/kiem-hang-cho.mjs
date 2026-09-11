// Màn duyệt bài phải đọc hàng chờ bằng đường KHÔNG NUỐT LỖI.
//
// ═══════════════════════════════════════════════════════════════════════════
// VÌ SAO CẦN PHÉP KIỂM NÀY — LỖI THẬT NGÀY 12/09/2026
//
// `docBaiChoDuyet` bọc `docAnToan`: cơ sở dữ liệu hỏng thì trả `[]`. Đúng cho
// trang công khai. Nhưng `layHangCho` (màn /duyet-bai) từng gọi đúng hàm đó,
// nên khi Neon vừa ngủ dậy chưa kịp trả lời, màn in "Hàng chờ trống." — trong
// khi Antigravity vừa báo "đã nhận, chờ duyệt". Chủ trang đứng giữa hai màn
// nói ngược nhau, và màn sai là màn trấn an.
//
// Giờ màn duyệt dùng `docBaiChoDuyetThat` (trả `{ok:false, lyDo}` khi hỏng).
// Phép kiểm này khoá lại chuyện đó bằng cách đọc mã nguồn: ai đổi lại thành
// hàm nuốt lỗi là đỏ. Kiểm tĩnh thì yếu hơn chạy thật, nhưng đường này cần
// một cơ sở dữ liệu hỏng để thử — và một dòng grep còn hơn không có gì.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync } from "node:fs";

const duyet = readFileSync("src/lib/duyet-bai.ts", "utf8");
const tinTuc = readFileSync("src/lib/tin-tuc.ts", "utf8");
const loi = [];

// Chỉ xét thân hàm layHangCho.
const dau = duyet.indexOf("export async function layHangCho");
const cuoi = duyet.indexOf("\nexport ", dau + 1);
const than = duyet.slice(dau, cuoi === -1 ? undefined : cuoi);
if (dau === -1) loi.push("Không tìm thấy `layHangCho` trong src/lib/duyet-bai.ts");
if (!/docBaiChoDuyetThat/.test(than)) {
  loi.push("`layHangCho` không dùng `docBaiChoDuyetThat` — màn duyệt sẽ in 'Hàng chờ trống' khi cơ sở dữ liệu hỏng.");
}
if (/\bdocBaiChoDuyet\(/.test(than)) {
  loi.push("`layHangCho` vẫn gọi `docBaiChoDuyet()` (đường nuốt lỗi).");
}
if (!/ok: false, lyDo/.test(tinTuc)) {
  loi.push("`docBaiChoDuyetThat` trong tin-tuc.ts không còn trả `{ ok: false, lyDo }` khi hỏng.");
}
if (!/Không đọc được hàng chờ/.test(than)) {
  loi.push("`layHangCho` không còn câu báo lỗi 'Không đọc được hàng chờ…' cho chủ trang.");
}

if (loi.length) {
  console.error("✗ Màn duyệt bài có thể lại nói dối khi cơ sở dữ liệu hỏng:");
  for (const l of loi) console.error(`   · ${l}`);
  process.exit(1);
}
console.log("✓ Màn duyệt đọc hàng chờ bằng đường không nuốt lỗi; hỏng thì báo hỏng.");
