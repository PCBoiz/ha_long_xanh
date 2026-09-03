/**
 * Cổng chặn nội dung — hàng rào TỰ ĐỘNG đặt trước hàng rào NGƯỜI.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CẦN CẢ HAI HÀNG RÀO
 *
 * Đã có màn duyệt bài ở `/duyet-bai`: không bài nào lên trang mà không có người
 * bấm nút. Nghe thì đủ. Nhưng lời hứa "một người đã đọc kỹ" hỏng theo đúng cách
 * mà mọi quy trình thủ công đều hỏng — không phải ngay lập tức, mà vào bài thứ
 * ba mươi, lúc bận, lúc bài trông giống hệt hai mươi chín bài trước.
 *
 * Và cái trôi qua trong lúc đó không phải lỗi chính tả. Một mô hình ngôn ngữ
 * viết "chiết khấu 9% cho khách thanh toán sớm" trôi chảy y hệt lúc nó viết
 * đúng, vì nó không phân biệt được hai việc đó. Câu ấy nằm cạnh những bảng số
 * có ghi nguồn, và mượn đúng uy tín mà các bảng ấy phải rất khó mới có được.
 *
 * Nên chia làm hai việc khác nhau:
 *
 *   CHẶN — thứ KHÔNG BAO GIỜ được phép xuất hiện, dù có người gật đầu. Mã
 *   voucher, lời cam kết lợi nhuận, số điện thoại lạ, danh xưng "nhất". Những
 *   thứ này sai không phải vì chưa kiểm, mà vì bản chất. Cửa trả 403 kèm lý do,
 *   bài không vào tới hàng chờ.
 *
 *   CỜ — con số CÓ THỂ đúng nhưng phải người xác nhận. Giá, phần trăm thương
 *   mại, mốc bàn giao, khoảng cách, pháp lý. Bài vẫn vào hàng chờ, nhưng màn
 *   duyệt chỉ thẳng vào câu có số thay vì bảo người đọc "đọc kỹ nhé".
 *
 * Khác biệt giữa hai việc là khác biệt giữa một QUY TẮC và một LỜI NHẮC. Lời
 * nhắc mòn đi; quy tắc thì không.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ CỜ QUAN TRỌNG HƠN CHẶN, DÙ NGHE NHẸ HƠN
 *
 * Danh sách chặn chỉ bắt được cái đã biết trước. Thứ thật sự nguy hiểm là con
 * số bịa nghe hợp lý — và không mẫu tìm kiếm nào phân biệt được "5,2 tỷ" đúng
 * với "5,2 tỷ" bịa. Việc của cờ không phải là phán đúng sai, mà là làm cho việc
 * kiểm của người CÓ ĐÍCH: thay vì đọc lại hai nghìn chữ, người duyệt đọc bốn
 * câu được chỉ đích danh.
 *
 * Nên khi thêm luật mới, hỏi: "máy có thể kết luận chắc chắn không?" Chắc chắn
 * thì CHẶN. Không chắc thì CỜ. Đừng bao giờ chặn một thứ chỉ vì nó đáng ngờ —
 * chặn nhầm khiến người dùng đi tìm đường vòng, và đường vòng thì không có
 * hàng rào nào cả.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { lienHe } from "@/data/project";

export interface ViPham {
  /** Mã luật, để bên gửi biết chính xác luật nào chạm phải. */
  luat: string;
  /** Câu giải thích cho người đọc, viết bằng tiếng Việt thường. */
  lyDo: string;
  /** Đoạn chữ chạm luật, đã cắt ngắn — để người duyệt nhìn thẳng vào chỗ đó. */
  trichDan: string;
}

interface Luat {
  luat: string;
  lyDo: string;
  mau: RegExp;
  /** `true` thì soi chuỗi HTML thô thay vì phần chữ đã bóc thẻ. */
  soiTho?: boolean;
  /**
   * Nếu CÂU chứa chỗ chạm cũng khớp mẫu này thì luật HẠ TỪ CHẶN XUỐNG CỜ: bài
   * vẫn vào hàng chờ, nhưng chỗ đó được chỉ đích danh để người duyệt kiểm lại.
   *
   * ⚠️ SO TRÊN TỪNG CÂU, KHÔNG PHẢI CẢ BÀI. So trên cả bài thì một dẫn chứng ở
   * đoạn cuối sẽ tha cho một câu khoe suông ở đoạn đầu — tức là chỉ cần bài có
   * đúng một nguồn ở đâu đó là luật mở toang cho mọi câu còn lại.
   */
  xuongCoKhi?: RegExp;
}

/**
 * ═══ THẾ NÀO LÀ "CÓ DẪN NGUỒN" ═══
 *
 * Chủ trang quyết định: câu xếp hạng CÓ dẫn nguồn thì không chặn nữa, chỉ gắn
 * cờ để tự kiểm khi duyệt.
 *
 * Mẫu này KHÔNG kiểm nguồn đúng hay sai — máy không làm được việc đó. Nó chỉ
 * hỏi: câu này có nêu ra một thứ CÓ THỂ TRA LẠI ĐƯỢC không. Phần đúng/sai là
 * việc của người bấm duyệt, và đó chính là lý do luật xuống CỜ chứ không biến
 * mất hẳn.
 *
 * CỐ Ý HẸP. Rộng thì mô hình sẽ tìm ra và dùng — nó đã làm đúng thế với vế
 * "không chứng minh được" trong prompt: dẫn mã chứng khoán, tự thấy hợp lệ, rồi
 * viết. Ba dạng dưới đây đều tra lại được trong một phút:
 *
 *   · "theo <cơ quan / tài liệu>"   — có nơi để hỏi lại
 *   · mã chứng khoán / sàn niêm yết — tra được trên HoSE, HNX, UPCoM
 *   · "nguồn: …"                    — người viết tự chỉ chỗ tra
 *
 * Và loại trừ thẳng "theo chúng tôi / theo tôi / theo đánh giá của chúng tôi":
 * tự dẫn chính mình không phải dẫn nguồn, nó chỉ là cùng một lời khoe viết dài
 * hơn — và đó là lỗ hổng đầu tiên mà một mô hình ngôn ngữ sẽ tìm thấy.
 */
const CO_DAN_NGUON =
  /(?:theo\s+(?:báo\s*cáo|thống\s*kê|số\s*liệu|công\s*bố|quy\s*hoạch|giấy\s*phép|nghị\s*quyết|quyết\s*định|niên\s*giám|bộ\s|sở\s|cục\s|tổng\s*cục|ubnd|vnrea)|mã\s+chứng\s+khoán\s+[A-Z]{3}|niêm\s+yết\s+trên\s+(?:hose|hnx|upcom)|nguồn\s*:)/i;

/** Tự dẫn chính mình — không tính là nguồn. */
const TU_DAN_CHINH_MINH =
  /theo\s+(?:chúng\s*tôi|tôi|đánh\s*giá\s+của\s+chúng\s*tôi|cảm\s*nhận)/i;

/**
 * Cắt lấy đúng CÂU chứa vị trí `viTri`.
 *
 * Ranh giới câu: dấu chấm/hỏi/than, hoặc xuống dòng. Không dùng thư viện tách
 * câu vì tiếng Việt có "TP.", "Q.1", "m2." — nhưng ở đây sai sót đó vô hại: cắt
 * hụt chỉ làm luật CHẶT hơn (ít chữ hơn để tìm dẫn nguồn), không lỏng hơn.
 */
function cauChua(chu: string, viTri: number): string {
  const dau = Math.max(
    chu.lastIndexOf(".", viTri - 1),
    chu.lastIndexOf("!", viTri - 1),
    chu.lastIndexOf("?", viTri - 1),
    chu.lastIndexOf("\n", viTri - 1),
  );
  const sau = [".", "!", "?", "\n"]
    .map((k) => chu.indexOf(k, viTri))
    .filter((i) => i !== -1);
  return chu.slice(dau + 1, sau.length ? Math.min(...sau) + 1 : chu.length);
}

/**
 * ═══ LUẬT CHẶN ═══
 *
 * Mỗi luật ở đây phải trả lời được câu: "vì sao thứ này SAI, chứ không phải
 * CHƯA KIỂM?" Không trả lời được thì nó thuộc nhóm cờ bên dưới.
 */
const LUAT_CHAN: Luat[] = [
  {
    luat: "ma-voucher",
    lyDo:
      "Có chuỗi trông như mã voucher. Mã voucher là tài sản gắn với MỘT khách " +
      "cụ thể — đăng lên trang là ai cũng dùng được, và người được tặng mất " +
      "phần. Mã không bao giờ được xuất hiện trong bài.",
    // Hai dạng: mã có tiền tố quen, và chuỗi hoa-số dài bất thường.
    mau: /\b(?:VINHOMES[A-Z0-9]{4,}|[A-Z]{4,}[A-Z0-9]{8,})\b/,
  },
  {
    luat: "chac-chan-voucher",
    lyDo:
      "Hứa chắc chắn có voucher. Voucher phụ thuộc chương trình từng thời " +
      "điểm và từng khách — hứa trước là hứa thay cho chủ đầu tư.",
    mau: /(?:chắc chắn|đảm bảo|cam kết|luôn có|ai cũng có)[^.!?]{0,40}voucher/i,
  },
  {
    luat: "gia-thap-nhat",
    lyDo:
      "Khẳng định giá thấp nhất. Không ai kiểm chứng được câu này, và nó là " +
      "câu đầu tiên khách hỏi lại khi thấy nơi khác rẻ hơn.",
    mau: /giá\s+(?:thấp|rẻ|tốt)\s+nhất/i,
  },
  {
    luat: "chiet-khau-bi-mat",
    lyDo:
      "Nhắc tới chiết khấu bí mật hoặc cơ chế nội bộ. Cơ chế thương mại nội " +
      "bộ không được công khai — đây là ranh giới đã chốt với chủ trang.",
    mau: /(?:chiết khấu|ưu đãi|chính sách|giá)\s*(?:[^.!?]{0,15})?(?:bí mật|nội bộ|ngầm|không công khai)/i,
  },
  {
    luat: "danh-xung-nhat",
    lyDo:
      "Danh xưng “nhất” không kèm nguồn tra lại được. Câu xếp hạng mà không " +
      "chỉ ra chỗ tra thì không ai kiểm được — kể cả chính mình khi khách hỏi " +
      "lại. Viết kèm nguồn (“theo báo cáo…”, “mã chứng khoán VHM”, “nguồn: …”) " +
      "thì bài vẫn qua, chỉ bị gắn cờ để đọc lại lúc duyệt.",
    mau: /(?:lớn|to|đẹp|tốt|sang|hiện đại|đẳng cấp|quy mô|cao)\s*(?:[^.!?]{0,12})?\s+nhất\s+(?:thế giới|việt nam|đông nam á|châu á|miền bắc|khu vực|cả nước)/i,
    // Có dẫn nguồn thì hạ xuống cờ — xem `CO_DAN_NGUON` phía trên.
    xuongCoKhi: CO_DAN_NGUON,
  },
  {
    luat: "cam-ket-loi-nhuan",
    lyDo:
      "Cam kết lợi nhuận hoặc chắc chắn tăng giá. Đây là lời hứa tài chính — " +
      "nói ra là nhận trách nhiệm pháp lý cho một thứ không ai kiểm soát được.",
    mau: /(?:cam kết|đảm bảo|chắc chắn|nhất định)[^.!?]{0,40}(?:lợi nhuận|sinh lời|sinh lợi|tăng giá|lãi|x\s?\d)/i,
  },
  {
    luat: "tai-lieu-noi-bo",
    lyDo:
      "Có liên kết tới tài liệu trên Google Drive. Kho tài liệu nội bộ chứa " +
      "bảng hàng và chính sách chưa công bố — đường dẫn tới đó không được ra " +
      "trang công khai.",
    mau: /(?:drive|docs)\.google\.com/i,
    soiTho: true,
  },
];

/**
 * ═══ LUẬT CỜ ═══
 *
 * Không chặn — chỉ chỉ đích danh. Mỗi luật ở đây tương ứng với một loại con số
 * mà mô hình ngôn ngữ bịa ra trôi chảy nhất.
 */
const LUAT_CO: Luat[] = [
  {
    luat: "gia-cu-the",
    lyDo: "Có con số giá. Đối chiếu với bảng hàng trước khi duyệt.",
    mau: /\d[\d.,]*\s*(?:tỷ|tỉ|triệu\s*(?:\/|\s)\s*m|triệu đồng)/i,
  },
  {
    luat: "phan-tram-thuong-mai",
    lyDo:
      "Có phần trăm gắn với tiền (chiết khấu, lợi nhuận, lãi suất…). Đây là " +
      "loại số bịa khó nhận nhất vì nó nghe rất hợp lý.",
    mau: /(?:chiết khấu|giảm giá|ưu đãi|lợi nhuận|chênh|hoa hồng|lãi suất|hỗ trợ)[^.!?]{0,30}\d{1,2}(?:[.,]\d)?\s*%/i,
  },
  {
    luat: "moc-thoi-gian",
    lyDo:
      "Có mốc bàn giao / khởi công / mở bán. Mốc tiến độ đổi liên tục — kiểm " +
      "lại với thông báo mới nhất của chủ đầu tư.",
    mau: /(?:bàn giao|cất nóc|khởi công|mở bán|hoàn thiện)[^.!?]{0,35}(?:quý\s*[1-4IViv]|tháng\s*\d{1,2}|năm\s*\d{4}|\d{4})/i,
  },
  {
    luat: "khoang-cach",
    lyDo:
      "Có khoảng cách hoặc thời gian di chuyển. Trang này chỉ công bố đường " +
      "chim bay tính từ tâm dự án — xem `lib/dia-ly.ts`.",
    mau: /\d+\s*(?:km|ki-?lô-?mét|phút\s+(?:chạy|đi|lái|di chuyển))/i,
  },
  {
    luat: "phap-ly",
    lyDo: "Có khẳng định về pháp lý. Đối chiếu với trang pháp lý trước khi duyệt.",
    mau: /(?:sổ đỏ|sổ hồng|giấy chứng nhận|quyền sử dụng đất|1\s*\/\s*500|giấy phép xây dựng|đủ điều kiện bán)/i,
  },
];

/**
 * Bóc thẻ HTML, lấy phần chữ người thật sự đọc.
 *
 * Soi thẳng chuỗi HTML sẽ vừa bắt nhầm vừa bắt sót: tên lớp CSS và thuộc tính
 * lọt vào luật mã voucher, còn một câu bị chia đôi bởi thẻ `<strong>` thì luật
 * nào có khoảng trắng giữa các chữ cũng trượt.
 */
function bocThe(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Cắt một đoạn quanh chỗ chạm luật, đủ để người duyệt nhận ra ngay câu nào. */
function trichQuanh(chu: string, tai: number, dai: number): string {
  const dau = Math.max(0, tai - 40);
  const cuoi = Math.min(chu.length, tai + dai + 40);
  return `${dau > 0 ? "…" : ""}${chu.slice(dau, cuoi).trim()}${
    cuoi < chu.length ? "…" : ""
  }`;
}

function ap(
  luat: Luat[],
  tho: string,
  chu: string,
): { giu: ViPham[]; haXuongCo: ViPham[] } {
  const giu: ViPham[] = [];
  const haXuongCo: ViPham[] = [];
  for (const l of luat) {
    const nguon = l.soiTho ? tho : chu;
    const khop = nguon.match(l.mau);
    if (!khop || khop.index === undefined) continue;

    const vp: ViPham = {
      luat: l.luat,
      lyDo: l.lyDo,
      trichDan: trichQuanh(nguon, khop.index, khop[0].length),
    };

    // Hạ chặn xuống cờ khi CÂU chứa chỗ chạm có dẫn nguồn tra lại được.
    // Tự dẫn chính mình ("theo chúng tôi") không tính — chặn như thường.
    if (l.xuongCoKhi) {
      const cau = cauChua(nguon, khop.index);
      if (l.xuongCoKhi.test(cau) && !TU_DAN_CHINH_MINH.test(cau)) {
        haXuongCo.push({
          ...vp,
          lyDo:
            `${l.lyDo} — CÂU NÀY CÓ DẪN NGUỒN nên không bị chặn, nhưng phải ` +
            `tự kiểm nguồn đó trước khi duyệt. Máy chỉ thấy có nguồn được nêu, ` +
            `nó không kiểm được nguồn đúng hay sai.`,
        });
        continue;
      }
    }

    giu.push(vp);
  }
  return { giu, haXuongCo };
}

/**
 * Số điện thoại lạ — tách riêng vì luật này cần so với một GIÁ TRỊ, không phải
 * khớp một khuôn.
 *
 * ⚠️ VÌ SAO ĐÂY LÀ LUẬT CHẶN CHỨ KHÔNG PHẢI CỜ.
 *
 * Bài do mô hình sinh ra, mà đầu vào của mô hình có thể là một trang web bên
 * ngoài. Một số điện thoại lạ trong bài không phải chuyện sai sót — đó là một
 * người khác nhận cuộc gọi lẽ ra thuộc về chủ trang, trên chính trang của chủ
 * trang. Kiểu hỏng này im lặng tuyệt đối: không lỗi, không cảnh báo, chỉ là
 * khách gọi nhầm người trong nhiều tháng.
 */
function soLa(chu: string): ViPham[] {
  const chinhChu = lienHe.hotline.replace(/\D/g, "");
  const thay: ViPham[] = [];
  // ⚠️ HAI CHỐT CHỐNG BẮT NHẦM — CẢ HAI ĐỀU TỪ MỘT CA ĐO ĐƯỢC.
  //
  // Bản đầu của mẫu này không có chốt nào, và nó CHẶN câu "Giá 5.200.000.000
  // đồng". Lý do: bên trong chuỗi số đó có đoạn "00.000.000" khớp đúng khuôn
  // một số điện thoại. Tức là mọi bài viết ghi giá bằng đồng đều bị chặn oan —
  // và chặn oan thì người dùng đi tìm đường vòng, mà đường vòng không có hàng
  // rào nào cả.
  //
  //  · Chốt trước: số phải MỞ ĐẦU một dãy, không nằm lọt giữa một dãy số dài.
  //  · Chốt độ dài: dưới mười chữ số thì không phải số điện thoại.
  //
  // Và ĐỪNG khớp theo nhóm cố định kiểu `\d{4} \d{3} \d{3}`. Bản trước làm thế
  // rồi TRƯỢT số máy bàn "0203 3826 000" — nhóm 4-4-3 chứ không phải 4-3-3. Ở
  // luật này, trượt nghĩa là số của người lạ lên trang. Nên cách đúng là vơ cả
  // dãy rồi mới đếm chữ số, thay vì đoán trước người ta ngắt nhóm kiểu gì.
  const mau = /(?<![\d.,\-])(?:\+84|0)[\d\s.\-]{7,}/g;
  let khop: RegExpExecArray | null;
  while ((khop = mau.exec(chu)) !== null) {
    const so = khop[0].replace(/\D/g, "").replace(/^84/, "0");
    if (so.length < 10) continue;
    // So MƯỜI CHỮ SỐ ĐẦU, không so cả dãy: một dãy bị vơ dài hơn thực tế
    // ("0941 328 658 100 căn") vẫn phải nhận ra được là hotline chính thức.
    if (so.slice(0, 10) === chinhChu) continue;
    thay.push({
      luat: "so-dien-thoai-la",
      lyDo:
        `Có số điện thoại không phải hotline chính thức (${lienHe.hotline}). ` +
        "Số lạ trên trang nghĩa là khách gọi cho người khác — và không có gì " +
        "báo cho ai biết điều đó đang xảy ra.",
      trichDan: trichQuanh(chu, khop.index, khop[0].length),
    });
    break;
  }
  return thay;
}

export interface KetQuaQuet {
  /** Vi phạm phải chặn. Rỗng nghĩa là được phép vào hàng chờ. */
  chan: ViPham[];
  /** Chỗ cần người xác nhận. KHÔNG chặn. */
  co: ViPham[];
}

/**
 * Quét một bài trước khi cho vào hàng chờ.
 *
 * Nhận cả ba phần chữ vì mô hình có thể đặt con số ở bất kỳ đâu — và tiêu đề
 * là chỗ con số bịa gây hại nhất, do nó đi thẳng vào kết quả tìm kiếm.
 */
export function quetBai(bai: {
  tieuDe: string;
  moTa: string;
  noiDung?: string;
}): KetQuaQuet {
  const tho = [bai.tieuDe, bai.moTa, bai.noiDung ?? ""].join("\n\n");
  const chu = bocThe(tho);
  const chan = ap(LUAT_CHAN, tho, chu);
  const co = ap(LUAT_CO, tho, chu);
  return {
    chan: [...chan.giu, ...soLa(chu)],
    // Luật chặn được hạ cấp đi thẳng vào nhóm cờ — bài qua cổng, nhưng chỗ đó
    // vẫn hiện ở màn duyệt để người đọc kiểm nguồn.
    co: [...co.giu, ...chan.haXuongCo],
  };
}

/** Gộp các vi phạm thành một câu trả về cho bên gửi. */
export function moTaViPham(vp: ViPham[]): string {
  return vp
    .map((v) => `[${v.luat}] ${v.lyDo} Chỗ chạm: “${v.trichDan}”`)
    .join("\n");
}
