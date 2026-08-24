"use client";

import { useMemo, useState } from "react";
import quyCan from "@/data/quy-can.generated.json";
import { gioNgayVN } from "@/lib/thoi-gian";

/**
 * Bảng quỹ căn — bảng hàng thật, công khai đầy đủ.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO ĐĂNG GIÁ, TRONG KHI CẢ TRANG DỰNG QUANH VIỆC KHÔNG ĐĂNG SỐ CHƯA CHẮC
 *
 * Vì đây không phải số chưa chắc. Đây là bảng hàng do chủ đầu tư phát hành, đọc
 * thẳng từ file bằng `scripts/doc-bang-hang.mjs`, kèm dấu thời gian.
 *
 * Và vì đo được điều này trên thị trường: các trang đại lý khác đang đăng mức
 * giá cho riêng dòng liền kề trải từ 3,8 tỷ tới 9,9 tỷ — chênh 2,6 lần. Không
 * trang nào ghi con số của họ là TRƯỚC hay SAU thuế, trong khi chênh lệch giữa
 * hai cách báo là 10% VAT cộng phí bảo trì.
 *
 * Người mua vì thế không có cách nào so sánh. Bảng này là câu trả lời: số thật,
 * hai cột giá có nhãn rõ, và một cột mà không ai khác có.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CỘT ĐÁNG GIÁ NHẤT LÀ ĐƠN GIÁ TRÊN MÉT VUÔNG ĐẤT.
 *
 * Đo trên chính bảng này: cùng là liền kề, cùng khoảng 60–70 m² đất, mà đơn giá
 * trải hơn bốn lần. Nhìn cột giá tổng thì hai căn na ná nhau; nhìn cột đơn giá
 * đất thì chênh lệch hiện ra ngay.
 *
 * ⚠️ CHÚ Ý KHI DIỄN GIẢI: cột này so sánh công bằng giữa các căn CÙNG MỘT
 * DÒNG. So ngang giữa hai dòng khác nhau thì phải cẩn thận — liền kề xây 3 tầng
 * trên 60 m² đất, song lập xây 2 tầng rưỡi trên 162 m², nên đơn giá đất của
 * liền kề tự nhiên cao hơn mà không có nghĩa là đắt hơn. Chữ trên trang đã sửa
 * lại cho đúng phạm vi này.
 *
 * Dù sao thì không trang đối thủ nào có cột này.
 */

/** Định dạng tiền theo tỷ, hai chữ số thập phân. */
function tyDong(so: number): string {
  return (so / 1e9).toLocaleString("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function trieu(so: number): string {
  return Math.round(so / 1e6).toLocaleString("vi-VN");
}

/**
 * Diện tích, theo cách viết số của tiếng Việt.
 *
 * Đọc thẳng từ file thì diện tích xây ra "352.4" — dấu chấm thập phân kiểu
 * tiếng Anh. Trong một bảng mà dấu chấm ở mọi chỗ khác đều là dấu phân cách
 * hàng nghìn, "352.4" đọc thoáng qua thành ba trăm nghìn mét vuông. Cùng một
 * ký tự mang hai nghĩa ngược nhau trên cùng một màn hình là lỗi nặng hơn vẻ
 * ngoài của nó.
 */
function dienTich(so: number): string {
  return so.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
}

/** Chỉ lấy chữ số, để người dùng gõ kiểu nào cũng đọc được. */
function docSoTien(chu: string): number {
  const n = Number(chu.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const KHONG_LOC = "tat-ca";

export function BangHang() {
  const [locLoai, datLocLoai] = useState(KHONG_LOC);
  const [locKhu, datLocKhu] = useState(KHONG_LOC);
  const [locBanGiao, datLocBanGiao] = useState(KHONG_LOC);
  const [voucherTho, datVoucherTho] = useState("");

  const voucher = docSoTien(voucherTho);

  const danhSach = useMemo(
    () =>
      quyCan.can
        .filter(
          (c) =>
            (locLoai === KHONG_LOC || c.loaiHinh === locLoai) &&
            (locKhu === KHONG_LOC || c.tieuKhu === locKhu) &&
            (locBanGiao === KHONG_LOC || c.banGiao === locBanGiao),
        )
        // Sắp theo ĐƠN GIÁ ĐẤT tăng dần, không phải theo giá tổng.
        //
        // Sắp theo giá tổng thì căn nhỏ luôn đứng đầu — một thứ tự không nói
        // lên điều gì. Sắp theo đơn giá đất thì dòng đầu bảng là căn đang rẻ
        // nhất TRÊN MỖI MÉT VUÔNG, tức bản thân thứ tự đã là một nhận định.
        .sort((a, b) => a.donGiaDat - b.donGiaDat),
    [locLoai, locKhu, locBanGiao],
  );

  const capNhat = new Date(quyCan.docLuc);
  const lienKe = quyCan.donGiaDat["Liền kề"];

  return (
    <div>
      {/* Dấu thời gian đặt TRÊN bảng, không phải dưới chân trang. Với dữ liệu
          đổi theo ngày thì "số này của lúc nào" là thứ phải đọc TRƯỚC khi đọc
          số, không phải một chú thích tra cứu sau. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink-line pb-4">
        <p className="text-h4">
          <span className="tabular text-jade">{quyCan.tongSoCan}</span> căn đang
          có
        </p>
        <p className="tabular text-small text-paper-dim">
          Đọc từ bảng hàng lúc {gioNgayVN(capNhat)}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
        <Loc nhan="Loại hình" gia={locLoai} dat={datLocLoai} muc={quyCan.theoLoaiHinh} />
        <Loc nhan="Tiểu khu" gia={locKhu} dat={datLocKhu} muc={quyCan.theoTieuKhu} />
        <Loc nhan="Bàn giao" gia={locBanGiao} dat={datLocBanGiao} muc={quyCan.theoBanGiao} />
      </div>

      {/* ─────────────────────── Ô tính voucher ───────────────────────
          Giá trị voucher KHÁC NHAU THEO TỪNG KHÁCH — nó tính từ chính giao dịch
          Vinhomes trước đó của họ. Nên không thể ghi cứng một con số hay một tỉ
          lệ phần trăm; chỉ có thể để khách nhập số của mình.

          Và đây là chỗ "giá thực trả" thôi làm khẩu hiệu: cùng một căn, hai
          người cầm hai voucher khác nhau thì trả hai số tiền khác nhau. Không
          có ô này thì mọi bảng giá chỉ đúng với người không có voucher. */}
      <div className="mt-8 border border-ink-line bg-ink-soft p-6">
        <label htmlFor="voucher" className="block font-display text-h3 font-normal">
          Bạn đang giữ voucher Vinhomes?
        </label>
        <p className="mt-2 max-w-[64ch] text-small leading-relaxed text-paper-dim">
          Khách đã mua bất động sản Vinhomes được cấp voucher hỗ trợ dùng cho
          giao dịch sau, dùng được nhiều lần. Nhập giá trị voucher của bạn — bảng
          dưới đây sẽ hiện thêm cột số tiền còn phải trả cho từng căn.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <input
            id="voucher"
            inputMode="numeric"
            value={voucherTho}
            onChange={(su) => datVoucherTho(su.target.value)}
            placeholder="1.159.416.092"
            className="tabular h-12 w-full max-w-xs border border-ink-line bg-ink px-4 text-body text-paper placeholder:text-paper-dim/80 focus-visible:border-jade sm:w-auto"
          />
          <span className="text-small text-paper-dim">đồng</span>
          {voucher > 0 ? (
            <button
              type="button"
              onClick={() => datVoucherTho("")}
              className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-paper-dim"
            >
              Xoá
            </button>
          ) : null}
        </div>
        <p className="mt-4 max-w-[64ch] text-small leading-relaxed text-paper-dim">
          Điều kiện áp dụng cho từng căn do chủ đầu tư quy định. Con số hiện ra
          là phép trừ để bạn so sánh giữa các căn — chưa phải xác nhận voucher đã
          áp được vào căn đó.
        </p>
      </div>

      {/* ═══════════════════════ DANH SÁCH TRÊN MÀN HẸP ═══════════════════════
          Bảng mười cột rộng 928px trong một ô cuộn ngang KHÔNG phải là bảng
          dùng được trên điện thoại. Nó không tràn trang nên mọi phép đo tự động
          đều báo xanh — mà người cầm máy vẫn phải kéo qua kéo lại ba lần chỉ để
          đọc xong một căn, và mỗi lần kéo là mất luôn cột mã căn ở đầu dòng.
          Đây là trang quan trọng nhất của cả trang web, và phần lớn khách bất
          động sản Việt Nam mở nó bằng điện thoại.

          Mỗi căn thành một thẻ, xếp theo ĐÚNG thứ tự bảng: đơn giá đất tăng
          dần. Thứ tự các dòng trong thẻ là thứ tự người mua thật sự hỏi:
          căn nào → bao nhiêu tiền → đắt hay rẻ so với căn bên cạnh → còn lại
          là chi tiết. */}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:hidden">
        {danhSach.map((c) => (
          <li key={c.ma} className="border border-ink-line bg-ink-soft p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="tabular font-display text-h3 font-normal text-paper">
                {c.ma}
              </span>
              <span className="text-small text-paper-dim">{c.loaiHinh}</span>
            </div>
            <p className="mt-1 text-small text-paper-dim">
              {c.tieuKhu} · <span className="capitalize">{c.banGiao}</span>
            </p>

            {/* Giá đầy đủ là con số DUY NHẤT người mua thật sự phải trả, nên nó
                là thứ to nhất trong thẻ. Nhãn đi kèm ngay bên dưới, vì đúng cái
                nhãn đó mới là điều các trang khác không ghi. */}
            <div className="mt-5 border-t border-ink-line pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-small text-paper-dim">Giá đầy đủ</span>
                <span className="tabular font-display text-h2 font-normal text-paper">
                  {tyDong(c.giaGomVat)}
                  <span className="ml-1 text-small text-paper-dim">tỷ</span>
                </span>
              </div>
              {/* 14px chứ không phải 11px như ở đầu cột bảng. Trong bảng thì
                  11px là cái giá phải trả cho việc nhồi mười cột; trong thẻ
                  thì không có ràng buộc đó, mà đây lại đúng là câu quyết định
                  con số bên cạnh nghĩa là gì. */}
              <p className="mt-1 text-right text-small leading-snug text-paper-dim">
                đã gồm VAT + phí bảo trì
              </p>
            </div>

            {voucher > 0 ? (
              <div className="mt-3 flex items-baseline justify-between gap-4 border border-jade/30 bg-jade/8 px-3 py-2">
                <span className="text-small text-jade">Sau voucher</span>
                <span className="tabular font-display text-h3 font-normal text-jade">
                  {tyDong(Math.max(0, c.giaGomVat - voucher))}
                  <span className="ml-1 text-small">tỷ</span>
                </span>
              </div>
            ) : null}

            <dl className="mt-4 space-y-2 border-t border-ink-line pt-4 text-small">
              {/* Đơn giá đất để LIỀN sau giá, không lẫn xuống cuối cùng với
                  diện tích: đây là cột duy nhất so sánh được hai căn với nhau,
                  và là cột không trang đối thủ nào có. */}
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-paper-dim">Đơn giá đất</dt>
                <dd className="tabular text-jade">
                  {trieu(c.donGiaDat)} triệu/m²
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-paper-dim">Giá trước VAT</dt>
                <dd className="tabular text-paper-dim">
                  {tyDong(c.giaTruocVat)} tỷ
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-paper-dim">Đất / xây</dt>
                <dd className="tabular text-paper-dim">
                  {dienTich(c.dtDat)} / {dienTich(c.dtXd)} m²
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* Bảng đầy đủ giữ nguyên cho màn rộng — ở đó nó đọc được thật, và so
          hàng ngang giữa các căn là việc bảng làm tốt hơn hẳn thẻ. */}
      <div className="mt-8 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[58rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink-line align-bottom">
              <Th>Mã căn</Th>
              <Th>Tiểu khu</Th>
              <Th>Loại hình</Th>
              <Th right>
                DT đất<Don>m²</Don>
              </Th>
              <Th right>
                DT xây<Don>m²</Don>
              </Th>
              <Th>Bàn giao</Th>
              {/* HAI CỘT GIÁ CÓ NHÃN RÕ RÀNG — khác biệt lớn nhất so với mọi
                  trang khác, và nó chỉ là hai dòng chữ nhỏ. */}
              <Th right>
                Giá bán<Don>trước VAT · tỷ</Don>
              </Th>
              <Th right>
                Giá đầy đủ<Don>gồm VAT + phí bảo trì · tỷ</Don>
              </Th>
              {voucher > 0 ? (
                <Th right>
                  <span className="text-jade">Sau voucher</span>
                  <Don>tỷ</Don>
                </Th>
              ) : null}
              <Th right>
                Đơn giá đất<Don>triệu/m²</Don>
              </Th>
            </tr>
          </thead>
          <tbody>
            {danhSach.map((c) => (
              <tr key={c.ma} className="border-b border-ink-line/60">
                <Td>
                  <span className="tabular text-h4 text-paper">{c.ma}</span>
                </Td>
                <Td>{c.tieuKhu}</Td>
                <Td>{c.loaiHinh}</Td>
                <Td right>{dienTich(c.dtDat)}</Td>
                <Td right>{dienTich(c.dtXd)}</Td>
                <Td>
                  <span className="capitalize">{c.banGiao}</span>
                </Td>
                <Td right>{tyDong(c.giaTruocVat)}</Td>
                <Td right>
                  <span className="text-paper">{tyDong(c.giaGomVat)}</span>
                </Td>
                {voucher > 0 ? (
                  <Td right>
                    {/* Chặn số âm: voucher lớn hơn giá căn thì phần dư chuyển
                        sang giao dịch khác, không thành tiền được trả lại. */}
                    <span className="text-jade">
                      {tyDong(Math.max(0, c.giaGomVat - voucher))}
                    </span>
                  </Td>
                ) : null}
                <Td right>{trieu(c.donGiaDat)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {danhSach.length === 0 ? (
        <p className="mt-6 text-body text-paper-dim">
          Không có căn nào khớp bộ lọc. Bỏ bớt một điều kiện để xem thêm.
        </p>
      ) : null}

      {/* Một bảng số không tự giải thích được. Ba dòng dưới đây là chỗ chuyển từ
          "chúng tôi có dữ liệu" sang "chúng tôi biết dữ liệu này nói gì" — và
          đó mới là thứ khách trả tiền cho người tư vấn. */}
      <div className="mt-12 grid gap-x-12 gap-y-7 border-t border-ink-line pt-8 md:grid-cols-3">
        <div>
          <p className="text-label uppercase text-jade">Đọc cột đơn giá đất</p>
          <p className="mt-2 text-small leading-relaxed text-paper-dim">
            So sánh công bằng nhất giữa các căn <em>cùng một dòng</em>, vì cùng
            dòng thì diện tích và số tầng tương đương. Ngay trong bảng này, cùng
            là liền kề mà đơn giá trải từ{" "}
            <span className="tabular text-paper">
              {trieu(lienKe?.nhoNhat ?? 0)}
            </span>{" "}
            tới{" "}
            <span className="tabular text-paper">
              {trieu(lienKe?.lonNhat ?? 0)}
            </span>{" "}
            triệu/m² — chênh{" "}
            <span className="tabular text-paper">
              {((lienKe?.lonNhat ?? 1) / (lienKe?.nhoNhat ?? 1)).toFixed(1)}
            </span>{" "}
            lần. Giá tổng không cho thấy điều đó.
          </p>
        </div>
        <div>
          <p className="text-label uppercase text-jade">Vì sao có hai cột giá</p>
          <p className="mt-2 text-small leading-relaxed text-paper-dim">
            Chênh lệch giữa hai cột là thuế giá trị gia tăng cộng phí bảo trì.
            Trang khác thường chỉ đăng một con số mà không ghi đó là cột nào —
            nên hai mức giá đọc được ở hai nơi có thể không so được với nhau.
          </p>
        </div>
        <div>
          <p className="text-label uppercase text-jade">Bảng này đổi theo ngày</p>
          <p className="mt-2 text-small leading-relaxed text-paper-dim">
            Căn có người giữ chỗ là rời khỏi bảng. Dấu thời gian phía trên là lúc
            đọc file gần nhất — hỏi lại trước khi quyết vẫn là việc nên làm, kể
            cả khi bảng vừa được cập nhật.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Mảnh nhỏ ────────────────────────────────── */

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      scope="col"
      className={`py-4 pr-6 text-label font-normal uppercase text-paper-dim ${
        right ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

/** Đơn vị đặt dưới tên cột, để tên cột không phải gánh cả hai việc. */
function Don({ children }: { children: React.ReactNode }) {
  // 11px chứ không phải 9,9px như trước. Dòng này mang thông tin QUYẾT ĐỊNH —
  // "trước VAT" hay "gồm VAT + phí bảo trì" chênh nhau cả trăm triệu đồng — mà
  // lại đang là cỡ chữ nhỏ nhất trên cả trang, nhỏ tới mức người trên 45 tuổi
  // phải nheo mắt. Đúng tệp khách của trang này.
  return (
    <span className="mt-1 block text-[0.6875rem] font-normal normal-case leading-snug tracking-normal text-paper-dim/75">
      {children}
    </span>
  );
}

function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <td
      className={`tabular py-4 pr-6 text-body text-paper-dim ${
        right ? "text-right" : ""
      }`}
    >
      {children}
    </td>
  );
}

function Loc({
  nhan,
  gia,
  dat,
  muc,
}: {
  nhan: string;
  gia: string;
  dat: (v: string) => void;
  muc: { ten: string; so: number }[];
}) {
  const luaChon = [
    { ma: KHONG_LOC, ten: "Tất cả", so: 0 },
    ...muc.map((m) => ({ ma: m.ten, ten: m.ten, so: m.so })),
  ];

  return (
    <fieldset>
      <legend className="text-label uppercase text-paper-dim">{nhan}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {luaChon.map((m) => {
          const dangChon = gia === m.ma;
          return (
            <label
              key={m.ma}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-small transition-colors ${
                dangChon
                  ? "border-jade bg-jade/12 text-jade"
                  : "border-ink-line text-paper-dim hover:border-paper/45 hover:text-paper"
              }`}
            >
              {/* Ô chọn thật nằm dưới, chỉ ẩn về mặt hình ảnh — dựng bằng `div`
                  có `onClick` thì bàn phím không tới được. */}
              <input
                type="radio"
                name={nhan}
                checked={dangChon}
                onChange={() => dat(m.ma)}
                className="sr-only"
              />
              <span className="capitalize">{m.ten}</span>
              {m.so > 0 ? (
                <span className="tabular text-paper-dim/60">{m.so}</span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
