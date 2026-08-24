import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { taiLieu, duongDanDrive } from "@/data/project";

/**
 * Mảng "hồ sơ mở" ở trang chủ.
 *
 * VÌ SAO ĐƯA LÊN TRANG CHỦ: trang /tai-lieu là phần mạnh nhất của cả trang này
 * — sáu bộ hồ sơ do chủ đầu tư phát hành, mở xem trực tiếp, KHÔNG bắt để lại số
 * điện thoại trước. Với người mua tiền tỷ thì việc "cho xem trước, hỏi sau"
 * thuyết phục hơn mọi câu quảng cáo về uy tín. Nhưng nó đang nằm sau một mục
 * menu, nên phần lớn khách không bao giờ thấy.
 *
 * VÌ SAO KHÔNG DÙNG LƯỚI THẺ: trang /tai-lieu đã là lưới ba cột thẻ. Lặp lại
 * đúng hình dạng đó ở trang chủ thì thành hai lần cùng một mảng, và lưới thẻ
 * đều tăm tắp cũng là hình dạng dễ đoán nhất. Ở đây là một danh sách có kẻ
 * dòng, đặt lệch sang cột phải — đọc như mục lục hồ sơ, đúng thứ nó đang là.
 */
export function HoSoMinhBach() {
  return (
    <section className="mang-sang py-nhip">
      <Khung>
        <div className="grid gap-x-16 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-display text-h1 font-normal text-balance">
              Hồ sơ mở, xem trước khi để lại số
            </h2>
            <p className="mt-6 max-w-md text-body leading-relaxed text-paper-dim">
              Toàn bộ tài liệu dưới đây do chủ đầu tư phát hành và mở công khai.
              Không có bước đăng ký nào chắn ở giữa.
            </p>
            <Link href="/tai-lieu" className="nut nut-chinh mt-8">
              Xem toàn bộ hồ sơ
            </Link>
          </div>

          <ul className="md:col-span-6 md:col-start-7">
            {taiLieu.map((muc) => (
              <li key={muc.ten} className="border-b border-ink-line">
                <a
                  href={duongDanDrive(muc)}
                  target="_blank"
                  rel="noreferrer"
                  data-do="tai-lieu"
                  data-do-chi-tiet={muc.ten}
                  className="group flex min-h-16 items-baseline justify-between gap-6 py-4 transition-colors hover:text-jade"
                >
                  <span>
                    <span className="block text-h4">{muc.ten}</span>
                    <span className="mt-1 block text-small text-paper-dim">
                      {muc.moTa}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-nav text-paper-dim transition-colors group-hover:text-jade"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Khung>
    </section>
  );
}
