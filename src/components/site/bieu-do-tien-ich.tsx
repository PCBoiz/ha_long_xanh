import { hangMucTienIch } from "@/data/project";

/**
 * Quy mô các hạng mục tiện ích, xếp từ lớn xuống nhỏ.
 *
 * Dựng theo quy trình của skill dataviz:
 *
 *  · DẠNG BIỂU ĐỒ — dữ liệu là ĐỘ LỚN của các hạng mục có tên, tên lại dài
 *    (tiếng Việt), nên thanh NGANG. Xếp giảm dần để câu chuyện tự hiện ra.
 *  · MÀU — chỉ một chuỗi số liệu, độ lớn đã do CHIỀU DÀI thanh biểu thị nên màu
 *    không mang thông tin gì. Vì vậy dùng đúng MỘT sắc, và không cần chú giải:
 *    tiêu đề đã nói thanh biểu thị cái gì. Sắc dùng ở đây (`--color-jade-bar`)
 *    là kết quả chạy `validate_palette.js` — sắc ngọc sáng của trang bị trượt
 *    hai mục (quá sáng và độ bão hoà thấp tới mức "đọc ra thành xám").
 *  · NHÃN — dán thẳng số lên từng thanh. Chênh lệch tới 164 lần nên thanh nhỏ
 *    nhất chỉ còn vài điểm ảnh; không dán số thì nó thành vô nghĩa.
 *  · KHẢ DỤNG — bản thân biểu đồ LÀ một bảng ngữ nghĩa. Trình đọc màn hình nhận
 *    được số liệu thật, người nhìn được thanh; không cần dựng hai thứ song song
 *    rồi lo chúng lệch nhau.
 *
 * Chữ luôn mang màu chữ, không mang màu của thanh — đây là quy tắc bắt buộc
 * trong skill, để màu chỉ nói một chuyện duy nhất.
 */

/**
 * Sắc của thanh — ĐỌC TỪ TOKEN, không viết hex ở đây.
 *
 * Hằng số hex nằm rải trong mã là cách một bảng màu nhất quán bị bào mòn: qua
 * vài lượt sửa, trang có tám màu thay vì bốn và không ai còn biết màu nào thuộc
 * về hệ. Giá trị thật khai ở `--color-jade-bar` trong `globals.css`.
 */
const MAU_THANH = "var(--color-jade-bar)";
/** Thanh mảnh nhất vẫn phải thấy được: 950ha so với 5,8ha là chênh 164 lần. */
const BE_RONG_TOI_THIEU = 0.6;

export function BieuDoTienIch() {
  const sapXep = [...hangMucTienIch].sort((a, b) => b.dienTich - a.dienTich);
  const lonNhat = sapXep[0]?.dienTich ?? 1;

  return (
    <figure>
      {/* `max-w-[68ch]`: đo được dòng này dài 103 ký tự ở khổ 1440px. Quá
          khoảng 75 thì mắt hay bắt nhầm dòng khi xuống hàng. */}
      <figcaption className="max-w-[68ch] text-small text-paper-dim">
        Diện tích các hạng mục tiện ích, đơn vị hecta. Số liệu công bố trên sơ đồ
        tổng mặt bằng của chủ đầu tư.
      </figcaption>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <caption className="sr-only">
            Quy mô các hạng mục tiện ích, xếp từ lớn đến nhỏ
          </caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Hạng mục</th>
              <th scope="col">Diện tích (ha)</th>
            </tr>
          </thead>
          <tbody>
            {sapXep.map((muc) => {
              const tyLe = Math.max(
                BE_RONG_TOI_THIEU,
                (muc.dienTich / lonNhat) * 100,
              );
              return (
                <tr key={muc.ten} className="border-b border-ink-line/50">
                  <th
                    scope="row"
                    className="w-[15rem] py-4 pr-6 text-left align-middle font-normal"
                  >
                    <span className="block text-sm leading-snug">{muc.ten}</span>
                    {muc.danhXung ? (
                      <span className="mt-1 block text-xs text-paper-dim">
                        {muc.danhXung}
                      </span>
                    ) : null}
                  </th>

                  <td className="py-4 align-middle">
                    <div className="flex items-center gap-4">
                      {/* Thanh: mảnh, bo tròn đầu mút, neo vào mép trái. */}
                      <div className="h-2.5 flex-1">
                        <div
                          title={`${muc.ten}: ${muc.dienTich} ha`}
                          style={{
                            width: `${tyLe}%`,
                            backgroundColor: MAU_THANH,
                          }}
                          className="h-full rounded-r-[4px]"
                        />
                      </div>
                      {/* Số dán thẳng, dùng màu chữ chứ không dùng màu thanh. */}
                      <span className="tabular w-24 shrink-0 text-right text-sm text-paper">
                        {muc.dienTich.toLocaleString("vi-VN")} ha
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
