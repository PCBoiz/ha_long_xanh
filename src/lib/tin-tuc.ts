import { readFile } from "node:fs/promises";
import path from "node:path";
import { and, desc, eq, lte } from "drizzle-orm";
import { layDb, schema, thuLaiKhiNguDay } from "@/db";
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
async function docBaiVietGoc(): Promise<BaiViet[]> {
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
async function docBaiChoDuyetGoc(): Promise<
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

async function docMotBaiGoc(slug: string): Promise<BaiViet | null> {
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

/**
 * Chạy một truy vấn đọc, và KHÔNG để nó giết cả bản dựng.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ KHỐI NÀY SINH RA TỪ MỘT BẢN TRIỂN KHAI HỎNG THẬT, ĐỌC TRƯỚC KHI GỠ.
 *
 * Nguyên tắc cũ của file này là "hỏng thì ném lỗi, không âm thầm rơi về file".
 * Nguyên tắc đó ĐÚNG lúc trang đang chạy, và SAI lúc đang dựng.
 *
 * Đo được trên Vercel: `DATABASE_URL` trỏ vào một database chưa chạy
 * migration, Postgres trả về `relation "bai_viet" does not exist`, và cả bản
 * triển khai chết ở `/sitemap.xml`. Không phải trang tin hỏng — mà là KHÔNG CÓ
 * TRANG NÀO LÊN ĐƯỢC. Chín trang tiền, trang liên hệ, mọi thứ, chỉ vì một
 * bảng phụ chưa tồn tại.
 *
 * Cái giá của hai hướng xử lý không cân nhau chút nào:
 *
 *   Ném lỗi  → mất toàn bộ trang, kể cả những phần không liên quan gì tới
 *              cơ sở dữ liệu. Và lỗi này còn xảy ra được vì lý do tạm thời:
 *              Neon gói miễn phí tự ngủ, nhánh không hoạt động bị lưu trữ, một
 *              lần đánh thức chậm là hỏng cả lần triển khai.
 *
 *   Trả rỗng → mục tin tức trống. Nhìn thấy ngay khi mở trang, sửa xong là có
 *              lại, và KHÔNG kéo theo thứ gì khác.
 *
 * Nên trả rỗng — nhưng phải HÉT LÊN trong nhật ký, kèm chẩn đoán đúng bệnh.
 * Trả rỗng mà im lặng mới đúng là cái bẫy mà ghi chú cũ cảnh báo.
 * ═══════════════════════════════════════════════════════════════════════════
 */
/** Dịch mã lỗi Postgres sang câu người vận hành làm được gì với nó. */
export function chanDoanLoiDb(loi: unknown): { ma: string | undefined; chanDoan: string; goc: unknown } {
  const goc = (loi as { cause?: unknown } | undefined)?.cause;
  const layMa = (x: unknown) => (x as { code?: string } | undefined)?.code;
  const ma = layMa(loi) ?? layMa(goc);
  const chanDoan =
    ma === "42P01"
      ? "Bảng chưa tồn tại. Chạy `npm run db:migrate` — và kiểm chuỗi kết nối " +
        "có đang trỏ đúng database không (dễ nhầm nhất là để nguyên `neondb` " +
        "mặc định thay vì database của trang)."
      : ma === "3D000"
        ? "Database không tồn tại. Tên database ở cuối DATABASE_URL đang sai."
        : ma === "28P01" || ma === "28000"
          ? "Sai thông tin đăng nhập. Lấy lại chuỗi kết nối ở bảng điều khiển Neon."
          : ma === "53300"
            ? "Hết hạn mức kết nối. Phải dùng chuỗi có `-pooler`."
            : "Kiểm DATABASE_URL và trạng thái Neon.";
  return { ma, chanDoan, goc };
}

/**
 * Đọc hàng chờ KHÔNG NUỐT LỖI — dành riêng cho màn duyệt bài.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ "HÀNG CHỜ TRỐNG" VÀ "KHÔNG ĐỌC ĐƯỢC HÀNG CHỜ" LÀ HAI CHUYỆN KHÁC NHAU.
 *
 * `docBaiChoDuyet` (bọc `docAnToan`) trả `[]` khi cơ sở dữ liệu hỏng — đúng
 * cho trang công khai: khách không cần biết Neon vừa ngủ. Nhưng màn duyệt bài
 * dùng cùng hàm đó và in "Hàng chờ trống." — chủ trang nhìn thấy, tin là
 * trống, trong khi Antigravity vừa báo "đã nhận, chờ duyệt" một phút trước
 * (12/09/2026). Hai màn nói ngược nhau, và màn sai là màn nuốt lỗi.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export async function docBaiChoDuyetThat(): Promise<
  | { ok: true; bai: (BaiViet & { daTungDang?: boolean })[] }
  | { ok: false; lyDo: string }
> {
  try {
    return { ok: true, bai: await thuLaiKhiNguDay(docBaiChoDuyetGoc) };
  } catch (loi) {
    const { ma, chanDoan } = chanDoanLoiDb(loi);
    console.error(`[tin-tuc] KHÔNG ĐỌC ĐƯỢC hàng chờ duyệt (mã ${ma ?? "?"}): ${chanDoan}`);
    return { ok: false, lyDo: `${chanDoan}${ma ? ` (mã lỗi ${ma})` : ""}` };
  }
}

async function docAnToan<T>(viec: string, chay: () => Promise<T>, khiHong: T): Promise<T> {
  try {
    return await thuLaiKhiNguDay(chay);
  } catch (loi) {
    // ═══════════════════════════════════════════════════════════════════════
    // ⚠️ PHẢI ĐỌC CẢ `cause`, KHÔNG CHỈ LỚP NGOÀI. ĐỌC TRƯỚC KHI SỬA.
    //
    // Drizzle bọc mọi lỗi truy vấn vào một lớp riêng. Lớp ngoài mang
    // `message` = "Failed query: <câu SQL>" và KHÔNG mang `code`. Mã lỗi
    // Postgres thật, cùng câu mô tả thật, nằm ở `cause`.
    //
    // Bản trước đọc `loi.code` của lớp ngoài — luôn ra `undefined`, nên luôn
    // rơi vào nhánh chung chung "Kiểm DATABASE_URL". Nhánh nhận biết `42P01`
    // viết ra rồi nhưng KHÔNG BAO GIỜ chạy được.
    //
    // Đo ngày 07/09/2026 trên máy chủ thật: nhật ký in ra nguyên câu SQL dài
    // ba dòng, nhưng không in điều duy nhất cần biết là vì sao nó hỏng. Mất
    // một vòng chẩn đoán chỉ để phát hiện chính bộ chẩn đoán đang mù.
    //
    // Một khối chẩn đoán không bao giờ chẩn đúng còn tệ hơn không có khối
    // nào: nó làm người đọc tin rằng mình đã biết bệnh.
    // ═══════════════════════════════════════════════════════════════════════
    const { ma, chanDoan, goc } = chanDoanLoiDb(loi);

    console.error(
      `[tin-tuc] KHÔNG ĐỌC ĐƯỢC cơ sở dữ liệu khi ${viec}. ${chanDoan}\n` +
        `          Trang vẫn chạy nhưng phần bài viết sẽ TRỐNG.\n` +
        `          Mã lỗi Postgres: ${ma ?? "(không có mã)"}\n` +
        `          Nguyên nhân thật: ${(goc as Error | undefined)?.message ?? "(cause rỗng)"}\n` +
        `          Truy vấn hỏng: ${(loi as Error)?.message ?? loi}`,
    );
    return khiHong;
  }
}


/**
 * Ba lớp bọc công khai. Mọi nơi khác trong mã vẫn gọi đúng tên cũ —
 * `docBaiViet`, `docBaiChoDuyet`, `docMotBai` — nên không chỗ nào phải sửa.
 *
 * Tách phần đọc thật ra thành `...Goc` rồi bọc ở đây, thay vì rải try/catch
 * vào giữa từng truy vấn: chỗ đọc nào thêm về sau cũng chỉ cần một dòng bọc,
 * và không ai vô tình thêm một đường đọc KHÔNG được bảo vệ.
 */
export async function docBaiViet(): Promise<BaiViet[]> {
  return docAnToan("đọc bài đã đăng", docBaiVietGoc, []);
}

export async function docBaiChoDuyet(): Promise<
  (BaiViet & { daTungDang?: boolean })[]
> {
  return docAnToan("đọc hàng chờ duyệt", docBaiChoDuyetGoc, []);
}

export async function docMotBai(slug: string): Promise<BaiViet | null> {
  return docAnToan("mở một bài", () => docMotBaiGoc(slug), null);
}
