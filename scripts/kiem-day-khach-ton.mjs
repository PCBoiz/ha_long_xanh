#!/usr/bin/env node
/**
 * Kiểm hàng đợi khách tồn (`src/lib/lead/day-khach-ton.ts`).
 *
 * ⚠️ MỖI CA LÀ MỘT CÁCH MẤT KHÁCH HOẶC LÀM PHIỀN KHÁCH:
 *   · gửi trùng  → chủ trang gọi một khách hai lần
 *   · kẹt ở dòng hỏng → mọi khách sau dòng đó không bao giờ tới bảng
 *   · đích hỏng mà vẫn tiến mốc → khách bị coi là đã gửi trong khi chưa
 *   · hai lượt chạy song song → gửi trùng
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Kho này không có tsx — nạp TS bằng esbuild, cùng cách `kiem-noi-lien-ket.mjs`.
const tam = mkdtempSync(join(tmpdir(), "day-khach-"));
const raBundle = join(tam, "ra.mjs");
execFileSync(
  "node",
  [
    "node_modules/esbuild/bin/esbuild",
    "src/lib/lead/day-khach-ton.ts",
    "--bundle",
    "--format=esm",
    "--platform=node",
    `--outfile=${raBundle}`,
    "--log-level=error",
  ],
  { stdio: "inherit" },
);
const { dayKhachTon } = await import(`file://${raBundle.replace(/\\/g, "/")}`);

let hong = 0;
let tong = 0;
function kiem(ten, dat) {
  tong++;
  console.log(`${dat ? "  ok  " : "  HỎNG"} ${ten}`);
  if (!dat) hong++;
}

function thuMucMoi(dong) {
  const d = mkdtempSync(join(tam, "tm-"));
  writeFileSync(join(d, "dang-ky.jsonl"), dong.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join("\n") + "\n");
  return d;
}
const moc = (d) => readFileSync(join(d, "dang-ky-da-day.txt"), "utf8");
const khach = (n) => ({ dienThoai: `09000000${String(n).padStart(2, "0")}` });

try {
  // 1. Gửi hết, ghi mốc.
  {
    const d = thuMucMoi([khach(1), khach(2), khach(3)]);
    const daNhan = [];
    const kq = await dayKhachTon(d, async (b) => (daNhan.push(b.dienThoai), true));
    kiem("gửi hết 3 khách tồn, đúng thứ tự", kq.daGui === 3 && daNhan.join() === "0900000001,0900000002,0900000003");
    kiem("ghi mốc = 3", moc(d) === "3");

    // 2. Chạy lại: không gửi trùng.
    const lan2 = [];
    const kq2 = await dayKhachTon(d, async (b) => (lan2.push(b), true));
    kiem("chạy lại không gửi trùng", kq2.daGui === 0 && lan2.length === 0);
  }

  // 3. Đích hỏng giữa chừng: dừng, KHÔNG tiến mốc qua dòng chưa gửi được.
  {
    const d = thuMucMoi([khach(1), khach(2), khach(3)]);
    let dem = 0;
    const kq = await dayKhachTon(d, async () => ++dem < 2);
    kiem("đích hỏng ở khách thứ 2 → dừng, chỉ tính 1 đã gửi", kq.daGui === 1 && kq.conTon === 2);
    kiem("mốc dừng ở 1 — khách 2 sẽ được thử lại", moc(d) === "1");

    const daNhan = [];
    const kq2 = await dayKhachTon(d, async (b) => (daNhan.push(b.dienThoai), true));
    kiem("đích sống lại → gửi tiếp đúng từ khách 2", kq2.daGui === 2 && daNhan[0] === "0900000002");
  }

  // 4. Dòng hỏng không làm kẹt hàng đợi.
  {
    const d = thuMucMoi([khach(1), "{không phải json", khach(3)]);
    const daNhan = [];
    const kq = await dayKhachTon(d, async (b) => (daNhan.push(b.dienThoai), true));
    kiem("bỏ qua dòng hỏng, vẫn gửi khách sau nó", kq.daGui === 2 && kq.boQua === 1 && daNhan.includes("0900000003"));
  }

  // 5. Khách mới nối đuôi sau khi đã rút: lần sau chỉ gửi phần mới.
  {
    const d = thuMucMoi([khach(1)]);
    await dayKhachTon(d, async () => true);
    writeFileSync(join(d, "dang-ky.jsonl"), readFileSync(join(d, "dang-ky.jsonl"), "utf8") + JSON.stringify(khach(9)) + "\n");
    const daNhan = [];
    await dayKhachTon(d, async (b) => (daNhan.push(b.dienThoai), true));
    kiem("chỉ gửi dòng mới nối đuôi", daNhan.join() === "0900000009");
  }

  // 6. Hai lượt song song: lượt sau nhường, không gửi trùng.
  {
    const d = thuMucMoi([khach(1), khach(2)]);
    const daNhan = [];
    const cham = async (b) => (await new Promise((r) => setTimeout(r, 20)), daNhan.push(b.dienThoai), true);
    const [a, b] = await Promise.all([dayKhachTon(d, cham), dayKhachTon(d, cham)]);
    kiem("hai lượt cùng lúc → một lượt nhường (null), không gửi trùng", (a === null || b === null) && daNhan.length === 2);
  }

  // 7. Không có tệp: không lỗi.
  {
    const d = mkdtempSync(join(tam, "rong-"));
    const kq = await dayKhachTon(d, async () => true);
    kiem("chưa có tệp khách → không lỗi, không gửi gì", kq.daGui === 0 && kq.conTon === 0);
  }
} finally {
  rmSync(tam, { recursive: true, force: true });
}

if (hong > 0) {
  console.error(`✗ ${hong}/${tong} ca hỏng.`);
  process.exit(1);
}
console.log(`✓ ${tong}/${tong} ca hàng đợi khách tồn đúng.`);
