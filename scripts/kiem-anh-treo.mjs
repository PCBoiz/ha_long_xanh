// Bắt ảnh đã nén nhưng KHÔNG chỗ nào trên trang dùng tới.
//
//     node scripts/kiem-anh-treo.mjs
//
// ═══════════════════════════════════════════════════════════════════════════
// VÌ SAO CẦN MỘT BƯỚC RIÊNG CHO VIỆC NÀY
//
// Ảnh nằm chết không làm gãy gì cả — đó chính là vấn đề. Không lỗi biên dịch,
// không cảnh báo, trang chạy bình thường. Nó chỉ âm thầm phình kho mã và phình
// ảnh Docker, rồi vài tháng sau không ai còn nhớ tấm nào còn dùng.
//
// Đã xảy ra hai lần: chín tấm `khu-*` sau khi gỡ khối phân khu, và một tấm
// `san-pham-don-lap` do chính lần đổi ảnh ngày 08/09 tạo ra.
//
// ⚠️ PHẢI LOẠI `images.generated.ts` KHỎI PHÉP TÌM. Bản kê đó chứa TÊN CỦA MỌI
// ẢNH, nên nếu quét cả nó thì không tấm nào bị coi là treo — phép kiểm trông
// như đang chạy mà thật ra luôn báo sạch. Tôi đã mắc đúng bẫy này.
// ═══════════════════════════════════════════════════════════════════════════

import { readdirSync } from "node:fs";
import { execSync } from "node:child_process";

const anh = readdirSync("public/images")
  .filter((f) => f.endsWith(".webp"))
  .map((f) => f.replace(".webp", ""));

const nguon = execSync(
  'git grep -h "" -- src ":!src/data/images.generated.ts"',
  { encoding: "utf8", maxBuffer: 1e8 },
);

const treo = anh.filter((t) => !nguon.includes(`"${t}"`));

console.log(`${anh.length} ảnh · ${treo.length} không nơi nào dùng`);
if (treo.length) {
  for (const t of treo) console.log(`  · ${t}`);
  console.log(
    "\nMỗi tấm phải chọn một trong hai: gán vào một chỗ dùng, hoặc gỡ khỏi\n" +
      "`fetch-assets.mjs` rồi xoá tệp .webp. Để đấy không phải là lựa chọn.",
  );
}
