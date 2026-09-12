import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { demMotLuot } from "@/lib/gioi-han-tan-suat";
import { DUONG_DAN } from "@/lib/duong-dan";
import { baoIndexNow } from "@/lib/indexnow";
import { docBaiViet } from "@/lib/tin-tuc";
import { homNayVN } from "@/lib/thoi-gian";
import { chonBaiToiNgay, docDaBao, ghiDaBao, type KetQuaBaoToiNgay } from "@/lib/bao-toi-ngay";

export const dynamic = "force-dynamic";

/**
 * POST /api/bao-bai-toi-ngay — bảo vệ bằng chính `INGEST_TOKEN` (như cổng nhận
 * bài và màn duyệt). Xem lý do tồn tại ở đầu `lib/bao-toi-ngay.ts`.
 */
export async function POST(yeuCau: Request): Promise<Response> {
  const nhip = demMotLuot("bao-toi-ngay", yeuCau, 30, 60);
  if (nhip.vuot) {
    return NextResponse.json({ loi: "Gọi quá nhanh." }, { status: 429, headers: { "Retry-After": String(nhip.choGiay) } });
  }
  const token = process.env.INGEST_TOKEN;
  if (!token) return NextResponse.json({ loi: "Thiếu INGEST_TOKEN." }, { status: 503 });
  const header = yeuCau.headers.get("authorization") ?? "";
  const nhanDuoc = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(nhanDuoc, "utf8");
  const b = Buffer.from(token, "utf8");
  if (!nhanDuoc || a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ loi: "Không có quyền." }, { status: 401 });
  }

  const ngay = homNayVN();
  const daBaoTruoc = await docDaBao(ngay);
  const { bao, boQua } = chonBaiToiNgay(await docBaiViet(), ngay, daBaoTruoc);
  const ketQua: KetQuaBaoToiNgay = { ngay, daBao: [], boQua };

  if (bao.length > 0) {
    // Trang danh sách và trang bài là dynamic; sitemap cũng — nhưng gọi
    // revalidate cho chắc, cùng bộ đường như lúc duyệt.
    for (const slug of bao) revalidatePath(`${DUONG_DAN.tinTuc}/${slug}`);
    revalidatePath(DUONG_DAN.tinTuc);
    revalidatePath("/sitemap.xml");

    const kq = await baoIndexNow([...bao.map((s) => `${DUONG_DAN.tinTuc}/${s}`), DUONG_DAN.tinTuc, "/sitemap.xml"]);
    if (kq.daGui) {
      ketQua.daBao = bao;
      await ghiDaBao(ngay, [...daBaoTruoc, ...bao]);
    } else {
      // Không ghi dấu — lần gọi sau trong ngày thử lại.
      ketQua.lyDo = kq.lyDo;
    }
    console.info(`[bao-toi-ngay] ${ngay}: báo ${ketQua.daBao.length}, bỏ qua ${boQua.length}${kq.daGui ? "" : ` — ${kq.lyDo}`}`);
  }
  return NextResponse.json(ketQua, { headers: { "Cache-Control": "no-store" } });
}
