// Kiểm Caddyfile mà không cần Docker.
//
// VÌ SAO CÓ FILE NÀY: cách đúng nhất là `caddy validate`, nhưng nó cần Docker
// đang chạy — mà trên máy này Docker chưa bật, và tôi đã hai lần phải ghi
// "chưa kiểm được". Bộ kiểm dưới đây KHÔNG thay thế `caddy validate`; nó bắt
// đúng những lỗi mà một Caddyfile viết tay hay mắc, và mỗi lỗi đó đều đủ sức
// làm cả trang không mở được.
//
//   node scripts/kiem-caddyfile.mjs

import { readFile } from "node:fs/promises";
import path from "node:path";

const DUONG = path.join(process.cwd(), "Caddyfile");

const loi = [];
const canhBao = [];

function bao(dieuKien, thongDiep, nang = true) {
  if (!dieuKien) (nang ? loi : canhBao).push(thongDiep);
}

const tho = await readFile(DUONG, "utf8");
const dong = tho.split("\n");

// ---------------------------------------------------------------- 1. ngoặc
let sau = 0;
let dongLech = 0;
dong.forEach((d, i) => {
  // Bỏ phần chú thích để dấu ngoặc trong ghi chú không bị đếm.
  const sach = d.replace(/#.*$/, "");
  for (const kyTu of sach) {
    if (kyTu === "{") sau++;
    if (kyTu === "}") sau--;
    if (sau < 0 && !dongLech) dongLech = i + 1;
  }
});
bao(sau === 0, `Ngoặc nhọn không cân: lệch ${sau}. Caddy sẽ từ chối khởi động.`);
bao(dongLech === 0, `Có dấu } thừa ở dòng ${dongLech}.`);

/**
 * Tên khối trang lấy từ một dòng mở khối, hoặc null nếu dòng đó không mở khối.
 *
 * KHÔNG dùng mẫu kiểu `[^{]*` để bắt tên: tên khối trong file này CHỨA chính
 * dấu ngoặc nhọn — `www.{$TEN_MIEN} {` — nên mẫu đó dừng ngay ở ngoặc của biến
 * và không khớp gì cả.
 *
 * Bản đầu của bộ kiểm này mắc đúng lỗi đó: nó báo "0 khối trang" trong khi file
 * có hai khối, nghĩa là phép kiểm trùng tên và phép kiểm tự chuyển hướng đều im
 * lặng không chạy — một bộ kiểm báo "sạch" vì nó mù, kiểu hỏng tệ nhất.
 */
function tenKhoiTuDong(d) {
  const sach = d.replace(/#.*$/, "").trimEnd();
  if (!sach.endsWith("{")) return null;
  const ten = sach.slice(0, -1).trim();
  // Khối tuỳ chọn toàn cục mở bằng đúng một dấu `{` — không phải khối trang.
  if (ten === "") return null;
  return [d, ten];
}

// ------------------------------------------------- 2. khối trang trùng tên
// Đây là lỗi tôi ĐÃ MẮC khi viết Caddyfile: hai khối cùng một tên miền. Caddy
// nhận khối sau và bỏ khối trước, nên nửa cấu hình biến mất không báo gì.
// CHỈ đếm khối ở ĐỘ SÂU 0. Các khối lồng bên trong (`header {`,
// `reverse_proxy … {`) không phải khối trang; đếm cả chúng thì hai khối trang
// cùng có `header {` sẽ bị báo trùng oan.
const tenKhoi = [];
let doSau = 0;
for (const d of dong) {
  const sach = d.replace(/#.*$/, "");
  const khop = tenKhoiTuDong(d);
  if (khop && doSau === 0) tenKhoi.push(khop[1].trim());
  for (const kyTu of sach) {
    if (kyTu === "{") doSau++;
    if (kyTu === "}") doSau--;
  }
}
const dem = new Map();
for (const t of tenKhoi) dem.set(t, (dem.get(t) ?? 0) + 1);
for (const [t, n] of dem) {
  bao(n === 1, `Khối "${t}" khai ${n} lần — Caddy chỉ giữ khối cuối, phần còn lại mất im lặng.`);
}

// --------------------------------------------- 3. tự chuyển hướng về chính mình
// Lỗi thứ hai tôi đã mắc: đặt `redir` trỏ về chính tên miền của khối đang
// đứng. Trình duyệt quay vòng tới khi báo "chuyển hướng quá nhiều lần".
let khoiHienTai = null;
dong.forEach((d, i) => {
  const moKhoi = /^([^\s{#][^{]*?)\s*\{\s*$/.exec(d);
  if (moKhoi) khoiHienTai = moKhoi[1].trim();
  if (/^\s*\}\s*$/.test(d)) khoiHienTai = null;

  const redir = /^\s*redir\s+https?:\/\/\{?\$?([^\s}/]+)\}?/.exec(d);
  if (redir && khoiHienTai) {
    const dich = redir[1].replace(/[{}$]/g, "");
    const nguon = khoiHienTai.replace(/[{}$]/g, "");
    bao(
      dich !== nguon,
      `Dòng ${i + 1}: khối "${khoiHienTai}" chuyển hướng về chính nó — trình duyệt sẽ quay vòng vô hạn.`,
    );
  }
});

// ------------------------------------------------------ 4. biến bắt buộc
for (const bien of ["TEN_MIEN", "EMAIL_SSL"]) {
  bao(
    tho.includes(`{$${bien}}`),
    `Thiếu biến {$${bien}} — Caddy sẽ dựng tên miền rỗng và không xin được chứng chỉ.`,
  );
}

// ------------------------------------------------- 5. chuyển tiếp vào web
bao(
  /reverse_proxy\s+web:3000/.test(tho),
  "Không thấy `reverse_proxy web:3000` — Caddy không biết chuyển yêu cầu đi đâu.",
);

// Thiếu ba header này thì Next tự sinh đường dẫn "http://web:3000/..." vào
// sitemap và thẻ chia sẻ. Trang vẫn mở bình thường nên rất khó nhận ra.
for (const h of ["X-Forwarded-Proto", "X-Forwarded-Host"]) {
  bao(tho.includes(h), `Thiếu \`header_up ${h}\` — sitemap và thẻ chia sẻ sẽ trỏ sai địa chỉ.`);
}

// ------------------------------------------------------------- 6. cảnh báo
bao(
  !/Strict-Transport-Security/.test(tho) ||
    /max-age=(\d+)/.test(tho),
  "HSTS khai không có max-age.",
);
if (/max-age=31536000/.test(tho)) {
  canhBao.push(
    "HSTS đặt 1 năm: sau lần ghé đầu, trình duyệt TỪ CHỐI mở trang qua HTTP. " +
      "Nếu HTTPS hỏng thì khách không vào được bằng bất cứ cách nào. Cân nhắc " +
      "để `max-age=300` trong tuần đầu rồi mới nâng lên.",
  );
}

// ------------------------------------------------------------- kết quả
process.stdout.write(`Kiểm ${DUONG}\n\n`);
for (const c of canhBao) process.stdout.write(`⚠  ${c}\n`);
for (const l of loi) process.stdout.write(`✗  ${l}\n`);

if (loi.length === 0) {
  process.stdout.write(
    `\n✓ ${dem.size} khối trang, không thấy lỗi cấu trúc.\n` +
      `  Vẫn nên chạy \`caddy validate\` trên máy chủ trước khi bật — đó mới là\n` +
      `  bộ phân tích thật. Lệnh đã có sẵn ở bước 3 của trien-khai.sh.\n`,
  );
} else {
  process.stdout.write(`\n${loi.length} lỗi phải sửa trước khi bật.\n`);
  process.exitCode = 1;
}
