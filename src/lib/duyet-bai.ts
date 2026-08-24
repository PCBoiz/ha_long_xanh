"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { layDb, schema } from "@/db";
import { DUONG_DAN } from "@/lib/duong-dan";
import type { KetQuaDuyet, KetQuaHangCho } from "@/lib/duyet-bai-kieu";

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

function tokenKhop(nhanDuoc: string, mongDoi: string): boolean {
  const a = Buffer.from(nhanDuoc, "utf8");
  const b = Buffer.from(mongDoi, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
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
  const khoa = String(duLieu.get("khoa") ?? "");
  if (!khoa || !tokenKhop(khoa, token)) {
    return { trangThai: "loi", thongBao: "Khoá không đúng." };
  }

  const { docBaiChoDuyet } = await import("@/lib/tin-tuc");
  const { ngayVN } = await import("@/lib/thoi-gian");
  const { quetBai } = await import("@/lib/cong-chan");
  const cho = await docBaiChoDuyet();

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

export async function duyetBai(
  _truoc: KetQuaDuyet,
  duLieu: FormData,
): Promise<KetQuaDuyet> {
  const token = process.env.INGEST_TOKEN;
  if (!token) {
    return { trangThai: "loi", thongBao: "Máy chủ chưa cấu hình INGEST_TOKEN." };
  }

  const khoa = String(duLieu.get("khoa") ?? "");
  if (!khoa || !tokenKhop(khoa, token)) {
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

  return {
    trangThai: "xong",
    thongBao: viec === "duyet" ? "Đã đăng bài." : "Đã gỡ bài.",
  };
}
