/**
 * Kiểm bộ đếm chặn dò khoá.
 *
 *     npm run kiem-gioi-han
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO BỘ ĐẾM NÀY CẦN KIỂM RIÊNG
 *
 * Nó gác HAI cửa dẫn tới cùng một khoá: `/api/ingest` và `/duyet-bai`. Hỏng
 * theo hướng LỎNG thì khoá bị dò tự do; hỏng theo hướng CHẶT thì chủ trang gõ
 * đúng khoá vẫn bị từ chối, và vì thông báo cố ý không phân biệt hai trường
 * hợp, họ sẽ ngồi kiểm lại khoá thay vì biết mình đang bị chặn.
 *
 * Cả hai kiểu hỏng đều IM LẶNG — không ngoại lệ nào được ném ra.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import {
  demMotLuot,
  demMotLuotTuHeader,
  xoaSachBoDem,
} from "../src/lib/gioi-han-tan-suat";

let hong = 0;

function ca(ten: string, dat: boolean, them = "") {
  if (!dat) hong++;
  process.stdout.write(`${dat ? "✓" : "✗"} ${ten}${them ? `\n   ${them}` : ""}\n`);
}

// ── 1. Cho qua đúng hạn mức, chặn từ lượt kế tiếp ────────────────────────
xoaSachBoDem();
{
  const dau = new Headers({ "x-real-ip": "1.2.3.4" });
  const kq = Array.from({ length: 13 }, () =>
    demMotLuotTuHeader("duyet-bai", dau, 10, 60).vuot,
  );
  ca(
    "10 lượt đầu cho qua, lượt 11 trở đi bị chặn",
    kq.slice(0, 10).every((v) => !v) && kq.slice(10).every((v) => v),
    `qua: ${kq.filter((v) => !v).length}   chặn: ${kq.filter(Boolean).length}`,
  );
}

// ── 2. Mỗi IP một bộ đếm ────────────────────────────────────────────────
// Thiếu điều này thì một kẻ dò làm cả trang bị khoá — biến bộ chặn dò khoá
// thành công cụ từ chối dịch vụ.
xoaSachBoDem();
{
  const a = new Headers({ "x-real-ip": "1.1.1.1" });
  const b = new Headers({ "x-real-ip": "2.2.2.2" });
  for (let i = 0; i < 10; i++) demMotLuotTuHeader("duyet-bai", a, 10, 60);
  ca(
    "IP khác đếm riêng — kẻ dò không khoá được người khác",
    demMotLuotTuHeader("duyet-bai", a, 10, 60).vuot === true &&
      demMotLuotTuHeader("duyet-bai", b, 10, 60).vuot === false,
  );
}

// ── 3. Mỗi cổng một bộ đếm ──────────────────────────────────────────────
xoaSachBoDem();
{
  const dau = new Headers({ "x-real-ip": "3.3.3.3" });
  for (let i = 0; i < 10; i++) demMotLuotTuHeader("duyet-bai", dau, 10, 60);
  ca(
    "Cổng khác đếm riêng — chặn ở trang duyệt không chặn cổng nhận bài",
    demMotLuotTuHeader("ingest", dau, 20, 60).vuot === false,
  );
}

// ── 4. Lấy IP ĐẦU trong X-Forwarded-For ─────────────────────────────────
// Lấy mục cuối là lấy IP của máy chủ trung gian — khi đó cả trang dùng chung
// một bộ đếm và hạn mức sập ngay khi có vài khách.
xoaSachBoDem();
{
  const x = new Headers({ "x-forwarded-for": "5.5.5.5, 10.0.0.1" });
  const y = new Headers({ "x-forwarded-for": "6.6.6.6, 10.0.0.1" });
  for (let i = 0; i < 10; i++) demMotLuotTuHeader("duyet-bai", x, 10, 60);
  ca(
    "Dùng IP đầu trong X-Forwarded-For, không phải IP máy chủ trung gian",
    demMotLuotTuHeader("duyet-bai", x, 10, 60).vuot === true &&
      demMotLuotTuHeader("duyet-bai", y, 10, 60).vuot === false,
  );
}

// ── 5. `x-real-ip` được ưu tiên hơn `x-forwarded-for` ───────────────────
// Caddy đặt `x-real-ip`; khách tự đặt được `x-forwarded-for`. Tin cái khách
// đặt được nghĩa là ai cũng tự cấp cho mình một hạn mức mới bằng cách đổi
// header.
xoaSachBoDem();
{
  const that = new Headers({ "x-real-ip": "7.7.7.7", "x-forwarded-for": "8.8.8.8" });
  const gia = new Headers({ "x-real-ip": "7.7.7.7", "x-forwarded-for": "9.9.9.9" });
  for (let i = 0; i < 10; i++) demMotLuotTuHeader("duyet-bai", that, 10, 60);
  ca(
    "x-real-ip thắng — đổi x-forwarded-for không xin được hạn mức mới",
    demMotLuotTuHeader("duyet-bai", gia, 10, 60).vuot === true,
  );
}

// ── 6. Bản nhận `Request` vẫn đi chung một bộ đếm ───────────────────────
// Hai hàm mà đếm hai chỗ thì cổng nhận bài và trang duyệt không còn chung
// hạn mức, và lỗ hổng vừa vá sẽ mở lại theo một đường khác.
xoaSachBoDem();
{
  const dau = { "x-real-ip": "4.4.4.4" };
  const yeuCau = new Request("https://vi.du/", { headers: dau });
  for (let i = 0; i < 10; i++) demMotLuot("chung", yeuCau, 10, 60);
  ca(
    "demMotLuot và demMotLuotTuHeader dùng chung bộ đếm",
    demMotLuotTuHeader("chung", new Headers(dau), 10, 60).vuot === true,
  );
}

// ── 7. Không có header nào thì vẫn đếm, không nổ ────────────────────────
xoaSachBoDem();
{
  const trong = new Headers();
  ca(
    "Thiếu hẳn header vẫn chạy, gom vào một khoá chung",
    demMotLuotTuHeader("duyet-bai", trong, 2, 60).vuot === false &&
      demMotLuotTuHeader("duyet-bai", trong, 2, 60).vuot === false &&
      demMotLuotTuHeader("duyet-bai", trong, 2, 60).vuot === true,
  );
}

process.stdout.write(
  hong === 0 ? "\n✓ 7/7 ca đúng.\n" : `\n✗ ${hong} ca SAI — sửa trước khi triển khai.\n`,
);
process.exitCode = hong === 0 ? 0 : 1;
