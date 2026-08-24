// Đọc file bảng hàng Excel của chủ đầu tư → sinh bản TÓM TẮT AN TOÀN cho trang.
//
// Cách chạy:
//   node scripts/doc-bang-hang.mjs "đường/dẫn/tới/BẢNG HÀNG.xlsx"
//   node scripts/doc-bang-hang.mjs "…xlsx" --day-du     (xem đủ, KHÔNG để đăng)
//
// ═══════════════════════════════════════════════════════════════════════════
// PHẠM VI CÔNG BỐ — chủ trang đã quyết, ghi lại để không ai sửa nhầm
//
// Bảng hàng này ĐƯỢC PHÉP công khai đầy đủ: mã căn, diện tích, tiêu chuẩn bàn
// giao, giá trước VAT và giá gồm VAT + phí bảo trì.
//
// ĐÂY LÀ QUYẾT ĐỊNH THƯƠNG MẠI, KHÔNG PHẢI SƠ SUẤT. Lý do đằng sau nó:
//
// Đo trên các trang đại lý khác cùng bán dự án này, mức giá đang lan truyền
// cho riêng dòng liền kề trải từ 3,8 tỷ tới 9,9 tỷ — chênh 2,6 lần. Và KHÔNG
// trang nào ghi con số của họ là trước thuế hay đã gồm thuế, trong khi chênh
// lệch giữa hai cách báo là khoảng 10% VAT cộng phí bảo trì.
//
// Nghĩa là người mua hiện KHÔNG CÓ CÁCH NÀO so sánh. Đăng bảng thật, ghi rõ
// nhãn từng cột, kèm dấu thời gian, là cách duy nhất giải quyết chuyện đó — và
// là thứ không trang nào đang làm.
//
// MỘT THỨ VẪN KHÔNG XUẤT RA: cột STK (loại hợp đồng và ngân hàng bảo lãnh của
// từng lô). Nó không giúp gì cho người mua ở bước tìm hiểu, mà lại là thông tin
// vận hành nội bộ giữa chủ đầu tư và ngân hàng.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import path from "node:path";

const duongDan = process.argv[2];
const dayDu = process.argv.includes("--day-du");

if (!duongDan) {
  console.error("Thiếu đường dẫn file. Ví dụ:");
  console.error('  node scripts/doc-bang-hang.mjs "D:/tai-lieu/BANG HANG.xlsx"');
  process.exit(1);
}

/* ─────────────────────────── Giải nén và đọc ────────────────────────────── */
/*
 * KHÔNG dùng thư viện đọc Excel, và KHÔNG gọi ra `tar`.
 *
 * File .xlsx là một tệp nén zip chứa vài file XML. Phần cần đọc chỉ là hai file
 * trong đó, và cấu trúc của chúng ổn định từ 2007 tới nay. Thêm một thư viện
 * đọc Excel là thêm vài trăm nghìn dòng mã của bên thứ ba chạy trên chính máy
 * chủ, chỉ để làm một việc mà vài chục dòng làm xong.
 *
 * ⚠️ BẢN ĐẦU GỌI RA `tar` VÀ ĐÃ HỎNG. Trên Windows, `tar` của Git Bash là GNU
 * tar, và nó hiểu `C:/Users/...` là "máy chủ tên C, đường dẫn /Users/..." rồi
 * báo `Cannot connect to C: resolve failed`. Bản `tar` của Windows lại không
 * có cờ để tắt hành vi đó. Nghĩa là kết quả phụ thuộc vào việc máy đang có bản
 * `tar` nào trên PATH — một thứ không kiểm soát được và sẽ hỏng ở máy chủ.
 *
 * Node có sẵn bộ giải nén DEFLATE. Đọc thẳng bằng nó thì không phụ thuộc gì
 * vào máy đang chạy, và cũng không phải ghi file tạm ra đĩa — quan trọng, vì
 * đây là tài liệu bán hàng nội bộ.
 */
function docZip(fileXlsx) {
  const b = readFileSync(fileXlsx);

  // Mục lục trung tâm nằm ở CUỐI file. Phải tìm ngược từ đuôi lên: phần chú
  // thích cuối tệp dài tuỳ ý nên không có vị trí cố định.
  let cuoi = -1;
  for (let i = b.length - 22; i >= 0 && i > b.length - 65558; i--) {
    if (b.readUInt32LE(i) === 0x06054b50) {
      cuoi = i;
      break;
    }
  }
  if (cuoi < 0) {
    throw new Error("Không phải file .xlsx hợp lệ (thiếu mục lục zip).");
  }

  const soMuc = b.readUInt16LE(cuoi + 10);
  let con = b.readUInt32LE(cuoi + 16);
  const kho = new Map();

  for (let n = 0; n < soMuc; n++) {
    if (b.readUInt32LE(con) !== 0x02014b50) break;

    const nen = b.readUInt16LE(con + 10);
    const coDai = b.readUInt32LE(con + 20);
    const daiTen = b.readUInt16LE(con + 28);
    const daiThem = b.readUInt16LE(con + 30);
    const daiChuThich = b.readUInt16LE(con + 32);
    const viTriCucBo = b.readUInt32LE(con + 42);
    const ten = b.toString("utf8", con + 46, con + 46 + daiTen);

    // Đầu mục CỤC BỘ có độ dài trường riêng, thường khác với mục lục trung
    // tâm — phải đọc lại ở đó chứ không dùng lại số phía trên.
    const daiTenCB = b.readUInt16LE(viTriCucBo + 26);
    const daiThemCB = b.readUInt16LE(viTriCucBo + 28);
    const batDau = viTriCucBo + 30 + daiTenCB + daiThemCB;
    const tho = b.subarray(batDau, batDau + coDai);

    // 0 = để nguyên, 8 = nén DEFLATE. Excel chỉ dùng hai kiểu này.
    kho.set(ten, nen === 8 ? inflateRawSync(tho) : tho);

    con += 46 + daiTen + daiThem + daiChuThich;
  }

  return kho;
}

function boThe(s) {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function docBang(kho) {
  // Bảng chuỗi dùng chung: Excel không lưu chữ thẳng vào ô mà lưu chỉ số trỏ
  // vào bảng này, để một chuỗi lặp nhiều lần chỉ tốn chỗ một lần.
  let chuoi = [];
  try {
    const ss = kho.get("xl/sharedStrings.xml").toString("utf8");
    chuoi = [...ss.matchAll(/<si>(.*?)<\/si>/gs)].map((m) =>
      boThe(
        [...m[1].matchAll(/<t[^>]*>(.*?)<\/t>/gs)].map((t) => t[1]).join(""),
      ),
    );
  } catch {
    // Không có bảng chuỗi là chuyện bình thường khi file toàn số.
  }

  const bang = kho.get("xl/worksheets/sheet1.xml");
  if (!bang) throw new Error("Không tìm thấy trang tính đầu tiên trong file.");
  const sheet = bang.toString("utf8");

  const hang = [...sheet.matchAll(/<row[^>]*>(.*?)<\/row>/gs)].map((h) => {
    const o = {};
    for (const c of h[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*)>(.*?)<\/c>/gs)) {
      const [, cot, thuoc, than] = c;
      const v = (than.match(/<v>(.*?)<\/v>/s) || [])[1];
      const chuThang = (than.match(/<is>.*?<t[^>]*>(.*?)<\/t>/s) || [])[1];
      if (v === undefined && chuThang === undefined) continue;
      o[cot] = thuoc.includes('t="s"') ? chuoi[Number(v)] : boThe(chuThang ?? v);
    }
    return o;
  });

  return hang;
}

/**
 * Tìm hàng tiêu đề và lập bản đồ tên cột → chữ cái cột.
 *
 * KHÔNG giả định tiêu đề nằm ở hàng 1. Bảng hàng thật thường có một hai dòng
 * tên công ty hoặc ngày cập nhật ở trên — cứng nhắc lấy hàng 1 là hỏng ngay ở
 * file thứ hai.
 */
function timTieuDe(hang) {
  const canCo = ["tiểu khu", "mã căn", "loại hình"];
  for (let i = 0; i < Math.min(hang.length, 10); i++) {
    const gia = Object.values(hang[i]).map((v) => String(v).toLowerCase());
    if (canCo.every((c) => gia.some((g) => g.includes(c)))) {
      const banDo = {};
      for (const [cot, ten] of Object.entries(hang[i])) {
        banDo[String(ten).trim().toLowerCase()] = cot;
      }
      return { chiSo: i, banDo };
    }
  }
  throw new Error(
    "Không tìm thấy hàng tiêu đề. Cần có các cột: Tiểu khu, Mã căn, Loại hình.",
  );
}

/**
 * Đọc số từ ô Excel. Trả 0 nếu không đọc được.
 *
 * ⚠️ HÀM NÀY TỪNG SAI, VÀ SAI RẤT KÍN. Ghi lại đầy đủ vì kiểu lỗi này sẽ quay
 * lại ở file bảng hàng tiếp theo.
 *
 * CÙNG MỘT CỘT trong cùng một file có thể chứa hai kiểu dữ liệu:
 *
 *     dòng 3   13224196526        ← ô số thật của Excel
 *     dòng 6   "13.393.560.669"   ← ô CHỮ, người nhập gõ tay kèm dấu chấm
 *
 * Bản đầu chỉ xử lý dấu chấm khi chuỗi CÓ dấu phẩy. Với "13.393.560.669" thì
 * không có phẩy nên chuỗi giữ nguyên, và `Number("13.393.560.669")` trả `NaN`
 * vì nhiều hơn một dấu chấm → hàm trả 0.
 *
 * Hệ quả: 28 trong 32 căn có giá bằng 0, và mọi khoảng giá tính ra từ đó đều
 * sai. Trang vẫn dựng, vẫn xanh mọi cổng kiểm, bảng vẫn hiện đủ 32 dòng — chỉ
 * có con số là sai. Đây là kiểu hỏng tệ nhất: không có gì báo lỗi cả.
 *
 * QUY TẮC BÂY GIỜ:
 *   · có dấu phẩy      → chấm là phân cách nghìn, phẩy là thập phân
 *   · từ hai dấu chấm  → tất cả đều là phân cách nghìn
 *   · đúng một dấu chấm và ĐÚNG BA chữ số sau nó → phân cách nghìn ("1.053")
 *   · còn lại          → dấu thập phân ("364.4")
 */
function soVN(gia) {
  if (gia === undefined || gia === null) return 0;
  const s = String(gia).trim();
  if (s === "" || s === "-") return 0;

  const sach = s.replace(/[^\d.,-]/g, "");
  if (sach === "") return 0;

  let chuan;
  if (sach.includes(",")) {
    chuan = sach.replace(/\./g, "").replace(",", ".");
  } else {
    const soDauCham = (sach.match(/\./g) ?? []).length;
    if (soDauCham >= 2) {
      chuan = sach.replace(/\./g, "");
    } else if (soDauCham === 1) {
      const sauCham = sach.split(".")[1] ?? "";
      chuan = sauCham.length === 3 ? sach.replace(".", "") : sach;
    } else {
      chuan = sach;
    }
  }

  const n = Number(chuan);
  return Number.isFinite(n) ? n : 0;
}

function gomNhom(dsach, lay) {
  const m = new Map();
  for (const r of dsach) {
    const k = lay(r);
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([ten, so]) => ({ ten, so }));
}

/* ─────────────────────────────── Chạy ───────────────────────────────────── */

const kho = docZip(duongDan);
const hang = docBang(kho);
let ketQua;
{
  const { chiSo, banDo } = timTieuDe(hang);

  const c = (ten) => banDo[ten];
  const can = hang
    .slice(chiSo + 1)
    .map((r) => {
      const dtDat = soVN(r[c("dt đất (m2)")]);
      const giaGomVat = soVN(r[c("giá gồm vat và kpbt")]);
      return {
        ma: String(r[c("mã căn")] ?? "").trim(),
        tieuKhu: String(r[c("tiểu khu")] ?? "").trim(),
        loaiHinh: String(r[c("loại hình")] ?? "").trim(),
        // Chuẩn hoá chữ hoa/thường: file thật có cả "Giãn xây" lẫn "giãn xây",
        // và nếu không gom lại thì bộ lọc trên trang hiện ra hai mục giống hệt.
        banGiao: String(r[c("tcbg")] ?? "").toLowerCase().trim(),
        dtDat,
        dtXd: soVN(r[c("dtxd (m2)")]),
        giaTruocVat: soVN(r[c("giá bán trước vat")]),
        vat: soVN(r[c("vat")]),
        kpbt: soVN(r[c("kpbt")]),
        giaGomVat,
        // Đơn giá trên mét vuông đất — con số DUY NHẤT so sánh ngang được giữa
        // hai căn khác diện tích. Đo trên file thật: liền kề trải 102–179
        // triệu/m², tức chênh 1,75 lần trong cùng một dòng sản phẩm. Không có
        // cột này thì người mua không có cách nào thấy điều đó.
        donGiaDat: dtDat > 0 ? Math.round(giaGomVat / dtDat) : 0,
      };
    })
    .filter((r) => r.ma);

  if (can.length === 0) throw new Error("Đọc được tiêu đề nhưng không có căn nào.");

  const khoang = (lay) => {
    const ra = {};
    for (const r of can) {
      const v = lay(r);
      if (!r.loaiHinh || !v) continue;
      (ra[r.loaiHinh] ??= []).push(v);
    }
    return Object.fromEntries(
      Object.entries(ra).map(([k, v]) => [
        k,
        { nhoNhat: Math.min(...v), lonNhat: Math.max(...v) },
      ]),
    );
  };

  ketQua = {
    /*
     * Dấu thời gian — thứ quan trọng nhất trong cả file kết quả.
     *
     * Trang KHÔNG tự ẩn giá khi số liệu cũ đi (quyết định của chủ trang). Nên
     * dấu này là thứ duy nhất nói cho người đọc biết họ đang xem số của lúc
     * nào, và nó phải hiện ngay cạnh bảng chứ không giấu ở chân trang.
     */
    docLuc: new Date().toISOString(),
    tongSoCan: can.length,
    theoTieuKhu: gomNhom(can, (r) => r.tieuKhu),
    theoLoaiHinh: gomNhom(can, (r) => r.loaiHinh),
    theoBanGiao: gomNhom(can, (r) => r.banGiao),
    dienTichDat: khoang((r) => r.dtDat),
    giaGomVat: khoang((r) => r.giaGomVat),
    giaTruocVat: khoang((r) => r.giaTruocVat),
    donGiaDat: khoang((r) => r.donGiaDat),
    can,
  };

  if (dayDu) {
    console.table(
      can.map((r) => ({
        ...r,
        giaTruocVat: (r.giaTruocVat / 1e9).toFixed(2),
        giaGomVat: (r.giaGomVat / 1e9).toFixed(2),
        donGiaDat: (r.donGiaDat / 1e6).toFixed(0),
      })),
    );
  }
}

mkdirSync(path.join(process.cwd(), "src/data"), { recursive: true });
const dichDen = path.join(process.cwd(), "src/data/quy-can.generated.json");
writeFileSync(dichDen, `${JSON.stringify(ketQua, null, 2)}\n`, "utf8");

console.log("\n✓ Đã đọc bảng hàng.\n");
console.log(`  Tổng số căn      ${ketQua.tongSoCan}`);
for (const t of ketQua.theoTieuKhu) console.log(`  ${String(t.so).padStart(3)}  ${t.ten}`);
console.log("");
for (const t of ketQua.theoLoaiHinh) {
  const d = ketQua.dienTichDat[t.ten];
  const dt = d ? `  ${d.nhoNhat}–${d.lonNhat} m²` : "";
  console.log(`  ${String(t.so).padStart(3)}  ${t.ten}${dt}`);
}
console.log("");
for (const t of ketQua.theoBanGiao) console.log(`  ${String(t.so).padStart(3)}  bàn giao ${t.ten}`);
console.log(`\n  Ghi ra: ${path.relative(process.cwd(), dichDen)}`);
console.log("  Gồm giá từng căn — xem phần PHẠM VI CÔNG BỐ ở đầu file.");
