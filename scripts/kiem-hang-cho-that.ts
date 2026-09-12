/**
 * Cơ sở dữ liệu hỏng → hàng chờ phải BÁO HỎNG, không im lặng trả rỗng.
 * Chạy thật với một truy vấn hỏng thật, không phải grep mã nguồn.
 *
 *     npx tsx scripts/kiem-hang-cho-that.ts   (tự chạy trong `npm run kiem`)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CÓ THÊM PHÉP KIỂM NÀY, KHI ĐÃ CÓ `kiem-hang-cho.mjs`
 *
 * Cái kia đọc MÃ NGUỒN: nó bắt được chuyện ai đó đổi `layHangCho` về hàm nuốt
 * lỗi. Nhưng nó không biết gì về HÀNH VI — đổi cách bắt lỗi bên trong
 * `docBaiChoDuyetThat`, hay thêm một `try/catch` mới ở giữa, là nó vẫn xanh
 * trong khi màn duyệt lại nói dối như hôm 12/09.
 *
 * ⚠️ DỪNG Ở `docBaiChoDuyetThat`, KHÔNG GỌI `layHangCho`. Hàm kia gọi
 * `headers()` của Next để đếm nhịp gọi, mà `headers()` chỉ sống trong một
 * request thật — chạy ngoài Next là ném "called outside a request scope".
 * Giả lập request scope thì phải chạm kho nội bộ của Next, thứ đổi theo từng
 * bản. Lớp dưới là lớp mang toàn bộ hành vi đáng kiểm; phần `layHangCho` chỉ
 * còn là "có gọi đúng hàm không" — và đó đúng là việc của phép kiểm tĩnh.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Đặt TRƯỚC khi nạp bất cứ thứ gì chạm cơ sở dữ liệu: cổng 1 không ai nghe,
// nên truy vấn hỏng ngay thay vì treo.
process.env.DATABASE_URL = "postgres://u:p@127.0.0.1:1/khong-co";

let hong = 0;
function ca(ten: string, ok: boolean, chiTiet = ""): void {
  console.log(`${ok ? "✓" : "✗"} ${ten}${ok ? "" : `  ← ${chiTiet}`}`);
  if (!ok) hong += 1;
}

async function main(): Promise<void> {
  const { chanDoanLoiDb, docBaiChoDuyetThat, docBaiViet } = await import("../src/lib/tin-tuc");

  const batDau = Date.now();
  const kq = await docBaiChoDuyetThat();
  const giay = Math.round((Date.now() - batDau) / 1000);

  ca("cơ sở dữ liệu hỏng → KHÔNG trả danh sách rỗng kiểu 'không có bài nào'", kq.ok === false, JSON.stringify(kq).slice(0, 160));
  ca(
    "có lý do đọc được cho chủ trang",
    kq.ok === false && typeof kq.lyDo === "string" && kq.lyDo.length > 10,
    kq.ok === false ? kq.lyDo : "(ok=true)",
  );
  ca("không treo lâu (hỏng nhanh, dưới 60 giây)", giay < 60, `${giay}s`);

  // Trang CÔNG KHAI thì ngược lại: hỏng vẫn phải trả rỗng để trang còn sống.
  const congKhai = await docBaiViet();
  ca("trang công khai vẫn chạy khi CSDL hỏng (trả rỗng, không ném)", Array.isArray(congKhai) && congKhai.length === 0, String(congKhai));

  // Chẩn đoán theo mã lỗi Postgres — thứ biến lỗi thành việc làm được.
  ca(
    "mã 42P01 → bảo chạy migrate",
    /migrate/i.test(chanDoanLoiDb({ cause: { code: "42P01" } }).chanDoan),
    chanDoanLoiDb({ cause: { code: "42P01" } }).chanDoan,
  );
  ca(
    "mã 28P01 → bảo lấy lại chuỗi kết nối",
    /đăng nhập/i.test(chanDoanLoiDb({ code: "28P01" }).chanDoan),
    chanDoanLoiDb({ code: "28P01" }).chanDoan,
  );

  if (hong > 0) {
    console.error(`✗ ${hong} ca hỏng — hàng chờ có thể lại nói dối khi cơ sở dữ liệu hỏng.`);
    process.exit(1);
  }
  console.log("✓ Hàng chờ báo hỏng đúng cách; trang công khai vẫn sống.");
}

void main();
