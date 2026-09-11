import { ProjectImage } from "@/components/ui/project-image";
import { BangTruot, TheTruot } from "@/components/ui/bang-truot";
import type { ProjectImageName } from "@/data/images.generated";

/**
 * Dải ảnh trượt ngang — KHÔNG MỘT CHỮ NÀO.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * KHỐI NÀY THAY CHO "SỐNG Ở ĐÂY THÌ MỘT NGÀY TRÔI THẾ NÀO", VÀ ĐÂY LÀ LÝ DO
 *
 * Bản cũ đặt một câu hỏi lên đầu mỗi thẻ — "Nhà tôi trông ra cái gì?", "Con
 * tôi chơi ở đâu?" — rồi trả lời bên dưới. Ý định là nói bằng giọng người mua.
 *
 * Chủ trang đọc ra khác hẳn: nghe như đang NÓI XẤU KHÁCH. Đặt câu hỏi vào
 * miệng người ta rồi tự trả lời hộ thì giọng thành kẻ cả, dù từng chữ đều lịch
 * sự. Và ở một trang bán nhà vài tỷ, người đọc là người trả tiền — không phải
 * học trò cần được giảng.
 *
 * Nên bỏ hẳn phần chữ, không sửa lại cho êm. Ảnh đẹp không cần ai chú thích
 * rằng nó đẹp; thêm một câu vào là thêm một chỗ để nghe sai giọng.
 *
 * ⚠️ HAI ĐIỀU ĐỪNG THÊM VÀO ĐÂY
 *
 * 1 · KHÔNG thêm chú thích dưới ảnh. Đó chính là thứ vừa bị gỡ.
 * 2 · KHÔNG thêm tiêu đề mảng. Khối này là một nhịp NGHỈ giữa mảng số liệu và
 *     mảng sản phẩm — nó nói bằng hình. Gắn tiêu đề vào là biến nhịp nghỉ
 *     thành một mục phải đọc.
 *
 * Câu cảnh báo "toàn bộ là phối cảnh" vẫn còn, nhưng chuyển sang trang tiến độ
 * và các khối có chữ khác — nó là lời cảnh báo về NỘI DUNG, và khối này không
 * còn khẳng định nội dung gì.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CHỌN ẢNH THEO ĐÚNG MỘT TIÊU CHÍ: có nhìn thấy từ xa không.
 *
 * Bộ cũ toàn cảnh yên bình — gia đình đi trên cỏ, phòng khách, cầu gỗ trong
 * rừng. Đẹp, nhưng ở cỡ một thẻ trong dải trượt thì chúng đọc ra như nhau: một
 * mảng xanh và vài bóng người. Bộ dưới đây chọn thứ có SỰ KIỆN trong khung —
 * pháo hoa, sân khấu, mặt nước lớn, ánh đèn — vì đó là thứ giữ được mắt người
 * đang lướt.
 */
// ⚠️ 12/09/2026: ba tấm `giai-tri-cong-vien-nuoc`, `giai-tri-rap-xiec`,
// `giai-tri-lang-tuyet` bị CẤM từ 10/09 (ảnh AI, xem `anh-cam-dung.ts`) nhưng
// vẫn nằm ở đây và chạy trên trang chủ thật hai ngày — vì lần gỡ 10/09 chỉ sửa
// /tien-ich, và cổng kiểm khi đó không đỏ khi ảnh cấm ĐƯỢC DÙNG. Giờ nó đỏ.
// Ba tấm thay vào là phối cảnh có bản gốc 2560px của chủ đầu tư, cùng tiêu
// chí "có sự kiện trong khung": đèn phố đêm, lễ hội ban ngày, đại lộ mùa hoa.
const ANH: ProjectImageName[] = [
  "toan-canh-hoang-hon",
  "song-le-hoi-ben-du-thuyen",
  "song-pho-thuong-mai-buoi-toi",
  "tien-ich-be-boi-noi",
  "giai-tri-cong-vien-chu-de",
  "tien-ich-bien-ho-trung-tam",
  "song-dai-lo-mua-hoa",
  "giai-tri-bai-tam-lagoon",
  "view-san-golf",
];

export function DaiAnhLon() {
  return (
    <BangTruot>
      {ANH.map((ten) => (
        <TheTruot key={ten} co="rong">
          {/* Khung 16:9 chứ không phải 3:2 như bản cũ. Không còn chữ bên dưới
              nên thẻ được phép cao hơn, và khung rộng hợp với ảnh toàn cảnh —
              đúng loại ảnh đang dùng ở đây. */}
          <div className="overflow-hidden rounded-sm bg-ink-soft">
            <ProjectImage
              name={ten}
              className="aspect-video w-full object-cover"
              sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw"
            />
          </div>
        </TheTruot>
      ))}
    </BangTruot>
  );
}
