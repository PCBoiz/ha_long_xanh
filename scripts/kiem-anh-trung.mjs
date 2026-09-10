// Đo ĐỘ GIỐNG NHAU giữa các ảnh, không phải độ trùng khớp.
//
// ═══════════════════════════════════════════════════════════════════════════
// VÌ SAO BĂM FILE KHÔNG ĐỦ, VÀ VÌ SAO PHẢI CÓ FILE NÀY
//
// `fetch-assets.mjs` đã có chốt chặn bắt hai ảnh dùng CHUNG một mã Drive. Chốt
// đó đúng việc của nó và đã gỡ được ba ảnh trùng tuyệt đối.
//
// Nhưng chủ trang vẫn phàn nàn "ảnh trùng nhau hoặc tương đồng nhau nhiều" —
// và phàn nàn đó ĐÚNG, chỉ là nói về một thứ khác. Hai ảnh flycam chụp cách
// nhau mười giây là hai file khác nhau HOÀN TOÀN về dữ liệu: khác từng byte,
// khác mã băm, khác kích thước. Băm file không bao giờ bắt được chúng.
//
// Mắt người thì bắt ngay, vì mắt so CẤU TRÚC SÁNG TỐI chứ không so từng điểm
// ảnh. File này làm đúng việc đó bằng "băm tri giác":
//
//   1. Thu ảnh về lưới 9×8 xám — bỏ hết màu sắc, chi tiết, độ phân giải
//   2. So mỗi điểm với điểm bên phải nó → 64 bit "sáng hơn / tối hơn"
//   3. Hai ảnh khác nhau bao nhiêu bit = khoảng cách Hamming
//
// Cách này miễn nhiễm với đổi kích thước, đổi độ sáng, nén lại — đúng những
// thứ làm hai ảnh cùng cảnh có hai mã băm file khác nhau.
//
//   node scripts/kiem-anh-trung.mjs          báo cáo
//   node scripts/kiem-anh-trung.mjs --chan   thoát mã 1 nếu có cụm rất giống
// ═══════════════════════════════════════════════════════════════════════════

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const THU_MUC = path.join(process.cwd(), "public/images");

// Ngưỡng chọn bằng cách NHÌN KẾT QUẢ rồi chỉnh, không chép từ đâu cả.
//   ≤ 6  : gần như cùng một khung hình — hai ảnh này đứng cạnh nhau là lặp
//   ≤ 12 : cùng cảnh, khác góc hoặc khác thời điểm
const RAT_GIONG = 6;
const KHA_GIONG = 12;

async function bamTriGiac(duong) {
  // 9 cột × 8 hàng: mỗi hàng cho 8 phép so sánh → đúng 64 bit.
  const diem = await sharp(duong)
    .greyscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer();

  const bit = [];
  for (let hang = 0; hang < 8; hang++) {
    for (let cot = 0; cot < 8; cot++) {
      const i = hang * 9 + cot;
      bit.push(diem[i] > diem[i + 1] ? 1 : 0);
    }
  }
  return bit;
}

function khoangCach(a, b) {
  let n = 0;
  for (let i = 0; i < 64; i++) if (a[i] !== b[i]) n++;
  return n;
}

// ẢNH ĐÃ CẤM DÙNG KHÔNG CÒN LÀ PHÁT HIỆN.
//
// ⚠️ Cùng lý do đã ghi trong `kiem-anh-treo.mjs`: phải phân biệt ảnh BỊ QUÊN
// với ảnh CỐ Ý KHÔNG DÙNG.
//
// Chuyện có thật: `vbm-hoan-thien-02` và `song-dai-lo-mua-hoa` đúng là một
// tấm, đã xác minh bằng mắt ngày 10/09, và đã xử — bản trùng vào danh sách cấm,
// chỗ dùng chuyển sang bản đúng. Nhưng TỆP .webp vẫn nằm trên đĩa, và phải vậy:
// `npm run assets` tải lại nó mỗi lần chạy. Nên nếu không lọc, phép kiểm này
// vẫn báo y hệt như trước khi sửa.
//
// Một cổng kiểm báo mãi một việc đã làm xong thì người ta thôi đọc nó — và
// ngày nó báo một cặp trùng THẬT thì cũng không còn ai đọc nữa.
const camDung = new Set(
  [
    ...(await readFile("src/data/anh-cam-dung.ts", "utf8")).matchAll(
      /ten:\s*"([a-z0-9-]+)"/g,
    ),
  ].map((m) => m[1]),
);

const ten = (await readdir(THU_MUC))
  .filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f))
  .filter((f) => !camDung.has(f.replace(/\.[^.]+$/, "")))
  .sort();

const anh = [];
for (const f of ten) {
  anh.push({ ten: f, bam: await bamTriGiac(path.join(THU_MUC, f)) });
}

// Gom cụm: nối hai ảnh nếu đủ giống, rồi lấy các thành phần liên thông.
const cha = anh.map((_, i) => i);
const tim = (i) => (cha[i] === i ? i : (cha[i] = tim(cha[i])));
const cap = [];

for (let i = 0; i < anh.length; i++) {
  for (let j = i + 1; j < anh.length; j++) {
    const d = khoangCach(anh[i].bam, anh[j].bam);
    if (d <= KHA_GIONG) {
      cap.push({ a: anh[i].ten, b: anh[j].ten, d });
      cha[tim(i)] = tim(j);
    }
  }
}

const cum = new Map();
for (let i = 0; i < anh.length; i++) {
  const g = tim(i);
  if (!cum.has(g)) cum.set(g, []);
  cum.get(g).push(anh[i].ten);
}
const nhieu = [...cum.values()].filter((c) => c.length > 1).sort((a, b) => b.length - a.length);

// Nói ra số ảnh bị bỏ qua. Một phép kiểm âm thầm loại bớt mẫu rồi báo "đạt" là
// phép kiểm không đáng tin — người đọc phải thấy được nó đã không nhìn vào đâu.
console.log(
  `Đã đo ${anh.length} ảnh trong public/images` +
    (camDung.size > 0 ? ` · bỏ qua ${camDung.size} ảnh đã cấm dùng` : "") +
    "\n",
);

if (nhieu.length === 0) {
  console.log("✓ Không cụm nào có hai ảnh giống nhau ở mức đáng lo.");
  process.exit(0);
}

const trongCum = nhieu.reduce((n, c) => n + c.length, 0);
console.log(
  `⚠ ${nhieu.length} cụm ảnh giống nhau, gồm ${trongCum}/${anh.length} ảnh ` +
    `(${Math.round((trongCum / anh.length) * 100)}% kho ảnh)\n`,
);

nhieu.forEach((c, i) => {
  console.log(`── Cụm ${i + 1} — ${c.length} ảnh`);
  c.forEach((t) => console.log(`     ${t}`));
  const trong = cap
    .filter((p) => c.includes(p.a) && c.includes(p.b))
    .sort((x, y) => x.d - y.d)
    .slice(0, 4);
  trong.forEach((p) =>
    console.log(
      `     ${String(p.d).padStart(2)} bit lệch  ${p.a} ↔ ${p.b}` +
        (p.d <= RAT_GIONG ? "   ← gần như cùng một khung hình" : ""),
    ),
  );
  console.log("");
});

if (process.argv.includes("--chan") && cap.some((p) => p.d <= RAT_GIONG)) {
  console.error("✗ Có cặp ảnh gần như cùng một khung hình. Xem danh sách trên.");
  process.exit(1);
}
