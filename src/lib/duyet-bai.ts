"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { layDb, schema } from "@/db";
import { DUONG_DAN } from "@/lib/duong-dan";
import type { KetQuaDuyet, KetQuaHangCho } from "@/lib/duyet-bai-kieu";
import { baoIndexNow } from "@/lib/indexnow";

/**
 * Duyệt hoặc gỡ một bài do Antigravity đẩy sang.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * BẢO VỆ BẰNG CHÍNH `INGEST_TOKEN`, KHÔNG DỰNG THÊM HỆ ĐĂNG NHẬP
 *
 * Trang duyệt có đúng một người dùng: chủ trang. Dựng một hệ tài khoản đầy đủ
 * cho một người là thêm bảng người dùng, thêm luồng quên mật khẩu, thêm phiên
 * đăng nhập — mỗi thứ là một chỗ để hỏng và một chỗ để lộ.
 *
 * Cùng một token đã dùng cho cổng nhận bài là đủ và đúng phạm vi: ai có nó thì
 * vốn đã đăng được bài rồi, nên cho họ duyệt bài không mở thêm quyền gì mới.
 *
 * ⚠️ So sánh token phải theo THỜI GIAN HẰNG SỐ. So bằng `===` để lộ độ dài
 * phần khớp qua thời gian chạy, đủ để dò dần ra token.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { demMotLuotTuHeader } from "@/lib/gioi-han-tan-suat";

function tokenKhop(nhanDuoc: string, mongDoi: string): boolean {
  const a = Buffer.from(nhanDuoc, "utf8");
  const b = Buffer.from(mongDoi, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Đếm một lượt gõ khoá. Gọi TRƯỚC khi so khoá.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ CHẶN DÒ KHOÁ Ở ĐÂY LÀ BẮT BUỘC, KHÔNG PHẢI THÊM CHO ĐỦ BỘ.
 *
 * `INGEST_TOKEN` mở được HAI cửa: `/api/ingest` để ghi bài, và trang này để
 * đọc hàng chờ và duyệt bài. Cổng nhận bài đã có hạn mức 20 lượt/phút, còn
 * trang này thì chưa có gì — nên kẻ dò chỉ việc bỏ qua cửa có gác mà gõ cửa
 * còn lại, nhanh tuỳ ý. Hạn mức bên kia khi đó chỉ còn là trang trí.
 *
 * ĐẾM TRƯỚC KHI SO KHOÁ, đúng như ở cổng nhận bài: đếm sau thì lượt đoán sai
 * không bao giờ được tính, mà lượt đoán sai mới chính là thứ cần chặn.
 *
 * 10 lượt/phút: chủ trang gõ nhầm khoá vài lần là cùng. Với máy dò thì nó biến
 * việc thử một khoá 64 ký tự thành việc không bao giờ xong.
 *
 * Thông báo trả về CỐ Ý giống hệt thông báo khoá sai. Nói rõ "đang bị chặn" là
 * nói cho kẻ dò biết chính xác nó cần chờ bao lâu rồi thử tiếp.
 * ═══════════════════════════════════════════════════════════════════════════
 */
async function conLuot(): Promise<boolean> {
  return !demMotLuotTuHeader("duyet-bai", await headers(), 10, 60).vuot;
}

/**
 * Lấy hàng chờ — CHỈ khi đưa đúng khoá.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ HÀM NÀY SINH RA ĐỂ VÁ MỘT LỖ HỔNG THẬT, ĐỪNG GỠ BỎ.
 *
 * Bản đầu của trang `/duyet-bai` đọc hàng chờ ngay trong thành phần máy chủ
 * rồi dựng thẳng ra HTML. Khoá chỉ được kiểm khi BẤM nút duyệt — nghĩa là bất
 * kỳ ai mở địa chỉ đó đều đọc được TOÀN VĂN mọi bài chưa duyệt.
 *
 * Tái hiện được bằng một lệnh curl không kèm khoá nào: bài thử chứa câu bịa
 * "chiết khấu 15% bí mật" hiện ra đầy đủ. Đúng loại nội dung mà hàng rào duyệt
 * sinh ra để chặn, lại rò ra qua chính trang dựng nên để chặn nó.
 *
 * Trang giờ dựng ra một vỏ rỗng. Hàng chờ chỉ về sau khi máy chủ nhận đúng
 * khoá — nên HTML đầu tiên không mang theo một chữ nào của bài chưa duyệt.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export async function layHangCho(
  _truoc: KetQuaHangCho,
  duLieu: FormData,
): Promise<KetQuaHangCho> {
  const token = process.env.INGEST_TOKEN;
  if (!token) {
    return { trangThai: "loi", thongBao: "Máy chủ chưa cấu hình INGEST_TOKEN." };
  }
  // ⚠️ PHẢI `.trim()`. Thiếu nó là một lỗi TÀNG HÌNH và đã tốn thật.
  //
  // Khoá dài 64 ký tự nên trong mọi ghi chú, email hay tin nhắn nó đều BỊ NGẮT
  // XUỐNG DÒNG. Người dùng quét chuột chọn cả hai dòng rồi dán — chuỗi dán vào
  // mang theo một ký tự xuống dòng ở giữa hoặc ở cuối.
  //
  // Ô nhập là `type="password"` nên màn hình chỉ hiện một hàng chấm: không có
  // cách nào NHÌN ra thừa ký tự. Trang báo đúng ba chữ "Khoá không đúng", và
  // người dùng đi kiểm biến môi trường trên máy chủ — tức là đi tìm một lỗi
  // không tồn tại.
  //
  // Khoảng trắng ở hai đầu KHÔNG BAO GIỜ là một phần của khoá, nên cắt đi
  // không nới lỏng bảo mật chút nào. So sánh vẫn theo thời gian hằng số.
  const khoa = String(duLieu.get("khoa") ?? "").trim();
  if (!(await conLuot()) || !khoa || !tokenKhop(khoa, token)) {
    return { trangThai: "loi", thongBao: "Khoá không đúng." };
  }

  const { docBaiChoDuyetThat } = await import("@/lib/tin-tuc");
  const { ngayVN } = await import("@/lib/thoi-gian");
  const { quetBai } = await import("@/lib/cong-chan");
  // KHÔNG dùng `docBaiChoDuyet` ở đây: nó trả rỗng khi cơ sở dữ liệu hỏng, và
  // màn này sẽ in "Hàng chờ trống." — sai theo hướng trấn an. Đọc thật, lỗi
  // thì nói lỗi.
  const doc = await docBaiChoDuyetThat();
  if (!doc.ok) {
    return {
      trangThai: "loi",
      thongBao:
        `Không đọc được hàng chờ từ cơ sở dữ liệu — ${doc.lyDo} ` +
        "Bấm “Mở hàng chờ” lại sau vài giây (Neon có thể vừa thức dậy). Bài đã nhận KHÔNG mất.",
    };
  }
  const cho = doc.bai;

  return {
    trangThai: "xong",
    bai: cho.map((b) => ({
      slug: b.slug,
      tieuDe: b.tieuDe,
      moTa: b.moTa,
      chuyenMuc: b.chuyenMuc,
      ngay: ngayVN(b.ngayDang),
      noiDung: b.noiDung ?? "",
      daTungDang: b.daTungDang ?? false,
      canhBao: quetBai(b).co,
    })),
  };
}


/**
 * Dựng lại mọi trang có thể chứa bài vừa duyệt hoặc vừa gỡ.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MỘT CHỖ KHAI, HAI ĐƯỜNG GỌI — CÓ LÝ DO.
 *
 * `duyetBai` có hai nhánh ghi: nhánh cơ sở dữ liệu và nhánh file cục bộ. Trước
 * đây mỗi nhánh tự liệt kê danh sách trang cần dựng lại, tức là cùng một danh
 * sách chép làm hai bản. Kiểu trùng lặp này hỏng theo một cách rất đặc trưng:
 * người thêm trang mới sửa bản mình đang đọc, bản kia ở lại phía sau, và sai
 * lệch chỉ lộ ra trong môi trường ít được thử nhất.
 *
 * ⚠️ THÊM MỘT TRANG ĐỌC BÀI VIẾT THÌ THÊM VÀO ĐÂY.
 *
 * Quên thì không có lỗi nào cả — trang chỉ đơn giản hiện nội dung cũ cho tới
 * lần triển khai sau. Đó là kiểu hỏng đắt nhất: không ai phát hiện, và khi
 * phát hiện thì không ai nghĩ tới bộ đệm.
 * ═══════════════════════════════════════════════════════════════════════════
 */
function dungLaiCacTrang(slug: string): void {
  revalidatePath(DUONG_DAN.tinTuc);
  revalidatePath(`${DUONG_DAN.tinTuc}/${slug}`);

  // Trang tiến độ đọc bài chuyên mục "Tiến độ" qua `docTheoChuyenMuc`. Đây là
  // money page ĐẦU TIÊN được đường ống đăng bài nuôi, nên nó cũng là chỗ đầu
  // tiên người ta quên khi nghĩ "bài viết thì chỉ liên quan tới trang tin".
  revalidatePath(DUONG_DAN.tienDo);

  // ⚠️ SITEMAP CŨNG PHẢI DỰNG LẠI, và đây là chỗ dễ quên nhất.
  //
  // `sitemap.xml` là trang TĨNH, dựng sẵn lúc build. Không gọi ở đây thì bài
  // vừa duyệt không bao giờ vào sitemap — Google không biết nó tồn tại — còn
  // bài vừa gỡ vẫn nằm lại trong sitemap và trỏ tới một địa chỉ trả 404.
  // Cả hai đều hỏng im lặng: trang tin trông vẫn đúng.
  revalidatePath("/sitemap.xml");
}

/**
 * Gõ cửa Bing sau khi bài đã lên trang (hoặc đã bị gỡ).
 *
 * ⚠️ GỌI SAU KHI ĐÃ GHI XONG, VÀ KHÔNG ĐƯỢC LÀM HỎNG KẾT QUẢ DUYỆT.
 *
 * Tới bước này thì việc đăng ĐÃ XONG — bài đã vào cơ sở dữ liệu và các trang
 * đã được dựng lại. Bing có nhận được hay không là chuyện phụ. Để một lỗi mạng
 * ở đây làm nút "Duyệt và đăng" báo đỏ là nói dối về một việc đã thành công,
 * và người dùng sẽ bấm lại — tạo đúng cái cảnh hai bài trùng mà kho Antigravity
 * vừa phải đi sửa.
 *
 * Bài bị GỠ cũng báo: IndexNow dùng chung một lệnh cho "mới" và "đã đổi", và
 * một địa chỉ giờ trả 404 thì càng nên để Bing biết sớm thay vì tiếp tục hiện
 * trong kết quả.
 */
async function baoTimKiem(slug: string, viec: string): Promise<void> {
  // ⚠️ BÀI HẸN NGÀY TƯƠNG LAI: KHÔNG BÁO LÚC DUYỆT (sửa 12/09).
  //
  // Duyệt một bài có `ngayDang` ngày mai → trang bài trả 404 cho tới đúng ngày
  // (`docMotBaiGoc` lọc `ngayDang <= hôm nay` — cố ý, để không ai đoán đường dẫn
  // mà đọc trước). Bản trước vẫn báo IndexNow ngay: Bing ghé, gặp 404, rồi tới
  // ngày bài hiện ra thì không ai báo lại. Tính năng hẹn giờ đăng bài làm việc
  // này thành chuyện hằng ngày chứ không phải ca hiếm.
  //
  // Nên: duyệt thì chỉ báo khi bài MỞ ĐƯỢC ngay hôm nay. Gỡ thì vẫn báo — một
  // địa chỉ vừa thành 404 càng nên để Bing biết sớm.
  if (viec === "duyet") {
    const { docMotBai } = await import("@/lib/tin-tuc");
    if (!(await docMotBai(slug))) {
      console.info("[indexnow] Bài hẹn ngày sau — chưa báo, sẽ báo khi tới ngày.");
      return;
    }
  }
  const ketQua = await baoIndexNow([
    `${DUONG_DAN.tinTuc}/${slug}`,
    DUONG_DAN.tinTuc,
    "/sitemap.xml",
  ]);
  if (!ketQua.daGui) {
    console.info("[indexnow] Không gửi:", ketQua.lyDo);
  }
}

export async function duyetBai(
  _truoc: KetQuaDuyet,
  duLieu: FormData,
): Promise<KetQuaDuyet> {
  const token = process.env.INGEST_TOKEN;
  if (!token) {
    return { trangThai: "loi", thongBao: "Máy chủ chưa cấu hình INGEST_TOKEN." };
  }

  // ⚠️ PHẢI `.trim()`. Thiếu nó là một lỗi TÀNG HÌNH và đã tốn thật.
  //
  // Khoá dài 64 ký tự nên trong mọi ghi chú, email hay tin nhắn nó đều BỊ NGẮT
  // XUỐNG DÒNG. Người dùng quét chuột chọn cả hai dòng rồi dán — chuỗi dán vào
  // mang theo một ký tự xuống dòng ở giữa hoặc ở cuối.
  //
  // Ô nhập là `type="password"` nên màn hình chỉ hiện một hàng chấm: không có
  // cách nào NHÌN ra thừa ký tự. Trang báo đúng ba chữ "Khoá không đúng", và
  // người dùng đi kiểm biến môi trường trên máy chủ — tức là đi tìm một lỗi
  // không tồn tại.
  //
  // Khoảng trắng ở hai đầu KHÔNG BAO GIỜ là một phần của khoá, nên cắt đi
  // không nới lỏng bảo mật chút nào. So sánh vẫn theo thời gian hằng số.
  const khoa = String(duLieu.get("khoa") ?? "").trim();
  if (!(await conLuot()) || !khoa || !tokenKhop(khoa, token)) {
    return { trangThai: "loi", thongBao: "Khoá không đúng." };
  }

  const slug = String(duLieu.get("slug") ?? "").trim();
  const viec = String(duLieu.get("viec") ?? "");
  if (!slug) return { trangThai: "loi", thongBao: "Thiếu mã bài." };

  const db = layDb();

  // ĐƯỜNG FILE — khi chưa cấu hình DATABASE_URL.
  //
  // ⚠️ THIẾU NHÁNH NÀY LÀ ĐƯỜNG CỤT. Cổng nhận bài đã ghi được vào file tạm và
  // màn hình duyệt đã đọc được hàng chờ từ đó, nhưng nút "Duyệt và đăng" lại
  // chỉ biết đường cơ sở dữ liệu — nên người chạy thử ở máy xếp được bài vào
  // hàng chờ rồi không có cách nào cho nó lên trang. Đo được: bấm duyệt không
  // báo gì, bài vẫn nằm nguyên trong hàng chờ.
  //
  // File JSONL ghi theo lối NỐI ĐUÔI: mỗi dòng là một bản ghi, dòng sau cùng
  // slug đè dòng trước. Nên "duyệt" chỉ là nối thêm một dòng mang trạng thái
  // mới, không phải đọc–sửa–ghi lại cả file.
  if (!db) {
    try {
      const { readFile, appendFile, mkdir } = await import("node:fs/promises");
      const path = await import("node:path");
      const thuMuc = path.join(process.cwd(), ".data");
      const tep = path.join(thuMuc, "bai-viet.jsonl");

      const tho = await readFile(tep, "utf8").catch(() => "");
      let banGhi: Record<string, unknown> | null = null;
      for (const dong of tho.split("\n")) {
        if (!dong.trim()) continue;
        try {
          const b = JSON.parse(dong) as Record<string, unknown>;
          if (b?.slug === slug) banGhi = b;
        } catch {
          // Dòng hỏng không được làm chết cả thao tác.
        }
      }
      if (!banGhi) {
        return { trangThai: "loi", thongBao: "Không tìm thấy bài trong hàng chờ." };
      }

      await mkdir(thuMuc, { recursive: true });
      await appendFile(
        tep,
        `${JSON.stringify({
          ...banGhi,
          // "go" ghi trạng thái `bo` — hàm đọc coi mọi trạng thái khác "dang"
          // là không hiện, nên bài biến khỏi cả trang tin lẫn hàng chờ.
          trangThai: viec === "duyet" ? "dang" : "bo",
          duyetLuc: viec === "duyet" ? new Date().toISOString() : null,
        })}\n`,
        "utf8",
      );
    } catch (loi) {
      console.error("[duyet-bai] Không ghi được file:", loi);
      return { trangThai: "loi", thongBao: "Không cập nhật được. Thử lại." };
    }

    dungLaiCacTrang(slug);
    await baoTimKiem(slug, viec);
    return {
      trangThai: "xong",
      thongBao: viec === "duyet" ? "Đã đăng bài." : "Đã gỡ bài.",
    };
  }

  try {
    if (viec === "duyet") {
      await db
        .update(schema.baiViet)
        .set({ trangThai: "dang", duyetLuc: new Date() })
        .where(
          and(
            eq(schema.baiViet.slug, slug),
            eq(schema.baiViet.trangThai, "cho"),
          ),
        );
    } else if (viec === "go") {
      // GỠ là XOÁ HẲN, không phải chuyển về chờ.
      //
      // Bài bị gỡ là bài chủ trang đã đọc và quyết định không đăng. Để nó nằm
      // lại trong hàng chờ thì lần sau mở màn hình duyệt lại phải đọc lại và
      // quyết định lại đúng bài đó — và sau vài chục bài, hàng chờ đầy những
      // thứ đã bị từ chối, đến mức không ai còn mở nữa.
      await db.delete(schema.baiViet).where(eq(schema.baiViet.slug, slug));
    } else {
      return { trangThai: "loi", thongBao: "Việc không hợp lệ." };
    }
  } catch (loi) {
    // KHÔNG đưa lỗi gốc ra ngoài: chuỗi kết nối cơ sở dữ liệu hay lọt vào
    // thông báo lỗi của trình điều khiển.
    console.error("[duyet-bai] Không cập nhật được:", loi);
    return { trangThai: "loi", thongBao: "Không cập nhật được. Thử lại." };
  }

  // Dựng lại các trang có bài, để bài vừa duyệt hiện ra ngay thay vì đợi bộ
  // đệm hết hạn.
  dungLaiCacTrang(slug);
  await baoTimKiem(slug, viec);

  return {
    trangThai: "xong",
    thongBao: viec === "duyet" ? "Đã đăng bài." : "Đã gỡ bài.",
  };
}
