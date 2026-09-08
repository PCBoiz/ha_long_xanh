import { ProjectImage } from "@/components/ui/project-image";
import { BangTruot, TheTruot } from "@/components/ui/bang-truot";
import type { ProjectImageName } from "@/data/images.generated";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO KHỐI NÀY TỒN TẠI
 *
 * Đếm ngày 08/09/2026, trên 52 ảnh của trang:
 *
 *     Ảnh nội thất                  0
 *     Ảnh giải trí                  0
 *     Ảnh có người trong khung      gần như 0
 *
 * Tỉ lệ kiến trúc / đời sống thật là khoảng 95/5. Toàn bộ trang là mặt tiền
 * rỗng, công trường và bản vẽ — không một tấm nào cho thấy NGƯỜI ĐANG SỐNG.
 *
 * Người sắp chuyển vài tỷ không mua mặt tiền. Họ mua một hình dung, và hình
 * dung đó có hình dạng của những câu hỏi rất cụ thể: cuối tuần tôi ở đây thế
 * nào, con tôi chơi ở đâu, nhà tôi trông ra cái gì. Khối này lấy đúng những
 * câu đó làm nhan đề từng thẻ, rồi trả lời mỗi câu bằng một tấm ảnh.
 *
 * ⚠️ HAI RÀNG BUỘC KHI SỬA KHỐI NÀY
 *
 * 1 · KHÔNG THÊM SỐ VÀO ĐÂY. Diện tích và quy mô đã có bảng tiện ích riêng,
 *     nơi từng con số gắn cờ `canXacNhan` và có ghi chú nguồn. Chép một con số
 *     sang đây là tạo bản thứ hai không ai bảo trì — và bản sai sẽ sống lâu
 *     hơn bản đúng.
 *
 * 2 · KHÔNG DÙNG TỪ SO SÁNH NHẤT. Bộ tài liệu của chủ đầu tư gọi thuỷ cung là
 *     "lớn nhất thế giới". Trang này không nhắc lại những câu như thế khi
 *     không tự kiểm chứng được — kể cả khi chính chủ đầu tư viết ra.
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface CanhSong {
  anh: ProjectImageName;
  cauHoi: string;
  traLoi: string;
}

const CANH: CanhSong[] = [
  {
    anh: "song-ngam-vinh-tu-ban-cong",
    cauHoi: "Nhà tôi trông ra cái gì?",
    traLoi:
      "Tuỳ vị trí lô. Những căn ở rìa bán đảo nhìn thẳng ra mặt nước và dãy núi đá; sâu vào trong thì nhìn ra công viên hoặc đường nội khu.",
  },
  {
    anh: "song-gia-dinh-tren-tham-co",
    cauHoi: "Con tôi chơi ở đâu?",
    traLoi:
      "Công viên nằm xen giữa các dãy nhà chứ không dồn về một chỗ, nên trẻ con ra chơi không phải băng qua đường lớn.",
  },
  {
    anh: "song-noi-that-nhin-ra-khu-do-thi",
    cauHoi: "Bên trong một căn trông thế nào?",
    traLoi:
      "Đây là căn mẫu do chủ đầu tư dựng. Nội thất bàn giao thực tế phụ thuộc dòng sản phẩm và gói chọn theo — hỏi tôi trước khi hình dung theo ảnh.",
  },
  {
    anh: "song-noi-that-phong-khach-lien-bep",
    cauHoi: "Nhà bàn giao đến mức nào?",
    traLoi:
      "Câu trả lời nằm trong hợp đồng mua bán, không nằm trong tấm ảnh này. Mức bàn giao khác nhau theo dòng sản phẩm — đọc kỹ phụ lục trước khi tính chi phí hoàn thiện.",
  },
  {
    anh: "song-pho-thuong-mai-buoi-toi",
    cauHoi: "Tối ở đây có gì?",
    traLoi:
      "Tầng một của các dãy liền kề là mặt phố kinh doanh. Đó cũng là lý do dòng liền kề được mua để vừa ở vừa khai thác.",
  },
  {
    anh: "song-dai-lo-mua-hoa",
    cauHoi: "Đường trong khu ra sao?",
    traLoi:
      "Trục nội khu tách khỏi đường đối ngoại. Bề rộng từng tuyến ghi trong quy hoạch chi tiết — hỏi tôi con số của đúng tuyến trước lô anh/chị đang xem.",
  },
  {
    anh: "giai-tri-thuy-cung",
    cauHoi: "Cuối tuần đi đâu?",
    traLoi:
      "Thuỷ cung và công viên chủ đề nằm trong ranh dự án, không phải đi xa. Đây là phần đang xây, chưa vận hành.",
  },
  {
    anh: "giai-tri-bai-tam-lagoon",
    cauHoi: "Có bơi được không?",
    traLoi:
      "Hệ biển lagoon nhân tạo chạy dọc khu ở. Chủ đầu tư công bố dùng nước biển tự nhiên; con số và cách xử lý nước thì chưa có hồ sơ kỹ thuật công khai.",
  },
  {
    anh: "tien-ich-san-golf-ven-ho",
    cauHoi: "Có golf không?",
    traLoi:
      "Có, và đây là hạng mục giữ giá trị dài hạn hơn cả — sân golf khó sao chép, nên nó neo mặt bằng giá của cả khu.",
  },
  {
    anh: "thien-nhien-cau-go-rung-ngap-man",
    cauHoi: "Còn chỗ nào yên tĩnh không?",
    traLoi:
      "Rừng ngập mặn được giữ lại làm công viên, có cầu gỗ đi xuyên. Đây là phần thiên nhiên có sẵn chứ không phải phần dựng thêm.",
  },
];

export function MotNgayODay() {
  return (
    <BangTruot>
      {CANH.map((canh) => (
        <TheTruot key={canh.anh} co="rong">
          <figure className="flex h-full flex-col">
            <div className="overflow-hidden rounded-sm bg-ink-soft">
              <ProjectImage
                name={canh.anh}
                className="aspect-[3/2] w-full object-cover"
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw"
              />
            </div>
            <figcaption className="mt-4 flex flex-1 flex-col">
              <h3 className="font-display text-h3 font-normal text-balance">
                {canh.cauHoi}
              </h3>
              <p className="mt-2 text-small leading-relaxed text-paper-dim">
                {canh.traLoi}
              </p>
            </figcaption>
          </figure>
        </TheTruot>
      ))}
    </BangTruot>
  );
}
