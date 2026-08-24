import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { benBan, doiNguTuVan, duAn, lienHe } from "@/data/project";

/**
 * Mảng "người tư vấn" — mảng trả lời câu hỏi mà cả trang này chưa từng trả lời:
 * ai đang bán, và tôi gọi cho ai.
 *
 * ĐẶT TRÊN NỀN SÁNG, và đó là chủ ý. Toàn bộ trang là nền tối liền mạch; mảng
 * duy nhất đảo nền là mảng mắt dừng lại. Nếu chỉ được chọn một chỗ để bắt người
 * xem dừng, thì đây — vì đây là chỗ chuyển từ "dự án đẹp" sang "gọi cho ai".
 *
 * TỰ ẨN HOÀN TOÀN khi `doiNguTuVan` còn trống. Dựng ba thẻ người giả cho đỡ
 * trống là cách phá niềm tin nhanh nhất trong mọi cách phá niềm tin: khách gọi
 * số giả một lần là mất luôn, và với bất động sản thì mất luôn nghĩa là mất
 * một giao dịch vài chục tỷ.
 */
export function DoiNguTuVan() {
  if (doiNguTuVan.length === 0) return null;

  return (
    <section className="mang-sang py-nhip">
      <Khung>
        <div className="grid gap-x-12 gap-y-6 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-h1 font-normal text-balance">
              Người trực tiếp tư vấn cho bạn
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="text-body leading-relaxed text-paper-dim">
              {benBan.ten
                ? `${benBan.ten} — ${benBan.vaiTro.toLowerCase()} về ${duAn.tenNgan}.`
                : `${benBan.vaiTro}.`}
            </p>
            {/* Ba nhịp cách làm việc. Đây KHÔNG phải khẩu hiệu treo tường —
                mỗi nhịp ứng với một nhóm nội dung có thật trên trang, và thứ tự
                của chúng là đúng thứ tự người mua đi qua. */}
            <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
              {benBan.baNhip.map((nhip) => (
                <li
                  key={nhip}
                  className="border border-ink-line px-3 py-1.5 text-label uppercase text-jade"
                >
                  {nhip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BỐ CỤC ĐỔI THEO SỐ NGƯỜI, và đây không phải chuyện cầu kỳ.
            Một người duy nhất đặt trong lưới ba cột để lại hai ô trống bên
            phải — mảng đáng lẽ tạo niềm tin lại đọc ra thành "đội ngũ chỉ có
            một người và trang chưa làm xong". Một người thì trải ngang: ảnh
            bên trái, giới thiệu bên phải, chiếm trọn bề rộng. */}
        {doiNguTuVan.length === 1 ? (
          <div className="mt-12">
            <TheNguoi nguoi={doiNguTuVan[0]} rong />
          </div>
        ) : (
          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {doiNguTuVan.map((nguoi) => (
              <li key={nguoi.ten}>
                <TheNguoi nguoi={nguoi} />
              </li>
            ))}
          </ul>
        )}

        {/* Hàng chốt: một đường gọi chung, phòng khi khách không muốn chọn ai. */}
        {lienHe.hotline ? (
          <div className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-ink-line pt-8">
            <p className="text-small text-paper-dim">
              Không biết gặp ai trước?
            </p>
            <a
              href={`tel:${lienHe.hotline.replace(/\s/g, "")}`}
              data-do="goi"
              data-do-chi-tiet="hotline-chung"
              className="link-underline tabular inline-flex min-h-11 items-center font-display text-h3 text-jade"
            >
              {lienHe.hotline}
            </a>
          </div>
        ) : null}
      </Khung>
    </section>
  );
}

function TheNguoi({
  nguoi,
  rong,
}: {
  nguoi: (typeof doiNguTuVan)[number];
  /** Bố cục trải ngang, dùng khi chỉ có một người. */
  rong?: boolean;
}) {
  const soZalo = (nguoi.zalo ?? nguoi.dienThoai).replace(/\D/g, "");
  const coSo = nguoi.dienThoai.trim().length > 0;

  return (
    <article className={rong ? "border-t border-ink-line pt-10" : undefined}>
      {/*
        ═══════════════════════════════════════════════════════════════════
        KHÔNG CÓ Ô ẢNH KHI CHƯA CÓ ẢNH — và đây là thay đổi có chủ ý.

        Bản trước, thiếu ảnh thì dựng một ô cao bằng ba phần tư bề ngang, in
        chữ cái đầu của tên vào giữa. Ý định là "vẫn tử tế, không vỡ bố cục".
        Nhưng nhìn lại thì thứ người xem thấy là một ô xám to đùng có chữ G —
        dấu hiệu quen thuộc của một trang chưa làm xong. Trên một trang bán
        căn nhiều tỷ, đó là điều tệ nhất mảng "người tư vấn" có thể nói.

        Bản này bỏ hẳn ô ảnh. Còn lại là một khối chữ có tên, có chức danh,
        có lời của chính người đó và có số gọi được — đọc ra như một trang
        hồ sơ, không như một chỗ trống chờ ảnh.

        CÓ ẢNH THẬT thì thêm lại `nguoi.anh` và dựng khung ảnh; đừng thêm ảnh
        stock hay ảnh chân dung mua sẵn. Ảnh giả bị nhận ra nhanh hơn nhiều so
        với người ta tưởng, và nhận ra một lần là mất niềm tin ở mọi chỗ khác.
        ═══════════════════════════════════════════════════════════════════
      */}
      <h3
        className={`font-display font-normal ${rong ? "text-display" : "text-h2"}`}
      >
        {nguoi.ten}
      </h3>
      <p className="mt-2 text-label uppercase text-jade">{nguoi.chucDanh}</p>

      {nguoi.gioiThieu ? (
        <p
          className={`mt-6 max-w-[58ch] leading-relaxed text-paper-dim ${
            rong ? "text-lead" : "text-body"
          }`}
        >
          {nguoi.gioiThieu}
        </p>
      ) : null}

      {nguoi.cauChot ? (
        <p className="mt-6 max-w-[58ch] border-l border-jade/40 pl-5 text-body leading-relaxed text-paper">
          {nguoi.cauChot}
        </p>
      ) : null}

      {/* Số điện thoại hiện NGUYÊN VĂN chứ không giấu sau chữ "Gọi ngay". Người
          mua nhà tiền tỷ hay chép số ra rồi gọi bằng máy khác, hoặc lưu lại gọi
          sau — giấu số là bắt họ bấm thêm một bước cho mỗi việc đó.

          CHƯA CÓ SỐ thì KHÔNG dựng nút gọi, chỉ dẫn sang trang liên hệ. Một nút
          gọi trỏ tới `tel:` rỗng trên điện thoại sẽ mở ứng dụng gọi với số
          trắng — người dùng tưởng máy mình hỏng. */}
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
        {coSo ? (
          <>
            <a
              href={`tel:${nguoi.dienThoai.replace(/\s/g, "")}`}
              data-do="goi"
              data-do-chi-tiet={nguoi.ten}
              className="nut nut-chinh"
            >
              Gọi {nguoi.ten} — {nguoi.dienThoai}
            </a>
            <a
              href={`https://zalo.me/${soZalo}`}
              data-do="zalo"
              data-do-chi-tiet={nguoi.ten}
              target="_blank"
              rel="noreferrer"
              className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-paper-dim"
            >
              Nhắn Zalo
            </a>
          </>
        ) : (
          <Link href="/lien-he" className="nut nut-chinh">
            Gửi yêu cầu tư vấn
          </Link>
        )}
        <Link
          href="/lien-he"
          className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
        >
          Gửi phương án tôi đang cân nhắc
        </Link>
      </div>
    </article>
  );
}
