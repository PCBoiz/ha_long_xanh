import type { ProjectImageName } from "@/data/images.generated";
import type { BaiViet } from "@/data/news";

/**
 * Chọn ảnh đầu bài từ KHO ẢNH CÓ SẴN, theo chuyên mục.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO CHỌN Ở PHÍA TRANG, KHÔNG PHẢI ĐỂ BÊN GỬI BÀI CHỌN
 *
 * Cách hiển nhiên là thêm trường `anh` vào cổng nhận bài rồi để Antigravity
 * gửi kèm. Nhưng nó kéo theo một cột mới trong cơ sở dữ liệu, một lần chuyển
 * đổi lược đồ trên máy chủ thật, và sửa cả hai kho mã cùng lúc — trong khi
 * chuyển đổi lược đồ vừa là thứ làm hỏng cả đường ống hôm 08/09.
 *
 * Quan trọng hơn: bên gửi bài KHÔNG BIẾT kho ảnh có gì. Nếu để nó chọn, nó chỉ
 * có hai đường — hoặc đoán một cái tên (rồi hỏng lặng lẽ khi tên đó không tồn
 * tại), hoặc tự sinh ảnh mới. Cả hai đều tệ hơn việc chọn ở đây, nơi danh sách
 * ảnh là kiểu dữ liệu mà trình biên dịch kiểm được.
 *
 * ⚠️ VÌ SAO KHÔNG DÙNG ẢNH DO AI SINH
 *
 * Đã cân nhắc và loại. Ảnh AI vẽ về một dự án CÓ THẬT là bịa hình ảnh của một
 * nơi có thật — đúng thứ vừa bị loại khỏi thư mục Drive của chủ đầu tư ngày
 * 08/09, nơi có 204 tệp mang tên là câu lệnh cho máy sinh ảnh.
 *
 * Một trang tự nhận là kênh tư vấn độc lập mà minh hoạ bằng ảnh máy vẽ thì mất
 * đúng thứ nó đang bán: người đọc tin được cái mình nhìn thấy.
 *
 * CÁCH CHỌN LÀ TẤT ĐỊNH, KHÔNG NGẪU NHIÊN
 *
 * Băm từ `slug` rồi lấy dư. Cùng một bài luôn ra cùng một ảnh — nếu bốc ngẫu
 * nhiên, ảnh sẽ nhảy mỗi lần dựng lại trang, và người quay lại đọc tiếp một
 * bài sẽ thấy một bài khác. `Math.random()` ở đây cũng làm hỏng luôn việc dựng
 * tĩnh, vì máy chủ và trình duyệt sẽ ra hai kết quả khác nhau.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Ảnh theo từng chuyên mục. Mỗi danh sách chỉ chứa ảnh THẬT SỰ nói về chuyên
 * mục đó — ghép bừa thì người đọc thấy ảnh công trường trong bài về chính sách,
 * và mất niềm tin ở đúng chỗ rẻ nhất để giữ.
 */
const THEO_CHUYEN_MUC: Record<BaiViet["chuyenMuc"], ProjectImageName[]> = {
  // Ảnh CHỤP THẬT ở công trường, có dấu thời gian của chủ đầu tư nung vào góc.
  // Bài tiến độ mà minh hoạ bằng phối cảnh là nói ngược lại chính nội dung.
  "Tiến độ": [
    "tien-do-0826-toan-canh-khu-o",
    "tien-do-0826-ha-tang-hoan-thien",
    "tien-do-0826-cong-trinh-mat-duong",
    "tien-do-0826-len-tang",
    "tien-do-0826-dai-lo-cay-xanh",
    "tien-do-0826-san-nen-phan-lo",
  ],
  // Bài chính sách nói về căn nhà và tiền — dùng ảnh sản phẩm và nội thất.
  "Chính sách": [
    "song-noi-that-nhin-ra-khu-do-thi",
    "song-noi-that-phong-khach-lien-bep",
    "nha-lien-ke-mat-pho",
    "nha-don-lap-ven-nuoc",
  ],
  // Bài sự kiện nói về thứ đang diễn ra — dùng ảnh có người, có hoạt động.
  // 12/09: bỏ `giai-tri-rap-xiec` và `giai-tri-lang-tuyet` — ảnh AI bị cấm từ
  // 10/09 mà vẫn nằm trong kho này, tức bài "Sự kiện" có thể đã mang ảnh AI.
  "Sự kiện": [
    "song-le-hoi-ben-du-thuyen",
    "giai-tri-cong-vien-chu-de",
    "song-pho-thuong-mai-buoi-toi",
    "tien-ich-cong-vien-hai-au",
  ],
  // Bài thị trường nói về cả khu — dùng ảnh toàn cảnh và đời sống chung.
  "Thị trường": [
    "toan-canh-hoang-hon",
    "song-dai-lo-mua-hoa",
    "song-pho-thuong-mai-buoi-toi",
    "song-gia-dinh-tren-tham-co",
    "song-ngam-vinh-tu-ban-cong",
    "tien-ich-san-golf-ven-ho",
    "thien-nhien-cau-go-rung-ngap-man",
  ],
};

/** Băm chuỗi thành số nguyên không âm. Đủ đều cho việc chia ảnh, không cần hơn. */
function bam(cau: string): number {
  let h = 0;
  for (let i = 0; i < cau.length; i++) {
    h = (h * 31 + cau.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function anhChoBai(bai: Pick<BaiViet, "slug" | "chuyenMuc">): ProjectImageName {
  const bo = THEO_CHUYEN_MUC[bai.chuyenMuc] ?? THEO_CHUYEN_MUC["Thị trường"];
  return bo[bam(bai.slug) % bo.length];
}

/**
 * Ảnh tiến độ là ảnh CHỤP; mọi ảnh còn lại là PHỐI CẢNH. Câu chú thích phải nói
 * đúng loại — đây là ranh giới trang này giữ ở mọi chỗ khác, không có lý do gì
 * để buông ở đây.
 */
export function chuThichAnh(ten: ProjectImageName): string {
  return ten.startsWith("tien-do-")
    ? "Ảnh công trường do chủ đầu tư phát hành, tháng 08/2026."
    : "Phối cảnh do chủ đầu tư phát hành — chưa phải ảnh công trình đã xong.";
}
