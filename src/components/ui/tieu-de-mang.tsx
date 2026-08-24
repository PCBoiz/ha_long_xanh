import type { ReactNode } from "react";
import Link from "next/link";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";

/**
 * Đầu mảng: tiêu đề — dẫn nhập — liên kết đi tiếp.
 *
 * Bố cục HAI CỘT LỆCH chứ không phải một cột dồn trái. Đo ở bản cũ: mọi mảng
 * đều là một cột `max-w-3xl` dồn trái, nên cuộn suốt trang chỉ thấy đúng một
 * nhịp thị giác lặp lại. Ở đây tiêu đề chiếm cột trái rộng, phần dẫn nhập lùi
 * sang cột phải — mắt có hai điểm neo thay vì một, và khoảng giữa hai cột làm
 * việc thay cho khoảng trắng dọc.
 *
 * Dưới 768px thì xếp chồng: hai cột trên màn hẹp chỉ tạo ra dòng chữ 20 ký tự.
 *
 * `nhan` — nhãn nhỏ in hoa phía trên tiêu đề — MẶC ĐỊNH KHÔNG CÓ.
 *
 * Trước bản này nó là bắt buộc, nên mảng nào cũng mở đầu bằng một nhãn: đo
 * được 41 nhãn trên 49 mảng của cả trang. Khi mảng nào cũng được "đặt tên"
 * thì cái tên thôi không còn phân biệt được mảng nào với mảng nào — thứ bậc
 * mà nó dựng lên tự xoá chính nó, và trang đọc ra như một danh sách các danh
 * sách có nhãn.
 *
 * Chỉ truyền `nhan` khi nó nói điều mà tiêu đề KHÔNG nói. "Dòng sản phẩm" đặt
 * trên tiêu đề "Năm cách để thuộc về nơi này" thì không thêm gì cả.
 */
export function TieuDeMang({
  nhan,
  tieuDe,
  dan,
  lienKet,
  className = "",
}: {
  nhan?: string;
  /** Cặp dấu sao bao quanh phần muốn in nghiêng: `"Chín vịnh và *một* đô thị"`. */
  tieuDe: string;
  dan?: ReactNode;
  lienKet?: { nhan: string; href: string };
  className?: string;
}) {
  return (
    <div className={`grid gap-x-12 gap-y-6 md:grid-cols-12 ${className}`}>
      <div className="md:col-span-7">
        {nhan ? (
          <p className="text-label uppercase text-jade">{nhan}</p>
        ) : null}
        <h2
          className={`font-display text-h1 font-normal text-balance ${
            nhan ? "mt-4" : ""
          }`}
        >
          <SplitReveal text={tieuDe} />
        </h2>
      </div>

      {dan || lienKet ? (
        <div className="md:col-span-4 md:col-start-9 md:self-end">
          <ClipReveal delay={120}>
            {dan ? (
              <div className="text-body text-paper-dim [&_p+p]:mt-4">{dan}</div>
            ) : null}
            {lienKet ? (
              <Link
                href={lienKet.href}
                className="link-underline mt-5 inline-flex min-h-11 items-center text-label uppercase text-jade"
              >
                {lienKet.nhan}
              </Link>
            ) : null}
          </ClipReveal>
        </div>
      ) : null}
    </div>
  );
}
