// Kiểm tra mức sẵn sàng cho AI Search — chạy trên TRANG THẬT đang chạy.
const GOC = "https://halongxanh360.vn";
const UA = {
  "OAI-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
  "GPTBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot",
  "Googlebot": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "ClaudeBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com",
  "PerplexityBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot",
};
const TRANG = [
  "/", "/gia-global-gate-ha-long", "/quy-can-global-gate-ha-long",
  "/chinh-sach-global-gate-ha-long", "/gia-thuc-tra-global-gate-ha-long",
  "/voucher-vinhomes", "/vi-tri-global-gate-ha-long", "/phap-ly-global-gate-ha-long",
  "/tien-do-global-gate-ha-long", "/gia-tri-tai-san-global-gate-ha-long",
  "/du-an", "/quy-hoach", "/tien-ich", "/dau-tu", "/tai-lieu", "/lien-he",
];

const lay = (h, re) => (h.match(re)?.[1] ?? "").trim();

console.log("╔═══ 1 · TRẠNG THÁI HTTP THEO TỪNG BOT ═══╗\n");
console.log("TRANG".padEnd(38) + Object.keys(UA).map((k) => k.slice(0, 9).padStart(10)).join(""));
console.log("─".repeat(38 + 10 * Object.keys(UA).length));
const loi = [];
for (const t of TRANG) {
  const o = [];
  for (const [ten, ua] of Object.entries(UA)) {
    try {
      const r = await fetch(GOC + t, { headers: { "user-agent": ua, accept: "text/html" }, redirect: "manual" });
      o.push(String(r.status).padStart(10));
      if (r.status !== 200) loi.push(`${t} · ${ten} → ${r.status}`);
    } catch (e) { o.push("LỖI".padStart(10)); loi.push(`${t} · ${ten} → ${e}`); }
  }
  console.log(t.padEnd(38) + o.join(""));
}

console.log("\n╔═══ 2 · NỘI DUNG TRONG HTML THÔ (bot OAI-SearchBot) ═══╗\n");
console.log("TRANG".padEnd(38) + "KB".padStart(6) + "CHỮ".padStart(7) + "  H1  ROBOTS-META      CANONICAL ĐÚNG");
console.log("─".repeat(100));
const chiTiet = [];
for (const t of TRANG) {
  const r = await fetch(GOC + t, { headers: { "user-agent": UA["OAI-SearchBot"], accept: "text/html" } });
  const h = await r.text();
  const than = h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const soChu = than.split(" ").filter(Boolean).length;
  const h1 = (h.match(/<h1[\s>]/gi) || []).length;
  const meta = lay(h, /<meta name="robots" content="([^"]+)"/i) || "(không khai)";
  const can = lay(h, /<link rel="canonical" href="([^"]+)"/i);
  const canDung = can === GOC + t || (t === "/" && can === GOC + "/");
  chiTiet.push({ t, kb: Math.round(h.length / 1024), soChu, h1, meta, can, canDung });
  console.log(t.padEnd(38) + String(Math.round(h.length / 1024)).padStart(6) + String(soChu).padStart(7) + String(h1).padStart(5) + "  " + meta.slice(0, 16).padEnd(18) + (canDung ? "✅" : "❌ " + can));
}

console.log("\n╔═══ 3 · SITEMAP ═══╗\n");
const sm = await (await fetch(GOC + "/sitemap.xml", { headers: { "user-agent": UA["OAI-SearchBot"] } })).text();
const loc = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`sitemap.xml: ${loc.length} địa chỉ`);
const thieu = TRANG.map((t) => GOC + t).filter((u) => !loc.includes(u) && !loc.includes(u.replace(/\/$/, "")));
console.log(thieu.length ? "❌ THIẾU trong sitemap:\n   " + thieu.join("\n   ") : "✅ mọi trang tiền đều có trong sitemap");
const coLastmod = (sm.match(/<lastmod>/g) || []).length;
console.log(`lastmod: ${coLastmod}/${loc.length} địa chỉ có ngày cập nhật`);

console.log("\n╔═══ 4 · TỔNG KẾT ═══╗\n");
console.log(loi.length ? "❌ " + loi.length + " lỗi truy cập:\n   " + loi.join("\n   ") : "✅ mọi bot vào được mọi trang tiền, tất cả 200");
const rong = chiTiet.filter((c) => c.soChu < 300);
console.log(rong.length ? "❌ trang có ít chữ trong HTML thô: " + rong.map((c) => `${c.t} (${c.soChu})`).join(", ") : "✅ mọi trang đều có nội dung thật trong HTML thô, không cần chạy JavaScript");
const sai = chiTiet.filter((c) => !c.canDung);
console.log(sai.length ? "❌ canonical sai: " + sai.map((c) => c.t).join(", ") : "✅ canonical đúng ở mọi trang");
const chan = chiTiet.filter((c) => /noindex/i.test(c.meta));
console.log(chan.length ? "❌ CÓ noindex: " + chan.map((c) => c.t).join(", ") : "✅ không trang nào bị noindex");
