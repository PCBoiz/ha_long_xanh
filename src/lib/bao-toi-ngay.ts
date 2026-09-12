import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Báo Bing (IndexNow) những bài HẸN NGÀY vừa tới ngày hôm nay.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * NỬA SAU CỦA MỘT LỖI ĐÃ SỬA MỘT NỬA (6bcdb13, 12/09/2026).
 *
 * Duyệt một bài hẹn ngày mai: trang bài trả 404 tới đúng ngày (cố ý). Nửa
 * đầu — không báo IndexNow lúc duyệt — đã sửa. Nửa sau là ĐÂY: tới ngày thì
 * ai báo? Không ai, nếu không có một nhịp chạy hằng ngày. Bài tự động của lịch
 * đăng đặt ngày = hôm nay nên không cần; chỉ bài chủ trang HẸN TAY mới rơi
 * vào khe này.
 *
 * Ai gọi: lịch đăng bên Antigravity gõ `/api/bao-bai-toi-ngay` một lần mỗi
 * ngày (nó đã có khoá đăng bài và đã gõ mỗi 10 phút — không bắt chủ trang dán
 * thêm dòng crontab nào). Gọi tay cũng được.
 *
 * IDEMPOTENT THEO NGÀY: bài đã báo trong ngày ghi vào `.data/indexnow-bao/
 * <ngày>.json`; gọi lại bao nhiêu lần trong ngày cũng không báo lại. Không có
 * tệp đó thì lịch gõ 144 lần/ngày là 144 lần gõ cửa Bing cho cùng một địa chỉ.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface KetQuaBaoToiNgay {
  ngay: string;
  /** Slug vừa báo trong lần gọi này. */
  daBao: string[];
  /** Slug đã báo trước đó trong ngày, bỏ qua. */
  boQua: string[];
  /** Lý do nếu IndexNow không nhận (chưa bật lập chỉ mục, thiếu khoá…). */
  lyDo?: string;
}

/** Chọn những bài tới ngày hôm nay, chưa báo. Thuần — để kiểm. */
export function chonBaiToiNgay(
  bai: readonly { slug: string; ngayDang: string }[],
  homNay: string,
  daBaoTruoc: readonly string[],
): { bao: string[]; boQua: string[] } {
  const truoc = new Set(daBaoTruoc);
  const toiNgay = bai.filter((b) => b.ngayDang === homNay).map((b) => b.slug);
  return {
    bao: toiNgay.filter((s) => !truoc.has(s)),
    boQua: toiNgay.filter((s) => truoc.has(s)),
  };
}

const THU_MUC = () => path.join(process.cwd(), ".data", "indexnow-bao");

export async function docDaBao(ngay: string): Promise<string[]> {
  try {
    const tho = await readFile(path.join(THU_MUC(), `${ngay}.json`), "utf8");
    const du = JSON.parse(tho) as unknown;
    return Array.isArray(du) ? du.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function ghiDaBao(ngay: string, slug: readonly string[]): Promise<void> {
  await mkdir(THU_MUC(), { recursive: true });
  await writeFile(path.join(THU_MUC(), `${ngay}.json`), JSON.stringify([...new Set(slug)]), "utf8");
}
