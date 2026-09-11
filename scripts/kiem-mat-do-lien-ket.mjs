#!/usr/bin/env node
/**
 * Mỗi trang trong site phải được ĐỦ NHIỀU trang khác trỏ tới.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LỖI PHÉP KIỂM NÀY GIỮ KHÔNG QUAY LẠI
 *
 * 11/09/2026, lần đầu soi Google bằng URL Inspection API: 16/31 địa chỉ đã vào
 * chỉ mục. Trong 15 địa chỉ chưa vào có 7/9 trang phân khu và 4/5 dòng sản
 * phẩm — "Đã phát hiện thấy – hiện chưa được lập chỉ mục": Google biết mà chưa
 * ghé. Đếm liên kết nội bộ từ 16 trang đã vào:
 *
 *     bốn trang trên thanh điều hướng     16/16 trang trỏ tới
 *     mỗi trang phân khu / sản phẩm        3–4/16
 *
 * Google xếp lịch crawl theo đúng mật độ đó. Chú thích trong chân trang đã ghi
 * quy tắc "thêm một trang thì thêm luôn một dòng ở đây" từ trước — 14 trang này
 * dựng sau câu đó, và không ai thêm. Quy tắc viết bằng chữ thì bị quên; viết
 * bằng phép kiểm thì không.
 *
 * ĐO TRÊN BẢN DỰNG, không đo mã nguồn: liên kết nằm rải trong component, header,
 * footer, thân bài — chỉ HTML đã dựng mới cho con số thật. Chưa có bản dựng thì
 * BỎ QUA có báo, không đỏ: phép kiểm không được làm hỏng `npm run kiem` trên máy
 * vừa clone về.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const GOC = ".next/server/app";

// Ngưỡng: mọi trang phải được ít nhất chừng này trang khác trỏ tới. Với site
// 31 trang mà header + footer đã liệt kê đủ thì con số thật là ~30. Đặt 10 để
// bắt được trường hợp "chỉ có menu thả xuống hoặc chỉ /du-an trỏ tới" (3–4)
// mà không đỏ vì một trang bị bỏ khỏi một cột nào đó.
const NGUONG = 10;

if (!existsSync(GOC)) {
  console.log(`(bỏ qua: chưa có bản dựng ở ${GOC} — chạy \`npm run build\` rồi kiểm lại)`);
  process.exit(0);
}

// Gom mọi HTML đã dựng → đường dẫn trang.
function timHtml(thuMuc, ra = []) {
  for (const ten of readdirSync(thuMuc)) {
    const duong = join(thuMuc, ten);
    if (statSync(duong).isDirectory()) timHtml(duong, ra);
    else if (ten.endsWith(".html")) ra.push(duong);
  }
  return ra;
}
const tep = timHtml(GOC);
if (tep.length === 0) {
  console.log("(bỏ qua: bản dựng không có tệp .html nào)");
  process.exit(0);
}

// Đường dẫn của một tệp html: `.next/server/app/phan-khu/festa-bay.html` → `/phan-khu/festa-bay`
const duongDanCua = (t) => {
  const rel = t.replace(/\\/g, "/").slice(GOC.length);
  if (rel === "/index.html") return "/";
  return rel.replace(/\.html$/, "");
};

// Trang nào là trang công khai cần đo: bỏ những trang cố ý ngoài chỉ mục.
// `/duyet-bai` cố ý noindex; mọi thứ bắt đầu bằng `/_` là trang nội bộ của
// Next (`/_not-found`, `/_global-error`) — không ai trỏ tới chúng, và không nên.
const BO_QUA = new Set(["/duyet-bai"]);

const trang = tep
  .map((t) => ({ duongDan: duongDanCua(t), html: readFileSync(t, "utf8") }))
  .filter((p) => !BO_QUA.has(p.duongDan) && !p.duongDan.startsWith("/_"));

const danhSach = trang.map((p) => p.duongDan);
const thieu = [];
for (const dich of danhSach) {
  // Đếm số TRANG (không phải số link) trỏ tới `dich`, trừ chính nó.
  const mau = `href="${dich}"`;
  const soTrang = trang.filter((p) => p.duongDan !== dich && p.html.includes(mau)).length;
  if (soTrang < NGUONG) thieu.push({ dich, soTrang });
}

console.log(`Đo ${trang.length} trang trên bản dựng · ngưỡng ≥${NGUONG} trang trỏ tới mỗi trang`);
if (thieu.length === 0) {
  console.log("✓ Mọi trang đều được đủ trang khác trỏ tới.");
  process.exit(0);
}
thieu.sort((a, b) => a.soTrang - b.soTrang);
console.error(`✗ ${thieu.length} trang được quá ít trang trỏ tới:`);
for (const { dich, soTrang } of thieu) {
  console.error(`    ${String(soTrang).padStart(2)}/${trang.length - 1}  ${dich}`);
}
console.error("\n  Thêm vào chân trang (site-footer.tsx). Menu thả xuống không tính.");
console.error("  Google xếp lịch crawl theo mật độ liên kết nội bộ — trang ít link vào chỉ mục sau cùng.");
process.exit(1);
