// Audit giao diện bằng trình duyệt thật: chụp ảnh từng trang ở nhiều khổ màn
// hình VÀ đo số liệu, thay vì để tôi tự nhận xét bằng mắt.
//
// Cách chạy:  node scripts/audit.mjs           (mặc định http://localhost:3000)
//             node scripts/audit.mjs --doi-chieu   (chụp thêm market.vinhomes.vn)
//
// Mọi thứ đo trong `page.evaluate` đều chạy trên DOM đã dựng xong, sau khi đã
// cuộn hết trang — vì ảnh tải lười và hiệu ứng cuộn chỉ hiện khi đi qua.

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const GOC = process.env.AUDIT_URL ?? "http://localhost:3000";
const THU_MUC = path.join(process.cwd(), ".audit");
const DOI_CHIEU = process.argv.includes("--doi-chieu");

const KHO_MAN = [
  { ten: "dt", rong: 390, cao: 844 }, // điện thoại
  { ten: "mt", rong: 768, cao: 1024 }, // máy tính bảng
  { ten: "pc", rong: 1440, cao: 900 }, // máy bàn
];

/**
 * Danh sách trang đem đi đo.
 *
 * ⚠️ PHẢI KHỚP VỚI ĐƯỜNG DẪN THẬT. Sau đợt đổi tên chín trang, danh sách này
 * còn nguyên tám địa chỉ CŨ — mà địa chỉ cũ chuyển hướng 301 nên `page.goto`
 * vẫn ra 200 và bộ đo vẫn chạy trơn tru. Hỏng im lặng theo đúng nghĩa xấu
 * nhất: báo cáo lưu dưới tên cũ, đo trên trang đích, và HAI trang tiền mới
 * (`/gia-…`, `/duyet-bai`) không bao giờ được đo.
 *
 * Thêm trang mới thì thêm một dòng ở đây. Đổi tên trang thì sửa ở đây.
 */
const TRANG = [
  { ten: "trang-chu", duong: "/" },
  { ten: "quy-hoach", duong: "/quy-hoach" },
  { ten: "tien-ich", duong: "/tien-ich" },
  { ten: "du-an", duong: "/du-an" },
  { ten: "lien-he", duong: "/lien-he" },
  { ten: "tai-lieu", duong: "/tai-lieu" },
  { ten: "tin-tuc", duong: "/tin-tuc" },
  { ten: "phan-khu", duong: "/phan-khu/paradise-bay" },
  { ten: "san-pham", duong: "/san-pham/biet-thu-bien" },
  { ten: "dau-tu", duong: "/dau-tu" },

  // ── Chín trang tiền, tên mới ──────────────────────────────────────────
  { ten: "gia", duong: "/gia-global-gate-ha-long" },
  { ten: "quy-can", duong: "/quy-can-global-gate-ha-long" },
  { ten: "gia-thuc-tra", duong: "/gia-thuc-tra-global-gate-ha-long" },
  { ten: "voucher", duong: "/voucher-vinhomes" },
  { ten: "gia-tri-tai-san", duong: "/gia-tri-tai-san-global-gate-ha-long" },
  { ten: "chinh-sach", duong: "/chinh-sach-global-gate-ha-long" },
  { ten: "phap-ly", duong: "/phap-ly-global-gate-ha-long" },
  { ten: "tien-do", duong: "/tien-do-global-gate-ha-long" },
  { ten: "vi-tri", duong: "/vi-tri-global-gate-ha-long" },
];
/**
 * Toàn bộ phép đo chạy trong trình duyệt. Trả về số, không trả về nhận xét —
 * nhận xét là việc của người đọc báo cáo.
 */
function doTrangDOM() {
  // ---- công cụ màu ---------------------------------------------------------
  const doRGB = (s) => {
    const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
    if (!m) return null;
    return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  };
  const dophat = (c) => {
    const f = (v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const tyLeTuongPhan = (a, b) => {
    const la = dophat(a);
    const lb = dophat(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const tronMau = (tren, duoi) => {
    const a = tren[3];
    return [
      tren[0] * a + duoi[0] * (1 - a),
      tren[1] * a + duoi[1] * (1 - a),
      tren[2] * a + duoi[2] * (1 - a),
      1,
    ];
  };
  /** Nền thật của một phần tử = chồng các nền trong suốt của tổ tiên lên nhau. */
  const nenThat = (el) => {
    const chong = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = doRGB(getComputedStyle(n).backgroundColor);
      if (bg && bg[3] > 0) {
        chong.push(bg);
        if (bg[3] === 1) break;
      }
      n = n.parentElement;
    }
    let ket = [4, 20, 15, 1]; // nền body của trang này
    for (let i = chong.length - 1; i >= 0; i--) ket = tronMau(chong[i], ket);
    return ket;
  };

  const hienRa = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.05;
  };

  // ---- 1. tràn ngang -------------------------------------------------------
  const de = document.documentElement;
  const tranNgang = de.scrollWidth - de.clientWidth;
  const thuPhamTran = [];
  if (tranNgang > 1) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.right > de.clientWidth + 1 && hienRa(el)) {
        thuPhamTran.push({
          the: el.tagName.toLowerCase(),
          lop: (el.className?.toString?.() ?? "").slice(0, 70),
          phai: Math.round(r.right),
        });
      }
    }
  }

  // ---- 2. tương phản + cỡ chữ + độ dài dòng --------------------------------
  const loiTuongPhan = [];
  const doDaiDong = [];
  let coNhoNhat = 999;
  let tongDienTichChu = 0;

  const dungChu = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const daXet = new Set();
  for (let nut = dungChu.nextNode(); nut; nut = dungChu.nextNode()) {
    const chu = nut.textContent.trim();
    if (chu.length < 2) continue;
    const el = nut.parentElement;
    if (!el || !hienRa(el)) continue;
    if (el.closest(".sr-only, [aria-hidden='true'], .preloader")) continue;

    const s = getComputedStyle(el);
    const co = parseFloat(s.fontSize);
    const dam = parseInt(s.fontWeight, 10) || 400;
    if (co < coNhoNhat) coNhoNhat = co;

    const r = el.getBoundingClientRect();
    tongDienTichChu += r.width * r.height;

    if (!daXet.has(el)) {
      daXet.add(el);
      const mauChu = doRGB(s.color);
      if (mauChu && mauChu[3] > 0) {
        const nen = nenThat(el);
        const chuPhang = mauChu[3] < 1 ? tronMau(mauChu, nen) : mauChu;
        const ty = tyLeTuongPhan(chuPhang, nen);
        // Ngưỡng WCAG AA: chữ lớn (>=24px, hoặc >=18.66px và đậm) cần 3.0,
        // còn lại cần 4.5.
        const nguong = co >= 24 || (co >= 18.66 && dam >= 700) ? 3 : 4.5;
        if (ty < nguong) {
          loiTuongPhan.push({
            chu: chu.slice(0, 46),
            the: el.tagName.toLowerCase(),
            co: Math.round(co),
            ty: +ty.toFixed(2),
            can: nguong,
          });
        }
      }
    }

    // Độ dài dòng: đếm số dòng thật bằng số hình chữ nhật của Range.
    if (["P", "LI", "DD", "FIGCAPTION"].includes(el.tagName) && chu.length > 60) {
      const rg = document.createRange();
      rg.selectNodeContents(nut);
      const soDong = rg.getClientRects().length || 1;
      doDaiDong.push(Math.round(chu.length / soDong));
    }
  }

  // ---- 3. thứ tự heading ---------------------------------------------------
  const heading = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
    .filter(hienRa)
    .map((h) => ({
      bac: +h.tagName[1],
      chu: h.textContent.trim().replace(/\s+/g, " ").slice(0, 40),
      co: Math.round(parseFloat(getComputedStyle(h).fontSize)),
    }));
  const loiHeading = [];
  if (heading.filter((h) => h.bac === 1).length !== 1) {
    loiHeading.push(`có ${heading.filter((h) => h.bac === 1).length} thẻ h1`);
  }
  for (let i = 1; i < heading.length; i++) {
    if (heading[i].bac - heading[i - 1].bac > 1) {
      loiHeading.push(`nhảy h${heading[i - 1].bac}→h${heading[i].bac}: "${heading[i].chu}"`);
    }
  }

  // ---- 4. ảnh thiếu alt ----------------------------------------------------
  const anhThieuAlt = [...document.querySelectorAll("img")]
    .filter((i) => hienRa(i) && !i.alt && i.getAttribute("aria-hidden") !== "true")
    .map((i) => (i.currentSrc || i.src).split("/").pop()?.slice(0, 50));

  // ---- 5. điểm chạm quá nhỏ (chỉ có nghĩa ở khổ điện thoại) ----------------
  const chamNho = [];
  for (const el of document.querySelectorAll("a,button,[role=button],input,select")) {
    if (!hienRa(el)) continue;
    // Bỏ qua phần tử chỉ dành cho trình đọc màn hình. Liên kết "bỏ qua tới nội
    // dung chính" nằm ở 1×1px khi chưa nhận tiêu điểm — ĐÚNG thiết kế, nó chỉ
    // bung ra thành nút 44px khi người dùng bấm Tab tới. Không loại trừ thì nó
    // bị đếm là lỗi trên mọi trang, che mất các điểm chạm nhỏ thật.
    if (el.closest(".sr-only")) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 40) {
      chamNho.push({
        the: el.tagName.toLowerCase(),
        chu: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 26),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    }
  }

  // ---- 6. mật độ nội dung --------------------------------------------------
  const mang = [...document.querySelectorAll("main > *, main section")].filter(hienRa);
  const caoTrang = de.scrollHeight;

  // ---- 7. thang chữ đang dùng thật ----------------------------------------
  const thangChu = {};
  for (const el of document.querySelectorAll("body *")) {
    if (!hienRa(el)) continue;
    const co = Math.round(parseFloat(getComputedStyle(el).fontSize));
    thangChu[co] = (thangChu[co] ?? 0) + 1;
  }

  return {
    tranNgang,
    thuPhamTran: thuPhamTran.slice(0, 6),
    loiTuongPhan: loiTuongPhan.slice(0, 12),
    soLoiTuongPhan: loiTuongPhan.length,
    doDaiDongTB: doDaiDong.length
      ? Math.round(doDaiDong.reduce((a, b) => a + b, 0) / doDaiDong.length)
      : null,
    doDaiDongMax: doDaiDong.length ? Math.max(...doDaiDong) : null,
    coChuNhoNhat: coNhoNhat === 999 ? null : +coNhoNhat.toFixed(1),
    heading,
    loiHeading,
    anhThieuAlt,
    chamNho: chamNho.slice(0, 10),
    soChamNho: chamNho.length,
    caoTrang,
    soManHinh: +(caoTrang / window.innerHeight).toFixed(1),
    soMang: mang.length,
    caoTrungBinhMoiMang: mang.length ? Math.round(caoTrang / mang.length) : null,
    tyLeChuTrenTrang: +(
      tongDienTichChu /
      (de.clientWidth * caoTrang)
    ).toFixed(3),
    thangChu: Object.entries(thangChu)
      .map(([co, n]) => [+co, n])
      .sort((a, b) => b[0] - a[0])
      .slice(0, 14),
  };
}

/** Cuộn hết trang để ảnh tải lười và hiệu ứng cuộn kịp chạy, rồi về đầu. */
async function cuonHetTrang(page) {
  await page.evaluate(async () => {
    const buoc = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += buoc) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
}

async function chay() {
  await mkdir(THU_MUC, { recursive: true });
  const trinh = await chromium.launch({ channel: "chrome" });
  const bao = [];

  for (const kho of KHO_MAN) {
    const ctx = await trinh.newContext({
      viewport: { width: kho.rong, height: kho.cao },
      deviceScaleFactor: 1,
      reducedMotion: "no-preference", // nếu không, mọi hiệu ứng bị tắt sạch
      locale: "vi-VN",
    });
    const page = await ctx.newPage();
    const loiConsole = [];
    page.on("console", (m) => {
      if (m.type() === "error") loiConsole.push(m.text().slice(0, 120));
    });
    page.on("pageerror", (e) => loiConsole.push(`pageerror: ${e.message.slice(0, 120)}`));

    for (const t of TRANG) {
      loiConsole.length = 0;
      const url = GOC + t.duong;
      try {
        await page.goto(url, { waitUntil: "load", timeout: 120000 });
      } catch (e) {
        bao.push({ trang: t.ten, kho: kho.ten, loi: String(e).slice(0, 120) });
        continue;
      }
      // Màn mở đầu che hết trang; chờ nó gỡ xong mới đo được gì.
      await page
        .waitForFunction(() => document.documentElement.dataset.preloaded === "true", {
          timeout: 20000,
        })
        .catch(() => {});
      await page.waitForTimeout(700);
      await cuonHetTrang(page);

      const so = await page.evaluate(doTrangDOM);
      bao.push({ trang: t.ten, kho: kho.ten, url, loiConsole: [...loiConsole], ...so });

      await page.screenshot({
        path: path.join(THU_MUC, `${t.ten}--${kho.ten}.png`),
        fullPage: true,
      });
      process.stdout.write(`✓ ${t.ten} @ ${kho.ten}\n`);
    }
    await ctx.close();
  }

  // ---- đối chiếu trang tham chiếu ------------------------------------------
  if (DOI_CHIEU) {
    for (const kho of KHO_MAN) {
      const ctx = await trinh.newContext({
        viewport: { width: kho.rong, height: kho.cao },
        locale: "vi-VN",
      });
      const page = await ctx.newPage();
      try {
        await page.goto("https://market.vinhomes.vn/", {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        await page.waitForTimeout(3500);
        await cuonHetTrang(page);
        const so = await page.evaluate(doTrangDOM);
        bao.push({ trang: "THAM-CHIEU-vinhomes", kho: kho.ten, ...so });
        await page.screenshot({
          path: path.join(THU_MUC, `THAM-CHIEU-vinhomes--${kho.ten}.png`),
          fullPage: true,
        });
        process.stdout.write(`✓ market.vinhomes.vn @ ${kho.ten}\n`);
      } catch (e) {
        process.stdout.write(`✗ market.vinhomes.vn @ ${kho.ten}: ${String(e).slice(0, 90)}\n`);
      }
      await ctx.close();
    }
  }

  await trinh.close();
  await writeFile(path.join(THU_MUC, "bao-cao.json"), JSON.stringify(bao, null, 2), "utf8");
  process.stdout.write(`\nBáo cáo: ${path.join(THU_MUC, "bao-cao.json")}\n`);
}

chay().catch((e) => {
  console.error(e);
  process.exit(1);
});
