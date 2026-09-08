// Bắt ảnh đã nén nhưng KHÔNG chỗ nào trên trang dùng tới.
//
//     node scripts/kiem-anh-treo.mjs
//
// ═══════════════════════════════════════════════════════════════════════════
// ⚠️ BẢN ĐẦU CỦA SCRIPT NÀY ĐÃ LÀM VỠ MỘT TRANG THẬT. ĐỌC TRƯỚC KHI SỬA.
//
// Nó chỉ tìm tên ảnh dưới dạng CHUỖI NGUYÊN VĂN trong `src/`. Nhưng trang phân
// khu không viết tên ảnh ra; nó DỰNG TÊN LÚC CHẠY:
//
//     export function anhPhanKhu(ma: string) {
//       const ten = `khu-${ma}`;          // ← không có chuỗi "khu-paradise-bay"
//       return ten in projectImages ? ten : null;
//     }
//
// Nên chín ảnh `khu-*` bị báo là "không nơi nào dùng", bị xoá, và trang
// /quy-hoach mất sạch ảnh — chỉ còn chữ thay thế. Lỗi không lộ ra ở `tsc`,
// `eslint` hay `next build`, vì tất cả đều đúng: ảnh thiếu chỉ thành `null` và
// khối ảnh tự bỏ qua. Nó chỉ lộ khi có người MỞ TRANG BẰNG MẮT.
//
// Bài học: một phép kiểm tìm chuỗi nguyên văn thì mù trước mọi tên dựng động,
// và cái mù đó nguy hiểm hơn không có phép kiểm — vì nó nói "sạch" một cách
// tự tin.
//
// GIỜ: quét thêm mọi TIỀN TỐ xuất hiện trong chuỗi mẫu `` `xxx-${ `` và coi
// mọi ảnh mang tiền tố đó là đang được dùng.
//
// Và phải loại `images.generated.ts` khỏi phép tìm — bản kê đó chứa TÊN CỦA
// MỌI ẢNH, nên quét cả nó thì không tấm nào bị coi là treo. Tôi đã mắc cả hai
// bẫy trong cùng một ngày.
// ═══════════════════════════════════════════════════════════════════════════

import { readdirSync } from "node:fs";
import { execSync } from "node:child_process";

const anh = readdirSync("public/images")
  .filter((f) => f.endsWith(".webp"))
  .map((f) => f.replace(".webp", ""));

const nguon = execSync(
  // `--untracked`: file MỚI TẠO chưa commit vẫn phải được tính là mã nguồn.
  // Thiếu cờ này thì vừa thêm một thành phần dùng ảnh, chạy kiểm ngay, sẽ thấy
  // đúng những ảnh vừa gán bị báo là treo — rồi xoá nhầm lần nữa.
  'git grep -h --untracked "" -- src ":!src/data/images.generated.ts"',
  { encoding: "utf8", maxBuffer: 1e8 },
);

// Tiền tố dựng động: bắt `khu-${…}`, `anh-${…}`, `mat-bang-${…}`…
const tienTo = [...nguon.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)*-)\$\{/g)].map(
  (m) => m[1],
);
const tienToDuyNhat = [...new Set(tienTo)];

const dungDong = (ten) => tienToDuyNhat.some((t) => ten.startsWith(t));
const treo = anh.filter((t) => !nguon.includes(`"${t}"`) && !dungDong(t));

console.log(`${anh.length} ảnh · ${treo.length} không nơi nào dùng`);
if (tienToDuyNhat.length) {
  console.log(
    `Tiền tố dựng động đã tính là ĐANG DÙNG: ${tienToDuyNhat.map((t) => t + "*").join(", ")}`,
  );
}
if (treo.length) {
  for (const t of treo) console.log(`  · ${t}`);
  console.log(
    "\nMỗi tấm phải chọn một trong hai: gán vào một chỗ dùng, hoặc gỡ khỏi\n" +
      "`fetch-assets.mjs` rồi xoá tệp .webp.\n" +
      "\n⚠️ TRƯỚC KHI XOÁ: mở trang dùng ảnh đó bằng trình duyệt. Phép kiểm này\n" +
      "chỉ đọc mã nguồn — nó không thay được một lần nhìn.",
  );
}
