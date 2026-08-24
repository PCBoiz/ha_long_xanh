import {
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Bảng bài viết — đích đến của đường ống đăng bài tự động từ Antigravity.
 *
 * TRƯỚC ĐÂY bài được ghi nối đuôi vào `.data/bai-viet.jsonl`. Cách đó chạy được
 * trên máy cục bộ nhưng chết ngay khi lên máy chủ thật: mỗi lần triển khai lại
 * là hộp chứa mới, file cũ biến mất cùng bài viết. Bảng này là chỗ lưu bền.
 *
 * QUYẾT ĐỊNH VỀ KIỂU DỮ LIỆU:
 *
 *  · `slug` là KHOÁ CHÍNH, không dùng số tự tăng. Antigravity sinh slug từ tiêu
 *    đề và dùng chính nó để nhận diện bài; có khoá chính là slug thì "đăng lại
 *    bài cũ" trở thành một lệnh ghi đè tự nhiên thay vì phải tra id trước.
 *
 *  · `ngayDang` là `date` chứ không phải `timestamp`. Bài viết bất động sản
 *    tính theo NGÀY. Lưu kèm giờ thì cùng một bài hiện ngày 5 với người ở Hà
 *    Nội và ngày 4 với máy chủ chạy giờ UTC — lỗi lệch múi giờ kinh điển.
 *
 *  · `chuyenMuc` để `varchar` kèm kiểm tra ở tầng ứng dụng, không dùng enum của
 *    Postgres. Thêm một chuyên mục vào enum đòi một lần migration; ở đây chỉ
 *    cần sửa một mảng trong mã.
 *
 *  · `noiDung` cho phép rỗng: Antigravity có thể đẩy phần tóm tắt trước rồi bổ
 *    sung nội dung đầy đủ sau.
 */
export const baiViet = pgTable(
  "bai_viet",
  {
    slug: varchar("slug", { length: 200 }).primaryKey(),
    tieuDe: varchar("tieu_de", { length: 300 }).notNull(),
    moTa: varchar("mo_ta", { length: 600 }).notNull(),
    ngayDang: varchar("ngay_dang", { length: 10 }).notNull(),
    chuyenMuc: varchar("chuyen_muc", { length: 40 }).notNull(),
    noiDung: text("noi_dung"),

    /**
     * Trạng thái duyệt: `"cho"` (chờ duyệt) hoặc `"dang"` (đã đăng).
     *
     * ═════════════════════════════════════════════════════════════════════
     * ⚠️ CỘT NÀY LÀ HÀNG RÀO GIỮA MỘT MÔ HÌNH NGÔN NGỮ VÀ NGƯỜI MUA NHÀ.
     *
     * Cả trang này dựng trên đúng một lời hứa: không đăng con số chưa kiểm.
     * Bảng giá ghi rõ nguồn, khoảng cách ghi rõ là đường chim bay, chính sách
     * chỉ nói cấu trúc chứ không nói phần trăm — tất cả để giữ đúng lời hứa đó.
     *
     * Nối một cỗ máy viết bài tự động vào trang mà cho nó đăng thẳng là phá
     * đúng lời hứa ấy, bằng chính cánh cửa mình vừa mở. Mô hình ngôn ngữ viết
     * trôi chảy về "giá từ 5 tỷ" hay "chính sách chiết khấu 9%" mà không hề
     * biết mình đang bịa — và bài đó sẽ nằm cạnh những bảng số có nguồn, mượn
     * đúng uy tín mà chúng phải rất khó mới có được.
     *
     * Nên mặc định là `"cho"`. Bài chỉ hiện ra sau khi một CON NGƯỜI đọc và
     * bấm duyệt.
     *
     * ĐỪNG ĐỔI MẶC ĐỊNH THÀNH `"dang"` cho tiện. Cái giá của việc duyệt tay là
     * vài phút mỗi bài; cái giá của một bài bịa giá nằm trên trang là toàn bộ
     * lý do trang này tồn tại.
     * ═════════════════════════════════════════════════════════════════════
     */
    trangThai: varchar("trang_thai", { length: 10 }).notNull().default("cho"),

    /** Lúc người duyệt bấm đăng. Trống nghĩa là chưa ai duyệt. */
    duyetLuc: timestamp("duyet_luc", { withTimezone: true }),

    /** Lúc máy chủ NHẬN bài — khác `ngayDang`, dùng để truy vết đường ống. */
    nhanLuc: timestamp("nhan_luc", { withTimezone: true }).defaultNow().notNull(),
    capNhatLuc: timestamp("cap_nhat_luc", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (bang) => [
    // Trang tin luôn sắp xếp theo ngày giảm dần. Không có chỉ mục này thì mỗi
    // lần mở trang là một lần quét toàn bảng — không sao với 10 bài, rất tệ với
    // 3.000 bài sau vài năm đăng mỗi ngày.
    index("bai_viet_ngay_dang_idx").on(bang.ngayDang),
    // Trang tin CHỈ đọc bài đã duyệt, nên mọi truy vấn đều lọc theo cột này.
    index("bai_viet_trang_thai_idx").on(bang.trangThai),
  ],
);

export type BaiVietRow = typeof baiViet.$inferSelect;
export type BaiVietMoi = typeof baiViet.$inferInsert;

/**
 * Bảng sự kiện chuyển đổi — "đo được lead, call, form, booking".
 *
 * VÌ SAO TỰ ĐO CHỨ KHÔNG GẮN GOOGLE ANALYTICS:
 *
 *  · TỐC ĐỘ. Trang này đo được LCP nhanh nhất 480ms. Một thẻ đo lường của bên
 *    thứ ba thường nặng 45–90KB và chặn luồng chính — đánh đổi đúng thứ đang
 *    là lợi thế để lấy một biểu đồ.
 *
 *  · CHẶN QUẢNG CÁO. Phần đáng kể người dùng chặn thẻ đo của bên thứ ba, và
 *    nhóm bị chặn nhiều nhất lại thường là nhóm rành công nghệ, có tiền — đúng
 *    tệp khách của dự án này. Số liệu thu về vì thế lệch một cách có hệ thống.
 *
 *  · QUYỀN RIÊNG TƯ. Bảng này KHÔNG lưu cookie, KHÔNG lưu địa chỉ IP, KHÔNG
 *    lưu thứ gì nhận dạng được một người. Nó đếm hành động, không theo dõi
 *    người. Nhờ vậy không cần dải xin phép cookie — mà dải đó tự nó cũng làm
 *    giảm tỉ lệ chuyển đổi.
 *
 * Đây KHÔNG thay thế một công cụ phân tích đầy đủ. Nó trả lời đúng câu hỏi
 * trong tiêu chí nghiệm thu: có bao nhiêu lượt bấm gọi, bấm Zalo, gửi biểu mẫu,
 * và chúng đến từ trang nào.
 */
export const suKien = pgTable(
  "su_kien",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    /** `goi` · `zalo` · `bieu-mau` · `tai-lieu` · `tim-can` — xem `lib/do-luong`. */
    loai: varchar("loai", { length: 40 }).notNull(),
    /** Đường dẫn nơi hành động xảy ra. Không kèm tham số truy vấn. */
    duong: varchar("duong", { length: 300 }).notNull(),
    /** Chi tiết không nhận dạng người: tên dòng sản phẩm, mã tài liệu… */
    chiTiet: varchar("chi_tiet", { length: 200 }),
    xayRaLuc: timestamp("xay_ra_luc", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (bang) => [
    // Mọi báo cáo đều là "đếm theo loại trong khoảng thời gian". Chỉ mục ghép
    // theo đúng thứ tự đó, không phải hai chỉ mục rời.
    index("su_kien_loai_thoi_gian_idx").on(bang.loai, bang.xayRaLuc),
  ],
);

export type SuKienRow = typeof suKien.$inferSelect;
export type SuKienMoi = typeof suKien.$inferInsert;

/**
 * Bảng lượt đăng ký tư vấn — mắt xích còn thiếu của vòng đo lường.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO BẢNG NÀY QUAN TRỌNG HƠN VẺ NGOÀI CỦA NÓ
 *
 * Trước bảng này, lượt đăng ký đi thẳng ra một webhook rồi biến mất khỏi tầm
 * nhìn của hệ thống. Nghĩa là câu hỏi duy nhất thật sự quan trọng —
 * ĐỒNG QUẢNG CÁO NÀO SINH RA TIỀN — không có cách nào trả lời.
 *
 * Trang có thể tăng gấp đôi lượt để lại số mà doanh thu không đổi, và không ai
 * biết cho tới khi hết ngân sách.
 *
 * Chuỗi cần nối liền là:
 *
 *   từ khoá → quảng cáo → trang vào → lượt đăng ký → gọi → hẹn → đặt cọc
 *
 * Bảng này giữ bốn mắt đầu; bốn mắt sau do tư vấn viên cập nhật.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ĐÂY LÀ DỮ LIỆU CÁ NHÂN CỦA NGƯỜI THẬT. Khác hẳn bảng `su_kien` — bảng đó
 * cố ý không nhận dạng được ai. Bảng này có tên và số điện thoại, nên:
 *   · không bao giờ đưa ra bất kỳ đường dẫn công khai nào;
 *   · không ghi ra nhật ký máy chủ;
 *   · chỉ đọc bằng công cụ có xác thực.
 */
export const dangKy = pgTable(
  "dang_ky",
  {
    /**
     * Mã lượt đăng ký. Đây là thứ nối bảng này với mọi hệ khác — tư vấn viên
     * đọc mã này trên Google Sheet, và khi cần truy ngược một giao dịch về
     * đúng từ khoá đã sinh ra nó thì đi theo mã này.
     */
    id: varchar("id", { length: 36 }).primaryKey(),

    // ── Khách nhập ────────────────────────────────────────────────────────
    hoTen: varchar("ho_ten", { length: 160 }).notNull(),
    dienThoai: varchar("dien_thoai", { length: 20 }).notNull(),
    quanTam: varchar("quan_tam", { length: 80 }),
    ghiChu: text("ghi_chu"),
    /** Ngân sách khách tự chọn ở bộ tìm căn. Cho phép trống — hỏi tiền quá
     *  sớm hoặc quá gắt làm rơi lượt hoàn thành. */
    nganSach: varchar("ngan_sach", { length: 40 }),

    // ── Khách đến từ đâu ──────────────────────────────────────────────────
    /** Trang khách VÀO ĐẦU TIÊN trong phiên, không phải trang bấm gửi. Đây mới
     *  là trang quảng cáo trả tiền để đưa họ tới. */
    trangVao: varchar("trang_vao", { length: 300 }),
    /** Trang khách ĐANG Ở khi bấm gửi. Khác `trangVao` thì biết được đường đi
     *  bên trong trang dẫn tới chuyển đổi. */
    trangGui: varchar("trang_gui", { length: 300 }),
    /** Địa chỉ giới thiệu — chỉ giữ tên miền, không giữ đường dẫn đầy đủ. */
    tuNguon: varchar("tu_nguon", { length: 160 }),

    // ── Tham số chiến dịch ────────────────────────────────────────────────
    utmNguon: varchar("utm_nguon", { length: 120 }),
    utmKenh: varchar("utm_kenh", { length: 120 }),
    utmChienDich: varchar("utm_chien_dich", { length: 200 }),
    utmTuKhoa: varchar("utm_tu_khoa", { length: 200 }),
    utmNoiDung: varchar("utm_noi_dung", { length: 200 }),
    /** Mã bấm quảng cáo của Google. Có nó thì đối chiếu ngược về đúng lượt
     *  bấm trong bảng điều khiển quảng cáo được, kể cả khi UTM bị mất. */
    maQuangCao: varchar("ma_quang_cao", { length: 200 }),

    // ── Tư vấn viên cập nhật ──────────────────────────────────────────────
    /**
     * `moi` → `daGoi` → `datChuan` → `henGap` → `datCoc`
     *                 ↘ `khongDat`   ↘ `khongTiepTuc`
     *
     * Để `varchar` kèm kiểm tra ở tầng ứng dụng chứ không dùng enum của
     * Postgres: thêm một trạng thái vào enum đòi một lần migration, ở đây chỉ
     * cần sửa một mảng trong mã. Và quy trình bán hàng thì chắc chắn sẽ đổi.
     */
    trangThai: varchar("trang_thai", { length: 30 }).default("moi").notNull(),
    ghiChuBanHang: text("ghi_chu_ban_hang"),

    taoLuc: timestamp("tao_luc", { withTimezone: true }).defaultNow().notNull(),
    capNhatLuc: timestamp("cap_nhat_luc", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (bang) => [
    // Báo cáo luôn là "đếm theo chiến dịch trong khoảng thời gian".
    index("dang_ky_chien_dich_idx").on(bang.utmChienDich, bang.taoLuc),
    // Bảng làm việc hằng ngày của tư vấn viên: lọc theo trạng thái, mới trước.
    index("dang_ky_trang_thai_idx").on(bang.trangThai, bang.taoLuc),
  ],
);

export type DangKyRow = typeof dangKy.$inferSelect;
export type DangKyMoi = typeof dangKy.$inferInsert;
