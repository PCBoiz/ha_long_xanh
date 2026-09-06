// Chặn cái bẫy `"use server"` — cái đã sập BA LẦN trong kho này.
//
// ═══════════════════════════════════════════════════════════════════════════
// LUẬT: file mở đầu bằng `"use server"` CHỈ được export hàm `async`.
//
// Next.js coi MỌI thứ được export từ một file như thế là một hành động chạy
// trên máy chủ, và thay nó bằng một tham chiếu gọi qua mạng — kể cả khi thứ đó
// chỉ là một đối tượng hằng hay một mảng lựa chọn.
//
// Ba lần đã xảy ra thật:
//
//   1. `lib/lead/uu-tien.ts`       mảng lựa chọn của biểu mẫu
//                                  → build gãy: "e.map is not a function"
//   2. `lib/duyet-bai-kieu.ts`     trạng thái ban đầu của màn hình duyệt
//                                  → màn hình không hiện gì, KHÔNG báo lỗi
//   3. `lib/lead/dang-ky-action.ts` trạng thái ban đầu của biểu mẫu đăng ký
//                                  → biểu mẫu CHẾT trên máy chủ thật, 07/09/2026
//
// Không lần nào gãy lúc build. Không lần nào thông báo lỗi nhắc tới
// `"use server"`. Sau lần 1 và lần 2, quy tắc đã được ghi vào chú thích —
// và lần 3 vẫn xảy ra. Chú thích không chặn được người đang vội.
//
// Nên: một script mười dòng, chạy trước mỗi lần triển khai.
//
//   node scripts/kiem-use-server.mjs
// ═══════════════════════════════════════════════════════════════════════════

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const GOC = path.join(process.cwd(), "src");

async function moiFile(thuMuc) {
  const ra = [];
  for (const muc of await readdir(thuMuc, { withFileTypes: true })) {
    const duong = path.join(thuMuc, muc.name);
    if (muc.isDirectory()) ra.push(...(await moiFile(duong)));
    else if (/\.(ts|tsx)$/.test(muc.name)) ra.push(duong);
  }
  return ra;
}

const viPham = [];
let daQuet = 0;

for (const duong of await moiFile(GOC)) {
  const tho = await readFile(duong, "utf8");

  // CHỈ tính file THỰC SỰ mở đầu bằng chỉ thị đó. Nhiều file trong kho nhắc
  // `"use server"` trong chú thích để giải thích chính cái bẫy này — bắt nhầm
  // chúng thì script kêu oan và sẽ bị tắt đi.
  const dongDau = tho.split("\n").find((d) => d.trim() !== "");
  if (!/^["']use server["'];?\s*$/.test(dongDau?.trim() ?? "")) continue;

  daQuet += 1;
  const tuongDoi = path.relative(process.cwd(), duong).split(path.sep).join("/");

  tho.split("\n").forEach((dong, i) => {
    const t = dong.trim();
    if (!t.startsWith("export")) return;

    // Được phép: hàm async, và mọi thứ chỉ tồn tại lúc biên dịch (kiểu dữ
    // liệu) — chúng bị xoá sạch trước khi Next.js nhìn thấy.
    if (/^export\s+async\s+function\s/.test(t)) return;
    if (/^export\s+(type|interface)\s/.test(t)) return;
    if (/^export\s+type\s*\{/.test(t)) return;

    viPham.push({
      file: tuongDoi,
      dong: i + 1,
      ma: t.length > 88 ? `${t.slice(0, 88)}…` : t,
    });
  });
}

if (viPham.length === 0) {
  console.log(`✓ ${daQuet} file "use server", tất cả chỉ export hàm async.`);
  process.exit(0);
}

console.error(`\n✗ ${viPham.length} export sai trong file "use server":\n`);
for (const v of viPham) {
  console.error(`  ${v.file}:${v.dong}`);
  console.error(`    ${v.ma}\n`);
}
console.error(
  "  Cách sửa: chuyển kiểu dữ liệu, hằng số và trạng thái ban đầu sang một\n" +
    "  file riêng KHÔNG có `\"use server\"`, rồi nhập lại từ đó.\n" +
    "  Khuôn mẫu có sẵn: `lib/duyet-bai.ts` + `lib/duyet-bai-kieu.ts`.\n",
);
process.exit(1);
