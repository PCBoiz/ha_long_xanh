#!/usr/bin/env node
/**
 * In một tệp HTML ra PDF bằng Chromium của Playwright.
 *
 * Cách chạy:
 *   node scripts/in-pdf.mjs <vào.html> <ra.pdf>
 *
 * ⚠️ VÌ SAO DÙNG CHROMIUM CHỨ KHÔNG DÙNG THƯ VIỆN SINH PDF THUẦN
 *
 * Tiếng Việt có dấu cần font nhúng đầy đủ. Các thư viện PDF nhẹ hoặc bỏ dấu,
 * hoặc dựng dấu sai vị trí, hoặc đòi tự nhúng font — và lỗi kiểu đó chỉ lộ ra
 * khi mở tệp bằng mắt, không có phép kiểm nào bắt được.
 *
 * Chromium dùng font hệ thống và đã giải quyết xong chuyện chữ có dấu từ lâu.
 * Playwright vốn đã nằm trong `devDependencies` của kho này, nên không thêm phụ
 * thuộc mới.
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , vao, ra] = process.argv;
if (!vao || !ra) {
  console.error("Thiếu tham số. Ví dụ:");
  console.error("  node scripts/in-pdf.mjs .tmp/cau-hoi.html CAU-HOI.pdf");
  process.exit(1);
}

/**
 * Ưu tiên Chrome ĐÃ CÀI trên máy, chỉ rơi về bản Playwright tải riêng khi không
 * có. Bản Playwright nặng khoảng 150MB và phải `npx playwright install` mới có —
 * trong khi máy Windows nào cũng sẵn Chrome hoặc Edge, và cả hai đều in PDF y
 * hệt vì cùng nhân Chromium.
 */
async function moTrinhDuyet() {
  for (const kenh of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel: kenh });
    } catch {
      // Không có kênh này — thử kênh sau.
    }
  }
  return chromium.launch();
}

const trinhDuyet = await moTrinhDuyet();
try {
  const trang = await trinhDuyet.newPage();
  // `file://` chứ không phải đường dẫn Windows thô — Chromium từ chối đường dẫn
  // có dấu hai chấm ổ đĩa nếu không bọc thành URL.
  await trang.goto(pathToFileURL(resolve(vao)).href, { waitUntil: "networkidle" });
  await trang.pdf({ path: ra, format: "A4", printBackground: true });
} finally {
  await trinhDuyet.close();
}
console.log("đã in:", ra);
