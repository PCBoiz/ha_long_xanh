import { readFile } from "node:fs/promises";
import path from "node:path";
import { and, desc, eq, lte } from "drizzle-orm";
import { layDb, schema } from "@/db";
import { baiViet as baiTinh, type BaiViet } from "@/data/news";
import { homNayVN } from "@/lib/thoi-gian";

/**
 * Đọc bài đã đăng.
 *
 * ĐÂY LÀ ĐẦU NHẬN của đường ống Antigravity. Cổng `/api/ingest` ghi bài xuống,
 * hàm này đọc lại. Không có bước này thì Antigravity đẩy bài thành công nhưng
 * trang không hiện gì — đúng kiểu hỏng im lặng mà cổng nhận đã cố tránh ở đầu
 * bên kia.
 *
 * HAI CHỖ LƯU, chọn theo môi trường:
 *
 *  · Có `DATABASE_URL`  → đọc từ Neon Postgres. Đây là đường chạy thật.
 *  · Không có           → đọc file `.data/bai-viet.jsonl` trên máy cục bộ, để
 *                          người phát triển xem được giao diện mà không phải
 *                          dựng cơ sở dữ liệu trước.
 *
 * Không phải là "dự phòng khi cơ sở dữ liệu hỏng": nếu đã cấu hình mà truy vấn
 * lỗi thì lỗi được ném ra, KHÔNG âm thầm rơi về file. Rơi về lúc đó nghĩa là
 * trang hiện dữ liệu cũ của máy cục bộ mà không ai biết là đang hỏng.
 */
export async function docBaiViet(): Promise<BaiViet[]> {
  const db = layDb();

  if (db) {
    const dong = await db
      .select()
      .from(schema.baiViet)
      // HAI ĐIỀU KIỆN, và cả hai đều bắt buộc.
      //
      // 1. ĐÃ DUYỆT. Bỏ đi là mở đường cho bài do mô hình ngôn ngữ viết lên
      //    thẳng trang — xem ghi chú ở cột `trangThai` trong `db/schema.ts`.
      //
      // 2. ĐÃ TỚI NGÀY. Đây là thứ làm cho "hẹn giờ đăng" có thật.
      //
      //    ⚠️ TRƯỚC KHI CÓ DÒNG NÀY, TÍNH NĂNG HẸN GIỜ LÀ MỘT LỜI HỨA SAI.
      //    Bộ đẩy bài bên Antigravity nói với người dùng: "Bài đã nằm trên site
      //    nhưng chỉ hiển thị khi tới ngày." Site thì không hề lọc theo ngày —
      //    nên một bài hẹn năm 2099, sau khi được duyệt, lên trang NGAY, và còn
      //    nằm đầu danh sách vì sắp xếp theo ngày giảm dần.
      //
      //    Bộ kiểm cũng không bắt được: nó chỉ khẳng định thông báo trả về có
      //    chứa chữ "hẹn". Kiểm lời nói, không kiểm hành vi.
      //
      //    So sánh chuỗi `YYYY-MM-DD` là so sánh đúng thứ tự thời gian, nên
      //    `lte` trên chuỗi hoạt động chính xác mà không cần đổi kiểu.
      .where(
        and(
          eq(schema.baiViet.trangThai, "dang"),
          lte(schema.baiViet.ngayDang, homNayVN()),
        ),
      )
      .orderBy(desc(schema.baiViet.ngayDang));
    return dong.map(sangBaiViet);
  }

  return docTuFile();
}

/**
 * Đọc bài đã đăng theo chuyên mục — dùng để một MONEY PAGE tự nuôi mình bằng
 * chính đường ống đăng bài.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO LỌC TRONG BỘ NHỚ THAY VÌ THÊM MỘT TRUY VẤN
 *
 * Cách "đúng bài bản" là viết một truy vấn riêng có thêm `eq(chuyenMuc, …)`.
 * Ở đây làm thế là SAI, vì lý do không nằm ở hiệu năng.
 *
 * `docBaiViet` mang hai hàng rào: đã duyệt, và đã tới ngày. Cả hai đều là hàng
 * rào an toàn, và cả hai đều VÔ HÌNH với người viết truy vấn thứ hai. Người
 * thêm truy vấn mới sáu tháng nữa sẽ sao chép phần `select … where` và rất dễ
 * bỏ quên một trong hai — lúc đó bài chưa duyệt hiện trên trang tiến độ trong
 * khi `/tin-tuc` vẫn sạch, và không có gì báo lỗi cả.
 *
 * Gọi lại `docBaiViet()` thì mọi hàng rào hiện có, và mọi hàng rào thêm về
 * sau, đều tự động áp dụng. Số bài ở đây tính bằng chục nên phần lọc trong bộ
 * nhớ không đáng kể — đổi một chút công vô nghĩa lấy việc không thể quên hàng
 * rào là đổi đúng chiều.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export async function docTheoChuyenMuc(
  chuyenMuc: BaiViet["chuyenMuc"],
  gioiHan = 4,
): Promise<BaiViet[]> {
  const tatCa = await docBaiViet();
  return tatCa.filter((b) => b.chuyenMuc === chuyenMuc).slice(0, gioiHan);
}

/**
 * Đọc bài ĐANG CHỜ DUYỆT. Chỉ dùng cho màn hình duyệt bài, không dùng cho
 * trang công khai.
 */
export async function docBaiChoDuyet(): Promise<
  (BaiViet & { daTungDang?: boolean })[]
> {
  const db = layDb();
  // Chưa có cơ sở dữ liệu thì đọc hàng chờ từ chính file JSONL. Không có
  // nhánh này thì chạy thử ở máy sẽ thấy màn hình duyệt luôn trống, và người
  // thử kết luận nhầm là đường ống hỏng — trong khi bài đã về tới nơi.
  if (!db) return docChoTuFile();
  const dong = await db
    .select()
    .from(schema.baiViet)
    .where(eq(schema.baiViet.trangThai, "cho"))
    // ĐẢO THỨ TỰ: bài SỬA LẠI lên trước bài mới.
    //
    // Một bài từng được duyệt rồi bị sửa là bài đáng soi kỹ nhất trong hàng
    // chờ — nội dung đã đổi sau khi có người gật đầu. Xếp theo giờ nhận thì nó
    // nằm lẫn giữa bài mới, không có dấu hiệu gì, và rất dễ bị duyệt lướt.
    // `duyetLuc` khác null nghĩa là bài này từng được đăng.
    .orderBy(desc(schema.baiViet.duyetLuc), desc(schema.baiViet.nhanLuc));
  return dong.map((d) => ({
    ...sangBaiViet(d),
    daTungDang: d.duyetLuc !== null,
  }));
}

export async function docMotBai(slug: string): Promise<BaiViet | null> {
  const db = layDb();

  if (db) {
    const dong = await db
      .select()
      .from(schema.baiViet)
      .where(
        and(
          eq(schema.baiViet.slug, slug),
          eq(schema.baiViet.trangThai, "dang"),
          // Bài hẹn ngày tương lai cũng KHÔNG mở thẳng bằng địa chỉ được.
          // Thiếu điều kiện này thì lọc ở trang danh sách chỉ là màn che: ai
          // đoán được đường dẫn là đọc được nội dung chưa tới ngày.
          lte(schema.baiViet.ngayDang, homNayVN()),
        ),
      )
      .limit(1);
    return dong[0] ? sangBaiViet(dong[0]) : null;
  }

  const tatCa = await docTuFile();
  return tatCa.find((b) => b.slug === slug) ?? null;
}

function sangBaiViet(dong: schema.BaiVietRow): BaiViet {
  return {
    slug: dong.slug,
    tieuDe: dong.tieuDe,
    moTa: dong.moTa,
    ngayDang: dong.ngayDang,
    chuyenMuc: dong.chuyenMuc as BaiViet["chuyenMuc"],
    noiDung: dong.noiDung ?? undefined,
  };
}

/**
 * Đường cục bộ: đọc file JSONL.
 *
 * Dạng mỗi dòng một bản ghi được chọn vì ghi thêm là thao tác nối đuôi, không
 * phải đọc–sửa–ghi cả file: hai bài về cùng lúc không đè lên nhau.
 */
async function docChoTuFile(): Promise<BaiViet[]> {
  const gom = new Map<string, BaiViet>();
  for (const { bai, trangThai } of await docDongTuFile()) {
    // Bài sau đè bài trước cùng slug. Bài đã duyệt thì rời khỏi hàng chờ.
    // Chỉ trạng thái "cho" mới nằm trong hàng chờ. "dang" nghĩa là đã duyệt,
    // "bo" nghĩa là đã gỡ — cả hai đều rời khỏi hàng chờ.
    if (trangThai === "cho") gom.set(bai.slug, bai);
    else gom.delete(bai.slug);
  }
  return [...gom.values()];
}

/** Đọc thô từng dòng JSONL, kèm trạng thái. Dùng chung cho hai hàm đọc. */
async function docDongTuFile(): Promise<
  { bai: BaiViet; trangThai: string | undefined }[]
> {
  const ra: { bai: BaiViet; trangThai: string | undefined }[] = [];
  try {
    const tho = await readFile(
      path.join(process.cwd(), ".data", "bai-viet.jsonl"),
      "utf8",
    );
    for (const dong of tho.split("\n")) {
      if (!dong.trim()) continue;
      try {
        const bai = JSON.parse(dong) as BaiViet & { trangThai?: string };
        if (!bai?.slug || !bai?.tieuDe) continue;
        ra.push({ bai, trangThai: bai.trangThai });
      } catch {
        // Một dòng hỏng không được làm chết cả trang. Bỏ qua dòng đó.
      }
    }
  } catch {
    // Chưa có bài nào được đẩy về — không phải lỗi.
  }
  return ra;
}

async function docTuFile(): Promise<BaiViet[]> {
  const gom = new Map<string, BaiViet>();
  for (const bai of baiTinh) gom.set(bai.slug, bai);

  try {
    const tho = await readFile(
      path.join(process.cwd(), ".data", "bai-viet.jsonl"),
      "utf8",
    );
    for (const dong of tho.split("\n")) {
      if (!dong.trim()) continue;
      try {
        const bai = JSON.parse(dong) as BaiViet & { trangThai?: string };
        if (!bai?.slug || !bai?.tieuDe) continue;
        // CÙNG MỘT HÀNG RÀO DUYỆT như đường cơ sở dữ liệu.
        //
        // Bản ghi KHÔNG có `trangThai` là bản ghi cũ, ghi từ trước khi có hàng
        // rào — coi là đã đăng, vì lúc đó chúng thật sự đã hiện trên trang.
        // Bản ghi CÓ `trangThai` mà không phải "dang" thì bỏ qua.
        if (bai.trangThai !== undefined && bai.trangThai !== "dang") {
          gom.delete(bai.slug);
          continue;
        }
        // Bài sau đè bài trước cùng slug: đăng lại là sửa, không phải nhân đôi.
        gom.set(bai.slug, bai);
      } catch {
        // Một dòng hỏng không được làm chết cả trang tin. Bỏ qua dòng đó.
      }
    }
  } catch {
    // Chưa có bài nào được đẩy về — không phải lỗi.
  }

  // Cùng một hàng rào ngày như đường cơ sở dữ liệu — xem ghi chú ở
  // `docBaiViet`. Thiếu ở đây thì đường file lại đi vòng qua, đúng như lỗi
  // hàng rào duyệt bài từng mắc.
  const homNay = homNayVN();
  return [...gom.values()]
    .filter((b) => b.ngayDang <= homNay)
    .sort((a, b) => b.ngayDang.localeCompare(a.ngayDang));
}
