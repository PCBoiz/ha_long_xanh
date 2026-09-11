import { readFile } from "node:fs/promises";
import path from "node:path";
import { DUOI_THEO_MIME, MAU_SLUG, MAU_TEN_TEP } from "@/lib/anh-bai";

/**
 * Phục vụ ảnh kèm bài từ `.data/anh/<slug>/<tệp>`.
 *
 * Hai mẫu khớp CHẶT (slug chữ-số-gạch; tệp = 12 hex + đuôi) là hàng rào duy
 * nhất giữa địa chỉ do người lạ gõ và hệ tệp của máy chủ — không có `..`,
 * không có `/`, không có gì ngoài đúng hai dạng đó đi qua. `path.join` chỉ là
 * lớp thứ hai.
 *
 * Tên tệp là băm nội dung nên bất biến → đệm dài hạn, `immutable`.
 */
export async function GET(
  _yeuCau: Request,
  { params }: { params: Promise<{ slug: string; ten: string }> },
): Promise<Response> {
  const { slug, ten } = await params;
  if (!MAU_SLUG.test(slug) || !MAU_TEN_TEP.test(ten)) {
    return new Response("Không tìm thấy.", { status: 404 });
  }
  const duoi = ten.slice(ten.lastIndexOf(".") + 1);
  const mime = Object.entries(DUOI_THEO_MIME).find(([, d]) => d === duoi)?.[0];
  if (!mime) return new Response("Không tìm thấy.", { status: 404 });

  try {
    const bytes = await readFile(path.join(process.cwd(), ".data", "anh", slug, ten));
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": mime,
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Không tìm thấy.", { status: 404 });
  }
}
