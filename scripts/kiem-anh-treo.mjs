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

import { readdirSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const anh = readdirSync("public/images")
  .filter((f) => f.endsWith(".webp"))
  .map((f) => f.replace(".webp", ""));

const nguon = execSync(
  // `--untracked`: file MỚI TẠO chưa commit vẫn phải được tính là mã nguồn.
  // Thiếu cờ này thì vừa thêm một thành phần dùng ảnh, chạy kiểm ngay, sẽ thấy
  // đúng những ảnh vừa gán bị báo là treo — rồi xoá nhầm lần nữa.
  //
  // ⚠️ PHẢI LOẠI CẢ `anh-cam-dung.ts`, vì cùng một lý do với `images.generated`:
  // nó CHỨA TÊN ảnh. Không loại thì một ảnh vừa bị cấm sẽ được đếm là "đang
  // dùng" — phép kiểm báo xanh trong khi ảnh đó chính là thứ vừa bị gỡ. Đây là
  // kiểu hỏng tệ nhất: bộ kiểm nói dối theo hướng trấn an.
  'git grep -h --untracked "" -- src ' +
    '":!src/data/images.generated.ts" ":!src/data/anh-cam-dung.ts"',
  { encoding: "utf8", maxBuffer: 1e8 },
);

// Ảnh CỐ Ý không dùng — phân biệt với ảnh BỊ QUÊN.
//
// Không có phân biệt này thì mỗi lần cách ly một tấm là một lần cổng kiểm đỏ,
// và cách người ta xử một cổng đỏ mãi không xanh lại được là tắt nó đi.
const camDung = new Set(
  [
    ...readFileSync("src/data/anh-cam-dung.ts", "utf8").matchAll(
      /ten:\s*"([a-z0-9-]+)"/g,
    ),
  ].map((m) => m[1]),
);

// Tiền tố dựng động: bắt `khu-${…}`, `anh-${…}`, `mat-bang-${…}`…
const tienTo = [...nguon.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)*-)\$\{/g)].map(
  (m) => m[1],
);
const tienToDuyNhat = [...new Set(tienTo)];

const dungDong = (ten) => tienToDuyNhat.some((t) => ten.startsWith(t));
const treo = anh.filter(
  (t) => !nguon.includes(`"${t}"`) && !dungDong(t) && !camDung.has(t),
);
const camMaConTep = anh.filter((t) => camDung.has(t));

console.log(
  `${anh.length} ảnh · ${treo.length} không nơi nào dùng · ${camMaConTep.length} bị cấm dùng`,
);
if (camMaConTep.length) {
  console.log(
    `Cấm dùng (xem lý do trong src/data/anh-cam-dung.ts): ${camMaConTep.join(", ")}`,
  );
}
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
