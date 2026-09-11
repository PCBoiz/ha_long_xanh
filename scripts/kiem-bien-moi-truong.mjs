// Mọi biến môi trường mà mã trong `src/` đọc phải được docker-compose chuyển
// vào hộp chứa `web`.
//
// ═══════════════════════════════════════════════════════════════════════════
// VÌ SAO CẦN PHÉP KIỂM NÀY — LỖI THẬT NGÀY 12/09/2026
//
// `.dockerignore` loại `.env` khỏi ảnh Docker (đúng — bí mật không được nằm
// trong lớp ảnh). Hệ quả: bên trong hộp chứa, ứng dụng CHỈ thấy những biến
// được liệt kê dưới `services.web.environment` của `docker-compose.yml`. Điền
// đúng `.env` trên máy chủ là chưa đủ.
//
// Ngày 11/09 mã website bắt đầu đọc `LEAD_WEBHOOK_TOKEN` để gửi khách sang
// Google Sheets, `.env.example` có thêm dòng đó, hướng dẫn bảo chủ trang dán
// nó vào `.env` — nhưng không ai thêm nó vào compose. Hộp chứa không thấy
// token, website gửi khách đi không kèm token, cổng nhận từ chối, khách rơi
// về tệp dự phòng. Khách vẫn thấy "Đã nhận". Bảng Sheets trống. Không có gì
// báo đỏ ở đâu cả — chủ trang thử form và tưởng tính năng hỏng.
//
// Loại lỗi này sẽ lặp lại mỗi lần thêm một biến mới, vì chỗ khai biến và chỗ
// dùng biến nằm ở hai tệp khác ngôn ngữ. Nên kiểm bằng máy.
//
// QUY TẮC:
//   · `NEXT_PUBLIC_*` được nhúng vào mã LÚC BUILD → phải có trong
//     `services.web.build.args` (và Dockerfile phải có `ARG` tương ứng).
//   · Mọi biến khác → phải có trong `services.web.environment`.
//   · Trừ biến do nền tảng tự đặt (NODE_ENV, VERCEL, PORT…).
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const GOC = process.cwd();

// Do Node, Next, Docker hoặc Vercel tự đặt — không ai khai trong compose.
const NEN_TANG = new Set([
  "NODE_ENV",
  "NEXT_RUNTIME",
  "NEXT_TELEMETRY_DISABLED",
  "PORT",
  "HOSTNAME",
  "VERCEL",
  "VERCEL_ENV",
  "VERCEL_URL",
]);

function duyet(thuMuc, ra = []) {
  for (const ten of readdirSync(thuMuc)) {
    const p = path.join(thuMuc, ten);
    if (statSync(p).isDirectory()) duyet(p, ra);
    else if (/\.(ts|tsx|js|mjs)$/.test(ten)) ra.push(p);
  }
  return ra;
}

// ── 1. Biến mà mã đọc ──────────────────────────────────────────────────────
const dungO = new Map(); // tên biến → tệp đầu tiên đọc nó
for (const tep of duyet(path.join(GOC, "src"))) {
  const nguon = readFileSync(tep, "utf8");
  for (const m of nguon.matchAll(/process\.env(?:\.([A-Z0-9_]+)|\[\s*["']([A-Z0-9_]+)["']\s*\])/g)) {
    const ten = m[1] ?? m[2];
    if (!dungO.has(ten)) dungO.set(ten, path.relative(GOC, tep).replaceAll(path.sep, "/"));
  }
}

// ── 2. Biến compose chuyển vào hộp chứa `web` ──────────────────────────────
// Phân tích YAML theo thụt lề — đủ cho tệp này, không kéo thêm thư viện.
const moiTruong = new Set();
const thamSoBuild = new Set();
const ngan = []; // [{ thutLe, khoa }]
for (const dong of readFileSync(path.join(GOC, "docker-compose.yml"), "utf8").split(/\r?\n/)) {
  const m = /^(\s*)([A-Za-z0-9_]+):/.exec(dong);
  if (!m) continue;
  const thutLe = m[1].length;
  while (ngan.length && ngan[ngan.length - 1].thutLe >= thutLe) ngan.pop();
  const duong = ngan.map((x) => x.khoa).join(".");
  if (duong === "services.web.environment") moiTruong.add(m[2]);
  if (duong === "services.web.build.args") thamSoBuild.add(m[2]);
  ngan.push({ thutLe, khoa: m[2] });
}

if (moiTruong.size === 0) {
  console.error("✗ Không đọc được `services.web.environment` trong docker-compose.yml — cấu trúc tệp đã đổi?");
  process.exit(1);
}

// ── 3. So ──────────────────────────────────────────────────────────────────
const loi = [];
for (const [ten, tep] of [...dungO].sort()) {
  if (NEN_TANG.has(ten)) continue;
  if (ten.startsWith("NEXT_PUBLIC_")) {
    if (!thamSoBuild.has(ten)) {
      loi.push(`${ten} (đọc ở ${tep}) — biến NEXT_PUBLIC_ phải có trong services.web.build.args`);
    }
  } else if (!moiTruong.has(ten)) {
    loi.push(`${ten} (đọc ở ${tep}) — thiếu trong services.web.environment`);
  }
}

if (loi.length) {
  console.error("✗ Mã đọc biến môi trường mà docker-compose KHÔNG chuyển vào hộp chứa:");
  for (const l of loi) console.error(`   · ${l}`);
  console.error(
    "\n  .env trên máy chủ có giá trị cũng vô ích — .dockerignore loại .env khỏi ảnh," +
      "\n  hộp chứa chỉ thấy biến khai trong compose. Thêm dòng `TEN: ${TEN:-}` vào đó.",
  );
  process.exit(1);
}

const dem = [...dungO.keys()].filter((t) => !NEN_TANG.has(t)).length;
console.log(`✓ ${dem} biến mã đọc đều được compose chuyển vào hộp chứa`);
