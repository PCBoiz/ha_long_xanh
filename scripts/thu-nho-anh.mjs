#!/usr/bin/env node
/**
 * Thu nhỏ ảnh để soi bằng mắt.
 *
 * Chạy:  node scripts/thu-nho-anh.mjs <ảnh1> [ảnh2 …]
 *        → ghi ra `.tmp/soi-<tên>.png`, chiều rộng tối đa 1200px
 *
 * ⚠️ VÌ SAO CẦN: ảnh gốc trong kho này rộng tới 2560px, vượt giới hạn của công
 * cụ đọc ảnh. Mà `kiem-anh-trung` chỉ báo được "hai tấm này giống nhau về mặt
 * pixel" — nó không phân biệt được HAI BẢN CỦA CÙNG MỘT ẢNH với HAI ẢNH KHÁC
 * NHAU cùng tông màu.
 *
 * Phân biệt đó chỉ mắt làm được, nên phải có đường để mắt nhìn tới. Đã có bằng
 * chứng: audit 09/09 thấy ba cụm "trùng", hai trong ba là dương tính giả (bản
 * vẽ mặt bằng, và ảnh cùng tông xanh).
 *
 * Dùng Chromium của Playwright vì kho đã có sẵn, không thêm phụ thuộc ảnh nào.
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const thamSo = process.argv.slice(2);
// `--rong=800` để ép chiều rộng khác mặc định.
const coRong = thamSo.find((t) => t.startsWith("--rong="));
const anh = thamSo.filter((t) => !t.startsWith("--"));
if (anh.length === 0) {
  console.error("Thiếu đường dẫn ảnh. Ví dụ:");
  console.error("  node scripts/thu-nho-anh.mjs public/images/a.webp public/images/b.webp");
  process.exit(1);
}

const RONG = coRong ? Number(coRong.split("=")[1]) : 1200;
mkdirSync(".tmp", { recursive: true });

async function moTrinhDuyet() {
  for (const kenh of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel: kenh });
    } catch {
      // thử kênh sau
    }
  }
  return chromium.launch();
}

const trinhDuyet = await moTrinhDuyet();
try {
  for (const duongDan of anh) {
    const trang = await trinhDuyet.newPage();
    // ⚠️ NHÚNG BẰNG data: URI, KHÔNG DÙNG file://
    //
    // Trang dựng bằng `setContent` có gốc là `about:blank`, và trình duyệt chặn
    // `about:blank` nạp tài nguyên `file://`. Ảnh không nạp được thì thẻ <img>
    // vẫn tồn tại nhưng mang kích thước mặc định — và ảnh chụp ra là một khung
    // vuông trống. Hỏng im lặng: có tệp đầu ra, đúng tên, chỉ là không có ảnh.
    const loai = extname(duongDan).slice(1) || "webp";
    const data = `data:image/${loai};base64,${readFileSync(duongDan).toString("base64")}`;
    await trang.setContent(
      `<body style="margin:0"><img src="${data}" style="display:block;width:${RONG}px;height:auto"></body>`,
    );
    const el = await trang.waitForSelector("img");
    // Chờ ảnh giải mã xong, nếu không thì chụp phải khung chưa có nội dung.
    await trang.waitForFunction(
      () => { const i = document.querySelector("img"); return i && i.complete && i.naturalWidth > 0; },
      null,
      { timeout: 15000 },
    );
    const ra = join(".tmp", `soi-${basename(duongDan).replace(/\.\w+$/, "")}.png`);
    await el.screenshot({ path: ra });
    await trang.close();
    console.log(ra);
  }
} finally {
  await trinhDuyet.close();
}
