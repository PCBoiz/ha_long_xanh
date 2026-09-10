// Khoá IndexNow trong mã phải khớp ĐÚNG tệp trong `public/`.
//
// ═══════════════════════════════════════════════════════════════════════════
// VÌ SAO CẦN PHÉP KIỂM NÀY
//
// IndexNow xác minh quyền sở hữu bằng cách gọi ngược lại
// `https://<tên miền>/<khoá>.txt` và so nội dung với khoá đã gửi. Hai thứ phải
// khớp về CẢ TÊN TỆP LẪN NỘI DUNG.
//
// Khi lệch, không có gì báo. Việc duyệt bài vẫn chạy đúng, bài vẫn lên trang,
// các trang vẫn dựng lại — chỉ mỗi lệnh ping trả 403 và rơi vào một dòng
// `console.info`. Không ai đọc dòng đó, và mấy tuần sau người ta chỉ thấy Bing
// lập chỉ mục chậm, rồi đi tìm nguyên nhân ở chỗ khác.
//
// Ba cách làm lệch, cả ba đều dễ xảy ra:
//   · đổi hằng số mà quên đổi tên tệp
//   · đổi tên tệp mà quên đổi hằng số
//   · sửa tệp bằng trình soạn thảo tự thêm dấu xuống dòng ở cuối
//
// Cái thứ ba là khó thấy nhất: nhìn hai bên giống hệt nhau, chỉ khác một byte
// vô hình. Nên phép kiểm này so từng byte, không `.trim()`.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const GOC = process.cwd();

const nguon = readFileSync(
  path.join(GOC, "src/lib/indexnow.ts"),
  "utf8",
);
const khop = /export const KHOA_INDEXNOW = "([^"]*)"/.exec(nguon);

if (!khop) {
  console.error("✗ Không tìm thấy `export const KHOA_INDEXNOW` trong src/lib/indexnow.ts");
  process.exit(1);
}

const khoa = khop[1];
const tep = path.join(GOC, "public", `${khoa}.txt`);

if (!/^[A-Za-z0-9-]{8,128}$/.test(khoa)) {
  console.error(
    `✗ KHOA_INDEXNOW = "${khoa}" không đúng dạng IndexNow nhận ` +
      "(8–128 ký tự, chỉ chữ, số và dấu gạch ngang).",
  );
  process.exit(1);
}

if (!existsSync(tep)) {
  console.error(`✗ Thiếu tệp public/${khoa}.txt`);
  console.error("  Bing gọi vào địa chỉ đó để xác minh; không có tệp thì mọi lần ping trả 403.");
  console.error(`  Chữa: printf '${khoa}' > public/${khoa}.txt`);
  process.exit(1);
}

// So từng byte. `.trim()` ở đây sẽ giấu đi đúng lỗi khó thấy nhất.
const noiDung = readFileSync(tep, "utf8");
if (noiDung !== khoa) {
  console.error(`✗ Nội dung public/${khoa}.txt không khớp khoá.`);
  console.error(`  Trong tệp : ${JSON.stringify(noiDung)}`);
  console.error(`  Phải là   : ${JSON.stringify(khoa)}`);
  if (noiDung.trim() === khoa) {
    console.error("  → Lệch đúng phần khoảng trắng/xuống dòng ở cuối. Ghi lại bằng `printf`, đừng dùng `echo`.");
  }
  process.exit(1);
}

console.log(`✓ Khoá IndexNow khớp tệp public/${khoa}.txt (${noiDung.length} byte, không dư ký tự nào).`);
