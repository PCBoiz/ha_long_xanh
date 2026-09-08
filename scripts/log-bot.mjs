import { writeFileSync } from "node:fs";
const GOC = "https://halongxanh360.vn";
const UA = {
  "OAI-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
  "Googlebot": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
};
const TRANG = ["/", "/gia-global-gate-ha-long", "/quy-can-global-gate-ha-long", "/chinh-sach-global-gate-ha-long",
  "/gia-thuc-tra-global-gate-ha-long", "/voucher-vinhomes", "/vi-tri-global-gate-ha-long", "/phap-ly-global-gate-ha-long",
  "/tien-do-global-gate-ha-long", "/gia-tri-tai-san-global-gate-ha-long", "/du-an", "/quy-hoach", "/tien-ich", "/dau-tu", "/tai-lieu", "/lien-he"];

const out = [];
out.push("NHẬT KÝ KIỂM TRUY CẬP BOT — halongxanh360.vn");
out.push("Chạy lúc: " + new Date().toISOString());
out.push("Cách chạy: HTTP GET thật từ máy ngoài, đặt User-Agent đúng chuỗi bot công bố.");
out.push("=".repeat(78));

for (const [ten, ua] of Object.entries(UA)) {
  out.push("", "#".repeat(78), `# BOT: ${ten}`, `# User-Agent: ${ua}`, "#".repeat(78), "");
  for (const t of TRANG) {
    const t0 = Date.now();
    const r = await fetch(GOC + t, { headers: { "user-agent": ua, accept: "text/html,application/xhtml+xml" }, redirect: "manual" });
    const h = await r.text();
    const ms = Date.now() - t0;
    const chu = h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const tieuDe = (h.match(/<title>([^<]*)<\/title>/i) || [])[1] ?? "";
    const h1 = (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? "";
    out.push(`GET ${t}`);
    out.push(`  HTTP ${r.status} ${r.statusText}   ${ms} ms   ${Math.round(h.length / 1024)} KB   ${chu.split(" ").length} từ trong HTML thô`);
    out.push(`  content-type : ${r.headers.get("content-type")}`);
    out.push(`  x-robots-tag : ${r.headers.get("x-robots-tag") ?? "(không đặt — tức là KHÔNG chặn)"}`);
    out.push(`  <title>      : ${tieuDe.slice(0, 90)}`);
    out.push(`  <h1>         : ${h1.slice(0, 90)}`);
    out.push(`  trích nội dung: ${chu.slice(0, 170)}…`);
    out.push("");
  }
}
writeFileSync(".tmp/log-bot.txt", out.join("\n"));
console.log(out.slice(0, 4).join("\n"));
console.log(`\n→ ${out.length} dòng, đã ghi ra .tmp/log-bot.txt`);
