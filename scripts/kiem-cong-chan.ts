/**
 * Kiểm cổng chặn nội dung.
 *
 *     npm run kiem-cong-chan
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CỔNG NÀY CẦN MỘT BỘ KIỂM RIÊNG
 *
 * Nó là thứ duy nhất đứng giữa một mô hình ngôn ngữ và trang công khai. Sai
 * theo hướng LỎNG thì một câu bịa lên trang mà không ai biết; sai theo hướng
 * CHẶT thì cả đường ống đứng, và người dùng mất tám lượt gọi mô hình mỗi lần.
 *
 * Cả hai kiểu sai đều IM LẶNG — không có ngoại lệ nào được ném ra, không có
 * dòng đỏ nào. Chỉ có bài lên trang, hoặc bài không lên trang.
 *
 * Các ca dưới đây không phải ví dụ nghĩ ra: hai ca đầu là hai câu ĐÃ chặn thật
 * trong lúc chạy, ngày 28/08 và 03/09.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { quetBai } from "../src/lib/cong-chan";

type Mong = "chan" | "co" | "sach";

interface Ca {
  ten: string;
  luat: string;
  noiDung: string;
  mong: Mong;
}

const CA: Ca[] = [
  // ── danh xưng "nhất": luật vừa được nới ─────────────────────────────────
  {
    ten: "Câu đã bị chặn thật lần 1 — xếp hạng, không nguồn",
    luat: "danh-xung-nhat",
    noiDung: "Dự án nằm ven vịnh An Biên và hệ tiện ích nội khu đẳng cấp bậc nhất khu vực.",
    mong: "chan",
  },
  {
    ten: "Câu đã bị chặn thật lần 2 — CÓ mã chứng khoán",
    luat: "danh-xung-nhat",
    noiDung:
      "Vinhomes là một trong những tập đoàn bất động sản niêm yết lớn nhất Việt Nam (mã chứng khoán VHM trên sàn HoSE).",
    mong: "co",
  },
  {
    ten: "Dẫn nguồn kiểu “theo báo cáo”",
    luat: "danh-xung-nhat",
    noiDung: "Đây là khu đô thị có quy mô lớn nhất khu vực theo báo cáo quy hoạch tỉnh.",
    mong: "co",
  },
  {
    // Lỗ hổng đầu tiên một mô hình ngôn ngữ sẽ tìm thấy nếu luật viết lỏng.
    ten: "Tự dẫn chính mình — vẫn phải CHẶN",
    luat: "danh-xung-nhat",
    noiDung: "Theo chúng tôi đây là dự án đẹp nhất khu vực.",
    mong: "chan",
  },
  {
    // Nếu so dẫn nguồn trên CẢ BÀI thay vì trên từng câu, ca này sẽ lọt — và
    // khi đó chỉ cần bài có đúng một nguồn ở đâu đó là luật mở toang.
    ten: "Nguồn nằm ở CÂU KHÁC — không được tha",
    luat: "danh-xung-nhat",
    noiDung:
      "Dự án có quy mô lớn nhất khu vực. Diện tích 1.000 ha theo báo cáo quy hoạch.",
    mong: "chan",
  },

  // ── các luật chặn còn lại: nới một luật không được làm hỏng luật khác ────
  {
    ten: "Mã voucher — chặn tuyệt đối, không có ngoại lệ nguồn",
    luat: "ma-voucher",
    noiDung: "Nhập mã VINHOMESABCD1234 theo báo cáo của phòng kinh doanh để nhận ưu đãi.",
    mong: "chan",
  },
  {
    ten: "Cam kết lợi nhuận",
    luat: "cam-ket-loi-nhuan",
    noiDung: "Chủ đầu tư cam kết lợi nhuận 12% mỗi năm cho khách mua trong tháng này.",
    mong: "chan",
  },
  {
    ten: "Giá thấp nhất thị trường",
    luat: "gia-thap-nhat",
    noiDung: "Chúng tôi bán với giá tốt nhất thị trường hiện nay.",
    mong: "chan",
  },
  {
    ten: "Chiết khấu bí mật",
    luat: "chiet-khau-bi-mat",
    noiDung: "Liên hệ để nhận chính sách chiết khấu nội bộ chưa công bố.",
    mong: "chan",
  },

  // ── luật cờ: không chặn, chỉ chỉ đích danh ──────────────────────────────
  {
    ten: "Có con số giá — gắn cờ, không chặn",
    luat: "gia-cu-the",
    noiDung: "Giá bán từ 5,2 tỷ đồng mỗi căn.",
    mong: "co",
  },

  // ── bài sạch ────────────────────────────────────────────────────────────
  {
    ten: "Bài không chạm luật nào",
    luat: "",
    noiDung: "Dự án nằm ven vịnh, tổng quy mô 1.000 ha, đang trong giai đoạn thi công hạ tầng.",
    mong: "sach",
  },
];

let hong = 0;
for (const c of CA) {
  const kq = quetBai({ tieuDe: "Tiêu đề kiểm thử", moTa: "Mô tả kiểm thử", noiDung: c.noiDung });
  const trongChan = kq.chan.some((v) => !c.luat || v.luat === c.luat);
  const trongCo = kq.co.some((v) => !c.luat || v.luat === c.luat);
  const thuc: Mong = trongChan ? "chan" : trongCo ? "co" : "sach";

  const dat = c.mong === "sach" ? kq.chan.length === 0 && kq.co.length === 0 : thuc === c.mong;
  if (!dat) hong++;
  process.stdout.write(
    `${dat ? "✓" : "✗"} ${c.ten}\n   mong đợi: ${c.mong}   thực tế: ${thuc}\n`,
  );
}

process.stdout.write(
  hong === 0
    ? `\n✓ ${CA.length}/${CA.length} ca đúng.\n`
    : `\n✗ ${hong} ca SAI — sửa trước khi triển khai.\n`,
);
process.exitCode = hong === 0 ? 0 : 1;
