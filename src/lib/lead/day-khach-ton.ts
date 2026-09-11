import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Đẩy bù khách đang nằm trong `.data/dang-ky.jsonl` sang đích webhook.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CÓ TỆP NÀY
 *
 * Từ lúc trang lên VPS tới 11/09, `LEAD_WEBHOOK_URL` CHƯA TỪNG được đặt. Mọi
 * khách để lại số đều rơi vào `.data/dang-ky.jsonl` — một tệp trong ổ đĩa Docker
 * mà không ai mở. Đó là khách thật, chưa ai gọi lại.
 *
 * Và từ 11/09, khi webhook hỏng (Google chậm, token hết hạn), khách mới cũng
 * rơi vào đúng tệp đó thay vì mất. Tức là tệp này là HÀNG ĐỢI — cần có người
 * rút nó ra.
 *
 * Người đó là chính website: mỗi lần gửi thành công một khách mới, nó rút tiếp
 * những dòng còn tồn. Không cần ai SSH vào máy chủ, không cần nhớ chạy lệnh.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * KHÔNG GỬI TRÙNG
 *
 * Tệp chỉ NỐI ĐUÔI, không bao giờ sửa. Việc "đã gửi tới đâu" nằm ở tệp riêng
 * `dang-ky-da-day.txt` — một con số: đã gửi bao nhiêu dòng đầu. Ghi lại SAU
 * MỖI dòng gửi được, nên tiến trình chết giữa chừng thì lần sau đi tiếp đúng
 * chỗ, không gửi lại từ đầu.
 *
 * Một cờ trong tiến trình chặn hai lượt rút chạy song song (hai khách gửi cùng
 * lúc). Trang chạy MỘT tiến trình Node trong một hộp chứa — cờ trong bộ nhớ là
 * đủ, không cần khoá tệp.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Gửi một bản ghi. Trả `true` nếu đích nhận. Không được ném lỗi. */
export type GuiMotKhach = (banGhi: Record<string, string>) => Promise<boolean>;

export interface KetQuaDayBu {
  daGui: number;
  conTon: number;
  /** Dòng hỏng (không phải JSON) — bỏ qua, không làm kẹt hàng đợi. */
  boQua: number;
}

/** Trần mỗi lượt: đủ để rút hết tồn đọng thật, không giữ tiến trình quá lâu. */
const TOI_DA_MOI_LUOT = 50;

let dangRut = false;

export async function dayKhachTon(
  thuMuc: string,
  gui: GuiMotKhach,
): Promise<KetQuaDayBu | null> {
  if (dangRut) return null;
  dangRut = true;
  try {
    const tepKhach = path.join(thuMuc, "dang-ky.jsonl");
    const tepMoc = path.join(thuMuc, "dang-ky-da-day.txt");

    const tho = await readFile(tepKhach, "utf8").catch(() => "");
    // Giữ nguyên thứ tự và cả dòng rỗng giữa chừng không có — tệp chỉ nối đuôi
    // `JSON + \n`, nên tách theo `\n` rồi bỏ phần tử rỗng cuối là đủ.
    const dong = tho.split("\n").filter((d) => d.trim() !== "");
    const daDay = Number.parseInt(await readFile(tepMoc, "utf8").catch(() => "0"), 10);
    let moc = Number.isFinite(daDay) && daDay >= 0 ? Math.min(daDay, dong.length) : 0;

    let daGui = 0;
    let boQua = 0;
    const het = Math.min(dong.length, moc + TOI_DA_MOI_LUOT);
    while (moc < het) {
      let banGhi: Record<string, string> | null = null;
      try {
        const x = JSON.parse(dong[moc]) as unknown;
        if (x && typeof x === "object") banGhi = x as Record<string, string>;
      } catch {
        banGhi = null;
      }
      if (banGhi) {
        // Đích còn hỏng thì dừng, giữ nguyên mốc — lần sau thử lại đúng dòng này.
        if (!(await gui(banGhi))) break;
        daGui++;
      } else {
        boQua++;
      }
      moc++;
      await writeFile(tepMoc, String(moc), "utf8");
    }
    return { daGui, conTon: dong.length - moc, boQua };
  } finally {
    dangRut = false;
  }
}
