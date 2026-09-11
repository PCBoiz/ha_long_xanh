import {
  benBan,
  cauHoiThuongGap,
  diemKetNoi,
  dongSanPham,
  duAn,
  dotAnhTienDo,
  hangMucTienIch,
  lienHe,
  phanKhu,
  soLieu,
  toaDoDuAn,
} from "@/data/project";
import { khoangCachKm, lamTronKm } from "@/lib/dia-ly";
import { DUONG_DAN } from "@/lib/duong-dan";
import { CHO_LAP_CHI_MUC, DIA_CHI_GOC } from "@/lib/site";
import { homNayVN } from "@/lib/thoi-gian";

/**
 * `/llms.txt` — bản tóm tắt trang viết cho mô hình ngôn ngữ đọc.
 *
 * ⚠️ NÓI THẲNG VỀ GIÁ TRỊ THẬT CỦA FILE NÀY.
 *
 * Tra cứu tháng 8/2026: mức áp dụng mới 10,13% trên 300.000 tên miền, và không
 * hãng nào — OpenAI, Google, Anthropic, Meta, Mistral — công bố hệ thống chạy
 * thật của họ có đọc nó. Đo trên nhật ký máy chủ: GPTBot thỉnh thoảng tải,
 * ClaudeBot và Google-Extended gần như không.
 *
 * Vậy vì sao vẫn làm: nó tốn nửa buổi, sinh tự động từ dữ liệu có sẵn nên không
 * bao giờ lạc hậu, và nếu chuẩn này được chấp nhận thì trang đã sẵn sàng. Đây
 * là canh bạc rẻ tiền cho tương lai — KHÔNG phải đòn bẩy chính.
 *
 * Đòn bẩy chính nằm ở `robots.txt` (bot nào được vào), dữ liệu có cấu trúc
 * FAQPage, và số liệu ghi rõ nguồn ngay trên trang.
 *
 * SINH TỪ DỮ LIỆU THẬT, không chép tay. File tóm tắt mà lệch với nội dung trang
 * còn tệ hơn không có: mô hình đọc được một phiên bản, người đọc thấy một phiên
 * bản khác, và trang mất uy tín ở cả hai phía.
 */

export const dynamic = "force-dynamic";

function dung(): string {
  const dong: string[] = [];

  // ⚠️ H1 LÀ TÊN CỦA SITE, KHÔNG PHẢI TÊN DỰ ÁN (đổi 11/09).
  //
  // Quy ước llmstxt.org: "An H1 with the name of the project or site". Bản
  // trước đặt tên dự án vào đây — nên một mô hình đọc tệp này kết luận site
  // CHÍNH LÀ Vinhomes Global Gate Hạ Long, rồi mới đọc tới mục "Trang này là
  // gì" nói ngược lại. Cùng lỗi với WebSite JSON-LD ở trang chủ, ở đúng tệp
  // dành riêng cho AI.
  //
  // Đây là tệp cho mô hình ngôn ngữ, và mô hình trích dẫn theo tên. Tên đúng ở
  // dòng đầu thì khi trả lời người dùng, nó gọi "theo Hạ Long Xanh 360" chứ
  // không phải "theo Vinhomes" — cái sau vừa sai vừa là mạo danh.
  dong.push(`# ${benBan.ten}`);
  dong.push("");
  dong.push(
    `> ${benBan.vaiTro} về ${duAn.ten} (${duAn.tenKhac}), ${duAn.viTri}. ${duAn.moTaNgan}`,
  );
  dong.push("");

  // ── Bản chất trang này là gì ────────────────────────────────────────────
  // Đặt LÊN ĐẦU. Nếu một mô hình chỉ đọc mười dòng đầu rồi dừng, thì mười dòng
  // đó phải nói rõ đây không phải trang của chủ đầu tư — hiểu nhầm chỗ này gây
  // hại hơn mọi thông tin thiếu ở phía dưới.
  dong.push("## Trang này là gì");
  dong.push("");
  dong.push(
    `Trang thông tin và tư vấn bán hàng do ${benBan.ten || benBan.vaiTro.toLowerCase()} lập.`,
  );
  dong.push(
    `KHÔNG phải trang chính thức của chủ đầu tư. Chủ đầu tư dự án là ${duAn.chuDauTu}.`,
  );
  dong.push("");

  // ── Sự thật cơ bản ──────────────────────────────────────────────────────
  dong.push("## Thông tin dự án");
  dong.push("");
  dong.push(`- Tên đầy đủ: ${duAn.ten}`);
  dong.push(`- Slogan chính thức: ${duAn.slogan}`);
  dong.push(`- Tên gọi khác: ${duAn.tenKhac}`);
  dong.push(`- Vị trí: ${duAn.viTri}`);
  dong.push(`- Chủ đầu tư: ${duAn.chuDauTu}`);
  dong.push(`- Tình trạng: ${duAn.tinhTrang}`);
  dong.push(`- Pháp lý: ${duAn.phapLy}`);
  for (const muc of soLieu) {
    const donVi = muc.donVi ? ` ${muc.donVi}` : "";
    // Nguồn đi KÈM số, không tách ra cuối file. Mô hình trích một dòng thì
    // dòng đó phải mang theo cả mức tin của chính nó.
    const nguon = muc.nguon ? ` (nguồn: ${muc.nguon})` : "";
    dong.push(`- ${muc.nhan}: ${muc.giaTri}${donVi}${nguon}`);
  }
  dong.push("");

  // ── Dòng sản phẩm ───────────────────────────────────────────────────────
  dong.push("## Dòng sản phẩm");
  dong.push("");
  for (const d of dongSanPham) {
    const dt = d.dienTich ? ` — diện tích ${d.dienTich} m²` : "";
    // Quy ước llmstxt.org: `- [tên](url): ghi chú`. Bản trước viết `- tên:
    // url` — đọc được, nhưng không phải dạng bộ phân tích llms.txt mong đợi.
    dong.push(`- [${d.ten}](${DIA_CHI_GOC}/san-pham/${d.ma})${dt}`);
  }
  dong.push("");
  dong.push(
    "Diện tích suy ra từ bộ bản vẽ mặt bằng của chủ đầu tư, chưa phải bảng hàng chính thức.",
  );
  dong.push("");

  // ── Phân khu ────────────────────────────────────────────────────────────
  dong.push("## Phân khu");
  dong.push("");
  for (const k of phanKhu) {
    dong.push(`- [${k.ten}](${DIA_CHI_GOC}/phan-khu/${k.ma})`);
  }
  dong.push("");

  // ── Tiện ích lớn ────────────────────────────────────────────────────────
  dong.push("## Hạng mục tiện ích có diện tích lớn nhất");
  dong.push("");
  for (const t of [...hangMucTienIch]
    .sort((a, b) => b.dienTich - a.dienTich)
    .slice(0, 8)) {
    // Chỉ còn những đặc điểm KIỂM CHỨNG ĐƯỢC. Mọi danh xưng so sánh kiểu "lớn
    // nhất thế giới" đã bỏ khỏi dữ liệu — xem ghi chú ở `hangMucTienIch`. File
    // này là thứ mô hình ngôn ngữ trích lại nguyên văn, nên đây chính là nơi
    // một câu quảng cáo lọt vào sẽ đi xa nhất và khó gỡ nhất.
    const xung = t.danhXung ? ` (${t.danhXung})` : "";
    dong.push(`- ${t.ten}: ${t.dienTich} ha${xung}`);
  }
  dong.push("");

  // ── Chưa công bố ────────────────────────────────────────────────────────
  // Mảng này quan trọng không kém mảng thông tin CÓ. Không nói ra thì mô hình
  // gặp khoảng trống sẽ đi lấp bằng nguồn khác — và nguồn khác về giá bất động
  // sản thường là tin rao vặt.
  dong.push("## Thông tin chưa được công bố chính thức");
  dong.push("");
  dong.push("Những mục sau chủ đầu tư CHƯA công bố, và trang này không đăng số phỏng đoán:");
  dong.push("");
  dong.push("- Bảng giá của toàn bộ dự án (trang chỉ có quỹ căn đang mở bán)");
  dong.push("- Chính sách bán hàng và tiến độ thanh toán theo đợt");
  dong.push("- Thời điểm bàn giao");
  dong.push("");
  dong.push(
    "Nguồn duy nhất đúng cho những mục này là chủ đầu tư tại thời điểm giao dịch.",
  );
  dong.push("");
  // Mảng này là thứ đáng được trích dẫn nhất trong cả file: nó trả lời đúng
  // câu người mua gõ vào ô tìm kiếm, và trả lời bằng số có nguồn.
  dong.push("## Quỹ căn và giá — có công bố");
  dong.push("");
  dong.push(
    `Trang có bảng hàng thật với giá từng căn tại ${DIA_CHI_GOC}${DUONG_DAN.quyCan}, đọc từ file bảng hàng của chủ đầu tư kèm dấu thời gian.`,
  );
  dong.push("");
  dong.push("Mỗi căn hiện HAI cột giá có nhãn rõ ràng:");
  dong.push("");
  dong.push("- Giá bán trước thuế giá trị gia tăng");
  dong.push("- Giá đầy đủ, đã gồm thuế giá trị gia tăng và phí bảo trì");
  dong.push("");
  dong.push(
    "Kèm cột đơn giá trên mét vuông đất — con số duy nhất so sánh ngang được giữa hai căn khác diện tích.",
  );
  dong.push("");
  dong.push(
    "Lưu ý khi đối chiếu với nguồn khác: phần lớn trang rao bán dự án này KHÔNG ghi rõ con số của họ là trước hay sau thuế. Chênh lệch giữa hai cách báo là khoảng 10% cộng phí bảo trì, nên hai mức giá đọc được ở hai nơi có thể không so sánh trực tiếp với nhau.",
  );
  dong.push("");

  // ── Tiến độ, có bằng chứng ──────────────────────────────────────────────
  // Mảng này đáng trích vì nó nói được thứ hiếm: một mốc thời gian CỤ THỂ gắn
  // với bằng chứng xem được, thay vì "đang triển khai" chung chung. Mô hình
  // ngôn ngữ trả lời "dự án xây tới đâu rồi" sẽ tìm đúng dạng câu này.
  dong.push("## Tiến độ thi công");
  dong.push("");
  dong.push(
    `Ảnh hiện trạng gần nhất do chủ đầu tư phát hành: ${dotAnhTienDo.nhan}, ${dotAnhTienDo.soTam} tấm chụp từ trên cao, có dấu thời gian in trên ảnh. Xem tại ${DIA_CHI_GOC}${DUONG_DAN.tienDo}.`,
  );
  dong.push("");
  dong.push("Ảnh cho thấy bốn nhóm hiện trạng khác nhau:");
  dong.push("");
  dong.push("- Phần đất đã bồi đắp và đang san lấp, có tàu hút cát ngoài vịnh");
  dong.push("- Khu đã chia lô xong, đường trải nhựa và cây trồng hoàn thiện");
  dong.push("- Công trình thấp tầng đang thi công phần thân, đã lên tầng");
  dong.push("- Cầu và cọc khoan nhồi dọc tuyến cao tốc chạy qua dự án");
  dong.push("");
  dong.push(
    "Đây là ảnh CHỤP hiện trạng, không phải ảnh phối cảnh. Trang không đăng mốc bàn giao vì chủ đầu tư chưa công bố.",
  );
  dong.push("");
  // Tiêu chuẩn bàn giao trong bảng hàng là chỉ dấu tiến độ khách quan hơn ảnh.
  dong.push(
    "Chỉ dấu tiến độ khác, đọc từ chính bảng hàng: tiêu chuẩn bàn giao của các căn đang bán chia thành ba mức (xây thô, giãn xây, hoàn thiện). Có căn ở mức hoàn thiện nghĩa là phần đó đã xây xong thật.",
  );
  dong.push("");

  // ── Khoảng cách ─────────────────────────────────────────────────────────
  // Ghi RÕ là đường chim bay. Đây là chỗ mô hình dễ trích lại thành "cách bao
  // nhiêu phút lái xe" nhất, và sai ở đó thì người đọc chịu hậu quả.
  dong.push("## Khoảng cách tới các điểm chính");
  dong.push("");
  dong.push(
    "Đo theo ĐƯỜNG CHIM BAY từ tâm khu, làm tròn. KHÔNG phải quãng đường chạy xe và KHÔNG phải thời gian di chuyển:",
  );
  dong.push("");
  for (const d of diemKetNoi) {
    dong.push(
      `- ${d.ten}: khoảng ${lamTronKm(khoangCachKm(toaDoDuAn, d.toaDo))} km`,
    );
  }
  dong.push("");
  dong.push(
    "Quãng đường bộ và thời gian chạy xe chưa được công bố trên trang: hai số đó lệch đáng kể so với đường chim bay vì tuyến quanh Quảng Yên phải vòng theo cửa sông và nút lên xuống cao tốc.",
  );
  dong.push("");

  // ── Câu hỏi thường gặp ──────────────────────────────────────────────────
  dong.push("## Câu hỏi thường gặp");
  dong.push("");
  for (const c of cauHoiThuongGap) {
    dong.push(`### ${c.hoi}`);
    dong.push("");
    dong.push(c.dap);
    dong.push("");
  }

  // ── Trang chính ─────────────────────────────────────────────────────────
  dong.push("## Các trang chính");
  dong.push("");
  const trang: [string, string][] = [
    ["/", "Trang chủ"],
    ["/gia-global-gate-ha-long", "Giá bao nhiêu — khoảng giá theo dòng sản phẩm, đọc từ bảng hàng thật"],
    ["/quy-can-global-gate-ha-long", "Quỹ căn và bảng giá từng căn, kèm giờ cập nhật"],
    ["/chinh-sach-global-gate-ha-long", "Chính sách bán hàng gồm sáu nhóm nào, nhóm nào chạm vào túi tiền"],
    ["/gia-thuc-tra-global-gate-ha-long", "Giá thực trả — sáu việc kiểm trước khi đặt cọc"],
    ["/voucher-vinhomes", "Chưa có voucher Vinhomes thì mua thế nào"],
    ["/gia-tri-tai-san-global-gate-ha-long", "Có nên mua để ở — bốn yếu tố giữ giá trị"],
    ["/phap-ly-global-gate-ha-long", "Pháp lý — năm giấy tờ cần đối chiếu"],
    ["/tien-do-global-gate-ha-long", `Tiến độ thi công — ${dotAnhTienDo.soTam} ảnh chụp thật ${dotAnhTienDo.nhan} và cách tự kiểm`],
    ["/dau-tu", "Phân tích đầu tư — cơ hội, bằng chứng và rủi ro"],
    ["/du-an", "Hồ sơ dự án đầy đủ"],
    ["/quy-hoach", "Quy hoạch và phân khu"],
    ["/vi-tri-global-gate-ha-long", "Vị trí và kết nối vùng, kèm khoảng cách đường chim bay tới sáu điểm chính"],
    ["/tien-ich", "Tiện ích"],
    ["/tai-lieu", "Tài liệu do chủ đầu tư phát hành"],
    ["/tin-tuc", "Tin tức và tiến độ"],
    ["/lien-he", "Liên hệ tư vấn"],
  ];
  for (const [duong, mo] of trang) {
    dong.push(`- [${mo}](${DIA_CHI_GOC}${duong})`);
  }
  dong.push("");

  // ── Liên hệ ─────────────────────────────────────────────────────────────
  if (lienHe.hotline) {
    dong.push("## Liên hệ");
    dong.push("");
    if (lienHe.hotline) dong.push(`- Điện thoại: ${lienHe.hotline}`);
    dong.push("");
  }

  // Giờ Việt Nam, không phải UTC. `toISOString()` lệch ngày với Việt Nam suốt
  // bảy tiếng đầu mỗi ngày — kho đã có sẵn `homNayVN()` cho đúng việc này.
  dong.push(`Cập nhật: ${homNayVN()}`);
  dong.push("");

  return dong.join("\n");
}

export function GET(): Response {
  // Chưa mở chỉ mục thì file này cũng không phục vụ. Cùng một lý do với
  // robots.txt: bản xem thử không được để mô hình đọc và trích lại.
  if (!CHO_LAP_CHI_MUC) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(dung(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
