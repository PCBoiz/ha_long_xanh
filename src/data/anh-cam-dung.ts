/**
 * DANH SÁCH ẢNH CẤM DÙNG — và lý do của từng tấm.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CẦN TỆP NÀY THAY VÌ XOÁ TỆP ẢNH ĐI
 *
 * Ảnh trong `public/images` được sinh lại từ Google Drive bằng `npm run assets`.
 * Xoá tệp là vô ích: lần chạy sau nó quay lại, và người chạy lệnh đó sẽ không
 * biết vì sao trước đó nó bị bỏ.
 *
 * Nên phải ghi lý do ở chỗ mã nguồn giữ được. Một tấm ảnh bị gỡ mà không ai
 * ghi vì sao thì ba tháng nữa sẽ có người đưa lại — đúng như đã xảy ra với bộ
 * này: chú thích thẩm định trên `/tien-ich` nói "ba tấm", nhưng mảng đã có sáu.
 * Ba tấm thêm sau không ai thẩm định, và đúng ba tấm đó là ảnh AI.
 *
 * `scripts/kiem-anh-treo.mjs` đọc danh sách này để phân biệt ảnh BỊ QUÊN với
 * ảnh CỐ Ý KHÔNG DÙNG. Không có phân biệt đó thì mỗi lần cách ly một tấm là
 * một lần cổng kiểm đỏ, và người ta sẽ tắt cổng thay vì sửa.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface AnhCamDung {
  ten: string;
  lyDo: string;
  /** Bằng chứng quan sát được, để không phải thẩm định lại. */
  bangChung: string;
}

export const ANH_CAM_DUNG: AnhCamDung[] = [
  {
    ten: "giai-tri-lang-tuyet",
    lyDo: "Ảnh sinh bằng AI",
    bangChung:
      'Biển chỉ đường ghi "NORTH S POLE" — chữ vỡ, khoảng cách sai; biển trên ' +
      "nhà gỗ là ký tự vô nghĩa. Kích thước 961×656, không khớp bộ ảnh gốc " +
      "2560px của chủ đầu tư.",
  },
  {
    ten: "giai-tri-cong-vien-nuoc",
    lyDo: "Ảnh sinh bằng AI",
    bangChung:
      'Biển ghi "Công viên Nước Đ5 chề mts" — chữ Việt vỡ nát. Chủ đề ' +
      '"INCA EMPIRE" giữa vịnh Hạ Long. Kích thước 1279×803.',
  },
  {
    ten: "giai-tri-rap-xiec",
    lyDo: "Ảnh sinh bằng AI",
    bangChung:
      "Còn nguyên HÌNH MỜ của trình sinh ảnh ở góc phải dưới (sao bốn cánh), " +
      "kèm một dòng miễn trừ nhỏ ở góc trái dưới. Chữ neon lặp không nhất quán.",
  },
  {
    ten: "giai-tri-nha-hang-duoi-nuoc",
    lyDo: "Từ Drive chủ đầu tư, nhưng KHÔNG phải phối cảnh dự án này",
    bangChung:
      "Đã XEM BẰNG MẮT ngày 10/09 (phiên trước không xem được vì giới hạn ảnh " +
      "của công cụ, không phải vì tấm này ổn). Mang nhiều dấu ảnh AI: cá đuối " +
      "cắt qua khung mái vòm, xác tàu treo lơ lửng sai phương với đáy rạn, " +
      "ánh sáng đều một cách bất khả. " +
      "⚠️ Tấm này LẤY TỪ Drive chủ đầu tư (`fetch-assets.mjs` mã " +
      "1RA0p_QTORdHXQYnbawyR0s0CuyHIJneH) — nhưng Drive đó KHÔNG phải bằng " +
      "chứng: chú thích ngay trong chính tệp ấy đã ghi bộ bán hàng có lẫn ảnh " +
      'chiếu ý tưởng không thuộc dự án (một ngôi chùa có thật, "LÀNG BIA" là ' +
      'lễ hội bia châu Âu, "CÔNG VIÊN ỐC ĐẢO" kiểu Anh). Và "nhà hàng dưới ' +
      'nước" KHÔNG có trong `hangMucTienIch` — danh sách tiện ích đã xác minh.',
  },
  {
    ten: "giai-tri-thuy-cung",
    lyDo: "Ảnh CHỤP một thuỷ cung ở nước khác — không liên quan dự án",
    bangChung:
      "Đã XEM BẰNG MẮT ngày 10/09. Đây là bể Kuroshio của thuỷ cung Churaumi " +
      "(Okinawa, Nhật Bản): ba con cá nhám voi cùng cá đuối nạng trong một bể, " +
      "trước tấm kính phẳng khổng lồ, đám đông in bóng đen phía dưới — khung " +
      "hình được chụp lại nhiều nhất thế giới. Rất ít thuỷ cung nuôi nổi cá " +
      "nhám voi và Việt Nam không có nơi nào. " +
      'Nên `alt` hiện khai "Phối cảnh bể kính lớn…" SAI HAI LẦN: nó không phải ' +
      "phối cảnh (là ảnh chụp), và không phải của dự án này. Dùng nó là vừa " +
      "vướng bản quyền vừa nói sai với người mua.",
  },
  {
    ten: "vbm-hoan-thien-02",
    lyDo: "Trùng ảnh với `song-dai-lo-mua-hoa`, và alt nói sai bản chất",
    bangChung:
      "Đã XEM BẰNG MẮT ngày 10/09 — `kiem-anh-trung` báo lệch 10 bit, và mắt " +
      "xác nhận CÙNG MỘT phối cảnh: cùng chiếc xe cam, cùng khinh khí cầu, " +
      "cùng hàng cây. Khác đúng một điều: tấm này còn nguyên dải chữ " +
      '"(*) Thông tin hình ảnh chỉ mang tính chất minh hoạ, tham khảo" ở mép ' +
      "dưới, còn `song-dai-lo-mua-hoa` là bản đã cắt dải đó theo đúng quy ước " +
      "`CAT_CHU_CHAN` của kho. " +
      '⚠️ Và `alt` của tấm này ghi "Dãy nhà HOÀN THIỆN tại Vịnh Bình Minh" — ' +
      "tức là giới thiệu một phối cảnh như công trình đã xây xong, ngay trên " +
      "trang `/gia-tri-tai-san-…`. Chính dải chữ in trên mặt ảnh đã nói ngược " +
      "lại điều đó. Cùng loại lỗi với ba ảnh AI, chỉ khác là ảnh này thật. " +
      "Giữ bản `song-dai-lo-mua-hoa`: mới hơn, cắt đúng, và alt ghi " +
      '"Phối cảnh".',
  },
];

export const TEN_ANH_CAM_DUNG = ANH_CAM_DUNG.map((a) => a.ten);
