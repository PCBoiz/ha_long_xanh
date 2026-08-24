import type { ReactNode } from "react";

/**
 * Khung nội dung chuẩn của trang.
 *
 * Trước đây chuỗi `mx-auto max-w-[92rem] px-6 md:px-10` được chép tay ở hơn
 * hai mươi chỗ. Chép tay thì sẽ có chỗ lệch — và đúng là đã lệch: vài mảng
 * dùng `px-2`, vài mảng quên `md:px-10`, nên mép trái các mảng không thẳng
 * hàng khi cuộn qua. Gom về một chỗ thì mép trái chỉ có một giá trị duy nhất.
 *
 * `rong` cho phép hẹp lại khi nội dung là chữ đọc liền mạch: dòng chữ dài quá
 * 75 ký tự thì mắt mất dấu khi xuống dòng. Đo được ở trang /vi-tri: 103 ký tự
 * một dòng ở khổ 1440px.
 */
export function Khung({
  children,
  rong = "rong",
  className = "",
}: {
  children: ReactNode;
  /** `rong` cho bố cục và ảnh; `doc` cho khối chữ dài. */
  rong?: "rong" | "doc";
  className?: string;
}) {
  const beRong = rong === "doc" ? "max-w-[68rem]" : "max-w-[92rem]";
  return (
    <div className={`mx-auto ${beRong} px-6 md:px-10 ${className}`}>{children}</div>
  );
}
