// Audit sâu — bốn mặt mà audit bố cục không chạm tới:
//
//   1. HIỆU NĂNG   — cỡ gói tải về, thời điểm ảnh/chữ lớn nhất hiện ra, độ giật
//                     bố cục. PHẢI chạy trên bản build thật: bản `next dev`
//                     không nén và kèm cả bộ công cụ dev, đo ra số vô nghĩa.
//   2. SEO         — thẻ meta từng trang, dữ liệu có cấu trúc, ảnh khi dán link.
//   3. BÀN PHÍM    — đi hết trang bằng Tab, thứ tự tiêu điểm, nhãn.
//   4. LIÊN KẾT    — dò toàn bộ liên kết nội bộ tìm 404.
//
// Cách chạy:  npm run build && npx next start -p 3100
//             node scripts/audit-sau.mjs

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const GOC = process.env.AUDIT_URL ?? "http://localhost:3100";
const THU_MUC = path.join(process.cwd(), ".audit");

const TRANG = [
  "/",
  "/quy-hoach",
  "/tien-ich",
  "/bang-hang",
  "/du-an",
  "/vi-tri",
  "/lien-he",
  "/tai-lieu",
  "/tin-tuc",
  "/phan-khu/paradise-bay",
  "/san-pham/biet-thu-bien",
];

/* ========================================================================== */
/* 1. HIỆU NĂNG                                                               */
/* ========================================================================== */

/**
 * Gắn bộ theo dõi TRƯỚC khi trang chạy.
 *
 * LCP và CLS chỉ ghi nhận được nếu bộ quan sát đã có mặt từ đầu — gắn sau khi
 * tải xong thì hai số này luôn bằng 0, và số 0 đó trông y hệt "trang hoàn hảo".
 */
const THEO_DOI = `
window.__doDac = { lcp: 0, cls: 0, lcpLa: "" };
new PerformanceObserver((ds) => {
  for (const d of ds.getEntries()) {
    window.__doDac.lcp = d.startTime;
    window.__doDac.lcpLa = (d.element?.tagName || "") + " " + (d.url || "").split("/").pop();
  }
}).observe({ type: "largest-contentful-paint", buffered: true });
new PerformanceObserver((ds) => {
  for (const d of ds.getEntries()) {
    // Bỏ qua dịch chuyển do người dùng vừa bấm/gõ — đó là phản hồi, không phải giật.
    if (!d.hadRecentInput) window.__doDac.cls += d.value;
  }
}).observe({ type: "layout-shift", buffered: true });
`;

function doHieuNang() {
  const dieuHuong = performance.getEntriesByType("navigation")[0];
  const taiNguyen = performance.getEntriesByType("resource");

  const gom = (loai, loc) => {
    const nhom = taiNguyen.filter(loc);
    return {
      so: nhom.length,
      // `transferSize` là số byte THẬT đi qua dây, đã nén. `encodedBodySize`
      // là cỡ file gốc — dùng nhầm thì báo cáo phồng lên gấp ba.
      kb: Math.round(nhom.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
      loai,
    };
  };

  const nangNhat = [...taiNguyen]
    .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
    .slice(0, 5)
    .map((r) => ({
      ten: r.name.split("/").pop().slice(0, 46),
      kb: Math.round((r.transferSize || 0) / 1024),
    }));

  return {
    lcp: Math.round(window.__doDac?.lcp ?? 0),
    lcpLa: window.__doDac?.lcpLa ?? "",
    cls: +(window.__doDac?.cls ?? 0).toFixed(4),
    dcl: Math.round(dieuHuong?.domContentLoadedEventEnd ?? 0),
    taiXong: Math.round(dieuHuong?.loadEventEnd ?? 0),
    js: gom("js", (r) => r.name.endsWith(".js") || r.name.includes("/_next/static/chunks/")),
    css: gom("css", (r) => r.name.endsWith(".css")),
    anh: gom("anh", (r) => /\.(webp|avif|png|jpe?g|svg)/.test(r.name) || r.name.includes("/_next/image")),
    font: gom("font", (r) => /\.(woff2?|ttf)/.test(r.name)),
    tongKb: Math.round(taiNguyen.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
    nangNhat,
  };
}

/* ========================================================================== */
/* 2. SEO & CHIA SẺ LIÊN KẾT                                                  */
/* ========================================================================== */

function doSEO() {
  const lay = (chon, thuoc = "content") =>
    document.querySelector(chon)?.getAttribute(thuoc) ?? null;

  const coCauTruc = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => {
      try {
        const d = JSON.parse(s.textContent);
        // Ba dạng đều hợp lệ: một đối tượng, một mảng, hoặc một `@graph` gói
        // nhiều thực thể. Bản đầu của hàm này chỉ đọc `@type` ở cấp ngoài cùng
        // nên với dạng `@graph` nó trả về `undefined` — báo cáo hiện ra trống
        // trơn dù dữ liệu có đủ.
        const nut = Array.isArray(d) ? d : (d["@graph"] ?? [d]);
        return (Array.isArray(nut) ? nut : [nut])
          .map((x) => x?.["@type"])
          .filter(Boolean)
          .join(",");
      } catch {
        return "JSON HỎNG";
      }
    });

  const tieuDe = lay('meta[property="og:title"]') ?? document.title;
  const anhChiaSe = lay('meta[property="og:image"]');

  return {
    title: document.title,
    titleDai: document.title.length,
    moTa: lay('meta[name="description"]'),
    moTaDai: (lay('meta[name="description"]') ?? "").length,
    canonical: lay('link[rel="canonical"]', "href"),
    ogTitle: lay('meta[property="og:title"]'),
    ogMoTa: lay('meta[property="og:description"]'),
    ogAnh: anhChiaSe,
    ogLoai: lay('meta[property="og:type"]'),
    twitterCard: lay('meta[name="twitter:card"]'),
    robots: lay('meta[name="robots"]'),
    lang: document.documentElement.lang,
    coCauTruc,
    // Cảnh báo có thể hành động ngay, không phải điểm số mơ hồ.
    canhBao: [
      !document.title && "thiếu <title>",
      document.title.length > 65 && `title dài ${document.title.length} ký tự (>65 sẽ bị cắt)`,
      !lay('meta[name="description"]') && "thiếu mô tả",
      !anhChiaSe && "KHÔNG có og:image — dán link lên Zalo/Facebook ra ô trắng",
      !lay('link[rel="canonical"]', "href") && "thiếu canonical",
      coCauTruc.length === 0 && "không có dữ liệu có cấu trúc (schema.org)",
      !tieuDe && "thiếu tiêu đề chia sẻ",
    ].filter(Boolean),
  };
}

/* ========================================================================== */
/* 3. BÀN PHÍM & TRÌNH ĐỌC MÀN HÌNH                                           */
/* ========================================================================== */

function doTruyCap() {
  const hienRa = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    const s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none";
  };

  const dungDuoc = [...document.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )].filter(hienRa);

  const loi = [];

  // Nút/liên kết không có tên đọc được: trình đọc màn hình đọc ra "link" trống.
  //
  // CHỈ xét thẻ mang chữ bên trong. Ô nhập lấy tên từ thẻ `<label>` gắn ngoài
  // chứ không phải từ `textContent`, nên áp phép kiểm này lên chúng là báo lỗi
  // giả — đúng lỗi mà bản đầu của chính file này mắc phải, khiến biểu mẫu có
  // nhãn tử tế vẫn bị đếm là 9 lỗi. Ô nhập được kiểm riêng ở khối dưới.
  const CHO_XET_CHU = new Set(["A", "BUTTON"]);
  for (const el of dungDuoc) {
    if (!CHO_XET_CHU.has(el.tagName)) continue;
    const ten =
      (el.getAttribute("aria-label") || "").trim() ||
      (el.textContent || "").trim() ||
      (el.getAttribute("title") || "").trim() ||
      (el.querySelector("img")?.alt || "").trim();
    if (!ten && el.getAttribute("aria-hidden") !== "true") {
      loi.push({
        loai: "không có tên",
        the: el.tagName.toLowerCase(),
        lop: (el.className || "").toString().slice(0, 40),
      });
    }
  }

  // Ô nhập không gắn nhãn.
  for (const o of document.querySelectorAll("input, select, textarea")) {
    if (!hienRa(o) || o.type === "hidden") continue;
    const coNhan =
      o.labels?.length > 0 ||
      o.getAttribute("aria-label") ||
      o.getAttribute("aria-labelledby");
    if (!coNhan) {
      loi.push({ loai: "ô nhập thiếu nhãn", the: o.tagName.toLowerCase(), ten: o.name || o.id });
    }
  }

  // `tabindex` dương phá vỡ thứ tự tự nhiên của trang.
  for (const el of document.querySelectorAll("[tabindex]")) {
    if (+el.getAttribute("tabindex") > 0) {
      loi.push({ loai: "tabindex dương", the: el.tagName.toLowerCase() });
    }
  }

  const boQua = document.querySelector('a[href^="#"]');
  const coBoQua = Boolean(
    boQua && /bỏ qua|skip|nội dung chính/i.test(boQua.textContent || ""),
  );

  return {
    soDungDuoc: dungDuoc.length,
    loi: loi.slice(0, 12),
    soLoi: loi.length,
    coLienKetBoQua: coBoQua,
    coMain: Boolean(document.querySelector("main")),
    soLandmark: document.querySelectorAll("header, nav, main, footer, aside").length,
  };
}

/* ========================================================================== */

async function chay() {
  await mkdir(THU_MUC, { recursive: true });
  const trinh = await chromium.launch({ channel: "chrome" });
  const bao = [];

  // -------- lượt 1: hiệu năng + SEO + truy cập, từng trang một -------------
  for (const duong of TRANG) {
    const ctx = await trinh.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      locale: "vi-VN",
    });
    await ctx.addInitScript(THEO_DOI);
    const page = await ctx.newPage();

    const loiMang = [];
    page.on("response", (r) => {
      if (r.status() >= 400) loiMang.push(`${r.status()} ${r.url().slice(0, 90)}`);
    });

    try {
      await page.goto(GOC + duong, { waitUntil: "load", timeout: 45000 });
    } catch (e) {
      bao.push({ duong, loi: String(e).slice(0, 100) });
      await ctx.close();
      continue;
    }
    await page
      .waitForFunction(() => document.documentElement.dataset.preloaded === "true", {
        timeout: 20000,
      })
      .catch(() => {});
    await page.waitForTimeout(1500);

    const hieuNang = await page.evaluate(doHieuNang);
    const seo = await page.evaluate(doSEO);
    const truyCap = await page.evaluate(doTruyCap);

    // ---- đi bằng bàn phím: 25 lần Tab, xem tiêu điểm có nhìn thấy không ----
    const banPhim = [];
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const o = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return {
          the: el.tagName.toLowerCase(),
          chu: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 26),
          trongManHinh:
            r.top >= -2 && r.left >= -2 && r.bottom <= window.innerHeight + 2,
          coVienTieuDiem:
            s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0,
        };
      });
      if (o) banPhim.push(o);
    }

    bao.push({
      duong,
      hieuNang,
      seo,
      truyCap,
      banPhim: {
        so: banPhim.length,
        khongCoVien: banPhim.filter((b) => !b.coVienTieuDiem).length,
        ngoaiManHinh: banPhim.filter((b) => !b.trongManHinh).map((b) => b.chu),
      },
      loiMang,
    });
    process.stdout.write(
      `✓ ${duong.padEnd(28)} LCP ${String(hieuNang.lcp).padStart(5)}ms  CLS ${String(hieuNang.cls).padStart(6)}  JS ${String(hieuNang.js.kb).padStart(4)}KB\n`,
    );
    await ctx.close();
  }

  // -------- lượt 2: dò liên kết hỏng ---------------------------------------
  const ctx = await trinh.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const daGap = new Set();
  const hong = [];

  for (const duong of TRANG) {
    await page.goto(GOC + duong, { waitUntil: "domcontentloaded" }).catch(() => {});
    const lienKet = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")]
        .map((a) => a.getAttribute("href"))
        .filter((h) => h && !h.startsWith("#") && !h.startsWith("mailto:") && !h.startsWith("tel:")),
    );
    for (const h of lienKet) {
      if (daGap.has(h)) continue;
      daGap.add(h);
      if (/^https?:/.test(h)) continue; // liên kết ra ngoài: không tự dò, tránh gõ cửa bên thứ ba
      const kq = await page.request.get(GOC + h).catch(() => null);
      if (!kq || kq.status() >= 400) {
        hong.push({ tu: duong, toi: h, ma: kq?.status() ?? "không tới được" });
      }
    }
  }

  // Trang 404 có tử tế không?
  await page.goto(`${GOC}/duong-dan-khong-ton-tai-de-thu`, {
    waitUntil: "domcontentloaded",
  }).catch(() => {});
  const trang404 = await page.evaluate(() => ({
    coChu: document.body.innerText.trim().length > 40,
    coLienKetVe: [...document.querySelectorAll("a[href]")].some(
      (a) => a.getAttribute("href") === "/",
    ),
    chu: document.body.innerText.trim().slice(0, 80).replace(/\s+/g, " "),
  }));

  await ctx.close();
  await trinh.close();

  const ketQua = { trang: bao, lienKetHong: hong, soLienKetDaDo: daGap.size, trang404 };
  await writeFile(
    path.join(THU_MUC, "bao-cao-sau.json"),
    JSON.stringify(ketQua, null, 2),
    "utf8",
  );
  process.stdout.write(
    `\nLiên kết đã dò: ${daGap.size} · hỏng: ${hong.length}\nBáo cáo: .audit/bao-cao-sau.json\n`,
  );
}

chay().catch((e) => {
  console.error(e);
  process.exit(1);
});
