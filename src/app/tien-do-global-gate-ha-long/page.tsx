import type { Metadata } from "next";
import Link from "next/link";
import { CapNhatTienDo } from "@/components/site/cap-nhat-tien-do";
import { Khung } from "@/components/ui/khung";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { ProjectImage } from "@/components/ui/project-image";
import { duAn, taiLieu, duongDanDrive, dotAnhTienDo } from "@/data/project";
import { projectImages } from "@/data/images.generated";
import quyCan from "@/data/quy-can.generated.json";
import { gioNgayVN } from "@/lib/thoi-gian";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-do-global-gate-ha-long" },
  title: `Tiến độ thi công ${dotAnhTienDo.nhan}`,
  description: `Hiện trạng công trường ${duAn.tenNgan} qua ${dotAnhTienDo.soTam} ảnh chụp thật ${dotAnhTienDo.nhan} do chủ đầu tư phát hành — san nền, hạ tầng, công trình đang lên tầng và tuyến giao thông kết nối. Kèm cách tự kiểm trước khi xuống tiền.`,
};

/**
 * Ảnh hiện trạng, xếp theo CÂU HỎI mà mỗi nhóm trả lời.
 *
 * Đổ cả mười hai tấm vào một lưới thì người xem cuộn qua và chỉ nhận được cảm
 * giác "có nhiều ảnh". Chia thành bốn nhóm, mỗi nhóm một câu hỏi, thì cùng bộ
 * ảnh đó trả lời được bốn thứ khác nhau — và người mua biết mình đang nhìn cái
 * gì thay vì nhìn phong cảnh.
 *
 * Thứ tự nhóm đi từ xa tới gần, đúng thứ tự người mua quan tâm: quy mô chung
 * trước, rồi hạ tầng nơi mình sẽ ở, rồi nhà, cuối cùng là đường đi lại.
 */
const NHOM_ANH = [
  {
    tieuDe: "Quy mô hiện tại",
    hoi: "Phần đất đã hình thành tới đâu",
    anh: [
      "tien-do-0826-toan-canh-vinh",
      "tien-do-0826-toan-canh-khu-o",
      "tien-do-0826-san-lap-bien",
    ],
  },
  {
    tieuDe: "Hạ tầng và san nền",
    hoi: "Đường, lô đất và cảnh quan đã xong chưa",
    anh: [
      "tien-do-0826-ha-tang-hoan-thien",
      "tien-do-0826-san-nen-phan-lo",
      "tien-do-0826-duong-truc-ban-dao",
    ],
  },
  {
    tieuDe: "Công trình đang xây",
    hoi: "Nhà đã lên tới tầng mấy",
    anh: [
      "tien-do-0826-len-tang",
      "tien-do-0826-cong-trinh-mat-duong",
      "tien-do-0826-dai-lo-cay-xanh",
      "tien-do-0826-khu-thuong-mai",
    ],
  },
  {
    tieuDe: "Giao thông kết nối",
    hoi: "Đường vào khu đang làm tới đâu",
    anh: ["tien-do-0826-cau-vuot-cao-toc", "tien-do-0826-coc-khoan-nhoi"],
  },
] as const;

/**
 * Trang tiến độ thi công.
 *
 * ⚠️ TRANG NÀY KHÔNG ĐĂNG MỐC BÀN GIAO. Chủ đầu tư chưa công bố, và một mốc
 * bàn giao sai là thứ người mua dùng để tính dòng tiền — sai ở đó thì hỏng cả
 * kế hoạch tài chính của họ, không phải chỉ hỏng một dòng chữ.
 *
 * Thay vào đó trang làm ba việc đọc được ngay: dẫn tới ảnh và video hiện trạng
 * do chủ đầu tư phát hành, chỉ ra bằng chứng tiến độ mà chính bảng hàng để lộ
 * ra, và dạy cách tự kiểm khi đi thực địa.
 *
 * BẰNG CHỨNG TỪ BẢNG HÀNG là phần đáng chú ý nhất: tiêu chuẩn bàn giao của các
 * căn đang bán nói lên tiến độ thật hơn bất kỳ tấm ảnh nào. Có căn ở mức hoàn
 * thiện nghĩa là đã có phần nào của khu đó xây xong thật.
 */
export default function TrangTienDo() {
  const video = taiLieu.find((t) => t.ten === "Tiến độ thi công");
  const hoanThien = quyCan.theoBanGiao.find((b) => b.ten.includes("hoàn thiện"));
  const gianXay = quyCan.theoBanGiao.find((b) => b.ten.includes("giãn"));
  const capNhat = new Date(quyCan.docLuc);

  return (
    <>
      <section className="pb-nhip pt-36 md:pt-44">
        <Khung>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text="Công trường *đang tới đâu*" />
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <ClipReveal delay={120}>
                <p className="text-body leading-relaxed text-paper-dim">
                  {duAn.tinhTrang}. Trang này không đăng mốc bàn giao vì chủ đầu
                  tư chưa công bố — thay vào đó là những bằng chứng tiến độ kiểm
                  được ngay hôm nay.
                </p>
              </ClipReveal>
            </div>
          </div>
        </Khung>
      </section>

      {/* ẢNH MỞ ĐẦU LÀ ẢNH CHỤP THẬT, KHÔNG PHẢI PHỐI CẢNH — và ở đúng trang
          này thì đó là cả sự khác biệt. Một trang nói về tiến độ mà mở bằng
          tranh vẽ thì đã tự phủ nhận mình ngay dòng đầu. */}
      <section className="px-2 pb-nhip">
        <ClipReveal>
          <ProjectImage
            name="tien-do-0826-toan-canh-vinh"
            sizes="100vw"
            className="h-[46vh] w-full object-cover md:h-[60vh]"
          />
        </ClipReveal>
      </section>

      {/* ═══════ BẰNG CHỨNG TỪ CHÍNH BẢNG HÀNG ═══════
          Đây là góc không trang nào khác có, vì nó đòi phải cầm bảng hàng thật.
          Tiêu chuẩn bàn giao của các căn đang bán là chỉ dấu tiến độ đáng tin
          hơn ảnh — ảnh chọn được góc đẹp, còn một căn ghi "hoàn thiện" trong
          bảng hàng thì nghĩa là nó đã xây xong thật. */}
      <section className="mang-sang py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h2 font-normal text-balance">
                Bằng chứng nằm ngay trong bảng hàng
              </h2>
              <p className="mt-5 max-w-md text-body leading-relaxed text-paper-dim">
                Ảnh chọn được góc đẹp. Bảng hàng thì không — tiêu chuẩn bàn giao
                của từng căn đang bán cho biết phần nào của khu đã thật sự xây
                tới đâu.
              </p>
              <p className="tabular mt-5 text-small text-paper-dim">
                Đọc lúc {gioNgayVN(capNhat)}
              </p>
            </div>

            <dl className="md:col-span-6 md:col-start-7">
              {quyCan.theoBanGiao.map((b) => (
                <div
                  key={b.ten}
                  className="flex items-baseline justify-between gap-6 border-b border-ink-line py-5"
                >
                  <dt className="text-h4 capitalize">Bàn giao {b.ten}</dt>
                  <dd className="tabular font-display text-h2 text-jade">
                    {b.so}
                  </dd>
                </div>
              ))}
              <p className="mt-6 max-w-[62ch] text-small leading-relaxed text-paper-dim">
                {hoanThien
                  ? `Có ${hoanThien.so} căn ở mức hoàn thiện — nghĩa là phần đó đã xây xong và bàn giao được. `
                  : ""}
                {gianXay
                  ? `${gianXay.so} căn ở mức giãn xây, tức đã xong phần thô và đang trong giai đoạn hoàn thiện dần. `
                  : ""}
                Số căn ở mỗi mức đổi theo thời gian, và chiều đổi của nó chính là
                tốc độ thi công thật.
              </p>
            </dl>
          </div>
        </Khung>
      </section>

      {/* ═══════════════════ ẢNH HIỆN TRẠNG THÁNG 08/2026 ═══════════════════
          ⚠️ GIỮ NGUYÊN DÒNG CHỮ CHÌM TRÊN ẢNH. Chủ đầu tư nung sẵn "Tiến độ dự
          án … THÁNG 08/2026" vào góc mỗi tấm. Cắt đi thì ảnh đẹp hơn một chút
          và mất sạch giá trị: đúng cái dòng đó biến một tấm phong cảnh thành
          một chứng từ có ngày tháng và có người chịu trách nhiệm.

          Đây cũng là mảng duy nhất trên cả trang dùng ảnh CHỤP chứ không phải
          ảnh dựng. Tám trang đại lý khác cùng bán dự án này đều chỉ có phối
          cảnh — thứ vẽ ra một tương lai chưa tồn tại, và giống hệt nhau vì lấy
          chung một thư mục. */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display text-h1 font-normal text-balance">
                <SplitReveal text={`Ảnh chụp *${dotAnhTienDo.nhan}*`} />
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 md:self-end">
              <p className="text-body leading-relaxed text-paper-dim">
                {dotAnhTienDo.soTam} tấm do chủ đầu tư phát hành, có dấu thời
                gian in trên ảnh. Đây là hiện trạng, không phải phối cảnh — có cả những phần
                đất còn đang san và những ô chưa có gì.
              </p>
            </div>
          </div>

          <div className="mt-14 space-y-14 md:mt-20 md:space-y-20">
            {NHOM_ANH.map((nhom) => (
              <section key={nhom.tieuDe}>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-ink-line pb-4">
                  <h3 className="font-display text-h3 font-normal">
                    {nhom.tieuDe}
                  </h3>
                  <p className="text-small text-paper-dim">{nhom.hoi}</p>
                </div>

                {/* Một cột trên di động. Ảnh không ảnh nào rộng dưới 1.400px và
                    chi tiết cần nhìn — giàn cọc, số tầng, mặt đường — biến mất
                    hết khi ép vào nửa màn hình điện thoại. */}
                <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2">
                  {nhom.anh.map((ten) => (
                    <li key={ten}>
                      <figure>
                        <ClipReveal>
                          <ProjectImage
                            name={ten}
                            sizes="(min-width: 640px) 46vw, 92vw"
                            className="aspect-3/2 w-full object-cover"
                          />
                        </ClipReveal>
                        <figcaption className="mt-3 text-small leading-relaxed text-paper-dim">
                          {projectImages[ten].alt}
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Khung>
      </section>

      {/* ═══════ VIDEO VÀ ẢNH DO CHỦ ĐẦU TƯ PHÁT HÀNH ═══════
          KHÔNG nhúng video vào trang. Bộ video hiện trạng nặng hàng chục tới
          hàng trăm MB; nhúng vào sẽ phá tốc độ tải mà phần lớn khách không xem
          hết. Dẫn sang thư mục gốc là cách trung thực và nhanh hơn. */}
      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-display text-h1 font-normal text-balance">
                Video và ảnh hiện trạng
              </h2>
              <p className="mt-6 max-w-md text-body leading-relaxed text-paper-dim">
                Do chủ đầu tư quay và phát hành, cập nhật theo đợt. Mở trực tiếp,
                không cần để lại thông tin.
              </p>
              {video ? (
                <a
                  href={duongDanDrive(video)}
                  target="_blank"
                  rel="noreferrer"
                  data-do="tai-lieu"
                  data-do-chi-tiet="Tiến độ thi công"
                  className="nut nut-chinh mt-8"
                >
                  Mở thư mục tiến độ
                </a>
              ) : null}
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <p className="text-label uppercase text-jade">
                Khi xem, chú ý ba điều
              </p>
              <ul className="mt-5">
                {[
                  "Ngày quay, không phải ngày đăng. Một video mới đăng vẫn có thể quay từ nhiều tháng trước.",
                  "Phân khu nào đang được quay. Một dự án hơn sáu nghìn hecta triển khai theo giai đoạn, và tiến độ giữa các khu chênh nhau rất xa.",
                  "Hạ tầng dùng chung — đường, điện, nước, cây xanh — chứ không chỉ nhà. Nhà xong trước hạ tầng thì vẫn chưa ở được.",
                ].map((c) => (
                  <li
                    key={c}
                    className="border-b border-ink-line py-4 text-body leading-relaxed text-paper-dim"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Khung>
      </section>

      {/* Bản tin tiến độ do đường ống Antigravity đẩy sang, đã qua duyệt.
          Đặt SAU ảnh và video, TRƯỚC lời mời đi thực địa: khách vừa xem hiện
          trạng xong thì câu hỏi kế tiếp luôn là "gần đây có gì mới", và câu
          trả lời đó nên đứng ngay trước lời mời. */}
      <CapNhatTienDo />

      <section className="border-t border-ink-line py-nhip">
        <Khung>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display text-h2 font-normal text-balance">
                Đi thực địa vẫn là cách kiểm chắc nhất
              </h2>
              <p className="mt-5 max-w-lg text-body leading-relaxed text-paper-dim">
                Không có video nào thay được việc đứng tại lô đất mình sắp mua.
                Nếu bạn sắp xếp được thời gian, chúng tôi đi cùng và chỉ tận nơi
                những điểm mà ảnh không cho thấy — hướng nắng chiều, khoảng cách
                thật tới đường lớn, hiện trạng hạ tầng quanh lô.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link href="/lien-he" className="nut nut-chinh">
                  Hẹn đi thực địa
                </Link>
                <Link
                  href="/quy-can-global-gate-ha-long"
                  className="link-underline inline-flex min-h-11 items-center text-nav uppercase text-jade"
                >
                  Xem quỹ căn trước
                </Link>
              </div>
            </div>
          </div>
        </Khung>
      </section>
    </>
  );
}
