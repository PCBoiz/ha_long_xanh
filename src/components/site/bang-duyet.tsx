"use client";

import { useActionState, useId, useState } from "react";
import { duyetBai, layHangCho } from "@/lib/duyet-bai";
import {
  ketQuaDuyetBanDau,
  ketQuaHangChoBanDau,
} from "@/lib/duyet-bai-kieu";
import { lamSachHtml } from "@/lib/lam-sach-html";

/**
 * Bảng duyệt bài.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * HÀNG CHỜ CHỈ VỀ SAU KHI ĐƯA ĐÚNG KHOÁ
 *
 * Thành phần này KHÔNG nhận danh sách bài qua props nữa. Trước đây trang máy
 * chủ đọc hàng chờ rồi truyền xuống — nghĩa là toàn văn bài chưa duyệt nằm sẵn
 * trong HTML của bất kỳ ai mở địa chỉ đó. Xem ghi chú ở `app/duyet-bai/page.tsx`.
 *
 * KHOÁ NHẬP MỘT LẦN, DÙNG CHO CẢ PHIÊN — VÀ KHÔNG LƯU LẠI.
 *
 * KHÔNG cất khoá vào `localStorage`. Cám dỗ rất lớn vì tiện hơn hẳn, nhưng đây
 * là khoá cho phép đăng bài lên một trang thương mại, và `localStorage` thì mọi
 * đoạn mã chạy trên cùng tên miền đều đọc được. Đổi lấy vài giây gõ lại mỗi
 * phiên là đổi đúng chiều.
 *
 * `type="password"` để khoá không hiện ra khi chủ trang chia sẻ màn hình.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function BangDuyet() {
  const [khoa, datKhoa] = useState("");
  const idKhoa = useId();
  const [hangCho, moHangCho, dangMo] = useActionState(
    layHangCho,
    ketQuaHangChoBanDau,
  );
  const [ketQua, guiDi, dangGui] = useActionState(duyetBai, ketQuaDuyetBanDau);

  const bai = hangCho.bai ?? [];

  return (
    <div>
      {/* Biểu mẫu mở hàng chờ. Chính nó cũng là chỗ nhập khoá cho mọi thao tác
          bên dưới — nhập một lần, dùng tiếp. */}
      <form action={moHangCho} className="border border-ink-line bg-ink-soft p-6">
        <label
          htmlFor={idKhoa}
          className="block text-label uppercase text-paper-dim"
        >
          Khoá duyệt bài
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <input
            id={idKhoa}
            name="khoa"
            type="password"
            autoComplete="off"
            value={khoa}
            onChange={(su) => datKhoa(su.target.value)}
            placeholder="Dán INGEST_TOKEN"
            className="h-12 w-full max-w-md border border-ink-line bg-ink px-4 text-body text-paper placeholder:text-paper-dim/80 focus-visible:border-jade"
          />
          <button
            type="submit"
            disabled={dangMo || khoa.length === 0}
            className="nut nut-chinh disabled:opacity-40"
          >
            {dangMo ? "Đang mở…" : "Mở hàng chờ"}
          </button>
        </div>
        <p className="mt-3 max-w-[64ch] text-small leading-relaxed text-paper-dim">
          Cùng khoá với biến <code>INGEST_TOKEN</code> đặt trên máy chủ. Không
          được lưu lại — mở lại trang là phải nhập lại.
        </p>
      </form>

      {hangCho.thongBao ? (
        <p role="status" className="mt-6 border border-warn/50 px-5 py-4 text-body text-warn">
          {hangCho.thongBao}
        </p>
      ) : null}

      {ketQua.thongBao ? (
        <p
          role="status"
          className={`mt-6 border px-5 py-4 text-body ${
            ketQua.trangThai === "loi"
              ? "border-warn/50 text-warn"
              : "border-jade-deep text-jade"
          }`}
        >
          {ketQua.thongBao}
          {ketQua.trangThai !== "loi" ? " Bấm “Mở hàng chờ” để xem lại." : ""}
        </p>
      ) : null}

      {hangCho.trangThai === "xong" && bai.length === 0 ? (
        <p className="mt-10 border border-ink-line bg-ink-soft px-6 py-10 text-center text-body text-paper-dim">
          Hàng chờ trống.
        </p>
      ) : null}

      <ul className="mt-10 flex flex-col gap-8">
        {bai.map((b) => (
          <li
            key={b.slug}
            className={`border p-6 md:p-8 ${
              b.daTungDang ? "border-warn/60" : "border-ink-line"
            }`}
          >
            {/* Bài TỪNG ĐƯỢC ĐĂNG rồi bị sửa được đánh dấu rõ và xếp lên đầu.
                Nội dung đã đổi sau khi có người gật đầu — đây là bài đáng soi
                kỹ nhất trong hàng chờ, chứ không phải bài mới. */}
            {b.daTungDang ? (
              <p className="mb-4 border-l-2 border-warn pl-4 text-small leading-relaxed text-warn">
                Bài này ĐÃ TỪNG ĐƯỢC ĐĂNG và vừa bị sửa lại. Nội dung đổi sau
                khi đã có người duyệt — đọc kỹ phần đã thay đổi.
              </p>
            ) : null}

            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <span className="text-label uppercase text-jade">
                {b.chuyenMuc}
              </span>
              <span className="tabular text-small text-paper-dim">{b.ngay}</span>
            </div>

            <h2 className="mt-3 font-display text-h2 font-normal text-balance">
              {b.tieuDe}
            </h2>
            <p className="mt-3 max-w-[68ch] text-body leading-relaxed text-paper-dim">
              {b.moTa}
            </p>
            <p className="tabular mt-3 text-small text-paper-dim/80">
              /{b.slug}
            </p>

            {/* ═══════════════════════════════════════════════════════════
                NHỮNG CHỖ CẦN ĐỐI CHIẾU — đặt TRƯỚC toàn văn, không phải sau.

                Câu "đọc kỹ phần có con số trước khi duyệt" là một lời nhắc, và
                lời nhắc thì mòn. Khối này thay lời nhắc bằng một danh sách có
                đích: bốn câu được trích ra đúng chỗ, thay vì hai nghìn chữ và
                một lời dặn hãy cẩn thận.

                Đặt trên nút duyệt và trên phần toàn văn là cố ý — người duyệt
                gặp nó trước khi có cơ hội bấm.
                ═══════════════════════════════════════════════════════════ */}
            {b.canhBao.length > 0 ? (
              <div className="mt-6 border border-warn/50 p-5">
                <p className="text-label uppercase text-warn">
                  Cần đối chiếu · {b.canhBao.length} chỗ
                </p>
                <ul className="mt-4 flex flex-col gap-4">
                  {b.canhBao.map((c) => (
                    <li key={c.luat}>
                      <p className="text-small leading-relaxed text-paper">
                        {c.lyDo}
                      </p>
                      <p className="mt-1 border-l-2 border-warn/50 pl-3 text-small italic leading-relaxed text-paper-dim">
                        {c.trichDan}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {b.noiDung ? (
              <details className="mt-6 border-t border-ink-line pt-5">
                <summary className="inline-flex min-h-11 cursor-pointer items-center text-nav uppercase text-jade">
                  Đọc toàn văn trước khi duyệt
                </summary>
                {/*
                  LÀM SẠCH HTML TRƯỚC KHI DỰNG, dù nội dung tới từ hệ thống của
                  chính mình.

                  Bài do một mô hình ngôn ngữ sinh ra, và mô hình sinh ra thứ gì
                  là do dữ liệu vào quyết định — mà dữ liệu vào có thể là một
                  trang web bên ngoài. Đường đi từ "mô hình đọc một trang có mã
                  độc" tới "mã đó chạy trong trình duyệt của chủ trang" ngắn hơn
                  vẻ ngoài của nó.

                  Và đây là màn hình DUY NHẤT có khoá đăng bài đang nằm trong
                  bộ nhớ trang. Đúng chỗ không được phép chạy mã lạ.
                */}
                <div
                  className="bai-viet mt-5"
                  dangerouslySetInnerHTML={{ __html: lamSachHtml(b.noiDung) }}
                />
              </details>
            ) : (
              <p className="mt-6 border-t border-ink-line pt-5 text-small text-warn">
                Bài không có phần nội dung — chỉ có tiêu đề và mô tả.
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-ink-line pt-6">
              <form action={guiDi}>
                <input type="hidden" name="khoa" value={khoa} />
                <input type="hidden" name="slug" value={b.slug} />
                <input type="hidden" name="viec" value="duyet" />
                <button
                  type="submit"
                  disabled={dangGui || khoa.length === 0}
                  className="nut nut-chinh disabled:opacity-40"
                >
                  Duyệt và đăng
                </button>
              </form>

              <form action={guiDi}>
                <input type="hidden" name="khoa" value={khoa} />
                <input type="hidden" name="slug" value={b.slug} />
                <input type="hidden" name="viec" value="go" />
                <button
                  type="submit"
                  disabled={dangGui || khoa.length === 0}
                  className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-warn disabled:opacity-40"
                >
                  Gỡ hẳn
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
