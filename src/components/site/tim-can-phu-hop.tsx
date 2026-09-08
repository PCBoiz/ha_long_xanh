"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Khung } from "@/components/ui/khung";
import { ghiSuKien } from "@/lib/do-luong";
import { dongSanPham } from "@/data/project";

/**
 * Bộ gợi ý dòng sản phẩm theo nhu cầu.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ĐIỀU QUAN TRỌNG NHẤT VỀ THÀNH PHẦN NÀY: nó chỉ được dùng những gì CÓ THẬT
 * trong `data/project.ts`.
 *
 * Cám dỗ ở đây rất lớn — một bộ chọn căn sẽ hay hơn nhiều nếu biết căn nào gần
 * biển, căn nào gần sân golf, dòng nào giá bao nhiêu. Nhưng những dữ liệu đó
 * chưa có, và bịa ra thì thành tệ hơn không có: khách được máy khẳng định một
 * đằng, gọi lên tư vấn nghe một nẻo, và mất niềm tin đúng vào lúc họ đang
 * nghiêm túc nhất.
 *
 * Nên bộ chọn này chấm điểm HOÀN TOÀN dựa trên hai thứ đã xác nhận:
 * `moTa` (do chủ đầu tư mô tả) và `dienTich` (đọc từ bộ bản vẽ mặt bằng).
 *
 * Sự dè dặt đó nằm ở CHỖ CHẤM ĐIỂM, không nằm ở câu chữ. Trước đây còn một
 * đoạn nói thêm rằng kết quả "không phải lời khuyên chốt" — đã bỏ. Nó rào đón
 * cho một thứ chưa ai trách, và người đang cân nhắc mua nhà không cần được
 * nhắc rằng ba cái nút bấm thì không quyết thay họ được.
 *
 * Điều đáng nói thì vẫn ở lại, ngay dưới kết quả: quỹ căn đổi từng ngày nên
 * phải hỏi lại. Đó là thông tin, không phải lời xin lỗi.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * VÌ SAO ĐÁNG LÀM DÙ DỮ LIỆU CÒN MỎNG: nó đổi bản chất của lượt để lại số. Một
 * biểu mẫu trống chỉ thu được tên và số điện thoại; đi qua ba câu hỏi này rồi
 * mới bấm liên hệ thì người tư vấn biết trước khách muốn ở hay đầu tư, cần bao
 * nhiêu không gian, ưu tiên điều gì — cuộc gọi đầu tiên bắt đầu từ câu thứ tư
 * thay vì câu thứ nhất.
 */

type MaDong = (typeof dongSanPham)[number]["ma"];

interface LuaChon {
  ma: string;
  nhan: string;
  /** Điểm cộng cho từng dòng sản phẩm khi chọn phương án này. */
  diem: Partial<Record<MaDong, number>>;
}

interface CauHoi {
  ma: string;
  hoi: string;
  chon: LuaChon[];
}

/*
 * Bảng điểm.
 *
 * Mỗi điểm dưới đây phải truy được về một câu trong `moTa` hoặc một con số
 * trong `dienTich`. Ghi lý do ngay cạnh để lần sau ai sửa cũng phải nêu được
 * căn cứ, thay vì chỉnh cho ra kết quả mình muốn.
 */
const CAU_HOI: CauHoi[] = [
  {
    ma: "mucDich",
    // ⚠️ CÂU HỎI NÀY TỪNG LÀ "Bạn mua để làm gì?". ĐÃ ĐỔI, ĐỪNG QUAY LẠI.
    //
    // Nó hỏi thẳng vào ĐỘNG CƠ, và buộc người đọc tự xếp mình vào một phe: ở
    // hay đầu tư. Định vị đã chốt không dựng ranh giới đó — nó nói mua để ở,
    // và căn đó vẫn giữ giá trị. Hỏi kiểu cũ là dựng lại đúng cái ranh giới
    // vừa bỏ đi, ngay ở khối nằm giữa trang chủ.
    //
    // Câu mới hỏi CÁCH DÙNG chứ không hỏi động cơ. Trả lời được ngay mà không
    // phải khai mình thuộc loại khách nào.
    //
    // BẢNG ĐIỂM BÊN DƯỚI KHÔNG ĐỔI: mã `ma` của từng lựa chọn giữ nguyên nên
    // kết quả gợi ý ra y hệt. Chỉ chữ hiển thị đổi.
    hoi: "Căn này sẽ dùng thế nào?",
    chon: [
      {
        ma: "o",
        nhan: "Gia đình ở",
        // Ba dòng biệt thự đều mô tả không gian sống; liền kề mô tả "vừa ở vừa
        // kinh doanh" nên vẫn tính nhưng thấp hơn.
        diem: { "song-lap": 2, "don-lap": 2, "biet-thu-bien": 1, "lien-ke": 1 },
      },
      {
        ma: "kinhDoanh",
        nhan: "Vừa ở vừa kinh doanh",
        // "Dãy phố thương mại và nhà ở liền kề, phù hợp vừa ở vừa kinh doanh"
        // là mô tả của đúng một dòng.
        diem: { "lien-ke": 3 },
      },
      {
        ma: "taiSan",
        // "Giữ tài sản dài hạn" đọc ra như một lựa chọn ĐẦU TƯ, tách khỏi việc
        // ở. Nhãn mới gộp cả hai đúng như định vị: ở hôm nay, giữ giá trị ngày
        // mai.
        nhan: "Ở, và giữ giá trị lâu dài",
        // Dòng giới hạn và tầm nhìn trực diện ra vịnh là hai đặc điểm không
        // tạo thêm được — cơ sở duy nhất mà dữ liệu hiện có cho phép dùng.
        diem: { "biet-thu-bien": 3, "don-lap": 2 },
      },
      {
        ma: "choThue",
        nhan: "Cho thuê hoặc khai thác",
        diem: { "can-ho": 3, "lien-ke": 2 },
      },
    ],
  },
  {
    ma: "khongGian",
    hoi: "Cần bao nhiêu không gian?",
    chon: [
      {
        ma: "gonNhe",
        nhan: "Gọn nhẹ, ít phải chăm sóc",
        // Căn hộ nằm trong quần thể có đơn vị vận hành; liền kề là dòng có
        // diện tích nhỏ nhất đã xác nhận (60 m²).
        diem: { "can-ho": 3, "lien-ke": 2 },
      },
      {
        ma: "vua",
        nhan: "Vừa đủ cho một gia đình",
        // 162 – 183 m², có sân vườn ba mặt.
        diem: { "song-lap": 3, "lien-ke": 1, "don-lap": 1 },
      },
      {
        ma: "rong",
        nhan: "Rộng, nhiều thế hệ cùng ở",
        // Đơn lập bốn mặt thoáng; biệt thự biển 1.029 – 1.053 m².
        diem: { "don-lap": 3, "biet-thu-bien": 2 },
      },
    ],
  },
  {
    ma: "uuTien",
    hoi: "Điều gì quan trọng nhất với bạn?",
    chon: [
      {
        ma: "riengTu",
        nhan: "Riêng tư",
        // "Đứng độc lập trên lô đất riêng, bốn mặt thoáng."
        diem: { "don-lap": 3, "biet-thu-bien": 2, "song-lap": 1 },
      },
      {
        ma: "tamNhin",
        nhan: "Tầm nhìn ra vịnh",
        // "Tầm nhìn trực diện ra vịnh" / "hướng vịnh và công viên trung tâm".
        diem: { "biet-thu-bien": 3, "can-ho": 2 },
      },
      {
        ma: "matPho",
        nhan: "Mặt phố, tiện đi lại",
        diem: { "lien-ke": 3 },
      },
      {
        ma: "sanVuon",
        nhan: "Có sân vườn riêng",
        // "giữ được sân vườn riêng ở ba mặt".
        diem: { "song-lap": 3, "don-lap": 2 },
      },
    ],
  },
];

export function TimCanPhuHop() {
  const [traLoi, datTraLoi] = useState<Record<string, string>>({});
  const daTraLoiHet = CAU_HOI.every((c) => traLoi[c.ma]);

  // Cộng điểm theo các câu ĐÃ trả lời. Không đợi trả lời hết mới tính: gợi ý
  // hiện dần theo từng lựa chọn cho người dùng thấy máy đang phản hồi mình.
  const bangDiem = new Map<string, number>();
  for (const cau of CAU_HOI) {
    const chon = cau.chon.find((c) => c.ma === traLoi[cau.ma]);
    if (!chon) continue;
    // `Partial<Record<…>>` nên `Object.entries` trả kiểu có thể `undefined` —
    // đúng về kiểu, vì khoá có mặt mà giá trị bị xoá là một trạng thái hợp lệ.
    for (const [ma, diem] of Object.entries(chon.diem)) {
      if (diem === undefined) continue;
      bangDiem.set(ma, (bangDiem.get(ma) ?? 0) + diem);
    }
  }

  const xepHang = [...bangDiem.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([ma]) => dongSanPham.find((d) => d.ma === ma))
    .filter((d): d is (typeof dongSanPham)[number] => Boolean(d));

  const dauBang = xepHang[0];
  const keTiep = xepHang.slice(1, 3);

  // Đếm khi trả lời ĐỦ ba câu, kèm dòng được gợi ý.
  //
  // Đây là số liệu đáng giá nhất mà bộ chọn này sinh ra: sau vài trăm lượt, nó
  // nói cho biết khách vào trang thật sự đang tìm dòng nào — thông tin mà hiện
  // giờ không có cách nào khác để biết, và nó chi phối cả việc chạy quảng cáo
  // lẫn việc ưu tiên xin quỹ căn của dòng nào trước.
  const daGhi = useRef(false);
  useEffect(() => {
    if (!daTraLoiHet || daGhi.current) return;
    daGhi.current = true;
    ghiSuKien("tim-can", dauBang?.ten);
  }, [daTraLoiHet, dauBang?.ten]);

  return (
    <section
      id="tim-can"
      className="scroll-mt-24 border-t border-ink-line py-nhip"
    >
      <Khung>
        {/* TIÊU ĐỀ LÀ LỜI MỜI, KHÔNG PHẢI NHÃN DÁN — và nó ăn luôn phần chú
            thích cũ.

            Bản trước: tiêu đề "Dòng nào hợp với bạn" (một câu hỏi bâng quơ,
            không bảo người đọc làm gì), cộng một đoạn bên phải: "Ba câu hỏi,
            không cần để lại thông tin. Kết quả là điểm khởi đầu để nói chuyện,
            không phải lời khuyên chốt."

            Vế sau của đoạn đó là kiểu rào đón đọc lên là thấy máy viết: nó
            xin lỗi trước cho một thứ chưa ai trách. Người đang cân nhắc mua
            nhà không cần được nhắc rằng ba cái nút bấm không phải lời khuyên
            chốt — họ biết rồi.

            Vế trước thì CÓ giá trị: "ba câu" cho biết mất bao lâu. Nên chuyển
            nó vào tiêu đề. Giờ tiêu đề vừa là mệnh lệnh, vừa nói cái giá phải
            trả, vừa nói được gì — và đoạn văn kia không mất thông tin nào khi
            bị xoá, nó chỉ mất phần rào đón. */}
        {/* ⚠️ TIÊU ĐỀ NÀY TỪNG LÀ MỘT MỆNH LỆNH. ĐỪNG ĐỔI NGƯỢC LẠI.

            Bản cũ: "Trả lời ba câu, xem dòng nào hợp". Lập luận lúc viết là
            "ba câu" cho người đọc biết mất bao lâu — vế đó đúng và vẫn giữ.
            Cái sai nằm ở động từ đầu câu: nó SAI VIỆC người đọc.

            Người sắp chuyển vài tỷ không mở trang này để được giao bài. Một
            câu mở đầu bằng mệnh lệnh biến quan hệ tư vấn thành quan hệ
            hướng dẫn — cùng loại sai giọng với những thẻ hỏi hộ rồi đáp hộ
            đã bị gỡ ở khối trên.

            Bản mới nêu một NGUYÊN TẮC thay vì ra lệnh, đúng mạch với hai
            tiêu đề mạnh nhất trang: "Một đô thị, không phải một khu nhà" và
            "Mua đúng căn quan trọng hơn mua nhanh". Nó cũng tự giải thích vì
            sao khối này tồn tại, việc mà câu mệnh lệnh không làm được.

            "Ba câu" chuyển xuống dòng phụ, kèm một lời hứa có giá trị thật:
            KHÔNG hỏi ngân sách. Đó là câu khách ngại nhất khi vào một trang
            bán nhà, và nói trước thì bớt được đúng nỗi ngại ấy. */}
        <h2 className="max-w-[26ch] font-display text-h1 font-normal text-balance">
          Không phải ai cũng hợp cùng một dòng
        </h2>
        <p className="mt-4 max-w-md text-body text-paper-dim">
          Ba câu, không hỏi ngân sách.
        </p>

        <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-12">
          <div className="flex flex-col gap-9 md:col-span-7">
            {CAU_HOI.map((cau) => (
              // `fieldset` + `legend` chứ không phải `div` + `p`: trình đọc màn
              // hình đọc lại câu hỏi mỗi lần chuyển giữa các phương án, nên
              // người dùng không mất ngữ cảnh giữa chừng.
              <fieldset key={cau.ma} className="border-t border-ink-line pt-6">
                <legend className="font-display text-h3 font-normal">
                  {cau.hoi}
                </legend>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {cau.chon.map((c) => {
                    const dangChon = traLoi[cau.ma] === c.ma;
                    return (
                      <label
                        key={c.ma}
                        className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-small transition-colors ${
                          dangChon
                            ? "border-jade bg-jade/12 text-jade"
                            : "border-ink-line text-paper-dim hover:border-paper/45 hover:text-paper"
                        }`}
                      >
                        {/* Ô chọn thật nằm dưới, chỉ ẩn về mặt hình ảnh. Dựng
                            bằng `div` có `onClick` thì bàn phím không tới được
                            và trình đọc màn hình không biết đây là một nhóm
                            chọn một. */}
                        <input
                          type="radio"
                          name={cau.ma}
                          value={c.ma}
                          checked={dangChon}
                          onChange={() =>
                            datTraLoi((truoc) => ({
                              ...truoc,
                              [cau.ma]: c.ma,
                            }))
                          }
                          className="sr-only"
                        />
                        {c.nhan}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {/* Ô kết quả. `aria-live` để người dùng bàn phím và trình đọc màn hình
              biết có nội dung mới xuất hiện — không có nó thì gợi ý đổi trong
              im lặng và chỉ người nhìn thấy được. */}
          <div className="md:col-span-4 md:col-start-9" aria-live="polite">
            {dauBang ? (
              <div className="border-t border-jade pt-6">
                <p className="text-label uppercase text-jade">
                  {daTraLoiHet ? "Gợi ý cho bạn" : "Đang nghiêng về"}
                </p>
                <p className="mt-3 font-display text-h2 font-normal">
                  {dauBang.ten}
                </p>
                <p className="mt-3 text-small leading-relaxed text-paper-dim">
                  {dauBang.moTa}
                </p>
                {dauBang.dienTich ? (
                  <p className="tabular mt-3 text-small text-paper-dim">
                    Diện tích {dauBang.dienTich} m²
                  </p>
                ) : null}

                <Link
                  href={`/san-pham/${dauBang.ma}`}
                  className="nut nut-chinh mt-7"
                >
                  Xem dòng này
                </Link>

                {keTiep.length > 0 ? (
                  <div className="mt-8 border-t border-ink-line pt-5">
                    <p className="text-label uppercase text-paper-dim">
                      Cũng đáng xem
                    </p>
                    <ul className="mt-3 flex flex-col">
                      {keTiep.map((d) => (
                        <li key={d.ma}>
                          <Link
                            href={`/san-pham/${d.ma}`}
                            className="link-underline flex min-h-11 items-center text-small text-paper/80"
                          >
                            {d.ten}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* GIỮ CÂU NÀY, NHƯNG BỎ PHẦN RÀO ĐÓN Ở ĐẦU.
                    Bản trước mở bằng "Gợi ý này dựa trên mô tả và diện tích do
                    chủ đầu tư công bố" — một câu tự hạ thấp mình trước khi nói
                    điều đáng nói. Phần đáng nói là: quỹ căn đổi hằng ngày, nên
                    phải hỏi lại. Đó là thông tin thật và dẫn thẳng tới việc
                    người đọc cần làm tiếp, nên nó ở lại. */}
                {daTraLoiHet ? (
                  <p className="mt-8 border-t border-ink-line pt-5 text-small leading-relaxed text-paper-dim">
                    Căn cụ thể còn hay hết, hướng nào, giá thực trả bao nhiêu —
                    quỹ căn đổi từng ngày nên phải hỏi lại tại thời điểm bạn
                    mua.{" "}
                    <Link href="/lien-he" className="link-underline text-jade">
                      Nhờ tư vấn viên kiểm giúp
                    </Link>
                    .
                  </p>
                ) : null}
              </div>
            ) : null}
            {/* CHƯA CHỌN GÌ THÌ KHÔNG HIỆN GÌ.

                Bản trước để một ô viền ghi "Chọn một phương án ở câu đầu tiên,
                gợi ý hiện ra ngay tại đây." Câu đó không nói cho ai điều gì họ
                chưa biết: ba câu hỏi đang nằm ngay bên trái, và bấm vào là
                thấy. Nó chiếm chỗ của kết quả để giải thích cách dùng một thứ
                không cần giải thích.

                Ô kết quả xuất hiện ngay sau lựa chọn ĐẦU TIÊN (`dauBang` có
                giá trị từ lúc đó, với nhãn "Đang nghiêng về"), nên khoảng
                trống này chỉ tồn tại tới cú bấm đầu. */}
          </div>
        </div>
      </Khung>
    </section>
  );
}
