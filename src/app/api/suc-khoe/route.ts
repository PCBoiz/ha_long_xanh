import { timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { layDb, schema } from "@/db";
import { demMotLuotTuHeader } from "@/lib/gioi-han-tan-suat";

/**
 * Cửa kiểm tra sức khoẻ.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CẦN CỬA NÀY, VÀ VÌ SAO NÓ PHẢI CHẠM THẬT VÀO CƠ SỞ DỮ LIỆU
 *
 * Ngày 07/09/2026, trang chạy trên máy chủ thật và MỌI địa chỉ đều trả 200 —
 * trong khi cơ sở dữ liệu không đọc được. `/tin-tuc` bắt lỗi rồi trả danh sách
 * rỗng, đúng thiết kế, nên nhìn từ ngoài trang hoàn toàn khoẻ mạnh.
 *
 * Hậu quả đo được: người chẩn đoán (kể cả tôi) đọc mã 200 rồi kết luận cơ sở
 * dữ liệu chạy tốt. Sai, và sai theo hướng yên tâm — kiểu sai tệ nhất.
 *
 * Nên cửa này KHÔNG được trả 200 chỉ vì tiến trình còn sống. Nó phải đọc thật
 * một dòng từ bảng `bai_viet`. Trả 200 nghĩa là đường đi từ hộp chứa tới Neon
 * còn thông và bảng còn đọc được — không phải nghĩa là "máy chủ chưa tắt".
 *
 * ───────────────────────────────────────────────────────────────────────────
 * HAI MỨC TRẢ LỜI, VÀ RANH GIỚI GIỮA CHÚNG
 *
 *   · KHÔNG có khoá  → chỉ `{ trangThai }`. Đủ cho dịch vụ giám sát bên ngoài
 *     gọi mỗi 5 phút, và không nói gì cho người lạ về cấu trúc bên trong.
 *
 *   · CÓ khoá đúng   → thêm mã lỗi Postgres và câu mô tả gốc, đã che bí mật.
 *
 * Ranh giới này có lý do: dịch vụ giám sát miễn phí thường không gửi được
 * header tuỳ ý, nên mức công khai phải dùng được mà không cần khoá. Nhưng
 * "bảng bai_viet không tồn tại" là thông tin về cấu trúc — không đáng phát ra
 * cho mọi người chỉ để tiện chẩn đoán.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tokenKhop(nhanDuoc: string, mongDoi: string): boolean {
  const a = Buffer.from(nhanDuoc, "utf8");
  const b = Buffer.from(mongDoi, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Che mọi thứ trông giống bí mật trước khi đưa ra ngoài.
 *
 * Thông báo lỗi của trình điều khiển Postgres CÓ THỂ kèm cả chuỗi kết nối —
 * và chuỗi đó chứa mật khẩu. Cửa này chỉ trả chi tiết cho người có khoá, nhưng
 * một khoá bị lộ không được phép kéo theo cả mật khẩu cơ sở dữ liệu.
 */
function cheGiau(cau: string): string {
  return cau
    .replace(/\b[a-z+]+:\/\/[^\s@/]+:[^\s@/]+@\S+/gi, "<chuỗi-kết-nối-đã-che>")
    .replace(/\b(sk-[A-Za-z0-9_-]{8,}|AIza[A-Za-z0-9_-]{8,})\b/g, "<khoá-đã-che>")
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi, "Bearer <đã-che>");
}

function layMa(x: unknown): string | undefined {
  return (x as { code?: string } | undefined)?.code;
}

export async function GET(): Promise<Response> {
  const dau = await headers();

  // 60 lượt/phút: dịch vụ giám sát gọi mỗi 5 phút nên dư rất nhiều, mà vẫn
  // chặn được việc ai đó dùng cửa này làm máy dò trạng thái.
  if (demMotLuotTuHeader("suc-khoe", dau, 60, 60).vuot) {
    return Response.json({ trangThai: "qua-nhieu" }, { status: 429 });
  }

  const khoaMongDoi = process.env.INGEST_TOKEN;
  const khoaNhan = dau.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const duocXemChiTiet = Boolean(
    khoaMongDoi && khoaNhan && tokenKhop(khoaNhan, khoaMongDoi),
  );

  const db = layDb();
  if (!db) {
    return Response.json(
      {
        trangThai: "hong",
        ...(duocXemChiTiet
          ? { nguyenNhan: "Chưa cấu hình DATABASE_URL, hoặc nó vẫn là chuỗi mẫu." }
          : {}),
      },
      { status: 503 },
    );
  }

  const batDau = Date.now();
  try {
    // Đọc THẬT một dòng. `select 1` không đủ: nó chạy được cả khi bảng không
    // tồn tại hoặc không có quyền đọc — đúng hai thứ cần phát hiện.
    await db.select({ slug: schema.baiViet.slug }).from(schema.baiViet).limit(1);
    return Response.json({
      trangThai: "ok",
      csdl: "ok",
      mili: Date.now() - batDau,
    });
  } catch (loi) {
    const goc = (loi as { cause?: unknown }).cause;
    const ma = layMa(loi) ?? layMa(goc);
    const nguyenNhan = (goc as Error | undefined)?.message ?? (loi as Error)?.message;

    // Vẫn hét lên trong nhật ký máy chủ, kể cả khi người gọi không có khoá.
    console.error(
      `[suc-khoe] Không đọc được cơ sở dữ liệu. Mã: ${ma ?? "(không có)"} — ` +
        `${nguyenNhan ?? "(không có mô tả)"}`,
    );

    return Response.json(
      {
        trangThai: "hong",
        csdl: "loi",
        mili: Date.now() - batDau,
        ...(duocXemChiTiet
          ? {
              ma: ma ?? null,
              nguyenNhan: nguyenNhan ? cheGiau(nguyenNhan) : null,
            }
          : {}),
      },
      { status: 503 },
    );
  }
}
