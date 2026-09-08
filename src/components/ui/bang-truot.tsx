import type { ReactNode } from "react";

/**
 * Dải trượt ngang, CUỘN BẰNG CSS — không một dòng JavaScript nào.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO KHÔNG DÙNG THƯ VIỆN CAROUSEL
 *
 * Mọi thư viện carousel đều phải là thành phần chạy ở máy khách: chúng đo bề
 * rộng, gắn bộ nghe sự kiện, và tự vẽ lại. Đổi lại, khối này KHÔNG hiện gì cho
 * tới khi gói JavaScript tải xong — đúng thứ khách 4G ở Hạ Long phải chờ.
 *
 * `scroll-snap` là tính năng gốc của trình duyệt, có từ 2019, chạy ở mọi trình
 * duyệt trang này hỗ trợ. Nó cho đúng cảm giác vuốt dính, mà khối vẫn dựng
 * xong ở máy chủ và đọc được cả khi JavaScript hỏng.
 *
 * VÌ SAO THẺ CUỐI CÙNG PHẢI THÒ RA
 *
 * Người dùng điện thoại không vuốt thứ trông như đã hết. Một hàng thẻ vừa khít
 * mép màn đọc ra là "hết rồi"; một thẻ bị cắt dở đọc ra là "còn nữa". Đó là lý
 * do mọi mốc bề rộng dưới đây đều là số LẺ (78%, 46%…) chứ không phải 50% hay
 * 100% — phần dư chính là lời mời vuốt.
 *
 * VÌ SAO ÂM LỀ RỒI ĐỆM LẠI
 *
 * `scroll-pl-6` ĐI KÈM BẮT BUỘC, đừng gỡ. Không có nó, `scroll-snap` dán mép
 * trái thẻ đầu vào mép trái vùng cuộn — tức là vào ĐÚNG CHỖ phần đệm vừa
 * dành ra — và trình duyệt tự cuộn sẵn 24px ngay khi tải. Thẻ đầu dính sát
 * mép màn trong khi tiêu đề ngay trên vẫn thụt vào: nhìn ra là trang vỡ.
 *
 * `-mx-6 px-6` kéo dải ra sát hai mép màn hình rồi đẩy nội dung vào đúng chỗ
 * cũ. Không có nó, thẻ thò ra sẽ dừng ở lề khung và trông như bị hỏng chứ
 * không như còn tiếp. Trên máy tính lề khung quay lại, nên cặp này bị huỷ ở
 * `md:`.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * `hep` — thẻ chỉ có chữ, để lọt hai thẻ rưỡi trên điện thoại.
 * `rong` — thẻ có ảnh; ảnh hẹp quá thì không còn là ảnh, nên chỉ một thẻ rưỡi.
 */
type CoThe = "hep" | "rong";

const BE_RONG: Record<CoThe, string> = {
  hep: "basis-[62%] sm:basis-[38%] lg:basis-[23%]",
  rong: "basis-[78%] sm:basis-[46%] lg:basis-[31%]",
};

export function BangTruot({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-6 md:mx-0">
      <ul
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 scroll-pl-6 md:px-0 md:scroll-pl-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        // Thanh cuộn bị ẩn, nên bàn phím phải vào được bằng đường khác.
        // `tabIndex` cho phép Tab tới rồi dùng phím mũi tên cuộn ngang.
        tabIndex={0}
        aria-label="Dải nội dung trượt ngang"
      >
        {children}
        {/* Ô rỗng cuối dải: cho thẻ cuối cùng dừng đúng lề trái thay vì dính
            sát mép phải màn hình. Không có nó, thẻ thứ chín trông như bị kẹt. */}
        <li aria-hidden className="shrink-0 basis-1 md:hidden" />
      </ul>
    </div>
  );
}

export function TheTruot({
  co = "rong",
  children,
}: {
  co?: CoThe;
  children: ReactNode;
}) {
  return (
    <li className={`shrink-0 snap-start ${BE_RONG[co]}`}>{children}</li>
  );
}
