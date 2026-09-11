/**
 * Kiểm ảnh kèm bài: ghép vào nội dung, tách ra lúc dựng, hàng rào tên tệp.
 *
 *     npx tsx scripts/kiem-anh-bai.ts   (tự chạy trong `npm run kiem`)
 *
 * Ảnh kèm bài là HTML do BÊN NGOÀI gửi, được tách ra bằng biểu thức chính quy
 * rồi đưa vào `<img src>` của trang. Hai chỗ có thể sai theo hướng nguy hiểm:
 * (1) tách nhận cả `src` không phải nội bộ; (2) tuyến phục vụ ảnh nhận tên tệp
 * có `..`. Cả hai được khoá dưới đây, cùng với chuyện thường ngày: ghép rồi
 * tách phải ra đúng bài cũ, và ảnh thứ hai phải đứng TRƯỚC phần FAQ.
 */
import {
  MAU_SLUG,
  MAU_TEN_TEP,
  dungFigure,
  ghepAnhVaoBai,
  tachAnhBia,
  tenTepAnh,
} from "../src/lib/anh-bai";

let hong = 0;
function ca(ten: string, ok: boolean, chiTiet = ""): void {
  console.log(`${ok ? "✓" : "✗"} ${ten}${ok ? "" : `  ← ${chiTiet}`}`);
  if (!ok) hong += 1;
}

const A = { src: "/anh-bai/gia-bien-thu/0123456789ab.webp", alt: 'Phối cảnh "biệt thự" & vịnh' };
const B = { src: "/anh-bai/gia-bien-thu/fedcba987654.jpg", alt: "Sân golf" };
const THAN = "<p>Mở đầu.</p>\n<h2>Giá</h2><p>Nội dung.</p>\n<h2>Câu hỏi thường gặp</h2><p><strong>Hỏi?</strong><br>Đáp.</p>";

// 1. Ghép một ảnh → bìa ở đầu; tách ra → bìa đúng, thân đúng nguyên văn.
{
  const ghep = ghepAnhVaoBai(THAN, [A]);
  const { anhBia, than } = tachAnhBia(ghep);
  ca("ghép 1 ảnh: bìa ở đầu, alt được thoát và khôi phục đúng", anhBia?.src === A.src && anhBia?.alt === A.alt, JSON.stringify(anhBia));
  ca("tách bìa: thân bài trả về y nguyên", than === THAN, than.slice(0, 80));
  ca("figure bìa thoát dấu nháy trong alt", dungFigure(A, true).includes("&quot;bi&#x1EC7;t") === false && dungFigure(A, true).includes('alt="Phối cảnh &quot;biệt thự&quot; &amp; vịnh"'), dungFigure(A, true));
}

// 2. Ghép hai ảnh → ảnh thứ hai đứng TRƯỚC FAQ, không chen giữa hỏi–đáp.
{
  const ghep = ghepAnhVaoBai(THAN, [A, B]);
  const { than } = tachAnhBia(ghep);
  const viTriAnh2 = than.indexOf(B.src);
  const viTriFaq = than.indexOf("Câu hỏi thường gặp");
  ca("ảnh thứ hai nằm trước FAQ", viTriAnh2 > 0 && viTriFaq > viTriAnh2, `anh2=${viTriAnh2} faq=${viTriFaq}`);
  ca("không có FAQ thì ảnh thứ hai nằm cuối", tachAnhBia(ghepAnhVaoBai("<p>a</p>", [A, B])).than.endsWith("</figure>"));
}

// 3. Không ảnh → nội dung nguyên vẹn; nội dung không có bìa → tách trả nguyên.
ca("không ảnh: nội dung không đổi", ghepAnhVaoBai(THAN, []) === THAN);
ca("bài cũ không có bìa: anhBia null, thân nguyên", tachAnhBia(THAN).anhBia === null && tachAnhBia(THAN).than === THAN);
ca("nội dung rỗng", tachAnhBia(undefined).anhBia === null && tachAnhBia(undefined).than === "");

// 4. AN TOÀN: bìa trỏ ra ngoài (không phải /anh-bai/) thì KHÔNG dùng làm ảnh đầu bài.
{
  const la = `<figure data-anh-bia="1"><img src="https://ke-la.example/x.jpg" alt="x"></figure>\n\n<p>a</p>`;
  const { anhBia, than } = tachAnhBia(la);
  ca("bìa trỏ host lạ bị bỏ, thân vẫn bỏ figure đó", anhBia === null && than === "<p>a</p>", `${anhBia} | ${than}`);
}

// 5. Hàng rào tên tệp / slug của tuyến phục vụ ảnh.
for (const [ten, mong] of [
  ["0123456789ab.webp", true],
  ["fedcba987654.jpg", true],
  ["0123456789ab.png", true],
  ["../.env", false],
  ["0123456789ab.webp/..", false],
  ["0123456789AB.webp", false],
  ["0123456789ab.svg", false],
  ["01234.webp", false],
] as const) {
  ca(`tên tệp ${JSON.stringify(ten)} → ${mong ? "nhận" : "chặn"}`, MAU_TEN_TEP.test(ten) === mong);
}
for (const [slug, mong] of [["gia-bien-thu-2026", true], ["..", false], ["a/b", false], ["A-B", false]] as const) {
  ca(`slug ${JSON.stringify(slug)} → ${mong ? "nhận" : "chặn"}`, MAU_SLUG.test(slug) === mong);
}

// 6. Tên tệp = băm nội dung: cùng byte cùng tên, khác byte khác tên, đuôi theo mime.
{
  const x = new Uint8Array([1, 2, 3]);
  const y = new Uint8Array([1, 2, 4]);
  ca("tên tệp tất định theo nội dung", tenTepAnh(x, "image/webp") === tenTepAnh(x, "image/webp") && tenTepAnh(x, "image/webp") !== tenTepAnh(y, "image/webp"));
  ca("đuôi theo mime", tenTepAnh(x, "image/jpeg").endsWith(".jpg") && MAU_TEN_TEP.test(tenTepAnh(x, "image/png")));
  let nem = false;
  try {
    tenTepAnh(x, "image/svg+xml");
  } catch {
    nem = true;
  }
  ca("mime lạ bị từ chối", nem);
}

if (hong > 0) {
  console.error(`\n✗ ${hong} ca hỏng.`);
  process.exit(1);
}
console.log("\n✓ Ảnh kèm bài: ghép/tách đúng, hàng rào tên tệp đúng.");
