// Gộp bảng hàng SỐNG từ nền tảng phân phối vào `quy-can.generated.json`.
//
//     node scripts/gop-bang-hang.mjs
//
// ═══════════════════════════════════════════════════════════════════════════
// VÌ SAO CÓ SCRIPT NÀY, BÊN CẠNH `doc-bang-hang.mjs`
//
// `doc-bang-hang.mjs` đọc file Excel chủ trang gửi tay. Nó cho ĐỦ cột giá —
// trước VAT, VAT, kinh phí bảo trì, sau VAT — nhưng chỉ có bấy nhiêu căn mà
// người gửi chọn đưa vào, và cũ đi từng ngày.
//
// Script này đọc bản kết xuất từ nền tảng phân phối. Nó cho SỐ CĂN THẬT đang
// mở bán, cập nhật theo ngày, nhưng CHỈ có một cột giá: giá đã gồm VAT và
// kinh phí bảo trì.
//
// Hai nguồn không thay thế được cho nhau. Nên gộp, và ghi rõ cái nào từ đâu.
//
// ĐỐI CHIẾU ĐÃ LÀM TRƯỚC KHI TIN NHAU (08/09/2026)
//
//   4 mã có ở cả hai bảng. Cả 4 khớp diện tích đất và diện tích xây tới từng
//   phần mười mét vuông. Đó là bằng chứng hai bảng cùng gốc dữ liệu, nên gộp
//   được mà không sợ ghép nhầm hai thứ khác nhau.
//
//   28 mã của bảng 15/08 KHÔNG còn trong bảng sống. Đây là dữ kiện thật về
//   tốc độ ra hàng, không phải lỗi dữ liệu — và nó được ghi lại ở `bienDong`.
//
// ⚠️ BA ĐIỀU KHÔNG ĐƯỢC LÀM Ở ĐÂY
//
// 1 · KHÔNG suy ra giá trước VAT. Nguồn sống không có cột đó. Thuế suất khác
//     nhau giữa phần đất và phần xây, nên chia ngược lại là BỊA. Ô nào không
//     có dữ liệu thì để `null`, và trang phải chịu được `null`.
//
// 2 · KHÔNG đưa mã nhóm quỹ ra ngoài. Nguồn có trường phân loại quỹ hàng
//     (độc quyền / thường). Đó là cơ chế thương mại nội bộ giữa các bên bán —
//     chủ trang đã chốt không công khai nhóm này.
//
// 3 · KHÔNG lấy căn đã bán. Bản kết xuất chỉ chứa căn còn hàng, và phải giữ
//     đúng như thế. Một bảng hàng có căn đã bán là một bảng hàng nói dối.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const NGUON = path.join(ROOT, ".data", "salepro-quy-can.json");
const DICH = path.join(ROOT, "src", "data", "quy-can.generated.json");

if (!existsSync(NGUON)) {
  console.error(`Thiếu bản kết xuất tại ${path.relative(ROOT, NGUON)}`);
  console.error("Xuất lại từ nền tảng phân phối rồi đặt vào đúng đường dẫn đó.");
  process.exit(1);
}

const cu = JSON.parse(readFileSync(DICH, "utf8"));
const song = JSON.parse(readFileSync(NGUON, "utf8")).duLieu;

/** "THIÊN ĐƯỜNG NHIỆT ĐỚI 1" → "Thiên Đường Nhiệt Đới 1" */
function hoaDauTu(cau) {
  return cau
    .toLocaleLowerCase("vi")
    .split(" ")
    .map((t) => (t ? t[0].toLocaleUpperCase("vi") + t.slice(1) : t))
    .join(" ");
}

/** "LIỀN KỀ XẺ KHE" → "Liền kề xẻ khe" — chỉ hoa chữ đầu cả cụm. */
function hoaChuDau(cau) {
  const t = cau.toLocaleLowerCase("vi");
  return t ? t[0].toLocaleUpperCase("vi") + t.slice(1) : t;
}

/**
 * Gom biến thể về đúng năm dòng sản phẩm mà trang đang nói.
 *
 * Nguồn sống tách rất mịn — "liền kề góc", "liền kề áp góc", "liền kề xẻ
 * khe", "song lập góc". Trang thì kể chuyện theo dòng sản phẩm. Giữ cả hai:
 * `loaiHinh` để đối chiếu với nội dung trang, `loaiChiTiet` để không mất thông
 * tin người mua thật sự quan tâm (căn góc đắt hơn căn giữa).
 */
function gomDong(chiTiet) {
  const t = chiTiet.toLocaleLowerCase("vi");
  if (t.startsWith("liền kề")) return "Liền kề";
  if (t.startsWith("song lập")) return "Song lập";
  if (t.startsWith("đơn lập")) return "Đơn lập";
  if (t.includes("biển") || t.includes("dinh thự")) return "Biệt thự biển";
  if (t.includes("căn hộ")) return "Căn hộ";
  return hoaChuDau(chiTiet);
}

const can = song
  .filter((x) => !x.is_not_show)
  .map((x) => ({
    ma: x.product_code,
    tieuKhu: hoaDauTu(x.row_name),
    loaiHinh: gomDong(x.apartment_type_name ?? ""),
    loaiChiTiet: hoaChuDau(x.apartment_type_name ?? ""),
    banGiao: (x.delivery_standard_name ?? "").toLocaleLowerCase("vi") || null,
    huong: x.base_direction_name ? hoaDauTu(x.base_direction_name) : null,
    dtDat: x.land_area ?? null,
    dtXd: x.construction_area ?? null,
    // Nguồn tự khai "Giá gồm VAT và KPBT" ở từng bản ghi — đã kiểm, mọi bản
    // ghi đều mang một trong hai biến thể của đúng câu đó.
    giaGomVat: Math.round(x.apartment_price),
    // Giá nếu thanh toán sớm theo chính sách chủ đầu tư. Đây là con số người
    // mua thật sự trả nếu chọn phương án đó, nên nó thuộc về "giá thực trả".
    giaThanhToanSom: x.early_payment_price
      ? Math.round(x.early_payment_price)
      : null,
    donGiaDat: x.price_per_meter ? Math.round(x.price_per_meter) : null,
    // Ba ô dưới đây CHỈ có ở bảng Excel. Nguồn sống không tách thuế.
    giaTruocVat: null,
    vat: null,
    kpbt: null,
  }))
  .sort((a, b) => a.ma.localeCompare(b.ma, "vi"));

/** Đếm theo một trường, bỏ ô trống, xếp nhiều trước. */
function dem(truong) {
  const bang = new Map();
  for (const c of can) {
    const v = c[truong];
    if (!v) continue;
    bang.set(v, (bang.get(v) ?? 0) + 1);
  }
  return [...bang]
    .map(([ten, so]) => ({ ten, so }))
    .sort((a, b) => b.so - a.so);
}

/**
 * Ngày theo GIỜ VIỆT NAM, không phải UTC.
 *
 * Mốc ngày của UTC rơi vào 07:00 sáng giờ ta. Nên hai lần chạy trong cùng một
 * NGÀY LÀM VIỆC — một lúc 06:00 và một lúc 08:00 — sẽ bị tính là hai ngày khác
 * nhau nếu so bằng UTC, và khối `bienDong` bị ghi đè bằng một phép so vô nghĩa.
 *
 * Ngược lại, một lần chạy 23:00 hôm trước và một lần 06:00 hôm sau lại bị coi
 * là cùng ngày. Cả hai chiều đều sai, và đều sai âm thầm.
 *
 * `sv-SE` là mẹo quen: đó là ngôn ngữ duy nhất trả về đúng dạng YYYY-MM-DD.
 */
function ngayVN(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

/** Nhỏ nhất / lớn nhất của một trường, gom theo dòng sản phẩm. */
function khoang(truong) {
  const ra = {};
  for (const c of can) {
    const v = c[truong];
    // ⚠️ BỎ QUA CẢ SỐ 0, khong chi null.
    //
    // Nguon co dung mot ban ghi ghi construction_area = 0 (can BM30-45, dat
    // 96 m2). Khong can nha nao xay 0 m2 — do la o trong duoc dien bang so 0
    // chu khong phai mot phep do.
    //
    // Bo loc cu chi chan null, nen con so 0 do keo can duoi cua ca dong lien
    // ke xuong 0, va trang hien "dien tich xay 0 - 412,2 m2". Mot khoang bat
    // dau tu 0 khong sai kieu du lieu, khong lam gay trang — no chi lam nguoi
    // doc thay mot con so vo nghia va thoi tin phan con lai cua bang.
    if (v === null || v === undefined || v === 0) continue;
    const o = (ra[c.loaiHinh] ??= { nhoNhat: v, lonNhat: v });
    if (v < o.nhoNhat) o.nhoNhat = v;
    if (v > o.lonNhat) o.lonNhat = v;
  }
  return ra;
}

// ── Biến động so với bảng Excel trước đó ──────────────────────────────────
//
// Đây là phần có giá trị nhất của việc giữ lại bảng cũ. Một bảng hàng cho biết
// HIỆN CÓ GÌ. Hai bảng cách nhau vài tuần cho biết HÀNG ĐI NHANH CỠ NÀO — và
// đó mới là câu người đang cân nhắc cần trả lời.
const maSong = new Set(can.map((c) => c.ma));
const conLai = cu.can.filter((c) => maSong.has(c.ma));
const daRoi = cu.can.filter((c) => !maSong.has(c.ma));

const doiGia = conLai
  .map((c) => {
    const moi = can.find((x) => x.ma === c.ma);
    return moi && c.giaGomVat ? moi.giaGomVat / c.giaGomVat - 1 : null;
  })
  .filter((x) => x !== null);

// Chênh giữa giá trước VAT và giá sau VAT — CHỈ đo được trên bảng Excel, vì
// chỉ nó có cả hai cột. Giữ lại kèm cỡ mẫu và ngày đo, đừng để ai tưởng con số
// này tính trên toàn bộ bảng hàng hiện tại.
const capCoDuHaiCot = cu.can.filter((c) => c.giaTruocVat && c.giaGomVat);
// ⚠️ ĐO ĐƯỢC MỘT LẦN THÌ GIỮ MÃI. ĐỪNG "DỌN" DÒNG NÀY.
//
// Con số này CHỈ đo được trên bảng Excel — bảng duy nhất từng có cả cột trước
// và sau thuế. Nguồn sống không tách thuế, nên mọi lần chạy sau lần đầu đều
// không còn cặp nào để đo.
//
// Bản đầu tính lại từ `cu.can` mỗi lần chạy. Hệ quả: lần chạy THỨ HAI so với
// chính đầu ra của lần đầu — nơi mọi `giaTruocVat` đã là `null` — nên
// `chenhVat` thành `null`, và trang giá hiện "0,0%" như một sự thật đo được.
//
// Sai kiểu này không làm gãy gì cả, không có cảnh báo nào, và con số 0,0% trông
// hoàn toàn bình thường. Đó là lý do phải giữ, không phải tính lại.
const chenhVat = capCoDuHaiCot.length
  ? {
      tiLe:
        capCoDuHaiCot.reduce((t, c) => t + (c.giaGomVat / c.giaTruocVat - 1), 0) /
        capCoDuHaiCot.length,
      soCan: capCoDuHaiCot.length,
      moc: cu.docLuc,
      ghiChu:
        "Đo trên bảng Excel trước đó — bảng duy nhất có đủ cả cột trước và sau thuế.",
    }
  : (cu.chenhVat ?? null);

const ra = {
  docLuc: new Date().toISOString(),
  nguon: "bảng hàng trực tuyến của nền tảng phân phối",
  tongSoCan: can.length,
  theoTieuKhu: dem("tieuKhu"),
  theoLoaiHinh: dem("loaiHinh"),
  theoLoaiChiTiet: dem("loaiChiTiet"),
  theoBanGiao: dem("banGiao"),
  dienTichDat: khoang("dtDat"),
  dienTichXd: khoang("dtXd"),
  giaGomVat: khoang("giaGomVat"),
  donGiaDat: khoang("donGiaDat"),
  // Giữ khoá để nơi đọc cũ không nổ; giá trị rỗng vì nguồn sống không tách thuế.
  giaTruocVat: {},
  chenhVat,
  // ⚠️ CHỈ CẬP NHẬT KHI MỐC TRƯỚC LÀ MỘT NGÀY KHÁC.
  //
  // Khối này trả lời câu "hàng đi nhanh cỡ nào", và nó chỉ có nghĩa khi so hai
  // bảng cách nhau vài ngày. Chạy lại script trong CÙNG MỘT NGÀY thì nó so hôm
  // nay với chính hôm nay và ra "0/616 căn đã rời bảng" — đúng về số học, vô
  // nghĩa về nội dung, và xoá mất kết quả thật của lần so trước.
  //
  // Đã xảy ra: bản so 15/08 (28/32 căn đã rời bảng) bị một lần chạy lại cùng
  // ngày ghi đè bằng 0/616.
  bienDong:
    ngayVN(cu.docLuc) === ngayVN(new Date().toISOString())
      ? (cu.bienDong ?? null)
      : {
    mocTruoc: cu.docLuc,
    soCanMocTruoc: cu.can.length,
    conTrongBangSong: conLai.length,
    daRoiKhoiBang: daRoi.length,
    doiGiaTrungBinh: doiGia.length
      ? doiGia.reduce((t, x) => t + x, 0) / doiGia.length
      : null,
    soCanDoDuocDoiGia: doiGia.length,
        },
  can,
};

writeFileSync(DICH, JSON.stringify(ra, null, 2) + "\n");

console.log(`✓ ${can.length} căn còn hàng → ${path.relative(ROOT, DICH)}`);
console.log(
  `  Biến động từ mốc trước: ${daRoi.length}/${cu.can.length} căn đã rời bảng,` +
    ` ${conLai.length} còn lại.`,
);
for (const { ten, so } of dem("loaiHinh")) console.log(`  · ${ten}: ${so}`);
