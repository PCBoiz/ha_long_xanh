// Ghép ảnh chụp thành một tấm để nhìn được cả trang cùng lúc.
// node scripts/audit-ghep.mjs <ten-file-khong-duoi> [...] -> .audit/ghep.png

import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ten = process.argv.slice(2);
if (!ten.length) {
  console.error("Thiếu tên ảnh, ví dụ: node scripts/audit-ghep.mjs trang-chu--pc THAM-CHIEU-vinhomes--pc");
  process.exit(1);
}
const THU_MUC = path.join(process.cwd(), ".audit");
const CAO = 1400; // chiều cao mỗi cột trong tấm ghép

const html = `<body style="margin:0;background:#222;display:flex;gap:12px;align-items:flex-start;font:12px sans-serif">
${ten
  .map(
    (t) => `<figure style="margin:0;flex:1">
  <figcaption style="color:#fff;padding:6px 8px;background:#000">${t}</figcaption>
  <img src="${pathToFileURL(path.join(THU_MUC, t + ".png")).href}" style="width:100%;display:block">
</figure>`,
  )
  .join("")}
</body>`;

// Phải ghi ra file rồi goto: setContent không có URL gốc nên ảnh file:// không tải.
const { writeFile } = await import("node:fs/promises");
const tam = path.join(THU_MUC, "_ghep.html");
await writeFile(tam, html, "utf8");

const trinh = await chromium.launch({ channel: "chrome" });
const page = await trinh.newPage({ viewport: { width: 360 * ten.length, height: CAO } });
await page.goto(pathToFileURL(tam).href, { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(THU_MUC, "ghep.png"), fullPage: true });
await trinh.close();
console.log("→ .audit/ghep.png");
