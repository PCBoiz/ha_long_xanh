#!/usr/bin/env node
/**
 * SOÁT KHẢ NĂNG TIẾP CẬN CẢ TRANG — mọi địa chỉ trong sitemap, luật WCAG 2.1 A/AA.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CÓ, KHI LIGHTHOUSE ĐÃ CHO 100 ĐIỂM (13/09/2026)
 *
 * Điểm 100 của Lighthouse là điểm của MỘT trang, đo MỘT lần, ở trạng thái vừa
 * tải xong. Nó không nói gì về 30 trang còn lại, và không thấy những gì chỉ
 * hiện ra sau khi người ta bấm vào đâu đó. Kịch bản này chạy chính bộ luật ấy
 * (axe-core) trên TẤT CẢ địa chỉ lấy từ sitemap.
 *
 * Khách của trang này phần lớn là người mua nhà tuổi trung niên trở lên —
 * nhóm mà chữ mờ và vùng bấm nhỏ ảnh hưởng thật, không phải chuyện hình thức.
 *
 * ⚠️ Chạy trên BẢN DỰNG THẬT (`next build` + `next start`), không phải
 * `next dev`: bản dev chèn thêm thanh công cụ của Next vào trang.
 *
 * Chạy:  npm run build && npx next start -p 3244
 *        GOC=http://localhost:3244 node scripts/soat-tiep-can.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const GOC = process.env.GOC ?? "http://localhost:3244";

const sitemap = await (await fetch(`${GOC}/sitemap.xml`)).text();
const duong = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ""))
  .map((d) => d || "/");
if (duong.length === 0) {
  console.error("Không đọc được sitemap — không có gì để soát.");
  process.exit(1);
}

const browser = await chromium.launch();
/**
 * `CO=may-tinh` để soát cỡ máy tính. Mặc định là điện thoại vì hơn 70% lượt
 * vào trang này từ điện thoại, và lỗi vùng bấm nhỏ chỉ lộ ra ở cỡ ấy.
 *
 * ⚠️ PHẢI CHẠY CẢ HAI CỠ: có khối chỉ hiện ở một cỡ (bảng hàng chi tiết là
 * `hidden lg:block` — soát mỗi cỡ điện thoại thì không bao giờ chạm tới nó).
 */
const mayTinh = process.env.CO === "may-tinh";
const ctx = await browser.newContext(
  mayTinh
    ? { viewport: { width: 1280, height: 900 } }
    : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
);
const page = await ctx.newPage();

const loi = [];
for (const d of duong) {
  try {
    await page.goto(GOC + d, { waitUntil: "networkidle", timeout: 90_000 });
    // Trang có hiệu ứng mở đầu: chờ nó xong, nếu không axe soát lúc màn còn phủ.
    await page.waitForTimeout(1_500);
    const kq = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    for (const v of kq.violations) {
      loi.push({ d, luat: v.id, muc: v.impact, mo: v.help, so: v.nodes.length, viDu: (v.nodes[0]?.html ?? "").slice(0, 130) });
    }
  } catch (e) {
    loi.push({ d, luat: "KHONG-MO-DUOC", muc: "serious", mo: String(e).slice(0, 120), so: 1, viDu: "" });
  }
}
await browser.close();

const theoLuat = new Map();
for (const l of loi) {
  const k = `${l.luat}|${l.muc}|${l.mo}`;
  if (!theoLuat.has(k)) theoLuat.set(k, { ...l, trang: [], tong: 0 });
  const g = theoLuat.get(k);
  g.trang.push(l.d);
  g.tong += l.so;
}

console.log(`Soát ${duong.length} trang trên ${GOC} (cỡ ${mayTinh ? "máy tính 1280px" : "điện thoại 390px"})`);
console.log(`Vi phạm WCAG 2.1 A/AA: ${theoLuat.size} loại · ${loi.reduce((a, b) => a + b.so, 0)} chỗ\n`);
const thuTu = { critical: 0, serious: 1, moderate: 2, minor: 3 };
for (const g of [...theoLuat.values()].sort((a, b) => (thuTu[a.muc] ?? 9) - (thuTu[b.muc] ?? 9))) {
  const t = [...new Set(g.trang)];
  console.log(`[${g.muc}] ${g.luat} — ${g.mo}`);
  console.log(`   ${g.tong} chỗ, ${t.length} trang: ${t.slice(0, 6).join(", ")}${t.length > 6 ? ` … (+${t.length - 6})` : ""}`);
  if (g.viDu) console.log(`   ví dụ: ${g.viDu}`);
  console.log("");
}
process.exit(theoLuat.size > 0 ? 1 : 0);
