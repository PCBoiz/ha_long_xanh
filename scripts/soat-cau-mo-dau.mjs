#!/usr/bin/env node
/**
 * SOÁT CÂU MỞ ĐẦU CỦA MỌI TRANG — trang nào trợ lý AI không trích được?
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Trợ lý AI (Bing Copilot, ChatGPT tìm kiếm, Google AI Overview) trả lời bằng
 * cách TRÍCH MỘT CÂU từ một trang. Câu được chọn phải tự đứng được khi tách
 * khỏi trang: có tên thực thể, có con số hoặc sự kiện trả lời đúng câu hỏi.
 *
 * Ảnh chủ dự án gửi 18/09/2026: Bing trả lời "bảng giá vin global gate" bằng
 * câu *"Vinhomes Global Gate Hạ Long hiện có giá từ 4,5 tỷ đồng cho nhà liền
 * kề đến hơn 90 tỷ đồng cho biệt thự mặt biển"* của một trang khác — một câu
 * có đủ ba thứ đó.
 *
 * Kịch bản này đếm xem trang nào KHÔNG có tên dự án ở cả tiêu đề lẫn hai đoạn
 * đầu. Kết quả lần chạy đầu (30/09/2026): **30/31 trang**.
 *
 * ⚠️ Đây là kịch bản ĐO, không phải cổng kiểm — cố ý không đặt tên `kiem-*`
 * (những tệp ấy tự vào `npm run kiem`, mà việc này cần mạng và trang thật).
 * Sửa tiêu đề và lời văn của trang là quyết định THIẾT KẾ, thuộc chủ dự án.
 *
 * Chạy:  node scripts/soat-cau-mo-dau.mjs
 *        GOC=http://localhost:3000 node scripts/soat-cau-mo-dau.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */
const GOC = process.env.GOC ?? "https://halongxanh360.vn";
const TEN = /Vinhomes Global Gate|Global Gate Hạ Long/i;

const boThe = (s) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const sitemap = await (await fetch(`${GOC}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) {
  console.error("Không đọc được sitemap — không có gì để soát.");
  process.exit(1);
}

const ra = [];
for (const url of urls) {
  let html;
  try {
    html = await (await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (soat-noi-bo)" } })).text();
  } catch (e) {
    ra.push({ url, loi: String(e) });
    continue;
  }
  // Bỏ đầu trang / thanh điều hướng / chân trang: tên dự án ở logo không phải
  // câu trả lời, mà lại làm mọi trang trông như đã đạt.
  const than = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<(header|nav|footer)[\s\S]*?<\/\1>/g, " ");
  const h1 = boThe((than.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [])[1] ?? "");
  // Đoạn đủ dài để là một câu trả lời, không phải nhãn hay nút.
  const doan = [...than.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => boThe(m[1])).filter((t) => t.length >= 60);
  ra.push({
    duong: url.replace(GOC, "") || "/",
    h1,
    dat: TEN.test(h1) || TEN.test(doan[0] ?? "") || TEN.test(doan[1] ?? ""),
    cau1: (doan[0] ?? "").slice(0, 140),
  });
}

const hong = ra.filter((x) => !x.loi && !x.dat);
console.log(`Soát ${ra.length} trang trên ${GOC}`);
console.log(`Thiếu tên dự án ở cả H1 lẫn hai đoạn đầu: ${hong.length}/${ra.length}\n`);
for (const x of hong) console.log(`${x.duong}\n   H1: ${x.h1}\n   Đoạn đầu: ${x.cau1}\n`);
for (const x of ra.filter((x) => x.loi)) console.log(`${x.url}: ${x.loi}`);
