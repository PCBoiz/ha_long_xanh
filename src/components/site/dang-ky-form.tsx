"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { guiDangKy } from "@/lib/lead/dang-ky-action";
import { ketQuaBanDau } from "@/lib/lead/dang-ky-kieu";
import { DIEU_UU_TIEN } from "@/lib/lead/uu-tien";
import { ghiSuKien } from "@/lib/do-luong";
import { dongSanPham, lienHe } from "@/data/project";

/**
 * Biểu mẫu nhận yêu cầu tư vấn.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * BIỂU MẪU NÀY BÁN MỘT THỨ, VÀ THỨ ĐÓ KHÔNG PHẢI "THÔNG TIN"
 *
 * Bản trước hỏi họ tên trước, rồi số điện thoại, rồi "quan tâm tới", và nút
 * ghi "Gửi thông tin". Đọc lại thì thấy nó mô tả VIỆC KHÁCH PHẢI LÀM chứ không
 * mô tả THỨ KHÁCH NHẬN ĐƯỢC — giống hệt mọi biểu mẫu bất động sản khác.
 *
 * Bản này đảo lại toàn bộ:
 *
 *   · Số điện thoại lên ĐẦU, là một trong hai ô bắt buộc duy nhất.
 *   · Họ tên xuống CUỐI và thành tuỳ chọn. Người sắp chuyển vài tỷ thường dè
 *     dặt để lại tên ở lần chạm đầu, nhưng sẵn sàng cho số — vì họ muốn được
 *     gọi. Bắt điền tên là dựng rào ngay trước thứ mình cần nhất.
 *   · KHÔNG hỏi ngân sách. Xem ghi chú ở `DIEU_UU_TIEN`.
 *   · Nút ghi "Nhận phương án của tôi" — thứ khách NHẬN, không phải việc khách
 *     LÀM.
 *
 * Và ngay cạnh ô số điện thoại là một câu của người thật, không phải câu của
 * hệ thống. Người ta để lại số cho một CON NGƯỜI, không để lại cho một biểu mẫu.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function DangKyForm() {
  const [ketQua, guiDi, dangGui] = useActionState(guiDangKy, ketQuaBanDau);
  const idDienThoai = useId();
  const idUuTien = useId();
  const idHoTen = useId();
  const idQuanTam = useId();
  const idGhiChu = useId();

  // Đếm lượt gửi THÀNH CÔNG, không đếm lượt bấm nút.
  //
  // Khác biệt không nhỏ: bấm nút rồi bị chặn vì thiếu số điện thoại vẫn là một
  // cú bấm, và đếm nó vào thì tỉ lệ chuyển đổi cao hơn thực tế đúng ở chỗ mình
  // cần biết thật nhất.
  //
  // `daGhi` chặn đếm lặp: `useActionState` giữ nguyên kết quả qua các lần dựng
  // lại, nên không có cờ này thì mỗi lần dựng lại là thêm một lượt.
  const daGhi = useRef(false);
  useEffect(() => {
    if (ketQua.trangThai !== "thanhCong" || daGhi.current) return;
    daGhi.current = true;
    ghiSuKien("bieu-mau");
  }, [ketQua.trangThai]);

  /**
   * Dời tiêu điểm sang khối cảm ơn sau khi gửi thành công.
   *
   * ═══════════════════════════════════════════════════════════════════════
   * VÌ SAO CẦN, DÙ ĐÃ CÓ `role="status"`
   *
   * Gửi xong thì cả biểu mẫu bị thay bằng khối cảm ơn. Nút "Nhận phương án
   * của tôi" — thứ đang giữ tiêu điểm — biến mất khỏi cây DOM, và trình duyệt
   * trả tiêu điểm về `<body>`. Người dùng bàn phím mất chỗ đứng: bấm Tab tiếp
   * là quay lại từ đầu trang.
   *
   * `role="status"` cũng không cứu được, và đây là chỗ dễ tưởng nhầm nhất:
   * vùng thông báo chỉ được đọc lên khi NỘI DUNG BÊN TRONG nó đổi, còn ở đây
   * cả phần tử mang `role="status"` mới được gắn vào — trình đọc màn hình
   * thường bỏ qua trường hợp này.
   *
   * Dời tiêu điểm giải quyết cả hai: trình đọc màn hình đọc khối cảm ơn, và
   * lần Tab kế tiếp bắt đầu từ đúng chỗ vừa xảy ra chuyện.
   *
   * `tabIndex={-1}` trên khối là bắt buộc — không có nó thì một `div` không
   * nhận được tiêu điểm bằng mã.
   * ═══════════════════════════════════════════════════════════════════════
   */
  const khoiCamOn = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ketQua.trangThai === "thanhCong") khoiCamOn.current?.focus();
  }, [ketQua.trangThai]);

  if (ketQua.trangThai === "thanhCong") {
    return (
      <div
        ref={khoiCamOn}
        // Thông báo xuất hiện sau khi gửi nên phải được trình đọc màn hình đọc
        // lên, không chỉ hiện ra bằng mắt — và phải nhận được tiêu điểm, xem
        // ghi chú ở `khoiCamOn`.
        role="status"
        tabIndex={-1}
        className="border border-jade-deep bg-ink-soft px-6 py-12 text-center outline-none focus-visible:border-jade md:px-8 md:py-14"
      >
        <p className="font-display text-h3 font-normal text-jade">Cảm ơn bạn</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper-dim">
          {ketQua.thongBao}
        </p>
        {lienHe.hotline ? (
          <a
            href={`tel:${lienHe.hotline.replace(/\s/g, "")}`}
            data-do="goi"
            data-do-chi-tiet="sau-khi-gui-form"
            className="link-underline tabular mt-6 inline-flex min-h-11 items-center font-display text-h3 text-jade"
          >
            {lienHe.hotline}
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form action={guiDi} className="flex flex-col gap-7" noValidate>
      {/* Ô bắt buộc thứ nhất. Đặt trước mọi ô khác. */}
      <O
        id={idDienThoai}
        name="dienThoai"
        nhan="Số điện thoại"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        loi={ketQua.loiTruong?.dienThoai}
        batBuoc
      />

      {/* Câu của NGƯỜI, đặt ngay dưới ô số điện thoại — đúng chỗ người đọc còn
          đang lưỡng lự có nên để lại số hay không. Một dòng cam kết ở đây làm
          được nhiều hơn cả đoạn giới thiệu ở đầu trang. */}
      <p className="-mt-3 max-w-[60ch] border-l border-jade/30 pl-4 text-small leading-relaxed text-paper-dim">
        Tôi rất mong nhận được cuộc gọi của anh/chị, để hiểu điều anh/chị muốn
        và giúp tìm đúng căn cùng một phương án tài chính phù hợp hơn trước khi
        quyết định.
      </p>

      {/* Ô bắt buộc thứ hai — thay cho câu hỏi ngân sách. */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor={idUuTien}
          className="text-label uppercase text-paper-dim"
        >
          Điều anh/chị muốn ưu tiên nhất
        </label>
        {/* Danh sách xổ xuống do hệ điều hành vẽ, nên phải tô nền cho từng dòng,
            bằng không trên Windows nó ra chữ trắng trên nền trắng. */}
        <select
          id={idUuTien}
          name="uuTien"
          defaultValue=""
          required
          aria-invalid={ketQua.loiTruong?.uuTien ? true : undefined}
          aria-describedby={
            ketQua.loiTruong?.uuTien ? `${idUuTien}-loi` : undefined
          }
          className={`border-b bg-transparent py-3 text-base text-paper focus:outline-none [&>option]:bg-ink [&>option]:text-paper ${
            ketQua.loiTruong?.uuTien
              ? "border-warn"
              : "border-ink-line focus:border-jade"
          }`}
        >
          <option value="">Chọn một điều</option>
          {DIEU_UU_TIEN.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {ketQua.loiTruong?.uuTien ? (
          <p id={`${idUuTien}-loi`} className="text-sm text-warn">
            {ketQua.loiTruong.uuTien}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={idQuanTam}
          className="text-label uppercase text-paper-dim"
        >
          Dòng sản phẩm quan tâm{" "}
          <span className="normal-case tracking-normal">(tuỳ chọn)</span>
        </label>
        <select
          id={idQuanTam}
          name="quanTam"
          defaultValue=""
          className="border-b border-ink-line bg-transparent py-3 text-base text-paper focus:border-jade focus:outline-none [&>option]:bg-ink [&>option]:text-paper"
        >
          <option value="">Chưa xác định</option>
          {dongSanPham.map((dong) => (
            <option key={dong.ten} value={dong.ten}>
              {dong.ten}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={idGhiChu}
          className="text-label uppercase text-paper-dim"
        >
          Phương án hoặc căn đang cân nhắc{" "}
          <span className="normal-case tracking-normal">(tuỳ chọn)</span>
        </label>
        <textarea
          id={idGhiChu}
          name="ghiChu"
          rows={3}
          maxLength={1000}
          placeholder="Ví dụ: đang xem một căn liền kề, hoặc đã có một phương án bên khác"
          className="resize-none border-b border-ink-line bg-transparent py-3 text-base text-paper placeholder:text-paper-dim/80 focus:border-jade focus:outline-none"
        />
      </div>

      {/* Họ tên xuống CUỐI và thành tuỳ chọn — xem ghi chú đầu file. */}
      <O
        id={idHoTen}
        name="hoTen"
        nhan="Họ tên"
        autoComplete="name"
        tuyChon
      />

      {ketQua.trangThai === "loi" && ketQua.thongBao ? (
        <p role="alert" className="text-sm text-warn">
          {ketQua.thongBao}
        </p>
      ) : null}

      <div className="mt-1 flex flex-wrap items-center gap-x-7 gap-y-4">
        <button type="submit" disabled={dangGui} className="nut nut-chinh">
          {dangGui ? "Đang gửi…" : "Nhận phương án của tôi"}
        </button>
        {/* Đường gọi thẳng, đặt NGAY CẠNH nút gửi. Có người không bao giờ điền
            biểu mẫu nhưng sẵn sàng bấm gọi; bắt họ đi tìm số ở chân trang là
            mất đúng những người sốt ruột nhất. */}
        {lienHe.hotline ? (
          <a
            href={`tel:${lienHe.hotline.replace(/\s/g, "")}`}
            data-do="goi"
            data-do-chi-tiet="canh-form"
            className="link-underline tabular inline-flex min-h-11 items-center text-nav uppercase text-jade"
          >
            Hoặc gọi {lienHe.hotline}
          </a>
        ) : null}
      </div>
    </form>
  );
}

interface OProps {
  id: string;
  name: string;
  nhan: string;
  type?: string;
  inputMode?: "tel" | "text";
  autoComplete?: string;
  loi?: string;
  batBuoc?: boolean;
  tuyChon?: boolean;
}

/** Một ô nhập — gộp nhãn, ô và dòng lỗi để ba thứ luôn nối đúng với nhau. */
function O({
  id,
  name,
  nhan,
  type = "text",
  inputMode,
  autoComplete,
  loi,
  batBuoc,
  tuyChon,
}: OProps) {
  const idLoi = `${id}-loi`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label uppercase text-paper-dim">
        {nhan}
        {tuyChon ? (
          <span className="normal-case tracking-normal"> (tuỳ chọn)</span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={batBuoc}
        aria-invalid={loi ? true : undefined}
        aria-describedby={loi ? idLoi : undefined}
        className={`border-b bg-transparent py-3 text-base text-paper focus:outline-none ${
          loi ? "border-warn" : "border-ink-line focus:border-jade"
        }`}
      />
      {loi ? (
        <p id={idLoi} className="text-sm text-warn">
          {loi}
        </p>
      ) : null}
    </div>
  );
}
