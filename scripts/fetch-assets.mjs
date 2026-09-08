// Tải ảnh gốc từ Google Drive của chủ đầu tư rồi nén về cỡ dùng được cho web.
//
// Ảnh gốc là bản in (tới 11008x6144, ~100MB/tấm) — không thể đưa thẳng lên web.
// Script hạ xuống 2560px, xuất WebP, đồng thời sinh ảnh mờ 24px nhúng base64 để
// dùng làm placeholder chống giật layout khi ảnh thật đang tải.
//
// Chạy lại được nhiều lần: file đã có thì bỏ qua, nên thêm ảnh mới rất rẻ.
//
//   node scripts/fetch-assets.mjs

import { mkdir, writeFile, rm, stat } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images");
const TMP_DIR = path.join(ROOT, ".asset-cache");
const GOC_DIR = path.join(ROOT, "anh-goc");
const MANIFEST = path.join(ROOT, "src", "data", "images.generated.ts");

const MAX_WIDTH = 2560;
const WEBP_QUALITY = 82;
const BLUR_WIDTH = 24;

/**
 * Nguồn ảnh. `id` là ID file trên Google Drive (thư mục chia sẻ công khai của
 * chủ đầu tư). `alt` viết sẵn tiếng Việt vì đây là nội dung hiển thị, không phải
 * ghi chú kỹ thuật.
 */
const ASSETS = [
  // Phối cảnh tổng thể — ảnh mạnh nhất, dùng cho hero và các mảng lớn.
  {
    id: "10HyQJ10DcWa_i9v9z6JnzS7leajy-T3R",
    name: "toan-canh-hoang-hon",
    alt: "Toàn cảnh Vinhomes Global Gate Hạ Long nhìn ra vịnh lúc hoàng hôn",
  },
  {
    id: "1zApADlUuwnBaj71xQJf6bAzcIqraKrIQ",
    name: "toan-canh-sang-som",
    alt: "Toàn cảnh khu đô thị lúc sáng sớm",
  },
  {
    id: "1L45hEaS_HGbNpvGOt5SYV9crfAzy40N6",
    name: "view-bien-sang-som",
    alt: "Phân khu hướng biển lúc bình minh",
  },
  {
    id: "1YV1tD1wvxEu07NaYJ7Arz41caKsRKxri",
    name: "view-san-golf",
    alt: "Phối cảnh khu biệt thự nhìn ra sân golf",
  },
  {
    id: "15ETKvC_M3qhslT9zsgVkHl2YHPGymvBb",
    name: "khu-1-view-bien",
    alt: "Phân khu 1 hướng vịnh Hạ Long",
  },
  {
    id: "1VqOIDc3tTNvdZ3T8vkBjS5vCF5I4p47m",
    name: "khu-1-cong-vien-hoang-hon",
    alt: "Bán đảo dự án nhìn từ trên cao lúc hoàng hôn",
  },

  // Sơ đồ quy hoạch — nền cho phần bấm chọn phân khu ở trang chủ. Đây là bản
  // VẼ, không phải ảnh phối cảnh: nét và chữ phải còn đọc được nên không hạ
  // chất lượng thêm.
  {
    id: "1pTdUuqxmhClqeQ74ra4-11XcxcDK4WFw",
    name: "tmb-tong-tien-ich",
    alt: "Sơ đồ tổng mặt bằng và hệ tiện ích toàn dự án",
  },
  {
    // Cùng tấm trên nhưng CẮT lấy riêng vùng bản đồ, bỏ tiêu đề và hai cột chú
    // giải hai bên. Bản cắt này là nền cho phần bấm chọn phân khu — giữ nguyên
    // cả poster thì vùng bấm bé tí và chữ chú giải rối mắt.
    id: "1pTdUuqxmhClqeQ74ra4-11XcxcDK4WFw",
    name: "tmb-ban-do",
    alt: "Bản đồ quy hoạch các phân khu Vinhomes Global Gate Hạ Long",
    crop: { trai: 0.157, tren: 0.153, phai: 0.85, duoi: 0.752 },
  },
  {
    id: "1X0whtAVS6AD7DJb8H2095_sKD8AsIH94",
    name: "tmb-khu-1",
    alt: "Sơ đồ tổng mặt bằng Khu 1",
  },

  // Tiện ích VinWonders — ảnh nhiều màu, dùng để phối cảnh đỡ đơn điệu (sáu
  // tấm phối cảnh tổng đều là cảnh nhìn từ trên cao nên rất giống nhau).
  {
    id: "1TFknKQ1VNo7qzYnW31CV6fuzZp1KdQcJ",
    name: "tien-ich-01",
    alt: "Rạp xiếc trong công viên VinWonders lúc chạng vạng",
  },
  {
    id: "1lFCbGRsalmvR2eaqmGZEWYt2f1AVly-M",
    name: "tien-ich-02",
    alt: "Quảng trường Rạp xiếc La Mã cổ đại",
  },
  {
    id: "1TluUvGK12hnM3A2ViOcn_lyqnSBnZMQp",
    name: "tien-ich-03",
    alt: "Phân khu trò chơi chủ đề Ai Cập cổ đại",
  },
  {
    id: "1tfaLQTCTDdTTPM8H-LwWnNrdXjPEzQU3",
    name: "tien-ich-04",
    alt: "Vườn trẻ em Kids Garden",
  },
  {
    id: "1AO9AVqRy3cKXKMDvl8njkSyHwXUMv7IS",
    name: "tien-ich-05",
    alt: "Cổng Babylon dẫn vào khu trò chơi cảm giác mạnh",
  },

  // Mặt bằng từng mẫu nhà. Chỉ ba mẫu ở dạng ảnh; các mẫu còn lại là PDF nên
  // trang sản phẩm dẫn thẳng sang thư mục Drive thay vì hiển thị.
  {
    id: "178zsqRIHtIk9JLUJJ5EUQ8016P31XtYu",
    name: "mat-bang-lien-ke-60",
    alt: "Mặt bằng nhà liền kề 60 m² (mẫu CH09.LK01A)",
  },
  {
    id: "17Id0pSzlbtQqakr1fk2LYC2Q_JLYUDdg",
    name: "mat-bang-lien-ke-96",
    alt: "Mặt bằng nhà liền kề 96 m² (mẫu CH59.LK02A.BL06)",
  },
  {
    id: "1MWAm97T2lY7uDyCYknj1nECxmgZBjS0m",
    name: "mat-bang-song-lap-162",
    alt: "Mặt bằng biệt thự song lập 162 m² (mẫu CH09.SLI01)",
  },

  // Kiến trúc từng dòng sản phẩm thấp tầng.
  {
    id: "1Njc8JjEqotz8f41Sa2dIrQvbdZ6Zmup6",
    name: "san-pham-lien-ke",
    alt: "Phối cảnh nhà liền kề",
  },
  {
    id: "1w7eNA6Ne0c5w9-p-IJPp4Xis6iVl5p_1",
    name: "san-pham-song-lap",
    alt: "Phối cảnh biệt thự song lập",
  },
  {
    id: "1UFXR-vBX0TuR1tRFQrgGS7g6OifV78Ih",
    name: "san-pham-biet-thu-bien",
    alt: "Phối cảnh biệt thự hướng biển",
  },

  // Căn hộ cao tầng.
  {
    id: "1xRiQdXeqeSEHqXXnBRFfusd283nr6yHB",
    name: "cao-tang-01",
    alt: "Phối cảnh toà căn hộ cao tầng",
  },
  {
    id: "18oVueqEvbeAadLgJs4B5eD4R4XAHfkxi",
    name: "cao-tang-02",
    alt: "Phối cảnh quần thể căn hộ cao tầng",
  },

  /* ═══════════════════════════════════════════════════════════════════════
     ẢNH CĂN HOÀN THIỆN Ở VỊNH BÌNH MINH — bộ ảnh khác biệt nhất

     Dò tám trang đại lý khác cùng bán dự án này: tất cả dùng chung một bộ phối
     cảnh chụp từ trên cao mà chủ đầu tư phát cho mọi bên. Nên trang nào cũng
     na ná trang nào, và không tấm nào cho khách thấy căn nhà trông ra sao ở
     tầm mắt người đứng dưới đất.

     Thư mục "6.CĂN HOÀN THIỆN VBM" trên Drive chủ đầu tư có bộ ảnh này mà chưa
     trang nào dùng. Nó nối thẳng với bảng hàng: Vịnh Bình Minh là tiểu khu
     chiếm 22 trong 32 căn đang bán.
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "18rD4IQOzXhk7PEqt943DvYssxUawkWT-",
    name: "vbm-hoan-thien-01",
    alt: "Căn hoàn thiện tại Vịnh Bình Minh nhìn từ mặt phố",
  },
  {
    id: "1ZgsqjJ_-1Q5O6AUMqKMl0b1rK6EtLx6c",
    name: "vbm-hoan-thien-02",
    alt: "Dãy nhà hoàn thiện tại Vịnh Bình Minh",
  },
  {
    id: "1H_Lvdd_XZSXdk0SxC0or7HmCZzLEG7jg",
    name: "vbm-hoan-thien-03",
    alt: "Dãy nhà phố ven kênh tại Vịnh Bình Minh lúc hoàng hôn",
  },
  {
    id: "1UQj_flkV3cYsO5ljeXE_tHvsFztfX-Ow",
    name: "vbm-hoan-thien-04",
    alt: "Đường nội khu Vịnh Bình Minh nhìn từ tầm mắt người đi bộ",
  },
  {
    id: "1TtL72AcoivthCoiC_xgBZe-0SuKHrVVJ",
    name: "vbm-lien-ke-goc-hai",
    alt: "Dãy shophouse hoàn thiện, các gian hàng ở tầng một",
  },

  /* ─────────────── Kiến trúc theo TỪNG DÒNG SẢN PHẨM ───────────────
     Tên file gốc mang mã loại hình — LK liền kề, SL song lập, DL đơn lập, BTB
     biệt thự biển — nên mỗi dòng sản phẩm có ảnh kiến trúc riêng thay vì dùng
     chung một tấm toàn cảnh. Đây là chỗ ảnh nói được điều chữ không nói: hai
     dòng khác nhau thì trông khác nhau ở đâu. */
  // ⚠️ BA MỤC TỪNG ĐỨNG Ở ĐÂY ĐÃ BỊ GỠ — `kien-truc-don-lap`,
  // `kien-truc-song-lap`, `kien-truc-lien-ke`. Đừng thêm lại.
  //
  // Cả ba khai LẠI ĐÚNG ba mã Drive đã có ở khối "sản phẩm" phía trên, chỉ đổi
  // tên. Không có `crop`, nên script tải về ba file giống hệt bản gốc TỪNG
  // BYTE, chỉ khác tên — đã đối chiếu mã băm md5. Thừa 2,63 MB, và không một
  // trang nào gọi tới chúng.
  //
  // Ý định ban đầu (mỗi dòng sản phẩm một tấm kiến trúc riêng) là đúng, nhưng
  // ba tấm đó KHÔNG khác gì `san-pham-don-lap` / `-song-lap` / `-lien-ke` đã
  // có. Cần ảnh kiến trúc cho ba dòng này thì dùng thẳng tên `san-pham-*`.
  //
  // Hai tấm kiến trúc THẬT SỰ mới thì giữ lại, nằm ngay dưới.
  {
    id: "1RMWAczC4r-55z9SKcNcLQuf83GQGhkSo",
    name: "kien-truc-shophouse",
    alt: "Dãy nhà phố nhìn từ đại lộ ven vịnh",
  },
  {
    id: "1tVrjm1IWMc0pNiBv31LKHJ4gjP98ur8U",
    name: "kien-truc-don-lap-02",
    alt: "Biệt thự đơn lập nhìn từ phía sân vườn",
  },

  // Khối cao tầng — góc nhìn thứ ba, khác hai tấm cao tầng đã có.
  {
    id: "157LJeAmhGpbH8V-zkwFpaJ-nCL63ibv5",
    name: "cao-tang-03",
    alt: "Chân đế khối căn hộ cao tầng",
  },
];

/**
 * Ảnh KHÔNG tải từ Drive mà lấy từ file gốc chủ trang gửi tay, đặt trong
 * `anh-goc/` (thư mục nằm ngoài kho mã — xem .gitignore).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO BỘ ẢNH NÀY KHÁC HẲN MỌI ẢNH KHÁC TRÊN TRANG
 *
 * Tất cả ảnh phía trên là PHỐI CẢNH — tranh vẽ, dựng bằng máy, chụp một tương
 * lai chưa tồn tại. Mọi trang bán dự án này đều dùng đúng bộ đó, nên chúng
 * không chứng minh được gì; chúng chỉ chứng minh rằng ai cũng có cùng một
 * thư mục Drive.
 *
 * Bộ dưới đây là ẢNH CHỤP THẬT, có dấu thời gian của chính chủ đầu tư nung vào
 * góc ảnh. Chúng cho thấy cả thứ phối cảnh không bao giờ cho thấy: đất còn
 * đang san, tàu hút cát, giàn cọc, và những ô đất chưa có gì. Đó chính là lý
 * do phải giữ nguyên dòng chữ chìm — nó là chứng từ về thời điểm, và cắt nó đi
 * là biến một bằng chứng thành một tấm ảnh đẹp.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ KHÔNG cần giữ file gốc mãi. Nén xong thì `public/images/*.webp` là thứ
 * duy nhất trang cần; chạy lại script khi thiếu file gốc vẫn ra manifest đúng,
 * vì `prepare()` chỉ đọc nguồn khi ảnh đích CHƯA có.
 */
const ANH_CUC_BO = [
  {
    file: "tien-do-0826-toan-canh-vinh.jpg",
    name: "tien-do-0826-toan-canh-vinh",
    alt: "Toàn cảnh phần đất dự án nhìn từ trên cao giữa vịnh, tháng 08/2026",
  },
  {
    file: "tien-do-0826-san-lap-bien.jpg",
    name: "tien-do-0826-san-lap-bien",
    alt: "Khu vực đang san lấp và tàu hút cát ngoài vịnh, tháng 08/2026",
  },
  {
    file: "tien-do-0826-duong-truc-ban-dao.jpg",
    name: "tien-do-0826-duong-truc-ban-dao",
    alt: "Đường trục và cầu dẫn trên phần đất mới bồi đắp, tháng 08/2026",
  },
  {
    file: "tien-do-0826-san-nen-phan-lo.jpg",
    name: "tien-do-0826-san-nen-phan-lo",
    alt: "San nền và phân lô quanh hồ cảnh quan, tháng 08/2026",
  },
  {
    file: "tien-do-0826-ha-tang-hoan-thien.jpg",
    name: "tien-do-0826-ha-tang-hoan-thien",
    alt: "Đường trục và hàng cây đã xong giữa các lô đất còn trống, tháng 08/2026",
  },
  {
    file: "tien-do-0826-toan-canh-khu-o.jpg",
    name: "tien-do-0826-toan-canh-khu-o",
    alt: "Toàn cảnh khu ở đã chia lô và làm xong hạ tầng, tháng 08/2026",
  },
  {
    file: "tien-do-0826-cong-trinh-mat-duong.jpg",
    name: "tien-do-0826-cong-trinh-mat-duong",
    alt: "Công trình thấp tầng đang thi công phần thân bên đường trục, tháng 08/2026",
  },
  {
    file: "tien-do-0826-dai-lo-cay-xanh.jpg",
    name: "tien-do-0826-dai-lo-cay-xanh",
    alt: "Hai khối công trình bên đại lộ đã trồng cây, tháng 08/2026",
  },
  {
    file: "tien-do-0826-len-tang.jpg",
    name: "tien-do-0826-len-tang",
    alt: "Ba khối công trình đang lên tầng, có cần cẩu và giàn giáo, tháng 08/2026",
  },
  {
    file: "tien-do-0826-khu-thuong-mai.jpg",
    name: "tien-do-0826-khu-thuong-mai",
    alt: "Cụm công trình thương mại nhìn về phía thành phố Hạ Long, tháng 08/2026",
  },
  {
    file: "tien-do-0826-cau-vuot-cao-toc.jpg",
    name: "tien-do-0826-cau-vuot-cao-toc",
    alt: "Thi công cầu bên tuyến cao tốc chạy qua dự án, tháng 08/2026",
  },
  {
    file: "tien-do-0826-coc-khoan-nhoi.jpg",
    name: "tien-do-0826-coc-khoan-nhoi",
    alt: "Giàn cọc khoan nhồi dọc tuyến cao tốc, tháng 08/2026",
  },
];

/**
 * Ảnh bóc từ bộ tài liệu bán hàng PDF của chủ đầu tư (Event 06.09, 31 trang).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * BA RÀNG BUỘC ĐÃ ÁP KHI CHỌN — ĐỌC TRƯỚC KHI THÊM TẤM MỚI
 *
 * 1 · CHỈ LẤY ẢNH SẠCH. Phần lớn 95 ảnh trong PDF là CẢ TRANG đã dàn sẵn, có
 *     chữ quảng cáo của chủ đầu tư nướng vào. Dán một trang như thế lên đây là
 *     đưa lời quảng cáo của bên bán vào một trang tự nhận là kênh tư vấn độc
 *     lập. 13 tấm dưới đây hoặc vốn không có chữ, hoặc đã cắt bỏ phần có chữ.
 *
 * 2 · KHÔNG LẤY ẢNH MANG NHÃN BÊN THỨ BA. Đã loại hai tấm đẹp:
 *       · sân trường đại học — góc trái có logo "ARA HOMES", một sàn môi giới
 *       · phố hàng hiệu     — biển Hermès / Hennessy / Häagen-Dazs, tức là
 *                             hứa hộ chủ đầu tư những thương hiệu chưa ai
 *                             công bố sẽ có mặt
 *
 * 3 · ĐÂY LÀ PHỐI CẢNH, KHÔNG PHẢI ẢNH CHỤP. Mọi câu `alt` phải mở bằng chữ
 *     "Phối cảnh". Ảnh gốc có dòng chú thích "(*) hình ảnh mang tính chất minh
 *     hoạ" ở mép dưới — đã cắt vì nó không đọc nổi ở cỡ hiển thị, và lời cảnh
 *     báo phải nằm ở chữ `alt` đọc được chứ không phải ở 8 điểm ảnh mờ.
 *
 * ĐỘ PHÂN GIẢI — VÌ SAO KHÔNG DÙNG CHO ẢNH LỚN
 *
 * Ảnh nhúng trong PDF chỉ 428–785px bề ngang, trong khi ảnh Drive là 2560px.
 * Đã phóng sẵn bằng lanczos3 + làm nét, HỆ SỐ TỐI ĐA 2,3× — mức đã so bằng mắt
 * ở tỉ lệ 1:1, không phải mức đoán. Kết quả 846–1400px: đủ cho thẻ và dải ảnh
 * xen giữa, KHÔNG đủ cho ảnh nền toàn màn hình. Đừng dùng làm hero.
 *
 * (`prepare()` áp `withoutEnlargement`, nên mọi việc phóng to phải làm xong
 * TRƯỚC khi file vào `anh-goc/` — script này không phóng hộ.)
 *
 * VÌ SAO THÊM BỘ NÀY: trang từng có 0 ảnh nội thất, 0 ảnh giải trí và gần như
 * 0 ảnh có người trong khung — tỉ lệ kiến trúc/đời sống thật là 95/5. Người
 * sắp chuyển vài tỷ không mua mặt tiền; họ mua một hình dung về đời sống.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const ANH_TU_PDF = [
  // ── Nội thất — khoảng trống lớn nhất, trang đang có ĐÚNG 0 tấm ─────────────
  {
    file: "song-noi-that-nhin-ra-khu-do-thi.jpg",
    name: "song-noi-that-nhin-ra-khu-do-thi",
    alt: "Phối cảnh phòng khách nhìn qua cửa kính lớn ra đường nội khu và cây xanh",
  },
  {
    file: "song-noi-that-phong-khach-lien-bep.jpg",
    name: "song-noi-that-phong-khach-lien-bep",
    alt: "Phối cảnh phòng khách liền bếp trong một căn đã hoàn thiện nội thất",
  },
  // ── Người đang sống ở đó — cũng đang là 0 ──────────────────────────────────
  {
    file: "song-gia-dinh-tren-tham-co.jpg",
    name: "song-gia-dinh-tren-tham-co",
    alt: "Phối cảnh một gia đình đi dạo trên thảm cỏ trước dãy nhà, mùa hoa nở",
  },
  {
    file: "song-ngam-vinh-tu-ban-cong.jpg",
    name: "song-ngam-vinh-tu-ban-cong",
    alt: "Phối cảnh gia đình đứng ở ban công nhìn ra vịnh lúc mặt trời lặn",
  },
  // ── Giải trí — cũng đang là 0 ──────────────────────────────────────────────
  {
    file: "giai-tri-thuy-cung.jpg",
    name: "giai-tri-thuy-cung",
    alt: "Phối cảnh bể kính lớn trong thuỷ cung, người xem đứng thành hàng phía trước",
  },
  {
    file: "giai-tri-cong-vien-chu-de.jpg",
    name: "giai-tri-cong-vien-chu-de",
    alt: "Phối cảnh công viên chủ đề với nhân vật hoá trang và trẻ em",
  },
  // ── Phố thương mại — đúng lời hứa "vừa ở vừa khai thác mặt phố" ────────────
  // ── Tiện ích và thiên nhiên ───────────────────────────────────────────────
  {
    file: "tien-ich-san-golf-ven-ho.jpg",
    name: "tien-ich-san-golf-ven-ho",
    alt: "Phối cảnh sân golf ven hồ lúc hoàng hôn, có người đang chơi",
  },
  {
    file: "thien-nhien-cam-trai-rung-ngap-man.jpg",
    name: "thien-nhien-cam-trai-rung-ngap-man",
    alt: "Phối cảnh khu cắm trại lều bên mép nước trong rừng ngập mặn",
  },
  {
    file: "thien-nhien-cau-go-rung-ngap-man.jpg",
    name: "thien-nhien-cau-go-rung-ngap-man",
    alt: "Phối cảnh cầu gỗ đi bộ xuyên rừng ngập mặn nhìn từ trên cao",
  },
];

/**
 * Ảnh GỐC lấy từ thư mục Drive của chủ đầu tư, phát hiện ngày 08/09/2026.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * NĂM TẤM ĐẦU THAY THẲNG BẢN PHÓNG TỪ PDF — và đây là bằng chứng
 *
 * Đối chiếu bằng vân tay 16×16 xám chuẩn hoá giữa 13 tấm bóc từ PDF và 168 tấm
 * trên Drive. Bốn cặp có khoảng cách dưới 0,55 (thang 0 = trùng khít):
 *
 *     song-le-hoi-ben-du-thuyen     0,124
 *     song-pho-thuong-mai-buoi-toi  0,188
 *     giai-tri-bai-tam-lagoon       0,517
 *     song-dai-lo-mua-hoa           0,525
 *
 * Đã DỰNG ẢNH SO SÁNH VÀ NHÌN BẰNG MẮT — cùng một khung hình, khác mỗi độ
 * phân giải. Không tin số đo suông, vì đã có lần số đo đúng mà kết luận sai.
 *
 *     Ảnh trong PDF   428 – 785 px, còn phải phóng 2,3× mới dùng được
 *     Ảnh gốc Drive   tới 4000 px
 *
 * ⚠️ HAI THƯ MỤC ĐÃ LOẠI HẲN, ĐỪNG THÊM LẠI
 *
 * 1 · "Công viên TĐNĐ1" và "Công viên VBM1" (204 tệp) là HỒ SƠ THIẾT KẾ ĐANG
 *     LÀM DỞ. Tên file chính là câu lệnh cho máy sinh ảnh:
 *
 *        thêm_người_đang_202604241527.png
 *        xóa_biển_tên_202604241131.png
 *        AIComplex_1777024114909.png
 *        ChatGPT Image Apr 24, 2026, 03_50_00 PM.png
 *
 *     Đưa lên trang là đăng ảnh MÁY SINH như thể phối cảnh chính thức của chủ
 *     đầu tư. Trớ trêu ở chỗ nhiều tấm được đặt tên "ảnh_chụp_thực_…" — tức là
 *     người làm đang bảo máy vẽ sao cho GIỐNG ẢNH CHỤP THẬT.
 *
 * 2 · Hơn nửa thư mục "TIỆN ÍCH" là ẢNH THẬT CỦA NƠI KHÁC, dùng làm ảnh tham
 *     chiếu ý tưởng trong bộ bán hàng — không phải phối cảnh dự án:
 *
 *        "TỔ HỢP … C-DISTRICT"  → một ngôi chùa có thật, không ở Hạ Long
 *        "LÀNG BIA … BEER TOWN" → ảnh lễ hội bia châu Âu
 *        "CÔNG VIÊN ỐC ĐẢO …"   → một công viên kiểu Anh
 *        "CỤM 03 SÂN GOLF"      → sân golf ở nơi khác
 *
 *     Chỉ lấy ba tấm ở cuối mảng này, là phối cảnh đúng của dự án.
 *
 * TÊN FILE CÓ MÃ MẪU NHÀ: CH##-LK / SL / DL / BTB = liền kề, song lập, đơn
 * lập, biệt thự biển. Đây là thứ trước đây không có, nên đã từ chối đổi ảnh
 * năm thẻ sản phẩm — xem ke-hoach/06-ANH.md.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Mọi ảnh Drive đều có dải chữ "(*) Thông tin hình ảnh chỉ mang tính chất minh
 * hoạ…" nướng ở mép dưới, cao chừng 3% khung. Ở cỡ hiển thị nó không đọc nổi,
 * nên cắt đi và nói lại bằng chữ `alt` cùng câu cảnh báo in đậm trên trang.
 */
const CAT_CHU_CHAN = { trai: 0, tren: 0, phai: 1, duoi: 0.95 };

const ANH_DRIVE_MOI = [
  // ── Năm tấm thay bản phóng từ PDF, giữ NGUYÊN TÊN để nơi dùng không phải sửa
  { id: "1YdCMx74aJw_BDmhKUUmxN3mPJPlUztnt", name: "giai-tri-bai-tam-lagoon", alt: "Phối cảnh bãi tắm nước trong ở biển lagoon, có người chèo ván và thuyền nhỏ", crop: CAT_CHU_CHAN },
  // Dải chữ ở tấm này dày gấp đôi các tấm khác, nên cắt riêng 8%.
  { id: "1Eeopzy2ngRdysPIH9rbj0sxL21Q35ofX", name: "song-dai-lo-mua-hoa", alt: "Phối cảnh đại lộ nội khu mùa hoa nở, hai bên là dãy nhà thấp tầng", crop: { trai: 0, tren: 0, phai: 1, duoi: 0.92 } },
  { id: "1_4tDbJJ03TBYnYE_CWMho7SmwVD9L7S3", name: "song-le-hoi-ben-du-thuyen", alt: "Phối cảnh đêm lễ hội ngoài trời bên bến du thuyền", crop: CAT_CHU_CHAN },
  { id: "1YeidsMgJLLMr2jB6cgZK-JsSVJl7OpQd", name: "song-pho-thuong-mai-buoi-toi", alt: "Phối cảnh dãy phố thương mại lúc chập tối, hàng quán đã lên đèn", crop: CAT_CHU_CHAN },
  // ⚠️ KHÔNG lấy ảnh thuỷ cung của Drive về thay tấm đang dùng: bản Drive chỉ
  //    772×585, NHỎ HƠN bản bóc từ PDF. "Ảnh gốc" không mặc nhiên là ảnh to hơn
  //    — phải đo từng tấm. Tấm dưới đây là cảnh khác, 1067px, dùng bổ sung.
  { id: "1RA0p_QTORdHXQYnbawyR0s0CuyHIJneH", name: "giai-tri-nha-hang-duoi-nuoc", alt: "Phối cảnh nhà hàng dưới vòm kính thuỷ cung", crop: CAT_CHU_CHAN },

  // ── Giải trí, bổ sung
  { id: "19MzRPKhyuociJR97L0PvHvh0_xpSooL6", name: "giai-tri-lang-tuyet", alt: "Phối cảnh làng tuyết trong nhà, có người chơi trên nền tuyết", crop: CAT_CHU_CHAN },
  { id: "1xhWjuJGc5_7PCxkDZmQ7P9Oh23eKAAT1", name: "giai-tri-cong-vien-nuoc", alt: "Phối cảnh công viên nước chủ đề, phía sau là dãy núi đá vịnh Hạ Long", crop: CAT_CHU_CHAN },
  { id: "1FBGUOhAfGZf9R_H9qmf1A5CGII0Qm4NJ", name: "giai-tri-rap-xiec", alt: "Phối cảnh sân khấu biểu diễn trong nhà, khán đài kín người", crop: CAT_CHU_CHAN },

  // ── Theo DÒNG SẢN PHẨM. Mã trong tên file gốc cho biết ảnh thuộc dòng nào,
  //    nên gán được mà không phải đoán — điều trước đây không làm được.
  //
  //    CHỈ CÒN HAI TẤM, và đó là kết quả của việc đối chiếu chứ không phải
  //    lười. Đã tải về đủ bốn, rồi so vân tay với ảnh đang dùng:
  //
  //        song lập      lệch 0,35  →  CÙNG MỘT CẢNH, ảnh cũ đã đúng
  //        biệt thự biển lệch 0,41  →  CÙNG MỘT CẢNH, ảnh cũ đã đúng
  //
  //    Nghĩa là nhãn ảnh sản phẩm trên trang vốn đã chính xác. Thay bằng bản
  //    "gốc" chỉ đổi được cái đỡ dải chữ ở chân — không đáng để thêm hai tệp.
  //    Đã xoá khỏi mảng này, vì tài sản nằm không chính là thứ tôi vẫn chê.
  { id: "1wqZckH3uwitRjcvbXkfw-t2E3Hp__0Fd", name: "nha-lien-ke-mat-pho", alt: "Phối cảnh dãy nhà liền kề với mặt phố kinh doanh ở tầng một", crop: CAT_CHU_CHAN },
  { id: "1USgHCV6omL6Im4p74tGviVVpBgH7xLF1", name: "nha-don-lap-ven-nuoc", alt: "Phối cảnh biệt thự đơn lập bên mặt nước", crop: CAT_CHU_CHAN },

  // ── Tiện ích — CHỈ ba tấm là phối cảnh đúng của dự án, xem cảnh báo phía trên
  { id: "1dPVGpv8j2jV59VFoggJhKHOhmryUZ_bs", name: "tien-ich-be-boi-noi", alt: "Phối cảnh bể bơi nổi trên mặt biển, có người bơi", crop: CAT_CHU_CHAN },
  { id: "1Dgd9Ga41SpGxXqYADpy3zFZuJmQZE5gD", name: "tien-ich-bien-ho-trung-tam", alt: "Phối cảnh biển hồ trung tâm nhìn từ trên cao", crop: CAT_CHU_CHAN },
  { id: "1h_VL5Q5waqu0aVQooO_F1knmtIucJ_HI", name: "tien-ich-cong-vien-hai-au", alt: "Phối cảnh công viên ven biển có ngọn hải đăng, người đi dạo", crop: CAT_CHU_CHAN },
];

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function download(id, target) {
  const url = `https://drive.usercontent.google.com/download?id=${id}&export=download`;
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok || !response.body) {
    throw new Error(`Tải thất bại (HTTP ${response.status})`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(target));
}

async function prepare(asset) {
  const outPath = path.join(OUT_DIR, `${asset.name}.webp`);
  const rawPath = path.join(TMP_DIR, `${asset.name}.raw`);

  if (!(await exists(outPath))) {
    // Nguồn cục bộ thì bỏ qua hẳn bước tải. Ảnh gốc thiếu KHÔNG được nuốt
    // lặng: script vẫn chạy tiếp cho những ảnh khác, nhưng phải nói ra tên ảnh
    // hỏng, vì manifest thiếu một khoá là trang gãy lúc build chứ không phải
    // lúc chạy — và lúc đó thông báo lỗi không còn nhắc gì tới ảnh nữa.
    if (asset.file) {
      const goc = path.join(GOC_DIR, asset.file);
      if (!(await exists(goc))) {
        throw new Error(`thiếu ảnh gốc anh-goc/${asset.file}`);
      }
      console.log(`  · ${asset.name} (ảnh gốc tại chỗ)`);
      await sharp(goc)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);
      return prepare({ ...asset, file: undefined });
    }

    console.log(`  ↓ ${asset.name} …`);
    await download(asset.id, rawPath);

    let anh = sharp(rawPath);
    if (asset.crop) {
      // Toạ độ cắt ghi bằng TỈ LỆ chứ không bằng điểm ảnh, để đổi ảnh gốc độ
      // phân giải khác vẫn cắt đúng chỗ.
      const { width = 0, height = 0 } = await anh.metadata();
      const { trai, tren, phai, duoi } = asset.crop;
      anh = anh.extract({
        left: Math.round(width * trai),
        top: Math.round(height * tren),
        width: Math.round(width * (phai - trai)),
        height: Math.round(height * (duoi - tren)),
      });
    }

    await anh
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outPath);
    await rm(rawPath, { force: true });
    console.log("xong");
  }

  const image = sharp(outPath);
  const { width = 0, height = 0 } = await image.metadata();
  const blur = await image
    .resize({ width: BLUR_WIDTH })
    .webp({ quality: 40 })
    .toBuffer();

  return {
    ...asset,
    width,
    height,
    src: `/images/${asset.name}.webp`,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

/**
 * Chín phân khu, cắt ra từ chính sơ đồ quy hoạch.
 *
 * Bộ ảnh chủ đầu tư gửi KHÔNG ghi ảnh nào chụp khu nào, nên gán bừa là nói sai
 * với người mua. Cắt sơ đồ quanh toạ độ từng khu thì hình luôn đúng: đó thật sự
 * là khu đó, chỉ là nhìn từ bản vẽ quy hoạch.
 *
 * ⚠️ Toạ độ phải KHỚP với `phanKhu` trong src/data/project.ts. Đổi ở đó thì
 *    chạy lại `npm run assets` (xoá ảnh khu cũ trước) để cắt lại cho đúng.
 */
const PHAN_KHU = [
  { ma: "paradise-bay", ten: "Vịnh Thiên Đường", x: 28.1, y: 70.7 },
  { ma: "wonder-island", ten: "Đảo Kỳ Quan", x: 37.1, y: 18.7 },
  { ma: "festa-bay", ten: "Vịnh Lễ Hội", x: 47.5, y: 18.7 },
  { ma: "elite-sport-island", ten: "Đảo Tinh Hoa Thể Thao", x: 61.3, y: 12.5 },
  { ma: "crystal-island", ten: "Đảo Pha Lê", x: 58.3, y: 54.6 },
  { ma: "new-horizon-island", ten: "Đảo New Horizon", x: 70.6, y: 54.6 },
  { ma: "elite-green-island", ten: "Đảo Thượng Lưu Xanh", x: 78.4, y: 18.6 },
  { ma: "green-energy-bay", ten: "Vịnh Năng Lượng Xanh", x: 89.3, y: 24.8 },
  { ma: "diamond-island", ten: "Đảo Kim Cương", x: 83.1, y: 48.6 },
];

/** Cửa sổ cắt quanh mỗi khu, tính theo tỉ lệ bề ngang/cao của sơ đồ. */
const CUA_SO = { rong: 0.36, cao: 0.5 };

async function catPhanKhu() {
  const nguon = path.join(OUT_DIR, "tmb-ban-do.webp");
  if (!(await exists(nguon))) {
    console.log("  (bỏ qua cắt phân khu — chưa có tmb-ban-do.webp)");
    return [];
  }
  const { width = 0, height = 0 } = await sharp(nguon).metadata();
  const wCat = Math.round(width * CUA_SO.rong);
  const hCat = Math.round(height * CUA_SO.cao);

  const ra = [];
  for (const khu of PHAN_KHU) {
    const ten = `khu-${khu.ma}`;
    const dich = path.join(OUT_DIR, `${ten}.webp`);
    if (!(await exists(dich))) {
      // Kẹp vào trong khung để khu nằm sát mép không bị cắt hụt.
      const left = Math.max(0, Math.min(width - wCat, Math.round((khu.x / 100) * width - wCat / 2)));
      const top = Math.max(0, Math.min(height - hCat, Math.round((khu.y / 100) * height - hCat / 2)));
      await sharp(nguon)
        .extract({ left, top, width: wCat, height: hCat })
        .webp({ quality: WEBP_QUALITY })
        .toFile(dich);
      console.log(`  ✂ ${ten}`);
    }
    ra.push({
      name: ten,
      alt: `Vị trí phân khu ${khu.ten} trên sơ đồ quy hoạch`,
    });
  }
  return ra;
}

/**
 * Chặn khai một nguồn ảnh hai lần dưới hai cái tên.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CẦN MÁY KIỂM CHỨ KHÔNG PHẢI MẮT NGƯỜI
 *
 * Danh sách này dài hơn năm mươi mục, mỗi mục là một chuỗi mã Drive ngẫu nhiên
 * ba mươi ba ký tự. Hai mục cách nhau tám mươi dòng mang cùng một mã thì không
 * ai đọc ra — nhưng máy đối chiếu hết trong một phần nghìn giây.
 *
 * Đã xảy ra thật: ba mã bị khai hai lần, script tải về ba cặp file giống nhau
 * từng byte, và không ai thấy suốt nhiều tuần vì mọi thứ vẫn "chạy đúng".
 *
 * TRÙNG MÃ KÈM `crop` LÀ HỢP LỆ, và đó là lý do không thể chỉ so mã. Cắt hai
 * vùng khác nhau từ cùng một tấm sơ đồ ra hai ảnh khác nhau là đúng ý đồ — bộ
 * ảnh phân khu làm đúng như vậy. Chỉ trùng mã mà CẢ HAI đều không cắt mới là
 * lỗi, vì khi đó hai mục cho ra hai file giống hệt nhau.
 *
 * Dừng hẳn chứ không cảnh báo: một cảnh báo giữa hơn năm mươi dòng nhật ký
 * "✓ đã tải" là một cảnh báo không ai đọc.
 * ═══════════════════════════════════════════════════════════════════════════
 */
function kiemTrung(danhSach) {
  const theoMa = new Map();
  for (const a of danhSach) {
    if (!a.id) continue; // ảnh cục bộ không có mã Drive
    if (!theoMa.has(a.id)) theoMa.set(a.id, []);
    theoMa.get(a.id).push(a);
  }

  const loi = [];
  for (const [ma, nhom] of theoMa) {
    if (nhom.length < 2) continue;
    const khongCat = nhom.filter((a) => !a.crop);
    if (khongCat.length > 1) {
      loi.push(`  ${ma}\n    → ${khongCat.map((a) => a.name).join(", ")}`);
    }
  }

  const trungTen = danhSach
    .map((a) => a.name)
    .filter((t, i, ds) => ds.indexOf(t) !== i);
  if (trungTen.length) {
    loi.push(`  Trùng TÊN (ảnh sau ghi đè ảnh trước): ${[...new Set(trungTen)].join(", ")}`);
  }

  if (loi.length) {
    console.error(
      "\n✗ Danh sách ảnh khai trùng nguồn — sẽ tải về các file giống hệt nhau:\n" +
        `${loi.join("\n")}\n\n` +
        "  Cùng một mã Drive chỉ được khai nhiều lần khi MỖI mục có `crop`\n" +
        "  riêng. Không cắt thì gộp lại thành một mục và dùng chung tên.\n",
    );
    process.exit(1);
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(TMP_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const tatCa = [...ASSETS, ...ANH_CUC_BO, ...ANH_TU_PDF, ...ANH_DRIVE_MOI];
  kiemTrung(tatCa);
  console.log(`Xử lý ${tatCa.length} ảnh…`);
  const entries = [];
  // ĐẾM HỎNG NGAY TẠI CHỖ HỎNG, đừng suy ra từ tên ở cuối. Xem chú thích tại
  // dòng báo kết quả bên dưới để biết vì sao.
  let hong = 0;
  for (const asset of tatCa) {
    try {
      entries.push(await prepare(asset));
    } catch (error) {
      hong++;
      console.error(`  ✗ ${asset.name}: ${error.message}`);
    }
  }

  // Cắt phân khu chạy SAU khi tải xong, vì nó lấy nguồn từ ảnh sơ đồ vừa nén.
  for (const khu of await catPhanKhu()) {
    try {
      entries.push(await prepare({ ...khu, id: "" }));
    } catch (error) {
      hong++;
      console.error(`  ✗ ${khu.name}: ${error.message}`);
    }
  }

  const body = entries
    .map(
      (entry) =>
        `  "${entry.name}": {\n` +
        `    src: "${entry.src}",\n` +
        `    width: ${entry.width},\n` +
        `    height: ${entry.height},\n` +
        `    alt: ${JSON.stringify(entry.alt)},\n` +
        `    blurDataURL:\n      "${entry.blurDataURL}",\n` +
        `  },`,
    )
    .join("\n");

  await writeFile(
    MANIFEST,
    `// TỆP SINH TỰ ĐỘNG — đừng sửa tay.\n` +
      `// Chạy \`npm run assets\` để tạo lại từ ảnh gốc trên Google Drive.\n\n` +
      `export interface ProjectImage {\n` +
      `  src: string;\n  width: number;\n  height: number;\n` +
      `  alt: string;\n  blurDataURL: string;\n}\n\n` +
      `export const projectImages = {\n${body}\n} as const satisfies Record<string, ProjectImage>;\n\n` +
      `export type ProjectImageName = keyof typeof projectImages;\n`,
    "utf8",
  );

  await rm(TMP_DIR, { recursive: true, force: true });
  // ⚠️ DÒNG NÀY TỪNG SUY RA SỐ ẢNH HỎNG TỪ TIỀN TỐ TÊN, VÀ NÓ NÓI DỐI.
  //
  // Bản cũ: `tatCa.length - entries.filter(e => !e.name.startsWith("khu-"))`.
  // Ý định đúng — loại ảnh cắt từ sơ đồ ra khỏi phép đếm, vì chúng không nằm
  // trong danh sách khai. Nhưng phép loại dựa vào TÊN, mà hai ảnh khai tay là
  // `khu-1-view-bien` và `khu-1-cong-vien-hoang-hon` cũng bắt đầu bằng `khu-`.
  //
  // Nên script báo "THIẾU 2 ảnh" ở MỌI lần chạy thành công, kèm lời khuyên
  // "xem dòng ✗ ở trên" trong khi không có dòng ✗ nào. Một cảnh báo luôn bật
  // là một cảnh báo đã tắt: chạy vài lần là người ta thôi đọc nó, và lần thật
  // sự thiếu ảnh sẽ trôi qua không ai thấy.
  //
  // Giờ đếm thẳng số lần `prepare()` ném lỗi. Không suy diễn, không tiền tố.
  const thieu = hong;
  console.log(
    `\nHoàn tất: ${entries.length} ảnh trong manifest` +
      (thieu > 0 ? ` — THIẾU ${thieu} ảnh, xem dòng ✗ ở trên` : "") +
      `\n${MANIFEST}`,
  );

  await taoAnhChiaSe();
}

/**
 * Ảnh nền cho thẻ chia sẻ (Zalo, Facebook, Messenger).
 *
 * Sinh ở ĐÂY chứ không dựng lúc build, vì HAI lý do đã trả giá mới biết:
 *
 *  1. `next/og` dùng satori, mà satori CHỈ đọc được PNG, JPEG và SVG. Đưa WebP
 *     vào thì build gãy với thông báo "u2 is not iterable" — không nhắc gì tới
 *     ảnh, nên rất dễ đi tìm nhầm sang phía font.
 *
 *  2. Lớp tối phải NUNG SẴN vào ảnh. Satori bỏ qua một `<div>` rỗng phủ lên
 *     trên mà không khai chiều rộng/cao: nó co về 0×0 rồi biến mất, KHÔNG báo
 *     lỗi. Ảnh vẫn ra, chỉ là chữ nằm trần trên nền sáng — chỉ phát hiện được
 *     bằng cách mở ảnh kết quả lên nhìn.
 *
 * `sharp` hiểu gradient trong SVG, nên lớp phủ dựng bằng SVG rồi chồng lên.
 */
async function taoAnhChiaSe() {
  const nguon = path.join(OUT_DIR, "toan-canh-hoang-hon.webp");
  const dich = path.join(ROOT, "src", "assets", "og-nen.jpg");

  const phu = Buffer.from(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#04140f" stop-opacity="0.97"/>
        <stop offset="32%" stop-color="#04140f" stop-opacity="0.86"/>
        <stop offset="64%" stop-color="#04140f" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="#04140f" stop-opacity="0.04"/>
      </linearGradient></defs>
      <rect width="1200" height="630" fill="url(#g)"/>
    </svg>`,
  );

  await mkdir(path.dirname(dich), { recursive: true });
  const ket = await sharp(nguon)
    // `position: "attention"` để sharp tự chọn vùng cắt nhiều chi tiết nhất,
    // thay vì cắt giữa và có thể rơi trúng một mảng nước trống.
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .composite([{ input: phu, blend: "over" }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(dich);

  console.log(
    `Ảnh chia sẻ: ${Math.round(ket.size / 1024)}KB → src/assets/og-nen.jpg`,
  );
}

await main();
