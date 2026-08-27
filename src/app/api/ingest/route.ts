import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { timingSafeEqual } from "node:crypto";
import path from "node:path";
import type { BaiViet } from "@/data/news";
import { layDb, schema } from "@/db";
import { moTaViPham, quetBai } from "@/lib/cong-chan";
import { demMotLuot } from "@/lib/gioi-han-tan-suat";

// Cổng nhận bài từ Antigravity.
//
// ĐÂY LÀ MẢNH GHÉP NỐI HAI HỆ THỐNG. Bên Antigravity, bộ đẩy bài gom nội dung
// từ các module rồi POST tới đây; kiểu `BaiViet` trong `src/data/news.ts` chính
// là hợp đồng giữa hai bên.
//
// Nguyên tắc thiết kế: THÀ TỪ CHỐI CÒN HƠN NHẬN RỒI ĐÁNH RƠI. Chưa cấu hình nơi
// lưu thì trả lỗi rõ ràng, để bên gửi biết mà giữ lại bài và thử lại — im lặng
// trả 200 rồi mất bài là kiểu hỏng khó truy nhất.

const KICH_THUOC_TOI_DA = 512 * 1024; // 512KB — một bài dài nhất cũng không tới

const CHUYEN_MUC_HOP_LE: BaiViet["chuyenMuc"][] = [
  "Tiến độ",
  "Chính sách",
  "Sự kiện",
  "Thị trường",
];

/**
 * So sánh token theo thời gian hằng số.
 *
 * So bằng `===` để lộ độ dài phần khớp qua thời gian chạy, đủ để dò dần ra
 * token. Ở đây rẻ nên không có lý do gì không làm đúng.
 */
function tokenKhop(nhanDuoc: string, mongDoi: string): boolean {
  const a = Buffer.from(nhanDuoc, "utf8");
  const b = Buffer.from(mongDoi, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function kiemTra(du: unknown): { hopLe: true; bai: BaiViet } | { hopLe: false; loi: string } {
  if (typeof du !== "object" || du === null) {
    return { hopLe: false, loi: "Thân yêu cầu phải là một đối tượng JSON." };
  }
  const o = du as Record<string, unknown>;

  const chuoi = (khoa: string, batBuoc: boolean, toiDa: number) => {
    const giaTri = o[khoa];
    if (giaTri === undefined || giaTri === "") {
      return batBuoc ? null : "";
    }
    if (typeof giaTri !== "string" || giaTri.length > toiDa) return null;
    return giaTri;
  };

  const slug = chuoi("slug", true, 200);
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { hopLe: false, loi: "`slug` phải là chữ thường, số và dấu gạch nối." };
  }
  const tieuDe = chuoi("tieuDe", true, 300);
  if (!tieuDe) return { hopLe: false, loi: "Thiếu `tieuDe`." };
  const moTa = chuoi("moTa", true, 600);
  if (!moTa) return { hopLe: false, loi: "Thiếu `moTa`." };

  // ⚠️ CHUẨN HOÁ VỀ ĐÚNG 10 KÝ TỰ `YYYY-MM-DD`, không chỉ kiểm là ngày hợp lệ.
  //
  // Cột `ngay_dang` trong cơ sở dữ liệu là `varchar(10)`. Cửa kiểm này từng
  // cho qua tới 30 ký tự, nên một chuỗi ISO đầy đủ như
  // "2026-08-24T09:03:55.826Z" (24 ký tự) đi lọt qua đây rồi VỠ Ở POSTGRES với
  // lỗi vượt độ dài — bài không bao giờ vào được hàng chờ, mà bên gửi thì nhận
  // lỗi 500 chung chung không nói được sai ở đâu.
  //
  // Cắt về phần ngày là cách đúng chứ không phải nới cột: bảng tin sắp xếp và
  // so sánh theo chuỗi ngày, nên phần giờ vừa vô dụng vừa làm hỏng thứ tự.
  const ngayTho = chuoi("ngayDang", true, 30);
  if (!ngayTho || Number.isNaN(new Date(ngayTho).getTime())) {
    return { hopLe: false, loi: "`ngayDang` phải là ngày hợp lệ dạng ISO." };
  }
  const ngayDang = ngayTho.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngayDang)) {
    return {
      hopLe: false,
      loi: "`ngayDang` phải bắt đầu bằng YYYY-MM-DD.",
    };
  }

  const chuyenMuc = o.chuyenMuc;
  if (!CHUYEN_MUC_HOP_LE.includes(chuyenMuc as BaiViet["chuyenMuc"])) {
    return {
      hopLe: false,
      loi: `\`chuyenMuc\` phải là một trong: ${CHUYEN_MUC_HOP_LE.join(", ")}.`,
    };
  }

  const noiDung = chuoi("noiDung", false, KICH_THUOC_TOI_DA);
  if (noiDung === null) return { hopLe: false, loi: "`noiDung` quá dài." };

  return {
    hopLe: true,
    bai: {
      slug,
      tieuDe,
      moTa,
      ngayDang,
      chuyenMuc: chuyenMuc as BaiViet["chuyenMuc"],
      ...(noiDung ? { noiDung } : {}),
    },
  };
}

export async function POST(yeuCau: Request) {
  // ═══════════════════════════════════════════════════════════════════════
  // GIỚI HẠN TẦN SUẤT — ĐẶT TRƯỚC PHẦN KIỂM KHOÁ, VÀ THỨ TỰ ĐÓ LÀ CHỦ ĐÍCH.
  //
  // Khoá `INGEST_TOKEN` là thứ DUY NHẤT ngăn người lạ ghi bài lên trang. So
  // sánh khoá đã chống được tấn công đo thời gian (`timingSafeEqual`), nhưng
  // nó không chống được cách tấn công thô sơ hơn: cứ thử, hàng nghìn lần một
  // giây, tới khi trúng.
  //
  // Đếm SAU khi kiểm khoá thì bộ đếm không bao giờ chạy cho kẻ đoán sai — tức
  // là không chặn được gì. Đếm TRƯỚC thì mọi lượt thử đều tính, kể cả lượt
  // sai. Đó mới là chỗ cần chặn.
  //
  // 20 lượt/phút: Antigravity đăng vài bài một ngày, nên hạn mức này rộng gấp
  // nhiều lần nhu cầu thật. Với máy dò thì nó biến việc thử một khoá 64 ký tự
  // thành việc không bao giờ xong.
  //
  // Trả 429 kèm `Retry-After` — khác 401. Bên gọi phân biệt được "khoá sai"
  // với "gửi quá nhanh", nên bộ đẩy bài bên Antigravity báo đúng nguyên nhân
  // thay vì bảo người dùng đi kiểm lại khoá đang đúng.
  // ═══════════════════════════════════════════════════════════════════════
  const nhip = demMotLuot("ingest", yeuCau, 20, 60);
  if (nhip.vuot) {
    return NextResponse.json(
      { loi: "Gửi quá nhanh. Chờ một lát rồi thử lại." },
      { status: 429, headers: { "Retry-After": String(nhip.choGiay) } },
    );
  }

  const token = process.env.INGEST_TOKEN;
  if (!token) {
    // 503 chứ không phải 500: đây là chưa cấu hình, không phải hỏng.
    return NextResponse.json(
      { loi: "Cổng nhận bài chưa được cấu hình (thiếu INGEST_TOKEN)." },
      { status: 503 },
    );
  }

  const header = yeuCau.headers.get("authorization") ?? "";
  const nhanDuoc = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!nhanDuoc || !tokenKhop(nhanDuoc, token)) {
    return NextResponse.json({ loi: "Không có quyền." }, { status: 401 });
  }

  let than: unknown;
  try {
    than = await yeuCau.json();
  } catch {
    return NextResponse.json({ loi: "JSON không hợp lệ." }, { status: 400 });
  }

  const ketQua = kiemTra(than);
  if (!ketQua.hopLe) {
    return NextResponse.json({ loi: ketQua.loi }, { status: 422 });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // HÀNG RÀO TỰ ĐỘNG — chạy TRƯỚC khi bài chạm tới hàng chờ.
  //
  // Hàng chờ duyệt đã là một hàng rào, và nó là hàng rào tốt. Nhưng nó là hàng
  // rào của con người, nên nó mòn: bài thứ ba mươi trông giống hệt hai mươi
  // chín bài trước, và mắt người trượt qua đúng chỗ đáng dừng lại.
  //
  // Luật ở `lib/cong-chan.ts` chia làm hai nhóm, và chỉ nhóm CHẶN dừng ở đây.
  // Nhóm CỜ đi tiếp vào hàng chờ và hiện lên ở màn duyệt — vì máy không kết
  // luận được "5,2 tỷ" là đúng hay bịa, chỉ người mở bảng hàng ra mới biết.
  //
  // 403 chứ không phải 422: yêu cầu đúng khuôn, chỉ là NỘI DUNG không được
  // phép. Phân biệt hai mã này để bên gửi biết nên sửa dữ liệu hay sửa bài.
  // ═══════════════════════════════════════════════════════════════════════
  const quet = quetBai(ketQua.bai);
  if (quet.chan.length > 0) {
    // Ghi lại để chủ trang biết đường ống đã chặn cái gì. Đây là chỗ duy nhất
    // còn dấu vết — bài bị chặn không vào cơ sở dữ liệu, nên không có gì để
    // xem lại sau này nếu dòng này không tồn tại.
    console.warn(
      `[ingest] CHẶN bài "${ketQua.bai.slug}": ` +
        quet.chan.map((v) => v.luat).join(", "),
    );
    return NextResponse.json(
      {
        loi:
          "Nội dung chạm luật cấm của trang nên KHÔNG được nhận. Đây không " +
          "phải lỗi kỹ thuật — sửa bài rồi gửi lại.",
        viPham: quet.chan,
        chiTiet: moTaViPham(quet.chan),
      },
      { status: 403 },
    );
  }


  const db = layDb();
  try {
    if (db) {
      // ĐĂNG LẠI CÙNG SLUG LÀ SỬA BÀI, không phải tạo bài mới. Antigravity có
      // thể gửi lại một bài sau khi biên tập, hoặc gửi lại vì lần trước hết
      // thời gian chờ mà thật ra đã ghi thành công. Cả hai trường hợp đều phải
      // ra cùng một kết quả — nếu không, thử lại một lần là trang tin có hai
      // bài giống hệt nhau.
      await db
        .insert(schema.baiViet)
        .values({
          slug: ketQua.bai.slug,
          tieuDe: ketQua.bai.tieuDe,
          moTa: ketQua.bai.moTa,
          ngayDang: ketQua.bai.ngayDang,
          chuyenMuc: ketQua.bai.chuyenMuc,
          noiDung: ketQua.bai.noiDung ?? null,
        })
        .onConflictDoUpdate({
          target: schema.baiViet.slug,
          set: {
            tieuDe: ketQua.bai.tieuDe,
            moTa: ketQua.bai.moTa,
            ngayDang: ketQua.bai.ngayDang,
            chuyenMuc: ketQua.bai.chuyenMuc,
            noiDung: ketQua.bai.noiDung ?? null,
            // ⚠️ SỬA BÀI LÀ RÚT VỀ CHỜ DUYỆT LẠI, kể cả bài đã đăng.
            //
            // Không có dòng này thì đường vòng qua hàng rào rất rẻ: gửi một bài
            // vô hại, đợi duyệt, rồi gửi lại cùng `slug` với nội dung khác —
            // nội dung mới lên thẳng trang vì bài đã ở trạng thái "dang".
            //
            // Cái giá phải trả là chủ trang duyệt lại mỗi lần sửa. Đó là cái
            // giá đúng: nội dung đổi thì lời cam kết "đã có người đọc bài này"
            // cũng phải được làm lại.
            trangThai: "cho",
            duyetLuc: null,
            capNhatLuc: new Date(),
          },
        });
    } else {
      // Đường CỤC BỘ. Chỉ chạy khi chưa có `DATABASE_URL` — tức là trên máy của
      // người phát triển. Trên máy chủ thật mà rơi vào đây thì bài sẽ mất sau
      // lần triển khai kế tiếp, nên có một dòng cảnh báo rõ ràng trong nhật ký.
      if (process.env.NODE_ENV === "production") {
        console.warn(
          "[ingest] CẢNH BÁO: thiếu DATABASE_URL, đang ghi ra file tạm. " +
            "Bài sẽ MẤT khi triển khai lại. Hãy cấu hình DATABASE_URL.",
        );
      }
      const thuMuc = path.join(process.cwd(), ".data");
      await mkdir(thuMuc, { recursive: true });
      // ⚠️ PHẢI GHI CẢ `trangThai`. Thiếu nó thì đường file đi vòng qua hàng
      // rào duyệt: bài hiện thẳng ở `/tin-tuc` mà không ai bấm gì.
      //
      // Đo được trước khi sửa: gửi một bài qua cổng này khi chưa có
      // DATABASE_URL thì nó lên trang ngay lập tức. Hàng rào chỉ chặn ở đường
      // cơ sở dữ liệu, tức là chỉ chặn khi cấu hình đã đúng — đúng lúc ít cần
      // nhất. Chỗ hỏng nào cũng phải hỏng về phía AN TOÀN.
      await appendFile(
        path.join(thuMuc, "bai-viet.jsonl"),
        `${JSON.stringify({
          ...ketQua.bai,
          trangThai: "cho",
          nhanLuc: new Date().toISOString(),
        })}\n`,
        "utf8",
      );
    }
  } catch (loi) {
    // KHÔNG in nội dung lỗi gốc ra phản hồi: chuỗi kết nối cơ sở dữ liệu hay
    // lọt vào thông báo lỗi của trình điều khiển, mà phản hồi này đi ra ngoài.
    console.error("[ingest] Không lưu được bài:", loi);
    return NextResponse.json(
      { loi: "Không lưu được bài. Vui lòng gửi lại." },
      { status: 500 },
    );
  }

  // Nói RÕ trong phản hồi rằng bài chưa lên trang. Trả `{ok:true}` trống rồi để
  // bên gửi tự hiểu là "đã đăng" sẽ khiến Antigravity báo thành công, chủ trang
  // đi mở `/tin-tuc` không thấy gì, và mất nửa buổi đi tìm một lỗi không có.
  return NextResponse.json(
    {
      ok: true,
      slug: ketQua.bai.slug,
      trangThai: "cho",
      canhBao: quet.co,
      thongBao:
        "Đã nhận bài và đưa vào hàng chờ duyệt. Bài CHƯA hiện trên trang — " +
        "cần chủ trang duyệt tại /duyet-bai." +
        (quet.co.length > 0
          ? ` Có ${quet.co.length} chỗ cần đối chiếu trước khi duyệt: ${quet.co
              .map((v) => v.luat)
              .join(", ")}.`
          : ""),
    },
    { status: 201 },
  );
}
