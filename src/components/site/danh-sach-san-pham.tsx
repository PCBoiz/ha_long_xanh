import Link from "next/link";
import { ProjectImage } from "@/components/ui/project-image";
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
                  <ProjectImage
                    name={dong.anh}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
