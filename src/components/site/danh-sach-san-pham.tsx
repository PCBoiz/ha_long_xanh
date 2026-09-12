import Link from "next/link";
import { ProjectImage } from "@/components/ui/project-image";
import quyCan from "@/data/quy-can.generated.json";
import { Reveal } from "@/components/ui/reveal";
import { Tilt } from "@/components/motion/scroll-effects";
import { dongSanPham } from "@/data/project";

/**
 * Danh sách dòng sản phẩm.
 *
 * Nguyên tắc: mỗi dòng thông số CHỈ hiện khi có số thật trong `data/project.ts`.
 * Với bất động sản, một con số bịa để "cho đủ thẻ" là rủi ro pháp lý chứ không
 * phải chuyện trình bày — nên thà thẻ trống một dòng còn hơn.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ BỘ LỌC ĐÃ BỊ GỠ. ĐỪNG THÊM LẠI.
 *
 * Có sáu nút lọc — "Tất cả" cộng năm dòng sản phẩm — đứng ngay trên một danh
 * sách CÓ ĐÚNG NĂM MỤC. Lọc để bớt từ năm xuống một, trong khi cuộn qua cả
 * năm mất chưa tới hai giây.
 *
 * Cái giá thì có thật: hàng nút chiếm khoảng 200px trên điện thoại, đứng chắn
 * ngay trước nội dung; và nó buộc cả khối thành thành phần chạy ở trình duyệt
 * chỉ để giữ một biến trạng thái. Bỏ đi thì khối này chạy hẳn trên máy chủ —
 * ít mã gửi xuống máy khách hơn, và người xem thấy nội dung sớm hơn.
 *
 * Bộ lọc chỉ đáng có khi danh sách dài tới mức không cuộn hết được. Nếu sau
 * này số dòng sản phẩm tăng đáng kể thì cân nhắc lại — nhưng lúc đó chỗ đúng
 * là trang /san-pham, không phải trang chủ.
 * ═══════════════════════════════════════════════════════════════════════════
 */
/**
 * Khoảng diện tích ĐANG MỞ BÁN, đọc thẳng từ bảng hàng — khác với khoảng
 * THIẾT KẾ ghi trong `dongSanPham`.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO PHẢI CÓ HAI CON SỐ, KHÔNG PHẢI MỘT
 *
 * Ngày 08/09/2026, đối chiếu bảng hàng sống 616 căn với con số trên trang:
 *
 *     Liền kề    trang ghi 60–144    ·  đang bán 50–137,2
 *     Song lập   trang ghi 162–183   ·  đang bán 162–230,2
 *     Đơn lập    trang ghi 250–500   ·  đang bán 243–361
 *
 * CẢ HAI ĐỀU ĐÚNG, và đó chính là lý do phải ghi cả hai. Khoảng thiết kế là
 * của TOÀN dự án, gồm tám phân khu chưa ra hàng. Khoảng đang bán là của hai
 * tiểu khu duy nhất đang mở. Chỉ ghi một con số là bỏ mất nửa sự thật:
 *
 *   · chỉ ghi thiết kế → khách đi tìm căn 144 m² không có mà mua
 *   · chỉ ghi đang bán → trang trông như dự án nhỏ hơn thực tế
 *
 * ⚠️ VÀ ĐÂY LÀ CHỖ TÔI ĐÃ SAI HAI LẦN, ĐỌC TRƯỚC KHI SỬA
 *
 * Bộ tài liệu chủ đầu tư 06/09 ghi liền kề có mẫu 50 m². Tôi báo động là trang
 * sai, rồi TỰ ĐÍNH CHÍNH rằng báo động đó sai và 60–144 mới đúng.
 *
 * Bảng hàng sống có 9 căn liền kề dưới 60 m², nhỏ nhất đúng 50 m². Tài liệu
 * đúng, lời đính chính của tôi mới sai.
 *
 * Bài học: một trang tiếp thị không bác được một bảng hàng. Thứ tự tin cậy là
 * BẢNG HÀNG ĐANG BÁN → hồ sơ chủ đầu tư → trang tiếp thị.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const KHOP_DONG: Record<string, string> = {
  "lien-ke": "Liền kề",
  "song-lap": "Song lập",
  "don-lap": "Đơn lập",
  "biet-thu-bien": "Biệt thự biển",
  "can-ho": "Căn hộ",
};

function dangMoBan(ma: string): { khoang: string; so: number } | null {
  const ten = KHOP_DONG[ma];
  if (!ten) return null;
  const dt = (quyCan.dienTichDat as Record<string, { nhoNhat: number; lonNhat: number }>)[ten];
  const so = quyCan.theoLoaiHinh.find((x) => x.ten === ten)?.so ?? 0;
  if (!dt || !so) return null;
  const gon = (n: number) => n.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
  return { khoang: `${gon(dt.nhoNhat)} – ${gon(dt.lonNhat)}`, so };
}


export function DanhSachSanPham() {
  return (
    <div>
      {/* HAI CỘT NGAY TỪ KHỔ ĐIỆN THOẠI.
          Một cột thì năm thẻ chiếm 2.689px — gần ba màn hình rưỡi, và là khối
          dài nhất trang. Người xem phải cuộn qua bốn dòng sản phẩm mới biết có
          dòng thứ năm, nên "năm cách để thuộc về nơi này" không bao giờ được
          nhìn thấy như một lựa chọn năm phương án.
          Hai cột thì cả năm nằm gọn trong hơn một màn hình: so sánh được, và
          đó mới là việc của khối này. Xem kỹ một dòng là việc của trang riêng,
          và giờ cả thẻ đã dẫn sang đó. */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 md:gap-y-14 lg:grid-cols-3">
        {dongSanPham.map((dong, thuTu) => (
          <Reveal key={dong.ma} delay={(thuTu % 3) * 90} className="h-full">
            {/* CẢ THẺ LÀ MỘT LIÊN KẾT, dẫn sang trang riêng của dòng sản phẩm.
                Trước đây thẻ không dẫn đi đâu; chỉ có một liên kết nhỏ ở đáy,
                và cả năm thẻ đều trỏ về cùng một chỗ là /lien-he. Nghĩa là năm
                trang `/san-pham/[ma]` đã dựng sẵn — có mặt bằng, thông số, tài
                liệu — mà không đường nào từ trang chủ dẫn tới.
                Người muốn xem kỹ một dòng thì bị đẩy thẳng sang biểu mẫu liên
                hệ, tức là bị hỏi số điện thoại trước khi được xem hàng. */}
            <Link
              href={`/san-pham/${dong.ma}`}
              className="group flex h-full flex-col"
            >
              <Tilt nghieng={6}>
                <div className="overflow-hidden bg-ink-soft">
                  {/* `sizes` PHẢI KHỚP LƯỚI: lưới này 2 cột từ điện thoại tới
                      md (`grid-cols-2`), 3 cột từ lg. Bản trước khai 100vw
                      cho điện thoại nên trình duyệt tải ảnh 828px cho ô rộng
                      211px — Lighthouse 13/09 đo lãng phí ~700 KB chỉ riêng
                      mảng này trên trang chủ. */}
                  <ProjectImage
                    name={dong.anh}
                    sizes="(min-width: 1024px) 31vw, 46vw"
                    className="aspect-4/3 w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </Tilt>

              <h3 className="mt-5 font-display text-h3 font-normal transition-colors group-hover:text-jade">
                {dong.ten}
              </h3>
              {/* ⚠️ `flex-1` GIỮ CÁC THẺ THẲNG HÀNG NHAU. ĐỪNG GỠ.

                  Nhìn bằng trình duyệt thật ngày 07/09/2026, khung 390×844:
                  mô tả "Nhà liền kề" dài BA dòng, "Biệt thự song lập" chỉ
                  HAI. Không có `flex-1` thì đường kẻ ngang và dòng "Diện
                  tích" của hai thẻ nằm cạnh nhau LỆCH nhau một dòng chữ.

                  Mắt bắt được ngay dù người xem không gọi tên được — và đó
                  đúng là thứ làm một trang trông cẩu thả. Còn tệ hơn ở hai
                  dòng sản phẩm chưa có diện tích: thẻ đó thiếu hẳn một hàng.

                  `flex-1` cho đoạn mô tả nuốt hết chỗ thừa, đẩy khối thông số
                  xuống đáy thẻ. Cả hàng thẳng nhau bất kể chữ dài ngắn. */}
              <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-dim">
                {dong.moTa}
              </p>

              {/* Thông số gộp thành MỘT DÒNG thay vì một bảng định nghĩa.
                  Bảng cũ có ba hàng, mà hai trong ba luôn trống — `soTang` và
                  `khoangGia` cố ý để trống trong dữ liệu. Nên nó tốn chiều cao
                  của một bảng để in đúng một con số. */}
              <dl className="mt-4 flex flex-wrap items-baseline gap-x-2 border-t border-ink-line pt-4 text-sm">
                <Dong nhan="Diện tích" giaTri={dong.dienTich} donVi="m²" />
                <Dong nhan="Số tầng" giaTri={dong.soTang} />
              </dl>

              {/* Khoảng ĐANG BÁN, tách khỏi khoảng thiết kế ở trên. Đọc từ bảng
                  hàng nên tự đúng lại mỗi lần chạy `npm run gop-bang-hang`. */}
              {(() => {
                const mb = dangMoBan(dong.ma);
                return mb ? (
                  <p className="mt-2 text-xs text-jade">
                    Đang mở bán {mb.khoang} m² · {mb.so} căn
                  </p>
                ) : null;
              })()}

              {/* Nhắc việc chỉ hiện khi chạy máy dev — người xem thật không thấy. */}
              {process.env.NODE_ENV !== "production" && dong.canXacNhan ? (
                <p className="mt-2 text-xs text-jade">
                  ⚠ thông số cần xác nhận với bảng hàng chính thức
                </p>
              ) : null}
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** Một dòng thông số. Không có giá trị thì không vẽ gì cả. */
function Dong({
  nhan,
  giaTri,
  donVi,
}: {
  nhan: string;
  giaTri?: string;
  donVi?: string;
}) {
  if (!giaTri) return null;
  return (
    <>
      <dt className="text-paper-dim">{nhan}</dt>
      <dd className="tabular mr-4 text-paper">
        {giaTri}
        {donVi ? ` ${donVi}` : ""}
      </dd>
    </>
  );
}
