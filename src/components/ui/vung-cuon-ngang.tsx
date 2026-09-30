import type { ReactNode } from "react";

/**
 * Bọc một bảng rộng hơn màn hình, cho CUỘN ĐƯỢC BẰNG BÀN PHÍM.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO PHẢI CÓ MỘT THÀNH PHẦN RIÊNG THAY VÌ VIẾT TAY `overflow-x-auto`
 *
 * Một vùng cuộn mà bên trong không có gì đặt tiêu điểm vào được (bảng số thì
 * không có liên kết hay nút) là vùng KHÔNG AI DÙNG BÀN PHÍM XEM ĐƯỢC: các cột
 * bị khuất nằm ngoài tầm với, vĩnh viễn. Máy soát tiếp cận gọi tên nó là
 * "scrollable-region-focusable", mức nghiêm trọng — đo ngày 30/09/2026 thấy 3
 * chỗ trên 31 trang, và sẽ còn thêm mỗi lần ai đó viết một bảng mới.
 *
 * Chữa bằng `tabIndex={0}`: vùng nhận được tiêu điểm thì mũi tên trái/phải
 * cuộn được. Kèm `role="group"` và nhãn để máy đọc màn hình nói ra đây là
 * bảng gì — vùng cuộn được mà không ai nói nó chứa gì thì cũng chẳng ích lợi.
 *
 * Khách của trang này phần lớn là người mua nhà tuổi trung niên trở lên, nhóm
 * dùng bàn phím và phóng to chữ nhiều hơn mức người làm trang thường nghĩ.
 *
 * ⚠️ Dùng cái này cho MỌI bảng cuộn ngang. Viết tay `overflow-x-auto` quanh
 * một bảng là lỗi ấy quay lại — lần trước nó quay lại ở ba trang khác nhau.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function VungCuonNgang({
  nhan,
  className = "",
  children,
}: {
  /** Bảng này là bảng gì — máy đọc màn hình đọc câu này. */
  nhan: string;
  /** Lớp bố cục thêm (khoảng cách trên, ẩn/hiện theo cỡ màn…). */
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`overflow-x-auto ${className}`.trim()}
      tabIndex={0}
      role="group"
      aria-label={`${nhan} — cuộn ngang bằng mũi tên trái/phải`}
    >
      {children}
    </div>
  );
}
