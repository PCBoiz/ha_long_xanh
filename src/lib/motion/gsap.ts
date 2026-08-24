"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Đăng ký plugin đúng MỘT lần cho cả ứng dụng. Gọi rải rác ở từng thành phần
// cũng chạy được, nhưng gom về đây thì chỉ có một chỗ để sửa khi thêm plugin.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * `useLayoutEffect` ở trình duyệt, `useEffect` khi dựng ở máy chủ.
 *
 * Hiệu ứng nào ĐỘNG VÀO CẤU TRÚC DOM — cụ thể là `pin` của ScrollTrigger, thứ
 * bọc phần tử vào một thẻ `pin-spacer` mới — bắt buộc phải dọn dẹp đồng bộ.
 * Nếu không, React gỡ cây nút trước rồi mới tới lượt GSAP trả nút về chỗ cũ,
 * và trang sập không kèn không trống. Chi tiết ghi ở `expand-on-scroll.tsx`.
 *
 * Gọi thẳng `useLayoutEffect` thì React cảnh báo mỗi lần dựng ở máy chủ, vì ở
 * đó không có bố cục nào để đo. Đây là cách né chuẩn, và nó tồn tại chính vì
 * React không cho phép làm khác.
 */
export const useHieuUngBoCuc =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Người dùng có bật "giảm chuyển động" ở hệ điều hành không.
 *
 * Mọi hiệu ứng bám thanh cuộn đều phải hỏi hàm này trước khi chạy. Chuyển động
 * bám cuộn là loại dễ gây chóng mặt nhất — nặng hơn hẳn mấy hiệu ứng mờ dần.
 */
export function giamChuyenDong(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export { gsap, ScrollTrigger };
