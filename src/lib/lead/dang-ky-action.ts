"use server";

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { after } from "next/server";
import { DIEU_UU_TIEN } from "./uu-tien";
import { dayKhachTon } from "./day-khach-ton";
import type { KetQuaDangKy } from "./dang-ky-kieu";

// Tiếp nhận đăng ký tư vấn.
//
// Đích đến (cập nhật 11/09): cổng nhận khách của Antigravity → Google Sheets
// của chủ trang, đặt qua LEAD_WEBHOOK_URL + LEAD_WEBHOOK_TOKEN. Hai đường:
//   1. Nếu đặt biến môi trường LEAD_WEBHOOK_URL → gửi thẳng tới đó (CRM, Google
//      Apps Script, n8n, Zapier…). Đây là đường dùng cho môi trường thật.
//   2. Không đặt → ghi xuống .data/dang-ky.jsonl để chạy thử ở máy.
//
// Trên Vercel thư mục dự án CHỈ ĐỌC, nên đường (2) sẽ lỗi. Đó là cố ý: thà báo
// lỗi ngay còn hơn nhận thông tin khách rồi đánh rơi im lặng. Trước khi phát
// hành, owner phải cấu hình LEAD_WEBHOOK_URL hoặc thay bằng cơ sở dữ liệu.

/** Số di động Việt Nam: 10 chữ số bắt đầu bằng 0, hoặc dạng +84. */
function chuanHoaSoDienThoai(thoInput: string): string | null {
  const chiSo = thoInput.replace(/[\s.\-()]/g, "");
  const daiDien = chiSo.startsWith("+84")
    ? `0${chiSo.slice(3)}`
    : chiSo.startsWith("84") && chiSo.length === 11
      ? `0${chiSo.slice(2)}`
      : chiSo;
  return /^0[35789]\d{8}$/.test(daiDien) ? daiDien : null;
}

/** Ba đích đến khả dĩ. `xemThu` nghĩa là KHÔNG lưu ở đâu cả. */
type DichDen = "webhook" | "fileCucBo" | "xemThu";

function chonDichDen(): DichDen {
  if (process.env.LEAD_WEBHOOK_URL) return "webhook";
  // Trên Vercel thư mục dự án CHỈ ĐỌC nên không có đường ghi file. Nhận biết
  // trước, thay vì để `appendFile` ném lỗi rồi báo với khách là "hiện chưa gửi
  // được" — câu đó đúng về kỹ thuật nhưng khiến người xem thử tưởng trang hỏng.
  if (process.env.VERCEL) return "xemThu";
  return "fileCucBo";
}

async function ghiTep(banGhi: Record<string, string>): Promise<void> {
  const thuMuc = path.join(process.cwd(), ".data");
  await mkdir(thuMuc, { recursive: true });
  await appendFile(
    path.join(thuMuc, "dang-ky.jsonl"),
    `${JSON.stringify(banGhi)}\n`,
    "utf8",
  );
}

/**
 * Gửi một bản ghi tới `LEAD_WEBHOOK_URL`. Không ném lỗi — trả kết quả.
 *
 * ⚠️ TOKEN ĐI TRONG HEADER, KHÔNG TRONG URL (thêm 11/09). Đích thật là cổng nhận
 * khách của Antigravity, xác thực bằng `Authorization: Bearer`. Token trong
 * query string nằm trong log truy cập của mọi lớp ở giữa — Caddy, Vercel,
 * proxy — còn header thì không. Không đặt `LEAD_WEBHOOK_TOKEN` thì không gửi
 * header, đích khác (Apps Script, n8n…) vẫn dùng như cũ.
 */
async function guiWebhook(
  banGhi: Record<string, string>,
  nguon: string,
): Promise<{ ok: true } | { ok: false; loi: string }> {
  const token = process.env.LEAD_WEBHOOK_TOKEN?.trim();
  try {
    const phanHoi = await fetch(process.env.LEAD_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...banGhi, nguon }),
      signal: AbortSignal.timeout(10_000),
    });
    if (phanHoi.ok) return { ok: true };
    // 401 mà hộp chứa không có token: nói thẳng nguyên nhân trong log. Lỗi thật
    // 12/09 — compose quên chuyển biến này vào, log chỉ ghi "HTTP 401".
    const thieuToken = phanHoi.status === 401 && !token ? " — hộp chứa không thấy LEAD_WEBHOOK_TOKEN" : "";
    return { ok: false, loi: `HTTP ${phanHoi.status}${thieuToken}` };
  } catch (loi) {
    return { ok: false, loi: loi instanceof Error ? loi.message : String(loi) };
  }
}

async function rutKhachTon(): Promise<void> {
  try {
    const kq = await dayKhachTon(path.join(process.cwd(), ".data"), async (b) =>
      // Đánh dấu nguồn để chủ trang biết dòng này đến MUỘN — gọi lại khách của
      // ba tuần trước khác với gọi lại khách của ba phút trước.
      (await guiWebhook(b, "halongxanh360.vn · gửi bù")).ok,
    );
    if (kq && (kq.daGui > 0 || kq.conTon > 0)) {
      console.info(
        `[dang-ky] Đẩy bù: đã gửi ${kq.daGui}, còn tồn ${kq.conTon}, bỏ qua ${kq.boQua} dòng hỏng.`,
      );
    }
  } catch (loi) {
    // `after` chạy sau khi đã trả lời khách — lỗi ở đây không được làm gì khác
    // ngoài ghi log. Hàng đợi vẫn nguyên, lần sau rút tiếp.
    console.error("[dang-ky] Đẩy bù lỗi:", loi instanceof Error ? loi.message : loi);
  }
}

async function chuyenTiep(banGhi: Record<string, string>): Promise<DichDen> {
  const dich = chonDichDen();

  if (dich === "webhook") {
    const kq = await guiWebhook(banGhi, "halongxanh360.vn");
    if (kq.ok) {
      // Gửi được một khách mới nghĩa là đích đang sống — rút luôn hàng đợi
      // khách tồn trong tệp (khách từ trước khi có webhook, và khách rơi về tệp
      // lúc webhook hỏng). Chạy SAU khi đã trả lời khách này: họ không phải chờ
      // vì những người trước họ. Xem `day-khach-ton.ts`.
      if (!process.env.VERCEL) after(rutKhachTon);
      return dich;
    }
    const loiWebhook = kq.loi;

    // ⚠️ WEBHOOK HỎNG THÌ RƠI VỀ TỆP, KHÔNG ĐÁNH RƠI KHÁCH (thêm 11/09).
    //
    // Trước đây webhook trả không-ok là ném lỗi, khách thấy "chưa gửi được",
    // và số điện thoại biến mất — không nằm ở đâu cả. Mà đích webhook giờ đi
    // qua ba lớp có thể hỏng độc lập: Antigravity, token Google của chủ trang,
    // và API Sheets. Hỏng một lớp là mất trắng khách trong lúc hỏng.
    //
    // Trên máy chủ riêng, `.data/` có gắn ổ đĩa (docker-compose) nên sống qua
    // mọi lần deploy — ghi vào đó là GIỮ ĐƯỢC khách, nên báo "đã nhận" với
    // khách là nói thật. Trên Vercel không có đường ghi, nên vẫn báo lỗi như
    // cũ để khách gọi trực tiếp.
    if (process.env.VERCEL) {
      throw new Error(`Hệ thống tiếp nhận lỗi (${loiWebhook})`);
    }
    await ghiTep(banGhi);
    // Nói to trong log — đây là lúc cần có người để ý. Không ghi số điện
    // thoại vào log: log không phải chỗ chứa dữ liệu khách.
    console.error(
      `[dang-ky] WEBHOOK LỖI (${loiWebhook}) — đã giữ khách trong .data/dang-ky.jsonl. ` +
        "Kiểm bảng Google Sheets / kết nối Google trong Antigravity.",
    );
    return "fileCucBo";
  }

  if (dich === "xemThu") {
    // KHÔNG ghi thông tin cá nhân của khách vào nhật ký máy chủ. Nhật ký Vercel
    // ai có quyền vào bảng điều khiển cũng đọc được, và đây là số điện thoại
    // thật của người thật. Chỉ ghi lại đúng việc là "có người vừa gửi".
    console.info("[dang-ky] Bản xem thử — đã nhận một lượt gửi, không lưu lại.");
    return dich;
  }

  await ghiTep(banGhi);
  console.warn(
    "[dang-ky] Chưa đặt LEAD_WEBHOOK_URL — đã ghi tạm vào .data/dang-ky.jsonl. " +
      "KHÔNG dùng được ở môi trường thật.",
  );
  return dich;
}

export async function guiDangKy(
  _truoc: KetQuaDangKy,
  duLieu: FormData,
): Promise<KetQuaDangKy> {
  // ⚠️ CHỈ HAI Ô BẮT BUỘC: số điện thoại và điều ưu tiên nhất.
  //
  // Họ tên chuyển thành TUỲ CHỌN, và đó là một thay đổi có chủ ý chứ không
  // phải nới lỏng cho dễ. Người mua bất động sản tiền tỷ thường dè dặt để lại
  // tên ở lần chạm đầu, trong khi số điện thoại thì họ sẵn sàng — vì họ muốn
  // được gọi. Bắt buộc điền tên là dựng một rào chắn ngay trước đúng thứ mình
  // cần nhất, để đổi lấy một trường mà tư vấn viên sẽ hỏi trong ba giây đầu
  // cuộc gọi.
  const dienThoaiTho = String(duLieu.get("dienThoai") ?? "").trim();
  const uuTien = String(duLieu.get("uuTien") ?? "").trim();
  const hoTen = String(duLieu.get("hoTen") ?? "").trim();
  const quanTam = String(duLieu.get("quanTam") ?? "").trim();
  const ghiChu = String(duLieu.get("ghiChu") ?? "").trim();

  const loiTruong: KetQuaDangKy["loiTruong"] = {};
  const dienThoai = chuanHoaSoDienThoai(dienThoaiTho);
  if (!dienThoai) {
    loiTruong.dienThoai = "Số điện thoại chưa đúng định dạng.";
  }
  if (!DIEU_UU_TIEN.includes(uuTien as (typeof DIEU_UU_TIEN)[number])) {
    loiTruong.uuTien = "Chọn giúp một điều bạn quan tâm nhất.";
  }
  if (Object.keys(loiTruong).length > 0) {
    return { trangThai: "loi", loiTruong };
  }

  let dich: DichDen;
  try {
    dich = await chuyenTiep({
      dienThoai: dienThoai!,
      uuTien,
      hoTen,
      quanTam,
      ghiChu: ghiChu.slice(0, 1_000),
      thoiDiem: new Date().toISOString(),
    });
  } catch (loi) {
    // Không đưa chi tiết kỹ thuật ra ngoài, nhưng phải ghi log để còn truy được.
    console.error("[dang-ky] Không chuyển tiếp được:", loi);
    return {
      trangThai: "loi",
      thongBao:
        "Hiện chưa gửi được thông tin. Bạn vui lòng thử lại hoặc gọi trực tiếp cho đội ngũ tư vấn.",
    };
  }

  // Ở bản xem thử phải NÓI THẲNG là không lưu. Hiện "đội ngũ tư vấn sẽ liên hệ"
  // rồi chẳng ai gọi lại là nói dối với người thật — kể cả khi họ chỉ đang xem
  // thử giúp mình.
  if (dich === "xemThu") {
    return {
      trangThai: "thanhCong",
      thongBao:
        "Biểu mẫu chạy đúng. Đây là bản xem thử nên thông tin KHÔNG được lưu lại và sẽ không có ai liên hệ.",
    };
  }

  return {
    trangThai: "thanhCong",
    thongBao:
      "Đã nhận. Tôi sẽ đối chiếu quỹ căn và chính sách đang áp dụng, rồi gọi lại với một phương án thực trả cụ thể.",
  };
}
