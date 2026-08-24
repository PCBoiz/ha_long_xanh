/**
 * Bộ đo dành riêng cho ĐIỆN THOẠI.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CẦN BỘ ĐO THỨ HAI, KHI `audit.mjs` ĐÃ ĐO KHỔ 390px VÀ BÁO SẠCH
 *
 * `audit.mjs` kiểm QUY TẮC: có tràn ngang không, chữ có nhỏ quá không, tương
 * phản có đủ không. Nó chạy trên máy phát triển, mạng nội bộ, CPU đầy đủ — nên
 * mọi trang đều "đạt" ở phần quan trọng nhất với khách đi điện thoại: THỜI GIAN
 * CHỜ. Một trang có thể sạch tuyệt đối theo mọi quy tắc bố cục mà vẫn mất tám
 * giây mới hiện chữ đầu tiên trên 4G, và khách đã đóng từ giây thứ ba.
 *
 * Bộ này đo bốn thứ mà bộ kia không đo được:
 *
 *   1. TỐC ĐỘ dưới mạng 4G thật — bóp băng thông và bóp luôn CPU, vì điện
 *      thoại tầm trung chậm hơn máy làm việc khoảng bốn lần. Không bóp CPU thì
 *      số đo đẹp một cách vô nghĩa.
 *   2. KHỔ NHỎ 320px và 360px. Máy Android phổ thông ở Việt Nam phần lớn là
 *      360px; iPhone SE là 320px. Bố cục vỡ ở đây trước khi vỡ ở 390px.
 *   3. SAFARI (nhân WebKit). Chrome và Safari khác nhau ở đúng những chỗ hay
 *      hỏng: chiều cao màn hình khi thanh địa chỉ co lại, vùng an toàn quanh
 *      tai thỏ, và cách xử lý `position: sticky`.
 *   4. THAO TÁC CHẠM — khoảng cách giữa các nút, bàn phím hiện đúng loại khi
 *      gõ số điện thoại, và thanh CTA dính đáy có che mất nội dung không.
 *
 * Cách chạy:
 *   node scripts/audit-dien-thoai.mjs            (mặc định http://localhost:3000)
 *   AUDIT_URL=http://localhost:3211 node scripts/audit-dien-thoai.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { chromium, webkit } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { TRANG, TRANG_TOC_DO, TRANG_NGANG } from "./trang-do.mjs";

const GOC = process.env.AUDIT_URL ?? "http://localhost:3000";
const THU_MUC = path.join(process.cwd(), ".audit-dt");

/** Khổ máy. 320 và 360 là hai khổ chưa từng được đo. */
const KHO = [
  { ten: "320", rong: 320, cao: 568 }, // iPhone SE
  { ten: "360", rong: 360, cao: 800 }, // Android phổ thông
  { ten: "390", rong: 390, cao: 844 }, // iPhone 14/15
];

const KHO_NGANG = { ten: "ngang", rong: 844, cao: 390 };

/**
 * Mạng 4G chậm — đúng bộ số Lighthouse dùng cho hạng mục "Slow 4G".
 *
 * Không tự nghĩ ra số: dùng bộ chuẩn thì số đo so sánh được với mọi báo cáo
 * khác, kể cả báo cáo do bên thứ ba chạy sau này.
 */
const MANG_4G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1,6 Mbps
  uploadThroughput: (750 * 1024) / 8, // 750 Kbps
  latency: 150, // ms
};

/** Điện thoại tầm trung chậm hơn máy làm việc khoảng bốn lần. */
const BOP_CPU = 4;

const bao = { boCuc: [], tocDo: [], chamVaBieuMau: [], ngang: [] };

function ghi(dong) {
  process.stdout.write(dong + "\n");
}

/**
 * Mở một trang rồi đợi nó lắng — có thử lại.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ ĐỪNG QUAY LẠI DÙNG `waitUntil: "networkidle"` Ở ĐÂY.
 *
 * Bản đầu dùng nó, và hỏng theo cách rất dễ hiểu nhầm: Chromium trả về
 * `ERR_INSUFFICIENT_RESOURCES` rồi `ERR_ABORTED` trên hàng loạt trang, trong
 * khi máy chủ vẫn khoẻ và im lặng tuyệt đối trong nhật ký.
 *
 * Nguyên nhân không nằm ở máy chủ. `networkidle` đợi tới khi MỌI yêu cầu xong,
 * mà đo ở ba khổ máy khác nhau nghĩa là ba bộ ảnh có bề rộng khác nhau, và
 * Next phải nén lại từng cỡ ngay lúc được hỏi. Cộng với vòng cuộn hết trang
 * kích hoạt toàn bộ ảnh tải chậm cùng lúc, Chromium chạm trần số kết nối đang
 * chờ và tự huỷ.
 *
 * Cách đúng: mở tới khi có DOM, rồi đợi mạng lắng NHƯNG CÓ HẠN GIỜ và không
 * coi việc hết giờ là lỗi. Với bộ đo bố cục, ảnh cuối cùng tải xong hay chưa
 * không đổi kết quả — bố cục đã ổn định từ lúc kích thước ảnh được đặt chỗ.
 *
 * Tỉ lệ điểm ảnh cũng hạ từ 3 xuống 2 vì cùng lý do: 3× khiến mỗi khổ máy hỏi
 * một bề rộng ảnh riêng (960 / 1080 / 1170), nhân ba lượng ảnh phải nén mà
 * không đổi một pixel nào trong phép đo bố cục.
 * ═══════════════════════════════════════════════════════════════════════════
 */
async function moTrang(page, url, lan = 0) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    return true;
  } catch (e) {
    if (lan < 1) {
      // Cho trình duyệt vài giây thu hồi kết nối rồi thử lại đúng một lần.
      await page.waitForTimeout(3000);
      return moTrang(page, url, lan + 1);
    }
    throw e;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ĐO BỐ CỤC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Những phép đo chạy TRONG trình duyệt.
 *
 * Gom vào một hàm thay vì gọi `page.evaluate` nhiều lần: mỗi lượt gọi là một
 * vòng trao đổi qua giao thức điều khiển, và khi nhân với 19 trang × 4 khổ ×
 * 2 trình duyệt thì phần trao đổi đó chiếm nhiều thời gian hơn cả phép đo.
 */
function doTrongTrang() {
  const CHAM = "a, button, input, select, textarea, summary, [role=button]";

  const hienRa = (e) => {
    const o = e.getBoundingClientRect();
    if (o.width === 0 || o.height === 0) return false;
    // Liên kết "Bỏ qua, tới nội dung chính" cố ý rộng 1×1px cho tới khi được
    // chọn bằng bàn phím. Nó CÓ MẶT Ở CẢ MƯỜI CHÍN TRANG, nên nếu tính là điểm
    // chạm nhỏ thì mọi trang đều dính một lỗi giả — và cột "chạm nhỏ" mất sạch
    // giá trị vì không bao giờ về 0 được.
    if (o.width <= 2 && o.height <= 2) return false;
    const k = getComputedStyle(e);
    return k.visibility !== "hidden" && k.display !== "none" && k.opacity !== "0";
  };

  // ── Tràn ngang ────────────────────────────────────────────────────────
  const rongKhung = document.documentElement.clientWidth;
  const thuPham = [];
  for (const e of document.querySelectorAll("body *")) {
    const o = e.getBoundingClientRect();
    if (o.width === 0) continue;
    // Bỏ qua phần tử được CỐ Ý cho cuộn ngang bên trong (bảng, sơ đồ). Chúng
    // có `overflow-x: auto` nên nội dung rộng hơn khung là đúng thiết kế —
    // cái sai là khi chính THÂN TRANG cuộn ngang.
    let choPhep = false;
    for (let t = e.parentElement; t; t = t.parentElement) {
      const k = getComputedStyle(t);
      if (k.overflowX === "auto" || k.overflowX === "scroll" || k.overflowX === "hidden") {
        choPhep = true;
        break;
      }
    }
    if (choPhep) continue;
    if (o.right > rongKhung + 1 || o.left < -1) {
      thuPham.push({
        the: e.tagName.toLowerCase(),
        lop: (e.className || "").toString().slice(0, 60),
        phai: Math.round(o.right),
        trai: Math.round(o.left),
      });
    }
  }

  // ── Điểm chạm ─────────────────────────────────────────────────────────
  //
  // ⚠️ LIÊN KẾT NẰM GIỮA CÂU VĂN KHÔNG PHẢI ĐIỂM CHẠM CẦN 44px.
  //
  // WCAG 2.5.8 có ngoại lệ rõ ràng cho chúng, vì một lý do hiển nhiên: một chữ
  // nằm trong đoạn văn không thể cao 44px mà không phá vỡ dòng chữ quanh nó.
  //
  // Bản đầu của bộ đo này thiếu ngoại lệ đó và báo 17 "điểm chạm nhỏ" ở riêng
  // trang chủ — trong khi bộ đo cũ báo 0. Chênh lệch ấy không đến từ việc trang
  // hỏng ở khổ nhỏ, mà từ phép đếm sai. Và một bộ đo báo 17 lỗi giả là bộ đo bị
  // bỏ qua ngay từ lần chạy thứ hai — hỏng nguy hiểm hơn là không đo gì cả.
  //
  // Nhận diện: thẻ chạy theo dòng (display: inline) và nằm trong một khối chữ.
  // Nút, mục điều hướng, ô biểu mẫu đều KHÔNG rơi vào đây vì chúng là
  // inline-block, flex hoặc block.
  const trongCau = (e) => {
    if (e.tagName !== "A") return false;
    if (getComputedStyle(e).display !== "inline") return false;
    return !!e.closest("p, li, td, th, blockquote, figcaption, dd, dt");
  };

  const diem = [];
  for (const e of document.querySelectorAll(CHAM)) {
    if (!hienRa(e)) continue;
    if (trongCau(e)) continue;
    const o = e.getBoundingClientRect();
    diem.push({
      chu: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 40),
      rong: Math.round(o.width),
      cao: Math.round(o.height),
      x: o.left,
      y: o.top + window.scrollY,
      x2: o.right,
      y2: o.bottom + window.scrollY,
    });
  }
  const chamNho = diem.filter((d) => d.rong < 44 || d.cao < 44);

  // ── Khoảng cách giữa hai điểm chạm ───────────────────────────────────
  //
  // ⚠️ CHỈ TÍNH KHI ÍT NHẤT MỘT TRONG HAI LÀ ĐIỂM CHẠM NHỎ.
  //
  // Bản đầu tính mọi cặp cách nhau dưới 8px, và cho ra đúng con số 21 ở gần như
  // toàn bộ mười chín trang. Một con số giống hệt nhau trên mọi trang không bao
  // giờ là lỗi của từng trang — nó là chân trang và thanh điều hướng, nơi các
  // mục xếp chồng lên nhau sát nhau theo đúng thiết kế.
  //
  // Hai mục cao 48px nằm sát nhau thì không ai bấm nhầm: ngón tay trượt lệch
  // vài pixel vẫn rơi vào đúng mục mình nhắm. Rủi ro bấm nhầm chỉ xuất hiện khi
  // đích NHỎ — lúc đó vài pixel lệch là sang hẳn mục khác. WCAG 2.5.8 cũng đặt
  // ngưỡng theo đúng logic đó: quy định về khoảng cách chỉ áp cho đích dưới cỡ
  // tối thiểu.
  //
  // Giữ nguyên phép đếm cũ thì mỗi lần chạy đều có 21 cảnh báo không sửa được,
  // và cảnh báo không sửa được thì chẳng khác gì không có cảnh báo.
  const nho = (d) => d.rong < 44 || d.cao < 44;
  const satNhau = [];
  for (let i = 0; i < diem.length; i++) {
    for (let j = i + 1; j < diem.length; j++) {
      const a = diem[i];
      const b = diem[j];
      if (!nho(a) && !nho(b)) continue;
      // Lồng nhau (một thẻ a bọc một button) thì không tính.
      const long =
        (a.x <= b.x && a.x2 >= b.x2 && a.y <= b.y && a.y2 >= b.y2) ||
        (b.x <= a.x && b.x2 >= a.x2 && b.y <= a.y && b.y2 >= a.y2);
      if (long) continue;
      const cachNgang = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x2, b.x2));
      const cachDoc = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y2, b.y2));
      const chongNhau = cachNgang === 0 && cachDoc === 0;
      const cach = Math.hypot(cachNgang, cachDoc);
      if (chongNhau || cach < 8) {
        satNhau.push({ a: a.chu, b: b.chu, cach: Math.round(cach) });
      }
    }
  }

  // ── Cỡ chữ ────────────────────────────────────────────────────────────
  let nhoNhat = 99;
  const chuNho = [];
  for (const e of document.querySelectorAll("p, span, li, a, td, th, label, div")) {
    if (!e.childElementCount && e.textContent.trim().length > 3) {
      const c = parseFloat(getComputedStyle(e).fontSize);
      if (c < nhoNhat) nhoNhat = c;
      if (c < 12) chuNho.push({ co: c, chu: e.textContent.trim().slice(0, 40) });
    }
  }

  // ── Thanh dính đáy có che nội dung không ─────────────────────────────
  //
  // Thanh CTA `position: fixed` nằm đè lên trang. Nếu phần cuối trang không
  // chừa chỗ, dòng chữ cuối cùng hoặc nút cuối cùng nằm VĨNH VIỄN dưới thanh —
  // cuộn hết cỡ vẫn không đọc được, vì thanh đi theo màn hình.
  let thanhDinh = null;
  for (const e of document.querySelectorAll("body *")) {
    const k = getComputedStyle(e);
    if (k.position !== "fixed") continue;
    const o = e.getBoundingClientRect();
    if (o.height === 0 || o.width < rongKhung * 0.6) continue;
    if (o.bottom > window.innerHeight - 4 && o.top > window.innerHeight / 2) {
      thanhDinh = { cao: Math.round(o.height), dinh: Math.round(o.top) };
    }
  }

  return {
    rongThan: document.documentElement.scrollWidth,
    rongKhung,
    tranNgang: Math.max(0, document.documentElement.scrollWidth - rongKhung),
    thuPhamTran: thuPham.slice(0, 6),
    soChamNho: chamNho.length,
    chamNho: chamNho.slice(0, 6),
    soSatNhau: satNhau.length,
    satNhau: satNhau.slice(0, 6),
    coChuNhoNhat: Math.round(nhoNhat * 10) / 10,
    chuNho: chuNho.slice(0, 4),
    thanhDinh,
    caoTrang: document.documentElement.scrollHeight,
  };
}

async function doBoCuc(trinh, tenTrinh, kho, danhSach, vaoBao) {
  const ctx = await trinh.newContext({
    viewport: { width: kho.rong, height: kho.cao },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();

  // Gắn bộ nghe MỘT LẦN, ngoài vòng lặp. Gắn bên trong thì mỗi trang thêm một
  // bộ nghe nữa, và tới trang thứ mười chín có mười chín bộ cùng chạy — Node
  // sẽ cảnh báo rò rỉ, còn lỗi của trang trước thì ghi vào mảng đã bỏ đi.
  let loiConsole = [];
  page.on("pageerror", (e) => loiConsole.push(String(e).slice(0, 160)));

  for (const t of danhSach) {
    loiConsole = [];
    try {
      await moTrang(page, GOC + t.duong);
      // Cuộn hết trang để mọi ảnh tải chậm hiện ra rồi mới đo — không cuộn thì
      // phần dưới trang chưa dựng, và mọi lỗi nằm dưới màn hình đầu đều lọt.
      await page.evaluate(async () => {
        const buoc = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += buoc) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 250));
      });
      const so = await page.evaluate(doTrongTrang);
      vaoBao.push({ trang: t.ten, trinh: tenTrinh, kho: kho.ten, ...so, loiConsole });
      const co =
        so.tranNgang > 0 || so.soChamNho > 0 || so.soSatNhau > 0 || so.chuNho.length > 0;
      ghi(`${co ? "!" : "✓"} ${t.ten} @ ${tenTrinh}/${kho.ten}` +
        (co ? `  tràn:${so.tranNgang} chạm nhỏ:${so.soChamNho} sát nhau:${so.soSatNhau} chữ nhỏ:${so.chuNho.length}` : ""));
    } catch (e) {
      vaoBao.push({ trang: t.ten, trinh: tenTrinh, kho: kho.ten, loi: String(e).slice(0, 140) });
      ghi(`✗ ${t.ten} @ ${tenTrinh}/${kho.ten} — ${String(e).slice(0, 80)}`);
    }
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// ĐO TỐC ĐỘ
// ═══════════════════════════════════════════════════════════════════════════

async function doTocDo(trinh, danhSach) {
  for (const t of danhSach) {
    const ctx = await trinh.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });

    // Ghi lại số byte thật sự tải về. `request.sizes()` trả số byte ĐÃ NÉN,
    // tức là đúng thứ đi qua sóng, không phải kích thước sau khi giải nén.
    let byte = 0;
    let byteAnh = 0;
    let byteJs = 0;
    let soYeuCau = 0;
    ctx.on("requestfinished", async (r) => {
      soYeuCau++;
      try {
        const s = await r.sizes();
        const n = (s.responseBodySize || 0) + (s.responseHeadersSize || 0);
        byte += n;
        const kieu = r.resourceType();
        if (kieu === "image") byteAnh += n;
        if (kieu === "script") byteJs += n;
      } catch {
        /* yêu cầu bị huỷ giữa chừng — không tính */
      }
    });

    const page = await ctx.newPage();
    await page.addInitScript(() => {
      window.__lcp = 0;
      window.__cls = 0;
      try {
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) window.__lcp = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      } catch {
        /* trình duyệt không hỗ trợ — bỏ qua, phần tốc độ chỉ chạy trên Chromium */
      }
    });

    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", MANG_4G);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: BOP_CPU });

    try {
      const batDau = Date.now();
      await page.goto(GOC + t.duong, { waitUntil: "load", timeout: 120000 });
      const tai = Date.now() - batDau;
      // Đợi thêm để LCP chốt lại — ảnh lớn có thể tới sau sự kiện `load`.
      await page.waitForTimeout(2500);
      const so = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0] || {};
        const veDau = performance.getEntriesByName("first-contentful-paint")[0];
        return {
          lcp: Math.round(window.__lcp),
          cls: Math.round((window.__cls || 0) * 1000) / 1000,
          fcp: veDau ? Math.round(veDau.startTime) : null,
          ttfb: Math.round(nav.responseStart || 0),
          domXong: Math.round(nav.domContentLoadedEventEnd || 0),
        };
      });
      bao.tocDo.push({
        trang: t.ten,
        ...so,
        taiMs: tai,
        kb: Math.round(byte / 1024),
        kbAnh: Math.round(byteAnh / 1024),
        kbJs: Math.round(byteJs / 1024),
        soYeuCau,
      });
      ghi(
        `⏱ ${t.ten}  LCP ${(so.lcp / 1000).toFixed(1)}s  FCP ${((so.fcp ?? 0) / 1000).toFixed(1)}s  CLS ${so.cls}  ${Math.round(byte / 1024)}KB (ảnh ${Math.round(byteAnh / 1024)} · js ${Math.round(byteJs / 1024)})`,
      );
    } catch (e) {
      bao.tocDo.push({ trang: t.ten, loi: String(e).slice(0, 140) });
      ghi(`✗ tốc độ ${t.ten} — ${String(e).slice(0, 80)}`);
    }
    await ctx.close();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// BIỂU MẪU VÀ THAO TÁC CHẠM
// ═══════════════════════════════════════════════════════════════════════════

async function doBieuMau(trinh) {
  const ctx = await trinh.newContext({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();

  for (const ten of ["lien-he", "gia-thuc-tra", "quy-can"]) {
    const t = TRANG.find((x) => x.ten === ten);
    if (!t) continue;
    try {
      await moTrang(page, GOC + t.duong);
      const so = await page.evaluate(() => {
        const o = [];
        for (const e of document.querySelectorAll("input, textarea, select")) {
          const nhan =
            document.querySelector(`label[for="${e.id}"]`)?.textContent?.trim() ?? "";
          o.push({
            ten: e.getAttribute("name") ?? e.id ?? "(không tên)",
            nhan: nhan.slice(0, 40),
            kieu: e.getAttribute("type") ?? e.tagName.toLowerCase(),
            cheDoNhap: e.getAttribute("inputmode"),
            tuDien: e.getAttribute("autocomplete"),
            cao: Math.round(e.getBoundingClientRect().height),
            coNhan: nhan.length > 0 || !!e.getAttribute("aria-label"),
          });
        }
        return o;
      });
      bao.chamVaBieuMau.push({ trang: ten, o: so });
      ghi(`⌨ ${ten} — ${so.length} ô nhập`);
    } catch (e) {
      ghi(`✗ biểu mẫu ${ten} — ${String(e).slice(0, 70)}`);
    }
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// ẢNH CHỤP ĐỂ RÀ BẰNG MẮT
// ═══════════════════════════════════════════════════════════════════════════

async function chupAnh(trinh) {
  const ctx = await trinh.newContext({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  for (const t of TRANG) {
    try {
      await moTrang(page, GOC + t.duong);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 300));
      });
      await page.screenshot({
        path: path.join(THU_MUC, `${t.ten}--360.png`),
        fullPage: true,
      });
      ghi(`📷 ${t.ten}`);
    } catch (e) {
      ghi(`✗ ảnh ${t.ten} — ${String(e).slice(0, 70)}`);
    }
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════

// Chạy riêng phần tốc độ: node scripts/audit-dien-thoai.mjs --chi-toc-do
//
// ⚠️ SỐ ĐO TỐC ĐỘ CHỈ ĐÚNG KHI MÁY KHÔNG LÀM VIỆC GÌ KHÁC. Đo trong lúc còn
// một trình duyệt khác đang chạy cho ra số cao hơn thực tế — đã gặp: cùng một
// trang ra 3,7s ở lượt sạch và 4,1s ở lượt có việc chạy song song. Chênh lệch
// đó đủ để đẩy một trang từ nhóm "cần cải thiện" sang nhóm "kém", tức là đủ
// để dẫn tới một quyết định sai.
const CHI_TOC_DO = process.argv.includes("--chi-toc-do");

async function main() {
  await mkdir(THU_MUC, { recursive: true });
  if (CHI_TOC_DO) {
    const cr2 = await chromium.launch();
    ghi("── TỐC ĐỘ trên 4G chậm, CPU bóp 4 lần ──");
    await doTocDo(cr2, TRANG.filter((t) => TRANG_TOC_DO.includes(t.ten)));
    await cr2.close();
    await writeFile(
      path.join(THU_MUC, "toc-do.json"),
      JSON.stringify(bao.tocDo, null, 1),
      "utf8",
    );
    ghi("Báo cáo tốc độ: " + path.join(THU_MUC, "toc-do.json"));
    return;
  }
  const cr = await chromium.launch();
  const wk = await webkit.launch();

  ghi("── BỐ CỤC · Chrome ──");
  for (const kho of KHO) await doBoCuc(cr, "chrome", kho, TRANG, bao.boCuc);

  ghi("── BỐ CỤC · Safari (WebKit) ──");
  await doBoCuc(wk, "safari", KHO[2], TRANG, bao.boCuc);
  await doBoCuc(wk, "safari", KHO[0], TRANG, bao.boCuc);

  ghi("── XOAY NGANG ──");
  const dsNgang = TRANG.filter((t) => TRANG_NGANG.includes(t.ten));
  await doBoCuc(cr, "chrome", KHO_NGANG, dsNgang, bao.ngang);

  ghi("── BIỂU MẪU ──");
  await doBieuMau(cr);

  ghi("── TỐC ĐỘ trên 4G chậm, CPU bóp 4 lần ──");
  await doTocDo(cr, TRANG.filter((t) => TRANG_TOC_DO.includes(t.ten)));

  ghi("── ẢNH CHỤP khổ 360 ──");
  await chupAnh(cr);

  await cr.close();
  await wk.close();

  await writeFile(
    path.join(THU_MUC, "bao-cao.json"),
    JSON.stringify(bao, null, 1),
    "utf8",
  );
  ghi(`\nBáo cáo: ${path.join(THU_MUC, "bao-cao.json")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
