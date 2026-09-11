#!/usr/bin/env node
/**
 * Site phải tự xưng ĐÚNG TÊN MÌNH ở mọi chỗ Google đọc tên site.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LỖI PHÉP KIỂM NÀY GIỮ KHÔNG QUAY LẠI
 *
 * Ngày 11/09/2026: tra "halongxanh360" không ra trang này. `site:` trả 0 trang.
 * Nguyên nhân: ở CẢ BỐN chỗ Google dùng để đặt tên site, trang khai tên mình
 * là "Vinhomes Global Gate Hạ Long" — tên DỰ ÁN, giống hệt mười đối thủ:
 *
 *     WebSite JSON-LD `name`    ← nguồn Google nói là quan trọng nhất
 *     og:site_name
 *     <title> trang chủ
 *     chữ ở vị trí logo trong header
 *
 * Còn "Hạ Long Xanh 360" chỉ nằm ở chân trang. Với Google, thực thể tên đó
 * không tồn tại; người gõ tên nó nhận về các tên miền có "halongxanh".
 *
 * Lỗi này KHÔNG có triệu chứng nào khi dùng thử. Trang vẫn dựng, vẫn đẹp, vẫn
 * đúng chính tả. Nó chỉ lộ ra khi đi tra tên mình trên máy tìm kiếm — việc
 * không ai làm mỗi ngày. Nên phải có máy giữ.
 *
 * Kiểm ở MÃ NGUỒN chứ không ở bản dựng: rẻ, chạy trong mili-giây, và chỉ cần
 * bắt đúng việc ai đó đổi `benBan.ten` về `duAn.ten` ở một trong bốn chỗ.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync } from "node:fs";

const loi = [];
const kiem = (tep, mau, moTa) => {
  const nguon = readFileSync(tep, "utf8");
  if (!mau.test(nguon)) loi.push(`${tep}: ${moTa}`);
};

// 1. WebSite JSON-LD — nguồn số một.
kiem(
  "src/components/site/du-lieu-co-cau-truc.tsx",
  /"@type":\s*"WebSite"[\s\S]{0,400}?name:\s*benBan\.ten/,
  "WebSite.name phải là benBan.ten (tên SITE), không phải duAn.ten (tên dự án)",
);
kiem(
  "src/components/site/du-lieu-co-cau-truc.tsx",
  /"@type":\s*"WebSite"[\s\S]{0,600}?alternateName:\s*\[[^\]]*"halongxanh360"/,
  'WebSite.alternateName phải chứa "halongxanh360" — đúng chuỗi người ta gõ',
);
// Không được có Organization chủ đầu tư đứng trần trên trang chủ.
kiem(
  "src/components/site/du-lieu-co-cau-truc.tsx",
  /^(?![\s\S]*"@type":\s*"Organization"[\s\S]{0,200}?name:\s*duAn\.chuDauTu)/,
  "Không khai Organization = chủ đầu tư đứng riêng — Google đọc thành 'tổ chức đứng sau site này'",
);

// 2. og:site_name.
kiem(
  "src/app/layout.tsx",
  /siteName:\s*benBan\.ten/,
  "openGraph.siteName phải là benBan.ten",
);

// 3. Tiêu đề trang chủ phải mở đầu bằng tên site.
kiem(
  "src/app/layout.tsx",
  /default:\s*`\$\{benBan\.ten\}/,
  "title.default (trang chủ) phải bắt đầu bằng benBan.ten",
);

// 4. Chữ ở vị trí logo.
kiem(
  "src/components/site/site-header.tsx",
  /\{benBan\.ten\}/,
  "Header phải hiện benBan.ten ở vị trí logo, không phải duAn.tenNgan",
);

if (loi.length > 0) {
  console.error(`✗ ${loi.length} chỗ site đang tự xưng SAI tên:`);
  for (const l of loi) console.error("   ·", l);
  console.error("\n  Lý do đầy đủ trong đầu tệp này. Đừng đổi về tên dự án.");
  process.exit(1);
}
console.log("✓ Cả 4 chỗ Google đọc tên site đều khai benBan.ten, kèm alternateName halongxanh360.");
