// Bản mẫu phông chữ: so các họ serif trên ĐÚNG nền tối và ĐÚNG câu tiếng Việt
// của trang, thay vì tin vào trí nhớ về việc font nào dày hơn font nào.
//
// Chuỗi thử cố ý gom đủ dấu khó: ỳ (huyền), ố (sắc+mũ), ạ (nặng), ể (hỏi+mũ),
// đ (gạch ngang) — chỗ mà font mảnh hỏng trước tiên.

import { chromium } from "playwright";
import path from "node:path";

const HO = [
  { ten: "Cormorant Garamond", nang: [300, 400, 600], ghi: "ĐANG DÙNG" },
  { ten: "Newsreader", nang: [300, 400, 500] },
  { ten: "Playfair Display", nang: [400, 500, 600] },
  { ten: "Fraunces", nang: [300, 400, 500] },
  { ten: "Faustina", nang: [400, 500, 600] },
  { ten: "Literata", nang: [300, 400, 500] },
];

const CAU = "Thành phố kỳ quan";
const PHU = "kết nối toàn cầu bên vịnh di sản quốc tế — Đảo Kỳ Quan, Vịnh Lễ Hội";

const lien = HO.map(
  (h) =>
    `family=${h.ten.replace(/ /g, "+")}:ital,wght@0,${h.nang.join(";0,")};1,${h.nang.join(";1,")}`,
).join("&");

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${lien}&subset=vietnamese&display=block" rel="stylesheet">
<style>
  body{margin:0;background:#04140f;color:#e6efea;font-family:system-ui;padding:48px 56px}
  .khoi{border-bottom:1px solid #1d4438;padding:34px 0}
  .ten{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#7fd4b8}
  .lon{font-size:86px;line-height:.98;letter-spacing:-.03em;margin:14px 0 0}
  .nho{font-size:19px;line-height:1.5;margin:10px 0 0;color:#8ea79d}
  .nang{font-size:11px;color:#8ea79d;letter-spacing:.1em}
</style></head><body>
${HO.map(
  (h) => `<div class="khoi">
  <div class="ten">${h.ten}${h.ghi ? " — " + h.ghi : ""}</div>
  ${h.nang
    .map(
      (n) => `<div class="lon" style="font-family:'${h.ten}';font-weight:${n}">${CAU}
      <span style="font-style:italic">kỳ quan</span></div>
      <div class="nang">weight ${n}</div>`,
    )
    .join("")}
  <div class="nho" style="font-family:'${h.ten}';font-weight:400">${PHU}</div>
</div>`,
).join("")}
</body></html>`;

const trinh = await chromium.launch({ channel: "chrome" });
const page = await trinh.newPage({ viewport: { width: 1280, height: 1000 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
await page.screenshot({
  path: path.join(process.cwd(), ".audit", "phong-chu.png"),
  fullPage: true,
});
await trinh.close();
console.log("→ .audit/phong-chu.png");
