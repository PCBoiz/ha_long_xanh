#!/usr/bin/env node
/**
 * Chạy MỌI phép kiểm trong `scripts/`, tự tìm chứ không cần khai báo.
 *
 * Chạy:  npm run kiem
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO TỰ TÌM CHỨ KHÔNG ĐĂNG KÝ TỪNG CÁI
 *
 * Audit ngày 09/09/2026 đếm được: `scripts/` có 21 tệp, `package.json` gọi 14.
 * Bảy tệp không ai chạy được bằng `npm run` — trong đó có HAI bộ `kiem-*`:
 * `kiem-anh-trung` và `kiem-caddyfile`.
 *
 * Một phép kiểm không ai chạy được là một phép kiểm không chạy. Nó tệ hơn
 * không có phép kiểm, vì nó nằm trong kho và làm người ta yên tâm rằng chuyện
 * đó "đã có ai lo".
 *
 * Sửa bằng cách đăng ký hai cái đó thì hôm nay xanh, nhưng lần sau thêm phép
 * kiểm thứ ba mà quên đăng ký thì lặp lại đúng chuyện. Nên bỏ hẳn bước đăng
 * ký: tệp nào tên `kiem-*` thì tự khắc được chạy. Không có gì để quên.
 *
 * ⚠️ MỘT PHÉP KIỂM HỎNG KHÔNG DỪNG CẢ BỘ. Chạy hết rồi mới báo, vì khi sửa
 * người ta cần biết TẤT CẢ cái đang hỏng, không phải cái đầu tiên — dừng ở cái
 * đầu tiên biến một lần sửa thành nhiều lần chạy.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Tự loại chính mình, nếu không thì đệ quy vô tận.
const TU_MINH = "kiem-tat-ca.mjs";

const tep = readdirSync("scripts")
  .filter((f) => f.startsWith("kiem-") && f !== TU_MINH)
  .filter((f) => f.endsWith(".mjs") || f.endsWith(".ts"))
  .sort();

if (tep.length === 0) {
  console.error("Không tìm thấy phép kiểm nào trong scripts/");
  process.exit(1);
}

console.log(`Tìm thấy ${tep.length} phép kiểm\n`);

const hong = [];
for (const t of tep) {
  const ten = t.replace(/\.(mjs|ts)$/, "");
  const batDau = Date.now();
  // Tệp `.ts` cần tsx; `.mjs` chạy thẳng bằng node.
  const kq = t.endsWith(".ts")
    ? spawnSync("npx", ["tsx", `scripts/${t}`], { encoding: "utf8", shell: true })
    : spawnSync(process.execPath, [`scripts/${t}`], { encoding: "utf8" });
  const giay = ((Date.now() - batDau) / 1000).toFixed(1);
  const ra = `${kq.stdout ?? ""}${kq.stderr ?? ""}`;

  if (kq.status === 0) {
    // Dòng cuối có nội dung — thường là dòng kết luận của phép kiểm.
    const ketLuan =
      ra.split("\n").filter((d) => d.trim()).slice(-1)[0]?.trim() ?? "";
    console.log(`  ✓ ${ten.padEnd(24)} ${giay}s  ${ketLuan.slice(0, 60)}`);
  } else {
    console.log(`  ✗ ${ten.padEnd(24)} ${giay}s  HỎNG (mã ${kq.status})`);
    hong.push({ ten, ra });
  }
}

if (hong.length === 0) {
  console.log(`\n${tep.length}/${tep.length} phép kiểm đạt.`);
  process.exit(0);
}

console.log(`\n${hong.length}/${tep.length} phép kiểm HỎNG:\n`);
for (const h of hong) {
  console.log(`── ${h.ten} ──`);
  console.log(h.ra.split("\n").slice(-25).join("\n"));
  console.log();
}
process.exit(1);
