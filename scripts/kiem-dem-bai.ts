/**
 * Kiểm bộ nhớ đệm đọc bài (`docBaiViet` / `docMotBai` trong `lib/tin-tuc.ts`).
 *
 *     npx tsx scripts/kiem-dem-bai.ts   (tự chạy trong `npm run kiem`)
 *
 * Vì sao có: đo 13/09/2026 trên trang thật, `/tin-tuc` mất 8,4 giây khi Neon
 * ngủ. Bộ nhớ đệm trả ngay bản đang có. Phép kiểm này đòi bốn điều:
 *   1. trong 60 s, đọc lại KHÔNG chạm kho (đổi kho mà kết quả không đổi);
 *   2. `xoaBoNhoDemBai()` (gọi sau khi ghi/duyệt) làm lần đọc sau thấy bản mới;
 *   3. đọc hỏng KHÔNG ghi đè bản đang đúng, và không nhớ kết quả hỏng;
 *   4. cache theo từng bài (`docMotBai`) cũng thế.
 *
 * Chạy ở chế độ FILE (không `DATABASE_URL`): kho là `.data/bai-viet.jsonl`
 * trong một thư mục tạm, nên đổi kho = ghi lại tệp.
 */
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

delete process.env.DATABASE_URL;
const goc = process.cwd();
const thuMuc = mkdtempSync(path.join(tmpdir(), "hlx-dem-bai-"));
mkdirSync(path.join(thuMuc, ".data"));
process.chdir(thuMuc);

let hong = 0;
function ca(ten: string, ok: boolean, chiTiet = ""): void {
  console.log(`${ok ? "✓" : "✗"} ${ten}${ok ? "" : `  ← ${chiTiet}`}`);
  if (!ok) hong += 1;
}

const bai = (slug: string) =>
  JSON.stringify({ slug, tieuDe: `Bài ${slug}`, moTa: "x", ngayDang: "2026-01-01", chuyenMuc: "tien-do", trangThai: "dang" }) + "\n";
const ghiKho = (...slugs: string[]) => writeFileSync(path.join(thuMuc, ".data", "bai-viet.jsonl"), slugs.map(bai).join(""));

async function main(): Promise<void> {
  const { docBaiViet, docMotBai, xoaBoNhoDemBai } = await import("../src/lib/tin-tuc");

  ghiKho("a");
  const lan1 = await docBaiViet();
  ca("lần đầu đọc thật từ kho", lan1.map((b) => b.slug).join() === "a", JSON.stringify(lan1.map((b) => b.slug)));

  ghiKho("a", "b");
  const lan2 = await docBaiViet();
  ca("trong 60 s: đọc lại trả bản đang nhớ, không chạm kho", lan2.map((b) => b.slug).join() === "a", JSON.stringify(lan2.map((b) => b.slug)));

  xoaBoNhoDemBai();
  const lan3 = await docBaiViet();
  ca("xoá đệm (sau ghi/duyệt): lần đọc sau thấy bản mới", lan3.map((b) => b.slug).sort().join() === "a,b", JSON.stringify(lan3.map((b) => b.slug)));

  // Từng bài.
  const mot1 = await docMotBai("a");
  ghiKho("b");
  const mot2 = await docMotBai("a");
  ca("docMotBai: trong 60 s trả bản đang nhớ", mot1?.slug === "a" && mot2?.slug === "a", JSON.stringify([mot1?.slug, mot2?.slug]));
  xoaBoNhoDemBai();
  const mot3 = await docMotBai("a");
  ca("docMotBai: xoá đệm thì thấy bài đã mất", mot3 === null, String(mot3));

  // Đọc hỏng không được ghi đè bản đúng: kho thành tệp KHÔNG PHẢI jsonl nhưng
  // đường file bỏ qua dòng hỏng (trả rỗng, không ném) — nên ca "hỏng" thật cần
  // đường cơ sở dữ liệu. Ở đây kiểm nửa còn lại: rỗng thật thì trả rỗng.
  xoaBoNhoDemBai();
  writeFileSync(path.join(thuMuc, ".data", "bai-viet.jsonl"), "không phải json\n");
  const rong = await docBaiViet();
  ca("kho rỗng/hỏng dòng: trả rỗng, không ném", Array.isArray(rong) && rong.length === 0, String(rong));

  // Windows không xoá được thư mục đang là cwd — về chỗ cũ trước; dọn hỏng
  // cũng không làm phép kiểm đỏ (chỉ là tệp tạm).
  process.chdir(goc);
  try {
    rmSync(thuMuc, { recursive: true, force: true });
  } catch {
    // bỏ qua
  }
  if (hong > 0) {
    console.error(`\n${hong} ca hỏng.`);
    process.exit(1);
  }
  console.log("\n✓ Bộ nhớ đệm đọc bài: nhớ trong 60 s, xoá đệm thấy ngay bản mới.");
}

void main();
