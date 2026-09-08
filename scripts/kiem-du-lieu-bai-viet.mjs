// Kiểm bộ bóc FAQ và khối dữ liệu có cấu trúc của bài viết.
//
//     node scripts/kiem-du-lieu-bai-viet.mjs
//
// ═══════════════════════════════════════════════════════════════════════════
// VÌ SAO PHẢI KIỂM RIÊNG, VÀ VÌ SAO NÓ HỎNG ÂM THẦM NẾU KHÔNG KIỂM
//
// `bocFaq` đọc lại HTML do module đăng bài bên Antigravity sinh ra. Hai bên nằm
// ở HAI KHO MÃ KHÁC NHAU, không có kiểu dữ liệu chung nào ràng buộc.
//
// Nghĩa là bên kia đổi một chi tiết rất nhỏ — bỏ `<br />`, đổi `<strong>` sang
// `<b>`, gói câu hỏi vào `<h3>` — thì bộ bóc ở đây lặng lẽ trả mảng rỗng. Không
// lỗi, không cảnh báo: trang vẫn dựng, bài vẫn hiện, chỉ mất đúng khối FAQPage
// mà cả đường ống sinh ra để có.
//
// Đây là loại hỏng tệ nhất với GEO: thứ biến mất là thứ không ai nhìn thấy.
//
// Dùng esbuild để nạp TypeScript vì kho này không có sẵn trình chạy TS.
// ═══════════════════════════════════════════════════════════════════════════

import { build } from "esbuild";
import { writeFileSync, unlinkSync } from "node:fs";
import path from "node:path";

const TAM = path.join(process.cwd(), ".tmp", "du-lieu-bai-viet.test.mjs");

await build({
  entryPoints: ["src/lib/du-lieu-bai-viet.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: TAM,
  logLevel: "silent",
  alias: { "@": path.join(process.cwd(), "src") },
});

const { bocFaq, duLieuBaiViet } = await import(`file://${TAM}`);

/** HTML đúng như module #21 bên Antigravity dựng ra. */
const THAN = [
  "<h2>Tiến độ hạ tầng</h2>",
  "<p>Tuyến đường trục chính đã trải nhựa lớp đầu tiên.</p>",
  "<h2>Câu hỏi thường gặp</h2>",
  "<p><strong>Khi nào bàn giao?</strong><br />Dự kiến theo tiến độ ghi trong hợp đồng mua bán.</p>",
  "<p><strong>Có được vay ngân hàng không?</strong><br />Có, theo chính sách của từng ngân hàng liên kết.</p>",
  "<h2>Liên hệ</h2>",
  "<p><strong>Gọi ngay</strong><br />Số máy ghi ở chân trang.</p>",
].join("\n");

let dat = 0;
let tong = 0;
function kiem(nhan, thuc, mong) {
  tong++;
  const ok = JSON.stringify(thuc) === JSON.stringify(mong);
  if (ok) dat++;
  console.log(`${ok ? "✅" : "❌"} ${nhan}`);
  if (!ok) {
    console.log(`   mong đợi: ${JSON.stringify(mong)}`);
    console.log(`   thực tế : ${JSON.stringify(thuc)}`);
  }
}

const faq = bocFaq(THAN);

kiem("bóc đúng 2 cặp — DỪNG ở <h2> kế tiếp, không nuốt mục Liên hệ", faq.length, 2);
kiem("câu hỏi thứ nhất", faq[0]?.hoi, "Khi nào bàn giao?");
kiem(
  "câu trả lời thứ nhất",
  faq[0]?.dap,
  "Dự kiến theo tiến độ ghi trong hợp đồng mua bán.",
);
kiem("bài không có khối FAQ thì trả mảng rỗng", bocFaq("<p>Chỉ có chữ.</p>").length, 0);
kiem("nội dung rỗng không làm nổ", bocFaq(null).length, 0);

const bai = {
  slug: "thu-nghiem",
  tieuDe: "Bài thử nghiệm",
  moTa: "Mô tả ngắn của bài thử nghiệm.",
  ngayDang: "2026-09-09",
  chuyenMuc: "Tiến độ",
  noiDung: THAN,
};
const ld = JSON.parse(duLieuBaiViet(bai).replace(/\\u003c/g, "<"));
const loai = ld["@graph"].map((x) => x["@type"]);

kiem("khai đủ NewsArticle + FAQPage", loai, ["NewsArticle", "FAQPage"]);
kiem("có datePublished", ld["@graph"][0].datePublished, "2026-09-09");
kiem("FAQPage mang đủ 2 câu hỏi", ld["@graph"][1].mainEntity.length, 2);

// Bài KHÔNG có FAQ thì tuyệt đối không được khai FAQPage rỗng.
const ldTron = JSON.parse(
  duLieuBaiViet({ ...bai, noiDung: "<p>Chỉ có chữ.</p>" }).replace(/\\u003c/g, "<"),
);
kiem(
  "không có FAQ thì KHÔNG khai FAQPage",
  ldTron["@graph"].map((x) => x["@type"]),
  ["NewsArticle"],
);

unlinkSync(TAM);
console.log(`\n${dat}/${tong} phép kiểm đạt`);
if (dat !== tong) process.exitCode = 1;
