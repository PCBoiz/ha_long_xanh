#!/usr/bin/env node
/**
 * Báo Bing (IndexNow) TOÀN BỘ địa chỉ trong sitemap — chạy một lần sau deploy.
 *
 * Chạy:  node scripts/bao-bing.mjs            (đọc sitemap trên trang thật)
 *        node scripts/bao-bing.mjs --thu       (chỉ in danh sách, không gửi)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CẦN, KHI ĐÃ CÓ HOOK LÚC DUYỆT BÀI
 *
 * `duyet-bai.ts` gõ cửa Bing mỗi khi một bài MỚI được duyệt. Nhưng 31 địa chỉ
 * đang có — trang chủ, chín phân khu, năm dòng sản phẩm, chín trang tiền — chưa
 * bài nào đi qua cửa đó. Chúng nằm trong sitemap và chờ Bing tự ghé, mà với một
 * tên miền hai tuần tuổi không có liên kết trỏ tới thì "tự ghé" là vài tuần.
 *
 * Kịch bản này gửi cả sitemap trong MỘT yêu cầu (IndexNow nhận tới 10.000
 * địa chỉ mỗi lần). Chạy sau khi deploy — và chỉ sau khi tệp khoá đã sống, vì
 * Bing gọi ngược lại tệp đó để xác minh trước khi nhận.
 *
 * ⚠️ Google KHÔNG dùng IndexNow. Kịch bản này không làm gì cho Google cả. Với
 * Google: Search Console → URL Inspection → Request indexing, làm tay cho
 * trang chủ.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync } from "node:fs";

// ⚠️ Không gọi `process.exit()` khi còn kết nối HTTP mở: Node trên Windows in
// "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)" — vô hại nhưng trông
// như lỗi thật. Đặt `exitCode` rồi để vòng lặp sự kiện tự thoát.
async function main() {
  const GOC = process.env.SITE_URL ?? "https://halongxanh360.vn";
  const CHI_THU = process.argv.includes("--thu");

  // Đọc khoá từ chính mã nguồn — cùng nguồn `kiem-indexnow` đối chiếu, nên
  // không thể lệch với tệp trong `public/`.
  const nguon = readFileSync("src/lib/indexnow.ts", "utf8");
  const khoa = /export const KHOA_INDEXNOW = "([^"]+)"/.exec(nguon)?.[1];
  if (!khoa) {
    console.error("✗ Không đọc được KHOA_INDEXNOW từ src/lib/indexnow.ts");
    process.exitCode = 1;
    return;
  }

  // 1. Tệp khoá phải sống trên trang thật TRƯỚC. Gửi khi nó chưa lên là nhận
  //    403 và tưởng mình gõ sai — trong khi chỉ là chưa deploy.
  const tepKhoa = `${GOC}/${khoa}.txt`;
  const kiemKhoa = await fetch(tepKhoa).catch(() => null);
  const noiDungKhoa = kiemKhoa ? await kiemKhoa.text() : "";
  if (!kiemKhoa?.ok || noiDungKhoa !== khoa) {
    console.error(`✗ Tệp khoá chưa sống: ${tepKhoa}`);
    console.error(
      `  HTTP ${kiemKhoa?.status ?? "không kết nối"} · nội dung ${JSON.stringify(noiDungKhoa.slice(0, 40))}`,
    );
    console.error("  → Deploy trước (thư mục public/ phải được chép lên), rồi chạy lại.");
    process.exitCode = 1;
    return;
  }
  console.log(`✓ Tệp khoá đang sống: ${tepKhoa}`);

  // 2. Đọc sitemap thật, không đọc tệp trong kho — thứ Bing thấy mới là thứ cần
  //    báo.
  const sitemap = await fetch(`${GOC}/sitemap.xml`).then((r) => r.text());
  const urlList = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (urlList.length === 0) {
    console.error("✗ Sitemap không có địa chỉ nào.");
    process.exitCode = 1;
    return;
  }
  console.log(`✓ Sitemap có ${urlList.length} địa chỉ.`);

  if (CHI_THU) {
    for (const u of urlList) console.log("   ", u);
    console.log("\n(--thu: không gửi gì)");
    return;
  }

  // 3. Gửi.
  const host = new URL(GOC).host;
  const phanHoi = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: khoa, keyLocation: tepKhoa, urlList }),
  });

  // 200 = nhận; 202 = nhận, đang chờ xác minh khoá (bình thường ở lần đầu).
  if (phanHoi.status === 200 || phanHoi.status === 202) {
    console.log(`✓ Bing nhận ${urlList.length} địa chỉ (HTTP ${phanHoi.status}).`);
    if (phanHoi.status === 202) {
      console.log("  202 nghĩa là Bing đã nhận và đang xác minh khoá — lần đầu luôn vậy.");
    }
    console.log("\n  Kiểm sau 1–2 ngày: bing.com/webmasters → IndexNow → xem số URL đã nhận.");
  } else {
    const than = await phanHoi.text().catch(() => "");
    console.error(`✗ Bing trả HTTP ${phanHoi.status}: ${than.slice(0, 200)}`);
    if (phanHoi.status === 403) {
      console.error("  403 = Bing không xác minh được khoá. Tệp khoá vừa kiểm là sống, nên");
      console.error("  thường là Bing chưa kịp đọc — chờ vài phút rồi chạy lại.");
    }
    process.exitCode = 1;
    return;
  }

}

await main();
