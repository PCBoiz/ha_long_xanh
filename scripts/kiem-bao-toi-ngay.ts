/**
 * Kiểm chọn bài tới ngày để báo IndexNow — thuần, không mạng.
 *
 *     npx tsx scripts/kiem-bao-toi-ngay.ts   (tự chạy trong `npm run kiem`)
 *
 * Luật: chỉ bài có `ngayDang` ĐÚNG hôm nay; đã báo trong ngày thì bỏ qua; bài
 * hôm qua/ngày mai không đụng. Sai theo hướng "báo lại mãi" là 144 lần gõ cửa
 * Bing mỗi ngày (lịch gõ mỗi 10 phút); sai theo hướng "không báo" là bài hẹn
 * ngày không bao giờ được Bing biết — đúng lỗ đã vá một nửa ở 6bcdb13.
 */
import { chonBaiToiNgay } from "../src/lib/bao-toi-ngay";

let hong = 0;
function ca(ten: string, ok: boolean, chiTiet = ""): void {
  console.log(`${ok ? "✓" : "✗"} ${ten}${ok ? "" : `  ← ${chiTiet}`}`);
  if (!ok) hong += 1;
}

const BAI = [
  { slug: "hom-qua", ngayDang: "2026-09-11" },
  { slug: "hom-nay-1", ngayDang: "2026-09-12" },
  { slug: "hom-nay-2", ngayDang: "2026-09-12" },
  { slug: "ngay-mai", ngayDang: "2026-09-13" },
];

{
  const kq = chonBaiToiNgay(BAI, "2026-09-12", []);
  ca("lần đầu trong ngày: báo đúng hai bài hôm nay", JSON.stringify(kq.bao) === '["hom-nay-1","hom-nay-2"]' && kq.boQua.length === 0, JSON.stringify(kq));
}
{
  const kq = chonBaiToiNgay(BAI, "2026-09-12", ["hom-nay-1"]);
  ca("đã báo một bài: chỉ báo bài còn lại, bài kia bỏ qua", JSON.stringify(kq.bao) === '["hom-nay-2"]' && JSON.stringify(kq.boQua) === '["hom-nay-1"]', JSON.stringify(kq));
}
{
  const kq = chonBaiToiNgay(BAI, "2026-09-12", ["hom-nay-1", "hom-nay-2"]);
  ca("gọi lại lần thứ N trong ngày: không báo gì nữa", kq.bao.length === 0 && kq.boQua.length === 2, JSON.stringify(kq));
}
{
  const kq = chonBaiToiNgay(BAI, "2026-09-14", []);
  ca("ngày không có bài tới hạn: rỗng", kq.bao.length === 0 && kq.boQua.length === 0, JSON.stringify(kq));
}

if (hong > 0) {
  console.error(`\n✗ ${hong} ca hỏng.`);
  process.exit(1);
}
console.log("\n✓ Chọn bài tới ngày để báo IndexNow đúng.");
