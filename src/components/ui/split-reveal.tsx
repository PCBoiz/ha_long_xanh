"use client";

import { Fragment } from "react";
import { useInView } from "@/components/ui/use-in-view";

interface SplitRevealProps {
  /**
   * Chữ cần hiện. Bọc một từ trong dấu sao để in nghiêng:
   * `"Nơi vịnh *di sản* mở ra"` — đúng lối chen chữ nghiêng vào giữa tiêu đề
   * của bản tham chiếu, và nhờ vậy chỗ nhấn nằm trong dữ liệu chứ không phải
   * nằm rải rác trong JSX.
   */
  text: string;
  /** Khoảng cách thời gian giữa hai từ liền nhau, mili giây. */
  stagger?: number;
  /** Trễ chung trước khi từ đầu tiên bắt đầu trồi lên. */
  delay?: number;
  className?: string;
}

/**
 * Chữ trồi lên theo từng từ.
 *
 * Bản tham chiếu dùng GSAP SplitText — một gói trả phí. Ở đây tự dựng lại bằng
 * cách cho mỗi từ vào một ô cắt (`overflow: hidden`) rồi đẩy chữ từ dưới đáy ô
 * lên. Kết quả gần như không phân biệt được, mà không thêm phụ thuộc nào.
 *
 * Tách theo TỪ chứ không theo dòng: tách theo dòng phải đo bố cục thật sau khi
 * chữ đã xuống dòng, mà bố cục ấy đổi theo bề ngang màn hình và theo cỡ chữ —
 * cực dễ sai. Tách theo từ cho nhịp tương đương và luôn đúng.
 */
/**
 * Tách chuỗi thành danh sách từ kèm cờ in nghiêng.
 *
 * Phải cắt theo CẶP dấu sao TRƯỚC rồi mới cắt theo khoảng trắng. Làm ngược lại
 * thì `"*Hạ Long*"` vỡ thành `"*Hạ"` và `"Long*"` — mỗi mảnh chỉ còn một dấu
 * sao nên không mảnh nào được nhận là nghiêng, và phần nhấn biến mất lặng lẽ.
 */
function tachTu(text: string): { chu: string; nghieng: boolean }[] {
  const ketQua: { chu: string; nghieng: boolean }[] = [];
  for (const doan of text.split(/(\*[^*]+\*)/g)) {
    if (!doan) continue;
    const nghieng = doan.length > 2 && doan.startsWith("*") && doan.endsWith("*");
    const noiDung = nghieng ? doan.slice(1, -1) : doan;
    for (const tu of noiDung.split(/\s+/).filter(Boolean)) {
      ketQua.push({ chu: tu, nghieng });
    }
  }
  return ketQua;
}

export function SplitReveal({
  text,
  stagger = 55,
  delay = 0,
  className = "",
}: SplitRevealProps) {
  const { ref, hien } = useInView<HTMLSpanElement>();
  const cacTu = tachTu(text);

  return (
    <span ref={ref} data-shown={hien} className={className}>
      {cacTu.map(({ chu, nghieng }, thuTu) => (
        <Fragment key={`${chu}-${thuTu}`}>
          {thuTu > 0 ? " " : null}
          <span
            className="split-word"
            style={
              { "--word-delay": `${delay + thuTu * stagger}ms` } as React.CSSProperties
            }
          >
            <span className={nghieng ? "italic" : undefined}>{chu}</span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}
