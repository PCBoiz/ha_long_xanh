#!/usr/bin/env node
/**
 * Kiểm bộ nối liên kết tự động trong thân bài.
 *
 * ⚠️ MỌI CA Ở ĐÂY ĐỀU LÀ MỘT CÁCH HỎNG THẬT, không phải bài tập.
 *
 * Nối liên kết là sửa HTML bằng chuỗi — việc dễ trông có vẻ chạy được trên ví
 * dụ đẹp rồi vỡ trên bài thật. Ba kiểu vỡ hay gặp nhất: chèn thẻ vào giữa
 * thuộc tính của thẻ khác, tạo `<a>` lồng trong `<a>`, và nhồi liên kết tới
 * mức bài đọc như trang quảng cáo.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Kho này không có tsx — dùng esbuild để nạp TS, cùng cách `kiem-du-lieu-bai-viet.mjs` làm.
const thuMuc = mkdtempSync(join(tmpdir(), "noi-lk-"));
const raBundle = join(thuMuc, "ra.mjs");
execFileSync(
  "node",
  [
    "node_modules/esbuild/bin/esbuild",
    "src/lib/noi-lien-ket.ts",
    "--bundle",
    "--format=esm",
    "--platform=node",
    `--outfile=${raBundle}`,
    "--log-level=error",
  ],
  { stdio: "inherit" },
);
const { noiLienKet } = await import(`file://${raBundle}`);

let hong = 0;
const dem = (h) => (h.match(/<a /g) ?? []).length;
function kiem(ten, dat) {
  const ok = dat();
  console.log(`${ok ? "  ok  " : "  HỎNG"} ${ten}`);
  if (!ok) hong++;
}

kiem("nối được cụm cơ bản", () => {
  const r = noiLienKet("<p>Xem quy hoạch phân khu.</p>");
  return r.includes('<a href="/quy-hoach">quy hoạch</a>');
});

kiem("chỉ nối LẦN ĐẦU của mỗi đích", () => {
  const r = noiLienKet("<p>quy hoạch rồi lại quy hoạch nữa quy hoạch.</p>");
  return dem(r) === 1;
});

kiem("KHÔNG nối bên trong <a> đang có", () => {
  const r = noiLienKet('<p><a href="/x">bàn về quy hoạch ở đây</a></p>');
  return dem(r) === 1 && !r.includes('<a href="/quy-hoach"');
});

kiem("KHÔNG nối trong tiêu đề h2/h3", () => {
  const r = noiLienKet("<h2>Quy hoạch tổng thể</h2><p>không có gì</p>");
  return dem(r) === 0;
});

kiem("KHÔNG đụng vào chữ nằm trong thuộc tính thẻ", () => {
  const goc = '<p title="nói về quy hoạch">trống trơn</p>';
  return noiLienKet(goc) === goc;
});

kiem("cụm DÀI được xét trước cụm ngắn", () => {
  // "giá thực trả" phải thắng, không được để "tiến độ"/cụm ngắn nào cắt ngang.
  const r = noiLienKet("<p>Bảng giá thực trả gồm những gì?</p>");
  return r.includes('<a href="/gia-thuc-tra-global-gate-ha-long">giá thực trả</a>');
});

kiem("giữ NGUYÊN VĂN chữ gốc, kể cả viết hoa", () => {
  const r = noiLienKet("<p>Pháp lý dự án ra sao?</p>");
  return r.includes(">Pháp lý</a>") && !r.includes(">pháp lý</a>");
});

kiem("có TRẦN, bài dày cụm cũng không quá 6 liên kết", () => {
  const cau =
    "<p>quy hoạch, pháp lý, tiến độ, quỹ căn, tiện ích, vị trí, voucher, " +
    "chính sách bán hàng, giá thực trả, giá trị tài sản.</p>";
  return dem(noiLienKet(cau)) <= 6;
});

kiem("không tự sinh <a> lồng nhau", () => {
  const r = noiLienKet("<p>quy hoạch pháp lý tiến độ quỹ căn</p>");
  // Mỗi <a> mở phải có đúng một </a> đóng, và không lồng.
  const chuoi = r.match(/<\/?a\b/g) ?? [];
  let sau = 0;
  for (const t of chuoi) {
    sau += t === "<a" ? 1 : -1;
    if (sau > 1 || sau < 0) return false;
  }
  return sau === 0;
});

kiem("chuỗi rỗng không làm vỡ", () => noiLienKet("") === "");

kiem("mọi đích đều là đường dẫn CÓ THẬT", () => {
  const r = noiLienKet(
    "<p>quy hoạch pháp lý tiến độ quỹ căn tiện ích vị trí voucher</p>",
  );
  const dich = [...r.matchAll(/<a href="([^"]+)"/g)].map((m) => m[1]);
  const nguon = execFileSync(
    "node",
    ["-e", "process.stdout.write(require('fs').readFileSync('src/lib/duong-dan.ts','utf8'))"],
    { encoding: "utf8" },
  );
  return dich.length > 0 && dich.every((d) => nguon.includes(`"${d}"`));
});

rmSync(thuMuc, { recursive: true, force: true });
console.log(hong === 0 ? "\nĐạt." : `\n${hong} ca hỏng.`);
process.exit(hong === 0 ? 0 : 1);
