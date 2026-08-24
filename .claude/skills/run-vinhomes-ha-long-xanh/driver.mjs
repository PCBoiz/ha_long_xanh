// Bộ điều khiển trang Vinhomes Global Gate Hạ Long.
//
// Trang này gần như toàn bộ giá trị nằm ở CHUYỂN ĐỘNG — màn mở đầu, thị sai,
// mảng bị ghim, thư viện cuộn ngang. Mở bằng mắt thì kiểm được, nhưng không
// lặp lại được và không chạy trong máy dựng. Driver này làm ba việc:
//
//   1. Chụp ảnh trang ở nhiều vị trí cuộn khác nhau, để nhìn được chuyển động
//      đã diễn ra tới đâu.
//   2. Đo những thứ ĐÃ TỪNG HỎNG ở dự án này: trang tràn ngang, ScrollTrigger
//      không ghim được mảng nào, màn mở đầu không kết thúc.
//   3. Báo trạng thái "giảm chuyển động" — thiết lập này từng làm cả nhóm tưởng
//      code hỏng trong khi code chạy đúng.
//
// Cuộn bằng SỰ KIỆN CON LĂN chứ không gọi window.scrollTo: trang dùng Lenis,
// nó giữ quyền điều khiển và sẽ kéo vị trí cuộn về lại ngay ở khung hình kế.
//
//   node .claude/skills/run-vinhomes-ha-long-xanh/driver.mjs
//   node .claude/skills/run-vinhomes-ha-long-xanh/driver.mjs --url=http://localhost:3000
//   node .claude/skills/run-vinhomes-ha-long-xanh/driver.mjs --duong-dan=/du-an
//   node .claude/skills/run-vinhomes-ha-long-xanh/driver.mjs --giam-chuyen-dong

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const THAM_SO = Object.fromEntries(
  process.argv.slice(2).map((muc) => {
    const [khoa, giaTri] = muc.replace(/^--/, "").split("=");
    return [khoa, giaTri ?? true];
  }),
);

const GOC = THAM_SO.url ?? "http://localhost:3210";
const DUONG_DAN = THAM_SO["duong-dan"] ?? "/";
const THU_MUC_ANH =
  THAM_SO.out ?? ".claude/skills/run-vinhomes-ha-long-xanh/anh-chup";
const GIAM_CHUYEN_DONG = Boolean(THAM_SO["giam-chuyen-dong"]);
const SO_BUOC_CUON = Number(THAM_SO.buoc ?? 7);

async function main() {
  await mkdir(THU_MUC_ANH, { recursive: true });

  const trinhDuyet = await chromium.launch({
    // Dùng Chrome đã cài sẵn trên máy thay vì tải riêng một bản Chromium.
    channel: "chrome",
    headless: !THAM_SO["hien-cua-so"],
  });

  const boiCanh = await trinhDuyet.newContext({
    viewport: { width: 1600, height: 900 },
    // MẶC ĐỊNH TẮT "giảm chuyển động". Nếu để trình duyệt tự quyết theo máy
    // đang chạy thì ảnh chụp ra sẽ tĩnh hoàn toàn trên máy có bật thiết lập
    // này, và người xem ảnh sẽ tưởng chuyển động bị hỏng.
    reducedMotion: GIAM_CHUYEN_DONG ? "reduce" : "no-preference",
  });

  const trang = await boiCanh.newPage();
  const loi = [];
  trang.on("console", (tin) => {
    if (tin.type() === "error") loi.push(`console: ${tin.text()}`);
  });
  trang.on("pageerror", (e) => loi.push(`pageerror: ${String(e)}`));

  const dia = `${GOC}${DUONG_DAN}`;
  console.log(`→ mở ${dia}`);
  await trang.goto(dia, { waitUntil: "domcontentloaded" });

  const anh = [];
  const chup = async (ten) => {
    const tep = path.join(THU_MUC_ANH, `${ten}.png`);
    await trang.screenshot({ path: tep });
    anh.push(tep);
    console.log(`   chụp ${tep}`);
  };

  // Bắt màn mở đầu khi nó CÒN đang chạy — đợi nó xong rồi mới chụp thì không
  // bao giờ thấy.
  //
  // Chụp HAI khung vì màn mở đầu có hai trạng thái khác hẳn nhau: lúc đầu chỉ
  // có ảnh, chữ và bộ đếm mới trồi lên sau. Chụp một khung ở 900ms thì luôn
  // rơi vào lúc chữ còn trong suốt, và người xem ảnh sẽ tưởng chữ bị mất.
  await trang.waitForTimeout(900);
  await chup("00-man-mo-dau-anh");
  await trang.waitForTimeout(1100);
  await chup("00-man-mo-dau-chu");

  // Màn mở đầu gắn cờ này lên <html> khi kéo màn xong.
  let manMoDauXong = true;
  try {
    await trang.waitForFunction(
      () => document.documentElement.dataset.preloaded === "true",
      null,
      { timeout: 15_000 },
    );
  } catch {
    manMoDauXong = false;
    console.log("   ⚠ màn mở đầu KHÔNG kết thúc sau 15 giây");
  }

  await trang.waitForTimeout(600);
  await chup("01-hero");

  // Cuộn từng nhịp bằng con lăn. Nghỉ giữa các nhịp để Lenis trôi hết đà và
  // hiệu ứng bám cuộn kịp vẽ.
  const buocCuon = 1400;
  for (let i = 1; i <= SO_BUOC_CUON; i += 1) {
    await trang.mouse.wheel(0, buocCuon);
    await trang.waitForTimeout(950);
    await chup(`${String(i + 1).padStart(2, "0")}-cuon-${i}`);
  }

  const doDac = await trang.evaluate(() => {
    const goc = document.documentElement;
    return {
      giamChuyenDong: matchMedia("(prefers-reduced-motion: reduce)").matches,
      manMoDauDaGanCo: goc.dataset.preloaded === "true",
      rongNoiDung: goc.scrollWidth,
      rongKhungNhin: window.innerWidth,
      caoTrang: goc.scrollHeight,
      // ScrollTrigger chèn một thẻ .pin-spacer cho MỖI mảng bị ghim. Không có
      // cái nào tức là không mảng nào ghim được.
      soMangBiGhim: document.querySelectorAll(".pin-spacer").length,
      soAnh: document.images.length,
      anhChuaTai: [...document.images].filter(
        (a) => !a.complete || a.naturalWidth === 0,
      ).length,
    };
  });

  const tranNgang = doDac.rongNoiDung > doDac.rongKhungNhin + 1;
  const bao = {
    dia,
    thoiDiem: new Date().toISOString(),
    ...doDac,
    tranNgang,
    manMoDauXong,
    loi,
    anh,
  };

  const tepBao = path.join(THU_MUC_ANH, "bao-cao.json");
  await writeFile(tepBao, JSON.stringify(bao, null, 2), "utf8");

  console.log("\n──────── KẾT QUẢ ────────");
  console.log(`  giảm chuyển động     : ${doDac.giamChuyenDong ? "BẬT ⚠" : "tắt"}`);
  console.log(`  màn mở đầu kết thúc  : ${manMoDauXong ? "có" : "KHÔNG ✗"}`);
  console.log(`  mảng bị ghim         : ${doDac.soMangBiGhim}`);
  console.log(
    `  tràn ngang           : ${tranNgang ? `CÓ ✗ (${doDac.rongNoiDung} > ${doDac.rongKhungNhin})` : "không"}`,
  );
  console.log(`  ảnh chưa tải         : ${doDac.anhChuaTai}/${doDac.soAnh}`);
  console.log(`  lỗi trên console     : ${loi.length}`);
  for (const muc of loi) console.log(`      · ${muc}`);
  console.log(`\n  ảnh chụp → ${THU_MUC_ANH}`);
  console.log(`  báo cáo  → ${tepBao}`);

  await trinhDuyet.close();

  // Ba điều kiện thất bại này đều là lỗi đã THẬT SỰ xảy ra ở dự án, nên để
  // driver trả mã lỗi cho máy dựng bắt được.
  const hong = [];
  if (!manMoDauXong) hong.push("màn mở đầu không kết thúc");
  if (tranNgang) hong.push("trang tràn ngang");

  // Chỉ TRANG CHỦ mới có mảng bị ghim (ảnh nở toàn màn và thư viện cuộn ngang).
  // Các trang khác không ghim gì là đúng, không phải lỗi — bắt lỗi ở đó thì
  // driver kêu oan và người ta sẽ tập bỏ qua nó.
  if (
    DUONG_DAN === "/" &&
    !doDac.giamChuyenDong &&
    doDac.soMangBiGhim === 0
  ) {
    hong.push("trang chủ không ghim được mảng nào (ScrollTrigger đo sai?)");
  }
  if (hong.length > 0) {
    console.error(`\n✗ THẤT BẠI: ${hong.join("; ")}`);
    process.exitCode = 1;
  } else {
    console.log("\n✓ đạt");
  }
}

await main();
