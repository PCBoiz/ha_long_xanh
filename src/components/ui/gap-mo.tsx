"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Khối gấp mở — MỞ SẴN, chỉ gấp lại trên màn hình hẹp.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO KHÔNG DỰNG THẲNG MỘT ACCORDION ĐÓNG SẴN
 *
 * Trang này có hai chỗ cần gấp trên di động: bảy câu hỏi thường gặp và sáu
 * bước kiểm giá thực trả. Trên điện thoại, chúng là hai bức tường chữ dài bốn
 * năm màn hình mà người đọc phải cuộn qua để tới nút gọi.
 *
 * Nhưng khối câu hỏi thường gặp có một ghi chú cũ nói rõ vì sao nó KHÔNG dùng
 * kiểu gấp mở: nội dung phải bấm mới thấy thì người đọc phần lớn không bấm.
 * Ghi chú đó vẫn đúng cho MÁY BÀN, nơi có sẵn chỗ để mở hết.
 *
 * Nên khối này làm cả hai việc cùng lúc:
 *
 *   · Dựng ra HTML với thuộc tính `open` — tức là mở sẵn với mọi người, mọi
 *     công cụ tìm kiếm, và với cả trường hợp JavaScript không chạy.
 *   · Chỉ khi đang ở màn hình hẹp thì mới gỡ `open` đi.
 *
 * Hỏng JavaScript thì mọi thứ mở hết — đúng bằng trạng thái trang hiện nay,
 * không mất gì. Đây là kiểu suy giảm mà một trang bán hàng nên có: thứ hỏng đi
 * là tiện nghi, không phải nội dung.
 *
 * VỀ CHUYỆN LẬP CHỈ MỤC: chữ bên trong `<details>` nằm trong HTML dù đóng hay
 * mở, nên công cụ tìm kiếm đọc được như thường. Lời khuyên "đừng giấu nội dung
 * trong accordion" là lời khuyên của thời trước khi Google chuyển sang lập chỉ
 * mục theo bản di động; giờ nó không còn đúng nữa. Dù vậy vẫn mở sẵn ở máy
 * bàn, vì lý do bên trên là lý do về NGƯỜI ĐỌC chứ không phải về máy.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function GapMo({
  tomTat,
  children,
  className = "",
}: {
  /** Phần luôn nhìn thấy — câu hỏi, hoặc tên bước. */
  tomTat: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const nut = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = nut.current;
    if (!el) return;

    const hep = window.matchMedia("(max-width: 767px)");
    // Chỉ ĐÓNG khi màn hẹp. Không tự mở lại khi người dùng xoay ngang máy —
    // mở bung một khối họ vừa chủ động đóng lại là giành quyền của họ.
    const theo = () => {
      if (hep.matches) el.open = false;
    };
    theo();
    hep.addEventListener("change", theo);
    return () => hep.removeEventListener("change", theo);
  }, []);

  return (
    <details ref={nut} open className={`gap-mo ${className}`}>
      <summary className="gap-mo-tom-tat">{tomTat}</summary>
      <div className="gap-mo-than">{children}</div>
    </details>
  );
}
