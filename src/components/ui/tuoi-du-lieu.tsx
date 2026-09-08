"use client";

import { useSyncExternalStore } from "react";

/**
 * Hiện số ngày đã trôi qua kể từ mốc đọc dữ liệu.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO PHẢI ĐỌC ĐỒNG HỒ Ở TRÌNH DUYỆT, KHÔNG PHẢI LÚC DỰNG TRANG
 *
 * Khối quỹ căn ghi "Đọc lúc 18:20 ngày 15/08/2026". Một con số cụ thể đứng
 * cạnh một ngày tháng cụ thể thì người đọc mặc nhiên hiểu đó là số của hôm
 * nay — kể cả khi có câu cảnh báo ngay bên dưới.
 *
 * Đã thử tính số ngày ngay trong trang rồi bỏ, và lý do đáng ghi lại: trang
 * chủ dựng sẵn ở máy chủ, nên `Date.now()` chỉ chạy MỘT LẦN lúc dựng rồi đông
 * cứng. Con số "đã 22 ngày" sẽ đứng im trong khi thời gian trôi tiếp — một
 * cảnh báo về dữ liệu cũ mà bản thân nó cũng cũ.
 *
 * Khối này chạy ở TRÌNH DUYỆT nên đồng hồ là đồng hồ của người đang đọc, mà
 * trang vẫn dựng sẵn được như cũ.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * ⚠️ VÌ SAO `useSyncExternalStore` CHỨ KHÔNG PHẢI `useEffect` + `setState`
 *
 * Bản đầu viết bằng `useEffect` rồi `setState`. Bộ kiểm mã của dự án chặn
 * thẳng: `react-hooks/set-state-in-effect`.
 *
 * `useSyncExternalStore` là cách React dành riêng cho giá trị KHÁC NHAU giữa
 * máy chủ và trình duyệt: nhánh thứ ba trả `null` lúc dựng, nhánh thứ hai đọc
 * đồng hồ thật khi đã ở trình duyệt. Không có bước "dựng xong rồi sửa lại",
 * nên cũng không có cảnh nội dung nhấp nháy đổi.
 *
 * ⚠️ PHẢI NHỚ KẾT QUẢ. React so kết quả `getSnapshot` giữa hai lần dựng bằng
 *    `Object.is`. Gọi thẳng `Date.now()` thì mỗi mili giây ra một giá trị
 *    khác, và React sẽ dựng lại vô hạn. Bộ nhớ `theoMoc` bên dưới giữ cho mỗi
 *    mốc chỉ đọc đồng hồ đúng một lần.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const theoMoc = new Map<string, number | null>();

function soNgayKeTu(moc: string): number | null {
  const daCo = theoMoc.get(moc);
  if (daCo !== undefined) return daCo;

  const mocMs = new Date(moc).getTime();
  const ra = Number.isNaN(mocMs)
    ? null
    : Math.floor((Date.now() - mocMs) / 86_400_000);
  theoMoc.set(moc, ra);
  return ra;
}

/** Đồng hồ không phát sự kiện, nên không có gì để đăng ký nghe. */
const khongDangKyGi = () => () => {};

export function TuoiDuLieu({ moc }: { moc: string }) {
  const ngay = useSyncExternalStore(
    khongDangKyGi,
    () => soNgayKeTu(moc),
    () => null,
  );

  // Lúc dựng ở máy chủ, mốc hỏng, hoặc đọc trong ngày → không nói gì.
  if (ngay === null || ngay < 1) return null;

  return (
    <>
      {" · đã "}
      <strong className="text-paper">{ngay} ngày</strong>
    </>
  );
}
