#!/usr/bin/env node
/**
 * Kiểm mọi liên kết NỘI BỘ trong mã nguồn có trỏ tới một tuyến CÓ THẬT không.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CẦN — ĐÂY LÀ LOẠI LỖI BIÊN DỊCH ĐƯỢC MÀ VẪN HỎNG
 *
 * TypeScript không kiểm được nội dung một chuỗi. `href="/quy-hoac"` thiếu chữ
 * `h` vẫn qua `tsc`, qua `eslint`, qua `next build` — và chỉ hỏng khi có người
 * bấm vào. Đây đúng là hình dạng của lỗi đã làm vỡ `/quy-hoach` trước đây: mọi
 * cổng đều xanh, và chủ trang phát hiện bằng cách mở trang.
 *
 * Kho đã có `kiem-anh-treo` cho ảnh, nhưng liên kết thì chưa có gì canh — trong
 * khi liên kết chết nhìn từ phía người dùng còn tệ hơn ảnh thiếu: ảnh thiếu chỉ
 * là một khoảng trống, liên kết chết là một lần bấm rơi vào trang lỗi.
 *
 * ⚠️ HAI THỨ PHẢI TÍNH LÀ HỢP LỆ, KHÔNG PHẢI LỖI:
 *
 *   · TUYẾN ĐỘNG — `/phan-khu/[ma]` khớp mọi `/phan-khu/bất-kỳ-gì`. Bộ kiểm
 *     này KHÔNG kiểm được `ma` đó có tồn tại không; việc đó thuộc về dữ liệu,
 *     và `generateStaticParams` đã lo.
 *   · CHUYỂN HƯỚNG 301 — `/bang-hang` không còn là tuyến nhưng vẫn sống nhờ
 *     `next.config.ts`. Coi nó là lỗi thì bộ kiểm đang bảo gỡ đúng thứ được cố
 *     ý giữ cho link cũ khỏi chết.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

// ── 1. Thu thập mọi tuyến có thật từ cây thư mục `src/app` ──────────────────
function quetTuyen(goc, tienTo = "") {
  const ra = [];
  for (const ten of readdirSync(goc)) {
    const day = join(goc, ten);
    if (!statSync(day).isDirectory()) {
      if (ten === "page.tsx") ra.push(tienTo === "" ? "/" : tienTo);
      continue;
    }
    // Bỏ qua nhóm tuyến `(ten)` và thư mục riêng tư `_ten` — chúng không xuất
    // hiện trong địa chỉ.
    if (ten.startsWith("(") || ten.startsWith("_")) {
      ra.push(...quetTuyen(day, tienTo));
      continue;
    }
    if (ten === "api") continue;
    ra.push(...quetTuyen(day, `${tienTo}/${ten}`));
  }
  return ra;
}

const tuyen = quetTuyen("src/app");
const tuyenTinh = new Set(tuyen.filter((t) => !t.includes("[")));
// `/phan-khu/[ma]` → tiền tố `/phan-khu/`
const tuyenDong = tuyen
  .filter((t) => t.includes("["))
  .map((t) => t.slice(0, t.indexOf("[")));

// ── 2. Chuyển hướng 301 cũng là đích hợp lệ ─────────────────────────────────
const cauHinh = readFileSync("next.config.ts", "utf8");
const duongDan = readFileSync("src/lib/duong-dan.ts", "utf8");
const chuyenHuong = new Set(
  [...duongDan.matchAll(/cu:\s*"([^"]+)"/g)].map((m) => m[1]),
);
// Bắt cả những `source:` khai thẳng trong next.config.
for (const m of cauHinh.matchAll(/source:\s*"([^"]+)"/g)) chuyenHuong.add(m[1]);

// ── 3. Mọi href nội bộ trong mã nguồn ───────────────────────────────────────
const nguon = execSync('git grep -h --untracked "" -- src', {
  encoding: "utf8",
  maxBuffer: 1e8,
});

const bo = new Set();
// href="/..." và href={"/..."} và các chuỗi đường dẫn trong `duong-dan.ts`
for (const m of nguon.matchAll(/href=["'{]+(\/[a-z0-9\-/]*)["'}]/gi)) {
  bo.add(m[1]);
}
for (const m of duongDan.matchAll(/:\s*"(\/[a-z0-9\-/]*)"/g)) bo.add(m[1]);

const hopLe = (d) => {
  if (d === "/" || tuyenTinh.has(d)) return true;
  if (chuyenHuong.has(d)) return true;
  return tuyenDong.some((t) => d.startsWith(t) && d.length > t.length);
};

const chet = [...bo].filter((d) => !hopLe(d)).sort();

console.log(
  `${tuyenTinh.size} tuyến tĩnh · ${tuyenDong.length} tuyến động · ` +
    `${chuyenHuong.size} chuyển hướng · kiểm ${bo.size} liên kết`,
);

if (chet.length === 0) {
  console.log("Không có liên kết nội bộ nào trỏ vào hư không.");
  process.exit(0);
}

console.log(`\n⚠ ${chet.length} liên kết KHÔNG có tuyến tương ứng:\n`);
for (const d of chet) {
  // Chỉ ra chỗ dùng, để không phải đi lùng.
  let noiDung = "";
  try {
    noiDung = execSync(
      `git grep -n --untracked -F "${d}" -- src | head -3`,
      { encoding: "utf8" },
    ).trim();
  } catch {
    // git grep trả mã khác 0 khi không tìm thấy — không sao.
  }
  console.log(`  · ${d}`);
  for (const dong of noiDung.split("\n").filter(Boolean)) {
    console.log(`      ${dong.slice(0, 110)}`);
  }
}
console.log(
  "\nMỗi cái phải chọn một: sửa lại cho đúng tuyến, thêm tuyến mới, hoặc thêm\n" +
    "chuyển hướng 301 vào `CHUYEN_HUONG_CU` trong `src/lib/duong-dan.ts`.",
);
process.exit(1);
